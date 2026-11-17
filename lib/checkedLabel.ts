// The one-line freshness label on category, industry and search cards (Heather 2026-11-16:
// HONEST DATE ONLY). It states the real date of our last check, never "x days ago", and never
// a stale/outdated warning - an old date on an audited listing is our backlog, not the vendor's
// fault. A row we have never checked says so plainly.
//
// Pure and dependency-free on purpose: it runs inside client components (CategoryPageClient),
// so it must not import lib/siteStats (server-side). The format matches longDate() there and the
// listing page's "Verified" tile: en-US short month, America/Toronto, e.g. "Nov 16, 2026".
const TZ = 'America/Toronto'

export function checkedLabel(lastVerifiedAt: string | null | undefined): string | null {
  if (!lastVerifiedAt) return 'Not yet verified'
  const t = Date.parse(lastVerifiedAt)
  // An unreadable value shows nothing rather than a wrong date.
  if (Number.isNaN(t)) return null
  return 'Checked ' + new Date(t).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: TZ })
}

// schema.org Date (YYYY-MM-DD) for WebPage.lastReviewed, on the same Toronto day the card shows.
export function reviewedDate(lastVerifiedAt: string | null | undefined): string | null {
  if (!lastVerifiedAt) return null
  const t = Date.parse(lastVerifiedAt)
  if (Number.isNaN(t)) return null
  return new Date(t).toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: TZ })
}
