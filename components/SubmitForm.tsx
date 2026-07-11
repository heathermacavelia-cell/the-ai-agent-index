'use client'
import { useState } from 'react'

const CATEGORIES = [
  { value: 'ai-sales-agents', label: 'AI Sales Agents' },
  { value: 'ai-customer-support-agents', label: 'AI Customer Support Agents' },
  { value: 'ai-research-agents', label: 'AI Research Agents' },
  { value: 'ai-marketing-agents', label: 'AI Marketing Agents' },
  { value: 'ai-coding-agents', label: 'AI Coding Agents' },
  { value: 'ai-hr-agents', label: 'AI HR Agents' },
  { value: 'ai-workflow-agents', label: 'AI Workflow Agents' },
  { value: 'ai-customer-success-agents', label: 'AI Customer Success Agents' },
]

const PRICING_MODELS = ['free', 'freemium', 'subscription', 'usage-based', 'custom']
const CUSTOMER_SEGMENTS = ['b2c', 'smb', 'b2b', 'enterprise']

const MCP_OPTIONS = [
  { value: '', label: 'Select...' },
  { value: 'none', label: 'No MCP support' },
  { value: 'client', label: 'MCP client (connects out to MCP servers)' },
  { value: 'server', label: 'MCP server (external agents connect into us)' },
  { value: 'both', label: 'Both server and client' },
  { value: 'not-sure', label: 'Not sure' },
]

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

function isValidUrl(value: string): boolean {
  try {
    const u = new URL(value)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

export default function SubmitForm() {
  const [form, setForm] = useState({
    name: '', developer: '', website_url: '', pricing_url: '', logo_url: '',
    short_description: '', primary_category: '',
    pricing_model: '', starting_price: '', customer_segment: '',
    mcp_claim: '', mcp_docs_url: '', notes: '',
    submitter_email: '',
  })
  const [interestedInAds, setInterestedInAds] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const descLen = form.short_description.trim().length

  async function handleSubmit() {
    setError('')
    if (!form.name.trim()) { setError('Agent name is required.'); return }
    if (!form.developer.trim()) { setError('Developer / company name is required.'); return }
    if (!form.website_url.trim() || !isValidUrl(form.website_url.trim())) { setError('A valid website URL is required (starting with https://).'); return }
    if (!form.pricing_url.trim() || !isValidUrl(form.pricing_url.trim())) { setError('A valid public pricing page URL is required. Listings require public pricing.'); return }
    if (form.logo_url.trim() && !isValidUrl(form.logo_url.trim())) { setError('Logo URL must be a valid link (starting with https://).'); return }
    if (descLen < 120 || descLen > 220) { setError('Description must be between 120 and 220 characters (currently ' + descLen + ').'); return }
    if (!form.primary_category) { setError('Please select a category.'); return }
    if (!form.pricing_model) { setError('Please select a pricing model.'); return }
    if (!form.customer_segment) { setError('Please select a customer segment.'); return }
    if (form.mcp_claim === 'server' || form.mcp_claim === 'both') {
      if (!form.mcp_docs_url.trim() || !isValidUrl(form.mcp_docs_url.trim())) {
        setError('MCP server claims require a link to your official MCP documentation.'); return
      }
    }
    if (!form.submitter_email || !form.submitter_email.includes('@')) { setError('A valid contact email is required.'); return }

    setSubmitting(true)
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, short_description: form.short_description.trim(), interested_in_ads: interestedInAds }),
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
        Our editorial team will independently research your agent and write the listing. If it qualifies, you&apos;ll get an email when it goes live with a link to claim your listing and access vendor options.
      </p>
      {interestedInAds && (
        <p style={{ fontSize: '0.8125rem', color: '#065F46', marginTop: '0.75rem' }}>
          We noted your interest in advertising options and will include that in our follow-up.
        </p>
      )}
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Website URL <span style={{ color: '#EF4444' }}>*</span></label>
            <input type="url" value={form.website_url} onChange={e => update('website_url', e.target.value)}
              placeholder="https://..." style={inputStyle} />
            <p style={fieldNote}>Your product homepage.</p>
          </div>
          <div>
            <label style={labelStyle}>Public pricing page <span style={{ color: '#EF4444' }}>*</span></label>
            <input type="url" value={form.pricing_url} onChange={e => update('pricing_url', e.target.value)}
              placeholder="https://yoursite.com/pricing" style={inputStyle} />
            <p style={fieldNote}>Required. We only list products with a pricing page viewable without a login or demo request.</p>
          </div>
        </div>

        <div>
          <label style={labelStyle}>Logo URL</label>
          <input type="url" value={form.logo_url} onChange={e => update('logo_url', e.target.value)}
            placeholder="https://yoursite.com/logo.png" style={inputStyle} />
          <p style={fieldNote}>Direct link to your logo. PNG or SVG, square preferred.</p>
        </div>

        <div>
          <label style={labelStyle}>What does your agent do? <span style={{ color: '#EF4444' }}>*</span></label>
          <textarea value={form.short_description} onChange={e => update('short_description', e.target.value)}
            placeholder="What it does, who it is for, and what makes it different. 120 to 220 characters."
            rows={3} maxLength={220}
            style={{ ...inputStyle, resize: 'none', fontFamily: 'inherit' }} />
          <p style={{ ...fieldNote, color: descLen >= 120 && descLen <= 220 ? '#059669' : '#9CA3AF' }}>
            {descLen}/220 characters (minimum 120). Note: our editorial team independently researches and writes every listing. Your answers here guide that research.
          </p>
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>MCP support</label>
            <select value={form.mcp_claim} onChange={e => update('mcp_claim', e.target.value)} style={inputStyle}>
              {MCP_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <p style={fieldNote}>We verify MCP claims against official documentation only.</p>
          </div>
          <div>
            <label style={labelStyle}>MCP documentation URL{(form.mcp_claim === 'server' || form.mcp_claim === 'both') && <span style={{ color: '#EF4444' }}> *</span>}</label>
            <input type="url" value={form.mcp_docs_url} onChange={e => update('mcp_docs_url', e.target.value)}
              placeholder="https://docs.yoursite.com/mcp" style={inputStyle} />
            <p style={fieldNote}>Required for MCP server claims.</p>
          </div>
        </div>

        <div>
          <label style={labelStyle}>Anything else we should know?</label>
          <input type="text" value={form.notes} onChange={e => update('notes', e.target.value)}
            placeholder="Optional: recent launches, key integrations, security certifications..." style={inputStyle} maxLength={300} />
        </div>

        <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '1.25rem' }}>
          <label style={labelStyle}>Your contact email <span style={{ color: '#EF4444' }}>*</span></label>
          <input type="email" value={form.submitter_email} onChange={e => update('submitter_email', e.target.value)}
            placeholder="your@email.com" style={inputStyle} />
          <p style={fieldNote}>Never displayed publicly. We use this to notify you when your listing is live and to let you claim it.</p>
        </div>

        {/* Advertising interest */}
        <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '0.75rem', padding: '1.25rem' }}>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={interestedInAds} onChange={e => setInterestedInAds(e.target.checked)}
              style={{ marginTop: '0.25rem', width: '1.125rem', height: '1.125rem', accentColor: '#D97706', cursor: 'pointer' }} />
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#92400E', margin: '0 0 0.25rem' }}>
                I am interested in premium options for my listing
              </p>
              <p style={{ fontSize: '0.8125rem', color: '#A16207', lineHeight: 1.5, margin: 0 }}>
                Vendor Managed, featured listings, category sponsorships, and demo videos. Available to live, claimed listings — check this box and we will follow up when yours is approved.
              </p>
            </div>
          </label>
        </div>

        <p style={{ fontSize: '0.75rem', color: '#9CA3AF', lineHeight: 1.6, margin: 0 }}>
          Submission is free. Every listing is independently researched and written by our editorial team. Paid options exist only for live, claimed listings and never affect ratings or placement.
        </p>

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