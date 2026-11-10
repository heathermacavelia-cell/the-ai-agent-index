import { createClient, createServiceClient } from '@/lib/supabase'
import { fetchAllRows } from '@/lib/fetchAllRows'

// Live AI reads for /advertise (Heather 2026-11-09): how often AI systems read
// each category's pages and the site's comparison / alternatives pages in the
// last 30 days, from our own traffic_logs via the ai_reads_by_path() database
// function. These are READS (live answers, search indexes and training), shown
// beside human visits and never added to them. Prices stay set by visits.
// Paths are grouped the same way as the monthly visits snapshot: listing pages
// by the agent's primary_category, /compare/a-vs-b by the FIRST agent named,
// /alternatives/{slug} by its subject agent, plus the category page itself.

export interface CategoryAiReads { listing: number; compare: number; alternatives: number; categoryPage: number; total: number }
export interface AiReadsSummary { byCategory: Record<string, CategoryAiReads>; compareTotal: number; alternativesTotal: number }

export async function getAiReadsSummary(categorySlugs: string[]): Promise<AiReadsSummary | null> {
  try {
    const svc = createServiceClient()
    const pub = createClient()
    const [{ data: reads, error }, { data: agents }, { data: alts }] = await Promise.all([
      fetchAllRows<{ path: string; reads: number }>((from, to) =>
        svc.rpc('ai_reads_by_path', { days: 30 })
          .order('path', { ascending: true })
          .order('reads', { ascending: true })
          .range(from, to)
      ),
      pub.from('agents').select('slug, primary_category').eq('is_active', true),
      pub.from('alternatives').select('slug, agent_slug').eq('is_active', true),
    ])
    if (error || !reads || !agents) return null

    const catOf = new Map<string, string>()
    for (const a of agents as { slug: string; primary_category: string }[]) catOf.set(a.slug, a.primary_category)
    const altCat = new Map<string, string>()
    for (const r of (alts ?? []) as { slug: string; agent_slug: string }[]) {
      const c = catOf.get(r.agent_slug)
      if (c) altCat.set(r.slug, c)
    }
    const cats = new Set(categorySlugs)
    const byCategory: Record<string, CategoryAiReads> = {}
    for (const s of categorySlugs) byCategory[s] = { listing: 0, compare: 0, alternatives: 0, categoryPage: 0, total: 0 }
    let compareTotal = 0
    let alternativesTotal = 0

    const firstAgentCategory = (pair: string): string | undefined => {
      let i = pair.indexOf('-vs-')
      while (i > 0) {
        const c = catOf.get(pair.slice(0, i))
        if (c) return c
        i = pair.indexOf('-vs-', i + 1)
      }
      return undefined
    }

    for (const row of reads) {
      const n = Number(row.reads) || 0
      const p = row.path.split('?')[0]
      let cat: string | undefined
      let kind: keyof Omit<CategoryAiReads, 'total'> | undefined
      if (p.startsWith('/agents/')) {
        const slug = p.slice(8).split('/')[0]
        if (p.slice(8) === slug) { cat = catOf.get(slug); kind = 'listing' }
      } else if (p.startsWith('/compare/') && p !== '/compare/build') {
        compareTotal += n
        cat = firstAgentCategory(p.slice(9)); kind = 'compare'
      } else if (p.startsWith('/alternatives/')) {
        alternativesTotal += n
        cat = altCat.get(p.slice(14)); kind = 'alternatives'
      } else if (cats.has(p.slice(1))) {
        cat = p.slice(1); kind = 'categoryPage'
      }
      if (cat && kind && byCategory[cat]) {
        byCategory[cat][kind] += n
        byCategory[cat].total += n
      }
    }
    return { byCategory, compareTotal, alternativesTotal }
  } catch {
    return null
  }
}
