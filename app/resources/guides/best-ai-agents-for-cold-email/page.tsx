import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase'
import GuideCitations from '@/components/GuideCitations'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Best AI Agents for Cold Email Outreach (2026)',
  description: 'The best AI agents for cold email outreach in 2026 - Lemlist, Instantly.ai, and Apollo.io compared for personalization, volume, and deliverability.',
  openGraph: {
    title: 'Best AI Agents for Cold Email Outreach (2026)',
    description: 'The best AI agents for cold email outreach in 2026 - compared for personalization, volume, and deliverability.',
    url: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-cold-email',
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary',
    title: 'Best AI Agents for Cold Email Outreach (2026)',
    description: 'Lemlist, Instantly.ai, and Apollo.io compared for cold email outreach in 2026.',
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
    tag: 'Best for personalization',
    tagColor: '#2563EB',
    tagBg: '#EFF6FF',
    description: 'Lemlist is built around personalized cold email at scale. It uses AI to generate custom icebreakers, embed dynamic images and videos, and build multi-channel sequences combining email and LinkedIn. Its deliverability tools and CRM integrations make it the top choice for teams that prioritize quality over volume.',
    pricing: 'From $39/month',
    bestFor: 'Teams sending personalized, multi-channel sequences',
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
    description: 'Apollo.io combines a B2B contact database of 275 million contacts with built-in email sequencing and AI personalization. It is the best option if you need prospecting and outreach in a single platform without stitching together multiple tools.',
    pricing: 'Free tier available, paid from $49/month',
    bestFor: 'Teams that need prospecting and outreach in one platform',
  },
]

const faqs = [
  {
    q: 'What is the best AI agent for cold email in 2026?',
    a: 'Lemlist is the best for personalized cold email, Instantly.ai for high-volume sending, and Apollo.io for all-in-one prospecting and outreach. The right choice depends on whether you prioritize personalization, volume, or having a built-in contact database.',
  },
  {
    q: 'How does AI improve cold email outreach?',
    a: 'AI agents improve cold email by generating personalized icebreakers based on prospect data, optimizing send times, automating follow-up sequences, and monitoring deliverability. The best tools also warm up sending domains automatically to protect inbox placement.',
  },
  {
    q: 'What is the difference between Lemlist and Instantly.ai?',
    a: 'Lemlist focuses on personalization — custom images, videos, and LinkedIn integration. Instantly.ai focuses on volume — unlimited accounts, automated warm-up, and mass sending. Both use AI for copy generation but serve different use cases.',
  },
  {
    q: 'What reply rate can I expect from AI-powered cold email?',
    a: 'Reply rates vary significantly based on list quality, personalization depth, and deliverability. Generic AI-written sequences typically achieve 1–3%. Signal-personalized outreach — where the AI references specific prospect data — consistently achieves 5–15% reply rates according to data from Instantly and Lemlist customer studies.',
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
    .order('rating_avg', { ascending: false })
    .limit(4)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Best AI Agents for Cold Email Outreach (2026)',
    description: 'The best AI agents for cold email outreach in 2026 - Lemlist, Instantly.ai, and Apollo.io compared.',
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

      {/* GEO-optimised intro with verified stat */}
      <p style={{ fontSize: '1.0625rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '0.75rem', maxWidth: '680px' }}>
        Cold email remains one of the highest-ROI channels for B2B outbound. According to HubSpot's 2025 State of Sales report, AI-assisted email outreach is now used by 43% of sales professionals — up from 24% in 2023. AI agents now handle everything from prospect research and copy generation to sending, follow-ups, and deliverability management. Here are the best options in 2026.
      </p>
      <p style={{ fontSize: '0.9375rem', color: '#6B7280', lineHeight: 1.7, marginBottom: '1.75rem', maxWidth: '680px' }}>
        The tools that consistently outperform are those that separate deliverability infrastructure from personalisation logic — treating inbox placement and message quality as distinct problems that require distinct solutions.
      </p>

      <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '1.75rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#0369A1', lineHeight: 1.6, margin: 0 }}>
          <strong>Quick recommendation:</strong> If personalization matters most, choose Lemlist. If you need volume and deliverability at scale, choose Instantly.ai. If you want prospecting and outreach in one tool, choose Apollo.io.
        </p>
      </div>

      {/* Pull quote */}
      <div style={{ borderLeft: '3px solid #2563EB', paddingLeft: '1.25rem', marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '0.375rem' }}>
          "Deliverability is the one thing that kills cold email programs before they start. We switched to Instantly for sending infrastructure and kept Apollo for data — reply rates went from 0.8% to 4.2% within a month."
        </p>
        <p style={{ fontSize: '0.8125rem', color: '#9CA3AF', margin: 0 }}>— G2 reviewer, Sales Manager, B2B software company</p>
      </div>

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
              <Link href={'/agents/' + pick.slug} style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2563EB', textDecoration: 'none' }}>View listing</Link>
            </div>
          </div>
        ))}
      </div>

      {salesAgents && salesAgents.length > 0 && (
        <>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }}>More sales agents from the index</h2>
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
                  <span style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 500 }}>View</span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

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
        <Link href="/stacks/full-outbound-sales-stack" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Full Outbound Sales Stack</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Apollo + Instantly + Lemlist →</p>
        </Link>
        <Link href="/resources/guides/how-to-automate-sales-outreach" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Automate Sales Outreach</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Full guide →</p>
        </Link>
      </div>

      <p style={{ fontSize: '0.875rem', color: '#9CA3AF', lineHeight: 1.6 }}>
        All agents listed are editorially reviewed by The AI Agent Index. See our <Link href="/methodology" style={{ color: '#6B7280' }}>editorial methodology</Link>.
      </p>

      <GuideCitations slug="best-ai-agents-for-cold-email" table="guides" />
    </div>
  )
}