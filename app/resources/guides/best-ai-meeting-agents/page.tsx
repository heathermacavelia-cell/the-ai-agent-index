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
const GUIDE_SLUGS = ['avoma', 'clari-copilot', 'fathom', 'fireflies-ai', 'gong', 'granola', 'lindy', 'make', 'microsoft-365-copilot', 'n8n', 'olva', 'otter-ai', 'shadow', 'spellar-ai', 'tldv', 'zapier']

// The agents this guide lists, in this order, under the guide's three types.
// Chosen by hand (Heather, 2026-10-29) - never by tag. Order is editorial, not a ranking.
const GUIDE_GROUPS: GuideGroup[] = [
  {
    heading: 'Note-takers that join calls',
    intro: 'Tools that send a bot into scheduled video calls to record, transcribe and summarize them without anyone pressing start.',
    slugs: ['fathom', 'fireflies-ai', 'otter-ai', 'tldv', 'read-ai'],
  },
  {
    heading: 'Bot-free note-takers',
    intro: 'Tools that capture audio on your own device, so no extra participant joins the call.',
    slugs: ['granola', 'shadow', 'spellar-ai', 'olva'],
  },
  {
    heading: 'Revenue intelligence',
    intro: 'Platforms for sales teams that analyze recorded calls for coaching, deal risk, forecasting and CRM updates.',
    slugs: ['gong', 'avoma', 'clari-copilot'],
  },
]

const AGENT_LINK_STYLE = { color: '#2563EB', textDecoration: 'none', fontWeight: 500 }

function A({ s, r }: { s: string; r: RefMap }) {
  const ref = r[s]
  if (!ref || !ref.name) return <>{'{{' + s + '.name}}'}</>
  if (ref.is_active === false) return <>{ref.name}</>
  return <Link href={'/agents/' + s} style={AGENT_LINK_STYLE}>{ref.name}</Link>
}

const lk = { color: '#2563EB', textDecoration: 'none', fontWeight: 500 } as const

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Best AI Meeting Agents: Notes vs Revenue Intel (2026)',
  description: 'AI meeting agents compared: bot-based notetakers like Fathom, Fireflies.ai, Otter.ai and tl;dv vs bot-free tools like Granola and Shadow. HIPAA, Teams, APIs.',
  openGraph: {
    title: 'Best AI Meeting Agents: Notes vs Revenue Intel (2026)',
    description: 'AI meeting agents compared: bot-based notetakers like Fathom, Fireflies.ai, Otter.ai and tl;dv vs bot-free tools like Granola and Shadow. HIPAA, Teams, APIs.',
    url: 'https://theaiagentindex.com/resources/guides/best-ai-meeting-agents',
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary',
    title: 'Best AI Meeting Agents: Notes vs Revenue Intel (2026)',
    description: 'AI meeting agents compared: bot-based notetakers like Fathom, Fireflies.ai, Otter.ai and tl;dv vs bot-free tools like Granola and Shadow. HIPAA, Teams, APIs.',
  },
  alternates: { canonical: 'https://theaiagentindex.com/resources/guides/best-ai-meeting-agents' },
}

export default async function MeetingAgentsGuidePage() {
  const meta = await getGuideMeta('best-ai-meeting-agents')
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
    headline: 'Best AI Meeting Agents (2026)',
    description: 'AI meeting agents compared: bot-based notetakers like Fathom, Fireflies.ai, Otter.ai and tl;dv vs bot-free tools like Granola and Shadow. HIPAA, Teams, APIs.',
    url: 'https://theaiagentindex.com/resources/guides/best-ai-meeting-agents',
    ...(published ? { datePublished: published } : {}),
    ...(audited ? { dateModified: audited } : {}),
    author: { '@type': 'Organization', name: 'The AI Agent Index', url: 'https://theaiagentindex.com' },
    publisher: { '@type': 'Organization', name: 'The AI Agent Index', url: 'https://theaiagentindex.com' },
  }

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Best AI Meeting Agents (2026)',
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
        name: 'What is the best AI meeting agent?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: t("It depends on how you want meetings captured. Bot-based notetakers such as {{fathom.name}}, {{fireflies-ai.name}}, {{otter-ai.name}} and {{tldv.name}} join scheduled calls automatically and record every calendar meeting. Bot-free tools such as {{granola.name}}, {{shadow.name}}, {{spellar-ai.name}} and {{olva.name}} capture audio from your own device, so no participant joins the call. Sales teams that want CRM sync and coaching usually compare {{tldv.name}}, {{avoma.name}} and {{otter-ai.name}}, or a revenue intelligence platform such as {{gong.name}}. Teams with HIPAA requirements should check which plan carries it: {{granola.name}} offers HIPAA workspaces only on its Enterprise plan.")
        }
      },
      {
        '@type': 'Question',
        name: 'What is the difference between bot-based and bot-free meeting agents?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "A bot-based agent joins the call as a participant, so it can record every scheduled meeting without anyone pressing start, and other attendees can see it. A bot-free agent captures system and microphone audio on the user's own computer or phone, so nothing joins the call and it is not tied to one meeting app, but some bot-free tools need the user to start each recording."
        }
      },
      {
        '@type': 'Question',
        name: 'Which AI meeting agent is best for sales teams?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: t("Sales teams usually need CRM sync, coaching and call analytics. {{tldv.name}} offers CRM sync with coaching playbooks, {{avoma.name}} covers transcription, notes, CRM sync, coaching and forecasting, and {{otter-ai.name}} syncs notes to CRM and adds SDR and Recruiting agents. For revenue intelligence, {{gong.name}} records calls, meetings and emails to flag deal risk, forecast pipeline and coach reps, and {{clari-copilot.name}} records and analyzes sales calls with real-time battlecards and automated CRM updates.")
        }
      },
      {
        '@type': 'Question',
        name: 'Which AI meeting agent is best for regulated industries?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: t("Start with the compliance terms rather than the feature list. {{fathom.name}} states it is HIPAA compliant and offers a BAA, {{otter-ai.name}} announced HIPAA compliance in 2025, {{fireflies-ai.name}} lists HIPAA compliance on its Enterprise plan, and {{granola.name}} offers HIPAA workspaces with a Business Associate Agreement on its Enterprise plan only. {{shadow.name}} transcribes on the device. Before deploying any meeting agent in healthcare, finance or legal work, confirm where transcripts are stored, how long they are kept, whether a BAA is available on your plan, and whether your data is used for model training.")
        }
      },
      {
        '@type': 'Question',
        name: 'Is there an AI meeting agent API?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: t("Yes. Several meeting agents expose their notes and transcripts to other software. {{tldv.name}}, {{otter-ai.name}}, {{fathom.name}}, {{fireflies-ai.name}} and {{avoma.name}} offer MCP servers, and {{granola.name}} offers an MCP server on every plan plus an API with webhooks on Business and Enterprise. An MCP server lets AI assistants such as Claude and ChatGPT query your meeting history directly.")
        }
      },
      {
        '@type': 'Question',
        name: 'Can AI meeting agents do extractive summarization of meeting transcripts?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: t("Most meeting agents write summaries in their own words and add action items, rather than pulling exact sentences from the transcript. For extractive work, such as verbatim quotes or decisions copied word for word, the useful feature is transcript access: the MCP server from {{granola.name}} returns raw transcripts on paid plans, and tools with an API or MCP server let you run your own extraction over the full text.")
        }
      },
      {
        '@type': 'Question',
        name: 'How do AI meeting agents handle speaker identification?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "AI meeting agents use diarization to separate and label who said what. Accuracy depends on the capture method, microphone quality and how many people speak at once. Bot-based tools can read participant names from the meeting platform, while bot-free tools rely more on audio alone. Testing on real calls from your own team is the reliable way to judge it."
        }
      },
      {
        '@type': 'Question',
        name: 'Do AI meeting agents work with Zoom, Google Meet, and Microsoft Teams?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: t("Most do. {{fathom.name}}, {{fireflies-ai.name}} and {{otter-ai.name}} record Zoom, Google Meet and Microsoft Teams calls through their own integrations, while bot-free tools such as {{granola.name}} and {{shadow.name}} capture audio from the device, so they are not tied to one meeting app. {{microsoft-365-copilot.name}} also works inside Teams for organizations already on that stack. Check your own platform on each listing before committing.")
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
        <span style={{ fontSize: '0.8125rem', color: '#111827' }}>Best AI Meeting Agents</span>
      </div>

      {/* Header pills */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' as const }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Independently Reviewed</span>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Guide</span>
        <span style={{ fontSize: '0.75rem', color: '#6B7280', padding: '0.25rem 0.75rem', backgroundColor: '#F3F4F6', borderRadius: '9999px' }}>{updated}</span>
      </div>

      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
        Best AI Meeting Agents (2026)
      </h1>


      <p style={{ fontSize: '1.0625rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '0.75rem', maxWidth: '680px' }}>
        AI meeting agents turn calls into transcripts, summaries and action items, and many now send that output on to CRMs, project tools and AI assistants. This guide covers {listed.length} meeting agents listed in The AI Agent Index and sorts them by the choice that shapes everything else: whether a bot joins the call, or audio is captured from your own device. Sales teams that need call analytics also get a short list of revenue intelligence platforms.
      </p>
      <p style={{ fontSize: '0.9375rem', color: '#6B7280', lineHeight: 1.7, marginBottom: '1rem', maxWidth: '680px' }}>
        Bot-based notetakers join scheduled calls as a participant and record without anyone pressing start. Bot-free tools capture audio on the user&apos;s own computer or phone, so nothing visible joins the call. The sections below cover how to choose, which tool fits which need, and what a regulated team should check first.
      </p>

      <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '2rem', maxWidth: '680px' }}>
        <p style={{ fontSize: '0.875rem', color: '#0369A1', lineHeight: 1.6, margin: 0 }}>
          <strong>Looking for broader workflow automation?</strong> See our full guide: <Link href="/resources/guides/best-ai-workflow-agents" style={{ color: '#2563EB' }}>Best AI Agents for Workflow Automation (2026)</Link>, covering <A s="zapier" r={refs} />, <A s="make" r={refs} />, <A s="n8n" r={refs} />, <A s="lindy" r={refs} />, and the wider workflow automation category.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' as const, marginBottom: '2.5rem' }}>
        <Link href="/integrations/zoom" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', backgroundColor: '#F9FAFB', padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>Zoom integrations &#x2192;</Link>
        <Link href="/integrations/google-meet" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', backgroundColor: '#F9FAFB', padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>Google Meet integrations &#x2192;</Link>
        <Link href="/integrations/microsoft-teams" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', backgroundColor: '#F9FAFB', padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>Microsoft Teams integrations &#x2192;</Link>
        <Link href="/integrations/slack" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', backgroundColor: '#F9FAFB', padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>Slack integrations &#x2192;</Link>
        <Link href="/integrations/hubspot" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', backgroundColor: '#F9FAFB', padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>HubSpot integrations &#x2192;</Link>
        <Link href="/integrations/salesforce" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', backgroundColor: '#F9FAFB', padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>Salesforce integrations &#x2192;</Link>
        <Link href="/integrations/notion" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', backgroundColor: '#F9FAFB', padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>Notion integrations &#x2192;</Link>
      </div>

      <GuideAgentList groups={GUIDE_GROUPS} />

      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2.5rem', marginBottom: '3rem', maxWidth: '680px' }}>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#111827', marginBottom: '1rem', letterSpacing: '-0.01em' }}>
          How to evaluate AI meeting agents
        </h2>
        <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1rem' }}>
          The first decision is how audio gets captured. <A s="fathom" r={refs} />, <A s="fireflies-ai" r={refs} />, <A s="otter-ai" r={refs} /> and <A s="tldv" r={refs} /> join scheduled meetings through a bot, so every calendar meeting is recorded automatically and attendees can see the recorder (<A s="tldv" r={refs} /> can also record without a bot). <A s="granola" r={refs} />, <A s="shadow" r={refs} />, <A s="spellar-ai" r={refs} /> and <A s="olva" r={refs} /> capture audio from the device instead, which keeps the call free of an extra participant. <A s="granola" r={refs} /> runs on Mac, Windows, iPhone, Android and Apple Watch, <A s="shadow" r={refs} /> runs on Mac, and <A s="spellar-ai" r={refs} /> records on Mac, iPhone, iPad, the web and Chrome.
        </p>
        <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1rem' }}>
          The second decision is what happens after the transcript. Sales-focused tools such as <A s="tldv" r={refs} />, <A s="avoma" r={refs} /> and <A s="otter-ai" r={refs} /> add CRM sync, coaching and sales-specific agents, and revenue intelligence platforms such as <A s="gong" r={refs} /> and <A s="clari-copilot" r={refs} /> analyze calls for deal risk, coaching and CRM updates. General notetakers concentrate on summaries, action items and search across past meetings. <A s="granola" r={refs} /> is built around the user&apos;s own notes: you jot the points that matter during the call, and it fills them out from the transcript afterward.
        </p>

        <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', marginTop: '1.75rem' }}>
          Recommended tool by use case
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.75rem', marginBottom: '1.5rem' }}>
          {[
            {
              useCase: 'Every calendar meeting captured automatically',
              jsx: <><A s="fathom" r={refs} />, <A s="fireflies-ai" r={refs} />, <A s="otter-ai" r={refs} /> and <A s="tldv" r={refs} /> join scheduled calls through a bot and deliver a transcript, summary and action items without anyone pressing record.</>
            },
            {
              useCase: 'Sales calls with CRM sync and coaching',
              jsx: <><A s="tldv" r={refs} /> syncs call notes to your CRM and adds coaching playbooks. <A s="avoma" r={refs} /> covers transcription, notes, CRM sync, scheduling, coaching and forecasting. <A s="otter-ai" r={refs} /> syncs notes to CRM and adds SDR and Recruiting agents. <A s="gong" r={refs} /> and <A s="clari-copilot" r={refs} /> add call analytics, coaching and automated CRM updates for larger sales teams.</>
            },
            {
              useCase: 'Notes without a bot in the call',
              jsx: <><A s="granola" r={refs} /> captures audio from your computer on any meeting app and enhances the notes you write during the call. <A s="shadow" r={refs} /> transcribes on a Mac and saves every call as Markdown. <A s="spellar-ai" r={refs} /> and <A s="olva" r={refs} /> are further bot-free options that run from your own device.</>
            },
            {
              useCase: 'In-person meetings and phone calls',
              jsx: <><A s="granola" r={refs} /> has apps for iPhone, Android and Apple Watch for in-person meetings. <A s="fathom" r={refs} /> lists in-person calls, <A s="spellar-ai" r={refs} /> records on iPhone and iPad, and <A s="otter-ai" r={refs} /> has a mobile app.</>
            },
            {
              useCase: 'Regulated teams',
              jsx: <><A s="fathom" r={refs} /> states it is HIPAA compliant and offers a BAA, <A s="otter-ai" r={refs} /> announced HIPAA compliance in 2025, and <A s="fireflies-ai" r={refs} /> lists HIPAA compliance on its Enterprise plan. <A s="granola" r={refs} /> offers HIPAA workspaces with a Business Associate Agreement on its Enterprise plan only. Check the plan, the BAA and the training policy before rollout.</>
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
              term: 'Capture method',
              def: 'A bot records every scheduled meeting automatically but is visible to attendees. Device capture keeps the call clear and covers in-person meetings, but may need a manual start.'
            },
            {
              term: 'Transcription accuracy and accent handling',
              def: 'Published accuracy figures rarely reflect heavily accented or fast-paced speech. Run a trial on your own call types before committing.'
            },
            {
              term: 'Speaker identification',
              def: 'Tools that label speakers by name produce far more useful summaries than an undifferentiated transcript. Bot-based tools can read names from the meeting platform, while bot-free tools rely more on the audio.'
            },
            {
              term: 'Action item extraction',
              def: 'Check whether a tool catches implied commitments, not just sentences that begin with a verb. Test this on real calls.'
            },
            {
              term: 'CRM and tool integration',
              def: (<>Pushing summaries into <Link href="/integrations/hubspot" style={lk}>HubSpot</Link>, <Link href="/integrations/salesforce" style={lk}>Salesforce</Link>, <Link href="/integrations/notion" style={lk}>Notion</Link> or a project tool removes the manual filing step. <A s="otter-ai" r={refs} />, <A s="tldv" r={refs} /> and <A s="avoma" r={refs} /> list CRM sync, and <A s="clari-copilot" r={refs} /> lists automated CRM updates. Check that your own CRM is supported before committing.</>)
            },
            {
              term: 'APIs and MCP',
              def: (<>If you want meeting context inside your own tools or AI assistants, look for an API or an MCP server. <A s="tldv" r={refs} />, <A s="otter-ai" r={refs} />, <A s="fathom" r={refs} />, <A s="fireflies-ai" r={refs} /> and <A s="avoma" r={refs} /> offer MCP servers, and <A s="granola" r={refs} /> offers an MCP server on every plan and an API on Business and Enterprise.</>)
            },
            {
              term: 'Multilingual support',
              def: (<>Verify your languages before committing. <A s="fireflies-ai" r={refs} /> lists transcription in 100+ languages, and <A s="granola" r={refs} /> supports 31 languages on desktop and 17 on mobile. Summary quality can still vary by language.</>)
            },
            {
              term: 'Data privacy and storage',
              def: (<>Check where audio and transcripts are stored, how long they are kept, and whether they are used for model training. <A s="shadow" r={refs} /> transcribes on the device. <A s="granola" r={refs} /> deletes audio after transcription and stores the transcript and notes.</>)
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
          <A s="microsoft-365-copilot" r={refs} /> works inside Teams, Outlook and the rest of Microsoft 365, which suits organizations already on that stack. Teams evaluating revenue intelligence more broadly should also look at the AI Sales Agents category, alongside <A s="gong" r={refs} /> and <A s="clari-copilot" r={refs} /> in the list above.
        </p>

        <p style={{ fontSize: '0.875rem', color: '#9CA3AF', lineHeight: 1.6, marginTop: '2rem' }}>
          All agents listed above are editorially reviewed by The AI Agent Index. Scores reflect public signals including G2 ratings, product documentation, and verified user evidence. See our <Link href="/methodology" style={{ color: '#6B7280' }}>editorial methodology</Link>.
        </p>
      </div>

      {/* Newsletter */}
      <div style={{ marginBottom: '3rem' }}>
        <NewsletterSignup />
      </div>

      {/* FAQs - rendered from the same data as the FAQPage JSON-LD, so the visible FAQ and the structured data always match (10-30c) */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '1.25rem' }}>Frequently Asked Questions</h2>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '1rem' }}>
          {faqLd.mainEntity.map((item) => (
            <div key={item.name} style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1.25rem 1.5rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.5rem' }}>{item.name}</h3>
              <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.75, margin: 0 }}>{item.acceptedAnswer.text}</p>
            </div>
          ))}
        </div>
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
        <Link href="/resources/guides/best-ai-scheduling-agents" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Best AI Scheduling Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Reclaim.ai vs Motion vs Akiflow &#x2192;</p>
        </Link>
        <Link href="/resources/guides/multi-agent-orchestration" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Multi-Agent Orchestration</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>The complete guide &#x2192;</p>
        </Link>
        <Link href="/integrations/zoom" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Best for Zoom</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Filter by integration &#x2192;</p>
        </Link>
        <Link href="/integrations/microsoft-teams" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Best for Microsoft Teams</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Filter by integration &#x2192;</p>
        </Link>
      </div>
      <GuideCitations slug="best-ai-meeting-agents" table="guides" />
    </div>
  )
}
