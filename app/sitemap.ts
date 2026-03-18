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
      changefreq: "daily",
      priority: 0.7
    })
  );

  const categoryIndustryEntries: MetadataRoute.Sitemap = [];
  (PRIMARY_CATEGORIES as string[]).forEach((category) => {
    const categorySlug =
      CATEGORY_SLUGS[category as keyof typeof CATEGORY_SLUGS];
    (INDUSTRY_TAGS as string[]).forEach((industry) => {
      const industrySlug =
        INDUSTRY_SLUGS[industry as keyof typeof INDUSTRY_SLUGS];
      categoryIndustryEntries.push({
        url: `${baseUrl}/${categorySlug}/${industrySlug}`,
        changefreq: "daily",
        priority: 0.5
      });
    });
  });

  const agents = await fetchAllAgents();
  const agentEntries: MetadataRoute.Sitemap = agents.map((agent) => ({
    url: `${baseUrl}/agents/${agent.slug}`,
    lastmod: agent.updated_at,
    changefreq: "weekly",
    priority: 0.8
  }));

  return [
    {
      url: baseUrl,
      changefreq: "daily",
      priority: 1
    },
    ...categoryEntries,
    ...categoryIndustryEntries,
    ...agentEntries
  ];
}

