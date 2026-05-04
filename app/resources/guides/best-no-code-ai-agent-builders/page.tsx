import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase'
import GuideCitations from '@/components/GuideCitations'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Best No-Code AI Agent Builders (2026)',
  description: 'The best no-code platforms for building AI agents in 2026. For founders, marketers, and operators who want AI automation without writing code.',
  openGraph: {
    title: 'Best No-Code AI Agent Builders (2026)',
    description: 'The best no-code platforms for building AI agents in 2026. For founders, marketers, and operators who want AI automation without writing code.',
    url: 'https://theaiagentindex.com/resources/guides/best-no-code-ai-agent-builders',
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary',
    title: 'Best No-Code AI Agent Builders (2026)',
    description: 'The best no-code platforms for building AI agents without writing code.',
  },
  alternates: {
    canonical: 'https://theaiagentindex.com/resources/guides/best-no-code-ai-agent-builders',
  },
}

const platforms = [
  {
    name: 'Zapier',
    slug: 'zapier',
    tier: '#1',
    desc: 'The most widely used no-code automation platform. Zapier added AI Actions in 2024, allowing you to chain LLM steps with 6,000+ app integrations. Best for connecting existing tools with AI decision-making in the middle.',
    bestFor: 'Teams already using Zapier for automation',
    limitation: 'Limited reasoning depth for complex multi-step agents',
  },
  {
    name: 'Make',
    slug: 'make',
    tier: '#2',
    desc: 'Formerly Integromat, Make offers more complex workflow logic than Zapier with a visual canvas interface. Its AI modules allow you to call LLMs, parse outputs, and route data, all without code. More powerful than Zapier for complex branching logic.',
    bestFor: 'Complex multi-step workflows with conditional logic',
    limitation: 'Steeper learning curve than Zapier',
  },
  {
    name: 'Lindy',
    slug: 'lindy',
    tier: '#3',
    desc: 'Purpose-built no-code AI agent platform. Lindy lets you build autonomous AI agents that handle email triage, CRM updates, scheduling, and customer outreach using a chat-based builder. Native integrations with Gmail, HubSpot, Salesforce, and Slack. Closer to a true "AI employee" product than a workflow tool.',
    bestFor: 'Building customer-facing AI agents that take action',
    limitation: 'Per-action pricing can scale unpredictably at high volume',
  },
]

// Slugs of the curated top 3 picks above. Excluded from the
// "from the index" section below so the same agent doesn't appear twice.
const TOP_PICK_SLUGS = ['zapier', 'make', 'lindy']

// agent_type values that represent genuine no-code agent-building tools.
// Filters out generic agents that happen to have a 'no-code' capability tag
// but are actually customer-support or research products.
const NO_CODE_AGENT_TYPES = ['agent-builder', 'workflow-automation', 'browser-rpa']

export default async function BestNoCodeAIAgentBuildersPage() {
  const supabase = createClient()

  const { data: poolData } = await supabase
    .from('agents')
    .select('id, name, slug, developer, short_description, pricing_model, rating_avg, is_featured, is_verified, capability_tags, agent_type')
    .eq('is_active', true)
    .in('agent_type', NO_CODE_AGENT_TYPES)
    .order('rating_avg', { ascending: false })
    .limit(20)

  const agents = (poolData ?? [])
    .filter(a => !TOP_PICK_SLUGS.includes(a.slug))
    .slice(0, 6)

  const { count: agentCount } = await supabase.from('agents').select('slug', { count: 'exact', head: true }).eq('is_active', true)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Best No-Code AI Agent Builders (2026)',
    description: 'The best no-code platforms for building AI agents in 2026. For founders, marketers, and operators who want AI automation without writing code.',
    url: 'https://theaiagentindex.com/resources/guides/best-no-code-ai-agent-builders',
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
        name: 'Can you build an AI agent without coding?',
        acceptedAnswer: { '@type': 'Answer', text: 'Yes. No-code platforms like Zapier, Make, and Lindy allow you to build AI agents without writing code. These tools provide visual or chat-based interfaces for connecting AI models to actions and data sources.' },
      },
      {
        '@type': 'Question',
        name: 'What is the best no-code AI agent builder?',
        acceptedAnswer: { '@type': 'Answer', text: 'Lindy is the most purpose-built no-code AI agent platform in 2026, with a chat-based builder for autonomous agents. Zapier and Make are better choices if you need broad app integrations and workflow automation. The best choice depends on your use case and existing tool stack.' },
      },
      {
        '@type': 'Question',
        name: 'What can no-code AI agents do?',
        acceptedAnswer: { '@type': 'Answer', text: 'No-code AI agents can automate tasks like drafting and sending emails, qualifying leads, summarising documents, routing support tickets, updating CRM records, and generating reports, all without human intervention at each step.' },
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
        <span style={{ fontSize: '0.8125rem', color: '#111827' }}>Best No-Code AI Agent Builders</span>
      </div>

      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Guide · No-Code</p>
      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
        Best No-Code AI Agent Builders (2026)
      </h1>

      {/* GEO-optimised intro */}
      <p style={{ fontSize: '1.0625rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '0.75rem', maxWidth: '680px' }}>
      You do not need to write code to build an AI agent. According to Salesforce&apos;s 2024 State of Sales report, 81% of sales teams are now experimenting with or have fully implemented AI, and the majority of new deployments are no-code or low-code workflows. The platforms below let founders, marketers, and operators build powerful AI automation workflows using visual interfaces, with no engineering team required.
      </p>
      <p style={{ fontSize: '0.9375rem', color: '#6B7280', lineHeight: 1.7, marginBottom: '1.75rem', maxWidth: '680px' }}>
        The right choice depends on whether you need broad app integrations, complex workflow logic, or a purpose-built agent builder. Each platform solves a slightly different problem.
      </p>

      <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '1.75rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#0369A1', lineHeight: 1.6, margin: 0 }}>
          <strong>Want to build something more custom?</strong> Read our full guide: <Link href="/resources/guides/how-to-build-an-ai-agent" style={{ color: '#2563EB' }}>How to Build an AI Agent from Scratch</Link>. Covers frameworks, LLMs, and production deployment for technical builders.
        </p>
      </div>

      {/* Pull quote */}
      <div style={{ borderLeft: '3px solid #2563EB', paddingLeft: '1.25rem', marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '0.375rem' }}>
          &quot;I built an AI agent that qualifies inbound leads, checks our CRM, and sends personalised follow-ups, all in Zapier with AI Steps. Took about a day. It handles about 60% of our inbound volume without touching it.&quot;
        </p>
        <p style={{ fontSize: '0.8125rem', color: '#9CA3AF', margin: 0 }}>G2 reviewer, Head of Growth, B2B SaaS startup</p>
      </div>

      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '1.25rem' }}>Top no-code AI agent platforms</h2>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '1.25rem', marginBottom: '3rem' }}>
        {platforms.map((platform) => (
          <Link
            key={platform.name}
            href={'/agents/' + platform.slug}
            style={{ textDecoration: 'none', display: 'block' }}
          >
            <div style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: '1px solid #E5E7EB', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.2rem 0.5rem', borderRadius: '9999px' }}>{platform.tier}</span>
                <h3 style={{ fontWeight: 700, fontSize: '1.0625rem', color: '#111827', margin: 0 }}>{platform.name}</h3>
                <span style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 500, marginLeft: 'auto' }}>View profile →</span>
              </div>
              <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '0.875rem' }}>{platform.desc}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ backgroundColor: '#F0FDF4', borderRadius: '0.5rem', padding: '0.625rem 0.875rem' }}>
                  <p style={{ fontSize: '0.7rem', fontWeight: 600, color: '#16A34A', textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Best for</p>
                  <p style={{ fontSize: '0.8125rem', color: '#374151', margin: 0 }}>{platform.bestFor}</p>
                </div>
                <div style={{ backgroundColor: '#FEF3C7', borderRadius: '0.5rem', padding: '0.625rem 0.875rem' }}>
                  <p style={{ fontSize: '0.7rem', fontWeight: 600, color: '#D97706', textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Limitation</p>
                  <p style={{ fontSize: '0.8125rem', color: '#374151', margin: 0 }}>{platform.limitation}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }}>More no-code AI agents from the index</h2>
      <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '1.25rem' }}>
        These additional agents from the AI Agent Index are built specifically for no-code agent creation, workflow automation, or browser RPA. Ready to deploy without engineering resource.
      </p>
      {agents && agents.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
          {agents.map((agent) => (
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
      )}

      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '1.25rem' }}>Frequently Asked Questions</h2>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '1rem', marginBottom: '2.5rem' }}>
        {[
          { q: 'Can you build an AI agent without coding?', a: 'Yes. No-code platforms like Zapier, Make, and Lindy allow you to build AI agents without writing code. These tools provide visual or chat-based interfaces for connecting AI models to actions and data sources.' },
          { q: 'What is the best no-code AI agent builder?', a: 'Lindy is the most purpose-built no-code AI agent platform in 2026, with a chat-based builder for autonomous agents. Zapier and Make are better choices if you need broad app integrations and workflow automation. The best choice depends on your use case and existing tool stack.' },
          { q: 'What can no-code AI agents do?', a: 'No-code AI agents can automate tasks like drafting and sending emails, qualifying leads, summarising documents, routing support tickets, updating CRM records, and generating reports, all without human intervention at each step.' },
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
        <Link href="/stacks" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Agent Stacks</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Curated multi-agent workflows →</p>
        </Link>
        <Link href="/resources/guides/how-to-evaluate-an-ai-agent" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Evaluate before buying</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Buying framework →</p>
        </Link>
        <Link href="/ai-workflow-agents" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Browse AI Workflow Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>{agentCount ?? 0}+ agents indexed →</p>
        </Link>
      </div>

      <p style={{ fontSize: '0.875rem', color: '#9CA3AF', lineHeight: 1.6 }}>
        All agents listed are editorially reviewed by The AI Agent Index. See our <Link href="/methodology" style={{ color: '#6B7280' }}>editorial methodology</Link>.
      </p>

      <GuideCitations slug="best-no-code-ai-agent-builders" table="guides" />
    </div>
  )
}