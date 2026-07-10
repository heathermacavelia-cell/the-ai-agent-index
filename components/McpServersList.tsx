'use client'

import { useState } from 'react'
import Link from 'next/link'
import AgentLogo from '@/components/AgentLogo'
import { CATEGORY_SLUGS } from '@/lib/taxonomy'

const PRICING_COLORS: Record<string, { color: string; bg: string }> = {
  free: { color: '#15803D', bg: '#F0FDF4' },
  freemium: { color: '#0F766E', bg: '#F0FDFA' },
  subscription: { color: '#1D4ED8', bg: '#EFF6FF' },
  'usage-based': { color: '#C2410C', bg: '#FFF7ED' },
  custom: { color: '#4B5563', bg: '#F9FAFB' },
}

export default function McpServersList({ agents }: { agents: any[] }) {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const q = query.trim().toLowerCase()
  const filtered = agents.filter((a) => {
    if (activeCategory !== 'all' && a.primary_category !== activeCategory) return false
    if (q === '') return true
    return (
      (a.name ?? '').toLowerCase().includes(q) ||
      (a.developer ?? '').toLowerCase().includes(q) ||
      (a.short_description ?? '').toLowerCase().includes(q)
    )
  })

  // Category pills: only categories that actually have MCP servers, with live counts
  const categoryPills = Object.entries(CATEGORY_SLUGS)
    .map(([displayName, slug]) => ({
      displayName,
      slug,
      count: agents.filter((a) => a.primary_category === slug).length,
    }))
    .filter((c) => c.count > 0)

  const grouped = categoryPills
    .map((c) => ({
      ...c,
      agents: filtered.filter((a) => a.primary_category === c.slug),
    }))
    .filter((g) => g.agents.length > 0)

  const pillStyle = (active: boolean): React.CSSProperties => ({
    fontSize: '0.8125rem',
    fontWeight: 600,
    padding: '0.375rem 0.875rem',
    borderRadius: '9999px',
    border: '1px solid',
    borderColor: active ? '#15803D' : '#E5E7EB',
    backgroundColor: active ? '#15803D' : 'white',
    color: active ? 'white' : '#374151',
    cursor: 'pointer',
  })

  return (
    <div>
      {/* Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '2rem' }}>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by agent, developer, or keyword..."
          aria-label="Search MCP server agents"
          style={{
            width: '100%',
            maxWidth: '420px',
            padding: '0.625rem 0.875rem',
            fontSize: '0.875rem',
            border: '1px solid #E5E7EB',
            borderRadius: '0.625rem',
            outline: 'none',
            color: '#111827',
          }}
        />
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveCategory('all')} style={pillStyle(activeCategory === 'all')}>
            All ({agents.length})
          </button>
          {categoryPills.map((c) => (
            <button key={c.slug} onClick={() => setActiveCategory(c.slug)} style={pillStyle(activeCategory === c.slug)}>
              {c.displayName.replace('AI ', '').replace(' Agents', '')} ({c.count})
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p style={{ color: '#9CA3AF', fontSize: '0.9375rem' }}>
          No MCP server agents match your search.
        </p>
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
    </div>
  )
}