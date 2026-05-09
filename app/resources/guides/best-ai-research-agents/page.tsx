import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase'
import GuideCitations from '@/components/GuideCitations'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Best AI Research Agents (2026) | The AI Agent Index',
  description: 'The best AI research agents in 2026. Perplexity, Elicit, Consensus, and ChatGPT Deep Research compared by citation quality, source coverage, and use case fit.',
  openGraph: {
    title: 'Best AI Research Agents (2026)',
    description: 'The best AI research agents in 2026. Perplexity, Elicit, Consensus, and ChatGPT Deep Research compared by citation quality, source coverage, and use case fit.',
    url: 'https://theaiagentindex.com/resources/guides/best-ai-research-agents',
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary',
    title: 'Best AI Research Agents (2026)',
    description: 'Perplexity, Elicit, Consensus, and ChatGPT Deep Research compared for web, academic, and competitive research.',
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
    category: 'Real-time web research',
    body1: 'Perplexity is the strongest general-purpose AI research agent available for real-time web research. It searches the web as you query, synthesises multiple sources into a structured answer, and provides inline citations for every factual claim. The combination of live web access and citation transparency makes it significantly more reliable than general-purpose AI models that answer from training data alone — you can click every citation and verify the source.',
    body2: 'Perplexity is the right choice for competitive research, market background, regulatory questions, industry trends, and any research task where you need current information from verifiable sources. The free tier handles most research use cases adequately. The Pro tier unlocks more sources per query, access to more models, and longer outputs for complex research tasks. For most business research needs, Perplexity is the first tool to reach for.',
    bestFor: 'Real-time research on any topic with verifiable source citations',
  },
  {
    name: 'ChatGPT Deep Research',
    slug: 'chatgpt-deep-research',
    tier: '#2',
    category: 'Comprehensive deep research',
    body1: 'ChatGPT Deep Research is a multi-step research agent that conducts a thorough investigation of a topic rather than answering a single query. It forms research hypotheses, searches the web across many sources, follows promising leads, synthesises findings, and produces a structured long-form report with citations. The process takes longer than Perplexity — typically several minutes — but produces significantly more comprehensive output for complex topics.',
    body2: 'Deep Research is the right choice when you need a thorough analysis rather than a quick answer — a market entry assessment, a competitive landscape report, a technology deep dive, or pre-meeting research on an organisation. Requires a ChatGPT Plus or Pro subscription. The output quality varies with how well-defined your research question is: specific, bounded questions produce better results than vague open-ended prompts.',
    bestFor: 'Comprehensive structured reports requiring synthesis across many sources',
  },
  {
    name: 'Elicit',
    slug: 'elicit',
    tier: '#3',
    category: 'Academic literature research',
    body1: 'Elicit is purpose-built for academic and scientific research. It searches over 125 million research papers, extracts key findings and methodologies from relevant studies, compares results across papers, and performs systematic literature reviews at a speed that would take human researchers weeks to replicate manually. Every output is grounded in published research with direct links to source papers.',
    body2: 'Elicit is the right choice for any research task that requires understanding the academic evidence base on a topic. For clinical teams evaluating treatment evidence, policy researchers synthesising regulatory literature, R&D teams mapping prior art, or compliance analysts reviewing regulatory publications, Elicit provides a research capability that general web search tools cannot match. The academic database access and paper extraction quality is what distinguishes it from tools that merely search the open web.',
    bestFor: 'Literature reviews, systematic reviews, and academic evidence synthesis',
  },
  {
    name: 'Consensus',
    slug: 'consensus',
    tier: '#4',
    category: 'Scientific consensus research',
    body1: 'Consensus is an AI-powered academic search tool with a specific focus on surfacing the degree of scientific agreement on a given question. It searches peer-reviewed papers and provides a percentage breakdown of studies supporting, opposing, or unclear on a specific claim — which is more useful than a raw list of papers for decision-making contexts where the question is not "what does the research say" but "what does the weight of evidence support."',
    body2: 'Consensus is the right choice for evidence-based decision making in contexts where you need to validate or challenge an assumption against the scientific literature. Healthcare decision-making, policy analysis, investment due diligence on scientific claims, and product development questions with a research evidence base are all strong use cases. It complements rather than replaces Elicit — Elicit is stronger for broad literature review, Consensus is stronger for targeted consensus questions.',
    bestFor: 'Understanding the weight of scientific evidence on specific questions',
  },
  {
    name: 'Gong',
    slug: 'gong',
    tier: '#5',
    category: 'Market intelligence from conversation data',
    body1: 'Gong occupies a distinct position in research — it is the only tool on this list that produces research insights from your own customer and prospect conversations rather than from external sources. It analyses sales calls, customer success conversations, and demos at scale to surface competitive intelligence, objection patterns, pricing sensitivity signals, and emerging customer needs that no public data source can provide.',
    body2: 'Gong is the right choice for revenue-facing teams that need to understand what is actually happening in their market from the ground up — what competitors are mentioned and how, what customer concerns appear most frequently, what language drives conversion. This intelligence is proprietary to your business and more current than any market research report. It functions as a research layer on top of existing sales operations rather than a standalone research tool.',
    bestFor: 'Competitive and market intelligence from your own customer conversation data',
  },
]

const evaluationCriteria = [
  {
    title: 'Citation quality and source transparency',
    detail: 'The most important criterion for any AI research tool is whether it provides verifiable citations for every factual claim. AI models that answer from training data without citing sources produce outputs that are impossible to verify and frequently contain errors that appear confident and plausible. Any research tool used in a professional context should cite the specific source for each claim, provide a direct link to that source, and make verification straightforward. If a tool cannot show you where each piece of information came from, it is not suitable for professional research use regardless of how well-written the outputs are.',
  },
  {
    title: 'Source coverage and recency',
    detail: 'Different research tools draw from fundamentally different source pools. Perplexity and ChatGPT Deep Research access the live web, which means current information but variable source quality. Elicit and Consensus access curated academic databases — high quality but limited to published research. Gong draws from your own conversation data — proprietary but limited to what your team has discussed. Before selecting a research tool, define the source pool you need: if the answer requires current market data, web access is essential. If it requires peer-reviewed evidence, an academic database is essential.',
  },
  {
    title: 'Hallucination rate and uncertainty handling',
    detail: 'Research AI tools vary significantly in how they handle questions they cannot confidently answer. The worst tools fabricate plausible-sounding answers with false citations. Better tools surface uncertainty explicitly, note when sources conflict, and decline to answer when the evidence is insufficient. Always test a research tool against questions where you already know the correct answer before relying on it for professional research. The tools on this list were selected in part because they handle uncertainty more transparently than alternatives.',
  },
  {
    title: 'Output format and downstream usability',
    detail: 'Research tools produce outputs in different formats suited to different downstream uses. Perplexity produces conversational answers with inline citations — useful for quick lookup and synthesis. ChatGPT Deep Research produces long-form structured reports — useful for documents you need to share or act on. Elicit produces structured paper extracts with key findings pulled from each study — useful for systematic literature review workflows. Match the output format to how you will use the research rather than choosing the tool with the most impressive demo.',
  },
  {
    title: 'Cost per research task at your volume',
    detail: 'Research tool pricing varies significantly. Perplexity and Consensus have functional free tiers for moderate use. ChatGPT Deep Research requires a Plus or Pro subscription. Elicit is priced by the number of papers analysed. Gong is enterprise-priced based on seat count and usage. Before committing, model the cost per research task at your expected monthly volume. Research tools that seem affordable for occasional use can become expensive when used daily by a team.',
  },
]

const useCases = [
  {
    title: 'Market research',
    tool: 'Perplexity or ChatGPT Deep Research',
    desc: 'Use Perplexity for quick competitive and market background research with current sources. Use ChatGPT Deep Research when you need a comprehensive market analysis — size, competitive landscape, trends, regulatory environment — produced as a structured document rather than a conversational answer. What previously took an analyst several days now takes an hour.',
  },
  {
    title: 'Academic literature review',
    tool: 'Elicit or Consensus',
    desc: 'Use Elicit to search and extract from a large corpus of research papers on a topic, identify key studies, and compare findings across papers systematically. Use Consensus when your question is specifically about the degree of scientific agreement — "what percentage of studies on X find Y" — rather than a broad survey of the literature.',
  },
  {
    title: 'Competitive intelligence',
    tool: 'Perplexity + Gong',
    desc: 'Use Perplexity to monitor publicly available competitive information — product updates, pricing changes, press coverage, and positioning shifts. Use Gong to analyse what your own customers and prospects say about competitors in sales conversations, which surfaces intelligence that no public source can provide. The combination gives you both external and internal competitive signal.',
  },
  {
    title: 'Investment and due diligence research',
    tool: 'ChatGPT Deep Research',
    desc: 'Use ChatGPT Deep Research to produce comprehensive background analysis on companies, industries, management teams, and technology claims before making investment or partnership decisions. It surfaces and synthesises information across financial reports, press coverage, regulatory filings, and industry commentary — manually replicating this would take days.',
  },
  {
    title: 'Evidence-based decision making',
    tool: 'Elicit or Consensus',
    desc: 'When a business decision depends on the strength of scientific evidence — a healthcare protocol, a product ingredient claim, a safety threshold — use Elicit or Consensus to understand what the published research actually shows. These tools make the academic evidence base accessible without requiring access to expensive journal subscriptions or expertise in academic search syntax.',
  },
]

export default async function BestAIResearchAgentsPage() {
  const supabase = createClient()

  const { data: researchAgents } = await supabase
    .from('agents')
    .select('id, name, slug, developer, short_description, pricing_model, rating_avg, editorial_rating, rating_count, is_featured, is_verified')
    .eq('is_active', true)
    .eq('primary_category', 'ai-research-agents')
    .order('editorial_rating', { ascending: false })
    .limit(6)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Best AI Research Agents (2026)',
    description: 'The best AI research agents in 2026. Perplexity, Elicit, Consensus, and ChatGPT Deep Research compared by citation quality, source coverage, and use case fit.',
    url: 'https://theaiagentindex.com/resources/guides/best-ai-research-agents',
    datePublished: '2026-03-24',
    dateModified: new Date().toISOString().split('T')[0],
    author: { '@type': 'Organization', name: 'The AI Agent Index' },
    publisher: { '@type': 'Organization', name: 'The AI Agent Index', url: 'https://theaiagentindex.com' },
  }

  const faqItems = [
    {
      q: 'What are the best AI research agents in 2026?',
      a: 'The strongest AI research agents in 2026 differ by use case. Perplexity AI is best for real-time web research with verified citations across any topic. ChatGPT Deep Research is best for comprehensive structured reports that synthesise many sources into a long-form document. Elicit is best for academic literature review and systematic review of peer-reviewed research. Consensus is best for understanding the weight of scientific evidence on specific questions. Gong is best for competitive and market intelligence derived from your own customer conversation data. The right starting point is the tool whose source pool and output format match your specific research need.',
    },
    {
      q: 'How do AI research agents work?',
      a: 'AI research agents combine information retrieval — web search, academic database search, or proprietary data access — with large language model reasoning to find, evaluate, and synthesise information autonomously. The most capable tools form research hypotheses, search iteratively across multiple sources, evaluate source quality and relevance, reconcile conflicting information, and produce structured outputs with citations. The key distinction from a standard AI chatbot is that research agents access live or curated information rather than answering solely from training data, and they cite their sources so outputs can be verified.',
    },
    {
      q: 'Can AI research agents replace human researchers?',
      a: 'AI research agents dramatically accelerate the information gathering and synthesis stages of research — tasks that previously took researchers hours or days now take minutes. They do not replace the interpretation, judgment, original hypothesis generation, and expert insight that define skilled research. The most effective research workflows in 2026 use AI agents for the information gathering and initial synthesis layer, with human researchers focusing their time on evaluating the evidence, identifying gaps, and producing the insights and recommendations that require domain expertise. AI accelerates the inputs; humans produce the conclusions.',
    },
    {
      q: 'What is the difference between Perplexity and Elicit?',
      a: 'Perplexity searches the live web and synthesises results from publicly available sources — news, websites, reports, and general internet content. It is the right tool for research on current events, market information, product and company details, and any topic where currency matters. Elicit searches a curated database of over 125 million peer-reviewed academic papers. It is the right tool when you need to understand what the published scientific research shows on a specific topic. The source pool is the defining difference: web sources for current, broad information; academic papers for rigorous, peer-reviewed evidence.',
    },
    {
      q: 'How do you evaluate an AI research tool for professional use?',
      a: 'The most important test is citation transparency: can you click every factual claim and verify the source? Tools that produce confident-sounding answers without citations are not suitable for professional research use because errors cannot be detected without extensive independent verification. Beyond citations, evaluate: source coverage and recency relative to your use case, how the tool handles uncertainty and conflicting evidence, the format of outputs and whether they fit your downstream workflow, and cost per research task at your expected volume. Test shortlisted tools against questions where you already know the correct answer before relying on them for professional work.',
    },
  ]

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* Breadcrumb */}
      <div style={{ marginBottom: '0.75rem' }}>
        <Link href="/" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none' }}>Home</Link>
        <span style={{ color: '#D1D5DB', margin: '0 0.5rem' }}>/</span>
        <Link href="/resources/guides" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none' }}>Guides</Link>
        <span style={{ color: '#D1D5DB', margin: '0 0.5rem' }}>/</span>
        <span style={{ fontSize: '0.8125rem', color: '#111827' }}>Best AI Research Agents</span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' as const }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Guide</span>
        <span style={{ fontSize: '0.75rem', color: '#6B7280', padding: '0.25rem 0.75rem', backgroundColor: '#F3F4F6', borderRadius: '9999px' }}>Updated May 2026</span>
      </div>

      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
        Best AI Research Agents (2026)
      </h1>

      {/* Intro */}
      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem', maxWidth: '700px' }}>
        AI research agents have changed the economics of information gathering. Research tasks that previously required hours of manual searching, reading, and synthesis — competitive analysis, literature review, market background, due diligence — can now be completed in minutes with output quality that rivals what a skilled human researcher would produce manually. The productivity shift is real and measurable: knowledge workers using AI research tools consistently report completing research-intensive tasks significantly faster without sacrificing accuracy.
      </p>

      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem', maxWidth: '700px' }}>
        The critical distinction within this category is citation transparency. AI research tools that answer from training data without citing sources produce confident-sounding outputs that are frequently wrong in ways that are difficult to detect without independent verification. The tools in this guide are selected specifically because they cite their sources — every factual claim links to a verifiable source, which makes the output trustworthy and the errors findable.
      </p>

      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem', maxWidth: '700px' }}>
        The research agent market splits clearly into four distinct source pools: live web research, academic database research, deep multi-step research report generation, and market intelligence from your own conversation data. Each addresses a different research need, and the tool that is best for one use case is often the wrong choice for another. Choosing the right tool requires matching the source pool to the question you are answering.
      </p>

      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '2rem', maxWidth: '700px' }}>
        This guide covers the five strongest AI research agents in 2026, what distinguishes each, when to use which, and the evaluation criteria that separate research tools worth trusting from those that look impressive in demos but fail in professional use.
      </p>

      <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '3rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#0369A1', lineHeight: 1.6, margin: 0 }}>
          <strong>Related:</strong>{' '}
          <Link href="/definitions/what-is-an-ai-research-agent" style={{ color: '#2563EB' }}>What is an AI Research Agent?</Link>{' '}—{' '}
          full definition covering capabilities, use cases, and evaluation criteria.
        </p>
      </div>

      {/* Picks */}
      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '1.25rem' }}>Top AI research agents ranked</h2>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '1.25rem', marginBottom: '3.5rem' }}>
        {picks.map((pick) => (
          <div key={pick.slug} style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
            <div style={{ backgroundColor: '#F9FAFB', padding: '0.875rem 1.25rem', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' as const }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.2rem 0.5rem', borderRadius: '9999px' }}>{pick.tier}</span>
              <Link href={'/agents/' + pick.slug} style={{ fontWeight: 700, fontSize: '1rem', color: '#111827', textDecoration: 'none' }}>{pick.name}</Link>
              <span style={{ fontSize: '0.7rem', color: '#6B7280', backgroundColor: '#F3F4F6', padding: '0.2rem 0.5rem', borderRadius: '9999px' }}>{pick.category}</span>
              <Link href={'/agents/' + pick.slug} style={{ fontSize: '0.8125rem', color: '#2563EB', fontWeight: 500, textDecoration: 'none', marginLeft: 'auto' }}>View listing &#x2192;</Link>
            </div>
            <div style={{ padding: '1.25rem' }}>
              <p style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.75, marginBottom: '0.875rem' }}>{pick.body1}</p>
              <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '0.75rem' }}>{pick.body2}</p>
              <p style={{ fontSize: '0.8125rem', color: '#2563EB', fontWeight: 600, margin: 0 }}>Best for: {pick.bestFor}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Evaluation criteria */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>What to look for when evaluating AI research tools</h2>
        <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1.5rem' }}>
          The marketing in this category significantly outpaces the reality for some products. These are the criteria that determine whether a research tool is safe to use professionally.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.875rem' }}>
          {evaluationCriteria.map((criterion) => (
            <div key={criterion.title} style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.25rem 1.5rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.5rem' }}>{criterion.title}</h3>
              <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.7, margin: 0 }}>{criterion.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Use cases by research type */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>Use cases by research type</h2>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.875rem' }}>
          {useCases.map((item) => (
            <div key={item.title} style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.25rem 1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' as const }}>
                <h3 style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#111827', margin: 0 }}>{item.title}</h3>
                <span style={{ fontSize: '0.8125rem', color: '#2563EB', fontWeight: 600 }}>→ {item.tool}</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Research agents from index */}
      {researchAgents && researchAgents.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }}>AI research agents from the index</h2>
          <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            Browse all editorially reviewed AI research agents with structured data on pricing, source coverage, and capabilities.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            {researchAgents.map((agent) => (
              <Link key={agent.slug} href={'/agents/' + agent.slug} style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: '1px solid #E5E7EB', padding: '1.25rem', textDecoration: 'none', display: 'block' }}>
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
          <Link href="/ai-research-agents" style={{ fontSize: '0.875rem', color: '#2563EB', fontWeight: 500, display: 'inline-block' }}>
            Browse all AI research agents &#x2192;
          </Link>
        </div>
      )}

      {/* FAQs */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '1.25rem' }}>Frequently Asked Questions</h2>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '1rem' }}>
          {faqItems.map(({ q, a }) => (
            <div key={q} style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1.25rem 1.5rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.5rem' }}>{q}</h3>
              <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.75, margin: 0 }}>{a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Related */}
      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/ai-research-agents" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>All AI Research Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>Browse full category &#x2192;</p>
        </Link>
        <Link href="/definitions/what-is-an-ai-research-agent" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>What is an AI Research Agent?</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>Read the definition &#x2192;</p>
        </Link>
        <Link href="/resources/guides/best-ai-agents-for-legal" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>AI Agents for Legal Teams</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>Legal research use cases &#x2192;</p>
        </Link>
        <Link href="/resources/guides/how-to-evaluate-an-ai-agent" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>How to Evaluate an Agent</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>Buying framework &#x2192;</p>
        </Link>
      </div>

      <p style={{ fontSize: '0.875rem', color: '#9CA3AF', lineHeight: 1.6 }}>
        All agents listed are editorially reviewed by The AI Agent Index. See our <Link href="/methodology" style={{ color: '#6B7280' }}>editorial methodology</Link>.
      </p>

      <GuideCitations slug="best-ai-research-agents" table="guides" />
    </div>
  )
}