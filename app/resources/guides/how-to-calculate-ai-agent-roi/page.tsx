import Link from 'next/link'
import type { Metadata } from 'next'
import GuideCitations from '@/components/GuideCitations'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'How to Calculate AI Agent ROI (2026) | The AI Agent Index',
  description: 'A practical 5-step framework for calculating the return on investment of any AI agent. Covers time saved, revenue impact, total cost, and what to measure by agent type.',
  openGraph: {
    title: 'How to Calculate AI Agent ROI (2026)',
    description: 'A practical 5-step framework for calculating AI agent ROI — time saved, revenue impact, total cost, and what to measure by agent type.',
    url: 'https://theaiagentindex.com/resources/guides/how-to-calculate-ai-agent-roi',
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary',
    title: 'How to Calculate AI Agent ROI (2026)',
    description: 'A practical framework for calculating AI agent ROI — time saved, revenue impact, total cost, and the formula teams actually use.',
  },
  alternates: {
    canonical: 'https://theaiagentindex.com/resources/guides/how-to-calculate-ai-agent-roi',
  },
}

const faqItems = [
  {
    q: 'How do you calculate ROI for an AI agent?',
    a: 'ROI equals the sum of revenue generated and the monetary value of time saved, minus the total tool cost, divided by the total tool cost, multiplied by 100. In formula form: ROI = ((Revenue Generated + Time Value Saved) - Total Tool Cost) / Total Tool Cost × 100. A result above 0 percent means the agent is generating more value than it costs. The most common mistake is calculating time saved without monetising it — hours recovered only become ROI-relevant when valued at the effective hourly cost of the person whose time was saved.',
  },
  {
    q: 'What is a good ROI for an AI agent?',
    a: 'ROI varies significantly by agent type, use case, and how well the agent is configured and managed. The clearest benchmark is time to break-even: if the monthly value generated — time saved plus revenue attributed — exceeds the monthly cost, the agent is ROI-positive. Well-implemented agents targeting high-frequency, repetitive tasks like outbound prospecting or first-tier customer support typically reach break-even within the first 30 to 60 days. Agents with longer implementation timelines or lower-frequency use cases take longer. Measure your specific deployment rather than comparing against published benchmarks that may not reflect your context.',
  },
  {
    q: 'How long does it take for an AI agent to show ROI?',
    a: 'Sales and customer support agents tend to show measurable ROI fastest because their outputs — pipeline generated, tickets resolved — are directly measurable on short timescales. Marketing and content agents may take longer to show revenue impact because the connection between content and revenue involves a longer attribution chain. Research and productivity agents show ROI most clearly through time-saved metrics rather than revenue. Define your measurement window and metric before deployment, not after, so you have a clear baseline to compare against. Most agents should show a measurable positive signal within 30 to 90 days if they are working correctly.',
  },
  {
    q: 'What costs should I include when calculating AI agent ROI?',
    a: 'The complete cost picture includes: the monthly subscription fee or usage-based costs at your expected volume, per-seat fees if the pricing model charges per user, integration and setup costs amortised over 12 months so they are comparable to monthly value figures, ongoing management time multiplied by your team\'s effective hourly rate, and training and onboarding time in the first year. The costs most commonly omitted are ongoing management time and integration costs — both of which can be significant and both of which are invisible in the subscription price. A tool that costs $200 per month but requires four hours of weekly management time at $50 per hour is actually costing $1,000 per month in total.',
  },
  {
    q: 'What are the most common mistakes when measuring AI agent ROI?',
    a: 'The most common mistakes are: not establishing a baseline before deployment so there is nothing to compare against, measuring the wrong output for the agent type (emails sent instead of meetings booked for a sales agent, words generated instead of traffic for a content agent), valuing recovered time at zero instead of the effective hourly cost of the person whose time was saved, omitting management time and integration costs from the total cost calculation, and measuring too early before the agent has been properly configured and the team has learned to use it effectively. Set your measurement framework before deployment, not after.',
  },
]

export default function AIAgentROIPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'How to Calculate AI Agent ROI (2026)',
    description: 'A practical 5-step framework for calculating the return on investment of any AI agent deployment.',
    url: 'https://theaiagentindex.com/resources/guides/how-to-calculate-ai-agent-roi',
    datePublished: '2026-04-04',
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
        <span style={{ fontSize: '0.8125rem', color: '#111827' }}>How to Calculate AI Agent ROI</span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' as const }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Guide</span>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#F3F4F6', color: '#374151', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Strategy</span>
        <span style={{ fontSize: '0.75rem', color: '#6B7280', padding: '0.25rem 0.75rem', backgroundColor: '#F3F4F6', borderRadius: '9999px' }}>Updated May 2026</span>
      </div>

      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
        How to Calculate AI Agent ROI
      </h1>

      {/* Intro */}
      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem', maxWidth: '700px' }}>
        Most teams deploying AI agents do not measure the return on their investment — which means they make both types of error: cancelling agents that are generating significant value because the value was never quantified, and keeping agents that are not working because nobody is measuring whether they are. ROI measurement is not a reporting exercise. It is the feedback loop that tells you whether to scale, cut, or reconfigure a deployment.
      </p>

      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem', maxWidth: '700px' }}>
        The ROI calculation for AI agents is more straightforward than most teams assume. It has three components: the monetary value of time saved, the revenue generated or directly influenced by the agent, and the total cost of the tool including implementation and ongoing management. The formula is the same regardless of agent type — what changes is which component dominates and what you measure to quantify each.
      </p>

      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem', maxWidth: '700px' }}>
        The most important step in ROI calculation happens before deployment: establishing your baseline. If you do not know how long the task took manually before the agent existed, or what the conversion rate was before the agent started qualifying leads, you have nothing to compare against. Define your baseline measurement at the same time you decide to deploy, not after you are already three months in.
      </p>

      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '2rem', maxWidth: '700px' }}>
        This framework applies to every agent category — sales, customer support, research, marketing, and coding. The measurement approach and the metrics that matter differ by agent type, which is covered in the section on what to measure. The formula and the cost calculation are universal.
      </p>

      <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '3rem' }}>
        <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0369A1', marginBottom: '0.25rem' }}>The formula</p>
        <p style={{ fontSize: '0.9375rem', color: '#0C4A6E', lineHeight: 1.6, margin: 0 }}>
          ROI = ((Revenue Generated + Time Value Saved) − Total Tool Cost) ÷ Total Tool Cost × 100
        </p>
      </div>

      {/* Step 1 */}
      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', marginTop: '2.5rem' }}>Step 1 — Define what the agent replaces or augments</h2>
      <p style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.75, marginBottom: '1rem' }}>
        AI agents generate ROI through one of three mechanisms. Identifying which applies to your deployment determines which metrics matter and how to calculate the value component of the formula.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.875rem', marginBottom: '1.25rem' }}>
        {[
          { label: 'Replaces manual work', desc: 'The agent handles tasks a human was doing — prospecting, ticket responses, report generation. ROI comes from recovered headcount capacity: the same team handles more volume, or headcount growth is delayed.' },
          { label: 'Increases output without headcount', desc: 'The same team produces more — more outreach sent, more tickets resolved, more content published. ROI comes from the output multiplier: value of additional output minus the tool cost.' },
          { label: 'Improves conversion or quality', desc: 'The agent makes existing activity more effective — better personalisation, faster response times, fewer dropped leads. ROI comes from revenue lift or cost reduction per unit of output.' },
        ].map((item) => (
          <div key={item.label} style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.25rem 1.5rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.375rem' }}>{item.label}</h3>
            <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
          </div>
        ))}
      </div>
      <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '2.5rem' }}>
        Most agents operate through a combination of these mechanisms. An outbound sales agent both replaces manual prospecting work and increases the volume of outreach the team can run. A customer support agent both replaces first-tier ticket resolution and reduces the time-to-first-response metric. Identify the primary mechanism, then add secondary mechanisms to the calculation if they are measurable.
      </p>

      {/* Step 2 */}
      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', marginTop: '2.5rem' }}>Step 2 — Calculate the value of time saved</h2>
      <p style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.75, marginBottom: '1rem' }}>
        Recovered time only generates ROI when it is redirected to higher-value activity. The calculation assumes that the time saved is applied to something valuable — not absorbed by meetings or unstructured work. If your team is not clear on what they will do with recovered time, address that before treating time savings as confirmed ROI.
      </p>
      <p style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem' }}>
        To calculate the time value: estimate how long the task takes manually per person per day, multiply by the fully-loaded hourly cost of the person doing it (salary plus benefits plus overhead, divided by working hours), and multiply by the number of working days per month and the number of people who benefit.
      </p>
      <div style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>Example: AI sales agent, 5-person team</p>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0' }}>
          {[
            ['Time saved per rep per day', '2 hours'],
            ['Fully loaded hourly cost per rep', '$40'],
            ['Working days per month', '20'],
            ['Time value per rep per month', '$1,600'],
            ['Team size', '5 reps'],
            ['Total monthly time value', '$8,000'],
          ].map(([label, value], i) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', padding: '0.625rem 0', borderBottom: i < 5 ? '1px solid #F3F4F6' : 'none' }}>
              <span style={{ color: '#4B5563' }}>{label}</span>
              <span style={{ fontWeight: i === 5 ? 700 : 500, color: i === 5 ? '#111827' : '#374151' }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step 3 */}
      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', marginTop: '2.5rem' }}>Step 3 — Calculate revenue impact</h2>
      <p style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.75, marginBottom: '1rem' }}>
        For agents that touch revenue-generating activity — outbound sequences, lead qualification, follow-up automation — track pipeline generated or directly influenced by the agent over a 30-day and 90-day window. The 90-day window accounts for sales cycles: a meeting booked in week one may not close until week ten. Most AI sales tools include attribution reporting that tracks which sequences or touches generated which opportunities.
      </p>
      <p style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.75, marginBottom: '1rem' }}>
        For customer support agents, calculate the deflection value: the number of tickets resolved autonomously without human escalation, multiplied by your average fully-loaded cost per ticket. If a human agent resolves a ticket in 12 minutes at an average fully-loaded cost of $25 per hour, that ticket costs approximately $5. An agent that deflects 1,000 tickets per month generates $5,000 per month in deflection value — before factoring in the value of faster resolution times or improved CSAT from 24/7 availability.
      </p>
      <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '2.5rem' }}>
        For research, marketing, and coding agents, revenue attribution is more indirect. These agents are better measured primarily through time saved rather than revenue generated, with revenue attribution as a secondary and longer-term metric.
      </p>

      {/* Step 4 */}
      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', marginTop: '2.5rem' }}>Step 4 — Calculate total cost of ownership</h2>
      <p style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem' }}>
        The subscription price is only one component of total cost. The costs most commonly omitted are management time — the weekly hours your team spends configuring, reviewing, and maintaining the agent — and integration costs, which are a one-time investment that should be amortised across the contract period. Both can be significant enough to change the ROI calculation materially.
      </p>
      <div style={{ overflowX: 'auto' as const, marginBottom: '2.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' as const, fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#F9FAFB' }}>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left' as const, fontWeight: 600, color: '#111827', borderBottom: '1px solid #E5E7EB' }}>Cost Component</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left' as const, fontWeight: 600, color: '#111827', borderBottom: '1px solid #E5E7EB' }}>How to Calculate</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left' as const, fontWeight: 600, color: '#111827', borderBottom: '1px solid #E5E7EB' }}>Include?</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Monthly subscription', 'List price or negotiated rate', 'Always'],
              ['Per-seat fees', 'Active seats × per-seat monthly cost', 'Always'],
              ['Setup and integration', 'Total one-time cost ÷ 12 months', 'Always'],
              ['Ongoing management time', 'Hours/month × team hourly rate', 'Always'],
              ['Training and onboarding time', 'Total onboarding hours × hourly rate ÷ 12', 'First year only'],
            ].map(([component, method, include]) => (
              <tr key={component} style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '0.75rem 1rem', color: '#374151', fontWeight: 500 }}>{component}</td>
                <td style={{ padding: '0.75rem 1rem', color: '#4B5563' }}>{method}</td>
                <td style={{ padding: '0.75rem 1rem', color: include === 'Always' ? '#059669' : '#6B7280', fontWeight: 600 }}>{include}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Step 5 */}
      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', marginTop: '2.5rem' }}>Step 5 — Apply the formula and interpret the result</h2>
      <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '1.25rem' }}>
        <p style={{ fontSize: '1rem', fontWeight: 700, color: '#1D4ED8', marginBottom: '0.5rem' }}>
          ROI = ((Revenue Generated + Time Value Saved) − Total Tool Cost) ÷ Total Tool Cost × 100
        </p>
        <p style={{ fontSize: '0.875rem', color: '#1E40AF', margin: 0 }}>
          A result above 0% means the agent is generating more value than it costs. Negative ROI means the tool costs more than it delivers at current configuration and usage.
        </p>
      </div>
      <p style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.75, marginBottom: '1rem' }}>
        Measure at 30 days and 90 days after deployment. The 30-day number tells you whether the basic integration is working and generating any value. The 90-day number is more reliable because it accounts for the learning curve of both the agent and the team, and captures revenue that has a longer attribution lag.
      </p>
      <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '2.5rem' }}>
        If ROI is negative at 30 days, investigate whether the issue is configuration, measurement, or fit. Many agents need adjustment after initial deployment before they reach expected performance. If ROI is negative at 90 days after configuration improvements, the agent is likely wrong for the use case or the use case was incorrectly scoped. If ROI is positive and growing, scale the deployment.
      </p>

      {/* What to measure */}
      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', marginTop: '2.5rem' }}>What to measure by agent type</h2>
      <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1.25rem' }}>
        Measuring the wrong output is the most common ROI calculation mistake. Activity metrics — emails sent, words generated, searches performed — are not outcome metrics. They measure what the agent did, not what value it produced. Define your outcome metric before deployment and confirm you have the data infrastructure to measure it.
      </p>
      <div style={{ overflowX: 'auto' as const, marginBottom: '3rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' as const, fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#F9FAFB' }}>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left' as const, fontWeight: 600, color: '#111827', borderBottom: '1px solid #E5E7EB' }}>Agent Type</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left' as const, fontWeight: 600, color: '#16A34A', borderBottom: '1px solid #E5E7EB' }}>Measure this</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left' as const, fontWeight: 600, color: '#DC2626', borderBottom: '1px solid #E5E7EB' }}>Not this</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['AI sales / SDR agent', 'Meetings booked, pipeline generated, reply rate', 'Emails sent, contacts touched'],
              ['AI customer support agent', 'Tickets resolved without escalation, CSAT', 'Response time alone, tickets opened'],
              ['AI research agent', 'Hours saved per report, reports completed', 'Searches performed, sources accessed'],
              ['AI marketing agent', 'Content published, organic traffic generated', 'Words written, posts scheduled'],
              ['AI coding agent', 'PRs merged, bugs resolved, developer hours saved', 'Lines of code generated'],
              ['AI HR agent', 'Time-to-hire reduction, tickets resolved, onboarding completion rate', 'Applications reviewed'],
            ].map(([type, measure, notThis]) => (
              <tr key={type} style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '0.75rem 1rem', color: '#374151', fontWeight: 500 }}>{type}</td>
                <td style={{ padding: '0.75rem 1rem', color: '#16A34A', fontWeight: 500 }}>{measure}</td>
                <td style={{ padding: '0.75rem 1rem', color: '#6B7280' }}>{notThis}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Common mistakes */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }}>Common ROI calculation mistakes</h2>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.875rem' }}>
          {[
            { title: 'No baseline before deployment', desc: 'If you do not measure how long the task takes manually before the agent is deployed, you have nothing to compare against. Establish your baseline at the same time you make the deployment decision.' },
            { title: 'Valuing recovered time at zero', desc: 'Hours recovered only become ROI-relevant when multiplied by the effective cost of the person whose time was saved. Treating time as free understates the return significantly for most deployments.' },
            { title: 'Omitting management time from cost', desc: 'A tool that requires four hours of weekly management at $50 per hour costs $800 per month in team time on top of the subscription fee. This is real cost that must be included in the total cost calculation.' },
            { title: 'Measuring too early', desc: 'Agents need time to be configured correctly, and teams need time to learn to use them effectively. Measuring at 7 days often underestimates the value. Use 30-day and 90-day checkpoints as the meaningful measurement windows.' },
            { title: 'Measuring activity instead of outcomes', desc: 'Emails sent, words generated, and searches performed are activity metrics. Meetings booked, tickets resolved, and revenue attributed are outcome metrics. Only outcomes determine ROI.' },
          ].map((item) => (
            <div key={item.title} style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.25rem 1.5rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.375rem' }}>{item.title}</h3>
              <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '1.25rem' }}>Frequently Asked Questions</h2>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '1rem' }}>
          {faqItems.map(({ q, a }) => (
            <div key={q} style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1.25rem 1.5rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.5rem' }}>{q}</h3>
              <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.75, margin: 0 }}>{a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Related */}
      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/find" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Find an Agent</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>Match by use case &#x2192;</p>
        </Link>
        <Link href="/resources/guides/how-to-evaluate-an-ai-agent" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>How to Evaluate an Agent</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>Buying framework &#x2192;</p>
        </Link>
        <Link href="/resources/guides/multi-agent-orchestration" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Multi-Agent Orchestration</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>How it works &#x2192;</p>
        </Link>
        <Link href="/stacks" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Agent Stacks</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>Curated multi-agent workflows &#x2192;</p>
        </Link>
      </div>

      <p style={{ fontSize: '0.875rem', color: '#9CA3AF', lineHeight: 1.6 }}>
        All agents listed are editorially reviewed by The AI Agent Index. See our <Link href="/methodology" style={{ color: '#6B7280' }}>editorial methodology</Link>.
      </p>

      <GuideCitations slug="how-to-calculate-ai-agent-roi" table="guides" />
    </div>
  )
}