import { MetadataRoute } from "next";
import { fetchAllAgents } from "@/lib/supabase";
import {
  PRIMARY_CATEGORIES,
  CATEGORY_SLUGS,
  INDUSTRY_TAGS,
  INDUSTRY_SLUGS
} from "@/lib/taxonomy";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

  const categoryEntries: MetadataRoute.Sitemap = PRIMARY_CATEGORIES.map(
    (category) => ({
      url: `${baseUrl}/${CATEGORY_SLUGS[category]}`,
      changeFrequency: "daily",
      priority: 0.7
    })
  );

  const categoryIndustryEntries: MetadataRoute.Sitemap = [];
  for (const category of PRIMARY_CATEGORIES) {
    const categorySlug = CATEGORY_SLUGS[category];
    for (const industry of INDUSTRY_TAGS) {
      const industrySlug = INDUSTRY_SLUGS[industry];
      categoryIndustryEntries.push({
        url: `${baseUrl}/${categorySlug}/${industrySlug}`,
        changeFrequency: "daily",
        priority: 0.5
      });
    }
  }

  const agents = await fetchAllAgents();
  const agentEntries: MetadataRoute.Sitemap = agents.map((agent) => ({
    url: `${baseUrl}/agents/${agent.slug}`,
    lastModified: agent.updated_at,
    changeFrequency: "weekly",
    priority: 0.8
  }));

  return [
    {
      url: baseUrl,
      changeFrequency: "daily",
      priority: 1
    },
    ...categoryEntries,
    ...categoryIndustryEntries,
    ...agentEntries
  ];
}

