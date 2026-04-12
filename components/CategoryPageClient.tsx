'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import AgentLogo from '@/components/AgentLogo'

interface Agent {
  id: string
  name: string
  slug: string
  developer: string
  website_url?: string | null
  favicon_domain?: string | null
  short_description: string
  primary_category: string
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
}

const PRICING_COLORS: Record<string, { bg: string; color: string }> = {
  free: { bg: '#F0FDF4', color: '#15803D' },
  freemium: { bg: '#F0FDFA', color: '#0F766E' },
  subscription: { bg: '#EFF6FF', color: '#1D4ED8' },
  'usage-based': { bg: '#FFF7ED', color: '#C2410C' },
  custom: { bg: '#F3F4F6', color: '#4B5563' },
}

const SEGMENT_COLORS: Record<string, { bg: string; color: string }> = {
  b2c: { bg: '#FAF5FF', color: '#7E22CE' },
  smb: { bg: '#F0F9FF', color: '#0369A1' },
  b2b: { bg: '#EEF2FF', color: '#3730A3' },
  enterprise: { bg: '#F3F4F6', color: '#374151' },
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
  'aws': 'AWS',
}

const CATEGORY_INDUSTRIES: Record<string, string[]> = {
  'ai-sales-agents': ['saas', 'real-estate', 'ecommerce', 'finance', 'insurance', 'b2b'],
  'ai-customer-support-agents': ['ecommerce', 'saas', 'healthcare', 'finance', 'retail'],
  'ai-research-agents': ['legal', 'finance', 'pharma', 'enterprise', 'b2b'],
  'ai-marketing-agents': ['ecommerce', 'saas', 'agencies', 'dtc', 'b2b'],
  'ai-coding-agents': ['saas', 'startups', 'enterprise', 'devtools', 'open-source'],
  'ai-hr-agents': ['saas', 'enterprise', 'startups', 'healthcare', 'finance'],
}

type SortOption = 'rating_desc' | 'price_asc' | 'price_desc'

function getEffectiveRating(agent: Agent): number {
  const base = agent.rating_count > 0 ? agent.rating_avg : (agent.editorial_rating ?? agent.rating_avg ?? 0)
  return agent.is_featured ? Math.min(base + 0.15, 5) : base
}

export default function CategoryPageClient({ agents, categorySlug }: { agents: Agent[]; categorySlug?: string }) {
  const [sort, setSort] = useState<SortOption>('rating_desc')

  const sorted = useMemo(() => {
    const list = [...agents]
    if (sort === 'rating_desc') {
      return list.sort((a, b) => getEffectiveRating(b) - getEffectiveRating(a))
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
  }, [agents, sort])

  const industries = categorySlug ? (CATEGORY_INDUSTRIES[categorySlug] ?? []) : []

  return (
    <div>
      {categorySlug && industries.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', fontWeight: 500, marginBottom: '0.625rem' }}>Browse by industry</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {industries.map((industry) => (
              <Link key={industry} href={'/' + categorySlug + '/' + industry}
                style={{ padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB', fontSize: '0.8125rem', fontWeight: 500, color: '#374151', textDecoration: 'none', backgroundColor: 'white' }}>
                {INDUSTRY_DISPLAY[industry] ?? industry.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </Link>
            ))}
            <Link href={'/' + categorySlug + '/enterprise'}
              style={{ padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px dashed #D1D5DB', fontSize: '0.8125rem', color: '#9CA3AF', textDecoration: 'none', backgroundColor: 'white' }}>
              More industries →
            </Link>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>{agents.length} agents</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8125rem', color: '#6B7280', fontWeight: 500 }}>Sort by</span>
          <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
            {([
              { value: 'rating_desc', label: 'Top rated' },
              { value: 'price_asc', label: 'Price: low to high' },
              { value: 'price_desc', label: 'Price: high to low' },
            ] as { value: SortOption; label: string }[]).map((opt) => (
              <button key={opt.value} onClick={() => setSort(opt.value)}
                style={{ padding: '0.375rem 0.75rem', borderRadius: '0.375rem', border: '1px solid', fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer', backgroundColor: sort === opt.value ? '#2563EB' : 'white', color: sort === opt.value ? 'white' : '#374151', borderColor: sort === opt.value ? '#2563EB' : '#E5E7EB' }}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {sorted.map((agent) => {
          const displayRating = agent.rating_count > 0 ? agent.rating_avg : (agent.editorial_rating ?? agent.rating_avg ?? 0)
          const pricingStyle = PRICING_COLORS[agent.pricing_model] ?? PRICING_COLORS.custom
          const segmentStyle = SEGMENT_COLORS[agent.customer_segment] ?? SEGMENT_COLORS.b2b
          return (
            <Link key={agent.id} href={'/agents/' + agent.slug}
              style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: agent.is_featured ? '1px solid #BFDBFE' : '1px solid #E5E7EB', padding: '1.25rem', textDecoration: 'none', display: 'block' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.625rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flex: 1, minWidth: 0 }}>
                  <AgentLogo name={agent.name} websiteUrl={agent.website_url} faviconDomain={agent.favicon_domain} size="sm" />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
                      <h2 style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#111827', margin: 0 }}>{agent.name}</h2>
                      {agent.is_featured && (
                        <span style={{ fontSize: '0.625rem', backgroundColor: '#2563EB', color: 'white', padding: '0.15rem 0.4rem', borderRadius: '0.25rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', flexShrink: 0 }}>Featured</span>
                      )}
                      {agent.mcp_compatible === true && (
                        <span style={{ fontSize: '0.625rem', backgroundColor: '#F0FDF4', color: '#16A34A', border: '1px solid #BBF7D0', padding: '0.15rem 0.4rem', borderRadius: '0.25rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', flexShrink: 0 }}>MCP</span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: 0 }}>{agent.developer}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
                  <span style={{ color: '#2563EB', fontSize: '0.875rem', lineHeight: 1 }}>★</span>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151' }}>{displayRating > 0 ? Number(displayRating).toFixed(1) : '—'}</span>
                </div>
              </div>
              <p style={{ fontSize: '0.8125rem', color: '#4B5563', lineHeight: 1.55, marginBottom: '0.875rem' }}>{agent.short_description}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.6875rem', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', fontWeight: 600, backgroundColor: pricingStyle.bg, color: pricingStyle.color }}>
                  {agent.pricing_model}
                  {agent.starting_price != null && agent.starting_price > 0 && ` · $${agent.starting_price}`}
                  {agent.starting_price === 0 && ' · free'}
                </span>
                <span style={{ fontSize: '0.6875rem', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', fontWeight: 600, backgroundColor: segmentStyle.bg, color: segmentStyle.color }}>
                  {agent.customer_segment}
                </span>
              </div>
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
  )
}