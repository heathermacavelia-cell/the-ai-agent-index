'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import AgentLogo from '@/components/AgentLogo'
import McpMark from '@/components/McpMark'
import { formatCardPrice, type PriceInfo } from '@/lib/price'
import CompareCardButton from '@/components/CompareCardButton'
import { resolveRating } from '@/lib/rating'
import { INDUSTRY_SLUGS } from '@/lib/taxonomy'

interface Agent {
  id: string
  name: string
  slug: string
  developer: string
  website_url?: string | null
  favicon_domain?: string | null
  logo_url?: string | null
  mcp_status?: string | null
  billing_period?: string | null
  price_unit?: string | null
  price_currency?: string | null
  short_description: string
  primary_category: string
  agent_type?: string | null
  pricing_model: string
  starting_price: number | null
  customer_segment: string
  rating_avg: number
  rating_count: number
  editorial_rating: number | null
  is_featured: boolean
  mcp_compatible: boolean | null
  capability_tags: string[]
  industry_tags: string[]
  editorial_rating_notes?: string | null
}

const MCP_LABELS: Record<string, string> = { server: 'Server', both: 'Server + client', client: 'Client' }

const INDUSTRY_DISPLAY: Record<string, string> = {
  'saas': 'SaaS',
  'ecommerce': 'Ecommerce',
  'real-estate': 'Real Estate',
  'legal': 'Legal',
  'finance': 'Finance',
  'healthcare': 'Healthcare',
  'insurance': 'Insurance',
  'b2b': 'B2B',
  'enterprise': 'Enterprise',
  'smb': 'SMB',
  'startups': 'Startups',
  'devtools': 'DevTools',
  'pharma': 'Pharma',
  'retail': 'Retail',
  'dtc': 'DTC',
  'agencies': 'Agencies',
  'open-source': 'Open Source',
  'cloud': 'Cloud',
  'hr': 'HR', 'aws': 'AWS',
}

// The industry pills used to be a hardcoded list per category, which drifted:
// it offered SaaS, B2B and SMB as industries and its "More industries" link
// pointed at a segment page. They are now counted from the agents on the page,
// verticals only, so a pill never leads anywhere empty. 2026-09-12.
const VERTICAL_SLUGS = new Set(Object.values(INDUSTRY_SLUGS))

// Acronyms that should appear uppercase in agent_type labels.
// Any token in a kebab-cased agent_type slug that matches one of these
// gets uppercased rather than title-cased. Add new acronyms here as they
// appear in agent_type values; everything else auto-formats correctly.
const AGENT_TYPE_ACRONYMS = new Set([
  'ai', 'sdr', 'crm', 'seo', 'ide', 'rpa', 'mcp', 'hr', 'hris',
  'b2b', 'gtm', 'kyc', 'ats', 'erp', 'sso', 'saas',
])

function formatAgentTypeLabel(slug: string): string {
  return slug
    .split('-')
    .map(token => AGENT_TYPE_ACRONYMS.has(token.toLowerCase())
      ? token.toUpperCase()
      : token.charAt(0).toUpperCase() + token.slice(1))
    .join(' ')
}

type SortOption = 'rating_desc' | 'price_asc' | 'price_desc'

// The number on the row, or -1 for On Our Radar so those sort last. Sorting and display must read
// the same rule: "Top rated" used to sort on a different figure from the one printed.
function shownRating(agent: Agent): number {
  const r = resolveRating({
    editorial_rating: agent.editorial_rating,
    editorial_rating_notes: agent.editorial_rating_notes ?? null,
    rating_avg: agent.rating_avg,
    rating_count: agent.rating_count,
  })
  return r.suppressed || r.value == null ? -1 : r.value
}

export default function CategoryPageClient({ agents, categorySlug }: { agents: Agent[]; categorySlug?: string }) {
  const [sort, setSort] = useState<SortOption>('rating_desc')
  const [selectedAgentType, setSelectedAgentType] = useState<string | null>(null)

  // Compute the distinct agent_type values present in this category, sorted
  // alphabetically. Null/empty types are excluded so they don't render as a
  // blank pill. The pill row is only shown if 2+ distinct types exist —
  // otherwise filtering would be meaningless.
  const availableAgentTypes = useMemo(() => {
    const types = new Set<string>()
    for (const a of agents) {
      if (a.agent_type && a.agent_type.trim().length > 0) {
        types.add(a.agent_type)
      }
    }
    return Array.from(types).sort()
  }, [agents])

  // Filter first (by agent_type), then sort. Sort is stable so ties preserve
  // input order. If selectedAgentType is null, no filter is applied.
  const filteredAndSorted = useMemo(() => {
    let list = agents
    if (selectedAgentType) {
      list = list.filter(a => a.agent_type === selectedAgentType)
    }
    list = [...list]
    if (sort === 'rating_desc') {
      return list.sort((a, b) => shownRating(b) - shownRating(a))
    }
    if (sort === 'price_asc') {
      return list.sort((a, b) => {
        const aPrice = a.starting_price ?? Infinity
        const bPrice = b.starting_price ?? Infinity
        return aPrice - bPrice
      })
    }
    if (sort === 'price_desc') {
      return list.sort((a, b) => {
        const aPrice = a.starting_price ?? -1
        const bPrice = b.starting_price ?? -1
        return bPrice - aPrice
      })
    }
    return list
  }, [agents, sort, selectedAgentType])

  const industries = useMemo(() => {
    if (!categorySlug) return [] as string[]
    const counts = new Map<string, number>()
    for (const agent of agents) {
      for (const raw of (agent.industry_tags ?? [])) {
        const tag = String(raw).toLowerCase()
        if (!VERTICAL_SLUGS.has(tag)) continue
        counts.set(tag, (counts.get(tag) ?? 0) + 1)
      }
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 6)
      .map(([tag]) => tag)
  }, [agents, categorySlug])
  const showAgentTypeRow = availableAgentTypes.length >= 2

  return (
    <div>
      {categorySlug && industries.length > 0 && (
        <p className="cp-industries">
          By industry:{' '}
          {industries.map((industry) => (
            <Link key={industry} href={'/' + categorySlug + '/' + industry}>
              {INDUSTRY_DISPLAY[industry] ?? industry.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </Link>
          ))}
        </p>
      )}

      <div className="cp-filters">
        {showAgentTypeRow && (
          <label className="cp-filter">
            Use case
            <select value={selectedAgentType ?? ''} onChange={(e) => setSelectedAgentType(e.target.value || null)}>
              <option value="">All use cases</option>
              {availableAgentTypes.map((type) => <option key={type} value={type}>{formatAgentTypeLabel(type)}</option>)}
            </select>
          </label>
        )}
        <label className="cp-filter">
          Sort by
          <select value={sort} onChange={(e) => setSort(e.target.value as SortOption)}>
            <option value="rating_desc">Top rated</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
          </select>
        </label>
        <p className="hp-muted-14">{filteredAndSorted.length} agent{filteredAndSorted.length === 1 ? '' : 's'}</p>
      </div>

      {filteredAndSorted.length === 0 ? (
        <div className="cp-empty">
          <p>No agents match this filter.</p>
          <button type="button" className="hp-link" onClick={() => setSelectedAgentType(null)} style={{ background: 'none', border: 0, cursor: 'pointer', fontFamily: 'inherit', fontSize: '15px', marginTop: '8px' }}>Clear filter</button>
        </div>
      ) : (
        <>
          <div className="cp-cards">
          {filteredAndSorted.map((agent) => {
            const rating = shownRating(agent)
            const mcp = MCP_LABELS[agent.mcp_status ?? '']
            return (
              <Link key={agent.id} href={'/agents/' + agent.slug} className={'cp-card' + (agent.is_featured ? ' cp-card-featured' : '')}>
                <div className="cp-card-top">
                  <AgentLogo name={agent.name} logoUrl={agent.logo_url} websiteUrl={agent.website_url} faviconDomain={agent.favicon_domain} size="md" />
                  <div className="hp-min0 hp-grow">
                    <h2 className="cp-name">{agent.name}</h2>
                    <p className="hp-muted-13 hp-one">{agent.is_featured ? 'Featured · ' : ''}{agent.developer}</p>
                  </div>
                  <span className="cp-rating">{rating < 0 ? <span className="cp-radar">On Our Radar</span> : <span className="hp-star-num"><i>★</i>{rating.toFixed(1)}</span>}</span>
                </div>
                <p className="hp-clamp3 cp-desc">{agent.short_description}</p>
                <div className="cp-card-foot">
                  <span className="cp-price">{formatCardPrice(agent as PriceInfo, 'From ')}</span>
                  {mcp && <span className="cp-mcp"><McpMark size={15} />MCP {mcp.toLowerCase()}</span>}
                  <span className="cp-compare">
                    <CompareCardButton slug={agent.slug} name={agent.name} websiteUrl={agent.website_url} faviconDomain={agent.favicon_domain} />
                  </span>
                </div>
              </Link>
            )
          })}
          </div>
        </>
      )}
    </div>
  )
}
