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

function Stars({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          onMouseEnter={() => onChange && setHovered(star)}
          onMouseLeave={() => onChange && setHovered(0)}
          className="text-3xl leading-none transition-colors focus:outline-none"
          style={{ color: star <= (hovered || value) ? '#2563EB' : '#D1D5DB', cursor: onChange ? 'pointer' : 'default' }}
        >
          {'\u2605'}
        </button>
      ))}
    </div>
  )
}

export default function ReviewSection({ agentId, agentName }: Props) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loadingReviews, setLoadingReviews] = useState(true)
  const [email, setEmail] = useState('')
  const [emailChecked, setEmailChecked] = useState(false)
  const [checkingEmail, setCheckingEmail] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [newsletter, setNewsletter] = useState(false)
  const [existingReview, setExistingReview] = useState<Review | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [nameTakenAlternatives, setNameTakenAlternatives] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/reviews?agent_id=' + agentId)
      .then((r) => r.json())
      .then((data) => { setReviews(Array.isArray(data) ? data : []); setLoadingReviews(false) })
      .catch(() => setLoadingReviews(false))
  }, [agentId])

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
        body: JSON.stringify({ agent_id: agentId, rating, comment, reviewer_name: displayName, reviewer_email: email, newsletter_opt_in: newsletter }),
      })
      const data = await res.json()
      if (res.status === 409 && data.error === 'name_taken') {
        setNameTakenAlternatives(data.alternatives)
        setError('That display name is taken. Pick one below or type your own.')
        return
      }
      if (!res.ok) throw new Error(data.error)
      setSubmitted(true)
      const updatedReview: Review = {
        id: existingReview?.id ?? Date.now().toString(),
        rating,
        comment,
        reviewer_name: displayName,
        created_at: existingReview?.created_at ?? new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      if (existingReview) {
        setReviews((prev) => prev.map((r) => r.id === existingReview.id ? updatedReview : r))
      } else {
        setReviews((prev) => [updatedReview, ...prev])
      }
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 mt-8">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 text-lg mb-1">
          {submitted ? 'Review submitted!' : existingReview && !isEditing ? 'Your review' : 'Review ' + agentName}
        </h2>

        {submitted ? (
          <p className="text-gray-500 text-sm mt-2">Thanks for helping the community. Your review is live.</p>
        ) : existingReview && !isEditing ? (
          <div className="mt-4 space-y-3">
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <p className="text-sm text-blue-700 mb-2">
                You reviewed this agent on {new Date(existingReview.created_at).toLocaleDateString()}
                {existingReview.updated_at && existingReview.updated_at !== existingReview.created_at
                  ? ' updated ' + new Date(existingReview.updated_at).toLocaleDateString()
                  : ''}
              </p>
              <Stars value={existingReview.rating} />
              {existingReview.comment && <p className="text-sm text-gray-700 mt-2">{existingReview.comment}</p>}
            </div>
            <button onClick={() => setIsEditing(true)} className="text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors">
              Update your review
            </button>
          </div>
        ) : (
          <div className="space-y-4 mt-4">
            {existingReview && isEditing && (
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg text-sm text-amber-700">
                Updating your review from {new Date(existingReview.created_at).toLocaleDateString()}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailChecked(false) }}
                onBlur={handleEmailBlur}
                placeholder="your@email.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-400 mt-1">Never displayed. Used only to prevent duplicate reviews.</p>
            </div>

            {checkingEmail && <p className="text-sm text-gray-400">Checking...</p>}

            {emailChecked && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => { setDisplayName(e.target.value); setNameTakenAlternatives([]) }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {nameTakenAlternatives.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {nameTakenAlternatives.map((alt) => (
                        <button key={alt} type="button" onClick={() => { setDisplayName(alt); setNameTakenAlternatives([]) }}
                          className="px-3 py-1 text-xs bg-gray-100 hover:bg-blue-50 hover:text-blue-700 border border-gray-200 rounded-full transition-colors">
                          {alt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating <span className="text-red-500">*</span></label>
                  <Stars value={rating} onChange={setRating} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Comment <span className="text-gray-400">(optional)</span></label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience with this agent..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
                  <span className="text-sm text-gray-600">Send me the weekly AI Agent Index newsletter</span>
                </label>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-300 text-white text-sm font-medium rounded-lg transition-colors">
                  {submitting ? 'Submitting...' : existingReview ? 'Update review' : 'Submit review'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {!loadingReviews && reviews.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Community reviews ({reviews.length})</h3>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-gray-900">{review.reviewer_name}</span>
                    <Stars value={review.rating} />
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
      )}
    </div>
  )
}
