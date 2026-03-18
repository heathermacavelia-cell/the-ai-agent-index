import { NextResponse } from "next/server";
import { fetchAllAgents, supabase } from "@/lib/supabase";
import { getCategoryFromSlug, getIndustryFromSlug } from "@/lib/utils";

export const revalidate = 3600;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categorySlug = searchParams.get("category");
  const industrySlug = searchParams.get("industry");
  const pricing = searchParams.get("pricing");
  const segment = searchParams.get("segment");

  let query = supabase.from("agents").select("*").eq("is_active", true);

  if (categorySlug) {
    const category = getCategoryFromSlug(categorySlug);
    if (category) {
      query = query.eq("primary_category", category);
    }
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

