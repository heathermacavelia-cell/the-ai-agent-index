'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ReviewForm } from '@/components/ReviewSection'

interface Review {
  id: string
  rating: number
  comment: string | null
  reviewer_name: string
  created_at: string
  updated_at: string | null
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

export default function AgentPageClient({ agent, initialReviews }: { agent: any; initialReviews: Review[] }) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [ratingAvg, setRatingAvg] = useState<number>(agent.rating_avg ?? agent.editorial_rating ?? 0)
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

  function handleReviewSubmitted(review: Review) {
    setReviews((prev) => {
      const exists = prev.find((r) => r.id === review.id)
      const updated = exists
        ? prev.map((r) => r.id === review.id ? review : r)
        : [review, ...prev]
      const avg = updated.reduce((sum, r) => sum + r.rating, 0) / updated.length
      setRatingAvg(Math.round(avg * 10) / 10)
      setRatingCount(updated.length)
      return updated
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
        <span className="text-gray-300">/</span>
        <Link href={'/' + agent.primary_category} className="hover:text-gray-900 transition-colors capitalize">
          {agent.primary_category.split('-').join(' ')}
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-900">{agent.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h1 className="text-2xl font-bold text-gray-900">{agent.name}</h1>
                  {agent.is_featured && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white uppercase tracking-wide">Featured</span>
                  )}
                  {agent.is_verified && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-green-600 text-white uppercase tracking-wide">Verified</span>
                  )}
                </div>
                <p className="text-gray-500">by {agent.developer}</p>
              </div>
              {agent.website_url && (
                <a href={agent.website_url} target="_blank" rel="noopener noreferrer"
                  className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors">
                  Visit site
                </a>
              )}
            </div>
            <p className="text-gray-700 leading-relaxed">{agent.short_description}</p>
            {agent.long_description && (
              <p className="text-gray-600 leading-relaxed text-sm mt-4 pt-4 border-t border-gray-100">{agent.long_description}</p>
            )}
          </div>

          {agent.capability_tags && agent.capability_tags.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Capabilities</h2>
              <div className="flex flex-wrap gap-2">
                {agent.capability_tags.map(function(tag: string) {
                  return <span key={tag} className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-mono bg-blue-50 text-blue-700 border border-blue-100">{tag}</span>
                })}
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Technical Details</h2>
            <div className="space-y-3">
              {agent.deployment_method && agent.deployment_method.length > 0 && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Deployment</span>
                  <div className="flex gap-1">
                    {agent.deployment_method.map(function(d: string) {
                      return <span key={d} className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600 font-mono">{d}</span>
                    })}
                  </div>
                </div>
              )}
              {agent.deployment_difficulty && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Difficulty</span>
                  <span className="text-sm font-medium capitalize">{agent.deployment_difficulty}</span>
                </div>
              )}
              {agent.model_architecture && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Model architecture</span>
                  <span className="text-sm font-mono">{agent.model_architecture}</span>
                </div>
              )}
              {agent.avg_setup_time && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Avg setup time</span>
                  <span className="text-sm">{agent.avg_setup_time}</span>
                </div>
              )}
              {agent.integrations && agent.integrations.length > 0 && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Integrations</span>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {agent.integrations.map(function(i: string) {
                      return <span key={i} className="px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-600">{i}</span>
                    })}
                  </div>
                </div>
              )}
              {agent.security_certifications && agent.security_certifications.length > 0 && (
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-500">Security</span>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {agent.security_certifications.map(function(s: string) {
                      return <span key={s} className="px-1.5 py-0.5 rounded text-xs bg-green-50 text-green-700">{s}</span>
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <ReviewList reviews={reviews} />
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Commercial</h3>
            <div className="space-y-2.5">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Pricing model</span>
                <span className="text-sm font-medium capitalize">{agent.pricing_model}</span>
              </div>
              {agent.starting_price != null && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Starting price</span>
                  <span className="text-sm font-semibold">{agent.starting_price === 0 ? 'Free' : '$' + agent.starting_price}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Customer segment</span>
                <span className="text-sm uppercase font-medium">{agent.customer_segment}</span>
              </div>
            </div>
          </div>

          {agent.industry_tags && agent.industry_tags.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Industries</h3>
              <div className="flex flex-wrap gap-1.5">
                {agent.industry_tags.map(function(tag: string) {
                  return <span key={tag} className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600 capitalize">{tag}</span>
                })}
              </div>
            </div>
          )}

          <a href="#reviews" className="block bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-200 transition-colors">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Rating</h3>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '1.875rem', fontWeight: 700, color: '#111827' }}>
                {ratingAvg > 0 ? ratingAvg.toFixed(1) : '—'}
              </span>
              <span style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>/ 5</span>
            </div>
            <Stars value={Math.round(ratingAvg)} />
            <p style={{ fontSize: '0.75rem', marginTop: '0.25rem', color: ratingCount > 0 ? '#3B82F6' : '#9CA3AF' }}>
              {ratingCount > 0 ? `${ratingCount} ${ratingCount === 1 ? 'review' : 'reviews'} ↓` : 'Editorial score'}
            </p>
          </a>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">Leave a review</h3>
            <ReviewForm agentId={agent.id} agentName={agent.name} onReviewSubmitted={handleReviewSubmitted} />
          </div>
        </div>
      </div>
    </div>
  )
}