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

interface LastReviewed {
  reviews_reviewed_at: string
  agents_reviewed_at: string
}

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

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [authError, setAuthError] = useState('')
  const [tab, setTab] = useState<'reviews' | 'agents' | 'claims'>('reviews')
  const [reviews, setReviews] = useState<Review[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
  const [claims, setClaims] = useState<any[]>([])
  const [lastReviewed, setLastReviewed] = useState<LastReviewed | null>(null)
  const [loading, setLoading] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; type: 'review' | 'agent'; label: string } | null>(null)
  const [savedPass, setSavedPass] = useState('')

  function headers(pass: string) {
    return { 'x-admin-password': pass }
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
    const [reviewsData, agentsData, lastData, claimsData] = await Promise.all([
      res.json(),
      fetch('/api/admin/agents', { headers: headers(password) }).then(r => r.json()),
      fetch('/api/admin/last-reviewed', { headers: headers(password) }).then(r => r.json()),
      fetch('/api/admin/claims', { headers: headers(password) }).then(r => r.json()),
    ])
    setReviews(Array.isArray(reviewsData) ? reviewsData : [])
    setAgents(Array.isArray(agentsData) ? agentsData : [])
    setLastReviewed(lastData)
    setClaims(Array.isArray(claimsData) ? claimsData : [])
    setLoading(false)
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
    if (res.ok) {
      setAgents(prev => prev.map(a => a.id === id ? { ...a, is_active: true } : a))
    }
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
    if (res.ok) {
      setClaims(prev => prev.map(c => c.id === claimId ? { ...c, status: action === 'approve' ? 'approved' : 'rejected' } : c))
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

  const stats = [
    { label: 'Total reviews', value: reviews.length, highlight: newReviews.length, color: '#2563EB' },
    { label: 'Total agents', value: agents.length, highlight: newAgents.length, color: '#2563EB' },
    { label: 'Pending claims', value: pendingClaims.length, highlight: pendingClaims.length, color: '#D97706' },
  ]

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
          <a href="/" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none' }}>← Back to site</a>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {stats.map((stat) => (
            <div key={stat.label} style={{ backgroundColor: 'white', boerRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1.25rem' }}>
              <p style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '0.5rem', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>{stat.label}</p>
              <p style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827' }}>{stat.value}</p>
              {stat.highlight > 0 && (
                <p style={{ fontSize: '0.75rem', color: stat.color, marginTop: '0.25rem', fontWeight: 500 }}>+{stat.highlight} new</p>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' as const }}>
          {(['reviews', 'agents', 'claims'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding: '0.5rem 1.25rem', borderRadius: '0.5rem', border: 'none', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', backgroundColor: tab === t ? '#2563EB' : '#E5E7EB', color: tab === t ? 'white' : '#374151' }}>
              {t === 'reviews' ? 'Reviews' : t === 'agents' ? 'Agents' : 'Claims'}
              {t === 'reviews' && newReviews.length > 0 && (
                <span style={{ marginLeft: '0.5rem', backgroundColor: '#EF4444', color: 'white', borderRadius: '9999px', fontSize: '0.65rem', padding: '0.1rem 0.4rem', fontWeight: 700 }}>{newReviews.length}</span>
              )}
              {t === 'agents' && newAgents.length > 0 && (
                <span style={{ marginLeft: '0.5rem', backgroundColor: '#EF4444', color: 'white', borderRadius: '9999px', fontSize: '0.65rem', padding: '0.1rem 0.4rem', fontWeight: 700 }}>{newAgents.length}</span>
              )}
              {t === 'claims' && pendingClaims.length > 0 && (
                <span style={{ marginLeft: '0.5rem', backgroundColor: '#D97706', color: 'white', borderRadius: '9999px', fontSize: '0.65rem', padding: '0.1rem 0.4rem', fontWeight: 700 }}>{pendingClaims.length}</span>
              )}
            </button>
          ))}
          {tab !== 'claims' && (
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
                  {isNewEntry && (
                    <span style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', backgroundColor: '#DBEAFE', color: '#1D4ED8', fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '9999px', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>New</span>
                  )}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.375rem', flexWrap: 'wrap' as const }}>
                        <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827' }}>{review.reviewer_name}</span>
                        <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>{review.reviewer_email}</span>
                        <span style={{ fontSize: '0.875rem', color: '#2563EB' }}>{'★'.repeat(review.rating)}☆'.repeat(5 - review.rating)}</span>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '0.5rem' }}>
                        On: <a href={'/agents/' + review.agents?.slug} target="_blank" style={{ color: '#2563EB', textDecoration: 'none' }}>{review.agents?.name ?? review.agent_id}</a>
                        {' · '}{new Date(review.created_at).toLocaleDateString()}
                        {review.updated_at !== review.created_at && ' (edited)'}
                      </p>
                      {review.comment && <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.6 }}>{review.comment}</p>}
                    </div>
                    <button
                      onClick={() => setConfirmDelete({ id: review.id, type: 'review', label: review.comment ?? 'star rating by ' + review.reviewer_name })}
                      style={{ flexShrink: 0, padding: '0.375rem 0.875rem', backgroundColor: '#FEF2F2', color: '#EF4444', border: '1solid #FECACA', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
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
                  {isNewEntry && (
                    <span style={{ position: 'absolute', top: '0.75rem', right: '5rem', backgroundColor: '#DBEAFE', color: '#1D4ED8', fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '9999px', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>New</span>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' as const, marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827' }}>{agent.name}</span>
                        <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>by {agent.developer}</span>
                        {agent.is_featured && <span style={{ fontSize: '0.65rem', backgroundColor: '#DBEAFE', color: '#1D4ED8', padding: '0.1rem 0.4rem', borderRadius: '9999px', fontWeight: 700 }}>Featured</span>}
                        {!agent.is_active && <span style={{ fontSize: '0.65rem', backgroundColor: '#FEF3C7', color: '#D97706', padding: '0.1rem 0.4rem', borderRadius: '9999px', fontWeight: 700 }}>Pending approval</span>}
                      </div>
                      <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                        {agent.primary_category.split('-').join(' ')} · {agent.pricing_model} · Added {new Date(agent.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                      <a href={'/agents/' + agent.slug} target="_blank"
                        style={{ padding: '0.375rem 0.875rem', backgroundColor: '#F3F4F6', color: '#374151', border: '1px solid #E5E7EB', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', textDecoration: 'none' }}>
                        View
                      </a>
                      {!agent.is_active && (
                        <button onClick={() => handlpprove(agent.id)}
                          style={{ padding: '0.375rem 0.875rem', backgroundColor: '#DCFCE7', color: '#16A34A', border: '1px solid #BBF7D0', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                          Approve
                        </button>
                      )}
                      <button onClick={() => setConfirmDelete({ id: agent.id, type: 'agent', label: agent.name })}
                        style={{ padding: '0.375rem 0.875rem', backgroundColor: '#FEF2F2', color: '#EF4444', border: '1px solid #FECACA', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                        Delete
                      </button>
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
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: '9999px',
                        backgroundColor: claim.status === 'approved' ? '#DCFCE7' : claim.status === 'rejected' ? '#FEF2F2' : '#DBEAFE',
                        color: claim.status === 'approved' ? '#16A34A' : claim.status === 'rejected' ? '#EF4444' : '#1D4ED8',
                        textTransform: 'uppercase' as const }}>{claim.status}</span>
                      {claim.domain_verified && <span style={{ fontSize: '0.65rem', backgroundColor: '#DCFCE7', color: '#16A34A', padding: '0.1rem 0.4rem', borderRadius: '9999px', fontWeight: 700 }}>Domain verified</span>}
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '0.25rem' }}>
                      {claim.claimant_name} · {claim.claimant_email} · {claim.company_domain}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                      Submitted {new Date(claim.submitted_at).toLocaleDateString()}
                    </p>
                  </div>
                  {claim.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '0.5m', flexShrink: 0 }}>
                      <a href={'/agents/' + claim.agent_slug} target="_blank"
                        style={{ padding: '0.375rem 0.875rem', backgroundColor: '#F3F4F6', color: '#374151', border: '1px solid #E5E7EB', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 600, textDecoration: 'none' }}>
                        View listing
                      </a>
                      <button onClick={() => handleClaimAction(claim.id, 'approve')}
                        style={{ padding: '0.375rem 0.875rem', backgroundColor: '#DCFCE7', color: '#16A34A', border: '1px solid #BBF7D0', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                        Approve
                      </button>
                      <button onClick={() => handleClaimAction(claim.id, 'reject')}
                        style={{ padding: '0.375rem 0.875rem', backgroundColor: '#FEF2F2', color: '#EF4444', border: '1px solid #FECACA', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
