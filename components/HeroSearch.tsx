'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HeroSearch() {
  const [mode, setMode] = useState<'browse' | 'find'>('browse')
  const [query, setQuery] = useState('')
  const router = useRouter()

  function handleFind() {
    if (!query.trim()) return
    router.push(`/find?q=${encodeURIComponent(query)}`)
  }

  return (
    <div>
      {/* Tab Toggle */}
      <div style={{ display: 'inline-flex', backgroundColor: '#0F172A', border: '1px solid #1F2937', borderRadius: '0.625rem', padding: '0.25rem', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setMode('browse')}
          style={{ padding: '0.5rem 1.25rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: mode === 'browse' ? '#1D4ED8' : 'transparent', color: mode === 'browse' ? 'white' : '#6B7280' }}
        >
          Browse Agents
        </button>
        <button
          onClick={() => setMode('find')}
          style={{ padding: '0.5rem 1.25rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: mode === 'find' ? '#1D4ED8' : 'transparent', color: mode === 'find' ? 'white' : '#6B7280', display: 'flex', alignItems: 'center', gap: '0.375rem' }}
        >
          <span style={{ fontSize: '0.75rem' }}>✦</span> Find My Agent
        </button>
      </div>

      {/* Browse Mode */}
      {mode === 'browse' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
          <form action="/search" method="GET" style={{ width: '100%', maxWidth: '480px' }}>
            <div style={{ position: 'relative' }}>
              <svg style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#6B7280', pointerEvents: 'none' }}
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="search"
                name="q"
                placeholder="Search 210+ agents..."
                style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 2.75rem', backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '0.625rem', fontSize: '0.9375rem', color: 'white', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </form>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <a href="#categories" style={{ padding: '0.625rem 1.25rem', backgroundColor: '#1D4ED8', color: 'white', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>Browse Categories</a>
            <a href="/api/agents" target="_blank" rel="noopener noreferrer" style={{ padding: '0.625rem 1.25rem', border: '1px solid #374151', color: '#9CA3AF', borderRadius: '0.5rem', fontSize: '0.8125rem', fontFamily: 'monospace', textDecoration: 'none' }}>GET /api/agents</a>
          </div>
        </div>
      )}

      {/* Find Mode */}
      {mode === 'find' && (
        <div style={{ width: '100%', maxWidth: '560px', margin: '0 auto' }}>
          <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
            <textarea
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleFind() } }}
              placeholder="e.g. I want to automatically follow up with leads who fill out my contact form..."
              style={{ width: '100%', padding: '0.875rem 1rem', backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '0.625rem', fontSize: '0.9375rem', color: 'white', outline: 'none', minHeight: '80px', resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: 1.5 }}
              onFocus={e => { e.target.style.borderColor = '#2563EB' }}
              onBlur={e => { e.target.style.borderColor = '#374151' }}
            />
          </div>
          <button
            onClick={handleFind}
            disabled={!query.trim()}
            style={{ width: '100%', padding: '0.875rem', backgroundColor: query.trim() ? '#1D4ED8' : '#1e3a5f', color: query.trim() ? 'white' : '#4B5563', border: 'none', borderRadius: '0.625rem', fontSize: '0.9375rem', fontWeight: 700, cursor: query.trim() ? 'pointer' : 'not-allowed', transition: 'background 0.2s' }}
          >
            Find My AI Agent →
          </button>
          <p style={{ fontSize: '0.75rem', color: '#4B5563', marginTop: '0.625rem', textAlign: 'center' }}>
            Powered by AI · Searches across {'{210}'}+ indexed agents
          </p>
        </div>
      )}
    </div>
  )
}