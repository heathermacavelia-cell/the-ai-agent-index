import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getIndustryFromSlug } from "@/lib/utils";

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
const COMPACT_FIELDS = [
  "name",
  "slug",
  "developer",
  "short_description",
  "primary_category",
  "agent_type",
  "pricing_model",
  "starting_price",
  "customer_segment",
  "editorial_rating",
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
// Listing pages resolve {{slug.starting_price}} and {{github_stars}} before
// display. The API must do the same so machine consumers never receive raw
// placeholders.

const TEXT_FIELDS = ["short_description", "long_description", "best_for"] as const;
const ARRAY_FIELDS = ["pros", "limitations"] as const;
const PRICE_VAR_REGEX = /\{\{([a-z0-9-]+)\.starting_price\}\}/g;

interface PriceInfo {
  starting_price: number | null;
  pricing_model: string | null;
}

function formatStars(stars: number): string {
  if (stars >= 1000) {
    const k = stars / 1000;
    return (k >= 100 ? Math.round(k).toString() : k.toFixed(1).replace(/\.0$/, "")) + "k";
  }
  return String(stars);
}

function collectPriceSlugs(rows: any[]): string[] {
  const slugs = new Set<string>();
  const scan = (text: string) => {
    for (const m of text.matchAll(PRICE_VAR_REGEX)) slugs.add(m[1]);
  };
  for (const row of rows) {
    for (const f of TEXT_FIELDS) {
      if (typeof row[f] === "string") scan(row[f]);
    }
    for (const f of ARRAY_FIELDS) {
      if (Array.isArray(row[f])) {
        for (const item of row[f]) {
          if (typeof item === "string") scan(item);
        }
      }
    }
  }
  return [...slugs];
}

function resolveTemplates(rows: any[], priceMap: Record<string, PriceInfo>): any[] {
  return rows.map((row) => {
    const stars = typeof row.github_stars === "number" ? row.github_stars : null;

    const resolve = (text: string): string => {
      let out = text.replace(PRICE_VAR_REGEX, (match, slug) => {
        const info = priceMap[slug];
        if (!info) return match;
        if (info.starting_price != null && info.starting_price > 0) {
          return "$" + info.starting_price + "/mo";
        }
        if (info.pricing_model === "free") return "free";
        return "custom pricing";
      });
      if (stars != null) {
        out = out.replace(/\{\{github_stars\}\}/g, formatStars(stars));
      }
      return out;
    };

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

  // Resolve competitor-price template variables with one batch lookup
  const priceSlugs = collectPriceSlugs(rows);
  const priceMap: Record<string, PriceInfo> = {};
  if (priceSlugs.length > 0) {
    const { data: priceAgents } = await supabase
      .from("agents")
      .select("slug, starting_price, pricing_model")
      .in("slug", priceSlugs);
    for (const pa of priceAgents ?? []) {
      priceMap[pa.slug] = {
        starting_price: pa.starting_price,
        pricing_model: pa.pricing_model,
      };
    }
  }
  rows = resolveTemplates(rows, priceMap);

  return NextResponse.json(rows, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, s-maxage=3600"
    }
  });
}