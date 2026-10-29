import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import type { Metadata } from 'next'
import GuideCitations from '@/components/GuideCitations'
import NewsletterSignup from '@/components/NewsletterSignup'
import { getGuideMeta, isoDate, updatedLabel } from '@/lib/guideMeta'
import GuideAgentList from '@/components/GuideAgentList'
import { getGuideGroups, type GuideGroup } from '@/lib/guideAgents'
import { buildRefMap, resolveTemplates, type RefMap } from '@/lib/templates'

// Agent names in this guide's prose and FAQ come from the database, not from this file.
// GUIDE_SLUGS lists every agent the prose names. A name that is renamed in the database
// updates here automatically. A slug that does not exist renders its raw template, loudly.
const GUIDE_SLUGS = ['churnzero', 'custify', 'everafter', 'gainsight', 'planhat', 'staircase-ai', 'totango', 'vitally']

// The agents this guide lists, in this order, under the guide's two types.
// Chosen by hand (Heather, 2026-10-29) - never by tag. Order is editorial, not a ranking.
const GUIDE_GROUPS: GuideGroup[] = [
  {
    heading: 'Full customer success platforms',
    intro: 'Platforms that run onboarding as one part of the whole customer lifecycle, alongside health scoring, playbooks and account management.',
    slugs: ['gainsight', 'planhat', 'totango'],
  },
  {
    heading: 'Self-serve onboarding',
    intro: 'A customer-facing portal builder plus customer success platforms that automate lifecycle steps, for teams that want onboarding to run with less manual coordination.',
    slugs: ['vitally', 'custify', 'everafter'],
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
  title: 'Self-Serve vs Full-Platform Onboarding: 6 AI Agents Compared (2026)',
  description: 'Self-serve onboarding hubs vs full customer success platforms: EverAfter, Vitally, Custify, Gainsight, Planhat and Totango compared.',
  openGraph: {
    title: 'Self-Serve vs Full-Platform Onboarding: 6 AI Agents Compared (2026)',
    description: 'Self-serve onboarding hubs vs full customer success platforms: EverAfter, Vitally, Custify, Gainsight, Planhat and Totango compared.',
    url: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-customer-onboarding',
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary',
    title: 'Self-Serve vs Full-Platform Onboarding: 6 AI Agents Compared (2026)',
    description: 'Self-serve onboarding hubs vs full customer success platforms: EverAfter, Vitally, Custify, Gainsight, Planhat and Totango compared.',
  },
  alternates: { canonical: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-customer-onboarding' },
}

const faqItems = [
  {
    q: 'What is the best AI agent for customer onboarding?',
    a: 'It depends on whether you want a dedicated customer-facing onboarding experience or onboarding inside a broader customer success platform. {{everafter.name}} builds personalized onboarding and success portals that customers use directly, with AI agents that update hubs from CRM and product data. {{vitally.name}} and {{gainsight.name}} suit teams that want onboarding run from the same customer success platform that handles playbooks and the rest of the customer lifecycle.',
  },
  {
    q: 'How do AI onboarding platforms reduce time-to-value?',
    a: 'AI onboarding platforms automate the structure, pacing, and content delivery of the early customer journey. They fire automated emails, assign tasks, and trigger alerts based on milestone completion or time elapsed, removing the manual coordination that slows down traditional onboarding. Customers can reach their first meaningful outcome sooner because the process keeps moving without CS managers manually chasing status updates.',
  },
  {
    q: 'What is the difference between dedicated onboarding tools and full CS platforms?',
    a: 'Customer-facing hub tools like {{everafter.name}} focus on the experience the customer sees, with personalized onboarding and success portals. Full CS platforms like {{vitally.name}}, {{gainsight.name}}, and {{totango.name}} include onboarding as one part of a platform that also covers health scoring, playbooks, and the rest of the customer lifecycle. Teams that prioritize the customer-facing experience lean toward hub tools. Teams that want a single platform for the entire customer lifecycle lean toward full CS platforms.',
  },
  {
    q: 'What should I look for when evaluating AI customer onboarding platforms?',
    a: 'Key criteria are customer-facing portal quality, milestone and activation event tracking tied to your actual product, automated task and communication workflows, CRM integration for clean sales-to-CS handoffs, time-to-value measurement as a first-class metric, and scalability across concurrent onboarding cohorts. Platforms that cannot connect milestone completion to real product activation events produce metrics that do not reflect actual customer outcomes.',
  },
  {
    q: 'Which AI onboarding platform is best for small CS teams?',
    a: 'Small teams should weigh setup effort and the number of tools they will have to run. {{custify.name}} combines health scoring, churn prediction and lifecycle automation in one customer success platform, and {{vitally.name}} pairs lifecycle playbooks with an AI Copilot. Ask each vendor how long a typical implementation takes and whether it needs dedicated CS ops support before you commit.',
  },
  {
    q: 'How do AI onboarding platforms integrate with Salesforce and HubSpot?',
    a: 'Good onboarding platforms pull account data, deal context, and stakeholder information directly from Salesforce or HubSpot at the point of the sales-to-CS handoff. This gives CS managers the context they need to start onboarding immediately rather than re-gathering information the sales team already collected. Poor handoffs from sales to CS are a common cause of slow onboarding and early churn, so check which CRM objects and fields each platform actually syncs.',
  },
]

export default async function CustomerOnboardingGuidePage() {
  const meta = await getGuideMeta('best-ai-agents-for-customer-onboarding')
  const published = isoDate(meta?.published_at)
  const audited = isoDate(meta?.last_audited_at)
  const updated = updatedLabel(meta?.last_audited_at)

  const supabase = createClient()
  const groups = await getGuideGroups(GUIDE_GROUPS)
  const listed = groups.flatMap((g) => g.agents)

  const refs = await buildRefMap(supabase, GUIDE_SLUGS)
  const t = (text: string) => resolveTemplates(text, refs)

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Best AI Agents for Customer Onboarding 2026',
    description: 'Self-serve onboarding hubs vs full customer success platforms: EverAfter, Vitally, Custify, Gainsight, Planhat and Totango compared.',
    url: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-customer-onboarding',
    ...(published ? { datePublished: published } : {}),
    ...(audited ? { dateModified: audited } : {}),
    author: { '@type': 'Organization', name: 'The AI Agent Index', url: 'https://theaiagentindex.com' },
    publisher: { '@type': 'Organization', name: 'The AI Agent Index', url: 'https://theaiagentindex.com' },
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
    name: 'Best AI Agents for Customer Onboarding 2026',
    numberOfItems: listed.length,
    itemListElement: listed.map((agent, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'SoftwareApplication',
        name: agent.name,
        description: agent.short_description,
        url: `https://theaiagentindex.com/agents/${agent.slug}`,
      },
    })),
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />

      <div style={{ marginBottom: '0.75rem' }}>
        <Link href="/" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none' }}>Home</Link>
        <span style={{ color: '#D1D5DB', margin: '0 0.5rem' }}>/</span>
        <Link href="/resources/guides" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none' }}>Guides</Link>
        <span style={{ color: '#D1D5DB', margin: '0 0.5rem' }}>/</span>
        <span style={{ fontSize: '0.8125rem', color: '#111827' }}>Best AI agents for customer onboarding</span>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' as const }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Guide</span>
        <span style={{ fontSize: '0.75rem', color: '#6B7280', padding: '0.25rem 0.75rem', backgroundColor: '#F3F4F6', borderRadius: '9999px' }}>{updated}</span>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '0.25rem 0.75rem', borderRadius: '9999px', border: '1px solid #BFDBFE' }}>Independently Reviewed</span>
      </div>

      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
        Best AI agents for customer onboarding (2026)
      </h1>

      <p style={{ fontSize: '1.0625rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '0.75rem', maxWidth: '680px' }}>
        The early weeks of a customer relationship shape whether an account expands or churns. Customers who reach a first meaningful outcome quickly have a clear reason to stay, while those who struggle through a slow or poorly structured onboarding form an impression that is hard to reverse, however good the product is. AI onboarding platforms automate the structure, pacing, and content delivery of the early customer journey, so new accounts reach value without a CS manager manually coordinating every step. This guide covers {listed.length} platforms, grouped into full customer success platforms and self-serve onboarding tools.
      </p>
      <p style={{ fontSize: '0.9375rem', color: '#6B7280', lineHeight: 1.7, marginBottom: '1rem', maxWidth: '680px' }}>
        Customer onboarding platforms sit at the intersection of project management, customer communication, and lifecycle automation. Good tools give new accounts a structured path through setup, training, and early adoption milestones while keeping CS managers informed of progress without chasing status updates manually. <A s="everafter" r={refs} /> focuses on the customer-facing side: it builds personalized onboarding and success portals, with AI agents that update hubs from CRM and product data. <A s="vitally" r={refs} /> and <A s="custify" r={refs} /> automate onboarding inside customer success platforms that also cover the rest of the lifecycle, and <A s="gainsight" r={refs} />, <A s="planhat" r={refs} /> and <A s="totango" r={refs} /> run onboarding inside broader customer platforms.
      </p>

      <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '2rem', maxWidth: '680px' }}>
        <p style={{ fontSize: '0.875rem', color: '#0369A1', lineHeight: 1.6, margin: 0 }}>
          <strong>Managing churn beyond onboarding?</strong> See our companion guide: <Link href="/resources/guides/best-ai-agents-for-churn-reduction" style={{ color: '#2563EB' }}>Best AI Agents for Churn Reduction (2026)</Link>, covering health scoring, predictive forecasting, and automated intervention across the full customer lifecycle.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' as const, marginBottom: '2.5rem' }}>
        <Link href="/integrations/salesforce" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', backgroundColor: '#F9FAFB', padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>Salesforce integrations &#x2192;</Link>
        <Link href="/integrations/hubspot" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', backgroundColor: '#F9FAFB', padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>HubSpot integrations &#x2192;</Link>
        <Link href="/integrations/slack" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', backgroundColor: '#F9FAFB', padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>Slack integrations &#x2192;</Link>
        <Link href="/integrations/zoom" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', backgroundColor: '#F9FAFB', padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>Zoom integrations &#x2192;</Link>
        <Link href="/integrations/notion" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', backgroundColor: '#F9FAFB', padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>Notion integrations &#x2192;</Link>
      </div>

      <GuideAgentList groups={GUIDE_GROUPS} />

      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2.5rem', marginBottom: '3rem', maxWidth: '680px' }}>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#111827', marginBottom: '1rem', letterSpacing: '-0.01em' }}>
          How to evaluate AI customer onboarding platforms
        </h2>
        <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1rem' }}>
          The core distinction in this category is between tools built around the customer-facing onboarding experience and platforms that include onboarding as part of a broader CS feature set. <A s="everafter" r={refs} /> sits on the customer-facing side: it builds personalized onboarding and success portals that new accounts use directly, and its AI agents update those hubs from CRM and product data. The CS team sets the structure once and the hub carries it to each new account. <A s="vitally" r={refs} /> embeds onboarding inside a customer success platform with lifecycle playbooks and an AI Copilot, which suits teams that want a single platform rather than a separate onboarding tool alongside their CS platform.
        </p>
        <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1rem' }}>
          Teams evaluating onboarding platforms should look carefully at how each tool defines time-to-value and whether it can track completion of the specific milestones that matter for their product. Generic onboarding checklist tools that cannot be configured to match your product&#39;s actual activation events produce completion metrics that do not correlate with real customer outcomes. <A s="custify" r={refs} /> combines AI agents, health scoring, churn prediction and lifecycle automation in one platform. <A s="planhat" r={refs} /> combines CRM, customer success and professional services, with its Pi AI agent. <A s="gainsight" r={refs} /> and <A s="totango" r={refs} /> handle onboarding inside enterprise customer success platforms, which typically means more configuration options and a heavier implementation.
        </p>

        <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', marginTop: '1.75rem' }}>
          Recommended platform by use case
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.75rem', marginBottom: '1.5rem' }}>
          {[
            {
              useCase: 'Customer-facing self-serve onboarding hubs',
              jsx: <><A s="everafter" r={refs} /> for building personalized customer portals that new accounts use to work through onboarding, with AI agents that keep each hub updated from CRM and product data. Suits teams that want to cut onboarding status calls and give customers a clear path to value without adding CS headcount.</>,
            },
            {
              useCase: 'Onboarding inside a full CS platform',
              jsx: <><A s="vitally" r={refs} /> for B2B SaaS teams that want onboarding automation in the same customer success platform that runs lifecycle playbooks, with an AI Copilot and a hosted MCP server. Avoids the overhead of maintaining separate tools for onboarding and ongoing CS management.</>,
            },
            {
              useCase: 'Onboarding alongside CRM and professional services',
              jsx: <><A s="planhat" r={refs} /> for teams that want customer success, CRM and professional services in one B2B customer platform, with its Pi AI agent and an MCP server. Useful when onboarding is delivered as a services project as well as a set of in-product milestones.</>,
            },
            {
              useCase: 'Small CS teams needing onboarding plus health scoring',
              jsx: <><A s="custify" r={refs} /> for SaaS companies that want onboarding workflows, health scoring and churn prediction in one platform, with AI agents and lifecycle automation. Ask about implementation time and the pricing model up front.</>,
            },
            {
              useCase: 'Enterprise onboarding at scale',
              jsx: <><A s="gainsight" r={refs} /> and <A s="totango" r={refs} /> for larger CS organizations that want onboarding inside an enterprise customer success platform: the first adds health scoring, playbooks and renewal forecasting, and the second adds journey management and predictive revenue intelligence. Expect more configuration and a heavier implementation than lighter tools.</>,
            },
          ].map((item) => (
            <div key={item.useCase} style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.625rem', padding: '1rem' }}>
              <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#111827', marginBottom: '0.375rem' }}>{item.useCase}</p>
              <p style={{ fontSize: '0.8125rem', color: '#6B7280', lineHeight: 1.6, margin: 0 }}>{item.jsx}</p>
            </div>
          ))}
        </div>

        <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', marginTop: '1.75rem' }}>
          Key capabilities to look for
        </h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column' as const, gap: '0.625rem', marginBottom: '1.5rem' }}>
          {[
            {
              term: 'Customer-facing portal quality',
              def: (<>The experience your customers see during onboarding reflects directly on your product. <A s="everafter" r={refs} /> is built around customer-facing onboarding and success portals. Platforms that rely on internal CS manager dashboards without a dedicated customer view push onboarding communication back into email and calls, which is exactly the overhead these tools are supposed to eliminate.</>),
            },
            {
              term: 'Milestone and activation event tracking',
              def: (<>The ability to define your own activation milestones and track completion against them is the difference between a generic checklist tool and a genuine onboarding platform. Ask each vendor, including <A s="vitally" r={refs} /> and <A s="gainsight" r={refs} />, to show milestones tied to your own product usage events. Generic task lists that do not connect to actual product activation data produce completion metrics that do not reflect real customer outcomes.</>),
            },
            {
              term: 'Automated task and communication workflows',
              def: (<>Onboarding platforms that fire automated emails, assign tasks, and trigger alerts based on time elapsed or milestone completion reduce the manual coordination CS managers otherwise handle. <A s="gainsight" r={refs} /> runs playbooks, <A s="custify" r={refs} /> offers lifecycle automation, and <A s="vitally" r={refs} /> offers lifecycle playbooks. Compare how much configuration each needs before the first automated journey goes live.</>),
            },
            {
              term: 'CRM integration and handoff from sales',
              def: (<>Poor handoffs from sales to CS are a common cause of slow onboarding. Platforms that pull account data, deal context, and stakeholder information directly from <Link href="/integrations/salesforce" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Salesforce</Link> or <Link href="/integrations/hubspot" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>HubSpot</Link> at the point of handoff give CS managers the context they need to start onboarding immediately rather than re-gathering information the sales team already collected.</>),
            },
            {
              term: 'Time-to-value measurement',
              def: 'The ability to measure how long it takes each account to reach their first meaningful outcome is the primary metric that onboarding platforms should improve. Look for platforms that define time-to-value as a first-class metric rather than a secondary reporting option, and that allow you to set product-specific activation events as the definition of value rather than using a generic completion percentage.',
            },
            {
              term: 'Scalability across concurrent onboarding cohorts',
              def: (<>For teams onboarding dozens of accounts simultaneously, the platform needs to manage each journey independently without CS managers manually tracking status across a spreadsheet. The automation layer is what makes this possible: without automated reminders and milestone triggers, CS managers become the bottleneck as account volume grows.</>),
            },
          ].map((item) => (
            <li key={item.term} style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.6, display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <span style={{ color: '#2563EB', flexShrink: 0, fontWeight: 700, marginTop: '2px' }}>&#x2192;</span>
              <span><strong>{item.term}:</strong> {item.def}</span>
            </li>
          ))}
        </ul>

        <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', marginTop: '1.75rem' }}>
          Also worth exploring
        </h3>
        <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '0.75rem' }}>
          Teams investing in onboarding automation should plan for what comes after the initial onboarding period ends. <A s="churnzero" r={refs} />, a customer success platform with AI agents and a Customer Intelligence Profile, and <A s="staircase-ai" r={refs} />, which analyzes emails, calls, Slack and tickets to surface churn risk and sentiment changes, keep watching account health through the renewal cycle. The accounts most likely to churn are often those where onboarding completed on paper but the customer never reached genuine product adoption, and health scoring is meant to catch that gap. See our guide: <Link href="/resources/guides/best-ai-agents-for-churn-reduction" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Best AI Agents for Churn Reduction (2026)</Link>.
        </p>

        <p style={{ fontSize: '0.875rem', color: '#9CA3AF', lineHeight: 1.6, marginTop: '2rem' }}>
          All agents listed above are editorially reviewed by The AI Agent Index. Scores reflect public signals including G2 ratings, product documentation, and verified user evidence. See our <Link href="/methodology" style={{ color: '#6B7280' }}>editorial methodology</Link>.
        </p>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <NewsletterSignup sourcePage="guide-best-ai-agents-for-customer-onboarding" sourceType="guide" />
      </div>

      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        <Link href="/ai-customer-success-agents" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>All AI customer success agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Browse the full category &#x2192;</p>
        </Link>
        <Link href="/resources/guides/best-ai-customer-success-agents" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Best AI customer success agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Full category guide &#x2192;</p>
        </Link>
        <Link href="/resources/guides/best-ai-agents-for-churn-reduction" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Best AI agents for churn reduction</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>ChurnZero, Gainsight Customer Success, Planhat &#x2192;</p>
        </Link>
        <Link href="/resources/guides/best-ai-agents-for-customer-support" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Best AI customer support agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Browse the category &#x2192;</p>
        </Link>
        <Link href="/integrations/salesforce" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Best for Salesforce</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Filter by integration &#x2192;</p>
        </Link>
        <Link href="/integrations/hubspot" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Best for HubSpot</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Filter by integration &#x2192;</p>
        </Link>
      </div>
      <GuideCitations slug="best-ai-agents-for-customer-onboarding" table="guides" />
    </div>
  )
}