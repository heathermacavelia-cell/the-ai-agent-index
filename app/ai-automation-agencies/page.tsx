export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { Agency } from '@/types/agency'
import AgencyListClient from '@/components/AgencyListClient'

const META_TITLE = 'Best AI Automation Agencies (2026)'
const META_DESC = 'Compare AI automation agencies: vetted firms that build AI agents, workflows, and chatbots for your business. Independent directory. Not affiliated.'
const PAGE_URL = 'https://theaiagentindex.com/ai-automation-agencies'

export const metadata: Metadata = {
  title: { absolute: META_TITLE },
  description: META_DESC,
  openGraph: {
    title: META_TITLE,
    description: META_DESC,
    url: PAGE_URL,
    type: 'website',
    siteName: 'The AI Agent Index',
  },
  twitter: { card: 'summary', title: META_TITLE, description: META_DESC },
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
    .order('is_featured', { ascending: false })
    .order('is_verified', { ascending: false })
    .order('rating_avg', { ascending: false })

  const agencyList = (agencies ?? []) as Agency[]

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
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* Hero */}
      <section style={{ backgroundColor: '#F0FDF4', borderBottom: '1px solid #BBF7D0', padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6B7280', marginBottom: '1.5rem' }}>
            <Link href="/" style={{ color: '#6B7280', textDecoration: 'none' }}>Home</Link>
            <span style={{ color: '#D1D5DB' }}>/</span>
            <span style={{ color: '#111827' }}>AI Automation Agencies</span>
          </nav>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '3.5rem', height: '3.5rem', backgroundColor: 'white', border: '1px solid #BBF7D0', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.5rem' }}>
              🏗️
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', margin: 0 }}>
                  AI Automation Agencies
                </h1>
                <span style={{ padding: '0.2rem 0.625rem', borderRadius: '9999px', fontSize: '0.6875rem', fontWeight: 700, backgroundColor: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Services
                </span>
              </div>
              <p style={{ color: '#6B7280', maxWidth: '680px', lineHeight: 1.6, fontSize: '0.9375rem' }}>
                Vetted firms that design, build, and deploy AI agents, workflow automations, and chatbots for your business.
                Unlike the AI agent software listed elsewhere on this site, these are services companies you hire to build custom solutions for your specific needs.
              </p>
            </div>
          </div>

          {/* Content grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
            <div style={{ background: 'white', border: '1px solid #BBF7D0', borderRadius: '0.75rem', padding: '1.25rem' }}>
              <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>What they do</p>
              <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.6 }}>
                AI automation agencies build custom AI-powered systems: chatbots trained on your product docs, workflow automations connecting your CRM to email to Slack, multi-agent systems that handle end-to-end business processes, and voice agents that answer calls 24/7.
              </p>
            </div>
            <div style={{ background: 'white', border: '1px solid #BBF7D0', borderRadius: '0.75rem', padding: '1.25rem' }}>
              <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Who hires them</p>
              <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.6 }}>
                SMBs and mid-market companies that know AI could help but lack internal technical resources to implement it. Common projects: automating lead intake, building custom support chatbots, connecting fragmented tool stacks, and deploying AI agents for specific department workflows.
              </p>
            </div>
            <div style={{ background: 'white', border: '1px solid #BBF7D0', borderRadius: '0.75rem', padding: '1.25rem' }}>
              <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>What to look for</p>
              <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.6 }}>
                Expertise with the specific tools in your stack, transparent project pricing, verifiable case studies, and a discovery process that understands your workflow before proposing a solution. Beware agencies selling generic ChatGPT wrappers without understanding your business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Listings */}
      <section style={{ padding: '2rem 1.5rem 4rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <AgencyListClient agencies={agencyList} />

          {/* CTA for agencies to get listed */}
          <div style={{ marginTop: '3rem', padding: '2rem', backgroundColor: '#F9FAFB', borderRadius: '0.75rem', border: '1px solid #E5E7EB', textAlign: 'center' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1.125rem', color: '#111827', marginBottom: '0.5rem' }}>Are you an AI automation agency?</h3>
            <p style={{ fontSize: '0.9375rem', color: '#6B7280', marginBottom: '1rem', maxWidth: '500px', margin: '0 auto 1rem' }}>
              Get listed in the directory for free. Verified listings with a trust badge are available for agencies that want to stand out.
            </p>
            <a href="/submit" style={{ display: 'inline-flex', alignItems: 'center', padding: '0.625rem 1.25rem', backgroundColor: '#059669', color: 'white', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 700, textDecoration: 'none' }}>
              Apply to be listed →
            </a>
          </div>

          {/* FAQ section */}
          <div style={{ marginTop: '4rem', paddingTop: '3rem', borderTop: '1px solid #E5E7EB' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '2rem', letterSpacing: '-0.01em' }}>
              Frequently asked questions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              {FAQS.map((faq, i) => (
                <div key={i} style={{ borderBottom: i < FAQS.length - 1 ? '1px solid #F3F4F6' : 'none', paddingBottom: i < FAQS.length - 1 ? '1.75rem' : 0 }}>
                  <h3 style={{ fontWeight: 600, color: '#111827', marginBottom: '0.625rem', fontSize: '1rem', lineHeight: 1.4 }}>{faq.q}</h3>
                  <p style={{ color: '#4B5563', fontSize: '0.9375rem', lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}