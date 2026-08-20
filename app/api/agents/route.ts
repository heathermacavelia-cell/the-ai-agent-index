import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getIndustryFromSlug } from "@/lib/utils";
import { ratingPayload } from "@/lib/rating";
import { buildRefMap, collectTemplateSlugs, resolveTemplates, type RefMap } from "@/lib/templates";

export const revalidate = 3600;

// Full field list for unrestricted requests (existing behavior)
const FULL_FIELDS = [
  "id",
  "name",
  "slug",
  "developer",
  "website_url",
  "logo_url",
  "favicon_domain",
  "short_description",
  "long_description",
  "primary_category",
  "agent_type",
  "industry_tags",
  "capability_tags",
  "customer_segment",
 "pricing_model",
  "starting_price",
  "billing_period",
  "price_unit",
  "price_currency",
  "pricing_url",
  "deployment_method",
  "deployment_difficulty",
  "integrations",
  "supported_languages",
  "model_architecture",
  "response_accuracy",
  "avg_setup_time",
  "supported_workflows",
  "security_certifications",
  "launch_date",
  "is_featured",
  "is_verified",
  "is_active",
  "rating_avg",
  "rating_count",
  "editorial_rating",
  "editorial_rating_notes",
  "g2_rating",
  "g2_review_count",
  "github_repo_url",
  "github_stars",
  "pros",
  "limitations",
  "output_type",
  "best_for",
  "use_cases",
  "same_as_urls",
  "mcp_compatible",
  "mcp_status",
  "pricing_transparency",
  "contract_type",
  "data_training",
  "human_in_loop",
  "autonomous_rate",
  "meta_title",
  "meta_description",
  "last_verified_at",
  "created_at",
  "updated_at",
].join(", ");

// Compact field list for paginated requests (GPT actions, lightweight consumers)
// NOTE: editorial_rating_notes, rating_avg and rating_count are included so the compact
// response can build the SAME structured rating block as the full response (via shapeRating).
const COMPACT_FIELDS = [
  "name",
  "slug",
  "developer",
  "short_description",
  "primary_category",
  "agent_type",
  "pricing_model",
  "starting_price",
  "billing_period",
  "price_unit",
  "price_currency",
  "customer_segment",
  "editorial_rating",
  "editorial_rating_notes",
  "rating_avg",
  "rating_count",
  "g2_rating",
  "g2_review_count",
  "github_stars",
  "mcp_compatible",
  "mcp_status",
  "pricing_transparency",
  "best_for",
  "website_url",
].join(", ");

// --- Template rendering ---------------------------------------------------
// Listing pages resolve {{slug.starting_price}}, {{slug.name}} and
// {{github_stars}} before display. The API must do the same so machine
// consumers never receive raw placeholders.
//
// The resolver moved to lib/templates.ts on 2026-08-20. The copy that used to
// live here is the one that DISAGREED in production: it had no is_active check,
// so it resolved a real-looking price for a delisted vendor, and it printed
// "custom pricing" where the agent page printed something else for the same
// slug on the same row. That is how nectar-agent published a Brandwatch price
// for three months. Do not reintroduce a local copy.

const TEXT_FIELDS = ["short_description", "long_description", "best_for"] as const;
const ARRAY_FIELDS = ["pros", "limitations"] as const;

/** Every string on every row that could carry a template. */
function rowTexts(rows: any[]): string[] {
  const texts: string[] = [];
  for (const row of rows) {
    for (const f of TEXT_FIELDS) {
      if (typeof row[f] === "string") texts.push(row[f]);
    }
    for (const f of ARRAY_FIELDS) {
      if (Array.isArray(row[f])) {
        for (const item of row[f]) {
          if (typeof item === "string") texts.push(item);
        }
      }
    }
  }
  return texts;
}

/** Walk the same fields again, resolving through the shared resolver. */
function renderRows(rows: any[], refs: RefMap): any[] {
  return rows.map((row) => {
    const stars = typeof row.github_stars === "number" ? row.github_stars : null;
    const resolve = (text: string): string => resolveTemplates(text, refs, stars);

    const next = { ...row };
    for (const f of TEXT_FIELDS) {
      if (typeof next[f] === "string") next[f] = resolve(next[f]);
    }
    for (const f of ARRAY_FIELDS) {
      if (Array.isArray(next[f])) {
        next[f] = next[f].map((item: unknown) =>
          typeof item === "string" ? resolve(item) : item
        );
      }
    }
    return next;
  });
}

// --- Rating shaping -------------------------------------------------------
// Route every row's rating through lib/rating.ts so the API emits exactly what the UI shows:
//   - editorial_rating becomes a self-documenting object { sub_scores, total, note? } where
//     `total` is the number when scored or the string "On Our Radar" when suppressed
//     (editorial_rating < 3.0 OR IndEvid == 1). The suppressed numeric total is NEVER emitted.
//   - the raw editorial_rating_notes string (which ends "= 3.35" and would leak a suppressed
//     total) is removed; its sub-scores now live, structured, inside editorial_rating.
//   - community_rating is a SEPARATE sibling, present ONLY when real user reviews exist; the
//     raw rating_avg / rating_count top-level fields are removed.
function shapeRating(row: any): any {
  const { community, ...editorial } = ratingPayload(row);
  const next = { ...row, editorial_rating: editorial };
  if (community) next.community_rating = community;
  delete next.editorial_rating_notes;
  delete next.rating_avg;
  delete next.rating_count;
  return next;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categorySlug = searchParams.get("category");
  const industrySlug = searchParams.get("industry");
  const pricing = searchParams.get("pricing");
  const segment = searchParams.get("segment");
  const limitParam = searchParams.get("limit");
  const fullParam = searchParams.get("full");

  // Use compact fields when limit is set (unless full=true is explicitly requested)
  const useCompact = limitParam && fullParam !== "true";
  const selectFields = useCompact ? COMPACT_FIELDS : FULL_FIELDS;

  let query = supabase.from("agents").select(selectFields).eq("is_active", true);

  if (categorySlug) {
    query = query.eq("primary_category", categorySlug);
  }

  if (industrySlug) {
    const industry = getIndustryFromSlug(industrySlug);
    if (industry) {
      query = query.contains("industry_tags", [industry]);
    }
  }

  if (pricing) {
    query = query.eq("pricing_model", pricing);
  }

  if (segment) {
    query = query.eq("customer_segment", segment);
  }

  if (limitParam) {
    const parsed = parseInt(limitParam, 10);
    if (!isNaN(parsed) && parsed > 0) {
      query = query.limit(Math.min(parsed, 200));
    }
  }

  query = query.order("editorial_rating", { ascending: false, nullsFirst: false });

  const { data, error } = await query;

  if (error) {
    console.error("Error in /api/agents", error);
    return NextResponse.json(
      { error: "Failed to fetch agents" },
      {
        status: 500,
        headers: {
          "Cache-Control": "public, s-maxage=60"
        }
      }
    );
  }

  let rows = (data ?? []) as any[];

  // Resolve competitor-price and name templates with one batch lookup
  const refs = await buildRefMap(supabase, collectTemplateSlugs(rowTexts(rows)));
  rows = renderRows(rows, refs);

  // Shape every row's rating: suppression-aware total, structured sub-scores, separate
  // community block. Runs after template resolution (independent concerns).
  rows = rows.map(shapeRating);

  return NextResponse.json(rows, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, s-maxage=3600"
    }
  });
}