import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import type { Metadata } from 'next'
import GuideCitations from '@/components/GuideCitations'
import NewsletterSignup from '@/components/NewsletterSignup'
import { getGuideMeta, isoDate, updatedLabel } from '@/lib/guideMeta'
import GuideAgentList from '@/components/GuideAgentList'
import { getGuideGroups, type GuideGroup } from '@/lib/guideAgents'
import { buildRefMap, resolveTemplates, type RefMap } from '@/lib/templates'

// Agent names in this guide's prose and FAQ come from the database, not from this file.
// GUIDE_SLUGS lists every agent the prose names. A name that is renamed in the database
// updates here automatically. A slug that does not exist renders its raw template, loudly.
const GUIDE_SLUGS = ['aider', 'claude-code', 'cursor', 'devin', 'github-copilot', 'qodo', 'windsurf']

// The agents this guide lists, in this order, under the guide's three types.
// Chosen by hand (Heather, 2026-10-29) - never by tag. Order is editorial, not a ranking.
const GUIDE_GROUPS: GuideGroup[] = [
  {
    heading: 'In the IDE',
    intro: 'Editors and editor extensions that add AI chat, multi-file edits and agent mode where you already write code.',
    slugs: ['cursor', 'windsurf', 'github-copilot', 'kiro', 'amazon-q-developer', 'jetbrains-ai-assistant'],
  },
  {
    heading: 'In the terminal',
    intro: 'Agents you run from the command line that read the repository, edit files and run commands, independent of your editor.',
    slugs: ['claude-code', 'openai-codex', 'gemini-cli', 'aider', 'cline', 'amp'],
  },
  {
    heading: 'Autonomous agents and code review',
    intro: 'Agents you hand a scoped task to and review afterwards, and tools that review pull requests.',
    slugs: ['devin', 'jules', 'openhands', 'qodo', 'coderabbit'],
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

const DESCRIPTION = 'IDE, terminal and autonomous coding agents compared: Cursor, Claude Code, GitHub Copilot, Devin and more. SWE-bench context and tradeoffs.'

export const metadata: Metadata = {
  title: 'Best AI Coding Agents: IDE vs Terminal vs Enterprise (2026)',
  description: DESCRIPTION,
  openGraph: {
    title: 'Best AI Coding Agents: IDE vs Terminal vs Enterprise (2026)',
    description: DESCRIPTION,
    url: 'https://theaiagentindex.com/resources/guides/best-ai-coding-agents',
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary',
    title: 'Best AI Coding Agents: IDE vs Terminal vs Enterprise (2026)',
    description: DESCRIPTION,
  },
  alternates: {
    canonical: 'https://theaiagentindex.com/resources/guides/best-ai-coding-agents',
  },
}

const evaluationCriteria = [
  {
    title: 'Autonomy level: assistant vs agent',
    detail: "The most important distinction when evaluating AI coding tools is whether they operate as assistants (suggesting code you accept or reject) or agents (planning and executing multi-step tasks autonomously). Inline autocomplete is assistant behaviour. {{claude-code.name}} and {{devin.name}} work as agents. The right level of autonomy depends on whether you want AI to work alongside you or to delegate tasks to it entirely. Many developers use both: an agent for delegated tasks, an assistant for inline support while actively writing.",
  },
  {
    title: 'Codebase context depth',
    detail: "The context an AI coding tool can hold determines how well it understands your project. Tools that can read more of your codebase at once tend to produce more coherent multi-file changes and fewer inconsistencies with your existing conventions. {{cursor.name}} indexes your codebase and retrieves relevant context inside the editor, while terminal agents such as {{claude-code.name}} search and read the repository as they work. For large codebases, context strategy is a meaningful differentiator.",
  },
  {
    title: 'Benchmark performance: what it actually means',
    detail: "SWE-bench Verified is a widely cited public benchmark for AI coding agents. It measures the ability to resolve real-world GitHub issues from open-source repositories, not synthetic coding challenges. On SWE-bench Verified, top scores rose from 33% in August 2024 to about 79% by December 2025. Benchmark performance correlates with real-world usefulness but does not map perfectly: the tasks in your codebase may differ significantly from the benchmark distribution. Always test shortlisted tools against representative examples from your own work.",
  },
  {
    title: 'IDE and workflow integration',
    detail: "An AI coding agent that does not fit your existing development environment will not be used consistently. {{cursor.name}} and {{windsurf.name}} are editors in their own right. {{github-copilot.name}} works inside VS Code, JetBrains, Visual Studio, Xcode, Neovim and more. {{claude-code.name}} runs in the terminal and also in IDEs, Slack, web, desktop and mobile, and {{aider.name}} runs in any terminal independently of your editor. {{devin.name}} works in the cloud and opens pull requests for review. Before shortlisting, confirm the tool works within your existing editor and workflow rather than requiring you to change where and how you write code.",
  },
  {
    title: 'Security and data handling',
    detail: "Enterprise engineering organizations need to evaluate AI coding tools against their data handling and security policies. The key questions are: Is your code sent to the vendor's servers for processing, or can it run locally or via your own API keys? Does the vendor use your code to train future models? What data retention policies apply? Business and enterprise tiers often carry different data terms from individual plans, so compare the tier you would actually buy. {{aider.name}} runs locally and sends code only to the model provider whose API key you supply. Terms vary significantly between tools: review them before deploying in environments with sensitive IP.",
  },
]

export default async function BestAICodingAgentsPage() {
  const meta = await getGuideMeta('best-ai-coding-agents')
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
    headline: 'Best AI Coding Agents: IDE vs Terminal vs Enterprise (2026)',
    description: DESCRIPTION,
    url: 'https://theaiagentindex.com/resources/guides/best-ai-coding-agents',
    ...(published ? { datePublished: published } : {}),
    ...(audited ? { dateModified: audited } : {}),
    author: { '@type': 'Organization', name: 'The AI Agent Index', url: 'https://theaiagentindex.com' },
    publisher: { '@type': 'Organization', name: 'The AI Agent Index', url: 'https://theaiagentindex.com' },
  }

  const faqItems = [
    {
      q: 'What is the best AI coding agent in 2026?',
      a: t("It depends on how you work. {{cursor.name}} and {{windsurf.name}} suit developers working inside an existing codebase who want AI built into the editor. {{claude-code.name}} suits delegating multi-step tasks and reviewing the result, from the terminal or an IDE. {{github-copilot.name}} suits teams that want one tool across many editors, including VS Code, JetBrains, Visual Studio, Xcode and Neovim. {{aider.name}} is a free, open-source option for terminal workflows where you bring your own model API key."),
    },
    {
      q: 'What is the difference between an AI coding assistant and an AI coding agent?',
      a: 'An AI coding assistant suggests code completions as you type or responds to your prompts with code you accept or reject. An AI coding agent takes multi-step autonomous action without continuous human direction: it reads your codebase, plans a solution, implements across multiple files, runs tests, fixes failures, and produces a result for review. Assistants work alongside you. Agents work independently. The distinction matters because agents are used differently: you delegate a scoped task, the agent executes it, and you review the output rather than directing each step.',
    },
    {
      q: 'How much do AI coding agents cost in 2026?',
      a: t("Pricing models vary. Most tools in this guide charge a subscription, often with a free tier, while {{qodo.name}} is usage-based. {{aider.name}} is free and open-source; you pay only for the model API calls you make with your own key. Check whether a plan is priced per user, by usage or by included agent time, and how quickly heavy agent use draws down any included allowance. Current pricing for each tool is shown on its listing card above, and most offer a free tier or trial long enough to evaluate before committing."),
    },
    {
      q: 'What is SWE-bench and why does it matter for AI coding agents?',
      a: "SWE-bench Verified is a widely cited benchmark for AI coding agent capability. It measures an agent's ability to resolve real-world GitHub issues from open-source repositories, not synthetic coding challenges, which makes it more representative of practical work than general programming benchmarks. On SWE-bench Verified, top scores rose from 33% in August 2024 to about 79% by December 2025. Benchmark performance is a useful signal for comparing agents but does not map perfectly to your specific codebase and workflow. Always test shortlisted tools against representative examples from your own projects before making a decision.",
    },
    {
      q: 'Which AI coding agent is best for large codebases?',
      a: t("{{claude-code.name}} and {{cursor.name}} take different approaches to large codebases. {{claude-code.name}} searches and reads the repository itself as it works, which suits delegated multi-file changes. {{cursor.name}} indexes the codebase and retrieves relevant context inside the editor, which suits interactive work. Test both against a representative multi-file change from your own project before deciding."),
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

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Best AI Coding Agents (2026)',
    numberOfItems: listed.length,
    itemListElement: listed.map((agent, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'SoftwareApplication',
        name: agent.name,
        description: agent.short_description,
        url: `https://theaiagentindex.com/agents/${agent.slug}`,
      }
    }))
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
        <span style={{ fontSize: '0.8125rem', color: '#111827' }}>Best AI Coding Agents</span>
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
        Best AI Coding Agents in 2026
      </h1>

      {/* Intro */}
      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem', maxWidth: '700px' }}>
        AI coding agents have moved from experimental tooling into everyday engineering practice. In Stack Overflow&apos;s 2026 Developer Survey, 73% of respondents who use AI coding assistants or agents said they use them daily, and the distinction between an AI coding assistant and an AI coding agent has become practically significant. An assistant suggests code completions and responds to prompts. An agent plans, implements across multiple files, runs tests, iterates on failures, and delivers a result for review, with minimal direction at each step.
      </p>

      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem', maxWidth: '700px' }}>
        The tools have improved quickly. On SWE-bench Verified, a benchmark built from real-world GitHub issues, top scores rose from 33% in August 2024 to about 79% by December 2025. Not every product marketed as an agent works this way, though: some are still mainly autocomplete, so check what a tool actually does on its own before you rely on it.
      </p>

      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem', maxWidth: '700px' }}>
        The right tool depends on how you work. If you spend most of your time actively writing code in an existing codebase, an AI editor like <A s="cursor" r={refs} /> or <A s="windsurf" r={refs} /> keeps the AI where you already work. If you want to delegate well-defined tasks and review results, a terminal agent like <A s="claude-code" r={refs} /> or an autonomous agent like <A s="devin" r={refs} />, which opens pull requests from the cloud, is better suited. If your organization needs one tool across many editors, <A s="github-copilot" r={refs} /> covers VS Code, JetBrains, Visual Studio, Xcode, Neovim and more.
      </p>

      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '2rem', maxWidth: '700px' }}>
        This guide covers {listed.length} AI coding agents, grouped by where they run: in the IDE, in the terminal, and as autonomous agents and code review tools. Each card links to the full listing in the index with structured data on pricing, autonomy level, and integration details. The evaluation criteria section covers the specific questions worth asking before committing to any tool.
      </p>

      <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#0369A1', lineHeight: 1.6, margin: 0 }}>
          <strong>Related:</strong>{' '}
          <Link href="/ai-coding-agents" style={{ color: '#2563EB' }}>All AI Coding Agents</Link> ·{' '}
          <Link href="/resources/guides/how-ai-coding-agents-work" style={{ color: '#2563EB' }}>How AI Coding Agents Work</Link> ·{' '}
          <Link href="/resources/guides/ai-coding-agents-vs-traditional-ides" style={{ color: '#2563EB' }}>AI Coding Agents vs Traditional IDEs</Link>
        </p>
      </div>

      <GuideAgentList groups={GUIDE_GROUPS} />

      {/* Evaluation criteria */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>What to look for when evaluating AI coding agents</h2>
        <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1.5rem' }}>
          The marketing in this category has outpaced the reality for some tools. These are the questions that separate tools worth deploying from tools worth avoiding.
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

      {/* Newsletter */}
      <div style={{ marginBottom: '3rem' }}>
        <NewsletterSignup />
      </div>

      {/* FAQs */}
      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '1.25rem' }}>Frequently Asked Questions</h2>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '1rem', marginBottom: '2.5rem' }}>
        {faqItems.map(({ q, a }) => (
          <div key={q} style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1.25rem 1.5rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.5rem' }}>{q}</h3>
            <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.75, margin: 0 }}>{a}</p>
          </div>
        ))}
      </div>

      {/* Related */}
      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/ai-coding-agents" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>All AI Coding Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>Browse full category &#x2192;</p>
        </Link>
        <Link href="/resources/guides/how-ai-coding-agents-work" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>How AI Coding Agents Work</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>Technical explainer &#x2192;</p>
        </Link>
        <Link href="/alternatives/cursor-alternatives" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Cursor Alternatives</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>Compare options &#x2192;</p>
        </Link>
        <Link href="/alternatives/github-copilot-alternatives" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>GitHub Copilot Alternatives</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>Compare options &#x2192;</p>
        </Link>
      </div>

      <p style={{ fontSize: '0.875rem', color: '#9CA3AF', lineHeight: 1.6 }}>
        All agents listed are editorially reviewed by The AI Agent Index. See our <Link href="/methodology" style={{ color: '#6B7280' }}>editorial methodology</Link>.
      </p>

      <GuideCitations slug="best-ai-coding-agents" table="guides" />
    </div>
  )
}