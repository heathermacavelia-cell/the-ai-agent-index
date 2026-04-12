'use client'
import { useState } from 'react'

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.625rem 0.875rem',
  border: '1px solid #D1D5DB', borderRadius: '0.5rem',
  fontSize: '0.9375rem', outline: 'none',
  boxSizing: 'border-box', fontFamily: 'inherit',
  backgroundColor: 'white', color: '#111827',
}

export default function PartnerWaitlistForm() {
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [services, setServices] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!email || !email.includes('@')) return
    setLoading(true)
    try {
      await fetch('/api/partner-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, company, email, services }),
      })
      setSubmitted(true)
    } catch {
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem 0' }}>
        <div style={{ width: '3rem', height: '3rem', backgroundColor: '#DCFCE7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
        </div>
        <p style={{ fontWeight: 700, fontSize: '1.125rem', color: '#111827', marginBottom: '0.375rem' }}>You're on the list!</p>
        <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>We'll be in touch when we're ready to make introductions.</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.375rem' }}>Your name</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Jane Smith" style={inputStyle} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.375rem' }}>Company (optional)</label>
          <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Acme Inc" style={inputStyle} />
        </div>
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.375rem' }}>Work email *</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jane@acme.com" style={inputStyle} />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.375rem' }}>What do you need help automating? (optional)</label>
        <textarea value={services} onChange={e => setServices(e.target.value)}
          placeholder="e.g. I want to automate my outbound sales process using Apollo and Instantly..."
          rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
      </div>
      <button onClick={handleSubmit} disabled={!email || loading}
        style={{ width: '100%', padding: '0.75rem', backgroundColor: '#2563EB', color: 'white', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.9375rem', border: 'none', cursor: email && !loading ? 'pointer' : 'not-allowed', opacity: email && !loading ? 1 : 0.5 }}>
        {loading ? 'Joining...' : 'Join the waitlist →'}
      </button>
      <p style={{ fontSize: '0.8125rem', color: '#9CA3AF', textAlign: 'center' }}>
        Are you an AI implementation specialist?{' '}
        <a href="mailto:hello@theaiagentindex.com" style={{ color: '#2563EB' }}>Apply to be a partner →</a>
      </p>
    </div>
  )
}