import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Best AI Research Agents (2026)',
  description: 'The best AI research agents in 2026 — covering web research, academic literature review, competitive intelligence, and structured report generation.',
  openGraph: {
    title: 'Best AI Research Agents (2026)',
    description: 'The best AI research agents in 2026 — covering web research, academic literature review, competitive intelligence, and structured report generation.',
    url: 'https://theaiagentindex.com/resources/guides/best-ai-research-agents',
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary',
    title: 'Best AI Research Agents (2026)',
    description: 'The best AI research agents for web research, literature review, and competitive intelligence.',
  },
  alternates: {
    canonical: 'https://theaiagentindex.com/resources/guides/best-ai-research-agents',
  },
}

const picks = [
  {
    name: 'Perplexity AI',
    slug: 'perplexity-ai',
    tier: '#1',
    category: 'Web research',
    desc: 'The best general-purpose AI research agent in 2026. Perplexity searches the web in real time, synthesises multiple sources, and provides inline citations for every claim. Faster and more accurate than manual Google research for most tasks. The Pro tier unlocks deeper research with more sources and longer outputs.',
    bestFor: 'Real-time research on any topic with source citations',
  },
  {
    name: 'ChatGPT Deep Research',
    slug: 'chatgpt-deep-research',
    tier: '#2',
    category: 'Deep research',
    desc: 'OpenAI deep research mode conducts multi-step investigations — forming hypotheses, searching extensively, and producing long-form structured reports. Particularly strong for business research, market analysis, and topics requiring synthesis across many sources. Takes longer than Perplexity but produces more comprehensive outputs.',
    bestFor: 'Comprehensive reports requiring synthesis of many sources',
  },
  {
    name: 'Elicit',
    slug: 'elicit',
    tier: '#3',
    category: 'Academic research',
    desc: 'Purpose-built for academic and scientific research. Elicit searches 125M+ research papers, extracts key findings, and performs systematic literature reviews. Essential for researchers, analysts, and anyone who needs to understand the academic evidence base on a topic quickly and accurately.',
    bestFor: 'Literature reviews and academic evidence synthesis',
  },
  {
    name: 'Consensus',
    slug: 'consensus',
    tier: '#4',
    category: 'Academic research',
    desc: 'AI-powered academic search that surfaces the scientific consensus on any question. Consensus searches peer-reviewed papers and gives you a percentage of studies supporting or opposing a claim. Ideal for evidence-based decision making and validating assumptions with scientific literature.',
    bestFor: 'Understanding scientific consensus on specific questions',
  },
  {
    name: 'Gong',
    slug: 'gong',
    tier: '#5',
    category: 'Market intelligence',
    desc: 'AI research agent for sales and revenue intelligence. Gong analyses customer conversations at scale to surface competitive intelligence, objection patterns, and market signals from your own customer interactions — research you cannot get anywhere else.',
    bestFor: 'Competitive intelligence from customer conversations',
  },
]

const useCases = [
  { title: 'Market research', desc: 'Use Perplexity or ChatGPT Deep Research to analyse market size, competitive landscape, trends, and customer behaviour. What used to take an analyst days now takes an hour.' },
  { title: 'Academic literature review', desc: 'Use Elicit or Consensus to search thousands of papers on a topic, extract key findings, and identify the current scientific consensus — without reading every paper manually.' },
  { title: 'Competitive intelligence', desc: 'Use Perplexity for real-time competitor monitoring. Use Gong to analyse what customers say about competitors in your own sales calls. Combine both for a complete competitive picture.' },
  { title: 'Investment research', desc: 'Use ChatGPT Deep Research or Perplexity to analyse companies, industries, and trends before making investment decisions. AI research agents surface information that would take days to compile manually.' },
  { title: 'Due diligence', desc: 'Use AI research agents to accelerate due diligence on companies, technologies, and people. They surface public information faster than manual research, freeing humans to focus on interpretation and judgment.' },
]

export default async function BestAIResearchAgentsPage() {
  const supabase = createClient()
  const { data: researchAgents } = await supabase
    .from('agents')
    .select('id, name, slug, developer, short_description, pricing_model, rating_avg, is_featured, is_verified')
    .eq('is_active', true)
    .eq('primary_category', 'ai-research-agents')
    .order('rating_avg', { ascending: false })
    .limit(6)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Best AI Research Agents (2026)',
    description: 'The best AI research agents in 2026 — covering web research, academic literature review, competitive intelligence, and structured report generation.',
    url: 'https://theaiagentindex.com/resources/guides/best-ai-research-agents',
    datePublished: '2026-03-24',
    dateModified: '2026-03-24',
    publisher: {
      '@type': 'Organization',
      name: 'The AI Agent Index',
      url: 'https://theaiagentindex.com',
    },
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What are the best AI research agents?',
        acceptedAnswer: { '@type': 'Answer', text: 'The best AI research agents in 2026 are Perplexity AI (best for real-time web research), ChatGPT Deep Research (best for comprehensive reports), Elicit (best for academic literature review), and Consensus (best for scientific consensus questions).' },
      },
      {
        '@type': 'Question',
        name: 'How do AI research agents work?',
        acceptedAnswer: { '@type': 'Answer', text: 'AI research agents combine web search or database access with large language model reasoning to find, evaluate, and synthesise information autonomously. They conduct multi-step research — forming hypotheses, searching for evidence, evaluating source quality, and producing structured outputs with citations.' },
      },
      {
        '@type': 'Question',
        name: 'Can AI research agents replace human researchers?',
        acceptedAnswer: { '@type': 'Answer', text: 'AI research agents dramatically accelerate information gathering and synthesis — tasks that previously took days now take hours or minutes. However, interpretation, judgment, and original insight still require human researchers. The best research combines AI speed with human expertise.' },
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
        <span style={{ fontSize: '0.8125rem', color: '#111827' }}>Best AI Research Agents</span>
      </div>

      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Guide · Research</p>
      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
        Best AI Research Agents (2026)
      </h1>
      <p style={{ fontSize: '1.0625rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '680px' }}>
        AI research agents can now conduct multi-step investigations, search thousands of sources, and produce structured reports in minutes — work that previously took researchers hours or days. This guide covers the best options and when to use each.
      </p>

      <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#0369A1', lineHeight: 1.6, margin: 0 }}>
          <strong>Related:</strong> <Link href="/definitions/what-is-an-ai-research-agent" style={{ color: '#2563EB' }}>What is an AI Research Agent?</Link> — full definition covering capabilities, use cases, and evaluation criteria.
        </p>
      </div>

      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '1.25rem' }}>Top AI research agents ranked</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
        {picks.map((pick) => (
          <Link key={pick.slug} href={'/agents/' + pick.slug}
            style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: '1px solid #E5E7EB', padding: '1.25rem', textDecoration: 'none', display: 'block' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.2rem 0.5rem', borderRadius: '9999px' }}>{pick.tier}</span>
              <span style={{ fontWeight: 700, fontSize: '1rem', color: '#111827' }}>{pick.name}</span>
              <span style={{ fontSize: '0.7rem', color: '#6B7280', backgroundColor: '#F3F4F6', padding: '0.2rem 0.5rem', borderRadius: '9999px' }}>{pick.category}</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.6, marginBottom: '0.5rem' }}>{pick.desc}</p>
            <p style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 500, margin: 0 }}>Best for: {pick.bestFor}</p>
          </Link>
        ))}
      </div>

      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>Use cases by research type</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem' }}>
        {useCases.map((item) => (
          <div key={item.title} style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1rem 1.25rem', display: 'flex', gap: '1rem' }}>
            <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#2563EB', flexShrink: 0, minWidth: '140px' }}>{item.title}</span>
            <span style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.6 }}>{item.desc}</span>
          </div>
        ))}
      </div>

      {researchAgents && researchAgents.length > 0 && (
        <>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }}>All AI research agents</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            {researchAgents.map((agent) => (
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
          <Link href="/ai-research-agents" style={{ fontSize: '0.875rem', color: '#2563EB', fontWeight: 500, display: 'inline-block', marginBottom: '2.5rem' }}>
            Browse all AI research agents →
          </Link>
        </>
      )}

      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '1.25rem' }}>Frequently Asked Questions</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
        {[
          { q: 'What are the best AI research agents?', a: 'The best AI research agents in 2026 are Perplexity AI for real-time web research, ChatGPT Deep Research for comprehensive reports, Elicit for academic literature review, and Consensus for scientific consensus questions.' },
          { q: 'How do AI research agents work?', a: 'AI research agents combine web search or database access with large language model reasoning to find, evaluate, and synthesise information autonomously. They conduct multi-step research and produce structured outputs with citations.' },
          { q: 'Can AI research agents replace human researchers?', a: 'AI research agents dramatically accelerate information gathering and synthesis. However, interpretation, judgment, and original insight still require human researchers. The best research combines AI speed with human expertise.' },
        ].map(({ q, a }) => (
          <div key={q} style={{ backgroundColor: '#F9FAFB', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1.25rem' }}>
            <p style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.5rem' }}>{q}</p>
            <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.65, margin: 0 }}>{a}</p>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        <Link href="/ai-research-agents" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>All AI Research Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Browse full category →</p>
        </Link>
        <Link href="/definitions/what-is-an-ai-research-agent" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>What is an AI Research Agent?</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Read the definition →</p>
        </Link>
        <Link href="/resources/guides/how-to-evaluate-an-ai-agent" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>How to Evaluate an Agent</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Buying framework →</p>
        </Link>
      </div>
    </div>
  )
}