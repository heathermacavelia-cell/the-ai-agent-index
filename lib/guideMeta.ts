import { cache } from 'react'
import { createClient } from '@/lib/supabase'

/**
 * Guide dates come from the DB, never from code.
 *
 * Why: every guide used to hardcode `datePublished` in TSX (which disagreed with the
 * database on six of them) and compute `dateModified: new Date()` at render, which told
 * Google all 33 guides were modified TODAY, every day, forever. A freshness claim we
 * make to a search engine has to be true.
 *
 * `last_audited_at` is stamped ONLY when a human re-reads and verifies the guide's
 * content. A code fix does not stamp it. Same rule as alternatives.last_audited_at:
 * corrections are not audits.
 */
export interface GuideMeta {
  published_at: string | null
  last_audited_at: string | null
  audited_by: string | null
}

export const getGuideMeta = cache(async (slug: string): Promise<GuideMeta | null> => {
  const supabase = createClient()
  const { data } = await supabase
    .from('guides')
    .select('published_at, last_audited_at, audited_by')
    .eq('slug', slug)
    .maybeSingle()
  return (data as GuideMeta) ?? null
})

/** "2026-05-13", or null. Schema.org wants a bare date, not a timestamp. */
export function isoDate(ts: string | null | undefined): string | null {
  if (!ts) return null
  const d = new Date(ts)
  return isNaN(d.getTime()) ? null : d.toISOString().split('T')[0]
}

/**
 * "Updated July 2026", or null.
 * Returns null rather than a guess when the guide has never been audited. A missing
 * date is honest; a wrong one is not.
 */
export function updatedLabel(ts: string | null | undefined): string | null {
  if (!ts) return null
  const d = new Date(ts)
  if (isNaN(d.getTime())) return null
  return 'Updated ' + d.toLocaleDateString('en-US', {
    month: 'long', year: 'numeric', timeZone: 'UTC',
  })
}