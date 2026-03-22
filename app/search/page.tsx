import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'The AI Agent Index — Structured Directory of AI Agents',
  description: 'The structured directory of AI agents for business automation. Dataset-first, machine-readable, designed to be cited by AI systems.',
}

const CATEGORIES = [
  { slug: 'ai-sales-agents', label: 'AI Sales Agents', description: 'Lead gen, outbound, pipeline automation', icon: '💼' },
  { slug: 'ai-customer-support-agents', label: 'AI Support Agents', description: 'Ticket resolution, chat, escalation', icon: '🎧' },
  { slug: 'ai-research-agents', label: 'AI Research Agents', description: 'Deep research, citations, literature review', icon: '🔬' },
  { slug: 'ai-marketing-agents', label: 'AI Marketing Agents', description: 'Content, SEO, paid media, campaigns', icon: '📣' },
  { slug: 'ai-coding-agents', label: 'AI Coding Agents', description: 'Code generation, review, agentic dev', icon: '💻' },
]

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q?.trim() ?? ''
  const supabase = createClient()

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
    .select('id, name, slug, developer, short_description, primary_category, rating_avg, rating_count, is_featured, capability_tags')
    .eq('is_active', true)
    .or('name.ilike.%' + query + '%,short_description.ilike.%' + query + '%,developer.ilike.%' + query + '%')
    .limit(20) : { data: null }

  const { data: featuredAgents } = await supabase
    .from('agents')
    .select('id, name, slug, developer, short_description, primary_category, rating_avg, rating_count, is_featured, capability_tags')
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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div style={{ backgroundColor: '#030712', borderBottom: '1px solid #1F2937', padding: '4rem 1.5rem 3rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#0F172A', border: '1px solid #1E3A5F', borderRadius: '9999px', padding: '0.3rem 0.875rem', marginBottom: '1.5rem' }}>
            <span style={{ width: '0.5rem', height: '0.5rem', backgroundColor: '#10B981', borderRadius: '50%', display: 'inline-block' }}/>
            <span style={{ color: '#60A5FA', fontSize: '0.75rem', fontFamily: 'monospace' }}>50 agents indexed · public JSON API</span>
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
              <input type="search" name="q" placeholder="Search by name, capability, industry, or use case..."
                style={{ width: '100%', padding: '0.875rem 8rem 0.875rem 3rem', backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '0.75rem', fontSize: '0.9375rem', color: 'white', outline: 'none', boxSizing: 'border-box' }}
              />
              <button type="submit"
                style={{ position: 'absolute', right: '0.375rem', top: '50%', transform: 'translateY(-50%)', padding: '0.5rem 1.25rem', backgroundColor: '#2563EB', color: 'white', border: 'none', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
                Search
              </button>
            </div>
          </form>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/submit" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 1rem', backgroundColor: '#0F172A', border: '1px solid #1E3A5F', borderRadius: '0.5rem', color: '#60A5FA', fontSize: '0.8125rem', textDecoration: 'none', transition: 'all 0.15s' }}>
              + Submit your agent
            </a>
            <a href="/api/agents" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 1rem', backgroundColor: '#0F172A', border: '1px solid #374151', borderRadius: '0.5rem', color: '#6B7280', fontSize: '0.8125rem', fontFamily: 'monospace', textDecoration: 'none' }}>
              GET /api/agents
            </a>
          </div>
        </div>
      </div>

      {query && (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem 0' }}>
          <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '1.5rem' }}>
            {searchResults && searchResults.length > 0 ? searchResults.length + ' results for "' + query + '"' : 'No results for "' + query + '"'}
          </p>
          {searchResults && searchResults.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
              {searchResults.map((agent) => (
                <a key={agent.id} href={'/agents/' + agent.slug}
                  style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: '1px solid #E5E7EB', padding: '1.25rem', textDecoration: 'none', display: 'block' }}>
                  <h3 style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.25rem' }}>{agent.name}</h3>
                  <p style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '0.5rem' }}>by {agent.developer}</p>
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

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem 0' }}>
        <div style={{ marginBottom: '0.75rem' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Browse by function</p>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827' }}>Categories</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginTop: '1.25rem' }}>
          {categoryCounts.map((cat) => (
            <Link key={cat.slug} href={'/' + cat.slug}
              style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: '1px solid #E5E7EB', padding: '1.25rem', textDecoration: 'none', display: 'block', transition: 'all 0.15s' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.625rem' }}>{cat.icon}</div>
              <h3 style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.25rem' }}>{cat.label}</h3>
              <p style={{ fontSize: '0.75rem', color: '#6B7280', lineHeight: 1.5, marginBottom: '0.75rem' }}>{cat.description}</p>
              <p style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 500 }}>{cat.count} agents →</p>
            </Link>
          ))}
        </div>
      </div>

      {featuredAgents && featuredAgents.length > 0 && (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem 0' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Hand-picked</p>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827' }}>Featured Agents</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {featuredAgents.map((agent) => {
              const rating = agent.rating_avg
              return (
                <Link key={agent.id} href={'/agents/' + agent.slug}
                  style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: '1px solid #DBEAFE', padding: '1.25rem', textDecoration: 'none', display: 'block' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                      <h3 style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#111827' }}>{agent.name}</h3>
                      <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>by {agent.developer}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
                      <span style={{ color: '#2563EB', fontSize: '0.75rem' }}>★</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151' }}>{rating ? Number(rating).toFixed(1) : '—'}</span>
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
                </Link>
              )
            })}
          </div>
        </div>
      )}

      <div style={{ maxWidth: '1200px', margin: '3rem auto 0', padding: '0 1.5rem' }}>
        <div style={{ backgroundColor: '#030712', borderRadius: '1rem', padding: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>Built an AI agent?</h2>
            <p style={{ color: '#9CA3AF', fontSize: '0.875rem', maxWidth: '480px', lineHeight: 1.6 }}>
              Get your agent in front of builders, buyers, and AI systems that reference this index. Submissions are free and go live immediately.
            </p>
          </div>
          <a href="/submit"
            style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', backgroundColor: '#2563EB', color: 'white', borderRadius: '0.625rem', fontWeight: 600, fontSize: '0.9375rem', textDecoration: 'none' }}>
            Submit your agent →
          </a>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '3rem auto 0', padding: '0 1.5rem' }}>
        <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Guides · Comparisons · Newsletter</p>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827' }}>Resources</h2>
          </div>
          <a href="/resources" style={{ fontSize: '0.875rem', color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>View all →</a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {[
            { href: '/resources/comparisons', title: 'Comparisons', description: 'Side-by-side breakdowns of competing agents across categories.', icon: '⚖️', tag: 'Coming soon' },
            { href: '/resources/guides', title: 'Guides', description: 'How to evaluate, deploy, and get the most out of AI agents.', icon: '📖', tag: 'Coming soon' },
            { href: '/resources/newsletter', title: 'Newsletter', description: 'Weekly digest of agents gaining community trust and builder wins.', icon: '📬', tag: 'Coming soon' },
          ].map((item) => (
            <div key={item.href} style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: '1px solid #E5E7EB', padding: '1.25rem' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.625rem' }}>{item.icon}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                <h3 style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#111827' }}>{item.title}</h3>
                <span style={{ fontSize: '0.625rem', backgroundColor: '#F3F4F6', color: '#6B7280', padding: '0.15rem 0.5rem', borderRadius: '9999px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.tag}</span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: '#6B7280', lineHeight: 1.55 }}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '3rem auto', padding: '0 1.5rem 4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', textAlign: 'center' }}>
          {[
            { value: '50', label: 'Agents indexed' },
            { value: '5', label: 'Categories' },
            { value: '30+', label: 'Schema fields' },
            { value: '1', label: 'JSON API endpoint' },
          ].map((stat) => (
            <div key={stat.label} style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: '1px solid #E5E7EB', padding: '1.5rem' }}>
              <p style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginBottom: '0.25rem' }}>{stat.value}</p>
              <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}