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
const GUIDE_SLUGS = ['chatgpt-deep-research', 'consensus', 'elicit', 'gemini-deep-research', 'gong', 'perplexity-ai']

// The agents this guide lists, in this order. Chosen by hand (Heather, 2026-10-29) - never by tag.
// Order is editorial, not a ranking.
const GUIDE_GROUPS: GuideGroup[] = [
  {
    heading: 'Research agents',
    intro: 'Tools that search the live web or the academic literature and cite the sources behind their answers.',
    slugs: ['perplexity-ai', 'chatgpt-deep-research', 'gemini-deep-research', 'elicit', 'consensus'],
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

const DESCRIPTION = 'Perplexity and Gemini for the web, ChatGPT Deep Research for cited reports, Elicit and Consensus for academic papers. Compared by source type.'

export const metadata: Metadata = {
  title: '5 AI Research Agents Compared by Source Type (2026)',
  description: DESCRIPTION,
  openGraph: {
    title: '5 AI Research Agents Compared by Source Type (2026)',
    description: DESCRIPTION,
    url: 'https://theaiagentindex.com/resources/guides/best-ai-research-agents',
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary',
    title: '5 AI Research Agents Compared by Source Type (2026)',
    description: DESCRIPTION,
  },
  alternates: {
    canonical: 'https://theaiagentindex.com/resources/guides/best-ai-research-agents',
  },
}

const evaluationCriteria = [
  {
    title: 'Citation quality and source transparency',
    detail: 'The first criterion for any AI research tool is whether it provides verifiable citations for its factual claims. AI models that answer from training data without citing sources produce outputs that are hard to verify and can contain errors that read as confident and plausible. A research tool used in a professional context should cite the specific source for each claim, link to that source, and make verification straightforward. If a tool cannot show you where a piece of information came from, treat that information as unverified, however well-written it is.',
  },
  {
    title: 'Source coverage and recency',
    detail: 'Different research tools draw from different source pools. {{perplexity-ai.name}}, {{chatgpt-deep-research.name}} and {{gemini-deep-research.name}} search the live web, which means current information but variable source quality. {{elicit.name}} and {{consensus.name}} search the academic literature: higher-quality sources, but limited to published research. Before selecting a research tool, define the source pool you need: if the answer requires current market data, web access is essential. If it requires peer-reviewed evidence, an academic search tool is essential.',
  },
  {
    title: 'Hallucination rate and uncertainty handling',
    detail: 'Research AI tools vary in how they handle questions they cannot confidently answer. Weak tools produce plausible-sounding answers with citations that do not support the claim. Better tools surface uncertainty explicitly, note when sources conflict, and say when the evidence is insufficient. Always test a research tool against questions where you already know the correct answer before relying on it for professional research, and click through the citations on the claims that matter.',
  },
  {
    title: 'Output format and downstream usability',
    detail: 'Research tools produce outputs in different formats suited to different downstream uses. {{perplexity-ai.name}} produces answers with inline citations, useful for quick lookup and synthesis. {{chatgpt-deep-research.name}} and {{gemini-deep-research.name}} produce long-form cited reports, useful for documents you need to share or act on. {{elicit.name}} is built for systematic reviews and research reports over academic papers. Match the output format to how you will use the research rather than choosing the tool with the most impressive demo.',
  },
  {
    title: 'Cost per research task at your volume',
    detail: 'Research tool pricing models differ: some offer free tiers with usage limits, and deeper research modes are often limited by plan or by monthly usage caps. Check current plans on each listing before committing, and model the cost per research task at your expected monthly volume. Research tools that seem affordable for occasional use can become expensive when used daily by a team.',
  },
]

const useCases = [
  {
    title: 'Market research',
    tool: '{{perplexity-ai.name}}, {{chatgpt-deep-research.name}} or {{gemini-deep-research.name}}',
    desc: 'Use {{perplexity-ai.name}} for quick competitive and market background research with current sources. Use {{chatgpt-deep-research.name}} or {{gemini-deep-research.name}} when you need a broader market analysis (competitive landscape, trends, regulatory environment) produced as a cited report rather than a short answer.',
  },
  {
    title: 'Academic literature review',
    tool: '{{elicit.name}} or {{consensus.name}}',
    desc: 'Use {{elicit.name}} to search and extract from a large corpus of research papers on a topic, identify key studies, and compare findings across papers systematically. Use {{consensus.name}} when your question is a yes-or-no question about what the research shows, where its Consensus Meter summarizes whether the top papers lean yes, no, possibly or mixed.',
  },
  {
    title: 'Competitive intelligence',
    tool: '{{perplexity-ai.name}}',
    desc: 'Use {{perplexity-ai.name}} to monitor publicly available competitive information: product updates, pricing changes, press coverage, and positioning shifts. For what your own customers and prospects say about competitors, a conversation intelligence platform such as {{gong.name}}, which records calls, meetings and emails, covers the internal side that public sources cannot.',
  },
  {
    title: 'Investment and due diligence research',
    tool: '{{chatgpt-deep-research.name}} or {{gemini-deep-research.name}}',
    desc: 'Use {{chatgpt-deep-research.name}} or {{gemini-deep-research.name}} to produce background analysis on companies, industries, and technology claims before making investment or partnership decisions. Both read many web sources and return a cited report, which gives you a starting point to verify rather than a finished conclusion.',
  },
  {
    title: 'Evidence-based decision making',
    tool: '{{elicit.name}} or {{consensus.name}}',
    desc: 'When a business decision depends on the strength of scientific evidence (a healthcare protocol, a product ingredient claim, a safety threshold) use {{elicit.name}} or {{consensus.name}} to understand what the published research actually shows. These tools make the academic evidence base easier to search without expertise in academic search syntax.',
  },
]

export default async function BestAIResearchAgentsPage() {
  const meta = await getGuideMeta('best-ai-research-agents')
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
    headline: 'Best AI Research Agents (2026)',
    description: DESCRIPTION,
    url: 'https://theaiagentindex.com/resources/guides/best-ai-research-agents',
    ...(published ? { datePublished: published } : {}),
    ...(audited ? { dateModified: audited } : {}),
    author: { '@type': 'Organization', name: 'The AI Agent Index', url: 'https://theaiagentindex.com' },
    publisher: { '@type': 'Organization', name: 'The AI Agent Index', url: 'https://theaiagentindex.com' },
  }

  const faqItems = [
    {
      q: 'What are the best AI research agents in 2026?',
      a: 'It depends on the source pool your question needs. {{perplexity-ai.name}} suits real-time web research, with inline citations for its claims. {{chatgpt-deep-research.name}} and {{gemini-deep-research.name}} suit longer questions where you want a cited report built from many web sources. {{elicit.name}} suits systematic reviews and research reports over academic papers. {{consensus.name}} suits checking what the peer-reviewed research says on a specific question. The right starting point is the tool whose source pool and output format match your research need.',
    },
    {
      q: 'How do AI research agents work?',
      a: 'AI research agents combine information retrieval (web search, academic search, or access to your own files and apps) with large language model reasoning to find, evaluate, and synthesize information. Deep research tools such as {{chatgpt-deep-research.name}} and {{gemini-deep-research.name}} plan a research approach, search iteratively across many sources, and produce a structured report with citations. The key distinction from a standard AI chatbot is that research agents work from live or curated sources rather than answering solely from training data, and they cite those sources so outputs can be checked.',
    },
    {
      q: 'Can AI research agents replace human researchers?',
      a: 'AI research agents speed up the information gathering and first-pass synthesis stages of research. They do not replace the interpretation, judgment, original hypothesis generation, and expert insight that define skilled research, and their citations still need checking. A practical workflow uses AI agents for gathering sources and drafting an initial synthesis, with people evaluating the evidence, identifying gaps, and producing the conclusions and recommendations that require domain expertise. AI speeds up the inputs; people own the conclusions.',
    },
    {
      q: 'What is the difference between {{perplexity-ai.name}} and {{elicit.name}}?',
      a: '{{perplexity-ai.name}} searches the live web and cites the sources behind its answers: news, websites, reports, and general internet content. It fits research on current events, market information, product and company details, and any topic where recency matters. {{elicit.name}} searches over 138 million academic papers and 545,000 clinical trials, and is built for systematic reviews and research reports. It fits questions about what the published research shows on a topic. The source pool is the defining difference: web sources for current, broad information; academic papers for peer-reviewed evidence.',
    },
    {
      q: 'How do you evaluate an AI research tool for professional use?',
      a: 'The first test is citation transparency: can you click through a factual claim and verify the source? Tools that produce confident-sounding answers without citations are risky for professional research because errors cannot be detected without independent verification. Beyond citations, evaluate: source coverage and recency relative to your use case, how the tool handles uncertainty and conflicting evidence, the format of outputs and whether they fit your downstream workflow, and cost per research task at your expected volume. Test shortlisted tools against questions where you already know the correct answer before relying on them for professional work.',
    },
  ].map(({ q, a }) => ({ q: t(q), a: t(a) }))

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
    name: 'Best AI Research Agents (2026)',
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />

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
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Independently Reviewed</span>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Guide</span>
        {updated && (
          <span style={{ fontSize: '0.75rem', color: '#6B7280', padding: '0.25rem 0.75rem', backgroundColor: '#F3F4F6', borderRadius: '9999px' }}>{updated}</span>
        )}
      </div>

      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
        Best AI Research Agents (2026)
      </h1>

      {/* Intro */}
      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem', maxWidth: '700px' }}>
        AI research agents have changed how information gathering works. Research tasks that used to mean hours of manual searching, reading, and synthesis (competitive analysis, literature review, market background, due diligence) can now start from a cited first draft produced in minutes. The draft still needs checking, but the starting point is much further along.
      </p>

      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem', maxWidth: '700px' }}>
        The critical distinction within this category is citation transparency. AI tools that answer from training data without citing sources produce confident-sounding outputs that can be wrong in ways that are difficult to detect without independent verification. The tools in this guide cite their sources, which makes their claims checkable and their errors findable.
      </p>

      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem', maxWidth: '700px' }}>
        The research agents in this guide differ mainly by source pool and output. <A s="perplexity-ai" r={refs} /> answers questions from the live web with inline citations. <A s="chatgpt-deep-research" r={refs} /> and <A s="gemini-deep-research" r={refs} /> run multi-step research across many sources and return cited reports. <A s="elicit" r={refs} /> and <A s="consensus" r={refs} /> search the academic literature. Each addresses a different research need, and the right tool for one question is often the wrong choice for another. Choosing well means matching the source pool to the question you are answering.
      </p>

      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '2rem', maxWidth: '700px' }}>
        This guide covers five AI research agents, what distinguishes each, when to use which, and the evaluation criteria that separate research tools worth trusting from those that look impressive in demos but fall short in professional use.
      </p>

      <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '3rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#0369A1', lineHeight: 1.6, margin: 0 }}>
          <strong>Related:</strong>{' '}
          <Link href="/definitions/what-is-an-ai-research-agent" style={{ color: '#2563EB' }}>What is an AI Research Agent?</Link>{' '}
          Full definition covering capabilities, use cases, and evaluation criteria.
        </p>
      </div>

      <GuideAgentList groups={GUIDE_GROUPS} />

      {/* Evaluation criteria */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>What to look for when evaluating AI research tools</h2>
        <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1.5rem' }}>
          Demos in this category can look better than day-to-day results. These are the criteria that determine whether a research tool is safe to use professionally.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.875rem' }}>
          {evaluationCriteria.map((criterion) => (
            <div key={criterion.title} style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.25rem 1.5rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.5rem' }}>{criterion.title}</h3>
              <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.7, margin: 0 }}>{t(criterion.detail)}</p>
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
                <span style={{ fontSize: '0.8125rem', color: '#2563EB', fontWeight: 600 }}>&#x2192; {t(item.tool)}</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.7, margin: 0 }}>{t(item.desc)}</p>
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