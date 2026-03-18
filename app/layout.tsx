import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'The AI Agent Index — Structured Directory of AI Agents',
    template: '%s | The AI Agent Index',
  },
  description:
    'The structured index of AI agents for business automation. Search, filter, and compare agents across sales, support, research, marketing, and coding — dataset-first, machine-readable.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://theaiagentindex.com'),
  openGraph: {
    siteName: 'The AI Agent Index',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        {/* Top nav */}
        <header className="bg-gray-950 border-b border-gray-800 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              <a href="/" className="flex items-center gap-2.5 group">
                <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 1L12.5 4V10L7 13L1.5 10V4L7 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                    <circle cx="7" cy="7" r="1.5" fill="white"/>
                  </svg>
                </div>
                <span className="text-white font-semibold text-sm tracking-tight">
                  AI Agent Index
                </span>
              </a>

              <nav className="hidden md:flex items-center gap-6">
                <a href="/ai-sales-agents" className="text-gray-400 hover:text-white text-sm transition-colors">Sales</a>
                <a href="/ai-customer-support-agents" className="text-gray-400 hover:text-white text-sm transition-colors">Support</a>
                <a href="/ai-research-agents" className="text-gray-400 hover:text-white text-sm transition-colors">Research</a>
                <a href="/ai-marketing-agents" className="text-gray-400 hover:text-white text-sm transition-colors">Marketing</a>
                <a href="/ai-coding-agents" className="text-gray-400 hover:text-white text-sm transition-colors">Coding</a>
              </nav>

              
           <a href="/api/agents"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 text-xs font-mono transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"/>
                JSON API
              </a>
            </div>
          </div>
        </header>

        <main>{children}</main>

        <footer className="bg-gray-950 border-t border-gray-800 mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                      <path d="M7 1L12.5 4V10L7 13L1.5 10V4L7 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                      <circle cx="7" cy="7" r="1.5" fill="white"/>
                    </svg>
                  </div>
                  <span className="text-white font-semibold text-sm">AI Agent Index</span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">
                  The structured, dataset-first directory of AI agents for business automation. Machine-readable by design.
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-3">Categories</p>
                <ul className="space-y-2">
                  {[
                    ['AI Sales Agents', '/ai-sales-agents'],
                    ['AI Customer Support', '/ai-customer-support-agents'],
                    ['AI Research Agents', '/ai-research-agents'],
                    ['AI Marketing Agents', '/ai-marketing-agents'],
                    ['AI Coding Agents', '/ai-coding-agents'],
                  ].map(([label, href]) => (
                    <li key={href}>
                      <a href={href} className="text-gray-500 hover:text-gray-300 text-sm transition-colors">{label}</a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-3">Data</p>
                <ul className="space-y-2">
                  <li>
                    <a href="/api/agents" className="text-gray-500 hover:text-gray-300 text-sm transition-colors font-mono">
                      /api/agents — JSON API
                    </a>
                  </li>
                  <li>
                    <a href="/sitemap.xml" className="text-gray-500 hover:text-gray-300 text-sm transition-colors font-mono">
                      /sitemap.xml
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <p className="text-gray-600 text-xs">© 2026 The AI Agent Index. Built for humans and AI systems.</p>
              <p className="text-gray-700 text-xs font-mono">50 agents indexed · 5 categories · public JSON API</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
