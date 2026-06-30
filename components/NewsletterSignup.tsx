'use client'

import { useState } from 'react'

interface NewsletterSignupProps {
  sourcePage?: string
  sourceType?: 'agent' | 'alternatives' | 'comparison' | 'guide' | 'homepage' | 'other'
}

export default function NewsletterSignup({ sourcePage = 'newsletter_page', sourceType = 'other' }: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit() {
    if (!email.trim()) return

    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), sourcePage, sourceType }),
      })

      const data = await res.json()

      if (!res.ok) {
        setStatus('error')
        setMessage(data.error || 'Something went wrong.')
        return
      }

      setStatus('success')
      setMessage(
        data.message === 'already_subscribed'
          ? "You're already subscribed!"
          : "You're in. First issue lands in your inbox soon."
      )
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div style={{
        backgroundColor: '#030712',
        padding: '36px 24px',
        textAlign: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 13l4 4L19 7" />
          </svg>
          <p style={{ fontSize: '15px', fontWeight: 500, color: '#FFFFFF', margin: 0 }}>{message}</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      backgroundColor: '#030712',
      padding: '36px 24px',
    }}>
      <div style={{ maxWidth: '520px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#60A5FA',
          marginBottom: '8px',
        }}>
          Free &middot; Every Two Weeks
        </p>
        <h3 style={{
          fontSize: '20px',
          fontWeight: 700,
          color: '#FFFFFF',
          marginBottom: '8px',
          letterSpacing: '-0.01em',
          lineHeight: 1.3,
        }}>
          AI Agent Price &amp; Rating Tracker
        </h3>
        <p style={{
          fontSize: '14px',
          color: '#9CA3AF',
          lineHeight: 1.6,
          marginBottom: '20px',
        }}>
          Price changes, new agent launches, acquisitions, and rating updates across 330+ AI agents, verified against live vendor data every 14 days.
        </p>
        <div style={{
          display: 'flex',
          gap: '8px',
          maxWidth: '380px',
          margin: '0 auto',
        }}>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (status === 'error') setStatus('idle')
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit()
            }}
            placeholder="you@company.com"
            style={{
              flex: 1,
              minWidth: 0,
              padding: '10px 14px',
              fontSize: '14px',
              backgroundColor: '#111827',
              border: status === 'error' ? '1px solid #EF4444' : '1px solid #374151',
              borderRadius: '8px',
              color: '#FFFFFF',
              outline: 'none',
              boxSizing: 'border-box' as const,
            }}
            disabled={status === 'loading'}
          />
          <button
            onClick={handleSubmit}
            disabled={status === 'loading' || !email.trim()}
            style={{
              padding: '10px 18px',
              fontSize: '14px',
              fontWeight: 600,
              backgroundColor: status === 'loading' ? '#3B82F6' : '#2563EB',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              cursor: status === 'loading' || !email.trim() ? 'not-allowed' : 'pointer',
              opacity: status === 'loading' || !email.trim() ? 0.5 : 1,
              whiteSpace: 'nowrap' as const,
              flexShrink: 0,
            }}
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </div>
        {status === 'error' && (
          <p style={{ fontSize: '13px', color: '#EF4444', marginTop: '10px' }}>{message}</p>
        )}
        <p style={{
          fontSize: '11px',
          color: '#4B5563',
          marginTop: '12px',
        }}>
          No spam. Unsubscribe anytime. We never share your email.
        </p>
      </div>
    </div>
  )
}