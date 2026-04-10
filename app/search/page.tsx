import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import type { Metadata } from 'next'
import AgentLogo from '@/components/AgentLogo'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'The AI Agent Index — Structured Directory of AI Agents',
  description: 'The structured directory of AI agents for business automation. Dataset-first, machine-readable, designed to be cited by AI systems.',
  alternates: {
    canonical: 'https://theaiagentindex.com/search',
  },
}

const CATEGORIES = [
  { slug: 'ai-sales-agents', label: 'AI Sales Agents', description: 'Lead gen, outbound, pipeline automation', icon: 'sales' },
  { slug: 'ai-customer-support-agents', label: 'AI Support Agents', description: 'Ticket resolution, chat, escalation', icon: 'support' },
  { slug: 'ai-research-agents', label: 'AI Research Agents', description: 'Deep research, citations, literature review', icon: 'research' },
  { slug: 'ai-marketing-agents', label: 'AI Marketing Agents', description: 'Content, SEO, paid media, campaigns', icon: 'marketing' },
  { slug: 'ai-coding-agents', label: 'AI Coding Agents', description: 'Code generation, review, agentic dev', icon: 'coding' },
  { slug: 'ai-hr-agents', label: 'AI HR Agents', description: 'Hiring, onboarding, payroll, compliance', icon: 'hr' },
]

const INTEGRATIONS = [
  { slug: 'hubspot', title: 'Best AI Agents for HubSpot', description: 'AI agents that integrate natively with HubSpot CRM — covering sales automation, marketing, customer support, and revenue intelligence.' },
  { slug: 'salesforce', title: 'Best AI Agents for Salesforce', description: 'AI agents that connect directly to Salesforce — covering sales automation, service cloud, marketing cloud, and revenue operations.' },
  { slug: 'slack', title: 'Best AI Agents for Slack', description: 'AI agents that integrate with Slack for team notifications, workflow automation, and conversational AI inside your workspace.' },
  { slug: 'zapier', title: 'Best AI Agents for Zapier', description: 'AI agents that work with Zapier to automate cross-platform workflows without writing code.' },
  { slug: 'gmail', title: 'Best AI Agents for Gmail', description: 'AI agents that integrate with Gmail for email automation, outreach sequencing, and inbox management.' },
  { slug: 'microsoft-teams', title: 'Best AI Agents for Microsoft Teams', description: 'AI agents that integrate with Microsoft Teams for enterprise collaboration, notifications, and workflow automation.' },
]

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q?.trim() ?? ''
  const supabase = createClient()

  const { count: totalAgents } = await supabase.from('agents').select('*', { count: 'exact', head: true }).eq('is_active', true)

  const categoryCounts = await Promise.all(
    CATEGORIES.map(async (cat) => {
      const { count } = await supabase
        .from('agents')
        .select('*', { count: 'exact', head: true })
        .eq('primary_category', cat.slug)
        .eq('is_active', true)
      return { ...cat, count: count ?? 0 }
    })
  )

  const { data: searchResults } = query ? await supabase
    .from('agents')
    .select('*')
    .eq('is_active', true)
    .or('name.ilike.%' + query + '%,short_description.ilike.%' + query + '%,developer.ilike.%' + query + '%,capability_tags.cs.{' + query + '},industry_tags.cs.{' + query + '}')
    .limit(20) : { data: null }

  const [guidesRes, comparisonsRes, definitionsRes] = await Promise.all([
    query ? supabase.from('guides').select('slug, title, description').eq('is_active', true).or('title.ilike.%' + query + '%,description.ilike.%' + query + '%') : { data: [] },
    query ? supabase.from('comparisons').select('slug, agent_a, agent_b, category').eq('is_active', true).or('agent_a.ilike.%' + query + '%,agent_b.ilike.%' + query + '%,category.ilike.%' + query + '%') : { data: [] },
    query ? supabase.from('definitions').select('slug, title, description').eq('is_active', true).or('title.ilike.%' + query + '%,description.ilike.%' + query + '%') : { data: [] },
  ])

  const guideResults = guidesRes.data ?? []
  const comparisonResults = comparisonsRes.data ?? []
  const definitionResults = definitionsRes.data ?? []

  const lq = query.toLowerCase()
  const integrationResults = query ? INTEGRATIONS.filter(i =>
    i.title.toLowerCase().includes(lq) || i.description.toLowerCase().includes(lq)
  ) : []

  const { data: featuredAgents } = await supabase
    .from('agents')
    .select('*')
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

  const totalResults = (searchResults?.length ?? 0) + guideResults.length + comparisonResults.length + definitionResults.length + integrationResults.length

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <div style={{ backgroundColor: '#030712', borderBottom: '1px solid #1F2937', padding: '4rem 1.5rem 3rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#0F172A', border: '1px solid #1E3A5F', borderRadius: '9999px', padding: '0.3rem 0.875rem', marginBottom: '1.5rem' }}>
            <span style={{ width: '0.5rem', height: '0.5rem', backgroundColor: '#10B981', borderRadius: '50%', display: 'inline-block' }}/>
            <span style={{ color: '#60A5FA', fontSize: '0.75rem', fontFamily: 'monospace' }}>{totalAgents} agents indexed · public JSON API</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 800, color: 'white', lineHeight: 1.15, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            The AI Agent Index
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: '1.0625rem', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '560px', margin: '0 auto 2rem' }}>
            The structured directory of AI agents for business automation. Dataset-first, machine-readable, designed to be cited by AI systems.
          </p>
          <form action="/search" method="GET" style={{ maxWidth: '560px', margin: '0 auto 1.5rem' }}>
            <div style={{ position: 'relative' }}>
              <svg style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#6B7280', pointerEvents: 'none' }}
                width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input type="search" name="q" defaultValue={query} placeholder="Search by name, capability, industry, or use case..."
                style={{ width: '100%', padding: '0.875rem 8rem 0.875rem 3rem', backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '0.75rem', fontSize: '0.9375rem', color: 'white', outline: 'none', boxSizing: 'border-box' as const }}
              />
              <button type="submit"
                style={{ position: 'absolute', right: '0.375rem', top: '50%', transform: 'translateY(-50%)', padding: '0.5rem 1.25rem', backgroundColor: '#2563EB', color: 'white', border: 'none', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
                Search
              </button>
            </div>
          </form>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/submit" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 1rem', backgroundColor: '#0F172A', border: '1px solid #1E3A5F', borderRadius: '0.5rem', color: '#60A5FA', fontSize: '0.8125rem', textDecoration: 'none' }}>
              + Submit your agent
            </a>
            <a href="/api/agents" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 1rem', backgroundColor: '#0F172A', border: '1px solid #374151', borderRadius: '0.5rem', color: '#6B7280', fontSize: '0.8125rem', fontFamily: 'monospace', textDecoration: 'none' }}>
              GET /api/agents
            </a>
          </div>
        </div>
      </div>

      {/* Search results */}
      {query && (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem 0' }}>
          <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '1.5rem' }}>
            {totalResults > 0 ? totalResults + ' results for "' + query + '"' : 'No results for "' + query + '"'}
          </p>
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
          {comparisonResults.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Comparisons</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
                {comparisonResults.map((comp) => (
                  <a key={comp.slug} href={'/compare/' + comp.slug} style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: '1px solid #E5E7EB', padding: '1.25rem', textDecoration: 'none', display: 'block' }}>
                    <span style={{ fontSize: '0.625rem', fontWeight: 700, backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '0.15rem 0.5rem', borderRadius: '9999px', textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'inline-block' }}>Comparison</span>
                    <h3 style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.25rem' }}>{comp.agent_a} vs {comp.agent_b}</h3>
                    <p style={{ fontSize: '0.8125rem', color: '#4B5563', lineHeight: 1.55 }}>{comp.category}</p>
                  </a>
                ))}
              </div>
            </div>
          )}
          {searchResults && searchResults.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
              {searchResults.map((agent) => (
                <a key={agent.id} href={'/agents/' + agent.slug} style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: '1px solid #E5E7EB', padding: '1.25rem', textDecoration: 'none', display: 'block' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
                    <AgentLogo name={agent.name} websiteUrl={agent.website_url} faviconDomain={agent.favicon_domain} size="sm" />
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
          )}
        </div>
      )}

      {/* Categories */}
      <section style={{ backgroundColor: '#030712', borderTop: '1px solid #1F2937', borderBottom: '1px solid #1F2937' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Browse by function</p>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#F9FAFB' }}>Categories</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
            {categoryCounts.map((cat) => (
              <Link key={cat.slug} href={'/' + cat.slug} style={{ backgroundColor: '#0F172A', borderRadius: '0.875rem', border: '1px solid #1F2937', padding: '1.25rem', textDecoration: 'none', display: 'block' }}>
                <div style={{ marginBottom: '0.625rem' }}>
                  <img src={`/icons/icon-${cat.icon}.png`} alt={cat.label} style={{ width: '2rem', height: '2rem', objectFit: 'contain' }} />
                </div>
                <h3 style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#F9FAFB', marginBottom: '0.25rem' }}>{cat.label}</h3>
                <p style={{ fontSize: '0.75rem', color: '#6B7280', lineHeight: 1.5, marginBottom: '0.75rem' }}>{cat.description}</p>
                <p style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 500 }}>{cat.count} agents →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Agents */}
      {featuredAgents && featuredAgents.length > 0 && (
        <section style={{ backgroundColor: '#0F172A', borderBottom: '1px solid #1F2937' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Hand-picked</p>
              <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#F9FAFB' }}>Featured Agents</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {featuredAgents.map((agent) => {
                const rating = agent.rating_avg
                return (
                  <Link key={agent.id} href={'/agents/' + agent.slug} style={{ backgroundColor: '#1F2937', borderRadius: '0.875rem', border: '1px solid #374151', padding: '1.25rem', textDecoration: 'none', display: 'block' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', minWidth: 0 }}>
                        <AgentLogo name={agent.name} websiteUrl={agent.website_url} faviconDomain={agent.favicon_domain} size="sm" />
                        <div style={{ minWidth: 0 }}>
                          <h3 style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#F9FAFB', margin: 0 }}>{agent.name}</h3>
                          <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: 0 }}>by {agent.developer}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
                        <span style={{ color: '#2563EB', fontSize: '0.75rem' }}>★</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#F9FAFB' }}>{rating ? Number(rating).toFixed(1) : '—'}</span>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: '#9CA3AF', lineHeight: 1.55, marginBottom: '0.75rem' }}>{agent.short_description}</p>
                    {agent.capability_tags && agent.capability_tags.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                        {agent.capability_tags.slice(0, 3).map((tag: string) => (
                          <span key={tag} style={{ fontSize: '0.6875rem', backgroundColor: '#111827', color: '#6B7280', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', fontFamily: 'monospace' }}>{tag}</span>
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

      {/* Submit CTA */}
      <section style={{ backgroundColor: '#030712', borderBottom: '1px solid #1F2937' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' as const }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>Built an AI agent?</h2>
              <p style={{ color: '#9CA3AF', fontSize: '0.875rem', maxWidth: '480px', lineHeight: 1.6 }}>
                Get your agent in front of builders, buyers, and AI systems that reference this index. Submissions are free and go live immediately.
              </p>
            </div>
            <a href="/submit" style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', backgroundColor: '#2563EB', color: 'white', borderRadius: '0.625rem', fontWeight: 600, fontSize: '0.9375rem', textDecoration: 'none' }}>
              Submit your agent →
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ backgroundColor: '#0F172A' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem 4rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', textAlign: 'center' as const }}>
            {[
              { value: String(totalAgents), label: 'Agents indexed' },
              { value: '6', label: 'Categories' },
              { value: '30+', label: 'Schema fields' },
              { value: '1', label: 'JSON API endpoint' },
            ].map((stat) => (
              <div key={stat.label} style={{ backgroundColor: '#1F2937', borderRadius: '0.875rem', border: '1px solid #374151', padding: '1.5rem' }}>
                <p style={{ fontSize: '1.75rem', fontWeight: 800, color: '#F9FAFB', marginBottom: '0.25rem' }}>{stat.value}</p>
                <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}