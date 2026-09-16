// INDUSTRY_TAGS is the VERTICAL list: what a customer's business actually is.
// It is the only list that generates /[category]/[industry] pages, and a page
// appears on its own once three agents in a category carry the tag.
//
// Rebuilt 2026-09-12 from the live catalog, after the GSC audit found 60 of
// 176 industry pages had zero agents while 15 tags with real coverage had no
// page at all. What earns a tag is in claude/std/part-d05-verticals.md.
export const INDUSTRY_TAGS = [
  "Automotive",
  "BPO",
  "Construction",
  "Consulting",
  "Cybersecurity",
  "Ecommerce",
  "Education",
  "Energy",
  "Finance",
  "Fitness",
  "Franchise",
  "Gaming",
  "Healthcare",
  "Hospitality",
  "Insurance",
  "Legal",
  "Local Services",
  "Logistics",
  "Manufacturing",
  "Marketing",
  "Media",
  "Nonprofits",
  "Pharma",
  "Public Sector",
  "Real Estate",
  "Research",
  "Retail",
  "Telecom",
  "Travel"
] as const;

// SEGMENT_TAGS describe company shape and buying context, not industry. They
// live in the same industry_tags column, they are useful as filters, and they
// NEVER generate a page: "AI Sales Agents for B2B" would cover 271 of 378
// agents and answers nobody's question.
export const SEGMENT_TAGS = [
  "B2B",
  "B2C",
  "SaaS",
  "Enterprise",
  "Mid-market",
  "SMB",
  "Startups",
  "Agencies",
  "DevTools",
  "Open Source",
  "Cloud",
  "AWS",
  "DTC",
  "Solo Professionals"
] as const;

export const CAPABILITY_TAGS = [
  "Lead generation",
  "Outbound automation",
  "Ticket resolution",
  "Market research",
  "Content creation",
  "Code generation",
  "Data analysis",
  "Scheduling",
  "Reporting"
] as const;

export const PRICING_MODELS = ["Free", "Freemium", "Paid", "Enterprise"] as const;
export const DEPLOYMENT_DIFFICULTY = ["Easy", "Medium", "Complex"] as const;

export const CATEGORY_SLUGS: Record<string, string> = {
  "AI Sales Agents": "ai-sales-agents",
  "AI Customer Support Agents": "ai-customer-support-agents",
  "AI Research Agents": "ai-research-agents",
  "AI Marketing Agents": "ai-marketing-agents",
  "AI Coding Agents": "ai-coding-agents",
  "AI HR Agents": "ai-hr-agents",
  "AI Workflow Agents": "ai-workflow-agents",
  "AI Customer Success Agents": "ai-customer-success-agents",
};

export const PRIMARY_CATEGORIES = Object.keys(CATEGORY_SLUGS);

export const SLUG_TO_CATEGORY = Object.fromEntries(
  Object.entries(CATEGORY_SLUGS).map(([label, slug]) => [slug, label])
) as Record<string, string>;

export const INDUSTRY_SLUGS: Record<(typeof INDUSTRY_TAGS)[number], string> = {
  Automotive: "automotive",
  BPO: "bpo",
  Construction: "construction",
  Consulting: "consulting",
  Cybersecurity: "cybersecurity",
  Ecommerce: "ecommerce",
  Education: "education",
  Energy: "energy",
  Finance: "finance",
  Fitness: "fitness",
  Franchise: "franchise",
  Gaming: "gaming",
  Healthcare: "healthcare",
  Hospitality: "hospitality",
  Insurance: "insurance",
  Legal: "legal",
  "Local Services": "local-services",
  Logistics: "logistics",
  Manufacturing: "manufacturing",
  Marketing: "marketing",
  Media: "media",
  Nonprofits: "nonprofits",
  Pharma: "pharma",
  "Public Sector": "public-sector",
  "Real Estate": "real-estate",
  Research: "research",
  Retail: "retail",
  Telecom: "telecom",
  Travel: "travel",
};

export const SEGMENT_SLUGS: Record<(typeof SEGMENT_TAGS)[number], string> = {
  B2B: "b2b",
  B2C: "b2c",
  SaaS: "saas",
  Enterprise: "enterprise",
  "Mid-market": "mid-market",
  SMB: "smb",
  Startups: "startups",
  Agencies: "agencies",
  DevTools: "devtools",
  "Open Source": "open-source",
  Cloud: "cloud",
  AWS: "aws",
  DTC: "dtc",
  "Solo Professionals": "solo-professionals",
};

// Everything a vendor may pick on a form: verticals plus segments.
export const ALL_TAGS = [...INDUSTRY_TAGS, ...SEGMENT_TAGS] as const;

export const SLUG_TO_INDUSTRY = Object.fromEntries(
  Object.entries(INDUSTRY_SLUGS).map(([label, slug]) => [slug, label])
) as Record<string, (typeof INDUSTRY_TAGS)[number]>;

// ---------------------------------------------------------------------------
// THE VERTICAL / SEGMENT SPLIT. Added 2026-09-16.
//
// `industry_tags` carries BOTH lists in one column. Measured off the read
// route 2026-09-16: 378 rows, 43 distinct tags, 1,783 assignments, and the
// 43 divide EXACTLY into the 29 INDUSTRY_TAGS and the 14 SEGMENT_TAGS above
// with no strays. Verticals are 508 assignments; segments are 1,275 (72%).
//
// The column keeps its name: renaming it would break the public JSON API and
// the MCP output shape. Everything below splits it at READ time instead.
// ---------------------------------------------------------------------------

export const VERTICAL_SLUG_SET: ReadonlySet<string> = new Set(
  Object.values(INDUSTRY_SLUGS)
);

export const SEGMENT_SLUG_SET: ReadonlySet<string> = new Set(
  Object.values(SEGMENT_SLUGS)
);

// BROAD_TAGS are the tags that sit on more than 30% of the catalog and so
// cannot separate one listing from another. Search scores these lower.
//
// MEASURED 2026-09-16 against 378 active rows:
//   b2b 274 (72%) · saas 249 (66%) · enterprise 223 (59%) · smb 134 (35%)
//   · startups 119 (31%)
// The next tag down is agencies at 107 (28%), comfortably below the line.
//
// This list is FROZEN ON PURPOSE - it is not recomputed at request time, so
// ranking stays predictable and reviewable. RE-DERIVE IT DELIBERATELY when
// the catalog grows materially, and update the counts in this comment when
// you do.
export const BROAD_TAGS: ReadonlySet<string> = new Set([
  "b2b",
  "saas",
  "enterprise",
  "smb",
  "startups",
]);

// ONE display-label map for all 43 tags. This replaces five partial copies
// that had drifted apart (AgentPageClient, CategoryPageClient, and three
// others). Anything not listed falls back to title-casing the slug.
export const TAG_LABELS: Record<string, string> = {
  // verticals
  automotive: "Automotive",
  bpo: "BPO",
  construction: "Construction",
  consulting: "Consulting",
  cybersecurity: "Cybersecurity",
  ecommerce: "Ecommerce",
  education: "Education",
  energy: "Energy",
  finance: "Finance",
  fitness: "Fitness",
  franchise: "Franchise",
  gaming: "Gaming",
  healthcare: "Healthcare",
  hospitality: "Hospitality",
  insurance: "Insurance",
  legal: "Legal",
  "local-services": "Local Services",
  logistics: "Logistics",
  manufacturing: "Manufacturing",
  marketing: "Marketing",
  media: "Media",
  nonprofits: "Nonprofits",
  pharma: "Pharma",
  "public-sector": "Public Sector",
  "real-estate": "Real Estate",
  research: "Research",
  retail: "Retail",
  telecom: "Telecom",
  travel: "Travel",
  // segments
  b2b: "B2B",
  b2c: "B2C",
  saas: "SaaS",
  enterprise: "Enterprise",
  "mid-market": "Mid-market",
  smb: "SMB",
  startups: "Startups",
  agencies: "Agencies",
  devtools: "DevTools",
  "open-source": "Open Source",
  cloud: "Cloud",
  aws: "AWS",
  dtc: "DTC",
  "solo-professionals": "Solo Professionals",
};

export function tagLabel(tag: string): string {
  const key = (tag ?? "").toLowerCase();
  return (
    TAG_LABELS[key] ??
    key
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  );
}

// Splits a row's industry_tags into the two lists. Anything matching neither
// is returned in `other` rather than silently dropped - a tag we do not
// recognise is a data problem we want to be able to SEE, not hide.
export function splitIndustryTags(tags: string[] | null | undefined): {
  verticals: string[];
  segments: string[];
  other: string[];
} {
  const verticals: string[] = [];
  const segments: string[] = [];
  const other: string[] = [];
  for (const raw of tags ?? []) {
    const tag = String(raw).toLowerCase();
    if (VERTICAL_SLUG_SET.has(tag)) verticals.push(tag);
    else if (SEGMENT_SLUG_SET.has(tag)) segments.push(tag);
    else other.push(tag);
  }
  return { verticals, segments, other };
}

export function getSegmentFromSlug(slug: string): string | null {
  const key = (slug ?? "").toLowerCase();
  return SEGMENT_SLUG_SET.has(key) ? key : null;
}