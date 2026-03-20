import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Agent Definitions & Glossary — AI Agent Index',
  description: 'Clear definitions of AI agent terminology — what they are, how they work, and how to evaluate them for your business.',
}

const DEFINITIONS = [
  { slug: 'what-is-an-ai-sales-agent', title: 'What is an AI Sales Agent?', description: 'AI agents that automate prospecting, outbound email, lead enrichment, and CRM workflows to accelerate revenue.', category: 'ai-sales-agents' },
  { slug: 'what-is-an-ai-customer-support-agent', title: 'What is an AI Customer Support Agent?', description: 'AI agents that autonomously resolve support tickets, triage queries, and provide omnichannel service at scale.', category: 'ai-customer-support-agents' },
  { slug: 'what-is-an-ai-research-agent', title: 'What is an AI Research Agent?', description: 'AI agents that conduct multi-step web research, search academic literature, and generate structured reports.', category: 'ai-research-agents' },
  { slug: 'what-is-an-ai-marketing-agent', title: 'What is an AI Marketing Agent?', description: 'AI agents that generate content, optimise SEO, automate paid campaigns, and personalise messaging at scale.', category: 'ai-marketing-agents' },
  { slug: 'what-is-an-ai-coding-agent', title: 'What is an AI Coding Agent?', description: 'AI agents that write, review, and refactor code — from inline autocomplete to fully autonomous multi-file engineering.', category: 'ai-coding-agents' },
]

export default function DefinitionsIndexPage() {
  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6B7280', marginBottom: '2rem' }}>
        <Link href="/" style={{ color: '#6B7280', textDecoration: 'none' }}>Home</Link>
        <span style={{ color: '#D1D5DB' }}>/</span>
        <span style={{ color: '#111827' }}>Definitions</span>
      </nav>

      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
        AI Agent Definitions
      </h1>
      <p style={{ color: '#4B5563', fontSize: '1.0625rem', lineHeight: 1.7, marginBottom: '3rem', maxWidth: '600px' }}>
        Clear, structured definitions of AI agent categories — what they are, how they work, and how to evaluate them for your business.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {DEFINITIONS.map((def) => (
          <Link key={def.slug} href={'/definitions/' + def.slug}
            style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.5rem', textDecoration: 'none', display: 'block' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.0625rem', color: '#111827', marginBottom: '0.375rem' }}>{def.title}</h2>
            <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.6, marginBottom: '0.75rem' }}>{def.description}</p>
            <span style={{ fontSize: '0.8125rem', color: '#2563EB' }}>Read definition →</span>
          </Link>
        ))}
      </div>
    </div>
  )
}