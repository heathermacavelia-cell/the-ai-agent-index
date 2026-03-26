'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HeroSearch() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  function handleFind() {
    if (!query.trim()) return
    router.push('/find?q=' + encodeURIComponent(query))
  }

  return (
    <div style={{ width: '100%', maxWidth: '600px' }}>
      <div style={{ marginBottom: '0.75rem' }}>
        <textarea
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleFind() } }}
          placeholder="Describe what you want to automate... e.g. automatically follow up with leads from my contact form"
          style={{ width: '100%', padding: '1rem', backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '0.75rem', fontSize: '0.9375rem', color: 'white', outline: 'none', minHeight: '90px', resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: 1.6 }}
          onFocus={e => { e.target.style.borderColor = '#2563EB' }}
          onBlur={e => { e.target.style.borderColor = '#374151' }}
        />
      </div>
      <button
        onClick={handleFind}
        disabled={!query.trim()}
        style={{ width: '100%', padding: '0.9375rem', backgroundColor: query.trim() ? '#1D4ED8' : '#1e3a5f', color: query.trim() ? 'white' : '#4B5563', border: 'none', borderRadius: '0.75rem', fontSize: '1rem', fontWeight: 700, cursor: query.trim() ? 'pointer' : 'not-allowed', transition: 'background 0.2s', letterSpacing: '-0.01em' }}
      >
        Find My AI Agent
      </button>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
        <a href="#categories" style={{ color: '#6B7280', fontSize: '0.8125rem', textDecoration: 'none' }}>or browse by category</a>
        <span style={{ color: '#374151' }}>·</span>
       <a href="/api/agents" target="_blank" rel="noopener noreferrer" style={{ color: '#6B7280', fontSize: '0.8125rem', fontFamily: 'monospace', textDecoration: 'none' }}>GET /api/agents</a>
      </div>
    </div>
  )
}