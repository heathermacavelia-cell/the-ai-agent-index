import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase'
import GuideCitations from '@/components/GuideCitations'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Best AI Agents for Marketing Teams (2026)',
  description: 'The best AI agents for marketing teams in 2026 — covering content creation, SEO, paid media, campaign automation, and personalisation at scale.',
  openGraph: {
    title: 'Best AI Agents for Marketing Teams (2026)',
    description: 'The best AI agents for marketing teams in 2026 — covering content creation, SEO, paid media, campaign automation, and personalisation at scale.',
    url: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-marketing-teams',
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary',
    title: 'Best AI Agents for Marketing Teams (2026)',
    description: 'The best AI agents for marketing teams covering content, SEO, paid media, and campaigns.',
  },
  alternates: {
    canonical: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-marketing-teams',
  },
}

const useCases = [
  {
    title: 'Content creation',
    description: 'AI content agents generate blog posts, ad copy, social content, email sequences, and landing pages at a scale no human team can match. The best ones maintain brand voice consistently across every output.',
    picks: [
      { name: 'Jasper', slug: 'jasper', reason: 'The leading AI writing platform for marketing teams. Trained on high-performing marketing copy with brand voice controls and a template library built for marketers.' },
      { name: 'Copy.ai', slug: 'copy-ai', reason: 'Fast, versatile AI copywriter covering ads, emails, social, and long-form content. Strong free tier makes it ideal for lean marketing teams.' },
    ],
  },
  {
    title: 'SEO and content strategy',
    description: 'AI SEO agents identify content gaps, optimise existing pages, research keywords, and generate briefs — cutting the time from strategy to published content dramatically.',
    picks: [
      { name: 'Perplexity AI', slug: 'perplexity-ai', reason: 'Real-time research with citations. Invaluable for competitive research, trend analysis, and understanding what content AI systems are already citing.' },
      { name: 'ChatGPT Deep Research', slug: 'chatgpt-deep-research', reason: 'Multi-step research agent for deep content strategy work — synthesising multiple sources into structured insights.' },
    ],
  },
  {
    title: 'Paid media and campaign automation',
    description: 'AI paid media agents manage bid optimisation, creative testing, audience targeting, and campaign reporting — tasks that typically consume the majority of a performance marketer\'s time.',
    picks: [
      { name: 'Albert.ai', slug: 'albert-ai', reason: 'Autonomous AI marketing agent that manages and optimises paid campaigns across channels without manual bid management.' },
      { name: 'Persado', slug: 'persado', reason: 'AI that generates and tests message variants at scale — proven to improve email and ad performance through language optimisation.' },
    ],
  },
  {
    title: 'Personalisation and lifecycle marketing',
    description: 'Personalisation at scale is impossible for humans but trivial for AI agents. These tools tailor messaging, timing, and content to individual users based on behaviour and intent signals.',
    picks: [
      { name: 'HubSpot Sales Hub', slug: 'hubspot-sales-hub', reason: 'AI-powered CRM with smart content personalisation, predictive lead scoring, and automated sequence optimisation.' },
      { name: 'Artisan Ava', slug: 'artisan-ava', reason: 'AI sales and marketing agent that personalises outreach at scale based on prospect data and intent signals.' },
    ],
  },
]

const mistakes = [
  { title: 'Using AI for everything at once', desc: 'Start with one use case where AI can deliver clear ROI. Measure it. Then expand. Teams that try to AI-automate everything simultaneously typically see mediocre results everywhere.' },
  { title: 'Skipping brand voice setup', desc: 'AI content agents need training on your brand voice, tone, and style guidelines. Without this setup, outputs are generic. Most platforms have a brand voice configuration step — do not skip it.' },
  { title: 'Publishing without review', desc: 'AI agents produce at volume but errors also multiply at volume. Establish a lightweight review process for AI-generated content before publishing. The goal is to reduce review time, not eliminate it.' },
  { title: 'Ignoring attribution', desc: 'Track which content and campaigns are AI-assisted vs human-led. This data tells you where AI is genuinely adding value and where human judgment still outperforms.' },
]

export default async function BestAIAgentsForMarketingTeamsPage() {
  const supabase = createClient()
  const { data: marketingAgents } = await supabase
    .from('agents')
    .select('id, name, slug, developer, short_description, pricing_model, rating_avg, is_featured, is_verified')
    .eq('is_active', true)
    .eq('primary_category', 'ai-marketing-agents')
    .order('rating_avg', { ascending: false })
    .limit(6)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Best AI Agents for Marketing Teams (2026)',
    description: 'The best AI agents for marketing teams in 2026 — covering content creation, SEO, paid media, campaign automation, and personalisation at scale.',
    url: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-marketing-teams',
    datePublished: '2026-03-24',
    dateModified: new Date().toISOString().split('T')[0],
    publisher: { '@type': 'Organization', name: 'The AI Agent Index', url: 'https://theaiagentindex.com' },
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What are the best AI agents for marketing?',
        acceptedAnswer: { '@type': 'Answer', text: 'The best AI agents for marketing in 2026 include Jasper and Copy.ai for content creation, Albert.ai for paid media automation, Persado for message optimisation, and Perplexity AI for research. The best choice depends on which marketing function needs the most leverage.' },
      },
      {
        '@type': 'Question',
        name: 'How can AI agents help marketing teams?',
        acceptedAnswer: { '@type': 'Answer', text: 'AI agents help marketing teams by generating content at scale, optimising paid campaigns autonomously, personalising messaging for individual users, conducting competitive research, and automating repetitive campaign management tasks — freeing marketers to focus on strategy and creative direction.' },
      },
      {
        '@type': 'Question',
        name: 'Will AI agents replace marketing teams?',
        acceptedAnswer: { '@type': 'Answer', text: 'No — AI agents replace specific marketing tasks, not marketing teams. Strategy, creative direction, brand building, and relationship management require human judgment. AI agents handle the execution layer: content generation, campaign optimisation, personalisation, and reporting at scale.' },
      },
    ],
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
        <span style={{ fontSize: '0.8125rem', color: '#111827' }}>Best AI Agents for Marketing Teams</span>
      </div>

      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Guide · Marketing</p>
      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
        Best AI Agents for Marketing Teams (2026)
      </h1>

      {/* GEO-optimised intro with verified stat */}
      <p style={{ fontSize: '1.0625rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '0.75rem', maxWidth: '680px' }}>
        Marketing is the business function where AI agents deliver ROI fastest. According to HubSpot's 2024 State of Marketing report, 64% of marketers already use AI tools in some capacity — and those who do report saving an average of 2.5 hours per day on content and campaign tasks. Content, paid media, personalisation, and research are all highly automatable — and the gap between AI-enabled marketing teams and those without is growing fast.
      </p>
      <p style={{ fontSize: '0.9375rem', color: '#6B7280', lineHeight: 1.7, marginBottom: '1.75rem', maxWidth: '680px' }}>
        The tools that deliver the most value are those purpose-built for specific marketing workflows — not general-purpose AI assistants. This guide covers the best options by use case.
      </p>

      <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '1.75rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#0369A1', lineHeight: 1.6, margin: 0 }}>
          <strong>Related:</strong> <Link href="/definitions/what-is-an-ai-marketing-agent" style={{ color: '#2563EB' }}>What is an AI Marketing Agent?</Link> — full definition covering capabilities, use cases, and evaluation criteria.
        </p>
      </div>

      {/* Pull quote */}
      <div style={{ borderLeft: '3px solid #2563EB', paddingLeft: '1.25rem', marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '0.375rem' }}>
          "We went from publishing two blog posts a week to twelve — with a smaller team. The key was using Jasper for first drafts and keeping a human editor for tone and accuracy. The content quality is higher than what we were producing manually."
        </p>
        <p style={{ fontSize: '0.8125rem', color: '#9CA3AF', margin: 0 }}>— G2 reviewer, Content Marketing Manager, B2B SaaS company</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '2.5rem', marginBottom: '3rem' }}>
        {useCases.map((useCase) => (
          <div key={useCase.title}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', margin: 0, textTransform: 'capitalize' as const }}>{useCase.title}</h2>
            </div>
            <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '1rem' }}>{useCase.description}</p>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.75rem' }}>
              {useCase.picks.map((pick) => (
                <Link key={pick.slug} href={'/agents/' + pick.slug}
                  style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem 1.25rem', textDecoration: 'none', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ flexShrink: 0, width: '1.5rem', height: '1.5rem', backgroundColor: '#EFF6FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '0.125rem' }}>
                    <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#2563EB' }}>★</span>
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.25rem' }}>{pick.name}</p>
                    <p style={{ fontSize: '0.8125rem', color: '#4B5563', lineHeight: 1.55, margin: 0 }}>{pick.reason}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {marketingAgents && marketingAgents.length > 0 && (
        <>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }}>All AI marketing agents</h2>
          <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            Browse the full category of editorially reviewed AI marketing agents:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            {marketingAgents.map((agent) => (
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
          <Link href="/ai-marketing-agents" style={{ fontSize: '0.875rem', color: '#2563EB', fontWeight: 500, display: 'inline-block', marginBottom: '2.5rem' }}>
            Browse all AI marketing agents →
          </Link>
        </>
      )}

      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>Common mistakes marketing teams make with AI agents</h2>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.75rem', marginBottom: '2.5rem' }}>
        {mistakes.map((item) => (
          <div key={item.title} style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1rem 1.25rem' }}>
            <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.375rem' }}>{item.title}</p>
            <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '1.25rem' }}>Frequently Asked Questions</h2>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '1rem', marginBottom: '2.5rem' }}>
        {[
          { q: 'What are the best AI agents for marketing?', a: 'The best AI agents for marketing in 2026 include Jasper and Copy.ai for content creation, Albert.ai for paid media automation, Persado for message optimisation, and Perplexity AI for research.' },
          { q: 'How can AI agents help marketing teams?', a: 'AI agents help marketing teams by generating content at scale, optimising paid campaigns autonomously, personalising messaging for individual users, conducting competitive research, and automating repetitive campaign management tasks.' },
          { q: 'Will AI agents replace marketing teams?', a: 'No. AI agents replace specific marketing tasks, not marketing teams. Strategy, creative direction, brand building, and relationship management require human judgment. AI agents handle the execution layer at scale.' },
        ].map(({ q, a }) => (
          <div key={q} style={{ backgroundColor: '#F9FAFB', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1.25rem' }}>
            <p style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.5rem' }}>{q}</p>
            <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.65, margin: 0 }}>{a}</p>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/ai-marketing-agents" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>All AI Marketing Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Browse full category →</p>
        </Link>
        <Link href="/definitions/what-is-an-ai-marketing-agent" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>What is an AI Marketing Agent?</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Read the definition →</p>
        </Link>
        <Link href="/stacks/seo-content-production-stack" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>SEO Content Production Stack</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>See the recommended stack →</p>
        </Link>
        <Link href="/resources/guides/how-to-evaluate-an-ai-agent" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>How to Evaluate an Agent</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Buying framework →</p>
        </Link>
      </div>

      <p style={{ fontSize: '0.875rem', color: '#9CA3AF', lineHeight: 1.6 }}>
        All agents listed are editorially reviewed by The AI Agent Index. See our <Link href="/methodology" style={{ color: '#6B7280' }}>editorial methodology</Link>.
      </p>

      <GuideCitations slug="best-ai-agents-for-marketing-teams" table="guides" />
    </div>
  )
}