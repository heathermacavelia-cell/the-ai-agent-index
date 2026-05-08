import Link from 'next/link'
import type { Metadata } from 'next'
import GuideCitations from '@/components/GuideCitations'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'How to Automate Your Sales Outreach with AI Agents (2026)',
  description: 'Step-by-step guide to setting up AI-powered sales outreach — tool selection, domain warm-up, sequence building, and reply rate optimisation with real tool recommendations.',
  openGraph: {
    title: 'How to Automate Your Sales Outreach with AI Agents (2026)',
    description: 'Step-by-step guide to setting up AI-powered sales outreach — tool selection, domain warm-up, sequence building, and reply rate optimisation.',
    url: 'https://theaiagentindex.com/resources/guides/how-to-automate-sales-outreach',
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary',
    title: 'How to Automate Your Sales Outreach with AI Agents (2026)',
    description: 'Step-by-step guide to automating sales outreach with AI agents in 2026.',
  },
  alternates: {
    canonical: 'https://theaiagentindex.com/resources/guides/how-to-automate-sales-outreach',
  },
}

const steps = [
  {
    step: '01',
    title: 'Define your outreach goal',
    body: null,
    jsx: (
      <>
        Start by identifying the one job you&apos;re asking the AI to do. Are you generating net-new leads, following up with warm prospects, or re-engaging churned customers? Each goal requires a different type of agent. For net-new leads, use a tool with a built-in prospecting database like <Link href="/agents/apollo-io" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Apollo.io</Link> (275M+ contacts). For warm prospects, use a personalisation-first tool like <Link href="/agents/lemlist" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>lemlist</Link>. For high-volume cold outreach, use <Link href="/agents/instantly-ai" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Instantly.ai</Link>. For fully autonomous prospecting and outreach without SDR involvement, consider <Link href="/agents/artisan-ava" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Artisan Ava</Link> or <Link href="/agents/avina" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Avina</Link>.
      </>
    ),
  },
  {
    step: '02',
    title: 'Choose your AI outreach agent',
    body: null,
    jsx: (
      <>
        Match the tool to the goal — and do not try to run multiple outreach platforms simultaneously. <Link href="/agents/lemlist" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Lemlist</Link> excels at personalised multichannel sequences combining email and LinkedIn. <Link href="/agents/instantly-ai" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Instantly.ai</Link> is built for volume with unlimited sending accounts and automated domain warm-up. <Link href="/agents/apollo-io" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Apollo.io</Link> is the best all-in-one if you need a contact database and sequencing together. If you need to enrich prospect data from multiple sources before sending, add <Link href="/agents/clay" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Clay</Link> upstream of your sending tool. Once you&apos;ve picked your platform, add <Link href="/agents/lavender" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Lavender</Link> to your inbox for real-time coaching on email quality before messages go out.
      </>
    ),
  },
  {
    step: '03',
    title: 'Build your sequence',
    body: null,
    jsx: (
      <>
        A standard AI-powered outreach sequence: an initial email with a personalised icebreaker on day 1, a follow-up referencing the first email on day 4, a LinkedIn connection request on day 7, and a short breakup email on day 12. Most AI agents generate and personalise each step automatically from prospect data. Keep sequences short — four to five touches is the standard. More than seven touches typically signals poor list quality, not insufficient volume. When writing email copy, focus your AI on writing a specific icebreaker based on a real signal (a LinkedIn post, a job change, a funding announcement) rather than a generic introduction. That single change drives the difference between 1% and 8% reply rates.
      </>
    ),
  },
  {
    step: '04',
    title: 'Warm up your sending domain',
    body: null,
    jsx: (
      <>
        Before sending at volume, warm up your email domain for at least two weeks. <Link href="/agents/instantly-ai" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Instantly.ai</Link> and <Link href="/agents/lemlist" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>lemlist</Link> both include automated warm-up that simulates real email activity to build domain reputation with inbox providers. Use a dedicated outreach domain — not your primary company domain — so that any deliverability issues do not affect your transactional email. Set up SPF, DKIM, and DMARC records on your outreach domain before sending. A properly warmed domain with correct DNS configuration consistently achieves 40–60% open rates. A cold domain without warm-up typically achieves under 10%.
      </>
    ),
  },
  {
    step: '05',
    title: 'Measure and optimise',
    body: null,
    jsx: (
      <>
        Track open rates, reply rates, and booked meetings — not just emails sent. A healthy cold email campaign targets 40–50% open rates and 3–8% reply rates. If open rates are low (under 30%), the problem is deliverability or subject lines. If reply rates are low (under 2%), the problem is copy quality or targeting. AI agents like <Link href="/agents/gong" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Gong</Link> and <Link href="/agents/clari" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Clari</Link> can analyse which sequences and messages perform best across your team, and surface the patterns that convert. Optimise one variable at a time — subject line, icebreaker, call to action, or follow-up timing — to know what is actually moving your numbers.
      </>
    ),
  },
]

const mistakes = [
  {
    title: 'Using your primary company domain for outreach',
    detail: 'Deliverability issues on your outreach domain will affect your entire company\'s email reputation. Always set up a separate sending domain.',
  },
  {
    title: 'Skipping domain warm-up',
    detail: 'The most common mistake. Sending from a cold domain immediately flags your email as spam. Two weeks of warm-up is the minimum — not optional.',
  },
  {
    title: 'Running multiple outreach platforms simultaneously',
    detail: 'Split sending infrastructure confuses your domain reputation metrics and makes it impossible to diagnose deliverability issues. Pick one platform and master it.',
  },
  {
    title: 'Sending generic AI-written copy',
    detail: 'Buyers have learned to spot AI-generated cold email instantly. Personalisation based on real prospect signals — a LinkedIn post, a job change, a company announcement — is what separates 1% reply rates from 8%.',
  },
  {
    title: 'Treating sequence length as a performance lever',
    detail: 'Adding more follow-ups rarely solves a low reply rate. More touches on bad copy to the wrong prospect is just more noise. Fix your targeting and personalisation before you extend your sequences.',
  },
  {
    title: 'Not connecting outreach activity to CRM',
    detail: (<>Sequence activity that doesn&apos;t sync to your CRM creates a phantom pipeline — reps working leads that the CRM says haven&apos;t been contacted. Set up bidirectional sync to <Link href="/integrations/hubspot" style={{ color: '#2563EB', textDecoration: 'none' }}>HubSpot</Link> or <Link href="/integrations/salesforce" style={{ color: '#2563EB', textDecoration: 'none' }}>Salesforce</Link> before launching any sequence.</>),
  },
]

const faqs = [
  {
    q: 'How long does it take to set up AI outreach automation?',
    a: 'Most AI outreach tools can be configured in a few hours. The time-consuming parts are building your prospect list, writing your initial sequence, and setting up your sending domain. Plan for two weeks of domain warm-up before sending at volume — this is non-negotiable and is the step most teams skip.',
  },
  {
    q: 'What reply rate should I expect from AI-powered cold email?',
    a: 'A well-optimised campaign with a warmed domain, clean list, and personalised copy typically achieves 3–8% reply rates. Highly personalised campaigns using signal-based icebreakers can reach 10–15%. Generic mass email with no personalisation typically gets under 1% and often damages domain reputation in the process.',
  },
  {
    q: 'Is cold email still effective in 2026?',
    a: 'Yes — cold email remains one of the highest-ROI outbound channels for B2B sales when done correctly. The key is signal-based personalisation, clean prospect data, proper deliverability setup, and short focused sequences. AI agents have made it significantly easier to do this at scale, but the fundamentals of good cold email have not changed.',
  },
  {
    q: 'Do I need Clay if I already have Apollo?',
    a: 'It depends on your enrichment requirements. Apollo is a strong all-in-one for most use cases. Clay is better if you need to pull from multiple data sources simultaneously, build custom scoring models, or waterfall across several enrichment providers to maximise contact data coverage. Teams with complex enrichment needs often use both: Apollo for the initial contact database and Clay for enrichment logic upstream.',
  },
  {
    q: 'How many emails should I send per day?',
    a: 'For a newly warmed domain, start with 20–30 emails per day and scale up over 4–6 weeks. A well-warmed domain can safely send 150–200 emails per day. Tools like Instantly.ai manage this ramp automatically. Sending too fast too soon is one of the top causes of deliverability problems and inbox blacklisting.',
  },
]

export default function HowToAutomateSalesOutreachPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Automate Your Sales Outreach with AI Agents',
    description: 'A step-by-step guide to automating sales outreach with AI agents in 2026.',
    url: 'https://theaiagentindex.com/resources/guides/how-to-automate-sales-outreach',
    step: steps.map((s) => ({ '@type': 'HowToStep', name: s.title, text: s.body ?? s.title })),
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
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
        <span style={{ fontSize: '0.8125rem', color: '#111827' }}>How to Automate Sales Outreach</span>
      </div>

      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Guide: Sales Automation</p>
      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
        How to Automate Your Sales Outreach with AI Agents (2026)
      </h1>

      <p style={{ fontSize: '1.0625rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '0.75rem', maxWidth: '680px' }}>
        Automating sales outreach with AI agents can save your team dozens of hours per week while increasing reply rates and pipeline volume. According to Salesforce&apos;s 2026 State of Sales report, top-performing sellers are 1.7x more likely to use AI agents for prospecting than underperformers. This guide walks you through exactly how to get set up — from tool selection through to sequence optimisation.
      </p>
      <p style={{ fontSize: '0.9375rem', color: '#6B7280', lineHeight: 1.7, marginBottom: '1.75rem', maxWidth: '680px' }}>
        The setup process takes a day. The domain warm-up takes two weeks. The ROI — measured in hours saved and pipeline generated — typically shows up in the first month.
      </p>

      <div style={{ borderLeft: '3px solid #2563EB', paddingLeft: '1.25rem', marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '0.375rem' }}>
          &ldquo;The domain warm-up step is the one everyone skips and then wonders why their open rates are 8%. Spend two weeks on it. Set up Instantly, let it warm up, then launch. The difference is night and day.&rdquo;
        </p>
        <p style={{ fontSize: '0.8125rem', color: '#9CA3AF', margin: 0 }}>— G2 reviewer, Growth Lead, B2B SaaS company</p>
      </div>

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
      <p style={{ fontSize: '0.9375rem', color: '#6B7280', marginBottom: '1.25rem', lineHeight: 1.6 }}>These are the core tools used in the steps above. Each links to its full listing with pricing, integrations, and editorial rating.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
        {[
          { name: 'lemlist', slug: 'lemlist', desc: 'Best for personalised multichannel sequences' },
          { name: 'Instantly.ai', slug: 'instantly-ai', desc: 'Best for high-volume cold email and deliverability' },
          { name: 'Apollo.io', slug: 'apollo-io', desc: 'Best all-in-one: prospecting database + outreach' },
          { name: 'Clay', slug: 'clay', desc: 'Best for custom enrichment pipelines and data workflows' },
          { name: 'Lavender', slug: 'lavender', desc: 'Best for real-time email quality coaching' },
          { name: 'Gong', slug: 'gong', desc: 'Best for analysing which sequences and messages convert' },
        ].map((tool) => (
          <Link key={tool.slug} href={'/agents/' + tool.slug}
            style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: '1px solid #E5E7EB', padding: '1.25rem', textDecoration: 'none', display: 'block' }}>
            <p style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.375rem' }}>{tool.name}</p>
            <p style={{ fontSize: '0.8125rem', color: '#6B7280', lineHeight: 1.5, margin: 0 }}>{tool.desc}</p>
          </Link>
        ))}
      </div>

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
            <p style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.5rem' }}>{q}</p>
            <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.65, margin: 0 }}>{a}</p>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/ai-sales-agents" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>AI Sales Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Browse full category →</p>
        </Link>
        <Link href="/stacks/full-outbound-sales-stack" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Full Outbound Stack</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Apollo + Instantly + Lemlist →</p>
        </Link>
        <Link href="/resources/guides/best-ai-agents-for-cold-email" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Best Cold Email Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Top picks compared →</p>
        </Link>
        <Link href="/resources/guides/best-ai-agents-for-outbound-sales" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Best Outbound Sales Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Full guide →</p>
        </Link>
        <Link href="/compare/lemlist-vs-instantly-ai" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Lemlist vs Instantly.ai</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Full comparison →</p>
        </Link>
        <Link href="/integrations/salesforce" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Salesforce integrations</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Filter by integration →</p>
        </Link>
      </div>

      <p style={{ fontSize: '0.875rem', color: '#9CA3AF', lineHeight: 1.6 }}>
        All agents listed are editorially reviewed by The AI Agent Index. See our <Link href="/methodology" style={{ color: '#6B7280' }}>editorial methodology</Link>.
      </p>

      <GuideCitations slug="how-to-automate-sales-outreach" table="guides" />
    </div>
  )
}