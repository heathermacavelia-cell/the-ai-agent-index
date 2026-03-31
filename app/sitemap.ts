import { MetadataRoute } from "next";
import { fetchAllAgents, createClient } from "@/lib/supabase";
import {
  PRIMARY_CATEGORIES,
  CATEGORY_SLUGS,
  INDUSTRY_TAGS,
  INDUSTRY_SLUGS
} from "@/lib/taxonomy";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://theaiagentindex.com";
  const supabase = createClient()
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
        changeFrequency: "weekly",
        priority: 0.6
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
  const [guidesRes, comparisonsRes, definitionsRes, integrationsRes, alternativesRes] = await Promise.all([
    supabase.from('guides').select('slug').eq('is_active', true),
    supabase.from('comparisons').select('slug').eq('is_active', true),
    supabase.from('definitions').select('slug').eq('is_active', true),
    supabase.from('integrations').select('slug').eq('is_active', true),
    supabase.from('alternatives').select('slug').eq('is_active', true),
  ])
  const guideEntries: MetadataRoute.Sitemap = (guidesRes.data ?? []).map((g) => ({
    url: `${baseUrl}/resources/guides/${g.slug}`,
    changeFrequency: "weekly",
    priority: 0.8
  }))
  const compareEntries: MetadataRoute.Sitemap = (comparisonsRes.data ?? []).map((c) => ({
    url: `${baseUrl}/compare/${c.slug}`,
    changeFrequency: "weekly",
    priority: 0.7
  }))
  const definitionEntries: MetadataRoute.Sitemap = (definitionsRes.data ?? []).map((d) => ({
    url: `${baseUrl}/definitions/${d.slug}`,
    changeFrequency: "monthly",
    priority: 0.7
  }))
  const integrationEntries: MetadataRoute.Sitemap = (integrationsRes.data ?? []).map((i) => ({
    url: `${baseUrl}/integrations/${i.slug}`,
    changeFrequency: "weekly",
    priority: 0.8
  }))
  const alternativeEntries: MetadataRoute.Sitemap = (alternativesRes.data ?? []).map((a) => ({
    url: `${baseUrl}/alternatives/${a.slug}`,
    changeFrequency: "weekly",
    priority: 0.8
  }))
  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/compare`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/alternatives`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/definitions`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/contact`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/privacy`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/submit`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/search`, changeFrequency: "daily", priority: 0.5 },
    { url: `${baseUrl}/integrations`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/resources`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${baseUrl}/resources/comparisons`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${baseUrl}/resources/guides`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${baseUrl}/resources/newsletter`, changeFrequency: "monthly", priority: 0.4 },
  ];
  return [
    { url: baseUrl, changeFrequency: "daily", priority: 1 },
    ...staticEntries,
    ...categoryEntries,
    ...categoryIndustryEntries,
    ...definitionEntries,
    ...compareEntries,
    ...guideEntries,
    ...integrationEntries,
    ...alternativeEntries,
    ...agentEntries,
  ];
}