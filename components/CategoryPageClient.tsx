'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import AgentLogo from '@/components/AgentLogo'
import McpMark from '@/components/McpMark'
import { formatCardPrice, isPercentOfSpend, type PriceInfo } from '@/lib/price'
import CompareCardButton from '@/components/CompareCardButton'
import { resolveRating } from '@/lib/rating'
import { capabilityLabel } from '@/lib/tags'
import { INDUSTRY_SLUGS, customerSegmentLabel, normalizeCustomerSegment } from '@/lib/taxonomy'

interface Agent {
  id: string
  name: string
  slug: string
  developer: string
  website_url?: string | null
  favicon_domain?: string | null
  logo_url?: string | null
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

const PRICING_COLORS: Record<string, { bg: string; color: string }> = {
  free: { bg: '#F0FDF4', color: '#15803D' },
  freemium: { bg: '#F0FDFA', color: '#0F766E' },
  subscription: { bg: '#EFF6FF', color: '#1D4ED8' },
  'usage-based': { bg: '#FFF7ED', color: '#C2410C' },
  custom: { bg: '#F3F4F6', color: '#4B5563' },
}

const SEGMENT_COLORS: Record<string, { bg: string; color: string }> = {
  solo: { bg: '#FAF5FF', color: '#7E22CE' },
  smb: { bg: '#F0F9FF', color: '#0369A1' },
  'mid-market': { bg: '#ECFEFF', color: '#0E7490' },
  b2b: { bg: '#EEF2FF', color: '#3730A3' },
  enterprise: { bg: '#F3F4F6', color: '#374151' },
  all: { bg: '#F0FDF4', color: '#15803D' },
}

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

// The number on the card, or -1 for On Our Radar so those sort last. Sorting and display must read
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
        // A percent-of-spend fee is not a dollar figure: sort it with the unpriced rows.
        const aPrice = (isPercentOfSpend(a as PriceInfo) ? null : a.starting_price) ?? Infinity
        const bPrice = (isPercentOfSpend(b as PriceInfo) ? null : b.starting_price) ?? Infinity
        return aPrice - bPrice
      })
    }
    if (sort === 'price_desc') {
      return list.sort((a, b) => {
        const aPrice = (isPercentOfSpend(a as PriceInfo) ? null : a.starting_price) ?? -1
        const bPrice = (isPercentOfSpend(b as PriceInfo) ? null : b.starting_price) ?? -1
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

  const pillBaseStyle: React.CSSProperties = {
    padding: '0.375rem 0.875rem',
    borderRadius: '9999px',
    border: '1px solid',
    fontSize: '0.8125rem',
    fontWeight: 500,
    cursor: 'pointer',
  }
  const pillActiveStyle: React.CSSProperties = {
    backgroundColor: '#2563EB',
    color: 'white',
    borderColor: '#2563EB',
  }
  const pillInactiveStyle: React.CSSProperties = {
    backgroundColor: 'white',
    color: '#374151',
    borderColor: '#E5E7EB',
  }

  return (
    <div>
      {categorySlug && industries.length > 0 && (
        <div className="cp-frow">
          <p className="cp-flabel">Browse by industry</p>
          <div className="cp-fpills">
            {industries.map((industry) => (
              <Link key={industry} href={'/' + categorySlug + '/' + industry}
                style={{ padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB', fontSize: '0.8125rem', fontWeight: 500, color: '#374151', textDecoration: 'none', backgroundColor: 'white' }}>
                {INDUSTRY_DISPLAY[industry] ?? industry.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </Link>
            ))}

          </div>
        </div>
      )}

      {showAgentTypeRow && (
        <div className="cp-frow">
          <p className="cp-flabel">Browse by use case</p>
          <div className="cp-fpills">
            <button
              type="button"
              onClick={() => setSelectedAgentType(null)}
              style={{ ...pillBaseStyle, ...(selectedAgentType === null ? pillActiveStyle : pillInactiveStyle) }}
            >
              All
            </button>
            {availableAgentTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedAgentType(type)}
                style={{ ...pillBaseStyle, ...(selectedAgentType === type ? pillActiveStyle : pillInactiveStyle) }}
              >
                {formatAgentTypeLabel(type)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="cp-sortrow">
        {/* An h2 (was a p), and each card name below is an h3 (was an h2): the page's
            own sections ("What are AI sales agents?", "How much do they cost?") were
            buried under 70 card-name h2s. Same classes, so nothing looks different.
            SEO 2026-11-07. */}
        <h2 className="cp-count">
          {filteredAndSorted.length} agent{filteredAndSorted.length === 1 ? '' : 's'}
          {selectedAgentType && (
            <span style={{ color: '#9CA3AF' }}>
              {' · filtered by '}
              <span style={{ color: '#2563EB', fontWeight: 600 }}>
                {formatAgentTypeLabel(selectedAgentType)}
              </span>
            </span>
          )}
        </h2>
        <div className="cp-sort">
          <span className="cp-flabel">Sort by</span>
          {([
            { value: 'rating_desc', label: 'Top rated' },
            { value: 'price_asc', label: 'Price: low to high' },
            { value: 'price_desc', label: 'Price: high to low' },
          ] as { value: SortOption; label: string }[]).map((opt) => (
            <button key={opt.value} onClick={() => setSort(opt.value)}
              style={{ ...pillBaseStyle, ...(sort === opt.value ? pillActiveStyle : pillInactiveStyle) }}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {filteredAndSorted.length === 0 ? (
        <div style={{ padding: '3rem 1.5rem', textAlign: 'center', backgroundColor: 'white', borderRadius: '0.875rem', border: '1px solid #E5E7EB' }}>
          <p style={{ fontSize: '0.9375rem', color: '#374151', marginBottom: '0.75rem', fontWeight: 600 }}>
            No agents match this filter.
          </p>
          <button
            type="button"
            onClick={() => setSelectedAgentType(null)}
            style={{ ...pillBaseStyle, ...pillActiveStyle, marginTop: '0.25rem' }}
          >
            Clear filter
          </button>
        </div>
      ) : (
        <div className="cp-cards">
          {filteredAndSorted.map((agent) => {
            const pricingStyle = PRICING_COLORS[agent.pricing_model] ?? PRICING_COLORS.custom
            const segmentStyle = SEGMENT_COLORS[normalizeCustomerSegment(agent.customer_segment)] ?? SEGMENT_COLORS.b2b
            const rating = shownRating(agent)
            const price = agent.starting_price != null && agent.starting_price > 0
              ? formatCardPrice(agent as PriceInfo)
              : agent.starting_price === 0 ? 'free' : null
            return (
              <Link key={agent.id} href={'/agents/' + agent.slug} className={'cp-card' + (agent.is_featured ? ' cp-card-featured' : '')}>
                <div className="cp-card-top">
                  <AgentLogo name={agent.name} logoUrl={agent.logo_url} websiteUrl={agent.website_url} faviconDomain={agent.favicon_domain} size="md" />
                  <div className="hp-min0 hp-grow">
                    <h3 className="cp-name">{agent.name}</h3>
                    <div className="cp-byline">
                      <span className="hp-muted-13">{agent.developer}</span>
                      {agent.is_featured && <span className="cp-badge-featured">Featured</span>}
                      {agent.mcp_compatible === true && <span className="cp-badge-mcp"><McpMark size={11} />MCP</span>}
                    </div>
                  </div>
                  {rating < 0
                    ? <span className="cp-radar">On Our Radar</span>
                    : <span className="hp-star-num"><i>★</i>{rating.toFixed(1)}</span>}
                </div>
                <p className="hp-clamp3 cp-desc">{agent.short_description}</p>
                <div className="cp-card-foot">
                  <div className="cp-pills">
                    <span className="cp-pill" style={{ backgroundColor: pricingStyle.bg, color: pricingStyle.color }}>
                      {agent.pricing_model.charAt(0).toUpperCase() + agent.pricing_model.slice(1)}{price && price !== 'free' ? ' · ' + price : ''}
                    </span>
                    <span className="cp-pill" style={{ backgroundColor: segmentStyle.bg, color: segmentStyle.color }}>
                      {customerSegmentLabel(agent.customer_segment)}
                    </span>
                  </div>
                  {agent.capability_tags && agent.capability_tags.length > 0 && (
                    <div className="cp-pills">
                      {agent.capability_tags.slice(0, 2).map((tag: string) => (
                        <span key={tag} className="cp-pill cp-pill-tag">{capabilityLabel(tag)}</span>
                      ))}
                    </div>
                  )}
                  <div className="cp-compare-row">
                    <CompareCardButton slug={agent.slug} name={agent.name} websiteUrl={agent.website_url} faviconDomain={agent.favicon_domain} />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}