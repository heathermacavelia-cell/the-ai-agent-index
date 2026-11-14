import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { Libre_Franklin, Source_Serif_4 } from 'next/font/google'
import './globals.css'
import { EDITOR_PERSON } from '@/lib/editor'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { CompareProvider } from '@/components/CompareProvider'
import CompareBar from '@/components/CompareBar'
import ChunkLoadErrorHandler from '@/components/ChunkLoadErrorHandler'
import OutboundClickTracker from '@/components/OutboundClickTracker'
import PageViewTracker from '@/components/PageViewTracker'
import { categoryCountWord } from '@/lib/siteStats'

// The site named DM Sans in its CSS but never loaded it, so every visitor saw their device default.
const sans = Libre_Franklin({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-sans', display: 'swap' })
const serif = Source_Serif_4({ subsets: ['latin'], weight: ['600'], variable: '--font-serif', display: 'swap' })

const YEAR = new Date().getFullYear()
const CATS = categoryCountWord()

export const metadata: Metadata = {
  title: {
    default: `The AI Agent Index: AI Agent Directory, Checked at the Source (${YEAR})`,
    template: '%s',
  },
  description: `Compare business AI agents on facts checked at the vendor's own pages: pricing, integrations, security and data terms. Every audited listing is dated.`,
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://theaiagentindex.com'),
  openGraph: { siteName: 'The AI Agent Index', type: 'website', url: 'https://theaiagentindex.com', title: 'The AI Agent Index: AI Agent Directory, Checked at the Source', description: `Business AI agents compared on facts checked at the vendor's own pages: pricing, integrations, security and data terms. Every audited listing is dated.`, images: [{ url: 'https://theaiagentindex.com/og-image-2026-11.png', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', title: 'The AI Agent Index', description: 'Business AI agents compared on facts checked at the source, with dated verification and a public changelog.', images: ['https://theaiagentindex.com/og-image-2026-11.png'] },
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
  description: `Independent research index of business AI agents across ${CATS} categories. Every audited listing is checked against the vendor's own pricing, product, security and legal pages and shows the date it was last verified. Ratings cannot be bought, paid placements are labeled, and vendor changes are logged on a public changelog.`,
  // The real person who runs and edits the index (Heather 2026-11-07).
  founder: EDITOR_PERSON,
  // Official profiles only - each verified 2026-10-28. Add a profile here only once it exists.
  sameAs: [
    'https://www.linkedin.com/company/the-ai-agent-index',
    'https://x.com/AIAgentIndex',
    'https://www.producthunt.com/products/the-ai-agent-index',
    'https://betalist.com/startups/the-ai-agent-index',
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sans.variable + ' ' + serif.variable}>
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
          <PageViewTracker />
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
                      segment: { type: "string", description: "Filter by customer segment (company size): solo, smb, mid-market, enterprise, all. Legacy values b2c, b2b and both are still accepted." }
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