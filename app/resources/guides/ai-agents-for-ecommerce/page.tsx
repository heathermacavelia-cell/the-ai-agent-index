import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase'
import GuideCitations from '@/components/GuideCitations'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Best AI Agents for Ecommerce (2026) | The AI Agent Index',
  description: 'The best AI agents for ecommerce in 2026. Customer support, marketing content, outbound sales, and personalisation — chosen for Shopify compatibility, setup speed, and measurable ROI.',
  openGraph: {
    title: 'Best AI Agents for Ecommerce (2026)',
    description: 'The best AI agents for ecommerce in 2026. Customer support, marketing content, outbound sales, and personalisation — editorially reviewed.',
    url: 'https://theaiagentindex.com/resources/guides/ai-agents-for-ecommerce',
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary',
    title: 'Best AI Agents for Ecommerce (2026)',
    description: 'Best AI agents for ecommerce — customer support, marketing content, outbound sales. Editorially reviewed.',
  },
  alternates: {
    canonical: 'https://theaiagentindex.com/resources/guides/ai-agents-for-ecommerce',
  },
}

const useCases = [
  {
    title: 'Customer support automation',
    description: `Ecommerce stores receive the same questions at high volume: order status, shipping timelines, return eligibility, product availability, and sizing. These queries are repetitive, time-sensitive, and directly connected to customer satisfaction and repurchase rates. They are also precisely the type of work AI support agents handle best — structured, data-dependent queries where the answer exists in your systems and the customer needs it quickly, regardless of the time of day.

The business case for AI customer support in ecommerce is clearer than in almost any other context because the metrics are immediate and direct. Resolution time, ticket deflection rate, and customer satisfaction scores are all measurable before and after deployment. Ecommerce brands that have deployed AI support agents consistently report handling the majority of first-tier ticket volume autonomously, with human agents handling only the complex escalations that genuinely require judgment. For stores running 24/7 with a small team, AI support agents eliminate the coverage problem entirely for routine queries.`,
    picks: [
      {
        name: 'Tidio',
        slug: 'tidio',
        reason: 'Tidio is purpose-built for ecommerce with native Shopify and WooCommerce integrations that give the agent access to real-time order data, customer history, and product inventory. It can resolve order status queries, process return requests against your policy rules, answer product questions using your catalogue data, and qualify leads from chat — all autonomously. The interface is designed for non-technical operators, and most stores are live within a day of setup. The pricing is accessible for small DTC brands, making it one of the highest-value entry points into ecommerce AI support.',
      },
      {
        name: 'Gorgias',
        slug: 'gorgias',
        reason: 'Gorgias is the most widely deployed helpdesk platform among ecommerce brands and has built AI automation directly into its core ticket management workflow. Its AI features automatically classify inbound tickets by intent, resolve common queries using templated responses connected to Shopify data, and prioritise tickets by the revenue value of the customer — which means your team spends their time on customers with the highest lifetime value and resolution complexity. For stores already using Gorgias as their helpdesk, the AI layer adds meaningful automation without requiring a separate tool.',
      },
    ],
  },
  {
    title: 'Marketing content and catalogue copy',
    description: `Content production is a persistent bottleneck for ecommerce brands. Product descriptions, email campaigns, ad copy, category page content, and promotional materials all require consistent output at a volume that human copywriters cannot sustain for large catalogues or fast-moving inventory. AI content agents reduce the time from product upload to published, optimised copy from hours to minutes, which matters most for stores with rapidly changing inventory or seasonal catalogues.

The quality gap between AI-generated and human-written ecommerce copy has narrowed significantly, particularly for product descriptions and email campaigns where the structure is predictable and the goal is conversion rather than creative expression. The tools that produce the best ecommerce copy are those trained on high-performing marketing language and capable of maintaining brand voice consistently across thousands of outputs — not general-purpose AI models with a copywriting template on top.`,
    picks: [
      {
        name: 'Jasper',
        slug: 'jasper',
        reason: 'Jasper is the most capable AI content platform for ecommerce marketing teams producing content across multiple formats at volume. Its Brand Voice feature learns your tone and applies it consistently across product descriptions, email campaigns, ad copy, and social content. For stores managing large catalogues, Jasper can generate SEO-optimised product descriptions at scale from structured product data inputs. The template library covers the specific formats ecommerce marketers need — promotional emails, abandoned cart copy, social ads, and category landing page content.',
      },
      {
        name: 'Copy.ai',
        slug: 'copy-ai',
        reason: 'Copy.ai covers the broadest range of ecommerce copy formats with a free tier that is genuinely functional. For DTC brands and smaller ecommerce teams that need AI-assisted product descriptions, promotional email copy, and ad creative without committing to an enterprise platform, Copy.ai delivers strong output quality for short-form formats. The interface is accessible enough for operators without marketing backgrounds to produce usable first drafts, and the turnaround from input to publishable draft is faster than most competing tools.',
      },
    ],
  },
  {
    title: 'Outbound sales and wholesale prospecting',
    description: `Many ecommerce brands operate a B2B wholesale channel alongside their DTC business — selling to retailers, distributors, and corporate buyers who represent high-value, recurring revenue. This channel typically requires outbound prospecting and relationship management that small ecommerce teams do not have the capacity to run at scale without dedicated sales resource. AI outreach agents handle the prospecting, personalisation, and follow-up that would otherwise require a full-time sales development representative.

The B2B ecommerce context is well-suited to AI sales agents because the prospect pool is definable, the value proposition is clear, and the outreach process follows a repeatable pattern that AI can execute consistently. The highest-leverage use is identifying and qualifying wholesale prospects at volume — companies in your target retail categories, buyers at relevant distributors, and businesses that already carry complementary products — and running initial outreach sequences that move prospects into a human sales conversation.`,
    picks: [
      {
        name: 'Apollo.io',
        slug: 'apollo-io',
        reason: 'Apollo combines a B2B database of over 275 million contacts with built-in email sequencing, making it the most complete single-tool solution for ecommerce brands running outbound wholesale or B2B sales. For brands targeting retail buyers, distributors, or corporate accounts, Apollo\'s filtering capabilities allow precise targeting by company size, industry, location, and job title — identifying the right buyers at the right accounts before outreach begins. The freemium tier is functional enough to validate whether B2B outbound works for your brand before committing to a paid plan.',
      },
      {
        name: 'Instantly.ai',
        slug: 'instantly-ai',
        reason: 'Instantly is the strongest cold email tool for ecommerce brands running outbound at scale. Unlimited sending accounts on paid plans protect deliverability across multiple domains, and the sequence builder handles personalisation, follow-up timing, and reply detection automatically. For wholesale outreach where volume and deliverability are the primary concerns, Instantly is consistently one of the highest-performing tools in the category. Setup is typically under a day, and teams are sending at scale within the first week.',
      },
    ],
  },
  {
    title: 'Research and competitive intelligence',
    description: `Ecommerce is a competitive environment where pricing, product assortment, and promotional strategy change rapidly. Staying current on what competitors are doing, what products are trending, what customers are asking for, and what content is ranking in your category requires continuous monitoring that is genuinely difficult to sustain manually. AI research agents compress the time from question to synthesised answer significantly, allowing small ecommerce teams to maintain competitive awareness at a level that would otherwise require dedicated analyst resource.

For ecommerce specifically, research agents are most valuable for competitive price monitoring, trend identification, customer sentiment synthesis from reviews and social data, and understanding what content is driving organic traffic in your category. The tools that work best here access live web sources and provide citations, so outputs can be verified and acted on quickly rather than treated with the scepticism that non-cited AI outputs require.`,
    picks: [
      {
        name: 'Perplexity AI',
        slug: 'perplexity-ai',
        reason: 'Perplexity is the most accessible research tool for ecommerce teams monitoring competitors, identifying trending products, and understanding what buyers are asking in their category. It searches live web sources and provides citations for every claim, which means outputs are verifiable rather than requiring trust in opaque AI synthesis. For quick competitive lookups, trend research, and understanding what content is being referenced in your category by AI systems, Perplexity delivers results in seconds that would take 20 to 30 minutes of manual research to replicate.',
      },
    ],
  },
]

const evaluationCriteria = [
  {
    title: 'Native ecommerce platform integration',
    detail: 'The single most important criterion for any AI agent serving an ecommerce store is whether it integrates natively with your platform — Shopify, WooCommerce, Magento, or BigCommerce. A support agent that cannot access real-time order data, a marketing tool that cannot pull product data automatically, or an analytics tool that cannot connect to your transaction history is significantly less useful than one with a native integration. Always verify the specific integration depth before shortlisting: read-only access to order data is very different from the ability to process returns, issue refunds, or update inventory.',
  },
  {
    title: 'Real-time data access vs batch sync',
    detail: 'Customer support queries about orders are time-sensitive. A support agent working from data synced once per hour will give customers outdated information about order status and shipping — which is worse than no answer at all in many cases. Confirm whether the agent accesses your store data in real time via API or works from a periodically synced snapshot. Real-time access is essential for support use cases. Batch sync may be acceptable for marketing and analytics use cases where the query is about historical patterns rather than current state.',
  },
  {
    title: 'Autonomous action scope',
    detail: 'Different ecommerce AI agents operate at different levels of autonomy. Some can only retrieve and display information — answering what an order status is without taking action. Others can initiate returns, apply discount codes, update order notes, or trigger fulfilment changes. Higher autonomy delivers more value but requires more careful configuration and policy definition. Before deploying any agent with write access to your store, define exactly which actions it is authorised to take autonomously and which require human approval.',
  },
  {
    title: 'Setup time and technical requirement',
    detail: 'Ecommerce operators are often not technical teams. The best AI agents for ecommerce are designed for self-service deployment with no engineering resource required — a Shopify app install, an API connection wizard, or a no-code configuration interface. If an agent requires custom API development, webhook configuration by a developer, or a professional services engagement to go live, factor that cost and timeline into the total cost of ownership. The agents in this guide are selected in part because they are deployable by operators without engineering support.',
  },
  {
    title: 'Trial period and success metrics',
    detail: 'Ecommerce AI tools have clear, immediate ROI metrics: ticket deflection rate, time to first response, conversion rate on product recommendation clicks, revenue attributed to AI-assisted campaigns. Before committing to any tool, establish the specific metrics you will use to evaluate success and confirm the trial period is long enough to produce meaningful data. Two weeks of data from a support agent handling your actual ticket volume is far more reliable than any vendor benchmark.',
  },
]

const faqItems = [
  {
    q: 'What are the best AI agents for ecommerce stores in 2026?',
    a: 'The strongest AI agents for ecommerce in 2026 vary by use case. For customer support, Tidio and Gorgias are purpose-built for ecommerce with native Shopify and WooCommerce integrations. For marketing content and product descriptions, Jasper and Copy.ai produce volume output consistently. For B2B wholesale outreach, Apollo.io and Instantly.ai handle prospecting and email sequencing. For competitive research and trend monitoring, Perplexity AI delivers fast, cited results from live web sources. The highest-ROI starting point for most ecommerce brands is customer support automation, where the time and cost savings are immediately measurable.',
  },
  {
    q: 'Can AI agents integrate with Shopify?',
    a: 'Yes. Several AI agents have native Shopify integrations including Tidio and Gorgias, which can access real-time order data, customer history, and product inventory to resolve queries automatically. The depth of integration varies — some tools provide read-only access to order data, while others can initiate returns, apply discount codes, and update order status. Always verify the specific capabilities of the Shopify integration during your trial period rather than relying on general descriptions of compatibility.',
  },
  {
    q: 'What percentage of ecommerce support tickets can AI agents handle autonomously?',
    a: 'The autonomous resolution rate varies significantly by store and ticket type mix. Stores with high volumes of order status, shipping, and return queries typically see AI agents resolve 50 to 80 percent of tickets without human involvement. Stores with complex product questions, customisation requests, or high-value transactions requiring judgment see lower autonomous rates. The relevant number is not the platform benchmark but your specific ticket distribution. Request a trial and measure against your actual ticket sample rather than relying on vendor-published averages.',
  },
  {
    q: 'How do AI agents help ecommerce marketing specifically?',
    a: 'AI marketing agents help ecommerce brands in three primary ways: generating product descriptions and marketing copy at scale without proportional writing resource, running email sequences and campaigns with personalisation based on customer behaviour data, and producing ad creative variations for testing at a volume that human teams cannot match. The most measurable impact is typically in email marketing, where AI-generated subject lines, personalised product recommendations, and automated post-purchase sequences drive directly attributable revenue that can be compared to control groups.',
  },
  {
    q: 'What should an ecommerce store prioritise when starting with AI agents?',
    a: 'Start with customer support. It is the function with the clearest and fastest ROI in ecommerce — ticket deflection rate and resolution time are immediately measurable, the setup for platforms like Tidio and Gorgias is typically a few hours, and the impact on both cost and customer experience is visible within the first two weeks. Once AI support is working well, the next highest-leverage investment is usually marketing content generation, particularly for stores with large catalogues or frequent promotional campaigns where content production is a consistent bottleneck.',
  },
]

export default async function AIAgentsForEcommercePage() {
  const supabase = createClient()

  const { data: ecomAgents } = await supabase
    .from('agents')
    .select('id, name, slug, developer, short_description, pricing_model, rating_avg, editorial_rating, rating_count, is_featured, is_verified')
    .eq('is_active', true)
    .contains('industry_tags', ['ecommerce'])
    .order('editorial_rating', { ascending: false })
    .limit(6)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Best AI Agents for Ecommerce (2026)',
    description: 'The best AI agents for ecommerce in 2026. Customer support, marketing content, outbound sales, and research — chosen for platform compatibility, setup speed, and measurable ROI.',
    url: 'https://theaiagentindex.com/resources/guides/ai-agents-for-ecommerce',
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
        <span style={{ fontSize: '0.8125rem', color: '#111827' }}>AI Agents for Ecommerce</span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' as const }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Guide</span>
        <span style={{ fontSize: '0.75rem', color: '#6B7280', padding: '0.25rem 0.75rem', backgroundColor: '#F3F4F6', borderRadius: '9999px' }}>Updated May 2026</span>
      </div>

      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
        Best AI Agents for Ecommerce (2026)
      </h1>

      {/* Intro */}
      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem', maxWidth: '700px' }}>
        Ecommerce is one of the strongest use cases for AI agents. The workflows that consume the most time in an ecommerce operation — answering customer queries, producing product content, running outreach, and monitoring competitors — are high volume, repetitive, and well-suited to automation. Brands that have deployed AI agents in these functions are not just reducing cost; they are running faster and handling more volume than their team size would otherwise allow.
      </p>

      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem', maxWidth: '700px' }}>
        The tools that deliver the most value for ecommerce are purpose-built for ecommerce workflows — with native platform integrations, real-time access to order and product data, and interfaces designed for operators rather than engineers. A support agent that cannot access live order data is not useful for an ecommerce support queue. A content tool that cannot pull product attributes automatically is slower than it should be. Platform integration depth is the most important criterion when evaluating any AI agent for an ecommerce context.
      </p>

      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem', maxWidth: '700px' }}>
        The clearest and fastest ROI in ecommerce AI is customer support — ticket deflection rate and resolution time are immediately measurable, setup is typically a few hours, and the impact on both operating cost and customer experience is visible within two weeks. That is the right starting point for most brands. Marketing content, outbound sales, and research automation follow as the next layers of value once support is working well.
      </p>

      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '2rem', maxWidth: '700px' }}>
        This guide covers the best AI agents across the four functions where AI has the most documented impact in ecommerce: customer support, marketing content, outbound and wholesale sales, and competitive research. Each section includes the agents best suited for that function and the specific capability that distinguishes them for an ecommerce context.
      </p>

      {/* Use cases */}
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '3rem', marginBottom: '3.5rem' }}>
        {useCases.map((useCase) => (
          <div key={useCase.title}>
            <div style={{ paddingBottom: '0.75rem', borderBottom: '2px solid #E5E7EB', marginBottom: '0.875rem' }}>
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
            { condition: 'Your primary need is handling customer support queries 24/7', recommendation: 'Tidio or Gorgias', href: '/ai-customer-support-agents' },
            { condition: 'You need product descriptions and marketing copy at scale', recommendation: 'Jasper or Copy.ai', href: '/ai-marketing-agents' },
            { condition: 'You run a wholesale or B2B channel alongside your DTC store', recommendation: 'Apollo.io or Instantly.ai', href: '/ai-sales-agents' },
            { condition: 'You need competitive research and trend monitoring', recommendation: 'Perplexity AI', href: '/agents/perplexity-ai' },
            { condition: 'You need to automate a custom workflow across multiple tools', recommendation: 'Browse No-Code AI Builders', href: '/resources/guides/best-no-code-ai-agent-builders' },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', gap: '1rem', padding: '0.875rem 1rem', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.5rem', alignItems: 'flex-start', flexWrap: 'wrap' as const }}>
              <span style={{ fontSize: '0.875rem', color: '#374151', flex: 1 }}>If <strong>{row.condition}</strong></span>
              <Link href={row.href} style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2563EB', textDecoration: 'none', flexShrink: 0 }}>&#x2192; {row.recommendation}</Link>
            </div>
          ))}
        </div>
      </div>

      {/* Ecom agents from index */}
      {ecomAgents && ecomAgents.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }}>Ecommerce-tagged agents from the index</h2>
          <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            Additional editorially reviewed agents tagged for ecommerce use cases — all with structured data on pricing, integrations, and setup time.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {ecomAgents.map((agent) => (
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

      {/* Related resources */}
      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/ai-customer-support-agents" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>AI Support Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>Browse full category &#x2192;</p>
        </Link>
        <Link href="/resources/guides/best-ai-agents-for-small-business" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Best for Small Business</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>SMB agent guide &#x2192;</p>
        </Link>
        <Link href="/resources/guides/best-no-code-ai-agent-builders" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>No-Code AI Builders</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>Automate without code &#x2192;</p>
        </Link>
        <Link href="/resources/guides/how-to-evaluate-an-ai-agent" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>How to Evaluate an Agent</p>
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