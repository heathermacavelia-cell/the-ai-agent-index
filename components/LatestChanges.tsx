import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import AgentLogo from '@/components/AgentLogo'
import { shortDate } from '@/lib/siteStats'

/**
 * The newest records in the changelog, whatever they are and whoever they are about (Heather
 * 2026-11-04: "latest changes should literally be latest changes"). The one filter is one record
 * per agent, so a vendor with three changes on one day cannot fill the box.
 */
const LABELS: Record<string, string> = {
  pricing: 'Price', integration: 'Integration', new_integration: 'Integration', verified: 'Verified',
  new_agent: 'New listing', new_listing: 'New listing', feature: 'Feature', mcp_added: 'MCP',
  rating_change: 'Rating', g2_update: 'G2', security: 'Security', rebrand: 'Rebrand',
  acquisition: 'Acquisition', model_release: 'Model', funding: 'Funding', delisted: 'Delisted',
}
const SHOW = 5
const MAX_WAS_NOW = 90

interface Entry {
  id: string
  agent_name: string
  agent_slug: string | null
  change_type: string
  description: string | null
  previous_value: string | null
  new_value: string | null
  published_at: string
}

export default async function LatestChanges({ logos }: { logos: Record<string, { logo_url: string | null; website_url: string | null; favicon_domain: string | null }> }) {
  const supabase = createClient()
  const { data } = await supabase
    .from('changelog')
    .select('id, agent_name, agent_slug, change_type, description, previous_value, new_value, published_at')
    .order('published_at', { ascending: false })
    .limit(40)
  const seen = new Set<string>()
  const entries: Entry[] = []
  for (const e of (data ?? []) as Entry[]) {
    const key = e.agent_slug ?? e.agent_name
    if (seen.has(key)) continue
    seen.add(key)
    entries.push(e)
    if (entries.length === SHOW) break
  }
  if (entries.length === 0) return null

  return (
    <div className="hp-panel">
      <div className="hp-panel-head">
        <h2 className="hp-h3">Latest changes</h2>
        <Link href="/changelog" className="hp-link hp-small">All changes</Link>
      </div>
      {entries.map((e) => {
        const logo = e.agent_slug ? logos[e.agent_slug] : undefined
        const wasNow = e.change_type !== 'new_listing' && e.change_type !== 'new_agent' &&
          e.previous_value && e.new_value &&
          e.previous_value.length <= MAX_WAS_NOW && e.new_value.length <= MAX_WAS_NOW
        const label = LABELS[e.change_type] ?? e.change_type.replace(/_/g, ' ')
        return (
          <article key={e.id} className="hp-change">
            <div className="hp-change-top">
              <AgentLogo name={e.agent_name} logoUrl={logo?.logo_url} websiteUrl={logo?.website_url} faviconDomain={logo?.favicon_domain} size="xs" />
              {e.agent_slug && logo
                ? <Link href={'/agents/' + e.agent_slug} className="hp-change-name">{e.agent_name}</Link>
                : <span className="hp-change-name">{e.agent_name}</span>}
              <span className={'hp-chg-' + (e.change_type === 'pricing' ? 'price' : e.change_type === 'new_listing' || e.change_type === 'new_agent' ? 'new' : 'other')}>{label}</span>
              <span className="hp-muted-13 hp-change-date">{shortDate(e.published_at)}</span>
            </div>
            {wasNow ? (
              <>
                <p className="hp-was"><s>{e.previous_value}</s></p>
                <p className="hp-now">{e.new_value}</p>
              </>
            ) : (
              <p className="hp-clamp2 hp-change-text">{e.description}</p>
            )}
          </article>
        )
      })}
    </div>
  )
}
