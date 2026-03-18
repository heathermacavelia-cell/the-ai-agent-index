export const PRIMARY_CATEGORIES = [
  "AI Sales Agents",
  "AI Customer Support Agents",
  "AI Research Agents",
  "AI Marketing Agents",
  "AI Coding Agents"
] as const;

export const INDUSTRY_TAGS = [
  "SaaS",
  "Ecommerce",
  "Real Estate",
  "Legal",
  "Finance",
  "Healthcare",
  "Insurance",
  "General"
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

export const CATEGORY_SLUGS: Record<(typeof PRIMARY_CATEGORIES)[number], string> = {
  "AI Sales Agents": "ai-sales-agents",
  "AI Customer Support Agents": "ai-customer-support-agents",
  "AI Research Agents": "ai-research-agents",
  "AI Marketing Agents": "ai-marketing-agents",
  "AI Coding Agents": "ai-coding-agents"
};

export const SLUG_TO_CATEGORY = Object.fromEntries(
  Object.entries(CATEGORY_SLUGS).map(([label, slug]) => [slug, label])
) as Record<string, (typeof PRIMARY_CATEGORIES)[number]>;

export const INDUSTRY_SLUGS: Record<(typeof INDUSTRY_TAGS)[number], string> = {
  SaaS: "saas",
  Ecommerce: "ecommerce",
  "Real Estate": "real-estate",
  Legal: "legal",
  Finance: "finance",
  Healthcare: "healthcare",
  Insurance: "insurance",
  General: "general"
};

export const SLUG_TO_INDUSTRY = Object.fromEntries(
  Object.entries(INDUSTRY_SLUGS).map(([label, slug]) => [slug, label])
) as Record<string, (typeof INDUSTRY_TAGS)[number]>;

