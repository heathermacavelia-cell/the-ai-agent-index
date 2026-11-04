'use client'

import { useState } from 'react'

interface NewsletterSignupProps {
  sourcePage?: string
  sourceType?: 'agent' | 'alternatives' | 'comparison' | 'guide' | 'homepage' | 'other'
  /** Live count of active agents. Omit it and the copy renders without a number
   *  rather than publishing a stale one. Never hardcode a value here. */
  agentCount?: number
}

export default function NewsletterSignup({ sourcePage = 'newsletter_page', sourceType = 'other', agentCount }: NewsletterSignupProps) {
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
          : "You're in. Next issue lands in your inbox soon."
      )
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div style={{
        backgroundColor: '#F4F5F7',
        borderRadius: '10px',
        padding: '28px 32px',
        textAlign: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1D4ED8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 13l4 4L19 7" />
          </svg>
          <p style={{ fontSize: '15px', fontWeight: 500, color: '#111827', margin: 0 }}>{message}</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      backgroundColor: '#EFF6FF',
      border: '1px solid #BFDBFE',
      borderRadius: '10px',
      padding: '28px 32px',
    }}>
      <div>
        <h3 style={{
          fontFamily: 'var(--font-serif), Georgia, serif',
          fontSize: '28px',
          fontWeight: 600,
          color: '#111827',
          margin: '0 0 6px',
          lineHeight: 1.2,
        }}>
          AI Agent Price &amp; Rating Tracker
        </h3>
        <p style={{
          fontSize: '16px',
          color: '#374151',
          lineHeight: 1.5,
          margin: '0 0 16px',
        }}>
          Free, every two weeks. Price changes, new agent launches, acquisitions, and rating updates across{' '}
          {agentCount ? `${agentCount} AI agents` : 'the AI agent market'}. Verified against live vendor data, not vendor marketing.
        </p>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
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
              flex: '1 1 220px',
              minWidth: 0,
              height: '48px',
              padding: '0 14px',
              fontSize: '16px',
              fontFamily: 'inherit',
              backgroundColor: '#FFFFFF',
              border: status === 'error' ? '1px solid #DC2626' : '1px solid #9CA3AF',
              borderRadius: '6px',
              color: '#111827',
              outline: 'none',
              boxSizing: 'border-box' as const,
            }}
            disabled={status === 'loading'}
          />
          <button
            onClick={handleSubmit}
            disabled={status === 'loading'}
            style={{
              height: '48px',
              padding: '0 22px',
              fontSize: '16px',
              fontFamily: 'inherit',
              fontWeight: 600,
              backgroundColor: '#1D4ED8',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '6px',
              cursor: status === 'loading' ? 'not-allowed' : 'pointer',
              opacity: status === 'loading' ? 0.6 : 1,
              whiteSpace: 'nowrap' as const,
              flexShrink: 0,
            }}
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </div>
        {status === 'error' && (
          <p style={{ fontSize: '13px', color: '#B91C1C', marginTop: '10px' }}>{message}</p>
        )}
        <p style={{
          fontSize: '13px',
          color: '#4B5563',
          marginTop: '10px',
        }}>
          No spam. Unsubscribe anytime. We never share your email. <a href="/resources/newsletter" style={{ color: '#1D4ED8' }}>Read past issues</a>
        </p>
      </div>
    </div>
  )
}