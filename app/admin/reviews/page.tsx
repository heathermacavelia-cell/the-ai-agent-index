'use client'
import { useState, useEffect } from 'react'

interface Review {
  id: string
  rating: number
  comment: string | null
  reviewer_name: string
  reviewer_email: string
  created_at: string
  updated_at: string
  is_approved: boolean
  agent_id: string
  agents: { name: string; slug: string } | null
}

interface Agent {
  id: string
  name: string
  slug: string
  developer: string
  primary_category: string
  pricing_model: string
  created_at: string
  is_active: boolean
  is_featured: boolean
  is_verified: boolean
}

interface LastReviewed {
  reviews_reviewed_at: string
  agents_reviewed_at: string
}

const ADMIN_PASS_KEY = 'admin_password'

function ConfirmModal({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', maxWidth: '400px', width: '100%', boxShadow: '0 25px 50px rgba(0,0,0,0.2)' }}>
        <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#111827', marginBottom: '0.75rem' }}>Are you sure?</h3>
        <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '1.5rem', lineHeight: 1.6 }}>{message}</p>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={onConfirm}
            style={{ flex: 1, padding: '0.625rem', backgroundColor: '#EF4444', color: 'white', border: 'none', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
            Yes, delete
          </button>
          <button onClick={onCancel}
            style={{ flex: 1, padding: '0.625rem', backgroundColor: '#F3F4F6', color: '#374151', border: 'none', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
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
  const [tab, setTab] = useState<'reviews' | 'agents'>('reviews')
  const [reviews, setReviews] = useState<Review[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
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
    const [reviewsData, agentsData, lastData] = await Promise.all([
      res.json(),
      fetch('/api/admin/agents', { headers: headers(password) }).then(r => r.json()),
      fetch('/api/admin/last-reviewed', { headers: headers(password) }).then(r => r.json()),
    ])
    setReviews(Array.isArray(reviewsData) ? reviewsData : [])
    setAgents(Array.isArray(agentsData) ? agentsData : [])
    setLastReviewed(lastData)
    setLoading(false)
  }

  async function handleDelete(id: string, type: 'review' | 'agent') {
    await fetch('/api/admin/reviews?id=' + id + '&type=' + type, { method: 'DELETE', headers: headers(savedPass) })
    if (type === 'review') setReviews(prev => prev.filter(r => r.id !== id))
    else setAgents(prev => prev.filter(a => a.id !== id))
    setConfirmDelete(null)
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

  function isNew(createdAt: string, type: 'reviews' | 'agents') {
    if (!lastReviewed) return true
    const threshold = type === 'reviews' ? lastReviewed.reviews_reviewed_at : lastReviewed.agents_reviewed_at
    return new Date(createdAt) > new Date(threshold)
  }

  const newReviews = reviews.filter(r => isNew(r.created_at, 'reviews'))
  const newAgents = agents.filter(a => isNew(a.created_at, 'agents'))

  if (!authed) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2.5rem', width: '100%', maxWidth: '380px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <div style={{ width: '2rem', height: '2rem', backgroundColor: '#2563EB', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L12.5 4V10L7 13L1.5 10V4L7 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <circle cx="7" cy="7" r="1.5" fill="white"/>
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827' }}>AI Agent Index — Admin</span>
        </div>
        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: '#4B5563', marginBottom: '0.5rem' }}>Admin password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleLogin() }}
          placeholder="Enter password"
          style={{ width: '100%', padding: '0.625rem 0.75rem', border: authError ? '1px solid #EF4444' : '1px solid #E5E7EB', borderRadius: '0.5rem', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box', marginBottom: '0.5rem' }}
        />
        {authError && <p style={{ fontSize: '0.75rem', color: '#EF4444', marginBottom: '0.75rem' }}>{authError}</p>}
        <button onClick={handleLogin} disabled={loading}
          style={{ width: '100%', padding: '0.625rem', backgroundColor: '#2563EB', color: 'white', border: 'none', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem' }}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      {confirmDelete && (
        <ConfirmModal
          message={`This will permanently delete this ${confirmDelete.type}: "${confirmDelete.label}". This cannot be undone.`}
          onConfirm={() => handleDelete(confirmDelete.id, confirmDelete.type)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      <div style={{ backgroundColor: '#030712', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '1.75rem', height: '1.75rem', backgroundColor: '#2563EB', borderRadius: '0.375rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L12.5 4V10L7 13L1.5 10V4L7 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <circle cx="7" cy="7" r="1.5" fill="white"/>
            </svg>
          </div>
          <span style={{ color: 'white', fontWeight: 600, fontSize: '0.875rem' }}>Admin Dashboard</span>
        </div>
        <a href="/" style={{ color: '#6B7280', fontSize: '0.75rem', textDecoration: 'none' }}>← Back to site</a>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Total reviews', value: reviews.length, highlight: newReviews.length, color: '#2563EB' },
            { label: 'Total agents', value: agents.filter(a => a.is_active).length, highlight: newAgents.length, color: '#059669' },
            { label: 'Newsletter subs', value: '—', highlight: 0, color: '#7C3AED' },
          ].map((stat) => (
            <div key={stat.label} style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1.25rem' }}>
              <p style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</p>
              <p style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827' }}>{stat.value}</p>
              {stat.highlight > 0 && (
                <p style={{ fontSize: '0.75rem', color: stat.color, marginTop: '0.25rem', fontWeight: 500 }}>+{stat.highlight} new since last review</p>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {(['reviews', 'agents'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding: '0.5rem 1.25rem', borderRadius: '0.5rem', border: 'none', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', backgroundColor: tab === t ? '#2563EB' : '#E5E7EB', color: tab === t ? 'white' : '#374151' }}>
              {t === 'reviews' ? 'Reviews' : 'Agents'}
              {t === 'reviews' && newReviews.length > 0 && (
                <span style={{ marginLeft: '0.5rem', backgroundColor: '#EF4444', color: 'white', borderRadius: '9999px', fontSize: '0.65rem', padding: '0.1rem 0.4rem', fontWeight: 700 }}>{newReviews.length}</span>
              )}
              {t === 'agents' && newAgents.length > 0 && (
                <span style={{ marginLeft: '0.5rem', backgroundColor: '#EF4444', color: 'white', borderRadius: '9999px', fontSize: '0.65rem', padding: '0.1rem 0.4rem', fontWeight: 700 }}>{newAgents.length}</span>
              )}
            </button>
          ))}
          <button onClick={() => handleMarkReviewed(tab)}
            style={{ marginLeft: 'auto', padding: '0.5rem 1.25rem', borderRadius: '0.5rem', border: '1px solid #E5E7EB', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', backgroundColor: 'white', color: '#374151' }}>
            Mark all {tab} as reviewed
          </button>
        </div>

        {tab === 'reviews' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {reviews.length === 0 && <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>No reviews yet.</p>}
            {reviews.map((review) => {
              const isNewEntry = isNew(review.created_at, 'reviews')
              return (
                <div key={review.id} style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: isNewEntry ? '2px solid #2563EB' : '1px solid #E5E7EB', padding: '1.25rem', position: 'relative' }}>
                  {isNewEntry && (
                    <span style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', backgroundColor: '#DBEAFE', color: '#1D4ED8', fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '9999px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>New</span>
                  )}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.375rem', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827' }}>{review.reviewer_name}</span>
                        <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>{review.reviewer_email}</span>
                        <span style={{ fontSize: '0.875rem', color: '#2563EB' }}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {agents.length === 0 && <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>No agents yet.</p>}
            {agents.map((agent) => {
              const isNewEntry = isNew(agent.created_at, 'agents')
              return (
                <div key={agent.id} style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: isNewEntry ? '2px solid #2563EB' : '1px solid #E5E7EB', padding: '1.25rem', position: 'relative', opacity: agent.is_active ? 1 : 0.5 }}>
                  {isNewEntry && (
                    <span style={{ position: 'absolute', top: '0.75rem', right: '5rem', backgroundColor: '#DBEAFE', color: '#1D4ED8', fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '9999px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>New</span>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827' }}>{agent.name}</span>
                        <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>by {agent.developer}</span>
                        {agent.is_featured && <span style={{ fontSize: '0.65rem', backgroundColor: '#DBEAFE', color: '#1D4ED8', padding: '0.1rem 0.4rem', borderRadius: '9999px', fontWeight: 700 }}>Featured</span>}
                        {!agent.is_active && <span style={{ fontSize: '0.65rem', backgroundColor: '#FEE2E2', color: '#EF4444', padding: '0.1rem 0.4rem', borderRadius: '9999px', fontWeight: 700 }}>Deactivated</span>}
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
                      <button
                        onClick={() => setConfirmDelete({ id: agent.id, type: 'agent', label: agent.name })}
                        style={{ padding: '0.375rem 0.875rem', backgroundColor: '#FEF2F2', color: '#EF4444', border: '1px solid #FECACA', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}