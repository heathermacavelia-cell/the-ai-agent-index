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
  'voice-ai': 'Voice AI',
  'rag-development': 'RAG Development',
  'process-automation': 'Process Automation',
  'data-analytics': 'Data Analytics',
  'cloud-optimization': 'Cloud Optimization',
  'rpa': 'RPA',
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
  'hugging-face': 'Hugging Face',
  'h2o-ai': 'H2O.ai',
  'Google Cloud': 'Google Cloud',
  'AWS': 'AWS',
  'Azure': 'Azure',
  'Python': 'Python',
  'React': 'React',
  'TypeScript': 'TypeScript',
  'FastAPI': 'FastAPI',
}

function agencySortScore(a: Agency): number {
  // Featured agencies always first
  if (a.is_featured) return 10000
  // Verified agencies next
  let score = a.vendor_claimed ? 5000 : 0
  // Clutch-rated agencies get priority, weighted by rating
  if (a.clutch_rating && a.clutch_rating > 0) {
    score += 1000 + (a.clutch_rating * 100)
  }
  // Site reviews as secondary signal
  if (a.rating_avg > 0 && a.rating_count > 0) {
    score += 500 + (a.rating_avg * 50) + (a.rating_count * 5)
  }
  // Profile completeness as tiebreaker
  if (a.tool_specializations.length > 0) score += 10
  if (a.minimum_project_budget) score += 10
  if (a.hourly_rate_range) score += 5
  if (a.clutch_url) score += 5
  if (a.linkedin_url) score += 5
  return score
}

function ClutchBadge({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
      <span style={{ color: '#E54B22', fontSize: '0.8125rem', fontWeight: 700 }}>★</span>
      <span style={{ fontWeight: 700, fontSize: '0.8125rem', color: '#E54B22' }}>Clutch {rating.toFixed(1)}</span>
    </div>
  )
}

function SiteRating({ avg, count }: { avg: number; count: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
      <span style={{ color: '#2563EB', fontSize: '0.8125rem' }}>★</span>
      <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#111827' }}>{avg.toFixed(1)}</span>
      <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>({count})</span>
    </div>
  )
}

function ClaimedBadge() {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
      padding: '0.15rem 0.625rem 0.15rem 0.15rem', borderRadius: '9999px',
      backgroundColor: '#DBEAFE', border: '1px solid #93C5FD',
    }}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: '1.125rem', height: '1.125rem', borderRadius: '9999px', backgroundColor: '#2563EB',
      }}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1D4ED8' }}>Verified</span>
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
    let list = [...agencies]
    if (search.trim()) {
      const q = search.toLowerCase()
      const LOCATION_EXPAND: Record<string, string[]> = {
        'toronto': ['ontario', 'canada', 'north america', 'global'],
        'vancouver': ['british columbia', 'bc', 'canada', 'north america', 'global'],
        'montreal': ['quebec', 'canada', 'north america', 'global'],
        'calgary': ['alberta', 'canada', 'north america', 'global'],
        'ottawa': ['ontario', 'canada', 'north america', 'global'],
        'kitchener': ['ontario', 'canada', 'north america', 'global'],
        'waterloo': ['ontario', 'canada', 'north america', 'global'],
        'new york': ['north america', 'united states', 'global'],
        'los angeles': ['north america', 'united states', 'global'],
        'chicago': ['north america', 'united states', 'global'],
        'san francisco': ['north america', 'united states', 'global'],
        'miami': ['north america', 'united states', 'global'],
        'austin': ['north america', 'united states', 'global'],
        'london': ['europe', 'uk', 'global'],
        'dubai': ['middle east', 'global'],
        'sydney': ['asia pacific', 'australia', 'global'],
        'melbourne': ['asia pacific', 'australia', 'global'],
      }
      const globalTerms = ['global', 'global / remote', 'remote']
      const expanded = LOCATION_EXPAND[q] ?? []
      const isLocationQuery = expanded.length > 0
      list = list.filter(a => {
        const nameMatch = a.name.toLowerCase().includes(q)
        const descMatch = a.short_description.toLowerCase().includes(q)
        const hqMatch = a.headquarters?.toLowerCase().includes(q)
        const toolMatch = a.tool_specializations.some(t => t.toLowerCase().includes(q))
        const serviceMatch = a.service_tags.some(t => (SERVICE_LABELS[t] ?? t).toLowerCase().includes(q))
        const regionMatch = a.regions_served.some(r => r.toLowerCase().includes(q))
        const expandedMatch = expanded.some(term => a.regions_served.some(r => r.toLowerCase().includes(term)))
        const expandedHqMatch = expanded.some(term => a.headquarters?.toLowerCase().includes(term))
        const isGlobal = a.regions_served.some(r => globalTerms.includes(r.toLowerCase()))
        if (isLocationQuery) {
          return regionMatch || expandedMatch || expandedHqMatch || hqMatch || isGlobal
        }
        return nameMatch || descMatch || hqMatch || toolMatch || serviceMatch || regionMatch
      })
    }
    if (activeService) {
      list = list.filter(a => a.service_tags.includes(activeService))
    }
    if (activeTool) {
      list = list.filter(a => a.tool_specializations.includes(activeTool))
    }
    // Sort by composite score descending
    list.sort((a, b) => agencySortScore(b) - agencySortScore(a))
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
        {filtered.map(agency => {
          const hasClutch = agency.clutch_rating != null && agency.clutch_rating > 0
          const hasSiteReviews = agency.rating_avg > 0 && agency.rating_count > 0
          const hasAnyRating = hasClutch || hasSiteReviews

          return (
            <Link key={agency.id} href={`/agencies/${agency.slug}`}
              style={{
                display: 'block', background: 'white', borderRadius: '0.75rem',
                border: agency.is_featured ? '2px solid #2563EB' : '1px solid #E5E7EB',
                padding: '1.25rem 1.5rem', textDecoration: 'none', color: 'inherit',
                transition: 'all 0.2s',
                boxShadow: agency.is_featured ? '0 0 0 1px rgba(37,99,235,0.1)' : 'none',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#93C5FD'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(37,99,235,0.08)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = agency.is_featured ? '#2563EB' : '#E5E7EB'; e.currentTarget.style.boxShadow = agency.is_featured ? '0 0 0 1px rgba(37,99,235,0.1)' : 'none' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <AgentLogo name={agency.name} websiteUrl={agency.website_url} faviconDomain={agency.favicon_domain} size="md" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Row 1: Name + badges */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.375rem' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '1.0625rem', color: '#111827', margin: 0 }}>{agency.name}</h3>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', padding: '0.125rem 0.5rem', borderRadius: '9999px', fontSize: '0.625rem', fontWeight: 700, backgroundColor: '#EFF6FF', color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.05em', border: '1px solid #BFDBFE' }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                      Independently Reviewed
                    </span>
                    {agency.vendor_claimed && <ClaimedBadge />}
                    {agency.is_featured && (
                      <span style={{ padding: '0.125rem 0.5rem', borderRadius: '9999px', fontSize: '0.625rem', fontWeight: 700, backgroundColor: '#EFF6FF', color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.05em', border: '1px solid #BFDBFE' }}>
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Row 2: Meta details */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap', marginBottom: '0.625rem', fontSize: '0.75rem', color: '#6B7280' }}>
                    {agency.headquarters && (
                      <span>📍 {agency.headquarters}</span>
                    )}
                    {agency.team_size && (
                      <span>👥 {agency.team_size}</span>
                    )}
                    {agency.founded_year && (
                      <span>Est. {agency.founded_year}</span>
                    )}
                    {agency.minimum_project_budget && (
                      <span>💰 Min. {agency.minimum_project_budget}</span>
                    )}
                    {agency.hourly_rate_range && (
                      <span>{agency.hourly_rate_range}/hr</span>
                    )}
                  </div>

                  {/* Row 3: Description */}
                  <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.6, margin: '0 0 0.75rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
                    {agency.short_description}
                  </p>

                  {/* Row 4: Service tags + tools + ratings */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', alignItems: 'center' }}>
                      {/* Service pills - up to 3 */}
                      {agency.service_tags.slice(0, 3).map(tag => (
                        <span key={tag} style={{ padding: '0.15rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.6875rem', fontWeight: 500, backgroundColor: '#EFF6FF', color: '#2563EB', border: '1px solid #DBEAFE' }}>
                          {SERVICE_LABELS[tag] ?? tag}
                        </span>
                      ))}
                      {agency.service_tags.length > 3 && (
                        <span style={{ fontSize: '0.6875rem', color: '#9CA3AF', paddingLeft: '0.125rem' }}>
                          +{agency.service_tags.length - 3}
                        </span>
                      )}

                      {/* Separator between services and tools */}
                      {agency.service_tags.length > 0 && agency.tool_specializations.length > 0 && (
                        <span style={{ color: '#E5E7EB', margin: '0 0.125rem' }}>·</span>
                      )}

                      {/* Tool pills - up to 3 */}
                      {agency.tool_specializations.slice(0, 3).map(tool => (
                        <span key={tool} style={{ padding: '0.15rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.6875rem', fontWeight: 500, backgroundColor: '#F3F4F6', color: '#4B5563' }}>
                          {TOOL_LABELS[tool] ?? tool}
                        </span>
                      ))}
                      {agency.tool_specializations.length > 3 && (
                        <span style={{ fontSize: '0.6875rem', color: '#9CA3AF', paddingLeft: '0.125rem' }}>
                          +{agency.tool_specializations.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Ratings - only show when there's something to show */}
                    {hasAnyRating && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                        {hasSiteReviews && (
                          <SiteRating avg={agency.rating_avg} count={agency.rating_count} />
                        )}
                        {hasClutch && (
                          <ClutchBadge rating={agency.clutch_rating!} />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          )
        })}

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