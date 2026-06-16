'use client'
import { useState } from 'react'
import type { AgencyReview } from '@/types/agency'

function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0)
  return (
    <div style={{ display: 'flex', gap: '0.25rem' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: star <= (hover || value) ? '#2563EB' : '#D1D5DB', transition: 'color 0.1s', padding: '0.125rem' }}
        >
          ★
        </button>
      ))}
    </div>
  )
}

export default function AgencyReviewSection({ agencyId, agencyName, reviews }: { agencyId: string; agencyName: string; reviews: AgencyReview[] }) {
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [reviewerName, setReviewerName] = useState('')
  const [reviewerCompany, setReviewerCompany] = useState('')
  const [projectType, setProjectType] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    if (rating === 0) { setError('Please select a rating'); return }
    if (!comment.trim()) { setError('Please write a review'); return }
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/agency-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agency_id: agencyId,
          rating,
          comment: comment.trim(),
          reviewer_name: reviewerName.trim() || null,
          reviewer_company: reviewerCompany.trim() || null,
          project_type: projectType.trim() || null,
        }),
      })
      if (!res.ok) throw new Error('Failed to submit')
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #E5E7EB' }}>
      {/* Header with prominent CTA */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', margin: 0 }}>
          Reviews {reviews.length > 0 && <span style={{ color: '#6B7280', fontWeight: 400 }}>({reviews.length})</span>}
        </h2>
        {!showForm && !submitted && (
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: '0.625rem 1.25rem', backgroundColor: '#2563EB', color: 'white',
              borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 700, border: 'none',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.375rem',
            }}
          >
            ★ Leave a Review
          </button>
        )}
      </div>

      {/* No reviews yet - extra prominent CTA */}
      {reviews.length === 0 && !showForm && !submitted && (
        <div style={{ padding: '2.5rem', backgroundColor: '#F9FAFB', borderRadius: '0.75rem', border: '2px dashed #D1D5DB', textAlign: 'center' }}>
          <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#374151', marginBottom: '0.5rem' }}>Be the first to review {agencyName}</p>
          <p style={{ fontSize: '0.9375rem', color: '#6B7280', marginBottom: '1.25rem', maxWidth: '420px', margin: '0 auto 1.25rem' }}>
            Worked with {agencyName}? Share your experience to help others find the right AI automation partner.
          </p>
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: '0.75rem 1.5rem', backgroundColor: '#2563EB', color: 'white',
              borderRadius: '0.5rem', fontSize: '1rem', fontWeight: 700, border: 'none',
              cursor: 'pointer',
            }}
          >
            ★ Write a Review
          </button>
        </div>
      )}

      {/* Review form */}
      {showForm && !submitted && (
        <div style={{ padding: '1.5rem', backgroundColor: '#F9FAFB', borderRadius: '0.75rem', border: '1px solid #E5E7EB', marginBottom: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#111827', marginBottom: '1rem' }}>Review {agencyName}</h3>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '0.375rem' }}>Rating *</label>
            <StarInput value={rating} onChange={setRating} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '0.375rem' }}>Your name</label>
              <input value={reviewerName} onChange={e => setReviewerName(e.target.value)} placeholder="Jane Smith"
                style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #D1D5DB', borderRadius: '0.375rem', fontSize: '0.875rem', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '0.375rem' }}>Your company</label>
              <input value={reviewerCompany} onChange={e => setReviewerCompany(e.target.value)} placeholder="Acme Inc."
                style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #D1D5DB', borderRadius: '0.375rem', fontSize: '0.875rem', boxSizing: 'border-box' }} />
            </div>
          </div>

          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '0.375rem' }}>Project type</label>
            <input value={projectType} onChange={e => setProjectType(e.target.value)} placeholder="e.g. AI chatbot, workflow automation, agent development"
              style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #D1D5DB', borderRadius: '0.375rem', fontSize: '0.875rem', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '0.375rem' }}>Your review *</label>
            <textarea value={comment} onChange={e => setComment(e.target.value)} rows={4}
              placeholder="What was the project? How was the experience? Would you recommend them?"
              style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #D1D5DB', borderRadius: '0.375rem', fontSize: '0.875rem', boxSizing: 'border-box', resize: 'vertical' }} />
          </div>

          {error && <p style={{ color: '#DC2626', fontSize: '0.8125rem', marginBottom: '0.75rem' }}>{error}</p>}

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={handleSubmit} disabled={submitting}
              style={{ padding: '0.625rem 1.25rem', backgroundColor: '#2563EB', color: 'white', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 700, border: 'none', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.6 : 1 }}>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
            <button onClick={() => setShowForm(false)}
              style={{ padding: '0.625rem 1.25rem', backgroundColor: 'white', color: '#6B7280', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 600, border: '1px solid #D1D5DB', cursor: 'pointer' }}>
              Cancel
            </button>
          </div>

          <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '0.75rem' }}>
            Reviews are moderated before publishing to ensure quality and authenticity.
          </p>
        </div>
      )}

      {/* Submitted confirmation */}
      {submitted && (
        <div style={{ padding: '1.5rem', backgroundColor: '#ECFDF5', borderRadius: '0.75rem', border: '1px solid #A7F3D0', marginBottom: '1.5rem', textAlign: 'center' }}>
          <p style={{ fontWeight: 700, color: '#059669', fontSize: '1rem', marginBottom: '0.25rem' }}>Thank you for your review!</p>
          <p style={{ color: '#065F46', fontSize: '0.875rem' }}>Your review will be published after moderation.</p>
        </div>
      )}

      {/* Existing reviews */}
      {reviews.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reviews.map(review => (
            <div key={review.id} style={{ padding: '1.25rem', backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#2563EB', fontSize: '0.875rem' }}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827' }}>{review.reviewer_name ?? 'Anonymous'}</span>
                  {review.reviewer_company && <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>at {review.reviewer_company}</span>}
                </div>
                <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                  {new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              {review.project_type && (
                <p style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '0.5rem' }}>Project: {review.project_type}</p>
              )}
              <p style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.6, margin: 0 }}>{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}