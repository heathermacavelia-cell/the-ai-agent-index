import { CATEGORY_SLUGS, SLUG_TO_CATEGORY, INDUSTRY_SLUGS, SLUG_TO_INDUSTRY } from "./taxonomy";

export function getCategoryFromSlug(slug: string) {
  return SLUG_TO_CATEGORY[slug] ?? null;
}

export function getCategorySlug(label: string) {
  return (CATEGORY_SLUGS as Record<string, string>)[label] ?? label;
}

export function getIndustryFromSlug(slug: string) {
  return SLUG_TO_INDUSTRY[slug] ?? null;
}

export function getIndustrySlug(label: string) {
  return (INDUSTRY_SLUGS as Record<string, string>)[label] ?? label;
}

