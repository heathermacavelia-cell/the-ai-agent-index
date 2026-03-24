import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How to Build an AI Agent from Scratch (2026)',
  description: 'A practical guide to building AI agents in 2026 — covering architecture, tools, frameworks, and step-by-step implementation for developers and non-technical builders.',
  openGraph: {
    title: 'How to Build an AI Agent from Scratch (2026)',
    description: 'A practical guide to building AI agents in 2026 — covering architecture, tools, frameworks, and step-by-step implementation.',
    url: 'https://theaiagentindex.com/resources/guides/how-to-build-an-ai-agent',
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary',
    title: 'How to Build an AI Agent from Scratch (2026)',
    description: 'A practical guide to building AI agents in 2026.',
  },
  alternates: {
    canonical: 'https://theaiagentindex.com/resources/guides/how-to-build-an-ai-agent',
  },
}

const steps = [
  {
    number: '01',
    title: 'Define the job to be done',
    body: 'Before writing a single line of code, write down the specific task your agent will complete autonomously. The more precise the better. A well-scoped agent does one thing excellently rather than many things poorly. Example: an agent that monitors a Gmail inbox, identifies emails requiring a response, drafts replies in your tone, and sends them after a 30-minute review window.',
  },
  {
    number: '02',
    title: 'Choose your reasoning engine',
    body: 'Every AI agent needs a large language model (LLM) at its core to reason, plan, and generate outputs. The main options in 2026 are OpenAI GPT-4o, Anthropic Claude, and Google Gemini. For most agents, Claude and GPT-4o offer the best balance of reasoning ability and tool use. Choose based on your use case — Claude excels at long-context tasks and careful reasoning, GPT-4o at general tasks and broad tool integration.',
  },
  {
    number: '03',
    title: 'Define your tools',
    body: 'Tools are what turn an LLM into an agent. A tool is any function the agent can call to take action in the world — sending an email, searching the web, querying a database, updating a CRM record, or calling an API. Start with the minimum set of tools your agent needs. Each tool should have a clear name, description, and input/output schema so the LLM knows when and how to use it.',
  },
  {
    number: '04',
    title: 'Choose a framework',
    body: 'Building an agent from scratch requires managing the reasoning loop, tool calls, memory, and error handling yourself. Frameworks abstract this complexity. The most widely used in 2026 are LangChain (Python, highly flexible), LlamaIndex (strong for data-heavy agents), AutoGen (Microsoft, multi-agent workflows), and CrewAI (role-based agent teams). For simple single-purpose agents, the OpenAI Assistants API or Anthropic tool use API may be sufficient without a framework.',
  },
  {
    number: '05',
    title: 'Add memory',
    body: 'Stateless agents forget everything between runs. For most production agents you need at least short-term memory (context within a session) and often long-term memory (persistent storage across sessions). Common approaches: store conversation history in a vector database (Pinecone, Weaviate, Supabase pgvector), use a key-value store for structured state, or leverage the LLM context window for short sessions.',
  },
  {
    number: '06',
    title: 'Build the reasoning loop',
    body: 'The core of any agent is the reasoning loop: receive input, plan steps, call tools, evaluate results, and repeat until the goal is achieved. Most frameworks implement a variant of the ReAct pattern (Reason and Act). Your loop should handle tool failures gracefully, have a maximum iteration limit to prevent infinite loops, and surface clear error states when it cannot complete a task.',
  },
  {
    number: '07',
    title: 'Test with real inputs',
    body: 'Test your agent against real-world inputs before deploying. Create a set of test cases covering the happy path, edge cases, and failure modes. Measure accuracy, latency, and cost per run. Most agents require significant prompt engineering and tool refinement before they perform reliably at scale. Budget time for this iteration — it typically takes as long as the initial build.',
  },
  {
    number: '08',
    title: 'Deploy and monitor',
    body: 'Deploy your agent to a production environment with proper logging, error alerting, and usage monitoring. Track: task completion rate, average latency, LLM API costs, tool failure rates, and user satisfaction. Set up human-in-the-loop review for high-stakes actions until you have confidence in the agent reliability.',
  },
]

const tools = [
  { name: 'Cursor', slug: 'cursor', desc: 'AI coding IDE — ideal for building agent code with AI assistance', category: 'Development' },
  { name: 'GitHub Copilot', slug: 'github-copilot', desc: 'AI pair programmer for writing agent logic and integrations', category: 'Development' },
  { name: 'Devin', slug: 'devin', desc: 'Fully autonomous AI software engineer — can build agents end to end', category: 'Development' },
  { name: 'Perplexity AI', slug: 'perplexity-ai', desc: 'AI research agent — useful for researching frameworks and approaches', category: 'Research' },
  { name: 'Replit', slug: 'replit', desc: 'Browser-based IDE with AI capabilities for rapid prototyping', category: 'Development' },
]

export default function HowToBuildAnAIAgentPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'How to Build an AI Agent from Scratch (2026)',
    description: 'A practical guide to building AI agents in 2026 — covering architecture, tools, frameworks, and step-by-step implementation.',
    url: 'https://theaiagentindex.com/resources/guides/how-to-build-an-ai-agent',
    datePublished: '2026-03-24',
    dateModified: '2026-03-24',
    publisher: {
      '@type': 'Organization',
      name: 'The AI Agent Index',
      url: 'https://theaiagentindex.com',
    },
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How do you build an AI agent?',
        acceptedAnswer: { '@type': 'Answer', text: 'To build an AI agent: define the specific task, choose an LLM as the reasoning engine, define the tools the agent can use, choose a framework like LangChain or AutoGen, add memory for state persistence, build and test the reasoning loop, then deploy with monitoring.' },
      },
      {
        '@type': 'Question',
        name: 'What is the best framework for building AI agents?',
        acceptedAnswer: { '@type': 'Answer', text: 'The most widely used frameworks in 2026 are LangChain (highly flexible), LlamaIndex (strong for data-heavy agents), AutoGen (multi-agent workflows), and CrewAI (role-based agent teams). For simple agents, the OpenAI Assistants API or Anthropic tool use API may be sufficient.' },
      },
      {
        '@type': 'Question',
        name: 'How much does it cost to build an AI agent?',
        acceptedAnswer: { '@type': 'Answer', text: 'A simple agent might cost $0.01-0.10 per run in LLM API fees. Development time ranges from a weekend for a simple prototype to months for production-grade. Infrastructure costs typically run $50-500/month depending on usage volume.' },
      },
      {
        '@type': 'Question',
        name: 'Can you build an AI agent without coding?',
        acceptedAnswer: { '@type': 'Answer', text: 'Yes. No-code platforms like Zapier, Make, and n8n allow basic AI agents without code. More capable no-code builders include Relevance AI and Voiceflow. For complex agents with custom logic, some coding is typically required.' },
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
        <span style={{ fontSize: '0.8125rem', color: '#111827' }}>How to Build an AI Agent</span>
      </div>

      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Guide · Development</p>
      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
        How to Build an AI Agent from Scratch
      </h1>
      <p style={{ fontSize: '1.0625rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '680px' }}>
        A practical, step-by-step guide to building AI agents in 2026 — covering architecture decisions, framework selection, tool design, memory, and production deployment.
      </p>

      <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#0369A1', lineHeight: 1.6, margin: 0 }}>
          <strong>Before you build:</strong> Consider whether you need to build at all. Many use cases are already solved by existing AI agents. <Link href="/search" style={{ color: '#2563EB' }}>Search the AI Agent Index</Link> to see if a production-ready agent already exists for your use case.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '3rem' }}>
        {steps.map((step) => (
          <div key={step.number} style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: '1px solid #E5E7EB', padding: '1.5rem', display: 'flex', gap: '1.25rem' }}>
            <div style={{ flexShrink: 0, width: '2.5rem', height: '2.5rem', backgroundColor: '#EFF6FF', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563EB', fontFamily: 'monospace' }}>{step.number}</span>
            </div>
            <div>
              <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#111827', marginBottom: '0.5rem' }}>{step.title}</h2>
              <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.7, margin: 0 }}>{step.body}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }}>AI tools to help you build</h2>
      <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '1.25rem' }}>
        These AI agents from the index are particularly useful when building your own agent:
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem', marginBottom: '2.5rem' }}>
        {tools.map((tool) => (
          <Link key={tool.slug} href={'/agents/' + tool.slug}
            style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
              <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', margin: 0 }}>{tool.name}</p>
              <span style={{ fontSize: '0.625rem', backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.15rem 0.4rem', borderRadius: '9999px', fontWeight: 600 }}>{tool.category}</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#6B7280', lineHeight: 1.5, margin: 0 }}>{tool.desc}</p>
          </Link>
        ))}
      </div>

      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '1.25rem' }}>Frequently Asked Questions</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
        {[
          { q: 'How do you build an AI agent?', a: 'To build an AI agent: define the specific task, choose an LLM as the reasoning engine, define the tools the agent can use, choose a framework like LangChain or AutoGen, add memory for state persistence, build and test the reasoning loop, then deploy with monitoring.' },
          { q: 'What is the best framework for building AI agents?', a: 'The most widely used frameworks in 2026 are LangChain (highly flexible), LlamaIndex (strong for data-heavy agents), AutoGen (multi-agent workflows), and CrewAI (role-based agent teams). For simple agents, the OpenAI Assistants API or Anthropic tool use API may be sufficient.' },
          { q: 'How much does it cost to build an AI agent?', a: 'A simple agent might cost $0.01-0.10 per run in LLM API fees. Development time ranges from a weekend for a simple prototype to months for production-grade. Infrastructure costs typically run $50-500/month depending on usage volume.' },
          { q: 'Can you build an AI agent without coding?', a: 'Yes. No-code platforms like Zapier, Make, and n8n allow basic AI agents without code. More capable no-code builders include Relevance AI and Voiceflow. For complex agents with custom logic, some coding is typically required.' },
        ].map(({ q, a }) => (
          <div key={q} style={{ backgroundColor: '#F9FAFB', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1.25rem' }}>
            <p style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.5rem' }}>{q}</p>
            <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.65, margin: 0 }}>{a}</p>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        <Link href="/ai-coding-agents" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>AI Coding Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Browse tools to help build →</p>
        </Link>
        <Link href="/resources/guides/how-to-evaluate-an-ai-agent" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>How to Evaluate an Agent</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Before you buy or build →</p>
        </Link>
        <Link href="/definitions/what-is-an-ai-coding-agent" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>What is an AI Coding Agent?</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Read the definition →</p>
        </Link>
      </div>
    </div>
  )
}