'use client'
import { useCompare } from './CompareProvider'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import AgentLogo from './AgentLogo'

export default function CompareBar() {
  const { agents, removeAgent, clearBoard, count } = useCompare()
  const router = useRouter()
  const [expanded, setExpanded] = useState(false)
  const [pulse, setPulse] = useState(false)
  const [prevCount, setPrevCount] = useState(0)

  useEffect(() => {
    if (count === 2 && prevCount === 1) {
      setPulse(true)
      const t = setTimeout(() => setPulse(false), 1500)
      return () => clearTimeout(t)
    }
    setPrevCount(count)
  }, [count, prevCount])

  if (count === 0) return null

  const handleViewBoard = () => {
    setExpanded(false)
    router.push('/compare/build')
  }

  return (
    <>
      {/* Floating button */}
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#2563EB',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 1000,
          boxShadow: '0 4px 24px rgba(37, 99, 235, 0.45)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          transform: pulse ? 'scale(1.15)' : 'scale(1)',
        }}
      >
        <span style={{
          position: 'absolute',
          top: '-4px',
          right: '-4px',
          backgroundColor: '#111827',
          borderRadius: '50%',
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.75rem',
          fontWeight: 700,
          border: '2px solid white',
          color: 'white',
        }}>
          {count}
        </span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      </div>

      {/* Expanded panel */}
      {expanded && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setExpanded(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.2)',
              zIndex: 999,
            }}
          />
          <div style={{
            position: 'fixed',
            bottom: '5.5rem',
            right: '1.5rem',
            backgroundColor: '#111827',
            borderRadius: '1rem',
            padding: '1.25rem',
            zIndex: 1001,
            boxShadow: '0 8px 40px rgba(0,0,0,0.35)',
            width: '280px',
          }}>
            <p style={{ color: '#9CA3AF', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.75rem' }}>
              Compare Board ({count}/4)
            </p>
            {agents.map(agent => (
              <div key={agent.slug} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.625rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AgentLogo name={agent.name} websiteUrl={agent.websiteUrl} faviconDomain={agent.faviconDomain} size="sm" />
                  <span style={{ color: 'white', fontSize: '0.8125rem', fontWeight: 500 }}>{agent.name}</span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeAgent(agent.slug) }}
                  style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', fontSize: '1.125rem', padding: '0 0.25rem', lineHeight: 1 }}
                >
                  ×
                </button>
              </div>
            ))}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button
                onClick={handleViewBoard}
                style={{ flex: 1, padding: '0.625rem', backgroundColor: '#2563EB', color: 'white', border: 'none', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
              >
                View Board →
              </button>
              <button
                onClick={() => { clearBoard(); setExpanded(false) }}
                style={{ padding: '0.625rem 0.75rem', backgroundColor: '#1F2937', color: '#9CA3AF', border: '1px solid #374151', borderRadius: '0.5rem', fontSize: '0.8125rem', cursor: 'pointer' }}
              >
                Clear
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}