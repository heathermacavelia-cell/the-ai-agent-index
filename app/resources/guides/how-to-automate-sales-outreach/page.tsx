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
const GUIDE_SLUGS = ['apollo-io', 'artisan-ava', 'avina', 'clay', 'gong', 'instantly-ai', 'lavender', 'lemlist']

const AGENT_LINK_STYLE = { color: '#2563EB', textDecoration: 'none', fontWeight: 500 }

function A({ s, r }: { s: string; r: RefMap }) {
  const ref = r[s]
  if (!ref || !ref.name) return <>{'{{' + s + '.name}}'}</>
  if (ref.is_active === false) return <>{ref.name}</>
  return <Link href={'/agents/' + s} style={AGENT_LINK_STYLE}>{ref.name}</Link>
}

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Automate Sales Outreach with AI Agents (2026)',
  description: '5-step guide to automating sales outreach with AI agents: set a goal, pick a tool, build a sequence, warm up your domain and measure results.',
  openGraph: {
    images: [{ url: 'https://theaiagentindex.com/og-image.png', width: 1200, height: 630 }],
    title: 'Automate Sales Outreach with AI Agents (2026)',
    description: '5-step guide to automating sales outreach with AI agents: set a goal, pick a tool, build a sequence, warm up your domain and measure results.',
    url: 'https://theaiagentindex.com/resources/guides/how-to-automate-sales-outreach',
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://theaiagentindex.com/og-image.png'],
    title: 'Automate Sales Outreach with AI Agents (2026)',
    description: '5-step guide to automating sales outreach with AI agents: set a goal, pick a tool, build a sequence, warm up your domain and measure results.',
  },
  alternates: {
    canonical: 'https://theaiagentindex.com/resources/guides/how-to-automate-sales-outreach',
  },
}

const stepTexts = [
  'Define your outreach goal: net-new leads, warm prospects, or high-volume cold outreach. Each goal points to a different AI agent.',
  'Choose your AI outreach agent based on your goal. Start with one sending tool per domain so deliverability problems are easy to trace.',
  'Build a 4-5 touch sequence with a personalized icebreaker on day 1, follow-up on day 4, an optional LinkedIn step on day 7, and breakup on day 12.',
  'Warm up your sending domain for at least two weeks before sending at volume. Set up SPF, DKIM, and DMARC on a dedicated outreach domain.',
  'Track reply rates, bounces, spam complaints, and booked meetings. Treat open rates as a weak signal. Optimize one variable at a time to isolate what moves your numbers.',
]

function buildSteps(refs: RefMap) {
  return [
  {
    step: '01',
    title: 'Define your outreach goal',
    jsx: (
      <>
        Start by identifying the one job you&apos;re asking the AI to do. Are you generating net-new leads, following up with warm prospects, or running high-volume cold outreach? Each goal points to a different type of agent. For net-new leads, use a tool with a built-in prospecting database like <A s="apollo-io" r={refs} />. For warm prospects, use a personalization-first tool like <A s="lemlist" r={refs} />. For high-volume cold outreach, use <A s="instantly-ai" r={refs} />. For an AI BDR that finds leads, runs outreach, handles replies and books meetings, consider <A s="artisan-ava" r={refs} />. To start outreach from buying signals such as website visits, look at <A s="avina" r={refs} />.
      </>
    ),
  },
  {
    step: '02',
    title: 'Choose your AI outreach agent',
    jsx: (
      <>
        Match the tool to the goal, and start with one sending tool per domain so any deliverability problem is easy to trace. <A s="lemlist" r={refs} /> is built for personalized multichannel sequences across email, LinkedIn, calling, SMS and WhatsApp. <A s="instantly-ai" r={refs} /> is built for volume, with unlimited sending accounts and automated warm-up. <A s="apollo-io" r={refs} /> combines a contact database with AI sequencing and waterfall enrichment if you need them in one tool. If you need to pull from many data sources or run custom research on each prospect, add <A s="clay" r={refs} /> ahead of your sending tool. Once you&apos;ve picked your platform, add <A s="lavender" r={refs} /> to your inbox for real-time coaching on email quality before messages go out.
      </>
    ),
  },
  {
    step: '03',
    title: 'Build your sequence',
    jsx: (
      <>
        A standard AI-powered outreach sequence: an initial email with a personalized icebreaker on day 1, a follow-up referencing the first email on day 4, an optional LinkedIn connection request on day 7, and a short breakup email on day 12. Most AI agents generate and personalize each step automatically from prospect data. Keep sequences short. Four to five touches is a common standard. A long sequence usually signals a list quality problem, not a volume problem. The LinkedIn step depends on your tool and plan: <A s="instantly-ai" r={refs} /> is built for email, and <A s="lemlist" r={refs} /> puts LinkedIn on its Multichannel plan. LinkedIn&apos;s help center also says it does not permit third-party software that automates activity on its site and that accounts can be restricted for it, so consider sending that step by hand. When writing email copy, focus your AI on writing a specific icebreaker based on a real signal (a LinkedIn post, a job change, a funding announcement) rather than a generic introduction. Signal-based personalization tends to lift reply rates above generic sequences, so track your own baseline and compare.
      </>
    ),
  },
  {
    step: '04',
    title: 'Warm up your sending domain',
    jsx: (
      <>
        Before sending at volume, warm up your email domain for at least two weeks. <A s="instantly-ai" r={refs} />&apos;s 2026 benchmark report puts the standard timeline at 4 to 6 weeks before full campaign volume. Sending tools such as <A s="instantly-ai" r={refs} /> include automated warm-up that simulates real email activity to build domain reputation with inbox providers. Use a dedicated outreach domain, not your primary company domain, so that any deliverability issues do not affect your transactional email. Set up SPF, DKIM, and DMARC records on your outreach domain before sending. For personal Gmail accounts, Google requires SPF or DKIM from all senders, and all three from anyone sending 5,000 or more messages a day. A warmed domain with correct DNS configuration is more likely to reach the inbox than a cold domain with no warm-up.
      </>
    ),
  },
  {
    step: '05',
    title: 'Measure and optimize',
    jsx: (
      <>
        Track reply rates, bounces, spam complaints, and booked meetings, not just emails sent. Set your own baseline from the first campaign and judge changes against it. Treat open rates as a weak signal: Google says it does not track them, cannot verify the open rates third parties report, and that low open rates are not necessarily an accurate sign of a deliverability problem. If bounces or complaints rise, look first at your list and sending setup. Google asks senders to keep the spam rate in Postmaster Tools below 0.10%. If reply rates fall, look at copy quality and targeting. Your sending tool reports results for each step, and revenue AI platforms like <A s="gong" r={refs} />, which records calls, meetings and emails, can help show which conversations move deals forward. Optimize one variable at a time: subject line, icebreaker, call to action, or follow-up timing. That way you know what is actually moving your numbers.
      </>
    ),
  },
  ]
}

const mistakes = [
  {
    title: 'Using your primary company domain for outreach',
    detail: 'Deliverability problems on your primary domain will affect your entire company\'s email reputation. Always set up a separate sending domain.',
  },
  {
    title: 'Skipping domain warm-up',
    detail: 'A common mistake. Sending at volume from a cold domain makes it far more likely your email lands in spam. Plan for at least two weeks of warm-up.',
  },
  {
    title: 'Sending from one domain through several tools',
    detail: 'Several tools sending from the same domain make reputation problems hard to trace. Start with one sending tool per domain, and add another only when it does a job the first cannot.',
  },
  {
    title: 'Sending generic AI-written copy',
    detail: 'Many buyers can spot generic AI-written cold email. Personalization based on real prospect signals (a LinkedIn post, a job change, a company announcement) tends to lift reply rates above generic copy.',
  },
  {
    title: 'Treating sequence length as a performance lever',
    detail: 'Adding more follow-ups rarely solves a low reply rate. More touches on bad copy to the wrong prospect is just more noise. Fix your targeting and personalization before you extend your sequences.',
  },
  {
    title: 'Not connecting outreach activity to CRM',
    detail: (<>Sequence activity that doesn&apos;t sync to your CRM creates a phantom pipeline where reps work leads that the CRM says haven&apos;t been contacted. Connect your sending tool to <Link href="/integrations/hubspot" style={{ color: '#2563EB', textDecoration: 'none' }}>HubSpot</Link> or <Link href="/integrations/salesforce" style={{ color: '#2563EB', textDecoration: 'none' }}>Salesforce</Link> before launching any sequence, and check which way data flows, because some tools sync one way only or limit sync by plan.</>),
  },
]

const faqs = [
  {
    q: 'How long does it take to set up AI outreach automation?',
    a: 'Most AI outreach tools can be configured in a few hours. The time-consuming parts are building your prospect list, writing your initial sequence, and setting up your sending domain. Plan for at least two weeks of domain warm-up before sending at volume. It is an easy step to want to skip.',
  },
  {
    q: 'What reply rate should I expect from AI-powered cold email?',
    a: 'Reply rates vary widely by list, offer and market, so there is no single number to aim for. A campaign with a warmed domain, a clean list and signal-based personalization tends to get more replies than generic sequences. Generic mass email with no personalization gets few replies and can damage domain reputation in the process. Track your own baseline and improve on it.',
  },
  {
    q: 'Is cold email still effective in 2026?',
    a: 'Yes, for many B2B teams, when it is done well. The key is signal-based personalization, clean prospect data, proper deliverability setup, and short focused sequences. AI agents make it easier to do this at scale, but the fundamentals of good cold email have not changed.',
  },
  {
    q: 'Do I need {{clay.name}} if I already have {{apollo-io.name}}?',
    a: 'It depends on your enrichment requirements. {{apollo-io.name}} combines a contact database with sequencing and waterfall enrichment, which covers many teams. {{clay.name}} fits when you need to pull from many data sources at once, run custom research on each prospect, or build your own enrichment logic. Teams with complex enrichment needs can use both: {{apollo-io.name}} for the initial contact database and {{clay.name}} for enrichment logic before sending.',
  },
  {
    q: 'How many emails should I send per day?',
    a: 'Start low and ramp slowly. {{instantly-ai.name}}\'s email warm-up guide recommends starting at 5 to 10 warm-up emails per inbox per day and keeping warm-up plus campaign sends within a cap of 30 emails per inbox per day. Teams that need more volume usually add inboxes rather than push one inbox harder. Sending too fast too soon is a common cause of deliverability problems and blocklisting.',
  },
]

export default async function HowToAutomateSalesOutreachPage() {
  const meta = await getGuideMeta('how-to-automate-sales-outreach')
  const published = isoDate(meta?.published_at)
  const audited = isoDate(meta?.last_audited_at)
  const updated = updatedLabel(meta?.last_audited_at)

  const supabase = createClient()
  const refs = await buildRefMap(supabase, GUIDE_SLUGS)
  const t = (text: string) => resolveTemplates(text, refs)
  const steps = buildSteps(refs)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Automate Your Sales Outreach with AI Agents',
    description: '5-step guide to automating sales outreach with AI agents: set a goal, pick a tool, build a sequence, warm up your domain and measure results.',
    url: 'https://theaiagentindex.com/resources/guides/how-to-automate-sales-outreach',
    step: steps.map((s, i) => ({ '@type': 'HowToStep', name: s.title, text: stepTexts[i] })),
    ...(published ? { datePublished: published } : {}),
    ...(audited ? { dateModified: audited } : {}),
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: t(q),
      acceptedAnswer: { '@type': 'Answer', text: t(a) },
    })),
  }

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'AI Sales Outreach Tools',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: t('{{lemlist.name}}'), url: 'https://theaiagentindex.com/agents/lemlist' },
      { '@type': 'ListItem', position: 2, name: t('{{instantly-ai.name}}'), url: 'https://theaiagentindex.com/agents/instantly-ai' },
      { '@type': 'ListItem', position: 3, name: t('{{apollo-io.name}}'), url: 'https://theaiagentindex.com/agents/apollo-io' },
      { '@type': 'ListItem', position: 4, name: t('{{clay.name}}'), url: 'https://theaiagentindex.com/agents/clay' },
      { '@type': 'ListItem', position: 5, name: t('{{lavender.name}}'), url: 'https://theaiagentindex.com/agents/lavender' },
      { '@type': 'ListItem', position: 6, name: t('{{gong.name}}'), url: 'https://theaiagentindex.com/agents/gong' },
    ],
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />

      <div style={{ marginBottom: '0.75rem' }}>
        <Link href="/" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none' }}>Home</Link>
        <span style={{ color: '#D1D5DB', margin: '0 0.5rem' }}>/</span>
        <Link href="/resources/guides" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none' }}>Guides</Link>
        <span style={{ color: '#D1D5DB', margin: '0 0.5rem' }}>/</span>
        <span style={{ fontSize: '0.8125rem', color: '#111827' }}>How to Automate Sales Outreach</span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' as const }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Guide</span>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#F3F4F6', color: '#374151', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Sales</span>
        <span style={{ fontSize: '0.75rem', color: '#6B7280', padding: '0.25rem 0.75rem', backgroundColor: '#F3F4F6', borderRadius: '9999px' }}>{updated}</span>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '0.25rem 0.75rem', borderRadius: '9999px', border: '1px solid #BFDBFE' }}>Independently Reviewed</span>
      </div>

      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
        How to Automate Your Sales Outreach with AI Agents (2026)
      </h1>

      <p style={{ fontSize: '1.0625rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '0.75rem' }}>
        Automating sales outreach with AI agents takes research, writing and follow-up off your reps&apos; plates so they can spend more time in conversations. Salesforce&apos;s 2026 State of Sales report finds that top-performing sellers are 1.7 times more likely to use prospecting AI agents for outreach than underperformers. This guide walks you through how to get set up, from tool selection through to sequence optimization.
      </p>
      <p style={{ fontSize: '0.9375rem', color: '#6B7280', lineHeight: 1.7, marginBottom: '1.75rem' }}>
        The setup process can take a day. The domain warm-up takes at least two weeks. Measure the return in hours saved and pipeline generated against your own starting baseline.
      </p>

      {/* Steps */}
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '1.5rem', marginBottom: '3rem' }}>
        {steps.map((s) => (
          <div key={s.step} style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
            <div style={{ flexShrink: 0, width: '2.5rem', height: '2.5rem', backgroundColor: '#EFF6FF', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2563EB', fontFamily: 'monospace' }}>{s.step}</span>
            </div>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>{s.title}</h2>
              <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.7, margin: 0 }}>{s.jsx}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recommended tools */}
      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>Recommended tools</h2>
      <p style={{ fontSize: '0.9375rem', color: '#4B5563', marginBottom: '3rem', lineHeight: 1.7 }}>
        These are the core tools used in the steps above: <A s="lemlist" r={refs} /> and <A s="instantly-ai" r={refs} /> for sending sequences, <A s="apollo-io" r={refs} /> for a contact database with sequencing, <A s="clay" r={refs} /> for enrichment from many data sources, <A s="lavender" r={refs} /> for email coaching, and <A s="gong" r={refs} /> for revenue intelligence across calls, meetings and emails. <A s="artisan-ava" r={refs} /> and <A s="avina" r={refs} /> are the AI BDR and buying-signal options from step 1. Each links to its full listing with current pricing, integrations, and editorial rating.
      </p>

      {/* Rules */}
      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>Rules to check before you send</h2>
      <p style={{ fontSize: '0.9375rem', color: '#4B5563', marginBottom: '0.75rem', lineHeight: 1.7 }}>
        Automating outreach does not change the rules that apply to it. In the US, the FTC says the CAN-SPAM Act makes no exception for business-to-business email: commercial messages need a valid postal address and a working opt-out, and opt-outs must be honored within 10 business days. In Canada, the CRTC lists three requirements under CASL: consent, identification information and an unsubscribe mechanism, so confirm you have consent before you load a Canadian list.
      </p>
      <p style={{ fontSize: '0.9375rem', color: '#4B5563', marginBottom: '3rem', lineHeight: 1.7 }}>
        Gmail adds its own requirements: anyone sending more than 5,000 messages a day to personal Gmail accounts must support one-click unsubscribe on marketing mail. Other countries have their own rules. This is general information, not legal advice, so check what applies to your market before you launch.
      </p>

      {/* Common mistakes */}
      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }}>Common mistakes to avoid</h2>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.75rem', marginBottom: '3rem' }}>
        {mistakes.map((mistake) => (
          <div key={mistake.title} style={{ backgroundColor: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: '0.75rem', padding: '1rem' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#C2410C', marginBottom: '0.3rem' }}>{mistake.title}</p>
            <p style={{ fontSize: '0.875rem', color: '#6B7280', lineHeight: 1.6, margin: 0 }}>{mistake.detail}</p>
          </div>
        ))}
      </div>

      {/* FAQs */}
      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>Frequently Asked Questions</h2>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '1rem', marginBottom: '2.5rem' }}>
        {faqs.map(({ q, a }) => (
          <div key={q} style={{ backgroundColor: '#F9FAFB', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1.25rem' }}>
            <p style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.5rem' }}>{t(q)}</p>
            <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.65, margin: 0 }}>{t(a)}</p>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/ai-sales-agents" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>AI Sales Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Browse full category &#x2192;</p>
        </Link>
        <Link href="/stacks/full-outbound-sales-stack" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Full Outbound Stack</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>{t('{{apollo-io.name}} + {{instantly-ai.name}} + {{lemlist.name}}')} &#x2192;</p>
        </Link>
        <Link href="/resources/guides/best-ai-agents-for-cold-email" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Best Cold Email Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Picks compared &#x2192;</p>
        </Link>
        <Link href="/resources/guides/best-ai-agents-for-outbound-sales" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Best Outbound Sales Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Full guide &#x2192;</p>
        </Link>
        <Link href="/compare/lemlist-vs-instantly-ai" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>{t('{{lemlist.name}} vs {{instantly-ai.name}}')}</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Full comparison &#x2192;</p>
        </Link>
        <Link href="/integrations/salesforce" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Salesforce integrations</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Filter by integration &#x2192;</p>
        </Link>
      </div>

      <p style={{ fontSize: '0.875rem', color: '#9CA3AF', lineHeight: 1.6 }}>
        All agents listed are editorially reviewed by The AI Agent Index. See our <Link href="/methodology" style={{ color: '#6B7280' }}>editorial methodology</Link>.
      </p>

      <div style={{ marginBottom: '2rem' }}>
        <NewsletterSignup sourcePage="guide-how-to-automate-sales-outreach" sourceType="guide" />
      </div>

      <GuideCitations slug="how-to-automate-sales-outreach" table="guides" />
    </div>
  )
}