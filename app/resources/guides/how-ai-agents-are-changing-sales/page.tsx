import Link from 'next/link'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

import GuideCitations from '@/components/GuideCitations'

export const metadata: Metadata = {
  title: 'How AI Agents Are Changing Sales in 2026',
  description: 'How AI agents are transforming prospecting, personalisation, follow-up, and CRM workflows in 2026. Adoption data, real examples, and which agents are driving the shift.',
  openGraph: {
    title: 'How AI Agents Are Changing Sales in 2026',
    description: 'How AI agents are transforming prospecting, personalisation, follow-up, and CRM workflows in 2026.',
    url: 'https://theaiagentindex.com/resources/guides/how-ai-agents-are-changing-sales',
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary',
    title: 'How AI Agents Are Changing Sales in 2026',
    description: 'How AI agents reshape prospecting, personalisation, and CRM. Adoption data and real examples.',
  },
  alternates: {
    canonical: 'https://theaiagentindex.com/resources/guides/how-ai-agents-are-changing-sales',
  },
}

const changes = [
  {
    title: 'Prospecting is now fully automatable',
    jsx: (
      <>
        Traditional SDR work — identifying target accounts, finding contact details, researching companies, and building lists — is now handled by AI agents in minutes rather than days. Tools like <Link href="/agents/apollo-io" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Apollo.io</Link>, <Link href="/agents/clay" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Clay</Link>, and <Link href="/agents/cognism-v2" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Cognism</Link> pull from multiple data sources simultaneously, enrich contacts automatically, and surface intent signals that human researchers would miss. The result is higher quality prospect lists built in a fraction of the time — with Clay&apos;s waterfall enrichment approach pulling from 100+ sources until verified data is found, rather than relying on a single database.
      </>
    ),
  },
  {
    title: 'Personalisation at scale is no longer an oxymoron',
    jsx: (
      <>
        For years, sales teams faced a choice: personalise deeply and reach fewer prospects, or reach more prospects with generic messaging. AI agents eliminate this tradeoff. Tools like <Link href="/agents/instantly-ai" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Instantly.ai</Link> and <Link href="/agents/artisan-ava" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Artisan Ava</Link> research each prospect individually and generate genuinely personalised outreach — referencing their recent content, company news, and specific pain points — then send thousands of these messages simultaneously. Email coaching tools like <Link href="/agents/lavender" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Lavender</Link> further improve individual rep quality by scoring emails in real-time before they send. The personalisation that used to take 20 minutes per prospect now takes seconds.
      </>
    ),
  },
  {
    title: 'Follow-up is handled autonomously',
    jsx: (
      <>
        Most B2B deals require multiple touchpoints before a prospect responds, but most sales teams follow up only once or twice before moving on. AI agents follow up precisely, persistently, and without the psychological resistance that causes human reps to deprioritise it. Tools like <Link href="/agents/outreach" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Outreach</Link> and <Link href="/agents/salesloft" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Salesloft</Link> track email opens, link clicks, and reply signals — then adjust timing and messaging based on engagement data in real time. Autonomous SDRs like <Link href="/agents/artisan-ava" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Artisan Ava</Link> and <Link href="/agents/aisdr" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>AiSDR</Link> handle the full follow-up workflow without human intervention at each step.
      </>
    ),
  },
  {
    title: 'The SDR role is being redefined',
    jsx: (
      <>
        AI agents are not eliminating SDRs — they are changing what SDRs do. The best SDRs in 2026 are those who can configure, monitor, and optimise AI agents — and who focus their human attention exclusively on warm conversations and complex accounts that require genuine relationship building. SDRs who resist this shift are being outcompeted by teams where one AI-enabled SDR, running tools like <Link href="/agents/apollo-io" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Apollo.io</Link>, <Link href="/agents/clay" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Clay</Link>, and <Link href="/agents/instantly-ai" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Instantly.ai</Link>, runs the output that previously required four.
      </>
    ),
  },
  {
    title: 'Conversation intelligence is getting smarter',
    jsx: (
      <>
        AI agents like <Link href="/agents/gong" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Gong</Link> and <Link href="/agents/clari-copilot" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Clari Copilot</Link> now analyse every sales call automatically — identifying objection patterns, deal risks, competitor mentions, and coaching opportunities across an entire sales team simultaneously. Sales leaders get real-time visibility into what is working and what is not, without listening to calls themselves. <Link href="/agents/attention" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Attention</Link> goes further by generating CRM updates and follow-up emails from call transcripts automatically, eliminating the post-call admin that consumes 20% of rep time. The result is faster rep development and more consistent messaging across the team.
      </>
    ),
  },
  {
    title: 'CRM data hygiene becomes automatic',
    jsx: (
      <>
        CRM data decay — contacts changing jobs, companies being acquired, phone numbers going stale — is one of the most persistent problems in sales operations. AI agents now monitor these changes against external data sources and update CRM records automatically. Tools like <Link href="/agents/clay" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Clay</Link> monitor job changes and company events in real time, triggering re-engagement sequences automatically when a champion moves to a new company. <Link href="/agents/backstory" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Backstory</Link> (formerly People.ai) specialises in CRM data accuracy at enterprise scale, ensuring pipeline data reflects reality rather than what reps remember to log.
      </>
    ),
  },
]

const agentList = [
  { name: 'Instantly.ai', slug: 'instantly-ai', role: 'Outbound email automation and deliverability' },
  { name: 'Apollo.io', slug: 'apollo-io', role: 'B2B prospecting database and sequencing' },
  { name: 'Clay', slug: 'clay', role: 'Data enrichment and personalised outreach at scale' },
  { name: 'lemlist', slug: 'lemlist', role: 'Multichannel personalised outreach' },
  { name: 'Gong', slug: 'gong', role: 'Conversation intelligence and deal analytics' },
  { name: 'Artisan Ava', slug: 'artisan-ava', role: 'Fully autonomous AI SDR' },
  { name: 'Outreach', slug: 'outreach', role: 'Sales execution and pipeline management' },
  { name: 'Salesloft', slug: 'salesloft', role: 'Sales engagement and revenue intelligence' },
  { name: 'Lavender', slug: 'lavender', role: 'AI email coaching for cold outreach quality' },
  { name: 'Clari Copilot', slug: 'clari-copilot', role: 'Conversation intelligence and forecast accuracy' },
  { name: 'Attention', slug: 'attention', role: 'Automatic CRM updates from call transcripts' },
  { name: 'Cognism', slug: 'cognism-v2', role: 'EMEA-focused B2B data and intent signals' },
]

export default function HowAIAgentsAreChangingSalesPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'How AI Agents Are Changing Sales in 2026',
    description: 'How AI agents are transforming prospecting, personalisation, follow-up, and CRM workflows in 2026.',
    url: 'https://theaiagentindex.com/resources/guides/how-ai-agents-are-changing-sales',
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
        name: 'How are AI agents changing sales?',
        acceptedAnswer: { '@type': 'Answer', text: 'AI agents are automating prospecting, personalising outreach at scale, handling follow-up autonomously, analysing sales conversations, and keeping CRM data clean. Smaller sales teams are achieving the output previously requiring much larger ones — with one AI-enabled SDR now running the output of four.' },
      },
      {
        '@type': 'Question',
        name: 'Will AI agents replace sales reps?',
        acceptedAnswer: { '@type': 'Answer', text: 'AI agents are replacing the repetitive, process-driven parts of sales — prospecting, data entry, follow-up, and reporting. Human reps are shifting to high-value conversations, complex negotiations, and relationship building that requires genuine human judgment and empathy.' },
      },
      {
        '@type': 'Question',
        name: 'What is an AI SDR?',
        acceptedAnswer: { '@type': 'Answer', text: 'An AI SDR is a software agent that autonomously handles outbound sales development — identifying prospects, personalising outreach, sending emails, managing follow-up sequences, and routing warm leads to human account executives. Tools like Artisan Ava and AiSDR are current examples.' },
      },
      {
        '@type': 'Question',
        name: 'What is the ROI of using AI agents in sales?',
        acceptedAnswer: { '@type': 'Answer', text: 'According to Salesforce\'s 2026 State of Sales report, top-performing sellers are 1.7x more likely to use AI agents for prospecting than underperformers. Teams that have rebuilt their outbound motion around AI agents report meaningful reductions in cost per meeting booked and increases in pipeline volume without proportional headcount growth.' },
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
        <span style={{ fontSize: '0.8125rem', color: '#111827' }}>How AI Agents Are Changing Sales</span>
      </div>

      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Guide · Sales</p>

      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
        How AI Agents Are Changing Sales in 2026
      </h1>

      <p style={{ fontSize: '1.0625rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '0.75rem', maxWidth: '680px' }}>
        The traditional B2B sales motion — manual prospecting, generic sequences, inconsistent follow-up, and CRM data entry — is being replaced by AI agents that handle the entire top of funnel autonomously. According to Salesforce&apos;s 2026 State of Sales report, 55% of sales teams are already using AI specifically for prospecting, and teams investing in AI name it the single most important tactic for growth this year. Here is what is changing and what it means for your team.
      </p>

      <p style={{ fontSize: '0.9375rem', color: '#6B7280', lineHeight: 1.7, marginBottom: '1.75rem', maxWidth: '680px' }}>
        The change is structural, not incremental. The teams capturing real value are those that have rebuilt their outbound motion around agents from the ground up — using human reps for warm conversations and complex accounts, while AI handles the entire research, outreach, and follow-up workflow.
      </p>

      <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#0369A1', lineHeight: 1.6, margin: 0 }}>
          <strong>Related:</strong> <Link href="/definitions/what-is-an-ai-sdr" style={{ color: '#2563EB' }}>What is an AI SDR?</Link> and <Link href="/resources/guides/best-ai-agents-for-outbound-sales" style={{ color: '#2563EB' }}>Best AI Agents for Outbound Sales</Link> — structured guides with specific tool recommendations and pricing.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '1.5rem', marginBottom: '3rem' }}>
        {changes.map((change, i) => (
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

      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>The AI sales agents driving this change</h2>
      <p style={{ fontSize: '0.9375rem', color: '#6B7280', marginBottom: '1.25rem', lineHeight: 1.6 }}>All agents below are editorially reviewed in the index with verified pricing, integrations, and capabilities.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem', marginBottom: '2.5rem' }}>
        {agentList.map((agent) => (
          <Link key={agent.slug} href={'/agents/' + agent.slug} style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
            <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>{agent.name}</p>
            <p style={{ fontSize: '0.75rem', color: '#6B7280', lineHeight: 1.5, margin: 0 }}>{agent.role}</p>
          </Link>
        ))}
      </div>

      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '1.25rem' }}>Frequently Asked Questions</h2>
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
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Browse full category →</p>
        </Link>
        <Link href="/stacks/full-outbound-sales-stack" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Full Outbound Sales Stack</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Apollo + Instantly + Lemlist →</p>
        </Link>
        <Link href="/definitions/what-is-an-ai-sdr" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>What is an AI SDR?</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Read the definition →</p>
        </Link>
        <Link href="/resources/guides/best-ai-agents-for-outbound-sales" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Best Outbound Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Full guide with picks →</p>
        </Link>
        <Link href="/resources/guides/best-ai-agents-for-b2b-prospecting" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Best B2B Prospecting Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Apollo, Clay, Instantly compared →</p>
        </Link>
        <Link href="/resources/guides/how-to-automate-sales-outreach" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>How to Automate Outreach</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Step-by-step setup guide →</p>
        </Link>
      </div>

      <p style={{ fontSize: '0.875rem', color: '#9CA3AF', lineHeight: 1.6 }}>
        All agents listed are editorially reviewed by The AI Agent Index. See our <Link href="/methodology" style={{ color: '#6B7280' }}>editorial methodology</Link>.
      </p>

      <GuideCitations slug="how-ai-agents-are-changing-sales" table="guides" />
    </div>
  )
}