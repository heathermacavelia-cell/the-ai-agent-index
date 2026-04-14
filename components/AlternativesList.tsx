'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import AgentLogo from '@/components/AgentLogo'

interface Alternative {
  slug: string
  title: string
  intro: string
  agent_slug: string
}

interface Agent {
  slug: string
  name: string
  website_url: string
  favicon_domain: string
}

export default function AlternativesList({
  alternatives,
  agentMap,
}: {
  alternatives: Alternative[]
  agentMap: Record<string, Agent>
}) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query) return alternatives
    return alternatives.filter(alt =>
      alt.title.toLowerCase().includes(query.toLowerCase())
    )
  }, [alternatives, query])

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="Search alternatives, e.g. Apollo, Cursor..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '0.625rem 1rem',
            fontSize: '0.9375rem',
            border: '1px solid #E5E7EB',
            borderRadius: '0.5rem',
            outline: 'none',
            backgroundColor: 'white',
            color: '#111827',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {query && (
        <p style={{ fontSize: '0.8125rem', color: '#9CA3AF', marginBottom: '1rem' }}>
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#9CA3AF', backgroundColor: '#F9FAFB', borderRadius: '0.75rem', border: '1px solid #E5E7EB' }}>
            No alternatives found for &ldquo;{query}&rdquo;
          </div>
        ) : (
          filtered.map(alt => {
            const agent = agentMap[alt.agent_slug]
            return (
              <Link key={alt.slug} href={'/alternatives/' + alt.slug} style={{ textDecoration: 'none' }}>
                <div style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {agent && (
                    <div style={{ flexShrink: 0 }}>
                      <AgentLogo name={agent.name} websiteUrl={agent.website_url} faviconDomain={agent.favicon_domain} size="sm" />
                    </div>
                  )}
                  <div>
                    <h2 style={{ fontWeight: 700, fontSize: '1.0625rem', color: '#111827', marginBottom: '0.375rem' }}>{alt.title}</h2>
                    <p style={{ fontSize: '0.875rem', color: '#6B7280', lineHeight: 1.6, margin: 0 }}>{alt.intro.slice(0, 160)}...</p>
                  </div>
                </div>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}