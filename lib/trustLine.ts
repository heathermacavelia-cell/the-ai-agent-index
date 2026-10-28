/**
 * Search descriptions on pages that list many products end with a trust line that is true whether
 * or not the page shows an affiliate: "Independently researched." (Heather, 2026-10-28). It replaces
 * "Not affiliated.", which was false on any page listing an affiliate. If the swap would push the
 * description past 160 characters, the old line is simply dropped.
 * NOT used on agent listings (the meta_desc_disclosure database constraint governs those) or on
 * agency pages (agency claims are published as submitted, so "independently researched" is not true).
 */
const OLD = /\s*Not affiliated\./g
export function trustLine<T extends string | null | undefined>(desc: T, max = 160): T {
  if (!desc || !/Not affiliated\./.test(desc)) return desc
  const swapped = desc.replace(OLD, ' Independently researched.').trim()
  if (swapped.length <= max) return swapped as T
  return desc.replace(OLD, '').trim() as T
}
