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
const GUIDE_SLUGS = ['close-crm', 'hubspot-sales-hub', 'monday-crm', 'pipedrive-ai', 'salesforce-sales-cloud-einstein', 'softsync-ai', 'zoho-crm']

// The agents this guide lists, in this order, under the guide's three types.
// Chosen 2026-11-03. Order is editorial, not a ranking. freshsales and lightfield stay out
// until their overdue audits run. Every feature below was read on the vendor page 2026-11-03.
const GUIDE_GROUPS: GuideGroup[] = [
  {
    heading: 'Sales-first CRMs',
    intro: 'CRMs built around calling, email and the pipeline, for smaller sales teams.',
    slugs: ['close-crm', 'pipedrive-ai'],
  },
  {
    heading: 'Platform CRMs',
    intro: 'Larger platforms where the CRM connects to marketing, service or other business apps, with AI agents across plans.',
    slugs: ['hubspot-sales-hub', 'salesforce-sales-cloud-einstein', 'zoho-crm', 'monday-crm'],
  },
  {
    heading: 'CRMs run through your assistant',
    intro: 'A CRM built so that an AI assistant can operate it.',
    slugs: ['softsync-ai'],
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


const META_DESCRIPTION = 'Close and Pipedrive for smaller sales teams, HubSpot, Salesforce, Zoho and monday for platforms, SoftSync for assistant-run CRM. AI by plan compared.'

export const metadata: Metadata = {
  title: 'Best AI CRM Agents: Close, HubSpot, Salesforce and More (2026)',
  description: META_DESCRIPTION,
  openGraph: {
    images: [{ url: 'https://theaiagentindex.com/og-image.png', width: 1200, height: 630 }],
    title: 'Best AI CRM Agents: Close, HubSpot, Salesforce and More (2026)',
    description: META_DESCRIPTION,
    url: 'https://theaiagentindex.com/resources/guides/best-ai-crm-agents',
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://theaiagentindex.com/og-image.png'],
    title: 'Best AI CRM Agents: Close, HubSpot, Salesforce and More (2026)',
    description: META_DESCRIPTION,
  },
  alternates: {
    canonical: 'https://theaiagentindex.com/resources/guides/best-ai-crm-agents',
  },
}

// Prices are not shown here: the cards carry live pricing.
const comparisonRows = [
  { slug: 'close-crm', start: '14-day trial, no card', ai: 'Chloe AI Assistant and AI Agents on every plan, with monthly AI credits' },
  { slug: 'pipedrive-ai', start: '14-day trial, no card', ai: 'Nova meeting intelligence and AI reports from the entry plan' },
  { slug: 'hubspot-sales-hub', start: 'Free for up to 2 users', ai: 'Prospecting agent and Agent Builder from Starter, with HubSpot Credits' },
  { slug: 'salesforce-sales-cloud-einstein', start: 'Free Suite', ai: 'Agentforce skills from Core, Agentforce for Sales included in Max and a paid add-on on lower editions' },
  { slug: 'zoho-crm', start: 'Free for 3 users', ai: 'AI agents from Standard, AI sales assistant from Enterprise' },
  { slug: 'monday-crm', start: 'Free trial, no card', ai: 'Lead sourcing, outreach caller and meeting prep agents from Standard' },
  { slug: 'softsync-ai', start: 'Paid plans or a demo, no free plan', ai: 'AI Assistant, Autopilot workflows and MCP access on Pro' },
]

const faqItems = [
  {
    q: 'What is the best AI CRM in 2026?',
    a: 'It depends on your team. {{close-crm.name}} and {{pipedrive-ai.name}} suit smaller sales teams that live in calls, email and the pipeline. {{hubspot-sales-hub.name}} and {{zoho-crm.name}} both offer a free way to start and grow into a wider platform. {{salesforce-sales-cloud-einstein.name}} suits organizations that need deep configuration. {{monday-crm.name}} suits teams already working in monday.com. {{softsync-ai.name}} suits founders who want an AI assistant to operate the CRM.',
  },
  {
    q: 'Which AI CRM has a free plan?',
    a: '{{hubspot-sales-hub.name}} is free for up to 2 users, {{zoho-crm.name}} is free for 3 users, and {{salesforce-sales-cloud-einstein.name}} has a Free Suite. Check what each free plan includes, because the AI agents usually sit on paid plans. {{close-crm.name}} and {{pipedrive-ai.name}} offer a 14-day trial with no card rather than a free plan.',
  },
  {
    q: 'Should I add AI to my current CRM or switch?',
    a: 'Start with what your current plan already includes, because most of the CRMs here now ship AI on paid tiers. Switching makes sense when the plan with the AI you need costs more than a better-fitting CRM, or when your team has stopped keeping the CRM up to date. If you do switch, move a clean copy of your data rather than every old record.',
  },
  {
    q: 'How do AI credits work in a CRM?',
    a: 'Several vendors meter AI separately from the seat price. {{close-crm.name}} includes monthly AI credits that rise by plan, {{hubspot-sales-hub.name}} includes HubSpot Credits, and {{salesforce-sales-cloud-einstein.name}} lists Flex Credits on its top edition. Before you buy, ask what one agent task costs in credits and what happens when they run out.',
  },
  {
    q: 'Can Claude or ChatGPT work with my CRM?',
    a: 'Often, through MCP. {{pipedrive-ai.name}} says every plan works with Claude, ChatGPT and other MCP assistants, and {{softsync-ai.name}} includes MCP access. Each listing shows its MCP status, and the plan you need can differ, so confirm it before you rely on it.',
  },
]

export default async function BestAICrmAgentsPage() {
  const meta = await getGuideMeta('best-ai-crm-agents')
  const published = isoDate(meta?.published_at)
  const audited = isoDate(meta?.last_audited_at)
  const updated = updatedLabel(meta?.last_audited_at)

  const supabase = createClient()
  const groups = await getGuideGroups(GUIDE_GROUPS)
  const listed = groups.flatMap((g) => g.agents)
  const refs = await buildRefMap(supabase, GUIDE_SLUGS)
  const t = (text: string) => resolveTemplates(text, refs)

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    image: 'https://theaiagentindex.com/og-image.png',
    headline: 'Best AI CRM Agents: Close, HubSpot, Salesforce and More (2026)',
    description: META_DESCRIPTION,
    url: 'https://theaiagentindex.com/resources/guides/best-ai-crm-agents',
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
      name: t(q),
      acceptedAnswer: { '@type': 'Answer', text: t(a) },
    })),
  }

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Best AI CRM Agents (2026)',
    numberOfItems: listed.length,
    itemListElement: listed.map((agent, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'SoftwareApplication',
        name: agent.name,
        description: agent.short_description,
        url: `https://theaiagentindex.com/agents/${agent.slug}`,
      },
    })),
  }

  const h2 = { fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }
  const para = { fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1rem' }
  const card = { backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }
  const cardTitle = { fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }
  const cardSub = { fontSize: '0.8125rem', color: '#6B7280' }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />

      <div style={{ marginBottom: '0.75rem' }}>
        <Link href="/" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none' }}>Home</Link>
        <span style={{ color: '#D1D5DB', margin: '0 0.5rem' }}>/</span>
        <Link href="/resources/guides" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none' }}>Guides</Link>
        <span style={{ color: '#D1D5DB', margin: '0 0.5rem' }}>/</span>
        <span style={{ fontSize: '0.8125rem', color: '#111827' }}>Best AI CRM agents</span>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' as const }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Guide</span>
        {updated && <span style={{ fontSize: '0.75rem', color: '#6B7280', padding: '0.25rem 0.75rem', backgroundColor: '#F3F4F6', borderRadius: '9999px' }}>{updated}</span>}
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '0.25rem 0.75rem', borderRadius: '9999px', border: '1px solid #BFDBFE' }}>Independently Reviewed</span>
      </div>

      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
        Best AI CRM agents (2026)
      </h1>

      <p style={{ fontSize: '1.0625rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '0.75rem' }}>
        A CRM is only useful if it stays up to date, and keeping it up to date is the work salespeople skip. AI agents now take on that work: logging calls, drafting follow-ups, researching leads and moving deals along. This guide covers {listed.length} CRMs with AI built in, grouped by the kind of team they suit.
      </p>
      <p style={{ fontSize: '0.9375rem', color: '#6B7280', lineHeight: 1.7, marginBottom: '1.75rem' }}>
        The main difference between them is less about which has AI and more about which plan it sits on, and whether it is metered in credits on top of the seat price.
      </p>

      <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#0369A1', lineHeight: 1.6, margin: 0 }}>
          <strong>Quick recommendation:</strong> For a small team that sells by phone and email, look at <A s="close-crm" r={refs} />. To start free and grow into a wider platform, look at <A s="hubspot-sales-hub" r={refs} /> or <A s="zoho-crm" r={refs} />. If you need deep configuration, look at <A s="salesforce-sales-cloud-einstein" r={refs} />.
        </p>
      </div>

      <GuideAgentList groups={GUIDE_GROUPS} />

      <h2 style={h2}>How the AI compares by plan</h2>
      <div style={{ overflowX: 'auto' as const, marginBottom: '3rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#F9FAFB' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #E5E7EB', color: '#6B7280', fontWeight: 600 }}>CRM</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #E5E7EB', color: '#6B7280', fontWeight: 600 }}>How you start</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #E5E7EB', color: '#6B7280', fontWeight: 600 }}>Where the AI sits</th>
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map((row) => (
              <tr key={row.slug}>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid #F3F4F6', color: '#111827', fontWeight: 500 }}><A s={row.slug} r={refs} /></td>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid #F3F4F6', color: '#4B5563' }}>{row.start}</td>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid #F3F4F6', color: '#4B5563' }}>{row.ai}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 style={h2}>What to check before you buy</h2>
      <div style={{ marginBottom: '3rem' }}>
        <p style={para}>
          <strong>The plan, not the product.</strong> A vendor can advertise AI agents while the entry plan has only some of them. <A s="pipedrive-ai" r={refs} /> puts meeting intelligence on its entry plan and saves other AI for higher tiers, and <A s="salesforce-sales-cloud-einstein" r={refs} /> includes Agentforce for Sales in its top edition, Max, and sells it as a paid add-on on lower editions.
        </p>
        <p style={para}>
          <strong>Credits.</strong> Find out what one agent task costs and what happens when credits run out. The cost of AI can grow faster than your seat count.
        </p>
        <p style={para}>
          <strong>Your data.</strong> An agent working from stale or duplicate records will send the wrong message with confidence. Clean the data before you turn agents on, and start with tasks a person reviews.
        </p>
        <p style={para}>
          <strong>Data training.</strong> Policies differ, and a CRM holds your customers&apos; details. Each listing shows its data training status, so check it for the plan you would buy.
        </p>
        <p style={para}>
          <strong>Calls and messages.</strong> Agents that call or text your leads bring consent rules with them. Read the <Link href="/resources/guides/how-ai-agents-are-changing-sales" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>voice section of our sales guide</Link> before you switch one on.
        </p>
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ ...h2, marginBottom: '1rem' }}>How to choose</h2>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.75rem' }}>
          {[
            { condition: 'you sell by phone and email and want calling built in', recommendation: <A s="close-crm" r={refs} /> },
            { condition: 'you want a simple pipeline with meeting notes handled for you', recommendation: <A s="pipedrive-ai" r={refs} /> },
            { condition: 'you want to start free and add marketing and service later', recommendation: <><A s="hubspot-sales-hub" r={refs} /> or <A s="zoho-crm" r={refs} /></> },
            { condition: 'you need deep configuration across a large sales organization', recommendation: <A s="salesforce-sales-cloud-einstein" r={refs} /> },
            { condition: 'your team already works in monday.com', recommendation: <A s="monday-crm" r={refs} /> },
            { condition: 'you want Claude, ChatGPT or Gemini to operate your CRM', recommendation: <A s="softsync-ai" r={refs} /> },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', gap: '1rem', padding: '0.875rem 1rem', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.5rem', alignItems: 'flex-start', flexWrap: 'wrap' as const }}>
              <span style={{ fontSize: '0.875rem', color: '#374151', flex: 1 }}>If <strong>{row.condition}</strong></span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2563EB', maxWidth: '100%' }}>&#x2192; {row.recommendation}</span>
            </div>
          ))}
        </div>
      </div>

      <h2 style={{ ...h2, marginBottom: '1rem' }}>Frequently asked questions</h2>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '1rem', marginBottom: '2.5rem' }}>
        {faqItems.map(({ q, a }) => (
          <div key={q} style={{ backgroundColor: '#F9FAFB', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1.25rem' }}>
            <p style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.5rem' }}>{t(q)}</p>
            <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.65, margin: 0 }}>{t(a)}</p>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <NewsletterSignup sourcePage="guide-best-ai-crm-agents" sourceType="guide" />
      </div>

      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/ai-sales-agents" style={card}>
          <p style={cardTitle}>AI sales agents</p>
          <p style={cardSub}>Browse full category &#x2192;</p>
        </Link>
        <Link href="/resources/guides/hubspot-vs-ai-agents" style={card}>
          <p style={cardTitle}>HubSpot vs AI agents</p>
          <p style={cardSub}>Full guide &#x2192;</p>
        </Link>
        <Link href="/resources/guides/best-ai-agents-for-small-business" style={card}>
          <p style={cardTitle}>AI agents for small business</p>
          <p style={cardSub}>Full guide &#x2192;</p>
        </Link>
      </div>

      <p style={{ fontSize: '0.875rem', color: '#9CA3AF', lineHeight: 1.6 }}>
        All agents listed are editorially reviewed by The AI Agent Index. See our <Link href="/methodology" style={{ color: '#6B7280' }}>editorial methodology</Link>.
      </p>

      <GuideCitations slug="best-ai-crm-agents" table="guides" />
    </div>
  )
}
