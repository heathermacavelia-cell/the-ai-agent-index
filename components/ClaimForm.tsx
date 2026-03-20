'use client'
import { useState } from 'react'
import Link from 'next/link'

interface Agent {
  id: string
  name: string
  slug: string
  developer: string
}

export default function ClaimForm({ agent }: { agent: Agent }) {
  const [form, setForm] = useState({
    claimant_name: '',
    claimant_email: '',
    claimant_title: '',
    company_domain: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit() {
    if (!form.claimant_name || !form.claimant_email || !form.company_domain) {
      setErrorMsg('Please fill in all required fields.')
      return
    }
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_slug: agent.slug,
          agent_name: agent.name,
          ...form,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error || 'Something went wrong.')
        setStatus('error')
      } else {
        setStatus('success')
      }
    } catch {
      setErrorMsg('Network error. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div style={{ maxWidth: '520px', margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>📬</div>
        <h1 style={{ fontWeight: 700, fontSize: '1.25rem', color: '#111827', marginBottom: '8px' }}>Check your email</h1>
        <p style={{ color: '#6B7280', fontSize: '0.9375rem', lineHeight: 1.6 }}>
          We sent a verification link to <strong>{form.claimant_email}</strong>. Click the link to confirm your claim — we will review it within 2 business days.
        </p>
        <Link href={'/agents/' + agent.slug} style={{ display: 'inline-block', marginTop: '24px', color: '#2563EB', fontSize: '0.875rem' }}>
          Back to {agent.name}
        </Link>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '560px', margin: '60px auto', padding: '0 24px 80px' }}>
      <Link href={'/agents/' + agent.slug} style={{ fontSize: '0.875rem', color: '#6B7280', textDecoration: 'none', display: 'inline-block', marginBottom: '24px' }}>
        Back to {agent.name}
      </Link>

      <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '2rem' }}>
        <h1 style={{ fontWeight: 700, fontSize: '1.375rem', color: '#111827', marginBottom: '4px' }}>Claim this listing</h1>
        <p style={{ color: '#6B7280', fontSize: '0.9375rem', marginBottom: '2rem', lineHeight: 1.5 }}>
          You are claiming <strong>{agent.name}</strong>. After verification you will be able to update your listing details and receive a Verified badge.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
              Your name *
            </label>
            <input name="claimant_name" value={form.claimant_name} onChange={handleChange} placeholder="Jane Smith"
              style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.5rem', border: '1px solid #D1D5DB', fontSize: '0.9375rem', boxSizing: 'border-box' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
              Work email *
            </label>
            <input name="claimant_email" type="email" value={form.claimant_email} onChange={handleChange} placeholder="jane@yourcompany.com"
              style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.5rem', border: '1px solid #D1D5DB', fontSize: '0.9375rem', boxSizing: 'border-box' }} />
            <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '4px' }}>Use your company email to speed up domain verification.</p>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
              Your title
            </label>
            <input name="claimant_title" value={form.claimant_title} onChange={handleChange} placeholder="Head of Marketing"
              style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.5rem', border: '1px solid #D1D5DB', fontSize: '0.9375rem', boxSizing: 'border-box' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
              Company domain *
            </label>
            <input name="company_domain" value={form.company_domain} onChange={handleChange} placeholder="yourcompany.com"
              style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.5rem', border: '1px solid #D1D5DB', fontSize: '0.9375rem', boxSizing: 'border-box' }} />
            <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '4px' }}>Must match your email domain for instant verification.</p>
          </div>

          {errorMsg && (
            <p style={{ fontSize: '0.875rem', color: '#DC2626', backgroundColor: '#FEF2F2', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #FECACA' }}>
              {errorMsg}
            </p>
          )}

          <button onClick={handleSubmit} disabled={status === 'loading'}
            style={{ width: '100%', padding: '0.75rem', backgroundColor: status === 'loading' ? '#93C5FD' : '#2563EB', color: 'white', border: 'none', borderRadius: '0.5rem', fontSize: '1rem', fontWeight: 600, cursor: status === 'loading' ? 'not-allowed' : 'pointer' }}>
            {status === 'loading' ? 'Submitting...' : 'Submit claim'}
          </button>
        </div>

        <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#F9FAFB', borderRadius: '0.5rem', border: '1px solid #E5E7EB' }}>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', lineHeight: 1.6, margin: 0 }}>
            <strong style={{ color: '#374151' }}>What happens next:</strong> We will send a verification email to confirm your identity. Once verified, your claim goes into our review queue. Approved listings receive a Verified badge and the ability to update listing details.
          </p>
        </div>
      </div>
    </div>
  )
}