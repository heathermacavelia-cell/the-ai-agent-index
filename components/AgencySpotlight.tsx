import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import AgentLogo from '@/components/AgentLogo'
import { paidAgencyLogo } from '@/lib/agencyTier'
import { AGENCY_SPOTLIGHT_SLOTS, isSpotlightCategory } from '@/lib/vendorPlans'

// AGENCY SPOTLIGHT, ruled 2026-10-08 (Heather). A small Sponsored box of up to
// three agencies on an agent category's listing, comparison, alternatives and
// category pages. Paid placement only: it never touches ratings, rankings or
// the agent's own content. Renders nothing when no agency holds the category.
//
// A sale is one row in agency_spotlights. An agency shows from start_date to
// end_date inclusive and drops off the next day on its own. First bought,
// first shown, except that an agency listing the tool this page is about moves
// to the front.

// Tool slugs agencies use, mapped to the agent slugs they mean. A tool also
// matches an agent whose slug equals it or starts with it ('hubspot' matches
// 'hubspot-sales-hub').
const TOOL_ALIASES: Record<string, string[]> = {
  'anthropic': ['claude'],
  'anthropic-claude': ['claude'],
  'claude': ['claude'],
  'openai': ['chatgpt', 'openai'],
  'microsoft-365': ['microsoft-365-copilot', 'microsoft-copilot'],
  'salesforce': ['salesforce'],
}

const TOOL_NAMES: Record<string, string> = {
  'make': 'Make', 'zapier': 'Zapier', 'n8n': 'n8n', 'hubspot': 'HubSpot', 'salesforce': 'Salesforce',
  'openai': 'OpenAI', 'anthropic': 'Claude', 'anthropic-claude': 'Claude', 'claude': 'Claude',
  'voiceflow': 'Voiceflow', 'botpress': 'Botpress', 'microsoft-365': 'Microsoft 365', 'langchain': 'LangChain',
}

function norm(v: string): string {
  return v.toLowerCase().trim().replace(/\s+/g, '-')
}

function matchedTool(tools: unknown, agentSlugs: string[]): string | null {
  if (!Array.isArray(tools) || agentSlugs.length === 0) return null
  for (const raw of tools) {
    const t = norm(String(raw))
    const targets = TOOL_ALIASES[t] ?? [t]
    for (const slug of agentSlugs) {
      if (targets.some(x => slug === x || slug.startsWith(x + '-'))) return TOOL_NAMES[t] ?? t.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    }
  }
  return null
}

interface Props {
  categorySlug: string | null | undefined
  // The agents this page is about, for the tool match. Empty on a category page.
  agentSlugs?: string[]
}

export default async function AgencySpotlight({ categorySlug, agentSlugs = [] }: Props) {
  if (!categorySlug || !isSpotlightCategory(categorySlug)) return null
  const supabase = createClient()
  const today = new Date().toISOString().split('T')[0]

  const { data: spots } = await supabase
    .from('agency_spotlights')
    .select('agency_slug, start_date')
    .eq('category_slug', categorySlug)
    .lte('start_date', today)
    .gte('end_date', today)
    .order('start_date', { ascending: true })
  if (!spots || spots.length === 0) return null

  const slugs = Array.from(new Set(spots.map(s => s.agency_slug as string)))
  const { data: rows } = await supabase
    .from('agencies')
    .select('name, slug, website_url, favicon_domain, logo_url, listing_tier, headquarters, short_description, tool_specializations')
    .in('slug', slugs)
    .eq('is_active', true)
  if (!rows || rows.length === 0) return null

  const order = new Map(slugs.map((s, i) => [s, i]))
  const agencies = rows
    .map(a => ({ ...a, tool: matchedTool(a.tool_specializations, agentSlugs) }))
    .sort((a, b) => (Number(!!b.tool) - Number(!!a.tool)) || ((order.get(a.slug) ?? 0) - (order.get(b.slug) ?? 0)))
    .slice(0, AGENCY_SPOTLIGHT_SLOTS)

  return (
    <aside aria-label="Sponsored agencies" style={{ margin: '0 0 1.5rem', padding: '1.25rem', border: '1px solid #E5E7EB', borderRadius: '0.75rem', backgroundColor: '#F9FAFB' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.875rem' }}>
        <div>
          <p style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#111827', margin: 0 }}>Prefer to have it built for you?</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: '0.125rem 0 0' }}>AI automation agencies that build and run this kind of system for businesses.</p>
        </div>
        <span style={{ fontSize: '0.5625rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', backgroundColor: '#F1F5F9', padding: '0.15rem 0.4rem', borderRadius: '0.25rem' }}>Sponsored</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
        {agencies.map(a => (
          <Link key={a.slug} href={'/agencies/' + a.slug} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '0.875rem', border: '1px solid #E5E7EB', borderRadius: '0.625rem', backgroundColor: 'white', textDecoration: 'none', color: 'inherit' }}>
            <AgentLogo name={a.name} websiteUrl={a.website_url} faviconDomain={a.favicon_domain} logoUrl={paidAgencyLogo(a)} size="sm" />
            <div style={{ minWidth: 0 }}>
              <p style={{ fontWeight: 700, fontSize: '0.875rem', color: '#111827', margin: 0 }}>{a.name}</p>
              {a.headquarters && <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: '0.125rem 0 0' }}>{a.headquarters}</p>}
              {a.tool && <p style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#059669', margin: '0.25rem 0 0' }}>Works with {a.tool}</p>}
              {a.short_description && (
                <p style={{ fontSize: '0.75rem', color: '#4B5563', lineHeight: 1.45, margin: '0.375rem 0 0' }}>
                  {a.short_description.length > 110 ? a.short_description.slice(0, 107).replace(/\s+\S*$/, '') + '...' : a.short_description}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
      <p style={{ fontSize: '0.6875rem', color: '#9CA3AF', margin: '0.75rem 0 0' }}>
        Agencies pay to appear here. It does not affect any rating on this site. <Link href="/advertise/agencies" style={{ color: '#6B7280' }}>Advertise your agency</Link>
      </p>
    </aside>
  )
}
