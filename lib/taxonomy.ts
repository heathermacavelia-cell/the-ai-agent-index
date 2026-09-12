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

export const CUSTOMER_SEGMENTS = ["SMB", "Mid-market", "Enterprise", "All"] as const;
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