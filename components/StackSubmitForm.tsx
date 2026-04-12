'use client'
import { useState } from 'react'

const CATEGORIES = [
  { slug: 'ai-sales-agents', label: 'AI Sales Agents' },
  { slug: 'ai-customer-support-agents', label: 'AI Customer Support Agents' },
  { slug: 'ai-research-agents', label: 'AI Research Agents' },
  { slug: 'ai-marketing-agents', label: 'AI Marketing Agents' },
  { slug: 'ai-coding-agents', label: 'AI Coding Agents' },
  { slug: 'ai-hr-agents', label: 'AI HR Agents' },
]

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.625rem 0.875rem',
  backgroundColor: '#0F172A', border: '1px solid #1F2937',
  borderRadius: '0.5rem', color: 'white', fontSize: '0.9375rem',
  outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
}

const labelStyle: React.CSSProperties = {
  display: 'block', color: '#D1D5DB',
  fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem',
}

export default function StackSubmitForm() {
  const [form, setForm] = useState({
    name: '', tagline: '', description: '', workflow_goal: '',
    category: '', agents: '', how_they_connect: '',
    submitter_title: '', submitter_company_type: '', email: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async () => {
    if (!form.name || !form.category || !form.agents || !form.email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/stacks/submit', {
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
        <div style={{ width: '3rem', height: '3rem', backgroundColor: '#064E3B', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
        </div>
        <h3 style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '0.5rem', color: 'white' }}>Stack submitted — thank you.</h3>
        <p style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>We review all community stacks before publishing. We'll be in touch if we have questions.</p>
      </div>
    )
  }

  const canSubmit = form.name && form.category && form.agents && form.email && status !== 'loading'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <label style={labelStyle}>Stack name *</label>
        <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Full Outbound Sales Stack" style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>One-line tagline *</label>
        <input name="tagline" value={form.tagline} onChange={handleChange} placeholder="e.g. From prospecting to booked meeting — fully automated." style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>What does this stack automate? *</label>
        <input name="workflow_goal" value={form.workflow_goal} onChange={handleChange} placeholder="e.g. Automate outbound prospecting and email outreach" style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>Category *</label>
        <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
          <option value="">Select a category</option>
          {CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.label}</option>)}
        </select>
      </div>
      <div>
        <label style={labelStyle}>Agents in this stack (in order) *</label>
        <textarea name="agents" value={form.agents} onChange={handleChange}
          placeholder="List the agents in order, one per line. e.g.&#10;1. Apollo.io&#10;2. Instantly.ai&#10;3. Lemlist"
          rows={5} style={{ ...inputStyle, resize: 'vertical' }} />
      </div>
      <div>
        <label style={labelStyle}>How do they connect?</label>
        <textarea name="how_they_connect" value={form.how_they_connect} onChange={handleChange}
          placeholder="Describe how each agent hands off to the next — what data passes between them and how."
          rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
      </div>
      <div>
        <label style={labelStyle}>Full description (optional)</label>
        <textarea name="description" value={form.description} onChange={handleChange}
          placeholder="Tell us more about this stack — what problem it solves, who it's for, and any gotchas."
          rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={labelStyle}>Your job title</label>
          <input name="submitter_title" value={form.submitter_title} onChange={handleChange} placeholder="Head of Sales Ops" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Company type</label>
          <select name="submitter_company_type" value={form.submitter_company_type} onChange={handleChange} style={inputStyle}>
            <option value="">Select</option>
            <option value="startup">Startup</option>
            <option value="smb">SMB</option>
            <option value="mid-market">Mid-market</option>
            <option value="enterprise">Enterprise</option>
            <option value="agency">Agency</option>
            <option value="solo">Solo / Freelance</option>
          </select>
        </div>
      </div>
      <div>
        <label style={labelStyle}>Your email * (for follow-up only, not displayed publicly)</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@company.com" style={inputStyle} />
      </div>
      {status === 'error' && (
        <p style={{ color: '#F87171', fontSize: '0.875rem' }}>Something went wrong. Please email hello@theaiagentindex.com directly.</p>
      )}
      <button onClick={handleSubmit} disabled={!canSubmit}
        style={{ width: '100%', padding: '0.75rem', backgroundColor: '#2563EB', color: 'white', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.9375rem', border: 'none', cursor: canSubmit ? 'pointer' : 'not-allowed', opacity: canSubmit ? 1 : 0.5 }}>
        {status === 'loading' ? 'Submitting...' : 'Submit stack for review →'}
      </button>
    </div>
  )
}