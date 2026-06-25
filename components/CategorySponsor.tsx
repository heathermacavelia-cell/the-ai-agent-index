import { createClient } from '@/lib/supabase'
import Link from 'next/link'

export default async function CategorySponsor({ categorySlug }: { categorySlug: string }) {
  const supabase = createClient()
  const today = new Date().toISOString().split('T')[0]

  const { data: sponsor } = await supabase
    .from('sponsors')
    .select('*')
    .eq('category_slug', categorySlug)
    .eq('tier', 'category')
    .eq('is_active', true)
    .lte('start_date', today)
    .or(`end_date.is.null,end_date.gte.${today}`)
    .maybeSingle()

  if (!sponsor) return null

  const { data: agent } = await supabase
    .from('agents')
    .select('name, starting_price, pricing_model')
    .eq('slug', sponsor.agent_slug as string)
    .maybeSingle()

  const bgColor = (sponsor.banner_bg_color as string) ?? '#1e293b'
  const agentName = (agent?.name as string) ?? ''
  const highlights = (sponsor.feature_highlights as string[] | null) ?? []
  const agentSlug = sponsor.agent_slug as string

  const pricingLabel = (() => {
    const price = agent?.starting_price as number | null
    const model = agent?.pricing_model as string | null
    if (!price && model === 'free') return 'Free'
    if (!price) return 'Custom pricing'
    return `From $${price}/mo`
  })()

  return (
    <div style={{ marginBottom: '2rem', borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', position: 'relative' }}>
      <style>{`
        .cs-card-link {
          display: block;
          text-decoration: none;
          color: inherit;
          cursor: pointer;
        }
        .cs-card-link:hover .cs-hero { opacity: 0.92; }
        .cs-hero {
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.15s ease;
        }
        .cs-info-bar {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          padding: 1rem 1.5rem;
          background: white;
          border-top: 1px solid #f1f5f9;
        }
        .cs-info-left { flex: 1; min-width: 0; }
        .cs-info-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.5rem;
          flex-shrink: 0;
        }
        .cs-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem 1.25rem;
          border-radius: 0.5rem;
          background-color: #2563eb;
          color: white;
          font-size: 0.875rem;
          font-weight: 600;
          text-decoration: none;
          white-space: nowrap;
          position: relative;
          z-index: 10;
        }
        .cs-cta:hover { background-color: #1d4ed8; }
        @media (max-width: 600px) {
          .cs-info-bar { flex-direction: column; }
          .cs-info-right {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            width: 100%;
          }
          .cs-cta { flex: 0 0 auto; }
        }
      `}</style>

      {/* Entire card links to agent listing page */}
      <Link href={`/agents/${agentSlug}`} className="cs-card-link">
        {/* Hero zone */}
        <div className="cs-hero" style={{ position: 'relative', backgroundColor: bgColor, minHeight: '140px', padding: '2rem', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 60%, rgba(0,0,0,0.12) 100%)', pointerEvents: 'none' }} />
          <span style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(120,120,120,0.8)', backgroundColor: 'rgba(0,0,0,0.08)', padding: '0.2rem 0.5rem', borderRadius: '9999px', zIndex: 10 }}>
            Category Sponsor
          </span>
          {sponsor.logo_url ? (
            <img
              src={sponsor.logo_url as string}
              alt={agentName}
              style={{ position: 'relative', zIndex: 10, height: '64px', width: 'auto', maxWidth: '260px', objectFit: 'contain', display: 'block' }}
            />
          ) : (
            <span style={{ position: 'relative', zIndex: 10, color: 'white', fontSize: '2rem', fontWeight: 700 }}>
              {agentName}
            </span>
          )}
        </div>

        {/* Info bar */}
        <div className="cs-info-bar">
          <div className="cs-info-left">
            <p style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9375rem', margin: '0 0 0.25rem 0' }}>{agentName}</p>
            {sponsor.tagline && (
              <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0 0 0.5rem 0', lineHeight: 1.5 }}>
                {sponsor.tagline as string}
              </p>
            )}
            {highlights.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                {highlights.slice(0, 3).map((item, i) => (
                  <span key={i} style={{ fontSize: '0.75rem', padding: '0.125rem 0.625rem', borderRadius: '9999px', backgroundColor: '#f1f5f9', color: '#475569', fontWeight: 500 }}>
                    {item}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="cs-info-right">
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>{pricingLabel}</p>
              {sponsor.social_proof && (
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>{sponsor.social_proof as string}</p>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* CTA button sits outside the Link, positioned over the bottom-right */}
      <a
        href={sponsor.cta_url as string}
        target="_blank"
        rel="noopener noreferrer"
        className="cs-cta"
        style={{ position: 'absolute', bottom: '1rem', right: '1.5rem' }}
      >
        {sponsor.cta_text as string}
      </a>
    </div>
  )
}