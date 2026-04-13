'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Discussion {
  id: string
  author_name: string
  author_email: string
  body: string
  upvotes: number
  report_count: number
  is_deleted: boolean
  created_at: string
  parent_id: string | null
  stack_id: string
  stack_name?: string
  stack_slug?: string
}

export default function AdminDiscussionsPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [authError, setAuthError] = useState('')
  const [discussions, setDiscussions] = useState<Discussion[]>([])
  const [loading, setLoading] = useState(false)

  const headers = (pass: string) => ({ 'Content-Type': 'application/json', 'x-admin-password': pass })

  const load = async (pass: string) => {
    setLoading(true)
    const res = await fetch('/api/admin/discussions', { headers: headers(pass) })
    if (res.status === 401) {
      setAuthError('Incorrect password.')
      setLoading(false)
      return
    }
    const data = await res.json()
    setDiscussions(data)
    setAuthed(true)
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this comment?')) return
    await fetch('/api/discussions/admin-delete', {
      method: 'POST',
      headers: headers(password),
      body: JSON.stringify({ id }),
    })
    setDiscussions(prev => prev.map(d => d.id === id ? { ...d, is_deleted: true } : d))
  }

  const flagged = discussions.filter(d => d.report_count > 0 && !d.is_deleted)
  const recent = discussions.filter(d => !d.is_deleted && d.report_count === 0)
  const deleted = discussions.filter(d => d.is_deleted)

  if (!authed) return (
    <div style={{ maxWidth: '400px', margin: '6rem auto', padding: '0 1.5rem' }}>
      <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '1.5rem' }}>Discussion Admin</h1>
      <input
        type="password"
        placeholder="Admin password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && load(password)}
        style={{ width: '100%', padding: '0.625rem 0.875rem', border: '1px solid #D1D5DB', borderRadius: '0.5rem', fontSize: '0.9375rem', marginBottom: '0.75rem', boxSizing: 'border-box' }}
      />
      {authError && <p style={{ color: '#EF4444', fontSize: '0.8125rem', marginBottom: '0.75rem' }}>{authError}</p>}
      <button
        onClick={() => load(password)}
        disabled={loading}
        style={{ width: '100%', padding: '0.625rem', backgroundColor: '#2563EB', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.9375rem', cursor: 'pointer' }}>
        {loading ? 'Loading…' : 'Sign in'}
      </button>
    </div>
  )

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <Link href="/admin/reviews" style={{ fontSize: '0.875rem', color: '#6B7280', textDecoration: 'none' }}>← Admin</Link>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginTop: '0.5rem', marginBottom: '0.25rem' }}>Discussion Moderation</h1>
          <p style={{ color: '#6B7280', fontSize: '0.875rem', margin: 0 }}>
            {flagged.length} flagged · {recent.length} clean · {deleted.length} deleted
          </p>
        </div>
        <button
          onClick={() => load(password)}
          style={{ padding: '0.5rem 1rem', backgroundColor: '#F3F4F6', color: '#374151', border: '1px solid #E5E7EB', borderRadius: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
          Refresh
        </button>
      </div>

      {/* Flagged */}
      {flagged.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#DC2626', marginBottom: '1rem' }}>⚠️ Flagged ({flagged.length})</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {flagged.map(d => (
              <DiscussionRow key={d.id} d={d} onDelete={handleDelete} highlight="red" />
            ))}
          </div>
        </div>
      )}

      {/* Recent */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>Recent ({recent.length})</h2>
        {recent.length === 0
          ? <p style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>No comments yet.</p>
          : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recent.map(d => (
                <DiscussionRow key={d.id} d={d} onDelete={handleDelete} highlight="none" />
              ))}
            </div>
          )}
      </div>

      {/* Deleted */}
      {deleted.length > 0 && (
        <div>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#9CA3AF', marginBottom: '1rem' }}>Deleted ({deleted.length})</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {deleted.map(d => (
              <DiscussionRow key={d.id} d={d} onDelete={handleDelete} highlight="deleted" />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function DiscussionRow({
  d,
  onDelete,
  highlight,
}: {
  d: Discussion
  onDelete: (id: string) => void
  highlight: 'red' | 'none' | 'deleted'
}) {
  const bg = highlight === 'red' ? '#FFF5F5' : 'white'
  const borderColor = highlight === 'red' ? '#FCA5A5' : '#E5E7EB'

  return (
    <div style={{ backgroundColor: bg, border: `1px solid ${borderColor}`, borderRadius: '0.75rem', padding: '1rem 1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 600, fontSize: '0.875rem', color: d.is_deleted ? '#9CA3AF' : '#111827' }}>{d.author_name}</span>
          <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{d.author_email}</span>
          {d.parent_id && (
            <span style={{ fontSize: '0.6875rem', backgroundColor: '#F3F4F6', color: '#6B7280', padding: '0.15rem 0.4rem', borderRadius: '0.25rem' }}>reply</span>
          )}
          {d.report_count > 0 && (
            <span style={{ fontSize: '0.6875rem', backgroundColor: '#FEE2E2', color: '#DC2626', padding: '0.15rem 0.4rem', borderRadius: '0.25rem', fontWeight: 600 }}>
              ⚠ {d.report_count} report{d.report_count > 1 ? 's' : ''}
            </span>
          )}
          {d.is_deleted && (
            <span style={{ fontSize: '0.6875rem', backgroundColor: '#F3F4F6', color: '#9CA3AF', padding: '0.15rem 0.4rem', borderRadius: '0.25rem' }}>deleted</span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
            {new Date(d.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </span>
          {d.stack_slug && (
            <a href={`/stacks/${d.stack_slug}`} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: '0.75rem', color: '#2563EB', textDecoration: 'none' }}>
              {d.stack_name ?? 'View stack'} →
            </a>
          )}
        </div>
      </div>
      <p style={{ fontSize: '0.875rem', color: d.is_deleted ? '#9CA3AF' : '#374151', lineHeight: 1.6, margin: '0 0 0.75rem', fontStyle: d.is_deleted ? 'italic' : 'normal' }}>
        {d.body}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>▲ {d.upvotes}</span>
        {!d.is_deleted && (
          <button
            onClick={() => onDelete(d.id)}
            style={{ fontSize: '0.75rem', color: '#DC2626', backgroundColor: 'transparent', border: '1px solid #FCA5A5', borderRadius: '0.375rem', padding: '0.25rem 0.625rem', cursor: 'pointer', marginLeft: '0.5rem' }}>
            Delete
          </button>
        )}
      </div>
    </div>
  )
}