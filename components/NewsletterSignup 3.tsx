'use client'
import { useState } from 'react'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function NewsletterSignup({ source = 'newsletter_page', dark = true }: { source?: string; dark?: boolean }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [error, setError] = useState('')

  async function handleSubscribe() {
    setError('')
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      })
      if (!res.ok) throw new Error()
      setSubscribed(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const bg = dark ? '#030712' : 'white'
  const border = dark ? 'none' : '1px solid #E5E7EB'
  const textColor = dark ? 'white' : '#111827'
  const mutedColor = dark ? '#9CA3AF' : '#6B7280'
  const inputBg = dark ? '#111827' : '#F9FAFB'
  const inputBorder = dark ? '1px solid #374151' : '1px solid #E5E7EB'

  return (
    <div style={{ backgroundColor: bg, border, borderRadius: '1rem', padding: '2rem' }}>
      <div style={{ width: '2.25rem', height: '2.25rem', backgroundColor: '#2563EB', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
        <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
          <path d="M7 1L12.5 4V10L7 13L1.5 10V4L7 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
          <circle cx="7" cy="7" r="1.5" fill="white"/>
        </svg>
      </div>

      {subscribed ? (
        <div>
          <p style={{ fontWeight: 700, fontSize: '1rem', color: textColor, marginBottom: '0.25rem' }}>You're in!</p>
          <p style={{ fontSize: '0.875rem', color: mutedColor }}>First issue lands in your inbox soon.</p>
        </div>
      ) : (
        <>
          <h3 style={{ fontWeight: 700, fontSize: '1.125rem', color: textColor, marginBottom: '0.5rem' }}>Stay ahead of the curve</h3>
          <p style={{ fontSize: '0.875rem', color: mutedColor, lineHeight: 1.6, marginBottom: '1.5rem' }}>
            The AI Agent Index Weekly — agents gaining community trust, builder wins, and what's shipping. One email a week.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError('') }}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSubscribe() }}
              placeholder="your@email.com"
              style={{ flex: 1, padding: '0.625rem 0.875rem', backgroundColor: inputBg, border: error ? '1px solid #EF4444' : inputBorder, borderRadius: '0.5rem', fontSize: '0.875rem', color: textColor, outline: 'none', boxSizing: 'border-box' }}
            />
            <button onClick={handleSubscribe} disabled={loading}
              style={{ padding: '0.625rem 1.125rem', backgroundColor: loading ? '#93C5FD' : '#2563EB', color: 'white', border: 'none', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}>
              {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>
          {error && <p style={{ fontSize: '0.75rem', color: '#EF4444' }}>{error}</p>}
          <p style={{ fontSize: '0.75rem', color: mutedColor }}>No spam. Unsubscribe anytime.</p>
        </>
      )}
    </div>
  )
}