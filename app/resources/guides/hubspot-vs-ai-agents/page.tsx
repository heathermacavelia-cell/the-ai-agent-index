import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import type { Metadata } from 'next'
import GuideCitations from '@/components/GuideCitations'
import NewsletterSignup from '@/components/NewsletterSignup'
import { getGuideMeta, isoDate, updatedLabel } from '@/lib/guideMeta'
import { buildRefMap, resolveTemplates, type RefMap } from '@/lib/templates'

// Agent names in this guide's prose and FAQ come from the database, not from this file.
// GUIDE_SLUGS lists every agent the prose names. A name that is renamed in the database
// updates here automatically. A slug that does not exist renders its raw template, loudly.
const GUIDE_SLUGS = ['apollo-io', 'artisan-ava', 'attention', 'clay', 'gong', 'hubspot-sales-hub', 'instantly-ai', 'lemlist', 'outreach', 'regie-ai']

const AGENT_LINK_STYLE = { color: '#2563EB', textDecoration: 'none', fontWeight: 500 }

function A({ s, r }: { s: string; r: RefMap }) {
  const ref = r[s]
  if (!ref || !ref.name) return <>{'{{' + s + '.name}}'}</>
  if (ref.is_active === false) return <>{ref.name}</>
  return <Link href={'/agents/' + s} style={AGENT_LINK_STYLE}>{ref.name}</Link>
}

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'HubSpot vs AI Agents: Do You Need Both? (2026)',
  description: 'HubSpot stores your data. AI agents act on it. How the two differ, which agents integrate with HubSpot, and the workflow that combines them.',
  openGraph: { title: 'HubSpot vs AI Agents: Do You Need Both? (2026)', description: 'HubSpot stores your data. AI agents act on it. How the two differ, which agents integrate with HubSpot, and the workflow that combines them.', url: 'https://theaiagentindex.com/resources/guides/hubspot-vs-ai-agents', type: 'article', siteName: 'The AI Agent Index' },
  twitter: { card: 'summary', title: 'HubSpot vs AI Agents: Do You Need Both? (2026)', description: 'HubSpot stores your data. AI agents act on it. How the two differ, which agents integrate with HubSpot, and the workflow that combines them.' },
  alternates: { canonical: 'https://theaiagentindex.com/resources/guides/hubspot-vs-ai-agents' },
}

export default async function HubSpotVsAIAgentsPage() {
  const meta = await getGuideMeta('hubspot-vs-ai-agents')
  const published = isoDate(meta?.published_at)
  const audited = isoDate(meta?.last_audited_at)
  const updated = updatedLabel(meta?.last_audited_at)

  const supabase = createClient()
  const refs = await buildRefMap(supabase, GUIDE_SLUGS)
  const t = (text: string) => resolveTemplates(text, refs)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'HubSpot vs AI Agents: Do You Need Both? (2026)',
    description: 'HubSpot stores your data. AI agents act on it. How the two differ, which agents integrate with HubSpot, and the workflow that combines them.',
    url: 'https://theaiagentindex.com/resources/guides/hubspot-vs-ai-agents',
    ...(published ? { datePublished: published } : {}),
    ...(audited ? { dateModified: audited } : {}),
    author: { '@type': 'Organization', name: 'The AI Agent Index', url: 'https://theaiagentindex.com' },
    publisher: { '@type': 'Organization', name: 'The AI Agent Index', url: 'https://theaiagentindex.com' },
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the difference between HubSpot and an AI agent?',
        acceptedAnswer: { '@type': 'Answer', text: 'HubSpot is a CRM: a system of record that stores contacts, deals and activity, mostly for humans to act on. An AI agent takes autonomous action without requiring human input for each step. HubSpot is the system of record; AI agents are the workers that populate it.' },
      },
      {
        '@type': 'Question',
        name: 'Can AI agents replace HubSpot?',
        acceptedAnswer: { '@type': 'Answer', text: 'No. AI agents complement HubSpot. HubSpot is the system of record where contacts, deals, and activity are stored. AI agents act on that data and write results back to HubSpot automatically.' },
      },
      {
        '@type': 'Question',
        name: 'Which AI agents integrate with HubSpot?',
        acceptedAnswer: { '@type': 'Answer', text: t("{{instantly-ai.name}}, {{apollo-io.name}}, {{clay.name}}, {{lemlist.name}}, {{artisan-ava.name}}, {{outreach.name}} and {{regie-ai.name}} all integrate with HubSpot, and {{hubspot-sales-hub.name}} is HubSpot's own sales product with built-in AI agents. Check each vendor's integration page for exactly which records sync in each direction. The full list is available at theaiagentindex.com/integrations/hubspot.") },
      },
      {
        '@type': 'Question',
        name: 'Do I need HubSpot if I have an AI agent?',
        acceptedAnswer: { '@type': 'Answer', text: 'For most teams, yes. AI agents need somewhere to store contacts, deals, and conversation history, and a CRM like HubSpot provides that infrastructure. Small teams may manage temporarily with just the AI tool, but a CRM becomes essential as volume and complexity grow.' },
      },
      {
        '@type': 'Question',
        name: t('What does {{hubspot-sales-hub.name}} do that AI agents do not?'),
        acceptedAnswer: { '@type': 'Answer', text: t("{{hubspot-sales-hub.name}} provides pipeline visibility, deal tracking, forecast reporting, team management, and a centralized contact record that persists over time. These are coordination and tracking functions. AI agents handle execution: prospecting, outreach, follow-up, data entry. HubSpot now adds Breeze AI agents of its own, so the line is blurring, but the CRM record and the agents that act on it remain complementary, not competing.") },
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
        <span style={{ fontSize: '0.8125rem', color: '#111827' }}>HubSpot vs AI Agents</span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' as const }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Guide</span>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#F3F4F6', color: '#374151', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Sales</span>
        <span style={{ fontSize: '0.75rem', color: '#6B7280', padding: '0.25rem 0.75rem', backgroundColor: '#F3F4F6', borderRadius: '9999px' }}>{updated}</span>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '0.25rem 0.75rem', borderRadius: '9999px', border: '1px solid #BFDBFE' }}>Independently Reviewed</span>
      </div>

      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
        HubSpot vs AI Agents: Do You Need Both?
      </h1>

      <p style={{ fontSize: '1.0625rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '0.75rem', maxWidth: '680px' }}>
        HubSpot is a CRM. AI agents are autonomous workers. Understanding the difference and how they work together is a core infrastructure decision for a sales team in 2026. Salesforce&apos;s 2024 State of Sales report found non-selling tasks such as admin and meeting prep consume 70% of reps&apos; time. AI agents are built to take on much of that work, while HubSpot captures and organizes what they produce.
      </p>
      <p style={{ fontSize: '0.9375rem', color: '#6B7280', lineHeight: 1.7, marginBottom: '1.75rem', maxWidth: '680px' }}>
        The question is not HubSpot or AI agents. It is how to combine them so that agents handle the repetitive work and your CRM captures everything automatically without reps touching it.
      </p>

      <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#0369A1', lineHeight: 1.6, margin: 0 }}>
          <strong>Bottom line:</strong> Most teams need both. HubSpot is your system of record. AI agents are the autonomous workers that populate it and keep it updated without human intervention at every step.
        </p>
      </div>

      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', marginTop: '2.5rem' }}>What is HubSpot?</h2>
      <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '1rem' }}>
        HubSpot is a customer relationship management (CRM) platform. It stores your contacts, companies, deals, and communication history. Sales reps use it to track pipeline, log calls, send sequences, and report on revenue. At its core, HubSpot is a tool that humans use. It surfaces information and automates reminders, and a human usually decides what to do and takes action. <A s="hubspot-sales-hub" r={refs} /> adds Breeze AI agents for prospecting, deal coaching and support to the CRM itself; teams that need more depth on a specific job, such as high-volume cold email or data enrichment, often add a specialist agent alongside it.
      </p>

      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', marginTop: '2.5rem' }}>What is an AI Agent?</h2>
      <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '1rem' }}>
        An AI agent takes autonomous action to complete a goal without requiring a human to drive each step. In a sales context, an AI agent might identify 500 target accounts, enrich contact data from multiple sources, write personalized emails, send them, monitor responses, follow up with non-responders, and route warm leads to a human rep without anyone clicking a button.
      </p>
      <div style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.6, margin: 0 }}>
          <strong>Related:</strong> <Link href="/definitions/what-is-an-ai-sales-agent" style={{ color: '#2563EB' }}>What is an AI Sales Agent?</Link> covers capabilities, use cases, and how to evaluate them.
        </p>
      </div>

      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', marginTop: '2.5rem' }}>Key Differences</h2>
      <div style={{ overflowX: 'auto' as const, marginBottom: '1.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' as const, fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#F9FAFB' }}>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left' as const, fontWeight: 600, color: '#111827', borderBottom: '1px solid #E5E7EB' }}></th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left' as const, fontWeight: 600, color: '#111827', borderBottom: '1px solid #E5E7EB' }}>HubSpot</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left' as const, fontWeight: 600, color: '#111827', borderBottom: '1px solid #E5E7EB' }}>AI Agent</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Primary role', 'System of record', 'Autonomous worker'],
              ['Who drives it', 'Humans', 'The agent itself'],
              ['What it stores', 'Contacts, deals, history', 'Goals, tasks, context'],
              ['What it produces', 'Reports, templates, alerts', 'Actions, emails, decisions'],
              ['Replaces', 'Spreadsheets and email chains', 'Manual, repetitive sales tasks'],
              ['Works best when', 'Humans are reviewing and acting', 'Repeatable, high-volume tasks'],
            ].map(([aspect, hubspot, agent]) => (
              <tr key={aspect} style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '0.75rem 1rem', color: '#374151', fontWeight: 500 }}>{aspect}</td>
                <td style={{ padding: '0.75rem 1rem', color: '#4B5563' }}>{hubspot}</td>
                <td style={{ padding: '0.75rem 1rem', color: '#4B5563' }}>{agent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', marginTop: '2.5rem' }}>How They Work Together</h2>
      <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '1rem' }}>
        Many sales stacks combine both. A typical workflow in 2026:
      </p>
      <ol style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column' as const, gap: '0.75rem' }}>
        {[
          { text: 'AI agent identifies and enriches target accounts from multiple data sources', jsx: null },
          { text: null, jsx: (<><A s="apollo-io" r={refs} /> or <A s="clay" r={refs} /> supplies the data for personalized outreach, and sequences send through <A s="apollo-io" r={refs} />, <A s="instantly-ai" r={refs} /> or <A s="lemlist" r={refs} /></>) },
          { text: 'Warm replies are flagged and routed to human reps automatically', jsx: null },
          { text: null, jsx: (<>AI agent creates or updates contact and deal records in HubSpot. Tools like <A s="clay" r={refs} /> can push enriched data back to the CRM, and <A s="apollo-io" r={refs} /> logs emails, calls and tasks on the matching HubSpot records</>) },
          { text: 'Human rep picks up warm leads in HubSpot with full context already logged', jsx: null },
          { text: null, jsx: (<><A s="gong" r={refs} /> or <A s="attention" r={refs} /> records sales calls and syncs them to HubSpot, and <A s="attention" r={refs} /> can update CRM fields from the conversation</>) },
          { text: 'HubSpot tracks the deal through close while AI handles follow-up at each stage', jsx: null },
        ].map((step, i) => (
          <li key={i} style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.6 }}>{step.text ?? step.jsx}</li>
        ))}
      </ol>

      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', marginTop: '2.5rem' }}>AI Agents That Integrate With HubSpot</h2>
      <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '1rem' }}>
        Outbound and data tools such as <A s="instantly-ai" r={refs} />, <A s="apollo-io" r={refs} />, <A s="clay" r={refs} />, <A s="lemlist" r={refs} />, <A s="artisan-ava" r={refs} />, <A s="outreach" r={refs} /> and <A s="regie-ai" r={refs} /> all integrate with HubSpot, so the contacts, emails and meetings they produce can land in your CRM without manual data entry. <A s="hubspot-sales-hub" r={refs} /> is HubSpot&apos;s own sales product, with Breeze AI agents built in. How much syncs, and in which direction, differs by vendor and sometimes by plan, so check each integration page before you rely on it.
      </p>
      <Link href="/integrations/hubspot" style={{ fontSize: '0.875rem', color: '#2563EB', fontWeight: 500, display: 'inline-block', marginBottom: '2rem' }}>Browse all HubSpot-integrated AI agents &#x2192;</Link>

      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', marginTop: '2.5rem' }}>Do You Need Both?</h2>
      <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '1rem' }}>
        <strong>For most B2B teams with any outbound motion: yes.</strong> HubSpot without AI agents means your reps spend more of their time on manual prospecting and data entry. AI agents without a CRM means your pipeline data is scattered and handoffs break down. The combination lets a small team cover more accounts without adding headcount for manual work, and the agents above are built to sync with a CRM like HubSpot, not to replace it.
      </p>
      <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '1rem' }}>
        The one exception: very early-stage teams (under 5 people, pre-PMF) sometimes start with just an outbound tool like <A s="instantly-ai" r={refs} /> or <A s="apollo-io" r={refs} /> before adding HubSpot. This is fine temporarily, but the CRM becomes essential as soon as you have more than one rep or more than one active deal stage to track.
      </p>

      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '1.25rem', marginTop: '2.5rem' }}>Frequently Asked Questions</h2>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '1rem', marginBottom: '2.5rem' }}>
        {faqLd.mainEntity.map(({ name, acceptedAnswer }) => (
          <div key={name} style={{ backgroundColor: '#F9FAFB', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1.25rem' }}>
            <p style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.5rem' }}>{name}</p>
            <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.65, margin: 0 }}>{acceptedAnswer.text}</p>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/ai-sales-agents" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>All AI Sales Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Browse the full category &#x2192;</p>
        </Link>
        <Link href="/integrations/hubspot" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>HubSpot Integrations</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>All HubSpot-connected agents &#x2192;</p>
        </Link>
        <Link href="/resources/guides/best-ai-agents-for-outbound-sales" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Best Outbound Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Full guide with picks &#x2192;</p>
        </Link>
        <Link href="/resources/guides/best-ai-agents-for-b2b-prospecting" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Best B2B Prospecting Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Apollo, Clay, Instantly compared &#x2192;</p>
        </Link>
        <Link href="/stacks/full-outbound-sales-stack" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Full Outbound Sales Stack</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Apollo + Instantly + Lemlist &#x2192;</p>
        </Link>
        <Link href="/resources/guides/how-ai-agents-are-changing-sales" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>How AI Is Changing Sales</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Adoption data and examples &#x2192;</p>
        </Link>
      </div>

      <p style={{ fontSize: '0.875rem', color: '#9CA3AF', lineHeight: 1.6 }}>
        All agents named in this guide are editorially reviewed by The AI Agent Index. See our <Link href="/methodology" style={{ color: '#6B7280' }}>editorial methodology</Link>.
      </p>

      <div style={{ marginBottom: '2rem' }}>
        <NewsletterSignup sourcePage="guide-hubspot-vs-ai-agents" sourceType="guide" />
      </div>

      <GuideCitations slug="hubspot-vs-ai-agents" table="guides" />
    </div>
  )
}