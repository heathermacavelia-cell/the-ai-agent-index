import { NextResponse } from "next/server";
import { fetchAllAgents, supabase } from "@/lib/supabase";
import { getIndustryFromSlug } from "@/lib/utils";

export const revalidate = 3600;

// Public API field list — explicit allowlist.
// Excludes: submitter_email (privacy), verified_by (internal), search_text (internal FTS).
// Includes: agent_type (added 2026-05-03 for AEO/GEO consumption).
const PUBLIC_AGENT_FIELDS = [
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
  "pros",
  "limitations",
  "output_type",
  "best_for",
  "use_cases",
  "same_as_urls",
  "mcp_compatible",
  "pricing_transparency",
  "contract_type",
  "autonomous_rate",
  "meta_title",
  "meta_description",
  "last_verified_at",
  "created_at",
  "updated_at",
].join(", ");

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categorySlug = searchParams.get("category");
  const industrySlug = searchParams.get("industry");
  const pricing = searchParams.get("pricing");
  const segment = searchParams.get("segment");

  let query = supabase.from("agents").select(PUBLIC_AGENT_FIELDS).eq("is_active", true);

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