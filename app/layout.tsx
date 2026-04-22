import type { Metadata } from 'next'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { CompareProvider } from '@/components/CompareProvider'
import CompareBar from '@/components/CompareBar'

export const metadata: Metadata = {
  title: {
    default: 'The AI Agent Index — Structured Directory of AI Agents',
    template: '%s | The AI Agent Index',
  },
  description: 'The structured index of AI agents for business automation. Search, filter, and compare agents across sales, support, research, marketing, coding, and HR — dataset-first, machine-readable.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://theaiagentindex.com'),
  alternates: { canonical: 'https://theaiagentindex.com' },
  openGraph: { siteName: 'The AI Agent Index', type: 'website', url: 'https://theaiagentindex.com', title: 'The AI Agent Index — Structured Directory of AI Agents', description: 'The structured directory of AI agents for business automation. Dataset-first, machine-readable, designed to be cited by AI systems.', images: [{ url: 'https://theaiagentindex.com/og-image.png', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', title: 'The AI Agent Index', description: 'The structured directory of AI agents for business automation.', images: ['https://theaiagentindex.com/og-image.png'] },
  robots: { index: true, follow: true },
  verification: { other: { 'impact-site-verification': '4142fa95-5ba0-4964-87fb-02dcad139626' } },
  icons: { icon: '/favicon.svg', shortcut: '/favicon.svg' },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'The AI Agent Index',
  url: 'https://theaiagentindex.com',
  logo: 'https://theaiagentindex.com/favicon.svg',
  description: 'The structured, dataset-first directory of AI agents for business automation. Machine-readable by design, built to be cited by AI systems.',
  sameAs: [
    'https://x.com/AIAgentIndex',
    'https://www.linkedin.com/company/the-ai-agent-index',
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-gray-50">
        <CompareProvider>
          <Header />
          <GoogleAnalytics />
          <main>{children}</main>
          <Footer />
          <CompareBar />
        </CompareProvider>
        <script dangerouslySetInnerHTML={{ __html: `
          if (typeof navigator !== 'undefined' && navigator.modelContext) {
            navigator.modelContext.provideContext({
              tools: [
                {
                  name: "search_agents",
                  description: "Search The AI Agent Index directory for AI agents by category, industry, pricing, or keyword. Returns structured agent data including name, developer, pricing, editorial rating, and description.",
                  inputSchema: {
                    type: "object",
                    properties: {
                      category: { type: "string", description: "Filter by category: ai-sales-agents, ai-customer-support-agents, ai-research-agents, ai-marketing-agents, ai-coding-agents, ai-hr-agents" },
                      industry: { type: "string", description: "Filter by industry tag: saas, ecommerce, real-estate, legal, finance, healthcare, b2b, enterprise, smb, startups" },
                      pricing: { type: "string", description: "Filter by pricing model: free, freemium, subscription, usage-based, custom" },
                      segment: { type: "string", description: "Filter by customer segment: b2c, smb, b2b, enterprise" }
                    }
                  },
                  execute: async function(params) {
                    var url = "/api/agents?";
                    if (params.category) url += "category=" + params.category + "&";
                    if (params.industry) url += "industry=" + params.industry + "&";
                    if (params.pricing) url += "pricing=" + params.pricing + "&";
                    if (params.segment) url += "segment=" + params.segment + "&";
                    var res = await fetch(url);
                    return await res.json();
                  }
                }
              ]
            });
          }
        `}} />
      </body>
    </html>
  )
}
