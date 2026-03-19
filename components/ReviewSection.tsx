'use client'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface Review {
  id: string
  rating: number
  comment: string | null
  reviewer_name: string
  created_at: string
  updated_at: string | null
}

interface Props {
  agentId: string
  agentName: string
}

function Stars({ value, onChange, size = 'md' }: { value: number; onChange?: (v: number) => void; size?: 'sm' | 'md' | 'lg' }) {
  const [hovered, setHovered] = useState(0)
  const fontSize = size === 'sm' ? '1rem' : size === 'lg' ? '2.5rem' : '1.5rem'
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1,2,3,4,5].map((star) => (
        <button key={star} type="button"
          onClick={() => onChange?.(star)}
          onMouseEnter={() => onChange && setHovered(star)}
          onMouseLeave={() => onChange && setHovered(0)}
          style={{ fontSize, lineHeight: 1, background: 'none', border: 'none', padding: 0, color: star <= (hovered || value) ? '#2563EB' : '#D1D5DB', cursor: onChange ? 'pointer' : 'default', transition: 'color 0.1s' }}>
          ★
        </button>
      ))}
    </div>
  )
}

function NewsletterModal({ email, onClose }: { email: string; onClose: () => void }) {
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  function handleBackdrop(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose()
  }

  async function handleSubscribe() {
    setLoading(true)
    await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    setSubscribed(true)
    setLoading(false)
    setTimeout(onClose, 2500)
  }

  const modal = (
    <div
      onClick={handleBackdrop}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backgroundColor: 'rgba(15,23,42,0.75)' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 25px 50px rgba(0,0,0,0.25)', width: '100%', maxWidth: '400px', overflow: 'hidden' }}>
        <div style={{ backgroundColor: '#030712', padding: '2rem', color: 'white', position: 'relative' }}>
          <button onClick={onClose}
            style={{ position: 'absolute', top: '1rem', right: '1rem', width: '1.75rem', height: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '1.25rem', cursor: 'pointer', lineHeight: 1 }}>
            ×
          </button>
          <div style={{ width: '2.5rem', height: '2.5rem', backgroundColor: '#2563EB', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L12.5 4V10L7 13L1.5 10V4L7 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <circle cx="7" cy="7" r="1.5" fill="white"/>
            </svg>
          </div>
          {subscribed ? (
            <div>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>✓</div>
              <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem' }}>You're in!</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>First issue lands in your inbox soon.</p>
            </div>
          ) : (
            <div>
              <h3 style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.5rem', lineHeight: 1.3 }}>Stay ahead of the curve</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                The AI Agent Index Weekly surfaces agents gaining real community trust, what builders are shipping, and which tools are actually delivering results — one focused email, every week.
              </p>
            </div>
          )}
        </div>
        {!subscribed && (
          <div style={{ padding: '1.5rem 2rem' }}>
            <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '1rem' }}>
              One email a week. No noise. Sent to <strong style={{ color: '#374151' }}>{email}</strong>
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button onClick={handleSubscribe} disabled={loading}
                style={{ width: '100%', padding: '0.75rem', backgroundColor: loading ? '#93C5FD' : '#2563EB', color: 'white', border: 'none', borderRadius: '0.75rem', fontSize: '0.875rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', transition: 'background-color 0.15s' }}>
                {loading ? 'Subscribing...' : "Subscribe — it's free"}
              </button>
              <button onClick={onClose}
                style={{ width: '100%', padding: '0.75rem', backgroundColor: 'transparent', color: '#9CA3AF', border: 'none', fontSize: '0.875rem', cursor: 'pointer' }}>
                Maybe later
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}

export function ReviewForm({ agentId, agentName, onReviewSubmitted }: { agentId: string; agentName: string; onReviewSubmitted: (review: Review) => void }) {
  const [email, setEmail] = useState('')
  const [emailChecked, setEmailChecked] = useState(false)
  const [checkingEmail, setCheckingEmail] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [existingReview, setExistingReview] = useState<Review | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [nameTakenAlternatives, setNameTakenAlternatives] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [showNewsletter, setShowNewsletter] = useState(false)
  const [error, setError] = useState('')

  async function handleEmailBlur() {
    if (!email.includes('@')) return
    setCheckingEmail(true)
    try {
      const res = await fetch('/api/reviews?agent_id=' + agentId + '&email=' + encodeURIComponent(email))
      const data = await res.json()
      setDisplayName(data.suggestedName)
      if (data.existing) {
        setExistingReview(data.existing)
        setRating(data.existing.rating)
        setComment(data.existing.comment ?? '')
        setIsEditing(false)
      } else {
        setExistingReview(null)
        setIsEditing(true)
      }
      setEmailChecked(true)
    } finally {
      setCheckingEmail(false)
    }
  }

  function handleEmailKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleEmailBlur()
    }
  }

  async function handleSubmit() {
    setError('')
    setNameTakenAlternatives([])
    if (rating === 0) { setError('Please select a star rating.'); return }
    if (!displayName.trim()) { setError('Please enter a display name.'); return }
    setSubmitting(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent_id: agentId, rating, comment, reviewer_name: displayName, reviewer_email: email }),
      })
      const data = await res.json()
      if (res.status === 409 && data.error === 'name_taken') {
        setNameTakenAlternatives(data.alternatives)
        setError('That display name is taken. Pick one below or type your own.')
        return
      }
      if (!res.ok) throw new Error(data.error)
      setSubmitted(true)
      setShowNewsletter(true)
      const updatedReview: Review = {
        id: existingReview?.id ?? Date.now().toString(),
        rating, comment,
        reviewer_name: displayName,
        created_at: existingReview?.created_at ?? new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      onReviewSubmitted(updatedReview)
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) return (
    <>
      {showNewsletter && <NewsletterModal email={email} onClose={() => setShowNewsletter(false)} />}
      <div style={{ textAlign: 'center', padding: '1rem 0' }}>
        <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>✓</div>
        <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827' }}>Review submitted!</p>
        <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.25rem' }}>Thanks for helping the community.</p>
      </div>
    </>
  )

  if (existingReview && !isEditing) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ padding: '0.75rem', backgroundColor: '#EFF6FF', border: '1px solid #DBEAFE', borderRadius: '0.5rem' }}>
        <p style={{ fontSize: '0.75rem', color: '#2563EB', marginBottom: '0.375rem' }}>Your review · {new Date(existingReview.created_at).toLocaleDateString()}</p>
        <Stars value={existingReview.rating} size="sm" />
        {existingReview.comment && <p style={{ fontSize: '0.75rem', color: '#4B5563', marginTop: '0.375rem', lineHeight: 1.5 }}>{existingReview.comment}</p>}
      </div>
      <button onClick={() => setIsEditing(true)} style={{ background: 'none', border: 'none', fontSize: '0.75rem', color: '#2563EB', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
        Update your review →
      </button>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {existingReview && isEditing && (
        <div style={{ padding: '0.625rem', backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '0.5rem', fontSize: '0.75rem', color: '#92400E' }}>
          Updating review from {new Date(existingReview.created_at).toLocaleDateString()}
        </div>
      )}
      <div>
        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: '#4B5563', marginBottom: '0.25rem' }}>Email <span style={{ color: '#F87171' }}>*</span></label>
        <input type="email" value={email}
          onChange={(e) => { setEmail(e.target.value); setEmailChecked(false) }}
          onBlur={handleEmailBlur}
          onKeyDown={handleEmailKeyDown}
          placeholder="your@email.com"
          style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #E5E7EB', borderRadius: '0.5rem', fontSize: '0.75rem', backgroundColor: '#F9FAFB', outline: 'none', boxSizing: 'border-box' }}
        />
        <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '0.25rem' }}>Never displayed publicly.</p>
      </div>
      {checkingEmail && <p style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Checking...</p>}
      {emailChecked && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: '#4B5563', marginBottom: '0.25rem' }}>Display name <span style={{ color: '#F87171' }}>*</span></label>
            <input type="text" value={displayName}
              onChange={(e) => { setDisplayName(e.target.value); setNameTakenAlternatives([]) }}
              style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #E5E7EB', borderRadius: '0.5rem', fontSize: '0.75rem', backgroundColor: '#F9FAFB', outline: 'none', boxSizing: 'border-box' }}
            />
            {nameTakenAlternatives.length > 0 && (
              <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                {nameTakenAlternatives.map((alt) => (
                  <button key={alt} type="button"
                    onClick={() => { setDisplayName(alt); setNameTakenAlternatives([]) }}
                    style={{ padding: '0.25rem 0.625rem', fontSize: '0.75rem', backgroundColor: '#F3F4F6', border: '1px solid #E5E7EB', borderRadius: '9999px', cursor: 'pointer' }}>
                    {alt}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: '#4B5563', marginBottom: '0.375rem' }}>Rating <span style={{ color: '#F87171' }}>*</span></label>
            <Stars value={rating} onChange={setRating} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: '#4B5563', marginBottom: '0.25rem' }}>Comment <span style={{ color: '#9CA3AF' }}>(optional)</span></label>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              rows={3}
              style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #E5E7EB', borderRadius: '0.5rem', fontSize: '0.75rem', backgroundColor: '#F9FAFB', outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
            />
          </div>
          {error && <p style={{ color: '#EF4444', fontSize: '0.75rem' }}>{error}</p>}
          <button onClick={handleSubmit} disabled={submitting}
            style={{ width: '100%', padding: '0.5rem', backgroundColor: submitting ? '#93C5FD' : '#2563EB', color: 'white', border: 'none', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 500, cursor: submitting ? 'not-allowed' : 'pointer', transition: 'background-color 0.15s' }}>
            {submitting ? 'Submitting...' : existingReview ? 'Update review' : 'Submit review'}
          </button>
        </div>
      )}
    </div>
  )
}

export function ReviewList({ agentId, initialReviews }: { agentId: string; initialReviews: Review[] }) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  useEffect(() => { setReviews(initialReviews) }, [initialReviews])
  if (reviews.length === 0) return null
  return (
    <div id="reviews" className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Community reviews ({reviews.length})</h3>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-gray-900">{review.reviewer_name}</span>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[1,2,3,4,5].map((s) => (
                    <span key={s} style={{ fontSize: '1rem', lineHeight: 1, color: s <= review.rating ? '#2563EB' : '#D1D5DB' }}>★</span>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString()}</span>
                {review.updated_at && review.updated_at !== review.created_at && (
                  <span className="text-xs text-gray-400 ml-1">(edited)</span>
                )}
              </div>
            </div>
            {review.comment && <p className="text-sm text-gray-600 leading-relaxed mt-1">{review.comment}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ReviewSection({ agentId, agentName }: Props) {
  return null
}