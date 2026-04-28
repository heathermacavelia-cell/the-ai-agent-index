'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ReviewForm } from '@/components/ReviewSection'
import AgentLogo from '@/components/AgentLogo'
import CompareButton from '@/components/CompareButton'

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

function Stars({ value }: { value: number }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1,2,3,4,5].map((s) => (
        <span key={s} style={{ fontSize: '1.125rem', lineHeight: 1, color: s <= value ? '#2563EB' : '#D1D5DB' }}>★</span>
      ))}
    </div>
  )
}

function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return <div id="reviews" />
  return (
    <div id="reviews" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1.5rem' }}>
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

export default function AgentPageClient({ agent, initialReviews, similarAgents }: { agent: any; initialReviews: Review[]; similarAgents: SimilarAgent[] }) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [ratingAvg, setRatingAvg] = useState<number>(agent.rating_avg > 0 ? agent.rating_avg : (agent.editorial_rating ?? 0))
  const [ratingCount, setRatingCount] = useState<number>(agent.rating_count ?? 0)

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

  const displayRating = ratingAvg > 0 ? ratingAvg.toFixed(1) : null

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '1.5rem 1.5rem 4rem' }}>
      {/* Breadcrumb */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#6B7280', marginBottom: '2rem' }}>
        <Link href="/" style={{ color: '#6B7280', textDecoration: 'none' }}>Home</Link>
        <span style={{ color: '#D1D5DB' }}>/</span>
        <Link href={'/' + agent.primary_category} style={{ color: '#6B7280', textDecoration: 'none', textTransform: 'capitalize' }}>
          {agent.primary_category.split('-').join(' ')}
        </Link>
        <span style={{ color: '#D1D5DB' }}>/</span>
        <span style={{ color: '#111827' }}>{agent.name}</span>
      </nav>

      {/* ─── HERO SECTION ─── */}
      <div style={{ backgroundColor: 'white', borderRadius: '1rem', border: '1px solid #E5E7EB', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', marginBottom: '1.5rem' }}>
        <div className="agent-hero-top" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.5rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flex: 1, minWidth: 0 }}>
            <div style={{ flexShrink: 0 }}>
              <AgentLogo name={agent.name} websiteUrl={agent.website_url} faviconDomain={agent.favicon_domain} size="lg" />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#111827', margin: 0, lineHeight: 1.2, letterSpacing: '-0.02em' }}>{agent.name}</h1>
                {displayRating && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
                    <span style={{ color: '#2563EB', fontSize: '1rem', lineHeight: 1 }}>★</span>
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: '#111827' }}>{displayRating}</span>
                    <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>/ 5</span>
                  </div>
                )}
              </div>
              <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: '0 0 0.625rem' }}>by {agent.developer}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flexWrap: 'wrap' }}>
                {agent.is_featured && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.125rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.625rem', fontWeight: 700, backgroundColor: '#EFF6FF', color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.05em', border: '1px solid #BFDBFE' }}>Featured</span>
                )}
                {agent.is_verified && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.125rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.625rem', fontWeight: 700, backgroundColor: '#F0FDF4', color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.05em', border: '1px solid #BBF7D0' }}>✓ Verified</span>
                )}
                {agent.mcp_compatible === true && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', padding: '0.125rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.625rem', fontWeight: 700, backgroundColor: '#ECFDF5', color: '#059669', textTransform: 'uppercase', letterSpacing: '0.05em', border: '1px solid #A7F3D0' }}>
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                    MCP
                  </span>
                )}
                {!agent.is_verified && ratingCount === 0 && ratingAvg > 0 && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.125rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.625rem', fontWeight: 600, backgroundColor: '#F3F4F6', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Editorial review</span>
                )}
              </div>
            </div>
          </div>
          {agent.website_url && (
            <a href={agent.website_url} target="_blank" rel="noopener noreferrer"
            className="agent-visit-btn"
            style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', padding: '0.625rem 1.5rem', borderRadius: '0.5rem', backgroundColor: '#111827', color: 'white', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', letterSpacing: '0.01em' }}>
            Visit site →
          </a>
          )}
        </div>
        <p style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.7, margin: '0 0 0.75rem', maxWidth: '680px' }}>{agent.short_description}</p>
        <CompareButton agent={{ slug: agent.slug, name: agent.name, websiteUrl: agent.website_url, faviconDomain: agent.favicon_domain }} />
        {agent.long_description && (
          <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid #F3F4F6' }}>
            <p style={{ fontSize: '0.875rem', color: '#6B7280', lineHeight: 1.7 }}>{agent.long_description}</p>
          </div>
        )}
      </div>

      {/* ─── QUICK STATS (full width row) ─── */}
      <div className="agent-stats-cards" style={{ marginBottom: '1.5rem' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.25rem' }}>Pricing</p>
          <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', margin: 0, textTransform: 'capitalize' }}>
            {agent.pricing_model}{agent.starting_price != null && agent.starting_price > 0 ? ' · $' + agent.starting_price : agent.starting_price === 0 ? ' · Free' : ''}
          </p>
        </div>
        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.25rem' }}>Segment</p>
          <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', margin: 0, textTransform: 'uppercase' }}>{agent.customer_segment}</p>
        </div>
        {agent.deployment_difficulty && (
          <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.25rem' }}>Setup</p>
            <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', margin: 0, textTransform: 'capitalize' }}>{agent.deployment_difficulty}</p>
          </div>
        )}
        {agent.last_verified_at && (
          <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.25rem' }}>Verified</p>
            <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', margin: 0 }}>
              {new Date(agent.last_verified_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        )}
      </div>

      {/* ─── CONTENT + SIDEBAR ─── */}
      <div className="agent-content-grid">
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: 0 }}>

          {/* Capabilities */}
          {agent.capability_tags && agent.capability_tags.length > 0 && (
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1.5rem' }}>
              <h2 style={{ fontWeight: 700, color: '#111827', marginBottom: '0.875rem', fontSize: '1rem' }}>Capabilities</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                {agent.capability_tags.map(function(tag: string) {
                  return <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', padding: '0.25rem 0.625rem', borderRadius: '0.375rem', fontSize: '0.8125rem', fontFamily: 'monospace', backgroundColor: '#EFF6FF', color: '#1D4ED8', border: '1px solid #DBEAFE' }}>{tag}</span>
                })}
              </div>
            </div>
          )}

          {/* Pros & Limitations */}
          {((agent.pros && agent.pros.length > 0) || (agent.limitations && agent.limitations.length > 0)) && (
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h2 style={{ fontWeight: 700, color: '#111827', fontSize: '1rem', margin: 0 }}>Pros &amp; Limitations</h2>
                <span style={{ fontSize: '0.6875rem', color: '#9CA3AF', backgroundColor: '#F9FAFB', padding: '0.2rem 0.5rem', borderRadius: '0.25rem' }}>Editorial assessment</span>
              </div>
              <div className="agent-pros-grid">
                {agent.pros && agent.pros.length > 0 && (
                  <div>
                    <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16A34A', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Pros</h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                      {agent.pros.map(function(pro: string) {
                        return (
                          <li key={pro} style={{ fontSize: '0.875rem', color: '#374151', display: 'flex', gap: '0.5rem', alignItems: 'flex-start', lineHeight: 1.5 }}>
                            <span style={{ color: '#16A34A', flexShrink: 0, fontWeight: 700 }}>✓</span>
                            <span>{pro}</span>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )}
                {agent.limitations && agent.limitations.length > 0 && (
                  <div>
                    <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D97706', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Limitations</h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                      {agent.limitations.map(function(lim: string) {
                        return (
                          <li key={lim} style={{ fontSize: '0.875rem', color: '#374151', display: 'flex', gap: '0.5rem', alignItems: 'flex-start', lineHeight: 1.5 }}>
                            <span style={{ color: '#D97706', flexShrink: 0, fontWeight: 700 }}>⚠</span>
                            <span>{lim}</span>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Technical Details */}
          <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1.5rem' }}>
            <h2 style={{ fontWeight: 700, color: '#111827', marginBottom: '0.875rem', fontSize: '1rem' }}>Technical Details</h2>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {agent.deployment_method && agent.deployment_method.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem 0', borderBottom: '1px solid #F3F4F6' }}>
                  <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>Deployment</span>
                  <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    {agent.deployment_method.map(function(d: string) {
                      return <span key={d} style={{ padding: '0.125rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', backgroundColor: '#F3F4F6', color: '#374151', fontFamily: 'monospace' }}>{d}</span>
                    })}
                  </div>
                </div>
              )}
              {agent.model_architecture && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem 0', borderBottom: '1px solid #F3F4F6' }}>
                  <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>Model architecture</span>
                  <span style={{ fontSize: '0.875rem', fontFamily: 'monospace', color: '#374151' }}>{agent.model_architecture}</span>
                </div>
              )}
              {agent.avg_setup_time && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem 0', borderBottom: '1px solid #F3F4F6' }}>
                  <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>Avg setup time</span>
                  <span style={{ fontSize: '0.875rem', color: '#374151' }}>{agent.avg_setup_time}</span>
                </div>
              )}
              {agent.autonomous_rate && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem 0', borderBottom: '1px solid #F3F4F6', gap: '1rem' }}>
                  <span style={{ fontSize: '0.875rem', color: '#6B7280', flexShrink: 0 }}>Autonomous rate</span>
                  <span style={{ fontSize: '0.875rem', color: '#374151', textAlign: 'right' }}>{agent.autonomous_rate}</span>
                </div>
              )}
              {agent.mcp_compatible === true && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem 0', borderBottom: '1px solid #F3F4F6' }}>
                  <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>MCP compatible</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                    Yes
                  </span>
                </div>
              )}
              {agent.integrations && agent.integrations.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem 0', borderBottom: '1px solid #F3F4F6', gap: '1rem' }}>
                  <span style={{ fontSize: '0.875rem', color: '#6B7280', flexShrink: 0 }}>Integrations</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', justifyContent: 'flex-end' }}>
                    {agent.integrations.map(function(i: string) {
                      return <span key={i} style={{ padding: '0.125rem 0.375rem', borderRadius: '0.25rem', fontSize: '0.75rem', backgroundColor: '#F3F4F6', color: '#374151' }}>{i}</span>
                    })}
                  </div>
                </div>
              )}
              {agent.security_certifications && agent.security_certifications.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem 0', gap: '1rem' }}>
                  <span style={{ fontSize: '0.875rem', color: '#6B7280', flexShrink: 0 }}>Security</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', justifyContent: 'flex-end' }}>
                    {agent.security_certifications.map(function(s: string) {
                      return <span key={s} style={{ padding: '0.125rem 0.375rem', borderRadius: '0.25rem', fontSize: '0.75rem', backgroundColor: '#F0FDF4', color: '#16A34A' }}>{s}</span>
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Similar Agents */}
          {similarAgents && similarAgents.length > 0 && (
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1.5rem' }}>
              <h2 style={{ fontWeight: 700, color: '#111827', marginBottom: '0.875rem', fontSize: '1rem' }}>Similar agents</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {similarAgents.map(function(similar: SimilarAgent) {
                  return (
                    <Link key={similar.slug} href={'/agents/' + similar.slug}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #F3F4F6', textDecoration: 'none', backgroundColor: '#FAFAFA' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827' }}>{similar.name}</div>
                        {similar.short_description && (
                          <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {similar.short_description.substring(0, 70)}{similar.short_description.length > 70 ? '...' : ''}
                          </div>
                        )}
                      </div>
                      <span style={{ fontSize: '0.875rem', color: '#2563EB', flexShrink: 0, marginLeft: '1rem' }}>→</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          <ReviewList reviews={reviews} />
        </div>

        {/* ─── SIDEBAR ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Rating card */}
          <a href="#reviews" className="agent-rating-card" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1.25rem', textDecoration: 'none', display: 'block' }}>
            <h3 style={{ fontWeight: 700, color: '#111827', marginBottom: '0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Rating</h3>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.375rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: '#111827' }}>{ratingAvg > 0 ? ratingAvg.toFixed(1) : '—'}</span>
              <span style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>/ 5</span>
            </div>
            <Stars value={Math.round(ratingAvg)} />
            <p style={{ fontSize: '0.75rem', color: ratingCount > 0 ? '#2563EB' : '#9CA3AF', margin: '0.375rem 0 0' }}>
              {ratingCount > 0 ? ratingCount + (ratingCount === 1 ? ' review' : ' reviews') + ' ↓' : 'Editorial score'}
            </p>
          </a>

          {/* Industries */}
          {agent.industry_tags && agent.industry_tags.length > 0 && (
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1.25rem' }}>
              <h3 style={{ fontWeight: 700, color: '#111827', marginBottom: '0.75rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Industries</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                {agent.industry_tags.map(function(tag: string) {
                  const INDUSTRY_LABELS: Record<string, string> = {
                    'b2b': 'B2B', 'b2c': 'B2C', 'saas': 'SaaS', 'smb': 'SMB',
                    'dtc': 'DTC', 'aws': 'AWS', 'ecommerce': 'eCommerce',
                    'real-estate': 'Real Estate', 'devtools': 'DevTools',
                    'open-source': 'Open Source', 'pharma': 'Pharma',
                    'finance': 'Finance', 'healthcare': 'Healthcare',
                    'legal': 'Legal', 'insurance': 'Insurance',
                    'enterprise': 'Enterprise', 'startups': 'Startups',
                    'agencies': 'Agencies', 'retail': 'Retail',
                    'cloud': 'Cloud',
                  }
                  return <span key={tag} style={{ padding: '0.2rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', backgroundColor: '#F3F4F6', color: '#374151' }}>{INDUSTRY_LABELS[tag] ?? tag.charAt(0).toUpperCase() + tag.slice(1)}</span>
                })}
              </div>
            </div>
          )}

          {/* Leave a review */}
          <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1.25rem' }}>
            <h3 style={{ fontWeight: 700, color: '#111827', marginBottom: '0.875rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Leave a review</h3>
            <ReviewForm agentId={agent.id} agentName={agent.name} onReviewSubmitted={handleReviewSubmitted} />
          </div>

          {/* Agent Stacks */}
          <Link href={'/stacks?agent=' + agent.slug}
            style={{ display: 'block', backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1.25rem', textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <h3 style={{ fontWeight: 700, color: '#111827', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Agent Stacks</h3>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
            <p style={{ fontSize: '0.8125rem', color: '#6B7280', lineHeight: 1.5, margin: 0 }}>
              See workflow stacks that feature {agent.name}.
            </p>
          </Link>

          {/* Compare */}
          {similarAgents && similarAgents.length > 0 && (
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1.25rem' }}>
              <h3 style={{ fontWeight: 700, color: '#111827', marginBottom: '0.75rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Compare</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                {similarAgents.slice(0, 3).map((similar: SimilarAgent) => (
                  <Link key={similar.slug} href={'/compare/' + agent.slug + '-vs-' + similar.slug}
                    style={{ fontSize: '0.8125rem', color: '#2563EB', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.625rem', borderRadius: '0.375rem', backgroundColor: '#F9FAFB', border: '1px solid #F3F4F6' }}>
                    <span>{agent.name} vs {similar.name}</span>
                    <span style={{ flexShrink: 0 }}>→</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Claim listing */}
          {!agent.is_verified && (
            <div style={{ backgroundColor: '#FAFAFA', borderRadius: '0.75rem', border: '1px dashed #D1D5DB', padding: '1.25rem' }}>
              <h3 style={{ fontWeight: 700, color: '#111827', marginBottom: '0.375rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Is this your tool?</h3>
              <p style={{ fontSize: '0.8125rem', color: '#6B7280', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                Claim this listing to update your details and get a Verified badge.
              </p>
              <Link href={'/claim/' + agent.slug}
                style={{ display: 'block', textAlign: 'center', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid #111827', color: '#111827', fontSize: '0.8125rem', fontWeight: 600, textDecoration: 'none' }}>
                Claim listing →
              </Link>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .agent-hero-top {
          flex-wrap: wrap;
        }
        .agent-stats-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 0.75rem;
        }
        .agent-content-grid {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 1.5rem;
          align-items: start;
        }
        .agent-pros-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        @media (max-width: 768px) {
  .agent-hero-top {
    flex-direction: column !important;
    align-items: flex-start !important;
  }
  .agent-visit-btn {
    align-self: center !important;
    width: 100% !important;
    text-align: center !important;
    justify-content: center !important;
  }
  .agent-stats-cards {
    grid-template-columns: 1fr 1fr !important;
  }
  .agent-rating-card {
    display: none !important;
  }
  .agent-content-grid {
    grid-template-columns: 1fr !important;
  }
  .agent-pros-grid {
    grid-template-columns: 1fr !important;
  }
}
      `}</style>
    </div>
  )
}