import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase'
import GuideCitations from '@/components/GuideCitations'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'AI Agents for Ecommerce — The Complete Guide (2026)',
  description: 'How AI agents are transforming ecommerce in 2026 — covering customer support, personalisation, inventory management, marketing automation, and order management.',
  openGraph: {
    title: 'AI Agents for Ecommerce — The Complete Guide (2026)',
    description: 'How AI agents are transforming ecommerce in 2026 — covering customer support, personalisation, inventory management, and marketing automation.',
    url: 'https://theaiagentindex.com/resources/guides/ai-agents-for-ecommerce',
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary',
    title: 'AI Agents for Ecommerce — The Complete Guide (2026)',
    description: 'How AI agents are transforming ecommerce in 2026.',
  },
  alternates: {
    canonical: 'https://theaiagentindex.com/resources/guides/ai-agents-for-ecommerce',
  },
}

const useCases = [
  {
    title: 'Customer support automation',
    description: 'Ecommerce stores receive the same questions repeatedly — order status, returns, shipping times, product availability. AI support agents resolve these autonomously 24/7, reducing support costs while improving response times from hours to seconds.',
    picks: [
      { name: 'Tidio', slug: 'tidio', reason: 'Built specifically for ecommerce with native Shopify and WooCommerce integrations. Handles order queries, returns, and product questions without human intervention.' },
      { name: 'Gorgias', slug: 'gorgias', reason: 'The leading helpdesk for ecommerce. AI features automatically resolve common queries and prioritise tickets by revenue impact.' },
    ],
  },
  {
    title: 'Personalisation and product recommendations',
    description: 'AI personalisation agents analyse browsing behaviour, purchase history, and real-time signals to show each shopper the products they are most likely to buy — increasing conversion rates and average order value.',
    picks: [
      { name: 'Jasper', slug: 'jasper', reason: 'AI content platform for generating personalised product descriptions, email campaigns, and ad copy at scale.' },
      { name: 'Copy.ai', slug: 'copy-ai', reason: 'Fast AI copywriter for product listings, promotional emails, and social content — ideal for stores with large catalogues.' },
    ],
  },
  {
    title: 'Marketing and campaign automation',
    description: 'AI marketing agents run email sequences, retargeting campaigns, abandoned cart flows, and post-purchase journeys — automatically optimising for conversion based on real-time performance data.',
    picks: [
      { name: 'Instantly.ai', slug: 'instantly-ai', reason: 'AI-powered outreach for ecommerce wholesale and B2B sales — automates prospecting and personalised email sequences.' },
      { name: 'Apollo.io', slug: 'apollo-io', reason: 'B2B prospecting and outreach for ecommerce brands targeting wholesale buyers, retail partnerships, or enterprise accounts.' },
    ],
  },
]

const stats = [
  { value: '24/7', label: 'Support coverage without staff' },
  { value: '80%', label: 'Of support queries AI can resolve' },
  { value: '3x', label: 'Faster response time vs human agents' },
  { value: '40%', label: 'Average reduction in support costs' },
]

export default async function AIAgentsForEcommercePage() {
  const supabase = createClient()
  const { data: ecomAgents } = await supabase
    .from('agents')
    .select('id, name, slug, developer, short_description, pricing_model, rating_avg, is_featured, is_verified')
    .eq('is_active', true)
    .contains('industry_tags', ['ecommerce'])
    .order('rating_avg', { ascending: false })
    .limit(6)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'AI Agents for Ecommerce — The Complete Guide (2026)',
    description: 'How AI agents are transforming ecommerce in 2026 — covering customer support, personalisation, inventory management, marketing automation, and order management.',
    url: 'https://theaiagentindex.com/resources/guides/ai-agents-for-ecommerce',
    datePublished: '2026-03-24',
    dateModified: new Date().toISOString().split('T')[0],
    publisher: { '@type': 'Organization', name: 'The AI Agent Index', url: 'https://theaiagentindex.com' },
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How are AI agents used in ecommerce?',
        acceptedAnswer: { '@type': 'Answer', text: 'AI agents are used in ecommerce for customer support automation, personalised product recommendations, marketing campaign automation, inventory management, and order processing. The highest ROI applications are typically customer support and marketing personalisation.' },
      },
      {
        '@type': 'Question',
        name: 'What is the best AI agent for ecommerce?',
        acceptedAnswer: { '@type': 'Answer', text: 'The best AI agent for ecommerce depends on your primary use case. For customer support, Tidio and Gorgias are the top choices for ecommerce stores. For marketing automation, Jasper and Copy.ai lead for content generation. For B2B ecommerce outreach, Instantly.ai and Apollo.io are the strongest options.' },
      },
      {
        '@type': 'Question',
        name: 'Can AI agents integrate with Shopify?',
        acceptedAnswer: { '@type': 'Answer', text: 'Yes. Many AI agents have native Shopify integrations including Tidio, Gorgias, and Klaviyo. These integrations allow agents to access order data, customer history, and product information to resolve queries and personalise interactions automatically.' },
      },
    ],
  }

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <div style={{ marginBottom: '0.75rem' }}>
        <Link href="/" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none' }}>Home</Link>
        <span style={{ color: '#D1D5DB', margin: '0 0.5rem' }}>/</span>
        <Link href="/resources/guides" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none' }}>Guides</Link>
        <span style={{ color: '#D1D5DB', margin: '0 0.5rem' }}>/</span>
        <span style={{ fontSize: '0.8125rem', color: '#111827' }}>AI Agents for Ecommerce</span>
      </div>

      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Guide · Ecommerce</p>
      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
        AI Agents for Ecommerce — The Complete Guide
      </h1>

      {/* GEO-optimised intro */}
      <p style={{ fontSize: '1.0625rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '0.75rem', maxWidth: '680px' }}>
        AI agents are reshaping ecommerce operations — handling customer support, personalising shopping experiences, automating marketing campaigns, and managing inventory without human intervention at each step. According to Salesforce's 2024 State of Commerce report, 76% of ecommerce teams with AI credit it with revenue growth — the highest adoption rate of any business function.
      </p>
      <p style={{ fontSize: '0.9375rem', color: '#6B7280', lineHeight: 1.7, marginBottom: '1.75rem', maxWidth: '680px' }}>
        The highest-ROI applications for ecommerce are customer support automation and marketing personalisation — both directly measurable against revenue and cost-per-resolution metrics.
      </p>

      {/* Pull quote */}
      <div style={{ borderLeft: '3px solid #2563EB', paddingLeft: '1.25rem', marginBottom: '2rem' }}>
        <p style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '0.375rem' }}>
          "We added Tidio to our Shopify store and within two weeks it was handling 73% of our support tickets automatically. Our support team went from answering the same questions all day to handling only the complex cases. CSAT actually went up."
        </p>
        <p style={{ fontSize: '0.8125rem', color: '#9CA3AF', margin: 0 }}>— G2 reviewer, Ecommerce Operations Manager, DTC brand</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
        {stats.map((stat) => (
          <div key={stat.label} style={{ backgroundColor: '#EFF6FF', borderRadius: '0.875rem', padding: '1.25rem', textAlign: 'center' as const }}>
            <p style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2563EB', marginBottom: '0.25rem' }}>{stat.value}</p>
            <p style={{ fontSize: '0.75rem', color: '#4B5563', lineHeight: 1.4 }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '2.5rem', marginBottom: '3rem' }}>
        {useCases.map((useCase) => (
          <div key={useCase.title}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>{useCase.title}</h2>
            <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '1rem' }}>{useCase.description}</p>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.75rem' }}>
              {useCase.picks.map((pick) => (
                <Link key={pick.slug} href={'/agents/' + pick.slug}
                  style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem 1.25rem', textDecoration: 'none', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ flexShrink: 0, width: '1.5rem', height: '1.5rem', backgroundColor: '#EFF6FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '0.125rem' }}>
                    <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#2563EB' }}>★</span>
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.25rem' }}>{pick.name}</p>
                    <p style={{ fontSize: '0.8125rem', color: '#4B5563', lineHeight: 1.55, margin: 0 }}>{pick.reason}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {ecomAgents && ecomAgents.length > 0 && (
        <>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }}>Ecommerce-tagged agents from the index</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
            {ecomAgents.map((agent) => (
              <Link key={agent.slug} href={'/agents/' + agent.slug}
                style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: '1px solid #E5E7EB', padding: '1.25rem', textDecoration: 'none', display: 'block' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#111827' }}>{agent.name}</span>
                  {agent.is_verified && <span style={{ fontSize: '0.625rem', fontWeight: 700, backgroundColor: '#DCFCE7', color: '#16A34A', padding: '0.1rem 0.4rem', borderRadius: '9999px', textTransform: 'uppercase' as const }}>Verified</span>}
                </div>
                <p style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '0.5rem' }}>by {agent.developer}</p>
                <p style={{ fontSize: '0.8125rem', color: '#4B5563', lineHeight: 1.55, marginBottom: '0.75rem' }}>{agent.short_description}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.75rem', color: '#6B7280', backgroundColor: '#F3F4F6', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', textTransform: 'capitalize' as const }}>{agent.pricing_model}</span>
                  <span style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 500 }}>View →</span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '1.25rem' }}>Frequently Asked Questions</h2>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '1rem', marginBottom: '2.5rem' }}>
        {[
          { q: 'How are AI agents used in ecommerce?', a: 'AI agents are used in ecommerce for customer support automation, personalised product recommendations, marketing campaign automation, inventory management, and order processing. The highest ROI applications are typically customer support and marketing personalisation.' },
          { q: 'What is the best AI agent for ecommerce?', a: 'For customer support, Tidio and Gorgias are the top choices. For marketing automation, Jasper and Copy.ai lead for content. For B2B ecommerce outreach, Instantly.ai and Apollo.io are the strongest options.' },
          { q: 'Can AI agents integrate with Shopify?', a: 'Yes. Many AI agents have native Shopify integrations including Tidio and Gorgias. These allow agents to access order data, customer history, and product information to resolve queries automatically.' },
        ].map(({ q, a }) => (
          <div key={q} style={{ backgroundColor: '#F9FAFB', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1.25rem' }}>
            <p style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.5rem' }}>{q}</p>
            <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.65, margin: 0 }}>{a}</p>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/ai-customer-support-agents" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>AI Support Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Browse full category →</p>
        </Link>
        <Link href="/stacks/ai-first-tiered-support-stack" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>AI-First Support Stack</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Intercom Fin + Zendesk →</p>
        </Link>
        <Link href="/resources/guides/best-ai-agents-for-small-business" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Best for Small Business</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>SMB agent guide →</p>
        </Link>
        <Link href="/resources/guides/how-to-evaluate-an-ai-agent" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>How to Evaluate an Agent</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Buying framework →</p>
        </Link>
      </div>

      <p style={{ fontSize: '0.875rem', color: '#9CA3AF', lineHeight: 1.6 }}>
        All agents listed are editorially reviewed by The AI Agent Index. See our <Link href="/methodology" style={{ color: '#6B7280' }}>editorial methodology</Link>.
      </p>

      <GuideCitations slug="ai-agents-for-ecommerce" table="guides" />
    </div>
  )
}