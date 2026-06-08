import { createClient } from '@/lib/supabase'
import AgentLogo from '@/components/AgentLogo'

export default async function AgentListingBanner({ categorySlug, currentAgentSlug }: { categorySlug: string; currentAgentSlug: string }) {
  const supabase = createClient()
  const today = new Date().toISOString().split('T')[0]

  const { data: sponsor } = await supabase
    .from('sponsors')
    .select('*')
    .eq('category_slug', categorySlug)
    .eq('tier', 'listing-banner')
    .eq('is_active', true)
    .lte('start_date', today)
    .or(`end_date.is.null,end_date.gte.${today}`)
    .maybeSingle()

  if (!sponsor) return null

  // Don't show banner on the sponsor's own listing page
  if (sponsor.agent_slug === currentAgentSlug) return null

  const { data: agent } = await supabase
    .from('agents')
    .select('name, starting_price, pricing_model, website_url, favicon_domain, editorial_rating')
    .eq('slug', sponsor.agent_slug as string)
    .maybeSingle()

  if (!agent) return null

  const pricingLabel = (() => {
    const price = agent.starting_price as number | null
    const model = agent.pricing_model as string | null
    if (model === 'free') return 'Free'
    if (model === 'freemium') return 'Free tier available'
    if (!price) return 'Custom pricing'
    return `From $${price}/mo`
  })()

  return (
    <div style={{
      marginBottom: '0.75rem',
      padding: '0.75rem 1.5rem',
      backgroundColor: '#F8FAFC',
      border: '1px solid #E2E8F0',
      borderRadius: '0.625rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      flexWrap: 'wrap',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
        <span style={{
          fontSize: '0.5625rem', fontWeight: 700, color: '#94A3B8',
          textTransform: 'uppercase', letterSpacing: '0.1em',
          backgroundColor: '#F1F5F9', padding: '0.15rem 0.4rem',
          borderRadius: '0.25rem', flexShrink: 0, whiteSpace: 'nowrap',
        }}>
          Sponsored
        </span>
        {sponsor.logo_url ? (
          <img
            src={sponsor.logo_url as string}
            alt={agent.name as string}
            style={{ height: '20px', width: 'auto', objectFit: 'contain', flexShrink: 0 }}
          />
        ) : (
          <AgentLogo
            name={agent.name as string}
            websiteUrl={agent.website_url as string | null}
            faviconDomain={agent.favicon_domain as string | null}
            size="sm"
          />
        )}
        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1E293B', flexShrink: 0 }}>
          {agent.name as string}
        </span>
        {sponsor.tagline && (
          <span style={{ fontSize: '0.8125rem', color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {sponsor.tagline as string}
          </span>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>{pricingLabel}</span>
        <a
          href={sponsor.cta_url as string}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center',
            padding: '0.375rem 0.875rem', borderRadius: '0.375rem',
            backgroundColor: '#2563EB', color: 'white',
            fontSize: '0.75rem', fontWeight: 600, textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {(sponsor.cta_text as string) ?? 'Learn More'} →
        </a>
      </div>
    </div>
  )
}