'use client'
import DemoVideo from '@/components/DemoVideo'

interface FeaturedListingBannerProps {
  featuredHook: string
  featuredSubhook?: string | null
  ctaText: string
  ctaUrl: string
  bannerImageUrl?: string | null
  bannerColor?: string | null
  logoUrl?: string | null
  agentName: string
  startingPrice?: number | null
  pricingModel?: string | null
  g2Rating?: number | null
  g2ReviewCount?: number | null
  demoVideoUrl?: string | null
  demoVideoType?: string | null
}

export default function FeaturedListingBanner({
  featuredHook,
  featuredSubhook,
  ctaText,
  ctaUrl,
  bannerImageUrl,
  bannerColor,
  logoUrl,
  agentName,
  startingPrice,
  pricingModel,
  g2Rating,
  g2ReviewCount,
  demoVideoUrl,
  demoVideoType,
}: FeaturedListingBannerProps) {

  const bgStyle: React.CSSProperties = bannerImageUrl
    ? { backgroundImage: `url(${bannerImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { backgroundColor: bannerColor || '#111827' }

  const priceLabel = startingPrice != null && startingPrice > 0
    ? 'From $' + startingPrice + '/mo'
    : pricingModel === 'free'
    ? 'Free'
    : pricingModel === 'freemium'
    ? 'Freemium'
    : pricingModel === 'custom'
    ? 'Custom pricing'
    : null

  const hasG2 = g2Rating != null && g2Rating > 0 && g2ReviewCount != null && g2ReviewCount > 0
  const hasVideo = demoVideoUrl && demoVideoType
  const hasSocialProof = priceLabel || hasG2

  return (
    <>
      <style>{`
        .premium-banner-wrap {
          border-radius: 0;
          border-top: 3px solid #F97316;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          margin: -2rem -2rem 1.75rem -2rem;
          overflow: hidden;
          position: relative;
        }
        .premium-banner-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.55);
          z-index: 0;
        }
        .premium-banner-inner {
          position: relative;
          z-index: 1;
          padding: 1.5rem 2rem;
          display: flex;
          gap: 1.5rem;
          align-items: stretch;
        }
        .premium-banner-left {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .premium-banner-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
          flex-wrap: wrap;
        }
        .premium-badge {
          font-size: 0.5625rem;
          font-weight: 800;
          color: #F97316;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          background: rgba(249,115,22,0.15);
          padding: 0.175rem 0.45rem;
          border-radius: 0.25rem;
          border: 1px solid rgba(249,115,22,0.3);
          flex-shrink: 0;
        }
        .premium-disclaimer {
          font-size: 0.6875rem;
          color: rgba(255,255,255,0.45);
        }
        .premium-hook {
          font-size: 1.25rem;
          font-weight: 700;
          color: white;
          margin: 0 0 0.375rem;
          line-height: 1.35;
        }
        .premium-subhook {
          font-size: 0.8125rem;
          color: rgba(255,255,255,0.6);
          margin: 0 0 1rem;
          line-height: 1.55;
        }
        .premium-cta-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .premium-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          background: #F97316;
          color: white;
          font-size: 0.875rem;
          font-weight: 700;
          padding: 0.625rem 1.5rem;
          border-radius: 0.375rem;
          text-decoration: none;
          white-space: nowrap;
          transition: background 0.15s;
        }
        .premium-cta-btn:hover { background: #EA580C; }
        .premium-social-proof {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          font-size: 0.8125rem;
          color: rgba(255,255,255,0.7);
        }
        .premium-proof-dot {
          color: rgba(255,255,255,0.25);
        }
        .premium-banner-video {
          width: 280px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
        }
        @media (max-width: 768px) {
          .premium-banner-inner {
            flex-direction: column;
            padding: 1.25rem;
            gap: 1rem;
          }
          .premium-banner-video {
            width: 100%;
          }
          .premium-hook {
            font-size: 1.0625rem;
          }
          .premium-cta-btn {
            width: 100%;
            justify-content: center;
          }
          .premium-social-proof {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <div className="premium-banner-wrap" style={bgStyle}>
        {bannerImageUrl && <div className="premium-banner-overlay" />}
        <div className="premium-banner-inner">
          <div className="premium-banner-left">
            <div className="premium-banner-meta">
              {logoUrl && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={logoUrl} alt={agentName + ' logo'} style={{ height: '24px', width: 'auto', flexShrink: 0 }} />
                  <div style={{ height: '16px', width: '1px', background: 'rgba(255,255,255,0.2)' }} />
                </>
              )}
              <span className="premium-badge">Featured</span>
              <span className="premium-disclaimer">Sponsored placement. Editorial score is independent.</span>
            </div>

            <h2 className="premium-hook">{featuredHook}</h2>
            {featuredSubhook && <p className="premium-subhook">{featuredSubhook}</p>}

            <div className="premium-cta-row">
              <a href={ctaUrl} target="_blank" rel="noopener noreferrer" className="premium-cta-btn">
                {ctaText} <span style={{ fontSize: '1rem' }}>→</span>
              </a>
              {hasSocialProof && (
                <div className="premium-social-proof">
                  {priceLabel && <span>{priceLabel}</span>}
                  {priceLabel && hasG2 && <span className="premium-proof-dot">·</span>}
                  {hasG2 && <span>★ {Number(g2Rating).toFixed(1)}/5</span>}
                  {hasG2 && <span className="premium-proof-dot">·</span>}
                  {hasG2 && <span>{Number(g2ReviewCount).toLocaleString()} G2 reviews</span>}
                </div>
              )}
            </div>
          </div>

          {hasVideo && (
            <div className="premium-banner-video">
              <DemoVideo
                url={demoVideoUrl!}
                type={demoVideoType as 'mp4' | 'youtube' | 'vimeo'}
                variant="banner"
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}