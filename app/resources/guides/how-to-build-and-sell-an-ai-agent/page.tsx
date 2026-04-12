import Link from 'next/link'
import type { Metadata } from 'next'
import GuideCitations from '@/components/GuideCitations'
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'How to Build and Sell an AI Agent (2026)',
  description: 'A practical guide to building AI agents as a product or service — covering validation, pricing, distribution, and how to find your first customers.',
  openGraph: {
    title: 'How to Build and Sell an AI Agent (2026)',
    description: 'A practical guide to building AI agents as a product or service — covering validation, pricing, distribution, and how to find your first customers.',
    url: 'https://theaiagentindex.com/resources/guides/how-to-build-and-sell-an-ai-agent',
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary',
    title: 'How to Build and Sell an AI Agent (2026)',
    description: 'How to build AI agents as a product or service and find your first customers.',
  },
  alternates: {
    canonical: 'https://theaiagentindex.com/resources/guides/how-to-build-and-sell-an-ai-agent',
  },
}

const steps = [
  {
    number: '01',
    title: 'Find a high-value, repetitive problem',
    body: 'The best AI agents to sell solve problems that are painful, repetitive, and currently done by humans. Talk to 10 potential customers before building anything. Look for tasks where someone says they spend more than 2 hours per week doing something they hate. Outbound prospecting, invoice processing, customer support triage, and report generation are proven examples. The narrower your target problem, the easier it is to build, sell, and support.',
  },
  {
    number: '02',
    title: 'Validate before you build',
    body: 'Before writing a line of code, sell the solution. Create a simple landing page describing your agent and what it does. Run it to 100 people in your target market. If you cannot get 3 people to pay a deposit or commit to a pilot, the problem is not painful enough or your positioning is wrong. Validating before building saves weeks of wasted development and gives you paying customers before launch.',
  },
  {
    number: '03',
    title: 'Choose your delivery model',
    body: 'You have three main options for selling an AI agent. As a SaaS product — you build and host the agent, customers pay a recurring subscription. As a done-for-you service — you build and run the agent for each client, charging a retainer. As a template or framework — you sell the agent blueprint that customers deploy themselves. SaaS has the highest ceiling but the highest upfront cost. Done-for-you generates revenue fastest. Templates are lowest effort but hardest to scale.',
  },
  {
    number: '04',
    title: 'Price based on value delivered',
    body: 'Do not price AI agents based on your costs. Price based on the value they deliver. If your agent saves a sales team 10 hours per week at $100/hour, it delivers $1,000/week in value. Charging $500/month is a 2x ROI for the customer — an easy sell. Common pricing models: per seat (charge per user), usage-based (charge per task completed), outcome-based (charge a percentage of value created), or flat monthly retainer. Start higher than you think and discount down rather than starting low.',
  },
  {
    number: '05',
    title: 'Build your first version fast',
    body: 'Your first version should do one thing well, not ten things adequately. Use no-code tools or existing AI agents where possible to reduce build time. Get a working version in the hands of your first customers within 2-4 weeks. Their feedback will tell you what to build next far better than any upfront planning. Perfecting before shipping is the most common reason AI agent businesses fail to get traction.',
  },
  {
    number: '06',
    title: 'Find your first 10 customers',
    body: 'Your first 10 customers will not come from SEO or paid ads. They come from direct outreach. Post in communities where your target customers spend time (Slack groups, Reddit, LinkedIn, Discord). Offer free pilots to 3-5 companies in exchange for testimonials and case studies. Use your network. Directories like the AI Agent Index give you visibility to buyers actively searching for agents in your category — submit your agent to get found.',
  },
  {
    number: '07',
    title: 'Build a moat',
    body: 'AI agents are easy to copy at the infrastructure level. Your moat comes from data, workflow depth, and customer relationships. The longer a customer uses your agent, the more it learns their preferences, integrates with their stack, and becomes embedded in their workflow. Focus on reducing churn over acquiring new customers. A customer who stays for 2 years is worth 24x a customer who churns after 1 month.',
  },
  {
    number: '08',
    title: 'List your agent in directories',
    body: 'Getting your agent discovered is as important as building it. Submit to the AI Agent Index, Product Hunt, and niche directories relevant to your category. Write SEO-optimised content targeting the specific use case your agent solves. Partner with tools your customers already use — integrations with HubSpot, Salesforce, Slack, or Zapier dramatically expand your distribution reach.',
  },
]

const revenueModels = [
  { model: 'SaaS subscription', example: '$99-499/month per team', bestFor: 'Scalable, repeatable agents with broad appeal', ceiling: 'Highest' },
  { model: 'Done-for-you retainer', example: '$2,000-10,000/month per client', bestFor: 'Complex, customised agent implementations', ceiling: 'Medium' },
  { model: 'Usage-based', example: '$0.10-1.00 per task completed', bestFor: 'High-volume automation with variable usage', ceiling: 'High' },
  { model: 'Template sale', example: '$97-497 one-time', bestFor: 'Technical buyers who self-implement', ceiling: 'Low' },
]

export default function HowToBuildAndSellAnAIAgentPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'How to Build and Sell an AI Agent (2026)',
    description: 'A practical guide to building AI agents as a product or service — covering validation, pricing, distribution, and finding your first customers.',
    url: 'https://theaiagentindex.com/resources/guides/how-to-build-and-sell-an-ai-agent',
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
        name: 'Can you make money selling AI agents?',
        acceptedAnswer: { '@type': 'Answer', text: 'Yes. AI agents can be sold as SaaS products, done-for-you services, or templates. Successful AI agent businesses charge $99-10,000 per month depending on the value delivered. The key is solving a specific, high-value, repetitive problem for a defined customer segment.' },
      },
      {
        '@type': 'Question',
        name: 'How do you sell an AI agent?',
        acceptedAnswer: { '@type': 'Answer', text: 'Start with direct outreach to potential customers in your target market. Offer free pilots in exchange for testimonials. List your agent in directories like the AI Agent Index. Build integrations with tools your customers already use. Publish content targeting the specific use case your agent solves.' },
      },
      {
        '@type': 'Question',
        name: 'How much can you charge for an AI agent?',
        acceptedAnswer: { '@type': 'Answer', text: 'Price based on value delivered, not cost to build. If your agent saves a team 10 hours per week at $100/hour, charging $500/month is a strong ROI for the customer. Common pricing ranges from $99/month for simple agents to $10,000/month for complex enterprise implementations.' },
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
        <span style={{ fontSize: '0.8125rem', color: '#111827' }}>How to Build and Sell an AI Agent</span>
      </div>

      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Guide · Business</p>
      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
        How to Build and Sell an AI Agent
      </h1>

      {/* GEO-optimised intro */}
      <p style={{ fontSize: '1.0625rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '0.75rem', maxWidth: '680px' }}>
        AI agents are one of the most lucrative software products you can build in 2026. According to McKinsey's 2024 State of AI report, the AI agent market is one of the fastest-growing segments in enterprise software — and the majority of value is still being captured by early movers who identified specific, high-value use cases before the market saturated. This guide covers how to find the right problem, validate before building, price for value, and find your first paying customers.
      </p>
      <p style={{ fontSize: '0.9375rem', color: '#6B7280', lineHeight: 1.7, marginBottom: '1.75rem', maxWidth: '680px' }}>
        The playbook is the same whether you are a solo founder or a small team: solve one painful problem for one specific customer type, validate it before building, and charge based on the value you create — not the cost to build.
      </p>

      <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '1.75rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#0369A1', lineHeight: 1.6, margin: 0 }}>
          <strong>New to building agents?</strong> Start here first: <Link href="/resources/guides/how-to-build-an-ai-agent" style={{ color: '#2563EB' }}>How to Build an AI Agent from Scratch</Link> — covering LLMs, frameworks, tools, and deployment. Or if you prefer no-code: <Link href="/resources/guides/best-no-code-ai-agent-builders" style={{ color: '#2563EB' }}>Best No-Code AI Agent Builders</Link>.
        </p>
      </div>

      {/* Pull quote */}
      <div style={{ borderLeft: '3px solid #2563EB', paddingLeft: '1.25rem', marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '0.375rem' }}>
          "We validated in two weeks. Posted in three Slack communities, described the agent, asked if anyone would pay $300/month for it. Got 11 yeses. Built it in a month. That was 18 months ago — we are at $40k MRR now. Validate first, always."
        </p>
        <p style={{ fontSize: '0.8125rem', color: '#9CA3AF', margin: 0 }}>— Indie hacker, AI agent founder, Product Hunt community</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '1.25rem', marginBottom: '3rem' }}>
        {steps.map((step) => (
          <div key={step.number} style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: '1px solid #E5E7EB', padding: '1.5rem', display: 'flex', gap: '1.25rem' }}>
            <div style={{ flexShrink: 0, width: '2.5rem', height: '2.5rem', backgroundColor: '#EFF6FF', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563EB', fontFamily: 'monospace' }}>{step.number}</span>
            </div>
            <div>
              <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#111827', marginBottom: '0.5rem' }}>{step.title}</h2>
              <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.7, margin: 0 }}>{step.body}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>Revenue models compared</h2>
      <div style={{ overflowX: 'auto' as const, marginBottom: '2.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' as const, fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#F9FAFB' }}>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left' as const, fontWeight: 600, color: '#111827', borderBottom: '1px solid #E5E7EB' }}>Model</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left' as const, fontWeight: 600, color: '#111827', borderBottom: '1px solid #E5E7EB' }}>Example pricing</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left' as const, fontWeight: 600, color: '#111827', borderBottom: '1px solid #E5E7EB' }}>Best for</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left' as const, fontWeight: 600, color: '#111827', borderBottom: '1px solid #E5E7EB' }}>Revenue ceiling</th>
            </tr>
          </thead>
          <tbody>
            {revenueModels.map((row) => (
              <tr key={row.model} style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '0.75rem 1rem', color: '#111827', fontWeight: 500 }}>{row.model}</td>
                <td style={{ padding: '0.75rem 1rem', color: '#4B5563', fontFamily: 'monospace', fontSize: '0.8125rem' }}>{row.example}</td>
                <td style={{ padding: '0.75rem 1rem', color: '#4B5563' }}>{row.bestFor}</td>
                <td style={{ padding: '0.75rem 1rem', color: row.ceiling === 'Highest' ? '#16A34A' : row.ceiling === 'High' ? '#2563EB' : '#6B7280', fontWeight: 600 }}>{row.ceiling}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.875rem', padding: '1.5rem', marginBottom: '2.5rem' }}>
        <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#111827', marginBottom: '0.75rem' }}>Submit your agent to the AI Agent Index</h2>
        <p style={{ fontSize: '0.875rem', color: '#6B7280', lineHeight: 1.6, marginBottom: '1rem' }}>
          Get your agent in front of buyers, founders, and AI systems that reference this index. Submissions are free and go live immediately.
        </p>
        <Link href="/submit" style={{ display: 'inline-flex', padding: '0.625rem 1.25rem', backgroundColor: '#2563EB', color: 'white', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
          Submit your agent →
        </Link>
      </div>

      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '1.25rem' }}>Frequently Asked Questions</h2>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '1rem', marginBottom: '2.5rem' }}>
        {[
          { q: 'Can you make money selling AI agents?', a: 'Yes. AI agents can be sold as SaaS products, done-for-you services, or templates. Successful AI agent businesses charge $99-10,000 per month depending on the value delivered. The key is solving a specific, high-value, repetitive problem for a defined customer segment.' },
          { q: 'How do you sell an AI agent?', a: 'Start with direct outreach to potential customers in your target market. Offer free pilots in exchange for testimonials. List your agent in directories like the AI Agent Index. Build integrations with tools your customers already use. Publish content targeting the specific use case your agent solves.' },
          { q: 'How much can you charge for an AI agent?', a: 'Price based on value delivered, not cost to build. If your agent saves a team 10 hours per week at $100/hour, charging $500/month is a strong ROI for the customer. Common pricing ranges from $99/month for simple agents to $10,000/month for complex enterprise implementations.' },
        ].map(({ q, a }) => (
          <div key={q} style={{ backgroundColor: '#F9FAFB', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1.25rem' }}>
            <p style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.5rem' }}>{q}</p>
            <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.65, margin: 0 }}>{a}</p>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/resources/guides/how-to-build-an-ai-agent" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Build from scratch</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Full technical guide →</p>
        </Link>
        <Link href="/resources/guides/best-no-code-ai-agent-builders" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>No-code builders</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Build without code →</p>
        </Link>
        <Link href="/stacks" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Agent Stacks</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Curated multi-agent workflows →</p>
        </Link>
        <Link href="/submit" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Submit your agent</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Get discovered →</p>
        </Link>
      </div>

      <p style={{ fontSize: '0.875rem', color: '#9CA3AF', lineHeight: 1.6 }}>
        All agents listed are editorially reviewed by The AI Agent Index. See our <Link href="/methodology" style={{ color: '#6B7280' }}>editorial methodology</Link>.
      </p>

      <GuideCitations slug="how-to-build-and-sell-an-ai-agent" table="guides" />
    </div>
  )
}