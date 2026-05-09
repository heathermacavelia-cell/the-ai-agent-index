import Link from 'next/link'
import type { Metadata } from 'next'
import GuideCitations from '@/components/GuideCitations'
import { createClient } from '@/lib/supabase'
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'What is an AI Agent? Definition, Examples and How They Work (2026) | The AI Agent Index',
  description: 'An AI agent is software that autonomously takes actions to complete a goal without human input at each step. Covers how they work, types, examples, and how they differ from chatbots.',
  openGraph: {
    title: 'What is an AI Agent? Definition, Examples and How They Work (2026)',
    description: 'An AI agent is software that autonomously takes actions to complete a goal without human input at each step. Covers how they work, types, and examples.',
    url: 'https://theaiagentindex.com/resources/guides/what-is-an-ai-agent',
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary',
    title: 'What is an AI Agent? Definition, Examples and How They Work (2026)',
    description: 'An AI agent is software that autonomously takes actions to complete a goal without human input at each step.',
  },
  alternates: { canonical: 'https://theaiagentindex.com/resources/guides/what-is-an-ai-agent' },
}

const agentTypes = [
  {
    name: 'AI Sales Agents',
    slug: 'ai-sales-agents',
    description: 'Autonomously prospect accounts, write personalised outreach, manage follow-up sequences, and sync activity to your CRM. The most common commercial AI agent deployment in 2026.',
    examples: 'Instantly.ai, Apollo.io, Artisan Ava, Clay',
  },
  {
    name: 'AI Customer Support Agents',
    slug: 'ai-customer-support-agents',
    description: 'Resolve support tickets, handle returns and account queries, triage incoming requests, and escalate complex issues to human agents with full context attached.',
    examples: 'Intercom Fin, Zendesk AI, Sierra, Decagon',
  },
  {
    name: 'AI Research Agents',
    slug: 'ai-research-agents',
    description: 'Conduct multi-step web and academic research, search literature databases, synthesise findings across sources, and produce structured reports with verifiable citations.',
    examples: 'Perplexity AI, Elicit, ChatGPT Deep Research, Consensus',
  },
  {
    name: 'AI Marketing Agents',
    slug: 'ai-marketing-agents',
    description: 'Generate content at scale, optimise SEO, manage and optimise paid campaigns, personalise outbound messaging, and automate social scheduling.',
    examples: 'Jasper, Copy.ai, Persado, Albert.ai',
  },
  {
    name: 'AI Coding Agents',
    slug: 'ai-coding-agents',
    description: 'Write, review, and refactor code across entire codebases — from inline autocomplete in your editor to fully autonomous software engineering that ships PRs independently.',
    examples: 'Cursor, Claude Code, GitHub Copilot, Devin',
  },
]

const faqItems = [
  {
    q: 'What is an AI agent?',
    a: 'An AI agent is software that autonomously takes actions to complete a defined goal without requiring human direction at each step. It uses a large language model as a reasoning engine, connects to external tools and APIs to take actions in the real world, and maintains memory across steps to complete complex, multi-step workflows independently. The defining characteristic of an AI agent — what distinguishes it from an AI assistant or a chatbot — is that it operates autonomously toward a goal rather than responding to individual prompts.',
  },
  {
    q: 'What is the difference between an AI agent and a chatbot?',
    a: 'A chatbot responds to individual messages and produces text for a human to act on. You are the driver at every step. An AI agent is given a goal and works autonomously to achieve it — planning which steps to take, using tools to take actions in external systems, and completing the workflow without requiring human input at each stage. A chatbot helps you write an email. An AI agent researches the prospect, drafts the email, sends it, tracks whether it was opened, follows up if it was not, and routes replies to your inbox.',
  },
  {
    q: 'What are examples of AI agents?',
    a: 'The most widely deployed commercial AI agents in 2026 are: AI sales agents like Instantly.ai and Apollo.io that run outbound prospecting autonomously; AI customer support agents like Intercom Fin and Zendesk AI that resolve support tickets without human involvement for routine queries; AI coding agents like Cursor and Claude Code that write and review code across entire codebases; AI research agents like Perplexity AI and Elicit that search sources and synthesise findings; and AI marketing agents like Jasper and Albert.ai that generate content and manage paid campaigns.',
  },
  {
    q: 'How do AI agents work technically?',
    a: 'Every AI agent is built on four components. The reasoning engine — typically a large language model like Claude, GPT, or Gemini — understands the goal and decides which actions to take next. The tools layer connects the agent to external systems: APIs, browsers, databases, and applications it can read from and write to. The memory layer maintains context within a task and across sessions, so the agent can make decisions informed by what it has already done. The feedback loop allows the agent to evaluate its own outputs, detect failures, and retry with corrections — without human intervention at each step.',
  },
  {
    q: 'What is the difference between an AI agent and a workflow automation tool like Zapier?',
    a: 'A workflow automation tool executes a fixed sequence of steps when triggered. The path is predefined — if X happens, do Y, then Z. It does not make decisions or adapt to variable inputs. An AI agent uses a reasoning engine to decide what to do next based on what it encounters. If it discovers that a step failed, it can try a different approach. If the input is different from what was expected, it can adapt. Zapier is the right tool for predictable, structured workflows with known inputs and outputs. An AI agent is the right tool when the workflow involves variable inputs, judgment calls, or steps that depend on what previous steps found.',
  },
]

export default async function WhatIsAnAIAgentPage() {
  const supabase = createClient()
  const { count: agentCount } = await supabase
    .from('agents')
    .select('slug', { count: 'exact', head: true })
    .eq('is_active', true)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'What is an AI Agent? Definition, Examples and How They Work (2026)',
    description: 'An AI agent is software that autonomously takes actions to complete a goal without human input at each step. Covers how they work, types, and examples.',
    url: 'https://theaiagentindex.com/resources/guides/what-is-an-ai-agent',
    datePublished: '2026-03-23',
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
        <span style={{ fontSize: '0.8125rem', color: '#111827' }}>What is an AI Agent?</span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' as const }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Guide</span>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#F3F4F6', color: '#374151', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Fundamentals</span>
        <span style={{ fontSize: '0.75rem', color: '#6B7280', padding: '0.25rem 0.75rem', backgroundColor: '#F3F4F6', borderRadius: '9999px' }}>Updated May 2026</span>
      </div>

      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
        What is an AI Agent?
      </h1>

      {/* Intro */}
      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem', maxWidth: '700px' }}>
        An AI agent is software that autonomously takes actions to complete a goal without requiring human input at each step. Unlike a traditional software tool that responds to commands, or an AI assistant that generates text for a human to act on, an AI agent is given a goal and works independently to achieve it — planning which steps to take, using external tools to execute those steps, and adapting when it encounters obstacles.
      </p>

      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem', maxWidth: '700px' }}>
        The term is used loosely in the market. Everything from a simple chatbot with a few FAQ responses to a fully autonomous software engineer that reviews pull requests gets called an "AI agent." The meaningful distinction is autonomy: does the system require human direction to move from one step to the next, or does it complete a workflow and report back? That test separates tools that are genuinely agentic from tools that are assistants with agent branding.
      </p>

      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem', maxWidth: '700px' }}>
        AI agents are commercially deployable across every major business function in 2026. Sales agents prospect accounts and run outbound sequences without manual input from a rep. Customer support agents resolve the majority of first-tier tickets autonomously. Coding agents write and review code across entire codebases. Research agents synthesise information from hundreds of sources in minutes. The deployment pattern is consistent: the agent handles the high-volume, repetitive, well-defined work; humans handle the judgment-intensive decisions and the exceptions.
      </p>

      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '2rem', maxWidth: '700px' }}>
        This guide explains what AI agents are, how the technology works, how they differ from chatbots and automation workflows, and what the five main categories of business AI agents do. It is the foundation for evaluating any specific tool.
      </p>

      <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '3rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#0369A1', lineHeight: 1.6, margin: 0 }}>
          <strong>One sentence definition:</strong> An AI agent is software that perceives its environment, makes decisions, and takes actions autonomously to achieve a defined goal — without a human directing each step.
        </p>
      </div>

      {/* Simple definition */}
      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', marginTop: '2.5rem' }}>The simple definition</h2>
      <p style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.75, marginBottom: '1rem' }}>
        Traditional software does what you tell it to do, one command at a time. It executes the instruction and waits for the next one. An AI agent does what you ask it to achieve and determines the steps itself.
      </p>
      <p style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.75, marginBottom: '1rem' }}>
        Give a traditional tool the task of sending personalised emails to 200 prospects and it waits for you to do each step manually: find the contacts, research each one, write each email, send each one, track each response. Give the same task to an AI sales agent and it identifies the prospects, researches each company, writes personalised emails using that research, sends them on an optimised schedule, monitors replies, follows up with non-responders, and logs every interaction in your CRM — without you touching the keyboard between the initial instruction and the final report.
      </p>
      <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '2.5rem' }}>
        The distinction is not the quality of the AI — assistants like ChatGPT and Claude are extremely capable. The distinction is who drives the process. An assistant helps you work. An agent works while you do something else.
      </p>

      {/* How they work */}
      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', marginTop: '2.5rem' }}>How AI agents work</h2>
      <p style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem' }}>
        Every AI agent is built on four core components. The sophistication of each determines how capable and reliable the agent is in production. Understanding these components is also useful for evaluating vendor claims — a product that is missing any of the four is more limited than it may appear in a demo.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.875rem', marginBottom: '2.5rem' }}>
        {[
          {
            label: 'Reasoning engine',
            desc: 'A large language model — Claude, GPT-4o, Gemini, or similar — that understands the goal, plans which steps to take, evaluates information it encounters, and decides what action to take next. The model is what gives the agent the ability to handle variable inputs and novel situations rather than following a fixed script. The quality of the reasoning engine determines how well the agent handles ambiguity, how reliably it picks the right tool for each step, and how gracefully it recovers when something goes wrong.',
          },
          {
            label: 'Tools and integrations',
            desc: 'The APIs, databases, browsers, and external applications the agent can call to take actions in the real world. An agent without tools can only produce text — tools are what allow it to actually do things: search the web, read a CRM, send an email, write to a database, or call any external service. The breadth and depth of the tool set determines the scope of tasks the agent can handle. An agent with only a web search tool cannot update your CRM. An agent with CRM read and write access can both research and log.',
          },
          {
            label: 'Memory',
            desc: 'The ability to maintain context within a task and across sessions. In-context memory holds everything that has happened in the current task so the agent can make decisions informed by prior steps. Session memory persists information across conversations with the same user. Long-term memory stores learned preferences, past outputs, and accumulated knowledge across all interactions. Memory is what separates agents that improve over time and adapt to the specific context of the organisation from those that start fresh on every task as if nothing came before.',
          },
          {
            label: 'Feedback loop and self-correction',
            desc: 'The ability to evaluate its own outputs, detect when a step failed or produced wrong results, and retry with corrections — without human intervention. This self-correction capability is the defining characteristic of genuinely agentic systems. Without it, an agent that encounters an unexpected error simply fails. With it, the agent can attempt alternative approaches, notify a human only when it genuinely cannot resolve the issue, and complete the workflow autonomously for the cases that fall within its capability envelope.',
          },
        ].map((item) => (
          <div key={item.label} style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.25rem 1.5rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.5rem' }}>{item.label}</h3>
            <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Comparison table */}
      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', marginTop: '2.5rem' }}>AI agent vs chatbot vs automation</h2>
      <p style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem' }}>
        All three terms appear in vendor marketing but describe fundamentally different capability levels. The distinction matters when evaluating tools — many products marketed as AI agents are actually chatbots or automation workflows with more sophisticated interfaces.
      </p>
      <div style={{ overflowX: 'auto' as const, marginBottom: '2.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' as const, fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#F9FAFB' }}>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left' as const, fontWeight: 600, color: '#374151', borderBottom: '1px solid #E5E7EB', width: '22%' }}></th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left' as const, fontWeight: 600, color: '#111827', borderBottom: '1px solid #E5E7EB' }}>Chatbot</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left' as const, fontWeight: 600, color: '#111827', borderBottom: '1px solid #E5E7EB' }}>Automation</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left' as const, fontWeight: 600, color: '#2563EB', borderBottom: '1px solid #E5E7EB' }}>AI Agent</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Driven by', 'User messages', 'Predefined triggers', 'Goals and reasoning'],
              ['Decision making', 'Responds to input', 'Follows fixed rules', 'Plans and adapts'],
              ['Multi-step tasks', 'No', 'Limited to fixed sequences', 'Yes — variable paths'],
              ['Handles exceptions', 'No', 'No', 'Yes — self-corrects'],
              ['Improves over time', 'No', 'No', 'Yes — with memory'],
              ['Human required', 'At every step', 'Only on exceptions predefined', 'Only when goal requires judgment'],
            ].map(([aspect, chatbot, automation, agent], i) => (
              <tr key={aspect} style={{ borderBottom: '1px solid #F3F4F6', backgroundColor: i % 2 === 0 ? 'white' : '#FAFAFA' }}>
                <td style={{ padding: '0.75rem 1rem', color: '#374151', fontWeight: 600, fontSize: '0.8125rem' }}>{aspect}</td>
                <td style={{ padding: '0.75rem 1rem', color: '#4B5563' }}>{chatbot}</td>
                <td style={{ padding: '0.75rem 1rem', color: '#4B5563' }}>{automation}</td>
                <td style={{ padding: '0.75rem 1rem', color: '#2563EB', fontWeight: 500 }}>{agent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Types */}
      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', marginTop: '2.5rem' }}>Types of AI agents</h2>
      <p style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem' }}>
        Commercial AI agents in 2026 are organised around five primary business functions. Each category has distinct capability requirements, integration patterns, and evaluation criteria. The index covers all five with structured data on pricing, autonomy level, and integration depth.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.875rem', marginBottom: '3rem' }}>
        {agentTypes.map((type) => (
          <div key={type.slug} style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: '1px solid #E5E7EB', padding: '1.25rem 1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <Link href={'/' + type.slug} style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#111827', textDecoration: 'none' }}>{type.name}</Link>
              <Link href={'/' + type.slug} style={{ fontSize: '0.8125rem', color: '#2563EB', fontWeight: 500, textDecoration: 'none', flexShrink: 0, marginLeft: '1rem' }}>Browse agents &#x2192;</Link>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '0.5rem' }}>{type.description}</p>
            <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: 0 }}>Examples: {type.examples}</p>
          </div>
        ))}
      </div>

      {/* FAQs */}
      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '1.25rem', marginTop: '2.5rem' }}>Frequently Asked Questions</h2>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '1rem', marginBottom: '3rem' }}>
        {faqItems.map(({ q, a }) => (
          <div key={q} style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1.25rem 1.5rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.5rem' }}>{q}</h3>
            <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.75, margin: 0 }}>{a}</p>
          </div>
        ))}
      </div>

      {/* Related */}
      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Browse AI Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>{agentCount ?? 0}+ agents indexed &#x2192;</p>
        </Link>
        <Link href="/resources/guides/ai-agent-vs-ai-assistant" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Agent vs Assistant</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>Key differences &#x2192;</p>
        </Link>
        <Link href="/resources/guides/how-to-evaluate-an-ai-agent" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>How to Evaluate an Agent</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>Buying framework &#x2192;</p>
        </Link>
        <Link href="/stacks" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Agent Stacks</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>Multi-agent workflows &#x2192;</p>
        </Link>
      </div>

      <p style={{ fontSize: '0.875rem', color: '#9CA3AF', lineHeight: 1.6 }}>
        All agents listed on The AI Agent Index are editorially reviewed. See our <Link href="/methodology" style={{ color: '#6B7280' }}>editorial methodology</Link>.
      </p>

      <GuideCitations slug="what-is-an-ai-agent" table="guides" />
    </div>
  )
}