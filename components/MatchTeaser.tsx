'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function MatchTeaser() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  function handleSubmit() {
    if (!query.trim()) return
    router.push(`/find?q=${encodeURIComponent(query)}`)
  }

  return (
    <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '16px', padding: '32px', margin: '40px 0' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '13px', fontWeight: '700', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
          ✦ New — AI Matching
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#111827', marginBottom: '8px' }}>
          Not sure which agent you need?
        </h2>
        <p style={{ fontSize: '15px', color: '#6b7280', marginBottom: '24px' }}>
          Describe what you want to automate and we'll find the best match.
        </p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="e.g. Automatically follow up with new leads from my website..."
            style={{ flex: 1, padding: '12px 16px', border: '2px solid #bfdbfe', borderRadius: '8px', fontSize: '14px', outline: 'none', background: '#fff' }}
            onFocus={e => { e.target.style.borderColor = '#2563eb' }}
            onBlur={e => { e.target.style.borderColor = '#bfdbfe' }}
          />
          <button
            onClick={handleSubmit}
            style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px 20px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            Find Agent →
          </button>
        </div>
      </div>
    </div>
  )
}