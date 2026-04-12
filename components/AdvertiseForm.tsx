'use client'
import { useState } from 'react'

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.625rem 0.875rem',
  backgroundColor: '#0F172A',
  border: '1px solid #1F2937',
  borderRadius: '0.5rem',
  color: 'white',
  fontSize: '0.9375rem',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  color: '#D1D5DB',
  fontSize: '0.875rem',
  fontWeight: 600,
  marginBottom: '0.5rem',
}

export default function AdvertiseForm() {
  const [form, setForm] = useState({ name: '', company: '', email: '', tier: '', category: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.tier) return
    setStatus('loading')
    try {
      const res = await fetch('/api/advertise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div style={{ backgroundColor: '#0F172A', border: '1px solid #1F2937', borderRadius: '0.875rem', padding: '3rem', textAlign: 'center' }}>
        <div style={{ width: '3rem', height: '3rem', backgroundColor: '#1F2937', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
        </div>
        <h3 style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '0.5rem', color: 'white' }}>Thanks — we'll be in touch shortly.</h3>
        <p style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>We respond to all sponsorship enquiries within one business day.</p>
      </div>
    )
  }

  const canSubmit = form.name && form.email && form.tier && status !== 'loading'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={labelStyle}>Your name *</label>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Jane Smith" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Company</label>
          <input name="company" value={form.company} onChange={handleChange} placeholder="Acme AI" style={inputStyle} />
        </div>
      </div>
      <div>
        <label style={labelStyle}>Work email *</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="jane@acme.com" style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>Which placement interests you? *</label>
        <select name="tier" value={form.tier} onChange={handleChange} style={inputStyle}>
          <option value="">Select a tier</option>
          <option value="Category Sponsor — $499 USD/mo">Category Sponsor — $499 USD/mo</option>
          <option value="Featured Listing — $149 USD/mo">Featured Listing — $149 USD/mo</option>
          <option value="Comparison Placement — $249 USD/mo">Comparison Placement — $249 USD/mo</option>
          <option value="Not sure yet">Not sure yet — tell me more</option>
        </select>
      </div>
      <div>
        <label style={labelStyle}>Most relevant category</label>
        <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
          <option value="">Select a category</option>
          <option value="AI Sales Agents">AI Sales Agents</option>
          <option value="AI Customer Support Agents">AI Customer Support Agents</option>
          <option value="AI Research Agents">AI Research Agents</option>
          <option value="AI Marketing Agents">AI Marketing Agents</option>
          <option value="AI Coding Agents">AI Coding Agents</option>
          <option value="AI HR Agents">AI HR Agents</option>
        </select>
      </div>
      <div>
        <label style={labelStyle}>Anything else?</label>
        <textarea name="message" value={form.message} onChange={handleChange}
          placeholder="Tell us about your product and what you're hoping to achieve..."
          rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
      </div>
      {status === 'error' && (
        <p style={{ color: '#F87171', fontSize: '0.875rem' }}>
          Something went wrong. Please email us directly at{' '}
          <a href="mailto:hello@theaiagentindex.com" style={{ color: '#60A5FA' }}>hello@theaiagentindex.com</a>
        </p>
      )}
      <button onClick={handleSubmit} disabled={!canSubmit}
        style={{ width: '100%', padding: '0.75rem', backgroundColor: '#2563EB', color: 'white', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.9375rem', border: 'none', cursor: canSubmit ? 'pointer' : 'not-allowed', opacity: canSubmit ? 1 : 0.5, transition: 'opacity 0.2s' }}>
        {status === 'loading' ? 'Sending...' : 'Get sponsorship details →'}
      </button>
    </div>
  )
}