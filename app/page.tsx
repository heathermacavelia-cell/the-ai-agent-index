export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { CATEGORY_SLUGS } from '@/lib/taxonomy'
import type { Agent } from '@/types/agent'
import HeroSearch from '@/components/HeroSearch'
import AgentLogo from '@/components/AgentLogo'
import LatestChanges from '@/components/LatestChanges'
import McpMark from '@/components/McpMark'
import type { Metadata } from 'next'
import NewsletterSignup from '@/components/NewsletterSignup'
import RelatedGuides from '@/components/RelatedGuides'
import { parseSubScores, ratingPayload, resolveRating } from '@/lib/rating'
import { getActiveAgentCount } from '@/lib/agentCount'
import { categoryCountWord, getCatalogRows, getSiteStats, isInDate, longDate, ratingOf, shortDate, type CatalogRow } from '@/lib/siteStats'
import { formatCardPrice } from '@/lib/price'
import { getTier } from '@/lib/vendorPlans'

export async function generateMetadata(): Promise<Metadata> {
  const count = await getActiveAgentCount()
  const year = new Date().getFullYear()
  const cats = categoryCountWord()

  // No count means no number. Never fall back to a remembered figure.
  return {
    title: count
      ? `The AI Agent Index: Directory of ${count} AI Agents (${year})`
      : `The AI Agent Index: AI Agent Directory and Reviews (${year})`,
    description: count
      ? `Compare ${count} AI agents across ${cats} business categories, with verified pricing and integrations. Free to search. Independently researched.`
      : `Compare AI agents across ${cats} business categories, with verified pricing and integrations. Free to search. Independently researched.`,
    alternates: {
      canonical: 'https://theaiagentindex.com',
    },
  }
}

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'ai-sales-agents': 'Lead generation, outbound automation, pipeline intelligence',
  'ai-customer-support-agents': 'Ticket resolution, omnichannel support, autonomous helpdesk',
  'ai-research-agents': 'Deep research, academic literature, web synthesis',
  'ai-marketing-agents': 'Content creation, paid media, campaign automation',
  'ai-coding-agents': 'Code generation, agentic coding, IDE integration, terminals',
  'ai-hr-agents': 'Hiring, onboarding, payroll automation, compliance, workforce management',
  'ai-workflow-agents': 'Cross-app orchestration, browser RPA, no-code agent builders',
  'ai-customer-success-agents': 'Churn prevention, health scoring, renewal automation',
}

const CATEGORY_SHORT: Record<string, string> = {
  'ai-sales-agents': 'Sales',
  'ai-customer-support-agents': 'Customer Support',
  'ai-research-agents': 'Research',
  'ai-marketing-agents': 'Marketing',
  'ai-coding-agents': 'Coding',
  'ai-hr-agents': 'HR',
  'ai-workflow-agents': 'Workflow',
  'ai-customer-success-agents': 'Customer Success',
}

const MCP_LABELS: Record<string, string> = { server: 'Server', both: 'Server + client', client: 'Client' }

// The rating example must be a listing with no commercial tie to us. First one that
// qualifies today is shown. If none does, the section shows its text alone.
const RATING_EXAMPLE_SLUGS = ['deel', 'zoominfo', 'github-copilot']

async function getTopIntegrations() {
  const supabase = createClient()
  const { data: integrations } = await supabase
    .from('integrations')
    .select('slug, name')
    .eq('is_active', true)

  if (!integrations) return []

  const withCounts = await Promise.all(
    integrations.map(async (integration) => {
      const { count } = await supabase
        .from('agents')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)
        .contains('integrations', [integration.name])
      return { ...integration, count: count ?? 0 }
    })
  )

  return withCounts.sort((a, b) => b.count - a.count).slice(0, 7)
}

async function getAgencyCount(): Promise<number | null> {
  const supabase = createClient()
  const { count, error } = await supabase.from('agencies').select('id', { count: 'exact', head: true }).eq('is_active', true)
  return error ? null : count
}

async function getFeaturedAgents(): Promise<Agent[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('agents')
    .select('*')
    .eq('is_featured', true)
    .eq('is_active', true)
    .order('editorial_rating', { ascending: false, nullsFirst: false })
  return data ?? []
}

// Featured rotation, ruled by Heather 2026-09-27: the homepage table shows
// FEATURED_SLOTS listings, not every featured row. Paying Featured Listing
// holders (submitted_tier = 'managed') are always shown first; the remaining
// slots rotate at random among the other featured rows (affiliate banners).
// If more than FEATURED_SLOTS listings pay, the paying ones rotate among
// themselves. Uniform Fisher-Yates, as in Recently Verified below.
const FEATURED_SLOTS = 5

function shuffled<T>(rows: T[]): T[] {
  const out = rows.slice()
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

// A non-paying row already shown in Recently Verified is left out of the rotation,
// so one listing does not appear twice on the page.
function pickFeatured(all: Agent[], alreadyShown: Set<string>): Agent[] {
  const isPaid = (a: Agent) => (a as Agent & { submitted_tier?: string | null }).submitted_tier === 'managed'
  const paid = shuffled(all.filter(isPaid))
  const rest = shuffled(all.filter((a) => !isPaid(a) && !alreadyShown.has(a.slug)))
  return [...paid, ...rest].slice(0, FEATURED_SLOTS)
}

async function getRecentlyVerifiedAgents(): Promise<Agent[]> {
  const supabase = createClient()
  const { data: pool } = await supabase
    .from('agents')
    .select('*')
    .eq('is_active', true)
    .or('submitted_tier.in.(managed,legacy),vendor_managed.eq.true')
    .order('last_verified_at', { ascending: false })
  if (pool && pool.length > 0) return shuffled(pool as Agent[]).slice(0, 6)
  const { data } = await supabase
    .from('agents')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(6)
  return data ?? []
}

function topRatedInDate(rows: CatalogRow[], category: string): { row: CatalogRow; rating: number }[] {
  const now = Date.now()
  return rows
    .filter((r) => r.primary_category === category && isInDate(r, now))
    .map((row) => ({ row, rating: ratingOf(row) }))
    .filter((x): x is { row: CatalogRow; rating: number } => x.rating != null)
    .sort((a, b) => b.rating - a.rating || Date.parse(b.row.last_verified_at ?? '') - Date.parse(a.row.last_verified_at ?? ''))
    .slice(0, 3)
}

function ratingText(a: Agent): string {
  const r = resolveRating({
    editorial_rating: a.editorial_rating ?? null,
    editorial_rating_notes: a.editorial_rating_notes ?? null,
    rating_avg: a.rating_avg ?? null,
    rating_count: a.rating_count ?? null,
  })
  return r.suppressed || r.value == null ? 'On Our Radar' : r.value.toFixed(1)
}

function priceText(a: Agent): string {
  return formatCardPrice(a as unknown as Parameters<typeof formatCardPrice>[0], 'From ')
}

function Ticks({ score }: { score: number }) {
  return (
    <span className="hp-ticks" role="img" aria-label={score + ' of 5'}>
      {[1, 2, 3, 4, 5].map((n) => <i key={n} className={n <= score ? 'on' : ''} />)}
    </span>
  )
}

export default async function HomePage() {
  const [catalog, stats, topIntegrations, featuredAgents, recentAgents, agencyCount] = await Promise.all([
    getCatalogRows(),
    getSiteStats(),
    getTopIntegrations(),
    getFeaturedAgents(),
    getRecentlyVerifiedAgents(),
    getAgencyCount(),
  ])
  const rows = catalog ?? []
  const featuredRotation = pickFeatured(featuredAgents, new Set(recentAgents.map((a) => a.slug)))

  const logos: Record<string, { logo_url: string | null; website_url: string | null; favicon_domain: string | null }> = {}
  for (const r of rows) logos[r.slug] = { logo_url: r.logo_url, website_url: r.website_url, favicon_domain: r.favicon_domain }

  const example = RATING_EXAMPLE_SLUGS
    .map((slug) => rows.find((r) => r.slug === slug))
    .find((r) => r && r.is_affiliate !== true && r.vendor_managed !== true && isInDate(r) && ratingOf(r) != null && parseSubScores(r.editorial_rating_notes))
  const exampleScores = example ? parseSubScores(example.editorial_rating_notes) : null

  const topFeatured = featuredAgents[0]
  const footerSample = topFeatured
    ? (() => {
        const { community, ...editorial } = ratingPayload({
          editorial_rating: topFeatured.editorial_rating ?? null,
          editorial_rating_notes: topFeatured.editorial_rating_notes ?? null,
          rating_avg: topFeatured.rating_avg ?? null,
          rating_count: topFeatured.rating_count ?? null,
        })
        return {
          name: topFeatured.name,
          slug: topFeatured.slug,
          editorial_rating: editorial,
          ...(community ? { community_rating: community } : {}),
        }
      })()
    : null
  const footerJson = footerSample ? JSON.stringify([footerSample], null, 2) : null

  const categoryRows = Object.entries(CATEGORY_SLUGS).map(([displayName, slug]) => ({
    slug,
    displayName,
    count: stats?.perCategory[slug] ?? null,
    top: topRatedInDate(rows, slug),
    description: CATEGORY_DESCRIPTIONS[slug] ?? '',
  }))

  // These two say what the page IS: a searchable site, and a collection of the
  // category pages. No ratings and no agent-level data here - the listing pages
  // own those, and a rating copied to a second surface rots independently.
  const siteUrl = 'https://theaiagentindex.com'

  const webSiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'The AI Agent Index',
    url: siteUrl,
    description: 'Independent AI agent directory. Compare agents by capability, pricing, and integrations.',
    publisher: { '@id': siteUrl + '/#organization' },
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: siteUrl + '/search?q={search_term_string}' },
      'query-input': 'required name=search_term_string',
    },
  }

  const categoryListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'The AI Agent Index',
    url: siteUrl,
    description: `AI agents indexed across ${categoryCountWord()} business categories.`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: categoryRows.length,
      itemListElement: categoryRows.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.displayName,
        url: siteUrl + '/' + c.slug,
        description: c.description,
      })),
    },
  }

  const review = getTier('review')

  return (
    <div className="hp">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryListJsonLd) }} />

      <section className="hp-hero">
        <div className="hp-wrap hp-split">
          <div>
            <h1 className="hp-h1">The AI Agent Index</h1>
            <p className="hp-lede">Find the right AI agent for your team in minutes. Every audited listing is independently reviewed by capability, pricing, and integrations.</p>
            <p className="hp-sub">Dataset-first and machine-readable, designed to be cited by AI systems.</p>
            <HeroSearch />
            {stats && (
              <p className="hp-counts">
                <strong>{stats.agents}</strong> agents in {stats.categories} categories, <strong>{stats.rated}</strong> with a published rating, and <strong>{stats.mcpServers}</strong> with an official MCP server.
              </p>
            )}
          </div>
          <LatestChanges logos={logos} />
        </div>
      </section>

      <section id="categories" className="hp-section-tight">
        <div className="hp-wrap">
          <div className="hp-head">
            <h2 className="hp-h2">Browse by category</h2>
            <Link href="/search" className="hp-link">View all agents</Link>
          </div>
          <div className="hp-cat-head">
            <span>Category</span><span className="hp-right">Agents</span><span>Highest rated</span>
          </div>
          {categoryRows.map((c) => (
            <div key={c.slug} className="hp-cat-row">
              <div className="hp-min0">
                <a href={'/' + c.slug} className="hp-cat-name">{c.displayName}</a>
                <p className="hp-cat-desc">{c.description}</p>
              </div>
              <div className="hp-right hp-cat-count">{c.count ?? ''}</div>
              <div className="hp-cat-top">
                {c.top.map(({ row, rating }) => (
                  <Link key={row.id} href={'/agents/' + row.slug} className="hp-top-agent" aria-label={row.name + ', rated ' + rating.toFixed(1)}>
                    <AgentLogo name={row.name} logoUrl={row.logo_url} websiteUrl={row.website_url} faviconDomain={row.favicon_domain} size="xs" />
                    <span className="hp-top-name">{row.name}</span>
                    <strong>{rating.toFixed(1)}</strong>
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <div className="hp-cat-row">
            <div className="hp-min0">
              <a href="/ai-automation-agencies" className="hp-cat-name">AI Automation Agencies</a>
              <p className="hp-cat-desc">Firms you hire to build agents and automations for you</p>
            </div>
            <div className="hp-right hp-cat-count">{agencyCount ?? ''}</div>
            <div className="hp-14"><a href="/ai-automation-agencies" className="hp-link">Compare agencies by what they build, the tools they use and where they work</a></div>
          </div>
        </div>
      </section>

      <section className="hp-section hp-tint">
        <div className="hp-wrap hp-split hp-center">
          <div>
            <h2 className="hp-h2 hp-mb">How a rating is built</h2>
            <p className="hp-body-lg">Five criteria, one fixed formula, and the same formula for every listing. Scores cannot be purchased or influenced by vendor relationships.</p>
            <p className="hp-body">Re-audits check pricing, feature changes, G2 review counts, MCP status, security certifications, and product positioning against live vendor sources.</p>
            <Link href="/methodology" className="hp-link hp-strong">Read the methodology</Link>
          </div>
          {example && exampleScores && (
            <div className="hp-score">
              <div className="hp-score-top">
                <AgentLogo name={example.name} logoUrl={example.logo_url} websiteUrl={example.website_url} faviconDomain={example.favicon_domain} size="md" />
                <div className="hp-grow">
                  <Link href={'/agents/' + example.slug} className="hp-score-name">{example.name}</Link>
                  <p className="hp-muted-13">Verified {longDate(example.last_verified_at)}</p>
                </div>
                <p className="hp-score-num">{ratingOf(example)?.toFixed(1)}</p>
              </div>
              <div className="hp-score-grid">
                <span>Autonomous capability</span><span className="hp-weight">35%</span><Ticks score={exampleScores.autCap} />
                <span>Independent evidence</span><span className="hp-weight">30%</span><Ticks score={exampleScores.indEvid} />
                <span>Integration depth</span><span className="hp-weight">25%</span><Ticks score={exampleScores.intDepth} />
                <span>Pricing transparency</span><span className="hp-weight">5%</span><Ticks score={exampleScores.priceTrans} />
                <span>Setup accessibility</span><span className="hp-weight">5%</span><Ticks score={exampleScores.setupAcc} />
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="hp-section">
        <div className="hp-wrap">
          {featuredAgents.length > 0 && (
            <>
              <h2 className="hp-h2">Featured Agents</h2>
              <p className="hp-disclose">Affiliate partners and featured placements. Editorial scores are independent.</p>
              <div className="hp-ft-head"><span>Agent</span><span>Category</span><span>Rating</span><span>Starting price</span><span>MCP</span></div>
              {featuredRotation.map((a) => (
                <div key={a.id} className="hp-ft-row">
                  <div className="hp-ft-agent">
                    <AgentLogo name={a.name} logoUrl={(a as Agent & { logo_url?: string | null }).logo_url} websiteUrl={a.website_url} faviconDomain={a.favicon_domain} size="sm" />
                    <div className="hp-min0">
                      <Link href={'/agents/' + a.slug} className="hp-strong">{a.name}</Link>
                      <p className="hp-one hp-muted-14">{a.short_description}</p>
                    </div>
                  </div>
                  <span className="hp-ft-cat">{CATEGORY_SHORT[a.primary_category] ?? ''}</span>
                  <strong className="hp-ft-rating">{ratingText(a)}</strong>
                  <span className="hp-14">{priceText(a)}</span>
                  <span className="hp-ft-mcp">
                    {MCP_LABELS[(a as Agent & { mcp_status?: string }).mcp_status ?? ''] && <McpMark size={15} />}
                    {MCP_LABELS[(a as Agent & { mcp_status?: string }).mcp_status ?? ''] ?? ''}
                  </span>
                </div>
              ))}
            </>
          )}

          {recentAgents.length > 0 && (
            <>
              <div className="hp-head hp-mt">
                <h2 className="hp-h2">Recently Verified</h2>
                <Link href="/search" className="hp-link">View all agents</Link>
              </div>
              <p className="hp-disclose">Affiliate partners and featured placements. Editorial scores are independent.</p>
              <div className="hp-rv">
                {recentAgents.map((a) => (
                  <div key={a.id} className="hp-rv-item">
                    <div className="hp-rv-top">
                      <AgentLogo name={a.name} logoUrl={(a as Agent & { logo_url?: string | null }).logo_url} websiteUrl={a.website_url} faviconDomain={a.favicon_domain} size="sm" />
                      <div className="hp-grow hp-min0">
                        <Link href={'/agents/' + a.slug} className="hp-strong">{a.name}</Link>
                        <p className="hp-muted-13">{CATEGORY_SHORT[a.primary_category] ?? ''}</p>
                      </div>
                      <strong className="hp-rv-rating">{ratingText(a)}</strong>
                    </div>
                    <p className="hp-clamp2 hp-rv-text">{a.vendor_managed && a.vendor_hook ? a.vendor_hook : a.short_description}</p>
                    <p className="hp-rv-foot"><span>{priceText(a)}</span><span>Verified {shortDate(a.last_verified_at)}</span></p>
                  </div>
                ))}
              </div>
            </>
          )}
          <p className="hp-vendor-line">Building an AI agent? <Link href="/submit" className="hp-link">List it free, or get a full audit for {review.price}.</Link></p>
        </div>
      </section>

      <section className="hp-section-64 hp-tint">
        <div className="hp-wrap hp-split-even hp-start">
          <div>
            <h2 className="hp-h3-lg">Integrations</h2>
            <p className="hp-disclose">Find AI agents that connect natively with the tools your team already uses.</p>
            <div className="hp-ints">
              {topIntegrations.map((i) => (
                <a key={i.slug} href={'/integrations/' + i.slug} className="hp-int"><span>{i.name}</span><span className="hp-int-n">{i.count}</span></a>
              ))}
              <a href="/integrations" className="hp-link hp-int-all">View all integrations</a>
            </div>
          </div>
          <div>
            <h2 className="hp-h3-lg hp-with-mark"><McpMark size={26} />Agents with MCP servers</h2>
            <p className="hp-body-lg">{stats ? <><strong>{stats.mcpServers}</strong> agents publish</> : 'Agents that publish'} an official MCP server, so your own AI tools can connect to them directly.</p>
            <p className="hp-body">Every entry is verified against official vendor documentation only: community-built servers and third-party wrappers do not count.</p>
            <a href="/mcp-servers" className="hp-link hp-strong">Browse the MCP directory</a>
          </div>
        </div>
      </section>

      <section className="hp-section-64">
        <div className="hp-wrap hp-split-even hp-start">
          <div className="hp-guides">
            <RelatedGuides
              heading="Guides"
              slugs={['what-is-an-ai-agent', 'how-to-evaluate-an-ai-agent', 'best-ai-workflow-agents', 'best-ai-coding-agents', 'best-ai-agents-for-customer-support', 'best-ai-agents-for-finance', 'ai-agents-for-ecommerce', 'best-ai-agents-for-small-business']}
            />
          </div>
          <NewsletterSignup sourcePage="/" sourceType="homepage" />
        </div>
      </section>

      <section className="hp-dark">
        <div className="hp-wrap hp-split-even hp-center">
          <div>
            <h2 className="hp-h2 hp-mb">Built for AI systems, not just search engines</h2>
            <p className="hp-dark-lede">Most directories are SEO-only. This one is designed so AI systems can actually read and cite it.</p>
            <p className="hp-dark-body">JSON-LD schema, a <a href="/api/agents">public JSON API</a>, an <a href="/mcp-servers#connect">MCP server</a>, a structured taxonomy, clean URLs and a dynamic sitemap.</p>
            <p className="hp-dark-label">Where AI systems get their answers</p>
            <p className="hp-dark-names">ChatGPT, Claude, Perplexity, Gemini, Copilot, NotebookLM</p>
            <a href="/advertise#ai-citations" className="hp-dark-link">See the data</a>
          </div>
          {footerJson && <pre className="hp-json">{footerJson}</pre>}
        </div>
      </section>
    </div>
  )
}
