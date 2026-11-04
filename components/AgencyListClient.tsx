'use client'
import { useState, useMemo } from 'react'
import type { Agency } from '@/types/agency'
import AgentLogo from '@/components/AgentLogo'
import Link from 'next/link'
import { isIndependentlyReviewed, paidAgencyLogo } from '@/lib/agencyTier'
import { normalizeTools, toolLabel } from '@/lib/agencyTools'

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

// THE HUB ORDER, ruled 2026-09-21b, tiers split by Heather 2026-10-08:
// Featured > paid review ('reviewed') > editorial ('legacy') > free,
// then inside each tier: site rating (then review count) >
// Clutch rating > Claimed > alphabetical.
// A comparator rather than a weighted score, so no later bucket can ever
// outweigh an earlier one.
function hasSiteRating(a: Agency): boolean {
  return a.rating_avg > 0 && a.rating_count > 0
}

// Paid review first, then the grandfathered editorial rows, then free.
function tierRank(a: Agency): number {
  if (a.listing_tier === 'reviewed') return 2
  if (a.listing_tier === 'legacy') return 1
  return 0
}

function compareAgencies(a: Agency, b: Agency): number {
  const featured = Number(!!b.is_featured) - Number(!!a.is_featured)
  if (featured !== 0) return featured
  const tier = tierRank(b) - tierRank(a)
  if (tier !== 0) return tier
  const siteA = hasSiteRating(a) ? a.rating_avg : 0
  const siteB = hasSiteRating(b) ? b.rating_avg : 0
  if (siteB !== siteA) return siteB - siteA
  const countA = hasSiteRating(a) ? a.rating_count : 0
  const countB = hasSiteRating(b) ? b.rating_count : 0
  if (countB !== countA) return countB - countA
  const clutchA = a.clutch_rating && a.clutch_rating > 0 ? a.clutch_rating : 0
  const clutchB = b.clutch_rating && b.clutch_rating > 0 ? b.clutch_rating : 0
  if (clutchB !== clutchA) return clutchB - clutchA
  const claimed = Number(!!b.vendor_claimed) - Number(!!a.vendor_claimed)
  if (claimed !== 0) return claimed
  return a.name.localeCompare(b.name)
}

export default function AgencyListClient({ agencies: rawAgencies }: { agencies: Agency[] }) {
  // Tools normalised once, so the filter, the search and the cards all agree (2026-10-08).
  const agencies = useMemo(() => rawAgencies.map(a => ({ ...a, tool_specializations: normalizeTools(a.tool_specializations) })), [rawAgencies])
  const [search, setSearch] = useState('')
  const [activeService, setActiveService] = useState<string | null>(null)
  const [activeTool, setActiveTool] = useState<string | null>(null)
  const [activeRegion, setActiveRegion] = useState<string | null>(null)

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

  const allRegions = useMemo(() => {
    const set = new Set<string>()
    for (const a of agencies) for (const r of a.regions_served) if (!/^global/i.test(r)) set.add(r)
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
        const toolMatch = a.tool_specializations.some(t => t.includes(q) || toolLabel(t).toLowerCase().includes(q))
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
    if (activeRegion) {
      list = list.filter(a => a.regions_served.some(r => r === activeRegion || /^(global|remote)/i.test(r)))
    }
    // Ruled order - see compareAgencies
    list.sort(compareAgencies)
    return list
  }, [agencies, search, activeService, activeTool, activeRegion])

  const filtering = !!(activeService || activeTool || activeRegion || search.trim())
  const clearAll = () => { setSearch(''); setActiveService(null); setActiveTool(null); setActiveRegion(null) }

  return (
    <div>
      <div className="ag-finder">
        <label className="ag-field">
          What do you need built?
          <select value={activeService ?? ''} onChange={e => setActiveService(e.target.value || null)}>
            <option value="">Any kind of project</option>
            {allServices.map(tag => <option key={tag} value={tag}>{SERVICE_LABELS[tag] ?? tag}</option>)}
          </select>
        </label>
        <label className="ag-field">
          Tools you use
          <select value={activeTool ?? ''} onChange={e => setActiveTool(e.target.value || null)}>
            <option value="">Any tools</option>
            {allTools.map(tag => <option key={tag} value={tag}>{toolLabel(tag)}</option>)}
          </select>
        </label>
        <label className="ag-field">
          Where you are
          <select value={activeRegion ?? ''} onChange={e => setActiveRegion(e.target.value || null)}>
            <option value="">Anywhere</option>
            {allRegions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </label>
      </div>
      <label className="ag-field" style={{ marginTop: '12px', fontWeight: 400 }}>
        <span className="hp-muted-14">Or search by name, city or tool</span>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} />
      </label>

      <p className="ag-count">
        <span>{filtered.length} {filtered.length === 1 ? 'agency' : 'agencies'}</span>
        {filtering && <button type="button" className="ag-clear" onClick={clearAll}>Clear filters</button>}
      </p>

      <div className="ag-head"><span>Agency</span><span>Builds</span><span>Based in</span><span>Smallest project</span><span>Rating</span></div>
      {filtered.map(agency => {
        const hasClutch = agency.clutch_rating != null && agency.clutch_rating > 0
        const hasSiteReviews = agency.rating_avg > 0 && agency.rating_count > 0
        return (
          <Link key={agency.id} href={`/agencies/${agency.slug}`} className="ag-row">
            <div className="cp-agent ag-main">
              <AgentLogo name={agency.name} websiteUrl={agency.website_url} faviconDomain={agency.favicon_domain} logoUrl={paidAgencyLogo(agency)} size="sm" />
              <div className="hp-min0">
                <span className="ag-name">{agency.name}</span>
                {isIndependentlyReviewed(agency) && <span className="ag-reviewed">Independently Reviewed</span>}
                {agency.is_featured && <span className="ag-tag">Featured</span>}
                {agency.vendor_claimed && <span className="ag-tag">Claimed</span>}
                <p className="hp-clamp2 cp-desc">{agency.short_description}</p>
              </div>
            </div>
            <span className="ag-cell ag-builds">{agency.service_tags.slice(0, 3).map(t => SERVICE_LABELS[t] ?? t).join(', ')}</span>
            <span className="ag-cell">
              {agency.headquarters}
              {agency.team_size && <span className="ag-sub" style={{ display: 'block' }}>{agency.team_size} people</span>}
            </span>
            <span className="ag-cell">
              {agency.minimum_project_budget}
              {agency.hourly_rate_range && agency.hourly_rate_range !== 'Not applicable' && <span className="ag-sub" style={{ display: 'block' }}>{agency.hourly_rate_range}</span>}
            </span>
            <span className="ag-cell">
              {hasSiteReviews && <span style={{ display: 'block' }}><strong>{agency.rating_avg.toFixed(1)}</strong> ({agency.rating_count})</span>}
              {hasClutch && <span style={{ display: 'block' }}>Clutch {agency.clutch_rating!.toFixed(1)}</span>}
            </span>
          </Link>
        )
      })}

      {filtered.length === 0 && (
        <div className="cp-empty">
          <p>No agencies match these filters.</p>
          <button type="button" className="ag-clear" onClick={clearAll} style={{ marginTop: '8px' }}>Clear filters</button>
        </div>
      )}
    </div>
  )
}
