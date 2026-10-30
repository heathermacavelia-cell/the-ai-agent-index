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
const GUIDE_SLUGS = ['aisdr', 'apollo-io', 'artisan-ava', 'attention', 'backstory', 'clari-copilot', 'clay', 'close-crm', 'cognism-v2', 'gong', 'instantly-ai', 'lavender', 'outreach', 'salesloft']

const AGENT_LINK_STYLE = { color: '#2563EB', textDecoration: 'none', fontWeight: 500 }

function A({ s, r }: { s: string; r: RefMap }) {
  const ref = r[s]
  if (!ref || !ref.name) return <>{'{{' + s + '.name}}'}</>
  if (ref.is_active === false) return <>{ref.name}</>
  return <Link href={'/agents/' + s} style={AGENT_LINK_STYLE}>{ref.name}</Link>
}

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'How AI Agents Are Changing Sales (2026)',
  description: '7 structural shifts in B2B sales: automated prospecting, personalization at scale, autonomous follow-up, and the AI agents behind them.',
  openGraph: {
    title: 'How AI Agents Are Changing Sales (2026)',
    description: '7 structural shifts in B2B sales: automated prospecting, personalization at scale, autonomous follow-up, and the AI agents behind them.',
    url: 'https://theaiagentindex.com/resources/guides/how-ai-agents-are-changing-sales',
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary',
    title: 'How AI Agents Are Changing Sales (2026)',
    description: '7 structural shifts in B2B sales and the AI agents behind them. Independently researched.',
  },
  alternates: {
    canonical: 'https://theaiagentindex.com/resources/guides/how-ai-agents-are-changing-sales',
  },
}

const changes = (refs: RefMap) => [
  {
    title: 'Prospecting is increasingly automated',
    jsx: (
      <>
        Traditional SDR work (identifying target accounts, finding contact details, researching companies, and building lists) is increasingly handled by AI agents in minutes rather than days. Tools like <A s="apollo-io" r={refs} />, <A s="clay" r={refs} />, and <A s="cognism-v2" r={refs} /> pull from large B2B databases or multiple data sources, enrich contacts automatically, and surface intent signals. <A s="clay" r={refs} /> uses waterfall enrichment: it queries one data vendor after another until it finds the data it needs, rather than relying on a single database.
      </>
    ),
  },
  {
    title: 'Personalization at scale is no longer an oxymoron',
    jsx: (
      <>
        For years, sales teams faced a choice: personalize deeply and reach fewer prospects, or reach more prospects with generic messaging. AI agents narrow this tradeoff. AI SDRs like <A s="artisan-ava" r={refs} /> research prospects and write personalized email and social outreach, while cold email infrastructure like <A s="instantly-ai" r={refs} /> spreads sending across many accounts with automated warmup so volume does not wreck deliverability. Email coaching tools like <A s="lavender" r={refs} /> help individual reps by scoring emails in real time before they send. Personalization that used to take a rep real research time per prospect can now be drafted in seconds, though it still needs review.
      </>
    ),
  },
  {
    title: 'AI voice agents are taking on cold calls',
    jsx: (
      <>
        The phone channel is getting the same AI treatment that email received first. <A s="close-crm" r={refs} />&apos;s Chloe is an AI sales agent built into the CRM that calls leads, qualifies prospects through conversation, can book meetings, and updates CRM records. CRM-native voice agents like Chloe take a different approach from standalone AI SDRs: the agent lives inside the CRM where reps already work, so there is no separate data sync layer to maintain. For inside sales teams where call volume is a primary conversion lever, this shift is worth watching closely.
      </>
    ),
  },
  {
    title: 'Follow-up is handled autonomously',
    jsx: (
      <>
        B2B deals usually take several touchpoints before a prospect responds, and follow-up is the step human reps most often let slide. AI agents follow up on schedule, persistently, and without the reluctance that causes human reps to deprioritize it. Sales engagement platforms like <A s="outreach" r={refs} /> and <A s="salesloft" r={refs} /> run multi-step sequences across channels, and <A s="outreach" r={refs} /> now builds AI agents into that workflow. AI SDRs like <A s="artisan-ava" r={refs} /> and <A s="aisdr" r={refs} /> run outreach and follow-up without a human driving each step.
      </>
    ),
  },
  {
    title: 'The SDR role is being redefined',
    jsx: (
      <>
        AI agents are not eliminating SDRs. They are changing what SDRs do. The SDRs who thrive in 2026 are those who can configure, monitor, and optimize AI agents, and who focus their human attention on warm conversations and complex accounts that require genuine relationship building. One AI-enabled SDR running tools like <A s="apollo-io" r={refs} />, <A s="clay" r={refs} />, and <A s="instantly-ai" r={refs} /> can cover far more accounts than a rep doing the same research and sending by hand.
      </>
    ),
  },
  {
    title: 'Conversation intelligence is getting smarter',
    jsx: (
      <>
        AI agents like <A s="gong" r={refs} /> and <A s="clari-copilot" r={refs} /> record and analyze sales calls automatically, flagging objection patterns, deal risks, competitor mentions, and coaching opportunities across a whole sales team. Sales leaders get visibility into what is working and what is not without listening to every call themselves. <A s="attention" r={refs} /> goes further by generating CRM updates and follow-up emails from conversations automatically, cutting the post-call admin that eats into selling time. The result is more consistent coaching and messaging across the team.
      </>
    ),
  },
  {
    title: 'CRM data hygiene becomes automatic',
    jsx: (
      <>
        CRM data decay (contacts changing jobs, companies being acquired, phone numbers going stale) is one of the most persistent problems in sales operations. AI agents can now check records against external data sources and update them automatically. Tools like <A s="clay" r={refs} /> re-enrich CRM records from outside data providers, so a stale contact can be refreshed and routed back into outreach. <A s="backstory" r={refs} /> (formerly People.ai) connects email, meetings, calls and CRM activity, so pipeline data reflects what actually happened rather than what reps remember to log.
      </>
    ),
  },
]

export default async function HowAIAgentsAreChangingSalesPage() {
  const meta = await getGuideMeta('how-ai-agents-are-changing-sales')
  const published = isoDate(meta?.published_at)
  const audited = isoDate(meta?.last_audited_at)
  const updated = updatedLabel(meta?.last_audited_at)

  const supabase = createClient()
  const refs = await buildRefMap(supabase, GUIDE_SLUGS)
  const t = (text: string) => resolveTemplates(text, refs)

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'How AI Agents Are Changing Sales (2026)',
    description: '7 structural shifts in B2B sales: automated prospecting, personalization at scale, autonomous follow-up, and the AI agents behind them.',
    url: 'https://theaiagentindex.com/resources/guides/how-ai-agents-are-changing-sales',
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
        name: 'How are AI agents changing sales?',
        acceptedAnswer: { '@type': 'Answer', text: 'AI agents are automating prospecting, personalizing outreach at scale, handling follow-up autonomously, making outbound calls via AI voice agents, analyzing sales conversations, and keeping CRM data clean. Smaller sales teams can now cover far more accounts than they could with manual research and sending alone.' },
      },
      {
        '@type': 'Question',
        name: 'Will AI agents replace sales reps?',
        acceptedAnswer: { '@type': 'Answer', text: 'AI agents are replacing the repetitive, process-driven parts of sales: prospecting, data entry, follow-up, cold calling, and reporting. Human reps are shifting to high-value conversations, complex negotiations, and relationship building that requires genuine human judgment and empathy.' },
      },
      {
        '@type': 'Question',
        name: 'What is an AI SDR?',
        acceptedAnswer: { '@type': 'Answer', text: t("An AI SDR is a software agent that autonomously handles outbound sales development: identifying prospects, personalizing outreach, sending emails, managing follow-up sequences, and routing warm leads to human account executives. Tools like {{artisan-ava.name}} and {{aisdr.name}} are current examples. CRM-native voice agents like Chloe in {{close-crm.name}} extend this to the phone channel, calling leads and qualifying prospects through conversation.") },
      },
      {
        '@type': 'Question',
        name: 'What is the ROI of using AI agents in sales?',
        acceptedAnswer: { '@type': 'Answer', text: 'Salesforce\'s 2026 State of Sales report found that top-performing sellers are 1.7 times more likely than underperformers to use prospecting AI agents for outreach. The return for your team depends on your own numbers: track cost per meeting booked and pipeline created per rep before and after you add agents, rather than relying on vendor benchmarks.' },
      },
    ],
  }

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <div style={{ marginBottom: '0.75rem' }}>
        <Link href="/" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none' }}>Home</Link>
        <span style={{ color: '#D1D5DB', margin: '0 0.5rem' }}>/</span>
        <Link href="/resources/guides" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none' }}>Guides</Link>
        <span style={{ color: '#D1D5DB', margin: '0 0.5rem' }}>/</span>
        <span style={{ fontSize: '0.8125rem', color: '#111827' }}>How AI Agents Are Changing Sales</span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' as const }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Independently Reviewed</span>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#F3F4F6', color: '#374151', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Guide</span>
        <span style={{ fontSize: '0.75rem', color: '#6B7280', padding: '0.25rem 0.75rem', backgroundColor: '#F3F4F6', borderRadius: '9999px' }}>{updated}</span>
      </div>

      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
        How AI agents are changing sales in 2026
      </h1>

      <p style={{ fontSize: '1.0625rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '0.75rem', maxWidth: '680px' }}>
        The traditional B2B sales motion (manual prospecting, generic sequences, inconsistent follow-up, and CRM data entry) is being replaced by AI agents that can handle much of the top of the funnel autonomously. Salesforce&apos;s 2026 State of Sales report finds 55% of sales professionals now use AI for prospecting. Sales teams name AI and AI agents their top growth tactic for 2026. Here is what is changing and what it means for your team.
      </p>

      <p style={{ fontSize: '0.9375rem', color: '#6B7280', lineHeight: 1.7, marginBottom: '1.75rem', maxWidth: '680px' }}>
        The change is structural, not incremental. The teams getting the most out of it tend to rebuild their outbound motion around agents rather than bolting them on, using human reps for warm conversations and complex accounts while AI handles research, outreach, and follow-up.
      </p>

      <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#0369A1', lineHeight: 1.6, margin: 0 }}>
          <strong>Related:</strong> <Link href="/definitions/what-is-an-ai-sdr" style={{ color: '#2563EB' }}>What is an AI SDR?</Link> and <Link href="/resources/guides/best-ai-agents-for-outbound-sales" style={{ color: '#2563EB' }}>Best AI Agents for Outbound Sales</Link> cover specific tool recommendations.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '1.5rem', marginBottom: '3rem' }}>
        {changes(refs).map((change, i) => (
          <div key={change.title} style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: '1px solid #E5E7EB', padding: '1.5rem', display: 'flex', gap: '1.25rem' }}>
            <div style={{ flexShrink: 0, width: '2rem', height: '2rem', backgroundColor: '#EFF6FF', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#2563EB' }}>{i + 1}</span>
            </div>
            <div>
              <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#111827', marginBottom: '0.5rem' }}>{change.title}</h2>
              <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.7, margin: 0 }}>{change.jsx}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '1.25rem' }}>Frequently asked questions</h2>
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
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>All AI sales agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Browse full category &#x2192;</p>
        </Link>
        <Link href="/stacks/full-outbound-sales-stack" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Full outbound sales stack</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Apollo + Instantly + lemlist &#x2192;</p>
        </Link>
        <Link href="/definitions/what-is-an-ai-sdr" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>What is an AI SDR?</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Read the definition &#x2192;</p>
        </Link>
        <Link href="/resources/guides/best-ai-agents-for-outbound-sales" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Best outbound agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Full guide with picks &#x2192;</p>
        </Link>
        <Link href="/resources/guides/best-ai-agents-for-b2b-prospecting" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Best B2B prospecting agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Apollo, Clay, Instantly compared &#x2192;</p>
        </Link>
        <Link href="/resources/guides/how-to-automate-sales-outreach" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>How to automate outreach</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Step-by-step setup guide &#x2192;</p>
        </Link>
      </div>

      <p style={{ fontSize: '0.875rem', color: '#9CA3AF', lineHeight: 1.6 }}>
        All agents named in this guide are editorially reviewed by The AI Agent Index. See our <Link href="/methodology" style={{ color: '#6B7280' }}>editorial methodology</Link>.
      </p>

      <div style={{ marginBottom: '2rem' }}>
        <NewsletterSignup sourcePage="guide-how-ai-agents-are-changing-sales" sourceType="guide" />
      </div>

      <GuideCitations slug="how-ai-agents-are-changing-sales" table="guides" />
    </div>
  )
}