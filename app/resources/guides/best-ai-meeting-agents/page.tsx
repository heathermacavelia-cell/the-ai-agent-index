import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import type { Metadata } from 'next'
import GuideCitations from '@/components/GuideCitations'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Best AI Meeting Agents (2026)',
  description: 'The top AI meeting agents for 2026. Fathom, Fireflies.ai, tl;dv, Granola, and Shadow compared on features, pricing, and accuracy. Not affiliated.',
  openGraph: {
    title: 'Best AI Meeting Agents (2026)',
    description: 'The top AI meeting agents for 2026. Fathom, Fireflies.ai, tl;dv, Granola, and Shadow compared on features, pricing, and accuracy. Not affiliated.',
    url: 'https://theaiagentindex.com/resources/guides/best-ai-meeting-agents',
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary',
    title: 'Best AI Meeting Agents (2026)',
    description: 'Fathom, Fireflies.ai, tl;dv, Granola, and Shadow compared. Transcription accuracy, CRM sync, pricing, and use case recommendations.',
  },
  alternates: { canonical: 'https://theaiagentindex.com/resources/guides/best-ai-meeting-agents' },
}

export default async function MeetingAgentsGuidePage() {
  const supabase = createClient()
  const { data: agents } = await supabase
    .from('agents')
    .select('id, name, slug, developer, short_description, primary_category, pricing_model, starting_price, rating_avg, rating_count, is_featured, is_verified, capability_tags, integrations')
    .eq('is_active', true)
    .eq('primary_category', 'ai-workflow-agents')
    .contains('capability_tags', ['conversation-intelligence'])
    .order('is_featured', { ascending: false })
    .order('rating_avg', { ascending: false })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Best AI Meeting Agents 2026',
    description: 'The top AI meeting agents for 2026. Fathom, Fireflies.ai, tl;dv, Granola, and Shadow compared on features, pricing, and transcription accuracy.',
    url: 'https://theaiagentindex.com/resources/guides/best-ai-meeting-agents',
    publisher: { '@type': 'Organization', name: 'The AI Agent Index', url: 'https://theaiagentindex.com' },
    mainEntity: {
      '@type': 'ItemList',
      name: 'Best AI Meeting Agents 2026',
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
        <span style={{ fontSize: '0.8125rem', color: '#111827' }}>Best AI Meeting Agents</span>
      </div>

      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Guide</p>
      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
        Best AI Meeting Agents (2026)
      </h1>

      <p style={{ fontSize: '1.0625rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '0.75rem', maxWidth: '680px' }}>
        Microsoft&apos;s 2024 Work Trend Index reports that professionals now spend the majority of their working hours in meetings, calls, and asynchronous communication, with meeting volume having increased sharply since 2020. The problem is not the meetings themselves but the overhead that follows: manual note-taking, missed action items, and hours spent searching for decisions made in calls from three weeks ago. This guide covers {agents?.length ?? 0} AI meeting agents that handle transcription, summarisation, and action item extraction automatically, so the work that happens in meetings does not get lost after them.
      </p>
      <p style={{ fontSize: '0.9375rem', color: '#6B7280', lineHeight: 1.7, marginBottom: '1rem', maxWidth: '680px' }}>
        AI meeting agents join calls as a silent participant, transcribe in real time, identify speakers, extract action items, and deliver structured summaries without anyone on the call lifting a finger. The best tools go further: syncing call summaries to CRM records, surfacing coaching insights for sales teams, building searchable knowledge bases from past meetings, and routing follow-up tasks directly into project management tools. This guide compares tools across all of those dimensions so you can match the right agent to how your team actually works.
      </p>

      <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '2rem', maxWidth: '680px' }}>
        <p style={{ fontSize: '0.875rem', color: '#0369A1', lineHeight: 1.6, margin: 0 }}>
          <strong>Looking for broader workflow automation?</strong> See our full guide: <Link href="/resources/guides/best-ai-workflow-agents" style={{ color: '#2563EB' }}>Best AI Agents for Workflow Automation (2026)</Link>, covering Zapier, Make, n8n, Lindy, and the full workflow automation category.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' as const, marginBottom: '2.5rem' }}>
        <Link href="/integrations/zoom" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', backgroundColor: '#F9FAFB', padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>Zoom integrations →</Link>
        <Link href="/integrations/google-meet" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', backgroundColor: '#F9FAFB', padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>Google Meet integrations →</Link>
        <Link href="/integrations/microsoft-teams" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', backgroundColor: '#F9FAFB', padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>Microsoft Teams integrations →</Link>
        <Link href="/integrations/slack" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', backgroundColor: '#F9FAFB', padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>Slack integrations →</Link>
        <Link href="/integrations/hubspot" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', backgroundColor: '#F9FAFB', padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>HubSpot integrations →</Link>
        <Link href="/integrations/salesforce" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', backgroundColor: '#F9FAFB', padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>Salesforce integrations →</Link>
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
          How to evaluate AI meeting agents
        </h2>
        <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1rem' }}>
          The meeting agent category breaks into three distinct profiles. General-purpose notetakers like <Link href="/agents/fireflies-ai" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Fireflies.ai</Link> and <Link href="/agents/fathom" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Fathom</Link> prioritise transcription quality, speaker identification, and summary accuracy across all call types. Revenue intelligence tools like <Link href="/agents/tldv" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>tl;dv</Link> go deeper on sales calls specifically, with CRM sync, deal intelligence, and coaching overlays built directly into the product. Privacy-first tools like <Link href="/agents/shadow" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Shadow</Link> process audio locally rather than sending it to cloud servers, which matters for organisations in regulated industries or with strict data handling requirements.
        </p>
        <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1rem' }}>
          Transcription accuracy is the baseline requirement, but it is rarely the differentiator between mature tools in this category. Where tools diverge is in what they do after the transcript: the quality of action item extraction, how well summaries capture decisions rather than just conversation, whether the tool pushes notes into the right place automatically, and how it handles multilingual calls or heavy accents. <Link href="/agents/granola" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Granola</Link> takes a different approach entirely, combining AI-generated notes with your own in-call writing to produce a single structured document, which works well for people who prefer to stay engaged in the meeting rather than trusting everything to automation.
        </p>

        <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', marginTop: '1.75rem' }}>
          Recommended tool by use case
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.75rem', marginBottom: '1.5rem' }}>
          {[
            {
              useCase: 'Individual productivity and personal note-taking',
              jsx: <><Link href="/agents/fathom" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Fathom</Link> for individuals who want clean summaries, action items, and highlights delivered immediately after calls. Free on the core plan with no per-seat cost, which makes it the lowest-friction starting point for solo users and small teams.</>
            },
            {
              useCase: 'Sales team call intelligence and CRM sync',
              jsx: <><Link href="/agents/tldv" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>tl;dv</Link> for sales teams that need CRM-synced call summaries, deal intelligence, and coaching. Timestamps key moments, routes notes into HubSpot or Salesforce automatically, and surfaces patterns across calls. <Link href="/agents/fathom" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Fathom</Link> is a strong alternative for teams that want CRM sync without a dedicated revenue intelligence layer.</>
            },
            {
              useCase: 'Team-wide searchable meeting knowledge base',
              jsx: <><Link href="/agents/fireflies-ai" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Fireflies.ai</Link> for organisations that want a searchable archive of every meeting transcript, with topic tracking, sentiment analysis, and Slack and CRM integrations. Best for teams running high meeting volume who need to find past decisions quickly.</>
            },
            {
              useCase: 'Document-style collaborative notes',
              jsx: <><Link href="/agents/granola" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Granola</Link> for professionals who want to stay actively engaged in meetings rather than watching a bot take notes. Combines your in-call writing with AI-generated content into a single structured document after the call ends.</>
            },
            {
              useCase: 'Privacy-first or regulated environments',
              jsx: <><Link href="/agents/shadow" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Shadow</Link> for teams in healthcare, legal, or finance that cannot send meeting audio to third-party cloud servers. Processes audio locally and produces summaries without data leaving your device.</>
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
              term: 'Transcription accuracy and accent handling',
              def: (<><Link href="/agents/fireflies-ai" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Fireflies.ai</Link> and <Link href="/agents/fathom" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Fathom</Link> both perform well across accent variation, but real-world accuracy on your specific call types is the only reliable test. Most tools publish accuracy benchmarks that do not reflect performance on heavily accented or fast-paced speech.</>)
            },
            {
              term: 'Speaker identification and diarization',
              def: 'Separating who said what in a transcript. Tools that correctly label speakers by name produce far more useful summaries than tools that produce a wall of undifferentiated text. Accuracy drops on calls with more than five participants or overlapping speech.'
            },
            {
              term: 'Action item extraction',
              def: (<>The quality gap between tools is wide here. The best tools identify implied commitments, not just sentences that start with action verbs. <Link href="/agents/fathom" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Fathom</Link> and <Link href="/agents/fireflies-ai" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Fireflies.ai</Link> both extract action items automatically. Test this on real calls before committing to a tool.</>)
            },
            {
              term: 'CRM and tool integration',
              def: (<>Pushing summaries automatically into <Link href="/integrations/hubspot" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>HubSpot</Link>, <Link href="/integrations/salesforce" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Salesforce</Link>, <Link href="/integrations/notion" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Notion</Link>, or your project management tool removes the manual step that causes most meeting notes to never get filed. <Link href="/agents/tldv" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>tl;dv</Link> and <Link href="/agents/fireflies-ai" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Fireflies.ai</Link> have the broadest integration coverage in this category.</>)
            },
            {
              term: 'Multilingual support',
              def: (<>If your team runs calls in more than one language, verify native support before committing. <Link href="/agents/fathom" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Fathom</Link>, <Link href="/agents/fireflies-ai" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Fireflies.ai</Link>, <Link href="/agents/tldv" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>tl;dv</Link>, <Link href="/agents/granola" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Granola</Link>, and <Link href="/agents/shadow" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Shadow</Link> all support multiple languages, but accuracy and summarisation quality vary by language.</>)
            },
            {
              term: 'Data privacy and storage policy',
              def: (<>Where meeting audio and transcripts are stored, for how long, and whether data is used for model training matters for regulated industries. <Link href="/agents/shadow" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Shadow</Link> is the only tool in this guide that offers local processing. Others store data in cloud infrastructure with varying retention policies.</>)
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
          Several tools outside this guide are worth evaluating depending on your stack. <Link href="/agents/motion" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Motion</Link> includes a meeting notetaker as part of its broader task and calendar management platform, which suits teams that want meeting automation without adding a standalone tool. <Link href="/agents/microsoft-365-copilot" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Microsoft 365 Copilot</Link> includes meeting transcription and summarisation natively inside Teams for organisations already on that stack. Teams evaluating revenue intelligence tools more broadly should also look at the AI Sales Agents category for conversation intelligence platforms like <Link href="/agents/gong" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Gong</Link> and <Link href="/agents/clari" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Clari</Link> that cover post-call analysis at enterprise scale.
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
        <Link href="/resources/guides/best-ai-scheduling-agents" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Best AI Scheduling Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Reclaim vs Motion vs Akiflow →</p>
        </Link>
        <Link href="/resources/guides/multi-agent-orchestration" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Multi-Agent Orchestration</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>The complete guide →</p>
        </Link>
        <Link href="/integrations/zoom" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Best for Zoom</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Filter by integration →</p>
        </Link>
        <Link href="/integrations/microsoft-teams" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Best for Microsoft Teams</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Filter by integration →</p>
        </Link>
      </div>
      <GuideCitations slug="best-ai-meeting-agents" table="guides" />
    </div>
  )
}