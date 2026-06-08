import { createClient } from '@/lib/supabase'
import AgentLogo from '@/components/AgentLogo'
import Link from 'next/link'

export default async function ComparisonPlacement({ categorySlug, currentAgentSlug }: { categorySlug: string; currentAgentSlug: string }) {
  const supabase = createClient()
  const today = new Date().toISOString().split('T')[0]

  const { data: sponsors } = await supabase
    .from('sponsors')
    .select('*')
    .eq('category_slug', categorySlug)
    .eq('tier', 'comparison-listing')
    .eq('is_active', true)
    .lte('start_date', today)
    .or(`end_date.is.null,end_date.gte.${today}`)

  if (!sponsors || sponsors.length === 0) return null

  // Filter out the current agent's own listing
  const filtered = sponsors.filter(s => s.agent_slug !== currentAgentSlug)
  if (filtered.length === 0) return null

  // Fetch agent details for each sponsor
  const slugs = filtered.map(s => s.agent_slug as string)
  const { data: agents } = await supabase
    .from('agents')
    .select('slug, name, short_description, starting_price, pricing_model, editorial_rating, website_url, favicon_domain, g2_rating, g2_review_count')
    .in('slug', slugs)
    .eq('is_active', true)

  if (!agents || agents.length === 0) return null

  return (
    <div style={{
      backgroundColor: 'white', borderRadius: '0.5rem',
      border: '1px solid #E5E7EB', padding: '1.5rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3 style={{
          fontWeight: 700, color: '#111827', fontSize: '1rem', margin: 0,
        }}>Also consider</h3>
        <span style={{
          fontSize: '0.5625rem', fontWeight: 600, color: '#94A3B8',
          textTransform: 'uppercase', letterSpacing: '0.08em',
          backgroundColor: '#F1F5F9', padding: '0.2rem 0.5rem',
          borderRadius: '0.25rem',
        }}>
          Sponsored
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filtered.map(sponsor => {
          const agent = agents.find(a => a.slug === sponsor.agent_slug)
          if (!agent) return null

          const pricingLabel = agent.starting_price != null && agent.starting_price > 0
            ? 'From $' + agent.starting_price + '/mo'
            : agent.pricing_model === 'free' ? 'Free'
            : agent.pricing_model === 'freemium' ? 'Freemium'
            : 'Custom'

          const highlights = (sponsor.feature_highlights as string[] | null) ?? []

          return (
            <div key={agent.slug} style={{
              padding: '1rem', borderRadius: '0.5rem',
              border: '1px solid #F3F4F6', backgroundColor: '#FAFAFA',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.625rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flex: 1, minWidth: 0 }}>
                  <AgentLogo
                    name={agent.name}
                    websiteUrl={agent.website_url}
                    faviconDomain={agent.favicon_domain}
                    size="sm"
                  />
                  <div>
                    <Link href={'/agents/' + agent.slug} style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', textDecoration: 'none' }}>
                      {agent.name}
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.125rem' }}>
                      {agent.editorial_rating != null && (
                        <span style={{ fontSize: '0.75rem', color: '#374151' }}>
                          <span style={{ color: '#2563EB' }}>★</span> {Number(agent.editorial_rating).toFixed(1)}
                        </span>
                      )}
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>{pricingLabel}</span>
                    </div>
                  </div>
                </div>
                <a
                  href={(sponsor.cta_url as string) ?? '/agents/' + agent.slug}
                  target={sponsor.cta_url ? '_blank' : undefined}
                  rel={sponsor.cta_url ? 'noopener noreferrer' : undefined}
                  style={{
                    display: 'inline-flex', alignItems: 'center',
                    padding: '0.375rem 0.75rem', borderRadius: '0.375rem',
                    backgroundColor: '#2563EB', color: 'white',
                    fontSize: '0.75rem', fontWeight: 600, textDecoration: 'none',
                    whiteSpace: 'nowrap', flexShrink: 0,
                  }}
                >
                  {(sponsor.cta_text as string) ?? 'Learn More'} →
                </a>
              </div>
              {sponsor.tagline && (
                <p style={{ fontSize: '0.8125rem', color: '#4B5563', lineHeight: 1.5, margin: '0 0 0.5rem' }}>
                  {sponsor.tagline as string}
                </p>
              )}
              {highlights.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                  {highlights.slice(0, 3).map((item, i) => (
                    <span key={i} style={{
                      fontSize: '0.6875rem', padding: '0.15rem 0.5rem',
                      borderRadius: '9999px', backgroundColor: '#EFF6FF',
                      color: '#1D4ED8', fontWeight: 500,
                    }}>
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}