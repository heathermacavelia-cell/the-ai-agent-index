import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Best AI Agents for Customer Support Teams (2026)',
  description: 'The best AI agents for customer support in 2026 — covering ticket resolution, live chat, escalation management, and omnichannel support automation.',
  openGraph: {
    title: 'Best AI Agents for Customer Support Teams (2026)',
    description: 'The best AI agents for customer support in 2026 — covering ticket resolution, live chat, escalation management, and omnichannel support automation.',
    url: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-customer-support',
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary',
    title: 'Best AI Agents for Customer Support Teams (2026)',
    description: 'The best AI agents for customer support covering ticket resolution, live chat, and omnichannel automation.',
  },
  alternates: {
    canonical: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-customer-support',
  },
}

const picks = [
  { name: 'Intercom Fin', slug: 'intercom-fin', tier: '#1', desc: 'The market leader in AI customer support. Fin resolves up to 80% of support queries autonomously across email, chat, and messaging channels. Seamless handoff to human agents with full context. Best for mid-market and enterprise teams already using Intercom.' },
  { name: 'Zendesk AI', slug: 'zendesk-ai', tier: '#2', desc: 'Enterprise-grade AI suite built into the Zendesk platform. Handles ticket triage, automated resolution, and agent assist. Best for large support operations that need deep customisation and compliance controls.' },
  { name: 'Sierra', slug: 'sierra', tier: '#3', desc: 'AI agent platform built specifically for high-stakes customer interactions. Strong governance controls and persistent agent memory make it ideal for financial services, healthcare, and regulated industries.' },
  { name: 'Tidio', slug: 'tidio', tier: '#4', desc: 'AI-powered chat and support agent built for SMBs and ecommerce. Quick to set up, strong Shopify integration, and aggressive pricing. Best for smaller teams that need results fast without enterprise complexity.' },
  { name: 'Decagon', slug: 'decagon', tier: '#5', desc: 'Next-generation AI support agent with advanced reasoning and escalation intelligence. Particularly strong for developer-facing products and technical support use cases.' },
]

const criteria = [
  { label: 'Resolution rate', desc: 'What percentage of tickets does the agent resolve without human intervention? Industry-leading agents achieve 60-80% autonomous resolution rates.' },
  { label: 'Escalation quality', desc: 'When the agent cannot resolve a query, how well does it hand off to a human? Good escalation includes full context, sentiment analysis, and suggested next steps.' },
  { label: 'Channel coverage', desc: 'Does the agent cover all the channels your customers use — email, live chat, SMS, WhatsApp, social? Omnichannel coverage matters as customers expect consistent service everywhere.' },
  { label: 'Integration depth', desc: 'How well does the agent connect to your CRM, order management, and product database? Agents with deeper integrations can resolve more complex queries autonomously.' },
  { label: 'Training and customisation', desc: 'How much work is required to train the agent on your specific products, policies, and tone? Faster time-to-value matters for time-constrained teams.' },
]

export default async function BestAIAgentsForCustomerSupportPage() {
  const supabase = createClient()
  const { data: supportAgents } = await supabase
    .from('agents')
    .select('id, name, slug, developer, short_description, pricing_model, rating_avg, is_featured, is_verified')
    .eq('is_active', true)
    .eq('primary_category', 'ai-customer-support-agents')
    .order('rating_avg', { ascending: false })
    .limit(6)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Best AI Agents for Customer Support Teams (2026)',
    description: 'The best AI agents for customer support in 2026 — covering ticket resolution, live chat, escalation management, and omnichannel support automation.',
    url: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-customer-support',
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
        name: 'What are the best AI agents for customer support?',
        acceptedAnswer: { '@type': 'Answer', text: 'The best AI agents for customer support in 2026 are Intercom Fin (best overall), Zendesk AI (best for enterprise), Sierra (best for regulated industries), Tidio (best for SMBs), and Decagon (best for technical support). The right choice depends on your team size, industry, and existing tool stack.' },
      },
      {
        '@type': 'Question',
        name: 'How much can AI agents reduce support costs?',
        acceptedAnswer: { '@type': 'Answer', text: 'Leading AI support agents resolve 60-80% of tickets autonomously, which directly reduces the volume requiring human agents. Most teams see 40-60% reduction in cost-per-ticket after deploying a well-configured AI support agent.' },
      },
      {
        '@type': 'Question',
        name: 'Will AI agents replace customer support teams?',
        acceptedAnswer: { '@type': 'Answer', text: 'AI agents handle the high-volume, repetitive queries that consume most support team capacity. Human agents shift to handling complex, sensitive, and high-value interactions that require judgment and empathy. Support teams typically do not shrink — they handle more volume with the same headcount.' },
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
        <span style={{ fontSize: '0.8125rem', color: '#111827' }}>Best AI Agents for Customer Support</span>
      </div>

      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Guide · Customer Support</p>
      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
        Best AI Agents for Customer Support Teams (2026)
      </h1>
      <p style={{ fontSize: '1.0625rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '680px' }}>
        AI support agents now resolve 60-80% of customer queries autonomously — without human intervention. This guide covers the best options in 2026, how to evaluate them, and what to expect from deployment.
      </p>

      <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#0369A1', lineHeight: 1.6, margin: 0 }}>
          <strong>Related:</strong> <Link href="/definitions/what-is-an-ai-customer-support-agent" style={{ color: '#2563EB' }}>What is an AI Customer Support Agent?</Link> — full definition covering capabilities, use cases, and evaluation criteria.
        </p>
      </div>

      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '1.25rem' }}>Top AI customer support agents</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
        {picks.map((pick) => (
          <Link key={pick.slug} href={'/agents/' + pick.slug}
            style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: '1px solid #E5E7EB', padding: '1.25rem', textDecoration: 'none', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ flexShrink: 0, minWidth: '2rem', height: '2rem', backgroundColor: '#EFF6FF', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#2563EB' }}>{pick.tier}</span>
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '1rem', color: '#111827', marginBottom: '0.375rem' }}>{pick.name}</p>
              <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.6, margin: 0 }}>{pick.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>How to evaluate AI support agents</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem' }}>
        {criteria.map((item) => (
          <div key={item.label} style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1rem 1.25rem', display: 'flex', gap: '1rem' }}>
            <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#2563EB', flexShrink: 0, minWidth: '140px' }}>{item.label}</span>
            <span style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.6 }}>{item.desc}</span>
          </div>
        ))}
      </div>

      {supportAgents && supportAgents.length > 0 && (
        <>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }}>All AI customer support agents</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            {supportAgents.map((agent) => (
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
          <Link href="/ai-customer-support-agents" style={{ fontSize: '0.875rem', color: '#2563EB', fontWeight: 500, display: 'inline-block', marginBottom: '2.5rem' }}>
            Browse all AI customer support agents →
          </Link>
        </>
      )}

      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '1.25rem' }}>Frequently Asked Questions</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
        {[
          { q: 'What are the best AI agents for customer support?', a: 'The best AI agents for customer support in 2026 are Intercom Fin (best overall), Zendesk AI (best for enterprise), Sierra (best for regulated industries), Tidio (best for SMBs), and Decagon (best for technical support).' },
          { q: 'How much can AI agents reduce support costs?', a: 'Leading AI support agents resolve 60-80% of tickets autonomously. Most teams see 40-60% reduction in cost-per-ticket after deploying a well-configured AI support agent.' },
          { q: 'Will AI agents replace customer support teams?', a: 'AI agents handle high-volume, repetitive queries. Human agents shift to complex, sensitive, and high-value interactions. Support teams typically handle more volume with the same headcount rather than shrinking.' },
        ].map(({ q, a }) => (
          <div key={q} style={{ backgroundColor: '#F9FAFB', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1.25rem' }}>
            <p style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.5rem' }}>{q}</p>
            <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.65, margin: 0 }}>{a}</p>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        <Link href="/ai-customer-support-agents" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>All Support Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Browse full category →</p>
        </Link>
        <Link href="/definitions/what-is-an-ai-customer-support-agent" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>What is an AI Support Agent?</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Read the definition →</p>
        </Link>
        <Link href="/resources/guides/how-to-evaluate-an-ai-agent" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>How to Evaluate an Agent</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Buying framework →</p>
        </Link>
      </div>
    </div>
  )
}