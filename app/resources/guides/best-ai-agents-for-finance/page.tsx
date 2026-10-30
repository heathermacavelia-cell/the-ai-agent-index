import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import GuideCitations from '@/components/GuideCitations'
import NewsletterSignup from '@/components/NewsletterSignup'
import { getGuideMeta, isoDate, updatedLabel } from '@/lib/guideMeta'
import GuideAgentList from '@/components/GuideAgentList'
import { getGuideGroups, type GuideGroup } from '@/lib/guideAgents'
import { buildRefMap, resolveTemplates } from '@/lib/templates'

// Agent names in this guide's prose and FAQ come from the database, not from this file.
// GUIDE_SLUGS lists every agent the prose names. A name that is renamed in the database
// updates here automatically. A slug that does not exist renders its raw template, loudly.
const GUIDE_SLUGS = ['ada', 'beam-ai', 'chatgpt-deep-research', 'claude-cowork', 'claude-for-excel', 'decagon', 'forethought', 'gemini-deep-research', 'genesys-cloud', 'h2ogpte', 'salesforce-agentforce', 'sardine', 'sierra', 'talkdesk', 'torq', 'workato']

// The agents this guide lists, in this order, under the guide's four types.
// Chosen by hand (Heather, 2026-10-29) - never by tag. Order is editorial, not a ranking.
const GUIDE_GROUPS: GuideGroup[] = [
  {
    heading: 'Customer service',
    intro: 'AI agents and contact center platforms that answer and resolve customer conversations across voice, chat, email and messaging.',
    slugs: ['sierra', 'decagon', 'ada', 'salesforce-agentforce', 'talkdesk', 'genesys-cloud', 'forethought'],
  },
  {
    heading: 'Research and compliance',
    intro: 'Research agents that read many sources and write cited reports, and an enterprise platform that can run on-premise.',
    slugs: ['chatgpt-deep-research', 'gemini-deep-research', 'h2ogpte'],
  },
  {
    heading: 'Finance operations',
    intro: 'Agents for spreadsheet work, system integration and back-office processes such as reconciliation and close.',
    slugs: ['claude-for-excel', 'workato', 'beam-ai', 'claude-cowork'],
  },
  {
    heading: 'Fraud and financial crime',
    intro: 'Platforms that detect fraud and run KYC, sanctions and AML checks, with AI agents for alert reviews and investigations.',
    slugs: ['sardine', 'feedzai', 'seon'],
  },
  {
    heading: 'Security operations',
    intro: 'AI agents that triage, investigate and respond to security alerts. This is security operations, not fraud detection.',
    slugs: ['torq'],
  },
]



export const dynamic = 'force-dynamic'

const META_DESCRIPTION = 'Sierra and Ada for customer service, ChatGPT Deep Research for compliance research, Beam AI for operations. Security and audit criteria compared.'

export const metadata: Metadata = {
  title: 'AI Agents for Banking: Service, Compliance, Operations (2026)',
  description: META_DESCRIPTION,
  alternates: { canonical: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-finance' },
  openGraph: {
    title: 'AI Agents for Banking: Service, Compliance, Operations (2026)',
    description: META_DESCRIPTION,
    url: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-finance',
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary',
    title: 'AI Agents for Banking: Service, Compliance, Operations (2026)',
    description: META_DESCRIPTION,
  },
}

const faqItems = [
  {
    q: 'What are the best AI agents for banking and finance teams in 2026?',
    a: 'Most commercial AI agents used in banking and finance fall into a few groups. For customer-facing work like account inquiries, dispute questions and loan application updates, customer support agents such as {{sierra.name}}, {{decagon.name}}, {{ada.name}} and {{forethought.name}} resolve conversations autonomously and hand off to people when needed. For internal research like regulatory monitoring and document synthesis, research agents such as {{chatgpt-deep-research.name}} and {{gemini-deep-research.name}} write cited reports from many sources. For finance operations, {{beam-ai.name}} runs back-office processes with human approval on critical steps, and {{claude-for-excel.name}} works inside Excel workbooks to explain formulas and build models. For fraud and AML operations, {{sardine.name}} pairs fraud prevention and KYC checks with AI agents that review alerts and draft SAR narratives. Underwriting AI is mostly built in-house or bought as part of enterprise platforms rather than as standalone commercial agents. The right tool depends on which workflow you are trying to automate.',
  },
  {
    q: 'What security certifications should a financial AI agent have?',
    a: 'SOC 2 Type II is the baseline requirement for any AI agent handling financial data. It shows that an independent auditor tested the vendor\'s security controls over a period of time. Beyond that, look for ISO 27001 certification for information security management, encryption at rest and in transit using AES-256 or equivalent standards, role-based access controls, and a clearly documented data retention and deletion policy. For institutions operating under specific regulatory frameworks, confirm alignment with FINRA, SEC, GDPR, CCPA, or PCI DSS as applicable. Do not accept SOC 2 Type I as equivalent to Type II. Type I is a point-in-time assessment of how controls are designed. Type II tests whether those controls actually operated over a review period, usually several months, and is the meaningful standard.',
  },
  {
    q: 'Can AI agents replace human financial advisors or compliance officers?',
    a: 'AI agents cannot replace human judgment in financial services for decisions involving regulatory interpretation, client relationship management, complex negotiation, or novel situations outside their training data. What they can do is handle the high-volume, rules-based work that takes up much of compliance and operations teams\' time: document review, regulatory filing preparation, first-tier customer service and alert triage. Institutions that use AI well let it absorb routine volume so human professionals can focus on the judgment-intensive work that actually requires their expertise.',
  },
  {
    q: 'How do AI agents handle audit trails and explainability in banking?',
    a: 'Regulatory-grade AI agents in banking maintain timestamped logs of every action, input, and output. Explainability requirements vary by use case. For credit decisions and compliance actions, agents must be able to explain why a specific decision was made in human-readable terms, not just output a score. Look for SHAP values, decision tree outputs, or explicit reasoning traces depending on the model architecture. Any agent making or informing decisions that affect customers or regulatory filings must produce documentation sufficient for a compliance review. If a vendor cannot articulate their explainability approach clearly, that is a significant red flag for regulated use cases.',
  },
  {
    q: 'Are AI agents in banking subject to the same regulations as the institutions using them?',
    a: 'The regulatory responsibility stays with the institution, not the AI vendor. If a bank uses an AI agent to make credit decisions and those decisions discriminate based on protected characteristics, the bank is liable under fair lending laws regardless of whether the AI caused the outcome. This is why AI governance frameworks, bias monitoring, and human oversight requirements exist. Institutions evaluating AI agents must conduct their own compliance assessment against applicable regulations rather than relying on vendor claims of compliance readiness. Vendor certifications demonstrate security controls, not regulatory compliance for your specific use case.',
  },
]

const useCases = [
  {
    title: 'Security Operations',
    description: `Banks and financial institutions run large security operations, and the volume of security alerts coming from their tools can exceed what human analysts can review. AI agents for security operations triage those alerts, investigate likely threats, and coordinate a response across the security tool stack, escalating to analysts when a case needs human judgment.

{{torq.name}} is an AI SOC platform whose AI agents triage, investigate and respond to security threats. It is a security operations product, not a fraud-detection or transaction-monitoring tool.

For fraud and financial crime, {{sardine.name}} is an agentic risk platform for fraud prevention, KYC and AML whose AI agents review alerts, research businesses and draft SAR narratives, with higher-risk findings routed to human review. Many large institutions still build fraud detection and transaction monitoring in-house or buy it as part of enterprise platforms.`,
    categoryLink: { href: '/ai-workflow-agents/finance', label: 'Browse AI Workflow Agents for Finance' },
  },
  {
    title: 'Compliance and Regulatory Reporting',
    description: `Compliance is a major operational cost in financial services. Much of that cost is human review time applied to tasks that are repetitive and rules-based: KYC verification, AML transaction monitoring, regulatory filing preparation, policy documentation review, and audit trail maintenance. These tasks are well suited to AI agents, with people reviewing the output.

AI compliance agents can monitor transaction flows against AML typologies, run KYC checks against sanctions lists and adverse media sources, flag suspicious patterns for human review, and generate the documentation that supports regulatory filings. The critical design requirement for compliance AI is a complete, timestamped audit trail. Regulators need to see not just what decision was made, but what information was available at the time, what the agent evaluated, and why the outcome was what it was. Any AI agent deployed in a compliance workflow without explainable, auditable decision records is not regulatory-grade.

The regulatory landscape for AI in financial services is evolving. The EU AI Act classifies AI systems used to evaluate the creditworthiness of individuals or establish their credit score as high-risk, which carries specific requirements for transparency, human oversight, and risk management documentation. Institutions evaluating AI agents for compliance should track regulatory guidance from their primary regulators, as requirements are still being defined in most jurisdictions.

Research agents support compliance teams by monitoring regulatory publications, summarizing changes across jurisdictions, and flagging updates relevant to the institution's business. {{chatgpt-deep-research.name}}, OpenAI's research mode in ChatGPT, plans its research, reads many sources and writes cited reports from the web, files and connected apps, which is useful for regulatory monitoring across jurisdictions. For institutions that need to keep data inside their own environment, {{h2ogpte.name}} is an enterprise agentic AI platform from H2O.ai that combines generative and predictive AI and can be deployed on-premise or air-gapped.`,
    categoryLink: { href: '/ai-research-agents/finance', label: 'Browse AI Research Agents for Finance' },
  },
  {
    title: 'Customer Service in Banking',
    description: `Customer service is one of the most common AI agent use cases in banking. Banks and financial institutions handle large volumes of repetitive inquiries: account balances, transaction disputes, payment status, loan application updates, fee waivers, and product information. Most of these queries do not require human judgment. They require accurate data access, appropriate tone, and the ability to escalate correctly when a situation exceeds the agent's authority or confidence.

AI customer service agents at banks and fintech companies resolve first-tier inquiries without human involvement, which can reduce call center volume for routine contact types. They operate around the clock, keep quality consistent during volume spikes, and hand off to human agents with full conversation context and relevant account history when escalation is required. The escalation logic is critical in financial services where customers have elevated expectations around accuracy and data security.

The key compliance consideration for AI customer service in banking is that agents must not provide financial advice unless the institution has appropriate licensing and the agent has been configured and audited for that purpose. Standard customer service AI should answer questions about products and account status, resolve operational issues, and refer to human advisors for anything that constitutes financial guidance. The boundary between information and advice is a regulatory line that must be explicitly managed in the agent configuration.

For enterprise contact centers handling voice, chat, email, and messaging, {{talkdesk.name}} is an AI-first contact center platform with Autopilot AI agents, Copilot agent assist and Agent Builder, and {{genesys-cloud.name}} is an enterprise contact center platform with an Agentic Virtual Agent and Copilots that is FedRAMP certified. {{sierra.name}}, {{decagon.name}} and {{ada.name}} are enterprise AI agent platforms focused on resolving customer conversations autonomously; {{sierra.name}} is built with governance controls for high-stakes customer interactions and is FedRAMP High certified. {{forethought.name}}, acquired by Zendesk in 2026, resolves support conversations with multiple AI agents working together.`,
    categoryLink: { href: '/ai-customer-support-agents/finance', label: 'Browse AI Support Agents for Finance' },
  },
  {
    title: 'Risk Assessment and Underwriting',
    description: `Risk assessment and underwriting in insurance and lending are fundamentally data problems. Human underwriters make decisions based on the data they can access and process within available time. AI agents can access more data sources, process them faster, and apply risk models more consistently across applications, because they are not limited by the same time and bandwidth constraints. They are not free of bias, as the regulatory section below explains.

AI underwriting agents evaluate loan or policy applications by pulling data from credit bureaus, bank statements, income verification services, and additional data sources, scoring the application against risk models, and either approving straightforward cases autonomously or flagging complex ones for human review. The human review threshold is configurable based on risk appetite. For standard auto insurance renewals or small personal loans, fully autonomous decisions may be appropriate. For commercial lending or large policy endorsements, human review remains standard.

The regulatory constraints on AI underwriting are significant. The Equal Credit Opportunity Act, Fair Housing Act, and equivalent regulations in other jurisdictions prohibit credit and insurance decisions that produce discriminatory outcomes, regardless of whether discrimination was intentional. AI models trained on historical data can encode historical biases. Any AI underwriting system requires ongoing bias monitoring and regular audit against protected class outcomes. This is a legal requirement, not a best practice.

For teams already on Salesforce, {{salesforce-agentforce.name}} is Salesforce's platform for building AI agents on Salesforce data, which teams can apply to service workflows in lending and insurance. Most production underwriting AI is embedded in larger platforms or built in-house by major institutions, and this guide does not list dedicated underwriting agents.`,
    categoryLink: { href: '/ai-sales-agents/insurance', label: 'Browse AI Agents for Insurance' },
  },
  {
    title: 'Financial Operations and Reconciliation',
    description: `Financial operations, including transaction reconciliation, close cycle management, accounts payable and receivable processing, and cash flow forecasting, are high-volume, rule-governed processes well suited to AI agent automation. Finance teams at many organizations spend significant time on reconciliation work that produces no insight, just confirmation that numbers match. AI agents can handle that confirmation process, escalating the exceptions that require human investigation.

AI workflow agents in financial operations match transactions across systems, identify discrepancies and categorize them by likely cause, prepare reconciliation reports for review, and manage the documentation required for close cycles. Because they can run continuously rather than in batch cycles, they can shorten the time it takes to close the books. Measure your own close timeline before and after a pilot rather than relying on vendor benchmarks.

{{beam-ai.name}} is an AI agent platform for enterprise operations with self-learning agents, human approval on critical steps, and 1,000+ integrations including SAP and Workday. For teams working primarily in spreadsheets, {{claude-for-excel.name}} is Anthropic's Excel add-in: it reads multi-tab workbooks, answers with cell-level citations, debugs formulas and builds models. {{workato.name}} is an enterprise integration and automation platform that publishes workflows as governed MCP servers, which matters for finance teams connecting AI agents to their existing systems.

Cash flow and revenue forecasting is an increasingly active area for AI agents. Rather than static models updated manually, AI forecasting tools continuously ingest ERP data, market signals, and pipeline data to produce rolling forecasts that reflect current conditions.`,
    categoryLink: { href: '/ai-workflow-agents/finance', label: 'Browse AI Workflow Agents for Finance' },
  },
  {
    title: 'Research and Market Intelligence',
    description: `Investment research, competitive intelligence, and regulatory monitoring all involve processing large volumes of documents, reports, and data to surface actionable insights. This is a natural fit for AI research agents, which can synthesize information across sources, identify relevant patterns, and produce structured outputs faster than human analysts reviewing the same material manually.

AI research agents in banking and financial services are used by investment teams to scan earnings reports, analyst notes, regulatory filings, and news sources, synthesizing relevant signals into structured research briefs. Compliance and risk teams use them to monitor regulatory publications across jurisdictions. Wealth management firms use them to surface relevant market developments for client communication.

The accuracy requirement for financial research AI is high but the consequences of error are lower than in autonomous decision-making contexts because a human analyst reviews the output before it informs a decision. This makes research agents a relatively accessible entry point for financial institutions exploring AI adoption: the human review layer provides a safety net while teams build confidence in the agent's output quality.

{{gemini-deep-research.name}} is Google's agentic research feature: it plans its research, browses up to hundreds of sources and returns cited multi-page reports. {{chatgpt-deep-research.name}} does similar work inside ChatGPT, drawing on the web, files and connected apps. For teams that want research alongside hands-on document work, {{claude-cowork.name}} is Anthropic's agentic AI for knowledge work: it reads, edits and creates files, runs shell commands, schedules recurring tasks, and connects to Microsoft 365, Drive and Slack.`,
    categoryLink: { href: '/ai-research-agents/finance', label: 'Browse All AI Research Agents for Finance' },
  },
]

const evaluationCriteria = [
  {
    title: 'SOC 2 Type II, not Type I',
    detail: 'SOC 2 Type II is the baseline security certification for any AI agent handling financial data. Type I is a point-in-time assessment of how controls are designed. Type II tests whether those controls actually operated over a review period, usually several months, which shows they have been consistently applied, not just documented. Do not accept Type I as equivalent. Any vendor who conflates the two is either uninformed or deliberately vague.',
  },
  {
    title: 'Explainable, auditable decision records',
    detail: 'Every decision the agent makes or informs must be documentable for regulatory review. Ask vendors specifically how their agent logs decisions, what information is captured at the point of each decision, and how long records are retained. The answer should be a specific technical description, not a general assurance. If the agent cannot produce a timestamped, human-readable record of why it produced a specific output, it is not suitable for regulated financial workflows.',
  },
  {
    title: 'Data residency and isolation',
    detail: 'Financial data is subject to data residency requirements in most jurisdictions. Confirm where the vendor processes and stores data, whether your data is used to train their models, and what happens to your data if you end the contract. Ask for a written, contractual commitment that your data is not used for model training. If a vendor cannot confirm this in writing, that is disqualifying for regulated use cases.',
  },
  {
    title: 'Bias monitoring for decision-affecting workflows',
    detail: 'Any AI agent that contributes to decisions affecting customers, credit, insurance, or employment must be monitored for discriminatory outcomes. This is a legal requirement under fair lending, fair housing, and equal opportunity frameworks, not an optional best practice. Ask vendors what bias monitoring they conduct, at what frequency, and what remediation process exists when bias is detected. A vendor who dismisses this question is not ready for regulated deployment.',
  },
  {
    title: 'Human oversight configuration',
    detail: 'Financial AI agents should be configurable for the level of autonomy appropriate to each workflow. Low-stakes, high-volume tasks like balance inquiries can be handled fully autonomously. High-stakes decisions like credit approvals, large transaction flags, and regulatory filings should require human review. Confirm that the agent supports configurable escalation thresholds and that human-in-the-loop workflows are a standard feature, not a workaround.',
  },
]

export default async function BestAIAgentsForFinance() {
  const meta = await getGuideMeta('best-ai-agents-for-finance')
  const published = isoDate(meta?.published_at)
  const audited = isoDate(meta?.last_audited_at)
  const updated = updatedLabel(meta?.last_audited_at)

  const supabase = createClient()
  const groups = await getGuideGroups(GUIDE_GROUPS)
  const listed = groups.flatMap((g) => g.agents)

  const refs = await buildRefMap(supabase, GUIDE_SLUGS)
  const t = (text: string) => resolveTemplates(text, refs)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Best AI Agents for Banking and Finance (2026)',
    description: t('{{sierra.name}} and {{ada.name}} for customer service, {{chatgpt-deep-research.name}} for compliance research, {{beam-ai.name}} for operations. Security and audit criteria compared.'),
    url: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-finance',
    author: { '@type': 'Organization', name: 'The AI Agent Index', url: 'https://theaiagentindex.com' },
    publisher: { '@type': 'Organization', name: 'The AI Agent Index', url: 'https://theaiagentindex.com' },
    ...(published ? { datePublished: published } : {}),
    ...(audited ? { dateModified: audited } : {}),
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: t(a) },
    })),
  }

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Best AI Agents for Banking and Finance (2026)',
    numberOfItems: listed.length,
    itemListElement: listed.map((agent, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'SoftwareApplication',
        name: agent.name,
        description: agent.short_description,
        url: `https://theaiagentindex.com/agents/${agent.slug}`,
      }
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>

        {/* Breadcrumb */}
        <nav style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8125rem', color: '#6B7280', marginBottom: '2rem' }}>
          <Link href="/" style={{ color: '#6B7280', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link href="/resources/guides" style={{ color: '#6B7280', textDecoration: 'none' }}>Guides</Link>
          <span>/</span>
          <span style={{ color: '#111827' }}>Best AI Agents for Banking and Finance</span>
        </nav>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' as const }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Independently Reviewed</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Guide</span>
            <span style={{ fontSize: '0.75rem', color: '#6B7280', padding: '0.25rem 0.75rem', backgroundColor: '#F3F4F6', borderRadius: '9999px' }}>{updated}</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1.5rem' }}>
            Best AI Agents for Banking and Finance (2026)
          </h1>

          <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem' }}>
            Banking and finance is a natural fit for AI agent deployment, not because the technology is more advanced here, but because the work itself is well-suited to automation. Financial services and banking operations run on repetitive, rules-based processes at enormous volume: transaction monitoring, compliance checking, document review, customer inquiry resolution, reconciliation, and regulatory reporting. These are precisely the tasks AI agents are designed to handle: consistently, at scale, with complete audit trails.
          </p>

          <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem' }}>
            The potential is large. McKinsey estimates generative AI could add $200 billion to $340 billion a year in value to the banking industry, mostly through productivity gains. That is an estimate of potential value, not a forecast, and how much of it any one institution captures depends on which workflows it automates and how well.
          </p>

          <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem' }}>
            The AI agent landscape in banking and finance divides clearly into two categories. The first is enterprise-grade infrastructure, including algorithmic trading, underwriting AI, and core banking systems, which is predominantly built in-house by large banks or deployed through established enterprise platforms. The second is commercial AI agents for workflows like customer service, research, fraud and AML operations, and document synthesis, where purpose-built tools are available, evaluated, and deployable by financial institutions of any size.
          </p>

          <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem' }}>
            Security and compliance credentials are the primary filter when evaluating any AI agent for banking or financial services use. Capability matters, but it is secondary to whether the tool meets the institutional and regulatory requirements for handling financial data. This guide covers {listed.length} AI agents across the main banking use cases where commercial agents are available, and the evaluation criteria that matter most in a regulated environment.
          </p>
        </div>

        <GuideAgentList groups={GUIDE_GROUPS} />

        {/* Use cases */}
        {useCases.map((useCase, index) => (
          <div key={index} style={{ marginBottom: '2.5rem', border: '1px solid #E5E7EB', borderRadius: '0.75rem', overflow: 'hidden' }}>
            <div style={{ backgroundColor: '#F9FAFB', padding: '1.25rem 1.5rem', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#2563EB', fontVariantNumeric: 'tabular-nums', letterSpacing: '0.02em' }}>{String(index + 1).padStart(2, '0')}</span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', margin: 0 }}>{useCase.title}</h2>
            </div>
            <div style={{ padding: '1.5rem' }}>
              {useCase.description.split('\n\n').map((para, i) => (
                <p key={i} style={{ color: '#374151', lineHeight: 1.75, marginBottom: '1rem', fontSize: '0.9375rem' }}>{t(para)}</p>
              ))}

              {useCase.categoryLink && (
                <div style={{ marginTop: '0.5rem', padding: '0.875rem 1rem', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem', color: '#374151' }}>Browse agents for this use case</span>
                  <Link href={useCase.categoryLink.href} style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2563EB', textDecoration: 'none' }}>
                    {useCase.categoryLink.label} &#x2192;
                  </Link>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Newsletter */}
        <div style={{ marginBottom: '2.5rem' }}>
          <NewsletterSignup />
        </div>

        {/* Evaluation criteria */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>
            What to look for when evaluating AI agents for banking
          </h2>
          <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1.5rem' }}>
            The stakes in banking and financial services are higher than in most other sectors. Errors can trigger regulatory penalties, financial losses, and reputational damage. These are the criteria that separate tools that can be deployed responsibly in a regulated environment from those that cannot.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.875rem' }}>
            {evaluationCriteria.map((criterion, i) => (
              <div key={i} style={{ padding: '1.25rem', border: '1px solid #E5E7EB', borderRadius: '0.75rem', backgroundColor: 'white' }}>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>{criterion.title}</h3>
                <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.7, margin: 0 }}>{criterion.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How to choose */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>How to choose an AI agent for banking and finance</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.75rem' }}>
            {[
              { condition: 'Your primary need is customer service in banking: account inquiries, disputes, payment questions', recommendation: '{{sierra.name}}, {{ada.name}}, or {{decagon.name}}', href: '/ai-customer-support-agents/finance' },
              { condition: 'You need an enterprise contact center platform with compliance and workforce management', recommendation: '{{talkdesk.name}} or {{genesys-cloud.name}}', href: '/ai-customer-support-agents/finance' },
              { condition: 'You need to monitor and synthesize regulatory publications across jurisdictions', recommendation: '{{chatgpt-deep-research.name}} or {{gemini-deep-research.name}}', href: '/ai-research-agents/finance' },
              { condition: 'You need financial operations automation with ERP connectors', recommendation: '{{beam-ai.name}} or {{workato.name}}', href: '/ai-workflow-agents/finance' },
              { condition: 'You need spreadsheet-based financial modeling and analysis', recommendation: '{{claude-for-excel.name}}', href: '/agents/claude-for-excel' },
              { condition: 'You need fraud prevention, KYC and AML monitoring with AI agents for alert reviews', recommendation: '{{sardine.name}}', href: '/agents/sardine' },
              { condition: 'You need underwriting AI or algorithmic trading (mostly in-house or enterprise-platform builds; not listed in this guide)', recommendation: 'Browse AI Workflow Agents', href: '/ai-workflow-agents/finance' },
              { condition: 'You need AI agents to triage and respond to security alerts', recommendation: '{{torq.name}}', href: '/agents/torq' },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem', padding: '0.875rem 1rem', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.5rem', alignItems: 'flex-start', flexWrap: 'wrap' as const }}>
                <span style={{ fontSize: '0.875rem', color: '#374151', flex: 1 }}>If <strong>{row.condition}</strong></span>
                <Link href={row.href} style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2563EB', textDecoration: 'none', flexShrink: 0 }}>&#x2192; {t(row.recommendation)}</Link>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '1.25rem' }}>Frequently Asked Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '1rem' }}>
            {faqItems.map(({ q, a }) => (
              <div key={q} style={{ border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.25rem 1.5rem' }}>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>{q}</h3>
                <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.75, margin: 0 }}>{t(a)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related resources */}
        <div style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>Related Resources</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.5rem' }}>
            {[
              { href: '/ai-customer-support-agents/finance', label: 'AI Customer Support Agents for Finance' },
              { href: '/ai-customer-support-agents/insurance', label: 'AI Customer Support Agents for Insurance' },
              { href: '/resources/guides/best-ai-agents-for-insurance', label: 'Best AI Agents for Insurance Companies (2026)' },
              { href: '/ai-research-agents/finance', label: 'AI Research Agents for Finance' },
              { href: '/ai-workflow-agents/finance', label: 'AI Workflow Agents for Finance' },
              { href: '/resources/guides/best-ai-agents-for-legal', label: 'Best AI Agents for Legal Teams (2026)' },
              { href: '/resources/guides/best-ai-agents-for-customer-support', label: 'Best AI Agents for Customer Support' },
              { href: '/resources/guides/best-ai-research-agents', label: 'Best AI Research Agents (2026)' },
              { href: '/resources/guides/how-to-evaluate-an-ai-agent', label: 'How to Evaluate an AI Agent' },
            ].map((link) => (
              <Link key={link.href} href={link.href} style={{ fontSize: '0.875rem', color: '#2563EB', textDecoration: 'none' }}>&#x2192; {link.label}</Link>
            ))}
          </div>
        </div>

        {/* Methodology */}
        <div style={{ marginBottom: '2rem', padding: '1.25rem', backgroundColor: '#EFF6FF', borderRadius: '0.75rem', border: '1px solid #BFDBFE' }}>
          <p style={{ fontSize: '0.875rem', color: '#1E40AF', lineHeight: 1.7, margin: 0 }}>
            <strong>Methodology:</strong> This guide covers AI agents for banking and financial services based on vendor documentation, our audited listings, and regulatory framework requirements. Algorithmic trading and underwriting AI are predominantly enterprise or in-house builds with limited commercial standalone agent availability. Agent listings in this guide are limited to tools we have reviewed and list in the index; pricing on each card is shown live from the listing. As the commercial financial AI agent market matures, this guide will be updated with additional reviewed listings. See our <Link href="/methodology" style={{ color: '#2563EB' }}>full methodology</Link>.
          </p>
        </div>

        <GuideCitations slug="best-ai-agents-for-finance" table="guides" />

      </div>
    </>
  )
}