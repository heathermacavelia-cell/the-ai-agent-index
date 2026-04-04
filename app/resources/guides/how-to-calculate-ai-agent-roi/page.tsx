import Link from 'next/link'
import type { Metadata } from 'next'
import GuideCitations from '@/components/GuideCitations'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'How to Calculate AI Agent ROI (2026) | The AI Agent Index',
  description: 'A practical framework for calculating the return on investment of any AI agent. Covers time saved, revenue impact, total cost, and the ROI formula teams actually use.',
  openGraph: {
    title: 'How to Calculate AI Agent ROI (2026)',
    description: 'A practical framework for calculating the return on investment of any AI agent. Covers time saved, revenue impact, total cost, and the ROI formula teams actually use.',
    url: 'https://theaiagentindex.com/resources/guides/how-to-calculate-ai-agent-roi',
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary',
    title: 'How to Calculate AI Agent ROI (2026)',
    description: 'A practical framework for calculating the return on investment of any AI agent. Covers time saved, revenue impact, total cost, and the ROI formula teams actually use.',
  },
  alternates: {
    canonical: 'https://theaiagentindex.com/resources/guides/how-to-calculate-ai-agent-roi',
  },
}

export default function AIAgentROIPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'How to Calculate AI Agent ROI (2026)',
    description: 'A practical framework for calculating the return on investment of any AI agent deployment.',
    url: 'https://theaiagentindex.com/resources/guides/how-to-calculate-ai-agent-roi',
    datePublished: '2026-04-04',
    dateModified: new Date().toISOString().split('T')[0],
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
        name: 'How do you calculate ROI for an AI agent?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ROI equals revenue generated plus cost of time saved, minus total tool cost, divided by total tool cost, multiplied by 100. A positive result means the agent is paying for itself.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is a good ROI for an AI agent?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Most well-implemented AI agents targeting repetitive sales or support tasks return between 200 and 500 percent ROI within 90 days. Break-even within 30 days is common for outbound sales agents.',
        },
      },
      {
        '@type': 'Question',
        name: 'How long does it take for an AI agent to show ROI?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Most AI agents show measurable ROI within 30 to 90 days. Sales agents tend to show ROI fastest because their impact on pipeline is directly measurable.',
        },
      },
      {
        '@type': 'Question',
        name: 'What costs should be included when calculating AI agent ROI?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Include the monthly subscription fee, per-seat costs, integration or setup costs amortised over 12 months, and ongoing maintenance time valued at your team hourly rate.',
        },
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
        <span style={{ fontSize: '0.8125rem', color: '#111827' }}>How to Calculate AI Agent ROI</span>
      </div>

      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Guide · Strategy</p>
      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
        How to Calculate AI Agent ROI
      </h1>
      <p style={{ fontSize: '1.0625rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '680px' }}>
        Most teams skip ROI measurement entirely and end up cancelling tools that were working — or keeping ones that are not. This is a practical framework for calculating the return on any AI agent investment in 2026.
      </p>

      <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#0369A1', lineHeight: 1.6, margin: 0 }}>
          <strong>The formula:</strong> ROI = ((Revenue Generated + Cost of Time Saved) - Total Tool Cost) / Total Tool Cost × 100
        </p>
      </div>

      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', marginTop: '2.5rem' }}>Step 1 — Define What the Agent Replaces or Augments</h2>
      <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '1rem' }}>
        AI agents generate ROI in one of three ways. Before calculating anything, identify which applies to your use case.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
        {[
          { label: 'Replaces manual work', desc: 'The agent handles tasks a human was doing — prospecting, ticket responses, report generation. ROI comes from recovered headcount capacity.' },
          { label: 'Increases output without headcount', desc: 'The same team produces more — more outreach sent, more tickets resolved, more content published. ROI comes from output multiplier.' },
          { label: 'Improves conversion rates', desc: 'The agent makes existing activity more effective — better personalisation, faster response times, fewer dropped leads. ROI comes from revenue lift.' },
        ].map((item) => (
          <div key={item.label} style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1rem 1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#2563EB', flexShrink: 0, minWidth: '200px' }}>{item.label}</span>
            <span style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.6 }}>{item.desc}</span>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', marginTop: '2.5rem' }}>Step 2 — Calculate Time Saved</h2>
      <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '1rem' }}>
        Estimate how long the task took manually, multiply by the hourly cost of the person doing it, and multiply by frequency per month.
      </p>
      <div style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', marginBottom: '0.75rem' }}>Example: AI Sales Agent</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[
            ['Time saved per rep per day', '2 hours'],
            ['Fully loaded hourly cost', '$40'],
            ['Working days per month', '20'],
            ['Time value per rep per month', '$1,600'],
            ['Team size', '5 reps'],
            ['Total monthly time value', '$8,000'],
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', padding: '0.375rem 0', borderBottom: '1px solid #F3F4F6' }}>
              <span style={{ color: '#4B5563' }}>{label}</span>
              <span style={{ fontWeight: 600, color: '#111827' }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', marginTop: '2.5rem' }}>Step 3 — Calculate Revenue Impact</h2>
      <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '1rem' }}>
        For agents that touch revenue-generating activity — outbound sequences, lead qualification, follow-up — track pipeline generated or influenced by the agent. Use a 30-day and 90-day window to account for sales cycle length. Most AI SDR tools include attribution reporting.
      </p>
      <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '1.5rem' }}>
        For support agents, calculate deflection value: the number of tickets resolved without human escalation multiplied by your average cost-to-resolve per ticket.
      </p>

      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', marginTop: '2.5rem' }}>Step 4 — Calculate Total Cost</h2>
      <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#F9FAFB' }}>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#111827', borderBottom: '1px solid #E5E7EB' }}>Cost Component</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#111827', borderBottom: '1px solid #E5E7EB' }}>How to Calculate</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#111827', borderBottom: '1px solid #E5E7EB' }}>Include?</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Monthly subscription', 'List price or negotiated rate', 'Always'],
              ['Per-seat fees', 'Seats × per-seat cost', 'Always'],
              ['Setup and integration', 'Total cost ÷ 12 months', 'Always'],
              ['Maintenance time', 'Hours/month × team hourly rate', 'Always'],
              ['Training time', 'Onboarding hours × hourly rate ÷ 12', 'First year only'],
            ].map(([component, method, include]) => (
              <tr key={component} style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '0.75rem 1rem', color: '#374151', fontWeight: 500 }}>{component}</td>
                <td style={{ padding: '0.75rem 1rem', color: '#4B5563' }}>{method}</td>
                <td style={{ padding: '0.75rem 1rem', color: include === 'Always' ? '#059669' : '#6B7280', fontWeight: 500 }}>{include}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', marginTop: '2.5rem' }}>Step 5 — Apply the Formula</h2>
      <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1D4ED8', marginBottom: '0.75rem' }}>
          ROI = ((Revenue Generated + Time Value Saved) - Total Tool Cost) / Total Tool Cost × 100
        </p>
        <p style={{ fontSize: '0.875rem', color: '#1E40AF', margin: 0 }}>
          A result above 0% means the agent is paying for itself. 200–500% ROI within 90 days is typical for well-implemented agents targeting repetitive tasks.
        </p>
      </div>

      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', marginTop: '2.5rem' }}>What to Measure by Agent Type</h2>
      <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '1rem' }}>
        The most common mistake is measuring the wrong output. Define your success metric before deployment, not after.
      </p>
      <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#F9FAFB' }}>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#111827', borderBottom: '1px solid #E5E7EB' }}>Agent Type</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#111827', borderBottom: '1px solid #E5E7EB' }}>Measure This</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#111827', borderBottom: '1px solid #E5E7EB' }}>Not This</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['AI Sales / SDR agent', 'Booked meetings, pipeline generated', 'Emails sent'],
              ['AI customer support agent', 'Tickets resolved without escalation', 'Response time alone'],
              ['AI research agent', 'Hours saved per report, reports produced', 'Searches performed'],
              ['AI marketing agent', 'Content published, traffic generated', 'Words written'],
              ['AI coding agent', 'PRs merged, bugs resolved, dev hours saved', 'Lines of code generated'],
            ].map(([type, measure, notThis]) => (
              <tr key={type} style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '0.75rem 1rem', color: '#374151', fontWeight: 500 }}>{type}</td>
                <td style={{ padding: '0.75rem 1rem', color: '#059669', fontWeight: 500 }}>{measure}</td>
                <td style={{ padding: '0.75rem 1rem', color: '#6B7280' }}>{notThis}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '1.25rem', marginTop: '2.5rem' }}>Frequently Asked Questions</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
        {[
          { q: 'How do you calculate ROI for an AI agent?', a: 'ROI equals revenue generated plus cost of time saved, minus total tool cost, divided by total tool cost, multiplied by 100. A positive result means the agent is paying for itself.' },
          { q: 'What is a good ROI for an AI agent?', a: 'Most well-implemented AI agents targeting repetitive sales or support tasks return between 200 and 500 percent ROI within 90 days. Break-even within 30 days is common for outbound sales agents.' },
          { q: 'How long does it take for an AI agent to show ROI?', a: 'Most AI agents show measurable ROI within 30 to 90 days. Sales agents tend to show ROI fastest because their impact on pipeline is directly measurable.' },
          { q: 'What costs should be included when calculating AI agent ROI?', a: 'Include the monthly subscription, per-seat fees, integration costs amortised over 12 months, and ongoing maintenance time valued at your team hourly rate.' },
        ].map(({ q, a }) => (
          <div key={q} style={{ backgroundColor: '#F9FAFB', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1.25rem' }}>
            <p style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.5rem' }}>{q}</p>
            <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.65, margin: 0 }}>{a}</p>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        <Link href="/find" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Find an Agent</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Match by use case →</p>
        </Link>
        <Link href="/resources/guides/how-to-evaluate-an-ai-agent" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>How to Evaluate an Agent</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Buying framework →</p>
        </Link>
        <Link href="/resources/guides/multi-agent-orchestration" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Multi-Agent Orchestration</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>How it works →</p>
        </Link>
      </div>
      <GuideCitations slug="how-to-calculate-ai-agent-roi" table="guides" />
    </div>
  )
}