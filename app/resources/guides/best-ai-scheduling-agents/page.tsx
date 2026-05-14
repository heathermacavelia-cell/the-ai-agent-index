import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import type { Metadata } from 'next'
import GuideCitations from '@/components/GuideCitations'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Best AI Scheduling Agents (2026)',
  description: 'Compare AI scheduling agents for 2026. Reclaim.ai, Motion, Akiflow, and Lindy reviewed for calendar automation and task planning. Not affiliated.',
  openGraph: {
    title: 'Best AI Scheduling Agents (2026)',
    description: 'Compare AI scheduling agents for 2026. Reclaim.ai, Motion, Akiflow, and Lindy reviewed for calendar automation and task planning. Not affiliated.',
    url: 'https://theaiagentindex.com/resources/guides/best-ai-scheduling-agents',
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary',
    title: 'Best AI Scheduling Agents (2026)',
    description: 'Reclaim.ai, Motion, Akiflow, and Lindy compared for calendar automation, task planning, and meeting booking.',
  },
  alternates: { canonical: 'https://theaiagentindex.com/resources/guides/best-ai-scheduling-agents' },
}

export default async function SchedulingAgentsGuidePage() {
  const supabase = createClient()
  const { data: agents } = await supabase
    .from('agents')
    .select('id, name, slug, developer, short_description, primary_category, pricing_model, starting_price, rating_avg, rating_count, is_featured, is_verified, capability_tags, integrations')
    .eq('is_active', true)
    .eq('primary_category', 'ai-workflow-agents')
    .contains('capability_tags', ['scheduling'])
    .order('is_featured', { ascending: false })
    .order('rating_avg', { ascending: false })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Best AI Scheduling Agents 2026',
    description: 'Compare AI scheduling agents for 2026. Reclaim.ai, Motion, Akiflow, and Lindy reviewed for calendar automation, task planning, and meeting booking.',
    url: 'https://theaiagentindex.com/resources/guides/best-ai-scheduling-agents',
    publisher: { '@type': 'Organization', name: 'The AI Agent Index', url: 'https://theaiagentindex.com' },
    mainEntity: {
      '@type': 'ItemList',
      name: 'Best AI Scheduling Agents 2026',
      numberOfItems: agents?.length ?? 0,
      itemListElement: agents?.map((agent, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'SoftwareApplication',
          name: agent.name,
          description: agent.short_description,
          url: `https://theaiagentindex.com/agents/${agent.slug}`,
        }
      })) ?? []
    }
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div style={{ marginBottom: '0.75rem' }}>
        <Link href="/" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none' }}>Home</Link>
        <span style={{ color: '#D1D5DB', margin: '0 0.5rem' }}>/</span>
        <Link href="/resources/guides" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none' }}>Guides</Link>
        <span style={{ color: '#D1D5DB', margin: '0 0.5rem' }}>/</span>
        <span style={{ fontSize: '0.8125rem', color: '#111827' }}>Best AI Scheduling Agents</span>
      </div>

      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Guide</p>
      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
        Best AI Scheduling Agents (2026)
      </h1>

      <p style={{ fontSize: '1.0625rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '0.75rem', maxWidth: '680px' }}>
        Calendar management is one of the most consistent sources of friction in knowledge work. Professionals spend significant time each week on scheduling coordination, rescheduling conflicts, protecting focus time, and booking meetings across time zones, time that compounds into a material productivity cost across a team. AI scheduling agents address this by managing calendars autonomously, optimising task placement based on deadlines and priorities, and booking meetings through shared availability links without manual back-and-forth. This guide covers {agents?.length ?? 0} AI agents with scheduling and calendar automation as a core capability, from purpose-built scheduling tools to broader workflow agents that manage time as part of a wider set of autonomous tasks.
      </p>
      <p style={{ fontSize: '0.9375rem', color: '#6B7280', lineHeight: 1.7, marginBottom: '1rem', maxWidth: '680px' }}>
        The category ranges considerably in scope. Scheduling-first tools like <Link href="/agents/reclaim-ai" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Reclaim.ai</Link> and <Link href="/agents/akiflow" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Akiflow</Link> are built specifically around calendar optimisation and focus time protection. All-in-one productivity platforms like <Link href="/agents/motion" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Motion</Link> combine scheduling with task management, project planning, and meeting notes in a single product. Broader workflow agents like <Link href="/agents/lindy" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Lindy</Link> handle scheduling as one capability within a wider set of autonomous actions covering email, research, and CRM management. Picking the right fit depends on whether scheduling is a standalone problem you want to solve or one piece of a broader automation investment.
      </p>

      <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '2rem', maxWidth: '680px' }}>
        <p style={{ fontSize: '0.875rem', color: '#0369A1', lineHeight: 1.6, margin: 0 }}>
          <strong>Looking for meeting transcription and notes?</strong> See our companion guide: <Link href="/resources/guides/best-ai-meeting-agents" style={{ color: '#2563EB' }}>Best AI Meeting Agents (2026)</Link>, covering Fathom, Fireflies.ai, tl;dv, Granola, and Shadow for automatic meeting documentation after the call ends.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' as const, marginBottom: '2.5rem' }}>
        <Link href="/integrations/google-calendar" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', backgroundColor: '#F9FAFB', padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>Google Calendar integrations →</Link>
        <Link href="/integrations/outlook" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', backgroundColor: '#F9FAFB', padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>Outlook integrations →</Link>
        <Link href="/integrations/slack" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', backgroundColor: '#F9FAFB', padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>Slack integrations →</Link>
        <Link href="/integrations/zoom" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', backgroundColor: '#F9FAFB', padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>Zoom integrations →</Link>
        <Link href="/integrations/hubspot" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', backgroundColor: '#F9FAFB', padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>HubSpot integrations →</Link>
        <Link href="/integrations/notion" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', backgroundColor: '#F9FAFB', padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>Notion integrations →</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
        {agents?.map((agent, index) => (
          <Link key={agent.slug} href={'/agents/' + agent.slug}
            style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: agent.is_featured ? '1px solid #BFDBFE' : '1px solid #E5E7EB', padding: '1.25rem', textDecoration: 'none', display: 'block', position: 'relative' }}>
            {index < 3 && (
              <span style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', fontSize: '0.625rem', fontWeight: 700, backgroundColor: '#FEF3C7', color: '#D97706', padding: '0.15rem 0.4rem', borderRadius: '9999px', textTransform: 'uppercase' as const }}>
                #{index + 1}
              </span>
            )}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ flex: 1, paddingRight: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' as const, marginBottom: '0.2rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#111827' }}>{agent.name}</span>
                  {agent.is_verified && <span style={{ fontSize: '0.625rem', fontWeight: 700, backgroundColor: '#DCFCE7', color: '#16A34A', padding: '0.1rem 0.4rem', borderRadius: '9999px', textTransform: 'uppercase' as const }}>Verified</span>}
                  {agent.is_featured && <span style={{ fontSize: '0.625rem', fontWeight: 700, backgroundColor: '#DBEAFE', color: '#1D4ED8', padding: '0.1rem 0.4rem', borderRadius: '9999px', textTransform: 'uppercase' as const }}>Featured</span>}
                </div>
                <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>by {agent.developer}</span>
              </div>
              {agent.rating_avg > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
                  <span style={{ color: '#2563EB', fontSize: '0.75rem' }}>★</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151' }}>{Number(agent.rating_avg).toFixed(1)}</span>
                </div>
              )}
            </div>
            <p style={{ fontSize: '0.8125rem', color: '#4B5563', lineHeight: 1.55, marginBottom: '0.75rem' }}>{agent.short_description}</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.75rem', color: '#6B7280', backgroundColor: '#F3F4F6', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', textTransform: 'capitalize' as const }}>{agent.pricing_model}</span>
              <span style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 500 }}>View →</span>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2.5rem', marginBottom: '3rem', maxWidth: '680px' }}>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#111827', marginBottom: '1rem', letterSpacing: '-0.01em' }}>
          How to evaluate AI scheduling agents
        </h2>
        <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1rem' }}>
          The most important distinction in this category is between tools that optimise your existing calendar and tools that manage tasks and scheduling together. <Link href="/agents/reclaim-ai" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Reclaim.ai</Link> is a pure calendar optimisation layer: it sits on top of Google Calendar, identifies available time, and automatically schedules habits, focus blocks, and task time while protecting against meeting overload. <Link href="/agents/akiflow" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Akiflow</Link> works similarly, pulling tasks from connected tools into a unified inbox and helping you time-block them into your calendar each day through a structured daily planning ritual. <Link href="/agents/motion" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Motion</Link> goes further, combining tasks, projects, calendar, and meeting notes into one platform and using AI to build and continuously replan a daily schedule based on deadlines, priorities, and available time.
        </p>
        <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1rem' }}>
          Teams evaluating scheduling agents also need to assess meeting booking specifically. Most tools in this guide offer shareable booking links that show real availability and let contacts self-schedule, eliminating the back-and-forth. The differentiation lies in how intelligently the tool protects existing focus time when meetings are booked, whether it respects buffer time between calls, and how it handles multi-person team scheduling where multiple calendars need to be reconciled simultaneously. <Link href="/agents/lindy" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Lindy</Link> approaches scheduling from a different angle, acting as a full inbox and calendar agent that handles scheduling requests in natural language and coordinates meeting logistics autonomously as part of broader email and workflow management.
        </p>

        <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', marginTop: '1.75rem' }}>
          Recommended tool by use case
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.75rem', marginBottom: '1.5rem' }}>
          {[
            {
              useCase: 'Calendar optimisation and focus time protection',
              jsx: <><Link href="/agents/reclaim-ai" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Reclaim.ai</Link> for individuals and teams who want to protect focus blocks, automate habit scheduling, and prevent calendar fragmentation without switching tools. Works natively on top of Google Calendar with a free tier that covers core features.</>
            },
            {
              useCase: 'Daily task planning with time blocking',
              jsx: <><Link href="/agents/akiflow" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Akiflow</Link> for professionals who want a structured daily planning system that pulls tasks from Asana, Jira, Gmail, Slack, and other tools into one place and helps time-block them into the calendar. Best for individuals who manage work across many tools and need one place to plan their day.</>
            },
            {
              useCase: 'All-in-one task, project, and calendar management',
              jsx: <><Link href="/agents/motion" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Motion</Link> for teams that want AI to build and continuously replan a daily schedule based on task deadlines, priorities, and meeting load. Replaces separate task management, calendar, and project tools with a single platform that optimises the plan automatically as things change.</>
            },
            {
              useCase: 'Scheduling as part of broader workflow automation',
              jsx: <><Link href="/agents/lindy" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Lindy</Link> for teams that want to automate scheduling alongside email handling, CRM updates, and research tasks. Lindy acts as a full executive assistant agent rather than a standalone calendar tool, making it the right fit when scheduling is one piece of a broader automation need.</>
            },
            {
              useCase: 'Enterprise scheduling in the Microsoft ecosystem',
              jsx: <><Link href="/agents/microsoft-365-copilot" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Microsoft 365 Copilot</Link> for organisations already on Microsoft 365 that want scheduling assistance, meeting preparation, and calendar management without adding external tools. Copilot handles meeting summaries, drafts, and scheduling suggestions natively inside Outlook and Teams.</>
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
              def: (<>Support for Google Calendar and Outlook is table stakes. Tools that sync multiple calendar accounts, including personal and work, and detect conflicts across all of them prevent double-booking. <Link href="/agents/motion" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Motion</Link> and <Link href="/agents/akiflow" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Akiflow</Link> both handle multi-calendar sync and use conflict data to plan task time realistically.</>)
            },
            {
              term: 'Focus time protection',
              def: (<><Link href="/agents/reclaim-ai" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Reclaim.ai</Link> leads the category here, automatically defending focus blocks and moving them when meetings are booked nearby. This is the core value proposition for knowledge workers whose calendars get fragmented by meetings scheduled without regard for deep work time.</>)
            },
            {
              term: 'Meeting booking links and availability sharing',
              def: (<>All major tools offer shareable booking links. The differentiator is how intelligently they protect existing commitments when new meetings are booked. <Link href="/agents/akiflow" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Akiflow</Link> allows one-off and recurring booking links with buffer settings. <Link href="/agents/reclaim-ai" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Reclaim.ai</Link> manages meeting slots within a framework of protected blocks.</>)
            },
            {
              term: 'Task and deadline-aware scheduling',
              def: (<><Link href="/agents/motion" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Motion</Link> automatically places tasks into calendar time based on their deadlines, priorities, and estimated duration, then replans the schedule dynamically as things change. This goes beyond standard time blocking by treating the calendar as a living plan rather than a static grid.</>)
            },
            {
              term: 'Integration with task and project tools',
              def: (<><Link href="/agents/akiflow" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Akiflow</Link> pulls tasks from Asana, Jira, Linear, Todoist, Gmail, Slack, and other tools into a single unified inbox. This matters most for professionals managing work across many systems who need one planning surface rather than context-switching between tools to build a daily plan.</>)
            },
            {
              term: 'Autonomous scheduling without manual setup',
              def: (<><Link href="/agents/lindy" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Lindy</Link> handles scheduling requests in natural language, reading emails and messages that contain meeting requests and coordinating calendar logistics without requiring the user to configure rigid rules. Best for teams that want delegation-style scheduling rather than template-based automation.</>)
            },
          ].map((item) => (
            <li key={item.term} style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.6, display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <span style={{ color: '#2563EB', flexShrink: 0, fontWeight: 700, marginTop: '2px' }}>→</span>
              <span><strong>{item.term}:</strong> {item.def}</span>
            </li>
          ))}
        </ul>

        <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', marginTop: '1.75rem' }}>
          Also worth exploring
        </h3>
        <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '0.75rem' }}>
          Several agents in the index include scheduling as part of a broader capability set. <Link href="/agents/adapt" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Adapt</Link> combines scheduling with workflow automation and CRM sync for revenue teams. <Link href="/agents/viktor" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Viktor</Link> handles scheduling alongside reporting, data analysis, and code generation as a general-purpose autonomous agent. <Link href="/agents/aident-ai" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Aident AI</Link> includes scheduling as part of a no-code workflow builder aimed at small business automation. Teams inside the Microsoft 365 ecosystem should also evaluate <Link href="/agents/microsoft-copilot-cowork" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Microsoft Copilot Cowork</Link>, which combines desktop automation with scheduling and task management natively in Windows.
        </p>

        <p style={{ fontSize: '0.875rem', color: '#9CA3AF', lineHeight: 1.6, marginTop: '2rem' }}>
          All agents listed above are editorially reviewed by The AI Agent Index. Scores reflect public signals including G2 ratings, product documentation, and verified user evidence. See our <Link href="/methodology" style={{ color: '#6B7280' }}>editorial methodology</Link>.
        </p>
      </div>

      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        <Link href="/ai-workflow-agents" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>All AI Workflow Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Browse the full category →</p>
        </Link>
        <Link href="/resources/guides/best-ai-workflow-agents" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Best AI Workflow Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Zapier, Make, n8n, and Lindy →</p>
        </Link>
        <Link href="/resources/guides/best-ai-meeting-agents" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Best AI Meeting Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Fathom vs Fireflies vs tl;dv →</p>
        </Link>
        <Link href="/resources/guides/what-is-an-ai-agent" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>What is an AI Agent?</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Read the definition →</p>
        </Link>
        <Link href="/integrations/google-calendar" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Best for Google Calendar</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Filter by integration →</p>
        </Link>
        <Link href="/integrations/outlook" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Best for Outlook</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Filter by integration →</p>
        </Link>
      </div>
      <GuideCitations slug="best-ai-scheduling-agents" table="guides" />
    </div>
  )
}