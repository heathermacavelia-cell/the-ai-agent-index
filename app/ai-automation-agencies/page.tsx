export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { Agency } from '@/types/agency'
import AgencyListClient from '@/components/AgencyListClient'
import NewsletterSignup from '@/components/NewsletterSignup'
import { toPublicAgency } from '@/lib/agencyTier'
import { AGENCY_REVIEW_PRICE } from '@/lib/vendorPlans'

const META_TITLE = `Best AI Automation Agencies (${new Date().getFullYear()})`
const META_DESC = 'Compare AI automation agencies: vetted firms that build AI agents, workflows, and chatbots for your business. Independent directory. Not affiliated.'
const PAGE_URL = 'https://theaiagentindex.com/ai-automation-agencies'

export const metadata: Metadata = {
  title: { absolute: META_TITLE },
  description: META_DESC,
  openGraph: { images: [{ url: 'https://theaiagentindex.com/og-image-2026-11.png', width: 1200, height: 630 }],
    title: META_TITLE,
    description: META_DESC,
    url: PAGE_URL,
    type: 'website',
    siteName: 'The AI Agent Index',
  },
  twitter: { images: ['https://theaiagentindex.com/og-image-2026-11.png'],  card: 'summary', title: META_TITLE, description: META_DESC },
  alternates: { canonical: PAGE_URL },
}

const FAQS = [
  {
    q: 'What is an AI automation agency?',
    a: 'An AI automation agency is a services firm that designs, builds, and deploys AI-powered systems for business clients. They build custom AI agents, chatbots, workflow automations, and integrations using tools like Make, n8n, Zapier, LangChain, and direct LLM APIs. Unlike software products you buy off the shelf, agencies build solutions tailored to your specific business processes and existing tool stack.',
  },
  {
    q: 'How much does it cost to hire an AI automation agency?',
    a: 'AI automation project pricing varies by complexity. Simple workflow automations connecting a few tools typically run $500 to $5,000. Mid-range projects like custom AI chatbots integrated with your product database and CRM range from $5,000 to $25,000. Complex multi-agent systems with custom model integrations can exceed $50,000. Many agencies also offer ongoing retainers from $500 to $5,000 per month for monitoring and optimization.',
  },
  {
    q: 'How do I choose the right AI automation agency?',
    a: 'Look for agencies with demonstrated expertise in your specific use case (not just general AI experience), transparent pricing, verifiable client references or case studies, and familiarity with the tools already in your stack. Ask for a discovery call before committing, and be wary of agencies that promise results without understanding your current processes.',
  },
  {
    q: 'What is the difference between an AI automation agency and buying AI software?',
    a: 'AI software products (like the AI agents listed elsewhere on this site) are ready-made tools you configure yourself. AI automation agencies build custom solutions specifically for your business. Agencies are typically the right choice when your workflow is too specific for off-the-shelf tools, when you need deep integration with legacy systems, or when you lack internal technical resources to implement AI tools yourself.',
  },
  {
    q: 'What should I prepare before contacting an AI automation agency?',
    a: 'Document your current process step by step, identify the specific bottleneck or manual task you want to automate, list the tools and systems the solution needs to connect to, and define what success looks like (time saved, errors reduced, response time improved). Agencies give better proposals and more accurate pricing when the problem is clearly defined.',
  },
]

export default async function AgencyCategoryPage() {
  const supabase = createClient()
  const { data: agencies } = await supabase
    .from('agencies')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  // Private columns stripped before the rows reach the client (2026-09-21c).
  const agencyList = ((agencies ?? []) as Agency[]).map(toPublicAgency)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: META_TITLE,
    description: META_DESC,
    url: PAGE_URL,
    numberOfItems: agencyList.length,
    itemListElement: agencyList.slice(0, 10).map((a, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'ProfessionalService',
        name: a.name,
        description: a.short_description,
        url: 'https://theaiagentindex.com/agencies/' + a.slug,
      },
    })),
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  }

  return (
    <div className="cp">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section className="cp-band ag-band">
        <div className="hp-wrap">
          <nav className="cp-crumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>AI Automation Agencies</span>
          </nav>
          <p className="ag-kicker">The companion directory to <Link href="/" className="ag-green">The AI Agent Index</Link></p>
          <h1 className="cp-h1">AI Automation Agencies</h1>
          <p className="cp-intro">Want an AI agent built for you instead of buying one off the shelf? Compare {agencyList.length} firms by what they build, the tools they use, where they work and the smallest project they take.</p>
        </div>
      </section>

      <section className="cp-list">
        <div className="hp-wrap">
          <AgencyListClient agencies={agencyList} />
        </div>
      </section>

      <section className="hp-section-64 hp-tint">
        <div className="hp-wrap">
          <h2 className="hp-h2 hp-mb">Buy an agent or hire an agency?</h2>
          <div className="ag-compare">
            <div>
              <h3>Buy an AI agent</h3>
              <p>Ready-made software you set up yourself. A good fit when an existing product already does the job and your team can configure it.</p>
              <Link href="/" className="hp-link">Browse AI agents</Link>
            </div>
            <div>
              <h3>Hire an agency</h3>
              <p>A firm builds a custom solution for your business. A good fit when your process is specific or nobody on your team has the time to set it up.</p>
              <Link href="/resources/guides/how-to-evaluate-an-ai-agent" className="hp-link">How to evaluate an AI agent</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="hp-section-64">
        <div className="hp-wrap">
          <div className="cp-three" style={{ borderTop: 0, marginTop: 0, paddingTop: 0 }}>
            <div><h2>What they do</h2><p>AI automation agencies build custom AI-powered systems: chatbots trained on your product docs, workflow automations connecting your CRM to email to Slack, multi-agent systems that handle end-to-end business processes, and voice agents that answer calls 24/7.</p></div>
            <div><h2>Who hires them</h2><p>SMBs and mid-market companies that know AI could help but lack internal technical resources to implement it. Common projects: automating lead intake, building custom support chatbots, connecting fragmented tool stacks, and deploying AI agents for specific department workflows.</p></div>
            <div><h2>What to look for</h2><p>Expertise with the specific tools in your stack, transparent project pricing, verifiable case studies, and a discovery process that understands your workflow before proposing a solution. Beware agencies selling generic ChatGPT wrappers without understanding your business.</p></div>
          </div>
          <div className="cp-article cp-article-rule" style={{ paddingBlock: '40px 0' }}>
            <div className="hp-min0">
              <h2 className="cp-faq-title">Frequently asked questions</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                {FAQS.map((faq, i) => (
                  <div key={i} style={{ borderBottom: i < FAQS.length - 1 ? '1px solid #E2E5EA' : 'none', paddingBottom: i < FAQS.length - 1 ? '1.75rem' : 0 }}>
                    <h3 style={{ fontWeight: 600, color: '#111827', marginBottom: '0.625rem', fontSize: '1rem', lineHeight: 1.4 }}>{faq.q}</h3>
                    <p style={{ color: '#374151', fontSize: '1rem', lineHeight: 1.6 }}>{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
            <aside>
              <div className="cp-rail-guides">
                <h2 className="hp-h3-lg">Are you an AI automation agency?</h2>
              <p className="hp-body">Get listed in the directory for free. For {AGENCY_REVIEW_PRICE} one-time, an Independently Reviewed listing adds a full editorial review of your agency, the Independently Reviewed badge, placement above free listings, and your own logo on your card and page.</p>
              <a href="/submit-agency" className="ag-green hp-strong">Apply to be listed</a>
              </div>
              <div className="cp-rail-sticky"><NewsletterSignup sourcePage="/ai-automation-agencies" sourceType="other" /></div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
}