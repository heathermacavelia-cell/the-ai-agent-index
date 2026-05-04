import Link from 'next/link'
import type { Metadata } from 'next'
import GuideCitations from '@/components/GuideCitations'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'How to Build an AI Agent (That Actually Works in Production)',
  description: 'Workflow vs agent, build vs buy, real TypeScript code, honest cost math, and the 5 production failure modes that will bite you. For builders who want to ship.',
  openGraph: {
    title: 'How to Build an AI Agent (That Actually Works in Production)',
    description: 'Workflow vs agent, build vs buy, real TypeScript code, honest cost math, and the 5 production failure modes that will bite you.',
    url: 'https://theaiagentindex.com/resources/guides/how-to-build-an-ai-agent',
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary',
    title: 'How to Build an AI Agent (That Actually Works in Production)',
    description: 'Workflow vs agent, build vs buy, real code, cost math, and 5 failure modes.',
  },
  alternates: {
    canonical: 'https://theaiagentindex.com/resources/guides/how-to-build-an-ai-agent',
  },
}

export default function HowToBuildAnAIAgentPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'How to Build an AI Agent (That Actually Works in Production)',
    description: 'Workflow vs agent, build vs buy, real TypeScript code, honest cost math, and the 5 production failure modes that will bite you.',
    url: 'https://theaiagentindex.com/resources/guides/how-to-build-an-ai-agent',
    datePublished: '2026-03-24',
    dateModified: new Date().toISOString().split('T')[0],
    publisher: { '@type': 'Organization', name: 'The AI Agent Index', url: 'https://theaiagentindex.com' },
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the difference between an AI workflow and an AI agent?',
        acceptedAnswer: { '@type': 'Answer', text: 'A workflow is a predefined sequence where an LLM is called at fixed steps with predictable inputs and outputs. An agent is a system where an LLM dynamically decides which tools to call and in what order until it accomplishes a goal. Anthropic published this distinction in their December 2024 research note "Building Effective Agents." Most teams should build workflows first and only graduate to true agents when the workflow cannot handle the variability they actually encounter.' },
      },
      {
        '@type': 'Question',
        name: 'When should I build an AI agent vs use an existing one?',
        acceptedAnswer: { '@type': 'Answer', text: 'Build only when no existing agent solves your specific use case, the integrations you need do not exist as off-the-shelf tools, or you are building proprietary functionality that becomes a competitive moat. Buy when an existing agent covers 70% or more of your needs, your use case is generic (cold email, customer support, scheduling), or the engineering cost would exceed two years of subscriptions to an existing tool.' },
      },
      {
        '@type': 'Question',
        name: 'How much does it cost to run an AI agent in production?',
        acceptedAnswer: { '@type': 'Answer', text: 'Cost depends on three variables: model pricing, average tokens per call, and call volume. A customer support triage agent processing 1,000 tickets per day with 4,000 input tokens and 500 output tokens per call would cost approximately $200 per month on Claude Haiku 4.5, around $620 per month on Claude Sonnet 4.5, and roughly $450 per month on GPT-4o. Most teams underestimate context window growth on multi-turn agents — costs can double or triple in long conversations if you do not actively manage context.' },
      },
      {
        '@type': 'Question',
        name: 'What is the most common reason AI agents fail in production?',
        acceptedAnswer: { '@type': 'Answer', text: 'The most common failure mode is hallucinated tool calls — the agent invents tool names or parameters that do not exist in your schema. The fix is strict schema validation before execution, retry with corrective feedback, and a hard iteration cap to prevent infinite loops. Other common failures include context window blow-out on long conversations, parameter type errors, and unbounded cost from runaway loops.' },
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

      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Guide · Engineering</p>
      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
        How to Build an AI Agent (That Actually Works in Production)
      </h1>

      <p style={{ fontSize: '1.0625rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '0.75rem', maxWidth: '680px' }}>
        Most AI agents people are building right now are not agents. They are workflows pretending to be agents — and the confusion costs teams weeks of unnecessary engineering. Anthropic&apos;s December 2024 research note <em>Building Effective Agents</em> draws the line: a <strong>workflow</strong> is a predefined LLM-and-tool chain where each step is decided in advance. An <strong>agent</strong> is a system where the LLM dynamically decides what to do next until the task is done. Workflows are simpler, cheaper, more reliable, and easier to debug. They are the right answer 80% of the time.
      </p>

      <p style={{ fontSize: '0.9375rem', color: '#6B7280', lineHeight: 1.7, marginBottom: '1.75rem', maxWidth: '680px' }}>
        This guide is for teams who have already determined they need a real agent — dynamic decision-making, variable tool sequences, complex state. We&apos;ll walk through the four components every production agent has, with real TypeScript code for each, the cost math you need to budget honestly, and the five failure modes that will bite you.
      </p>

      <div style={{ backgroundColor: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#92400E', lineHeight: 1.6, margin: 0 }}>
          <strong>Before you read further:</strong> the brutal build-vs-buy decision is below. Most teams who think they need to build an agent should buy one instead. <Link href="/search" style={{ color: '#92400E', textDecoration: 'underline' }}>Search the Index</Link> first.
        </p>
      </div>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '0.75rem', marginTop: '2.5rem', letterSpacing: '-0.01em' }}>Build or buy: be honest with yourself</h2>
      <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1rem' }}>
        Engineering time is the most expensive resource in any organisation. A senior developer at $200K fully loaded costs about $4,000 per week. A simple agent will take 2-4 weeks to build to MVP and another 4-8 weeks to harden for production. That is $24K-48K of engineering cost before maintenance, monitoring, and iteration. An off-the-shelf agent that solves 80% of your use case at $200/month pays for itself for a decade against that math.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '0.75rem', padding: '1.25rem' }}>
          <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#B91C1C', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Don&apos;t build if</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column' as const, gap: '0.5rem' }}>
            {[
              'An existing tool covers 70% or more of your need.',
              'Your use case is generic (cold email, scheduling, support).',
              'You are doing it because "AI agents are hot" — not because of a real problem.',
              'You don&apos;t have an engineer with production LLM experience on the team.',
              'You can&apos;t articulate what success looks like in one sentence.',
            ].map((item, i) => (
              <li key={i} style={{ fontSize: '0.8125rem', color: '#7F1D1D', lineHeight: 1.55, display: 'flex', gap: '0.5rem' }} dangerouslySetInnerHTML={{ __html: '<span style="color:#B91C1C;font-weight:700;flex-shrink:0">✗</span> ' + item }}/>
            ))}
          </ul>
        </div>
        <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '0.75rem', padding: '1.25rem' }}>
          <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#15803D', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Build if</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column' as const, gap: '0.5rem' }}>
            {[
              'No existing agent solves your specific case after a real search.',
              'The integrations you need don&apos;t exist as off-the-shelf tools.',
              'The agent IS the product or a core competitive moat.',
              'You need data flows that off-the-shelf tools can&apos;t support.',
              'Your security requirements rule out third-party hosted agents.',
            ].map((item, i) => (
              <li key={i} style={{ fontSize: '0.8125rem', color: '#14532D', lineHeight: 1.55, display: 'flex', gap: '0.5rem' }} dangerouslySetInnerHTML={{ __html: '<span style="color:#15803D;font-weight:700;flex-shrink:0">✓</span> ' + item }}/>
            ))}
          </ul>
        </div>
      </div>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '0.75rem', marginTop: '2.5rem', letterSpacing: '-0.01em' }}>Workflow or agent? The distinction that saves weeks</h2>
      <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1.25rem' }}>
        From Anthropic&apos;s research: workflows are systems where LLMs and tools are orchestrated through predefined code paths. Agents are systems where LLMs dynamically direct their own processes and tool usage. The implication is huge — if your problem can be solved with a fixed sequence of LLM calls and known tools, you do not need an agent. You need a workflow, which is dramatically simpler to build and maintain.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.25rem' }}>
          <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Workflow example</p>
          <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.65, marginBottom: '0.75rem' }}>
            Process incoming support emails: <em>extract sentiment, classify into one of 5 categories, look up the customer record, draft a templated reply.</em>
          </p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', lineHeight: 1.6, margin: 0 }}>
            Same 4 steps every time. Predictable. Easy to debug. Cheap to run. <strong>Don&apos;t build an agent for this.</strong>
          </p>
        </div>
        <div style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.25rem' }}>
          <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Agent example</p>
          <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.65, marginBottom: '0.75rem' }}>
            Triage support tickets where the LLM decides: <em>do I have enough info? Should I check the order system, the billing system, the shipping API, or escalate?</em>
          </p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', lineHeight: 1.6, margin: 0 }}>
            Variable paths. The LLM picks tools based on what it discovers. <strong>This needs a real agent.</strong>
          </p>
        </div>
      </div>
      <p style={{ fontSize: '0.875rem', color: '#6B7280', lineHeight: 1.7, marginBottom: '1.5rem', fontStyle: 'italic' }}>
        We&apos;ll use the second example — a customer support triage agent — as the running case throughout this guide.
      </p>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '0.75rem', marginTop: '2.5rem', letterSpacing: '-0.01em' }}>The 4 components every agent has</h2>
      <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1.25rem' }}>
        Strip away the framework hype and every agent is just these four pieces. Get any one wrong and the whole thing fails.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.875rem', marginBottom: '2rem' }}>
        {[
          { num: '1', name: 'Reasoning engine', desc: 'The LLM that decides what to do next. Claude, GPT, or Gemini.' },
          { num: '2', name: 'Tools', desc: 'Functions the LLM can call to take action — query a DB, send an email, hit an API.' },
          { num: '3', name: 'Memory', desc: 'What persists between calls — conversation history, prior tool results, long-term facts.' },
          { num: '4', name: 'Reasoning loop', desc: 'The orchestration: receive input, plan, call tool, evaluate, repeat — with validation and limits.' },
        ].map((c) => (
          <div key={c.num} style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
              <span style={{ fontSize: '0.625rem', fontWeight: 700, color: 'white', backgroundColor: '#2563EB', borderRadius: '9999px', padding: '0.125rem 0.5rem' }}>{c.num}</span>
              <p style={{ fontWeight: 700, fontSize: '0.875rem', color: '#111827', margin: 0 }}>{c.name}</p>
            </div>
            <p style={{ fontSize: '0.8125rem', color: '#4B5563', lineHeight: 1.55, margin: 0 }}>{c.desc}</p>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '0.75rem', marginTop: '2.5rem', letterSpacing: '-0.01em' }}>Decision 1: Pick your model</h2>
      <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1.25rem' }}>
        Three serious contenders matter for production agents in 2026. Pricing below is per million tokens (input / output) as of mid-2026 — verify current rates before budgeting. The recommendation: start with the cheapest model that passes your evals. Most teams default to flagship models out of habit and burn 5x more than necessary.
      </p>
      <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#F9FAFB' }}>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#111827', borderBottom: '1px solid #E5E7EB' }}>Model</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#111827', borderBottom: '1px solid #E5E7EB' }}>Pricing (per 1M tokens)</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#111827', borderBottom: '1px solid #E5E7EB' }}>Best for</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Claude Haiku 4.5', '$1 / $5', 'Default starting point. Fast, cheap, strong tool use.'],
              ['Claude Sonnet 4.5', '$3 / $15', 'Complex reasoning, long-context tasks, careful judgment.'],
              ['GPT-4o', '$2.50 / $10', 'Broad ecosystem, vision, function calling maturity.'],
              ['Gemini 2.5 Pro', '$1.25 / $10', 'Massive context windows (1M+), multimodal.'],
            ].map(([model, price, bestFor]) => (
              <tr key={model} style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '0.75rem 1rem', color: '#111827', fontWeight: 600 }}>{model}</td>
                <td style={{ padding: '0.75rem 1rem', color: '#4B5563', fontFamily: 'monospace', fontSize: '0.8125rem' }}>{price}</td>
                <td style={{ padding: '0.75rem 1rem', color: '#4B5563' }}>{bestFor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: '0.875rem', color: '#6B7280', lineHeight: 1.7, marginBottom: '2rem', fontStyle: 'italic' }}>
        Practical rule: build your eval set first, run it on the cheapest viable model, then upgrade only when you hit a wall. Most agent tasks do not need flagship reasoning.
      </p>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '0.75rem', marginTop: '2.5rem', letterSpacing: '-0.01em' }}>Decision 2: Design your tools</h2>
      <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1.25rem' }}>
        Tools are what turn an LLM into an agent. The model needs three things to use a tool reliably: a clear name, a description that explains <em>when</em> to use it (not just what it does), and a strict input schema. Here&apos;s a real tool definition for our customer support agent — using Anthropic&apos;s tool use format, but the structure is similar across providers:
      </p>
      <pre style={{ backgroundColor: '#0F172A', color: '#E2E8F0', padding: '1.25rem', borderRadius: '0.75rem', overflowX: 'auto', fontSize: '0.8125rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
        <code>{`const tools = [
  {
    name: "lookup_order",
    description: "Look up a customer order by email or order ID. Use this when the customer asks about delivery status, items in their order, or refund eligibility.",
    input_schema: {
      type: "object",
      properties: {
        email: { type: "string", description: "Customer email" },
        order_id: { type: "string", description: "Order ID like ORD-12345" }
      },
      required: []
    }
  },
  {
    name: "check_shipping_status",
    description: "Get real-time shipping status from the carrier. Use AFTER lookup_order has confirmed the order exists and shipped.",
    input_schema: {
      type: "object",
      properties: {
        tracking_number: { type: "string" }
      },
      required: ["tracking_number"]
    }
  },
  {
    name: "escalate_to_human",
    description: "Hand off to a human agent. Use when the issue involves refunds over $500, account security, or the customer explicitly asks for a person.",
    input_schema: {
      type: "object",
      properties: {
        reason: { type: "string", description: "Why escalation is needed" },
        priority: { type: "string", enum: ["low", "medium", "high"] }
      },
      required: ["reason", "priority"]
    }
  }
]`}</code>
      </pre>
      <p style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.7, fontWeight: 600, marginBottom: '0.5rem' }}>Three tool design rules that matter:</p>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column' as const, gap: '0.625rem', marginBottom: '2rem' }}>
        {[
          { rule: 'Descriptions explain when to use, not just what.', why: 'The model picks tools based on the description. "Look up order by email" is weak. "Use this when the customer asks about delivery status" tells the LLM the trigger.' },
          { rule: 'Fewer tools beats more tools.', why: 'Past 10-15 tools, models start choosing wrong. If you need more, group related ones into a single tool with an action parameter.' },
          { rule: 'Schemas should be strict and minimal.', why: 'Loose schemas create parameter hallucinations. Mark fields required only when truly required. Use enums for fixed value sets.' },
        ].map((item, i) => (
          <li key={i} style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.65, padding: '0.875rem 1rem', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.5rem' }}>
            <strong style={{ color: '#111827' }}>{item.rule}</strong> — {item.why}
          </li>
        ))}
      </ul>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '0.75rem', marginTop: '2.5rem', letterSpacing: '-0.01em' }}>Decision 3: Memory</h2>
      <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1.25rem' }}>
        Memory has three tiers and most teams overbuild this. Use the simplest tier that meets your needs — vector DBs are not free.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.75rem', marginBottom: '2rem' }}>
        {[
          { tier: 'Tier 1: In-context', when: 'Single conversation, fits in the context window.', how: 'Just pass message history with each call. No infrastructure. Works for most agents under 10 turns.' },
          { tier: 'Tier 2: Session-persistent', when: 'Multi-session conversations or workflows that span hours/days.', how: 'Store messages array in Postgres or Redis keyed by session ID. Retrieve on next call. Cheap, fast, deterministic.' },
          { tier: 'Tier 3: Long-term semantic', when: 'Agent needs to recall facts across thousands of past interactions.', how: 'Vector DB (Supabase pgvector, Pinecone, Weaviate) with embedding search. Adds complexity and cost — only build this when Tier 2 demonstrably fails.' },
        ].map((m) => (
          <div key={m.tier} style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1rem 1.25rem' }}>
            <p style={{ fontWeight: 700, fontSize: '0.875rem', color: '#2563EB', marginBottom: '0.375rem' }}>{m.tier}</p>
            <p style={{ fontSize: '0.8125rem', color: '#374151', lineHeight: 1.6, marginBottom: '0.25rem' }}><strong>When:</strong> {m.when}</p>
            <p style={{ fontSize: '0.8125rem', color: '#6B7280', lineHeight: 1.6, margin: 0 }}><strong>How:</strong> {m.how}</p>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '0.75rem', marginTop: '2.5rem', letterSpacing: '-0.01em' }}>Decision 4: The reasoning loop</h2>
      <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1.25rem' }}>
        The loop is where most agents fail. Here&apos;s the pattern that actually works in production — note the iteration cap, the schema validation, and the explicit error handling. Skip any of these and your agent will eventually hit a state that costs you real money:
      </p>
      <pre style={{ backgroundColor: '#0F172A', color: '#E2E8F0', padding: '1.25rem', borderRadius: '0.75rem', overflowX: 'auto', fontSize: '0.8125rem', lineHeight: 1.6, marginBottom: '2rem' }}>
        <code>{`async function runAgent(userMessage: string) {
  const messages = [{ role: "user", content: userMessage }]
  const MAX_ITERATIONS = 10
  let iterations = 0

  while (iterations < MAX_ITERATIONS) {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 1024,
      tools,
      messages
    })

    // Agent finished — return the final message
    if (response.stop_reason === "end_turn") {
      return response
    }

    // Agent wants to call a tool
    if (response.stop_reason === "tool_use") {
      const toolUse = response.content.find(c => c.type === "tool_use")
      if (!toolUse) throw new Error("Expected tool_use block")

      // Validate the tool exists and params match schema
      const result = await executeToolSafely(toolUse.name, toolUse.input)

      // Append assistant turn + tool result, then loop
      messages.push({ role: "assistant", content: response.content })
      messages.push({
        role: "user",
        content: [{
          type: "tool_result",
          tool_use_id: toolUse.id,
          content: result
        }]
      })
    }

    iterations++
  }

  throw new Error("Agent exceeded max iterations — possible loop")
}`}</code>
      </pre>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '0.75rem', marginTop: '2.5rem', letterSpacing: '-0.01em' }}>The 5 production failure modes</h2>
      <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1.25rem' }}>
        These will all happen to you. Plan for them on day one — bolting them on after launch is a much harder retrofit.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.875rem', marginBottom: '2rem' }}>
        {[
          {
            name: '1. Hallucinated tool calls',
            symptom: 'Agent invents tool names or parameters that don&apos;t exist in your schema.',
            fix: 'Validate every tool call against your schema before execution. On failure, return a structured error to the model so it can self-correct on the next iteration.',
          },
          {
            name: '2. Infinite loops',
            symptom: 'Agent calls the same tool over and over, or oscillates between two tools, never reaching end_turn.',
            fix: 'Hard iteration cap (10-15 is reasonable for most agents). Track tool call patterns and break loops if the same call repeats more than 3 times.',
          },
          {
            name: '3. Parameter type errors',
            symptom: 'Agent passes a string where you expected a number, or omits a required field.',
            fix: 'Strict JSON schema validation on every tool call. Coerce types where safe, error explicitly otherwise. Always include type constraints in your schema descriptions.',
          },
          {
            name: '4. Context window blow-out',
            symptom: 'After 20+ turns the agent slows to a crawl and costs spike. Worst case: it errors out from exceeding the context limit.',
            fix: 'Summarise old messages once history exceeds a threshold (e.g. > 50K tokens). Replace the oldest 20 messages with a 200-token summary. Lose detail, keep coherence.',
          },
          {
            name: '5. Cost runaway',
            symptom: 'A single misbehaving conversation hits $50 in API costs before you notice.',
            fix: 'Per-conversation cost cap that hard-stops the loop. Real-time cost tracking exposed to whoever&apos;s on call. Alerting at $X per session.',
          },
        ].map((mode) => (
          <div key={mode.name} style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.25rem' }}>
            <p style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#DC2626', marginBottom: '0.5rem' }}>{mode.name}</p>
            <p style={{ fontSize: '0.8125rem', color: '#374151', lineHeight: 1.6, marginBottom: '0.5rem' }} dangerouslySetInnerHTML={{ __html: '<strong style="color:#111827">Symptom:</strong> ' + mode.symptom }}/>
            <p style={{ fontSize: '0.8125rem', color: '#6B7280', lineHeight: 1.6, margin: 0 }}><strong style={{ color: '#16A34A' }}>Fix:</strong> {mode.fix}</p>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '0.75rem', marginTop: '2.5rem', letterSpacing: '-0.01em' }}>Cost math: what you&apos;ll actually pay</h2>
      <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1rem' }}>
        Here&apos;s a real calculation for our customer support triage agent at production scale. Assumptions: 1,000 tickets per day, average 3 tool calls per ticket, ~4,000 input tokens (system prompt + tool definitions + conversation context) and ~500 output tokens per LLM call.
      </p>
      <div style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '1.25rem' }}>
        <p style={{ fontSize: '0.8125rem', fontFamily: 'monospace', color: '#374151', lineHeight: 1.7, margin: 0 }}>
          Per ticket: 3 LLM calls × (4,000 input + 500 output tokens)<br/>
          = 12,000 input + 1,500 output tokens per ticket<br/>
          <br/>
          1,000 tickets/day = 12M input + 1.5M output tokens/day<br/>
          Monthly (30 days) = 360M input + 45M output tokens<br/>
          <br/>
          <strong style={{ color: '#111827' }}>Claude Haiku 4.5:</strong> (360 × $1) + (45 × $5) = <strong>$585/mo</strong><br/>
          <strong style={{ color: '#111827' }}>GPT-4o:</strong> (360 × $2.50) + (45 × $10) = <strong>$1,350/mo</strong><br/>
          <strong style={{ color: '#111827' }}>Claude Sonnet 4.5:</strong> (360 × $3) + (45 × $15) = <strong>$1,755/mo</strong>
        </p>
      </div>
      <p style={{ fontSize: '0.875rem', color: '#6B7280', lineHeight: 1.7, marginBottom: '2rem' }}>
        Two things this calculation hides: prompt caching can cut input costs 70-90% if you reuse a stable system prompt, and context growth on long conversations can double these numbers if you don&apos;t implement summarisation. Budget conservatively — your real cost will be 1.5-2x your napkin math the first time.
      </p>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '0.75rem', marginTop: '2.5rem', letterSpacing: '-0.01em' }}>Pre-deploy checklist</h2>
      <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1.25rem' }}>
        Before you put this in front of users, every box below should be ticked. Skipping any of these is how teams end up with $5K surprise bills or angry customers.
      </p>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column' as const, gap: '0.5rem', marginBottom: '2rem' }}>
        {[
          'Hard iteration cap is set and tested.',
          'Every tool input is validated against its schema before execution.',
          'Per-session cost cap with hard-stop in place.',
          'Cost and latency dashboards live before launch, not after.',
          'Eval set of 50+ representative inputs runs on every code change.',
          'Human-in-the-loop checkpoints for any irreversible action (refunds, sends, deletions).',
          'Errors and tool failures are logged with full context for debugging.',
          'Context summarisation kicks in before hitting model limits.',
          'You&apos;ve manually traced 10 representative runs end-to-end.',
          'Rollback plan exists if production behaviour diverges from eval.',
        ].map((item, i) => (
          <li key={i} style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.6, display: 'flex', gap: '0.5rem', alignItems: 'flex-start', padding: '0.625rem 0.875rem', backgroundColor: '#F9FAFB', borderRadius: '0.5rem', border: '1px solid #E5E7EB' }}>
            <span style={{ color: '#9CA3AF', fontFamily: 'monospace', flexShrink: 0, marginTop: '1px' }}>☐</span>
            <span dangerouslySetInnerHTML={{ __html: item }}/>
          </li>
        ))}
      </ul>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '0.75rem', marginTop: '2.5rem', letterSpacing: '-0.01em' }}>When you&apos;re done iterating</h2>
      <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1rem' }}>
        Agents are never &quot;finished.&quot; But there&apos;s a point where further tuning has diminishing returns and you should stop touching it. You&apos;re done iterating when: your eval set passes consistently above your target threshold, the failure modes you see in production are the same as the failure modes you see in eval (no surprises), per-conversation cost is stable and predictable, and the agent can run unattended for a week without you needing to check on it.
      </p>
      <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '2.5rem' }}>
        Past that point, your time is better spent building the next agent than tuning this one.
      </p>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '1.25rem', marginTop: '2.5rem', letterSpacing: '-0.01em' }}>Frequently Asked Questions</h2>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '1rem', marginBottom: '2.5rem' }}>
        {[
          { q: 'What is the difference between an AI workflow and an AI agent?', a: 'A workflow is a predefined sequence where an LLM is called at fixed steps with predictable inputs and outputs. An agent is a system where an LLM dynamically decides which tools to call and in what order until it accomplishes a goal. Most teams should build workflows first and only graduate to true agents when the workflow cannot handle the variability they actually encounter.' },
          { q: 'When should I build an AI agent vs use an existing one?', a: 'Build only when no existing agent solves your specific use case, the integrations you need do not exist as off-the-shelf tools, or you are building proprietary functionality that becomes a competitive moat. Buy when an existing agent covers 70% or more of your needs, your use case is generic, or the engineering cost would exceed two years of subscriptions.' },
          { q: 'How much does it cost to run an AI agent in production?', a: 'A customer support triage agent processing 1,000 tickets per day with 4,000 input tokens and 500 output tokens per call costs approximately $585/mo on Claude Haiku 4.5, $1,350/mo on GPT-4o, and $1,755/mo on Claude Sonnet 4.5. Most teams underestimate context window growth — costs can double or triple in long conversations without active context management.' },
          { q: 'What is the most common reason AI agents fail in production?', a: 'The most common failure is hallucinated tool calls — the agent invents tool names or parameters that do not exist. The fix is strict schema validation before execution, retry with corrective feedback, and a hard iteration cap. Other common failures are context window blow-out, parameter type errors, and unbounded cost from runaway loops.' },
        ].map(({ q, a }) => (
          <div key={q} style={{ backgroundColor: '#F9FAFB', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1.25rem' }}>
            <p style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.5rem' }}>{q}</p>
            <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.65, margin: 0 }}>{a}</p>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/ai-coding-agents" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>AI Coding Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Tools to help you build →</p>
        </Link>
        <Link href="/resources/guides/multi-agent-orchestration" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Multi-Agent Orchestration</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>When one agent isn&apos;t enough →</p>
        </Link>
        <Link href="/resources/guides/how-to-evaluate-an-ai-agent" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>How to Evaluate an Agent</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>If you decide to buy →</p>
        </Link>
        <Link href="/stacks/agentic-development-stack" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Agentic Development Stack</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Cursor + Claude Code →</p>
        </Link>
      </div>

      <p style={{ fontSize: '0.875rem', color: '#9CA3AF', lineHeight: 1.6 }}>
        All agents listed are editorially reviewed by The AI Agent Index. See our <Link href="/methodology" style={{ color: '#6B7280' }}>editorial methodology</Link>. Pricing data verified mid-2026 — confirm current rates before budgeting.
      </p>

      <GuideCitations slug="how-to-build-an-ai-agent" table="guides" />
    </div>
  )
}