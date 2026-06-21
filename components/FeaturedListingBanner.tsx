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

  const bgColor = bannerColor || '#1B1B2F'

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
        .premium-banner-outer {
          position: relative;
          width: 100vw;
          left: 50%;
          right: 50%;
          margin-left: -50vw;
          margin-right: -50vw;
          margin-bottom: 1.5rem;
          overflow: hidden;
        }
        .premium-banner-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .premium-banner-bg-image {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
        }
        .premium-banner-bg-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.5);
        }
        .premium-banner-logo-bg {
          position: absolute;
          right: 8%;
          top: 50%;
          transform: translateY(-50%);
          opacity: 0.04;
          pointer-events: none;
          z-index: 0;
        }
        .premium-banner-inner {
          position: relative;
          z-index: 1;
          max-width: 1080px;
          margin: 0 auto;
          padding: 2.5rem 1.5rem;
          display: flex;
          gap: 2rem;
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
          gap: 0.75rem;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
        }
        .premium-logo-img {
          height: 30px;
          width: auto;
          flex-shrink: 0;
          filter: brightness(0) invert(1);
        }
        .premium-logo-divider {
          height: 22px;
          width: 1px;
          background: rgba(255,255,255,0.2);
        }
        .premium-badge {
          font-size: 0.5625rem;
          font-weight: 800;
          color: #F97316;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          background: rgba(249,115,22,0.15);
          padding: 0.2rem 0.5rem;
          border-radius: 0.25rem;
          border: 1px solid rgba(249,115,22,0.3);
          flex-shrink: 0;
        }
        .premium-disclaimer {
          font-size: 0.6875rem;
          color: rgba(255,255,255,0.4);
        }
        .premium-hook {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          margin: 0 0 0.625rem;
          line-height: 1.3;
        }
        .premium-subhook {
          font-size: 0.9375rem;
          color: rgba(255,255,255,0.6);
          margin: 0 0 1.5rem;
          line-height: 1.55;
          max-width: 600px;
        }
        .premium-cta-row {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          flex-wrap: wrap;
        }
        .premium-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          background: #F97316;
          color: white;
          font-size: 0.9375rem;
          font-weight: 700;
          padding: 0.8125rem 2rem;
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
          width: 320px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
        }
        .premium-top-border {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: #F97316;
          z-index: 2;
        }
        @media (max-width: 768px) {
          .premium-banner-inner {
            flex-direction: column;
            padding: 2rem 1.25rem;
            gap: 1.25rem;
          }
          .premium-banner-video {
            width: 100%;
          }
          .premium-hook {
            font-size: 1.1875rem;
          }
          .premium-cta-btn {
            width: 100%;
            justify-content: center;
          }
          .premium-social-proof {
            width: 100%;
            justify-content: center;
          }
          .premium-banner-logo-bg {
            display: none;
          }
        }
      `}</style>

      <div className="premium-banner-outer">
        <div className="premium-top-border" />

        {/* Background layer */}
        <div className="premium-banner-bg" style={{ backgroundColor: bgColor }}>
          {bannerImageUrl && (
            <>
              <div className="premium-banner-bg-image" style={{ backgroundImage: `url(${bannerImageUrl})` }} />
              <div className="premium-banner-bg-overlay" />
            </>
          )}
        </div>

        {/* Faded logo watermark in background */}
        {logoUrl && (
          <div className="premium-banner-logo-bg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoUrl} alt="" style={{ height: '240px', width: 'auto', filter: 'brightness(0) invert(1)' }} aria-hidden="true" />
          </div>
        )}

        {/* Content */}
        <div className="premium-banner-inner">
          <div className="premium-banner-left">
            <div className="premium-banner-meta">
              {logoUrl && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={logoUrl} alt={agentName + ' logo'} className="premium-logo-img" />
                  <div className="premium-logo-divider" />
                </>
              )}
              <span className="premium-badge">Featured</span>
              <span className="premium-disclaimer">Sponsored placement. Editorial score is independent.</span>
            </div>

            <h2 className="premium-hook">{featuredHook}</h2>
            {featuredSubhook && <p className="premium-subhook">{featuredSubhook}</p>}

            <div className="premium-cta-row">
              <a href={ctaUrl} target="_blank" rel="noopener noreferrer" className="premium-cta-btn">
                {ctaText} <span style={{ fontSize: '1.125rem' }}>→</span>
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