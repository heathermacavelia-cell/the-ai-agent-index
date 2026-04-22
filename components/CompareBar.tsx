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
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 769)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

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

  // Mobile: floating circle + expandable panel
  if (isMobile) {
    return (
      <>
        <div
          onClick={() => setExpanded(!expanded)}
          style={{
            position: 'fixed',
            bottom: '1.25rem',
            right: '1.25rem',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#2563EB',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 1000,
            boxShadow: '0 4px 20px rgba(37, 99, 235, 0.4)',
            transition: 'transform 0.2s',
            transform: pulse ? 'scale(1.15)' : 'scale(1)',
          }}
        >
          <span style={{ position: 'absolute', top: '-4px', right: '-4px', backgroundColor: '#111827', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6875rem', fontWeight: 700, border: '2px solid white', color: 'white' }}>
            {count}
          </span>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        </div>

        {expanded && (
          <div style={{
            position: 'fixed',
            bottom: '5rem',
            right: '1.25rem',
            backgroundColor: '#111827',
            borderRadius: '1rem',
            padding: '1rem',
            zIndex: 1000,
            boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
            minWidth: '220px',
          }}>
            <p style={{ color: '#9CA3AF', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.75rem' }}>
              Compare Board ({count}/4)
            </p>
            {agents.map(agent => (
              <div key={agent.slug} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AgentLogo name={agent.name} websiteUrl={agent.websiteUrl} faviconDomain={agent.faviconDomain} size="sm" />
                  <span style={{ color: 'white', fontSize: '0.8125rem', fontWeight: 500 }}>{agent.name}</span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeAgent(agent.slug) }}
                  style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', fontSize: '1rem', padding: '0 0.25rem' }}
                >
                  ×
                </button>
              </div>
            ))}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
              <button
                onClick={handleViewBoard}
                style={{ flex: 1, padding: '0.5rem', backgroundColor: '#2563EB', color: 'white', border: 'none', borderRadius: '0.5rem', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}
              >
                View Board →
              </button>
              <button
                onClick={() => { clearBoard(); setExpanded(false) }}
                style={{ padding: '0.5rem 0.75rem', backgroundColor: '#1F2937', color: '#9CA3AF', border: '1px solid #374151', borderRadius: '0.5rem', fontSize: '0.8125rem', cursor: 'pointer' }}
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </>
    )
  }

  // Desktop: full bottom bar
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#111827',
        borderTop: '1px solid #1F2937',
        padding: '0.75rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 999,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.2)',
        transform: pulse ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'transform 0.3s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ color: '#9CA3AF', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Compare ({count}/4)
        </span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {agents.map(agent => (
            <div
              key={agent.slug}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                backgroundColor: '#1F2937',
                padding: '0.375rem 0.625rem',
                borderRadius: '0.5rem',
                border: '1px solid #374151',
              }}
            >
              <AgentLogo name={agent.name} websiteUrl={agent.websiteUrl} faviconDomain={agent.faviconDomain} size="sm" />
              <span style={{ color: 'white', fontSize: '0.8125rem', fontWeight: 500 }}>{agent.name}</span>
              <button
                onClick={() => removeAgent(agent.slug)}
                style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', fontSize: '0.875rem', padding: '0 0.125rem', lineHeight: 1 }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={handleViewBoard}
          style={{
            padding: '0.5rem 1.25rem',
            backgroundColor: '#2563EB',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '0.8125rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          View Board {count >= 2 ? '→' : ''}
        </button>
        <button
          onClick={clearBoard}
          style={{
            padding: '0.5rem 0.75rem',
            backgroundColor: 'transparent',
            color: '#6B7280',
            border: '1px solid #374151',
            borderRadius: '0.5rem',
            fontSize: '0.8125rem',
            cursor: 'pointer',
          }}
        >
          Clear
        </button>
      </div>
    </div>
  )
}