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
