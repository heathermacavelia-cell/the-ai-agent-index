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
const GUIDE_SLUGS = ['bolt-new', 'catdoes', 'lovable', 'replit-agent', 'v0-vercel']

// The agents this guide lists, in this order, under the guide's two types.
// Chosen 2026-11-03. Order is editorial, not a ranking.
// Every plan fact below was read on the vendor page 2026-11-03.
const GUIDE_GROUPS: GuideGroup[] = [
  {
    heading: 'Web apps from a prompt',
    intro: 'Builders that turn a description into a working web app you can keep changing in chat.',
    slugs: ['lovable', 'replit-agent', 'bolt-new', 'v0-vercel'],
  },
  {
    heading: 'Mobile apps from a prompt',
    intro: 'A builder aimed at iOS and Android apps as well as the web.',
    slugs: ['catdoes'],
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


const META_DESCRIPTION = 'Lovable and Replit for full apps, Bolt for building in the browser, CatDoes for iOS and Android. Free plans, credit costs and what to check before launch.'

export const metadata: Metadata = {
  title: 'Best Vibe Coding Tools: Lovable, Replit, Bolt and More (2026)',
  description: META_DESCRIPTION,
  openGraph: {
    images: [{ url: 'https://theaiagentindex.com/og-image.png', width: 1200, height: 630 }],
    title: 'Best Vibe Coding Tools: Lovable, Replit, Bolt and More (2026)',
    description: META_DESCRIPTION,
    url: 'https://theaiagentindex.com/resources/guides/best-vibe-coding-tools',
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://theaiagentindex.com/og-image.png'],
    title: 'Best Vibe Coding Tools: Lovable, Replit, Bolt and More (2026)',
    description: META_DESCRIPTION,
  },
  alternates: {
    canonical: 'https://theaiagentindex.com/resources/guides/best-vibe-coding-tools',
  },
}

// Prices are not shown here: the cards carry live pricing.
const comparisonRows = [
  { slug: 'lovable', start: 'Free plan, no card', ai: 'Monthly credits, with rollover and top-ups on Pro' },
  { slug: 'replit-agent', start: 'Free Starter plan with daily Agent credits', ai: 'Monthly credits on paid plans, then pay as you go' },
  { slug: 'bolt-new', start: 'Free plan with daily limits, no card', ai: 'Monthly tokens, and unused tokens roll over on Pro' },
  { slug: 'v0-vercel', start: 'Free plan with a daily message limit', ai: 'Monthly credits per user on paid plans, then buy more' },
  { slug: 'catdoes', start: 'Free plan with starter credits', ai: 'Monthly credits, with iOS and Android deploys from Starter' },
]

const faqItems = [
  {
    q: 'What is vibe coding?',
    a: 'Vibe coding means building software by describing what you want in plain language and letting an AI agent write the code, then steering it through conversation. You judge the result by using it rather than reading every line.',
  },
  {
    q: 'What is the best vibe coding tool in 2026?',
    a: 'It depends on what you are building. {{lovable.name}} and {{replit-agent.name}} suit full web apps, {{bolt-new.name}} suits building and hosting in the browser, {{v0-vercel.name}} suits teams on Next.js and Vercel, and {{catdoes.name}} suits people who want iOS and Android apps. All of them have a free way to start, so build the same small app in two and compare.',
  },
  {
    q: 'Do I need to know how to code?',
    a: 'Not to get a working first version. You do need to describe what you want clearly and test it properly. Once an app handles real customers, payments or personal data, have someone who can read code review it, because AI-written code can work on screen and still be unsafe.',
  },
  {
    q: 'How much does vibe coding really cost?',
    a: 'The plan price is only the start. These tools meter work in credits or tokens, and fixing a problem can use as much as building the feature, so a project can run through its allowance quickly. Set a spending limit if the tool offers one, and check what happens when you run out.',
  },
  {
    q: 'Who owns the code, and can I move it?',
    a: 'Check before you build anything important. Ask whether you can export the code, sync it to Git, and host it somewhere else, because some plans keep hosting with the vendor. Each listing notes its own limits.',
  },
]

export default async function BestVibeCodingToolsPage() {
  const meta = await getGuideMeta('best-vibe-coding-tools')
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
    image: 'https://theaiagentindex.com/og-image.png',
    headline: 'Best Vibe Coding Tools: Lovable, Replit, Bolt and More (2026)',
    description: META_DESCRIPTION,
    url: 'https://theaiagentindex.com/resources/guides/best-vibe-coding-tools',
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
      name: t(q),
      acceptedAnswer: { '@type': 'Answer', text: t(a) },
    })),
  }

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Best Vibe Coding Tools (2026)',
    numberOfItems: listed.length,
    itemListElement: listed.map((agent, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'SoftwareApplication',
        name: agent.name,
        description: agent.short_description,
        url: `https://theaiagentindex.com/agents/${agent.slug}`,
      },
    })),
  }

  const h2 = { fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }
  const para = { fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1rem' }
  const card = { backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }
  const cardTitle = { fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }
  const cardSub = { fontSize: '0.8125rem', color: '#6B7280' }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />

      <div style={{ marginBottom: '0.75rem' }}>
        <Link href="/" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none' }}>Home</Link>
        <span style={{ color: '#D1D5DB', margin: '0 0.5rem' }}>/</span>
        <Link href="/resources/guides" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none' }}>Guides</Link>
        <span style={{ color: '#D1D5DB', margin: '0 0.5rem' }}>/</span>
        <span style={{ fontSize: '0.8125rem', color: '#111827' }}>Best vibe coding tools</span>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' as const }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Guide</span>
        {updated && <span style={{ fontSize: '0.75rem', color: '#6B7280', padding: '0.25rem 0.75rem', backgroundColor: '#F3F4F6', borderRadius: '9999px' }}>{updated}</span>}
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '0.25rem 0.75rem', borderRadius: '9999px', border: '1px solid #BFDBFE' }}>Independently Reviewed</span>
      </div>

      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
        Best vibe coding tools (2026)
      </h1>

      <p style={{ fontSize: '1.0625rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '0.75rem' }}>
        Vibe coding tools build working software from a plain-language description. You say what you want, an AI agent writes the code, and you steer it by chatting. This guide covers {listed.length} tools for people who want a real app without setting up a development environment.
      </p>
      <p style={{ fontSize: '0.9375rem', color: '#6B7280', lineHeight: 1.7, marginBottom: '1.75rem' }}>
        Getting a first version is the easy part. The differences show up later, in what each round of changes costs, where the app can live, and how safe it is once real people use it.
      </p>

      <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#0369A1', lineHeight: 1.6, margin: 0 }}>
          <strong>Quick recommendation:</strong> For a full web app, try <A s="lovable" r={refs} /> or <A s="replit-agent" r={refs} />. To start free in the browser, try <A s="bolt-new" r={refs} />. For an iOS or Android app, look at <A s="catdoes" r={refs} />.
        </p>
      </div>

      <GuideAgentList groups={GUIDE_GROUPS} />

      <h2 style={h2}>How they charge</h2>
      <div style={{ overflowX: 'auto' as const, marginBottom: '3rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#F9FAFB' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #E5E7EB', color: '#6B7280', fontWeight: 600 }}>Agent</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #E5E7EB', color: '#6B7280', fontWeight: 600 }}>How you start</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #E5E7EB', color: '#6B7280', fontWeight: 600 }}>How you pay</th>
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map((row) => (
              <tr key={row.slug}>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid #F3F4F6', color: '#111827', fontWeight: 500 }}><A s={row.slug} r={refs} /></td>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid #F3F4F6', color: '#4B5563' }}>{row.start}</td>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid #F3F4F6', color: '#4B5563' }}>{row.ai}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 style={h2}>What to check before you launch</h2>
      <div style={{ marginBottom: '3rem' }}>
        <p style={para}>
          <strong>Security.</strong> An app can look finished and still expose its data. Before real users or payments, check who can see what, keep secret keys out of the code, and get a developer to review anything that handles personal data or money.
        </p>
        <p style={para}>
          <strong>Credits.</strong> Every change costs something, including fixes for problems the agent created. Work in small steps, and find out what happens at the limit.
        </p>
        <p style={para}>
          <strong>Where the app lives.</strong> Check whether you can export the code and host it elsewhere before you build anything important. Each listing notes its own limits on hosting and code ownership.
        </p>
        <p style={para}>
          <strong>App store rules.</strong> Mobile apps must pass Apple and Google review, and that is separate from getting the app to run. <A s="catdoes" r={refs} /> offers iOS and Android deploys from its Starter plan.
        </p>
        <p style={para}>
          <strong>Data training.</strong> Policies differ by plan, and your prompts can include business details. Each listing shows its data training status.
        </p>
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ ...h2, marginBottom: '1rem' }}>How to choose</h2>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.75rem' }}>
          {[
            { condition: 'you want a full web app with a backend', recommendation: <><A s="lovable" r={refs} /> or <A s="replit-agent" r={refs} /></> },
            { condition: 'you want to start free and build in the browser', recommendation: <A s="bolt-new" r={refs} /> },
            { condition: 'you build on Next.js and deploy to Vercel', recommendation: <A s="v0-vercel" r={refs} /> },
            { condition: 'you want an iOS or Android app', recommendation: <A s="catdoes" r={refs} /> },
            { condition: 'you already write code and want an AI editor', recommendation: <Link href="/resources/guides/best-ai-coding-agents" style={AGENT_LINK_STYLE}>Best AI coding agents</Link> },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', gap: '1rem', padding: '0.875rem 1rem', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.5rem', alignItems: 'flex-start', flexWrap: 'wrap' as const }}>
              <span style={{ fontSize: '0.875rem', color: '#374151', flex: 1 }}>If <strong>{row.condition}</strong></span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2563EB', maxWidth: '100%' }}>&#x2192; {row.recommendation}</span>
            </div>
          ))}
        </div>
      </div>

      <h2 style={{ ...h2, marginBottom: '1rem' }}>Frequently asked questions</h2>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '1rem', marginBottom: '2.5rem' }}>
        {faqItems.map(({ q, a }) => (
          <div key={q} style={{ backgroundColor: '#F9FAFB', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1.25rem' }}>
            <p style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.5rem' }}>{t(q)}</p>
            <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.65, margin: 0 }}>{t(a)}</p>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <NewsletterSignup sourcePage="guide-best-vibe-coding-tools" sourceType="guide" />
      </div>

      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/ai-coding-agents" style={card}>
          <p style={cardTitle}>AI coding agents</p>
          <p style={cardSub}>Browse full category &#x2192;</p>
        </Link>
        <Link href="/resources/guides/best-ai-coding-agents" style={card}>
          <p style={cardTitle}>Best AI coding agents</p>
          <p style={cardSub}>Full guide &#x2192;</p>
        </Link>
        <Link href="/resources/guides/ai-coding-agents-vs-traditional-ides" style={card}>
          <p style={cardTitle}>AI coding agents vs IDEs</p>
          <p style={cardSub}>Full guide &#x2192;</p>
        </Link>
      </div>

      <p style={{ fontSize: '0.875rem', color: '#9CA3AF', lineHeight: 1.6 }}>
        All agents listed are editorially reviewed by The AI Agent Index. See our <Link href="/methodology" style={{ color: '#6B7280' }}>editorial methodology</Link>.
      </p>

      <GuideCitations slug="best-vibe-coding-tools" table="guides" />
    </div>
  )
}
