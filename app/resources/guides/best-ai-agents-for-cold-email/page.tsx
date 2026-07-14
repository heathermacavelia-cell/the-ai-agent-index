import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase'
import GuideCitations from '@/components/GuideCitations'
import NewsletterSignup from '@/components/NewsletterSignup'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Lemlist vs Instantly.ai vs Apollo.io: Cold Email Compared (2026)',
  description: 'Lemlist for personalization, Instantly.ai for volume, Apollo.io for all-in-one prospecting, Lavender for email quality. Deliverability and pricing reviewed. Not affiliated.',
  openGraph: {
    title: 'Lemlist vs Instantly.ai vs Apollo.io: Cold Email Compared (2026)',
    description: 'Lemlist for personalization, Instantly.ai for volume, Apollo.io for all-in-one prospecting, Lavender for email quality. Deliverability and pricing reviewed. Not affiliated.',
    url: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-cold-email',
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary',
    title: 'Lemlist vs Instantly.ai vs Apollo.io: Cold Email Compared (2026)',
    description: 'Lemlist for personalization, Instantly.ai for volume, Apollo.io for all-in-one prospecting, Lavender for email quality. Deliverability and pricing reviewed. Not affiliated.',
  },
  alternates: {
    canonical: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-cold-email',
  },
}

const allPicks = [
  { name: 'lemlist', slug: 'lemlist', description: 'Personalized multichannel cold email with AI icebreakers, dynamic images, and LinkedIn automation.' },
  { name: 'Instantly.ai', slug: 'instantly-ai', description: 'High-volume cold email with unlimited sending accounts, automated warm-up, and deliverability analytics.' },
  { name: 'Apollo.io', slug: 'apollo-io', description: 'All-in-one B2B prospecting and outreach with 275M+ contact database and built-in sequencing.' },
  { name: 'Lavender', slug: 'lavender', description: 'AI email coach that scores and improves cold emails in real-time before sending.' },
]

const picks = [
  {
    rank: 1,
    name: 'lemlist',
    slug: 'lemlist',
    tag: 'Best for personalization',
    tagColor: '#2563EB',
    tagBg: '#EFF6FF',
    description: 'lemlist is built around personalized cold email at scale. It uses AI to generate custom icebreakers, embed dynamic images and videos, and build multichannel sequences combining email and LinkedIn. Its deliverability tools and CRM integrations make it the top choice for teams that prioritize quality over volume.',
    pricing: 'From $55/month',
    bestFor: 'Teams sending personalized, multichannel sequences',
    categoryLink: null,
  },
  {
    rank: 2,
    name: 'Instantly.ai',
    slug: 'instantly-ai',
    tag: 'Best for volume',
    tagColor: '#059669',
    tagBg: '#ECFDF5',
    description: 'Instantly.ai is purpose-built for high-volume cold email. It supports unlimited sending accounts with automated warm-up, AI-generated copy, and advanced deliverability analytics. Agencies and teams running outreach at scale consistently rank it as the most reliable sender.',
    pricing: 'From $37/month',
    bestFor: 'Agencies and teams scaling outreach across multiple domains',
    categoryLink: null,
  },
  {
    rank: 3,
    name: 'Apollo.io',
    slug: 'apollo-io',
    tag: 'Best all-in-one',
    tagColor: '#7C3AED',
    tagBg: '#F5F3FF',
    description: 'Apollo.io combines a B2B contact database of 275 million contacts with built-in email sequencing and AI personalization. It is the best option if you need prospecting and outreach in a single platform without stitching together multiple tools. Free tier available.',
    pricing: 'Free tier; paid from $49/month',
    bestFor: 'Teams that need prospecting and outreach in one platform',
    categoryLink: null,
  },
  {
    rank: 4,
    name: 'Lavender',
    slug: 'lavender',
    tag: 'Best for email quality',
    tagColor: '#D97706',
    tagBg: '#FFFBEB',
    description: 'Lavender is an AI email coach that integrates directly with your inbox and cold email tools, scoring your emails in real-time and suggesting improvements before you send. Where Instantly.ai and lemlist handle sending infrastructure and sequences, Lavender improves the quality of what you send, reducing the generic AI-written email problem that kills reply rates.',
    pricing: 'Free tier; paid from $27/month',
    bestFor: 'Reps and teams that want to improve email quality alongside volume',
    categoryLink: null,
  },
]

const comparisonRows = [
  { dimension: 'Primary strength', lemlist: 'Personalization + multichannel', instantly: 'High-volume deliverability', apollo: 'All-in-one prospecting', lavender: 'Email quality coaching' },
  { dimension: 'Starting price', lemlist: '$55/mo', instantly: '$37/mo', apollo: 'Free tier', lavender: 'Free tier' },
  { dimension: 'Sending infrastructure', lemlist: '\u2713 Built-in', instantly: '\u2713 Best-in-class', apollo: '\u2713 Included', lavender: 'Integrates with others' },
  { dimension: 'Contact database', lemlist: 'Limited', instantly: 'Via LeadFinder add-on', apollo: '\u2713 275M+ contacts', lavender: 'None' },
  { dimension: 'LinkedIn automation', lemlist: '\u2713 Native', instantly: 'None', apollo: '\u2713 Basic', lavender: 'None' },
  { dimension: 'AI personalization', lemlist: '\u2713 Icebreakers + variables', instantly: '\u2713 AI copy generation', apollo: '\u2713 AI personalization', lavender: '\u2713 Real-time coaching' },
  { dimension: 'Best for', lemlist: 'Quality-focused teams', instantly: 'High-volume agencies', apollo: 'All-in-one buyers', lavender: 'Quality improvement' },
]

const faqItems = [
  {
    q: 'What is the best AI agent for cold email in 2026?',
    a: 'It depends on your priority. lemlist is best for personalized multichannel outreach. Instantly.ai is best for high-volume sending at scale. Apollo.io is best if you need a contact database and outreach in one platform. Lavender is best for improving the quality of emails before they send. Most serious outbound teams use two of these together.',
  },
  {
    q: 'How does AI improve cold email outreach?',
    a: 'AI agents improve cold email by generating personalized icebreakers based on prospect data, optimizing send times, automating follow-up sequences, monitoring deliverability, and coaching reps on email quality in real-time. The best tools treat deliverability and personalization as separate problems requiring separate solutions.',
  },
  {
    q: 'What is the difference between lemlist and Instantly.ai?',
    a: 'lemlist focuses on personalization: custom images, videos, and LinkedIn integration for quality-first outreach. Instantly.ai focuses on volume: unlimited accounts, automated warm-up, and mass sending for scale. Both use AI for copy generation but serve different use cases. Many teams use Instantly.ai for infrastructure and lemlist for higher-touch sequences.',
  },
  {
    q: 'What reply rate can I expect from AI-powered cold email?',
    a: 'Reply rates vary significantly based on list quality, personalization depth, and deliverability. Generic AI-written sequences typically achieve 1 to 3%. Signal-personalized outreach, where AI references specific prospect data like job changes or company news, consistently achieves 5 to 15% according to data from Instantly.ai and lemlist customer studies.',
  },
  {
    q: 'What is Lavender and do I need it alongside another tool?',
    a: 'Lavender is an AI email coach that scores your cold emails in real-time and suggests improvements before you send. It integrates with Gmail, Outlook, and platforms like Salesloft and Outreach. It does not replace a sending tool. It improves what you send through one. Teams using Lavender alongside Instantly.ai or lemlist typically see measurable improvements in reply rates within weeks.',
  },
  {
    q: 'Should I use Apollo.io or Instantly.ai?',
    a: 'Use Apollo.io if you need a contact database plus sequencing in one tool, as it eliminates the need to buy a separate data provider. Use Instantly.ai if you already have prospect data and need best-in-class sending infrastructure with unlimited accounts. Many teams use Apollo.io for data and Instantly.ai for sending, treating them as complementary rather than competing tools.',
  },
  {
    q: 'How important is domain warm-up for cold email?',
    a: 'Critical. Sending from a cold domain immediately routes your emails to spam, destroying open rates before a single prospect reads your message. Both Instantly.ai and lemlist include automated warm-up that simulates real email engagement to build domain reputation. Plan for at least two weeks of warm-up before sending at volume. This step is the most commonly skipped and the most expensive mistake in cold email setup.',
  },
]

export default async function BestAIAgentsForColdEmailPage() {
  const supabase = createClient()
  const { data: salesAgents } = await supabase
    .from('agents')
    .select('id, name, slug, developer, short_description, pricing_model, editorial_rating, rating_avg, is_verified')
    .eq('is_active', true)
    .eq('primary_category', 'ai-sales-agents')
    .not('slug', 'in', '("lemlist","instantly-ai","apollo-io","lavender")')
    .order('editorial_rating', { ascending: false, nullsFirst: false })
    .limit(6)

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Best AI Agents for Cold Email Outreach (2026)',
    description: 'Lemlist, Instantly.ai, Apollo.io, and Lavender compared for cold email outreach in 2026.',
    url: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-cold-email',
    datePublished: '2026-03-26',
    dateModified: new Date().toISOString().split('T')[0],
    author: { '@type': 'Organization', name: 'The AI Agent Index' },
    publisher: { '@type': 'Organization', name: 'The AI Agent Index', url: 'https://theaiagentindex.com' },
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Best AI Agents for Cold Email Outreach 2026',
    numberOfItems: allPicks.length,
    itemListElement: allPicks.map((pick, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'SoftwareApplication',
        name: pick.name,
        description: pick.description,
        url: `https://theaiagentindex.com/agents/${pick.slug}`,
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
        <span style={{ fontSize: '0.75rem', color: '#6B7280', padding: '0.25rem 0.75rem', backgroundColor: '#F3F4F6', borderRadius: '9999px' }}>Updated July 2026</span>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '0.25rem 0.75rem', borderRadius: '9999px', border: '1px solid #BFDBFE' }}>&#x2713; Independently Reviewed</span>
      </div>

      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
        Best AI agents for cold email outreach (2026)
      </h1>

      <p style={{ fontSize: '1.0625rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '0.75rem', maxWidth: '680px' }}>
        Cold email remains one of the highest-ROI channels for B2B outbound. AI agents now handle everything from prospect research and copy generation to sending, follow-ups, and deliverability management.
      </p>
      <p style={{ fontSize: '0.9375rem', color: '#6B7280', lineHeight: 1.7, marginBottom: '1.75rem', maxWidth: '680px' }}>
        The tools that consistently outperform are those that treat deliverability infrastructure and personalization quality as separate problems. Sending infrastructure determines whether your email reaches the inbox. Personalization quality determines whether the prospect replies.
      </p>

      <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '1.75rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#0369A1', lineHeight: 1.6, margin: 0 }}>
          <strong>Quick recommendation:</strong> If personalization matters most, choose <Link href="/agents/lemlist" style={{ color: '#2563EB' }}>lemlist</Link>. If you need volume and deliverability at scale, choose <Link href="/agents/instantly-ai" style={{ color: '#2563EB' }}>Instantly.ai</Link>. If you want prospecting and outreach in one tool, choose <Link href="/agents/apollo-io" style={{ color: '#2563EB' }}>Apollo.io</Link>. Add <Link href="/agents/lavender" style={{ color: '#2563EB' }}>Lavender</Link> to any stack to improve email quality in real-time.
        </p>
      </div>

      <div style={{ borderLeft: '3px solid #2563EB', paddingLeft: '1.25rem', marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '0.375rem' }}>
          &ldquo;We switched to Instantly.ai for sending infrastructure and kept Apollo.io for data. Reply rates improved significantly within a month.&rdquo;
        </p>
        <p style={{ fontSize: '0.8125rem', color: '#9CA3AF', margin: 0 }}>Source: G2 reviewer, Sales Manager, B2B software company</p>
      </div>

      {/* Picks */}
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '1.5rem', marginBottom: '3rem' }}>
        {picks.map((pick) => (
          <div key={pick.slug} style={{ backgroundColor: 'white', border: pick.rank === 1 ? '2px solid #2563EB' : '1px solid #E5E7EB', borderRadius: '0.875rem', padding: '1.5rem', position: 'relative' as const }}>
            {pick.rank === 1 && (
              <div style={{ position: 'absolute' as const, top: '-12px', left: '1.25rem', backgroundColor: '#2563EB', color: 'white', fontSize: '0.6875rem', fontWeight: 700, padding: '0.2rem 0.75rem', borderRadius: '9999px', letterSpacing: '0.05em' }}>TOP PICK</div>
            )}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.75rem' }}>
              <div>
                <span style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827' }}>{pick.rank}. {pick.name}</span>
                <span style={{ marginLeft: '0.75rem', fontSize: '0.75rem', fontWeight: 600, color: pick.tagColor, backgroundColor: pick.tagBg, padding: '0.2rem 0.625rem', borderRadius: '9999px' }}>{pick.tag}</span>
              </div>
              <span style={{ fontSize: '0.8125rem', color: '#6B7280', flexShrink: 0 }}>{pick.pricing}</span>
            </div>
            <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '0.75rem' }}>{pick.description}</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Best for: {pick.bestFor}</span>
              <Link href={'/agents/' + pick.slug} style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2563EB', textDecoration: 'none' }}>View listing &#x2192;</Link>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison table */}
      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }}>How they compare</h2>
      <div style={{ overflowX: 'auto' as const, marginBottom: '3rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#F9FAFB' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #E5E7EB', color: '#6B7280', fontWeight: 600, whiteSpace: 'nowrap' as const }}>Dimension</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #E5E7EB', color: '#2563EB', fontWeight: 600 }}>lemlist</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #E5E7EB', color: '#059669', fontWeight: 600 }}>Instantly.ai</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #E5E7EB', color: '#7C3AED', fontWeight: 600 }}>Apollo.io</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #E5E7EB', color: '#D97706', fontWeight: 600 }}>Lavender</th>
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

      {/* More from the index */}
      {salesAgents && salesAgents.length > 0 && (
        <>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }}>More cold email and outbound agents</h2>
          <p style={{ fontSize: '0.9375rem', color: '#6B7280', marginBottom: '1.25rem', lineHeight: 1.6 }}>
            Beyond the top four picks, the index includes several other agents worth evaluating for specific outbound use cases, from autonomous SDRs to specialized enrichment and sequencing tools.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
            {salesAgents.map((agent) => (
              <Link key={agent.slug} href={'/agents/' + agent.slug}
                style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: '1px solid #E5E7EB', padding: '1.25rem', textDecoration: 'none', display: 'block' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#111827' }}>{agent.name}</span>
                  {agent.is_verified && <span style={{ fontSize: '0.625rem', fontWeight: 700, backgroundColor: '#DCFCE7', color: '#16A34A', padding: '0.1rem 0.4rem', borderRadius: '9999px', textTransform: 'uppercase' as const }}>Verified</span>}
                </div>
                <p style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '0.5rem' }}>by {agent.developer}</p>
                <p style={{ fontSize: '0.8125rem', color: '#4B5563', lineHeight: 1.55, marginBottom: '0.75rem' }}>{agent.short_description}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.75rem', color: '#6B7280', backgroundColor: '#F3F4F6', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', textTransform: 'capitalize' as const }}>{agent.pricing_model}</span>
                  <span style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 500 }}>View &#x2192;</span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* FAQs */}
      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>Frequently asked questions</h2>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '1rem', marginBottom: '2.5rem' }}>
        {faqItems.map(({ q, a }) => (
          <div key={q} style={{ backgroundColor: '#F9FAFB', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1.25rem' }}>
            <p style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.5rem' }}>{q}</p>
            <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.65, margin: 0 }}>{a}</p>
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
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>lemlist vs Instantly.ai</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Full comparison &#x2192;</p>
        </Link>
        <Link href="/resources/guides/best-ai-agents-for-outbound-sales" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Best outbound sales agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Full guide &#x2192;</p>
        </Link>
        <Link href="/stacks/full-outbound-sales-stack" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Full outbound sales stack</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Apollo.io + Instantly.ai + lemlist &#x2192;</p>
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