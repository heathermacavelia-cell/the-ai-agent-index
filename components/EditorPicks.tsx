'use client'

import AgentLogo from '@/components/AgentLogo'

interface EditorPickAgent {
  slug: string
  name: string
  developer: string
  website_url?: string | null
  favicon_domain?: string | null
  best_for?: string | null
  short_description: string
  editorial_rating: number | null
  starting_price: number | null
  pricing_model: string
}

export default function EditorPicks({ agents, borderColor }: { agents: EditorPickAgent[]; borderColor: string }) {
  if (agents.length === 0) return null

  return (
    <>
      <style>{`
        .ep-container { margin-top: 1.5rem; background: white; border: 1px solid; border-radius: 0.75rem; overflow: hidden; }
        .ep-header { padding: 1rem 1.25rem; border-bottom: 1px solid #F3F4F6; display: flex; align-items: center; gap: 0.5rem; }
        .ep-row {
          display: grid;
          grid-template-columns: minmax(160px, 1.2fr) minmax(140px, 1.5fr) 70px 100px 110px;
          align-items: center;
          padding: 0.75rem 1.25rem;
          border-bottom: 1px solid #F3F4F6;
          text-decoration: none;
          color: inherit;
          transition: background 0.1s;
        }
        .ep-row:last-child { border-bottom: none; }
        .ep-row:nth-child(even) { background: #FAFAFA; }
        .ep-row:hover { background: #F0F7FF; }
        .ep-row-header {
          display: grid;
          grid-template-columns: minmax(160px, 1.2fr) minmax(140px, 1.5fr) 70px 100px 110px;
          padding: 0.5rem 1.25rem;
          border-bottom: 1px solid #F3F4F6;
        }
        .ep-th { font-size: 0.6875rem; font-weight: 600; color: #9CA3AF; text-transform: uppercase; letter-spacing: 0.06em; }
        .ep-agent { display: flex; align-items: center; gap: 0.5rem; }
        .ep-name { font-weight: 600; font-size: 0.875rem; color: #111827; }
        .ep-dev { font-size: 0.6875rem; color: #6B7280; margin: 0.125rem 0 0; }
        .ep-bestfor { font-size: 0.8125rem; color: #4B5563; line-height: 1.4; }
        .ep-rating { display: flex; align-items: center; gap: 0.25rem; justify-content: center; }
        .ep-pricing { text-align: center; font-weight: 600; font-size: 0.8125rem; color: #374151; }
        .ep-cta-col { text-align: center; }
        .ep-cta { display: inline-flex; align-items: center; padding: 0.3rem 0.75rem; border-radius: 0.375rem; font-size: 0.75rem; font-weight: 600; white-space: nowrap; }
        .ep-cta-secondary { background: white; color: #2563EB; border: 1px solid #BFDBFE; }
        .ep-desktop { display: block; }
        .ep-mobile { display: none; }
        @media (max-width: 768px) {
          .ep-desktop { display: none; }
          .ep-mobile { display: block; }
          .ep-card {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.875rem 1rem;
            border-bottom: 1px solid #F3F4F6;
            text-decoration: none;
            color: inherit;
          }
          .ep-card:last-child { border-bottom: none; }
          .ep-card:active { background: #F0F7FF; }
          .ep-card-info { flex: 1; min-width: 0; }
          .ep-card-name { font-weight: 600; font-size: 0.875rem; color: #111827; margin-bottom: 0.125rem; }
          .ep-card-meta { font-size: 0.75rem; color: #6B7280; }
          .ep-card-right { flex-shrink: 0; text-align: right; }
          .ep-card-rating { font-weight: 700; font-size: 0.875rem; color: #111827; }
          .ep-card-arrow { color: #2563EB; font-size: 0.875rem; flex-shrink: 0; margin-left: 0.25rem; }
        }
      `}</style>
      <div className="ep-container" style={{ borderColor }}>
        <div className="ep-header">
          <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Editor&apos;s Picks</span>
          <span style={{ fontSize: '0.625rem', color: '#9CA3AF', backgroundColor: '#F3F4F6', padding: '0.15rem 0.4rem', borderRadius: '0.25rem' }}>Based on editorial rating</span>
        </div>

        {/* Desktop */}
        <div className="ep-desktop">
          <div className="ep-row-header">
            <span className="ep-th">Agent</span>
            <span className="ep-th">Best for</span>
            <span className="ep-th" style={{ textAlign: 'center' }}>Rating</span>
            <span className="ep-th" style={{ textAlign: 'center' }}>Pricing</span>
            <span className="ep-th"></span>
          </div>
          {agents.map((agent) => {
            const pricingLabel = agent.starting_price != null && agent.starting_price > 0
              ? 'From $' + agent.starting_price + '/mo'
              : agent.pricing_model === 'free' ? 'Free'
              : agent.pricing_model === 'freemium' ? 'Freemium'
              : 'Custom'
            return (
              <a key={agent.slug} href={'/agents/' + agent.slug} className="ep-row">
                <div className="ep-agent">
                  <AgentLogo name={agent.name} websiteUrl={agent.website_url} faviconDomain={agent.favicon_domain} size="sm" />
                  <div>
                    <div className="ep-name">{agent.name}</div>
                    <p className="ep-dev">{agent.developer}</p>
                  </div>
                </div>
                <div className="ep-bestfor">
                  {agent.best_for ? (agent.best_for.length > 80 ? agent.best_for.substring(0, 80) + '...' : agent.best_for) : agent.short_description.substring(0, 80) + '...'}
                </div>
                <div className="ep-rating">
                  <span style={{ color: '#2563EB', fontSize: '0.8125rem' }}>★</span>
                  <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#111827' }}>{Number(agent.editorial_rating).toFixed(1)}</span>
                </div>
                <div className="ep-pricing">{pricingLabel}</div>
                <div className="ep-cta-col">
                  <span className="ep-cta ep-cta-secondary">View Review →</span>
                </div>
              </a>
            )
          })}
        </div>

        {/* Mobile */}
        <div className="ep-mobile">
          {agents.map((agent) => {
            const pricingLabel = agent.starting_price != null && agent.starting_price > 0
              ? '$' + agent.starting_price + '/mo'
              : agent.pricing_model === 'free' ? 'Free'
              : agent.pricing_model === 'freemium' ? 'Freemium'
              : 'Custom'
            return (
              <a key={agent.slug} href={'/agents/' + agent.slug} className="ep-card">
                <AgentLogo name={agent.name} websiteUrl={agent.website_url} faviconDomain={agent.favicon_domain} size="sm" />
                <div className="ep-card-info">
                  <div className="ep-card-name">{agent.name}</div>
                  <div className="ep-card-meta">{pricingLabel} · {agent.developer}</div>
                </div>
                <div className="ep-card-right">
                  <div className="ep-card-rating">
                    <span style={{ color: '#2563EB', marginRight: '0.2rem' }}>★</span>
                    {Number(agent.editorial_rating).toFixed(1)}
                  </div>
                </div>
                <span className="ep-card-arrow">→</span>
              </a>
            )
          })}
        </div>
      </div>
    </>
  )
}