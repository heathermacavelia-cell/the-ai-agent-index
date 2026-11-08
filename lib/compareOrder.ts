/**
 * Which order a two-way /compare/ URL lives at. The compare page redirects every
 * other order to this one, so internal links must use it or each link costs a
 * redirect hop (audit 2026-11-07: listing pages linked the redirecting order).
 *
 * Rule, in order: an editorial `comparisons` row pins its own order; then the
 * pairs in PINNED_ORDER keep the order they already rank in; otherwise the
 * alphabetically first slug leads.
 */

/**
 * Pairs that already rank in this exact order, measured in GSC on 2026-09-12
 * (28 days, every compare page with 3+ clicks). The alphabetical rule would move
 * them to the other order, and moving a URL that already ranks costs traffic and
 * buys nothing. Delete an entry once an editorial comparisons row exists for it in
 * this order, because the row pins the order on its own.
 */
export const PINNED_ORDER = new Set([
  'openhands-vs-hermes-agent',
  'opencode-vs-goose',
  'undermind-vs-consensus',
  'undermind-vs-elicit',
  'zed-ai-vs-kilo-code',
  'jetbrains-ai-assistant-vs-github-copilot',
  'zed-ai-vs-github-copilot',
  'scite-ai-vs-consensus',
])

/** The canonical slug for a two-way pair. `editorial` = active comparisons slugs. */
export function canonicalPairSlug(a: string, b: string, editorial: Set<string>): string {
  const ab = `${a}-vs-${b}`
  const ba = `${b}-vs-${a}`
  if (editorial.has(ab)) return ab
  if (editorial.has(ba)) return ba
  if (PINNED_ORDER.has(ab)) return ab
  if (PINNED_ORDER.has(ba)) return ba
  return a < b ? ab : ba
}
