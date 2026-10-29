import { cache } from 'react'
import { createClient } from '@/lib/supabase'

/**
 * Hand-picked agent lists for guides.
 *
 * Why: guides used to list every row matching a tag, sorted by rating, with #1-#3
 * badges. That pulled in agents the guide never discusses (office assistants in a
 * workflow guide) and turned the order into a ranking. Heather ruled 2026-10-29: each
 * guide SELECTS its agents and their ORDER, grouped under the guide's own sections.
 *
 * The list lives in the guide's own file, next to its prose, so the two are audited
 * together. Order is editorial, not a score, so nothing here numbers the cards.
 *
 * Only ACTIVE rows render. A picked slug that is missing or delisted is skipped, so a
 * delisting never breaks a guide - and the live check after every guide audit counts
 * the cards against the list, which is how a skipped pick gets noticed.
 */
export interface GuideGroup {
  heading: string
  intro?: string
  slugs: string[]
}

export interface GuideAgent {
  id: string
  name: string
  slug: string
  developer: string | null
  short_description: string | null
  pricing_model: string | null
  editorial_rating: number | null
  editorial_rating_notes: string | null
  rating_avg: number | null
  rating_count: number | null
  is_featured: boolean | null
  is_verified: boolean | null
}

export interface ResolvedGuideGroup {
  heading: string
  intro?: string
  agents: GuideAgent[]
}

// Keyed by a joined string because React's cache() compares arguments by identity.
const fetchBySlugs = cache(async (key: string): Promise<Record<string, GuideAgent>> => {
  const slugs = key.split(',').filter(Boolean)
  const map: Record<string, GuideAgent> = {}
  if (slugs.length === 0) return map
  const supabase = createClient()
  const { data } = await supabase
    .from('agents')
    .select('id, name, slug, developer, short_description, pricing_model, editorial_rating, editorial_rating_notes, rating_avg, rating_count, is_featured, is_verified')
    .eq('is_active', true)
    .in('slug', slugs)
  for (const a of (data ?? []) as GuideAgent[]) map[a.slug] = a
  return map
})

export function guideSlugs(groups: GuideGroup[]): string[] {
  return Array.from(new Set(groups.flatMap((g) => g.slugs)))
}

/** The groups with their agents, in the picked order, active rows only. */
export async function getGuideGroups(groups: GuideGroup[]): Promise<ResolvedGuideGroup[]> {
  const map = await fetchBySlugs(guideSlugs(groups).join(','))
  return groups.map((g) => ({
    heading: g.heading,
    intro: g.intro,
    agents: g.slugs.map((s) => map[s]).filter((a): a is GuideAgent => Boolean(a)),
  }))
}
