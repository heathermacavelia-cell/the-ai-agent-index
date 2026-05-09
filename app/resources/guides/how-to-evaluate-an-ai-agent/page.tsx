import Link from 'next/link'
import type { Metadata } from 'next'
import GuideCitations from '@/components/GuideCitations'
import { createClient } from '@/lib/supabase'
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'How to Evaluate an AI Agent Before Buying (2026) | The AI Agent Index',
  description: 'A structured 8-step framework for evaluating AI agents before buying — covering integration, accuracy, pricing, security, and pilot design. Built for B2B buyers.',
  openGraph: {
    title: 'How to Evaluate an AI Agent Before Buying (2026)',
    description: 'A structured 8-step framework for evaluating AI agents — integration, accuracy, pricing, security, and pilot design. Built for B2B buyers.',
    url: 'https://theaiagentindex.com/resources/guides/how-to-evaluate-an-ai-agent',
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary',
    title: 'How to Evaluate an AI Agent Before Buying (2026)',
    description: 'A structured framework for evaluating AI agents — integration, accuracy, pricing, security, and pilot design.',
  },
  alternates: { canonical: 'https://theaiagentindex.com/resources/guides/how-to-evaluate-an-ai-agent' },
}

const criteria = [
  {
    number: '01',
    title: 'Define the job to be done before you look at any tool',
    body1: 'The most common AI agent buying mistake is evaluating tools before defining what the tool needs to do. "Help with sales" is not evaluable. "Identify 200 target accounts matching our ICP, draft personalised cold emails using prospect LinkedIn data, send on a schedule, and sync reply status to HubSpot" is evaluable. Every criterion that follows should be assessed against this specific job description, not against the tool\'s general capability.',
    body2: 'Write the job description down in one or two sentences before opening any vendor\'s website. Then verify that the tool actually performs that job — not a related job, not a superset of that job, but the specific workflow you need automated. The more precisely you define the job upfront, the faster and more accurate your vendor evaluation will be, and the harder it becomes for a vendor to deflect evaluation questions with general capability claims.',
  },
  {
    number: '02',
    title: 'Verify integration compatibility before anything else',
    body1: 'An AI agent that does not connect to your existing stack requires you to change your workflow to use it — which means adoption friction that reduces the value of the automation. Before evaluating any other criterion, confirm that the agent integrates natively with every system it needs to access: your CRM, email platform, data sources, communication tools, and any other systems involved in the workflow.',
    body2: 'Native integrations are meaningfully better than Zapier workarounds for production workflows. Native integrations are faster, more reliable, access richer data, and have fewer failure points. A Zapier integration means your automation is dependent on a third service and limited to what Zapier\'s connector exposes. For any integration critical to the workflow, ask the vendor specifically which fields are available in the integration, whether it is read-only or bidirectional, and how it handles failures when the connected system is unavailable.',
  },
  {
    number: '03',
    title: 'Assess deployment complexity against your team capacity',
    body1: 'Deployment complexity determines how quickly you get to value and how much ongoing management the agent requires. Easy-tier agents are self-service — you connect accounts, configure settings through a UI, and are live in hours with no technical resource required. Moderate agents require API key configuration, webhook setup, or some data mapping that a non-engineer can handle with time and documentation. Complex agents require developer work for custom integrations, ongoing maintenance, and technical oversight to operate reliably.',
    body2: 'The right complexity tier is not the lowest available — it is the one that matches what your use case actually requires and what your team can realistically support. Underestimating complexity is the most common reason for failed AI agent deployments. Always ask vendors for the typical time-to-live for customers with your technical profile, and ask specifically what goes wrong most often in the first 30 days. Honest vendors will tell you. Vendors who describe setup as uniformly simple should be pressed with specifics.',
  },
  {
    number: '04',
    title: 'Demand documented accuracy benchmarks, not demo performance',
    body1: 'Demo performance is the best-case scenario in a controlled environment. What matters is how the agent performs on your data, your use case, and your edge cases — which are different from the vendor\'s demo script. Ask vendors for published accuracy benchmarks that are specific to the workflow you are evaluating. For sales agents: email deliverability rates and reply rates from real deployments. For research agents: citation accuracy and hallucination rates. For coding agents: percentage of generated code that passes tests without modification. For support agents: autonomous resolution rate and CSAT scores from live deployments.',
    body2: 'Vendors who cannot provide these numbers with data are either not measuring them or are not satisfied with what the data shows. Both are red flags. The appropriate response to "we don\'t publish benchmarks" is to require a pilot where you measure these metrics yourself against your own baseline. Do not accept general claims about accuracy without the supporting data. The difference between an agent that resolves 40 percent of tickets autonomously and one that resolves 75 percent is enormous in operational impact — and that gap is invisible in a demo.',
  },
  {
    number: '05',
    title: 'Calculate total cost of ownership, not just the subscription price',
    body1: 'The subscription price is the visible cost. The total cost includes: implementation and setup time (even no-code tools require configuration hours), integration development if native integrations do not exist, ongoing management time per week, training time for your team, and the opportunity cost of the workflows you will need to change. Add these to the monthly subscription and compare against the value the agent is expected to deliver.',
    body2: 'Watch for pricing traps in usage-based models: per-task, per-seat, and per-API-call pricing all have break points where costs accelerate significantly with volume. Before committing, model your expected monthly usage against the pricing tiers and build in a 2x growth buffer for the first six months. Also clarify what happens to your data and workflows if you cancel — some tools create data lock-in that makes switching expensive even when the tool is not delivering sufficient value.',
  },
  {
    number: '06',
    title: 'Verify security and data handling for your compliance requirements',
    body1: 'If the agent processes customer data, employee data, or accesses internal systems, security is non-negotiable. The baseline standard is SOC 2 Type II certification — an independent audit of security controls maintained over a minimum six-month operating period. Do not accept SOC 2 Type I as equivalent. For European operations, confirm GDPR compliance and data residency location. For regulated industries, confirm alignment with any sector-specific requirements: HIPAA for healthcare, FINRA for financial services, or equivalent.',
    body2: 'The two questions most commonly omitted from security evaluation are: does the vendor use your data to train their models, and what happens to your data when you cancel? The first determines whether your proprietary data or customer information contributes to a competitor\'s model improvement. Most serious enterprise vendors explicitly commit in their terms that they do not. The second determines your data recovery and deletion rights. Both should be contractually committed before you deploy anything in a production environment.',
  },
  {
    number: '07',
    title: 'Find verified customer evidence from companies like yours',
    body1: 'Vendor-produced case studies are marketing. Third-party reviews on G2, Capterra, and directories like this index are more reliable signals because reviewers are not selected by the vendor and are not compensated for positive reviews. When reading reviews, filter for companies similar to yours in size, industry, and use case. A review from a 5,000-person enterprise about an agent deployment with dedicated IT support tells you very little about what a 20-person company with no engineering resource should expect.',
    body2: 'Recency matters significantly in AI tools. The product from 18 months ago may be materially different from the current version — in either direction. Prioritise reviews from the last six months. Ask the vendor directly for customer references you can speak to in a 20-minute call — specifically customers who have been using the product for at least six months, not hand-picked success stories from the previous quarter. Vendors who resist this request are telling you something.',
  },
  {
    number: '08',
    title: 'Run a structured pilot before committing to an annual contract',
    body1: 'Never commit to an annual contract without a pilot period where you have measured real performance against real benchmarks. Most reputable vendors offer a free trial, a money-back period, or a paid proof-of-concept engagement. Define the success metrics before the pilot starts — not after. The metrics should match the job description you wrote in step one: if the job is "identify and qualify leads," measure lead quality and qualification accuracy, not general platform usability.',
    body2: 'During the pilot, run the agent on tasks with real data and measure three things: output quality against your pre-defined criteria, the time your team spends managing the agent versus the time it saves, and integration reliability over time including how it handles edge cases and failures. If output quality is acceptable but integration failures require constant manual intervention, the total time cost may be higher than the time saved. A pilot that reveals this saves you from a year-long contract with a tool that does not deliver its stated value.',
  },
]

const faqItems = [
  {
    q: 'What should I look for when evaluating an AI agent?',
    a: 'The eight most important evaluation criteria are: a precisely defined job to be done, native integration with your existing stack, deployment complexity matched to your team capacity, documented accuracy benchmarks from real deployments, total cost of ownership including implementation and management time, verified security certifications for your compliance requirements, third-party customer evidence from companies similar to yours, and a structured pilot where you measure real performance before committing. The criteria that get skipped most often in practice — integration compatibility and total cost of ownership — are also the ones most commonly cited as the reason for failed deployments.',
  },
  {
    q: 'How do you test an AI agent before buying?',
    a: 'Run a structured pilot with a clear success definition before opening any vendor contract. Define your success metrics before the pilot starts — not after you have seen the results. Measure output quality against those criteria, the time your team spends managing the agent versus the time it saves, and integration reliability including how the agent handles edge cases and failures. Test with real data, not the vendor\'s demo data set. A pilot that measures the wrong things or uses ideal inputs is not a meaningful test of production performance.',
  },
  {
    q: 'What does SOC 2 Type II mean for AI agents and why does it matter?',
    a: 'SOC 2 Type II is an independent audit of a vendor\'s security controls conducted over a minimum six-month operating period. It demonstrates that the vendor has maintained their security practices consistently, not just documented them at a single point in time. For AI agents that handle customer data, employee information, or access internal business systems, SOC 2 Type II is the baseline security standard. SOC 2 Type I covers controls at a point in time and is not equivalent — do not accept it as a substitute. For regulated industries or European operations, SOC 2 Type II is the starting point, not the full picture.',
  },
  {
    q: 'How do I calculate the real cost of an AI agent?',
    a: 'The subscription price is the visible cost. The total cost includes: implementation and configuration time measured in hours at your team\'s effective hourly rate, any custom integration development if native integrations do not exist, ongoing weekly management time multiplied by twelve months, team training time, and the cost of workflow changes required to use the tool. Add all of these to the annual subscription and compare to the value the agent is expected to deliver. For usage-based pricing models, model your expected monthly volume against the pricing tiers and build in a 2x growth buffer — costs accelerate significantly at volume break points that are not always obvious from the pricing page.',
  },
  {
    q: 'What questions should I ask an AI agent vendor before buying?',
    a: 'The eight questions that reveal the most: What is the autonomous resolution or completion rate for use cases similar to mine, and can you share supporting data? What are the most common reasons your customers cancel? What does a realistic onboarding timeline look like for a company with my technical profile? Do you use customer data to train your models? What happens to my data if I cancel? Can I speak to a customer who has been using the product for at least six months and has a similar use case to mine? What breaks most often in the first 30 days? What is not automated by the agent and still requires human intervention? Vendors who deflect these questions or provide only general answers are telling you something about what the honest answers would reveal.',
  },
]

export default async function HowToEvaluateAnAIAgentPage() {
  const supabase = createClient()
  const { count: agentCount } = await supabase
    .from('agents')
    .select('slug', { count: 'exact', head: true })
    .eq('is_active', true)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'How to Evaluate an AI Agent Before Buying (2026)',
    description: 'A structured 8-step framework for evaluating AI agents before buying — covering integration, accuracy, pricing, security, and pilot design.',
    url: 'https://theaiagentindex.com/resources/guides/how-to-evaluate-an-ai-agent',
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
        <span style={{ fontSize: '0.8125rem', color: '#111827' }}>How to Evaluate an AI Agent</span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' as const }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Guide</span>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#F3F4F6', color: '#374151', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Buying Advice</span>
        <span style={{ fontSize: '0.75rem', color: '#6B7280', padding: '0.25rem 0.75rem', backgroundColor: '#F3F4F6', borderRadius: '9999px' }}>Updated May 2026</span>
      </div>

      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
        How to Evaluate an AI Agent Before Buying
      </h1>

      {/* Intro */}
      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem', maxWidth: '700px' }}>
        Most AI agent buying decisions are made on demos, marketing claims, and social proof that does not apply to the buyer's actual context. Demos show the best-case scenario with ideal data. Case studies are selected by the vendor. Benchmark claims are often measured in conditions that do not reflect production use. The result is that buyers commit to tools that look excellent in evaluation and fail in deployment — not because AI agents do not work, but because the evaluation methodology was wrong.
      </p>

      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem', maxWidth: '700px' }}>
        The framework in this guide applies structured evaluation against what actually matters in production: does the agent integrate cleanly with your existing stack, does it perform accurately on your actual data and use case, does the total cost justify the value it delivers, and does it meet the security and compliance requirements of your environment. These are different questions from "does this demo look impressive" — and they produce meaningfully different purchase decisions.
      </p>

      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem', maxWidth: '700px' }}>
        The eight steps below cover the complete evaluation process from initial requirement definition through pilot design. The order matters: integration compatibility should be checked before accuracy, because an agent that cannot connect to your stack is disqualified regardless of how well it performs in other areas. Accuracy should be verified before pricing, because the cheapest tool that does not work is not a bargain.
      </p>

      <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '2rem', maxWidth: '700px' }}>
        The framework is designed for B2B buyers evaluating agents across all categories — sales, customer support, research, marketing, coding, HR, and operations. Category-specific considerations are noted within each criterion where the evaluation question differs meaningfully by agent type.
      </p>

      <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '3rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#0369A1', lineHeight: 1.6, margin: 0 }}>
          <strong>Key principle:</strong> Evaluate AI agents against a specific, written job to be done — not general capability claims. The best agent for your use case is the one that does your specific job reliably, not the one with the most impressive demo or the highest G2 rating in an unrelated category.
        </p>
      </div>

      {/* Criteria */}
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '1.5rem', marginBottom: '3.5rem' }}>
        {criteria.map((item) => (
          <div key={item.number} style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
            <div style={{ backgroundColor: '#F9FAFB', padding: '1rem 1.5rem', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ flexShrink: 0, width: '2.25rem', height: '2.25rem', backgroundColor: '#EFF6FF', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563EB', fontFamily: 'monospace' }}>{item.number}</span>
              </div>
              <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#111827', margin: 0 }}>{item.title}</h2>
            </div>
            <div style={{ padding: '1.25rem 1.5rem' }}>
              <p style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.75, marginBottom: '0.875rem' }}>{item.body1}</p>
              <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, margin: 0 }}>{item.body2}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Checklist */}
      <div style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.875rem', padding: '1.5rem', marginBottom: '3rem' }}>
        <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#111827', marginBottom: '1rem' }}>Quick evaluation checklist</h2>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.625rem' }}>
          {[
            'Job to be done written down in one to two specific sentences',
            'Native integrations with existing stack confirmed — not just Zapier workarounds',
            'Deployment complexity assessed against actual team technical capacity',
            'Documented accuracy benchmarks requested and received with supporting data',
            'Total cost calculated including setup, integration, and ongoing management time',
            'SOC 2 Type II confirmed — not Type I — and data usage policy reviewed',
            'Third-party reviews found from companies similar in size and use case',
            'Success metrics defined before pilot starts — not after results are seen',
            'Pilot completed with real data before annual contract signed',
          ].map((item) => (
            <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}>
              <span style={{ color: '#2563EB', fontWeight: 700, flexShrink: 0, marginTop: '0.1rem' }}>☐</span>
              <span style={{ fontSize: '0.875rem', color: '#374151' }}>{item}</span>
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
        <Link href="/" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Browse AI Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>{agentCount ?? 0}+ agents indexed &#x2192;</p>
        </Link>
        <Link href="/compare" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Compare Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>Side-by-side comparisons &#x2192;</p>
        </Link>
        <Link href="/stacks" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Agent Stacks</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>Curated multi-agent workflows &#x2192;</p>
        </Link>
        <Link href="/resources/guides/how-to-calculate-ai-agent-roi" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Calculate AI Agent ROI</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>Quantify the value &#x2192;</p>
        </Link>
      </div>

      <p style={{ fontSize: '0.875rem', color: '#9CA3AF', lineHeight: 1.6 }}>
        All agents on The AI Agent Index are editorially reviewed. See our <Link href="/methodology" style={{ color: '#6B7280' }}>editorial methodology</Link>.
      </p>

      <GuideCitations slug="how-to-evaluate-an-ai-agent" table="guides" />
    </div>
  )
}