'use client'
import { useState, useEffect, useRef } from 'react'

const CATEGORIES = [
  { slug: 'ai-sales-agents', label: 'AI Sales Agents' },
  { slug: 'ai-customer-support-agents', label: 'AI Customer Support Agents' },
  { slug: 'ai-research-agents', label: 'AI Research Agents' },
  { slug: 'ai-marketing-agents', label: 'AI Marketing Agents' },
  { slug: 'ai-coding-agents', label: 'AI Coding Agents' },
  { slug: 'ai-hr-agents', label: 'AI HR Agents' },
  { slug: 'ai-workflow-agents', label: 'AI Workflow Agents' },
  { slug: 'ai-customer-success-agents', label: 'AI Customer Success Agents' },
]

const DIFFICULTIES = [
  { value: 'easy', label: 'Easy — no-code setup, works out of the box' },
  { value: 'moderate', label: 'Moderate — some configuration required' },
  { value: 'complex', label: 'Complex — technical setup, API or custom integration' },
]

const CONNECTION_TYPES = [
  'Native integration (built-in connector)',
  'Zapier / Make automation',
  'API to API',
  'MCP (Model Context Protocol)',
  'Manual handoff / copy-paste',
  'Shared database or CRM',
  'Webhook',
  'Other',
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

const noteStyle: React.CSSProperties = {
  fontSize: '0.75rem', color: '#6B7280', marginTop: '0.375rem',
}

interface AgentOption {
  slug: string
  name: string
  short_description: string
}

interface SelectedAgent {
  type: 'listed' | 'unlisted'
  slug?: string
  name: string
  role: string
  connection: string
}

function AgentSearch({ onSelect }: { onSelect: (agent: AgentOption) => void }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<AgentOption[]>([])
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (query.length < 2) { setResults([]); return }
    const timeout = setTimeout(async () => {
      const res = await fetch('/api/agents/search?q=' + encodeURIComponent(query) + '&limit=8')
      if (res.ok) setResults(await res.json())
    }, 250)
    return () => clearTimeout(timeout)
  }, [query])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <input
        value={query}
        onChange={e => { setQuery(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        placeholder="Search agents..."
        style={inputStyle}
      />
      {open && (query.length >= 2) && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '0.5rem', zIndex: 50, marginTop: '0.25rem', maxHeight: '240px', overflowY: 'auto' }}>
          {results.length === 0 ? (
            <div style={{ padding: '0.75rem 1rem', color: '#9CA3AF', fontSize: '0.875rem' }}>No agents found for "{query}"</div>
          ) : (
            results.map(a => (
              <button key={a.slug} onClick={() => { onSelect(a); setQuery(''); setOpen(false) }}
                style={{ width: '100%', textAlign: 'left', padding: '0.625rem 1rem', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: 'white', display: 'block' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#374151')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{a.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '0.125rem' }}>{a.short_description?.slice(0, 80)}</div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default function StackSubmitForm() {
  const [form, setForm] = useState({
    name: '', tagline: '', description: '', workflow_goal: '',
    category: '', difficulty: '', how_they_connect: '',
    submitter_title: '', submitter_company_type: '', email: '',
  })
  const [agents, setAgents] = useState<SelectedAgent[]>([])
  const [addingUnlisted, setAddingUnlisted] = useState(false)
  const [unlistedName, setUnlistedName] = useState('')
  const [unlistedRole, setUnlistedRole] = useState('')
  const [unlistedConnection, setUnlistedConnection] = useState('')
  const [pendingAgent, setPendingAgent] = useState<AgentOption | null>(null)
  const [pendingRole, setPendingRole] = useState('')
  const [pendingConnection, setPendingConnection] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleAgentSelect = (agent: AgentOption) => {
    setPendingAgent(agent)
    setPendingRole('')
    setPendingConnection('')
  }

  const confirmAgent = () => {
    if (!pendingAgent || !pendingRole) return
    setAgents(prev => [...prev, {
      type: 'listed',
      slug: pendingAgent.slug,
      name: pendingAgent.name,
      role: pendingRole,
      connection: pendingConnection,
    }])
    setPendingAgent(null)
    setPendingRole('')
    setPendingConnection('')
  }

  const confirmUnlisted = () => {
    if (!unlistedName || !unlistedRole) return
    setAgents(prev => [...prev, {
      type: 'unlisted',
      name: unlistedName,
      role: unlistedRole,
      connection: unlistedConnection,
    }])
    setUnlistedName('')
    setUnlistedRole('')
    setUnlistedConnection('')
    setAddingUnlisted(false)
  }

  const removeAgent = (i: number) => setAgents(prev => prev.filter((_, idx) => idx !== i))
  const moveUp = (i: number) => {
    if (i === 0) return
    setAgents(prev => { const a = [...prev]; [a[i-1], a[i]] = [a[i], a[i-1]]; return a })
  }
  const moveDown = (i: number) => {
    if (i === agents.length - 1) return
    setAgents(prev => { const a = [...prev]; [a[i], a[i+1]] = [a[i+1], a[i]]; return a })
  }

  const handleSubmit = async () => {
    setError('')
    if (!form.name.trim()) { setError('Stack name is required.'); return }
    if (!form.tagline.trim()) { setError('Tagline is required.'); return }
    if (!form.workflow_goal.trim()) { setError('Workflow goal is required.'); return }
    if (!form.category) { setError('Please select a category.'); return }
    if (!form.difficulty) { setError('Please select a difficulty level.'); return }
    if (agents.length < 2) { setError('Please add at least 2 agents to the stack.'); return }
    if (!form.email || !form.email.includes('@')) { setError('A valid email is required.'); return }

    const description = form.description.trim() ||
      `${form.tagline} ${form.workflow_goal ? 'Goal: ' + form.workflow_goal + '.' : ''}`

    setStatus('loading')
    try {
      const res = await fetch('/api/stacks/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, description, agents }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Submission failed')
      setStatus('success')
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong.')
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
        <p style={{ color: '#9CA3AF', fontSize: '0.875rem', lineHeight: 1.6 }}>We review all community stacks before publishing. You'll receive an email when it's approved or if we have questions.</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Stack basics */}
      <div>
        <label style={labelStyle}>Stack name <span style={{ color: '#EF4444' }}>*</span></label>
        <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Full Outbound Sales Stack" style={inputStyle} />
      </div>

      <div>
        <label style={labelStyle}>One-line tagline <span style={{ color: '#EF4444' }}>*</span></label>
        <input name="tagline" value={form.tagline} onChange={handleChange} placeholder="e.g. From prospecting to booked meeting — fully automated." style={inputStyle} />
        <p style={noteStyle}>Shown on the stack card. Keep it under 100 characters.</p>
      </div>

      <div>
        <label style={labelStyle}>What does this stack automate? <span style={{ color: '#EF4444' }}>*</span></label>
        <input name="workflow_goal" value={form.workflow_goal} onChange={handleChange} placeholder="e.g. Automate outbound prospecting and email outreach for B2B sales teams" style={inputStyle} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={labelStyle}>Category <span style={{ color: '#EF4444' }}>*</span></label>
          <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
            <option value="">Select category...</option>
            {CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Implementation difficulty <span style={{ color: '#EF4444' }}>*</span></label>
          <select name="difficulty" value={form.difficulty} onChange={handleChange} style={inputStyle}>
            <option value="">Select difficulty...</option>
            {DIFFICULTIES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label style={labelStyle}>Full description <span style={{ color: '#6B7280', fontWeight: 400 }}>(optional)</span></label>
        <textarea name="description" value={form.description} onChange={handleChange}
          placeholder="Tell us more about this stack — what problem it solves, who it's for, any gotchas or setup tips. If left blank we'll generate one from your tagline and workflow goal."
          rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
      </div>

      {/* Agents */}
      <div>
        <label style={labelStyle}>Agents in this stack <span style={{ color: '#EF4444' }}>*</span></label>
        <p style={noteStyle}>Add at least 2 agents in the order they run. Search by name — if an agent isn't listed yet, add it manually.</p>

        {/* Added agents */}
        {agents.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
            {agents.map((a, i) => (
              <div key={i} style={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '0.5rem', padding: '0.75rem 1rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{ width: '1.5rem', height: '1.5rem', backgroundColor: '#2563EB', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.75rem', fontWeight: 700, color: 'white' }}>{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'white' }}>{a.name}</span>
                    {a.type === 'unlisted' && <span style={{ fontSize: '0.6875rem', backgroundColor: '#374151', color: '#9CA3AF', padding: '0.1rem 0.375rem', borderRadius: '0.25rem' }}>unlisted</span>}
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: '#9CA3AF', margin: 0 }}>{a.role}</p>
                  {a.connection && <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: '0.25rem 0 0', fontStyle: 'italic' }}>↳ {a.connection}</p>}
                </div>
                <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }}>
                  <button onClick={() => moveUp(i)} disabled={i === 0}
                    style={{ padding: '0.25rem', backgroundColor: 'transparent', border: 'none', color: i === 0 ? '#374151' : '#9CA3AF', cursor: i === 0 ? 'default' : 'pointer' }}>↑</button>
                  <button onClick={() => moveDown(i)} disabled={i === agents.length - 1}
                    style={{ padding: '0.25rem', backgroundColor: 'transparent', border: 'none', color: i === agents.length - 1 ? '#374151' : '#9CA3AF', cursor: i === agents.length - 1 ? 'default' : 'pointer' }}>↓</button>
                  <button onClick={() => removeAgent(i)}
                    style={{ padding: '0.25rem', backgroundColor: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer' }}>✕</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Search to add */}
        {!pendingAgent && !addingUnlisted && (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <AgentSearch onSelect={handleAgentSelect} />
            </div>
            <button onClick={() => setAddingUnlisted(true)}
              style={{ padding: '0.625rem 0.875rem', backgroundColor: '#1F2937', color: '#9CA3AF', border: '1px solid #374151', borderRadius: '0.5rem', fontSize: '0.8125rem', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
              + Not listed
            </button>
          </div>
        )}

        {/* Confirm listed agent */}
        {pendingAgent && (
          <div style={{ backgroundColor: '#1F2937', border: '1px solid #2563EB', borderRadius: '0.5rem', padding: '1rem', marginTop: '0.5rem' }}>
            <p style={{ fontWeight: 600, color: 'white', marginBottom: '0.75rem', fontSize: '0.875rem' }}>Adding: {pendingAgent.name}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              <div>
                <label style={{ ...labelStyle, fontSize: '0.8125rem' }}>Role in this stack <span style={{ color: '#EF4444' }}>*</span></label>
                <input value={pendingRole} onChange={e => setPendingRole(e.target.value)}
                  placeholder="e.g. Finds and enriches prospect contacts" style={inputStyle} />
              </div>
              <div>
                <label style={{ ...labelStyle, fontSize: '0.8125rem' }}>How does it connect to the next agent?</label>
                <select value={pendingConnection} onChange={e => setPendingConnection(e.target.value)} style={inputStyle}>
                  <option value="">Select connection type...</option>
                  {CONNECTION_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={confirmAgent} disabled={!pendingRole}
                  style={{ padding: '0.5rem 1rem', backgroundColor: '#2563EB', color: 'white', border: 'none', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 600, cursor: pendingRole ? 'pointer' : 'not-allowed', opacity: pendingRole ? 1 : 0.5 }}>
                  Add to stack
                </button>
                <button onClick={() => setPendingAgent(null)}
                  style={{ padding: '0.5rem 0.875rem', backgroundColor: 'transparent', color: '#9CA3AF', border: '1px solid #374151', borderRadius: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add unlisted agent */}
        {addingUnlisted && (
          <div style={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '0.5rem', padding: '1rem', marginTop: '0.5rem' }}>
            <p style={{ fontWeight: 600, color: '#9CA3AF', marginBottom: '0.75rem', fontSize: '0.875rem' }}>Add unlisted agent</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              <div>
                <label style={{ ...labelStyle, fontSize: '0.8125rem' }}>Agent name <span style={{ color: '#EF4444' }}>*</span></label>
                <input value={unlistedName} onChange={e => setUnlistedName(e.target.value)}
                  placeholder="e.g. Clay" style={inputStyle} />
              </div>
              <div>
                <label style={{ ...labelStyle, fontSize: '0.8125rem' }}>Role in this stack <span style={{ color: '#EF4444' }}>*</span></label>
                <input value={unlistedRole} onChange={e => setUnlistedRole(e.target.value)}
                  placeholder="e.g. Enriches contact data from multiple sources" style={inputStyle} />
              </div>
              <div>
                <label style={{ ...labelStyle, fontSize: '0.8125rem' }}>How does it connect to the next agent?</label>
                <select value={unlistedConnection} onChange={e => setUnlistedConnection(e.target.value)} style={inputStyle}>
                  <option value="">Select connection type...</option>
                  {CONNECTION_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={confirmUnlisted} disabled={!unlistedName || !unlistedRole}
                  style={{ padding: '0.5rem 1rem', backgroundColor: '#2563EB', color: 'white', border: 'none', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 600, cursor: (unlistedName && unlistedRole) ? 'pointer' : 'not-allowed', opacity: (unlistedName && unlistedRole) ? 1 : 0.5 }}>
                  Add to stack
                </button>
                <button onClick={() => setAddingUnlisted(false)}
                  style={{ padding: '0.5rem 0.875rem', backgroundColor: 'transparent', color: '#9CA3AF', border: '1px solid #374151', borderRadius: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Submitter info */}
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
        <label style={labelStyle}>Your email <span style={{ color: '#EF4444' }}>*</span></label>
        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@company.com" style={inputStyle} />
        <p style={noteStyle}>Never displayed publicly. Used only for submission confirmation.</p>
      </div>

      {error && (
        <div style={{ backgroundColor: '#1F2937', border: '1px solid #EF4444', borderRadius: '0.5rem', padding: '0.75rem 1rem' }}>
          <p style={{ fontSize: '0.875rem', color: '#F87171', margin: 0 }}>{error}</p>
        </div>
      )}

      <button onClick={handleSubmit} disabled={status === 'loading'}
        style={{ width: '100%', padding: '0.875rem', backgroundColor: '#2563EB', color: 'white', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.9375rem', border: 'none', cursor: status === 'loading' ? 'not-allowed' : 'pointer', opacity: status === 'loading' ? 0.7 : 1 }}>
        {status === 'loading' ? 'Submitting...' : 'Submit stack for review →'}
      </button>
    </div>
  )
}