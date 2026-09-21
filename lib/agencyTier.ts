// THE AGENCY PAID TIER, ruled 2026-09-21b and built 2026-09-21c.
//
// "Independently Reviewed" is a paid $39 badge going forward. Agencies that
// were live before the tier existed keep it (listing_tier = 'legacy').
// New free listings do not get it (listing_tier = 'free', the column default).
// A delivered paid review is listing_tier = 'reviewed', set by SQL at delivery
// together with last_verified_at, which is the date the badge shows.
//
// Nothing here reads submitted_tier: choosing a tier on the form is not paying
// for it, and paying is not the review being done.
import type { Agency } from '@/types/agency'

type TierFields = Pick<Agency, 'listing_tier'>

export function isIndependentlyReviewed(a: TierFields): boolean {
  return a.listing_tier === 'reviewed' || a.listing_tier === 'legacy'
}

// A logo we host ourselves. The submit form accepts any URL, and six live rows
// carry an external one, so an external logo_url must never render.
function isSelfHostedLogo(url: string): boolean {
  return url.startsWith('/logos/') || url.startsWith('https://theaiagentindex.com/logos/')
}

// Paid agencies get a real logo on the card and the listing page (ruling 13).
// Free and grandfathered agencies keep the automatic favicon.
export function paidAgencyLogo(a: Pick<Agency, 'listing_tier' | 'logo_url'>): string | null {
  if (a.listing_tier !== 'reviewed' || !a.logo_url) return null
  return isSelfHostedLogo(a.logo_url) ? a.logo_url : null
}

// "Reviewed Sep 2026". Only a paid review carries a date: the grandfathered
// rows' last_verified_at values were never a stated promise. Formatted by hand
// in UTC so the server and the browser print the same string.
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export function reviewedLabel(a: Pick<Agency, 'listing_tier' | 'last_verified_at'>): string | null {
  if (a.listing_tier !== 'reviewed' || !a.last_verified_at) return null
  const d = new Date(a.last_verified_at)
  if (isNaN(d.getTime())) return null
  return 'Reviewed ' + MONTHS[d.getUTCMonth()] + ' ' + d.getUTCFullYear()
}

// Strip the private columns before a row reaches a client component. Found
// 2026-09-21c: select('*') rows were serialised into the public HTML with the
// vendor's contact email and our internal notes in them.
export function toPublicAgency<T extends Partial<Agency>>(row: T): T {
  return { ...row, contact_email: null, submission_notes: null, submitted_tier: null }
}
