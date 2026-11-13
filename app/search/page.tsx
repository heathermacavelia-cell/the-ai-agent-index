import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import type { Metadata } from 'next'
import AgentLogo from '@/components/AgentLogo'
import CategoryGrid, { buildCategoryRows } from '@/components/CategoryGrid'
import { getCatalogRows, getSiteStats } from '@/lib/siteStats'
import { getTier } from '@/lib/vendorPlans'
import { capabilityLabel } from '@/lib/tags'
import { resolveRating } from '@/lib/rating'
import { buildRefMap, collectTemplateSlugs, resolveTemplates } from '@/lib/templates'
import { BROAD_TAGS, SLUG_TO_CATEGORY } from '@/lib/taxonomy'
import { GUIDE_AGENTS } from '@/lib/guideAgents.generated'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Search AI Agents',
  description: 'Search and filter AI agents by capability, industry, or integration across sales, support, research, marketing, coding, HR, and workflow automation.',
  alternates: {
    canonical: 'https://theaiagentindex.com/search',
  },
}

// Integration hubs come from the `integrations` table (2026-11-13). This used to be a hardcoded
// list of six, so a search for any other app never surfaced its hub page.
type IntegrationHit = { slug: string; title: string; description: string }

// "Pages that cover <agent>": when a search names an agent, list the pages that are about it or
// link to it - its category, guides (from each guide's GUIDE_SLUGS, see lib/guideAgents.generated.ts),
// comparisons and alternatives pages. Full listing descriptions are deliberately NOT searched: that
// timed out the whole search in May 2026 (commit 07c7d12c). Every lookup here is time-limited. Search otherwise matches only
// titles and summaries, so a page covering an agent in its body never showed up (2026-11-13).
type CoverLink = { href: string; label: string; kind: string }
type CoverGroup = { slug: string; name: string; links: CoverLink[] }

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'of', 'in', 'on', 'at', 'to', 'from',
  'with', 'by', 'for', 'as', 'is', 'are', 'be', 'do',
  'best', 'top', 'great', 'good', 'compare', 'find', 'show', 'list',
  'recommend', 'recommendation', 'review', 'reviews',
  'vs', 'versus', 'between',
  'ai', 'agent', 'agents', 'tool', 'tools', 'app', 'apps',
  'software', 'platform', 'platforms', 'system', 'systems',
  'solution', 'solutions',
  'free', 'paid', 'pricing', 'price', 'cost',
  'what', 'which', 'how', 'why', 'when', 'where', 'who',
])

function tokenize(query: string): string[] {
  if (!query) return []
  return query
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2 && !STOP_WORDS.has(t))
    .slice(0, 6)
}

function escapeForOr(value: string): string {
  return value.replace(/[%,()'":\\]/g, '')
}

function buildAgentOrClause(token: string): string {
  const safe = escapeForOr(token)
  return [
    `name.ilike.%${safe}%`,
    `developer.ilike.%${safe}%`,
    `short_description.ilike.%${safe}%`,
    `search_text.ilike.%${safe}%`,
    `agent_type.ilike.%${safe}%`,
    `capability_tags.cs.{${safe}}`,
    `industry_tags.cs.{${safe}}`,
  ].join(',')
}

function scoreAgent(agent: any, tokens: string[]): number {
  let score = 0
  const name = (agent.name || '').toLowerCase()
  const developer = (agent.developer || '').toLowerCase()
  const agentType = (agent.agent_type || '').toLowerCase()
  const shortDesc = (agent.short_description || '').toLowerCase()
  const searchText = (agent.search_text || '').toLowerCase()
  const capTags: string[] = (agent.capability_tags || []).map((t: string) => t.toLowerCase())
  const indTags: string[] = (agent.industry_tags || []).map((t: string) => t.toLowerCase())

  for (const token of tokens) {
    if (name.includes(token)) score += 10
    if (name === token) score += 20
    if (name.startsWith(token)) score += 5
    if (developer.includes(token)) score += 6
    if (agentType.includes(token)) score += 8
    if (capTags.includes(token)) score += 6
    // BROAD_TAGS (b2b, saas, enterprise, smb, startups) sit on 31-72% of the
    // catalog and cannot separate one listing from another, so an exact match
    // on one is worth 2 instead of 7. EVERY OTHER TAG IS UNCHANGED - all 29
    // verticals and the 9 remaining segment tags, including cloud (12 rows),
    // aws (2) and open-source (23), which are segments but highly specific.
    //
    // The rule is BREADTH, not vertical-versus-segment. An earlier draft
    // demoted every segment tag and dropped snyk-ai from 1st to 4th on the
    // query "cloud security" by stripping its `cloud` match. Measured
    // 2026-09-16; see claude/industry-tags-split-2026-09-16.md section 9.
    if (indTags.includes(token)) score += BROAD_TAGS.has(token) ? 2 : 5
    if (capTags.some((t) => t.includes(token))) score += 3
    if (indTags.some((t) => t.includes(token)) && !BROAD_TAGS.has(token)) score += 2
    if (shortDesc.includes(token)) score += 3
    if (searchText.includes(token)) score += 2
  }

  if (agent.is_featured) score += 2
  if (agent.vendor_claimed) score += 1
  if (agent.editorial_rating) score += Number(agent.editorial_rating) * 0.3

  return score
}

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const rawQuery = (searchParams.q ?? '').slice(0, 200).trim()
  const tokens = tokenize(rawQuery)
  const supabase = createClient()

  const { count: totalAgents } = await supabase
    .from('agents')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  const [catalog, stats] = await Promise.all([getCatalogRows(), getSiteStats()])
  const categoryRows = buildCategoryRows(catalog ?? [], stats?.perCategory)

  const FETCH_LIMIT = tokens.length > 1 ? 50 : 100

  let agentResults: any[] = []
  let usedFallback = false

  if (tokens.length > 0) {
    let agentsQuery = supabase
      .from('agents')
      .select('id, name, slug, developer, short_description, search_text, capability_tags, industry_tags, website_url, favicon_domain, logo_url, agent_type, primary_category, pricing_model, is_featured, is_verified, editorial_rating, editorial_rating_notes, rating_avg, rating_count')
      .eq('is_active', true)

    for (const token of tokens) {
      agentsQuery = agentsQuery.or(buildAgentOrClause(token))
    }

    const { data, error } = await agentsQuery.limit(FETCH_LIMIT)

    // A name match can never be truncated away by the broad query's limit.
    // Without this, "hubspot" matches 37 rows via search_text, an arbitrary
    // 20 come back unordered, and the real listing is cut before scoring.
    let nameQuery = supabase
      .from('agents')
      .select('id, name, slug, developer, short_description, search_text, capability_tags, industry_tags, website_url, favicon_domain, logo_url, agent_type, primary_category, pricing_model, is_featured, is_verified, editorial_rating, editorial_rating_notes, rating_avg, rating_count')
      .eq('is_active', true)

    for (const token of tokens) {
      nameQuery = nameQuery.or(`name.ilike.%${escapeForOr(token)}%`)
    }

    const { data: nameData } = await nameQuery.limit(20)

    const seenIds = new Set<string>()
    const pool = [...(nameData ?? []), ...(data ?? [])].filter((a) => {
      if (seenIds.has(a.id)) return false
      seenIds.add(a.id)
      return true
    })

    if (pool.length > 0) {
      agentResults = pool
        .map((a) => ({ ...a, _score: scoreAgent(a, tokens) }))
        .filter((a) => a._score > 0)
        .sort((a, b) => b._score - a._score)
        .slice(0, 20)
    }

    if (agentResults.length === 0) {
      const orParts = tokens.map((t) => `agent_type.ilike.%${escapeForOr(t)}%`).join(',')
      const { data: fbData } = await supabase
        .from('agents')
        .select('id, name, slug, developer, short_description, search_text, capability_tags, industry_tags, website_url, favicon_domain, logo_url, agent_type, primary_category, pricing_model, is_featured, is_verified, editorial_rating, editorial_rating_notes, rating_avg, rating_count')
        .eq('is_active', true)
        .or(orParts)
        .limit(20)

      if (fbData && fbData.length > 0) {
        agentResults = fbData
          .map((a) => ({ ...a, _score: scoreAgent(a, tokens) }))
          .sort((a, b) => b._score - a._score)
        usedFallback = true
      }
    }
  }

  const buildOrFor = (token: string, fields: string[]) => {
    const safe = escapeForOr(token)
    return fields.map((f) => `${f}.ilike.%${safe}%`).join(',')
  }

  let guideResults: any[] = []
  let comparisonResults: any[] = []
  let definitionResults: any[] = []
  let alternativeResults: any[] = []
  let integrationResults: IntegrationHit[] = []
  let coverGroups: CoverGroup[] = []

  if (tokens.length > 0) {
    let gq = supabase.from('guides').select('slug, title, description').eq('is_active', true)
    for (const t of tokens) gq = gq.or(buildOrFor(t, ['title', 'description']))
    const { data: gd } = await gq.limit(8)
    guideResults = gd ?? []

    let cq = supabase
      .from('comparisons')
      .select('slug, agent_a, agent_b, agent_c, category')
      .eq('is_active', true)
    for (const t of tokens) cq = cq.or(buildOrFor(t, ['agent_a', 'agent_b', 'category']))
    const { data: cd } = await cq.limit(8)
    comparisonResults = cd ?? []

    let dq = supabase.from('definitions').select('slug, title, description').eq('is_active', true)
    for (const t of tokens) dq = dq.or(buildOrFor(t, ['title', 'description']))
    const { data: dd } = await dq.limit(8)
    definitionResults = dd ?? []

    // Body text (`content`) is searched too, so a page that discusses the agent is found. Title
    // matches rank first, then intro matches, then body-only matches (2026-11-13).
    try {
      let aq = supabase.from('alternatives').select('slug, title, intro, content').eq('is_active', true)
      for (const t of tokens) aq = aq.or(buildOrFor(t, ['title', 'intro', 'content']))
      // Time-limited: ilike over long text timed out the whole search in May 2026 (commit 07c7d12c).
      // If this is ever slow, the alternatives section is skipped instead of holding up the page.
      const { data: adAll } = await aq.limit(30).abortSignal(AbortSignal.timeout(2000))
      const altRank = (a: any) => {
        const ti = (a.title || '').toLowerCase()
        const it = (a.intro || '').toLowerCase()
        return tokens.every((t) => ti.includes(t)) ? 0 : tokens.every((t) => it.includes(t)) ? 1 : 2
      }
      const ad = (adAll ?? [])
        .sort((x: any, y: any) => altRank(x) - altRank(y))
        .slice(0, 8)
        .map(({ content, ...rest }: any) => rest)
      // Resolve templates before the 120-character preview cut (same defect as the /alternatives hub, 2026-10-02).
      const altRefs = await buildRefMap(supabase, collectTemplateSlugs((ad ?? []).map((a: any) => a.intro)))
      alternativeResults = (ad ?? []).map((a: any) => ({ ...a, intro: a.intro ? resolveTemplates(a.intro, altRefs) : a.intro }))
    } catch {
      alternativeResults = []
    }

    try {
      const { data: ints } = await supabase.from('integrations').select('slug, name, description').eq('is_active', true).abortSignal(AbortSignal.timeout(2000))
      const nameHit = (i: any) => tokens.every((t) => (i.name || '').toLowerCase().includes(t))
      integrationResults = (ints ?? [])
        .filter((i: any) => {
          const haystack = ((i.name || '') + ' ' + (i.description || '')).toLowerCase()
          return tokens.every((t) => haystack.includes(t))
        })
        .sort((a: any, b: any) => Number(nameHit(b)) - Number(nameHit(a)))
        .slice(0, 6)
        .map((i: any) => ({
          slug: i.slug,
          title: `AI Agents With ${i.name} Integration`,
          description: i.description || `AI agents that integrate with ${i.name}.`,
        }))
    } catch {
      integrationResults = []
    }

    // Pages that cover an agent the search names. Only agents whose own name matches the query
    // (at most two), so a topic search such as "cold email" adds nothing here. Any failure leaves
    // this section empty rather than breaking the page.
    const q = rawQuery.toLowerCase()
    const namedAgents = agentResults
      .filter((a) => {
        const n = (a.name || '').toLowerCase()
        return n === q || tokens.every((t) => n.includes(t))
      })
      .slice(0, 2)
    for (const ag of namedAgents) {
      try {
        const guideSlugs = Object.entries(GUIDE_AGENTS)
          .filter(([, slugs]) => slugs.includes(ag.slug))
          .map(([g]) => g)
        const none = Promise.resolve({ data: [] as any[] })
        const t = () => AbortSignal.timeout(2000)
        const [gRes, caRes, cbRes, ccRes, altRes]: any[] = await Promise.all([
          guideSlugs.length > 0
            ? supabase.from('guides').select('slug, title').eq('is_active', true).in('slug', guideSlugs).abortSignal(t())
            : none,
          supabase.from('comparisons').select('slug, agent_a, agent_b, agent_c').eq('is_active', true).eq('agent_a', ag.name).limit(10).abortSignal(t()),
          supabase.from('comparisons').select('slug, agent_a, agent_b, agent_c').eq('is_active', true).eq('agent_b', ag.name).limit(10).abortSignal(t()),
          supabase.from('comparisons').select('slug, agent_a, agent_b, agent_c').eq('is_active', true).eq('agent_c', ag.name).limit(10).abortSignal(t()),
          supabase.from('alternatives').select('slug, title').eq('is_active', true).or(`agent_slug.eq.${ag.slug},agent_slugs.cs.{${ag.slug}}`).limit(10).abortSignal(t()),
        ])
        const links: CoverLink[] = []
        const cat = ag.primary_category as string | null
        if (cat && SLUG_TO_CATEGORY[cat]) links.push({ href: '/' + cat, label: SLUG_TO_CATEGORY[cat], kind: 'Category' })
        for (const g of gRes?.data ?? []) links.push({ href: '/resources/guides/' + g.slug, label: g.title, kind: 'Guide' })
        for (const c of [...(caRes?.data ?? []), ...(cbRes?.data ?? []), ...(ccRes?.data ?? [])]) {
          links.push({
            href: '/compare/' + c.slug,
            label: `${c.agent_a} vs ${c.agent_b}${c.agent_c ? ' vs ' + c.agent_c : ''}`,
            kind: 'Comparison',
          })
        }
        for (const a of altRes?.data ?? []) links.push({ href: '/alternatives/' + a.slug, label: a.title, kind: 'Alternatives' })
        const seen = new Set<string>()
        const unique = links.filter((l) => (seen.has(l.href) ? false : (seen.add(l.href), true)))
        coverGroups.push({ slug: ag.slug, name: ag.name, links: unique })
      } catch {
        // leave this agent out rather than fail the search page
      }
    }
  }

  // Same rule as the homepage: paying Featured Listing holders first, then the
  // other featured rows at random. Unrated rows do not fill the free slots.
  const { data: featuredPool } = await supabase
    .from('agents')
    .select('id, name, slug, developer, short_description, capability_tags, website_url, favicon_domain, logo_url, rating_avg, rating_count, editorial_rating, editorial_rating_notes, is_featured, submitted_tier')
    .eq('is_active', true)
    .eq('is_featured', true)
  const shuffle = <T,>(rows: T[]): T[] => rows.map((row) => ({ row, key: Math.random() })).sort((a, b) => a.key - b.key).map((x) => x.row)
  const featuredRows = featuredPool ?? []
  const featuredAgents = [
    ...shuffle(featuredRows.filter((a) => a.submitted_tier === 'managed')),
    ...shuffle(featuredRows.filter((a) => {
      const r = resolveRating(a)
      return a.submitted_tier !== 'managed' && !r.suppressed && r.value != null
    })),
  ].slice(0, 6)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'The AI Agent Index',
    url: 'https://theaiagentindex.com',
    description: 'Structured directory of AI agents for business automation',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://theaiagentindex.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }

  const shownHrefs = new Set<string>([
    ...guideResults.map((g: any) => '/resources/guides/' + g.slug),
    ...comparisonResults.map((c: any) => '/compare/' + c.slug),
    ...alternativeResults.map((a: any) => '/alternatives/' + a.slug),
  ])
  coverGroups = coverGroups
    .map((g) => ({ ...g, links: g.links.filter((l) => !shownHrefs.has(l.href)) }))
    .filter((g) => g.links.length > 0)
  const coverCount = coverGroups.reduce((n, g) => n + g.links.length, 0)

  const totalResults =
    coverCount +
    agentResults.length +
    guideResults.length +
    comparisonResults.length +
    definitionResults.length +
    integrationResults.length +
    alternativeResults.length

  const queryHadOnlyStopWords = rawQuery.length > 0 && tokens.length === 0

  return (
    <div className="sp-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className={'sp-band' + (rawQuery ? ' sp-band-q' : '')}>
        <div className="hp-wrap">
          {!rawQuery && <div className="hp-api-pill" style={{ marginBottom: '14px' }}><span />{totalAgents} agents indexed · public JSON API</div>}
          <h1 className="cp-h1">Search {totalAgents} AI agents</h1>
          {!rawQuery && <p className="sp-sub">Search by name, what it does, industry or use case.</p>}
          <form action="/search" method="GET" className="sp-form">
            <input type="search" name="q" defaultValue={rawQuery} aria-label="Search AI agents" placeholder="Try: cold email, recruiting" maxLength={200} className="sp-input" />
            <button type="submit" className="sp-btn">Search</button>
          </form>
          {!rawQuery && <div className="sp-links">
            <a href="#categories" className="hp-link">Browse by category</a>
            <a href="/submit" className="hp-link">Submit your agent</a>
            <a href="/api/agents" target="_blank" rel="noopener noreferrer" className="hp-api-link">GET /api/agents</a>
          </div>}
        </div>
      </section>

      {rawQuery && (
        <div className="hp-wrap" style={{ paddingTop: '1.75rem' }}>
          <p style={{ fontSize: '0.875rem', color: '#4B5563', marginBottom: '1rem' }}>
            {totalResults > 0
              ? `${totalResults} result${totalResults === 1 ? '' : 's'} for "${rawQuery}"`
              : `No results for "${rawQuery}"`}
            {usedFallback && agentResults.length > 0 && (
              <span style={{ color: '#9CA3AF', fontSize: '0.8125rem', marginLeft: '0.5rem' }}>
                — showing related agent types
              </span>
            )}
          </p>
          {queryHadOnlyStopWords && (
            <div style={{ backgroundColor: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '2rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#92400E', lineHeight: 1.6, margin: 0 }}>
                <strong>Try a more specific search.</strong> Words like "best", "ai", "agent", and "tools" appear in too many listings to be useful. Search for what the agent <em>does</em> (e.g. "outbound email", "contract review") or which industry it serves (e.g. "legal", "finance", "ecommerce").
              </p>
            </div>
          )}

          {!queryHadOnlyStopWords && totalResults === 0 && (
            <div style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.875rem', padding: '2rem', marginBottom: '2rem' }}>
              <p style={{ fontSize: '1rem', color: '#111827', fontWeight: 600, marginBottom: '0.5rem' }}>
                No matches for "{rawQuery}".
              </p>
              <p style={{ fontSize: '0.875rem', color: '#6B7280', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Browse a category or try one of these popular searches:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '0.5rem', marginBottom: '1.5rem' }}>
                {['outbound email', 'contract review', 'legal research', 'no-code workflow', 'cold email', 'recruiting', 'customer support'].map((term) => (
                  <a key={term} href={`/search?q=${encodeURIComponent(term)}`} style={{ fontSize: '0.8125rem', backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '0.4rem 0.75rem', borderRadius: '9999px', textDecoration: 'none' }}>
                    {term}
                  </a>
                ))}
              </div>
              <Link href="/find" style={{ fontSize: '0.875rem', color: '#2563EB', fontWeight: 500 }}>
                Or use AI Match to find an agent →
              </Link>
            </div>
          )}

          {agentResults.length > 0 && (
            <div style={{ marginBottom: '2.5rem' }}>
              <h2 className="sp-results-h">Agents {agentResults.length === 20 ? '(top 20)' : `(${agentResults.length})`}</h2>
              <div className="sp-cards">
                {agentResults.map((agent) => {
                  const r = resolveRating(agent)
                  return (
                    <Link key={agent.id} href={'/agents/' + agent.slug} className="sp-card">
                      <div className="sp-card-top">
                        <AgentLogo name={agent.name} websiteUrl={agent.website_url} faviconDomain={agent.favicon_domain} logoUrl={agent.logo_url} size="sm" />
                        <div style={{ minWidth: 0 }}>
                          <h3 className="sp-card-name">{agent.name}</h3>
                          <p className="sp-card-by">by {agent.developer}</p>
                        </div>
                        <span className="sp-card-rate">
                          {r.suppressed ? <span style={{ fontSize: '13px', color: '#4B5563' }}>On Our Radar</span> : r.value != null ? <span className="hp-star-num"><i>★</i>{r.value.toFixed(1)}</span> : null}
                        </span>
                      </div>
                      <p className="sp-card-desc">{agent.short_description}</p>
                      {agent.capability_tags && agent.capability_tags.length > 0 && (
                        <div className="sp-tags">
                          {agent.capability_tags.slice(0, 2).map((tag: string) => (
                            <span key={tag} className="sp-tag">{capabilityLabel(tag)}</span>
                          ))}
                        </div>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {coverGroups.map((g) => (
            <div key={'cover-' + g.slug} style={{ marginBottom: '2rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Pages that cover {g.name}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
                {g.links.map((l) => (
                  <a key={l.href} href={l.href} style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: '1px solid #E5E7EB', padding: '1rem 1.25rem', textDecoration: 'none', display: 'block' }}>
                    <span style={{ fontSize: '0.625rem', fontWeight: 700, backgroundColor: '#F3F4F6', color: '#374151', padding: '0.15rem 0.5rem', borderRadius: '9999px', textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'inline-block' }}>{l.kind}</span>
                    <h3 style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#111827', margin: 0 }}>{l.label}</h3>
                  </a>
                ))}
              </div>
            </div>
          ))}

          {integrationResults.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Integrations</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
                {integrationResults.map((integ) => (
                  <a key={integ.slug} href={'/integrations/' + integ.slug} style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: '1px solid #E5E7EB', padding: '1.25rem', textDecoration: 'none', display: 'block' }}>
                    <span style={{ fontSize: '0.625rem', fontWeight: 700, backgroundColor: '#FFF7ED', color: '#C2410C', padding: '0.15rem 0.5rem', borderRadius: '9999px', textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'inline-block' }}>Integration</span>
                    <h3 style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.25rem' }}>{integ.title}</h3>
                    <p style={{ fontSize: '0.8125rem', color: '#4B5563', lineHeight: 1.55 }}>{integ.description.length > 160 ? integ.description.slice(0, 160) + '...' : integ.description}</p>
                  </a>
                ))}
              </div>
            </div>
          )}

          {guideResults.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Guides</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
                {guideResults.map((guide) => (
                  <a key={guide.slug} href={'/resources/guides/' + guide.slug} style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: '1px solid #E5E7EB', padding: '1.25rem', textDecoration: 'none', display: 'block' }}>
                    <span style={{ fontSize: '0.625rem', fontWeight: 700, backgroundColor: '#FEF3C7', color: '#D97706', padding: '0.15rem 0.5rem', borderRadius: '9999px', textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'inline-block' }}>Guide</span>
                    <h3 style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.25rem' }}>{guide.title}</h3>
                    <p style={{ fontSize: '0.8125rem', color: '#4B5563', lineHeight: 1.55 }}>{guide.description && guide.description.length > 160 ? guide.description.slice(0, 160) + '...' : guide.description}</p>
                  </a>
                ))}
              </div>
            </div>
          )}

          {definitionResults.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Definitions</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
                {definitionResults.map((def) => (
                  <a key={def.slug} href={'/definitions/' + def.slug} style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: '1px solid #E5E7EB', padding: '1.25rem', textDecoration: 'none', display: 'block' }}>
                    <span style={{ fontSize: '0.625rem', fontWeight: 700, backgroundColor: '#F0FDF4', color: '#16A34A', padding: '0.15rem 0.5rem', borderRadius: '9999px', textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'inline-block' }}>Definition</span>
                    <h3 style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.25rem' }}>{def.title}</h3>
                    <p style={{ fontSize: '0.8125rem', color: '#4B5563', lineHeight: 1.55 }}>{def.description}</p>
                  </a>
                ))}
              </div>
            </div>
          )}

          {alternativeResults.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Alternatives</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
                {alternativeResults.map((alt: any) => (
                  <a key={alt.slug} href={'/alternatives/' + alt.slug} style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: '1px solid #E5E7EB', padding: '1.25rem', textDecoration: 'none', display: 'block' }}>
                    <span style={{ fontSize: '0.625rem', fontWeight: 700, backgroundColor: '#FDF4FF', color: '#7E22CE', padding: '0.15rem 0.5rem', borderRadius: '9999px', textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'inline-block' }}>Alternatives</span>
                    <h3 style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.25rem' }}>{alt.title}</h3>
                    <p style={{ fontSize: '0.8125rem', color: '#4B5563', lineHeight: 1.55 }}>{alt.intro && alt.intro.length > 120 ? alt.intro.slice(0, 120) + '...' : alt.intro}</p>
                  </a>
                ))}
              </div>
            </div>
          )}

          {comparisonResults.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Comparisons</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
                {comparisonResults.map((comp) => (
                  <a key={comp.slug} href={'/compare/' + comp.slug} style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: '1px solid #E5E7EB', padding: '1.25rem', textDecoration: 'none', display: 'block' }}>
                    <span style={{ fontSize: '0.625rem', fontWeight: 700, backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '0.15rem 0.5rem', borderRadius: '9999px', textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'inline-block' }}>Comparison</span>
                    <h3 style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.25rem' }}>
                      {comp.agent_a} vs {comp.agent_b}{comp.agent_c ? ' vs ' + comp.agent_c : ''}
                    </h3>
                    <p style={{ fontSize: '0.8125rem', color: '#4B5563', lineHeight: 1.55 }}>{comp.category}</p>
                  </a>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      <section id="categories" className="hp-section-tight" style={{ paddingTop: '48px' }}>
        <div className="hp-wrap">
          <div className="hp-head">
            <h2 className="hp-h2">Browse by category</h2>
          </div>
          <CategoryGrid rows={categoryRows} />
        </div>
      </section>

      {featuredAgents && featuredAgents.length > 0 && (
        <section className="hp-section hp-tint">
          <div className="hp-wrap">
            <h2 className="hp-h2">Featured agents</h2>
            <p className="hp-disclose">Affiliate partners and featured placements. Editorial scores are independent.</p>
            <div className="sp-cards">
              {featuredAgents.map((agent) => {
                const r = resolveRating(agent)
                return (
                  <Link key={agent.id} href={'/agents/' + agent.slug} className="sp-card">
                    <div className="sp-card-top">
                      <AgentLogo name={agent.name} websiteUrl={agent.website_url} faviconDomain={agent.favicon_domain} logoUrl={agent.logo_url} size="sm" />
                      <div style={{ minWidth: 0 }}>
                        <h3 className="sp-card-name">{agent.name}</h3>
                        <p className="sp-card-by">by {agent.developer}</p>
                      </div>
                      <span className="sp-card-rate">
                        {r.suppressed ? <span style={{ fontSize: '13px', color: '#4B5563' }}>On Our Radar</span> : r.value != null ? <span className="hp-star-num"><i>★</i>{r.value.toFixed(1)}</span> : null}
                      </span>
                    </div>
                    <p className="sp-card-desc">{agent.short_description}</p>
                    {agent.capability_tags && agent.capability_tags.length > 0 && (
                      <div className="sp-tags">
                        {agent.capability_tags.slice(0, 2).map((tag: string) => (
                          <span key={tag} className="sp-tag">{capabilityLabel(tag)}</span>
                        ))}
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <section className="hp-section">
        <div className="hp-wrap sp-cta">
          <div>
            <h2 className="hp-h3-lg">Built an AI agent?</h2>
            <p className="hp-body">List it free, or get a full audit for {getTier('review').price}.</p>
          </div>
          <a href="/submit" className="sp-cta-btn">Submit your agent</a>
        </div>
      </section>
    </div>
  )
}