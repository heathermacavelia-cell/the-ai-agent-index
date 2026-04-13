'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function UnsubscribeContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'invalid'>('loading')

  useEffect(() => {
    if (!token) {
      setStatus('invalid')
      return
    }
    fetch('/api/newsletter?token=' + token, { method: 'DELETE' })
      .then(res => res.ok ? setStatus('success') : setStatus('error'))
      .catch(() => setStatus('error'))
  }, [token])

  return (
    <div style={{ maxWidth: '480px', margin: '6rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
      {status === 'loading' && (
        <p style={{ color: '#6B7280', fontSize: '1rem' }}>Unsubscribing…</p>
      )}
      {status === 'success' && (
        <>
          <div style={{ width: '3rem', height: '3rem', backgroundColor: '#F0FDF4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <span style={{ fontSize: '1.5rem' }}>✓</span>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '0.75rem' }}>You're unsubscribed</h1>
          <p style={{ color: '#6B7280', fontSize: '0.9375rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            You won't receive any more emails from The AI Agent Index. If this was a mistake, you can resubscribe any time.
          </p>
          <Link href="/" style={{ display: 'inline-block', padding: '0.625rem 1.25rem', backgroundColor: '#2563EB', color: 'white', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: 600, fontSize: '0.9375rem' }}>
            Back to the Index →
          </Link>
        </>
      )}
      {status === 'error' && (
        <>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '0.75rem' }}>Something went wrong</h1>
          <p style={{ color: '#6B7280', fontSize: '0.9375rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            We couldn't process your unsubscribe request. Please try again or reply to any email and we'll remove you manually.
          </p>
          <Link href="/" style={{ display: 'inline-block', padding: '0.625rem 1.25rem', backgroundColor: '#2563EB', color: 'white', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: 600, fontSize: '0.9375rem' }}>
            Back to the Index →
          </Link>
        </>
      )}
      {status === 'invalid' && (
        <>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '0.75rem' }}>Invalid link</h1>
          <p style={{ color: '#6B7280', fontSize: '0.9375rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            This unsubscribe link is missing a token. Please use the link from your email.
          </p>
          <Link href="/" style={{ display: 'inline-block', padding: '0.625rem 1.25rem', backgroundColor: '#2563EB', color: 'white', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: 600, fontSize: '0.9375rem' }}>
            Back to the Index →
          </Link>
        </>
      )}
    </div>
  )
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={<div style={{ maxWidth: '480px', margin: '6rem auto', padding: '0 1.5rem', textAlign: 'center' }}><p style={{ color: '#6B7280' }}>Loading…</p></div>}>
      <UnsubscribeContent />
    </Suspense>
  )
}