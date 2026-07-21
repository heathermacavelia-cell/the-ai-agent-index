'use client'
import { useCompare } from '@/components/CompareProvider'
import AgentLogo from '@/components/AgentLogo'
import Link from 'next/link'
import { useEffect, useState, useRef, Suspense, ReactNode } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

interface AgentDetail {
  slug: string
  name: string
  developer: string
  short_description: string
  primary_category: string
  pricing_model: string
  starting_price: number | null
  editorial_rating: {
    sub_scores: {
      autonomous_capability: number
      integration_depth: number
      pricing_transparency: number
      independent_evidence: number
      setup_accessibility: number
    } | null
    total: number | string
    note?: string
  } | null
  best_for: string | null
  pros: string[] | null
  limitations: string[] | null
  deployment_method: string[] | null
  deployment_difficulty: string | null
  avg_setup_time: string | null
  integrations: string[] | null
  website_url: string | null
  favicon_domain: string | null
  customer_segment: string | null
  g2_rating: number | null
  g2_review_count: number | null
  github_stars: number | null
  mcp_compatible: boolean | null
  pricing_transparency: string | null
  contract_type: string | null
  data_training: string | null
  human_in_loop: string | null
  security_certifications: string[] | null
  capability_tags: string[] | null
}

interface SearchResult {
  slug: string
  name: string
  developer: string
  website_url: string | null
  favicon_domain: string | null
  primary_category: string
}

const CENTERED_KEYS = new Set(['developer', 'primary_category', 'editorial_rating', 'pricing', 'deployment_method', 'customer_segment', 'g2', 'deployment_difficulty', 'avg_setup_time', 'mcp_compatible', 'github_stars', 'pricing_transparency', 'contract_type', 'data_training', 'human_in_loop'])

function CompareBuildContent() {
  const { agents: boardAgents, addAgent, removeAgent, clearBoard, count } = useCompare()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [agentDetails, setAgentDetails] = useState<AgentDetail[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const [allAgents, setAllAgents] = useState<SearchResult[]>([])
  const [similar, setSimilar] = useState<SearchResult[]>([])
  const [showSearch, setShowSearch] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const initialized = useRef(false)

  // Load all agents for search
  useEffect(() => {
    fetch('/api/agents')
      .then(r => r.json())
      .then(data => setAllAgents(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [])

  // Initialize from URL params on first load
  useEffect(() => {
    if (initialized.current) return
    const urlSlugs = searchParams.get('agents')
    if (urlSlugs && allAgents.length > 0) {
      const slugList = urlSlugs.split(',').filter(Boolean)
      slugList.forEach(slug => {
        const match = allAgents.find(a => a.slug === slug)
        if (match) {
          addAgent({
            slug: match.slug,
            name: match.name,
            websiteUrl: match.website_url,
            faviconDomain: match.favicon_domain,
          })
        }
      })
      initialized.current = true
    }
  }, [searchParams, allAgents, addAgent])

  // Update URL when board changes
  useEffect(() => {
    if (count >= 2) {
      const slugStr = boardAgents.map(a => a.slug).join(',')
      const newUrl = '/compare/build?agents=' + slugStr
      window.history.replaceState(null, '', newUrl)
    } else if (count === 0) {
      window.history.replaceState(null, '', '/compare/build')
    }
  }, [boardAgents, count])

  // Fetch full details when board changes
  useEffect(() => {
    if (count === 0) {
      setAgentDetails([])
      setSimilar([])
      return
    }
    setLoading(true)
    const slugStr = boardAgents.map(a => a.slug).join(',')
    fetch('/api/compare?slugs=' + slugStr)
      .then(r => r.json())
      .then(data => {
        const safeData = Array.isArray(data) ? data : []
        // Preserve board order
        const ordered = boardAgents
          .map(ba => safeData.find((d: AgentDetail) => d.slug === ba.slug))
          .filter(Boolean) as AgentDetail[]
        setAgentDetails(ordered)

        // Find similar agents
        if (ordered.length > 0 && allAgents.length > 0) {
          const categories = [...new Set(ordered.map(a => a.primary_category))]
          const boardSlugs = new Set(ordered.map(a => a.slug))
          const suggestions = allAgents
            .filter(a => categories.includes(a.primary_category) && !boardSlugs.has(a.slug))
            .slice(0, 4)
          setSimilar(suggestions)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [boardAgents, count, allAgents])

  // Search filtering
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }
    const q = searchQuery.toLowerCase()
    const boardSlugs = new Set(boardAgents.map(a => a.slug))
    const results = allAgents
      .filter(a => !boardSlugs.has(a.slug) && (a.name.toLowerCase().includes(q) || a.developer?.toLowerCase().includes(q)))
      .slice(0, 8)
    setSearchResults(results)
  }, [searchQuery, allAgents, boardAgents])

  // Close search on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false)
        setSearchQuery('')
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleAddFromSearch = (agent: SearchResult) => {
    addAgent({
      slug: agent.slug,
      name: agent.name,
      websiteUrl: agent.website_url,
      faviconDomain: agent.favicon_domain,
    })
    setSearchQuery('')
    setShowSearch(false)
  }

  const ROW_LABELS = [
    { key: 'developer', label: 'Developer', section: 'overview' },
    { key: 'primary_category', label: 'Category', section: 'overview' },
    { key: 'editorial_rating', label: 'Editorial Rating', section: 'overview' },
    { key: 'g2', label: 'G2 Rating', section: 'overview' },
    { key: 'customer_segment', label: 'Customer Segment', section: 'overview' },
    { key: 'pricing', label: 'Pricing', section: 'pricing' },
    { key: 'pricing_transparency', label: 'Pricing Transparency', section: 'pricing' },
    { key: 'contract_type', label: 'Contract Type', section: 'pricing' },
    { key: 'best_for', label: 'Best For', section: 'fit' },
    { key: 'pros', label: 'Pros', section: 'fit' },
    { key: 'limitations', label: 'Limitations', section: 'fit' },
    { key: 'deployment_method', label: 'Deployment', section: 'technical' },
    { key: 'deployment_difficulty', label: 'Setup Difficulty', section: 'technical' },
    { key: 'avg_setup_time', label: 'Avg Setup Time', section: 'technical' },
    { key: 'mcp_compatible', label: 'MCP Compatible', section: 'technical' },
    { key: 'github_stars', label: 'GitHub Stars', section: 'technical' },
    { key: 'data_training', label: 'Data Training', section: 'trust' },
    { key: 'human_in_loop', label: 'Human in Loop', section: 'trust' },
    { key: 'security_certifications', label: 'Security Certs', section: 'trust' },
    { key: 'integrations', label: 'Key Integrations', section: 'technical' },
    { key: 'capability_tags', label: 'Capabilities', section: 'technical' },
  ]

  const SECTION_HEADERS: Record<string, string> = {
    overview: 'Overview',
    pricing: 'Pricing & Contract',
    fit: 'Fit & Assessment',
    technical: 'Technical Details',
    trust: 'Trust & Security',
  }

  function renderProsList(items: string[]): ReactNode {
    if (items.length === 0) return <span style={{ color: '#9CA3AF' }}>Not specified</span>
    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {items.map((item, idx) => (
          <li key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: idx < items.length - 1 ? '0.625rem' : 0, lineHeight: 1.5 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    )
  }

  function renderLimitationsList(items: string[]): ReactNode {
    if (items.length === 0) return <span style={{ color: '#9CA3AF' }}>Not specified</span>
    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {items.map((item, idx) => (
          <li key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: idx < items.length - 1 ? '0.625rem' : 0, lineHeight: 1.5 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    )
  }

  function renderBadge(value: string, color: 'green' | 'amber' | 'red' | 'blue' | 'gray'): ReactNode {
    const colors = {
      green: { bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0' },
      amber: { bg: '#FFFBEB', text: '#92400E', border: '#FDE68A' },
      red: { bg: '#FEF2F2', text: '#991B1B', border: '#FECACA' },
      blue: { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE' },
      gray: { bg: '#F3F4F6', text: '#374151', border: '#E5E7EB' },
    }
    const c = colors[color]
    return (
      <span style={{
        display: 'inline-block',
        padding: '0.2rem 0.625rem',
        backgroundColor: c.bg,
        color: c.text,
        border: '1px solid ' + c.border,
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: 600,
        textTransform: 'capitalize',
      }}>
        {value}
      </span>
    )
  }

  function getPricingTransparencyColor(val: string): 'green' | 'amber' | 'red' | 'gray' {
    if (val === 'public') return 'green'
    if (val === 'partial') return 'amber'
    if (val === 'quote-only' || val === 'not-public') return 'red'
    return 'gray'
  }

  function getCellContent(agent: AgentDetail, key: string): ReactNode {
    switch (key) {
      case 'developer': return agent.developer
      case 'primary_category': return agent.primary_category.replace('ai-', '').replace('-agents', '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
      case 'editorial_rating': {
        const total = agent.editorial_rating?.total
        if (total == null) return <span style={{ color: '#9CA3AF' }}>Not rated</span>
        // Suppressed agents come through as the string "On Our Radar" — render it as a pill.
        if (typeof total === 'string') return renderBadge(total, 'amber')
        return total + ' / 5'
      }
      case 'g2': {
        if (!agent.g2_rating) return <span style={{ color: '#9CA3AF' }}>No G2 listing</span>
        return (
          <div>
            <span style={{ fontWeight: 600 }}>{agent.g2_rating}/5</span>
            {agent.g2_review_count != null && (
              <span style={{ color: '#6B7280', fontSize: '0.75rem' }}> ({agent.g2_review_count} reviews)</span>
            )}
          </div>
        )
      }
      case 'customer_segment': return agent.customer_segment ? agent.customer_segment.toUpperCase() : <span style={{ color: '#9CA3AF' }}>Not specified</span>
      case 'pricing': return agent.pricing_model + (agent.starting_price ? ' (from $' + agent.starting_price + '/mo)' : '')
      case 'pricing_transparency': {
        if (!agent.pricing_transparency) return <span style={{ color: '#9CA3AF' }}>Not specified</span>
        return renderBadge(agent.pricing_transparency.replace('-', ' '), getPricingTransparencyColor(agent.pricing_transparency))
      }
      case 'contract_type': {
        if (!agent.contract_type) return <span style={{ color: '#9CA3AF' }}>Not specified</span>
        return renderBadge(agent.contract_type.replace('-', ' '), 'gray')
      }
      case 'best_for': return agent.best_for || <span style={{ color: '#9CA3AF' }}>Not specified</span>
      case 'pros': return renderProsList(Array.isArray(agent.pros) ? agent.pros : [])
      case 'limitations': return renderLimitationsList(Array.isArray(agent.limitations) ? agent.limitations : [])
      case 'deployment_method': {
        const methods = agent.deployment_method
        if (!methods || methods.length === 0) return <span style={{ color: '#9CA3AF' }}>Not specified</span>
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', justifyContent: 'center' }}>
            {methods.map((method, idx) => (
              <span key={idx} style={{
                display: 'inline-block',
                padding: '0.125rem 0.5rem',
                backgroundColor: '#F3F4F6',
                color: '#374151',
                borderRadius: '0.375rem',
                fontSize: '0.75rem',
                fontWeight: 500,
              }}>
                {method}
              </span>
            ))}
          </div>
        )
      }
      case 'deployment_difficulty': {
        if (!agent.deployment_difficulty) return <span style={{ color: '#9CA3AF' }}>Not specified</span>
        const diffColor = agent.deployment_difficulty === 'easy' ? 'green' : agent.deployment_difficulty === 'moderate' ? 'amber' : 'red'
        return renderBadge(agent.deployment_difficulty, diffColor)
      }
      case 'avg_setup_time': return agent.avg_setup_time || <span style={{ color: '#9CA3AF' }}>Not specified</span>
      case 'mcp_compatible': {
        if (agent.mcp_compatible === true) return renderBadge('Yes', 'green')
        if (agent.mcp_compatible === false) return renderBadge('No', 'gray')
        return <span style={{ color: '#9CA3AF' }}>Unknown</span>
      }
      case 'github_stars': {
        if (!agent.github_stars) return <span style={{ color: '#9CA3AF' }}>N/A</span>
        const formatted = agent.github_stars >= 1000 ? (agent.github_stars / 1000).toFixed(1).replace(/\.0$/, '') + 'K' : agent.github_stars.toString()
        return <span style={{ fontWeight: 600 }}>⭐ {formatted}</span>
      }
      case 'data_training': {
        if (!agent.data_training) return <span style={{ color: '#9CA3AF' }}>Not specified</span>
        const dtColor = agent.data_training === 'no' ? 'green' : agent.data_training === 'opt-out' ? 'amber' : agent.data_training === 'yes' ? 'red' : 'gray'
        return renderBadge(agent.data_training.replace('-', ' '), dtColor)
      }
      case 'human_in_loop': {
        if (!agent.human_in_loop) return <span style={{ color: '#9CA3AF' }}>Not specified</span>
        return renderBadge(agent.human_in_loop.replace(/-/g, ' '), 'gray')
      }
      case 'security_certifications': {
        const certs = agent.security_certifications
        if (!certs || certs.length === 0) return <span style={{ color: '#9CA3AF' }}>None confirmed</span>
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', justifyContent: 'center' }}>
            {certs.map((cert, idx) => (
              <span key={idx} style={{
                display: 'inline-block',
                padding: '0.125rem 0.4rem',
                backgroundColor: '#F0FDF4',
                color: '#15803D',
                border: '1px solid #BBF7D0',
                borderRadius: '0.25rem',
                fontSize: '0.6875rem',
                fontWeight: 500,
              }}>
                {cert}
              </span>
            ))}
          </div>
        )
      }
      case 'integrations': return agent.integrations?.slice(0, 6).join(', ') || <span style={{ color: '#9CA3AF' }}>Not specified</span>
      case 'capability_tags': {
        const tags = agent.capability_tags
        if (!tags || tags.length === 0) return <span style={{ color: '#9CA3AF' }}>Not specified</span>
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
            {tags.map((tag, idx) => (
              <span key={idx} style={{
                display: 'inline-block',
                padding: '0.125rem 0.4rem',
                backgroundColor: '#EFF6FF',
                color: '#1D4ED8',
                borderRadius: '0.25rem',
                fontSize: '0.6875rem',
                fontFamily: 'monospace',
              }}>
                {tag}
              </span>
            ))}
          </div>
        )
      }
      default: return ''
    }
  }

  // Group rows by section for rendering with headers
  let lastSection = ''

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem 6rem' }}>
      {/* Breadcrumb */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6B7280', marginBottom: '2rem' }}>
        <Link href="/" style={{ color: '#6B7280', textDecoration: 'none' }}>Home</Link>
        <span style={{ color: '#D1D5DB' }}>/</span>
        <Link href="/compare" style={{ color: '#6B7280', textDecoration: 'none' }}>Compare</Link>
        <span style={{ color: '#D1D5DB' }}>/</span>
        <span style={{ color: '#111827' }}>Build</span>
      </nav>

      {/* Header */}
      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
        Compare AI Agents
      </h1>
      <p style={{ color: '#6B7280', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '600px' }}>
        Add up to 4 agents and compare them side by side. Pricing, ratings, security, integrations, and editorial assessment in one view.
      </p>

      {/* Add agent search */}
      {count < 4 && (
        <div ref={searchRef} style={{ position: 'relative', marginBottom: '2rem', maxWidth: '400px' }}>
          <div
            onClick={() => setShowSearch(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.625rem 1rem',
              border: '1px solid #D1D5DB',
              borderRadius: '0.75rem',
              backgroundColor: 'white',
              cursor: 'text',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search agents to compare..."
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setShowSearch(true) }}
              onFocus={() => setShowSearch(true)}
              style={{
                border: 'none',
                outline: 'none',
                flex: 1,
                fontSize: '0.875rem',
                color: '#111827',
                backgroundColor: 'transparent',
              }}
            />
          </div>
          {showSearch && searchResults.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '0.75rem',
              marginTop: '0.25rem',
              boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
              zIndex: 50,
              maxHeight: '320px',
              overflowY: 'auto',
            }}>
              {searchResults.map(agent => (
                <button
                  key={agent.slug}
                  onClick={() => handleAddFromSearch(agent)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    padding: '0.625rem 1rem',
                    width: '100%',
                    textAlign: 'left',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    borderBottom: '1px solid #F3F4F6',
                    transition: 'background-color 0.1s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <AgentLogo name={agent.name} websiteUrl={agent.website_url} faviconDomain={agent.favicon_domain} size="sm" />
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>{agent.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{agent.developer}</div>
                  </div>
                  <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#2563EB', fontWeight: 500 }}>+ Add</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {count === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          backgroundColor: '#F9FAFB',
          borderRadius: '1rem',
          border: '2px dashed #D1D5DB',
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 1rem' }}>
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          <p style={{ fontSize: '1.125rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
            Your compare board is empty
          </p>
          <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '1.5rem' }}>
            Search above to add agents, or browse agent listings and click &quot;Add to Compare&quot; on any agent page.
          </p>
          <Link
            href="/ai-sales-agents"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.5rem 1.25rem',
              backgroundColor: '#2563EB',
              color: 'white',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            Browse Agents →
          </Link>
        </div>
      )}

      {/* Loading */}
      {loading && count > 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6B7280' }}>Loading comparison...</div>
      )}

      {/* Comparison grid */}
      {!loading && agentDetails.length > 0 && (
        <>
          {/* Clear + count */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>
              Comparing {agentDetails.length} agent{agentDetails.length > 1 ? 's' : ''}
            </p>
            <button
              onClick={clearBoard}
              style={{ fontSize: '0.8125rem', color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Clear board
            </button>
          </div>

          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              minWidth: agentDetails.length > 2 ? '700px' : 'auto',
            }}>
              {/* Agent header row */}
              <thead>
                <tr>
                  <th style={{ width: '160px', padding: '1rem 0.75rem', textAlign: 'left', borderBottom: '2px solid #E5E7EB', position: 'sticky', left: 0, backgroundColor: '#F9FAFB', zIndex: 1 }} />
                  {agentDetails.map(agent => (
                    <th key={agent.slug} style={{ padding: '1rem 0.75rem', textAlign: 'center', borderBottom: '2px solid #E5E7EB', backgroundColor: '#F9FAFB', minWidth: '180px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                        <AgentLogo name={agent.name} websiteUrl={agent.website_url} faviconDomain={agent.favicon_domain} size="md" />
                        <Link href={'/agents/' + agent.slug} style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', textDecoration: 'none' }}>
                          {agent.name}
                        </Link>
                        <button
                          onClick={() => removeAgent(agent.slug)}
                          style={{ fontSize: '0.6875rem', color: '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          Remove
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROW_LABELS.map((row, i) => {
                  const isCentered = CENTERED_KEYS.has(row.key)
                  const showSectionHeader = row.section !== lastSection
                  lastSection = row.section
                  return (
                    <>
                      {showSectionHeader && (
                        <tr key={'section-' + row.section}>
                          <td
                            colSpan={agentDetails.length + 1}
                            style={{
                              padding: '1rem 0.75rem 0.5rem',
                              fontSize: '0.6875rem',
                              fontWeight: 700,
                              color: '#9CA3AF',
                              textTransform: 'uppercase',
                              letterSpacing: '0.08em',
                              borderBottom: '1px solid #E5E7EB',
                              backgroundColor: 'white',
                            }}
                          >
                            {SECTION_HEADERS[row.section]}
                          </td>
                        </tr>
                      )}
                      <tr key={row.key} style={{ backgroundColor: i % 2 === 0 ? 'white' : '#F9FAFB' }}>
                        <td style={{
                          padding: '0.875rem 0.75rem',
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                          color: '#374151',
                          borderBottom: '1px solid #F3F4F6',
                          position: 'sticky',
                          left: 0,
                          backgroundColor: i % 2 === 0 ? 'white' : '#F9FAFB',
                          zIndex: 1,
                          verticalAlign: 'top',
                        }}>
                          {row.label}
                        </td>
                        {agentDetails.map(agent => (
                          <td key={agent.slug} style={{
                            padding: '0.875rem 0.75rem',
                            fontSize: '0.8125rem',
                            color: row.key === 'editorial_rating' && typeof agent.editorial_rating?.total === 'number' && agent.editorial_rating.total >= 4
                              ? '#059669'
                              : '#4B5563',
                            fontWeight: row.key === 'editorial_rating' ? 700 : 400,
                            borderBottom: '1px solid #F3F4F6',
                            textAlign: isCentered ? 'center' : 'left',
                            lineHeight: 1.5,
                            verticalAlign: 'top',
                          }}>
                            {getCellContent(agent, row.key)}
                          </td>
                        ))}
                      </tr>
                    </>
                  )
                })}
                {/* View full listing row */}
                <tr>
                  <td style={{ padding: '1rem 0.75rem', position: 'sticky', left: 0, backgroundColor: 'white', zIndex: 1 }} />
                  {agentDetails.map(agent => (
                    <td key={agent.slug} style={{ padding: '1rem 0.75rem', textAlign: 'center' }}>
                      <Link
                        href={'/agents/' + agent.slug}
                        style={{
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                          color: '#2563EB',
                          textDecoration: 'none',
                        }}
                      >
                        View full listing →
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Compare Similar */}
          {similar.length > 0 && count < 4 && (
            <div style={{ marginTop: '2.5rem', padding: '1.25rem', backgroundColor: '#F9FAFB', borderRadius: '0.75rem', border: '1px solid #E5E7EB' }}>
              <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '0.75rem' }}>
                Others comparing these also looked at:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {similar.map(agent => (
                  <button
                    key={agent.slug}
                    onClick={() => handleAddFromSearch(agent)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      padding: '0.375rem 0.75rem',
                      backgroundColor: 'white',
                      border: '1px solid #D1D5DB',
                      borderRadius: '9999px',
                      fontSize: '0.8125rem',
                      color: '#374151',
                      cursor: 'pointer',
                      transition: 'border-color 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = '#2563EB')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = '#D1D5DB')}
                  >
                    <AgentLogo name={agent.name} websiteUrl={agent.website_url} faviconDomain={agent.favicon_domain} size="sm" />
                    {agent.name}
                    <span style={{ color: '#2563EB', fontWeight: 600 }}>+</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Pre-built comparisons link */}
      <div style={{ marginTop: '3rem', padding: '1.25rem', backgroundColor: '#F9FAFB', borderRadius: '0.75rem', border: '1px solid #E5E7EB' }}>
        <p style={{ fontSize: '0.875rem', color: '#6B7280', lineHeight: 1.6, margin: 0 }}>
          <strong style={{ color: '#374151' }}>Looking for pre-built comparisons?</strong>{' '}
          Browse our <Link href="/compare" style={{ color: '#2563EB', fontWeight: 600 }}>editorial comparison pages</Link> for in-depth, side-by-side analysis of popular agent matchups.
        </p>
      </div>

      {/* Methodology note */}
      <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '1.5rem', lineHeight: 1.5 }}>
        All data sourced from The AI Agent Index. Editorial ratings reflect public signals including G2 reviews, product documentation, and verified user evidence.{' '}
        <Link href="/methodology" style={{ color: '#9CA3AF' }}>See our methodology</Link>.
      </p>
    </div>
  )
}
export default function CompareBuildPage() {
    return (
      <Suspense fallback={<div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem', color: '#6B7280' }}>Loading compare board...</div>}>
        <CompareBuildContent />
      </Suspense>
    )
  }