'use client'
import { useState, useEffect } from 'react'

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

function Stars({ value, onChange, size = 'md' }: { value: number; onChange?: (v: number) => void; size?: 'sm' | 'md' }) {
  const [hovered, setHovered] = useState(0)
  const sz = size === 'sm' ? 'text-lg' : 'text-2xl'
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((star) => (
        <button key={star} type="button"
          onClick={() => onChange?.(star)}
          onMouseEnter={() => onChange && setHovered(star)}
          onMouseLeave={() => onChange && setHovered(0)}
          className={sz + ' leading-none transition-colors focus:outline-none'}
          style={{ color: star <= (hovered || value) ? '#2563EB' : '#D1D5DB', cursor: onChange ? 'pointer' : 'default' }}>
          {'\u2605'}
        </button>
      ))}
    </div>
  )
}

function NewsletterModal({ email, onClose }: { email: string; onClose: () => void }) {
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubscribe() {
    setLoading(true)
    await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    setSubscribed(true)
    setLoading(false)
    setTimeout(onClose, 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-light leading-none focus:outline-none">
          {'\u00d7'}
        </button>
        {subscribed ? (
          <div className="text-center py-4">
            <div className="text-3xl mb-3">{'✓'}</div>
            <p className="font-semibold text-gray-900">You're in!</p>
            <p className="text-sm text-gray-500 mt-1">First issue lands in your inbox soon.</p>
          </div>
        ) : (
          <>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mb-5">
              <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
                <path d="M7 1L12.5 4V10L7 13L1.5 10V4L7 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                <circle cx="7" cy="7" r="1.5" fill="white"/>
              </svg>
            </div>
            <h3 className="text-lg fonbold text-gray-900 mb-2">Stay ahead of the curve</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              The AI Agent Index Weekly surfaces the agents gaining real community trust, what builders are shipping, and which tools are actually delivering results — one focused email, every week.
            </p>
            <p className="text-xs text-gray-400 mb-4">We'll send it to <span className="font-medium text-gray-600">{email}</span></p>
            <div className="flex gap-3">
              <button onClick={handleSubscribe} disabled={loading}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-300 text-white text-sm font-medium rounded-lg transition-colors">
                {loading ? 'Subscribing...' : 'Subscribe'}
              </button>
              <button onClick={onClose}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium rounded-lg transition-colors">
                Maybe lar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
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
      <div className="text-center py-4">
        <p className="font-semibold text-gray-900 text-sm">Review submitted!</p>
        <p className="text-xs text-gray-500 mt-1">Thanks for helping the community.</p>
      </div>
    </>
  )

  if (existingReview && !isEditing) return (
    <div className="space-y-3">
      <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
        <p className="text-xs text-blue-600 mb-1.5">Your review · {new Date(existingReview.created_at).toLocaleDateString()}</p>
        <Stars value={existingReview.rating} size="sm" />
        {existingReview.comment && <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">{existingReview.comment}</p>}
      </div>
      <button onClick={() => setIsEditing(true)} className="text-xs text-blue-600 hover:text-blue-500 font-medium transition-colors">
        Update your review →
      </button>
    </div>
  )

  return (
    <div className="space-y-3">
      {existingReview && isEditing && (
        <div className="p-2.5 bg-amber-50 border border-amber-100 rounded-lg text-xs text-amber-700">
          Updating review from {new Date(existingReview.created_at).toLocaleDateString()}
        </div>
      )}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Email <span className="text-red-400">*</span></label>
        <input type="email" value={email}
          onChange={(e) => { setEmail(e.target.value); setEmailChecked(false) }}
          onBlur={handleEmailBlur}
          placeholder="your@email.com"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
        />
        <p className="text-xs text-gray-400 mt-1">Never displayed publicly.</p>
      </div>
      {checkingEmail && <p className="text-xs text-gray-400">Checking...</p>}
      {emailChecked && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Display name <span className="text-red-400">*</span></label>
            <input type="text" value={displayName}
              onChange={(e) => { setDisplayName(e.target.value); setNameTakenAlternatives([]) }}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
            {nameTakenAlternatives.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {nameTakenAlternatives.map((alt) => (
                  <button key={alt} type="button"
                    onClick={() => { setDisplayName(alt); setNameTakenAlternatives([]) }}
                    className="px-2.5 py-1 text-xs bg-gray-100 hover:bg-blue-50 hover:text-blue-700 border border-gray-200 rounded-full transition-colors">
                    {alt}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Rating <span className="text-red-400">*</span></label>
            <Stars value={rating} onChange={setRating} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Comment <span className="text-gray-400">(optional)</span></label>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 resize-none"
            />
          </div>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button onClick={handleSubmit} disabled={submitting}
            className="w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-300 text-white text-xs font-medium rounded-lg transition-colors">
            {submitting ? 'Submitting...' : existingReview ? 'Update review' : 'Submit review'}
          </button>
        </div>
      )}
    </div>
  )
}

export function ReviewList({ agentId, initialReviews }: { agentId: string; initialReviews: Review[] }) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)

  useEffect(() => {
    setReviews(initialReviews)
  }, [initialReviews])

  if (reviews.length === 0) return null

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Community reviews ({reviews.length})</h3>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-gray-900">{review.reviewer_name}</span>
                <Stars value={review.rating} size="sm" />
              </div>
              <div className="text-right">
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
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/reviews?agent_id=' + agentId)
      .then((r) => r.json())
      .then((data) => { setReviews(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [agentId])

  function handleReviewSubmitted(review: Review) {
    setReviews((prev) => {
      const exists = prev.find((r) => r.id === review.id)
      if (exists) return prev.map((r) => r.id === review.id ? review : r)
      return [review, ...prev]
    })
  }

  return { reviews, loading, handleReviewSubmitted }
}
