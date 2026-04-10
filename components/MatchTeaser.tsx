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
    <div style={{ background: '#0F172A', padding: '72px 24px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          display: 'inline-block',
          fontSize: '11px',
          fontWeight: '700',
          color: '#2563EB',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          background: 'rgba(37,99,235,0.12)',
          border: '1px solid rgba(37,99,235,0.25)',
          borderRadius: '999px',
          padding: '4px 14px',
          marginBottom: '20px'
        }}>
          ✦ AI Matching
        </div>

        <h2 style={{
          fontSize: '32px',
          fontWeight: '800',
          color: '#F9FAFB',
          marginBottom: '12px',
          lineHeight: '1.2',
          letterSpacing: '-0.02em'
        }}>
          Not sure which agent you need?
        </h2>

        <p style={{
          fontSize: '16px',
          color: '#9CA3AF',
          marginBottom: '32px',
          lineHeight: '1.6'
        }}>
          Describe what you want to automate and we'll match you to the best agent.
        </p>

        <div style={{ display: 'flex', gap: '8px', maxWidth: '560px', margin: '0 auto' }}>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="e.g. Automatically follow up with new leads from my website..."
            style={{
              flex: 1,
              padding: '13px 16px',
              border: '1px solid #1F2937',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              background: '#030712',
              color: '#F9FAFB',
              transition: 'border-color 0.15s'
            }}
            onFocus={e => { e.target.style.borderColor = '#2563EB' }}
            onBlur={e => { e.target.style.borderColor = '#1F2937' }}
          />
          <button
            onClick={handleSubmit}
            style={{
              background: '#2563EB',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '13px 20px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'background 0.15s'
            }}
            onMouseEnter={e => { (e.target as HTMLButtonElement).style.background = '#1D4ED8' }}
            onMouseLeave={e => { (e.target as HTMLButtonElement).style.background = '#2563EB' }}
          >
            Find Agent →
          </button>
        </div>

        <p style={{ marginTop: '16px', fontSize: '13px', color: '#6B7280' }}>
          Not sure where to start?{' '}
          <a href="/find-your-stack" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 600 }}>
            Find your stack in 2 minutes →
          </a>
        </p>

      </div>
    </div>
  )
}