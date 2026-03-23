import type { Metadata } from 'next'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import './globals.css'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: {
    default: 'The AI Agent Index — Structured Directory of AI Agents',
    template: '%s | The AI Agent Index',
  },
  description: 'The structured index of AI agents for business automation. Search, filter, and compare agents across sales, support, research, marketing, and coding — dataset-first, machine-readable.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://theaiagentindex.com'),
  openGraph: { siteName: 'The AI Agent Index', type: 'website' },
  robots: { index: true, follow: true },
  verification: { other: { 'impact-site-verification': '4142fa95-5ba0-4964-87fb-02dcad139626' } },
  icons: { icon: '/favicon.svg', shortcut: '/favicon.svg' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <Header />

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
                  {[
                    ['AI Sales Agents', '/ai-sales-agents'],
                    ['AI Customer Support', '/ai-customer-support-agents'],
                    ['AI Research Agents', '/ai-research-agents'],
                    ['AI Marketing Agents', '/ai-marketing-agents'],
                    ['AI Coding Agents', '/ai-coding-agents'],
                  ].map(([label, href]) => (
                    <a key={href} href={href} style={{ color: '#6B7280', fontSize: '0.8125rem', textDecoration: 'none' }}>{label}</a>
                  ))}
                </div>
              </div>

              <div>
                <p style={{ color: '#6B7280', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Learn</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[
                    ['What is an AI Sales Agent?', '/definitions/what-is-an-ai-sales-agent'],
                    ['What is an AI Support Agent?', '/definitions/what-is-an-ai-customer-support-agent'],
                    ['What is an AI Research Agent?', '/definitions/what-is-an-ai-research-agent'],
                    ['What is an AI Marketing Agent?', '/definitions/what-is-an-ai-marketing-agent'],
                    ['What is an AI Coding Agent?', '/definitions/what-is-an-ai-coding-agent'],
                    ['All definitions', '/definitions'],
                  ].map(([label, href]) => (
                    <a key={href} href={href} style={{ color: '#6B7280', fontSize: '0.8125rem', textDecoration: 'none' }}>{label}</a>
                  ))}
                </div>
              </div>

              <div>
                <p style={{ color: '#6B7280', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Compare</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[
                    ['Cursor vs GitHub Copilot', '/compare/cursor-vs-github-copilot'],
                    ['Intercom Fin vs Zendesk AI', '/compare/intercom-fin-vs-zendesk-ai'],
                    ['Gong vs Clari', '/compare/gong-vs-clari'],
                    ['Jasper vs Copy.ai', '/compare/jasper-vs-copy-ai'],
                    ['Perplexity vs ChatGPT Research', '/compare/perplexity-ai-vs-chatgpt-deep-research'],
                    ['All comparisons', '/compare'],
                  ].map(([label, href]) => (
                    <a key={href} href={href} style={{ color: '#6B7280', fontSize: '0.8125rem', textDecoration: 'none' }}>{label}</a>
                  ))}
                </div>
              </div>

              <div>
                <p style={{ color: '#6B7280', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Resources</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[
                    ['Compare Agents', '/compare'],
                    ['Guides', '/resources/guides'],
                    ['Newsletter', '/resources/newsletter'],
                    ['Submit an Agent', '/submit'],
                  ].map(([label, href]) => (
                    <a key={href} href={href} style={{ color: '#6B7280', fontSize: '0.8125rem', textDecoration: 'none' }}>{label}</a>
                  ))}
                </div>
              </div>

              <div>
                <p style={{ color: '#6B7280', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Integrations</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[
                    ['Best for HubSpot', '/integrations/hubspot'],
                    ['Best for Salesforce', '/integrations/salesforce'],
                    ['Best for Zapier', '/integrations/zapier'],
                    ['Best for Slack', '/integrations/slack'],
                  ].map(([label, href]) => (
                    <a key={href} href={href} style={{ color: '#6B7280', fontSize: '0.8125rem', textDecoration: 'none' }}>{label}</a>
                  ))}
                </div>
              </div>

              <div>
                <p style={{ color: '#6B7280', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Data</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[
                    ['/api/agents — JSON API', '/api/agents'],
                    ['/sitemap.xml', '/sitemap.xml'],
                    ['/search', '/search'],
                  ].map(([label, href]) => (
                    <a key={href} href={href} style={{ color: '#6B7280', fontSize: '0.75rem', textDecoration: 'none', fontFamily: 'monospace' }}>{label}</a>
                  ))}
                </div>
              </div>

            </div>

            <div style={{ borderTop: '1px solid #1F2937', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <p style={{ color: '#4B5563', fontSize: '0.75rem' }}>© 2026 The AI Agent Index. Built for humans and AI systems.</p>
              <p style={{ color: '#374151', fontSize: '0.7rem', marginTop: '0.25rem' }}>Some listings may contain affiliate links. This never influences our editorial ratings or placement.</p>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <a href="/privacy" style={{ color: '#4B5563', fontSize: '0.75rem', textDecoration: 'none' }}>Privacy Policy</a>
                <a href="/contact" style={{ color: '#4B5563', fontSize: '0.75rem', textDecoration: 'none' }}>Contact</a>
              </div>
              <p style={{ color: '#374151', fontSize: '0.75rem', fontFamily: 'monospace' }}>5 categories · public JSON API · updated daily</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}