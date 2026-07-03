import Link from 'next/link'
import type { Metadata } from 'next'
import GuideCitations from '@/components/GuideCitations'
import NewsletterSignup from '@/components/NewsletterSignup'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'How AI Coding Agents Work (2026) | The AI Agent Index',
  description: '6 core concepts: agent loops, context windows, codebase indexing, MCP, autonomous execution, and human-in-the-loop controls explained. Not affiliated.',
  openGraph: {
    title: 'How AI Coding Agents Work (2026)',
    description: '6 core concepts: agent loops, context windows, codebase indexing, MCP, autonomous execution, and human-in-the-loop controls explained.',
    url: 'https://theaiagentindex.com/resources/guides/how-ai-coding-agents-work',
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary',
    title: 'How AI Coding Agents Work (2026)',
    description: '6 core concepts that determine what AI coding agents can and cannot do, explained for developers.',
  },
  alternates: {
    canonical: 'https://theaiagentindex.com/resources/guides/how-ai-coding-agents-work',
  },
}

const concepts = [
  {
    title: 'The agent loop',
    body: 'An AI coding agent is a large language model connected to tools. The core loop is: receive a task, reason about what to do, call a tool (read file, run terminal command, write to a file), observe the result, and repeat until the task is complete. What makes this powerful is that the agent maintains context across dozens of steps, reading your codebase, understanding your architecture, and making changes consistent with your existing conventions. This is the same loop whether you are using Claude Code in a terminal, Cursor in an IDE, or GitHub Copilot in VS Code.',
  },
  {
    title: 'Context windows',
    body: 'The context window is the most important technical constraint in coding agents. Every file the agent reads, every command it runs, and every result it observes consumes tokens. Claude Code operates with a 200K token context window per conversation turn (with extended thinking for complex tasks), while Cursor and Windsurf use intelligent codebase indexing to work within their context limits. Smaller effective context windows force agents to be more selective about what they read, which can lead to changes that are inconsistent with the rest of the codebase.',
  },
  {
    title: 'Codebase indexing',
    body: 'Codebase indexing is how agents build awareness before starting a task. Tools like Cursor and Sourcegraph Cody index your entire repository and use semantic search to retrieve relevant files when needed. ContextPool takes this further by extracting engineering insights from past sessions and loading them automatically at the start of each new session via MCP, giving agents persistent memory across conversations.',
  },
  {
    title: 'Model Context Protocol (MCP)',
    body: 'Most production-grade agents now support Model Context Protocol (MCP), a standard that lets agents connect to external tools (databases, APIs, project management systems, CI/CD pipelines) in a consistent way. This is what allows an agent to not just write code, but to check Jira for requirements, query your database schema, run tests, and open a pull request, all in a single workflow without switching contexts. Claude Code, Cursor, Cline, and Windsurf all support MCP natively.',
  },
  {
    title: 'Human-in-the-loop controls',
    body: 'Human-in-the-loop controls determine how much you trust the agent to act without approval. Most tools default to showing you proposed changes before applying them. GitHub Copilot suggests inline completions that you accept or reject per-line. Cursor shows multi-file diffs for review before applying. Fully autonomous agents like Devin can operate for hours without check-ins, but the tradeoff is less control over intermediate decisions. Well-scoped backlog items with clear acceptance criteria are safe to delegate fully. Open-ended feature work benefits from more frequent check-ins.',
  },
  {
    title: 'Tool use and real-world actions',
    body: 'The most capable agents in 2026 go beyond reading and writing files. They can browse the web, execute shell commands, manage git branches, interact with APIs, and trigger CI/CD pipelines. According to the Databricks 2026 State of AI Agents report, 97% of database testing and development environments are now built by AI agents. This is a direct result of agents being able to take real actions in connected systems, not just generate text. Claude Code and Aider operate directly in the terminal with full shell access, while Cursor and Windsurf execute within their IDE sandboxes.',
  },
]

const agentList = [
  { name: 'Claude Code', slug: 'claude-code', role: 'Terminal-native, strongest reasoning, MCP support' },
  { name: 'Cursor', slug: 'cursor', role: 'AI-first IDE, semantic indexing, cloud subagents' },
  { name: 'GitHub Copilot', slug: 'github-copilot', role: 'Inline completions, deep GitHub integration' },
  { name: 'Windsurf', slug: 'windsurf', role: 'IDE agent with Cascade multi-file editing' },
  { name: 'Devin', slug: 'devin', role: 'Fully autonomous, hours-long sessions' },
  { name: 'Cline', slug: 'cline', role: 'Open-source, VS Code, MCP support' },
  { name: 'ContextPool', slug: 'contextpool', role: 'Persistent memory via MCP' },
  { name: 'Aider', slug: 'aider', role: 'Open-source terminal agent, git-native' },
]

export default function HowAICodingAgentsWorkPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'How AI Coding Agents Work (2026)',
    description: '6 core concepts: agent loops, context windows, codebase indexing, MCP, autonomous execution, and human-in-the-loop controls explained.',
    url: 'https://theaiagentindex.com/resources/guides/how-ai-coding-agents-work',
    datePublished: '2026-04-16',
    dateModified: new Date().toISOString().split('T')[0],
    author: { '@type': 'Organization', name: 'The AI Agent Index' },
    publisher: { '@type': 'Organization', name: 'The AI Agent Index', url: 'https://theaiagentindex.com' },
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How does an AI coding agent work?',
        acceptedAnswer: { '@type': 'Answer', text: 'An AI coding agent is a large language model connected to tools. It receives a task, reasons about what to do, calls tools (read file, run commands, write code), observes results, and repeats, maintaining context across dozens of steps without constant human input.' },
      },
      {
        '@type': 'Question',
        name: 'What is a context window in an AI coding agent?',
        acceptedAnswer: { '@type': 'Answer', text: 'The context window is the amount of text the agent can hold in memory at once. Every file it reads and every command it runs consumes tokens from this window. Larger context windows allow agents to hold more of a codebase in memory at once, producing more consistent changes across files.' },
      },
      {
        '@type': 'Question',
        name: 'What is MCP in AI coding agents?',
        acceptedAnswer: { '@type': 'Answer', text: 'MCP stands for Model Context Protocol, a standard that lets AI agents connect to external tools like databases, APIs, and CI/CD pipelines in a consistent way. It allows an agent to take real actions in connected systems, not just generate text. Claude Code, Cursor, Cline, and Windsurf all support MCP natively.' },
      },
      {
        '@type': 'Question',
        name: 'What is the difference between an AI coding assistant and an AI coding agent?',
        acceptedAnswer: { '@type': 'Answer', text: 'An AI coding assistant like GitHub Copilot suggests completions that you accept or reject line by line. An AI coding agent like Claude Code or Devin takes a goal and works autonomously across multiple files, running commands, debugging errors, and completing the task with minimal human intervention. The assistant helps you type faster. The agent does the work while you review the output.' },
      },
    ],
  }

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'How AI Coding Agents Work: Core Concepts',
    itemListElement: concepts.map((concept, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: concept.title,
    })),
  }

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />

      <div style={{ marginBottom: '0.75rem' }}>
        <Link href="/" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none' }}>Home</Link>
        <span style={{ color: '#D1D5DB', margin: '0 0.5rem' }}>/</span>
        <Link href="/resources/guides" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none' }}>Guides</Link>
        <span style={{ color: '#D1D5DB', margin: '0 0.5rem' }}>/</span>
        <span style={{ fontSize: '0.8125rem', color: '#111827' }}>How AI Coding Agents Work</span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' as const }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Guide</span>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#F3F4F6', color: '#374151', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Coding</span>
        <span style={{ fontSize: '0.75rem', color: '#6B7280', padding: '0.25rem 0.75rem', backgroundColor: '#F3F4F6', borderRadius: '9999px' }}>Updated July 2026</span>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '0.25rem 0.75rem', borderRadius: '9999px', border: '1px solid #BFDBFE' }}>&#10003; Independently Reviewed</span>
      </div>

      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
        How AI Coding Agents Work
      </h1>

      <p style={{ fontSize: '1.0625rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '0.75rem', maxWidth: '680px' }}>
        Most developers have used an AI coding assistant. Fewer understand how AI coding agents actually work under the hood and why the difference matters for what you can trust them to do unsupervised. In 2026, 55% of professional engineers regularly use AI agents according to the Pragmatic Engineer survey, but adoption without understanding leads to misuse, poor results, and missed opportunities.
      </p>
      <p style={{ fontSize: '0.9375rem', color: '#6B7280', lineHeight: 1.7, marginBottom: '1.75rem', maxWidth: '680px' }}>
        This guide explains the six core concepts that determine what an AI coding agent can and cannot do, so you can choose the right tool and use it effectively.
      </p>

      <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '1.75rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#0369A1', lineHeight: 1.6, margin: 0 }}>
          <strong>Related:</strong>{' '}
          <Link href="/resources/guides/best-ai-coding-agents" style={{ color: '#2563EB' }}>Best AI Coding Agents in 2026</Link> and{' '}
          <Link href="/resources/guides/ai-coding-agents-vs-traditional-ides" style={{ color: '#2563EB' }}>AI Coding Agents vs Traditional IDEs</Link> cover tool selection and deployment.
        </p>
      </div>

      <div style={{ borderLeft: '3px solid #2563EB', paddingLeft: '1.25rem', marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '0.375rem' }}>
          &ldquo;I use agents for pretty much all coding work. Claude Code open in the terminal to drive work, IDE open to review changes. The agent does the writing. I do the reviewing.&rdquo;
        </p>
        <p style={{ fontSize: '0.8125rem', color: '#9CA3AF', margin: 0 }}>Source: Staff engineer, Pragmatic Engineer AI Tooling Survey 2026</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '1.5rem', marginBottom: '3rem' }}>
        {concepts.map((concept, i) => (
          <div key={concept.title} style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: '1px solid #E5E7EB', padding: '1.5rem', display: 'flex', gap: '1.25rem' }}>
            <div style={{ flexShrink: 0, width: '2rem', height: '2rem', backgroundColor: '#EFF6FF', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#2563EB' }}>{i + 1}</span>
            </div>
            <div>
              <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#111827', marginBottom: '0.5rem' }}>{concept.title}</h2>
              <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.7, margin: 0 }}>{concept.body}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>AI coding agents to explore</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem', marginBottom: '2.5rem' }}>
        {agentList.map((agent) => (
          <Link key={agent.slug} href={'/agents/' + agent.slug}
            style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
            <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>{agent.name}</p>
            <p style={{ fontSize: '0.75rem', color: '#6B7280', lineHeight: 1.5, margin: 0 }}>{agent.role}</p>
          </Link>
        ))}
      </div>

      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '1.25rem' }}>Frequently Asked Questions</h2>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '1rem', marginBottom: '2.5rem' }}>
        {[
          { q: 'How does an AI coding agent work?', a: 'An AI coding agent is a large language model connected to tools. It receives a task, reasons about what to do, calls tools (read file, run commands, write code), observes results, and repeats, maintaining context across dozens of steps without constant human input.' },
          { q: 'What is a context window in an AI coding agent?', a: 'The context window is how much text the agent can hold in memory at once. Every file it reads and command it runs consumes tokens. Larger context windows allow agents to hold more of a codebase in memory at once, producing more consistent changes across files.' },
          { q: 'What is MCP in AI coding agents?', a: 'MCP stands for Model Context Protocol, a standard that lets AI agents connect to external tools like databases, APIs, and CI/CD pipelines. It allows an agent to take real actions in connected systems, not just generate text. Claude Code, Cursor, Cline, and Windsurf all support MCP natively.' },
          { q: 'What is the difference between an AI coding assistant and an AI coding agent?', a: 'An AI coding assistant like GitHub Copilot suggests completions that you accept or reject line by line. An AI coding agent like Claude Code or Devin takes a goal and works autonomously across multiple files, running commands, debugging errors, and completing the task with minimal human intervention. The assistant helps you type faster. The agent does the work while you review the output.' },
        ].map(({ q, a }) => (
          <div key={q} style={{ backgroundColor: '#F9FAFB', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1.25rem' }}>
            <p style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.5rem' }}>{q}</p>
            <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.65, margin: 0 }}>{a}</p>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/ai-coding-agents" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>All AI Coding Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Browse full category &#x2192;</p>
        </Link>
        <Link href="/resources/guides/best-ai-coding-agents" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Best AI Coding Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Top picks for 2026 &#x2192;</p>
        </Link>
        <Link href="/resources/guides/ai-coding-agents-vs-traditional-ides" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Agents vs Traditional IDEs</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>What has changed &#x2192;</p>
        </Link>
        <Link href="/definitions/what-is-an-ai-coding-agent" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>What is an AI Coding Agent?</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Read the definition &#x2192;</p>
        </Link>
      </div>

      <p style={{ fontSize: '0.875rem', color: '#9CA3AF', lineHeight: 1.6 }}>
        All agents listed are editorially reviewed by The AI Agent Index. See our <Link href="/methodology" style={{ color: '#6B7280' }}>editorial methodology</Link>.
      </p>

      <div style={{ marginBottom: '2rem' }}>
        <NewsletterSignup sourcePage="guide-how-ai-coding-agents-work" sourceType="guide" />
      </div>

      <GuideCitations slug="how-ai-coding-agents-work" table="guides" />
    </div>
  )
}