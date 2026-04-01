import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase'
import GuideCitations from '@/components/GuideCitations'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Best AI Agents for Small Business (2026)',
  description: 'The best AI agents for small businesses in 2026 — covering sales, customer support, marketing, and operations automation without enterprise budgets.',
  openGraph: {
    title: 'Best AI Agents for Small Business (2026)',
    description: 'The best AI agents for small businesses in 2026 — covering sales, customer support, marketing, and operations automation without enterprise budgets.',
    url: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-small-business',
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary',
    title: 'Best AI Agents for Small Business (2026)',
    description: 'The best AI agents for small businesses without enterprise budgets.',
  },
  alternates: {
    canonical: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-small-business',
  },
}

const categories = [
  {
    title: 'AI sales agents for small business',
    description: 'Small businesses often cannot afford a full sales team. AI sales agents handle prospecting, outreach, and follow-up autonomously — giving a team of 2 the output of a team of 10.',
    slug: 'ai-sales-agents',
    picks: [
      { name: 'Instantly.ai', slug: 'instantly-ai', reason: 'Best cold email platform for small teams — unlimited sending accounts, strong deliverability, starts at $37/month.' },
      { name: 'Apollo.io', slug: 'apollo-io', reason: 'B2B prospecting database plus sequencing. Freemium tier generous enough for early-stage outbound.' },
    ],
  },
  {
    title: 'AI customer support agents for small business',
    description: 'A small business cannot staff a support team 24/7. AI support agents resolve common queries instantly, escalate complex issues, and never take a day off.',
    slug: 'ai-customer-support-agents',
    picks: [
      { name: 'Intercom Fin', slug: 'intercom-fin', reason: 'Resolves up to 80% of support queries autonomously. Seamless handoff to human agents when needed.' },
      { name: 'Tidio', slug: 'tidio', reason: 'Affordable AI chat and support agent built for SMBs. Strong ecommerce integrations.' },
    ],
  },
  {
    title: 'AI marketing agents for small business',
    description: 'Marketing is the function most commonly understaffed in small businesses. AI marketing agents generate content, run campaigns, and optimise performance — without a full marketing team.',
    slug: 'ai-marketing-agents',
    picks: [
      { name: 'Jasper', slug: 'jasper', reason: 'AI content generation for blogs, ads, and social — trained on proven marketing frameworks.' },
      { name: 'Copy.ai', slug: 'copy-ai', reason: 'Fast marketing copy for any format. Generous free tier makes it ideal for bootstrapped businesses.' },
    ],
  },
  {
    title: 'AI research agents for small business',
    description: 'Small business owners wear many hats. AI research agents handle competitive intelligence, market research, and literature review — saving hours of manual work each week.',
    slug: 'ai-research-agents',
    picks: [
      { name: 'Perplexity AI', slug: 'perplexity-ai', reason: 'Real-time web research with citations. Replaces hours of manual Googling for market and competitor research.' },
      { name: 'ChatGPT Deep Research', slug: 'chatgpt-deep-research', reason: 'Multi-step research agent that synthesises sources into structured reports.' },
    ],
  },
]

const criteria = [
  { label: 'Affordable pricing', desc: 'Look for freemium tiers or plans under $100/month. Enterprise pricing is rarely justified for teams under 10.' },
  { label: 'Easy deployment', desc: 'Avoid agents requiring engineering resource to set up. The best SMB agents are live in hours, not weeks.' },
  { label: 'Integrates with your stack', desc: 'Prioritise agents that connect natively to tools you already use — Gmail, Slack, HubSpot, Shopify.' },
  { label: 'Measurable ROI', desc: 'Every agent you pay for should save more time than it costs. Calculate: (hours saved per week x your hourly rate) vs monthly cost.' },
]

export default async function BestAIAgentsForSmallBusinessPage() {
  const supabase = createClient()
  const { data: smbAgents } = await supabase
    .from('agents')
    .select('id, name, slug, developer, short_description, pricing_model, rating_avg, is_featured, is_verified, capability_tags')
    .eq('is_active', true)
    .contains('industry_tags', ['smb'])
    .order('rating_avg', { ascending: false })
    .limit(6)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Best AI Agents for Small Business (2026)',
    description: 'The best AI agents for small businesses in 2026 — covering sales, customer support, marketing, and operations automation without enterprise budgets.',
    url: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-small-business',
    datePublished: '2026-03-24',
    dateModified: '2026-03-24',
    publisher: {
      '@type': 'Organization',
      name: 'The AI Agent Index',
      url: 'https://theaiagentindex.com',
    },
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What are the best AI agents for small businesses?',
        acceptedAnswer: { '@type': 'Answer', text: 'The best AI agents for small businesses in 2026 include Instantly.ai for outbound sales, Intercom Fin for customer support, Jasper for marketing content, and Perplexity AI for research. The right choice depends on which function is most understaffed in your business.' },
      },
      {
        '@type': 'Question',
        name: 'Can small businesses afford AI agents?',
        acceptedAnswer: { '@type': 'Answer', text: 'Yes. Many AI agents have freemium tiers or plans starting under $50/month. The ROI calculation is straightforward — if an agent saves 5 hours per week at $50/hour, it delivers $1,000/month in value for a fraction of that cost.' },
      },
      {
        '@type': 'Question',
        name: 'How do AI agents help small businesses?',
        acceptedAnswer: { '@type': 'Answer', text: 'AI agents help small businesses by automating repetitive tasks that would otherwise require hiring. A small team with the right AI agents can handle sales outreach, customer support, content creation, and research that would typically require 2-3 full-time employees.' },
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
        <span style={{ fontSize: '0.8125rem', color: '#111827' }}>Best AI Agents for Small Business</span>
      </div>

      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Guide · Small Business</p>
      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
        Best AI Agents for Small Business (2026)
      </h1>
      <p style={{ fontSize: '1.0625rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '680px' }}>
        The right AI agents give a small team the output of a much larger one. This guide covers the best AI agents across every business function — chosen specifically for small businesses that need results without enterprise budgets or engineering teams.
      </p>

      <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#0369A1', lineHeight: 1.6, margin: 0 }}>
          <strong>How to use this guide:</strong> Start with the function that is most understaffed in your business. One well-chosen agent in the right area delivers more value than three mediocre agents spread across everything.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', marginBottom: '3rem' }}>
        {categories.map((cat) => (
          <div key={cat.title}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', margin: 0, textTransform: 'capitalize' }}>{cat.title}</h2>
              <Link href={'/' + cat.slug} style={{ fontSize: '0.8125rem', color: '#2563EB', textDecoration: 'none', fontWeight: 500, flexShrink: 0, marginLeft: '1rem' }}>Browse all →</Link>
            </div>
            <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '1rem' }}>{cat.description}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {cat.picks.map((pick) => (
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

      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>How to evaluate AI agents as a small business</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem' }}>
        {criteria.map((item) => (
          <div key={item.label} style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1rem 1.25rem', display: 'flex', gap: '1rem' }}>
            <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#2563EB', flexShrink: 0, minWidth: '160px' }}>{item.label}</span>
            <span style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.6 }}>{item.desc}</span>
          </div>
        ))}
      </div>

      {smbAgents && smbAgents.length > 0 && (
        <>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }}>SMB-focused agents from the index</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
            {smbAgents.map((agent) => (
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
        {[
          { q: 'What are the best AI agents for small businesses?', a: 'The best AI agents for small businesses in 2026 include Instantly.ai for outbound sales, Intercom Fin for customer support, Jasper for marketing content, and Perplexity AI for research. The right choice depends on which function is most understaffed in your business.' },
          { q: 'Can small businesses afford AI agents?', a: 'Yes. Many AI agents have freemium tiers or plans starting under $50/month. If an agent saves 5 hours per week at $50/hour, it delivers $1,000/month in value for a fraction of that cost.' },
          { q: 'How do AI agents help small businesses?', a: 'AI agents help small businesses by automating repetitive tasks that would otherwise require hiring. A small team with the right AI agents can handle sales outreach, customer support, content creation, and research that would typically require 2-3 full-time employees.' },
        ].map(({ q, a }) => (
          <div key={q} style={{ backgroundColor: '#F9FAFB', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1.25rem' }}>
            <p style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.5rem' }}>{q}</p>
            <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.65, margin: 0 }}>{a}</p>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        <Link href="/ai-sales-agents" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>AI Sales Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Browse full category →</p>
        </Link>
        <Link href="/resources/guides/how-to-evaluate-an-ai-agent" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>How to Evaluate an Agent</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Buying framework →</p>
        </Link>
        <Link href="/resources/guides/best-ai-agents-for-outbound-sales" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Best for Outbound Sales</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Full sales agent guide →</p>
        </Link>
      </div>
      <GuideCitations slug="best-ai-agents-for-small-business" table="guides" />
    </div>
  )
}