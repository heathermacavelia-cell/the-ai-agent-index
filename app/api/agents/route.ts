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
  "mcp_compatible",
  "pricing_transparency",
  "best_for",
  "website_url",
].join(", ");

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

  return NextResponse.json(data ?? [], {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, s-maxage=3600"
    }
  });
}