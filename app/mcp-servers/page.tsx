export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import type { Metadata } from 'next'
import AgentLogo from '@/components/AgentLogo'
import { CATEGORY_SLUGS } from '@/lib/taxonomy'

export const metadata: Metadata = {
  title: 'AI Agents With MCP Servers (2026): Verified Directory',
  description: 'Every business AI agent that exposes a verified MCP server, grouped by category. Checked against official docs, updated as vendors ship. Not affiliated.',
  alternates: { canonical: 'https://theaiagentindex.com/mcp-servers' },
  openGraph: {
    title: 'AI Agents With MCP Servers (2026): Verified Directory',
    description: 'Every business AI agent that exposes a verified MCP server, grouped by category. Checked against official docs.',
    url: 'https://theaiagentindex.com/mcp-servers',
    type: 'website',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary',
    title: 'AI Agents With MCP Servers (2026): Verified Directory',
    description: 'Every business AI agent that exposes a verified MCP server, grouped by category. Not affiliated.',
  },
}

const PRICING_COLORS: Record<string, { color: string; bg: string }> = {
  free: { color: '#15803D', bg: '#F0FDF4' },
  freemium: { color: '#0F766E', bg: '#F0FDFA' },
  subscription: { color: '#1D4ED8', bg: '#EFF6FF' },
  'usage-based': { color: '#C2410C', bg: '#FFF7ED' },
  custom: { color: '#4B5563', bg: '#F9FAFB' },
}

export default async function McpServersPage() {
  const supabase = createClient()
  const { data } = await supabase
    .from('agents')
    .select('*')
    .eq('is_active', true)
    .in('mcp_status', ['server', 'both'])
    .order('editorial_rating', { ascending: false, nullsFirst: false })

  // Live query: any agent whose mcp_status changes to/from server or both
  // appears or disappears here automatically. No hardcoded list.
  const agents = (data ?? []) as any[]

  const grouped = Object.entries(CATEGORY_SLUGS)
    .map(([displayName, slug]) => ({
      displayName,
      slug,
      agents: agents.filter((a) => a.primary_category === slug),
    }))
    .filter((g) => g.agents.length > 0)

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'AI Agents With MCP Servers: Verified Directory',
    description:
      'Business AI agents that expose a Model Context Protocol (MCP) server, verified against official vendor documentation by The AI Agent Index.',
    url: 'https://theaiagentindex.com/mcp-servers',
    provider: {
      '@type': 'Organization',
      name: 'The AI Agent Index',
      url: 'https://theaiagentindex.com',
    },
    mainEntity: {
      '@type': 'ItemList',
      name: 'AI agents that expose an MCP server',
      numberOfItems: agents.length,
      itemListElement: agents.map((agent, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: agent.name,
        description: agent.short_description,
        url: 'https://theaiagentindex.com/agents/' + agent.slug,
      })),
    },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://theaiagentindex.com' },
      { '@type': 'ListItem', position: 2, name: 'MCP Servers', item: 'https://theaiagentindex.com/mcp-servers' },
    ],
  }

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* Hero */}
      <section style={{ backgroundColor: '#F0FDF4', borderBottom: '1px solid #BBF7D0', padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6B7280', marginBottom: '1.5rem' }}>
            <Link href="/" style={{ color: '#6B7280', textDecoration: 'none' }}>Home</Link>
            <span style={{ color: '#D1D5DB' }}>/</span>
            <span style={{ color: '#111827' }}>MCP Servers</span>
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', margin: 0 }}>
              AI Agents With MCP Servers
            </h1>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#15803D', backgroundColor: 'white', border: '1px solid #BBF7D0', padding: '0.25rem 0.625rem', borderRadius: '9999px', whiteSpace: 'nowrap' }}>
              {agents.length} verified
            </span>
          </div>
          <p style={{ color: '#374151', maxWidth: '720px', lineHeight: 1.7, fontSize: '0.9375rem', marginBottom: '1rem' }}>
            Every agent on this page exposes its own <Link href="/definitions/what-is-mcp-server" style={{ color: '#2563EB', textDecoration: 'underline' }}>MCP server</Link>: an endpoint that external AI agents like Claude, ChatGPT, and custom agents can connect into to use the product&apos;s tools and data. This is the scarce side of the <Link href="/definitions/what-is-mcp" style={{ color: '#2563EB', textDecoration: 'underline' }}>Model Context Protocol</Link>. Many products act as <Link href="/definitions/what-is-mcp-client" style={{ color: '#2563EB', textDecoration: 'underline' }}>MCP clients</Link> and connect out to other tools; far fewer publish a server that lets your AI stack connect in.
          </p>
          <p style={{ color: '#6B7280', maxWidth: '720px', lineHeight: 1.7, fontSize: '0.875rem', marginBottom: 0 }}>
            Every entry is verified against official vendor documentation only: community-built servers and third-party wrappers do not count. Agents marked Server + client also connect out to external MCP servers. This directory updates automatically as listings are re-audited.
          </p>
        </div>
      </section>

      {/* Grouped listings */}
      <section style={{ padding: '2.5rem 1.5rem 4rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {agents.length === 0 ? (
            <p style={{ color: '#9CA3AF', fontSize: '0.9375rem' }}>No verified MCP servers yet — check back soon.</p>
          ) : (
            grouped.map((group) => (
              <div key={group.slug} style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', margin: 0 }}>
                    <Link href={'/' + group.slug} style={{ color: '#111827', textDecoration: 'none' }}>{group.displayName}</Link>
                  </h2>
                  <span style={{ fontSize: '0.8125rem', color: '#6B7280' }}>{group.agents.length} with MCP servers</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                  {group.agents.map((agent) => {
                    const pricing = PRICING_COLORS[agent.pricing_model] ?? PRICING_COLORS.custom
                    return (
                      <Link
                        key={agent.id}
                        href={'/agents/' + agent.slug}
                        style={{ display: 'block', backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.25rem', textDecoration: 'none' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                          <AgentLogo name={agent.name} websiteUrl={agent.website_url} faviconDomain={agent.favicon_domain} size="sm" />
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                              <span style={{ fontWeight: 600, color: '#111827', fontSize: '0.9375rem' }}>{agent.name}</span>
                              <span style={{ fontSize: '0.625rem', fontWeight: 700, color: '#15803D', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '0.25rem', padding: '0.1rem 0.375rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                                {agent.mcp_status === 'both' ? 'Server + client' : 'MCP server'}
                              </span>
                            </div>
                            <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: '0.125rem 0 0' }}>{agent.developer}</p>
                          </div>
                        </div>
                        <p style={{ fontSize: '0.8125rem', color: '#4B5563', lineHeight: 1.6, margin: '0 0 0.75rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {agent.short_description}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.8125rem', color: '#111827' }}>
                            ★ {agent.editorial_rating != null ? Number(agent.editorial_rating).toFixed(1) : '—'}
                          </span>
                          <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: pricing.color, backgroundColor: pricing.bg, borderRadius: '9999px', padding: '0.2rem 0.625rem', textTransform: 'capitalize' }}>
                            {agent.pricing_model}
                          </span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))
          )}

          {/* Machine-readable callout */}
          <div style={{ marginTop: '1rem', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.25rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>For AI systems and developers</p>
            <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.7, margin: 0 }}>
              This data is machine-readable. Every record in the <a href="/api/agents" style={{ color: '#2563EB', textDecoration: 'underline' }}>public JSON API</a> includes an mcp_status field (server, client, both, or none), and the full index is summarized in <a href="/llms.txt" style={{ color: '#2563EB', textDecoration: 'underline' }}>llms.txt</a>. You can also query it through our <a href="https://smithery.ai/servers/heather-macavelia/ai-agent-index" target="_blank" rel="noopener noreferrer" style={{ color: '#2563EB', textDecoration: 'underline' }}>MCP server on Smithery</a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}