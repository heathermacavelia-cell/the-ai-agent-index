import Link from 'next/link'
import type { Metadata } from 'next'
import GuideCitations from '@/components/GuideCitations'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Multi-Agent Orchestration: How It Works in Practice (2026) | The AI Agent Index',
  description: 'How specialised AI agents coordinate to complete complex workflows. Architecture patterns, production use cases, failure modes, and framework comparison for 2026.',
  openGraph: {
    title: 'Multi-Agent Orchestration: How It Works in Practice (2026)',
    description: 'How specialised AI agents coordinate to complete complex workflows. Architecture patterns, production use cases, failure modes, and framework comparison.',
    url: 'https://theaiagentindex.com/resources/guides/multi-agent-orchestration',
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary',
    title: 'Multi-Agent Orchestration: How It Works in Practice (2026)',
    description: 'Architecture patterns, production use cases, failure modes, and framework comparison for multi-agent AI systems.',
  },
  alternates: {
    canonical: 'https://theaiagentindex.com/resources/guides/multi-agent-orchestration',
  },
}

export default function MultiAgentOrchestrationPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Multi-Agent Orchestration: How It Works in Practice (2026)',
    description: 'How specialised AI agents coordinate to complete complex workflows. Architecture patterns, production use cases, failure modes, and framework comparison.',
    url: 'https://theaiagentindex.com/resources/guides/multi-agent-orchestration',
    datePublished: '2026-04-04',
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
        name: 'What is multi-agent orchestration?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Multi-agent orchestration is the practice of coordinating multiple AI agents to work together on a shared goal, each handling a specific subtask and passing outputs to the next agent in a pipeline or parallel workflow. An orchestrator manages the coordination, sequencing, and error handling between agents. The pattern is used when a task is too complex, too long, or too specialised to be handled reliably by a single agent alone.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the difference between sequential and parallel multi-agent orchestration?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sequential orchestration runs agents one after another where each output becomes the next input — the output of the research agent feeds the drafting agent, which feeds the editing agent. Parallel orchestration runs multiple agents simultaneously on independent subtasks and merges their outputs — three competitor analysis agents running at the same time, with a synthesis agent combining the results. Sequential is simpler and more reliable. Parallel is faster when subtasks are genuinely independent but introduces more complexity in the aggregation and error handling logic.',
        },
      },
      {
        '@type': 'Question',
        name: 'What frameworks are used for multi-agent orchestration in 2026?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The main frameworks in 2026 are LangGraph for complex stateful workflows requiring fine-grained control, CrewAI for role-based agent teams with a more intuitive interface, AutoGen from Microsoft for conversational multi-agent systems, and OpenAI Swarm for lightweight agent handoffs. For non-engineering teams, Make and Zapier offer visual multi-agent workflow builders that handle most common automation use cases without requiring code. Framework choice should follow team capability and use case complexity rather than technical novelty.',
        },
      },
      {
        '@type': 'Question',
        name: 'When should you use multi-agent instead of a single agent?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Use multi-agent when the workflow requires more context than a single agent can hold in one conversation, when different subtasks benefit from meaningfully different specialisation or model configurations, or when parallel execution would reduce time to completion for time-sensitive workflows. Do not use multi-agent simply because the task is complex — a single well-prompted agent with good tools handles most complex tasks more reliably and cheaply than a multi-agent system. Add agents only when you have hit a concrete limitation of a single-agent approach.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the biggest risk of multi-agent systems in production?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Error propagation is the primary production failure mode. A slightly wrong output from agent one gets amplified by agent two, and by agent four the chain has degraded significantly. The fix is output validation between every step — checking that each agent produced an acceptable output before passing it forward, not just checking the final result. Cost multiplication is the secondary risk: each agent call adds latency and API cost, and a four-agent pipeline that encounters errors and retries can cost 8-10x more than expected. Both risks are manageable with proper design but are underappreciated by teams new to multi-agent systems.',
        },
      },
    ],
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
        <span style={{ fontSize: '0.8125rem', color: '#111827' }}>Multi-Agent Orchestration</span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' as const }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Guide</span>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#F3F4F6', color: '#374151', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Technical</span>
        <span style={{ fontSize: '0.75rem', color: '#6B7280', padding: '0.25rem 0.75rem', backgroundColor: '#F3F4F6', borderRadius: '9999px' }}>Updated May 2026</span>
      </div>

      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
        Multi-Agent Orchestration: How It Works in Practice (2026)
      </h1>

      {/* Intro */}
      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem', maxWidth: '700px' }}>
        Multi-agent orchestration coordinates multiple AI agents to work together on a shared goal — each handling a specific subtask, passing outputs to the next agent, and managed by an orchestrator that sequences the work and handles failures. Anthropic&apos;s December 2024 research note <em>Building Effective Agents</em> defines the canonical pattern: an orchestrator LLM dynamically delegates to worker LLMs and synthesises their outputs, used for tasks &quot;too long to complete in a single context window&quot; and those that benefit from specialisation.
      </p>

      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem', maxWidth: '700px' }}>
        Multi-agent systems are genuinely useful for the right problems. They are also one of the most over-engineered solutions in AI development — teams reach for them because they sound sophisticated, when a single well-built agent would produce better results at lower cost and complexity. Before designing a multi-agent system, the most important question is whether you have actually hit the limitations of a single agent. Most teams have not.
      </p>

      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem', maxWidth: '700px' }}>
        The cases where multi-agent architecture is the right answer are specific: workflows that genuinely exceed a single context window, tasks where different subtasks require meaningfully different model capabilities or system prompts, and scenarios where parallel execution of independent subtasks would produce a material reduction in processing time. Outside those cases, a single agent with the right tools is simpler, cheaper, and more reliable.
      </p>

      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '2rem', maxWidth: '700px' }}>
        This guide covers the three orchestration patterns used in production, real use case examples for each, the frameworks available and when to use them, the failure modes that affect multi-agent systems specifically, and a clear framework for deciding whether your use case actually requires multiple agents.
      </p>

      <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '3rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#0369A1', lineHeight: 1.6, margin: 0 }}>
          <strong>One sentence definition:</strong> Multi-agent orchestration is the practice of coordinating multiple specialised AI agents to complete workflows that no single agent could handle alone — either because the task exceeds one context window, benefits from specialisation, or requires parallel execution.
        </p>
      </div>

      {/* Task decomposition */}
      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', marginTop: '2.5rem' }}>The Core Concept: Task Decomposition</h2>
      <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1rem' }}>
        The foundation of every multi-agent system is task decomposition: breaking a complex workflow into discrete subtasks, each of which can be assigned to a specialised agent optimised for that function. An orchestrator agent coordinates the sequence, passes context between agents, and handles errors or exceptions when individual agents fail or produce unacceptable outputs.
      </p>
      <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1rem' }}>
        The key design decision is the granularity of decomposition. Too coarse and you have not gained anything over a single agent. Too granular and you have created a system with so many handoffs that error propagation becomes the dominant cost. The right decomposition maps to natural boundaries in the workflow — where the inputs, outputs, and required capabilities genuinely differ between steps.
      </p>
      <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1.5rem' }}>
        A concrete example: researching a prospect, drafting a personalised email, scheduling a follow-up, and logging the result to a CRM is a four-step workflow that maps cleanly to four agents. Each step has distinct inputs, distinct outputs, and benefits from a different system prompt and toolset. That is the right level of decomposition. Breaking &quot;draft an email&quot; into &quot;draft the subject line&quot; and &quot;draft the body&quot; as separate agents would be over-engineering with no meaningful benefit.
      </p>

      {/* Three patterns */}
      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '1rem', marginTop: '2.5rem' }}>The Three Orchestration Patterns</h2>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '1rem', marginBottom: '2rem' }}>
        {[
          {
            name: 'Sequential Orchestration',
            tag: 'Most common',
            tagColor: '#059669',
            desc: 'Agents operate one after another in a fixed pipeline. The output of Agent A becomes the input of Agent B. Each step depends on the previous one, so the pipeline is linear and order-dependent. This is the simplest pattern to build, debug, and monitor — there is a clear data flow and a clear point of failure when something goes wrong.',
            example: 'Research agent → Summary agent → Formatting agent → Publishing agent',
            usedFor: 'Content workflows, research pipelines, report generation, document processing, data enrichment chains.',
          },
          {
            name: 'Parallel Orchestration',
            tag: 'Fastest',
            tagColor: '#2563EB',
            desc: 'Multiple agents run simultaneously on independent subtasks and their outputs are merged by an aggregator. This is the right pattern when subtasks are genuinely independent — when the output of one agent does not affect the input of another. The aggregation step is the most complex part of this pattern and where most failures occur if output formats are inconsistent.',
            example: 'Competitor A agent + Competitor B agent + Competitor C agent → Synthesis agent',
            usedFor: 'Competitive intelligence, market research across multiple sources, parallel data extraction, simultaneous content variations.',
          },
          {
            name: 'Hierarchical Orchestration',
            tag: 'Most flexible',
            tagColor: '#7C3AED',
            desc: 'A manager agent delegates tasks to worker agents, evaluates their outputs, and decides whether to accept, retry, or escalate. This is the most powerful and most complex pattern — closest to how human teams operate. The manager agent needs to be capable enough to reliably evaluate worker outputs, which typically means using a more capable (and more expensive) model for the orchestrator than for the workers.',
            example: 'Manager agent → Worker agents → Manager evaluates → Accept or retry',
            usedFor: 'Complex workflows with variable paths, quality control loops, tasks requiring judgment about output acceptability, agentic coding and research.',
          },
        ].map((pattern) => (
          <div key={pattern.name} style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.875rem', overflow: 'hidden' }}>
            <div style={{ backgroundColor: '#F9FAFB', padding: '1rem 1.25rem', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#111827', margin: 0 }}>{pattern.name}</h3>
              <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'white', backgroundColor: pattern.tagColor, borderRadius: '9999px', padding: '0.125rem 0.5rem' }}>{pattern.tag}</span>
            </div>
            <div style={{ padding: '1.25rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '0.875rem' }}>{pattern.desc}</p>
              <p style={{ fontSize: '0.8125rem', color: '#6B7280', fontFamily: 'monospace', backgroundColor: '#F9FAFB', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', marginBottom: '0.75rem' }}>{pattern.example}</p>
              <p style={{ fontSize: '0.8125rem', color: '#374151', lineHeight: 1.6, margin: 0 }}><strong>Used for:</strong> {pattern.usedFor}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Frameworks */}
      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', marginTop: '2.5rem' }}>Framework Comparison (2026)</h2>
      <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1.25rem' }}>
        Framework choice should follow team capability and use case complexity. The most capable framework is not always the right one — teams that over-engineer with LangGraph when Zapier would have been sufficient waste weeks of engineering time for minimal additional capability. Start with the simplest tool that handles your use case, and move up the stack only when you hit concrete limitations.
      </p>
      <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#F9FAFB' }}>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#111827', borderBottom: '1px solid #E5E7EB' }}>Framework</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#111827', borderBottom: '1px solid #E5E7EB' }}>Best For</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#111827', borderBottom: '1px solid #E5E7EB' }}>Technical Level</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#111827', borderBottom: '1px solid #E5E7EB' }}>Open Source</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['LangGraph', 'Complex stateful workflows needing fine-grained control', 'High', 'Yes'],
              ['CrewAI', 'Role-based agent teams with intuitive configuration', 'Medium', 'Yes'],
              ['AutoGen (Microsoft)', 'Conversational multi-agent systems', 'Medium', 'Yes'],
              ['OpenAI Swarm', 'Lightweight agent handoffs and routing', 'Medium', 'Yes'],
              ['Make / Zapier', 'No-code visual multi-agent workflows', 'Low', 'No'],
            ].map(([framework, bestFor, level, oss]) => (
              <tr key={framework} style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '0.75rem 1rem', color: '#111827', fontWeight: 600 }}>{framework}</td>
                <td style={{ padding: '0.75rem 1rem', color: '#4B5563' }}>{bestFor}</td>
                <td style={{ padding: '0.75rem 1rem', color: '#4B5563' }}>{level}</td>
                <td style={{ padding: '0.75rem 1rem', color: oss === 'Yes' ? '#059669' : '#6B7280', fontWeight: 500 }}>{oss}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reliability */}
      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', marginTop: '2.5rem' }}>The Biggest Challenge: Reliability and Error Propagation</h2>
      <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1rem' }}>
        Error propagation is the primary failure mode of multi-agent systems in production. Agent one produces a slightly wrong output. Agent two amplifies it. By agent four the chain has degraded significantly. In a single-agent system, a bad output is immediately visible. In a multi-agent pipeline, the failure can propagate through several steps before it produces an output that is obviously wrong — by which point significant compute cost has already been spent.
      </p>
      <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1.25rem' }}>
        The fix is validation between every step, not just at the end of the chain. Each agent&apos;s output should be checked against an expected format and quality bar before being passed to the next agent. This adds latency and complexity but is non-negotiable for production reliability. A pipeline that checks at the end only is a pipeline that produces expensive garbage at scale.
      </p>
      <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1.25rem' }}>
        Cost multiplication is the secondary risk. Each agent call adds API cost and latency. A four-agent pipeline where one agent fails and triggers a retry can cost 8 to 10 times what a clean run costs. Without per-pipeline cost caps and alerting, a misbehaving multi-agent workflow can produce significant unexpected spend before anyone notices. Build cost controls into the system from the start, not as an afterthought.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.75rem', marginBottom: '2rem' }}>
        {[
          { label: 'Output validation between steps', desc: 'Validate each agent output against expected format and quality criteria before passing it to the next step. Reject and retry outputs that fail checks rather than propagating them forward.' },
          { label: 'Fallback logic at each step', desc: 'Define what happens when an agent fails. Options include retry with a modified prompt, skip the step with a default value, or escalate to a human. Every step needs an explicit failure path.' },
          { label: 'Human-in-the-loop for consequential actions', desc: 'For any action that is difficult to reverse — sending an email, publishing content, executing a transaction, modifying a record — require human approval before the agent proceeds. Configure this at the pipeline level, not inside individual agents.' },
          { label: 'Per-pipeline observability and cost caps', desc: 'Log every agent input, output, decision, and cost. Without full visibility into what each agent produced, debugging failures is nearly impossible. Per-pipeline cost caps with hard stops prevent runaway spend on misbehaving workflows.' },
        ].map((item) => (
          <div key={item.label} style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.25rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '0.875rem', color: '#111827', marginBottom: '0.375rem' }}>{item.label}</h3>
            <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Single vs multi */}
      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', marginTop: '2.5rem' }}>Single Agent vs Multi-Agent: When to Use Each</h2>
      <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1.25rem' }}>
        The default should always be a single agent. Multi-agent adds complexity, cost, and failure surface area. Only add a second agent when you have hit a concrete limitation of the single-agent approach — not in anticipation of limitations you expect to encounter.
      </p>
      <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#F9FAFB' }}>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#111827', borderBottom: '1px solid #E5E7EB' }}>Use Single Agent When</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#111827', borderBottom: '1px solid #E5E7EB' }}>Use Multi-Agent When</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Task fits in one context window', 'Workflow genuinely exceeds one context window'],
              ['Steps are sequential and simple', 'Subtasks require meaningfully different specialisation'],
              ['Speed and cost are top priority', 'Parallel execution would materially reduce time'],
              ['No-code or low-code setup required', 'Different steps need different model capabilities'],
              ['You haven\'t hit single-agent limitations yet', 'You have a concrete single-agent limitation to solve'],
            ].map(([single, multi], i) => (
              <tr key={i} style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '0.75rem 1rem', color: '#4B5563' }}>{single}</td>
                <td style={{ padding: '0.75rem 1rem', color: '#2563EB', fontWeight: 500 }}>{multi}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FAQs */}
      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '1.25rem', marginTop: '2.5rem' }}>Frequently Asked Questions</h2>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '1rem', marginBottom: '2.5rem' }}>
        {faqLd.mainEntity.map(({ name, acceptedAnswer }) => (
          <div key={name} style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1.25rem 1.5rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.5rem' }}>{name}</h3>
            <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.75, margin: 0 }}>{acceptedAnswer.text}</p>
          </div>
        ))}
      </div>

      {/* Related */}
      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/resources/guides/how-to-build-an-ai-agent" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>How to Build an AI Agent</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>Start with a single agent &#x2192;</p>
        </Link>
        <Link href="/ai-coding-agents" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>AI Coding Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>Tools that build agents &#x2192;</p>
        </Link>
        <Link href="/resources/guides/what-is-an-ai-agent" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>What is an AI Agent?</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>Start with the basics &#x2192;</p>
        </Link>
        <Link href="/stacks" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Agent Stacks</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>Real multi-agent workflows &#x2192;</p>
        </Link>
      </div>

      <p style={{ fontSize: '0.875rem', color: '#9CA3AF', lineHeight: 1.6 }}>
        All agents listed are editorially reviewed by The AI Agent Index. See our <Link href="/methodology" style={{ color: '#6B7280' }}>editorial methodology</Link>.
      </p>

      <GuideCitations slug="multi-agent-orchestration" table="guides" />
    </div>
  )
}