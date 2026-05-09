import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase'
import GuideCitations from '@/components/GuideCitations'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Best No-Code AI Agent Builders (2026) | The AI Agent Index',
  description: 'The best no-code AI agent builders in 2026. Zapier, Make, and Lindy compared for workflow automation, complex logic, and purpose-built agent platforms — without writing code.',
  openGraph: {
    title: 'Best No-Code AI Agent Builders (2026)',
    description: 'The best no-code AI agent builders in 2026. Zapier, Make, and Lindy compared for workflow automation, complex logic, and purpose-built agent platforms — without writing code.',
    url: 'https://theaiagentindex.com/resources/guides/best-no-code-ai-agent-builders',
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary',
    title: 'Best No-Code AI Agent Builders (2026)',
    description: 'Best no-code AI agent builders compared — Zapier, Make, and Lindy. Editorially reviewed.',
  },
  alternates: {
    canonical: 'https://theaiagentindex.com/resources/guides/best-no-code-ai-agent-builders',
  },
}

const platforms = [
  {
    name: 'Zapier',
    slug: 'zapier',
    tier: '#1 for integrations',
    description: `Zapier is the most widely used no-code automation platform in the world, connecting over 8,000 business applications. Its AI agent capability, built on top of that integration layer, allows you to insert LLM reasoning steps into existing Zap workflows. An AI Action in Zapier can classify an inbound email, draft a response, extract structured data from unstructured text, or make a routing decision — all within a workflow that then passes the output to another application automatically.

The fundamental strength of Zapier for no-code AI agents is its integration breadth. If your workflow touches tools that already have Zapier integrations, connecting AI reasoning to those tools requires no engineering work. The weakness is depth of reasoning: Zapier is designed for sequential automation, and complex conditional logic with multiple AI decision branches becomes unwieldy in the Zap interface. It is excellent for inserting one or two AI steps into an otherwise standard automation. It is less suited for building agents that need to reason across multiple steps with dynamic context.

Zapier AI works best for teams that already have Zapier in their stack and want to add AI decision-making to existing workflows without rebuilding them. The learning curve is low because the interface is familiar. The per-task pricing model means costs are predictable at moderate volumes but can scale quickly for high-volume automations.`,
    bestFor: 'Teams adding AI steps to existing Zapier workflows',
    limitation: 'Limited reasoning depth for complex multi-step agent logic',
  },
  {
    name: 'Make',
    slug: 'make',
    tier: '#1 for complex logic',
    description: `Make (formerly Integromat) occupies the space between Zapier and custom code. Its visual canvas interface allows significantly more complex workflow logic than Zapier — branching paths, iterators, aggregators, and conditional routing can all be configured visually without writing code. Its AI modules allow you to call LLMs at any point in a scenario, parse the output, route based on the result, and pass structured data to the next action.

For no-code AI agents that need to handle variable inputs and produce different outputs depending on content, Make's conditional logic is a genuine advantage over Zapier. You can build scenarios where an inbound lead is classified by industry and company size, routed to different enrichment workflows based on the result, and the output is formatted differently for each CRM destination — all without code. This kind of multi-branch, context-sensitive automation is where Zapier becomes unwieldy and Make stays manageable.

The trade-off is a steeper learning curve. Make's interface requires more investment to understand than Zapier's, and the volume of configuration options can be overwhelming for new users. For teams that need integration breadth and are willing to invest time in the platform, Make produces more sophisticated no-code agent workflows than any other tool in this category. The pricing is generally more competitive than Zapier at higher operation volumes.`,
    bestFor: 'Complex multi-step workflows with conditional logic and branching',
    limitation: 'Steeper learning curve — takes time to use effectively',
  },
  {
    name: 'Lindy',
    slug: 'lindy',
    tier: '#1 for agent-native builds',
    description: `Lindy is purpose-built as a no-code AI agent platform rather than an automation tool with AI features added. The distinction matters in practice. Where Zapier and Make are fundamentally workflow builders that now support LLM steps, Lindy starts from the premise that you are building an AI agent — something that monitors, reasons, and takes action — and provides an interface designed around that use case.

Lindy's chat-based builder lets you describe what you want the agent to do in plain language, and the platform translates that into a configured agent with the appropriate triggers, memory, and actions. Native integrations cover the core business tools where agents need to take action: Gmail, HubSpot, Salesforce, Slack, and calendar platforms. The agents Lindy produces can handle email triage, meeting scheduling, lead qualification, CRM updates, and customer outreach with a level of autonomous operation that feels qualitatively different from a Zapier workflow with an AI step in the middle.

The limitation is pricing transparency and volume predictability. Lindy's per-action model works well for moderate-volume agents but can scale unexpredictably for high-frequency use cases. It also has fewer integrations than Zapier's 8,000+ app catalogue, which matters if your workflow depends on tools outside Lindy's native connection set. For teams building their first AI agent and wanting the experience to feel like building an agent rather than configuring a workflow, Lindy is the most accessible starting point.`,
    bestFor: 'Building purpose-built AI agents that monitor, reason, and act autonomously',
    limitation: 'Fewer integrations than Zapier; per-action pricing scales unpredictably at volume',
  },
]

const evaluationCriteria = [
  {
    title: 'Workflow automation vs agent-native',
    detail: 'Zapier and Make are automation platforms that added AI capabilities. Lindy is an agent-native platform from the start. The distinction affects how the tool handles context, memory, and multi-step reasoning. If you are building something that executes a fixed sequence of steps, automation platforms work well. If you are building something that needs to adapt its behaviour based on what it encounters, agent-native platforms produce better results.',
  },
  {
    title: 'Integration depth vs integration breadth',
    detail: 'Zapier wins on breadth — 8,000+ app connections. Lindy and Make have fewer integrations but often deeper functionality within the integrations they support. Before selecting a platform, list every tool your agent needs to read from or write to, and verify that the integrations you need exist and are bidirectional. A platform with 8,000 integrations that does not support your CRM in the direction you need is not more useful than one with 50.',
  },
  {
    title: 'Pricing model and volume predictability',
    detail: 'All three platforms charge based on usage, but the models differ. Zapier charges by task (each action in a Zap is a task). Make charges by operation. Lindy charges by action. At low volumes, the differences are marginal. At high volumes, costs can diverge significantly. Before committing, model your expected monthly operation count against the pricing tiers of each platform. Build in a 2x buffer for volume growth in the first six months.',
  },
  {
    title: 'Human review configuration',
    detail: 'No-code AI agents will make mistakes, especially when they encounter inputs outside their training scenarios. The best platforms let you configure human review checkpoints for specific decision types or output confidence thresholds. Before deploying any agent that sends external communications or makes changes to records, confirm that you can require human approval for any action the agent is uncertain about. Fully autonomous operation on day one is rarely appropriate.',
  },
  {
    title: 'Error handling and failure visibility',
    detail: 'When a no-code agent fails — because an API call timed out, a field was missing, or the LLM returned unexpected output — how visible is the failure and how does the platform recover? Zapier and Make have mature error logging and retry mechanisms from years of automation use. Newer agent-native platforms vary significantly. Test failure scenarios explicitly during your evaluation period rather than discovering your agent silently drops tasks in production.',
  },
]

const TOP_PICK_SLUGS = ['zapier', 'make', 'lindy']
const NO_CODE_AGENT_TYPES = ['workflow-builder', 'multi-agent-orchestration', 'browser-automation']

const faqItems = [
  {
    q: 'Can you build a genuinely useful AI agent without coding?',
    a: 'Yes, with realistic expectations about what no-code agents can do. No-code AI agents built on platforms like Zapier, Make, or Lindy can handle email triage, lead qualification, CRM updates, document summarisation, support ticket routing, and scheduling workflows effectively without engineering resource. Where no-code agents become limited is in complex reasoning tasks that require dynamic context across many steps, custom integrations with systems that lack API support, or high-volume operations where per-action pricing becomes prohibitive. For most business automation use cases in sales, marketing, support, and operations, no-code is sufficient.',
  },
  {
    q: 'What is the difference between a no-code AI agent and a no-code automation workflow?',
    a: 'A no-code automation workflow executes a fixed sequence of steps when triggered. It does what you programmed it to do, regardless of context. A no-code AI agent applies reasoning to decide what to do next based on the content it is processing. The same inbound email that would route to a fixed destination in a Zapier workflow might be classified, prioritised, and responded to differently by a Lindy agent based on the email content, sender history, and current context. The practical distinction is that agents handle variable inputs better; workflows handle predictable, structured processes better.',
  },
  {
    q: 'Which platform is best for a non-technical founder building their first AI agent?',
    a: 'Lindy has the lowest barrier to entry for someone with no automation experience who wants to build an AI agent specifically. Its chat-based builder accepts natural language descriptions of what you want the agent to do. Zapier is the better choice if you are already familiar with it and want to add AI steps to existing automations. Make is more powerful than either but requires more time investment to learn. Start with the platform you have the least to learn, get something working, and evaluate whether its limitations require moving to a more capable tool.',
  },
  {
    q: 'How much does it cost to run a no-code AI agent?',
    a: 'Costs depend on volume and platform. Zapier starts at around $20 per month for 750 tasks per month on the Starter plan, scaling to $100 per month for 2,000 tasks on Professional. Make starts at $9 per month for 10,000 operations. Lindy pricing is usage-based with a free tier for initial testing. At low volumes all three are affordable. At high volumes, costs scale with usage and can become significant. The LLM calls embedded in agent workflows add cost on top of the platform fees. Model the full cost including platform fees and estimated LLM call volume before committing to any platform at scale.',
  },
  {
    q: 'What are the most common failure modes for no-code AI agents?',
    a: 'The most common failures are: the agent encounters an input format it was not configured for and produces incorrect output silently; the LLM reasoning step returns an unexpected format that breaks the subsequent automation step; rate limits on connected APIs cause the agent to fail mid-sequence without clear error messaging; and volume growth makes the per-action pricing unexpectedly expensive. All of these are manageable with proper configuration, testing on a range of real inputs before full deployment, and human review checkpoints for consequential actions. The agents that fail are usually the ones deployed without testing edge cases in advance.',
  },
]

export default async function BestNoCodeAIAgentBuildersPage() {
  const supabase = createClient()

  const { data: poolData } = await supabase
    .from('agents')
    .select('id, name, slug, developer, short_description, pricing_model, rating_avg, editorial_rating, rating_count, is_featured, is_verified, capability_tags, agent_type')
    .eq('is_active', true)
    .in('agent_type', NO_CODE_AGENT_TYPES)
    .order('editorial_rating', { ascending: false })
    .limit(20)

  const agents = (poolData ?? [])
    .filter(a => !TOP_PICK_SLUGS.includes(a.slug))
    .slice(0, 6)

  const { count: agentCount } = await supabase
    .from('agents')
    .select('slug', { count: 'exact', head: true })
    .eq('is_active', true)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Best No-Code AI Agent Builders (2026)',
    description: 'The best no-code AI agent builders in 2026. Zapier, Make, and Lindy compared for workflow automation, complex logic, and purpose-built agent platforms.',
    url: 'https://theaiagentindex.com/resources/guides/best-no-code-ai-agent-builders',
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
        <span style={{ fontSize: '0.8125rem', color: '#111827' }}>Best No-Code AI Agent Builders</span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' as const }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Guide</span>
        <span style={{ fontSize: '0.75rem', color: '#6B7280', padding: '0.25rem 0.75rem', backgroundColor: '#F3F4F6', borderRadius: '9999px' }}>Updated May 2026</span>
      </div>

      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
        Best No-Code AI Agent Builders (2026)
      </h1>

      {/* Intro */}
      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem', maxWidth: '700px' }}>
        Building an AI agent no longer requires an engineering team. The gap between having a workflow problem and being able to deploy an AI agent to solve it has narrowed significantly in the past two years. Non-technical founders, operators, and marketers are now building agents that handle email triage, lead qualification, CRM updates, document summarisation, and customer outreach without writing a line of code.
      </p>
      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem', maxWidth: '700px' }}>
        The no-code AI agent market splits into two distinct categories. The first is general automation platforms — Zapier and Make — that were built for workflow automation and have added AI capabilities on top. These tools excel at connecting large numbers of business applications with AI decision-making in the middle. The second is agent-native platforms — led by Lindy — that were designed from the start to build AI agents rather than workflows. These tools handle variable inputs and autonomous reasoning more naturally, but with fewer integrations and less mature error handling.
      </p>
      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem', maxWidth: '700px' }}>
        The right platform depends on what you are building. If your agent needs to connect to many existing tools in a predictable sequence, Zapier or Make are the better starting point. If you are building something that needs to reason, adapt its behaviour based on content, and take autonomous action with minimal configuration, an agent-native platform produces a qualitatively better result for the same investment of time.
      </p>
      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '2rem', maxWidth: '700px' }}>
        This guide covers the three strongest no-code AI agent platforms in 2026, what each is best suited for, and how to evaluate them against your specific use case. All three have meaningful limitations — understanding those limitations before committing saves significant time and rework.
      </p>

      <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '3rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#0369A1', lineHeight: 1.6, margin: 0 }}>
          <strong>Building something more custom?</strong> Read our full guide: <Link href="/resources/guides/how-to-build-an-ai-agent" style={{ color: '#2563EB' }}>How to Build an AI Agent</Link> — covers the workflow vs agent distinction, production architecture, and the most common failure modes.
        </p>
      </div>

      {/* Platform cards */}
      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '1.25rem' }}>Top no-code AI agent platforms</h2>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '1.5rem', marginBottom: '3.5rem' }}>
        {platforms.map((platform) => (
          <div key={platform.name} style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
            <div style={{ backgroundColor: '#F9FAFB', padding: '1.25rem 1.5rem', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' as const }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.2rem 0.625rem', borderRadius: '9999px' }}>{platform.tier}</span>
              <h3 style={{ fontWeight: 700, fontSize: '1.0625rem', color: '#111827', margin: 0 }}>{platform.name}</h3>
              <Link href={'/agents/' + platform.slug} style={{ fontSize: '0.8125rem', color: '#2563EB', fontWeight: 500, marginLeft: 'auto', textDecoration: 'none' }}>View profile &#x2192;</Link>
            </div>
            <div style={{ padding: '1.5rem' }}>
              {platform.description.split('\n\n').map((para, i) => (
                <p key={i} style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.75, marginBottom: '1rem' }}>{para}</p>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' }}>
                <div style={{ backgroundColor: '#F0FDF4', borderRadius: '0.5rem', padding: '0.75rem 1rem' }}>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#16A34A', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: '0.375rem' }}>Best for</p>
                  <p style={{ fontSize: '0.8125rem', color: '#374151', lineHeight: 1.5, margin: 0 }}>{platform.bestFor}</p>
                </div>
                <div style={{ backgroundColor: '#FEF3C7', borderRadius: '0.5rem', padding: '0.75rem 1rem' }}>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#D97706', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: '0.375rem' }}>Limitation</p>
                  <p style={{ fontSize: '0.8125rem', color: '#374151', lineHeight: 1.5, margin: 0 }}>{platform.limitation}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Evaluation criteria */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>What to look for when evaluating no-code AI agent platforms</h2>
        <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1.5rem' }}>
          The platform you choose shapes what your agent can do and how much it costs to run. These are the criteria that matter most before committing.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.875rem' }}>
          {evaluationCriteria.map((criterion, i) => (
            <div key={i} style={{ padding: '1.25rem', border: '1px solid #E5E7EB', borderRadius: '0.75rem', backgroundColor: 'white' }}>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>{criterion.title}</h3>
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
            { condition: 'You need to connect AI to many existing tools with minimal setup', recommendation: 'Zapier', href: '/agents/zapier' },
            { condition: 'You need complex conditional logic and branching across multiple AI steps', recommendation: 'Make', href: '/agents/make' },
            { condition: 'You want to build an autonomous agent that reasons and acts without a fixed workflow', recommendation: 'Lindy', href: '/agents/lindy' },
            { condition: 'You need something beyond no-code capability', recommendation: 'How to Build an AI Agent guide', href: '/resources/guides/how-to-build-an-ai-agent' },
            { condition: 'You want to browse all workflow automation agents in the index', recommendation: 'Browse AI Workflow Agents', href: '/ai-workflow-agents' },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', gap: '1rem', padding: '0.875rem 1rem', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.5rem', alignItems: 'flex-start', flexWrap: 'wrap' as const }}>
              <span style={{ fontSize: '0.875rem', color: '#374151', flex: 1 }}>If <strong>{row.condition}</strong></span>
              <Link href={row.href} style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2563EB', textDecoration: 'none', flexShrink: 0 }}>&#x2192; {row.recommendation}</Link>
            </div>
          ))}
        </div>
      </div>

      {/* More agents from the index */}
      {agents && agents.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }}>More no-code AI agents from the index</h2>
          <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            Additional agents from the index built for workflow automation, multi-agent orchestration, and browser-based automation — all deployable without writing code.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {agents.map((agent) => (
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
        <Link href="/resources/guides/how-to-build-an-ai-agent" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Build from scratch</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>Full technical guide &#x2192;</p>
        </Link>
        <Link href="/stacks" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Agent Stacks</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>Curated multi-agent workflows &#x2192;</p>
        </Link>
        <Link href="/resources/guides/how-to-evaluate-an-ai-agent" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Evaluate before buying</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>Buying framework &#x2192;</p>
        </Link>
        <Link href="/ai-workflow-agents" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Browse AI Workflow Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>{agentCount ?? 0}+ agents indexed &#x2192;</p>
        </Link>
      </div>

      <p style={{ fontSize: '0.875rem', color: '#9CA3AF', lineHeight: 1.6 }}>
        All agents listed are editorially reviewed by The AI Agent Index. See our <Link href="/methodology" style={{ color: '#6B7280' }}>editorial methodology</Link>.
      </p>

      <GuideCitations slug="best-no-code-ai-agent-builders" table="guides" />
    </div>
  )
}