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
  if (sponsor.agent_slug === currentAgentSlug) return null

  const { data: agent } = await supabase
    .from('agents')
    .select('name, starting_price, pricing_model, website_url, favicon_domain, editorial_rating')
    .eq('slug', sponsor.agent_slug as string)
    .maybeSingle()

  if (!agent) return null

  const pricingLabel = (() => {
    const model = agent.pricing_model as string | null
    if (model === 'free') return 'Free'
    if (model === 'freemium') return 'Free tier available'
    return null
  })()

  return (
    <>
      <style>{`
        .alb-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
          padding: 0.625rem 1rem;
          background-color: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 0.625rem;
          text-decoration: none;
          color: inherit;
        }
        .alb-left {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex: 1;
          min-width: 0;
        }
        .alb-label {
          font-size: 0.5625rem;
          font-weight: 700;
          color: #94A3B8;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          background-color: #F1F5F9;
          padding: 0.15rem 0.4rem;
          border-radius: 0.25rem;
          flex-shrink: 0;
          white-space: nowrap;
        }
        .alb-name {
          font-size: 0.8125rem;
          font-weight: 600;
          color: #1E293B;
          white-space: nowrap;
        }
        .alb-tagline {
          font-size: 0.8125rem;
          color: #64748B;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .alb-right {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          flex-shrink: 0;
        }
        .alb-price {
          font-size: 0.75rem;
          font-weight: 600;
          color: #475569;
          white-space: nowrap;
        }
        .alb-cta {
          display: inline-flex;
          align-items: center;
          padding: 0.375rem 0.875rem;
          border-radius: 0.375rem;
          background-color: #2563EB;
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
          white-space: nowrap;
        }
        @media (max-width: 768px) {
          .alb-tagline { display: none; }
          .alb-price { display: none; }
        }
      `}</style>
      <a
        href={sponsor.cta_url as string}
        target="_blank"
        rel="noopener noreferrer"
        className="alb-link"
      >
        <div className="alb-left">
          <span className="alb-label">Sponsored</span>
          <AgentLogo
            name={agent.name as string}
            websiteUrl={agent.website_url as string | null}
            faviconDomain={agent.favicon_domain as string | null}
            size="sm"
          />
          <span className="alb-name">{agent.name as string}</span>
          {sponsor.tagline && (
            <span className="alb-tagline">{sponsor.tagline as string}</span>
          )}
        </div>
        <div className="alb-right">
          {pricingLabel && <span className="alb-price">{pricingLabel}</span>}
          <span className="alb-cta">
            {(sponsor.cta_text as string) ?? 'Learn More'} →
          </span>
        </div>
      </a>
    </>
  )
}