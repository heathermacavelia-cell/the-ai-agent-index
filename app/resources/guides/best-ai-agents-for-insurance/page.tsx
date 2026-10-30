import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import GuideCitations from '@/components/GuideCitations'
import NewsletterSignup from '@/components/NewsletterSignup'
import { getGuideMeta, isoDate, updatedLabel } from '@/lib/guideMeta'
import GuideAgentList from '@/components/GuideAgentList'
import { getGuideGroups, type GuideGroup } from '@/lib/guideAgents'
import { buildRefMap, resolveTemplates, type RefMap } from '@/lib/templates'

// Agent names in this guide's prose and FAQ come from the database, not from this file.
// GUIDE_SLUGS lists every agent the prose names. A name that is renamed in the database
// updates here automatically. A slug that does not exist renders its raw template, loudly.
const GUIDE_SLUGS = ['ada', 'chatgpt-deep-research', 'conversica', 'cresta', 'genesys-cloud', 'microsoft-365-copilot', 'netomi', 'persado', 'salesforce-einstein-service', 'shift-technology', 'talkdesk', 'workforce-wave']

// The agents this guide lists, in this order, under the guide's five groups.
// Chosen by hand (Heather, 2026-10-29) - never by tag. Order is editorial, not a ranking.
const GUIDE_GROUPS: GuideGroup[] = [
  {
    heading: 'Contact centers',
    intro: 'Cloud contact center platforms with AI agents and agent assist, for carriers that run their own service operations.',
    slugs: ['talkdesk', 'genesys-cloud', 'cresta'],
  },
  {
    heading: 'Customer service agents',
    intro: 'AI agents that answer policyholder questions across channels and hand the conversation to a person when needed.',
    slugs: ['ada', 'netomi', 'salesforce-einstein-service'],
  },
  {
    heading: 'Fraud detection',
    intro: 'Insurance-trained AI agents that score claims, policies and documents for fraud and triage cases for SIU teams.',
    slugs: ['shift-technology'],
  },
  {
    heading: 'Research',
    intro: 'A research agent that reads many sources and writes cited reports, useful for tracking regulatory changes.',
    slugs: ['chatgpt-deep-research'],
  },
  {
    heading: 'Regulated marketing',
    intro: 'Creative AI for regulated brands, including insurers, that checks copy for compliance while it is generated.',
    slugs: ['persado'],
  },
]

const AGENT_LINK_STYLE = { color: '#2563EB', textDecoration: 'none', fontWeight: 500 }

function A({ s, r }: { s: string; r: RefMap }) {
  const ref = r[s]
  if (!ref || !ref.name) return <>{'{{' + s + '.name}}'}</>
  if (ref.is_active === false) return <>{ref.name}</>
  return <Link href={'/agents/' + s} style={AGENT_LINK_STYLE}>{ref.name}</Link>
}

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'AI Agents for Insurance: Service, Fraud, Compliance (2026)',
  description: 'Talkdesk, Genesys Cloud and Ada for policyholder service, ChatGPT Deep Research for compliance, Persado for regulated marketing. Independently researched.',
  alternates: { canonical: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-insurance' },
  openGraph: {
    title: 'AI Agents for Insurance: Service, Fraud, Compliance (2026)',
    description: 'Talkdesk, Genesys Cloud and Ada for policyholder service, ChatGPT Deep Research for compliance, Persado for regulated marketing. Independently researched.',
    url: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-insurance',
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary',
    title: 'AI Agents for Insurance: Service, Fraud, Compliance (2026)',
    description: 'Talkdesk, Genesys Cloud and Ada for policyholder service, ChatGPT Deep Research for compliance, Persado for regulated marketing. Independently researched.',
  },
}

const faqItems = [
  {
    q: 'What are the best AI agents for insurance companies in 2026?',
    a: 'The right AI agent for insurance depends on the workflow. For policyholder customer service, including claims status, coverage questions and billing inquiries, contact center platforms like {{talkdesk.name}}, {{genesys-cloud.name}} and {{cresta.name}} and customer service agents like {{ada.name}} and {{netomi.name}} handle first-tier conversations and hand complex ones to people. Claims processing AI is often built in-house or deployed through specialist insurtech platforms, and for fraud detection, specialist vendors such as {{shift-technology.name}} score claims, policies and documents for fraud and triage cases for SIU teams. For underwriting automation, AI agents pull data from multiple sources, score applications against risk models, and flag complex cases for human review. For compliance and regulatory monitoring, research agents like {{chatgpt-deep-research.name}} read many sources and write cited reports across jurisdictions.',
  },
  {
    q: 'Can AI agents handle insurance claims processing autonomously?',
    a: 'AI agents can handle significant portions of claims processing autonomously, particularly for straightforward claims that follow established patterns. First notice of loss intake, document collection, damage assessment from photos, coverage verification, and payment calculation for standard claims can all be automated. Complex claims involving disputed liability, suspected fraud, bodily injury, or coverage ambiguity still require human adjusters. The most effective approach is configurable autonomy where the AI handles routine claims end-to-end and escalates complex ones with full documentation for human review. Measure processing time on your own claim types before and after automation rather than relying on vendor averages.',
  },
  {
    q: 'What compliance requirements apply to AI in insurance?',
    a: 'Insurance AI is subject to state-level regulation in the US, with requirements varying by jurisdiction. The NAIC Model Bulletin on the Use of Artificial Intelligence Systems by Insurers had been adopted by 29 jurisdictions (27 states, the District of Columbia and Puerto Rico) as of October 2026, according to the NAIC. It expects insurers to maintain a written AI governance program covering uses across the insurance life cycle, including marketing, underwriting, pricing, claims and fraud detection. Key expectations include testing for unfair discrimination in underwriting and pricing models, explainability for decisions that affect policyholders, data privacy compliance under state insurance data security laws, and documentation sufficient for regulatory examination. The EU AI Act lists AI systems used for risk assessment and pricing of individuals in life and health insurance as high-risk. Any AI agent used in insurance must produce auditable decision records.',
  },
  {
    q: 'How do insurance companies use AI agents for fraud detection?',
    a: 'Insurance fraud detection AI analyzes claims data against historical patterns to identify anomalies that suggest fraudulent activity. It cross-references claimant information across databases, looks for staged accident patterns and suspicious provider billing, and flags claims with characteristics that correlate with fraud. The action it takes should be flagging and scoring rather than claim denial, which keeps consequential decisions with human investigators. This tooling is often built in-house by large carriers or bought from specialist vendors such as {{shift-technology.name}}, whose AI agents score claims, policies and documents for fraud and triage cases for SIU teams. Service agents that touch claims should be configured to route suspected fraud to a human investigator.',
  },
  {
    q: 'Is AI replacing insurance adjusters and underwriters?',
    a: 'AI is not replacing insurance adjusters and underwriters but it is significantly changing their work. For routine tasks like standard auto claims, simple property damage assessments, and straightforward policy renewals, AI can handle the process with minimal human involvement. This frees adjusters and underwriters to focus on complex cases that require judgment, negotiation, and relationship management. The direction of travel is toward AI absorbing more of the routine volume while human professionals handle complex cases with better tools and more complete information. Adjusters who learn to work effectively with AI tools are becoming more productive, not redundant.',
  },
]

const useCases = [
  {
    title: 'Claims Processing and First Notice of Loss',
    description: `Claims processing is a high-impact AI agent use case in insurance because it directly affects both operational costs and policyholder experience. The traditional claims workflow involves manual intake, document collection, coverage verification, damage assessment, liability determination, and payment calculation. Each step involves data entry, cross-referencing, and decision-making that follows established rules for the majority of claims.

AI agents automate the structured portions of this workflow. For first notice of loss, AI agents collect claim details through voice, chat, or digital forms, verify policy coverage, and create the claim record without human involvement. For standard claims like minor auto damage or simple property claims, AI agents can assess damage from submitted photos, calculate repair estimates using industry databases, verify coverage terms, and issue payment authorization for amounts within configured thresholds.

The operational case rests on speed and accuracy: claims that previously took days to process can be resolved much faster for straightforward cases, with fewer data entry errors. Track processing time and error rates on your own automated claim types to see the real effect.

The critical design requirement is configurable escalation. Complex claims involving disputed liability, suspected fraud, bodily injury, catastrophic loss, or coverage ambiguity must route to human adjusters with full context and documentation. The AI agent's value is not replacing adjusters but absorbing the routine volume that prevents adjusters from giving complex claims the attention they require.`,
    categoryLink: { href: '/ai-customer-support-agents/insurance', label: 'Browse AI Agents for Insurance' },
  },
  {
    title: 'Policyholder Customer Service',
    description: `Insurance companies handle large volumes of repetitive customer inquiries: claims status checks, coverage questions, billing inquiries, policy change requests, certificate of insurance generation, and renewal processing. These interactions follow predictable patterns and do not require underwriting judgment. They require accurate policy data access, clear communication, and reliable escalation when the inquiry exceeds the agent's configured authority.

AI customer service agents resolve first-tier inquiries without human involvement, operating around the clock and keeping service consistent during peak periods like storm seasons when call volumes spike. The escalation logic is particularly important in insurance because policyholders often contact their insurer during stressful events like accidents, property damage, or health issues. The handoff to a human agent must be seamless, with full conversation context and relevant policy information transferred automatically.

{{ada.name}} is an enterprise customer experience platform whose AI agents resolve and act on customer conversations across voice, chat, email, SMS, WhatsApp and Instagram. {{netomi.name}} provides enterprise agentic AI for customer service across chat, email and voice. For insurers already on Salesforce, {{salesforce-einstein-service.name}} adds AI agents for customers, reps and employees to the platform where their customer data already lives.

For smaller agencies that want an AI voice agent without a contact center project, {{workforce-wave.name}} builds AI voice agents from a business's website URL and is aimed at service businesses.`,
    categoryLink: { href: '/ai-customer-support-agents/insurance', label: 'Browse All AI Support Agents for Insurance' },
  },
  {
    title: 'Underwriting Automation',
    description: `Underwriting is fundamentally a data problem constrained by human processing bandwidth. Human underwriters make sound decisions but they are limited by how much data they can access and evaluate within available time. AI underwriting agents remove that bandwidth constraint by pulling data from multiple sources simultaneously, applying risk models consistently across every application, and processing volumes that would be impossible for human teams.

AI underwriting agents evaluate policy applications by pulling data from credit bureaus, claims history databases, property records, motor vehicle records, medical information bureaus, and additional third-party data sources. They score applications against risk models, calculate premium recommendations, and either bind straightforward policies autonomously or flag complex ones for human underwriter review. The human review threshold is configurable based on risk appetite and regulatory requirements.

For personal lines like standard auto and homeowners insurance, AI underwriting can handle many applications with minimal human involvement. For commercial lines, specialty insurance, and high-value policies, human underwriters remain essential for judgment calls involving unique risks, relationship pricing, and complex coverage structures. The AI agent's role in commercial lines is to prepare the submission, pull all relevant data, run initial scoring, and present the underwriter with a complete package rather than requiring them to gather information manually.

The regulatory constraints on AI underwriting are significant and vary by state. Unfair discrimination in insurance pricing and underwriting is prohibited, and AI models trained on historical data can encode historical biases. Any AI underwriting system requires ongoing bias monitoring, regular audit against protected class outcomes, and documentation sufficient for regulatory examination. This is a legal requirement under state insurance regulations, not an optional best practice.

Underwriting models themselves are usually built in-house or bought from specialist vendors that this guide does not list. The agents here support the service work around underwriting: for insurers already on Salesforce, {{salesforce-einstein-service.name}} can handle policyholder requests on the same platform as existing CRM data.`,
    categoryLink: null,
  },
  {
    title: 'Contact Center Automation',
    description: `Large carriers run their own contact centers, and that is where most policyholder conversations about claims, billing and coverage happen. Contact center platforms with built-in AI agents let a carrier automate routine calls and chats while keeping human agents, routing and quality controls in one system.

{{talkdesk.name}} is an AI-first contact center platform with Autopilot AI agents, Copilot agent assist and an Agent Builder. {{genesys-cloud.name}} is an enterprise contact center platform with an Agentic Virtual Agent, Copilots and MCP tool access, and is FedRAMP certified. {{cresta.name}} is an AI-native contact center platform with autonomous AI agents for voice, chat and SMS in 30+ languages, relevant for insurers serving policyholders in several languages.

Fraud is a large cost for the industry: the Coalition Against Insurance Fraud's 2022 study estimates that insurance fraud costs the U.S. 308.6 billion dollars annually. None of the platforms above is a fraud-detection product. For fraud, {{shift-technology.name}} builds insurance-trained AI agents that detect claims, policy and document fraud and triage cases for SIU teams. What a contact center can do is make sure AI agents that take claims calls route suspected fraud to human investigators with the full conversation attached, rather than deciding anything themselves.`,
    categoryLink: { href: '/ai-customer-support-agents/insurance', label: 'Browse AI Support Agents for Insurance' },
  },
  {
    title: 'Compliance and Regulatory Monitoring',
    description: `Insurance regulation is unusually complex because it operates at the state level in the US, with each state maintaining its own insurance department, filing requirements, rate approval processes, and market conduct standards. Insurers operating across multiple states must track regulatory changes, filing deadlines, and examination requirements across many jurisdictions simultaneously. This is a monitoring and synthesis problem that AI research agents are well-suited to handle.

AI research agents support insurance compliance teams by monitoring regulatory publications from state insurance departments, NAIC model law updates, and federal regulatory developments. They summarize changes, flag updates relevant to the insurer's specific lines of business and operating states, and cross-reference new requirements against existing compliance documentation. This does not replace specialist compliance counsel but can reduce the time compliance teams spend on regulatory monitoring and initial document review.

The NAIC Model Bulletin on the Use of Artificial Intelligence Systems by Insurers, adopted by 29 jurisdictions (27 states, the District of Columbia and Puerto Rico) as of October 2026 according to the NAIC, expects insurers to maintain a written governance program for AI used across the insurance life cycle, including underwriting, claims and marketing. This means insurance compliance teams increasingly need to monitor not just traditional insurance regulation but also emerging AI governance requirements. Research agents that can synthesize across both regulatory domains are useful here.

{{chatgpt-deep-research.name}} plans its research, reads many sources and writes cited reports from the web, files and connected apps, which suits monitoring regulatory changes across several state jurisdictions. For teams working within the Microsoft ecosystem, {{microsoft-365-copilot.name}} works inside Word, Excel, PowerPoint, Outlook and Teams, grounded in the team's own work data, for drafting and reviewing compliance documents.`,
    categoryLink: { href: '/ai-research-agents', label: 'Browse AI Research Agents' },
  },
  {
    title: 'Insurance Sales and Lead Qualification',
    description: `Insurance sales involves high volumes of inbound inquiries, quote requests, and renewal conversations. AI agents handle the initial qualification, quote generation for standard products, and follow-up sequences that keep prospects engaged through the buying process. For agencies handling multiple carriers, AI agents can compare coverage options and present quotes from multiple insurers, reducing the manual work involved in multi-carrier quoting.

{{conversica.name}} runs AI agents that hold two-way email, SMS, chat and messaging conversations to qualify leads, re-engage customers and book meetings, which fits agencies managing large volumes of quote requests where manual follow-up on every lead is impractical. Configure it to hand the conversation to a licensed agent when the prospect is ready to discuss coverage details.

Marketing copy in insurance has to pass compliance review. {{persado.name}} is agentic creative AI for regulated brands in banking, cards, credit unions, insurance and mortgage, with compliance checks during generation, so marketing teams can produce campaign language with those checks built into the process.

The compliance consideration for AI in insurance sales is that agents must not provide coverage advice or make coverage recommendations unless the interaction is supervised by a licensed producer. Standard AI sales agents should qualify interest, provide general product information, generate quotes from approved rate tables, and schedule consultations with licensed agents for coverage discussions.`,
    categoryLink: { href: '/ai-sales-agents/insurance', label: 'Browse AI Sales Agents for Insurance' },
  },
]

const evaluationCriteria = [
  {
    title: 'State regulatory compliance documentation',
    detail: 'Insurance AI must be deployable within each operating state\'s regulatory framework. Ask vendors whether their product has been deployed at other insurance companies, which states those deployments operate in, and what regulatory examination documentation they can provide. A vendor with no insurance carrier customers is not necessarily disqualifying but it means your compliance team will be doing the regulatory groundwork from scratch.',
  },
  {
    title: 'SOC 2 Type II and data handling',
    detail: 'SOC 2 Type II is the baseline security certification. Beyond that, confirm data residency, model training policies, and data retention. Insurance policyholder data is subject to state insurance data security laws that may impose requirements beyond general data protection regulations. Confirm that the vendor\'s data handling meets the specific requirements of your operating states.',
  },
  {
    title: 'Bias monitoring for underwriting and pricing',
    detail: 'Any AI agent that contributes to underwriting, pricing, or claims decisions must be monitored for unfair discrimination against protected classes. This is a legal requirement under state insurance regulations. Ask vendors what bias testing methodology they use, at what frequency, and what remediation process exists when bias is detected. Vendors should be able to describe their approach specifically, not just confirm that they "monitor for bias."',
  },
  {
    title: 'Configurable autonomy and escalation',
    detail: 'Insurance workflows require different levels of AI autonomy depending on the task. Routine customer service inquiries can be handled fully autonomously. Claims involving bodily injury or disputed liability must escalate to human adjusters. Underwriting for complex commercial risks requires human review. Confirm that the agent supports configurable escalation thresholds by workflow type and that these thresholds are auditable.',
  },
  {
    title: 'Explainable decisions for policyholder-affecting actions',
    detail: 'Any AI decision that affects a policyholder, whether in claims, underwriting, or pricing, must be explainable in human-readable terms for regulatory examination. If a claim is flagged for investigation, the insurer must be able to document why. If a policy is rated differently, the reasoning must be articulable. Vendors who cannot demonstrate explainability for their outputs are not ready for insurance deployment.',
  },
]

export default async function BestAIAgentsForInsurance() {
  const meta = await getGuideMeta('best-ai-agents-for-insurance')
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
    headline: 'Best AI Agents for Insurance Companies (2026)',
    description: 'Talkdesk, Genesys Cloud and Ada for policyholder service, ChatGPT Deep Research for compliance, Persado for regulated marketing.',
    url: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-insurance',
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
    name: 'Best AI Agents for Insurance Companies (2026)',
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
    }))
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
          <span style={{ color: '#111827' }}>Best AI Agents for Insurance</span>
        </nav>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' as const }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Independently Reviewed</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Guide</span>
            <span style={{ fontSize: '0.75rem', color: '#6B7280', padding: '0.25rem 0.75rem', backgroundColor: '#F3F4F6', borderRadius: '9999px' }}>{updated}</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1.5rem' }}>
            Best AI Agents for Insurance Companies (2026)
          </h1>

          <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem' }}>
            Insurance is a natural fit for AI agents. The core operations of an insurance company, including claims processing, underwriting, policyholder service, fraud detection, and regulatory compliance, are high-volume, rules-based workflows that follow established patterns. AI agents handle the repetitive execution so human professionals can focus on the judgment-intensive work that actually requires their expertise: complex claims negotiation, specialty underwriting, and relationship management.
          </p>

          <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem' }}>
            The insurance industry spends heavily on manual processes that produce no differentiated value. Claims adjusters spend significant time on data entry and document collection for straightforward claims. Underwriters manually gather information that could be pulled automatically from third-party data sources. Customer service teams answer the same coverage and billing questions thousands of times. AI agents absorb this routine volume, freeing staff for the cases that need them.
          </p>

          <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem' }}>
            The AI agent landscape in insurance divides into two categories. Enterprise infrastructure for claims automation and core underwriting is predominantly built in-house by large carriers or deployed through specialized insurtech platforms. Commercial AI agents for policyholder service, fraud detection, compliance research, and marketing are available, evaluated, and deployable by insurance companies of any size. This guide covers {listed.length} of those commercially available agents, grouped into contact centers, customer service agents, fraud detection, research and regulated marketing.
          </p>

          <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem' }}>
            Compliance is the primary filter for any AI deployment in insurance. The NAIC Model Bulletin on the Use of Artificial Intelligence Systems by Insurers expects insurers to maintain a written governance program for AI used in underwriting, claims, marketing and other parts of the insurance life cycle. State-level regulation adds jurisdiction-specific requirements. Any AI agent considered for insurance must produce auditable decision records, support configurable human oversight, and withstand regulatory examination. Capability matters, but it is secondary to whether the tool meets regulatory requirements.
          </p>
        </div>

        <GuideAgentList groups={GUIDE_GROUPS} />

        {/* Use cases */}
        {useCases.map((useCase, index) => (
          <div key={index} style={{ marginBottom: '2.5rem', border: '1px solid #E5E7EB', borderRadius: '0.75rem', overflow: 'hidden' }}>
            <div style={{ backgroundColor: '#F9FAFB', padding: '1.25rem 1.5rem', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
            What to look for when evaluating AI agents for insurance
          </h2>
          <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1.5rem' }}>
            Insurance is one of the most heavily regulated industries. AI deployments must withstand state regulatory examination, produce auditable records, and comply with fair underwriting and claims practices requirements. These criteria separate tools ready for insurance deployment from those that are not.
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
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>How to choose an AI agent for insurance</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.75rem' }}>
            {[
              { condition: 'You need policyholder customer service: claims status, coverage questions, billing inquiries', recommendation: <><A s="ada" r={refs} /> or <A s="netomi" r={refs} /></> },
              { condition: 'You need an enterprise contact center platform with AI agents and agent assist', recommendation: <><A s="talkdesk" r={refs} />, <A s="genesys-cloud" r={refs} /> or <A s="cresta" r={refs} /></> },
              { condition: 'You need an AI voice agent for an insurance agency without a contact center project', recommendation: <A s="workforce-wave" r={refs} /> },
              { condition: 'You need AI agents to detect claims, policy and document fraud and triage SIU cases', recommendation: <A s="shift-technology" r={refs} /> },
              { condition: 'You need compliance monitoring across state jurisdictions and NAIC updates', recommendation: <A s="chatgpt-deep-research" r={refs} /> },
              { condition: 'You need lead qualification and follow-up for quote requests', recommendation: <A s="conversica" r={refs} /> },
              { condition: 'You need marketing copy with compliance checks built into generation', recommendation: <A s="persado" r={refs} /> },
              { condition: 'You are on Salesforce and need AI integrated with your existing CRM', recommendation: <A s="salesforce-einstein-service" r={refs} /> },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem', padding: '0.875rem 1rem', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.5rem', alignItems: 'flex-start', flexWrap: 'wrap' as const }}>
                <span style={{ fontSize: '0.875rem', color: '#374151', flex: 1 }}>If <strong>{row.condition}</strong></span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2563EB', flexShrink: 0 }}>&#x2192; {row.recommendation}</span>
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
              { href: '/ai-customer-support-agents/insurance', label: 'AI Customer Support Agents for Insurance' },
              { href: '/ai-sales-agents/insurance', label: 'AI Sales Agents for Insurance' },
              { href: '/resources/guides/best-ai-agents-for-finance', label: 'Best AI Agents for Banking and Finance (2026)' },
              { href: '/resources/guides/best-ai-agents-for-customer-support', label: 'Best AI Agents for Customer Support' },
              { href: '/resources/guides/how-to-evaluate-an-ai-agent', label: 'How to Evaluate an AI Agent' },
              { href: '/ai-customer-support-agents', label: 'Browse All AI Customer Support Agents' },
            ].map((link) => (
              <Link key={link.href} href={link.href} style={{ fontSize: '0.875rem', color: '#2563EB', textDecoration: 'none' }}>&#x2192; {link.label}</Link>
            ))}
          </div>
        </div>

        {/* Methodology */}
        <div style={{ marginBottom: '2rem', padding: '1.25rem', backgroundColor: '#EFF6FF', borderRadius: '0.75rem', border: '1px solid #BFDBFE' }}>
          <p style={{ fontSize: '0.875rem', color: '#1E40AF', lineHeight: 1.7, margin: 0 }}>
            <strong>Methodology:</strong> This guide covers AI agents for insurance companies based on vendor documentation and regulatory framework requirements. Claims processing and core underwriting AI are predominantly enterprise or in-house builds with limited commercial standalone agent availability. The agents in this guide are chosen by hand from the index&apos;s audited listings, and their order is editorial, not a ranking. As the commercial insurance AI agent market matures, this guide will be updated with additional reviewed listings. See our <Link href="/methodology" style={{ color: '#2563EB' }}>full methodology</Link>.
          </p>
        </div>

        <GuideCitations slug="best-ai-agents-for-insurance" table="guides" />

      </div>
    </>
  )
}
