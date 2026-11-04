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
    <div>
      <label htmlFor="hero-match" style={{ display: 'block', fontWeight: 600, fontSize: '15px', marginBottom: '8px' }}>Describe what you want to automate</label>
      <textarea
        id="hero-match"
        rows={2}
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleFind() } }}
        placeholder="For example: automatically follow up with leads from my contact form"
        style={{ display: 'block', width: '100%', padding: '12px 14px', border: '1px solid #9CA3AF', borderRadius: '6px', fontFamily: 'inherit', fontSize: '16px', lineHeight: 1.5, resize: 'none', color: '#111827', backgroundColor: '#FFFFFF', boxSizing: 'border-box' }}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px 24px', marginTop: '12px', fontSize: '15px' }}>
        <button
          type="button"
          onClick={handleFind}
          style={{ height: '48px', padding: '0 24px', border: 0, borderRadius: '6px', backgroundColor: '#1D4ED8', color: '#FFFFFF', fontFamily: 'inherit', fontSize: '16px', fontWeight: 600, cursor: 'pointer' }}
        >
          Find my agent
        </button>
        <a href="#categories" className="hp-link" style={{ paddingBlock: '8px' }}>Browse by category</a>
        <a href="/find-your-stack" className="hp-link" style={{ paddingBlock: '8px' }}>Find your stack in 2 minutes</a>
        <a href="/api/agents" target="_blank" rel="noopener noreferrer" className="hp-api-link">GET /api/agents</a>
      </div>
    </div>
  )
}
