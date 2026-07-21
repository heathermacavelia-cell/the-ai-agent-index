export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { CATEGORY_SLUGS } from '@/lib/taxonomy'
import type { Agent } from '@/types/agent'
import MatchTeaser from '@/components/MatchTeaser'
import HeroSearch from '@/components/HeroSearch'
import AgentLogo from '@/components/AgentLogo'
import CategoryList from '@/components/CategoryList'
import FeaturedAgentsTable from '@/components/FeaturedAgentsTable'
import type { Metadata } from 'next'
import NewsletterSignup from '@/components/NewsletterSignup'
import { resolveRating, isOnOurRadar, ratingPayload } from '@/lib/rating'

export const metadata: Metadata = {
  title: 'The AI Agent Index: AI Agent Directory with 340+ Reviews (2026)',
  description: 'Compare 340+ AI agents for sales, support, coding, marketing, and HR. Independent reviews with verified pricing and integrations. Free to search. Not affiliated.',
  alternates: {
    canonical: 'https://theaiagentindex.com',
  },
}

const CATEGORY_META: Record<string, { description: string; color: string; lightColor: string; borderColor: string; accentColor: string }> = {
  'ai-sales-agents': { description: 'Lead generation, outbound automation, pipeline intelligence', color: 'text-emerald-700', lightColor: 'bg-emerald-50', borderColor: 'border-emerald-200', accentColor: '#10B981' },
  'ai-customer-support-agents': { description: 'Ticket resolution, omnichannel support, autonomous helpdesk', color: 'text-violet-700', lightColor: 'bg-violet-50', borderColor: 'border-violet-200', accentColor: '#7C3AED' },
  'ai-research-agents': { description: 'Deep research, academic literature, web synthesis', color: 'text-amber-700', lightColor: 'bg-amber-50', borderColor: 'border-amber-200', accentColor: '#D97706' },
  'ai-marketing-agents': { description: 'Content creation, paid media, campaign automation', color: 'text-rose-700', lightColor: 'bg-rose-50', borderColor: 'border-rose-200', accentColor: '#E11D48' },
  'ai-coding-agents': { description: 'Code generation, agentic coding, IDE integration, terminals', color: 'text-blue-700', lightColor: 'bg-blue-50', borderColor: 'border-blue-200', accentColor: '#2563EB' },
  'ai-hr-agents': { description: 'Hiring, onboarding, payroll automation, compliance, workforce management', color: 'text-teal-700', lightColor: 'bg-teal-50', borderColor: 'border-teal-200', accentColor: '#0D9488' },
  'ai-workflow-agents': { description: 'Cross-app orchestration, browser RPA, no-code agent builders', color: 'text-orange-700', lightColor: 'bg-orange-50', borderColor: 'border-orange-200', accentColor: '#EA580C' },
  'ai-customer-success-agents': { description: 'Churn prevention, health scoring, renewal automation', color: 'text-sky-600', lightColor: 'bg-sky-50', borderColor: 'border-sky-200', accentColor: '#0284C7' },
}


async function getCategoryCounts(): Promise<Record<string, number>> {
  const supabase = createClient()
  const counts: Record<string, number> = {}
  for (const slug of Object.values(CATEGORY_SLUGS)) {
    const { count } = await supabase.from('agents').select('*', { count: 'exact', head: true }).eq('primary_category', slug).eq('is_active', true)
    counts[slug] = count ?? 0
  }
  return counts
}

async function getCategoryTopAgents(): Promise<Record<string, { id: string; name: string; website_url: string | null; favicon_domain: string | null }[]>> {
  const supabase = createClient()
  const result: Record<string, { id: string; name: string; website_url: string | null; favicon_domain: string | null }[]> = {}
  for (const slug of Object.values(CATEGORY_SLUGS)) {
    const { data } = await supabase
      .from('agents')
      .select('id, name, website_url, favicon_domain, editorial_rating, editorial_rating_notes, rating_avg, rating_count')
      .eq('primary_category', slug)
      .eq('is_active', true)
      .not('editorial_rating', 'is', null)
      .order('editorial_rating', { ascending: false })
      .limit(8)
    result[slug] = (data ?? []).filter((a) => !isOnOurRadar(a)).slice(0, 4)
  }
  return result
}

async function getTopIntegrations() {
  const supabase = createClient()
  const { data: integrations } = await supabase
    .from('integrations')
    .select('slug, name, favicon_domain')
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

async function getRecentlyVerifiedAgents(): Promise<Agent[]> {
  const supabase = createClient()
  const { data: managed } = await supabase
    .from('agents')
    .select('*')
    .eq('is_active', true)
    .eq('vendor_managed', true)
    .order('last_verified_at', { ascending: false })
  if (managed && managed.length > 0) {
    const shuffled = managed.sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 6)
  }
  const { data } = await supabase
    .from('agents')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(6)
  return data ?? []
}


export default async function HomePage() {
  const counts = await getCategoryCounts()
  const categoryTopAgents = await getCategoryTopAgents()
  const topIntegrations = await getTopIntegrations()
  const featuredAgents = await getFeaturedAgents()
  const recentAgents = await getRecentlyVerifiedAgents()

  let totalAgents = 0
  for (const slug of Object.keys(counts)) {
    totalAgents += counts[slug]
  }

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
    : {
        name: 'Apollo.io',
        slug: 'apollo-io',
        editorial_rating: {
          sub_scores: { autonomous_capability: 4, integration_depth: 4, pricing_transparency: 4, independent_evidence: 5, setup_accessibility: 5 },
          total: 4.5,
        },
      }
  const footerJson = JSON.stringify([footerSample], null, 2)

  const categoryRows = Object.entries(CATEGORY_SLUGS).map(([displayName, slug]) => ({
    slug,
    displayName,
    count: counts[slug] ?? 0,
    topAgents: categoryTopAgents[slug] ?? [],
    description: CATEGORY_META[slug]?.description ?? '',
    accentColor: CATEGORY_META[slug]?.accentColor ?? '#2563EB',
  }))

  return (
    <div>
      <section className="bg-gray-950 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-900 border border-gray-700 text-gray-400 text-xs font-mono mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"/>{totalAgents} agents indexed · public JSON API
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight mb-5">The AI Agent Index</h1>
            <p className="text-lg text-gray-300 leading-relaxed mb-3 max-w-xl">Find the right AI agent for your team in minutes. Every listing is independently reviewed by capability, pricing, and integrations.</p>
            <p className="text-sm text-gray-500 leading-relaxed mb-8 max-w-xl">Dataset-first and machine-readable, designed to be cited by AI systems.</p>
            <HeroSearch />
          </div>
          <div className="mt-12 pt-10 border-t border-gray-800 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[{label:'AI agents indexed',value:String(totalAgents)},{label:'Business categories',value:'8'},{label:'Free to search',value:'100%'},{label:'Updated',value:'Daily'}].map(function(item){return <div key={item.label}><p className="text-2xl font-bold text-white">{item.value}</p><p className="text-sm text-gray-500 mt-0.5">{item.label}</p></div>})}
          </div>
        </div>
      </section>

      <section id="categories" style={{ backgroundColor: '#030712', borderBottom: '1px solid #1F2937' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 1.5rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.375rem' }}>Browse by function</p>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>Categories</h2>
          </div>
          <CategoryList rows={categoryRows} />
        </div>
      </section>

      <section><MatchTeaser /></section>

      <section style={{ borderTop: '1px solid #F3F4F6', backgroundColor: '#F9FAFB' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.375rem' }}>Browse by platform</p>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '0.375rem' }}>Integrations</h2>
              <p style={{ color: '#6B7280', fontSize: '0.9375rem' }}>Find AI agents that connect natively with the tools your team already uses.</p>
            </div>
            <a href='/integrations' style={{ fontSize: '0.875rem', color: '#2563EB', fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' }}>View all integrations →</a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem' }}>
            {topIntegrations.map(function(integration) {
              return (
                <a key={integration.slug} href={'/integrations/' + integration.slug} style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: '1px solid #E5E7EB', padding: '1.125rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  {integration.favicon_domain ? (
                    <img
                      src={'https://www.google.com/s2/favicons?domain=' + integration.favicon_domain + '&sz=64'}
                      alt={integration.name}
                      width={24}
                      height={24}
                      style={{ borderRadius: '0.25rem', flexShrink: 0 }}
                    />
                  ) : (
                    <div style={{ width: 24, height: 24, borderRadius: '0.25rem', backgroundColor: '#F3F4F6', flexShrink: 0 }} />
                  )}
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', margin: '0 0 0.125rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{integration.name}</p>
                    <p style={{ fontSize: '0.6875rem', color: '#2563EB', margin: 0 }}>{integration.count}+ agents</p>
                  </div>
                </a>
              )
            })}
          </div>
        </div>
      </section>

      {featuredAgents.length > 0 && (
        <section style={{ background: '#030712', borderTop: '1px solid #1F2937' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '72px 24px' }}>
            <div style={{ marginBottom: '40px' }}>
              <div style={{ display: 'inline-block', fontSize: '11px', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.1em', background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.25)', borderRadius: '999px', padding: '4px 14px', marginBottom: '20px' }}>
                ✦ Featured Listings
              </div>
              <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#F9FAFB', marginBottom: '8px', letterSpacing: '-0.02em' }}>Featured Agents</h2>
              <p style={{ fontSize: '16px', color: '#9CA3AF' }}>Affiliate partners and featured placements. Editorial scores are independent.</p>
            </div>
            <FeaturedAgentsTable agents={featuredAgents} />
          </div>
        </section>
      )}

      {recentAgents.length > 0 && (
        <section style={{ background: '#0F172A', borderTop: '1px solid #1F2937' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '72px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
              <div>
              <div style={{ display: 'inline-block', fontSize: '11px', fontWeight: 700, color: '#22C55E', textTransform: 'uppercase', letterSpacing: '0.1em', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '999px', padding: '4px 14px', marginBottom: '20px' }}>
                  ✦ Recently Verified
                </div>
                <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#F9FAFB', letterSpacing: '-0.02em' }}>Recently Verified</h2>
              </div>
              <Link href="/search" style={{ fontSize: '14px', fontWeight: 600, color: '#2563EB', textDecoration: 'none' }}>View all agents →</Link>
            </div>
            <div className="recent-grid">
            {recentAgents.map((agent) => {
                const r = resolveRating({
                  editorial_rating: agent.editorial_rating ?? null,
                  editorial_rating_notes: agent.editorial_rating_notes ?? null,
                  rating_avg: agent.rating_avg ?? null,
                  rating_count: agent.rating_count ?? null,
                })
                return (
                  <Link key={agent.id} href={`/agents/${agent.slug}`} style={{ display: 'block', background: '#1F2937', border: '1px solid #374151', borderRadius: '12px', padding: '20px', textDecoration: 'none', transition: 'border-color 0.15s' }} className="recent-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <AgentLogo name={agent.name} websiteUrl={agent.website_url} faviconDomain={agent.favicon_domain} size="sm" />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: 600, color: '#F9FAFB', fontSize: '14px' }}>{agent.name}</span>
                          {agent.vendor_managed && (() => {
                            const catColors: Record<string, string> = {
                              'ai-sales-agents': '#10B981',
                              'ai-customer-support-agents': '#7C3AED',
                              'ai-research-agents': '#D97706',
                              'ai-marketing-agents': '#E11D48',
                              'ai-coding-agents': '#2563EB',
                              'ai-hr-agents': '#0D9488',
                              'ai-workflow-agents': '#EA580C',
                              'ai-customer-success-agents': '#0284C7',
                            }
                            const catLabels: Record<string, string> = {
                              'ai-sales-agents': 'Sales',
                              'ai-customer-support-agents': 'Support',
                              'ai-research-agents': 'Research',
                              'ai-marketing-agents': 'Marketing',
                              'ai-coding-agents': 'Coding',
                              'ai-hr-agents': 'HR',
                              'ai-workflow-agents': 'Workflow',
                              'ai-customer-success-agents': 'Customer Success',
                            }
                            const color = catColors[agent.primary_category] ?? '#2563EB'
                            const label = catLabels[agent.primary_category] ?? 'Verified'
                            return (
                              <span style={{ fontSize: '9px', fontWeight: 700, color: color, backgroundColor: color + '18', border: '1px solid ' + color + '40', borderRadius: '4px', padding: '1px 6px', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                                ✓ {label}
                              </span>
                            )
                          })()}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>{agent.developer}</div>
                      </div>
                    </div>
                    <p style={{ fontSize: '13px', color: '#9CA3AF', lineHeight: '1.5', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{agent.vendor_managed && agent.vendor_hook ? agent.vendor_hook : agent.short_description}</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {r.suppressed ? (
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#D97706', background: 'rgba(217,119,6,0.1)', border: '1px solid rgba(217,119,6,0.25)', borderRadius: '4px', padding: '2px 6px' }}>On Our Radar</span>
                      ) : (
                        <span style={{ fontSize: '12px', color: '#F9FAFB' }}>★ {r.value != null ? r.value.toFixed(1) : '—'}</span>
                      )}
                      <span style={{ fontSize: '11px', fontWeight: 500, color: '#9CA3AF', background: '#111827', borderRadius: '999px', padding: '3px 10px', textTransform: 'capitalize' }}>{agent.pricing_model}</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <div style={{ padding: '3rem 0' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ borderRadius: '12px', overflow: 'hidden' }}>
            <NewsletterSignup sourcePage="/" sourceType="homepage" />
          </div>
        </div>
      </div>

      <section className="bg-gray-950 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3">Why this exists</p>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-snug">Built for AI systems, not just search engines</h2>
              <p className="text-gray-400 leading-relaxed mb-6">Most directories are SEO-only. This one is designed so AI systems can actually read and cite it.</p>
              <div className="flex flex-wrap gap-2 mb-8">{['JSON-LD schema','Public JSON API','MCP server','Structured taxonomy','Clean URLs','Dynamic sitemap'].map(function(tag){return <span key={tag} className="px-2.5 py-1 rounded-md bg-gray-900 border border-gray-700 text-gray-400 text-xs font-mono">{tag}</span>})}</div>

              {/* AI Citation Badge */}
              <div style={{ borderTop: '1px solid #1F2937', paddingTop: '1.5rem' }}>
              <p style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.875rem' }}>Where AI systems get their answers</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                  {[
                    { name: 'ChatGPT', domain: 'chatgpt.com' },
                    { name: 'Claude', domain: 'claude.ai' },
                    { name: 'Perplexity', domain: 'perplexity.ai' },
                    { name: 'Gemini', domain: 'gemini.google.com' },
                    { name: 'Copilot', domain: 'copilot.microsoft.com' },
                    { name: 'NotebookLM', domain: 'notebooklm.google.com' },
                  ].map(function(platform) {
                    return (
                      <div key={platform.name} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <img
                          src={'https://www.google.com/s2/favicons?domain=' + platform.domain + '&sz=32'}
                          alt={platform.name}
                          width={16}
                          height={16}
                          style={{ borderRadius: '3px', opacity: 0.85 }}
                        />
                        <span style={{ fontSize: '0.8125rem', color: '#9CA3AF', fontWeight: 500 }}>{platform.name}</span>
                      </div>
                    )
                  })}
                </div>
                <a href="/advertise#ai-citations" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: '#60A5FA', fontWeight: 500, textDecoration: 'none', marginTop: '1rem' }}>
                  See the data →
                </a>
              </div>
            </div>
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 font-mono text-sm overflow-x-auto">
              <pre className="text-gray-300 text-xs leading-relaxed">{footerJson}</pre>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}