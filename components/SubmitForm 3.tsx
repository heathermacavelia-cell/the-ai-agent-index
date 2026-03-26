'use client'
import { useState } from 'react'

const CATEGORIES = [
  { value: 'ai-sales-agents', label: 'AI Sales Agents' },
  { value: 'ai-customer-support-agents', label: 'AI Customer Support Agents' },
  { value: 'ai-research-agents', label: 'AI Research Agents' },
  { value: 'ai-marketing-agents', label: 'AI Marketing Agents' },
  { value: 'ai-coding-agents', label: 'AI Coding Agents' },
]

const PRICING_MODELS = ['free', 'freemium', 'subscription', 'usage-based', 'custom']
const CUSTOMER_SEGMENTS = ['b2c', 'smb', 'b2b', 'enterprise']

const inputStyle = {
  width: '100%',
  padding: '0.625rem 0.875rem',
  border: '1px solid #E5E7EB',
  borderRadius: '0.5rem',
  fontSize: '0.9375rem',
  outline: 'none',
  boxSizing: 'border-box' as const,
  backgroundColor: 'white',
  color: '#111827',
}

const labelStyle = {
  display: 'block' as const,
  fontSize: '0.875rem',
  fontWeight: 600,
  color: '#374151',
  marginBottom: '0.375rem',
}

const fieldNote = {
  fontSize: '0.75rem',
  color: '#9CA3AF',
  marginTop: '0.25rem',
}

export default function SubmitForm() {
  const [form, setForm] = useState({
    name: '', developer: '', website_url: '', short_description: '',
    long_description: '', primary_category: '', pricing_model: '',
    starting_price: '', customer_segment: '', submitter_email: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit() {
    setError('')
    if (!form.name.trim()) { setError('Agent name is required.'); return }
    if (!form.developer.trim()) { setError('Developer / company name is required.'); return }
    if (!form.short_description.trim()) { setError('Short description is required.'); return }
    if (!form.primary_category) { setError('Please select a category.'); return }
    if (!form.pricing_model) { setError('Please select a pricing model.'); return }
    if (!form.customer_segment) { setError('Please select a customer segment.'); return }
    if (!form.submitter_email || !form.submitter_email.includes('@')) { setError('A valid contact email is required.'); return }

    setSubmitting(true)
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Submission failed')
      setSubmitted(true)
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) return (
    <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '0.875rem', padding: '2.5rem', textAlign: 'center' }}>
      <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🎉</div>
      <h2 style={{ fontWeight: 700, fontSize: '1.125rem', color: '#111827', marginBottom: '0.5rem' }}>Submission received!</h2>
      <p style={{ fontSize: '0.875rem', color: '#6B7280', lineHeight: 1.6 }}>
        We've received your submission and will review it shortly. If approved, you'll get an email with a link to your live listing and instructions to access your vendor dashboard.
      </p>
    </div>
  )

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: '1px solid #E5E7EB', padding: '2rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Agent name <span style={{ color: '#EF4444' }}>*</span></label>
            <input type="text" value={form.name} onChange={e => update('name', e.target.value)}
              placeholder="e.g. GitHub Copilot" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Developer / company <span style={{ color: '#EF4444' }}>*</span></label>
            <input type="text" value={form.developer} onChange={e => update('developer', e.target.value)}
              placeholder="e.g. GitHub" style={inputStyle} />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Website URL</label>
          <input type="url" value={form.website_url} onChange={e => update('website_url', e.target.value)}
            placeholder="https://..." style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>Short description <span style={{ color: '#EF4444' }}>*</span></label>
          <input type="text" value={form.short_description} onChange={e => update('short_description', e.target.value)}
            placeholder="One sentence describing what your agent does" style={inputStyle} maxLength={160} />
          <p style={fieldNote}>Max 160 characters. This appears in search results and category pages.</p>
        </div>

        <div>
          <label style={labelStyle}>Long description</label>
          <textarea value={form.long_description} onChange={e => update('long_description', e.target.value)}
            placeholder="Describe your agent in more detail — key features, use cases, what makes it different..."
            rows={4}
            style={{ ...inputStyle, resize: 'none', fontFamily: 'inherit' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Category <span style={{ color: '#EF4444' }}>*</span></label>
            <select value={form.primary_category} onChange={e => update('primary_category', e.target.value)} style={inputStyle}>
              <option value="">Select category...</option>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Pricing model <span style={{ color: '#EF4444' }}>*</span></label>
            <select value={form.pricing_model} onChange={e => update('pricing_model', e.target.value)} style={inputStyle}>
              <option value="">Select pricing...</option>
              {PRICING_MODELS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Starting price (USD)</label>
            <input type="number" value={form.starting_price} onChange={e => update('starting_price', e.target.value)}
              placeholder="0 for free" style={inputStyle} min="0" />
          </div>
          <div>
            <label style={labelStyle}>Customer segment <span style={{ color: '#EF4444' }}>*</span></label>
            <select value={form.customer_segment} onChange={e => update('customer_segment', e.target.value)} style={inputStyle}>
              <option value="">Select segment...</option>
              {CUSTOMER_SEGMENTS.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
            </select>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '1.25rem' }}>
          <label style={labelStyle}>Your contact email <span style={{ color: '#EF4444' }}>*</span></label>
          <input type="email" value={form.submitter_email} onChange={e => update('submitter_email', e.target.value)}
            placeholder="your@email.com" style={inputStyle} />
          <p style={fieldNote}>Never displayed publicly. Used only for submission confirmation and to access your vendor dashboard.</p>
        </div>

        {error && (
          <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '0.5rem', padding: '0.75rem 1rem' }}>
            <p style={{ fontSize: '0.875rem', color: '#EF4444' }}>{error}</p>
          </div>
        )}

        <button onClick={handleSubmit} disabled={submitting}
          style={{ width: '100%', padding: '0.875rem', backgroundColor: submitting ? '#93C5FD' : '#2563EB', color: 'white', border: 'none', borderRadius: '0.625rem', fontSize: '1rem', fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer' }}>
          {submitting ? 'Submitting...' : 'Submit agent — it\'s free'}
        </button>
      </div>
    </div>
  )
}