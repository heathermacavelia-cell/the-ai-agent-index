import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase'
import GuideCitations from '@/components/GuideCitations'
import NewsletterSignup from '@/components/NewsletterSignup'
import { getGuideMeta, isoDate, updatedLabel } from '@/lib/guideMeta'
import GuideAgentList from '@/components/GuideAgentList'
import { getGuideGroups, type GuideGroup } from '@/lib/guideAgents'
import { buildRefMap, resolveTemplates, type RefMap } from '@/lib/templates'

// Agent names in this guide's prose and FAQ come from the database, not from this file.
// GUIDE_SLUGS lists every agent the prose names. A name that is renamed in the database
// updates here automatically. A slug that does not exist renders its raw template, loudly.
const GUIDE_SLUGS = ['ada', 'decagon', 'intercom-fin', 'salesforce-einstein-service', 'sierra', 'tidio', 'zendesk-ai']

// The agents this guide lists, in this order, under the guide's two types.
// Chosen by hand (Heather, 2026-10-29) - never by tag. Order is editorial, not a ranking.
const GUIDE_GROUPS: GuideGroup[] = [
  {
    heading: 'Autonomous support agents',
    intro: 'AI agents that resolve customer conversations on their own and hand off to a person when they cannot.',
    slugs: ['intercom-fin', 'decagon', 'sierra', 'ada'],
  },
  {
    heading: 'Helpdesk AI',
    intro: 'AI agents built into a helpdesk or live chat suite, for teams that want the AI inside the tool their reps already use.',
    slugs: ['zendesk-ai', 'freshdesk-freddy', 'salesforce-einstein-service', 'helpscout', 'kustomer', 'tidio'],
  },
]

const AGENT_LINK_STYLE = { color: '#2563EB', textDecoration: 'none', fontWeight: 500 }

function A({ s, r }: { s: string; r: RefMap }) {
  const ref = r[s]
  if (!ref || !ref.name) return <>{'{{' + s + '.name}}'}</>
  if (ref.is_active === false) return <>{ref.name}</>
  return <Link href={'/agents/' + s} style={AGENT_LINK_STYLE}>{ref.name}</Link>
}

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'AI Support Agents: Resolution Rate vs Escalation (2026)',
  description: 'Intercom Fin, Decagon, Sierra, Ada, Zendesk AI and Tidio compared on escalation quality, channel coverage and integration depth. Independently researched.',
  openGraph: {
    title: 'AI Support Agents: Resolution Rate vs Escalation (2026)',
    description: 'Intercom Fin, Decagon, Sierra, Ada, Zendesk AI and Tidio compared on escalation quality, channel coverage and integration depth. Independently researched.',
    url: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-customer-support',
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary',
    title: 'AI Support Agents: Resolution Rate vs Escalation (2026)',
    description: 'Intercom Fin, Decagon, Sierra, Ada, Zendesk AI and Tidio compared on escalation quality, channel coverage and integration depth. Independently researched.',
  },
  alternates: {
    canonical: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-customer-support',
  },
}

const evaluationCriteria = [
  {
    title: 'Resolution rate vs deflection rate: know the difference',
    detail: 'Resolution rate is the percentage of queries the agent closes without human involvement and the customer confirms resolved. Deflection rate is the percentage of queries that do not reach a human agent, which includes queries the customer abandoned, queries the AI answered incorrectly that the customer gave up on, and genuine resolutions. Vendors often report deflection rate because it is higher. Ask specifically for resolution rate confirmed by customer satisfaction signal, not deflection rate alone. A 70% deflection rate that includes 30 percentage points of abandoned or poorly handled queries is not equivalent to a 70% resolution rate.',
  },
  {
    title: 'Escalation quality matters as much as resolution rate',
    detail: 'When an AI support agent cannot resolve a query, the quality of the handoff to a human determines whether the customer experience degrades. Poor escalation means the customer has to repeat themselves, the human agent has no context, and the AI has created frustration rather than saving time. Strong escalation means the human agent receives a conversation summary, the customer\'s expressed sentiment, the steps already tried, and a suggested next action. Evaluate escalation specifically during your pilot: it is the part of the demo that vendors manage least carefully.',
  },
  {
    title: 'Channel coverage aligned to where your customers actually contact you',
    detail: 'AI support agents vary significantly in which channels they cover and how well. Some tools are built primarily for live chat and add email as an afterthought. Others are email-first with weaker chat capabilities. Omnichannel tools cover email, live chat, SMS, WhatsApp, and social, but the AI capability depth varies by channel even on the same platform. Before shortlisting, list every channel your customers use to contact support and confirm that the agent covers each with genuine AI resolution capability, not just a routing layer.',
  },
  {
    title: 'Integration depth with your systems of record',
    detail: 'An AI support agent that can only answer questions from a static knowledge base will resolve a limited range of queries. An agent that can read from your CRM, order management system, and product database in real time can also resolve queries that need account-specific information, which often make up a large share of support volume. Confirm specifically which systems the agent integrates with, whether the integration is read-only or read-write, how it handles failed API calls to connected systems, and whether the integration requires custom development work.',
  },
  {
    title: 'Time-to-value against your team capacity',
    detail: 'AI support agents vary from deployments that go live in a day with no-code setup to implementations that require weeks of configuration, knowledge base structuring, and API integration work. The right complexity level for your team is not the most capable tool available: it is the most capable tool that your team can realistically configure, maintain, and improve within your resource constraints. A tool that takes three months to configure correctly before it delivers value is often worse for a small support team than a simpler tool that is live and improving within a week.',
  },
]

const faqItems = [
  {
    q: 'What are the best AI agents for customer support in 2026?',
    a: 'The right choice depends on your setup. {{intercom-fin.name}} is an AI customer agent that runs on any helpdesk and is billed per outcome. {{decagon.name}} and {{ada.name}} are enterprise platforms whose AI agents resolve conversations across voice, chat and email, and Ada also covers SMS, WhatsApp and Instagram. {{sierra.name}} is an enterprise platform with governance controls for high-stakes customer interactions and is FedRAMP High certified. If your team already runs a helpdesk, {{zendesk-ai.name}} and {{salesforce-einstein-service.name}} add AI agents to the Zendesk and Salesforce suites. {{tidio.name}} combines live chat, a help desk and its Lyro AI Agent for small businesses and ecommerce. Start with your most common query category and the team size and technical resource you have available for implementation.',
  },
  {
    q: 'What resolution rate can I realistically expect from an AI support agent?',
    a: 'Resolution rate varies significantly based on query complexity, knowledge base quality, integration depth, and how well the agent is configured for your specific product and policies. Simple, high-volume query categories (order status, shipping timelines, password resets, basic troubleshooting steps) can achieve very high autonomous resolution rates with well-configured agents. Complex, judgment-intensive, or emotionally sensitive queries will always require human involvement. The most reliable way to set expectations is to categorize your current ticket volume by type, estimate which categories are automatable, and measure against that baseline during a trial period rather than relying on vendor-published average resolution rates that may not reflect your query mix.',
  },
  {
    q: 'Will AI agents replace customer support teams?',
    a: 'AI agents replace specific types of support work: high-volume, repetitive, rules-based queries that do not require the judgment, empathy, and relationship management that define skilled support work. In practice the work shifts rather than disappears: human agents spend more of their time on the complex, sensitive, and high-value interactions where their judgment and communication skills directly determine customer outcomes, rather than on routine queries where speed and accuracy are the primary requirements.',
  },
  {
    q: 'How long does it take to deploy an AI customer support agent?',
    a: 'Deployment time varies by tool and implementation complexity. Tools built for small-business self-service setup can start from a basic knowledge base configuration. Enterprise platforms take longer when the deployment needs custom workflows, CRM integration, and compliance configuration. Always ask vendors for the typical time-to-production for organizations with your technical profile, not for the fastest possible deployment under ideal conditions.',
  },
  {
    q: 'What should I measure during an AI support agent pilot?',
    a: 'Measure four things during a pilot. First, autonomous resolution rate confirmed by customer satisfaction signal, not deflection rate. Second, escalation quality: are human agents receiving useful context, or are they starting from scratch on every escalated query? Third, customer satisfaction scores for AI-handled versus human-handled conversations: a tool that resolves more tickets at lower CSAT is not a net improvement. Fourth, total management time: the weekly hours your team spends configuring, reviewing, and correcting the agent. If management overhead is high enough to consume the time savings, the ROI case is weak regardless of the resolution rate headline.',
  },
]

export default async function BestAIAgentsForCustomerSupportPage() {
  const meta = await getGuideMeta('best-ai-agents-for-customer-support')
  const published = isoDate(meta?.published_at)
  const audited = isoDate(meta?.last_audited_at)
  const updated = updatedLabel(meta?.last_audited_at)

  const supabase = createClient()
  const groups = await getGuideGroups(GUIDE_GROUPS)
  const listed = groups.flatMap((g) => g.agents)

  const refs = await buildRefMap(supabase, GUIDE_SLUGS)
  const t = (text: string) => resolveTemplates(text, refs)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Best AI Agents for Customer Support Teams (2026)',
    description: 'Intercom Fin, Decagon, Sierra, Ada, Zendesk AI and Tidio compared on escalation quality, channel coverage and integration depth.',
    url: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-customer-support',
    ...(published ? { datePublished: published } : {}),
    ...(audited ? { dateModified: audited } : {}),
    author: { '@type': 'Organization', name: 'The AI Agent Index', url: 'https://theaiagentindex.com' },
    publisher: { '@type': 'Organization', name: 'The AI Agent Index', url: 'https://theaiagentindex.com' },
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: t(a) },
    })),
  }

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Best AI Customer Support Agents (2026)',
    numberOfItems: listed.length,
    itemListElement: listed.map((agent, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'SoftwareApplication',
        name: agent.name,
        description: agent.short_description,
        url: `https://theaiagentindex.com/agents/${agent.slug}`,
      }
    }))
  }

  const decisionRows = [
    { condition: 'You want an AI agent that works on top of the helpdesk you already have', rec: <A s="intercom-fin" r={refs} /> },
    { condition: 'You need enterprise AI agents across voice, chat and email', rec: <A s="decagon" r={refs} /> },
    { condition: 'Your customer conversations are high-stakes and need governance controls', rec: <A s="sierra" r={refs} /> },
    { condition: 'Your customers reach you on SMS, WhatsApp or Instagram as well as voice, chat and email', rec: <A s="ada" r={refs} /> },
    { condition: 'You already run your support operation on Zendesk', rec: <A s="zendesk-ai" r={refs} /> },
    { condition: 'You already run your support operation on Salesforce', rec: <A s="salesforce-einstein-service" r={refs} /> },
    { condition: 'You are a small business or ecommerce brand that wants live chat and an AI agent in one tool', rec: <A s="tidio" r={refs} /> },
  ]

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />

      {/* Breadcrumb */}
      <div style={{ marginBottom: '0.75rem' }}>
        <Link href="/" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none' }}>Home</Link>
        <span style={{ color: '#D1D5DB', margin: '0 0.5rem' }}>/</span>
        <Link href="/resources/guides" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none' }}>Guides</Link>
        <span style={{ color: '#D1D5DB', margin: '0 0.5rem' }}>/</span>
        <span style={{ fontSize: '0.8125rem', color: '#111827' }}>Best AI Agents for Customer Support</span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' as const }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Independently Reviewed</span>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Guide</span>
        <span style={{ fontSize: '0.75rem', color: '#6B7280', padding: '0.25rem 0.75rem', backgroundColor: '#F3F4F6', borderRadius: '9999px' }}>{updated}</span>
      </div>

      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
        Best AI Agents for Customer Support Teams (2026)
      </h1>

      {/* Intro */}
      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem', maxWidth: '700px' }}>
        Customer support is a commercially mature use case for AI agents. The core workflow (receiving an inbound query, finding the relevant information, and responding accurately) is well-suited to automation: it is high volume, repetitive, and the quality of the answer can be evaluated against clear criteria. The business case is direct and measurable: ticket deflection rate, cost per resolution, and first response time are all trackable from day one.
      </p>

      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem', maxWidth: '700px' }}>
        AI support agents have been in commercial use for longer than many other AI agent categories. The differences between them lie less in the underlying AI model than in escalation logic, knowledge base training, integration depth with order management and CRM systems, and how the agent handles the queries it cannot confidently resolve.
      </p>

      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem', maxWidth: '700px' }}>
        The most common mistake in evaluating AI support agents is focusing on resolution rate claims without investigating escalation quality. A tool that deflects a high percentage of queries to a no-answer or a poor handoff is not delivering the value the headline number implies. The agent that resolves 60 percent of queries well and escalates the rest cleanly is more valuable than one that deflects 75 percent, including many queries it handles incorrectly.
      </p>

      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '2rem', maxWidth: '700px' }}>
        This guide covers {listed.length} AI customer support agents in two groups: autonomous support agents such as <A s="intercom-fin" r={refs} />, <A s="decagon" r={refs} />, <A s="sierra" r={refs} /> and <A s="ada" r={refs} />, and AI built into helpdesks such as <A s="zendesk-ai" r={refs} />, <A s="salesforce-einstein-service" r={refs} /> and <A s="tidio" r={refs} />. It also covers the evaluation criteria that separate good deployments from mediocre ones, and a decision framework for matching tool to use case. The picks are editorially selected, not ranked by vendor investment or affiliation.
      </p>

      <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '3rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#0369A1', lineHeight: 1.6, margin: 0 }}>
          <strong>Related:</strong>{' '}
          <Link href="/definitions/what-is-an-ai-customer-support-agent" style={{ color: '#2563EB' }}>What is an AI Customer Support Agent?</Link>{' '}
          Full definition covering capabilities, use cases, and evaluation criteria.
        </p>
      </div>

      <GuideAgentList groups={GUIDE_GROUPS} />

      {/* Evaluation criteria */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>How to evaluate AI customer support agents</h2>
        <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1.5rem' }}>
          These are the criteria that separate strong deployments from those that look good in demos and underperform in production.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.875rem' }}>
          {evaluationCriteria.map((criterion) => (
            <div key={criterion.title} style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.25rem 1.5rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.5rem' }}>{criterion.title}</h3>
              <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.7, margin: 0 }}>{criterion.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Decision framework */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>How to choose</h2>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.75rem' }}>
          {decisionRows.map((row, i) => (
            <div key={i} style={{ display: 'flex', gap: '1rem', padding: '0.875rem 1rem', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.5rem', alignItems: 'flex-start', flexWrap: 'wrap' as const }}>
              <span style={{ fontSize: '0.875rem', color: '#374151', flex: 1 }}>If <strong>{row.condition}</strong></span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2563EB', flexShrink: 0 }}>&#x2192; {row.rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div style={{ marginBottom: '3rem' }}>
        <NewsletterSignup />
      </div>

      {/* FAQs */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '1.25rem' }}>Frequently Asked Questions</h2>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '1rem' }}>
          {faqItems.map(({ q, a }) => (
            <div key={q} style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1.25rem 1.5rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.5rem' }}>{q}</h3>
              <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.75, margin: 0 }}>{t(a)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Related */}
      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/ai-customer-support-agents" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>All Support Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>Browse full category &#x2192;</p>
        </Link>
        <Link href="/definitions/what-is-an-ai-customer-support-agent" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>What is an AI Support Agent?</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>Read the definition &#x2192;</p>
        </Link>
        <Link href="/resources/guides/ai-agents-for-ecommerce" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>AI Agents for Ecommerce</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>Ecommerce support guide &#x2192;</p>
        </Link>
        <Link href="/resources/guides/how-to-evaluate-an-ai-agent" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>How to Evaluate an Agent</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>Buying framework &#x2192;</p>
        </Link>
      </div>

      <p style={{ fontSize: '0.875rem', color: '#9CA3AF', lineHeight: 1.6 }}>
        All agents listed are editorially reviewed by The AI Agent Index. See our <Link href="/methodology" style={{ color: '#6B7280' }}>editorial methodology</Link>.
      </p>

      <GuideCitations slug="best-ai-agents-for-customer-support" table="guides" />
    </div>
  )
}
