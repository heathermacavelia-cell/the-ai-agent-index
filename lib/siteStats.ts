import { cache } from 'react'
import { createClient } from '@/lib/supabase'
import { CATEGORY_SLUGS } from '@/lib/taxonomy'
import { resolveRating } from '@/lib/rating'

/**
 * Every figure the site publishes about itself comes from here, read from the
 * database on the request. Never type one of these numbers into a page: if the
 * read fails the caller prints no number at all, not a remembered one.
 * Added for the 2026-11 redesign (Heather: counts must be dynamic so nobody has
 * to check them by hand).
 */

export interface CatalogRow {
  id: string
  slug: string
  name: string
  website_url: string | null
  favicon_domain: string | null
  logo_url: string | null
  primary_category: string
  mcp_status: string | null
  editorial_rating: number | null
  editorial_rating_notes: string | null
  rating_avg: number | null
  rating_count: number | null
  last_verified_at: string | null
  is_affiliate: boolean | null
  vendor_managed: boolean | null
}

const FIELDS =
  'id, slug, name, website_url, favicon_domain, logo_url, primary_category, mcp_status, editorial_rating, editorial_rating_notes, rating_avg, rating_count, last_verified_at, is_affiliate, vendor_managed'
const PAGE = 1000

/** All active rows, read in pages because a single query stops at 1,000 rows. */
export const getCatalogRows = cache(async (): Promise<CatalogRow[] | null> => {
  const supabase = createClient()
  const rows: CatalogRow[] = []
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from('agents')
      .select(FIELDS)
      .eq('is_active', true)
      .order('slug')
      .range(from, from + PAGE - 1)
    if (error || !data) return null
    rows.push(...(data as unknown as CatalogRow[]))
    if (data.length < PAGE) return rows
  }
})

export interface SiteStats {
  agents: number
  rated: number
  mcpServers: number
  categories: number
  perCategory: Record<string, number>
}

export function ratingOf(row: CatalogRow): number | null {
  const r = resolveRating({
    editorial_rating: row.editorial_rating,
    editorial_rating_notes: row.editorial_rating_notes,
    rating_avg: row.rating_avg,
    rating_count: row.rating_count,
  })
  return r.suppressed ? null : r.value
}

export const getSiteStats = cache(async (): Promise<SiteStats | null> => {
  const rows = await getCatalogRows()
  if (!rows) return null
  const perCategory: Record<string, number> = {}
  for (const slug of Object.values(CATEGORY_SLUGS)) perCategory[slug] = 0
  let rated = 0
  let mcpServers = 0
  for (const row of rows) {
    if (row.primary_category in perCategory) perCategory[row.primary_category] += 1
    if (ratingOf(row) != null) rated += 1
    if (row.mcp_status === 'server' || row.mcp_status === 'both') mcpServers += 1
  }
  return { agents: rows.length, rated, mcpServers, categories: Object.keys(CATEGORY_SLUGS).length, perCategory }
})

/** Same test as the re-audit queue: 14 days for affiliate or paid rows, 30 for the rest. */
export function isInDate(row: CatalogRow, now = Date.now()): boolean {
  if (!row.last_verified_at) return false
  const days = row.is_affiliate === true || row.vendor_managed === true ? 14 : 30
  return Date.parse(row.last_verified_at) >= now - days * 86400000
}

const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve']
/** "eight" today. Follows the taxonomy if a category is ever added. */
export function categoryCountWord(): string {
  const n = Object.keys(CATEGORY_SLUGS).length
  return WORDS[n] ?? String(n)
}

export function shortDate(iso: string | null | undefined): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'America/Toronto' })
}
export function longDate(iso: string | null | undefined): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'America/Toronto' })
}
