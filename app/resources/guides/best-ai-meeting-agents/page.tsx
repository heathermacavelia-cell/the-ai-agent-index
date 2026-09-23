import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import type { Metadata } from 'next'
import GuideCitations from '@/components/GuideCitations'
import NewsletterSignup from '@/components/NewsletterSignup'
import { getGuideMeta, isoDate, updatedLabel } from '@/lib/guideMeta'
import { resolveRating } from '@/lib/rating'

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

const lk = { color: '#2563EB', textDecoration: 'none', fontWeight: 500 } as const

export default async function MeetingAgentsGuidePage() {
  const meta = await getGuideMeta('best-ai-meeting-agents')
  const published = isoDate(meta?.published_at)
  const audited = isoDate(meta?.last_audited_at)
  const updated = updatedLabel(meta?.last_audited_at)

  const supabase = createClient()
  const { data: agents } = await supabase
    .from('agents')
    .select('id, name, slug, developer, short_description, primary_category, pricing_model, starting_price, editorial_rating, editorial_rating_notes, rating_avg, rating_count, is_featured, is_verified, capability_tags, integrations')
    .eq('is_active', true)
    .eq('agent_type', 'meeting-intelligence')
    .order('is_featured', { ascending: false })
    .order('editorial_rating', { ascending: false, nullsFirst: false })

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Best AI Meeting Agents (2026)',
    description: 'AI meeting agents compared: bot-based notetakers like Fathom, Fireflies.ai, Otter.ai and tl;dv vs bot-free tools like Granola and Shadow. HIPAA, Teams, APIs.',
    url: 'https://theaiagentindex.com/resources/guides/best-ai-meeting-agents',
    ...(published ? { datePublished: published } : {}),
    ...(audited ? { dateModified: audited } : {}),
    author: { '@type': 'Organization', name: 'The AI Agent Index' },
    publisher: { '@type': 'Organization', name: 'The AI Agent Index', url: 'https://theaiagentindex.com' },
  }

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Best AI Meeting Agents (2026)',
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

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the best AI meeting agent?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'It depends on how you want meetings captured. Bot-based notetakers such as Fathom, Fireflies.ai, Otter.ai and tl;dv join scheduled calls automatically and record every calendar meeting. Bot-free tools such as Granola, Shadow, Spellar AI and Olva capture audio from your own device, so no participant joins the call, and they also work for in-person conversations. Sales teams that want CRM sync and coaching usually compare tl;dv, Avoma and Otter.ai. Teams with HIPAA requirements should check which plan carries it: Granola offers HIPAA-compliant workspaces only on Enterprise.'
        }
      },
      {
        '@type': 'Question',
        name: 'What is the difference between bot-based and bot-free meeting agents?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A bot-based agent joins the call as a participant, so it can record every scheduled meeting without anyone pressing start, and other attendees can see it. A bot-free agent captures system and microphone audio on the user\'s own computer or phone, so nothing joins the call and it works on any meeting app and in person, but some bot-free tools, including Granola, need the user to start each recording.'
        }
      },
      {
        '@type': 'Question',
        name: 'Which AI meeting agent is best for sales teams?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sales teams usually need CRM sync, coaching and call analytics. tl;dv offers CRM sync to Salesforce and HubSpot with coaching playbooks, Avoma covers note-taking, follow-up emails, CRM updates, coaching scorecards and forecasting, and Otter.ai adds a Sales Agent that pushes call notes to Salesforce, HubSpot and Microsoft Dynamics. For enterprise revenue intelligence, Gong and Salesloft Conversation Intelligence cover post-call analysis in the AI Sales Agents category.'
        }
      },
      {
        '@type': 'Question',
        name: 'Which AI meeting agent is best for regulated industries?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Start with the compliance terms rather than the feature list. Fathom, Fireflies.ai and Otter.ai list HIPAA on their Index listings, and Granola offers HIPAA-compliant workspaces with a Business Associate Agreement on its Enterprise plan only. Shadow and Spellar AI transcribe on the device. Before deploying any meeting agent in healthcare, finance or legal work, confirm where transcripts are stored, how long they are kept, whether a BAA is available on your plan, and whether your data is used for model training.'
        }
      },
      {
        '@type': 'Question',
        name: 'Is there an AI meeting agent API?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Several meeting agents expose their notes and transcripts to other software. tl;dv lists an API and an MCP server, Otter.ai lists an MCP server and an API, Fathom and Fireflies.ai list MCP support, and Granola offers an MCP server on every plan plus a REST API with webhooks on Business and Enterprise. An MCP server lets AI assistants such as Claude and ChatGPT query your meeting history directly.'
        }
      },
      {
        '@type': 'Question',
        name: 'Can AI meeting agents do extractive summarization of meeting transcripts?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Most meeting agents write summaries in their own words and add action items, rather than pulling exact sentences from the transcript. For extractive work, such as verbatim quotes or decisions copied word for word, the useful feature is transcript access: Granola\'s MCP server returns raw transcripts on paid plans, and tools with an API or MCP server let you run your own extraction over the full text.'
        }
      },
      {
        '@type': 'Question',
        name: 'How do AI meeting agents handle speaker identification?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'AI meeting agents use diarization to separate and label who said what. Accuracy depends on the capture method, microphone quality and how many people speak at once. Bot-based tools can read participant names from the meeting platform, while bot-free tools rely more on audio alone, and some, such as Granola, add optional speaker tags for Zoom and Google Meet. Testing on real calls from your own team is the reliable way to judge it.'
        }
      },
      {
        '@type': 'Question',
        name: 'Do AI meeting agents work with Zoom, Google Meet, and Microsoft Teams?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The meeting agents in this guide list Zoom, Google Meet and Microsoft Teams support. Bot-based tools join those calls through their own integrations, while bot-free tools such as Granola and Shadow capture audio from the device, so they work with any meeting app, including Webex and Slack huddles. Microsoft 365 Copilot also transcribes and summarizes Teams meetings for organizations already on that stack.'
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
        AI meeting agents turn calls into transcripts, summaries and action items, and many now send that output on to CRMs, project tools and AI assistants. This guide covers {agents?.length ?? 0} meeting agents listed in The AI Agent Index and sorts them by the choice that shapes everything else: whether a bot joins the call, or audio is captured from your own device.
      </p>
      <p style={{ fontSize: '0.9375rem', color: '#6B7280', lineHeight: 1.7, marginBottom: '1rem', maxWidth: '680px' }}>
        Bot-based notetakers join scheduled calls as a participant and record without anyone pressing start. Bot-free tools capture audio on the user&apos;s own computer or phone, so nothing visible joins the call, and they also cover in-person conversations. The sections below cover how to choose, which tool fits which need, and what a regulated team should check first.
      </p>

      <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '2rem', maxWidth: '680px' }}>
        <p style={{ fontSize: '0.875rem', color: '#0369A1', lineHeight: 1.6, margin: 0 }}>
          <strong>Looking for broader workflow automation?</strong> See our full guide: <Link href="/resources/guides/best-ai-workflow-agents" style={{ color: '#2563EB' }}>Best AI Agents for Workflow Automation (2026)</Link>, covering Zapier, Make.com, n8n, Lindy, and the full workflow automation category.
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
        {agents?.map((agent, index) => (
          <Link key={agent.slug} href={'/agents/' + agent.slug}
            style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: agent.is_featured ? '1px solid #BFDBFE' : '1px solid #E5E7EB', padding: '1.25rem', textDecoration: 'none', display: 'block', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ flex: 1, paddingRight: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' as const, marginBottom: '0.2rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#111827' }}>{agent.name}</span>
                  {agent.is_verified && <span style={{ fontSize: '0.625rem', fontWeight: 700, backgroundColor: '#DCFCE7', color: '#16A34A', padding: '0.1rem 0.4rem', borderRadius: '9999px', textTransform: 'uppercase' as const }}>Verified</span>}
                  {agent.is_featured && <span style={{ fontSize: '0.625rem', fontWeight: 700, backgroundColor: '#DBEAFE', color: '#1D4ED8', padding: '0.1rem 0.4rem', borderRadius: '9999px', textTransform: 'uppercase' as const }}>Featured</span>}
                </div>
                <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>by {agent.developer}</span>
              </div>
              {(() => {
                const r = resolveRating({
                  editorial_rating: agent.editorial_rating ?? null,
                  editorial_rating_notes: agent.editorial_rating_notes ?? null,
                  rating_avg: agent.rating_avg ?? null,
                  rating_count: agent.rating_count ?? null,
                })
                if (r.suppressed) return (
                  <span style={{ fontSize: '0.5625rem', fontWeight: 700, color: '#92400E', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '0.25rem', padding: '0.1rem 0.35rem', textTransform: 'uppercase', letterSpacing: '0.03em', whiteSpace: 'nowrap', flexShrink: 0 }}>On Our Radar</span>
                )
                if (r.value == null) return null
                return (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
                    <span style={{ color: '#2563EB', fontSize: '0.75rem' }}>&#x2605;</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151' }}>{r.value.toFixed(1)}</span>
                  </div>
                )
              })()}
            </div>
            <p style={{ fontSize: '0.8125rem', color: '#4B5563', lineHeight: 1.55, marginBottom: '0.75rem' }}>{agent.short_description}</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.75rem', color: '#6B7280', backgroundColor: '#F3F4F6', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', textTransform: 'capitalize' as const }}>{agent.pricing_model}</span>
              <span style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 500 }}>View &#x2192;</span>
            </div>
          </Link>
        ))}
      </div>
      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2.5rem', marginBottom: '3rem', maxWidth: '680px' }}>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#111827', marginBottom: '1rem', letterSpacing: '-0.01em' }}>
          How to evaluate AI meeting agents
        </h2>
        <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1rem' }}>
          The first decision is how audio gets captured. <Link href="/agents/fathom" style={lk}>Fathom</Link>, <Link href="/agents/fireflies-ai" style={lk}>Fireflies.ai</Link>, <Link href="/agents/otter-ai" style={lk}>Otter.ai</Link> and <Link href="/agents/tldv" style={lk}>tl;dv</Link> join scheduled meetings through a bot, so every calendar meeting is recorded automatically and attendees can see the recorder. <Link href="/agents/granola" style={lk}>Granola</Link>, <Link href="/agents/shadow" style={lk}>Shadow</Link>, <Link href="/agents/spellar-ai" style={lk}>Spellar AI</Link> and <Link href="/agents/olva" style={lk}>Olva</Link> capture audio from the device instead, which keeps the call free of an extra participant and also works for in-person conversations. Granola runs on Mac, Windows, iPhone, Android and Apple Watch and needs the user to start each recording, while Shadow and Spellar AI focus on Apple devices.
        </p>
        <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1rem' }}>
          The second decision is what happens after the transcript. Sales-focused tools such as <Link href="/agents/tldv" style={lk}>tl;dv</Link>, <Link href="/agents/avoma" style={lk}>Avoma</Link> and <Link href="/agents/otter-ai" style={lk}>Otter.ai</Link> add CRM sync, coaching and sales-specific agents. General notetakers concentrate on summaries, action items and search across past meetings. Granola is built around the user&apos;s own notes: you jot the points that matter during the call, and Granola fills them out from the transcript afterward.
        </p>

        <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', marginTop: '1.75rem' }}>
          Recommended tool by use case
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.75rem', marginBottom: '1.5rem' }}>
          {[
            {
              useCase: 'Every calendar meeting captured automatically',
              jsx: <><Link href="/agents/fathom" style={lk}>Fathom</Link>, <Link href="/agents/fireflies-ai" style={lk}>Fireflies.ai</Link>, <Link href="/agents/otter-ai" style={lk}>Otter.ai</Link> and <Link href="/agents/tldv" style={lk}>tl;dv</Link> join scheduled calls through a bot and deliver a transcript, summary and action items without anyone pressing record. All four list a free plan.</>
            },
            {
              useCase: 'Sales calls with CRM sync and coaching',
              jsx: <><Link href="/agents/tldv" style={lk}>tl;dv</Link> syncs call summaries to Salesforce and HubSpot and adds coaching playbooks. <Link href="/agents/avoma" style={lk}>Avoma</Link> covers note-taking, follow-up emails, CRM updates, coaching scorecards and forecasting. <Link href="/agents/otter-ai" style={lk}>Otter.ai</Link> adds a Sales Agent that pushes call notes to Salesforce, HubSpot and Microsoft Dynamics.</>
            },
            {
              useCase: 'Notes without a bot in the call',
              jsx: <><Link href="/agents/granola" style={lk}>Granola</Link> captures audio from your computer on any meeting app and enhances the notes you write during the call. <Link href="/agents/shadow" style={lk}>Shadow</Link> transcribes on a Mac and also captures on-screen content. <Link href="/agents/spellar-ai" style={lk}>Spellar AI</Link> and <Link href="/agents/olva" style={lk}>Olva</Link> are further bot-free options that run from your own device.</>
            },
            {
              useCase: 'In-person meetings and phone calls',
              jsx: <><Link href="/agents/granola" style={lk}>Granola</Link> has apps for iPhone, Android and Apple Watch for in-person meetings, and transcribes phone calls on iPhone. <Link href="/agents/spellar-ai" style={lk}>Spellar AI</Link> runs on iPhone and iPad, and <Link href="/agents/otter-ai" style={lk}>Otter.ai</Link> has a mobile app.</>
            },
            {
              useCase: 'Regulated teams',
              jsx: <><Link href="/agents/fathom" style={lk}>Fathom</Link>, <Link href="/agents/fireflies-ai" style={lk}>Fireflies.ai</Link> and <Link href="/agents/otter-ai" style={lk}>Otter.ai</Link> list HIPAA on their Index listings. <Link href="/agents/granola" style={lk}>Granola</Link> offers HIPAA-compliant workspaces with a Business Associate Agreement on its Enterprise plan only. Check the plan, the BAA and the training policy before rollout.</>
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
              def: (<>Pushing summaries into <Link href="/integrations/hubspot" style={lk}>HubSpot</Link>, <Link href="/integrations/salesforce" style={lk}>Salesforce</Link>, <Link href="/integrations/notion" style={lk}>Notion</Link> or a project tool removes the manual filing step. <Link href="/agents/fathom" style={lk}>Fathom</Link>, <Link href="/agents/fireflies-ai" style={lk}>Fireflies.ai</Link>, <Link href="/agents/otter-ai" style={lk}>Otter.ai</Link>, <Link href="/agents/tldv" style={lk}>tl;dv</Link> and <Link href="/agents/avoma" style={lk}>Avoma</Link> list both Salesforce and HubSpot on their Index listings.</>)
            },
            {
              term: 'APIs and MCP',
              def: (<>If you want meeting context inside your own tools or AI assistants, look for an API or an MCP server. <Link href="/agents/tldv" style={lk}>tl;dv</Link> and <Link href="/agents/otter-ai" style={lk}>Otter.ai</Link> list both, <Link href="/agents/fathom" style={lk}>Fathom</Link> and <Link href="/agents/fireflies-ai" style={lk}>Fireflies.ai</Link> list MCP support, and <Link href="/agents/granola" style={lk}>Granola</Link> offers an MCP server on every plan and an API on Business and Enterprise.</>)
            },
            {
              term: 'Multilingual support',
              def: (<>Verify your languages before committing. <Link href="/agents/fireflies-ai" style={lk}>Fireflies.ai</Link> lists transcription in 100+ languages, and <Link href="/agents/granola" style={lk}>Granola</Link> supports 31 languages on desktop and 17 on mobile. Summary quality can still vary by language.</>)
            },
            {
              term: 'Data privacy and storage',
              def: (<>Check where audio and transcripts are stored, how long they are kept, and whether they are used for model training. <Link href="/agents/shadow" style={lk}>Shadow</Link> and <Link href="/agents/spellar-ai" style={lk}>Spellar AI</Link> transcribe on the device. <Link href="/agents/granola" style={lk}>Granola</Link> deletes audio after transcription and stores the transcript and notes.</>)
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
          <Link href="/agents/microsoft-365-copilot" style={lk}>Microsoft 365 Copilot</Link> transcribes and summarizes Teams meetings for organizations already on that stack. Teams evaluating revenue intelligence more broadly should also look at the AI Sales Agents category, where <Link href="/agents/gong" style={lk}>Gong</Link> and <Link href="/agents/clari-copilot" style={lk}>Salesloft Conversation Intelligence</Link> cover post-call analysis at enterprise scale.
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