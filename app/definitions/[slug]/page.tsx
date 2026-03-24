import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface Props {
  params: { slug: string }
}

const DEFINITIONS: Record<string, {
  title: string
  metaDescription: string
  category: string
  categoryLabel: string
  whatItIs: string
  howItWorks: string
  keyCapabilities: string[]
  useCases: string[]
  howToEvaluate: string[]
  faqs: { q: string; a: string }[]
}> = {
  'what-is-an-ai-sales-agent': {
    title: 'What is an AI Sales Agent?',
    metaDescription: 'An AI sales agent is software that autonomously executes sales tasks — prospecting, outreach, lead qualification, and CRM updates — without constant human input.',
    category: 'ai-sales-agents',
    categoryLabel: 'AI Sales Agents',
    whatItIs: 'An AI sales agent is software that autonomously executes sales tasks — including prospecting, personalised outreach, lead qualification, follow-up sequencing, and CRM data entry — without requiring constant human input. Unlike traditional sales tools that surface data for humans to act on, AI sales agents take action on behalf of sales teams.',
    howItWorks: 'AI sales agents connect to data sources (CRM, LinkedIn, company databases), identify target accounts matching your ideal customer profile, generate personalised outreach, send emails or messages, track responses, and update your CRM automatically. More advanced agents can book meetings, handle objections, and escalate warm leads to human reps.',
    keyCapabilities: [
      'Lead prospecting and enrichment',
      'Personalised outbound email and LinkedIn outreach',
      'Automated follow-up sequences',
      'Lead qualification and scoring',
      'CRM data entry and pipeline management',
      'Meeting scheduling and calendar integration',
      'Conversation intelligence and call analysis',
    ],
    useCases: [
      'Scaling outbound prospecting without growing headcount',
      'Re-engaging dormant leads in your CRM',
      'Running account-based marketing campaigns at scale',
      'Automating SDR workflows for SMB sales teams',
      'Enriching inbound leads before they reach sales reps',
    ],
    howToEvaluate: [
      'Does it integrate with your CRM (Salesforce, HubSpot)?',
      'Does it personalise outreach or send generic templates?',
      'How does it handle replies and objections?',
      'What data sources does it use for prospecting?',
      'Is pricing per seat, per email, or usage-based?',
      'How long does initial setup take?',
    ],
    faqs: [
      { q: 'What is the difference between an AI sales agent and a sales automation tool?', a: 'Traditional sales automation tools (like email sequencers) execute predefined workflows triggered by humans. AI sales agents are autonomous — they make decisions, personalise actions based on context, and adapt their behaviour based on responses without requiring manual input at each step.' },
      { q: 'Can an AI sales agent replace a human SDR?', a: 'AI sales agents can automate the high-volume, repetitive parts of SDR work — prospecting, initial outreach, follow-up, and CRM hygiene. Most teams use them to augment SDRs rather than replace them, allowing human reps to focus on qualified conversations and relationship building.' },
      { q: 'How much does an AI sales agent cost?', a: 'Pricing varies widely. Some tools offer freemium plans, while enterprise-grade agents can cost $500–$2,000+ per month. Most are priced per seat or by the number of contacts reached. The AI Agent Index tracks pricing for all indexed agents.' },
      { q: 'Are AI sales agents safe to use for outbound email?', a: 'Reputable AI sales agents are designed to comply with email regulations (CAN-SPAM, GDPR) and avoid spam triggers. Look for agents with built-in deliverability features like domain warmup, sending limits, and unsubscribe handling.' },
    ],
  },
  'what-is-an-ai-customer-support-agent': {
    title: 'What is an AI Customer Support Agent?',
    metaDescription: 'An AI customer support agent is software that autonomously handles customer queries, resolves support tickets, and provides omnichannel service without human intervention.',
    category: 'ai-customer-support-agents',
    categoryLabel: 'AI Customer Support Agents',
    whatItIs: 'An AI customer support agent is software that autonomously handles customer queries, resolves support tickets, and delivers consistent service across channels — without requiring a human agent for every interaction. These agents go beyond basic chatbots by understanding context, accessing knowledge bases, and taking action (processing refunds, updating orders, escalating complex issues).',
    howItWorks: 'AI customer support agents connect to your helpdesk (Zendesk, Intercom, Freshdesk), knowledge base, and backend systems. When a customer submits a query, the agent classifies the intent, retrieves relevant information, and either resolves the issue autonomously or routes it to the right human agent with full context pre-populated.',
    keyCapabilities: [
      'Autonomous ticket resolution',
      'Intent classification and routing',
      'Knowledge base retrieval and answer generation',
      'Omnichannel support (email, chat, SMS, voice)',
      'Order management and refund processing',
      'Escalation with context handoff to human agents',
      'CSAT measurement and feedback collection',
    ],
    useCases: [
      'Resolving high-volume repetitive queries (order status, returns, FAQs)',
      'Providing 24/7 support without overnight staffing',
      'Reducing average handle time for human agents',
      'Supporting multiple languages at scale',
      'Automating tier-1 support for SaaS products',
    ],
    howToEvaluate: [
      'Does it integrate with your existing helpdesk?',
      'What percentage of tickets can it resolve without human intervention?',
      'How does it handle escalations?',
      'Does it support the channels your customers use?',
      'How is it trained on your knowledge base?',
      'What languages does it support?',
    ],
    faqs: [
      { q: 'What is the difference between an AI support agent and a chatbot?', a: 'Traditional chatbots follow scripted decision trees — they can only respond to queries they were explicitly programmed for. AI support agents use large language models to understand natural language, access live data, and resolve issues they were not specifically trained on.' },
      { q: 'What is a typical resolution rate for AI customer support agents?', a: 'Resolution rates vary by use case. Simple, high-volume queries (order tracking, password resets, FAQs) can see 60-80% autonomous resolution. Complex technical or emotional support queries typically require human escalation.' },
      { q: 'Can AI support agents handle refunds and order changes?', a: 'Yes — the more capable AI support agents integrate with your order management system and can execute actions like processing refunds, updating shipping addresses, or cancelling subscriptions, subject to rules you define.' },
    ],
  },
  'what-is-an-ai-research-agent': {
    title: 'What is an AI Research Agent?',
    metaDescription: 'An AI research agent is software that autonomously conducts multi-step research tasks — searching the web, synthesising sources, and producing structured reports.',
    category: 'ai-research-agents',
    categoryLabel: 'AI Research Agents',
    whatItIs: 'An AI research agent is software that autonomously conducts multi-step research tasks — searching the web, retrieving academic literature, synthesising information across sources, and producing structured reports or answers. Unlike a standard AI assistant that answers from training data, a research agent actively searches for current information and cites its sources.',
    howItWorks: 'Given a research question or topic, an AI research agent decomposes the task into sub-queries, searches multiple sources (web, academic databases, internal documents), evaluates source quality, extracts relevant information, and synthesises findings into a coherent output. Advanced agents iterate — refining their search strategy based on what they find.',
    keyCapabilities: [
      'Multi-step web and academic search',
      'Source retrieval and citation',
      'Synthesis across multiple documents',
      'Structured report generation',
      'Literature review and systematic review',
      'Fact-checking and verification',
      'Internal document search and analysis',
    ],
    useCases: [
      'Market research and competitive analysis',
      'Academic literature reviews',
      'Due diligence for investments or partnerships',
      'Policy research and regulatory monitoring',
      'Technical documentation synthesis',
      'News monitoring and summarisation',
    ],
    howToEvaluate: [
      'Does it cite sources with links?',
      'Can it search academic databases (PubMed, arXiv)?',
      'How does it handle conflicting information across sources?',
      'Does it support internal document search?',
      'What is the output format (report, bullets, structured data)?',
      'How current is its data — does it search in real time?',
    ],
    faqs: [
      { q: 'What is the difference between an AI research agent and ChatGPT?', a: 'Standard AI assistants like ChatGPT generate answers from their training data, which has a knowledge cutoff date. AI research agents actively search the web and databases for current information, cite their sources, and can handle multi-step research tasks that require synthesising many documents.' },
      { q: 'Can AI research agents access academic journals?', a: 'Some AI research agents integrate with academic databases like PubMed, Semantic Scholar, or arXiv for open-access literature. Access to paywalled journals typically requires institutional credentials or specific integrations.' },
      { q: 'How accurate are AI research agents?', a: 'Accuracy depends on source quality and the agent design. The best research agents cite every claim with a source link, making it easy to verify outputs. Always review citations for high-stakes research tasks.' },
    ],
  },
  'what-is-an-ai-marketing-agent': {
    title: 'What is an AI Marketing Agent?',
    metaDescription: 'An AI marketing agent is software that autonomously executes marketing tasks — content creation, SEO optimisation, campaign management, and audience personalisation.',
    category: 'ai-marketing-agents',
    categoryLabel: 'AI Marketing Agents',
    whatItIs: 'An AI marketing agent is software that autonomously executes marketing tasks — generating content, optimising for search, managing paid campaigns, personalising messaging, and analysing performance — without requiring manual execution at each step. These agents range from focused content generators to fully autonomous campaign managers.',
    howItWorks: 'AI marketing agents connect to your marketing stack (CMS, ad platforms, email tools, analytics). Depending on the agent type, they may generate and publish content on a schedule, adjust ad bids in real time based on performance data, segment audiences and personalise email sequences, or monitor brand mentions across the web.',
    keyCapabilities: [
      'Content creation and copywriting',
      'SEO optimisation and keyword research',
      'Paid media management and bid optimisation',
      'Email personalisation and campaign automation',
      'Social media scheduling and engagement',
      'Brand voice consistency across channels',
      'Performance analytics and reporting',
    ],
    useCases: [
      'Scaling content production without growing headcount',
      'Automating SEO content for programmatic pages',
      'Managing Google and Meta ad campaigns autonomously',
      'Personalising email sequences based on behaviour',
      'Monitoring competitors and market trends',
    ],
    howToEvaluate: [
      'Does it integrate with your existing marketing stack?',
      'Does it maintain brand voice or require heavy editing?',
      'Can it optimise campaigns based on real performance data?',
      'What channels does it support?',
      'How does it handle compliance (GDPR, ad policies)?',
      'Does it generate original content or remix templates?',
    ],
    faqs: [
      { q: 'Can AI marketing agents replace a marketing team?', a: 'AI marketing agents excel at execution tasks — writing drafts, scheduling posts, adjusting bids, generating reports. They work best as force multipliers for human marketers who set strategy, review outputs, and handle creative direction. Most teams use them to scale output, not eliminate headcount.' },
      { q: 'Will AI-generated content hurt my SEO?', a: 'Google evaluates content quality, not authorship. AI-generated content that is accurate, well-structured, and genuinely useful for readers performs well in search. Thin, generic, or duplicate AI content performs poorly — just as human-written thin content does.' },
      { q: 'What is the difference between an AI marketing agent and a tool like Jasper?', a: 'Tools like Jasper are AI writing assistants — they help humans write content faster. AI marketing agents are autonomous — they can plan, create, publish, and optimise content or campaigns with minimal human input at each step.' },
    ],
  },
  'what-is-an-ai-coding-agent': {
    title: 'What is an AI Coding Agent?',
    metaDescription: 'An AI coding agent is software that autonomously writes, reviews, refactors, and debugs code — from single-function autocomplete to multi-file agentic engineering tasks.',
    category: 'ai-coding-agents',
    categoryLabel: 'AI Coding Agents',
    whatItIs: 'An AI coding agent is software that autonomously writes, reviews, refactors, and debugs code. The category spans a wide spectrum — from inline autocomplete tools that suggest the next line of code, to fully agentic systems that can receive a feature specification and implement it across multiple files, run tests, and submit a pull request.',
    howItWorks: 'AI coding agents integrate with your development environment (IDE, terminal, or git workflow). When given a task — fix this bug, implement this feature, refactor this module — the agent reads the relevant codebase context, generates a plan, writes the code changes, runs tests if available, and either applies the changes directly or presents them for review.',
    keyCapabilities: [
      'Code generation from natural language',
      'Inline autocomplete and tab completion',
      'Multi-file editing and refactoring',
      'Bug detection and automated fixing',
      'Test generation',
      'Code review and explanation',
      'Terminal and CLI integration',
      'Git-native workflows (PRs, commits)',
    ],
    useCases: [
      'Accelerating feature development for solo developers',
      'Automating boilerplate and repetitive code patterns',
      'Conducting codebase-wide refactors',
      'Generating test suites for existing code',
      'Onboarding to unfamiliar codebases faster',
      'Automating code review for pull requests',
    ],
    howToEvaluate: [
      'Does it integrate with your IDE or workflow?',
      'How much codebase context can it hold at once?',
      'Does it support your programming language?',
      'Can it run and test code, or only generate it?',
      'How does it handle multi-file tasks?',
      'Is it cloud-based or can it run locally (for privacy)?',
    ],
    faqs: [
      { q: 'What is the difference between GitHub Copilot and an agentic coding tool like Cursor?', a: 'GitHub Copilot is primarily an autocomplete tool — it suggests code as you type within your editor. Agentic coding tools like Cursor, Devin, or Claude Code can handle larger tasks autonomously: understanding a feature request, navigating the codebase, making changes across multiple files, and running tests.' },
      { q: 'Are AI coding agents safe to use with proprietary code?', a: 'It depends on the tool. Cloud-based coding agents send code to external servers, which raises IP and privacy considerations. Some tools offer on-premise deployment or local models. Always review the data handling policy before using an AI coding agent with proprietary codebases.' },
      { q: 'Can an AI coding agent work on any programming language?', a: 'Most AI coding agents support the major languages well — Python, TypeScript, JavaScript, Go, Rust, Java. Performance on less common languages varies. Check the agent\'s documentation for specific language support.' },
    ],
  },
  'what-is-an-ai-sdr': {
    title: 'What is an AI SDR?',
    metaDescription: 'An AI SDR (Sales Development Representative) is software that autonomously handles outbound prospecting, personalised outreach, follow-up sequences, and lead qualification — replacing or augmenting human SDR workflows.',
    category: 'ai-sales-agents',
    categoryLabel: 'AI Sales Agents',
    whatItIs: 'An AI SDR (Sales Development Representative) is software that autonomously performs the outbound functions traditionally handled by human SDRs — prospecting target accounts, writing and sending personalised emails and LinkedIn messages, following up with non-responders, qualifying leads based on replies, and booking meetings for account executives. Unlike human SDRs who are limited by bandwidth, an AI SDR operates 24/7 at scale without burnout.',
    howItWorks: 'AI SDRs connect to your CRM, intent data providers, and communication channels. They identify prospects matching your ideal customer profile, research each account using public signals (job changes, funding rounds, tech stack), generate personalised outreach, send messages across email and LinkedIn, monitor replies, handle basic objections, and route warm leads to human reps for closing. More advanced systems learn from reply data to improve messaging over time.',
    keyCapabilities: [
      'Automated prospect identification and list building',
      'Personalised email and LinkedIn outreach at scale',
      'Multi-step follow-up sequencing',
      'Reply detection and basic objection handling',
      'Lead qualification and scoring',
      'Meeting booking and calendar integration',
      'CRM sync and pipeline updates',
      'A/B testing of messaging and subject lines',
    ],
    useCases: [
      'Replacing or augmenting a human SDR team to reduce headcount costs',
      'Scaling outbound without proportional hiring',
      'Running account-based outreach campaigns targeting specific verticals',
      'Re-engaging cold or dormant leads in the CRM',
      'Testing new markets or personas without dedicated sales resources',
      'Enabling founders and small teams to run outbound without a sales hire',
    ],
    howToEvaluate: [
      'Does it personalise outreach beyond first name and company name?',
      'What data sources does it use for prospect research?',
      'How does it handle replies and route warm leads?',
      'Does it integrate with your CRM and existing tech stack?',
      'What are the email deliverability and sending limits?',
      'Is pricing per seat, per email sent, or per meeting booked?',
      'How long does onboarding and setup take?',
    ],
    faqs: [
      { q: 'What is the difference between an AI SDR and a sales automation tool?', a: 'Traditional sales automation tools (like email sequencers) execute predefined workflows that humans set up and trigger. An AI SDR is autonomous — it identifies its own prospects, writes personalised messages based on research, adapts its approach based on replies, and makes decisions without human input at each step.' },
      { q: 'Can an AI SDR fully replace a human SDR?', a: 'For high-volume, top-of-funnel outbound, AI SDRs can handle the workflow end-to-end. Most teams use them to replace early-stage prospecting and outreach while keeping human reps focused on qualified conversations and closing. Enterprise deals with complex buying committees still typically benefit from human involvement earlier in the process.' },
      { q: 'What is a realistic meeting booking rate for an AI SDR?', a: 'Rates vary significantly based on target audience, messaging quality, and product-market fit. Top-performing AI SDR deployments report 2-5% reply rates and 0.5-2% meeting booking rates from cold outreach — comparable to strong human SDR performance. Poor setup, generic messaging, or misaligned targeting can result in much lower rates.' },
      { q: 'Which AI SDRs integrate with HubSpot and Salesforce?', a: 'Most leading AI SDRs integrate with both HubSpot and Salesforce. Tools like 11x Alice, Artisan Ava, Clay, Instantly.ai, and Regie.ai all offer CRM integrations. Check the AI Agent Index integration pages for a full list of agents by platform.' },
    ],
  },
}

export async function generateStaticParams() {
  return Object.keys(DEFINITIONS).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const def = DEFINITIONS[params.slug]
  if (!def) return {}
  const url = 'https://theaiagentindex.com/definitions/' + params.slug
  return {
    title: def.title + ' — AI Agent Index',
    description: def.metaDescription,
    openGraph: {
      title: def.title,
      description: def.metaDescription,
      url,
      type: 'website',
      siteName: 'The AI Agent Index',
    },
    twitter: { card: 'summary', title: def.title, description: def.metaDescription },
    alternates: { canonical: url },
  }
}

export default function DefinitionPage({ params }: Props) {
  const def = DEFINITIONS[params.slug]
  if (!def) notFound()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://theaiagentindex.com'

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: def.title,
    description: def.metaDescription,
    url: siteUrl + '/definitions/' + params.slug,
    publisher: { '@type': 'Organization', name: 'The AI Agent Index', url: siteUrl },
    dateModified: new Date().toISOString().split('T')[0],
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: def.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Definitions', item: siteUrl + '/definitions' },
      { '@type': 'ListItem', position: 3, name: def.title, item: siteUrl + '/definitions/' + params.slug },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6B7280', marginBottom: '2rem' }}>
          <Link href="/" style={{ color: '#6B7280', textDecoration: 'none' }}>Home</Link>
          <span style={{ color: '#D1D5DB' }}>/</span>
          <Link href="/definitions" style={{ color: '#6B7280', textDecoration: 'none' }}>Definitions</Link>
          <span style={{ color: '#D1D5DB' }}>/</span>
          <span style={{ color: '#111827' }}>{def.title}</span>
        </nav>

        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', marginBottom: '1rem', lineHeight: 1.2 }}>
          {def.title}
        </h1>
        <p style={{ fontSize: '1.125rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '2.5rem', borderBottom: '1px solid #E5E7EB', paddingBottom: '2.5rem' }}>
          {def.metaDescription}
        </p>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }}>What it is</h2>
          <p style={{ color: '#374151', lineHeight: 1.8, fontSize: '1rem' }}>{def.whatItIs}</p>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }}>How it works</h2>
          <p style={{ color: '#374151', lineHeight: 1.8, fontSize: '1rem' }}>{def.howItWorks}</p>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }}>Key capabilities</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {def.keyCapabilities.map((cap) => (
              <li key={cap} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.9375rem', color: '#374151', lineHeight: 1.6 }}>
                <span style={{ color: '#2563EB', flexShrink: 0, fontWeight: 700, marginTop: '1px' }}>✓</span>
                <span>{cap}</span>
              </li>
            ))}
          </ul>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }}>Common use cases</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {def.useCases.map((uc) => (
              <li key={uc} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.9375rem', color: '#374151', lineHeight: 1.6 }}>
                <span style={{ color: '#6B7280', flexShrink: 0 }}>→</span>
                <span>{uc}</span>
              </li>
            ))}
          </ul>
        </section>

        <section style={{ marginBottom: '2.5rem', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }}>How to evaluate one</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {def.howToEvaluate.map((item) => (
              <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.9375rem', color: '#374151', lineHeight: 1.6 }}>
                <span style={{ color: '#D97706', flexShrink: 0, fontWeight: 700 }}>?</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section style={{ marginBottom: '3rem', borderTop: '1px solid #E5E7EB', paddingTop: '2.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '1.5rem' }}>Frequently asked questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {def.faqs.map((faq) => (
              <div key={faq.q}>
                <h3 style={{ fontWeight: 600, color: '#111827', marginBottom: '0.5rem', fontSize: '1rem' }}>{faq.q}</h3>
                <p style={{ color: '#4B5563', fontSize: '0.9375rem', lineHeight: 1.7 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '0.75rem', padding: '1.5rem', textAlign: 'center' }}>
          <p style={{ fontWeight: 600, color: '#1D4ED8', marginBottom: '0.5rem', fontSize: '1rem' }}>
            Browse {def.categoryLabel}
          </p>
          <p style={{ color: '#3B82F6', fontSize: '0.9375rem', marginBottom: '1rem' }}>
            Compare every indexed {def.categoryLabel.toLowerCase()} — pricing, capabilities, integrations, and ratings.
          </p>
          <Link href={'/' + def.category}
            style={{ display: 'inline-block', backgroundColor: '#2563EB', color: 'white', padding: '0.625rem 1.5rem', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: 600, fontSize: '0.9375rem' }}>
            View all {def.categoryLabel} →
          </Link>
        </div>
      </div>
    </>
  )
}