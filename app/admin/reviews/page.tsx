'use client'
import { useState } from 'react'

interface Review {
  id: string
  rating: number
  comment: string | null
  reviewer_name: string
  reviewer_email: string
  created_at: string
  updated_at: string
  agent_id: string
  agents?: { name: string; slug: string }
}

interface Agent {
  id: string
  name: string
  slug: string
  developer: string
  primary_category: string
  pricing_model: string
  is_active: boolean
  is_featured: boolean
  created_at: string
}

interface SubmissionAgent {
  type: 'listed' | 'unlisted'
  slug?: string
  name: string
  role: string
  connection: string
}

interface CommunityStack {
  id: string
  name: string
  slug: string
  tagline: string
  description: string
  workflow_goal: string
  primary_category: string
  difficulty: string
  is_active: boolean
  is_approved: boolean
  submitter_title: string | null
  submitter_company_type: string | null
  created_at: string
  submission_agents?: SubmissionAgent[]
}

interface LastReviewed {
  reviews_reviewed_at: string
  agents_reviewed_at: string
}

interface AgentOption {
  slug: string
  name: string
  short_description: string
}

const CATEGORIES = [
  { slug: 'ai-sales-agents', label: 'AI Sales Agents' },
  { slug: 'ai-customer-support-agents', label: 'AI Customer Support Agents' },
  { slug: 'ai-research-agents', label: 'AI Research Agents' },
  { slug: 'ai-marketing-agents', label: 'AI Marketing Agents' },
  { slug: 'ai-coding-agents', label: 'AI Coding Agents' },
  { slug: 'ai-hr-agents', label: 'AI HR Agents' },
]

const DIFFICULTIES = ['easy', 'moderate', 'complex']

function ConfirmDialog({ label, onConfirm, onCancel }: { label: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', maxWidth: '400px', width: '90%' }}>
        <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Delete this item?</p>
        <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '1.25rem' }}>{label}</p>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={onConfirm} style={{ flex: 1, padding: '0.625rem', backgroundColor: '#EF4444', color: 'white', border: 'none', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>Yes, delete</button>
          <button onClick={onCancel} style={{ flex: 1, padding: '0.625rem', backgroundColor: '#F3F4F6', color: '#374151', border: 'none', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

function AgentSearchInline({ onSelect }: { onSelect: (a: AgentOption) => void }) {
  const [q, setQ] = useState('')
  const [results, setResults] = useState<AgentOption[]>([])
  const [open, setOpen] = useState(false)

  const search = async (val: string) => {
    setQ(val)
    if (val.length < 2) { setResults([]); return }
    const res = await fetch('/api/agents/search?q=' + encodeURIComponent(val) + '&limit=6')
    if (res.ok) setResults(await res.json())
    setOpen(true)
  }

  return (
    <div style={{ position: 'relative' }}>
      <input value={q} onChange={e => search(e.target.value)} placeholder="Search agents..."
        style={{ width: '100%', padding: '0.375rem 0.625rem', border: '1px solid #D1D5DB', borderRadius: '0.375rem', fontSize: '0.8125rem', boxSizing: 'border-box' as const }} />
      {open && results.length > 0 && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.375rem', zIndex: 50, maxHeight: '180px', overflowY: 'auto', marginTop: '2px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          {results.map(a => (
            <button key={a.slug} onClick={() => { onSelect(a); setQ(''); setOpen(false) }}
              style={{ width: '100%', textAlign: 'left', padding: '0.5rem 0.75rem', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '0.8125rem', display: 'block' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F3F4F6')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
              <span style={{ fontWeight: 600 }}>{a.name}</span>
              <span style={{ color: '#9CA3AF', marginLeft: '0.5rem', fontSize: '0.75rem' }}>{a.short_description?.slice(0, 50)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function StackEditForm({ stack, savedPass, onSave, onCancel }: {
  stack: CommunityStack
  savedPass: string
  onSave: (updated: CommunityStack) => void
  onCancel: () => void
}) {
  const [name, setName] = useState(stack.name)
  const [tagline, setTagline] = useState(stack.tagline)
  const [description, setDescription] = useState(stack.description)
  const [difficulty, setDifficulty] = useState(stack.difficulty)
  const [category, setCategory] = useState(stack.primary_category)
  const [agents, setAgents] = useState<SubmissionAgent[]>(stack.submission_agents ?? [])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.375rem 0.625rem', border: '1px solid #D1D5DB',
    borderRadius: '0.375rem', fontSize: '0.8125rem', boxSizing: 'border-box', fontFamily: 'inherit',
  }

  const swapAgent = (i: number, newAgent: AgentOption) => {
    setAgents(prev => prev.map((a, idx) => idx === i ? { ...a, type: 'listed', slug: newAgent.slug, name: newAgent.name } : a))
  }

  const updateAgentField = (i: number, field: keyof SubmissionAgent, value: string) => {
    setAgents(prev => prev.map((a, idx) => idx === i ? { ...a, [field]: value } : a))
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

  const handleSave = async () => {
    setSaving(true)
    setError('')
    const res = await fetch('/api/admin/stacks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': savedPass },
      body: JSON.stringify({ id: stack.id, name, tagline, description, difficulty, primary_category: category, submission_agents: agents }),
    })
    if (res.ok) {
      onSave({ ...stack, name, tagline, description, difficulty, primary_category: category, submission_agents: agents })
    } else {
      setError('Save failed. Please try again.')
    }
    setSaving(false)
  }

  return (
    <div style={{ marginTop: '1rem', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.25rem' }}>
      <p style={{ fontWeight: 700, fontSize: '0.875rem', color: '#111827', marginBottom: '1rem' }}>Edit stack</p>

      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.75rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.25rem' }}>Name</label>
            <input value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.25rem' }}>Tagline</label>
            <input value={tagline} onChange={e => setTagline(e.target.value)} style={inputStyle} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.25rem' }}>Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} style={inputStyle}>
              {CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.25rem' }}>Difficulty</label>
            <select value={difficulty} onChange={e => setDifficulty(e.target.value)} style={inputStyle}>
              {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.25rem' }}>Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
            style={{ ...inputStyle, resize: 'vertical' as const }} />
        </div>

        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.5rem' }}>Agents</label>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.5rem' }}>
            {agents.map((a, i) => (
              <div key={i} style={{ backgroundColor: a.type === 'unlisted' ? '#FFFBEB' : 'white', border: `1px solid ${a.type === 'unlisted' ? '#FCD34D' : '#E5E7EB'}`, borderRadius: '0.5rem', padding: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' as const }}>
                  <div style={{ width: '1.25rem', height: '1.25rem', backgroundColor: '#EFF6FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.6875rem', fontWeight: 700, color: '#2563EB' }}>{i + 1}</div>
                  <span style={{ fontWeight: 600, fontSize: '0.8125rem', color: '#111827' }}>{a.name}</span>
                  {a.type === 'unlisted' && <span style={{ fontSize: '0.6875rem', backgroundColor: '#FEF3C7', color: '#D97706', padding: '0.1rem 0.375rem', borderRadius: '0.25rem', fontWeight: 600 }}>NOT IN DIRECTORY</span>}
                  {a.type === 'listed' && a.slug && <span style={{ fontSize: '0.6875rem', backgroundColor: '#DCFCE7', color: '#16A34A', padding: '0.1rem 0.375rem', borderRadius: '0.25rem', fontWeight: 600 }}>✓ Listed</span>}
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.25rem' }}>
                    <button onClick={() => moveUp(i)} disabled={i === 0} style={{ padding: '0.125rem 0.375rem', fontSize: '0.75rem', border: '1px solid #E5E7EB', borderRadius: '0.25rem', backgroundColor: 'white', cursor: i === 0 ? 'default' : 'pointer', color: i === 0 ? '#D1D5DB' : '#374151' }}>↑</button>
                    <button onClick={() => moveDown(i)} disabled={i === agents.length - 1} style={{ padding: '0.125rem 0.375rem', fontSize: '0.75rem', border: '1px solid #E5E7EB', borderRadius: '0.25rem', backgroundColor: 'white', cursor: i === agents.length - 1 ? 'default' : 'pointer', color: i === agents.length - 1 ? '#D1D5DB' : '#374151' }}>↓</button>
                    <button onClick={() => removeAgent(i)} style={{ padding: '0.125rem 0.375rem', fontSize: '0.75rem', border: '1px solid #FECACA', borderRadius: '0.25rem', backgroundColor: '#FEF2F2', cursor: 'pointer', color: '#EF4444' }}>✕</button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <div>
                    <label style={{ fontSize: '0.6875rem', color: '#6B7280', display: 'block', marginBottom: '0.125rem' }}>Role in stack</label>
                    <input value={a.role} onChange={e => updateAgentField(i, 'role', e.target.value)} style={{ ...inputStyle, fontSize: '0.75rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.6875rem', color: '#6B7280', display: 'block', marginBottom: '0.125rem' }}>Connection</label>
                    <input value={a.connection} onChange={e => updateAgentField(i, 'connection', e.target.value)} style={{ ...inputStyle, fontSize: '0.75rem' }} />
                  </div>
                </div>

                {a.type === 'unlisted' && (
                  <div>
                    <label style={{ fontSize: '0.6875rem', color: '#D97706', display: 'block', marginBottom: '0.25rem', fontWeight: 600 }}>Replace with listed agent:</label>
                    <AgentSearchInline onSelect={agent => swapAgent(i, agent)} />
                  </div>
                )}
              </div>
            ))}
          </div>

{/* Add new agent */}
<div style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.5rem', padding: '0.75rem' }}>
  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Add agent to stack</p>
  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
    <div style={{ flex: 1 }}>
      <AgentSearchInline onSelect={(agent) => {
        setAgents(prev => [...prev, { type: 'listed', slug: agent.slug, name: agent.name, role: '', connection: '' }])
      }} />
    </div>
    <button
      onClick={() => setAgents(prev => [...prev, { type: 'unlisted', name: '', role: '', connection: '' }])}
      style={{ padding: '0.375rem 0.75rem', backgroundColor: '#1F2937', color: '#9CA3AF', border: '1px solid #374151', borderRadius: '0.375rem', fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap' as const, flexShrink: 0 }}>
      + Unlisted
    </button>
  </div>
</div>
</div>

{error && <p style={{ fontSize: '0.8125rem', color: '#EF4444' }}>{error}</p>}

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={handleSave} disabled={saving}
            style={{ padding: '0.5rem 1.125rem', backgroundColor: '#2563EB', color: 'white', border: 'none', borderRadius: '0.5rem', fontSize: '0.8125rem', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Saving...' : 'Save changes'}
          </button>
          <button onClick={onCancel}
            style={{ padding: '0.5rem 0.875rem', backgroundColor: 'white', color: '#6B7280', border: '1px solid #E5E7EB', borderRadius: '0.5rem', fontSize: '0.8125rem', cursor: 'pointer' }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [authError, setAuthError] = useState('')
  const [tab, setTab] = useState<'reviews' | 'agents' | 'claims' | 'edits' | 'stacks'>('reviews')
  const [reviews, setReviews] = useState<Review[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
  const [claims, setClaims] = useState<any[]>([])
  const [editRequests, setEditRequests] = useState<any[]>([])
  const [communityStacks, setCommunityStacks] = useState<CommunityStack[]>([])
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({})
  const [stackComments, setStackComments] = useState<Record<string, string>>({})
  const [editingStackId, setEditingStackId] = useState<string | null>(null)
  const [lastReviewed, setLastReviewed] = useState<LastReviewed | null>(null)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; type: 'review' | 'agent'; label: string } | null>(null)
  const [savedPass, setSavedPass] = useState('')

  function headers(pass: string) {
    return { 'x-admin-password': pass }
  }

  async function loadAllData(pass: string) {
    const [reviewsData, agentsData, lastData, claimsData, editsData, stacksData] = await Promise.all([
      fetch('/api/admin/reviews', { headers: headers(pass) }).then(r => r.json()),
      fetch('/api/admin/agents', { headers: headers(pass) }).then(r => r.json()),
      fetch('/api/admin/last-reviewed', { headers: headers(pass) }).then(r => r.json()),
      fetch('/api/admin/claims', { headers: headers(pass) }).then(r => r.json()),
      fetch('/api/admin/edit-requests', { headers: headers(pass) }).then(r => r.json()),
      fetch('/api/admin/stacks', { headers: headers(pass) }).then(r => r.json()),
    ])
    setReviews(Array.isArray(reviewsData) ? reviewsData : [])
    setAgents(Array.isArray(agentsData) ? agentsData : [])
    setLastReviewed(lastData)
    setClaims(Array.isArray(claimsData) ? claimsData : [])
    setEditRequests(Array.isArray(editsData) ? editsData : [])
    setCommunityStacks(Array.isArray(stacksData) ? stacksData : [])
  }

  async function handleLogin() {
    setLoading(true)
    const res = await fetch('/api/admin/reviews', { headers: headers(password) })
    if (res.status === 401) {
      setAuthError('Incorrect password.')
      setLoading(false)
      return
    }
    setSavedPass(password)
    setAuthed(true)
    await loadAllData(password)
    setLoading(false)
  }

  async function handleRefresh() {
    setRefreshing(true)
    await loadAllData(savedPass)
    setRefreshing(false)
  }

  async function handleDelete(id: string, type: 'review' | 'agent') {
    await fetch('/api/admin/reviews?id=' + id + '&type=' + type, { method: 'DELETE', headers: headers(savedPass) })
    if (type === 'review') setReviews(prev => prev.filter(r => r.id !== id))
    else setAgents(prev => prev.filter(a => a.id !== id))
    setConfirmDelete(null)
  }

  async function handleApprove(id: string) {
    const res = await fetch('/api/admin/approve-agent', {
      method: 'POST',
      headers: { ...headers(savedPass), 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    if (res.ok) setAgents(prev => prev.map(a => a.id === id ? { ...a, is_active: true } : a))
  }

  async function handleMarkReviewed(type: 'reviews' | 'agents') {
    await fetch('/api/admin/last-reviewed', {
      method: 'POST',
      headers: { ...headers(savedPass), 'Content-Type': 'application/json' },
      body: JSON.stringify({ type }),
    })
    const updated = await fetch('/api/admin/last-reviewed', { headers: headers(savedPass) }).then(r => r.json())
    setLastReviewed(updated)
  }

  async function handleClaimAction(claimId: string, action: 'approve' | 'reject') {
    const res = await fetch('/api/admin/claims', {
      method: 'POST',
      headers: { ...headers(savedPass), 'Content-Type': 'application/json' },
      body: JSON.stringify({ claim_id: claimId, action }),
    })
    if (res.ok) setClaims(prev => prev.map(c => c.id === claimId ? { ...c, status: action === 'approve' ? 'approved' : 'rejected' } : c))
  }

  async function handleEditAction(editId: string, action: 'approve' | 'reject') {
    const notes = adminNotes[editId] ?? ''
    const res = await fetch('/api/admin/edit-requests', {
      method: 'POST',
      headers: { ...headers(savedPass), 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editId, action, admin_notes: notes }),
    })
    if (res.ok) setEditRequests(prev => prev.map(e => e.id === editId ? { ...e, status: action === 'approve' ? 'approved' : 'rejected' } : e))
  }

  async function handleStackAction(stackId: string, action: 'approve' | 'reject' | 'delete') {
    const comment = stackComments[stackId] ?? ''
    const res = await fetch('/api/admin/stacks', {
      method: 'POST',
      headers: { ...headers(savedPass), 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: stackId, action, comment }),
    })
    if (res.ok) {
      if (action === 'delete') {
        setCommunityStacks(prev => prev.filter(s => s.id !== stackId))
      } else if (action === 'approve') {
        setCommunityStacks(prev => prev.map(s => s.id === stackId ? { ...s, is_active: true, is_approved: true } : s))
      } else {
        setCommunityStacks(prev => prev.filter(s => s.id !== stackId))
      }
    }
  }

  function isNew(createdAt: string, type: 'reviews' | 'agents') {
    if (!lastReviewed) return true
    const threshold = type === 'reviews' ? lastReviewed.reviews_reviewed_at : lastReviewed.agents_reviewed_at
    return new Date(createdAt) > new Date(threshold)
  }

  const newReviews = reviews.filter(r => isNew(r.created_at, 'reviews'))
  const newAgents = agents.filter(a => isNew(a.created_at, 'agents'))
  const pendingClaims = claims.filter(c => c.status === 'pending')
  const pendingEdits = editRequests.filter(e => e.status === 'pending')
  const pendingStacks = communityStacks.filter(s => !s.is_approved)

  const stats = [
    { label: 'Total reviews', value: reviews.length, highlight: newReviews.length, color: '#2563EB' },
    { label: 'Total agents', value: agents.length, highlight: newAgents.length, color: '#2563EB' },
    { label: 'Pending claims', value: pendingClaims.length, highlight: pendingClaims.length, color: '#D97706' },
    { label: 'Pending edits', value: pendingEdits.length, highlight: pendingEdits.length, color: '#7C3AED' },
    { label: 'Pending stacks', value: pendingStacks.length, highlight: pendingStacks.length, color: '#059669' },
  ]

  if (!authed) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9FAFB' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '2rem', width: '100%', maxWidth: '360px' }}>
        <h1 style={{ fontWeight: 700, fontSize: '1.125rem', color: '#111827', marginBottom: '1.25rem' }}>Admin login</h1>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          placeholder="Password"
          style={{ width: '100%', padding: '0.625rem 0.875rem', border: '1px solid #D1D5DB', borderRadius: '0.5rem', fontSize: '0.9375rem', marginBottom: '0.75rem', boxSizing: 'border-box' as const }} />
        {authError && <p style={{ color: '#EF4444', fontSize: '0.8125rem', marginBottom: '0.75rem' }}>{authError}</p>}
        <button onClick={handleLogin} disabled={loading}
          style={{ width: '100%', padding: '0.625rem', backgroundColor: '#2563EB', color: 'white', border: 'none', borderRadius: '0.5rem', fontSize: '0.9375rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      {confirmDelete && (
        <ConfirmDialog
          label={confirmDelete.label}
          onConfirm={() => handleDelete(confirmDelete.id, confirmDelete.type)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <h1 style={{ fontWeight: 700, fontSize: '1.375rem', color: '#111827' }}>Admin</h1>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button onClick={handleRefresh} disabled={refreshing}
              style={{ fontSize: '0.8125rem', color: '#2563EB', backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '0.5rem', padding: '0.375rem 0.875rem', cursor: refreshing ? 'wait' : 'pointer', fontWeight: 600 }}>
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <a href="/" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none' }}>← Back to site</a>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {stats.map((stat) => (
            <div key={stat.label} style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1.25rem' }}>
              <p style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '0.5rem', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>{stat.label}</p>
              <p style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827' }}>{stat.value}</p>
              {stat.highlight > 0 && (
                <p style={{ fontSize: '0.75rem', color: stat.color, marginTop: '0.25rem', fontWeight: 500 }}>+{stat.highlight} new</p>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' as const }}>
          {(['reviews', 'agents', 'claims', 'edits', 'stacks'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding: '0.5rem 1.25rem', borderRadius: '0.5rem', border: 'none', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', backgroundColor: tab === t ? '#2563EB' : '#E5E7EB', color: tab === t ? 'white' : '#374151' }}>
              {t === 'reviews' ? 'Reviews' : t === 'agents' ? 'Agents' : t === 'claims' ? 'Claims' : t === 'edits' ? 'Edit Requests' : 'Community Stacks'}
              {t === 'reviews' && newReviews.length > 0 && <span style={{ marginLeft: '0.5rem', backgroundColor: '#EF4444', color: 'white', borderRadius: '9999px', fontSize: '0.65rem', padding: '0.1rem 0.4rem', fontWeight: 700 }}>{newReviews.length}</span>}
              {t === 'agents' && newAgents.length > 0 && <span style={{ marginLeft: '0.5rem', backgroundColor: '#EF4444', color: 'white', borderRadius: '9999px', fontSize: '0.65rem', padding: '0.1rem 0.4rem', fontWeight: 700 }}>{newAgents.length}</span>}
              {t === 'claims' && pendingClaims.length > 0 && <span style={{ marginLeft: '0.5rem', backgroundColor: '#D97706', color: 'white', borderRadius: '9999px', fontSize: '0.65rem', padding: '0.1rem 0.4rem', fontWeight: 700 }}>{pendingClaims.length}</span>}
              {t === 'edits' && pendingEdits.length > 0 && <span style={{ marginLeft: '0.5rem', backgroundColor: '#7C3AED', color: 'white', borderRadius: '9999px', fontSize: '0.65rem', padding: '0.1rem 0.4rem', fontWeight: 700 }}>{pendingEdits.length}</span>}
              {t === 'stacks' && pendingStacks.length > 0 && <span style={{ marginLeft: '0.5rem', backgroundColor: '#059669', color: 'white', borderRadius: '9999px', fontSize: '0.65rem', padding: '0.1rem 0.4rem', fontWeight: 700 }}>{pendingStacks.length}</span>}
            </button>
          ))}
          {(tab === 'reviews' || tab === 'agents') && (
            <button onClick={() => handleMarkReviewed(tab as 'reviews' | 'agents')}
              style={{ marginLeft: 'auto', padding: '0.5rem 1.25rem', borderRadius: '0.5rem', border: '1px solid #E5E7EB', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', backgroundColor: 'white', color: '#374151' }}>
              Mark all {tab} as reviewed
            </button>
          )}
        </div>

        {tab === 'reviews' && (
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.75rem' }}>
            {reviews.length === 0 && <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>No reviews yet.</p>}
            {reviews.map((review) => {
              const isNewEntry = isNew(review.created_at, 'reviews')
              return (
                <div key={review.id} style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: isNewEntry ? '2px solid #2563EB' : '1px solid #E5E7EB', padding: '1.25rem', position: 'relative' }}>
                  {isNewEntry && <span style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', backgroundColor: '#DBEAFE', color: '#1D4ED8', fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '9999px', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>New</span>}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.375rem', flexWrap: 'wrap' as const }}>
                        <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827' }}>{review.reviewer_name}</span>
                        <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>{review.reviewer_email}</span>
                        <span style={{ fontSize: '0.875rem', color: '#2563EB' }}>{('★'.repeat(review.rating) + '☆'.repeat(5 - review.rating))}</span>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '0.5rem' }}>
                        On: <a href={'/agents/' + review.agents?.slug} target="_blank" style={{ color: '#2563EB', textDecoration: 'none' }}>{review.agents?.name ?? review.agent_id}</a>
                        {' · '}{new Date(review.created_at).toLocaleDateString()}
                      </p>
                      {review.comment && <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.5 }}>{review.comment}</p>}
                    </div>
                    <button onClick={() => setConfirmDelete({ id: review.id, type: 'review', label: review.comment ?? 'star rating by ' + review.reviewer_name })}
                      style={{ flexShrink: 0, padding: '0.375rem 0.875rem', backgroundColor: '#FEF2F2', color: '#EF4444', border: '1px solid #FECACA', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                      Delete
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {tab === 'agents' && (
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.75rem' }}>
            {agents.length === 0 && <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>No agents yet.</p>}
            {agents.map((agent) => {
              const isNewEntry = isNew(agent.created_at, 'agents')
              return (
                <div key={agent.id} style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: isNewEntry ? '2px solid #2563EB' : '1px solid #E5E7EB', padding: '1.25rem', position: 'relative', opacity: agent.is_active ? 1 : 0.7 }}>
                  {isNewEntry && <span style={{ position: 'absolute', top: '0.75rem', right: '5rem', backgroundColor: '#DBEAFE', color: '#1D4ED8', fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '9999px', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>New</span>}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' as const, marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827' }}>{agent.name}</span>
                        <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>by {agent.developer}</span>
                        {agent.is_featured && <span style={{ fontSize: '0.65rem', backgroundColor: '#DBEAFE', color: '#1D4ED8', padding: '0.1rem 0.4rem', borderRadius: '9999px', fontWeight: 700 }}>Featured</span>}
                        {!agent.is_active && <span style={{ fontSize: '0.65rem', backgroundColor: '#FEF3C7', color: '#D97706', padding: '0.1rem 0.4rem', borderRadius: '9999px', fontWeight: 700 }}>Pending approval</span>}
                      </div>
                      <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>{agent.primary_category} · {agent.pricing_model} · {new Date(agent.created_at).toLocaleDateString()}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                      <a href={'/agents/' + agent.slug} target="_blank" style={{ padding: '0.375rem 0.875rem', backgroundColor: '#F3F4F6', color: '#374151', border: '1px solid #E5E7EB', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 600, textDecoration: 'none' }}>View</a>
                      {!agent.is_active && <button onClick={() => handleApprove(agent.id)} style={{ padding: '0.375rem 0.875rem', backgroundColor: '#DCFCE7', color: '#16A34A', border: '1px solid #BBF7D0', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Approve</button>}
                      <button onClick={() => setConfirmDelete({ id: agent.id, type: 'agent', label: agent.name })} style={{ padding: '0.375rem 0.875rem', backgroundColor: '#FEF2F2', color: '#EF4444', border: '1px solid #FECACA', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Delete</button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {tab === 'claims' && (
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.75rem' }}>
            {claims.length === 0 && <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>No claims yet.</p>}
            {claims.map((claim: any) => (
              <div key={claim.id} style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: claim.status === 'pending' ? '2px solid #2563EB' : '1px solid #E5E7EB', padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' as const }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.375rem', flexWrap: 'wrap' as const }}>
                      <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827' }}>{claim.agent_name}</span>
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: '9999px', backgroundColor: claim.status === 'approved' ? '#DCFCE7' : claim.status === 'rejected' ? '#FEF2F2' : '#DBEAFE', color: claim.status === 'approved' ? '#16A34A' : claim.status === 'rejected' ? '#EF4444' : '#1D4ED8', textTransform: 'uppercase' as const }}>{claim.status}</span>
                      {claim.domain_verified && <span style={{ fontSize: '0.65rem', backgroundColor: '#DCFCE7', color: '#16A34A', padding: '0.1rem 0.4rem', borderRadius: '9999px', fontWeight: 700 }}>Domain verified</span>}
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '0.25rem' }}>{claim.claimant_name} · {claim.claimant_email} · {claim.company_domain}</p>
                    <p style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Submitted {new Date(claim.created_at).toLocaleDateString()}</p>
                  </div>
                  {claim.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                      <a href={'/agents/' + claim.agent_slug} target="_blank" style={{ padding: '0.375rem 0.875rem', backgroundColor: '#F3F4F6', color: '#374151', border: '1px solid #E5E7EB', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 600, textDecoration: 'none' }}>View listing</a>
                      <button onClick={() => handleClaimAction(claim.id, 'approve')} style={{ padding: '0.375rem 0.875rem', backgroundColor: '#DCFCE7', color: '#16A34A', border: '1px solid #BBF7D0', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Approve</button>
                      <button onClick={() => handleClaimAction(claim.id, 'reject')} style={{ padding: '0.375rem 0.875rem', backgroundColor: '#FEF2F2', color: '#EF4444', border: '1px solid #FECACA', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Reject</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'edits' && (
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.75rem' }}>
            {editRequests.length === 0 && <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>No edit requests yet.</p>}
            {editRequests.map((req: any) => (
              <div key={req.id} style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: req.status === 'pending' ? '2px solid #7C3AED' : '1px solid #E5E7EB', padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' as const, marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem', flexWrap: 'wrap' as const }}>
                      <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827' }}>{req.agent_name}</span>
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: '9999px', textTransform: 'uppercase' as const, backgroundColor: req.status === 'approved' ? '#DCFCE7' : req.status === 'rejected' ? '#FEF2F2' : '#EDE9FE', color: req.status === 'approved' ? '#16A34A' : req.status === 'rejected' ? '#EF4444' : '#7C3AED' }}>{req.status}</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>{req.claimant_email} · {new Date(req.submitted_at).toLocaleDateString()}</p>
                  </div>
                  <a href={'/agents/' + req.agent_slug} target="_blank" style={{ fontSize: '0.75rem', color: '#2563EB', textDecoration: 'none' }}>View listing</a>
                </div>
                {req.vendor_notes && (
                  <div style={{ backgroundColor: '#F5F3FF', border: '1px solid #DDD6FE', borderRadius: '0.5rem', padding: '0.75rem', marginBottom: '0.75rem' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#7C3AED', marginBottom: '0.25rem' }}>Vendor notes</p>
                    <p style={{ fontSize: '0.875rem', color: '#374151' }}>{req.vendor_notes}</p>
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  {['name', 'pricing_model', 'starting_price', 'customer_segment', 'deployment_difficulty'].map((field: string) =>
                    req[field] != null ? (
                      <div key={field} style={{ backgroundColor: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: '0.375rem', padding: '0.5rem 0.75rem' }}>
                        <span style={{ color: '#92400E', fontSize: '0.7rem', textTransform: 'uppercase' as const, fontWeight: 600 }}>Changed: {field.replace(/_/g, ' ')}</span>
                        <p style={{ color: '#111827', fontWeight: 500, marginTop: '0.125rem', fontSize: '0.8125rem' }}>{String(req[field])}</p>
                      </div>
                    ) : null
                  )}
                  {['deployment_method', 'integrations', 'capability_tags', 'industry_tags', 'supported_languages', 'security_certifications'].map((field: string) =>
                    req[field] && req[field].length > 0 ? (
                      <div key={field} style={{ backgroundColor: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: '0.375rem', padding: '0.5rem 0.75rem' }}>
                        <span style={{ color: '#92400E', fontSize: '0.7rem', textTransform: 'uppercase' as const, fontWeight: 600 }}>Changed: {field.replace(/_/g, ' ')}</span>
                        <p style={{ color: '#111827', fontWeight: 500, marginTop: '0.125rem', fontSize: '0.75rem' }}>{req[field].join(', ')}</p>
                      </div>
                    ) : null
                  )}
                </div>
                {req.status === 'pending' && (
                  <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '0.75rem' }}>
                    <textarea value={adminNotes[req.id] ?? ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAdminNotes(prev => ({ ...prev, [req.id]: e.target.value }))} placeholder="Add a note to the vendor (optional)..." rows={2}
                      style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #D1D5DB', borderRadius: '0.5rem', fontSize: '0.8125rem', boxSizing: 'border-box' as const, resize: 'vertical' as const, marginBottom: '0.5rem' }} />
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleEditAction(req.id, 'approve')} style={{ padding: '0.375rem 0.875rem', backgroundColor: '#DCFCE7', color: '#16A34A', border: '1px solid #BBF7D0', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Approve</button>
                      <button onClick={() => handleEditAction(req.id, 'reject')} style={{ padding: '0.375rem 0.875rem', backgroundColor: '#FEF2F2', color: '#EF4444', border: '1px solid #FECACA', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Reject</button>
                    </div>
                  </div>
                )}
                {req.admin_notes && (
                  <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '0.5rem', padding: '0.75rem', marginTop: '0.5rem' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#16A34A', marginBottom: '0.25rem' }}>Your note to vendor</p>
                    <p style={{ fontSize: '0.875rem', color: '#374151' }}>{req.admin_notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === 'stacks' && (
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.75rem' }}>
            {communityStacks.length === 0 && <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>No community stack submissions yet.</p>}
            {communityStacks.map((stack) => (
              <div key={stack.id} style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: !stack.is_approved ? '2px solid #059669' : '1px solid #E5E7EB', padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' as const }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.375rem', flexWrap: 'wrap' as const }}>
                      <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827' }}>{stack.name}</span>
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: '9999px', textTransform: 'uppercase' as const,
                        backgroundColor: stack.is_approved ? '#DCFCE7' : '#ECFDF5',
                        color: stack.is_approved ? '#16A34A' : '#059669' }}>
                        {stack.is_approved ? 'Approved' : 'Pending'}
                      </span>
                      <span style={{ fontSize: '0.65rem', color: '#6B7280', backgroundColor: '#F3F4F6', padding: '0.1rem 0.4rem', borderRadius: '9999px' }}>{stack.difficulty}</span>
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: '#374151', marginBottom: '0.375rem' }}>{stack.tagline}</p>
                    <p style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '0.25rem' }}>Goal: {stack.workflow_goal}</p>
                    <p style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                      {stack.submitter_title && `${stack.submitter_title}`}
                      {stack.submitter_company_type && ` · ${stack.submitter_company_type}`}
                      {' · '}{new Date(stack.created_at).toLocaleDateString()}
                    </p>

                    {stack.submission_agents && stack.submission_agents.length > 0 && (
                      <div style={{ marginTop: '0.75rem' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>Agents in stack</p>
                        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.375rem' }}>
                          {stack.submission_agents.map((a, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', backgroundColor: a.type === 'unlisted' ? '#FFFBEB' : '#F9FAFB', border: `1px solid ${a.type === 'unlisted' ? '#FCD34D' : '#E5E7EB'}`, borderRadius: '0.5rem', padding: '0.5rem 0.75rem' }}>
                              <div style={{ width: '1.25rem', height: '1.25rem', backgroundColor: '#EFF6FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.6875rem', fontWeight: 700, color: '#2563EB' }}>{i + 1}</div>
                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' as const }}>
                                  <span style={{ fontWeight: 600, fontSize: '0.8125rem', color: '#111827' }}>{a.name}</span>
                                  {a.type === 'unlisted' && <span style={{ fontSize: '0.6875rem', backgroundColor: '#FEF3C7', color: '#D97706', padding: '0.1rem 0.375rem', borderRadius: '0.25rem', fontWeight: 600 }}>NOT IN DIRECTORY</span>}
                                  {a.type === 'listed' && <span style={{ fontSize: '0.6875rem', backgroundColor: '#DCFCE7', color: '#16A34A', padding: '0.1rem 0.375rem', borderRadius: '0.25rem', fontWeight: 600 }}>✓ Listed</span>}
                                  {a.slug && <a href={`/agents/${a.slug}`} target="_blank" style={{ fontSize: '0.6875rem', color: '#2563EB', textDecoration: 'none' }}>view →</a>}
                                </div>
                                <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: '0.125rem 0 0' }}>{a.role}{a.connection ? ` · ${a.connection}` : ''}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0, flexDirection: 'column' as const, alignItems: 'flex-end' }}>
                    {!stack.is_approved && (
                      <button onClick={() => setEditingStackId(editingStackId === stack.id ? null : stack.id)}
                        style={{ padding: '0.375rem 0.875rem', backgroundColor: editingStackId === stack.id ? '#EFF6FF' : '#F3F4F6', color: editingStackId === stack.id ? '#2563EB' : '#374151', border: `1px solid ${editingStackId === stack.id ? '#BFDBFE' : '#E5E7EB'}`, borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                        {editingStackId === stack.id ? 'Cancel edit' : 'Edit'}
                      </button>
                    )}
                    {stack.is_approved && (
                      <button onClick={() => handleStackAction(stack.id, 'delete')}
                        style={{ padding: '0.375rem 0.875rem', backgroundColor: '#FEF2F2', color: '#EF4444', border: '1px solid #FECACA', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                        Delete
                      </button>
                    )}
                  </div>
                </div>

                {editingStackId === stack.id && (
                  <StackEditForm
                    stack={stack}
                    savedPass={savedPass}
                    onSave={(updated) => {
                      setCommunityStacks(prev => prev.map(s => s.id === updated.id ? updated : s))
                      setEditingStackId(null)
                    }}
                    onCancel={() => setEditingStackId(null)}
                  />
                )}

                {!stack.is_approved && editingStackId !== stack.id && (
                  <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '0.75rem', marginTop: '0.75rem' }}>
                    <textarea
                      value={stackComments[stack.id] ?? ''}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setStackComments(prev => ({ ...prev, [stack.id]: e.target.value }))}
                      placeholder="Optional note to submitter (included in approval/rejection email)..."
                      rows={2}
                      style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #D1D5DB', borderRadius: '0.5rem', fontSize: '0.8125rem', boxSizing: 'border-box' as const, resize: 'vertical' as const, marginBottom: '0.5rem', fontFamily: 'inherit' }}
                    />
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      {stack.submission_agents?.some(a => a.type === 'unlisted') && (
                        <span style={{ fontSize: '0.75rem', color: '#D97706', backgroundColor: '#FEF3C7', padding: '0.25rem 0.625rem', borderRadius: '0.375rem', fontWeight: 500 }}>
                          ⚠ {stack.submission_agents.filter(a => a.type === 'unlisted').length} unlisted agent{stack.submission_agents.filter(a => a.type === 'unlisted').length > 1 ? 's' : ''} — edit before approving
                        </span>
                      )}
                      <button onClick={() => handleStackAction(stack.id, 'approve')}
                        style={{ padding: '0.375rem 0.875rem', backgroundColor: '#DCFCE7', color: '#16A34A', border: '1px solid #BBF7D0', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                        Approve
                      </button>
                      <button onClick={() => handleStackAction(stack.id, 'reject')}
                        style={{ padding: '0.375rem 0.875rem', backgroundColor: '#FEF2F2', color: '#EF4444', border: '1px solid #FECACA', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                        Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}