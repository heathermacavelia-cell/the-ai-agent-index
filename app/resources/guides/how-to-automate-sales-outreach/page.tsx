import Link from 'next/link'
import type { Metadata } from 'next'
import GuideCitations from '@/components/GuideCitations'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'How to Automate Your Sales Outreach with AI Agents (2026)',
  description: 'A step-by-step guide to automating sales outreach with AI agents in 2026 - covering tool selection, sequence building, and optimization.',
  openGraph: {
    title: 'How to Automate Your Sales Outreach with AI Agents (2026)',
    description: 'Step-by-step guide to automating sales outreach with AI agents in 2026.',
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
    body: 'Are you generating net-new leads, following up with warm prospects, or re-engaging churned customers? Each goal requires a different type of AI agent. For net-new leads, use a tool with a built-in prospecting database like Apollo.io. For warm prospects, use a personalization-first tool like Lemlist. For high-volume cold outreach, use Instantly.ai.',
  },
  {
    step: '02',
    title: 'Choose your AI outreach agent',
    body: 'Match the tool to the goal. Lemlist excels at personalized multi-channel sequences combining email and LinkedIn. Instantly.ai is built for volume with unlimited sending accounts and automated domain warm-up. Apollo.io is the best all-in-one if you need both a contact database and sequencing. Start with one tool - do not try to run multiple outreach platforms simultaneously.',
  },
  {
    step: '03',
    title: 'Build your sequence',
    body: 'A standard AI-powered outreach sequence includes: an initial email with a personalized icebreaker, a follow-up three days later referencing the first email, a LinkedIn connection request on day five, and a final short breakup email on day ten. Most AI agents can generate and personalize each step automatically based on prospect data.',
  },
  {
    step: '04',
    title: 'Warm up your sending domain',
    body: 'Before sending at volume, warm up your email domain for at least two weeks. Tools like Instantly.ai and Lemlist include built-in warm-up features. Sending from a cold domain kills deliverability and lands you in spam. Use a dedicated outreach domain - not your primary company domain.',
  },
  {
    step: '05',
    title: 'Measure and optimize',
    body: 'Track open rates, reply rates, and booked meetings - not just emails sent. A healthy cold email campaign targets 40-50% open rates and 3-8% reply rates. If open rates are low, fix your subject line. If reply rates are low, fix your copy or targeting. AI agents like Gong and Clari can analyze which sequences perform best across your team.',
  },
]

const faqs = [
  {
    q: 'How long does it take to set up AI outreach automation?',
    a: 'Most AI outreach tools can be set up in a few hours. The time-consuming part is building your prospect list and writing your initial sequence. Plan for two weeks of domain warm-up before sending at volume.',
  },
  {
    q: 'What reply rate should I expect from AI-powered cold email?',
    a: 'A well-optimized cold email campaign typically achieves 3-8% reply rates. Highly personalized campaigns using tools like Lemlist can reach 10-15%. Generic mass email typically gets under 1%.',
  },
  {
    q: 'Is cold email still effective in 2026?',
    a: 'Yes - cold email remains one of the highest-ROI outbound channels for B2B sales when done correctly. The key is personalization, clean lists, and proper deliverability setup. AI agents have made it significantly easier to do this at scale.',
  },
]

export default function HowToAutomateSalesOutreachPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Automate Your Sales Outreach with AI Agents',
    description: 'A step-by-step guide to automating sales outreach with AI agents in 2026.',
    url: 'https://theaiagentindex.com/resources/guides/how-to-automate-sales-outreach',
    step: steps.map((s) => ({ '@type': 'HowToStep', name: s.title, text: s.body })),
  }

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

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
      <p style={{ fontSize: '1.0625rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '2rem' }}>
        Automating sales outreach with AI agents can save your team dozens of hours per week while increasing reply rates and pipeline volume. Here is how to get started in 2026.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
        {steps.map((s) => (
          <div key={s.step} style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
            <div style={{ flexShrink: 0, width: '2.5rem', height: '2.5rem', backgroundColor: '#EFF6FF', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2563EB', fontFamily: 'monospace' }}>{s.step}</span>
            </div>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>{s.title}</h2>
              <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.7, margin: 0 }}>{s.body}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>Recommended tools</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
        {[
          { name: 'Lemlist', slug: 'lemlist', desc: 'Best for personalized multi-channel sequences' },
          { name: 'Instantly.ai', slug: 'instantly-ai', desc: 'Best for high-volume cold email at scale' },
          { name: 'Apollo.io', slug: 'apollo-io', desc: 'Best all-in-one prospecting and outreach' },
        ].map((tool) => (
          <Link key={tool.slug} href={'/agents/' + tool.slug}
            style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: '1px solid #E5E7EB', padding: '1.25rem', textDecoration: 'none', display: 'block' }}>
            <p style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.375rem' }}>{tool.name}</p>
            <p style={{ fontSize: '0.8125rem', color: '#6B7280', lineHeight: 1.5, margin: 0 }}>{tool.desc}</p>
          </Link>
        ))}
      </div>

      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>Frequently Asked Questions</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
        {faqs.map(({ q, a }) => (
          <div key={q} style={{ backgroundColor: '#F9FAFB', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1.25rem' }}>
            <p style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.5rem' }}>{q}</p>
            <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.65, margin: 0 }}>{a}</p>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        <Link href="/ai-sales-agents" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>AI Sales Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Browse full category</p>
        </Link>
        <Link href="/resources/guides/best-ai-agents-for-cold-email" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Best Cold Email Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Top picks</p>
        </Link>
        <Link href="/compare/lemlist-vs-instantly-ai" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Lemlist vs Instantly.ai</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Full comparison</p>
        </Link>
      </div>
      <GuideCitations slug="how-to-automate-sales-outreach" table="guides" />
    </div>
  )
}