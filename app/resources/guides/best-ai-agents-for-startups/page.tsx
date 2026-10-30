import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase'
import GuideCitations from '@/components/GuideCitations'
import NewsletterSignup from '@/components/NewsletterSignup'
import { getGuideMeta, isoDate, updatedLabel } from '@/lib/guideMeta'
import GuideAgentList from '@/components/GuideAgentList'
import { getGuideGroups, type GuideGroup } from '@/lib/guideAgents'
import { buildRefMap, resolveTemplates, type RefMap } from '@/lib/templates'

// Agent names in this guide's prose and FAQ come from the database, not from this file.
// GUIDE_SLUGS lists every agent the prose names. A name that is renamed in the database
// updates here automatically. A slug that does not exist renders its raw template, loudly.
const GUIDE_SLUGS = ['apollo-io', 'cursor', 'instantly-ai', 'jasper', 'perplexity-ai', 'tidio']

// The agents this guide lists, in this order, under the guide's five functions.
// Chosen by hand (Heather, 2026-10-29) - never by tag. Order is editorial, not a ranking.
const GUIDE_GROUPS: GuideGroup[] = [
  {
    heading: 'Sales',
    intro: 'Prospecting data, sequencing and cold email sending for founder-led outbound.',
    slugs: ['apollo-io', 'instantly-ai'],
  },
  {
    heading: 'Support',
    intro: 'Live chat, a help desk and an AI agent that answers routine customer questions.',
    slugs: ['tidio'],
  },
  {
    heading: 'Marketing',
    intro: 'On-brand content generation for a small team producing content across channels.',
    slugs: ['jasper'],
  },
  {
    heading: 'Research',
    intro: 'Cited answers from the live web for market, competitor and investor research.',
    slugs: ['perplexity-ai'],
  },
  {
    heading: 'Engineering',
    intro: 'An AI code editor and coding agent for technical founders.',
    slugs: ['cursor'],
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
  title: '6 AI Agents for Lean Startup Teams (2026)',
  description: 'Apollo.io for prospecting, Instantly.ai for email, Tidio for support, Cursor for code. Chosen for startup budgets and setup speed. Independently researched.',
  openGraph: {
    title: '6 AI Agents for Lean Startup Teams (2026)',
    description: 'Apollo.io for prospecting, Instantly.ai for email, Tidio for support, Cursor for code. Chosen for startup budgets and setup speed. Independently researched.',
    url: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-startups',
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary',
    title: '6 AI Agents for Lean Startup Teams (2026)',
    description: 'Apollo.io for prospecting, Instantly.ai for email, Tidio for support, Cursor for code. Chosen for startup budgets and setup speed. Independently researched.',
  },
  alternates: {
    canonical: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-startups',
  },
}

const principles = [
  {
    title: 'Automate before hiring',
    desc: 'Before hiring for any repeatable function, evaluate whether an AI agent can handle the work. The question is not whether AI can do the job as well as a human: it is whether AI can do enough of the job well enough to delay a hire by six to twelve months while the company de-risks further.',
  },
  {
    title: 'Start with revenue-generating functions',
    desc: 'Sales and marketing agents deliver the fastest ROI because their impact is directly measurable against revenue. Customer support agents come second: they reduce cost and free founder time. Operations and admin automation can wait. If you are choosing where to deploy AI first, start where the output has the clearest dollar value attached to it.',
  },
  {
    title: 'Wait until after product-market fit to automate deeply',
    desc: 'Pre-PMF, you need to be doing things that do not scale: talking to customers directly, iterating on the product based on individual conversations, learning what works before building systems around it. Automation compounds what you already know works. If you automate before you have found repeatable patterns worth scaling, you build infrastructure around the wrong things.',
  },
  {
    title: 'Measure every agent against a clear ROI threshold',
    desc: 'Every agent you pay for should demonstrate measurable value. The calculation is simple: hours saved per week multiplied by the effective cost of that time, compared to the monthly subscription cost. An agent whose monthly cost is well below the value of five hours of founder time per week, and that saves those five hours, is delivering significant value. An agent that is difficult to measure or whose value is unclear after 30 days is not the right tool.',
  },
]

const faqItems = [
  {
    q: 'What are the best AI agents for startups in 2026?',
    a: 'The right AI agents for a startup depend on the function. For outbound sales, {{apollo-io.name}} covers prospecting data and sequencing, and {{instantly-ai.name}} covers cold email sending with automated warmup. For customer support, {{tidio.name}} answers common questions with its Lyro AI Agent and has a free plan. For research, {{perplexity-ai.name}} gives cited answers from live web sources. For content, {{jasper.name}} produces on-brand marketing copy. For development, {{cursor.name}} is an AI code editor and coding agent. The right starting point is the function with the largest gap between what needs to happen and what your current team can deliver.',
  },
  {
    q: 'How can startups use AI agents to grow faster?',
    a: 'Startups use AI agents to build the operational output of a larger team without the headcount cost. An AI sales agent runs outbound prospecting and follow-up at volume. An AI support agent handles customer queries without requiring support staff. An AI content agent produces marketing material at a pace no individual writer can sustain. Together, these agents allow a small founding team to operate at a scale that would otherwise require significantly more people, which preserves runway and lets the team focus on the decisions that actually require human judgment.',
  },
  {
    q: 'Are AI agents affordable for pre-revenue startups?',
    a: 'Often, yes. {{apollo-io.name}}, {{perplexity-ai.name}}, {{tidio.name}} and {{cursor.name}} each offer a free plan or tier, which is enough to test whether a tool fits before paying. {{instantly-ai.name}} and {{jasper.name}} are paid subscriptions. Current prices are on each listing; compare them against the cost of the hire the tool would replace or delay.',
  },
  {
    q: 'When should a startup start using AI agents?',
    a: 'The right time to start using AI agents is after you have validated your core product and found repeatable patterns worth scaling, typically after product-market fit, or at least after you understand what is working. Pre-PMF, the risk is automating the wrong things: building outbound sequences before you know who your best customers are, or automating content before you know what messaging resonates. The exception is low-risk tools like {{perplexity-ai.name}} for research, which are useful at any stage and carry no risk of automating in the wrong direction.',
  },
  {
    q: 'What is the biggest mistake startups make when adopting AI agents?',
    a: 'The most common mistake is adopting too many agents at once without measuring the value of any of them clearly. Three agents with measurable ROI outperform ten agents where the impact is diffuse and hard to attribute. The second most common mistake is using AI to automate customer interactions too early, before you have enough customer conversations to understand what people need, automating support and outreach can create distance from the customer signals that inform product decisions. Do things manually first, automate when you understand what you are automating.',
  },
]

export default async function BestAIAgentsForStartupsPage() {
  const meta = await getGuideMeta('best-ai-agents-for-startups')
  const published = isoDate(meta?.published_at)
  const audited = isoDate(meta?.last_audited_at)
  const updated = updatedLabel(meta?.last_audited_at)

  const supabase = createClient()
  const groups = await getGuideGroups(GUIDE_GROUPS)
  const listed = groups.flatMap((g) => g.agents)

  const refs = await buildRefMap(supabase, GUIDE_SLUGS)
  const t = (text: string) => resolveTemplates(text, refs)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Best AI Agents for Startups (2026)',
    description: 'Apollo.io for prospecting, Instantly.ai for email, Tidio for support, Cursor for code. Chosen for startup budgets and setup speed.',
    url: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-startups',
    ...(published ? { datePublished: published } : {}),
    ...(audited ? { dateModified: audited } : {}),
    author: { '@type': 'Organization', name: 'The AI Agent Index', url: 'https://theaiagentindex.com' },
    publisher: { '@type': 'Organization', name: 'The AI Agent Index', url: 'https://theaiagentindex.com' },
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: t(a) },
    })),
  }

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Best AI Agents for Startups (2026)',
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

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />

      {/* Breadcrumb */}
      <div style={{ marginBottom: '0.75rem' }}>
        <Link href="/" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none' }}>Home</Link>
        <span style={{ color: '#D1D5DB', margin: '0 0.5rem' }}>/</span>
        <Link href="/resources/guides" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none' }}>Guides</Link>
        <span style={{ color: '#D1D5DB', margin: '0 0.5rem' }}>/</span>
        <span style={{ fontSize: '0.8125rem', color: '#111827' }}>Best AI Agents for Startups</span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' as const }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Independently Reviewed</span>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Guide</span>
        <span style={{ fontSize: '0.75rem', color: '#6B7280', padding: '0.25rem 0.75rem', backgroundColor: '#F3F4F6', borderRadius: '9999px' }}>{updated}</span>
      </div>

      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
        Best AI Agents for Startups (2026)
      </h1>

      {/* Intro */}
      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem', maxWidth: '700px' }}>
        Capital is not the only thing that sets a startup&apos;s pace. AI agents built into operations from the start can extend the output of a small team into work that would otherwise take more people and more runway.
      </p>

      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem', maxWidth: '700px' }}>
        The startup case for AI agents is distinct from the enterprise case. Startups are not looking for tools that integrate with existing IT infrastructure, pass enterprise security reviews, or support large team workflows. They need tools that are cheap enough to justify before revenue, fast enough to set up without engineering resources, and produce clear enough results to measure whether they are working within 30 days.
      </p>

      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem', maxWidth: '700px' }}>
        The functions where AI agents deliver the fastest and most measurable ROI at the startup stage are outbound sales, customer support, and content, because all three have direct, immediate connections to revenue and cost that make the value visible quickly. Research and development tools follow as productivity multipliers for the founding team itself.
      </p>

      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '2rem', maxWidth: '700px' }}>
        This guide covers six agents across five functions, from <A s="apollo-io" r={refs} /> and <A s="instantly-ai" r={refs} /> for outbound to <A s="cursor" r={refs} /> for code, chosen for startup constraints: budget, setup speed, and time to measurable value. They are grouped by function below.
      </p>

      <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '3rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#0369A1', lineHeight: 1.6, margin: 0 }}>
          <strong>Key principle:</strong> Automate the repeatable, high-volume functions first. Sales outreach, customer support, and content generation are where AI delivers the fastest and most measurable startup ROI. Research and development tools follow as productivity multipliers for the founding team.
        </p>
      </div>

      {/* Picks */}
      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '1.25rem' }}>AI agents for startups by function</h2>
      <GuideAgentList groups={GUIDE_GROUPS} />

      {/* Principles */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>Principles for AI-first startups</h2>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.875rem' }}>
          {principles.map((item) => (
            <div key={item.title} style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.25rem 1.5rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.5rem' }}>{item.title}</h3>
              <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div style={{ marginBottom: '3rem' }}>
        <NewsletterSignup />
      </div>

      {/* FAQs */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '1.25rem' }}>Frequently Asked Questions</h2>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '1rem' }}>
          {faqItems.map(({ q, a }) => (
            <div key={q} style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1.25rem 1.5rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.5rem' }}>{q}</h3>
              <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.75, margin: 0 }}>{t(a)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Related */}
      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/resources/guides/best-ai-agents-for-small-business" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Best for Small Business</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>SMB agent guide &#x2192;</p>
        </Link>
        <Link href="/resources/guides/best-ai-agents-for-outbound-sales" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Best for Outbound Sales</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>Full sales guide &#x2192;</p>
        </Link>
        <Link href="/resources/guides/best-no-code-ai-agent-builders" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>No-Code AI Builders</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>Build without engineers &#x2192;</p>
        </Link>
        <Link href="/resources/guides/how-to-build-and-sell-an-ai-agent" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Build and Sell an Agent</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>For founders building agents &#x2192;</p>
        </Link>
      </div>

      <p style={{ fontSize: '0.875rem', color: '#9CA3AF', lineHeight: 1.6 }}>
        All agents listed are editorially reviewed by The AI Agent Index. See our <Link href="/methodology" style={{ color: '#6B7280' }}>editorial methodology</Link>.
      </p>

      <GuideCitations slug="best-ai-agents-for-startups" table="guides" />
    </div>
  )
}