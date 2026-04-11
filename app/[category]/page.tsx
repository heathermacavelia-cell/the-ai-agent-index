export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CATEGORY_SLUGS } from '@/lib/taxonomy'
import type { Metadata } from 'next'
import CategoryPageClient from '@/components/CategoryPageClient'

interface Props {
  params: { category: string }
}

const CATEGORY_META: Record<string, {
  icon: React.ReactNode
  description: string
  longDescription: string
  bgColor: string
  borderColor: string
  metaTitle: string
  metaDescription: string
  intro: string
  whatItDoes: string
  whoItsFor: string
  whatToLookFor: string
}> = {
  'ai-sales-agents': {
    icon: <img src="/icons/icon-sales.png" alt="AI Sales Agents" style={{ width: '2.5rem', height: '2.5rem', objectFit: 'contain' }} />,
    description: 'Lead generation, outbound automation, pipeline intelligence',
    longDescription: 'AI agents that automate prospecting, outbound email, lead enrichment, CRM workflows, and revenue forecasting.',
    bgColor: '#F0FDF4',
    borderColor: '#BBF7D0',
    metaTitle: 'Best AI Sales Agents (2026) — Compare Top Tools',
    metaDescription: 'Compare the best AI sales agents for lead generation, outbound automation, and pipeline management. Structured data on pricing, integrations, and capabilities.',
    intro: 'AI sales agents are purpose-built tools that automate the most time-consuming parts of the sales process — prospecting, outreach, follow-up, and pipeline management. Unlike general-purpose AI assistants, sales agents are trained on sales-specific workflows and integrate directly with CRMs, email platforms, and data enrichment tools.',
    whatItDoes: 'The best AI sales agents handle lead sourcing and enrichment, write and send personalised outbound sequences, follow up autonomously, qualify inbound leads, update CRM records, and surface pipeline intelligence that helps sales teams prioritise the right accounts.',
    whoItsFor: 'AI sales agents are used by SDRs and BDRs to scale outbound volume, by sales managers to improve pipeline visibility, and by founders running lean go-to-market operations who need to generate pipeline without a full sales team.',
    whatToLookFor: 'When evaluating AI sales agents, look for native CRM integrations (HubSpot, Salesforce), email deliverability features, data accuracy for lead enrichment, personalisation quality, and clear pricing. The most effective tools are those that fit into your existing stack rather than requiring a full workflow rebuild.',
  },
  'ai-customer-support-agents': {
    icon: <img src="/icons/icon-support.png" alt="AI Customer Support Agents" style={{ width: '2.5rem', height: '2.5rem', objectFit: 'contain' }} />,
    description: 'Ticket resolution, omnichannel support, autonomous helpdesk',
    longDescription: 'AI agents that autonomously resolve support tickets, triage queries, and provide omnichannel customer service at scale.',
    bgColor: '#FAF5FF',
    borderColor: '#E9D5FF',
    metaTitle: 'Best AI Customer Support Agents (2026) — Compare Top Tools',
    metaDescription: 'Compare the best AI customer support agents for ticket resolution, live chat, and helpdesk automation. Structured data on pricing, integrations, and resolution rates.',
    intro: 'AI customer support agents resolve customer queries autonomously — without routing every ticket to a human agent. The best tools handle the full resolution lifecycle: understanding the query, retrieving relevant information, taking action where possible, and escalating only when genuinely needed.',
    whatItDoes: 'AI support agents triage and categorise incoming tickets, resolve common queries end-to-end, draft responses for human review, manage omnichannel conversations across chat, email, and social, and surface patterns in support volume that help teams improve their knowledge base.',
    whoItsFor: 'AI support agents are used by SaaS companies scaling customer success without growing headcount, ecommerce businesses managing high ticket volumes, and enterprise teams looking to reduce first response time and cost per resolution.',
    whatToLookFor: 'Look for autonomous resolution rate (how many tickets it closes without human involvement), native integration with your helpdesk (Zendesk, Intercom, Freshdesk), multilingual support if you serve global customers, and transparent pricing that scales predictably with ticket volume.',
  },
  'ai-research-agents': {
    icon: <img src="/icons/icon-research.png" alt="AI Research Agents" style={{ width: '2.5rem', height: '2.5rem', objectFit: 'contain' }} />,
    description: 'Deep research, academic literature, web synthesis',
    longDescription: 'AI agents that conduct multi-step web research, search academic literature, synthesise findings, and generate structured reports.',
    bgColor: '#FFFBEB',
    borderColor: '#FDE68A',
    metaTitle: 'Best AI Research Agents (2026) — Compare Top Tools',
    metaDescription: 'Compare the best AI research agents for web research, academic literature review, and information synthesis. Structured data on pricing, capabilities, and integrations.',
    intro: 'AI research agents go beyond simple search — they plan multi-step research tasks, retrieve information from multiple sources, synthesise findings, and produce structured outputs. The best tools can conduct systematic literature reviews, monitor competitor activity, and generate research reports in a fraction of the time traditional research takes.',
    whatItDoes: 'Research agents conduct real-time web searches with citations, search and extract data from academic databases, synthesise findings across multiple sources into coherent summaries, track topics over time, and produce structured reports with source attribution.',
    whoItsFor: 'AI research agents are used by analysts and consultants who need comprehensive market intelligence, academics conducting systematic literature reviews, journalists and content teams tracking fast-moving topics, and business teams needing competitive intelligence at scale.',
    whatToLookFor: 'Look for citation quality and source transparency, access to academic databases if you need peer-reviewed research, the ability to handle multi-step research tasks autonomously, and output format flexibility. The most useful research agents produce structured, verifiable outputs rather than unattributed summaries.',
  },
  'ai-marketing-agents': {
    icon: <img src="/icons/icon-marketing.png" alt="AI Marketing Agents" style={{ width: '2.5rem', height: '2.5rem', objectFit: 'contain' }} />,
    description: 'Content creation, SEO, paid media, campaign automation',
    longDescription: 'AI agents that generate marketing content, optimise SEO, automate paid campaigns, and personalise messaging at scale.',
    bgColor: '#FFF1F2',
    borderColor: '#FECDD3',
    metaTitle: 'Best AI Marketing Agents (2026) — Compare Top Tools',
    metaDescription: 'Compare the best AI marketing agents for content creation, SEO, paid media, and campaign automation. Structured data on pricing, integrations, and capabilities.',
    intro: 'AI marketing agents automate the content and campaign workflows that consume the most marketing team time — writing, optimising, scheduling, and analysing. The best tools go beyond content generation to handle full campaign workflows, from brief to distribution, with minimal human intervention.',
    whatItDoes: 'Marketing agents generate and optimise content for web, email, and social, conduct keyword research and SEO analysis, manage and optimise paid media campaigns, personalise messaging at scale, automate campaign scheduling, and surface performance analytics.',
    whoItsFor: 'AI marketing agents are used by lean marketing teams that need to produce high content volume, agencies managing multiple client campaigns, growth teams focused on SEO and content at scale, and ecommerce businesses running complex paid media operations.',
    whatToLookFor: 'Look for brand voice consistency, integration with your existing marketing stack (CMS, ad platforms, email tools), SEO feature depth if content is a primary use case, and whether the tool handles full campaign workflows or just content generation.',
  },
  'ai-coding-agents': {
    icon: <img src="/icons/icon-coding.png" alt="AI Coding Agents" style={{ width: '2.5rem', height: '2.5rem', objectFit: 'contain' }} />,
    description: 'Code generation, agentic coding, IDE integration',
    longDescription: 'AI agents that write, review, and refactor code — from inline autocomplete to fully autonomous multi-file engineering tasks.',
    bgColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    metaTitle: 'Best AI Coding Agents (2026) — Compare Top Tools',
    metaDescription: 'Compare the best AI coding agents for code generation, agentic development, and IDE integration. Structured data on pricing, supported languages, and capabilities.',
    intro: 'AI coding agents have moved well beyond autocomplete. The best tools today handle multi-file refactoring, write and run tests, debug failures, and execute complex engineering tasks with minimal human direction. They integrate directly into development environments and connect to the same tools developers already use.',
    whatItDoes: 'Coding agents provide inline code suggestions and autocomplete, generate entire functions and components from natural language descriptions, review and explain existing code, refactor across multiple files, run tests and debug failures, and in the most advanced cases operate as fully autonomous software engineers.',
    whoItsFor: 'AI coding agents are used by individual developers looking to ship faster, engineering teams increasing throughput without growing headcount, non-technical founders building with AI assistance, and enterprises standardising code quality across large codebases.',
    whatToLookFor: 'Look for IDE integration with your editor of choice, support for your primary programming languages, context window size for large codebase understanding, agentic capability for multi-step tasks, and pricing that fits your usage pattern — some tools charge per completion, others are flat subscription.',
  },
  'ai-hr-agents': {
    icon: <img src="/icons/icon-hr.png" alt="AI HR Agents" style={{ width: '2.5rem', height: '2.5rem', objectFit: 'contain' }} />,
    description: 'Hiring, onboarding, payroll automation, compliance, workforce management',
    longDescription: 'AI agents that automate recruiting, onboarding, payroll processing, compliance monitoring, and workforce management across global teams.',
    bgColor: '#F0FDFA',
    borderColor: '#99F6E4',
    metaTitle: 'Best AI HR Agents (2026) — Compare Top Tools',
    metaDescription: 'Compare the best AI HR agents for recruiting, onboarding, payroll, and compliance automation. Structured data on pricing, integrations, and capabilities.',
    intro: 'AI HR agents automate the administrative and compliance-heavy workflows that consume HR teams — from sourcing and screening candidates to processing payroll and monitoring regulatory compliance. The best tools reduce time-to-hire, eliminate manual data entry, and ensure compliance across multiple jurisdictions automatically.',
    whatItDoes: 'HR agents source and screen candidates, automate interview scheduling, manage onboarding workflows, process payroll with compliance checks, monitor regulatory changes across jurisdictions, handle benefits administration, and surface workforce analytics that help HR teams make better decisions.',
    whoItsFor: 'AI HR agents are used by HR teams at growing companies that need to scale hiring without scaling admin overhead, global companies managing compliance across multiple countries, and lean people operations teams running HR functions with limited headcount.',
    whatToLookFor: 'Look for compliance coverage in the countries where you hire, payroll accuracy guarantees, integration with your existing HRIS and ATS, and whether the tool handles the specific HR workflow you most need to automate — recruiting, payroll, and compliance tools are quite different in their specialisation.',
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const meta = CATEGORY_META[params.category]
  if (!meta) return {}
  const url = 'https://theaiagentindex.com/' + params.category
  return {
    title: meta.metaTitle,
    description: meta.metaDescription,
    openGraph: {
      title: meta.metaTitle,
      description: meta.metaDescription,
      url,
      type: 'website',
      siteName: 'The AI Agent Index',
    },
    twitter: {
      card: 'summary',
      title: meta.metaTitle,
      description: meta.metaDescription,
    },
    alternates: { canonical: url },
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category } = params
  const validSlugs = Object.values(CATEGORY_SLUGS)
  if (!validSlugs.includes(category)) notFound()

  const displayName = Object.entries(CATEGORY_SLUGS).find(([, slug]) => slug === category)?.[0] ?? category
  const meta = CATEGORY_META[category]

  const supabase = createClient()
  const { data: agents } = await supabase
    .from('agents')
    .select('*')
    .eq('primary_category', category)
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .order('rating_avg', { ascending: false })

  const agentList = agents ?? []

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: meta?.metaTitle,
    description: meta?.metaDescription,
    url: 'https://theaiagentindex.com/' + category,
    numberOfItems: agentList.length,
    itemListElement: agentList.slice(0, 10).map((agent, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: agent.name,
      description: agent.short_description,
      url: 'https://theaiagentindex.com/agents/' + agent.slug,
    })),
  }

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section style={{ backgroundColor: meta?.bgColor ?? '#F9FAFB', borderBottom: '1px solid', borderColor: meta?.borderColor ?? '#E5E7EB', padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6B7280', marginBottom: '1.5rem' }}>
            <Link href="/" style={{ color: '#6B7280', textDecoration: 'none' }}>Home</Link>
            <span style={{ color: '#D1D5DB' }}>/</span>
            <span style={{ color: '#111827' }}>{displayName}</span>
          </nav>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', marginBottom: '2rem' }}>
            <div style={{ width: '3.5rem', height: '3.5rem', backgroundColor: 'white', border: '1px solid', borderColor: meta?.borderColor ?? '#E5E7EB', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
              {meta?.icon ?? '🤖'}
            </div>
            <div>
              <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>{meta?.metaTitle ?? displayName}</h1>
              <p style={{ color: '#6B7280', maxWidth: '680px', lineHeight: 1.6, fontSize: '0.9375rem' }}>{meta?.intro}</p>
            </div>
          </div>

          {/* Content grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
            <div style={{ background: 'white', border: '1px solid', borderColor: meta?.borderColor ?? '#E5E7EB', borderRadius: '0.75rem', padding: '1.25rem' }}>
              <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>What it does</p>
              <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.6 }}>{meta?.whatItDoes}</p>
            </div>
            <div style={{ background: 'white', border: '1px solid', borderColor: meta?.borderColor ?? '#E5E7EB', borderRadius: '0.75rem', padding: '1.25rem' }}>
              <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Who it's for</p>
              <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.6 }}>{meta?.whoItsFor}</p>
            </div>
            <div style={{ background: 'white', border: '1px solid', borderColor: meta?.borderColor ?? '#E5E7EB', borderRadius: '0.75rem', padding: '1.25rem' }}>
              <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>What to look for</p>
              <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.6 }}>{meta?.whatToLookFor}</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>{agentList.length} agents indexed</p>
        </div>
        <CategoryPageClient agents={agentList} categorySlug={category} />
      </section>
    </div>
  )
}