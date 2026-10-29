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
const GUIDE_SLUGS = ['apollo-io', 'instantly-ai', 'lavender', 'lemlist']

// The agents this guide lists, in this order, under the guide's three types.
// Chosen by hand (Heather, 2026-10-29) - never by tag. Order is editorial, not a ranking.
const GUIDE_GROUPS: GuideGroup[] = [
  {
    heading: 'Sequencers',
    intro: 'Tools that send multi-step outreach sequences and handle the sending side of cold email.',
    slugs: ['lemlist', 'instantly-ai', 'reply-io'],
  },
  {
    heading: 'Data plus sequencing',
    intro: 'A B2B contact database and outreach sequencing in one platform.',
    slugs: ['apollo-io'],
  },
  {
    heading: 'Writing help',
    intro: 'Feedback on the email itself before it is sent.',
    slugs: ['lavender'],
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

const META_DESCRIPTION = 'lemlist for multichannel outreach, Instantly.ai for sending at volume, Apollo.io for data plus sequencing, Lavender for email writing. Deliverability covered.'

export const metadata: Metadata = {
  title: 'Lemlist vs Instantly.ai vs Apollo.io: Cold Email Compared (2026)',
  description: META_DESCRIPTION,
  openGraph: {
    title: 'Lemlist vs Instantly.ai vs Apollo.io: Cold Email Compared (2026)',
    description: META_DESCRIPTION,
    url: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-cold-email',
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary',
    title: 'Lemlist vs Instantly.ai vs Apollo.io: Cold Email Compared (2026)',
    description: META_DESCRIPTION,
  },
  alternates: {
    canonical: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-cold-email',
  },
}

// Features below are limited to what each audited listing states. Prices are not shown here: the cards carry live pricing.
const comparisonRows = [
  { dimension: 'Primary strength', lemlist: 'Multichannel outreach with AI personalization', instantly: 'Sending infrastructure at volume', apollo: 'Contact data plus sequencing', lavender: 'Email writing feedback' },
  { dimension: 'Channels', lemlist: 'Email, LinkedIn, calling, SMS, WhatsApp', instantly: 'Email', apollo: 'AI sequencing', lavender: 'Email' },
  { dimension: 'Sending and deliverability', lemlist: 'Sends its own sequences', instantly: 'Unlimited sending accounts, automated warmup', apollo: 'Built-in sequencing', lavender: 'Email Coach works alongside a sender' },
  { dimension: 'Contact database', lemlist: 'Check with vendor', instantly: 'Check with vendor', apollo: '240M+ contacts', lavender: 'Check with vendor' },
  { dimension: 'AI features', lemlist: 'AI personalization', instantly: 'AI reply classification', apollo: 'AI sequencing, autonomous outreach', lavender: 'Real-time email scoring, Ora AI sales agent' },
  { dimension: 'Also notable', lemlist: 'SOC 2 Type II', instantly: 'MCP server', apollo: 'B2B sales intelligence', lavender: 'Two products: Email Coach and Ora' },
  { dimension: 'Best fit for', lemlist: 'Quality-focused multichannel teams', instantly: 'High-volume senders and agencies', apollo: 'Teams wanting data and outreach in one tool', lavender: 'Reps improving email quality' },
]

const faqItems = [
  {
    q: 'What is the best AI agent for cold email in 2026?',
    a: 'It depends on your priority. {{lemlist.name}} suits personalized outreach across email, LinkedIn, calling, SMS and WhatsApp. {{instantly-ai.name}} suits high-volume sending, with unlimited sending accounts and automated warmup. {{apollo-io.name}} suits teams that need a contact database and sequencing in one platform. {{lavender.name}} helps improve the emails themselves before they send. Many outbound teams combine two of these.',
  },
  {
    q: 'How does AI improve cold email outreach?',
    a: 'AI agents improve cold email by generating personalized icebreakers based on prospect data, optimizing send times, automating follow-up sequences, monitoring deliverability, and coaching reps on email quality in real time. It helps to treat deliverability and personalization as separate problems, each with its own tool or setting.',
  },
  {
    q: 'What is the difference between {{lemlist.name}} and {{instantly-ai.name}}?',
    a: '{{lemlist.name}} focuses on personalization and multichannel outreach: email plus LinkedIn, calling, SMS and WhatsApp, with AI personalization. {{instantly-ai.name}} focuses on sending infrastructure: unlimited sending accounts, automated warmup and AI reply classification. Some teams use {{instantly-ai.name}} for high-volume sending and {{lemlist.name}} for higher-touch multichannel sequences.',
  },
  {
    q: 'What reply rate can I expect from AI-powered cold email?',
    a: 'Reply rates vary widely with list quality, personalization depth and deliverability, so no single benchmark applies to every team. Generic AI-written sequences tend to get fewer replies than outreach that references specific prospect signals, such as a job change or company news. Signal-based personalization lifts reply rates well above generic sequences; track your own baseline and test each change against it.',
  },
  {
    q: 'What is {{lavender.name}} and do I need it alongside another tool?',
    a: '{{lavender.name}} offers Email Coach, which scores your emails in real time so you can improve them before you send, and Ora, an autonomous AI sales agent. Email Coach does not replace a sending tool. It improves what you send through one, such as {{instantly-ai.name}} or {{lemlist.name}}.',
  },
  {
    q: 'Should I use {{apollo-io.name}} or {{instantly-ai.name}}?',
    a: 'Use {{apollo-io.name}} if you need a contact database plus sequencing in one tool, which can remove the need to buy a separate data provider. Use {{instantly-ai.name}} if you already have prospect data and need sending infrastructure with unlimited sending accounts and automated warmup. Some teams use {{apollo-io.name}} for data and {{instantly-ai.name}} for sending, treating them as complementary rather than competing tools.',
  },
  {
    q: 'How important is domain warm-up for cold email?',
    a: 'Very. Sending at volume from a new domain or mailbox with no sending history puts your emails at risk of landing in spam before a single prospect reads them. {{instantly-ai.name}} includes automated warmup that builds sender reputation gradually, and Instantly\'s own help center recommends at least two weeks of warmup before an account sends campaigns. Skipping warmup is a common and costly mistake in cold email setup.',
  },
]

export default async function BestAIAgentsForColdEmailPage() {
  const meta = await getGuideMeta('best-ai-agents-for-cold-email')
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
    headline: 'Best AI Agents for Cold Email Outreach (2026)',
    description: t('{{lemlist.name}}, {{instantly-ai.name}}, {{apollo-io.name}}, and {{lavender.name}} compared for cold email outreach in 2026.'),
    url: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-cold-email',
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
    name: 'Best AI Agents for Cold Email Outreach 2026',
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

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />

      <div style={{ marginBottom: '0.75rem' }}>
        <Link href="/" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none' }}>Home</Link>
        <span style={{ color: '#D1D5DB', margin: '0 0.5rem' }}>/</span>
        <Link href="/resources/guides" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none' }}>Guides</Link>
        <span style={{ color: '#D1D5DB', margin: '0 0.5rem' }}>/</span>
        <span style={{ fontSize: '0.8125rem', color: '#111827' }}>Best AI agents for cold email</span>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' as const }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Guide</span>
        <span style={{ fontSize: '0.75rem', color: '#6B7280', padding: '0.25rem 0.75rem', backgroundColor: '#F3F4F6', borderRadius: '9999px' }}>{updated}</span>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '0.25rem 0.75rem', borderRadius: '9999px', border: '1px solid #BFDBFE' }}>Independently Reviewed</span>
      </div>

      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
        Best AI agents for cold email outreach (2026)
      </h1>

      <p style={{ fontSize: '1.0625rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '0.75rem', maxWidth: '680px' }}>
        Cold email is a core channel for B2B outbound. AI agents now handle everything from prospect research and copy generation to sending, follow-ups, and deliverability management. This guide covers {listed.length} tools, grouped into sequencers, data plus sequencing, and writing help.
      </p>
      <p style={{ fontSize: '0.9375rem', color: '#6B7280', lineHeight: 1.7, marginBottom: '1.75rem', maxWidth: '680px' }}>
        It helps to treat deliverability infrastructure and personalization quality as separate problems. Sending infrastructure determines whether your email reaches the inbox. Personalization quality determines whether the prospect replies.
      </p>

      <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#0369A1', lineHeight: 1.6, margin: 0 }}>
          <strong>Quick recommendation:</strong> If personalized multichannel outreach matters most, look at <A s="lemlist" r={refs} />. If you need sending volume and deliverability tooling, look at <A s="instantly-ai" r={refs} />. If you want a contact database and outreach in one tool, look at <A s="apollo-io" r={refs} />. Add <A s="lavender" r={refs} /> to any stack for real-time feedback on email quality.
        </p>
      </div>

      <GuideAgentList groups={GUIDE_GROUPS} />

      {/* Comparison table */}
      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }}>How they compare</h2>
      <div style={{ overflowX: 'auto' as const, marginBottom: '3rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#F9FAFB' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #E5E7EB', color: '#6B7280', fontWeight: 600, whiteSpace: 'nowrap' as const }}>Dimension</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #E5E7EB', color: '#2563EB', fontWeight: 600 }}>{t('{{lemlist.name}}')}</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #E5E7EB', color: '#059669', fontWeight: 600 }}>{t('{{instantly-ai.name}}')}</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #E5E7EB', color: '#7C3AED', fontWeight: 600 }}>{t('{{apollo-io.name}}')}</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #E5E7EB', color: '#D97706', fontWeight: 600 }}>{t('{{lavender.name}}')}</th>
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map((row, i) => (
              <tr key={row.dimension} style={{ backgroundColor: i % 2 === 0 ? 'white' : '#F9FAFB' }}>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid #F3F4F6', fontWeight: 600, color: '#111827', whiteSpace: 'nowrap' as const }}>{row.dimension}</td>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid #F3F4F6', color: '#4B5563' }}>{row.lemlist}</td>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid #F3F4F6', color: '#4B5563' }}>{row.instantly}</td>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid #F3F4F6', color: '#4B5563' }}>{row.apollo}</td>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid #F3F4F6', color: '#4B5563' }}>{row.lavender}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FAQs */}
      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>Frequently asked questions</h2>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '1rem', marginBottom: '2.5rem' }}>
        {faqItems.map(({ q, a }) => (
          <div key={q} style={{ backgroundColor: '#F9FAFB', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1.25rem' }}>
            <p style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.5rem' }}>{t(q)}</p>
            <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.65, margin: 0 }}>{t(a)}</p>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <NewsletterSignup sourcePage="guide-best-ai-agents-for-cold-email" sourceType="guide" />
      </div>

      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/ai-sales-agents" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>AI sales agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Browse full category &#x2192;</p>
        </Link>
        <Link href="/compare/lemlist-vs-instantly-ai" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>{t('{{lemlist.name}} vs {{instantly-ai.name}}')}</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Full comparison &#x2192;</p>
        </Link>
        <Link href="/resources/guides/best-ai-agents-for-outbound-sales" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Best outbound sales agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Full guide &#x2192;</p>
        </Link>
        <Link href="/stacks/full-outbound-sales-stack" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Full outbound sales stack</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>{t('{{apollo-io.name}} + {{instantly-ai.name}} + {{lemlist.name}}')} &#x2192;</p>
        </Link>
        <Link href="/resources/guides/how-to-automate-sales-outreach" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Automate sales outreach</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Step-by-step guide &#x2192;</p>
        </Link>
        <Link href="/integrations/gmail" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Gmail integrations</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Filter by integration &#x2192;</p>
        </Link>
      </div>

      <p style={{ fontSize: '0.875rem', color: '#9CA3AF', lineHeight: 1.6 }}>
        All agents listed are editorially reviewed by The AI Agent Index. See our <Link href="/methodology" style={{ color: '#6B7280' }}>editorial methodology</Link>.
      </p>

      <GuideCitations slug="best-ai-agents-for-cold-email" table="guides" />
    </div>
  )
}