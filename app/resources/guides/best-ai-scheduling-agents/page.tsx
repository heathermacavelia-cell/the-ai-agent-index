import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import type { Metadata } from 'next'
import GuideCitations from '@/components/GuideCitations'
import NewsletterSignup from '@/components/NewsletterSignup'
import { getGuideMeta, isoDate, updatedLabel } from '@/lib/guideMeta'
import GuideAgentList from '@/components/GuideAgentList'
import { getGuideGroups, type GuideGroup } from '@/lib/guideAgents'
import { buildRefMap, resolveTemplates, type RefMap } from '@/lib/templates'

// Agent names in this guide's prose and FAQ come from the database, not from this file.
// GUIDE_SLUGS lists every agent the prose names. A name that is renamed in the database
// updates here automatically. A slug that does not exist renders its raw template, loudly.
const GUIDE_SLUGS = ['adapt', 'akiflow', 'fathom', 'fireflies-ai', 'granola', 'lindy', 'microsoft-365-copilot', 'microsoft-copilot-cowork', 'motion', 'reclaim-ai', 'shadow', 'tldv', 'viktor']

// The agents this guide lists, in this order, under the guide's three types.
// Chosen by hand (Heather, 2026-10-29) - never by tag. Order is editorial, not a ranking.
const GUIDE_GROUPS: GuideGroup[] = [
  {
    heading: 'Calendar and focus',
    intro: 'Tools that work on your existing calendar to place tasks, protect focus time and plan the day.',
    slugs: ['reclaim-ai', 'akiflow'],
  },
  {
    heading: 'All-in-one planners',
    intro: 'Platforms that hold tasks, projects and meetings together and schedule them onto your calendar.',
    slugs: ['motion'],
  },
  {
    heading: 'Assistants that book meetings',
    intro: 'Broader AI assistants that handle scheduling as one task among email, meeting prep and other work.',
    slugs: ['lindy', 'microsoft-365-copilot'],
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
  title: 'Best AI Scheduling Agents: Focus vs All-in-One (2026)',
  description: 'Reclaim.ai for focus time, Motion for auto-scheduling, Akiflow for daily planning, Lindy for scheduling in Slack and email. Independently researched.',
  openGraph: {
    title: 'Best AI Scheduling Agents: Focus vs All-in-One (2026)',
    description: 'Reclaim.ai for focus time, Motion for auto-scheduling, Akiflow for daily planning, Lindy for scheduling in Slack and email. Independently researched.',
    url: 'https://theaiagentindex.com/resources/guides/best-ai-scheduling-agents',
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary',
    title: 'Best AI Scheduling Agents: Focus vs All-in-One (2026)',
    description: 'Reclaim.ai for focus time, Motion for auto-scheduling, Akiflow for daily planning, Lindy for scheduling in Slack and email. Independently researched.',
  },
  alternates: { canonical: 'https://theaiagentindex.com/resources/guides/best-ai-scheduling-agents' },
}

export default async function SchedulingAgentsGuidePage() {
  const meta = await getGuideMeta('best-ai-scheduling-agents')
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
    headline: 'Best AI Scheduling Agents: Focus vs All-in-One (2026)',
    description: t('{{reclaim-ai.name}} for focus time, {{motion.name}} for auto-scheduling, {{akiflow.name}} for daily planning, {{lindy.name}} for scheduling in Slack and email.'),
    url: 'https://theaiagentindex.com/resources/guides/best-ai-scheduling-agents',
    ...(published ? { datePublished: published } : {}),
    ...(audited ? { dateModified: audited } : {}),
    author: { '@type': 'Organization', name: 'The AI Agent Index', url: 'https://theaiagentindex.com' },
    publisher: { '@type': 'Organization', name: 'The AI Agent Index', url: 'https://theaiagentindex.com' },
  }

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Best AI Scheduling Agents (2026)',
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

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the best AI scheduling agent?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: t("It depends on what you want scheduled. {{reclaim-ai.name}} suits people who want AI to auto-schedule tasks and defend focus time on their existing Google Calendar or Outlook calendar. {{motion.name}} suits teams that want tasks, meetings and projects scheduled onto the calendar automatically and replanned as plans change. {{akiflow.name}} suits professionals who want tasks, calendars and a universal inbox in one daily planner. {{lindy.name}} suits teams that want scheduling handled as part of a broader assistant that also triages email and prepares for meetings.")
        }
      },
      {
        '@type': 'Question',
        name: 'What is the difference between calendar optimization tools and all-in-one productivity platforms?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: t("Calendar optimization tools like {{reclaim-ai.name}} sit on top of your existing calendar, finding available time and scheduling tasks and focus blocks around your meetings. All-in-one platforms like {{motion.name}} hold tasks, projects and meetings in one system and use AI to schedule them onto your calendar, replanning as things change. Optimization tools are lighter to adopt; all-in-one platforms ask you to move more of your work into them, in return for one place that shows how your time is allocated.")
        }
      },
      {
        '@type': 'Question',
        name: 'Which AI scheduling agent is best for protecting focus time?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: t("{{reclaim-ai.name}} is built around this: its calendar agents defend focus time on Google Calendar and Outlook and auto-schedule tasks around meetings. {{akiflow.name}} takes a planning approach, bringing tasks and calendars into one app so you can block time for focused work as you plan the day. Choose based on whether you want focus time defended automatically or planned by hand each day.")
        }
      },
      {
        '@type': 'Question',
        name: 'How do AI scheduling agents handle meeting booking?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: t("Many scheduling tools offer shareable booking links that show real availability and let contacts self-schedule without back-and-forth. The differences to check are how the tool protects existing focus time when new meetings are booked, whether it respects buffer time between calls, and how it handles scheduling across several people's calendars. {{lindy.name}} takes a different approach: it is an AI teammate in Slack, iMessage and email that handles scheduling alongside inbox triage and meeting prep.")
        }
      },
      {
        '@type': 'Question',
        name: 'Which AI scheduling tool works best with Google Calendar?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: t("{{reclaim-ai.name}} works on top of Google Calendar and Outlook, so there is no calendar to migrate. {{akiflow.name}} brings your calendars into its daily planner, and {{motion.name}} schedules tasks, meetings and projects onto your calendar. Check each tool's listing for the calendar integrations it supports. For organizations on Microsoft 365, {{microsoft-365-copilot.name}} works inside Outlook and Teams, grounded in your work data, without adding an external tool.")
        }
      },
      {
        '@type': 'Question',
        name: 'Can AI scheduling agents manage tasks as well as calendar events?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: t("Yes. {{motion.name}} auto-schedules tasks, meetings and projects on your calendar and replans the schedule as plans change. {{akiflow.name}} brings tasks, calendars and a universal inbox into one app for daily planning. {{reclaim-ai.name}} also auto-schedules tasks, but is centred on working within your existing calendar rather than replacing your task manager.")
        }
      },
    ]
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <div style={{ marginBottom: '0.75rem' }}>
        <Link href="/" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none' }}>Home</Link>
        <span style={{ color: '#D1D5DB', margin: '0 0.5rem' }}>/</span>
        <Link href="/resources/guides" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none' }}>Guides</Link>
        <span style={{ color: '#D1D5DB', margin: '0 0.5rem' }}>/</span>
        <span style={{ fontSize: '0.8125rem', color: '#111827' }}>Best AI Scheduling Agents</span>
      </div>

      {/* Header pills */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' as const }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Independently Reviewed</span>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Guide</span>
        <span style={{ fontSize: '0.75rem', color: '#6B7280', padding: '0.25rem 0.75rem', backgroundColor: '#F3F4F6', borderRadius: '9999px' }}>{updated}</span>
      </div>

      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
        Best AI Scheduling Agents (2026)
      </h1>

      <p style={{ fontSize: '1.0625rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '0.75rem', maxWidth: '680px' }}>
        Calendar management is a steady source of friction in knowledge work: coordinating meeting times, resolving conflicts, protecting focus time and booking meetings across time zones all take time that adds up across a team. AI scheduling agents address this by placing tasks on the calendar based on deadlines and priorities, defending time for focused work, and handling meeting logistics with less manual back-and-forth. This guide covers {listed.length} AI agents with scheduling and calendar automation as a core capability, grouped into three types: calendar and focus tools, all-in-one planners, and broader assistants that book meetings.
      </p>
      <p style={{ fontSize: '0.9375rem', color: '#6B7280', lineHeight: 1.7, marginBottom: '1rem', maxWidth: '680px' }}>
        The category ranges considerably in scope. Scheduling-first tools like <A s="reclaim-ai" r={refs} /> and <A s="akiflow" r={refs} /> are built around the calendar: auto-scheduling tasks, defending focus time and planning the day. All-in-one platforms like <A s="motion" r={refs} /> combine scheduling with tasks and projects in a single product. Broader assistants like <A s="lindy" r={refs} /> handle scheduling as one capability alongside inbox triage, meeting prep, reports and CRM updates. Picking the right fit depends on whether scheduling is a standalone problem you want to solve or one piece of a broader automation investment.
      </p>

      <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '2rem', maxWidth: '680px' }}>
        <p style={{ fontSize: '0.875rem', color: '#0369A1', lineHeight: 1.6, margin: 0 }}>
          <strong>Looking for meeting transcription and notes?</strong> See our companion guide: <Link href="/resources/guides/best-ai-meeting-agents" style={{ color: '#2563EB' }}>Best AI Meeting Agents (2026)</Link>, covering <A s="fathom" r={refs} />, <A s="fireflies-ai" r={refs} />, <A s="tldv" r={refs} />, <A s="granola" r={refs} />, and <A s="shadow" r={refs} /> for automatic meeting documentation after the call ends.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' as const, marginBottom: '2.5rem' }}>
        <Link href="/integrations/google-calendar" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', backgroundColor: '#F9FAFB', padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>Google Calendar integrations &#x2192;</Link>
        <Link href="/integrations/microsoft-outlook" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', backgroundColor: '#F9FAFB', padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>Outlook integrations &#x2192;</Link>
        <Link href="/integrations/slack" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', backgroundColor: '#F9FAFB', padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>Slack integrations &#x2192;</Link>
        <Link href="/integrations/zoom" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', backgroundColor: '#F9FAFB', padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>Zoom integrations &#x2192;</Link>
        <Link href="/integrations/hubspot" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', backgroundColor: '#F9FAFB', padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>HubSpot integrations &#x2192;</Link>
        <Link href="/integrations/notion" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', backgroundColor: '#F9FAFB', padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>Notion integrations &#x2192;</Link>
      </div>

      <GuideAgentList groups={GUIDE_GROUPS} />

      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2.5rem', marginBottom: '3rem', maxWidth: '680px' }}>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#111827', marginBottom: '1rem', letterSpacing: '-0.01em' }}>
          How to evaluate AI scheduling agents
        </h2>
        <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1rem' }}>
          The most important distinction in this category is between tools that optimize your existing calendar and tools that manage tasks and scheduling together. <A s="reclaim-ai" r={refs} /> is a calendar optimization layer: its AI calendar agents work on Google Calendar and Outlook, auto-scheduling tasks, defending focus time and managing meetings. <A s="akiflow" r={refs} /> is an AI daily planner that brings tasks, calendars and a universal inbox into one app, with the Aki assistant, so you can block time for tasks as you plan each day. <A s="motion" r={refs} /> goes further, auto-scheduling tasks, meetings and projects on your calendar and replanning as plans change.
        </p>
        <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1rem' }}>
          Teams evaluating scheduling agents also need to assess meeting booking specifically. Many scheduling tools offer shareable booking links that show real availability and let contacts self-schedule, removing the back-and-forth. The differences lie in how the tool protects existing focus time when meetings are booked, whether it respects buffer time between calls, and how it handles team scheduling where several calendars need to be reconciled. <A s="lindy" r={refs} /> approaches scheduling from a different angle: it is an AI teammate in Slack, iMessage and email that handles scheduling alongside inbox triage, meeting prep and CRM updates.
        </p>

        <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', marginTop: '1.75rem' }}>
          Recommended tool by use case
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.75rem', marginBottom: '1.5rem' }}>
          {[
            {
              useCase: 'Calendar optimization and focus time protection',
              jsx: <><A s="reclaim-ai" r={refs} /> for individuals and teams who want to defend focus time, auto-schedule tasks and keep meetings from fragmenting the calendar without switching tools. Works on top of Google Calendar and Outlook.</>
            },
            {
              useCase: 'Daily task planning with time blocking',
              jsx: <><A s="akiflow" r={refs} /> for professionals who want one daily planner that brings tasks, calendars and a universal inbox together, with the Aki assistant and an MCP server. A good fit for people who manage work across many tools and want one place to plan their day.</>
            },
            {
              useCase: 'All-in-one task, project, and calendar management',
              jsx: <><A s="motion" r={refs} /> for teams that want AI to auto-schedule tasks, meetings and projects on the calendar and replan as plans change, so the plan updates without manual rescheduling.</>
            },
            {
              useCase: 'Scheduling as part of broader workflow automation',
              jsx: <><A s="lindy" r={refs} /> for teams that want scheduling handled alongside inbox triage, meeting prep, reports and CRM updates across 1,500+ apps. It works as an AI teammate in Slack, iMessage and email rather than a standalone calendar tool, so it fits when scheduling is one piece of a broader automation need.</>
            },
            {
              useCase: 'Enterprise scheduling in the Microsoft ecosystem',
              jsx: <><A s="microsoft-365-copilot" r={refs} /> for organizations already on Microsoft 365 that want AI assistance in Outlook and Teams, grounded in their work data, without adding external tools.</>
            },
          ].map((item) => (
            <div key={item.useCase} style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.625rem', padding: '1rem' }}>
              <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#111827', marginBottom: '0.375rem' }}>{item.useCase}</p>
              <p style={{ fontSize: '0.8125rem', color: '#6B7280', lineHeight: 1.6, margin: 0 }}>{item.jsx}</p>
            </div>
          ))}
        </div>

        <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', marginTop: '1.75rem' }}>
          Key capabilities to look for
        </h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column' as const, gap: '0.625rem', marginBottom: '1.5rem' }}>
          {[
            {
              term: 'Calendar sync and conflict detection',
              def: (<>Support for Google Calendar and Outlook is table stakes. Tools that sync several calendar accounts, including personal and work, and detect conflicts across all of them prevent double-booking. <A s="motion" r={refs} /> schedules tasks around the meetings already on your calendar, and <A s="akiflow" r={refs} /> brings your calendars into one planner. Check each tool&apos;s listing for the calendars it connects to.</>)
            },
            {
              term: 'Focus time protection',
              def: (<><A s="reclaim-ai" r={refs} /> is built around this, with calendar agents that defend focus time. This is the core value for knowledge workers whose calendars get fragmented by meetings scheduled without regard for deep work time.</>)
            },
            {
              term: 'Meeting booking links and availability sharing',
              def: (<>Many tools offer shareable booking links. The difference is how they protect existing commitments when new meetings are booked, and whether they support buffers between calls. <A s="reclaim-ai" r={refs} /> manages meetings alongside the focus time and tasks it has already scheduled.</>)
            },
            {
              term: 'Task and deadline-aware scheduling',
              def: (<><A s="motion" r={refs} /> auto-schedules tasks, meetings and projects on your calendar and replans as plans change. This goes beyond standard time blocking by treating the calendar as a living plan rather than a static grid.</>)
            },
            {
              term: 'Integration with task and project tools',
              def: (<><A s="akiflow" r={refs} /> brings tasks, calendars and a universal inbox into one app, and offers an MCP server. This matters most for professionals managing work across many systems who want one planning surface rather than switching between tools to build a daily plan.</>)
            },
            {
              term: 'Autonomous scheduling without manual setup',
              def: (<><A s="lindy" r={refs} /> handles scheduling as an AI teammate in Slack, iMessage and email, so you can delegate it in plain language rather than configuring rigid rules. A fit for teams that want delegation-style scheduling rather than template-based automation.</>)
            },
          ].map((item) => (
            <li key={item.term} style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.6, display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <span style={{ color: '#2563EB', flexShrink: 0, fontWeight: 700, marginTop: '2px' }}>&#x2192;</span>
              <span><strong>{item.term}:</strong> {item.def}</span>
            </li>
          ))}
        </ul>

        <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', marginTop: '1.75rem' }}>
          Also worth exploring
        </h3>
        <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '0.75rem' }}>
          When scheduling is one task among many, broader agent platforms in the index are worth a look. <A s="adapt" r={refs} /> lets teams build agents on shared company knowledge and tools, used in Slack, web, email or text. <A s="viktor" r={refs} /> is an AI coworker in Slack, Teams and Discord that connects to thousands of tools and can write and run code. Teams inside the Microsoft 365 ecosystem should also evaluate <A s="microsoft-copilot-cowork" r={refs} />, which carries out multi-step work across Outlook, Teams, Word, Excel and PowerPoint.
        </p>

        <p style={{ fontSize: '0.875rem', color: '#9CA3AF', lineHeight: 1.6, marginTop: '2rem' }}>
          All agents listed above are editorially reviewed by The AI Agent Index. Scores reflect public signals including G2 ratings, product documentation, and verified user evidence. See our <Link href="/methodology" style={{ color: '#6B7280' }}>editorial methodology</Link>.
        </p>
      </div>

      {/* Newsletter */}
      <div style={{ marginBottom: '3rem' }}>
        <NewsletterSignup />
      </div>

      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        <Link href="/ai-workflow-agents" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>All AI Workflow Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Browse the full category &#x2192;</p>
        </Link>
        <Link href="/resources/guides/best-ai-workflow-agents" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Best AI Workflow Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Zapier, Make.com, n8n, and Lindy &#x2192;</p>
        </Link>
        <Link href="/resources/guides/best-ai-meeting-agents" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Best AI Meeting Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Fathom vs Fireflies.ai vs tl;dv &#x2192;</p>
        </Link>
        <Link href="/resources/guides/what-is-an-ai-agent" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>What is an AI Agent?</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Read the definition &#x2192;</p>
        </Link>
        <Link href="/integrations/google-calendar" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Best for Google Calendar</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Filter by integration &#x2192;</p>
        </Link>
        <Link href="/integrations/microsoft-outlook" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Best for Outlook</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Filter by integration &#x2192;</p>
        </Link>
      </div>
      <GuideCitations slug="best-ai-scheduling-agents" table="guides" />
    </div>
  )
}