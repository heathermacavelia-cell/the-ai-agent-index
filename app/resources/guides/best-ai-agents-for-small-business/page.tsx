import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase'
import GuideCitations from '@/components/GuideCitations'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Best AI Agents for Small Business (2026) | The AI Agent Index',
  description: 'The best AI agents for small businesses in 2026. Covers sales, customer support, marketing, and research — chosen for budget, speed to value, and no-IT-team deployment.',
  openGraph: {
    title: 'Best AI Agents for Small Business (2026)',
    description: 'The best AI agents for small businesses in 2026. Sales, support, marketing, and research — chosen for budget, speed to value, and no-IT-team deployment.',
    url: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-small-business',
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary',
    title: 'Best AI Agents for Small Business (2026)',
    description: 'Best AI agents for small business — sales, support, marketing, and research. Chosen for budget and fast deployment.',
  },
  alternates: {
    canonical: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-small-business',
  },
}

const categories = [
  {
    title: 'AI sales agents for small business',
    slug: 'ai-sales-agents',
    description: `Sales is the function where AI gives small businesses the most disproportionate advantage. A five-person team using AI for outbound prospecting and follow-up can generate the pipeline of a team three times its size. The work that AI agents handle best in sales — finding prospects, personalising outreach, sending sequences, and following up consistently — is exactly the work that gets deprioritised or done inconsistently when one person is covering sales alongside everything else.

The agents that work best for small businesses in sales are ones that require minimal setup, integrate with email providers you already use, and produce results quickly enough to justify the cost within the first month. Long implementation timelines and complex onboarding are enterprise problems. For a small business, if an agent is not delivering value in two weeks, it is the wrong tool.`,
    picks: [
      {
        name: 'Instantly.ai',
        slug: 'instantly-ai',
        reason: 'Instantly is built specifically for cold email outreach at small team scale. Unlimited sending accounts on paid plans mean you can warm up multiple domains and protect deliverability without managing a complex sending infrastructure. Sequences, A/B testing, and basic CRM functionality are all included. At $37 per month to start, it is one of the strongest value plays in outbound sales for small businesses. No engineering setup required — teams are typically sending within a day of signing up.',
      },
      {
        name: 'Apollo.io',
        slug: 'apollo-io',
        reason: 'Apollo combines a B2B prospecting database of over 275 million contacts with built-in email sequencing, making it the most complete single-tool outbound solution for small businesses that do not want to stack multiple products. The freemium tier is genuinely useful — enough to validate whether outbound works for your market before committing to a paid plan. For small businesses doing their first structured outbound motion, Apollo removes the need for a separate data provider, enrichment tool, and sequencing platform.',
      },
    ],
  },
  {
    title: 'AI customer support agents for small business',
    slug: 'ai-customer-support-agents',
    description: `Customer support is the function that scales worst with a small team. As the business grows, support volume grows with it — but adding headcount to handle support is expensive and often the wrong investment at early stages. AI support agents solve this by handling the high-volume, repetitive queries that consume the majority of support time: order status, product questions, returns, account access, and FAQs.

The small business case for AI customer support is particularly strong because the alternative is often the business owner or a single team member answering the same questions repeatedly. An AI agent that resolves 60 to 80 percent of inbound queries autonomously gives that time back for work that actually requires human judgment. The important thing for small businesses is to choose an agent that escalates cleanly to a human when it encounters something it cannot handle — a frustrated customer who cannot reach a person after failing with the bot is worse than no bot at all.`,
    picks: [
      {
        name: 'Intercom Fin',
        slug: 'intercom-fin',
        reason: 'Fin is Intercom\'s AI support agent and one of the strongest performing tools in the customer support category for autonomous resolution rates. It answers questions using your existing help content and product documentation, handles multi-turn conversations, and hands off to a human agent with full conversation context when it cannot resolve an issue. For small businesses already using Intercom for customer communication, adding Fin requires minimal additional setup. For businesses new to the platform, the combined cost of Intercom plus Fin is worth evaluating against simpler alternatives.',
      },
      {
        name: 'Tidio',
        slug: 'tidio',
        reason: 'Tidio is built with small business affordability in mind. Its AI support agent handles common queries, qualifies leads from chat, and integrates directly with Shopify, WooCommerce, and other ecommerce platforms — making it particularly well-suited for small online retailers. The interface is significantly simpler than enterprise support platforms, and the setup time is measured in hours rather than days. For businesses that need AI customer support without a complex implementation, Tidio is one of the most accessible starting points available.',
      },
    ],
  },
  {
    title: 'AI marketing agents for small business',
    slug: 'ai-marketing-agents',
    description: `Marketing is the function most chronically understaffed at small businesses. The content, copy, and campaign work that drives growth requires consistent output — blog posts, social content, email newsletters, ad copy, landing page text — and producing that volume manually without a dedicated marketing team is rarely sustainable. AI marketing agents do not replace the strategic thinking that makes marketing work, but they dramatically reduce the time required to produce the content that executes on that strategy.

For small businesses, the best marketing AI agents are ones that produce usable first drafts quickly, maintain a consistent brand voice, and integrate with the publishing platforms where content needs to go. The goal is not to automate marketing judgment — it is to remove the bottleneck of production so that one person can execute a marketing plan that would otherwise require a team.`,
    picks: [
      {
        name: 'Jasper',
        slug: 'jasper',
        reason: 'Jasper is one of the most mature AI content generation platforms available and has the broadest template library for marketing use cases: blog posts, ad copy, product descriptions, email subject lines, social captions, and more. Its Brand Voice feature learns your tone and applies it consistently across outputs, which matters significantly for small businesses where brand consistency is often inconsistent simply because different people write different things. Jasper is not the cheapest option in this category, but for businesses producing content at volume, the quality and consistency of output justifies the cost.',
      },
      {
        name: 'Copy.ai',
        slug: 'copy-ai',
        reason: 'Copy.ai covers the most common small business marketing copy needs — landing pages, email campaigns, social posts, product descriptions, and sales scripts — with a generous free tier that makes it genuinely usable before committing to a paid plan. The interface is straightforward enough that someone with no marketing background can produce reasonable first drafts quickly. For bootstrapped businesses that need to test whether AI-assisted content improves their marketing before investing further, Copy.ai is the lowest-friction starting point in this category.',
      },
    ],
  },
  {
    title: 'AI research agents for small business',
    slug: 'ai-research-agents',
    description: `Small business owners make decisions with less information than they should, not because they do not value data, but because gathering it manually takes time they do not have. Competitive research, market sizing, supplier evaluation, regulatory requirements, industry trends — all of these require the same manual search-and-synthesise process that AI research agents now handle in minutes.

The research use case for small businesses is broad. It covers competitive intelligence before a sales call, background research on a prospective client, understanding a new market before entering it, summarising industry reports, and synthesising customer feedback. The agents that work best here are the ones that search live web sources rather than relying solely on training data, and that provide citations so outputs can be verified before being acted on.`,
    picks: [
      {
        name: 'Perplexity AI',
        slug: 'perplexity-ai',
        reason: 'Perplexity is the most accessible AI research tool available and one of the highest-value ones for small business owners doing their own research. It answers questions using live web sources and provides citations for every claim, which means outputs are verifiable rather than requiring trust in an opaque AI system. For competitive research, market background, regulatory questions, and quick synthesis tasks, Perplexity delivers results in seconds that would take 30 minutes of manual searching to replicate. The free tier handles most small business research needs.',
      },
      {
        name: 'ChatGPT Deep Research',
        slug: 'chatgpt-deep-research',
        reason: 'ChatGPT\'s Deep Research mode is a multi-step research agent that searches the web, follows relevant sources, synthesises findings, and produces a structured report on a given topic. For more complex research tasks — a thorough competitive analysis, a market entry report, or a detailed comparison of vendors in a category — Deep Research produces longer, more structured outputs than Perplexity\'s conversational format. It requires a ChatGPT Plus or Pro subscription but delivers research quality that would take a junior analyst several hours to replicate manually.',
      },
    ],
  },
]

const evaluationCriteria = [
  {
    title: 'Price-to-value at your actual volume',
    detail: 'Most AI agents are priced by usage — emails sent, conversations handled, content pieces generated, or searches run. Before committing to a paid plan, calculate your expected monthly usage and compare it against the pricing tiers. The ROI equation for a small business is straightforward: if an agent costs $100 per month and saves five hours of work per week, it is delivering $1,000 per month in value at a $50 hourly rate. Any agent that does not pass this basic test is not the right tool at the right price point.',
  },
  {
    title: 'Time to first value — measured in days, not months',
    detail: 'Enterprise AI agents have implementation timelines measured in weeks or months. That is not acceptable for a small business evaluating whether a tool is worth keeping. The best SMB-oriented agents are designed to be self-service: you sign up, connect your existing tools, configure the agent using an interface that requires no technical knowledge, and see results within the first week. If an agent requires professional services, a dedicated implementation team, or more than a few hours of setup, it was not built for small businesses regardless of how it is marketed.',
  },
  {
    title: 'Integration with tools you already use',
    detail: 'Every new tool a small team adopts creates overhead. The best AI agents reduce that overhead by connecting to the tools already in use rather than requiring new workflows. Before evaluating any agent, list the three to five tools it needs to integrate with — your email provider, CRM, support platform, or content management system — and verify those integrations are native and bidirectional. An agent that requires you to change your workflow to use it will not be used consistently.',
  },
  {
    title: 'Self-service support and documentation quality',
    detail: 'Small businesses do not have IT departments or dedicated tool administrators. When something breaks or needs reconfiguration, a team member has to figure it out independently. Evaluate the quality of a vendor\'s documentation, the responsiveness of their support, and whether there is an active user community before committing. A tool with excellent capability but poor documentation creates ongoing operational friction that erodes the time savings it was supposed to produce.',
  },
  {
    title: 'Transparent pricing with no hidden scale costs',
    detail: 'Some AI agents have attractive entry pricing that becomes significantly more expensive as usage grows. Usage-based models can produce unexpected costs when volume spikes. Before signing up, understand exactly what triggers higher pricing tiers and model what your costs would look like at two times and five times your current expected usage. Tools that obscure pricing complexity behind sales conversations are usually more expensive at scale than tools with published, transparent pricing pages.',
  },
]

const faqItems = [
  {
    q: 'What are the best AI agents for small businesses in 2026?',
    a: 'The strongest AI agents for small businesses vary by function. For outbound sales, Instantly.ai and Apollo.io cover prospecting and email sequences at SMB-appropriate pricing. For customer support, Intercom Fin and Tidio handle high-volume first-tier queries autonomously. For marketing content, Jasper and Copy.ai produce usable first drafts across formats. For research, Perplexity AI and ChatGPT Deep Research synthesise information from live web sources. The right starting point is the function that is most understaffed in your business — pick one, get it working, then expand.',
  },
  {
    q: 'Can a small business afford AI agents?',
    a: 'Yes. The majority of AI agents listed in this guide have free tiers or plans starting under $50 per month. More importantly, the ROI calculation for small businesses is often more compelling than for large ones: when one person is covering a function that would require two or three people without AI assistance, the value of an agent that makes that person twice as effective is immediately measurable. The right question is not whether a small business can afford AI agents but which function will produce the clearest return most quickly.',
  },
  {
    q: 'How long does it take to deploy an AI agent as a small business?',
    a: 'For the tools recommended in this guide, deployment is measured in hours to days, not weeks. Instantly.ai and Apollo.io typically have teams sending outbound within 24 hours of signing up. Tidio and Intercom Fin can be live on a website in an afternoon. Jasper and Copy.ai require no technical setup at all. The agents that take longer to deploy — those requiring custom integrations, training on proprietary data, or professional services — are generally not the right choice for small businesses where fast time to value is a primary requirement.',
  },
  {
    q: 'Should a small business use one AI agent or several?',
    a: 'Start with one, in the function where you have the biggest gap between what needs to happen and what your team can currently deliver. Spreading AI investment across multiple functions simultaneously makes it harder to measure what is working and produces shallower adoption in each area. Once one agent is genuinely embedded in your workflow and delivering measurable value, evaluate the next highest-leverage function. Most small businesses that have built effective AI stacks did so sequentially over six to twelve months, not by deploying everything at once.',
  },
  {
    q: 'What are the most common mistakes small businesses make when adopting AI agents?',
    a: 'The most common failure modes are: choosing an agent based on features rather than fit for the specific workflow it needs to handle; deploying without configuring the agent against your actual use cases and testing it before going live; underestimating the time required to integrate the agent with existing tools; and not tracking a clear metric that defines whether the agent is delivering value. A well-chosen AI agent that is properly configured and measured will typically show clear ROI within 30 days. If it does not, the tool is either wrong for the use case or was not set up correctly.',
  },
]

export default async function BestAIAgentsForSmallBusinessPage() {
  const supabase = createClient()

  const { data: smbAgents } = await supabase
    .from('agents')
    .select('id, name, slug, developer, short_description, pricing_model, rating_avg, editorial_rating, rating_count, is_featured, is_verified, capability_tags')
    .eq('is_active', true)
    .contains('industry_tags', ['smb'])
    .order('editorial_rating', { ascending: false })
    .limit(6)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Best AI Agents for Small Business (2026)',
    description: 'The best AI agents for small businesses in 2026. Sales, support, marketing, and research — chosen for budget, speed to value, and no-IT-team deployment.',
    url: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-small-business',
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
        <span style={{ fontSize: '0.8125rem', color: '#111827' }}>Best AI Agents for Small Business</span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' as const }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Guide</span>
        <span style={{ fontSize: '0.75rem', color: '#6B7280', padding: '0.25rem 0.75rem', backgroundColor: '#F3F4F6', borderRadius: '9999px' }}>Updated May 2026</span>
      </div>

      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
        Best AI Agents for Small Business (2026)
      </h1>

      {/* Intro */}
      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem', maxWidth: '700px' }}>
        The gap between what a five-person team can accomplish and what a fifty-person team can accomplish is closing. AI agents are handling the work that used to require headcount: outbound prospecting, customer support, content production, and research. Small businesses that adopt the right agents are not just more efficient — they are competing effectively in functions where they previously could not afford to compete at all.
      </p>
      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem', maxWidth: '700px' }}>
        The AI agent landscape is built primarily for enterprise buyers. Most marketing, most pricing complexity, and most implementation overhead is designed around organisations with IT departments, procurement teams, and six-month deployment timelines. This guide cuts through that to focus on what actually works for small businesses: tools with transparent pricing under $200 per month, self-service setup that does not require an engineering team, and fast enough time to value that you know within 30 days whether the investment is worth keeping.
      </p>
      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem', maxWidth: '700px' }}>
        The agents recommended here are chosen for four specific functions: sales, customer support, marketing, and research. These are the functions most commonly understaffed in small businesses and the ones where AI agents produce the most measurable impact relative to cost.
      </p>
      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '2rem', maxWidth: '700px' }}>
        The most effective approach is to start with one function — whichever has the largest gap between what needs to happen and what your team can currently deliver — and automate it properly before expanding to others. Shallow adoption across multiple areas produces worse results than deep adoption in one.
      </p>

      <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '3rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#0369A1', lineHeight: 1.6, margin: 0 }}>
          <strong>How to use this guide:</strong> Start with the category that is most understaffed in your business. Pick one agent, get it working, measure the result, then expand. One agent embedded properly outperforms three agents adopted halfway.
        </p>
      </div>

      {/* Category sections */}
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '3rem', marginBottom: '3.5rem' }}>
        {categories.map((cat) => (
          <div key={cat.title}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '2px solid #E5E7EB' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', margin: 0 }}>{cat.title}</h2>
              <Link href={'/' + cat.slug} style={{ fontSize: '0.8125rem', color: '#2563EB', textDecoration: 'none', fontWeight: 500, flexShrink: 0, marginLeft: '1rem' }}>Browse all &#x2192;</Link>
            </div>
            {cat.description.split('\n\n').map((para, i) => (
              <p key={i} style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.75, marginBottom: '1rem', maxWidth: '700px' }}>{para}</p>
            ))}
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.875rem', marginTop: '0.5rem' }}>
              {cat.picks.map((pick) => (
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
        <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>How to evaluate AI agents as a small business</h2>
        <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1.5rem' }}>
          The evaluation criteria that matter for enterprise buyers are often the wrong ones for small businesses. These are the questions that actually determine whether a tool delivers value at small business scale.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.875rem' }}>
          {evaluationCriteria.map((item) => (
            <div key={item.title} style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.25rem 1.5rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.5rem' }}>{item.title}</h3>
              <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.7, margin: 0 }}>{item.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Decision framework */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>How to choose</h2>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.75rem' }}>
          {[
            { condition: 'Your biggest gap is outbound sales and prospecting', recommendation: 'Apollo.io or Instantly.ai', href: '/ai-sales-agents' },
            { condition: 'You are spending too much time on repetitive customer support', recommendation: 'Intercom Fin or Tidio', href: '/ai-customer-support-agents' },
            { condition: 'Marketing content is a bottleneck — not enough output, not enough consistency', recommendation: 'Jasper or Copy.ai', href: '/ai-marketing-agents' },
            { condition: 'You need faster, better-sourced research for decisions and sales calls', recommendation: 'Perplexity AI', href: '/agents/perplexity-ai' },
            { condition: 'You want to automate a workflow that spans multiple tools', recommendation: 'Browse No-Code AI Agent Builders', href: '/resources/guides/best-no-code-ai-agent-builders' },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', gap: '1rem', padding: '0.875rem 1rem', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.5rem', alignItems: 'flex-start', flexWrap: 'wrap' as const }}>
              <span style={{ fontSize: '0.875rem', color: '#374151', flex: 1 }}>If <strong>{row.condition}</strong></span>
              <Link href={row.href} style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2563EB', textDecoration: 'none', flexShrink: 0 }}>&#x2192; {row.recommendation}</Link>
            </div>
          ))}
        </div>
      </div>

      {/* SMB agents from index */}
      {smbAgents && smbAgents.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }}>SMB-tagged agents from the index</h2>
          <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            Additional agents from the index tagged for SMB use cases — all editorially reviewed with structured data on pricing, integrations, and setup time.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {smbAgents.map((agent) => (
              <Link key={agent.slug} href={'/agents/' + agent.slug}
                style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: '1px solid #E5E7EB', padding: '1.25rem', textDecoration: 'none', display: 'block' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#111827' }}>{agent.name}</span>
                  {agent.is_verified && (
                    <span style={{ fontSize: '0.625rem', fontWeight: 700, backgroundColor: '#DCFCE7', color: '#16A34A', padding: '0.1rem 0.4rem', borderRadius: '9999px', textTransform: 'uppercase' as const }}>Verified</span>
                  )}
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
        <Link href="/ai-sales-agents" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>AI Sales Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>Browse full category &#x2192;</p>
        </Link>
        <Link href="/resources/guides/best-no-code-ai-agent-builders" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>No-Code AI Builders</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>Build without engineering &#x2192;</p>
        </Link>
        <Link href="/resources/guides/how-to-evaluate-an-ai-agent" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>How to Evaluate an Agent</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>Buying framework &#x2192;</p>
        </Link>
        <Link href="/resources/guides/best-ai-agents-for-outbound-sales" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Best for Outbound Sales</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>Full sales agent guide &#x2192;</p>
        </Link>
      </div>

      <p style={{ fontSize: '0.875rem', color: '#9CA3AF', lineHeight: 1.6 }}>
        All agents listed are editorially reviewed by The AI Agent Index. See our <Link href="/methodology" style={{ color: '#6B7280' }}>editorial methodology</Link>.
      </p>

      <GuideCitations slug="best-ai-agents-for-small-business" table="guides" />
    </div>
  )
}