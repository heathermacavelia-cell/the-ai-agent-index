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
const GUIDE_SLUGS = ['apollo-io', 'chatgpt-deep-research', 'copy-ai', 'fathom', 'instantly-ai', 'perplexity-ai', 'reclaim-ai', 'tidio']

// The agents this guide lists, in this order, under the guide's five functions.
// Chosen by hand (Heather, 2026-10-29) - never by tag. Order is editorial, not a ranking.
const GUIDE_GROUPS: GuideGroup[] = [
  {
    heading: 'Sales',
    intro: 'Prospect data, email sequencing and sending infrastructure for outbound without a dedicated sales operations team.',
    slugs: ['apollo-io', 'instantly-ai'],
  },
  {
    heading: 'Support',
    intro: 'Live chat and help desk with an AI agent that answers routine customer questions.',
    slugs: ['tidio'],
  },
  {
    heading: 'Marketing',
    intro: 'AI workflows and agents that turn repeatable marketing and sales processes into reusable steps.',
    slugs: ['copy-ai'],
  },
  {
    heading: 'Research',
    intro: 'Research tools that search the web and cite their sources, from quick answers to longer reports.',
    slugs: ['perplexity-ai', 'chatgpt-deep-research'],
  },
  {
    heading: 'Productivity',
    intro: 'Meeting notes and calendar planning for owners whose day is split across many roles.',
    slugs: ['fathom', 'reclaim-ai'],
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
  title: 'Best AI Agents for Small Business: 8 Under $50/mo (2026)',
  description: 'Apollo.io and Instantly.ai for sales, Tidio for support, Copy.ai for marketing, Perplexity for research, plus meeting and calendar agents.',
  openGraph: {
    title: 'Best AI Agents for Small Business: 8 Under $50/mo (2026)',
    description: 'Apollo.io and Instantly.ai for sales, Tidio for support, Copy.ai for marketing, Perplexity for research, plus meeting and calendar agents.',
    url: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-small-business',
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary',
    title: 'Best AI Agents for Small Business: 8 Under $50/mo (2026)',
    description: 'Apollo.io and Instantly.ai for sales, Tidio for support, Copy.ai for marketing, Perplexity for research, plus meeting and calendar agents.',
  },
  alternates: {
    canonical: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-small-business',
  },
}

// Per-function prose. picks() renders at request time with the page's RefMap so every
// agent name in it comes from the database.
const categories = [
  {
    title: 'AI sales agents for small business',
    slug: 'ai-sales-agents',
    description: `Sales is a function where AI gives small businesses real leverage. The work that AI agents handle well in sales (finding prospects, personalizing outreach, sending sequences, and following up consistently) is exactly the work that gets deprioritized or done inconsistently when one person is covering sales alongside everything else.

The agents that work best for small businesses in sales are ones that require minimal setup, integrate with email providers you already use, and produce results quickly enough to justify the cost within the first month. Long implementation timelines and complex onboarding are enterprise problems. For a small business, if an agent is not delivering value in two weeks, it is the wrong tool.`,
    picks: (r: RefMap) => (
      <>
        <A s="apollo-io" r={r} /> combines a B2B contact database with AI sequencing and outreach, and has a free plan, which is enough to test whether outbound works for your market before paying. For a first structured outbound motion it can stand in for a separate data provider and sequencing tool. <A s="instantly-ai" r={r} /> is cold email infrastructure: unlimited sending accounts, automated warmup and AI reply classification, so you can spread sending across several accounts and protect deliverability without managing the setup yourself.
      </>
    ),
  },
  {
    title: 'AI customer support agents for small business',
    slug: 'ai-customer-support-agents',
    description: `Customer support is one of the hardest functions to scale with a small team. As the business grows, support volume grows with it, but adding headcount to handle support is expensive and often the wrong investment at early stages. AI support agents help by handling the high-volume, repetitive queries that take up much of support time: order status, product questions, returns, account access, and FAQs.

The small business case for AI customer support is particularly strong because the alternative is often the business owner or a single team member answering the same questions repeatedly. An AI agent that resolves a share of routine inbound queries on its own gives that time back for work that actually requires human judgment. The important thing for small businesses is to choose an agent that escalates cleanly to a human when it encounters something it cannot handle: a frustrated customer who cannot reach a person after failing with the bot is worse than no bot at all.`,
    picks: (r: RefMap) => (
      <>
        <A s="tidio" r={r} /> combines live chat, a help desk and its Lyro AI Agent, and is built for small businesses and ecommerce stores. It has a free plan, so you can put it on your site and see which questions it answers before committing to a paid tier. Check how it hands conversations to a person before you go live.
      </>
    ),
  },
  {
    title: 'AI marketing agents for small business',
    slug: 'ai-marketing-agents',
    description: `Marketing is one of the functions most often understaffed at small businesses. The content, copy, and campaign work that drives growth requires consistent output (blog posts, social content, email newsletters, ad copy, landing page text) and producing that volume manually without a dedicated marketing team is rarely sustainable. AI marketing agents do not replace the strategic thinking that makes marketing work, but they reduce the time required to produce the content that executes on that strategy.

For small businesses, the most useful marketing AI agents are ones that produce usable first drafts quickly, maintain a consistent brand voice, and integrate with the publishing platforms where content needs to go. The goal is not to automate marketing judgment: it is to remove the bottleneck of production so that one person can execute a marketing plan that would otherwise require a team.`,
    picks: (r: RefMap) => (
      <>
        <A s="copy-ai" r={r} /> is a go-to-market AI platform, now part of Fullcast, that turns repeatable sales, marketing and operations processes into AI Workflows and Agents. It suits a small team that writes the same kinds of content again and again (campaign emails, social posts, product copy) and wants those steps captured once and reused.
      </>
    ),
  },
  {
    title: 'AI research agents for small business',
    slug: 'ai-research-agents',
    description: `Small business owners make decisions with less information than they should, not because they do not value data, but because gathering it manually takes time they do not have. Competitive research, market sizing, supplier evaluation, regulatory requirements, industry trends: all of these require the same manual search-and-synthesize process that AI research agents now handle in minutes.

The research use case for small businesses is broad. It covers competitive intelligence before a sales call, background research on a prospective client, understanding a new market before entering it, summarizing industry reports, and synthesizing customer feedback. The agents that work best here are the ones that search live web sources rather than relying solely on training data, and that provide citations so outputs can be verified before being acted on.`,
    picks: (r: RefMap) => (
      <>
        <A s="perplexity-ai" r={r} /> is an answer engine that searches the live web and cites every claim inline, so you can check a source before acting on it. It has a free plan and suits quick questions: competitor background, regulatory basics, a fast summary before a call. <A s="chatgpt-deep-research" r={r} /> is a research mode in ChatGPT that plans, reads many sources and writes a cited report, drawing on the web, your files and connected apps. Use it for longer jobs such as a competitive analysis, a market entry report or a vendor comparison.
      </>
    ),
  },
]

const evaluationCriteria = [
  {
    title: 'Price-to-value at your actual volume',
    detail: 'Most AI agents are priced by usage: emails sent, conversations handled, content pieces generated, or searches run. Before committing to a paid plan, calculate your expected monthly usage and compare it against the pricing tiers. The ROI test for a small business is straightforward: estimate the hours an agent saves each week, multiply them by what that time is worth to you, and compare the result with the monthly cost. Any agent that does not pass this basic test is not the right tool at the right price point.',
  },
  {
    title: 'Time to first value, measured in days not months',
    detail: 'Enterprise AI agents have implementation timelines measured in weeks or months. That is not acceptable for a small business evaluating whether a tool is worth keeping. SMB-oriented agents are designed to be self-service: you sign up, connect your existing tools, configure the agent using an interface that requires no technical knowledge, and see results within the first week. If an agent requires professional services, a dedicated implementation team, or more than a few hours of setup, it was not built for small businesses regardless of how it is marketed.',
  },
  {
    title: 'Integration with tools you already use',
    detail: 'Every new tool a small team adopts creates overhead. Good AI agents reduce that overhead by connecting to the tools already in use rather than requiring new workflows. Before evaluating any agent, list the three to five tools it needs to integrate with (your email provider, CRM, support platform, or content management system) and verify those integrations are native and bidirectional. An agent that requires you to change your workflow to use it will not be used consistently.',
  },
  {
    title: 'Self-service support and documentation quality',
    detail: 'Small businesses do not have IT departments or dedicated tool administrators. When something breaks or needs reconfiguration, a team member has to figure it out independently. Evaluate the quality of a vendor\'s documentation, the responsiveness of their support, and whether there is an active user community before committing. A tool with excellent capability but poor documentation creates ongoing operational friction that erodes the time savings it was supposed to produce.',
  },
  {
    title: 'Transparent pricing with no hidden scale costs',
    detail: 'Some AI agents have attractive entry pricing that becomes significantly more expensive as usage grows. Usage-based models can produce unexpected costs when volume spikes. Before signing up, understand exactly what triggers higher pricing tiers and model what your costs would look like at two times and five times your current expected usage. Tools that obscure pricing complexity behind sales conversations are usually more expensive at scale than tools with published, transparent pricing pages.',
  },
]

const faqItems = [
  {
    q: 'What are the best AI agents for small businesses in 2026?',
    a: 'The right AI agents for a small business vary by function. For outbound sales, {{apollo-io.name}} and {{instantly-ai.name}} cover prospect data, email sequences and sending. For customer support, {{tidio.name}} combines live chat and a help desk with an AI agent for routine questions. For marketing, {{copy-ai.name}} turns repeatable content and campaign steps into AI workflows. For research, {{perplexity-ai.name}} and {{chatgpt-deep-research.name}} search the web and cite their sources. For day-to-day productivity, {{fathom.name}} takes meeting notes and {{reclaim-ai.name}} schedules tasks and focus time on your calendar. The right starting point is the function that is most understaffed in your business: pick one, get it working, then expand.',
  },
  {
    q: 'Can a small business afford AI agents?',
    a: 'Yes. Several of the agents in this guide have a free plan, and the listing cards show each one\'s current pricing. More importantly, the ROI calculation for small businesses is often more compelling than for large ones: when one person is covering a function that would require two or three people without AI assistance, the value of an agent that makes that person more effective is immediately measurable. The right question is not whether a small business can afford AI agents but which function will produce the clearest return most quickly.',
  },
  {
    q: 'How long does it take to deploy an AI agent as a small business?',
    a: 'For self-serve tools, deployment is usually measured in hours to days, not weeks. Tools with a free plan, such as {{apollo-io.name}}, {{tidio.name}} and {{fathom.name}}, let you try the product on your own work before you pay, so you find out quickly how much setup your use case needs. The agents that take longer to deploy (those requiring custom integrations, training on proprietary data, or professional services) are generally not the right choice for small businesses where fast time to value is a primary requirement.',
  },
  {
    q: 'Should a small business use one AI agent or several?',
    a: 'Start with one, in the function where you have the biggest gap between what needs to happen and what your team can currently deliver. Spreading AI investment across multiple functions simultaneously makes it harder to measure what is working and produces shallower adoption in each area. Once one agent is genuinely embedded in your workflow and delivering measurable value, evaluate the next highest-leverage function. Building an AI stack one tool at a time is easier to manage than deploying everything at once.',
  },
  {
    q: 'What are the most common mistakes small businesses make when adopting AI agents?',
    a: 'Common failure modes are: choosing an agent based on features rather than fit for the specific workflow it needs to handle; deploying without configuring the agent against your actual use cases and testing it before going live; underestimating the time required to integrate the agent with existing tools; and not tracking a clear metric that defines whether the agent is delivering value. If a well-chosen, properly configured agent is not showing value within the first month, the tool is either wrong for the use case or was not set up correctly.',
  },
]

export default async function BestAIAgentsForSmallBusinessPage() {
  const meta = await getGuideMeta('best-ai-agents-for-small-business')
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
    headline: 'Best AI Agents for Small Business (2026)',
    description: 'Apollo.io and Instantly.ai for sales, Tidio for support, Copy.ai for marketing, Perplexity for research, plus meeting and calendar agents.',
    url: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-small-business',
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
    name: 'Best AI Agents for Small Business (2026)',
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
    })),
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
        <span style={{ fontSize: '0.8125rem', color: '#111827' }}>Best AI Agents for Small Business</span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' as const }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Independently Reviewed</span>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Guide</span>
        <span style={{ fontSize: '0.75rem', color: '#6B7280', padding: '0.25rem 0.75rem', backgroundColor: '#F3F4F6', borderRadius: '9999px' }}>{updated}</span>
      </div>

      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
        Best AI Agents for Small Business (2026)
      </h1>

      {/* Intro */}
      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem', maxWidth: '700px' }}>
        The gap between what a five-person team can accomplish and what a fifty-person team can accomplish is closing. AI agents are handling the work that used to require headcount: outbound prospecting, customer support, content production, and research. Small businesses that adopt the right agents are not just more efficient: they can compete in functions where they previously could not afford to compete at all.
      </p>
      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem', maxWidth: '700px' }}>
        The AI agent landscape is built primarily for enterprise buyers. Much of the marketing, pricing complexity, and implementation overhead is designed around organizations with IT departments, procurement teams, and six-month deployment timelines. This guide focuses on what works for small businesses: tools with published pricing, self-service setup that does not require an engineering team, and fast enough time to value that you know within 30 days whether the investment is worth keeping. Every agent listed here has a plan that starts under fifty dollars a month, though for some that entry price applies only with annual billing. The cards below show current pricing.
      </p>
      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem', maxWidth: '700px' }}>
        The {listed.length} agents recommended here cover five functions: sales, customer support, marketing, research, and day-to-day productivity, where <A s="fathom" r={refs} /> takes meeting notes and <A s="reclaim-ai" r={refs} /> plans tasks and focus time on your calendar. These are functions that are commonly understaffed in small businesses and where AI agents can take on routine work at a cost a small team can carry.
      </p>
      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '2rem', maxWidth: '700px' }}>
        The most effective approach is to start with one function, whichever has the largest gap between what needs to happen and what your team can currently deliver, and automate it properly before expanding to others. Shallow adoption across multiple areas produces worse results than deep adoption in one.
      </p>

      <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '3rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#0369A1', lineHeight: 1.6, margin: 0 }}>
          <strong>How to use this guide:</strong> Start with the category that is most understaffed in your business. Pick one agent, get it working, measure the result, then expand. One agent embedded properly outperforms three agents adopted halfway.
        </p>
      </div>

      <GuideAgentList groups={GUIDE_GROUPS} />

      {/* Category sections */}
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '3rem', marginBottom: '3.5rem' }}>
        {categories.map((cat) => (
          <div key={cat.title}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '2px solid #E5E7EB' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', margin: 0 }}>{cat.title}</h2>
              <Link href={'/' + cat.slug} style={{ fontSize: '0.8125rem', color: '#2563EB', textDecoration: 'none', fontWeight: 500, flexShrink: 0, marginLeft: '1rem' }}>Browse all &#x2192;</Link>
            </div>
            {cat.description.split('\n\n').map((para, i) => (
              <p key={i} style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.75, marginBottom: '1rem', maxWidth: '700px' }}>{para}</p>
            ))}
            <p style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.75, marginBottom: '1rem', maxWidth: '700px' }}>{cat.picks(refs)}</p>
          </div>
        ))}
      </div>

      {/* Evaluation criteria */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>How to evaluate AI agents as a small business</h2>
        <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1.5rem' }}>
          The evaluation criteria that matter for enterprise buyers are often the wrong ones for small businesses. These are the questions that actually determine whether a tool delivers value at small business scale.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.875rem' }}>
          {evaluationCriteria.map((item) => (
            <div key={item.title} style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.25rem 1.5rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.5rem' }}>{item.title}</h3>
              <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.7, margin: 0 }}>{item.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Decision framework */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>How to choose</h2>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.75rem' }}>
          {[
            { condition: 'Your biggest gap is outbound sales and prospecting', recommendation: '{{apollo-io.name}} or {{instantly-ai.name}}', href: '/ai-sales-agents' },
            { condition: 'You are spending too much time on repetitive customer support', recommendation: '{{tidio.name}}', href: '/ai-customer-support-agents' },
            { condition: 'Marketing content is a bottleneck, not enough output, not enough consistency', recommendation: '{{copy-ai.name}}', href: '/ai-marketing-agents' },
            { condition: 'You need faster, better-sourced research for decisions and sales calls', recommendation: '{{perplexity-ai.name}} or {{chatgpt-deep-research.name}}', href: '/ai-research-agents' },
            { condition: 'You want to automate a workflow that spans multiple tools', recommendation: 'Browse No-Code AI Agent Builders', href: '/resources/guides/best-no-code-ai-agent-builders' },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', gap: '1rem', padding: '0.875rem 1rem', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.5rem', alignItems: 'flex-start', flexWrap: 'wrap' as const }}>
              <span style={{ fontSize: '0.875rem', color: '#374151', flex: 1 }}>If <strong>{row.condition}</strong></span>
              <Link href={row.href} style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2563EB', textDecoration: 'none', flexShrink: 0 }}>&#x2192; {t(row.recommendation)}</Link>
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

      {/* Related resources */}
      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/ai-sales-agents" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>AI Sales Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>Browse full category &#x2192;</p>
        </Link>
        <Link href="/resources/guides/best-no-code-ai-agent-builders" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>No-Code AI Builders</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>Build without engineering &#x2192;</p>
        </Link>
        <Link href="/resources/guides/how-to-evaluate-an-ai-agent" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>How to Evaluate an Agent</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>Buying framework &#x2192;</p>
        </Link>
        <Link href="/resources/guides/best-ai-agents-for-outbound-sales" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Best for Outbound Sales</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>Full sales agent guide &#x2192;</p>
        </Link>
      </div>

      <p style={{ fontSize: '0.875rem', color: '#9CA3AF', lineHeight: 1.6 }}>
        All agents listed are editorially reviewed by The AI Agent Index. See our <Link href="/methodology" style={{ color: '#6B7280' }}>editorial methodology</Link>.
      </p>

      <GuideCitations slug="best-ai-agents-for-small-business" table="guides" />
    </div>
  )
}
