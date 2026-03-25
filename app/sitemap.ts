import { MetadataRoute } from "next";
import { fetchAllAgents } from "@/lib/supabase";
import {
  PRIMARY_CATEGORIES,
  CATEGORY_SLUGS,
  INDUSTRY_TAGS,
  INDUSTRY_SLUGS
} from "@/lib/taxonomy";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://theaiagentindex.com";

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

  const definitionSlugs = [
    "what-is-an-ai-sales-agent",
    "what-is-an-ai-customer-support-agent",
    "what-is-an-ai-research-agent",
    "what-is-an-ai-marketing-agent",
    "what-is-an-ai-coding-agent",
    "what-is-an-ai-sdr",
  ];
  const definitionEntries: MetadataRoute.Sitemap = definitionSlugs.map((slug) => ({
    url: `${baseUrl}/definitions/${slug}`,
    changeFrequency: "monthly",
    priority: 0.7
  }));

  const compareSlugs = [
    "cursor-vs-github-copilot",
    "cursor-vs-windsurf",
    "github-copilot-vs-windsurf",
    "intercom-fin-vs-zendesk-ai",
    "gorgias-vs-tidio",
    "gong-vs-clari",
    "clay-vs-instantly-ai",
    "apollo-io-vs-instantly-ai",
    "jasper-vs-copy-ai",
    "perplexity-ai-vs-chatgpt-deep-research",
    "elicit-vs-consensus",
  ];
  const compareEntries: MetadataRoute.Sitemap = compareSlugs.map((slug) => ({
    url: `${baseUrl}/compare/${slug}`,
    changeFrequency: "weekly",
    priority: 0.7
  }));

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/compare`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/definitions`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/contact`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/privacy`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/submit`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/search`, changeFrequency: "daily", priority: 0.5 },
    { url: `${baseUrl}/integrations`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/integrations/hubspot`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/integrations/salesforce`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/integrations/zapier`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/integrations/slack`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/integrations/gmail`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/integrations/microsoft-teams`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/resources`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${baseUrl}/resources/comparisons`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${baseUrl}/resources/guides`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${baseUrl}/resources/guides/how-to-build-and-sell-an-ai-agent`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/resources/guides/best-ai-research-agents`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/resources/guides/how-ai-agents-are-changing-sales`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/resources/guides/best-ai-agents-for-startups`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/resources/guides/ai-agents-for-ecommerce`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/resources/guides/best-ai-agents-for-customer-support`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/resources/guides/best-ai-agents-for-marketing-teams`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/resources/guides/ai-agent-vs-ai-assistant`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/resources/guides/best-ai-agents-for-small-business`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/resources/guides/best-no-code-ai-agent-builders`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/resources/guides/how-to-build-an-ai-agent`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/resources/guides/what-is-an-ai-agent`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/resources/guides/best-ai-agents-for-outbound-sales`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/resources/guides/hubspot-vs-ai-agents`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/resources/guides/how-to-evaluate-an-ai-agent`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/resources/newsletter`, changeFrequency: "monthly", priority: 0.4 },
  ];

  return [
    { url: baseUrl, changeFrequency: "daily", priority: 1 },
    ...staticEntries,
    ...categoryEntries,
    ...categoryIndustryEntries,
    ...definitionEntries,
    ...compareEntries,
    ...agentEntries,
  ];
}