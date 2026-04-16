import Link from 'next/link'
import type { Metadata } from 'next'
export const dynamic = 'force-dynamic'
import GuideCitations from '@/components/GuideCitations'

export const metadata: Metadata = {
  title: 'How AI Coding Agents Work — A Plain-English Explainer',
  description: 'How AI coding agents work explained clearly — context windows, codebase indexing, MCP, autonomous execution, and human-in-the-loop controls.',
  openGraph: {
    title: 'How AI Coding Agents Work',
    description: 'Context windows, codebase indexing, MCP, autonomous execution, and human-in-the-loop controls explained clearly.',
    url: 'https://theaiagentindex.com/resources/guides/how-ai-coding-agents-work',
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary',
    title: 'How AI Coding Agents Work',
    description: 'A plain-English explainer on how AI coding agents actually work under the hood.',
  },
  alternates: {
    canonical: 'https://theaiagentindex.com/resources/guides/how-ai-coding-agents-work',
  },
}

const concepts = [
  {
    title: 'The agent loop',
    body: 'An AI coding agent is a large language model connected to tools. The core loop is: receive a task, reason about what to do, call a tool (read file, run terminal command, write to a file), observe the result, and repeat until the task is complete. What makes this powerful is that the agent maintains context across dozens of steps — reading your codebase, understanding your architecture, and making changes consistent with your existing conventions.',
  },
  {
    title: 'Context windows',
    body: 'The context window is the most important technical constraint in coding agents. Every file the agent reads, every command it runs, and every result it observes consumes tokens. Claude Code\'s 1M token context window is the largest available and allows it to hold more of your codebase in memory at once. Smaller context windows force agents to be more selective about what they read, which can lead to changes that are inconsistent with the rest of the codebase.',
  },
  {
    title: 'Codebase indexing',
    body: 'Codebase indexing is how agents build awareness before starting a task. Tools like Cursor and Sourcegraph Cody index your entire repository and use semantic search to retrieve relevant files when needed. ContextPool takes this further — it extracts engineering insights from past sessions and loads them automatically at the start of each new session via MCP, giving agents persistent memory across conversations.',
  },
  {
    title: 'Model Context Protocol (MCP)',
    body: 'Most production-grade agents now support Model Context Protocol (MCP), a standard that lets agents connect to external tools — databases, APIs, project management systems, CI/CD pipelines — in a consistent way. This is what allows an agent to not just write code, but to check Jira for requirements, query your database schema, run tests, and open a pull request, all in a single workflow without switching contexts.',
  },
  {
    title: 'Human-in-the-loop controls',
    body: 'Human-in-the-loop controls determine how much you trust the agent to act without approval. Most tools default to showing you proposed changes before applying them. Fully autonomous agents like Devin can operate for hours without check-ins, but the tradeoff is less control over intermediate decisions. Well-scoped backlog items with clear acceptance criteria are safe to delegate fully. Open-ended feature work benefits from more frequent check-ins.',
  },
  {
    title: 'Tool use and real-world actions',
    body: 'The most capable agents in 2026 go beyond reading and writing files. They can browse the web, execute shell commands, manage git branches, interact with APIs, and trigger CI/CD pipelines. According to the Databricks 2026 State of AI Agents report, 97% of database testing and development environments are now built by AI agents — a direct result of agents being able to take real actions in connected systems, not just generate text.',
  },
]

const agentList = [
  { name: 'Claude Code', slug: 'claude-code', role: '1M token context, strongest reasoning' },
  { name: 'Cursor', slug: 'cursor', role: 'Semantic codebase indexing, IDE-native' },
  { name: 'ContextPool', slug: 'contextpool', role: 'Persistent memory via MCP' },
  { name: 'Devin', slug: 'devin', role: 'Fully autonomous, hours-long sessions' },
  { name: 'Tines', slug: 'tines', role: 'MCP server builder, workflow automation' },
  { name: 'Cline', slug: 'cline', role: 'Open-source, VS Code, MCP support' },
]

export default function HowAICodingAgentsWorkPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'How AI Coding Agents Work',
    description: 'How AI coding agents work explained — context windows, codebase indexing, MCP, autonomous execution, and human-in-the-loop controls.',
    url: 'https://theaiagentindex.com/resources/guides/how-ai-coding-agents-work',
    datePublished: '2026-04-16',
    dateModified: new Date().toISOString().split('T')[0],
    publisher: { '@type': 'Organization', name: 'The AI Agent Index', url: 'https://theaiagentindex.com' },
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How does an AI coding agent work?',
        acceptedAnswer: { '@type': 'Answer', text: 'An AI coding agent is a large language model connected to tools. It receives a task, reasons about what to do, calls tools (read file, run commands, write code), observes results, and repeats — maintaining context across dozens of steps without constant human input.' },
      },
      {
        '@type': 'Question',
        name: 'What is a context window in an AI coding agent?',
        acceptedAnswer: { '@type': 'Answer', text: 'The context window is the amount of text the agent can hold in memory at once. Every file it reads and every command it runs consumes tokens from this window. Claude Code has the largest context window at 1M tokens, which allows it to hold more of a codebase in memory at once.' },
      },
      {
        '@type': 'Question',
        name: 'What is MCP in AI coding agents?',
        acceptedAnswer: { '@type': 'Answer', text: 'MCP stands for Model Context Protocol — a standard that lets AI agents connect to external tools like databases, APIs, and CI/CD pipelines in a consistent way. It allows an agent to take real actions in connected systems, not just generate text.' },
      },
    ],
  }

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <div style={{ marginBottom: '0.75rem' }}>
        <Link href="/" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none' }}>Home</Link>
        <span style={{ color: '#D1D5DB', margin: '0 0.5rem' }}>/</span>
        <Link href="/resources/guides" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none' }}>Guides</Link>
        <span style={{ color: '#D1D5DB', margin: '0 0.5rem' }}>/</span>
        <span style={{ fontSize: '0.8125rem', color: '#111827' }}>How AI Coding Agents Work</span>
      </div>

      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Guide · Coding</p>
      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
        How AI Coding Agents Work
      </h1>

      <p style={{ fontSize: '1.0625rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '0.75rem', maxWidth: '680px' }}>
        Most developers have used an AI coding assistant. Fewer understand how AI coding agents actually work under the hood — and why the difference matters for what you can trust them to do unsupervised. By 2026, 55% of professional engineers regularly use AI agents according to the Pragmatic Engineer survey, but adoption without understanding leads to misuse, poor results, and missed opportunities.
      </p>
      <p style={{ fontSize: '0.9375rem', color: '#6B7280', lineHeight: 1.7, marginBottom: '1.75rem', maxWidth: '680px' }}>
        This guide explains the six core concepts that determine what an AI coding agent can and cannot do — so you can choose the right tool and use it effectively.
      </p>

      <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '1.75rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#0369A1', lineHeight: 1.6, margin: 0 }}>
          <strong>Related:</strong>{' '}
          <Link href="/resources/guides/best-ai-coding-agents" style={{ color: '#2563EB' }}>Best AI Coding Agents in 2026</Link> and{' '}
          <Link href="/resources/guides/ai-coding-agents-vs-traditional-ides" style={{ color: '#2563EB' }}>AI Coding Agents vs Traditional IDEs</Link> — practical guides for choosing and deploying the right tool.
        </p>
      </div>

      <div style={{ borderLeft: '3px solid #2563EB', paddingLeft: '1.25rem', marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '0.375rem' }}>
          &ldquo;I use agents for pretty much all coding work. Claude Code open in the terminal to drive work, IDE open to review changes. The agent does the writing — I do the reviewing.&rdquo;
        </p>
        <p style={{ fontSize: '0.8125rem', color: '#9CA3AF', margin: 0 }}>— Staff engineer, Pragmatic Engineer AI Tooling Survey 2026</p>
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
          { q: 'How does an AI coding agent work?', a: 'An AI coding agent is a large language model connected to tools. It receives a task, reasons about what to do, calls tools (read file, run commands, write code), observes results, and repeats — maintaining context across dozens of steps without constant human input.' },
          { q: 'What is a context window in an AI coding agent?', a: 'The context window is how much text the agent can hold in memory at once. Every file it reads and command it runs consumes tokens. Claude Code has the largest context window at 1M tokens, allowing it to hold more of a codebase in memory at once.' },
          { q: 'What is MCP in AI coding agents?', a: 'MCP stands for Model Context Protocol — a standard that lets AI agents connect to external tools like databases, APIs, and CI/CD pipelines. It allows an agent to take real actions in connected systems, not just generate text.' },
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
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Browse full category →</p>
        </Link>
        <Link href="/resources/guides/best-ai-coding-agents" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Best AI Coding Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Top picks for 2026 →</p>
        </Link>
        <Link href="/resources/guides/ai-coding-agents-vs-traditional-ides" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Agents vs Traditional IDEs</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>What has changed →</p>
        </Link>
        <Link href="/definitions/what-is-an-ai-coding-agent" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>What is an AI Coding Agent?</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Read the definition →</p>
        </Link>
      </div>

      <p style={{ fontSize: '0.875rem', color: '#9CA3AF', lineHeight: 1.6 }}>
        All agents listed are editorially reviewed by The AI Agent Index. See our <Link href="/methodology" style={{ color: '#6B7280' }}>editorial methodology</Link>.
      </p>

      <GuideCitations slug="how-ai-coding-agents-work" table="guides" />
    </div>
  )
}