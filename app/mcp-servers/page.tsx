export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import type { Metadata } from 'next'
import McpServersList from '@/components/McpServersList'

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

      {/* Listings with search + category filters */}
      <section style={{ padding: '2.5rem 1.5rem 4rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {agents.length === 0 ? (
            <p style={{ color: '#9CA3AF', fontSize: '0.9375rem' }}>No verified MCP servers yet — check back soon.</p>
          ) : (
            <McpServersList agents={agents} />
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