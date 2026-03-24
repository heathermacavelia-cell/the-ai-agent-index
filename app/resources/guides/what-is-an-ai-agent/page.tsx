import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'What is an AI Agent? Definition, Examples and How They Work (2026)',
  description: 'An AI agent is software that autonomously takes actions to complete a goal without human input at each step. This guide covers how they work, types, examples, and how to evaluate them.',
}

export default function WhatIsAnAIAgentPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'What is an AI Agent? Definition, Examples and How They Work',
    description: 'An AI agent is software that autonomously takes actions to complete a goal without human input at each step.',
    url: 'https://theaiagentindex.com/resources/guides/what-is-an-ai-agent',
    datePublished: '2026-03-23',
    dateModified: '2026-03-23',
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
        name: 'What is an AI agent?',
        acceptedAnswer: { '@type': 'Answer', text: 'An AI agent is software that autonomously takes actions to complete a goal without requiring human input at each step. Unlike traditional software that responds to commands, AI agents plan, decide, and act on their own to achieve an objective.' },
      },
      {
        '@type': 'Question',
        name: 'What is the difference between an AI agent and a chatbot?',
        acceptedAnswer: { '@type': 'Answer', text: 'A chatbot responds to individual messages in a conversation. An AI agent takes multi-step autonomous action toward a goal — it can browse the web, write and send emails, update databases, and complete complex workflows without a human directing each step.' },
      },
      {
        '@type': 'Question',
        name: 'What are examples of AI agents?',
      acceptedAnswer: { '@type': 'Answer', text: 'Examples include: AI sales agents that autonomously prospect and send outreach emails, AI coding agents that write and review code, AI customer support agents that resolve tickets without human intervention, and AI research agents that conduct multi-step web research and produce structured reports.' },
      },
      {
        '@type': 'Question',
        name: 'How do AI agents work?',
        acceptedAnswer: { '@type': 'Answer', text: 'AI agents use a large language model (LLM) as a reasoning engine, connect to external tools and APIs to take action, and often maintain memory across steps. They receive a goal, break it into tasks, execute those tasks using their tools, evaluate the results, and continue until the goal is complete.' },
      },
    ],
  }

  const agentTypes = [
    { name: 'AI Sales Agents', slug: 'ai-sales-agents', description: 'Autonomously prospect accounts, write personalised outreach, manage follow-up sequences, and sync results to your CRM.', examples: 'Instantly.ai, Apollo.io, Artisan Ava, Clay' },
    { name: 'AI Customer Support Agents', slug: 'ai-customer-support-agents', description: 'Resolve support tickets, triage queries, handle returns and refunds, and escalate complex issues to human agents.', examples: 'Intercom Fin, Zendesk AI, Sierra, Decagon' },
    { name: 'AI Research Agents', slug: 'ai-research-agents', description: 'Conduct multi-step web research, search academic literature, synthesise findings, and produce structured reports with citations.', examples: 'Perplexity AI, Elicit, ChatGPT Deep Research, Consensus' },
    { name: 'AI Marketing Agents', slug: 'ai-marketing-agents', description: 'Generate content, optimise SEO, automate paid campaigns, personalise messaging, and report on performance.', examples: 'Jasper, Copy.ai, Persado, Albert.ai' },
    { name: 'AI Coding Agents', slug: 'ai-coding-agents', description: 'Write, review, and refactor code across entire codebases — from inline autocomplete to fully autonomo software engineering.', examples: 'Cursor, GitHub Copilot, Devin, Windsurf' },
  ]

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <div style={{ marginBottom: '0.75rem' }}>
        <Link href="/" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none' }}>Home</Link>
        <span style={{ color: '#D1D5DB', margin: '0 0.5rem' }}>/</span>
        <Link href="/resources/guides" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none' }}>Guides</Link>
        <span style={{ color: '#D1D5DB', margin: '0 0.5rem' }}>/</span>
        <span style={{ fontSize: '0.8125rem', color: '#111827' }}>What is an AI Agent?</span>
      </div>

      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Guide · Fundamentals</p>
      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
        What is an AI Agent?
      </h1>
      <p style={{ fontSize: '1.0625rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '680px' }}>
        An AI agent is software that autonomously takes actions to complete a goal — without requiring human input at each step. Understanding what AI agents are, how they work, and where they fit in your stack is the foundation for evaluating any specific tool.
      </p>

      <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#0369A1', lineHeight: 1.6, margin: 0 }}>
          <strong>One sentence definition:</strong> An AI agent is software that perceives  environment, makes decisions, and takes actions autonomously to achieve a defined goal.
        </p>
      </div>

      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', marginTop: '2.5rem' }}>The Simple Definition</h2>
      <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '1rem' }}>
        Traditional software does what you tell it to do, one command at a time. An AI agent does what you ask it to achieve — and figures out the steps itself.
      </p>
      <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '1rem' }}>
        Give a traditional tool a task like "find 200 companies that match our ICP and send them a personalised email" and it will wait for you to do each step manually. Give the same task to an AI sales agent and it will identify the companies, research each one, write personalised emails, send them, track responses, follow up with non-responders, and log everything in your C — without you touching the keyboard.
      </p>

      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', marginTop: '2.5rem' }}>How AI Agents Work</h2>
      <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '1rem' }}>
        Most AI agents are built on four core components:
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'LLM reasoning engine', desc: 'A large language model (GPT-4, Claude, Gemini) that understands goals, plans steps, and generates outputs.' },
          { label: 'Tools and integrations', desc: 'APIs, databases, browsers, and applications the agent can use to take real-world actions.' },
          { label: 'Memory', desc: 'Short-term context within a task and long-term memory across sessions so the agent improves over time.' },
          { label: 'Feedback loop', desc: 'The ability to evaluate its own outputs, coect mistakes, and retry failed actions without human intervention.' },
        ].map((item) => (
          <div key={item.label} style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1rem 1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#2563EB', flexShrink: 0, minWidth: '160px' }}>{item.label}</span>
            <span style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.6 }}>{item.desc}</span>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', marginTop: '2.5rem' }}>AI Agent vs Chatbot vs Automation</h2>
      <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#F9FAFB' }}>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#111827', borderBottom: '1px solid #E5E7EB' }}></th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#111827', borderBottom: '1px solid #E5E7EB' }}>Chatbot</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#111827', borderBottom: '1px solid #E5E7EB' }}>Automation</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#111827', borderBottom: '1px solid #E5E7EB' }}>AI Agent</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Driven by', 'User messages', 'Predefined triggers', 'Goals and reasoning'],
              ['Decision making', 'Responds to input', 'Follows fixed rules', 'Plans and adapts'],
              ['Multi-step tasks', 'No', 'Limited', 'Yes'],
              ['Handles exceptions', 'No', 'No', 'Yes'],
              ['Improves over time', 'No', 'No', 'Often yes'],
            ].map(([aspect, chatbot, automation, agent]) => (
              <tr key={aspect} style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '0.75rem 1rem', color: '#374151', fontWeight: 500 }}>{aspect}</td>
                <td style={{ padding: '0.75rem 1rem', color: '#4B5563' }}>{chatbot}</td>
                <td style={{ padding: '0.75rem 1rem', color: '#4B5563' }}>{automation}</td>
                <td style={{ padding: '0.75rem 1rem', color: '#2563EB', fontWeight: 500 }}>{agent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '1rem', marginTop: '2.5rem' }}>Types of AI Agents</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        {agentTypes.map((type) => (
          <Link key={type.slug} href={'/' + type.slug}
            style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: '1px solid #E5E7EB', padding: '1.25rem', textDecoration: 'none', display: 'block' }}>
            <h3 style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.375rem' }}>{type.name}</h3>
            <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.6, marginBottom: '0.5rem' }}>{type.description}</p>
            <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>Examples: {type.examples}</p>
          </Link>
        ))}
      </div>

      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '1.25rem', marginTop: '2.5rem' }}>Frequently Asked Questions</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
        {[
          { q: 'What is an AI agent?', a: 'An AI agent is software that autonomously takes actions to complete a goal without requiring human input at each step. Unlike traditional software that responds to commands, AI agents plan, decide, and act on their own.' },
          { q: 'What is the difference between an AI agent and a chatbot?', a: 'A chatbot responds to individual messages. An AI agent takes multi-step autonomous action toward a goal — it can browse the web, write and send emails, update databases, and complete complex workflows without a human directing each step.' },
          { q: 'What are examples of AI agents?', a: 'AI sales agents that prospect and send outreach, AI coding agents that write and review code, AI customer support agents that resolve tickets, and AI research agents that conduct multi-step research and produce structured reports.' },
          { q: 'How do AI agents work?', a: 'AI agents use a large language model as a reasoning engine, connect to external tools to take action, and maintain memory across steps. They receive a goal, break it into tasks, execute those tasks, evaluate results, and continue until the goal is complete.' },
        ].map(({ q, a }) => (
          <div key={q} style={{ backgroundColor: '#F9FAFB', bderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1.25rem' }}>
            <p style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.5rem' }}>{q}</p>
            <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.65, margin: 0 }}>{a}</p>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        <Link href="/ai-sales-agents" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Browse AI Sales Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>200+ agents indexed →</p>
        </Link>
        <Link href="/compare" style={{ backgroundColor: 'white', borderRadius: '0.75rem'border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Compare Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Side-by-side comparisons →</p>
        </Link>
        <Link href="/resources/guides/how-to-evaluate-an-ai-agent" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>How to Evaluate an Agent</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Buying framework →</p>
        </Link>
      </div>
    </div>
  )
}
