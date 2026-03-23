'use client'
import { useState } from 'react'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navLinks = [
    ['/ai-sales-agents', 'Sales'],
    ['/ai-customer-support-agents', 'Support'],
    ['/ai-research-agents', 'Research'],
    ['/ai-marketing-agents', 'Marketing'],
    ['/ai-coding-agents', 'Coding'],
  ]
  return (
    <header style={{ backgroundColor: '#030712', borderBottom: '1px solid #1F2937', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', height: '3.5rem' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ width: '1.75rem', height: '1.75rem', backgroundColor: '#2563EB', borderRadius: '0.375rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M7 1L12.5 4V10L7 13L1.5 10V4L7 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                <circle cx="7" cy="7" r="1.5" fill="white"/>
              </svg>
            </div>
            <span style={{ color: 'white', fontWeight: 700, fontSize: '0.875rem', letterSpacing: '-0.01em' }}>AI Agent Index</span>
          </a>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0, marginRight: 'auto' }} className="desktop-nav">
            {navLinks.map(([href, label]) => (
              <a key={href} href={href}
                style={{ color: '#9CA3AF', fontSize: '0.8125rem', padding: '0.375rem 0.625rem', borderRadius: '0.375rem', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                {label}
              </a>
            ))}
          </nav>

          <form action="/search" method="GET" style={{ flex: 1, minWidth: 0, maxWidth: '280px' }} className="desktop-search">
            <div style={{ position: 'relative' }}>
              <svg style={{ position: 'absolute', left: '0.625rem', top: '50%', transform: 'translateY(-50%)', color: '#6B7280', pointerEvents: 'none' }}
                width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input type="search" name="q" placeholder="Search agents..."
                style={{ width: '100%', padding: '0.375rem 0.75rem 0.375rem 2rem', backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '0.5rem', fontSize: '0.8125rem', color: 'white', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0, marginLeft: 'auto' }} className="desktop-actions">
            <a href="/submit"
              style={{ display: 'inline-flex', alignItems: 'center', padding: '0.375rem 0.75rem', backgroundColor: '#1D4ED8', color: 'white', borderRadius: '0.375rem', fontSize: '0.8125rem', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
              + Submit
            </a>
            <a href="/compare" style={{ color: '#9CA3AF', fontSize: '0.8125rem', padding: '0.375rem 0.5rem', textDecoration: 'none', whiteSpace: 'nowrap' }} className="desktop-only">Compare</a>
            <a href="/definitions" style={{ color: '#9CA3AF', fontSize: '0.8125rem', padding: '0.375rem 0.5rem', textDecoration: 'none', whiteSpace: 'nowrap' }} className="desktop-only">Definitions</a>
            <a href="/integrations" style={{ color: '#9CA3AF', fontSize: '0.8125rem', padding: '0.375rem 0.5rem', textDecoration: 'none', whiteSpace: 'nowrap' }} className="desktop-only">Integrations</a>
            <a href="/resources/guides" style={{ color: '#9CA3AF', fontSize: '0.8125rem', padding: '0.375rem 0.5rem', textDecoration: 'none', whiteSpace: 'nowrap' }} className="desktop-only">Guides</a>
            <a href="/resources/newsletter" style={{ color: '#9CA3AF', fontSize: '0.8125rem', padding: '0.375rem 0.5rem', textDecoration: 'none', whiteSpace: 'nowrap' }} className="desktop-only">Newsletter</a>
            <a href="/api/agents" target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#4B5563', fontSize: '0.6875rem', fontFamily: 'monospace', textDecoration: 'none' }} className="desktop-only">
              <span style={{ width: '0.375rem', height: '0.375rem', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }}/>
              API
            </a>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="mobile-menu-btn"
            style={{ display: 'none', flexDirection: 'column', gap: '5px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', flexShrink: 0 }}
            aria-label="Menu">
            <span style={{ width: '20px', height: '2px', backgroundColor: 'white', display: 'block' }}/>
            <span style={{ width: '20px', height: '2px', backgroundColor: 'white', display: 'block' }}/>
            <span style={{ width: '20px', height: '2px', backgroundColor: 'white', display: 'block' }}/>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div style={{ backgroundColor: '#0F172A', borderTop: '1px solid #1F2937', padding: '1rem 1.5rem' }} className="mobile-menu">
          <form action="/search" method="GET" style={{ marginBottom: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <svg style={{ position: 'absolute', left: '0.625rem', top: '50%', transform: 'translateY(-50%)', color: '#6B7280', pointerEvents: 'none' }}
                width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input type="search" name="q" placeholder="Search agents..."
                style={{ width: '100%', padding: '0.625rem 0.75rem 0.625rem 2rem', backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '0.5rem', fontSize: '0.9375rem', color: 'white', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </form>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {navLinks.map(([href, label]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}
                style={{ color: '#D1D5DB', fontSize: '0.9375rem', padding: '0.625rem 0.5rem', textDecoration: 'none', borderBottom: '1px solid #1F2937' }}>
                {label}
              </a>
            ))}
            <a href="/compare" onClick={() => setMenuOpen(false)} style={{ color: '#D1D5DB', fontSize: '0.9375rem', padding: '0.625rem 0.5rem', textDecoration: 'none', borderBottom: '1px solid #1F2937' }}>Compare</a>
            <a href="/definitions" onClick={() => setMenuOpen(false)} style={{ color: '#D1D5DB', fontSize: '0.9375rem', padding: '0.625rem 0.5rem', textDecoration: 'none', borderBottom: '1px solid #1F2937' }}>Definitions</a>
            <a href="/integrations" onClick={() => setMenuOpen(false)} style={{ color: '#D1D5DB', fontSize: '0.9375rem', padding: '0.625rem 0.5rem', textDecoration: 'none', borderBottom: '1px solid #1F2937' }}>Integrations</a>
            <a href="/resources/guides" onClick={() => setMenuOpen(false)} style={{ color: '#D1D5DB', fontSize: '0.9375rem', padding: '0.625rem 0.5rem', textDecoration: 'none', borderBottom: '1px solid #1F2937' }}>Guides</a>
            <a href="/resources/newsletter" onClick={() => setMenuOpen(false)} style={{ color: '#D1D5DB', fontSize: '0.9375rem', padding: '0.625rem 0.5rem', textDecoration: 'none', borderBottom: '1px solid #1F2937' }}>Newsletter</a>
            <a href="/submit" onClick={() => setMenuOpen(false)} style={{ color: '#60A5FA', fontSize: '0.9375rem', padding: '0.625rem 0.5rem', textDecoration: 'none', fontWeight: 600 }}>+ Submit an agent</a>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .desktop-search { display: none !important; }
          .desktop-only { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  )
}