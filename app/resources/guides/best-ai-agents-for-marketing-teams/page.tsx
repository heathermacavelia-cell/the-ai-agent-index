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
const GUIDE_SLUGS = ['adroll', 'attentive-ai', 'canva-ai', 'copy-ai', 'crush', 'feedhive', 'hootsuite', 'jasper', 'klaviyo-ai', 'perplexity-ai', 'persado', 'semrush-ai', 'smartly-io', 'sprout-social', 'superscale', 'surfer-seo']

// The agents this guide lists, in this order, under the guide's marketing functions.
// Chosen by hand (Heather, 2026-10-29) - never by tag. Order is editorial, not a ranking.
const GUIDE_GROUPS: GuideGroup[] = [
  {
    heading: 'Content',
    intro: 'Platforms that generate marketing content and turn content processes into AI workflows and agents.',
    slugs: ['jasper', 'copy-ai'],
  },
  {
    heading: 'Design',
    intro: 'Visual content tools with AI generation for social, ads and brand assets.',
    slugs: ['canva-ai'],
  },
  {
    heading: 'SEO and AI visibility',
    intro: 'Tools that score content and track how a brand appears in AI search answers.',
    slugs: ['surfer-seo', 'semrush-ai'],
  },
  {
    heading: 'Ads',
    intro: 'Agents that research and produce ad creative, and agents that launch campaigns and optimize bids and budgets across ad platforms.',
    slugs: ['superscale', 'persado', 'smartly-io', 'adroll', 'crush'],
  },
  {
    heading: 'Social',
    intro: 'Platforms that plan, schedule and publish social posts, with AI help for drafting and analysis.',
    slugs: ['hootsuite', 'sprout-social', 'feedhive'],
  },
  {
    heading: 'Email and SMS',
    intro: 'Lifecycle messaging platforms with AI for campaigns, audiences and journeys.',
    slugs: ['klaviyo-ai', 'attentive-ai'],
  },
  {
    heading: 'Research',
    intro: 'Answer engines that search the live web and cite their sources, for market and competitor research.',
    slugs: ['perplexity-ai'],
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

export const metadata: Metadata = {
  title: 'AI Marketing Agents: Content, SEO, Ads, Social (2026)',
  description: 'Jasper for content, Surfer for SEO and AI search, Persado for regulated messaging, FeedHive for social. Chosen by marketing workflow.',
  openGraph: {
    title: 'AI Marketing Agents: Content, SEO, Ads, Social (2026)',
    description: 'Jasper for content, Surfer for SEO and AI search, Persado for regulated messaging, FeedHive for social. Chosen by marketing workflow.',
    url: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-marketing-teams',
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary',
    title: 'AI Marketing Agents: Content, SEO, Ads, Social (2026)',
    description: 'Jasper for content, Surfer for SEO and AI search, Persado for regulated messaging, FeedHive for social. Chosen by marketing workflow.',
  },
  alternates: {
    canonical: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-marketing-teams',
  },
}

const useCases = [
  {
    title: 'Content creation and copywriting',
    description: `Content is often the first function where marketing teams put AI agents to work. The work is well-suited to automation: writing follows patterns, quality can be evaluated against clear criteria, and the volume required to sustain a content program typically exceeds what any reasonably-sized human team can produce consistently without AI assistance. Teams using AI for content generation are not just producing more content: they are producing it faster, which means more testing, more iteration, and faster feedback loops on what works.

The quality gap between AI-generated and human-generated content has narrowed, but output still varies by tool and by how well the tool is set up. The meaningful differentiators between tools are brand voice consistency, the depth of the template library for specific marketing formats, and how well the output integrates with existing publishing workflows without requiring manual reformatting.`,
    inGuide: 'In this guide: {{jasper.name}} for on-brand content generation with brand voice controls, and {{copy-ai.name}} for turning sales, marketing and operations processes into AI Workflows and Agents.',
  },
  {
    title: 'SEO and content strategy',
    description: `SEO is a natural fit for AI agents because so much of the work is analytical and pattern-based: identifying keyword opportunities, analyzing SERP composition, scoring content against ranking signals, generating briefs, and monitoring performance over time. An experienced SEO professional can do all of this manually, but the time required limits how many pages they can actively manage and how quickly they can respond to ranking changes or new keyword opportunities.

AI SEO agents accelerate the workflow at the research and brief stages, which is where the most time is spent before a word is written. A tool that can analyze the top-ranking pages for a target keyword, identify structural patterns and content gaps, and generate a detailed brief in minutes rather than hours compresses the time from keyword opportunity to published content significantly. The output quality of the brief directly affects the quality of the content produced from it, and that is where the ROI from AI SEO tools compounds over time.`,
    inGuide: 'In this guide: {{surfer-seo.name}} for content scoring and tracking brand mentions in ChatGPT, Gemini, Perplexity and Google AI answers, {{semrush-ai.name}}, the AI layer of Adobe\'s Semrush platform, for AI visibility tracking across ChatGPT, Gemini and Perplexity, and {{perplexity-ai.name}} for research on the live web with every claim cited inline.',
  },
  {
    title: 'Paid media and ad creative',
    description: `Paid media is one of the most data-intensive marketing functions and one of the best suited to AI agent automation. Bid optimization, creative testing, audience segmentation, and campaign reporting all involve processing large volumes of data to make incremental adjustments that compound over time. Human paid media managers are limited in how quickly and how granularly they can process and act on that data, which is where AI agents can help.

The shift to AI-managed paid media is not a new phenomenon: algorithmic bid management has been standard practice in search advertising for years. The newer development is agents that operate at a higher level of abstraction: setting campaign strategy, generating creative variants, testing them systematically, and reallocating budget across channels based on performance signals without requiring manual campaign management. This is not fully autonomous for most organizations: human oversight of strategy and budget allocation remains standard, but the execution layer can operate with significantly less manual intervention than traditional paid media management.`,
    inGuide: 'In this guide: {{superscale.name}} for competitor ad research, ad copy and static or UGC-style video ads for Meta, TikTok and Google, and {{persado.name}} for regulated brands in financial services and insurance that need compliance checks during generation. For running campaigns, {{smartly-io.name}} brings autonomous planning and execution agents to enterprise advertising across Meta, Google, TikTok, Amazon and other channels, {{adroll.name}} runs pay-as-you-go programmatic display and retargeting with AI optimization, and {{crush.name}} is an AI media buyer for Meta ads that creates ads, launches Facebook and Instagram campaigns and moves budget to the winners.',
  },
  {
    title: 'Social media management',
    description: `Consistent social media presence requires publishing at a volume and frequency that is genuinely difficult to sustain manually alongside other marketing responsibilities. The content planning, scheduling, format adaptation, and analytics review that social media demands consumes significant marketing team time for what is often not the highest-leverage activity available. AI scheduling and content agents take over the operational layer so marketers can focus on the creative and strategic decisions that AI cannot make reliably.

Publishing is only part of the job. Replies, mentions and messages arrive across every network, and keeping up with them, along with what people are saying about the brand, takes real time on top of posting. Social platforms with AI help draft replies and posts, suggest what to publish again, and summarize performance, while human marketers set the strategy, create the content, and review the outcomes.`,
    inGuide: 'In this guide: {{hootsuite.name}} for publishing, a shared inbox, social listening and advocacy, {{sprout-social.name}} for publishing, an engagement inbox, listening and reporting with its Trellis AI agent, and {{feedhive.name}} for AI-assisted scheduling across 10 networks with performance prediction and post recycling.',
  },
  {
    title: 'Design and visual content',
    description: `Marketing teams need a steady supply of visual assets: social graphics, ad variations, presentations, landing page images and resized versions of each for every channel. Much of that work is adapting an existing design rather than creating a new one, which is where AI design tools save the most time.

AI design agents generate first drafts from a prompt, resize and reformat designs for different channels, apply brand kits so colors, fonts and logos stay consistent, and edit images without specialist software. The review step still matters: a designer or brand owner should approve anything that carries the brand.`,
    inGuide: 'In this guide: {{canva-ai.name}} for visual design with Magic Studio, Canva AI 2.0 and a first-party MCP server, with a free tier for getting started.',
  },
  {
    title: 'Email and SMS marketing',
    description: `Email and SMS are owned channels, which makes them some of the most measurable in marketing: every send can be tied to opens, clicks and revenue. They also involve a lot of repetitive work, from building segments and writing campaign variants to setting up automated journeys for sign-ups, abandoned carts and win-backs.

AI agents in this area draft campaign copy, build and refine audiences, set up automated flows and predict which customers are likely to buy or lapse. Because these messages go straight to customers' inboxes and phones, check consent, frequency and compliance settings before letting any agent send on its own.`,
    inGuide: 'In this guide: {{klaviyo-ai.name}} for ecommerce marketing with its Composer campaign agent, a Customer Agent and predictive analytics, and {{attentive-ai.name}} for SMS, email, RCS and push marketing with agentic AI for copy, sign-up, audiences and journeys, plus an MCP server for Claude and ChatGPT.',
  },
]

const evaluationCriteria = [
  {
    title: 'Marketing-specific training vs general AI',
    detail: 'A key distinction when evaluating AI marketing tools is whether the product is built around marketing workflows, with brand controls, marketing formats and marketing integrations, or whether it is a general-purpose AI model with a marketing-themed interface on top. Purpose-built tools can handle call-to-action patterns and format conventions more consistently, but this varies, so test any shortlisted tool against your actual content types before purchasing.',
  },
  {
    title: 'Brand voice configuration depth',
    detail: 'AI content tools produce generic outputs by default. The differentiator is how well a platform can learn and consistently apply your brand voice, terminology, and tone across different content formats. Evaluate this by feeding the tool your existing best-performing content and testing whether its outputs match your brand at a level that requires minimal editing. Tools that cannot maintain brand voice consistently create as much editing work as they save.',
  },
  {
    title: 'Integration with your existing workflow',
    detail: 'An AI tool that requires your team to work outside their existing workflow creates adoption friction that reduces the time savings it was supposed to deliver. Prioritize tools that integrate directly with where your team already works: Google Docs for content, WordPress or your CMS for publishing, your ad platforms for paid media management. Native integrations that push AI outputs into the right destination without copy-paste steps are meaningfully more valuable than tools that require manual handoff.',
  },
  {
    title: 'Attribution and performance tracking',
    detail: 'Marketing is one of the few functions where the output of AI agents directly produces measurable business results: clicks, conversions, revenue. Any AI tool in your marketing stack should support tracking whether AI-assisted content and campaigns outperform human-only baselines. Without this data, you cannot make informed decisions about where to invest further in AI or where human judgment still outperforms.',
  },
  {
    title: 'Review workflow compatibility',
    detail: 'AI agents produce at volume, which means errors also multiply at volume if there is no review step before publishing. Good AI marketing tools are designed to accelerate review, not eliminate it. Look for platforms that support approval workflows, version tracking, and easy editing of AI outputs before they are published. Full autonomy with no review is appropriate only for very low-stakes content types where errors are trivially correctable.',
  },
]

const mistakes = [
  {
    title: 'Using AI for everything at once',
    desc: 'Start with one use case where AI can deliver clear ROI, typically content generation or SEO brief creation. Measure the output quality and time savings over four to six weeks before expanding to other functions. Teams that try to AI-automate everything simultaneously typically see shallow adoption everywhere and clear ROI nowhere.',
  },
  {
    title: 'Skipping brand voice configuration',
    desc: 'Every AI content tool produces generic outputs by default. The brand voice setup step (feeding the tool your best-performing existing content, defining tone rules, setting terminology preferences) is what separates useful AI content from obvious AI content. This setup takes a few hours and determines whether the tool saves time or creates editing work.',
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
    a: 'The marketing agents in this guide are chosen by function. For content, {{jasper.name}} generates on-brand content with brand voice controls, and {{copy-ai.name}} ties content to wider go-to-market workflows. For SEO and AI search, {{surfer-seo.name}} scores content and tracks AI visibility, and {{perplexity-ai.name}} gives cited research from the live web. For ads, {{superscale.name}} researches competitor ads and produces ad creative, and {{persado.name}} generates content for regulated brands with compliance checks during generation. For running and optimizing ad campaigns, {{smartly-io.name}}, {{adroll.name}} and {{crush.name}} handle execution, bidding and budget. For social, {{hootsuite.name}}, {{sprout-social.name}} and {{feedhive.name}} handle scheduling, publishing and engagement. For design, {{canva-ai.name}} produces visual content, and for email and SMS, {{klaviyo-ai.name}} and {{attentive-ai.name}} run campaigns and automated journeys. {{semrush-ai.name}} also tracks AI visibility alongside SEO. The right starting point is the marketing function with the largest gap between what needs to happen and what your team can currently deliver.',
  },
  {
    q: 'How do AI agents help marketing teams specifically?',
    a: 'AI agents help marketing teams by removing the execution bottleneck from high-volume, repeatable tasks: generating content at scale without proportional headcount growth, producing and testing ad creative without a full production cycle for every variant, scheduling and recycling social content without daily manual effort, and synthesizing research and competitive intelligence in minutes rather than hours. The strategic and creative decisions remain with human marketers. AI handles the execution layer that was previously limited by human bandwidth.',
  },
  {
    q: 'Will AI agents replace marketing teams?',
    a: 'No. AI agents replace specific marketing tasks at the execution layer, not the judgment and strategy that makes marketing effective. Brand positioning, audience understanding, creative direction, campaign strategy, and relationship building all require human judgment that AI cannot reliably replicate. What AI changes is the ratio of human input required to produce marketing output: a smaller team with the right AI tools can produce the volume and quality of output that previously required a much larger team.',
  },
  {
    q: 'How should a marketing team evaluate an AI agent before purchasing?',
    a: 'Test the tool against your actual content types and workflows before committing. The most important tests are: does it maintain your brand voice consistently without extensive editing, does it integrate with the tools your team already uses, and does it produce output quality that requires less editing time than writing from scratch. Run a trial with real marketing tasks from your backlog, measure the time from brief to publishable output with and without the tool, and calculate whether the ROI justifies the cost at your current team scale.',
  },
  {
    q: 'What is the biggest mistake marketing teams make when adopting AI agents?',
    a: 'The most common mistake is skipping the brand voice and quality configuration step and going straight to production use. AI tools produce generic outputs by default. The configuration work (feeding the tool your best-performing existing content, defining tone and terminology rules, testing against your actual formats) is what makes the difference between AI that saves hours per week and AI that creates editing work. This setup takes a few hours and determines the practical value of the tool for months afterward.',
  },
]

export default async function BestAIAgentsForMarketingTeamsPage() {
  const meta = await getGuideMeta('best-ai-agents-for-marketing-teams')
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
    headline: 'Best AI Agents for Marketing Teams (2026)',
    description: 'Jasper for content, Surfer for SEO and AI search, Persado for regulated messaging, FeedHive for social. Chosen by marketing workflow.',
    url: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-marketing-teams',
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
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: t(a) },
    })),
  }

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Best AI Agents for Marketing Teams (2026)',
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
        <span style={{ fontSize: '0.8125rem', color: '#111827' }}>Best AI Agents for Marketing Teams</span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' as const }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Independently Reviewed</span>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Guide</span>
        <span style={{ fontSize: '0.75rem', color: '#6B7280', padding: '0.25rem 0.75rem', backgroundColor: '#F3F4F6', borderRadius: '9999px' }}>{updated}</span>
      </div>

      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
        Best AI Agents for Marketing Teams (2026)
      </h1>

      {/* Intro */}
      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem', maxWidth: '700px' }}>
        Marketing has a lot of work that AI agents are suited to. Content generation, SEO analysis, ad creative, and social scheduling are all highly automatable, and teams that adopt AI well can run more experiments, produce more content, and iterate faster.
      </p>

      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem', maxWidth: '700px' }}>
        Most of the tools in this guide are built for specific marketing workflows rather than being general-purpose AI assistants applied to marketing tasks: <A s="jasper" r={refs} /> and <A s="copy-ai" r={refs} /> for content, <A s="surfer-seo" r={refs} /> for SEO and AI visibility, <A s="superscale" r={refs} /> and <A s="persado" r={refs} /> for ads, and <A s="hootsuite" r={refs} /> and <A s="feedhive" r={refs} /> for social. <A s="perplexity-ai" r={refs} /> is the exception, a general answer engine included for research.
      </p>

      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem', maxWidth: '700px' }}>
        AI does not replace marketing teams. It removes the execution bottleneck that limits how much a team can produce, test, and optimize. Strategy, creative direction, brand judgment, and audience understanding remain human responsibilities. AI handles the production layer at a scale and speed that human teams cannot match, which means the humans on the team can spend more of their time on the decisions that actually differentiate good marketing from mediocre marketing.
      </p>

      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '2rem', maxWidth: '700px' }}>
        This guide covers {listed.length} AI agents across content, design, SEO and AI visibility, ads, social, email and SMS, and research. The sections below go deeper on content creation, SEO and research, paid media, social media, design, and email and SMS.
      </p>

      <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '3rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#0369A1', lineHeight: 1.6, margin: 0 }}>
          <strong>Related:</strong> <Link href="/definitions/what-is-an-ai-marketing-agent" style={{ color: '#2563EB' }}>What is an AI Marketing Agent?</Link> Full definition covering capabilities, use cases, and evaluation criteria.
        </p>
      </div>

      <GuideAgentList groups={GUIDE_GROUPS} />

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
            <p style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.75, marginBottom: 0, maxWidth: '700px' }}>{t(useCase.inGuide)}</p>
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
            { condition: 'Your primary need is content generation: blog posts, ads, email copy', recommendation: <><A s="jasper" r={refs} /> or <A s="copy-ai" r={refs} /></> },
            { condition: 'You need to improve search rankings and visibility in AI search', recommendation: <><A s="surfer-seo" r={refs} /> or <A s="semrush-ai" r={refs} /></> },
            { condition: 'You need real-time research and competitive intelligence', recommendation: <A s="perplexity-ai" r={refs} /> },
            { condition: 'You need ad creative researched and produced for Meta, TikTok and Google', recommendation: <A s="superscale" r={refs} /> },
            { condition: 'You market regulated financial or insurance products and need compliance checked during generation', recommendation: <A s="persado" r={refs} /> },
            { condition: 'You need consistent social media management without dedicated resource', recommendation: <><A s="feedhive" r={refs} />, <A s="hootsuite" r={refs} /> or <A s="sprout-social" r={refs} /></> },
            { condition: 'You want campaigns launched and bids and budgets optimized across ad platforms', recommendation: <><A s="smartly-io" r={refs} /> for enterprise teams, <A s="adroll" r={refs} /> for retargeting or <A s="crush" r={refs} /> for Meta ads</> },
            { condition: 'You need on-brand visual content and resized designs for every channel', recommendation: <A s="canva-ai" r={refs} /> },
            { condition: 'You run email and SMS campaigns and automated customer journeys', recommendation: <><A s="klaviyo-ai" r={refs} /> or <A s="attentive-ai" r={refs} /></> },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', gap: '1rem', padding: '0.875rem 1rem', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.5rem', alignItems: 'flex-start', flexWrap: 'wrap' as const }}>
              <span style={{ fontSize: '0.875rem', color: '#374151', flex: 1 }}>If <strong>{row.condition}</strong></span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2563EB', flexShrink: 0 }}>&#x2192; {row.recommendation}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div style={{ marginBottom: '3rem' }}>
        <NewsletterSignup />
      </div>

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
              <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.75, margin: 0 }}>{t(a)}</p>
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