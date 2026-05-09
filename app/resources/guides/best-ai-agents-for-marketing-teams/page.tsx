import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase'
import GuideCitations from '@/components/GuideCitations'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Best AI Agents for Marketing Teams (2026) | The AI Agent Index',
  description: 'The best AI agents for marketing teams in 2026. Content creation, SEO, paid media, and social media — chosen for output quality, integration depth, and marketing team fit.',
  openGraph: {
    title: 'Best AI Agents for Marketing Teams (2026)',
    description: 'The best AI agents for marketing teams in 2026. Content creation, SEO, paid media, and social media — editorially reviewed.',
    url: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-marketing-teams',
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary',
    title: 'Best AI Agents for Marketing Teams (2026)',
    description: 'Best AI agents for marketing — content, SEO, paid media, and social. Editorially reviewed.',
  },
  alternates: {
    canonical: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-marketing-teams',
  },
}

const useCases = [
  {
    title: 'Content creation and copywriting',
    description: `Content is the function where AI agents deliver the most immediate and measurable productivity gain for marketing teams. The work is well-suited to automation: writing follows patterns, quality can be evaluated against clear criteria, and the volume required to sustain a content programme typically exceeds what any reasonably-sized human team can produce consistently without AI assistance. Teams using AI for content generation are not just producing more content — they are producing it faster, which means more testing, more iteration, and faster feedback loops on what works.

The quality gap between AI-generated and human-generated content has narrowed significantly in 2025 and 2026. The tools that produce the best marketing copy are those trained specifically on high-performing marketing language, not general-purpose models applied to marketing tasks. The meaningful differentiators between tools are brand voice consistency, the depth of the template library for specific marketing formats, and how well the output integrates with existing publishing workflows without requiring manual reformatting.`,
    picks: [
      {
        name: 'Jasper',
        slug: 'jasper',
        reason: 'Jasper is the most mature AI writing platform purpose-built for marketing teams. Its training is weighted toward high-performing marketing copy rather than general text, which produces outputs that follow marketing conventions for structure, call-to-action placement, and persuasion patterns. The Brand Voice feature learns your tone and applies it consistently across blog posts, ads, email sequences, and social content. For marketing teams producing content across multiple formats at volume, Jasper\'s template library and workflow integrations reduce the time from brief to publishable draft more than any comparable tool.',
      },
      {
        name: 'Copy.ai',
        slug: 'copy-ai',
        reason: 'Copy.ai covers the broadest range of marketing copy formats — landing pages, email campaigns, ad copy, product descriptions, social posts, and sales scripts — with a free tier that is genuinely functional rather than a conversion funnel. For lean marketing teams that need versatile copy generation across formats without committing to a high-cost platform, Copy.ai provides strong value. The interface is intuitive enough for non-writers to produce usable first drafts, and the quality of output for short-form formats like ads and social posts is competitive with more expensive alternatives.',
      },
    ],
  },
  {
    title: 'SEO and content strategy',
    description: `SEO is a natural fit for AI agents because so much of the work is analytical and pattern-based: identifying keyword opportunities, analysing SERP composition, scoring content against ranking signals, generating briefs, and monitoring performance over time. An experienced SEO professional can do all of this manually, but the time required limits how many pages they can actively manage and how quickly they can respond to ranking changes or new keyword opportunities.

AI SEO agents accelerate the workflow at the research and brief stages, which is where the most time is spent before a word is written. A tool that can analyse the top-ranking pages for a target keyword, identify structural patterns and content gaps, and generate a detailed brief in minutes rather than hours compresses the time from keyword opportunity to published content significantly. The output quality of the brief directly affects the quality of the content produced from it — and that is where the ROI from AI SEO tools compounds over time.`,
    picks: [
      {
        name: 'Surfer SEO',
        slug: 'surfer-seo',
        reason: 'Surfer is the most widely used on-page SEO optimisation tool for content-driven marketing teams. It analyses SERP composition for target keywords, identifies structural and topical patterns in top-ranking content, and generates briefs that give writers a clear structural framework grounded in real ranking data rather than guesswork. The Content Score feature evaluates drafts against competitor benchmarks in real time, and native integrations with Google Docs and WordPress make it practical within existing writing workflows rather than requiring a separate tool-switching step.',
      },
      {
        name: 'Perplexity AI',
        slug: 'perplexity-ai',
        reason: 'Perplexity is the most useful research tool for marketing strategists and content teams working on competitive intelligence, trend analysis, and topic research. Unlike general AI models, it searches live web sources and provides citations for every claim, which means outputs can be verified and used as research inputs rather than treated with the scepticism that non-cited AI outputs require. For understanding what content AI systems are already citing in a category, what questions buyers are asking, and what competitors are publishing, Perplexity provides faster, more reliable results than manual search.',
      },
    ],
  },
  {
    title: 'Paid media and campaign automation',
    description: `Paid media is one of the most data-intensive marketing functions and one of the best suited to AI agent automation. Bid optimisation, creative testing, audience segmentation, and campaign reporting all involve processing large volumes of data to make incremental adjustments that compound over time. Human paid media managers are genuinely limited by their ability to process and act on that data at the speed and granularity that produces optimal outcomes. AI agents are not.

The shift to AI-managed paid media is not a new phenomenon — algorithmic bid management has been standard practice in search advertising for years. The newer development is agents that operate at a higher level of abstraction: setting campaign strategy, generating creative variants, testing them systematically, and reallocating budget across channels based on performance signals without requiring manual campaign management. This is not fully autonomous for most organisations — human oversight of strategy and budget allocation remains standard — but the execution layer can operate with significantly less manual intervention than traditional paid media management.`,
    picks: [
      {
        name: 'Albert.ai',
        slug: 'albert-ai',
        reason: 'Albert is one of the few genuinely autonomous AI marketing agents for paid media — it manages campaign optimisation, creative testing, and budget allocation across search, social, and programmatic channels without requiring manual bid management. It analyses performance signals continuously and makes adjustments at a granularity and speed that human managers cannot match. Albert is designed for larger marketing teams with significant paid media budgets where the scale of campaigns justifies the platform investment.',
      },
      {
        name: 'Persado',
        slug: 'persado',
        reason: 'Persado specialises in AI-generated message variants optimised for performance rather than general quality — it generates copy for emails, ads, and landing pages based on language patterns that are statistically associated with higher engagement and conversion for specific audiences. The platform tests variants at scale and identifies which language elements drive performance lift, producing data-backed copy improvements rather than subjective creative judgments. Used by major financial services and retail brands for email and digital ad optimisation.',
      },
    ],
  },
  {
    title: 'Social media and lifecycle marketing',
    description: `Consistent social media presence requires publishing at a volume and frequency that is genuinely difficult to sustain manually alongside other marketing responsibilities. The content planning, scheduling, format adaptation, and analytics review that social media demands consumes significant marketing team time for what is often not the highest-leverage activity available. AI scheduling and content agents take over the operational layer so marketers can focus on the creative and strategic decisions that AI cannot make reliably.

Lifecycle marketing — personalising communications across the customer journey based on behaviour, purchase history, and engagement signals — is an area where AI agents produce measurable improvement in outcomes. The fundamental problem is scale: personalising at the individual level requires processing more signals and making more decisions than any marketing team can do manually. AI agents handle the decision layer, which determines who receives what message at what time, while human marketers set the strategy, create the content, and review the outcomes.`,
    picks: [
      {
        name: 'Hootsuite',
        slug: 'hootsuite',
        reason: 'Hootsuite is the most established social media management platform with the broadest channel support and deepest analytics integration. Its AI features include content suggestions based on trending topics and your historical performance, optimal posting time recommendations based on your audience engagement patterns, and a unified inbox for managing responses across LinkedIn, X, Instagram, Facebook, and TikTok. For marketing teams managing multiple brands or channels, Hootsuite\'s workflow and approval features handle the operational complexity at scale.',
      },
      {
        name: 'FeedHive',
        slug: 'feedhive',
        reason: 'FeedHive is built specifically for lean marketing teams and solo content creators who need AI-assisted scheduling without enterprise pricing or complexity. Its AI content suggestions and automatic content recycling — resurfacing high-performing older posts at optimal times — provide more value relative to cost than legacy scheduling tools. For startups and small marketing teams that need consistent social presence without dedicated social media resource, FeedHive is the most efficient starting point in this category.',
      },
    ],
  },
]

const evaluationCriteria = [
  {
    title: 'Marketing-specific training vs general AI',
    detail: 'The most important distinction when evaluating AI marketing tools is whether the model is trained specifically on marketing content and optimised for marketing outcomes, or whether it is a general-purpose AI model with a marketing-themed interface on top. Purpose-built marketing AI tools understand persuasion structures, call-to-action patterns, and format conventions that general models approximate inconsistently. Test any shortlisted tool against your actual content types before purchasing.',
  },
  {
    title: 'Brand voice configuration depth',
    detail: 'AI content tools produce generic outputs by default. The differentiator is how well a platform can learn and consistently apply your brand voice, terminology, and tone across different content formats. Evaluate this by feeding the tool your existing best-performing content and testing whether its outputs match your brand at a level that requires minimal editing. Tools that cannot maintain brand voice consistently create as much editing work as they save.',
  },
  {
    title: 'Integration with your existing workflow',
    detail: 'An AI tool that requires your team to work outside their existing workflow creates adoption friction that reduces the time savings it was supposed to deliver. Prioritise tools that integrate directly with where your team already works — Google Docs for content, WordPress or your CMS for publishing, your ad platforms for paid media management. Native integrations that push AI outputs into the right destination without copy-paste steps are meaningfully more valuable than tools that require manual handoff.',
  },
  {
    title: 'Attribution and performance tracking',
    detail: 'Marketing is one of the few functions where the output of AI agents directly produces measurable business results — clicks, conversions, revenue. Any AI tool in your marketing stack should support tracking whether AI-assisted content and campaigns outperform human-only baselines. Without this data, you cannot make informed decisions about where to invest further in AI or where human judgment still outperforms.',
  },
  {
    title: 'Review workflow compatibility',
    detail: 'AI agents produce at volume, which means errors also multiply at volume if there is no review step before publishing. The best AI marketing tools are designed to accelerate review, not eliminate it. Look for platforms that support approval workflows, version tracking, and easy editing of AI outputs before they are published. Full autonomy with no review is appropriate only for very low-stakes content types where errors are trivially correctable.',
  },
]

const mistakes = [
  {
    title: 'Using AI for everything at once',
    desc: 'Start with one use case where AI can deliver clear ROI — typically content generation or SEO brief creation. Measure the output quality and time savings over four to six weeks before expanding to other functions. Teams that try to AI-automate everything simultaneously typically see shallow adoption everywhere and clear ROI nowhere.',
  },
  {
    title: 'Skipping brand voice configuration',
    desc: 'Every AI content tool produces generic outputs by default. The brand voice setup step — feeding the tool your best-performing existing content, defining tone rules, setting terminology preferences — is what separates useful AI content from obvious AI content. This setup takes a few hours and determines whether the tool saves time or creates editing work.',
  },
  {
    title: 'Publishing without a review step',
    desc: 'AI agents produce at volume, which means errors multiply at volume without a review gate. The goal is to reduce review time to minutes per piece, not to eliminate it. Establish a lightweight review process before deploying AI content to any channel that reaches customers. AI errors that make it to publication damage brand credibility in ways that take longer to repair than the time the AI saved.',
  },
  {
    title: 'Ignoring AI attribution in reporting',
    desc: 'Track which content, campaigns, and communications are AI-assisted versus human-led. This data tells you where AI is genuinely adding value and where it is producing work that still needs significant human intervention to be usable. Without this tracking, you cannot make informed decisions about where to invest further in AI tools or where the ROI does not justify the cost.',
  },
]

const faqItems = [
  {
    q: 'What are the best AI agents for marketing teams in 2026?',
    a: 'The strongest purpose-built AI agents for marketing in 2026 are Jasper and Copy.ai for content generation, Surfer SEO for on-page optimisation and content strategy, Albert.ai for autonomous paid media management, and Hootsuite and FeedHive for social media scheduling and management. Perplexity AI is the most useful research tool for marketing strategists conducting competitive intelligence and trend analysis. The right starting point is the marketing function with the largest gap between what needs to happen and what your team can currently deliver.',
  },
  {
    q: 'How do AI agents help marketing teams specifically?',
    a: 'AI agents help marketing teams by removing the execution bottleneck from high-volume, repeatable tasks: generating content at scale without proportional headcount growth, optimising paid campaigns continuously without manual bid management, scheduling and recycling social content without daily manual effort, and synthesising research and competitive intelligence in minutes rather than hours. The strategic and creative decisions remain with human marketers. AI handles the execution layer that was previously limited by human bandwidth.',
  },
  {
    q: 'Will AI agents replace marketing teams?',
    a: 'No. AI agents replace specific marketing tasks at the execution layer, not the judgment and strategy that makes marketing effective. Brand positioning, audience understanding, creative direction, campaign strategy, and relationship building all require human judgment that AI cannot reliably replicate. What AI changes is the ratio of human input required to produce marketing output — a smaller team with the right AI tools can produce the volume and quality of output that previously required a much larger team.',
  },
  {
    q: 'How should a marketing team evaluate an AI agent before purchasing?',
    a: 'Test the tool against your actual content types and workflows before committing. The most important tests are: does it maintain your brand voice consistently without extensive editing, does it integrate with the tools your team already uses, and does it produce output quality that requires less editing time than writing from scratch. Run a trial with real marketing tasks from your backlog, measure the time from brief to publishable output with and without the tool, and calculate whether the ROI justifies the cost at your current team scale.',
  },
  {
    q: 'What is the biggest mistake marketing teams make when adopting AI agents?',
    a: 'The most common mistake is skipping the brand voice and quality configuration step and going straight to production use. AI tools produce generic outputs by default. The configuration work — feeding the tool your best-performing existing content, defining tone and terminology rules, testing against your actual formats — is what makes the difference between AI that saves hours per week and AI that creates editing work. This setup takes a few hours and determines the practical value of the tool for months afterward.',
  },
]

export default async function BestAIAgentsForMarketingTeamsPage() {
  const supabase = createClient()

  const { data: marketingAgents } = await supabase
    .from('agents')
    .select('id, name, slug, developer, short_description, pricing_model, rating_avg, editorial_rating, rating_count, is_featured, is_verified')
    .eq('is_active', true)
    .eq('primary_category', 'ai-marketing-agents')
    .order('editorial_rating', { ascending: false })
    .limit(6)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Best AI Agents for Marketing Teams (2026)',
    description: 'The best AI agents for marketing teams in 2026. Content creation, SEO, paid media, and social media — chosen for output quality, integration depth, and marketing team fit.',
    url: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-marketing-teams',
    datePublished: '2026-03-24',
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
        <span style={{ fontSize: '0.8125rem', color: '#111827' }}>Best AI Agents for Marketing Teams</span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' as const }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Guide</span>
        <span style={{ fontSize: '0.75rem', color: '#6B7280', padding: '0.25rem 0.75rem', backgroundColor: '#F3F4F6', borderRadius: '9999px' }}>Updated May 2026</span>
      </div>

      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
        Best AI Agents for Marketing Teams (2026)
      </h1>

      {/* Intro */}
      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem', maxWidth: '700px' }}>
        Marketing is the business function where AI agents deliver ROI most quickly. Content generation, SEO analysis, paid media optimisation, and social scheduling are all highly automatable — and the gap between AI-enabled marketing teams and those without is widening. The teams that have adopted AI are not just more efficient; they are running more experiments, producing more content, and iterating faster than teams that have not.
      </p>

      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem', maxWidth: '700px' }}>
        The tools that deliver the most value are purpose-built for specific marketing workflows, not general-purpose AI assistants applied to marketing tasks. A model trained specifically on high-performing marketing copy produces materially better marketing outputs than a general model with a marketing prompt. The same principle applies to SEO, paid media, and social — specialisation matters, and the tools in this guide are selected specifically because they were built for the marketing workflows they serve.
      </p>

      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem', maxWidth: '700px' }}>
        AI does not replace marketing teams. It removes the execution bottleneck that limits how much a team can produce, test, and optimise. Strategy, creative direction, brand judgment, and audience understanding remain human responsibilities. AI handles the production layer at a scale and speed that human teams cannot match, which means the humans on the team can spend more of their time on the decisions that actually differentiate good marketing from mediocre marketing.
      </p>

      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '2rem', maxWidth: '700px' }}>
        This guide covers the best AI agents across the four marketing functions where AI has the clearest and most documented impact: content creation, SEO and strategy, paid media, and social and lifecycle marketing. Each section includes the agents best suited for that function and what distinguishes them from alternatives.
      </p>

      <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '3rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#0369A1', lineHeight: 1.6, margin: 0 }}>
          <strong>Related:</strong> <Link href="/definitions/what-is-an-ai-marketing-agent" style={{ color: '#2563EB' }}>What is an AI Marketing Agent?</Link> — full definition covering capabilities, use cases, and evaluation criteria.
        </p>
      </div>

      {/* Use cases */}
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '3rem', marginBottom: '3.5rem' }}>
        {useCases.map((useCase) => (
          <div key={useCase.title}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '2px solid #E5E7EB' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', margin: 0 }}>{useCase.title}</h2>
            </div>
            {useCase.description.split('\n\n').map((para, i) => (
              <p key={i} style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.75, marginBottom: '1rem', maxWidth: '700px' }}>{para}</p>
            ))}
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.875rem', marginTop: '0.5rem' }}>
              {useCase.picks.map((pick) => (
                <div key={pick.slug} style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1.25rem 1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <Link href={'/agents/' + pick.slug} style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#2563EB', textDecoration: 'none' }}>{pick.name}</Link>
                    <Link href={'/agents/' + pick.slug} style={{ fontSize: '0.75rem', color: '#6B7280', textDecoration: 'none' }}>View listing &#x2192;</Link>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.7, margin: 0 }}>{pick.reason}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Evaluation criteria */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>What to look for when evaluating AI marketing agents</h2>
        <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1.5rem' }}>
          Marketing AI tools vary significantly in quality. These are the criteria that separate tools worth deploying from tools that create more work than they save.
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

      {/* Decision framework */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>How to choose</h2>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.75rem' }}>
          {[
            { condition: 'Your primary need is content generation — blog posts, ads, email copy', recommendation: 'Jasper or Copy.ai', href: '/ai-marketing-agents' },
            { condition: 'You need to improve search rankings and build a content strategy', recommendation: 'Surfer SEO', href: '/agents/surfer-seo' },
            { condition: 'You need real-time research and competitive intelligence', recommendation: 'Perplexity AI', href: '/agents/perplexity-ai' },
            { condition: 'You need to automate paid media optimisation at scale', recommendation: 'Albert.ai', href: '/agents/albert-ai' },
            { condition: 'You need consistent social media management without dedicated resource', recommendation: 'FeedHive or Hootsuite', href: '/ai-marketing-agents' },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', gap: '1rem', padding: '0.875rem 1rem', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.5rem', alignItems: 'flex-start', flexWrap: 'wrap' as const }}>
              <span style={{ fontSize: '0.875rem', color: '#374151', flex: 1 }}>If <strong>{row.condition}</strong></span>
              <Link href={row.href} style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2563EB', textDecoration: 'none', flexShrink: 0 }}>&#x2192; {row.recommendation}</Link>
            </div>
          ))}
        </div>
      </div>

      {/* Marketing agents from index */}
      {marketingAgents && marketingAgents.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }}>AI marketing agents from the index</h2>
          <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            Browse the full set of editorially reviewed AI marketing agents — all with structured data on pricing, integrations, and setup time.
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
                  <span style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 500 }}>View &#x2192;</span>
                </div>
              </Link>
            ))}
          </div>
          <Link href="/ai-marketing-agents" style={{ fontSize: '0.875rem', color: '#2563EB', fontWeight: 500, display: 'inline-block' }}>
            Browse all AI marketing agents &#x2192;
          </Link>
        </div>
      )}

      {/* Common mistakes */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>Common mistakes marketing teams make with AI agents</h2>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.875rem' }}>
          {mistakes.map((item) => (
            <div key={item.title} style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.25rem 1.5rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.5rem' }}>{item.title}</h3>
              <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
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

      {/* Related resources */}
      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/ai-marketing-agents" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>All AI Marketing Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>Browse full category &#x2192;</p>
        </Link>
        <Link href="/definitions/what-is-an-ai-marketing-agent" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>What is an AI Marketing Agent?</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>Read the definition &#x2192;</p>
        </Link>
        <Link href="/resources/guides/best-ai-agents-for-small-business" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Best for Small Business</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>SMB-focused picks &#x2192;</p>
        </Link>
        <Link href="/resources/guides/how-to-evaluate-an-ai-agent" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>How to Evaluate an Agent</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>Buying framework &#x2192;</p>
        </Link>
      </div>

      <p style={{ fontSize: '0.875rem', color: '#9CA3AF', lineHeight: 1.6 }}>
        All agents listed are editorially reviewed by The AI Agent Index. See our <Link href="/methodology" style={{ color: '#6B7280' }}>editorial methodology</Link>.
      </p>

      <GuideCitations slug="best-ai-agents-for-marketing-teams" table="guides" />
    </div>
  )
}