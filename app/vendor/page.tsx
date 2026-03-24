'use client'
import { useState } from 'react'

export default function VendorAccessPage() {
  const [email, setEmail] = useState('')
  const [agentSlug, setAgentSlug] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleRequest() {
    setError('')
    if (!email || !agentSlug) {
      setError('Please enter your email and agent slug.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/vendor/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, agent_slug: agentSlug }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSent(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '480px', margin: '5rem auto', padding: '0 1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Vendor Dashboard</p>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginBottom: '0.75rem' }}>Access your listing</h1>
        <p style={{ color: '#6B7280', fontSize: '0.9375rem', lineHeight: 1.6 }}>
          Enter the email you used to claim your listing. We will send you a secure access link.
        </p>
      </div>

      {sent ? (
        <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '0.875rem', padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>📬</div>
          <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#111827', marginBottom: '0.5rem' }}>Check your inbox</h2>
          <p style={{ fontSize: '0.875rem', color: '#6B7280', lineHeight: 1.6 }}>
            We sent a secure access link to <strong>{email}</strong>. Click the link in the email to access your vendor dashboard.
          </p>
        </div>
      ) : (
        <div style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.875rem', padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', color: '#374151', marginBottom: '0.375rem' }}>Your claim email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@company.com"
              style={{ width: '100%', padding: '0.625rem 0.875rem', border: '1px solid #D1D5DB', borderRadius: '0.5rem', fontSize: '0.875rem', boxSizing: 'border-box' as const }} />
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', color: '#374151', marginBottom: '0.375rem' }}>Agent slug</label>
            <input value={agentSlug} onChange={e => setAgentSlug(e.target.value)}
              placeholder="e.g. instantly-ai"
              style={{ width: '100%', padding: '0.625rem 0.875rem', border: '1px solid #D1D5DB', borderRadius: '0.5rem', fontSize: '0.875rem', boxSizing: 'border-box' as const }} />
            <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '0.25rem' }}>Find this in the URL of your listing page.</p>
          </div>
          {error && <p style={{ color: '#EF4444', fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</p>}
          <button onClick={handleRequest} disabled={loading}
            style={{ width: '100%', padding: '0.75rem', backgroundColor: loading ? '#93C5FD' : '#2563EB', color: 'white', border: 'none', borderRadius: '0.5rem', fontSize: '0.9375rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Sending...' : 'Send access link'}
          </button>
        </div>
      )}

      <p style={{ fontSize: '0.8125rem', color: '#9CA3AF', textAlign: 'center', marginTop: '1.5rem' }}>
        Don't have a claimed listing yet? <a href="/submit" style={{ color: '#2563EB' }}>Claim your listing →</a>
      </p>
    </div>
  )
}
