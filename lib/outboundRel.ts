// How an outbound link to a vendor is marked for search engines.
// Ruled by Heather 2026-09-24e (option B). Payment never decides this; the state of the link does.
//  - an affiliate link (we earn a commission on it)      -> rel="sponsored", as Google asks for affiliate links
//  - a listing we have never audited (no last_verified_at) -> rel="ugc": the data is still as the vendor supplied it
//  - an audited listing, free or paid                    -> a plain link
// noopener noreferrer is kept on every link because every one of them opens in a new tab.
export function outboundRel(opts: { affiliate?: boolean; verified?: boolean }): string {
  if (opts.affiliate) return 'sponsored noopener noreferrer'
  if (!opts.verified) return 'ugc noopener noreferrer'
  return 'noopener noreferrer'
}

// Where a Visit button points. Ruled by Heather 2026-09-24e ("lets keep it clean"):
//  1. our affiliate link, when the row has one
//  2. the vendor's own tracking link (vendor_tracking_url), ONLY if it is on the vendor's own
//     domain or a subdomain of it - anything else falls back to the clean website
//  3. the clean website_url, which is also what JSON-LD, the API and the MCP server publish
// website_url is never replaced or modified by any of this.
function host(u: string | null | undefined): string {
  try { return new URL(String(u)).hostname.toLowerCase().replace(/^www\./, '') } catch { return '' }
}
export function visitHref(a: { affiliate_url?: string | null; vendor_tracking_url?: string | null; website_url?: string | null }): string {
  if (a.affiliate_url) return a.affiliate_url
  const t = host(a.vendor_tracking_url), s = host(a.website_url)
  if (t && s && (t === s || t.endsWith('.' + s))) return a.vendor_tracking_url as string
  return a.website_url || '#'
}
