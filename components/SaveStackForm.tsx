'use client'
import { useState } from 'react'

export default function SaveStackForm({ stackName, stackSlug }: { stackName: string; stackSlug: string }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSave = async () => {
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/stacks/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, stackName, stackSlug }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '0.5rem', padding: '1rem', textAlign: 'center' }}>
        <p style={{ color: '#16A34A', fontSize: '0.875rem', fontWeight: 600 }}>✓ Saved — check your inbox</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="your@email.com"
        style={{ flex: 1, padding: '0.5rem 0.75rem', backgroundColor: 'white', border: '1px solid #D1D5DB', borderRadius: '0.5rem', color: '#111827', fontSize: '0.875rem', outline: 'none' }}
      />
      <button
        onClick={handleSave}
        disabled={!email || status === 'loading'}
        style={{ padding: '0.5rem 1rem', backgroundColor: '#2563EB', color: 'white', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.875rem', border: 'none', cursor: email && status !== 'loading' ? 'pointer' : 'not-allowed', opacity: email && status !== 'loading' ? 1 : 0.5, whiteSpace: 'nowrap' }}
      >
        {status === 'loading' ? '...' : 'Save →'}
      </button>
    </div>
  )
}