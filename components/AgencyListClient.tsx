'use client'
import { useState, useMemo } from 'react'
import type { Agency } from '@/types/agency'
import AgentLogo from '@/components/AgentLogo'
import Link from 'next/link'

const SERVICE_LABELS: Record<string, string> = {
  'ai-agent-building': 'AI Agent Building',
  'workflow-automation': 'Workflow Automation',
  'ai-strategy': 'AI Strategy',
  'chatbot-development': 'Chatbot Development',
  'data-pipeline': 'Data Pipeline',
  'ai-training': 'AI Training',
  'prompt-engineering': 'Prompt Engineering',
  'custom-integrations': 'Custom Integrations',
  'voice-agents': 'Voice Agents',
  'rag-development': 'RAG Development',
}

const TOOL_LABELS: Record<string, string> = {
  'make': 'Make',
  'n8n': 'n8n',
  'zapier': 'Zapier',
  'langchain': 'LangChain',
  'openai': 'OpenAI',
  'anthropic': 'Anthropic',
  'hubspot': 'HubSpot',
  'salesforce': 'Salesforce',
  'voiceflow': 'Voiceflow',
  'botpress': 'Botpress',
}

function StarRating({ avg, count }: { avg: number; count: number }) {
  if (avg === 0 && count === 0) return <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>No reviews yet</span>
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
      <span style={{ color: '#2563EB', fontSize: '0.8125rem' }}>★</span>
      <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#111827' }}>{avg.toFixed(1)}</span>
      <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>({count})</span>
    </div>
  )
}

export default function AgencyListClient({ agencies }: { agencies: Agency[] }) {
  const [search, setSearch] = useState('')
  const [activeService, setActiveService] = useState<string | null>(null)
  const [activeTool, setActiveTool] = useState<string | null>(null)

  const allServices = useMemo(() => {
    const set = new Set<string>()
    for (const a of agencies) for (const t of a.service_tags) set.add(t)
    return Array.from(set).sort()
  }, [agencies])

  const allTools = useMemo(() => {
    const set = new Set<string>()
    for (const a of agencies) for (const t of a.tool_specializations) set.add(t)
    return Array.from(set).sort()
  }, [agencies])

  const filtered = useMemo(() => {
    let list = agencies
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.short_description.toLowerCase().includes(q) ||
        a.headquarters?.toLowerCase().includes(q) ||
        a.tool_specializations.some(t => t.toLowerCase().includes(q))
      )
    }
    if (activeService) {
      list = list.filter(a => a.service_tags.includes(activeService))
    }
    if (activeTool) {
      list = list.filter(a => a.tool_specializations.includes(activeTool))
    }
    return list
  }, [agencies, search, activeService, activeTool])

  return (
    <div>
      {/* Search bar */}
      <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
        <svg style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }}
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="text"
          placeholder="Search agencies by name, location, or tools..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem',
            border: '1px solid #E5E7EB', borderRadius: '0.75rem',
            fontSize: '0.9375rem', color: '#111827', outline: 'none',
            boxSizing: 'border-box', background: 'white',
          }}
        />
      </div>

      {/* Filter pills - Services */}
      {allServices.length > 0 && (
        <div style={{ marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginRight: '0.5rem' }}>Services:</span>
          <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '0.375rem' }}>
            {allServices.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveService(activeService === tag ? null : tag)}
                style={{
                  padding: '0.25rem 0.625rem', borderRadius: '9999px',
                  fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer',
                  border: '1px solid', transition: 'all 0.15s',
                  backgroundColor: activeService === tag ? '#2563EB' : 'white',
                  color: activeService === tag ? 'white' : '#374151',
                  borderColor: activeService === tag ? '#2563EB' : '#E5E7EB',
                }}
              >
                {SERVICE_LABELS[tag] ?? tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filter pills - Tools */}
      {allTools.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginRight: '0.5rem' }}>Tools:</span>
          <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '0.375rem' }}>
            {allTools.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTool(activeTool === tag ? null : tag)}
                style={{
                  padding: '0.25rem 0.625rem', borderRadius: '9999px',
                  fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer',
                  border: '1px solid', transition: 'all 0.15s',
                  backgroundColor: activeTool === tag ? '#059669' : 'white',
                  color: activeTool === tag ? 'white' : '#374151',
                  borderColor: activeTool === tag ? '#059669' : '#E5E7EB',
                }}
              >
                {TOOL_LABELS[tag] ?? tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results count */}
      <p style={{ fontSize: '0.8125rem', color: '#6B7280', marginBottom: '1rem' }}>
        {filtered.length} {filtered.length === 1 ? 'agency' : 'agencies'} found
        {(activeService || activeTool || search.trim()) && (
          <button onClick={() => { setSearch(''); setActiveService(null); setActiveTool(null) }}
            style={{ marginLeft: '0.5rem', color: '#2563EB', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600 }}>
            Clear filters
          </button>
        )}
      </p>

      {/* Agency cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filtered.map(agency => (
          <Link key={agency.id} href={`/agencies/${agency.slug}`}
            style={{
              display: 'block', background: 'white', borderRadius: '0.75rem',
              border: agency.is_featured ? '2px solid #2563EB' : '1px solid #E5E7EB',
              padding: '1.25rem', textDecoration: 'none', color: 'inherit',
              transition: 'all 0.2s',
              boxShadow: agency.is_featured ? '0 0 0 1px rgba(37,99,235,0.1)' : 'none',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#93C5FD'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(37,99,235,0.08)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = agency.is_featured ? '#2563EB' : '#E5E7EB'; e.currentTarget.style.boxShadow = agency.is_featured ? '0 0 0 1px rgba(37,99,235,0.1)' : 'none' }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
              <AgentLogo name={agency.name} websiteUrl={agency.website_url} faviconDomain={agency.favicon_domain} size="md" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#111827', margin: 0 }}>{agency.name}</h3>
                  {agency.is_verified && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', padding: '0.125rem 0.5rem', borderRadius: '9999px', fontSize: '0.625rem', fontWeight: 700, backgroundColor: '#ECFDF5', color: '#059669', textTransform: 'uppercase', letterSpacing: '0.05em', border: '1px solid #A7F3D0' }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                      Verified
                    </span>
                  )}
                  {agency.is_featured && (
                    <span style={{ padding: '0.125rem 0.5rem', borderRadius: '9999px', fontSize: '0.625rem', fontWeight: 700, backgroundColor: '#EFF6FF', color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.05em', border: '1px solid #BFDBFE' }}>
                      Featured
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                  {agency.headquarters && (
                    <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>📍 {agency.headquarters}</span>
                  )}
                  {agency.team_size && (
                    <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>👥 {agency.team_size}</span>
                  )}
                  {agency.minimum_project_budget && (
                    <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>💰 Min. {agency.minimum_project_budget}</span>
                  )}
                </div>

                <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.6, margin: '0 0 0.75rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
                  {agency.short_description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                    {agency.tool_specializations.slice(0, 4).map(tool => (
                      <span key={tool} style={{ padding: '0.125rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.6875rem', fontWeight: 500, backgroundColor: '#F3F4F6', color: '#4B5563' }}>
                        {TOOL_LABELS[tool] ?? tool}
                      </span>
                    ))}
                    {agency.tool_specializations.length > 4 && (
                      <span style={{ padding: '0.125rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.6875rem', color: '#9CA3AF' }}>
                        +{agency.tool_specializations.length - 4}
                      </span>
                    )}
                  </div>
                  <StarRating avg={agency.rating_avg} count={agency.rating_count} />
                </div>
              </div>
            </div>
          </Link>
        ))}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#6B7280' }}>
            <p style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>No agencies match your filters.</p>
            <button onClick={() => { setSearch(''); setActiveService(null); setActiveTool(null) }}
              style={{ color: '#2563EB', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}