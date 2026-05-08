import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase'
import GuideCitations from '@/components/GuideCitations'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Best AI Agents for Cold Email Outreach (2026)',
  description: 'Lemlist, Instantly.ai, Apollo.io, and Lavender compared for cold email — deliverability, personalisation quality, reply rates, and pricing. Independent review.',
  openGraph: {
    title: 'Best AI Agents for Cold Email Outreach (2026)',
    description: 'Lemlist, Instantly.ai, Apollo.io, and Lavender compared for cold email — deliverability, personalisation, reply rates, and pricing.',
    url: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-cold-email',
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary',
    title: 'Best AI Agents for Cold Email Outreach (2026)',
    description: 'Lemlist, Instantly.ai, Apollo.io, and Lavender compared for cold email outreach in 2026.',
  },
  alternates: {
    canonical: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-cold-email',
  },
}

const picks = [
  {
    rank: 1,
    name: 'Lemlist',
    slug: 'lemlist',
    tag: 'Best for personalisation',
    tagColor: '#2563EB',
    tagBg: '#EFF6FF',
    description: 'Lemlist is built around personalised cold email at scale. It uses AI to generate custom icebreakers, embed dynamic images and videos, and build multichannel sequences combining email and LinkedIn. Its deliverability tools and CRM integrations make it the top choice for teams that prioritise quality over volume.',
    pricing: 'From $55/month',
    bestFor: 'Teams sending personalised, multichannel sequences',
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
  },
  {
    rank: 3,
    name: 'Apollo.io',
    slug: 'apollo-io',
    tag: 'Best all-in-one',
    tagColor: '#7C3AED',
    tagBg: '#F5F3FF',
    description: 'Apollo.io combines a B2B contact database of 275 million contacts with built-in email sequencing and AI personalisation. It is the best option if you need prospecting and outreach in a single platform without stitching together multiple tools. Free tier available.',
    pricing: 'Free tier; paid from $49/month',
    bestFor: 'Teams that need prospecting and outreach in one platform',
  },
  {
    rank: 4,
    name: 'Lavender',
    slug: 'lavender',
    tag: 'Best for email quality',
    tagColor: '#D97706',
    tagBg: '#FFFBEB',
    description: 'Lavender is an AI email coach that integrates directly with your inbox and cold email tools, scoring your emails in real-time and suggesting improvements before you send. Where Instantly and Lemlist handle sending infrastructure and sequences, Lavender improves the quality of what you send — reducing the generic AI-written email problem that kills reply rates.',
    pricing: 'Free tier; paid from $27/month',
    bestFor: 'Reps and teams that want to improve email quality alongside volume',
  },
]

const comparisonRows = [
  { dimension: 'Primary strength', lemlist: 'Personalisation + multichannel', instantly: 'High-volume deliverability', apollo: 'All-in-one prospecting', lavender: 'Email quality coaching' },
  { dimension: 'Starting price', lemlist: '$55/mo', instantly: '$37/mo', apollo: 'Free tier', lavender: 'Free tier' },
  { dimension: 'Sending infrastructure', lemlist: '✓ Built-in', instantly: '✓ Best-in-class', apollo: '✓ Included', lavender: '— (integrates with others)' },
  { dimension: 'Contact database', lemlist: 'Limited', instantly: 'Via LeadFinder add-on', apollo: '✓ 275M+ contacts', lavender: '—' },
  { dimension: 'LinkedIn automation', lemlist: '✓ Native', instantly: '—', apollo: '✓ Basic', lavender: '—' },
  { dimension: 'AI personalisation', lemlist: '✓ Icebreakers + variables', instantly: '✓ AI copy generation', apollo: '✓ AI personalisation', lavender: '✓ Real-time coaching' },
  { dimension: 'Best for', lemlist: 'Quality-focused teams', instantly: 'High-volume agencies', apollo: 'All-in-one buyers', lavender: 'Quality improvement' },
]

const faqs = [
  {
    q: 'What is the best AI agent for cold email in 2026?',
    a: 'It depends on your priority. Lemlist is best for personalised multichannel outreach. Instantly.ai is best for high-volume sending at scale. Apollo.io is best if you need a contact database and outreach in one platform. Lavender is best for improving the quality of emails before they send. Most serious outbound teams use two of these together.',
  },
  {
    q: 'How does AI improve cold email outreach?',
    a: 'AI agents improve cold email by generating personalised icebreakers based on prospect data, optimising send times, automating follow-up sequences, monitoring deliverability, and coaching reps on email quality in real-time. The best tools treat deliverability and personalisation as separate problems requiring separate solutions.',
  },
  {
    q: 'What is the difference between Lemlist and Instantly.ai?',
    a: 'Lemlist focuses on personalisation — custom images, videos, and LinkedIn integration for quality-first outreach. Instantly.ai focuses on volume — unlimited accounts, automated warm-up, and mass sending for scale. Both use AI for copy generation but serve different use cases. Many teams use Instantly for infrastructure and Lemlist for higher-touch sequences.',
  },
  {
    q: 'What reply rate can I expect from AI-powered cold email?',
    a: 'Reply rates vary significantly based on list quality, personalisation depth, and deliverability. Generic AI-written sequences typically achieve 1–3%. Signal-personalised outreach — where AI references specific prospect data like job changes or company news — consistently achieves 5–15% according to data from Instantly and Lemlist customer studies.',
  },
  {
    q: 'What is Lavender and do I need it alongside another tool?',
    a: 'Lavender is an AI email coach that scores your cold emails in real-time and suggests improvements before you send. It integrates with Gmail, Outlook, and platforms like Salesloft and Outreach. It does not replace a sending tool — it improves what you send through one. Teams using Lavender alongside Instantly or Lemlist typically see measurable improvements in reply rates within weeks.',
  },
  {
    q: 'Should I use Apollo.io or Instantly.ai?',
    a: 'Use Apollo.io if you need a contact database plus sequencing in one tool — it eliminates the need to buy a separate data provider. Use Instantly.ai if you already have prospect data and need best-in-class sending infrastructure with unlimited accounts. Many teams use Apollo for data and Instantly for sending, treating them as complementary rather than competing tools.',
  },
  {
    q: 'How important is domain warm-up for cold email?',
    a: 'Critical. Sending from a cold domain immediately routes your emails to spam, destroying open rates before a single prospect reads your message. Both Instantly.ai and Lemlist include automated warm-up that simulates real email engagement to build domain reputation. Plan for at least two weeks of warm-up before sending at volume — this step is the most commonly skipped and the most expensive mistake in cold email setup.',
  },
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: { '@type': 'Answer', text: faq.a },
  })),
}

export default async function BestAIAgentsForColdEmailPage() {
  const supabase = createClient()
  const { data: salesAgents } = await supabase
    .from('agents')
    .select('id, name, slug, developer, short_description, pricing_model, rating_avg, is_verified')
    .eq('is_active', true)
    .eq('primary_category', 'ai-sales-agents')
    .not('slug', 'in', '("lemlist","instantly-ai","apollo-io","lavender")')
    .order('rating_avg', { ascending: false })
    .limit(6)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Best AI Agents for Cold Email Outreach (2026)',
    description: 'Lemlist, Instantly.ai, Apollo.io, and Lavender compared for cold email outreach in 2026.',
    url: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-cold-email',
    datePublished: '2026-03-26',
    dateModified: new Date().toISOString().split('T')[0],
    publisher: {
      '@type': 'Organization',
      name: 'The AI Agent Index',
      url: 'https://theaiagentindex.com',
    },
  }

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div style={{ marginBottom: '0.75rem' }}>
        <Link href="/" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none' }}>Home</Link>
        <span style={{ color: '#D1D5DB', margin: '0 0.5rem' }}>/</span>
        <Link href="/resources/guides" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none' }}>Guides</Link>
        <span style={{ color: '#D1D5DB', margin: '0 0.5rem' }}>/</span>
        <span style={{ fontSize: '0.8125rem', color: '#111827' }}>Best AI Agents for Cold Email</span>
      </div>

      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Guide: Sales Outreach</p>
      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
        Best AI Agents for Cold Email Outreach (2026)
      </h1>

      <p style={{ fontSize: '1.0625rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '0.75rem', maxWidth: '680px' }}>
        Cold email remains one of the highest-ROI channels for B2B outbound. According to HubSpot&apos;s 2025 State of Sales report, AI-assisted email outreach is now used by 43% of sales professionals — up from 24% in 2023. AI agents now handle everything from prospect research and copy generation to sending, follow-ups, and deliverability management.
      </p>
      <p style={{ fontSize: '0.9375rem', color: '#6B7280', lineHeight: 1.7, marginBottom: '1.75rem', maxWidth: '680px' }}>
        The tools that consistently outperform are those that treat deliverability infrastructure and personalisation quality as separate problems. Sending infrastructure determines whether your email reaches the inbox. Personalisation quality determines whether the prospect replies.
      </p>

      <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '1.75rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#0369A1', lineHeight: 1.6, margin: 0 }}>
          <strong>Quick recommendation:</strong> If personalisation matters most, choose <Link href="/agents/lemlist" style={{ color: '#2563EB' }}>Lemlist</Link>. If you need volume and deliverability at scale, choose <Link href="/agents/instantly-ai" style={{ color: '#2563EB' }}>Instantly.ai</Link>. If you want prospecting and outreach in one tool, choose <Link href="/agents/apollo-io" style={{ color: '#2563EB' }}>Apollo.io</Link>. Add <Link href="/agents/lavender" style={{ color: '#2563EB' }}>Lavender</Link> to any stack to improve email quality in real-time.
        </p>
      </div>

      <div style={{ borderLeft: '3px solid #2563EB', paddingLeft: '1.25rem', marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '0.375rem' }}>
          &ldquo;Deliverability is the one thing that kills cold email programs before they start. We switched to Instantly for sending infrastructure and kept Apollo for data — reply rates went from 0.8% to 4.2% within a month.&rdquo;
        </p>
        <p style={{ fontSize: '0.8125rem', color: '#9CA3AF', margin: 0 }}>— G2 reviewer, Sales Manager, B2B software company</p>
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
              <Link href={'/agents/' + pick.slug} style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2563EB', textDecoration: 'none' }}>View listing →</Link>
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
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #E5E7EB', color: '#2563EB', fontWeight: 600 }}>Lemlist</th>
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
            Beyond the top four picks, the index includes several other agents worth evaluating for specific outbound use cases — from autonomous SDRs to specialised enrichment and sequencing tools.
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
                  <span style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 500 }}>View →</span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

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
        <Link href="/compare/lemlist-vs-instantly-ai" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Lemlist vs Instantly.ai</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Full comparison →</p>
        </Link>
        <Link href="/resources/guides/best-ai-agents-for-outbound-sales" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Best Outbound Sales Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Full guide →</p>
        </Link>
        <Link href="/stacks/full-outbound-sales-stack" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Full Outbound Sales Stack</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Apollo + Instantly + Lemlist →</p>
        </Link>
        <Link href="/resources/guides/how-to-automate-sales-outreach" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Automate Sales Outreach</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Step-by-step guide →</p>
        </Link>
        <Link href="/integrations/gmail" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Gmail integrations</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Filter by integration →</p>
        </Link>
      </div>

      <p style={{ fontSize: '0.875rem', color: '#9CA3AF', lineHeight: 1.6 }}>
        All agents listed are editorially reviewed by The AI Agent Index. See our <Link href="/methodology" style={{ color: '#6B7280' }}>editorial methodology</Link>.
      </p>

      <GuideCitations slug="best-ai-agents-for-cold-email" table="guides" />
    </div>
  )
}