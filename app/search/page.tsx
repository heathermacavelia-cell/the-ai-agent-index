import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import type { Metadata } from 'next'
import AgentLogo from '@/components/AgentLogo'
import CategoryGrid, { buildCategoryRows } from '@/components/CategoryGrid'
import { getCatalogRows, getSiteStats } from '@/lib/siteStats'
import { getTier } from '@/lib/vendorPlans'
import { resolveRating } from '@/lib/rating'
import { buildRefMap, collectTemplateSlugs, resolveTemplates } from '@/lib/templates'
import { BROAD_TAGS } from '@/lib/taxonomy'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Search AI Agents',
  description: 'Search and filter AI agents by capability, industry, or integration across sales, support, research, marketing, coding, HR, and workflow automation.',
  alternates: {
    canonical: 'https://theaiagentindex.com/search',
  },
}

const INTEGRATIONS = [
  { slug: 'hubspot', title: 'Best AI Agents for HubSpot', description: 'AI agents that integrate natively with HubSpot CRM — covering sales automation, marketing, customer support, and revenue intelligence.' },
  { slug: 'salesforce', title: 'Best AI Agents for Salesforce', description: 'AI agents that connect directly to Salesforce — covering sales automation, service cloud, marketing cloud, and revenue operations.' },
  { slug: 'slack', title: 'Best AI Agents for Slack', description: 'AI agents that integrate with Slack for team notifications, workflow automation, and conversational AI inside your workspace.' },
  { slug: 'zapier', title: 'Best AI Agents for Zapier', description: 'AI agents that work with Zapier to automate cross-platform workflows without writing code.' },
  { slug: 'gmail', title: 'Best AI Agents for Gmail', description: 'AI agents that integrate with Gmail for email automation, outreach sequencing, and inbox management.' },
  { slug: 'microsoft-teams', title: 'Best AI Agents for Microsoft Teams', description: 'AI agents that integrate with Microsoft Teams for enterprise collaboration, notifications, and workflow automation.' },
]

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
      .select('id, name, slug, developer, short_description, search_text, capability_tags, industry_tags, website_url, favicon_domain, logo_url, agent_type, primary_category, pricing_model, is_featured, is_verified, editorial_rating')
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
      .select('id, name, slug, developer, short_description, search_text, capability_tags, industry_tags, website_url, favicon_domain, logo_url, agent_type, primary_category, pricing_model, is_featured, is_verified, editorial_rating')
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
        .select('id, name, slug, developer, short_description, search_text, capability_tags, industry_tags, website_url, favicon_domain, logo_url, agent_type, primary_category, pricing_model, is_featured, is_verified, editorial_rating')
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
  let integrationResults: typeof INTEGRATIONS = []

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

    let aq = supabase.from('alternatives').select('slug, title, intro').eq('is_active', true)
    for (const t of tokens) aq = aq.or(buildOrFor(t, ['title', 'intro']))
    const { data: ad } = await aq.limit(8)
    // Resolve templates before the 120-character preview cut (same defect as the /alternatives hub, 2026-10-02).
    const altRefs = await buildRefMap(supabase, collectTemplateSlugs((ad ?? []).map((a: any) => a.intro)))
    alternativeResults = (ad ?? []).map((a: any) => ({ ...a, intro: a.intro ? resolveTemplates(a.intro, altRefs) : a.intro }))

    integrationResults = INTEGRATIONS.filter((i) => {
      const haystack = (i.title + ' ' + i.description).toLowerCase()
      return tokens.every((t) => haystack.includes(t))
    })
  }

  const { data: featuredAgents } = await supabase
    .from('agents')
    .select('id, name, slug, developer, short_description, capability_tags, website_url, favicon_domain, logo_url, rating_avg, rating_count, editorial_rating, editorial_rating_notes, is_featured')
    .eq('is_active', true)
    .eq('is_featured', true)
    .limit(6)

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

  const totalResults =
    agentResults.length +
    guideResults.length +
    comparisonResults.length +
    definitionResults.length +
    integrationResults.length +
    alternativeResults.length

  const queryHadOnlyStopWords = rawQuery.length > 0 && tokens.length === 0

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="sp-band">
        <div className="hp-wrap">
          <div className="hp-api-pill"><span />{totalAgents} agents indexed · public JSON API</div>
          <h1 className="cp-h1" style={{ marginTop: '14px' }}>Search {totalAgents} AI agents</h1>
          <p className="sp-sub">Search by name, what it does, industry or use case.</p>
          <form action="/search" method="GET" className="sp-form">
            <input type="search" name="q" defaultValue={rawQuery} aria-label="Search AI agents" placeholder="For example: cold email, contract review, recruiting" maxLength={200} className="sp-input" />
            <button type="submit" className="sp-btn">Search</button>
          </form>
          <div className="sp-links">
            <a href="#categories" className="hp-link">Browse by category</a>
            <a href="/submit" className="hp-link">Submit your agent</a>
            <a href="/api/agents" target="_blank" rel="noopener noreferrer" className="hp-api-link">GET /api/agents</a>
          </div>
        </div>
      </section>

      {rawQuery && (
        <div className="hp-wrap" style={{ paddingTop: '3rem' }}>
          <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>
            {totalResults > 0
              ? `${totalResults} result${totalResults === 1 ? '' : 's'} for "${rawQuery}"`
              : `No results for "${rawQuery}"`}
            {usedFallback && agentResults.length > 0 && (
              <span style={{ color: '#9CA3AF', fontSize: '0.8125rem', marginLeft: '0.5rem' }}>
                — showing related agent types
              </span>
            )}
          </p>
          {tokens.length > 0 && (
            <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '1.5rem' }}>
              Searching for: {tokens.map((t) => (
                <span key={t} style={{ backgroundColor: '#F3F4F6', color: '#4B5563', padding: '0.15rem 0.5rem', borderRadius: '0.25rem', fontFamily: 'monospace', marginRight: '0.375rem', display: 'inline-block' }}>{t}</span>
              ))}
            </p>
          )}

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

          {integrationResults.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Integrations</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
                {integrationResults.map((integ) => (
                  <a key={integ.slug} href={'/integrations/' + integ.slug} style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: '1px solid #E5E7EB', padding: '1.25rem', textDecoration: 'none', display: 'block' }}>
                    <span style={{ fontSize: '0.625rem', fontWeight: 700, backgroundColor: '#FFF7ED', color: '#C2410C', padding: '0.15rem 0.5rem', borderRadius: '9999px', textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'inline-block' }}>Integration</span>
                    <h3 style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.25rem' }}>{integ.title}</h3>
                    <p style={{ fontSize: '0.8125rem', color: '#4B5563', lineHeight: 1.55 }}>{integ.description}</p>
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

          {agentResults.length > 0 && (
            <>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                Agents {agentResults.length === 20 ? '(top 20)' : `(${agentResults.length})`}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
                {agentResults.map((agent) => (
                  <a key={agent.id} href={'/agents/' + agent.slug} style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: '1px solid #E5E7EB', padding: '1.25rem', textDecoration: 'none', display: 'block' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
                      <AgentLogo name={agent.name} websiteUrl={agent.website_url} faviconDomain={agent.favicon_domain} logoUrl={agent.logo_url} size="sm" />
                      <div style={{ minWidth: 0 }}>
                        <h3 style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#111827', margin: 0 }}>{agent.name}</h3>
                        <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: 0 }}>by {agent.developer}</p>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: '#4B5563', lineHeight: 1.55, marginBottom: '0.75rem' }}>{agent.short_description}</p>
                    {agent.capability_tags && agent.capability_tags.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                        {agent.capability_tags.slice(0, 3).map((tag: string) => (
                          <span key={tag} style={{ fontSize: '0.6875rem', backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', fontFamily: 'monospace' }}>{tag}</span>
                        ))}
                      </div>
                    )}
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <section id="categories" className="hp-section-tight">
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
                          <span key={tag} className="sp-tag">{tag.replace(/[-_]/g, ' ')}</span>
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
    </>
  )
}