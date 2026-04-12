'use client'
import { useState, useRef, useEffect } from 'react'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])
  const navLinks = [
    ['/ai-sales-agents', 'Sales'],
    ['/ai-customer-support-agents', 'Support'],
    ['/ai-research-agents', 'Research'],
    ['/ai-marketing-agents', 'Marketing'],
    ['/ai-coding-agents', 'Coding'],
    ['/ai-hr-agents', 'HR'],
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
            {/* Categories dropdown */}
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <button onClick={() => setDropdownOpen(!dropdownOpen)} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: dropdownOpen ? 'white' : '#9CA3AF', fontSize: '0.8125rem', padding: '0.375rem 0.625rem', borderRadius: '0.375rem', background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Categories
                <svg width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}><path d='M6 9l6 6 6-6'/></svg>
              </button>
              {dropdownOpen && (
                <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, backgroundColor: '#0F172A', border: '1px solid #1F2937', borderRadius: '0.75rem', padding: '0.5rem', minWidth: '260px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', zIndex: 100 }}>
                  {navLinks.map(([href, label]) => (
                    <a key={href} href={href} onClick={() => setDropdownOpen(false)} style={{ display: 'block', padding: '0.625rem 0.75rem', borderRadius: '0.5rem', textDecoration: 'none', color: 'white', fontSize: '0.8125rem', fontWeight: 600 }} onMouseEnter={e => e.currentTarget.style.backgroundColor='#1F2937'} onMouseLeave={e => e.currentTarget.style.backgroundColor='transparent'}>{label} Agents</a>
                  ))}
                  <div style={{ borderTop: '1px solid #1F2937', margin: '0.5rem 0' }} />
                  <a href='/stacks' onClick={() => setDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.625rem 0.75rem', borderRadius: '0.5rem', textDecoration: 'none', color: '#60A5FA', fontSize: '0.8125rem', fontWeight: 600 }} onMouseEnter={e => e.currentTarget.style.backgroundColor='#1F2937'} onMouseLeave={e => e.currentTarget.style.backgroundColor='transparent'}>
                    Browse Agent Stacks
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </a>
                  <a href='/' onClick={() => setDropdownOpen(false)} style={{ display: 'block', padding: '0.5rem 0.75rem', color: '#6B7280', fontSize: '0.75rem', fontWeight: 600, textDecoration: 'none' }}>Browse all categories</a>
                </div>
              )}
            </div>
            <a href='/find' style={{ color: '#60A5FA', fontSize: '0.8125rem', padding: '0.375rem 0.625rem', borderRadius: '0.375rem', textDecoration: 'none', fontWeight: 600, whiteSpace: 'nowrap' }}>Find Agent</a>
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
            <a href="/submit" style={{ display: 'inline-flex', alignItems: 'center', padding: '0.375rem 0.75rem', backgroundColor: '#1D4ED8', color: 'white', borderRadius: '0.375rem', fontSize: '0.8125rem', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
              + Submit
            </a>
            <a href="/compare" style={{ color: '#9CA3AF', fontSize: '0.8125rem', padding: '0.375rem 0.5rem', textDecoration: 'none', whiteSpace: 'nowrap' }} className="desktop-only">Compare</a>
            <a href="/alternatives" style={{ color: '#9CA3AF', fontSize: '0.8125rem', padding: '0.375rem 0.5rem', textDecoration: 'none', whiteSpace: 'nowrap' }} className="desktop-only">Alternatives</a>
            <a href="/stacks" style={{ color: '#9CA3AF', fontSize: '0.8125rem', padding: '0.375rem 0.5rem', textDecoration: 'none', whiteSpace: 'nowrap' }} className="desktop-only">Stacks</a>
            <a href="/advertise" style={{ color: '#FBBF24', fontSize: '0.8125rem', padding: '0.375rem 0.5rem', textDecoration: 'none', fontWeight: 600, whiteSpace: 'nowrap' }} className="desktop-only">Advertise</a>
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
            <a href="/stacks" onClick={() => setMenuOpen(false)} style={{ color: '#60A5FA', fontSize: '0.9375rem', padding: '0.625rem 0.5rem', textDecoration: 'none', fontWeight: 600, borderBottom: '1px solid #1F2937' }}>Agent Stacks</a>
            <a href="/compare" onClick={() => setMenuOpen(false)} style={{ color: '#D1D5DB', fontSize: '0.9375rem', padding: '0.625rem 0.5rem', textDecoration: 'none', borderBottom: '1px solid #1F2937' }}>Compare</a>
            <a href="/alternatives" onClick={() => setMenuOpen(false)} style={{ color: '#D1D5DB', fontSize: '0.9375rem', padding: '0.625rem 0.5rem', textDecoration: 'none', borderBottom: '1px solid #1F2937' }}>Alternatives</a>
            <a href="/submit" onClick={() => setMenuOpen(false)} style={{ color: '#60A5FA', fontSize: '0.9375rem', padding: '0.625rem 0.5rem', textDecoration: 'none', fontWeight: 600, borderBottom: '1px solid #1F2937' }}>+ Submit an agent</a>
            <a href="/advertise" onClick={() => setMenuOpen(false)} style={{ color: '#FBBF24', fontSize: '0.9375rem', padding: '0.625rem 0.5rem', textDecoration: 'none', fontWeight: 600 }}>Advertise</a>
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