'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

// Opened from the confirmation email (2026-10-23). Confirming takes a click on this page
// rather than happening on page load, so an email scanner that pre-opens links cannot
// publish a review by itself.

const box: React.CSSProperties = { maxWidth: '480px', margin: '6rem auto', padding: '0 1.5rem', textAlign: 'center' }
const button: React.CSSProperties = { display: 'inline-block', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', backgroundColor: '#2563EB', color: 'white', border: 'none', fontSize: '0.9375rem', fontWeight: 600, cursor: 'pointer', textDecoration: 'none' }

function ConfirmContent() {
  const token = useSearchParams().get('token')
  const [status, setStatus] = useState<'ready' | 'working' | 'invalid' | 'expired' | 'error'>(token ? 'ready' : 'invalid')

  async function confirm() {
    setStatus('working')
    try {
      const res = await fetch('/api/reviews/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      const data = await res.json()
      if (res.ok && data.slug) {
        window.location.href = '/agents/' + data.slug + '?review=confirmed#reviews'
        return
      }
      setStatus(data.error === 'expired' ? 'expired' : data.error === 'invalid' ? 'invalid' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'ready' || status === 'working') {
    return (
      <div style={box}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>Confirm your review</h1>
        <p style={{ color: '#4B5563', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>One click and your review goes live on The AI Agent Index.</p>
        <button onClick={confirm} disabled={status === 'working'} style={{ ...button, backgroundColor: status === 'working' ? '#93C5FD' : '#2563EB' }}>
          {status === 'working' ? 'Confirming...' : 'Confirm my review'}
        </button>
      </div>
    )
  }

  const message =
    status === 'expired' ? 'This link has expired. Links work for 7 days. Please submit your review again and we will send a new one.'
    : status === 'invalid' ? 'This link is not valid or has already been used. If your review is already confirmed, it is live on the listing.'
    : 'Something went wrong. Please try the link again in a minute.'

  return (
    <div style={box}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>We could not confirm this review</h1>
      <p style={{ color: '#4B5563', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>{message}</p>
      <Link href="/" style={button}>Go to The AI Agent Index</Link>
    </div>
  )
}

export default function ConfirmReviewPage() {
  return (
    <Suspense fallback={<div style={box}><p style={{ color: '#6B7280' }}>Loading...</p></div>}>
      <ConfirmContent />
    </Suspense>
  )
}
