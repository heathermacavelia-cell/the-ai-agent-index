import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase'
import GuideCitations from '@/components/GuideCitations'
import NewsletterSignup from '@/components/NewsletterSignup'
import { getGuideMeta, isoDate, updatedLabel } from '@/lib/guideMeta'
import GuideAgentList from '@/components/GuideAgentList'
import { getGuideGroups, type GuideGroup } from '@/lib/guideAgents'
import { buildRefMap, resolveTemplates } from '@/lib/templates'

// Agent names in this guide's prose and FAQ come from the database, not from this file.
// GUIDE_SLUGS lists every agent the prose names. A name that is renamed in the database
// updates here automatically. A slug that does not exist renders its raw template, loudly.
const GUIDE_SLUGS = ['apollo-io', 'copy-ai', 'gorgias', 'instantly-ai', 'jasper', 'klaviyo-ai', 'kodif', 'perplexity-ai', 'richpanel', 'tidio', 'yuma-ai']

// The agents this guide lists, in this order, under the guide's four functions.
// Chosen by hand (Heather, 2026-10-29) - never by tag. Order is editorial, not a ranking.
const GUIDE_GROUPS: GuideGroup[] = [
  {
    heading: 'Customer support',
    intro: 'Helpdesks and AI agents built for ecommerce support queues: order status, shipping, returns and product questions.',
    slugs: ['gorgias', 'tidio', 'yuma-ai', 'kodif', 'richpanel'],
  },
  {
    heading: 'Marketing and content',
    intro: 'Tools for campaigns, product copy and on-brand marketing content.',
    slugs: ['klaviyo-ai', 'jasper', 'copy-ai'],
  },
  {
    heading: 'Sales and prospecting',
    intro: 'Prospecting data and cold email tools for brands that run a wholesale or B2B channel.',
    slugs: ['apollo-io', 'instantly-ai'],
  },
  {
    heading: 'Research',
    intro: 'A cited answer engine for competitor, product and trend research.',
    slugs: ['perplexity-ai'],
  },
]



export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'AI Agents for Ecommerce: Support, Content, and Sales (2026)',
  description: 'Gorgias, Tidio and Kodif for support, Klaviyo AI and Jasper for content, Apollo.io and Instantly.ai for wholesale outreach, grouped by function.',
  openGraph: {
    title: 'AI Agents for Ecommerce: Support, Content, and Sales (2026)',
    description: 'Gorgias, Tidio and Kodif for support, Klaviyo AI and Jasper for content, Apollo.io and Instantly.ai for wholesale outreach, grouped by function.',
    url: 'https://theaiagentindex.com/resources/guides/ai-agents-for-ecommerce',
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary',
    title: 'AI Agents for Ecommerce: Support, Content, and Sales (2026)',
    description: 'Gorgias, Tidio and Kodif for support, Klaviyo AI and Jasper for content, Apollo.io and Instantly.ai for wholesale outreach, grouped by function.',
  },
  alternates: {
    canonical: 'https://theaiagentindex.com/resources/guides/ai-agents-for-ecommerce',
  },
}

const useCases = [
  {
    title: 'Customer support automation',
    description: `Ecommerce stores receive the same questions at high volume: order status, shipping timelines, return eligibility, product availability, and sizing. These queries are repetitive, time-sensitive, and directly connected to customer satisfaction and repurchase rates. They are also the type of work AI support agents are built for: structured, data-dependent queries where the answer exists in your systems and the customer needs it quickly, regardless of the time of day.

The business case for AI customer support in ecommerce is easier to measure than in many other contexts because the metrics are immediate and direct. Resolution time, ticket deflection rate, and customer satisfaction scores can all be measured before and after deployment. The aim is for the agent to handle routine first-tier tickets, with human agents handling the complex escalations that genuinely require judgment. For stores open around the clock with a small team, that covers routine queries outside working hours.

{{gorgias.name}} is a helpdesk built for ecommerce brands on Shopify, BigCommerce and Magento, with an AI Agent billed per resolved conversation. {{tidio.name}} combines live chat, a help desk and the Lyro AI Agent for small businesses and ecommerce stores. {{yuma-ai.name}} runs AI agents that resolve support, chat, social and phone conversations inside your existing helpdesk, and {{kodif.name}} resolves tickets end to end for ecommerce and subscription brands, with write-back to Shopify and help desks. {{richpanel.name}} pairs an ecommerce helpdesk with an autonomous AI agent.`,
  },
  {
    title: 'Marketing content and catalog copy',
    description: `Content production is a persistent bottleneck for ecommerce brands. Product descriptions, email campaigns, ad copy, category page content, and promotional materials all require consistent output at a volume that is hard for human copywriters to sustain for large catalogs or fast-moving inventory. AI content agents shorten the time from product upload to published copy, which matters most for stores with rapidly changing inventory or seasonal catalogs.

Product descriptions and email campaigns suit AI drafting well because the structure is predictable and the goal is conversion rather than creative expression. What to test is whether a tool keeps your brand voice consistent across many outputs, not only whether a single draft reads well.

{{klaviyo-ai.name}} is ecommerce marketing AI with the Composer campaign agent, a Customer Agent and predictive analytics. {{jasper.name}} is an AI marketing platform for on-brand content generation, with brand voice controls and specialized agents. {{copy-ai.name}} is a GTM AI platform that turns sales, marketing and operations processes into AI Workflows and Agents.`,
  },
  {
    title: 'Outbound sales and wholesale prospecting',
    description: `Many ecommerce brands operate a B2B wholesale channel alongside their DTC business, selling to retailers, distributors, and corporate buyers who represent high-value, recurring revenue. This channel typically requires outbound prospecting and relationship management that small ecommerce teams do not have the capacity to run at scale without dedicated sales resource. AI outreach agents handle the prospecting, personalization, and follow-up that would otherwise require a full-time sales development representative.

The B2B ecommerce context suits AI sales agents because the prospect pool is definable, the value proposition is clear, and the outreach process follows a repeatable pattern. A practical use is identifying and qualifying wholesale prospects (companies in your target retail categories, buyers at relevant distributors, and businesses that already carry complementary products) and running initial outreach sequences that move prospects into a human sales conversation.

{{apollo-io.name}} combines a B2B contact database with AI sequencing and outreach, so prospect search and email sequences live in one tool. {{instantly-ai.name}} is cold email infrastructure with unlimited sending accounts, automated warmup and AI reply classification, aimed at teams sending outreach across multiple domains.`,
  },
  {
    title: 'Research and competitive intelligence',
    description: `Ecommerce is a competitive environment where pricing, product assortment, and promotional strategy change rapidly. Staying current on what competitors are doing, what products are trending, what customers are asking for, and what content is ranking in your category requires continuous monitoring that is genuinely difficult to sustain manually. AI research agents shorten the time from question to synthesized answer, which helps small ecommerce teams keep up with their market without a dedicated analyst.

For ecommerce specifically, research agents are useful for competitive price monitoring, trend identification, customer sentiment synthesis from reviews and social data, and understanding what content is driving organic traffic in your category. The tools that suit this work access live web sources and provide citations, so outputs can be verified and acted on quickly rather than treated with the skepticism that non-cited AI outputs require.

{{perplexity-ai.name}} is an answer engine that searches the live web and cites every claim inline, so each finding can be checked against its source before you act on it.`,
  },
]

const evaluationCriteria = [
  {
    title: 'Native ecommerce platform integration',
    detail: 'A key criterion for any AI agent serving an ecommerce store is whether it integrates natively with your platform: Shopify, WooCommerce, Magento, or BigCommerce. A support agent that cannot access real-time order data, a marketing tool that cannot pull product data automatically, or an analytics tool that cannot connect to your transaction history is significantly less useful than one with a native integration. Always verify the specific integration depth before shortlisting: read-only access to order data is very different from the ability to process returns, issue refunds, or update inventory.',
  },
  {
    title: 'Real-time data access vs batch sync',
    detail: 'Customer support queries about orders are time-sensitive. A support agent working from data synced once per hour will give customers outdated information about order status and shipping, which is worse than no answer at all in many cases. Confirm whether the agent accesses your store data in real time via API or works from a periodically synced snapshot. Real-time access is essential for support use cases. Batch sync may be acceptable for marketing and analytics use cases where the query is about historical patterns rather than current state.',
  },
  {
    title: 'Autonomous action scope',
    detail: 'Different ecommerce AI agents operate at different levels of autonomy. Some can only retrieve and display information, answering what an order status is without taking action. Others can initiate returns, apply discount codes, update order notes, or trigger fulfillment changes. Higher autonomy delivers more value but requires more careful configuration and policy definition. Before deploying any agent with write access to your store, define exactly which actions it is authorized to take autonomously and which require human approval.',
  },
  {
    title: 'Setup time and technical requirement',
    detail: 'Ecommerce operators are often not technical teams. Look for agents designed for self-service deployment with no engineering resource required: a Shopify app install, an API connection wizard, or a no-code configuration interface. If an agent requires custom API development, webhook configuration by a developer, or a professional services engagement to go live, factor that cost and timeline into the total cost of ownership. Ask each vendor what going live involves before you commit.',
  },
  {
    title: 'Trial period and success metrics',
    detail: 'Ecommerce AI tools have clear, immediate metrics: ticket deflection rate, time to first response, conversion rate on product recommendation clicks, revenue attributed to AI-assisted campaigns. Before committing to any tool, establish the specific metrics you will use to evaluate success and confirm the trial period is long enough to produce meaningful data. Data from a support agent handling your actual ticket volume is far more reliable than any vendor benchmark.',
  },
]

const faqItems = [
  {
    q: 'What are the best AI agents for ecommerce stores in 2026?',
    a: 'The right AI agent for an ecommerce store depends on the function. For customer support, {{gorgias.name}}, {{tidio.name}}, {{yuma-ai.name}}, {{kodif.name}} and {{richpanel.name}} are built for ecommerce support queues. For marketing content and campaigns, {{klaviyo-ai.name}}, {{jasper.name}} and {{copy-ai.name}} cover campaign and copy work. For B2B wholesale outreach, {{apollo-io.name}} and {{instantly-ai.name}} handle prospecting and email sequencing. For competitive research and trend monitoring, {{perplexity-ai.name}} returns cited answers from live web sources. Customer support is a common starting point because its results are easy to measure.',
  },
  {
    q: 'Can AI agents integrate with Shopify?',
    a: 'Yes. Several AI agents work with Shopify: {{gorgias.name}} is a helpdesk built for brands on Shopify, BigCommerce and Magento, and {{kodif.name}} writes back to Shopify and help desks when it resolves a ticket. The depth of integration varies: some tools provide read-only access to order data, while others can initiate returns, apply discount codes, and update order status. Always verify the specific capabilities of the Shopify integration during your trial period rather than relying on general descriptions of compatibility.',
  },
  {
    q: 'How many ecommerce support tickets can AI agents handle autonomously?',
    a: 'The autonomous resolution rate varies significantly by store and ticket type mix. Stores with high volumes of order status, shipping, and return queries tend to see more tickets resolved without human involvement. Stores with complex product questions, customization requests, or high-value transactions requiring judgment see lower autonomous rates. The relevant number is not a platform benchmark but your specific ticket distribution. Request a trial and measure against your actual ticket sample rather than relying on vendor-published averages.',
  },
  {
    q: 'How do AI agents help ecommerce marketing specifically?',
    a: 'AI marketing agents help ecommerce brands in three primary ways: generating product descriptions and marketing copy at scale without proportional writing resource, running email sequences and campaigns with personalization based on customer behavior data, and producing ad creative variations for testing at volume. Email marketing is often the easiest place to measure impact, because AI-generated subject lines, personalized product recommendations, and automated post-purchase sequences can be compared against control groups.',
  },
  {
    q: 'What should an ecommerce store prioritize when starting with AI agents?',
    a: 'Start with customer support. Ticket deflection rate and resolution time are immediately measurable, and the effect on both cost and customer experience shows up in your own support data. Setup time depends on the tool and on how many order and return actions you let the agent take, so ask the vendor what going live involves. Once AI support is working well, a common next step is marketing content generation, particularly for stores with large catalogs or frequent promotional campaigns where content production is a consistent bottleneck.',
  },
]

export default async function AIAgentsForEcommercePage() {
  const meta = await getGuideMeta('ai-agents-for-ecommerce')
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
    headline: 'Best AI Agents for Ecommerce (2026)',
    description: 'AI agents for ecommerce, grouped by customer support, marketing content, outbound sales and research, with criteria for evaluating platform integration.',
    url: 'https://theaiagentindex.com/resources/guides/ai-agents-for-ecommerce',
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
    name: 'Best AI Agents for Ecommerce 2026',
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

      {/* Breadcrumb */}
      <div style={{ marginBottom: '0.75rem' }}>
        <Link href="/" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none' }}>Home</Link>
        <span style={{ color: '#D1D5DB', margin: '0 0.5rem' }}>/</span>
        <Link href="/resources/guides" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none' }}>Guides</Link>
        <span style={{ color: '#D1D5DB', margin: '0 0.5rem' }}>/</span>
        <span style={{ fontSize: '0.8125rem', color: '#111827' }}>AI agents for ecommerce</span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' as const }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Guide</span>
        <span style={{ fontSize: '0.75rem', color: '#6B7280', padding: '0.25rem 0.75rem', backgroundColor: '#F3F4F6', borderRadius: '9999px' }}>{updated}</span>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '0.25rem 0.75rem', borderRadius: '9999px', border: '1px solid #BFDBFE' }}>&#x2713; Independently Reviewed</span>
      </div>

      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
        Best AI agents for ecommerce (2026)
      </h1>

      {/* Intro */}
      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem', maxWidth: '700px' }}>
        Ecommerce is a natural fit for AI agents. The workflows that consume the most time in an ecommerce operation (answering customer queries, producing product content, running outreach, and monitoring competitors) are high volume, repetitive, and well-suited to automation. Used well, AI agents in these functions let a small team handle more volume than its size would otherwise allow.
      </p>

      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem', maxWidth: '700px' }}>
        The tools that suit ecommerce are built for ecommerce workflows, with native platform integrations, real-time access to order and product data, and interfaces designed for operators rather than engineers. A support agent that cannot access live order data is not useful for an ecommerce support queue. A content tool that cannot pull product attributes automatically is slower than it should be. Platform integration depth is a key criterion when evaluating any AI agent for an ecommerce context.
      </p>

      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem', maxWidth: '700px' }}>
        Customer support is usually the easiest place to measure results: ticket deflection rate and resolution time are immediately measurable, and the effect on operating cost and customer experience shows up in your own support data. That makes it a sensible starting point for most brands. Marketing content, outbound sales, and research automation can follow once support is working well.
      </p>

      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '2rem', maxWidth: '700px' }}>
        This guide covers {listed.length} AI agents across four ecommerce functions: customer support, marketing content, outbound and wholesale sales, and competitive research. Each section explains what the function needs from an AI agent and which of the listed agents are built for it.
      </p>

      <GuideAgentList groups={GUIDE_GROUPS} />

      {/* Use cases */}
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '3rem', marginBottom: '3.5rem' }}>
        {useCases.map((useCase) => (
          <div key={useCase.title}>
            <div style={{ paddingBottom: '0.75rem', borderBottom: '2px solid #E5E7EB', marginBottom: '0.875rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', margin: 0 }}>{useCase.title}</h2>
            </div>
            {t(useCase.description).split('\n\n').map((para, i) => (
              <p key={i} style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.75, marginBottom: '1rem', maxWidth: '700px' }}>{para}</p>
            ))}
          </div>
        ))}
      </div>

      {/* Evaluation criteria */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>What to look for when evaluating ecommerce AI agents</h2>
        <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1.5rem' }}>
          Ecommerce has specific requirements that general AI agent evaluation frameworks miss. These are the criteria that matter most in an ecommerce context.
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
            { condition: 'Your primary need is handling customer support queries 24/7', recommendation: '{{gorgias.name}}, {{tidio.name}} or {{kodif.name}}', href: '/ai-customer-support-agents' },
            { condition: 'You need product descriptions and marketing copy at scale', recommendation: '{{klaviyo-ai.name}}, {{jasper.name}} or {{copy-ai.name}}', href: '/ai-marketing-agents' },
            { condition: 'You run a wholesale or B2B channel alongside your DTC store', recommendation: '{{apollo-io.name}} or {{instantly-ai.name}}', href: '/ai-sales-agents' },
            { condition: 'You need competitive research and trend monitoring', recommendation: '{{perplexity-ai.name}}', href: '/agents/perplexity-ai' },
            { condition: 'You need to automate a custom workflow across multiple tools', recommendation: 'Browse no-code AI builders', href: '/resources/guides/best-no-code-ai-agent-builders' },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', gap: '1rem', padding: '0.875rem 1rem', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.5rem', alignItems: 'flex-start', flexWrap: 'wrap' as const }}>
              <span style={{ fontSize: '0.875rem', color: '#374151', flex: 1 }}>If <strong>{row.condition}</strong></span>
              <Link href={row.href} style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2563EB', textDecoration: 'none', flexShrink: 0 }}>&#x2192; {t(row.recommendation)}</Link>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '1.25rem' }}>Frequently asked questions</h2>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '1rem' }}>
          {faqItems.map(({ q, a }) => (
            <div key={q} style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1.25rem 1.5rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.5rem' }}>{q}</h3>
              <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.75, margin: 0 }}>{t(a)}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <NewsletterSignup sourcePage="guide-ai-agents-for-ecommerce" sourceType="guide" />
      </div>

      {/* Related resources */}
      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/ai-customer-support-agents" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>AI support agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>Browse full category &#x2192;</p>
        </Link>
        <Link href="/resources/guides/best-ai-agents-for-small-business" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Best for small business</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>SMB agent guide &#x2192;</p>
        </Link>
        <Link href="/resources/guides/best-no-code-ai-agent-builders" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>No-code AI builders</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>Automate without code &#x2192;</p>
        </Link>
        <Link href="/resources/guides/how-to-evaluate-an-ai-agent" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>How to evaluate an agent</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>Buying framework &#x2192;</p>
        </Link>
      </div>

      <p style={{ fontSize: '0.875rem', color: '#9CA3AF', lineHeight: 1.6 }}>
        All agents listed are editorially reviewed by The AI Agent Index. See our <Link href="/methodology" style={{ color: '#6B7280' }}>editorial methodology</Link>.
      </p>

      <GuideCitations slug="ai-agents-for-ecommerce" table="guides" />
    </div>
  )
}
