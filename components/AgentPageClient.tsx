'use client'
import { useState, useEffect, ReactNode } from 'react'
import Link from 'next/link'
import { ReviewForm } from '@/components/ReviewSection'
import AgentLogo from '@/components/AgentLogo'
import CompareButton from '@/components/CompareButton'
import FeaturedListingBanner from '@/components/FeaturedListingBanner'
import DemoVideo from '@/components/DemoVideo'

interface Review {
  id: string
  rating: number
  comment: string | null
  reviewer_name: string
  created_at: string
  updated_at: string | null
}

interface SimilarAgent {
  id: string
  name: string
  slug: string
  short_description: string | null
  rating_avg: number
  capability_tags: string[]
}

interface RelatedContentItem {
  slug: string
  title: string
}

interface RelatedContent {
  ownAlternatives: RelatedContentItem | null
  guides: RelatedContentItem[]
}

function Stars({ value }: { value: number }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1,2,3,4,5].map((s) => (
        <span key={s} style={{ fontSize: '1.125rem', lineHeight: 1, color: s <= value ? '#2563EB' : '#D1D5DB' }}>★</span>
      ))}
    </div>
  )
}

function OnOurRadarBadge({ size = 'sm' }: { size?: 'sm' | 'lg' }) {
  const isLg = size === 'lg'
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: isLg ? '0.5rem' : '0.3rem',
      padding: isLg ? '0.625rem 1rem' : '0.2rem 0.6rem',
      borderRadius: '0.5rem',
      backgroundColor: '#FFFBEB',
      border: '1px solid #FDE68A',
    }}>
      <svg
        width={isLg ? 18 : 12}
        height={isLg ? 18 : 12}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#D97706"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="2" fill="#D97706" stroke="none" />
        <path d="M12 2a10 10 0 0 1 10 10" />
        <path d="M12 6a6 6 0 0 1 6 6" />
      </svg>
      <span style={{
        fontSize: isLg ? '0.8125rem' : '0.6875rem',
        fontWeight: 800,
        color: '#D97706',
        textTransform: 'uppercase',
        letterSpacing: '0.07em',
        whiteSpace: 'nowrap',
      }}>
        On Our Radar
      </span>
    </div>
  )
}

function formatGitHubStars(count: number): string {
  if (count >= 1000) return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  return String(count)
}

function injectDynamicValues(text: string, githubStars: number | null): string {
  if (!text) return text
  const starsFormatted = githubStars ? formatGitHubStars(githubStars) : ''
  return text.replace(/\{\{github_stars\}\}/g, starsFormatted)
}

function injectLinkedContent(
  text: string,
  githubStars: number | null,
  agentNameMap: Record<string, string>
): ReactNode {
  if (!text) return text
  const processed = injectDynamicValues(text, githubStars)
  const names = Object.keys(agentNameMap).sort((a, b) => b.length - a.length)
  if (names.length === 0) return processed
  const escaped = names.map(n => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const pattern = new RegExp('\\b(' + escaped.join('|') + ')\\b', 'g')
  const parts: ReactNode[] = []
  const linked = new Set<string>()
  let lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = pattern.exec(processed)) !== null) {
    const name = match[1]
    const slug = agentNameMap[name]
    if (linked.has(name)) continue
    linked.add(name)
    if (match.index > lastIndex) {
      parts.push(processed.slice(lastIndex, match.index))
    }
    parts.push(
      <Link
        key={slug + '-' + match.index}
        href={'/agents/' + slug}
        style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}
      >
        {name}
      </Link>
    )
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < processed.length) {
    parts.push(processed.slice(lastIndex))
  }
  if (parts.length === 0) return processed
  return <>{parts}</>
}

function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return <div id="reviews" />
  return (
    <div id="reviews" style={{ backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #E5E7EB', padding: '1.5rem' }}>
      <h3 style={{ fontWeight: 600, color: '#111827', marginBottom: '1rem', fontSize: '1rem' }}>Community reviews ({reviews.length})</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {reviews.map((review) => (
          <div key={review.id} style={{ borderBottom: '1px solid #F3F4F6', paddingBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontWeight: 500, fontSize: '0.875rem', color: '#111827' }}>{review.reviewer_name}</span>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[1,2,3,4,5].map((s) => (
                    <span key={s} style={{ fontSize: '1rem', lineHeight: 1, color: s <= review.rating ? '#2563EB' : '#D1D5DB' }}>★</span>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{new Date(review.created_at).toLocaleDateString()}</span>
                {review.updated_at && review.updated_at !== review.created_at && (
                  <span style={{ fontSize: '0.75rem', color: '#9CA3AF', marginLeft: '0.25rem' }}>(edited)</span>
                )}
              </div>
            </div>
            {review.comment && <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.6, marginTop: '0.25rem' }}>{review.comment}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AgentPageClient({
  agent,
  initialReviews,
  similarAgents,
  relatedContent,
  agentNameMap = {},
}: {
  agent: any
  initialReviews: Review[]
  similarAgents: SimilarAgent[]
  relatedContent: RelatedContent
  agentNameMap?: Record<string, string>
}) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [ratingAvg, setRatingAvg] = useState<number>(
    agent.rating_count > 0 && agent.rating_avg > 0
      ? agent.rating_avg
      : (agent.editorial_rating ?? 0)
  )
  const [ratingCount, setRatingCount] = useState<number>(agent.rating_count ?? 0)
  const [isDescExpanded, setIsDescExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    fetch('/api/reviews?agent_id=' + agent.id)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setReviews(data)
          const avg = data.reduce((sum: number, r: Review) => sum + r.rating, 0) / data.length
          setRatingAvg(Math.round(avg * 10) / 10)
          setRatingCount(data.length)
        }
      })
      .catch(() => {})
  }, [agent.id])

  const handleReviewSubmitted = () => {
    fetch('/api/reviews?agent_id=' + agent.id)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setReviews(data)
          if (data.length > 0) {
            const avg = data.reduce((sum: number, r: Review) => sum + r.rating, 0) / data.length
            setRatingAvg(Math.round(avg * 10) / 10)
            setRatingCount(data.length)
          }
        }
      })
      .catch(() => {})
  }

  const editorialRating = agent.editorial_rating != null ? Number(agent.editorial_rating) : null
  const displayRating = editorialRating != null ? editorialRating.toFixed(1) : (ratingAvg > 0 ? ratingAvg.toFixed(1) : null)
  const indEvidScore = agent.editorial_rating_notes
    ? parseInt(agent.editorial_rating_notes.match(/IndEvid (\d)/)?.[1] ?? '5')
    : 5
  const isEmerging = (editorialRating !== null && editorialRating < 3.0) || indEvidScore === 1
  const hasRelatedContent = relatedContent.ownAlternatives !== null || relatedContent.guides.length > 0
  const lastVerifiedFormatted = agent.last_verified_at
    ? new Date(agent.last_verified_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null
  const hasPremiumBanner = agent.is_featured && agent.featured_hook

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '1.5rem 1.5rem 4rem' }}>

      {/* Breadcrumb */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#6B7280', marginBottom: '1rem' }}>
      <Link href="/" style={{ color: '#6B7280', textDecoration: 'none' }}>Home</Link>
        <span style={{ color: '#D1D5DB' }}>/</span>
        <Link href={'/' + agent.primary_category} style={{ color: '#6B7280', textDecoration: 'none' }}>
          {agent.primary_category.split('-').map((w: string) => w === 'ai' ? 'AI' : w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
        </Link>
        <span style={{ color: '#D1D5DB' }}>/</span>
        <span style={{ color: '#111827' }}>{agent.name}</span>
      </nav>

      {/* Byline */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: '#6B7280', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <span>By</span>
        <Link href="/about" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 600 }}>Heather MacAvelia</Link>
        {lastVerifiedFormatted && (
          <>
            <span style={{ color: '#D1D5DB' }}>·</span>
            <span>Last verified {lastVerifiedFormatted}</span>
          </>
        )}
      </div>

      {/* PREMIUM BANNER — outside the white card, full width within max-w container */}
      {hasPremiumBanner && (
        <FeaturedListingBanner
          featuredHook={agent.featured_hook}
          featuredSubhook={agent.featured_subhook}
          ctaText={agent.cta_text || (agent.pricing_model === 'free' || agent.pricing_model === 'freemium' ? 'Start Free' : 'Get Started')}
          ctaUrl={agent.cta_url || agent.website_url || '#'}
          bannerImageUrl={agent.banner_image_url}
          bannerColor={agent.banner_color}
          logoUrl={agent.sponsor_logo_url}
          agentName={agent.name}
          startingPrice={agent.starting_price}
          pricingModel={agent.pricing_model}
          g2Rating={agent.g2_rating}
          g2ReviewCount={agent.g2_review_count}
          demoVideoUrl={agent.demo_video_url}
          demoVideoType={agent.demo_video_type}
        />
      )}

      {/* HERO SECTION — white card */}
      <div style={{ backgroundColor: 'white', borderRadius: '0.625rem', border: '1px solid #E5E7EB', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', marginBottom: '1.5rem', overflow: 'hidden' }}>

        {/* Legacy featured banner for listings without premium hook */}
        {agent.is_featured && !agent.featured_hook && (
          <>
            <style>{`
              .feat-banner { background: #111827; border-radius: 0; border-top: 3px solid #F97316; border-bottom: 1px solid #1F2937; margin: -2rem -2rem 1.75rem -2rem; padding: 1.25rem 2rem; display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; }
              .feat-left { min-width: 0; flex: 1; }
              .feat-meta { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
              .feat-badge { font-size: 0.5625rem; font-weight: 800; color: #F97316; text-transform: uppercase; letter-spacing: 0.15em; background: rgba(249,115,22,0.15); padding: 0.175rem 0.45rem; border-radius: 0.25rem; border: 1px solid rgba(249,115,22,0.3); flex-shrink: 0; }
              .feat-disclaimer { font-size: 0.6875rem; color: #6B7280; }
              .feat-bestfor { font-size: 1.0625rem; font-weight: 700; color: white; margin: 0; line-height: 1.35; }
              .feat-right { display: flex; flex-direction: column; align-items: flex-end; gap: 0.375rem; flex-shrink: 0; }
              .feat-price { font-size: 0.8125rem; font-weight: 600; color: #D1D5DB; }
              .feat-g2 { font-size: 0.75rem; color: #9CA3AF; }
              .feat-cta { display: inline-flex; align-items: center; padding: 0.5rem 1.25rem; border-radius: 0.375rem; background-color: #F97316; color: white; font-size: 0.875rem; font-weight: 700; text-decoration: none; white-space: nowrap; margin-top: 0.25rem; }
              @media (max-width: 768px) { .feat-banner { flex-direction: column; align-items: stretch; padding: 1rem 1.25rem; gap: 0.875rem; } .feat-meta { flex-wrap: wrap; } .feat-disclaimer { font-size: 0.625rem; } .feat-bestfor { font-size: 0.9375rem; } .feat-right { flex-direction: row; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; } .feat-cta { margin-top: 0; } }
            `}</style>
            <div className="feat-banner">
              <div className="feat-left">
                <div className="feat-meta">
                  <span className="feat-badge">Featured</span>
                  <span className="feat-disclaimer">Sponsored placement. Editorial score is independent.</span>
                </div>
                {agent.best_for && <p className="feat-bestfor">{agent.best_for}</p>}
              </div>
              <div className="feat-right">
                {(() => {
                  const label = agent.starting_price === 0 || agent.pricing_model === 'free' ? 'Free' : agent.starting_price != null ? 'From $' + agent.starting_price + '/mo' : agent.pricing_model === 'custom' ? 'Custom pricing' : null
                  return label ? <span className="feat-price">{label}</span> : null
                })()}
                {agent.g2_rating != null && agent.g2_review_count != null && agent.g2_review_count > 0 && (
                  <span className="feat-g2">{'★ ' + Number(agent.g2_rating).toFixed(1) + '/5 · ' + Number(agent.g2_review_count).toLocaleString() + ' G2 reviews'}</span>
                )}
                {agent.website_url && (
                  <a href={agent.website_url} target="_blank" rel="noopener noreferrer" className="feat-cta">
                    {agent.starting_price === 0 || agent.pricing_model === 'free' || agent.pricing_model === 'freemium' ? 'Start Free →' : 'Get Started →'}
                  </a>
                )}
              </div>
            </div>
          </>
        )}

        {/* Agent header */}
        <div className="agent-hero-top" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.5rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flex: 1, minWidth: 0 }}>
            <div style={{ flexShrink: 0 }}>
              <AgentLogo name={agent.name} websiteUrl={agent.website_url} faviconDomain={agent.favicon_domain} logoUrl={agent.logo_url} size="lg" />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#111827', margin: 0, lineHeight: 1.2, letterSpacing: '-0.02em' }}>{agent.name}</h1>
                {isEmerging ? (
                  <a href="#rating-card" style={{ textDecoration: 'none', flexShrink: 0 }} title="On Our Radar — independent public signal pending">
                    <OnOurRadarBadge size="sm" />
                  </a>
                ) : displayRating ? (
                  <a href="#rating-card" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0, textDecoration: 'none', cursor: 'pointer' }} title="See how we calculate this score">
                    <span style={{ color: '#2563EB', fontSize: '1rem', lineHeight: 1 }}>★</span>
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: '#111827' }}>{displayRating}</span>
                    <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>/ 5</span>
                  </a>
                ) : null}
              </div>
              <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: '0 0 0.625rem' }}>
                by {agent.developer}
                {agent.vendor_claimed && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ display: 'inline-block', marginLeft: '0.3rem', verticalAlign: 'middle', marginTop: '-1px' }}>
                    <circle cx="12" cy="12" r="10" fill="#2563EB"/>
                    <polyline points="8 12 11 15 16 9" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flexWrap: 'wrap' }}>
                {agent.is_featured && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.125rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.625rem', fontWeight: 700, backgroundColor: '#FFF7ED', color: '#C2410C', textTransform: 'uppercase', letterSpacing: '0.05em', border: '1px solid #FDBA74' }}>Featured</span>
                )}
                {agent.mcp_compatible === true && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', padding: '0.125rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.625rem', fontWeight: 700, backgroundColor: '#ECFDF5', color: '#059669', textTransform: 'uppercase', letterSpacing: '0.05em', border: '1px solid #A7F3D0' }}>
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                    MCP
                  </span>
                )}
               
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', padding: '0.125rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.625rem', fontWeight: 700, backgroundColor: '#EFF6FF', color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.05em', border: '1px solid #BFDBFE' }}>
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Independently Reviewed
                </span>
              </div>
            </div>
          </div>
          {agent.website_url && (
            <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              {hasPremiumBanner ? (
                <a href={agent.website_url} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', padding: '0.625rem 1.25rem', borderRadius: '0.375rem', backgroundColor: 'transparent', color: '#6B7280', fontSize: '0.8125rem', fontWeight: 500, textDecoration: 'none', border: '1px solid #D1D5DB', letterSpacing: '0.01em' }}>
                  Visit {agent.favicon_domain || 'site'} <span style={{ marginLeft: '0.25rem', fontSize: '0.75rem' }}>↗</span>
                </a>
              ) : (
                <a href={agent.website_url} target="_blank" rel="noopener noreferrer"
                  className="agent-visit-btn"
                  style={{ display: 'inline-flex', alignItems: 'center', padding: '0.625rem 1.5rem', borderRadius: '0.375rem', backgroundColor: '#111827', color: 'white', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', letterSpacing: '0.01em' }}>
                  {agent.favicon_domain ? 'Visit ' + agent.favicon_domain : 'Visit site'} →
                </a>
              )}
              {['apollo-io','instantly-ai','instantly-ai-sales-agent','lemlist','make','close-crm','pipedrive-ai','zoho-crm','hubspot-sales-hub'].includes(agent.slug) && (
                <span style={{ fontSize: '0.625rem', color: '#9CA3AF', marginTop: '0.375rem', textAlign: 'right' }}>
                  Affiliate link. We may earn a commission at no cost to you.
                </span>
              )}
            </div>
          )}
        </div>

        <p style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.7, margin: '0 0 0.75rem', maxWidth: '680px' }}>{agent.short_description}</p>
        <CompareButton agent={{ slug: agent.slug, name: agent.name, websiteUrl: agent.website_url, faviconDomain: agent.favicon_domain }} />

        {/* Standalone demo video for non-featured listings with video add-on */}
        {agent.demo_video_url && agent.demo_video_type && !hasPremiumBanner && (
          <div style={{ marginTop: '1.25rem', maxWidth: '400px' }}>
            <DemoVideo url={agent.demo_video_url} type={agent.demo_video_type as 'mp4' | 'youtube' | 'vimeo'} variant="standalone" />
          </div>
        )}

        {/* 4-block instant snapshot */}
        <div className="agent-snapshot-grid" style={{ marginTop: '1.25rem', borderTop: '1px solid #F3F4F6', borderBottom: '1px solid #F3F4F6' }}>
          {(() => {
            const content = (
              <div style={{ padding: '0.875rem 1rem', borderRight: '1px solid #F3F4F6', textAlign: 'center', cursor: agent.pricing_url ? 'pointer' : 'default' }}>
                <p style={{ fontSize: '0.5625rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 0.3rem' }}>From</p>
                <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', margin: 0, lineHeight: 1.1 }}>{agent.starting_price === 0 ? 'Free' : agent.starting_price != null ? '$' + agent.starting_price : 'Custom'}</p>
                <p style={{ fontSize: '0.625rem', color: agent.pricing_url ? '#2563EB' : '#6B7280', margin: '0.2rem 0 0', textTransform: 'capitalize' }}>{agent.pricing_model}{agent.pricing_url ? ' ↗' : ''}</p>
              </div>
            )
            return agent.pricing_url ? <a href={agent.pricing_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>{content}</a> : content
          })()}
          {(() => {
            const content = (
              <div style={{ padding: '0.875rem 1rem', borderRight: '1px solid #F3F4F6', textAlign: 'center', cursor: agent.github_repo_url ? 'pointer' : 'default' }}>
                <p style={{ fontSize: '0.5625rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 0.3rem' }}>GitHub</p>
                <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', margin: 0, lineHeight: 1.1 }}>{agent.github_stars != null && agent.github_stars > 0 ? '⭐ ' + formatGitHubStars(agent.github_stars) : '—'}</p>
                <p style={{ fontSize: '0.625rem', color: agent.github_repo_url ? '#2563EB' : '#6B7280', margin: '0.2rem 0 0' }}>{agent.github_repo_url ? 'View on GitHub ↗' : 'Stars'}</p>
              </div>
            )
            return agent.github_repo_url ? <a href={agent.github_repo_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>{content}</a> : content
          })()}
          {(() => {
            const g2Url = (agent.same_as_urls ?? []).find((u: string) => u.includes('g2.com'))
            const content = (
              <div style={{ padding: '0.875rem 1rem', borderRight: '1px solid #F3F4F6', textAlign: 'center', cursor: g2Url ? 'pointer' : 'default' }}>
                <p style={{ fontSize: '0.5625rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 0.3rem' }}>G2</p>
                <p style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#111827', margin: 0, lineHeight: 1.1 }}>{agent.g2_rating != null && agent.g2_rating > 0 ? Number(agent.g2_rating).toFixed(1) + ' / 5' : '—'}</p>
                <p style={{ fontSize: '0.6875rem', color: g2Url ? '#2563EB' : '#6B7280', margin: '0.2rem 0 0' }}>{agent.g2_review_count != null && agent.g2_review_count > 0 ? agent.g2_review_count.toLocaleString() + ' reviews ↗' : g2Url ? 'View on G2 ↗' : 'Rating'}</p>
              </div>
            )
            return g2Url ? <a href={g2Url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>{content}</a> : content
          })()}
          <div style={{ padding: '0.875rem 1rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.5625rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 0.3rem' }}>MCP</p>
            <p style={{ fontSize: '1.25rem', fontWeight: 800, color: agent.mcp_compatible ? '#059669' : '#6B7280', margin: 0, lineHeight: 1.1 }}>{agent.mcp_compatible ? '⚡ Yes' : 'No'}</p>
            <p style={{ fontSize: '0.625rem', color: '#6B7280', margin: '0.2rem 0 0' }}>Compatible</p>
          </div>
        </div>

        {/* Long description */}
        {agent.long_description && (
          <div style={{ marginTop: '1.25rem' }}>
            <p style={{ fontSize: '0.875rem', color: '#6B7280', lineHeight: 1.7 }}>
              {isMobile && !isDescExpanded
                ? injectLinkedContent(agent.long_description.slice(0, 400) + '...', agent.github_stars, agentNameMap)
                : injectLinkedContent(agent.long_description, agent.github_stars, agentNameMap)
              }
            </p>
            {isMobile && !isDescExpanded && agent.long_description.length > 400 && (
              <button onClick={() => setIsDescExpanded(true)} style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', padding: '0.5rem 0', marginTop: '0.25rem' }}>Read more ↓</button>
            )}
          </div>
        )}
      </div>

      {/* QUICK STATS */}
      <div className="agent-stats-cards" style={{ marginBottom: '1.5rem' }}>
        {agent.pricing_url ? (
          <a href={agent.pricing_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #E5E7EB', padding: '1rem', textAlign: 'center' }}>
              <p style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.25rem' }}>Pricing</p>
              <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', margin: '0 0 0.1rem', textTransform: 'capitalize' }}>{agent.pricing_model}{agent.starting_price != null && agent.starting_price > 0 ? ' · $' + agent.starting_price : agent.starting_price === 0 ? ' · Free' : ''}</p>
              <p style={{ fontSize: '0.6875rem', color: '#2563EB', margin: 0 }}>View pricing ↗</p>
            </div>
          </a>
        ) : (
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #E5E7EB', padding: '1rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.25rem' }}>Pricing</p>
            <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', margin: 0, textTransform: 'capitalize' }}>{agent.pricing_model}{agent.starting_price != null && agent.starting_price > 0 ? ' · $' + agent.starting_price : agent.starting_price === 0 ? ' · Free' : ''}</p>
          </div>
        )}
        <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #E5E7EB', padding: '1rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.25rem' }}>Segment</p>
          <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', margin: 0, textTransform: 'uppercase' }}>{agent.customer_segment}</p>
        </div>
        {agent.deployment_difficulty && (
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #E5E7EB', padding: '1rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.25rem' }}>Setup</p>
            <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', margin: 0, textTransform: 'capitalize' }}>{agent.deployment_difficulty}</p>
          </div>
        )}
        {agent.last_verified_at && (
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #E5E7EB', padding: '1rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.25rem' }}>Verified</p>
            <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', margin: 0 }}>{lastVerifiedFormatted}</p>
          </div>
        )}
      </div>

      {/* QUICK FACTS */}
      {(agent.pricing_transparency || agent.contract_type || agent.data_training || agent.human_in_loop) && (
        <div className="agent-stats-cards" style={{ marginBottom: '1.5rem' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #E5E7EB', padding: '1rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.25rem' }}>Transparency</p>
            {agent.pricing_transparency === 'public' && <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#16A34A', margin: 0 }}>Public</p>}
            {agent.pricing_transparency === 'partial' && <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#D97706', margin: 0 }}>Partial</p>}
            {agent.pricing_transparency === 'quote-only' && <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#DC2626', margin: 0 }}>Quote Only</p>}
            {!agent.pricing_transparency && <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#D1D5DB', margin: 0 }}>—</p>}
          </div>
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #E5E7EB', padding: '1rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.25rem' }}>Contract</p>
            {agent.contract_type === 'monthly' && <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', margin: 0 }}>Month-to-month</p>}
            {agent.contract_type === 'annual-only' && <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', margin: 0 }}>Annual Only</p>}
            {agent.contract_type === 'both' && <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', margin: 0 }}>Monthly or Annual</p>}
            {!agent.contract_type && <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#D1D5DB', margin: 0 }}>—</p>}
          </div>
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #E5E7EB', padding: '1rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.25rem' }}>Data training</p>
            {agent.data_training === 'no' && <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#16A34A', margin: 0 }}>Not Trained</p>}
            {agent.data_training === 'opt-out' && <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#D97706', margin: 0 }}>Opt-out</p>}
            {agent.data_training === 'yes' && <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#DC2626', margin: 0 }}>Trained</p>}
            {agent.data_training === 'not-disclosed' && <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#6B7280', margin: 0 }}>Not Disclosed</p>}
            {!agent.data_training && <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#D1D5DB', margin: 0 }}>—</p>}
          </div>
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #E5E7EB', padding: '1rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.25rem' }}>Autonomy</p>
            {agent.human_in_loop === 'required' && <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', margin: 0 }}>Human Required</p>}
            {agent.human_in_loop === 'optional' && <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', margin: 0 }}>Human Optional</p>}
            {agent.human_in_loop === 'not-required' && <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', margin: 0 }}>Autonomous</p>}
            {!agent.human_in_loop && <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#D1D5DB', margin: 0 }}>—</p>}
          </div>
        </div>
      )}

      {/* CONTENT + SIDEBAR */}
      <div className="agent-content-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: 0 }}>
          {agent.capability_tags && agent.capability_tags.length > 0 && (
            <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #E5E7EB', padding: '1.5rem' }}>
              <h2 style={{ fontWeight: 700, color: '#111827', marginBottom: '0.875rem', fontSize: '1rem' }}>Capabilities</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                {agent.capability_tags.map(function(tag: string) { return <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', padding: '0.25rem 0.625rem', borderRadius: '0.375rem', fontSize: '0.8125rem', fontFamily: 'monospace', backgroundColor: '#EFF6FF', color: '#1D4ED8', border: '1px solid #DBEAFE' }}>{tag}</span> })}
              </div>
            </div>
          )}
          {((agent.pros && agent.pros.length > 0) || (agent.limitations && agent.limitations.length > 0)) && (
            <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #E5E7EB', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h2 style={{ fontWeight: 700, color: '#111827', fontSize: '1rem', margin: 0 }}>Pros &amp; Limitations</h2>
                <span style={{ fontSize: '0.6875rem', color: '#9CA3AF', backgroundColor: '#F9FAFB', padding: '0.2rem 0.5rem', borderRadius: '0.25rem' }}>Editorial assessment</span>
              </div>
              <div className="agent-pros-grid">
                {agent.pros && agent.pros.length > 0 && (
                  <div>
                    <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16A34A', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Pros</h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                      {agent.pros.map(function(pro: string) { return (<li key={pro} style={{ fontSize: '0.875rem', color: '#374151', display: 'flex', gap: '0.5rem', alignItems: 'flex-start', lineHeight: 1.5 }}><span style={{ color: '#16A34A', flexShrink: 0, fontWeight: 700 }}>✓</span><span>{injectLinkedContent(pro, agent.github_stars, agentNameMap)}</span></li>) })}
                    </ul>
                  </div>
                )}
                {agent.limitations && agent.limitations.length > 0 && (
                  <div>
                    <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D97706', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Limitations</h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                      {agent.limitations.map(function(lim: string) { return (<li key={lim} style={{ fontSize: '0.875rem', color: '#374151', display: 'flex', gap: '0.5rem', alignItems: 'flex-start', lineHeight: 1.5 }}><span style={{ color: '#D97706', flexShrink: 0, fontWeight: 700 }}>⚠</span><span>{injectLinkedContent(lim, agent.github_stars, agentNameMap)}</span></li>) })}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #E5E7EB', padding: '1.5rem' }}>
            <h2 style={{ fontWeight: 700, color: '#111827', marginBottom: '0.875rem', fontSize: '1rem' }}>Technical Details</h2>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {agent.deployment_method && agent.deployment_method.length > 0 && (<div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem 0', borderBottom: '1px solid #F3F4F6', gap: '1rem' }}><span style={{ fontSize: '0.875rem', color: '#6B7280', flexShrink: 0, whiteSpace: 'nowrap' }}>Deployment</span><div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>{agent.deployment_method.map(function(d: string) { return <span key={d} style={{ padding: '0.125rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', backgroundColor: '#F3F4F6', color: '#374151', fontFamily: 'monospace' }}>{d}</span> })}</div></div>)}
              {agent.model_architecture && (<div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem 0', borderBottom: '1px solid #F3F4F6', gap: '1rem' }}><span style={{ fontSize: '0.875rem', color: '#6B7280', flexShrink: 0, whiteSpace: 'nowrap' }}>Model architecture</span><span style={{ fontSize: '0.875rem', fontFamily: 'monospace', color: '#374151', textAlign: 'right' }}>{agent.model_architecture}</span></div>)}
              {agent.avg_setup_time && (<div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem 0', borderBottom: '1px solid #F3F4F6', gap: '1rem' }}><span style={{ fontSize: '0.875rem', color: '#6B7280', flexShrink: 0, whiteSpace: 'nowrap' }}>Avg setup time</span><span style={{ fontSize: '0.875rem', color: '#374151', textAlign: 'right' }}>{agent.avg_setup_time}</span></div>)}
              {agent.autonomous_rate && (<div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem 0', borderBottom: '1px solid #F3F4F6', gap: '1rem' }}><span style={{ fontSize: '0.875rem', color: '#6B7280', flexShrink: 0, whiteSpace: 'nowrap' }}>Autonomous rate</span><span style={{ fontSize: '0.875rem', color: '#374151', textAlign: 'right' }}>{agent.autonomous_rate}</span></div>)}
              {agent.mcp_compatible === true && (<div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem 0', borderBottom: '1px solid #F3F4F6', gap: '1rem' }}><span style={{ fontSize: '0.875rem', color: '#6B7280', flexShrink: 0, whiteSpace: 'nowrap' }}>MCP compatible</span><span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>Yes</span></div>)}
              {agent.integrations && agent.integrations.length > 0 && (<div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem 0', borderBottom: '1px solid #F3F4F6', gap: '1rem' }}><span style={{ fontSize: '0.875rem', color: '#6B7280', flexShrink: 0, whiteSpace: 'nowrap' }}>Integrations</span><div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', justifyContent: 'flex-end' }}>{agent.integrations.map(function(i: string) { return <span key={i} style={{ padding: '0.125rem 0.375rem', borderRadius: '0.25rem', fontSize: '0.75rem', backgroundColor: '#F3F4F6', color: '#374151' }}>{i}</span> })}</div></div>)}
              {agent.security_certifications && agent.security_certifications.length > 0 && (<div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem 0', gap: '1rem' }}><span style={{ fontSize: '0.875rem', color: '#6B7280', flexShrink: 0, whiteSpace: 'nowrap' }}>Security</span><div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', justifyContent: 'flex-end' }}>{agent.security_certifications.map(function(s: string) { return <span key={s} style={{ padding: '0.125rem 0.375rem', borderRadius: '0.25rem', fontSize: '0.75rem', backgroundColor: '#F0FDF4', color: '#16A34A' }}>{s}</span> })}</div></div>)}
            </div>
          </div>
          {similarAgents && similarAgents.length > 0 && (
            <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #E5E7EB', padding: '1.5rem' }}>
              <h2 style={{ fontWeight: 700, color: '#111827', marginBottom: '0.875rem', fontSize: '1rem' }}>Similar agents</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {similarAgents.map(function(similar: SimilarAgent) { return (<Link key={similar.slug} href={'/agents/' + similar.slug} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #F3F4F6', textDecoration: 'none', backgroundColor: '#FAFAFA' }}><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827' }}>{similar.name}</div>{similar.short_description && (<div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{similar.short_description.substring(0, 70)}{similar.short_description.length > 70 ? '...' : ''}</div>)}</div><span style={{ fontSize: '0.875rem', color: '#2563EB', flexShrink: 0, marginLeft: '1rem' }}>→</span></Link>) })}
              </div>
            </div>
          )}
          <ReviewList reviews={reviews} />
        </div>

        {/* SIDEBAR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div id="rating-card" className="agent-rating-card" style={{ backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #E5E7EB', padding: '1.5rem 1.25rem', display: 'block', textAlign: 'center' }}>
            <h3 style={{ fontWeight: 700, color: '#111827', marginBottom: '0.75rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Rating</h3>
            {isEmerging ? (
              <div style={{ marginBottom: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}><OnOurRadarBadge size="lg" /></div>
                <p style={{ fontSize: '0.8125rem', color: '#6B7280', lineHeight: 1.6, margin: '0 0 0.75rem', textAlign: 'center' }}>Scores well on capability assessment. A full rating requires independent public signal.</p>
                <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '0.375rem', padding: '0.625rem 0.75rem', textAlign: 'left', marginBottom: '0.75rem' }}>
                  <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#92400E', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 0.25rem' }}>Earn a full rating</p>
                  <p style={{ fontSize: '0.75rem', color: '#78350F', lineHeight: 1.5, margin: 0 }}>G2 reviews · Product Hunt launch · GitHub stars</p>
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.375rem', marginBottom: '0.5rem', justifyContent: 'center' }}>
                  <span style={{ fontSize: '2.75rem', fontWeight: 800, color: '#111827', lineHeight: 1 }}>{editorialRating != null ? editorialRating.toFixed(1) : (ratingAvg > 0 ? ratingAvg.toFixed(1) : '—')}</span>
                  <span style={{ color: '#9CA3AF', fontSize: '1rem' }}>/ 5</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.625rem' }}><Stars value={Math.round(editorialRating ?? ratingAvg)} /></div>
                <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: '0 0 0.375rem' }}>Editorial score</p>
              </>
            )}
            {ratingCount > 0 && (<a href="#reviews" style={{ display: 'block', fontSize: '0.75rem', color: '#2563EB', margin: '0 0 0.75rem', textDecoration: 'none' }}>Community: {ratingAvg.toFixed(1)} · {ratingCount} {ratingCount === 1 ? 'review' : 'reviews'} ↓</a>)}
            {!ratingCount && <div style={{ marginBottom: '0.75rem' }} />}
            <Link href="/methodology#s4" style={{ display: 'inline-block', fontSize: '0.75rem', color: '#2563EB', textDecoration: 'none', fontWeight: 500, padding: '0.375rem 0.75rem', border: '1px solid #DBEAFE', borderRadius: '0.375rem', backgroundColor: '#EFF6FF' }}>How we score this →</Link>
            {agent.editorial_rating_notes && (
              <div style={{ marginTop: '0.75rem', padding: '0.625rem 0.75rem', backgroundColor: '#F9FAFB', borderRadius: '0.375rem', border: '1px solid #F3F4F6', textAlign: 'left' }}>
                <p style={{ fontSize: '0.625rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.375rem' }}>Score breakdown</p>
                <p style={{ fontSize: '0.75rem', color: '#4B5563', lineHeight: 1.6, margin: 0, fontFamily: 'monospace' }}>{agent.editorial_rating_notes}</p>
              </div>
            )}
          </div>
          {agent.industry_tags && agent.industry_tags.length > 0 && (
            <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #E5E7EB', padding: '1.25rem' }}>
              <h3 style={{ fontWeight: 700, color: '#111827', marginBottom: '0.75rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Industries</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                {agent.industry_tags.map(function(tag: string) {
                  const INDUSTRY_LABELS: Record<string, string> = { 'b2b': 'B2B', 'b2c': 'B2C', 'saas': 'SaaS', 'smb': 'SMB', 'dtc': 'DTC', 'aws': 'AWS', 'ecommerce': 'eCommerce', 'real-estate': 'Real Estate', 'devtools': 'DevTools', 'open-source': 'Open Source', 'pharma': 'Pharma', 'finance': 'Finance', 'healthcare': 'Healthcare', 'legal': 'Legal', 'insurance': 'Insurance', 'enterprise': 'Enterprise', 'startups': 'Startups', 'agencies': 'Agencies', 'retail': 'Retail', 'cloud': 'Cloud' }
                  return <span key={tag} style={{ padding: '0.2rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', backgroundColor: '#F3F4F6', color: '#374151' }}>{INDUSTRY_LABELS[tag] ?? tag.charAt(0).toUpperCase() + tag.slice(1)}</span>
                })}
              </div>
            </div>
          )}
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #E5E7EB', padding: '1.25rem' }}>
            <h3 style={{ fontWeight: 700, color: '#111827', marginBottom: '0.875rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Leave a review</h3>
            <ReviewForm agentId={agent.id} agentName={agent.name} onReviewSubmitted={handleReviewSubmitted} />
          </div>
          <Link href={'/stacks?agent=' + agent.slug} style={{ display: 'block', backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #E5E7EB', padding: '1.25rem', textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <h3 style={{ fontWeight: 700, color: '#111827', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Agent Stacks</h3>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
            <p style={{ fontSize: '0.8125rem', color: '#6B7280', lineHeight: 1.5, margin: 0 }}>See workflow stacks that feature {agent.name}.</p>
          </Link>
          {similarAgents && similarAgents.length > 0 && (
            <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #E5E7EB', padding: '1.25rem' }}>
              <h3 style={{ fontWeight: 700, color: '#111827', marginBottom: '0.75rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Compare</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                {similarAgents.slice(0, 3).map((similar: SimilarAgent) => (<Link key={similar.slug} href={'/compare/' + agent.slug + '-vs-' + similar.slug} style={{ fontSize: '0.8125rem', color: '#2563EB', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.625rem', borderRadius: '0.375rem', backgroundColor: '#F9FAFB', border: '1px solid #F3F4F6' }}><span>{agent.name} vs {similar.name}</span><span style={{ flexShrink: 0 }}>→</span></Link>))}
              </div>
            </div>
          )}
          {hasRelatedContent && (
            <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #E5E7EB', padding: '1.25rem' }}>
              <h3 style={{ fontWeight: 700, color: '#111827', marginBottom: '0.75rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Related Content</h3>
              {relatedContent.ownAlternatives && (
                <div style={{ marginBottom: relatedContent.guides.length > 0 ? '0.875rem' : 0 }}>
                  <p style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.375rem' }}>Alternatives</p>
                  <Link href={'/alternatives/' + relatedContent.ownAlternatives.slug} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8125rem', color: '#2563EB', textDecoration: 'none', fontWeight: 500, padding: '0.5rem 0.625rem', borderRadius: '0.375rem', backgroundColor: '#F9FAFB', border: '1px solid #F3F4F6' }}><span>{relatedContent.ownAlternatives.title}</span><span style={{ flexShrink: 0, marginLeft: '0.5rem' }}>→</span></Link>
                </div>
              )}
              {relatedContent.guides.length > 0 && (
                <div>
                  <p style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.375rem' }}>Guides</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {relatedContent.guides.map((guide) => (<Link key={guide.slug} href={'/resources/guides/' + guide.slug} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8125rem', color: '#2563EB', textDecoration: 'none', fontWeight: 500, padding: '0.5rem 0.625rem', borderRadius: '0.375rem', backgroundColor: '#F9FAFB', border: '1px solid #F3F4F6' }}><span>{guide.title}</span><span style={{ flexShrink: 0, marginLeft: '0.5rem' }}>→</span></Link>))}
                  </div>
                </div>
              )}
            </div>
          )}
          {!agent.vendor_claimed && (
            <div style={{ backgroundColor: '#FAFAFA', borderRadius: '0.5rem', border: '1px dashed #D1D5DB', padding: '1.25rem' }}>
             <h3 style={{ fontWeight: 700, color: '#111827', marginBottom: '0.375rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Is this your tool?</h3>
              <p style={{ fontSize: '0.8125rem', color: '#6B7280', marginBottom: '0.75rem', lineHeight: 1.5 }}>Claim this listing for free to verify your details. Upgrade to Vendor Managed for priority verification and homepage placement.</p>
              <Link href={'/claim/' + agent.slug} style={{ display: 'block', textAlign: 'center', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid #111827', color: '#111827', fontSize: '0.8125rem', fontWeight: 600, textDecoration: 'none' }}>Claim listing →</Link>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .agent-hero-top { flex-wrap: wrap; }
        .agent-snapshot-grid { display: grid; grid-template-columns: repeat(4, 1fr); }
        .agent-stats-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.75rem; }
        .agent-content-grid { display: grid; grid-template-columns: 1fr 320px; gap: 1.5rem; align-items: start; }
        .agent-pros-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
        @media (max-width: 768px) {
          .agent-hero-top { flex-direction: column !important; align-items: flex-start !important; }
          .agent-visit-btn { align-self: center !important; width: 100% !important; text-align: center !important; justify-content: center !important; }
          .agent-snapshot-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .agent-snapshot-grid > div { border-right: none !important; border-bottom: 1px solid #F3F4F6; }
          .agent-stats-cards { grid-template-columns: 1fr 1fr !important; }
          .agent-rating-card { display: none !important; }
          .agent-content-grid { grid-template-columns: 1fr !important; }
          .agent-pros-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}