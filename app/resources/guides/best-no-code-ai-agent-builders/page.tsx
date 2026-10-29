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
const GUIDE_SLUGS = ['lindy', 'make', 'zapier']

// The agents this guide lists, in this order.
// Chosen by hand (Heather, 2026-10-29) - never by tag. Order is editorial, not a ranking.
const GUIDE_GROUPS: GuideGroup[] = [
  {
    heading: 'No-code builders',
    intro: 'Two workflow builders that added AI steps, and an AI teammate you ask for work in plain language.',
    slugs: ['zapier', 'make', 'lindy'],
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
  title: '3 No-Code AI Agent Builders Compared (2026)',
  description: 'Zapier for integrations, Make.com for logic, Lindy for an AI teammate you ask in Slack. Pricing models, limitations, and which to pick first.',
  openGraph: {
    title: '3 No-Code AI Agent Builders Compared (2026)',
    description: 'Zapier for integrations, Make.com for logic, Lindy for an AI teammate you ask in Slack. Pricing models, limitations, and which to pick first.',
    url: 'https://theaiagentindex.com/resources/guides/best-no-code-ai-agent-builders',
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary',
    title: '3 No-Code AI Agent Builders Compared (2026)',
    description: 'Zapier for integrations, Make.com for logic, Lindy for an AI teammate you ask in Slack. Pricing models, limitations, and which to pick first.',
  },
  alternates: {
    canonical: 'https://theaiagentindex.com/resources/guides/best-no-code-ai-agent-builders',
  },
}

const evaluationCriteria = [
  {
    title: 'Building workflows vs asking a teammate',
    detail: '{{zapier.name}} and {{make.name}} are automation platforms that added AI steps: you build the sequence and the AI handles a decision inside it. {{lindy.name}} is an AI teammate you ask in plain language, with skills and routines for standing work. If you need a fixed sequence of steps you can audit, a workflow builder fits. If you want to hand over inbox, meeting, scheduling and CRM work without building anything, a teammate fits.',
  },
  {
    title: 'Integration depth vs integration breadth',
    detail: '{{zapier.name}} has the widest app coverage of the three, with 9,000+ app connections, against 3,500+ for {{make.name}} and 1,500+ integrations for {{lindy.name}}, which can also add any MCP server. Before selecting a platform, list every tool your agent needs to read from or write to, and verify that the integrations you need exist and are bidirectional. A platform with 9,000 integrations that does not support your CRM in the direction you need is not more useful than one with 50.',
  },
  {
    title: 'Pricing model and volume predictability',
    detail: 'The pricing models differ. {{zapier.name}} charges by task: each successful action in a Zap is a task, and triggers do not count. {{make.name}} charges by credit, the billing unit it previously called an operation. {{lindy.name}} charges per user, with each seat adding credits to a shared workspace pool; monthly credits do not roll over, and when the pool runs out it pauses credit-using work until the next reset. At low volumes, the differences are marginal. At high volumes, costs can diverge significantly. Before committing, model your expected monthly usage against the pricing tiers of each platform. Build in a 2x buffer for volume growth in the first six months.',
  },
  {
    title: 'Human review configuration',
    detail: 'No-code AI agents will make mistakes, especially when they encounter inputs outside the scenarios they were set up for. Look for platforms that let you configure human review checkpoints for specific decision types or actions. Before deploying any agent that sends external communications or makes changes to records, confirm that you can require human approval for those actions. Fully autonomous operation on day one is rarely appropriate.',
  },
  {
    title: 'Error handling and failure visibility',
    detail: 'When a no-code agent fails because an API call timed out, a field was missing, or the LLM returned unexpected output, how visible is the failure and how does the platform recover? Platforms differ in how clearly they log failed runs and whether they retry failed steps. Test failure scenarios explicitly during your evaluation period rather than discovering your agent silently drops tasks in production.',
  },
]

const faqItems = [
  {
    q: 'Can you build a genuinely useful AI agent without coding?',
    a: 'Yes, with realistic expectations about what no-code agents can do. No-code AI agents built on platforms like {{zapier.name}}, {{make.name}}, or {{lindy.name}} can handle email triage, lead qualification, CRM updates, document summarization, support ticket routing, and scheduling workflows without engineering resource. Where no-code agents become limited is in complex reasoning tasks that require dynamic context across many steps, custom integrations with systems that lack API support, or high-volume operations where usage-based pricing becomes prohibitive. For many business automation use cases in sales, marketing, support, and operations, no-code is sufficient.',
  },
  {
    q: 'What is the difference between a no-code AI agent and a no-code automation workflow?',
    a: 'A no-code automation workflow executes a fixed sequence of steps when triggered. It does what you programmed it to do, regardless of context. A no-code AI agent applies reasoning to decide what to do next based on the content it is processing. The same inbound email that would route to a fixed destination in a {{zapier.name}} workflow might be triaged, labeled and answered differently by {{lindy.name}} based on the email content, sender history, and current context. The practical distinction is that agents handle variable inputs better; workflows handle predictable, structured processes better.',
  },
  {
    q: 'Which platform is best for a non-technical founder building their first AI agent?',
    a: '{{lindy.name}} asks little of someone with no automation experience: you add it to Slack and ask it for things in plain language, with no workflow to build. {{zapier.name}} fits if you are already familiar with it and want to add AI steps to existing automations. {{make.name}} handles more complex branching than either but takes more time to learn. Start with the platform you have the least to learn, get something working, and evaluate whether its limitations require moving to a more capable tool.',
  },
  {
    q: 'How much does it cost to run a no-code AI agent?',
    a: 'Costs depend on volume and platform, and current plans are shown on each listing. {{zapier.name}} and {{make.name}} both have free tiers and bill paid plans by usage: tasks on {{zapier.name}}, credits on {{make.name}}. {{lindy.name}} is priced per user, and teammates who join through Slack get a one-time 7-day free trial. At low volumes all three are affordable. At high volumes, costs scale with usage and can become significant. The LLM calls embedded in agent workflows can add cost on top of the platform fees. Model the full cost including platform fees and estimated LLM call volume before committing to any platform at scale.',
  },
  {
    q: 'What are the most common failure modes for no-code AI agents?',
    a: 'Common failures include: the agent encounters an input format it was not configured for and produces incorrect output silently; the LLM reasoning step returns an unexpected format that breaks the subsequent automation step; rate limits on connected APIs cause the agent to fail mid-sequence without clear error messaging; and volume growth makes usage-based pricing unexpectedly expensive. All of these are manageable with proper configuration, testing on a range of real inputs before full deployment, and human review checkpoints for consequential actions. The agents that fail are usually the ones deployed without testing edge cases in advance.',
  },
]

export default async function BestNoCodeAIAgentBuildersPage() {
  const meta = await getGuideMeta('best-no-code-ai-agent-builders')
  const published = isoDate(meta?.published_at)
  const audited = isoDate(meta?.last_audited_at)
  const updated = updatedLabel(meta?.last_audited_at)

  const supabase = createClient()
  const groups = await getGuideGroups(GUIDE_GROUPS)
  const listed = groups.flatMap((g) => g.agents)

  const refs = await buildRefMap(supabase, GUIDE_SLUGS)
  const t = (text: string) => resolveTemplates(text, refs)

  const { count: agentCount } = await supabase
    .from('agents')
    .select('slug', { count: 'exact', head: true })
    .eq('is_active', true)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Best No-Code AI Agent Builders (2026)',
    description: t('{{zapier.name}} for integrations, {{make.name}} for logic, {{lindy.name}} for an AI teammate you ask in Slack. Pricing models, limitations, and which to pick first.'),
    url: 'https://theaiagentindex.com/resources/guides/best-no-code-ai-agent-builders',
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
    name: 'Best No-Code AI Agent Builders (2026)',
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
        <span style={{ fontSize: '0.8125rem', color: '#111827' }}>Best No-Code AI Agent Builders</span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' as const }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Independently Reviewed</span>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Guide</span>
        <span style={{ fontSize: '0.75rem', color: '#6B7280', padding: '0.25rem 0.75rem', backgroundColor: '#F3F4F6', borderRadius: '9999px' }}>{updated}</span>
      </div>

      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
        Best No-Code AI Agent Builders (2026)
      </h1>

      {/* Intro */}
      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem', maxWidth: '700px' }}>
        Building an AI agent no longer requires an engineering team. The gap between having a workflow problem and being able to deploy an AI agent to solve it has narrowed significantly in the past two years. Non-technical founders, operators, and marketers are now building agents that handle email triage, lead qualification, CRM updates, document summarization, and customer outreach without writing a line of code.
      </p>
      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem', maxWidth: '700px' }}>
        The no-code AI agent market splits into two distinct categories. The first is general automation platforms, <A s="zapier" r={refs} /> and <A s="make" r={refs} />, that were built for workflow automation and have added AI capabilities on top. These tools are built for connecting large numbers of business applications with AI decision-making in the middle. The second is AI teammates such as <A s="lindy" r={refs} />, which you ask for work in plain language instead of building a workflow. They handle variable inputs more naturally, but give you less step-by-step control and connect to fewer apps.
      </p>
      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem', maxWidth: '700px' }}>
        The right platform depends on what you are building. If your agent needs to connect to many existing tools in a predictable sequence, <A s="zapier" r={refs} /> or <A s="make" r={refs} /> is the better starting point. If you are building something that needs to reason, adapt its behavior based on content, and take action with minimal configuration, an AI teammate such as <A s="lindy" r={refs} /> gets there with less setup.
      </p>
      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '2rem', maxWidth: '700px' }}>
        This guide covers three no-code AI agent platforms, what each is suited for, and how to evaluate them against your specific use case. All three have meaningful limitations: understanding those limitations before committing saves significant time and rework.
      </p>

      <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '3rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#0369A1', lineHeight: 1.6, margin: 0 }}>
          <strong>Building something more custom?</strong> Read our full guide: <Link href="/resources/guides/how-to-build-an-ai-agent" style={{ color: '#2563EB' }}>How to Build an AI Agent</Link> covers the workflow vs agent distinction, production architecture, and the most common failure modes.
        </p>
      </div>

      <GuideAgentList groups={GUIDE_GROUPS} />

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
              <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.7, margin: 0 }}>{t(criterion.detail)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Decision framework */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>How to choose</h2>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.75rem' }}>
          {[
            { condition: 'You need to connect AI to many existing tools with minimal setup', recommendation: t('{{zapier.name}}'), href: '/agents/zapier' },
            { condition: 'You need complex conditional logic and branching across multiple AI steps', recommendation: t('{{make.name}}'), href: '/agents/make' },
            { condition: 'You want an AI teammate in Slack that handles inbox, meeting, scheduling and CRM work without building a workflow', recommendation: t('{{lindy.name}}'), href: '/agents/lindy' },
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
              <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.75, margin: 0 }}>{t(a)}</p>
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