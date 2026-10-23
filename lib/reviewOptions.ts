// Reviewer profile options for agent reviews (2026-10-23).
// One list, used by the review form, the API validation and the listing display.
// Readers see role, company size, industry and region. City and email are never shown.

import { INDUSTRY_TAGS } from '@/lib/taxonomy'

export const REVIEWER_ROLES = [
  'Sales rep / account executive',
  'SDR / BDR',
  'Sales manager or leader',
  'Revenue operations',
  'Customer success',
  'Customer support',
  'Marketing',
  'Founder / owner',
  'Executive',
  'Engineering / developer',
  'Product',
  'Operations',
  'HR / recruiting',
  'Research / analyst',
  'Consultant / agency',
  'Other',
] as const

export const COMPANY_SIZES = [
  'Just me',
  '2-10 employees',
  '11-50 employees',
  '51-200 employees',
  '201-1,000 employees',
  '1,001+ employees',
] as const

export const USAGE_DURATIONS = [
  'Less than 3 months',
  '3-12 months',
  '1-2 years',
  'More than 2 years',
] as const

// Our 29 verticals plus software, which is an audience tag on listings but the most common reviewer industry.
export const REVIEWER_INDUSTRIES: readonly string[] = ['Software / SaaS', ...INDUSTRY_TAGS, 'Other']

export const COUNTRIES = [
  'Canada', 'United States', 'United Kingdom', 'Ireland', 'Australia', 'New Zealand',
  'Germany', 'France', 'Netherlands', 'Belgium', 'Spain', 'Portugal', 'Italy', 'Switzerland',
  'Sweden', 'Denmark', 'Norway', 'Finland', 'Estonia', 'Poland',
  'India', 'Singapore', 'Japan', 'Israel', 'United Arab Emirates',
  'Brazil', 'Mexico', 'South Africa', 'Other',
] as const

export const REVIEW_LIMITS = { name: 40, comment: 3000, region: 60, city: 80 }

export interface ReviewerFields {
  reviewer_role?: string | null
  reviewer_company_size?: string | null
  reviewer_industry?: string | null
  reviewer_country?: string | null
  reviewer_region?: string | null
  usage_duration?: string | null
}

// "Sales manager or leader · 11-50 employees · Software / SaaS · Ontario, Canada"
// City is deliberately not a parameter - it is never displayed.
export function formatReviewerMeta(r: ReviewerFields): string {
  const country = r.reviewer_country && r.reviewer_country !== 'Other' ? r.reviewer_country : ''
  const region = (r.reviewer_region ?? '').trim()
  const place = region && country ? region + ', ' + country : (region || country)
  const industry = r.reviewer_industry && r.reviewer_industry !== 'Other' ? r.reviewer_industry : ''
  const role = r.reviewer_role && r.reviewer_role !== 'Other' ? r.reviewer_role : ''
  return [role, r.reviewer_company_size ?? '', industry, place].filter(Boolean).join(' · ')
}
