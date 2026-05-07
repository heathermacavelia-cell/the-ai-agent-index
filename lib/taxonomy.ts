export const INDUSTRY_TAGS = [
  "SaaS",
  "Ecommerce",
  "Real Estate",
  "Legal",
  "Finance",
  "Healthcare",
  "Insurance",
  "B2B",
  "Enterprise",
  "SMB",
  "Startups",
  "DevTools",
  "Pharma",
  "Retail",
  "DTC",
  "Agencies",
  "Open Source",
  "Cloud",
  "AWS",
  "Career",
  "HR",
  "Recruiting"
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
  SaaS: "saas",
  Ecommerce: "ecommerce",
  "Real Estate": "real-estate",
  Legal: "legal",
  Finance: "finance",
  Healthcare: "healthcare",
  Insurance: "insurance",
  B2B: "b2b",
  Enterprise: "enterprise",
  SMB: "smb",
  Startups: "startups",
  DevTools: "devtools",
  Pharma: "pharma",
  Retail: "retail",
  DTC: "dtc",
  Agencies: "agencies",
  "Open Source": "open-source",
  Cloud: "cloud",
  AWS: "aws",
  Career: "career",
  HR: "hr",
  Recruiting: "recruiting",
};

export const SLUG_TO_INDUSTRY = Object.fromEntries(
  Object.entries(INDUSTRY_SLUGS).map(([label, slug]) => [slug, label])
) as Record<string, (typeof INDUSTRY_TAGS)[number]>;