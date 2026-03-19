import type { Metadata } from 'next'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'The AI Agent Index — Structured Directory of AI Agents',
    template: '%s | The AI Agent Index',
  },
  description: 'The structured index of AI agents for business automation. Search, filter, and compare agents across sales, support, research, marketing, and coding — dataset-first, machine-readable.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://theaiagentindex.com'),
  openGraph: { siteName: 'The AI Agent Index', type: 'website' },
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.svg', shortcut: '/favicon.svg' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <header style={{ backgroundColor: '#030712', borderBottom: '1px solid #1F2937', position: 'sticky', top: 0, zIndex: 50 }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', height: '3.5rem' }}>
              <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none', flexShrink: 0 }}>
                <div style={{ width: '1.75rem', height: '1.75rem', backgroundColor: '#2563EB', borderRadius: '0.375rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                    <path d="M7 1L12.5 4V10L7 13L1.5 10V4L7 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                    <circle cx="7" cy="7" r="1.5" fill="white"/>
                  </svg>
                </div>
                <span style={{ color: 'white', fontWeight: 700, fontSize: '0.875rem', letterSpacing: '-0.01em' }}>AI Agent Index</span>
              </a>

              <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
                {[
                  ['/ai-sales-agents', 'Sales'],
                  ['/ai-customer-support-agents', 'Support'],
                  ['/ai-research-agents', 'Research'],
                  ['/ai-marketing-agents', 'Marketing'],
                  ['/ai-coding-agents', 'Coding'],
                ].map(([href, label]) => (
                  <a key={href} href={href}
                    style={{ color: '#9CA3AF', fontSize: '0.8125rem', padding: '0.375rem 0.625rem', borderRadius: '0.375rem', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                    {label}
                  </a>
                ))}
              </nav>

              <div style={{ width: '1px', height: '1.25rem', backgroundColor: '#374151', flexShrink: 0 }} />

              <form action="/search" method="GET" style={{ flex: 1, minWidth: 0 }}>
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

              <div style={{ width: '1px', height: '1.25rem', backgroundColor: '#374151', flexShrink: 0 }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                <a href="/submit"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.375rem 0.75rem', backgroundColor: '#1D4ED8', color: 'white', borderRadius: '0.375rem', fontSize: '0.8125rem', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                  + Submit
                </a>
                <a href="/resources"
                  style={{ color: '#9CA3AF', fontSize: '0.8125rem', padding: '0.375rem 0.625rem', borderRadius: '0.375rem', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                  Resources
                </a>
                <a href="/api/agents" target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#4B5563', fontSize: '0.6875rem', fontFamily: 'monospace', textDecoration: 'none' }}>
                  <span style={{ width: '0.375rem', height: '0.375rem', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }}/>
                  API
                </a>
              </div>
            </div>
          </div>
        </header>

        <GoogleAnalytics />
        <main>{children}</main>

        <footer style={{ backgroundColor: '#030712', borderTop: '1px solid #1F2937', marginTop: '4rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <div style={{ width: '1.5rem', height: '1.5rem', backgroundColor: '#2563EB', borderRadius: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                      <path d="M7 1L12.5 4V10L7 13L1.5 10V4L7 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                      <circle cx="7" cy="7" r="1.5" fill="white"/>
                    </svg>
                  </div>
                  <span style={{ color: 'white', fontWeight: 600, fontSize: '0.875rem' }}>AI Agent Index</span>
                </div>
                <p style={{ color: '#6B7280', fontSize: '0.8125rem', lineHeight: 1.6 }}>
                  The structured, dataset-first directory of AI agents. Machine-readable by design.
                </p>
              </div>
              <div>
                <p style={{ color: '#6B7280', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Categories</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[['AI Sales Agents', '/ai-sales-agents'], ['AI Customer Support', '/ai-customer-support-agents'], ['AI Research Agents', '/ai-research-agents'], ['AI Marketing Agents', '/ai-marketing-agents'], ['AI Coding Agents', '/ai-coding-agents']].map(([label, href]) => (
                    <a key={href} href={href} style={{ color: '#6B7280', fontSize: '0.8125rem', textDecoration: 'none' }}>{label}</a>
                  ))}
                </div>
              </div>
              <div>
                <p style={{ color: '#6B7280', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Resources</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[['Comparisons', '/resources/comparisons'], ['Guides', '/resources/guides'], ['Newsletter', '/resources/newsletter'], ['Submit an Agent', '/submit']].map(([label, href]) => (
                    <a key={href} href={href} style={{ color: '#6B7280', fontSize: '0.8125rem', textDecoration: 'none' }}>{label}</a>
                  ))}
                </div>
              </div>
              <div>
                <p style={{ color: '#6B7280', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Data</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[['/api/agents — JSON API', '/api/agents'], ['/sitemap.xml', '/sitemap.xml'], ['/search', '/search']].map(([label, href]) => (
                    <a key={href} href={href} style={{ color: '#6B7280', fontSize: '0.75rem', textDecoration: 'none', fontFamily: 'monospace' }}>{label}</a>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ borderTop: '1px solid #1F2937', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <p style={{ color: '#4B5563', fontSize: '0.75rem' }}>© 2026 The AI Agent Index. Built for humans and AI systems.</p>
              <p style={{ color: '#374151', fontSize: '0.75rem', fontFamily: 'monospace' }}>5 categories · public JSON API · updated daily</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}