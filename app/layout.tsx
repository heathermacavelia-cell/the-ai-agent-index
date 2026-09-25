import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { CompareProvider } from '@/components/CompareProvider'
import CompareBar from '@/components/CompareBar'
import ChunkLoadErrorHandler from '@/components/ChunkLoadErrorHandler'
import OutboundClickTracker from '@/components/OutboundClickTracker'

export const metadata: Metadata = {
  title: {
    default: 'The AI Agent Index: AI Agent Directory and Reviews (2026)',
    template: '%s',
  },
  description: 'Compare AI agents for sales, support, coding, marketing, and HR. Independent reviews with verified pricing and integrations. Free to search. Not affiliated.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://theaiagentindex.com'),
  openGraph: { siteName: 'The AI Agent Index', type: 'website', url: 'https://theaiagentindex.com', title: 'The AI Agent Index: AI Agent Directory and Reviews', description: 'Compare AI agents for sales, support, coding, marketing, and HR. Independent reviews with verified pricing and integrations. Free to search.', images: [{ url: 'https://theaiagentindex.com/og-image.png', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', title: 'The AI Agent Index', description: 'Compare AI agents with independent reviews, verified pricing, and integrations.', images: ['https://theaiagentindex.com/og-image.png'] },
  robots: { index: true, follow: true },
  verification: { other: { 'impact-site-verification': '4142fa95-5ba0-4964-87fb-02dcad139626' } },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180' }],
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://theaiagentindex.com/#organization',
  name: 'The AI Agent Index',
  alternateName: ['AI Agent Index', 'theaiagentindex.com'],
  url: 'https://theaiagentindex.com',
  logo: 'https://theaiagentindex.com/icon.png',
  description: 'Independent AI agent directory. Compare agents for sales, support, coding, marketing, and HR by capability, pricing, and integrations.',
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
        <ChunkLoadErrorHandler />
        <CompareProvider>
          <Header />
          <Analytics />
          <OutboundClickTracker />
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
                      category: { type: "string", description: "Filter by category: ai-sales-agents, ai-customer-support-agents, ai-research-agents, ai-marketing-agents, ai-coding-agents, ai-hr-agents, ai-workflow-agents, ai-customer-success-agents" },
                      industry: { type: "string", description: "Filter by industry vertical - the customer's line of business. One of: automotive, bpo, construction, consulting, cybersecurity, ecommerce, education, energy, finance, fitness, franchise, gaming, healthcare, hospitality, insurance, legal, local-services, logistics, manufacturing, marketing, media, nonprofits, pharma, public-sector, real-estate, research, retail, telecom, travel" },
                      audience: { type: "string", description: "Filter by audience - company shape or buying context, not industry. One of: b2b, b2c, saas, dtc, enterprise, mid-market, smb, startups, solo-professionals, agencies, devtools, open-source, cloud, aws" },
                      pricing: { type: "string", description: "Filter by pricing model: free, freemium, subscription, usage-based, custom" },
                      segment: { type: "string", description: "Filter by customer segment: b2c, smb, b2b, enterprise" }
                    }
                  },
                  execute: async function(params) {
                    var url = "/api/agents?";
                    if (params.category) url += "category=" + params.category + "&";
                                     if (params.industry) url += "industry=" + params.industry + "&";
                    if (params.audience) url += "audience=" + params.audience + "&";
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