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
const GUIDE_SLUGS = ['akita', 'catalyst-cs', 'churnzero', 'clientsuccess', 'custify', 'decagon', 'everafter', 'gainsight', 'planhat', 'pylon', 'skalin', 'staircase-ai', 'totango', 'vitally']

// The agents this guide lists, in this order, under the guide's two tiers.
// Chosen by hand (Heather, 2026-10-29) - never by tag. Order is editorial, not a ranking.
const GUIDE_GROUPS: GuideGroup[] = [
  {
    heading: 'Enterprise platforms',
    intro: 'Customer success platforms built for large CS organizations with many accounts, complex health scoring and dedicated CS operations staff.',
    slugs: ['gainsight', 'totango', 'catalyst-cs', 'planhat', 'churnzero'],
  },
  {
    heading: 'Mid-market platforms',
    intro: 'Platforms aimed at SaaS companies with smaller CS teams, plus tools that add churn-risk signals on top of an existing stack.',
    slugs: ['vitally', 'custify', 'staircase-ai', 'velaris', 'skalin', 'clientsuccess', 'akita'],
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
  title: 'AI Customer Success Agents: Enterprise vs Mid-Market (2026)',
  description: 'Enterprise and mid-market customer success platforms compared, from Gainsight and ChurnZero to Vitally and Custify. Independently researched.',
  openGraph: {
    title: 'AI Customer Success Agents: Enterprise vs Mid-Market (2026)',
    description: 'Enterprise and mid-market customer success platforms compared, from Gainsight and ChurnZero to Vitally and Custify. Independently researched.',
    url: 'https://theaiagentindex.com/resources/guides/best-ai-customer-success-agents',
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary',
    title: 'AI Customer Success Agents: Enterprise vs Mid-Market (2026)',
    description: 'Enterprise and mid-market customer success platforms compared, from Gainsight and ChurnZero to Vitally and Custify. Independently researched.',
  },
  alternates: { canonical: 'https://theaiagentindex.com/resources/guides/best-ai-customer-success-agents' },
}

export default async function CustomerSuccessAgentsGuidePage() {
  const meta = await getGuideMeta('best-ai-customer-success-agents')
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
    headline: 'AI Customer Success Agents: Enterprise vs Mid-Market (2026)',
    description: 'Enterprise and mid-market customer success platforms compared, from Gainsight and ChurnZero to Vitally and Custify.',
    url: 'https://theaiagentindex.com/resources/guides/best-ai-customer-success-agents',
    ...(published ? { datePublished: published } : {}),
    ...(audited ? { dateModified: audited } : {}),
    author: { '@type': 'Organization', name: 'The AI Agent Index', url: 'https://theaiagentindex.com' },
    publisher: { '@type': 'Organization', name: 'The AI Agent Index', url: 'https://theaiagentindex.com' },
  }

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Best AI Customer Success Agents (2026)',
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

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the best AI agent for customer success?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: t("It depends on the size of your CS team and your customer base. {{gainsight.name}} and {{totango.name}} suit large enterprise CS organizations that need health scoring, playbooks and journey management at scale. {{churnzero.name}} offers 20 AI agents and a Customer Intelligence Profile for teams focused on churn. {{vitally.name}} and {{custify.name}} suit SaaS teams that want health scoring and lifecycle playbooks without an enterprise-scale deployment.")
        }
      },
      {
        '@type': 'Question',
        name: 'What is the difference between enterprise and mid-market customer success platforms?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: t("Enterprise CS platforms like {{gainsight.name}} and {{totango.name}} are built for large CS organizations managing many accounts, with deep customization, complex health scoring models, and executive reporting. They often need dedicated CS ops staff and a longer implementation. Mid-market platforms like {{vitally.name}}, {{custify.name}} and {{skalin.name}} cover the core capabilities, such as health scoring, playbooks and churn-risk flags, for SaaS companies with smaller CS teams that need data-driven CS without enterprise overhead.")
        }
      },
      {
        '@type': 'Question',
        name: 'What data do I need before buying an AI customer success platform?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: t("Most CS platforms depend on product usage data, CRM records, support ticket history, and billing data to build meaningful health scores. Teams without clean product usage data flowing into their CRM will get limited value from any platform until that foundation is in place. {{staircase-ai.name}} takes a different route, analyzing emails, calls, Slack and tickets to surface churn risk, sentiment and stakeholder changes, so it can add signal even where product usage data is thin.")
        }
      },
      {
        '@type': 'Question',
        name: 'How do AI customer success platforms predict churn?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: t("AI customer success platforms combine data from product usage, CRM activity, support tickets, NPS responses, billing events, and in some cases communication signals into health scores. When a score drops below a threshold, the platform can trigger automated playbooks: sequences of tasks, alerts, and communications designed to re-engage the account. {{custify.name}} offers churn prediction, {{skalin.name}} uses self-calibrating health scores with churn-risk flags, and {{churnzero.name}} and {{gainsight.name}} combine health scoring with AI agents. Ask each vendor how often scores refresh, because a score that updates too late leaves no time to intervene.")
        }
      },
      {
        '@type': 'Question',
        name: 'Which AI customer success platform is best for small teams?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: t("{{akita.name}} is built for SaaS startups, with automated health scoring, playbook automation and 100+ native integrations. {{custify.name}} offers health scoring, churn prediction and lifecycle automation for SaaS teams that do not want an enterprise deployment. Check each vendor's current plans and onboarding requirements, since pricing and setup effort matter most when a small team has no dedicated CS ops support.")
        }
      },
      {
        '@type': 'Question',
        name: 'Do AI customer success platforms integrate with Salesforce and HubSpot?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: t("Most do, but integration depth varies. Bidirectional sync, field-level mapping, and the ability to trigger CS workflows from CRM events are the markers of a mature integration. {{catalyst-cs.name}} is built natively on Salesforce. Check each platform's integration list against your CRM before buying. Shallow integrations that only pull contact data add limited value to CS workflows that depend on current account context.")
        }
      },
    ]
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <div style={{ marginBottom: '0.75rem' }}>
        <Link href="/" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none' }}>Home</Link>
        <span style={{ color: '#D1D5DB', margin: '0 0.5rem' }}>/</span>
        <Link href="/resources/guides" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none' }}>Guides</Link>
        <span style={{ color: '#D1D5DB', margin: '0 0.5rem' }}>/</span>
        <span style={{ fontSize: '0.8125rem', color: '#111827' }}>Best AI Agents for Customer Success</span>
      </div>

      {/* Header pills */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' as const }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Independently Reviewed</span>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Guide</span>
        <span style={{ fontSize: '0.75rem', color: '#6B7280', padding: '0.25rem 0.75rem', backgroundColor: '#F3F4F6', borderRadius: '9999px' }}>{updated}</span>
      </div>

      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
        Best AI Agents for Customer Success (2026)
      </h1>

      <p style={{ fontSize: '1.0625rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '0.75rem', maxWidth: '680px' }}>
        Salesforce&apos;s 2022 State of the Connected Customer report found that 88% of customers say the experience a company provides is as important as its products or services. Frederick Reichheld of Bain &amp; Company wrote in 2001 that small increases in customer retention soon translate into big boosts to profits. Customer success platforms exist to act on both: identifying at-risk accounts before they churn, automating the follow-up and intervention workflows that CS teams run manually at scale, and giving every customer a structured path to value. This guide covers {listed.length} AI-powered customer success platforms, grouped into enterprise and mid-market platforms.
      </p>
      <p style={{ fontSize: '0.9375rem', color: '#6B7280', lineHeight: 1.7, marginBottom: '1rem', maxWidth: '680px' }}>
        The platforms in this category range from enterprise customer success platforms like <A s="gainsight" r={refs} /> and <A s="totango" r={refs} /> that manage the post-sale customer lifecycle, to platforms like <A s="vitally" r={refs} /> and <A s="custify" r={refs} /> for SaaS teams that need CS infrastructure without enterprise complexity, to tools like <A s="staircase-ai" r={refs} />, which analyzes emails, calls, Slack and tickets to surface churn risk, sentiment and stakeholder changes. The right fit depends on team size, the complexity of your customer base, and whether you need a full CS platform or a more targeted tool.
      </p>

      <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '2rem', maxWidth: '680px' }}>
        <p style={{ fontSize: '0.875rem', color: '#0369A1', lineHeight: 1.6, margin: 0 }}>
          <strong>Focused on churn specifically?</strong> See our targeted guide: <Link href="/resources/guides/best-ai-agents-for-churn-reduction" style={{ color: '#2563EB' }}>Best AI Agents for Churn Reduction (2026)</Link>, covering platforms for predictive health scoring and automated intervention.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' as const, marginBottom: '2.5rem' }}>
        <Link href="/integrations/salesforce" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', backgroundColor: '#F9FAFB', padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>Salesforce integrations &#x2192;</Link>
        <Link href="/integrations/hubspot" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', backgroundColor: '#F9FAFB', padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>HubSpot integrations &#x2192;</Link>
        <Link href="/integrations/slack" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', backgroundColor: '#F9FAFB', padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>Slack integrations &#x2192;</Link>
        <Link href="/integrations/zoom" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', backgroundColor: '#F9FAFB', padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>Zoom integrations &#x2192;</Link>
        <Link href="/integrations/jira" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', backgroundColor: '#F9FAFB', padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>Jira integrations &#x2192;</Link>
        <Link href="/integrations/zendesk" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', backgroundColor: '#F9FAFB', padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>Zendesk integrations &#x2192;</Link>
      </div>

      <GuideAgentList groups={GUIDE_GROUPS} />

      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2.5rem', marginBottom: '3rem', maxWidth: '680px' }}>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#111827', marginBottom: '1rem', letterSpacing: '-0.01em' }}>
          How to evaluate AI customer success platforms
        </h2>
        <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1rem' }}>
          Customer success platforms sit at the intersection of CRM, data analytics, and workflow automation. The market divides roughly into three tiers. Enterprise CS platforms like <A s="gainsight" r={refs} /> and <A s="totango" r={refs} /> are built for large CS organizations managing many accounts, with deep customization, complex health scoring models, and the reporting that enterprise leadership expects. <A s="planhat" r={refs} /> combines CRM, customer success and professional services in one B2B customer platform. Mid-market platforms like <A s="vitally" r={refs} /> and <A s="custify" r={refs} /> cover the core capabilities with less configuration, targeting SaaS companies with smaller CS teams. Specialist tools like <A s="staircase-ai" r={refs} /> solve a narrower problem: surfacing churn signals and relationship risk from emails, calls, Slack and support tickets. <A s="akita" r={refs} /> is a customer success platform built for SaaS startups, with automated health scoring and playbook automation.
        </p>
        <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1rem' }}>
          The most consequential buying decision in this category is not which platform has the most features but whether you have the data infrastructure to support health scoring. Most CS platforms depend on product usage data, CRM records, support ticket history, and billing data to build meaningful health scores. Platforms like <A s="gainsight" r={refs} /> and <A s="churnzero" r={refs} /> pull this data together, but the quality of the output depends on the quality of the input. Teams that do not yet have clean product usage data flowing into their CRM will get limited value from any platform in this category until that foundation is in place. <A s="everafter" r={refs} /> and <A s="clientsuccess" r={refs} /> are worth evaluating for teams focused on onboarding and early lifecycle management, where the priority is time-to-value rather than churn prediction at scale.
        </p>

        <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', marginTop: '1.75rem' }}>
          Recommended platform by use case
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.75rem', marginBottom: '1.5rem' }}>
          {[
            {
              useCase: 'Enterprise CS at scale',
              jsx: <><A s="gainsight" r={refs} /> for large CS organizations that need health scoring, playbooks and renewal forecasting, plus Agent Studio (in beta) for building AI agents. Suits companies with dedicated CS ops resources who can configure and maintain the platform. <A s="totango" r={refs} /> is an alternative focused on journey management, predictive revenue intelligence and AI-assisted health scoring, and <A s="catalyst-cs" r={refs} />, also from Totango, is built natively on Salesforce.</>
            },
            {
              useCase: 'Churn prediction and at-risk account management',
              jsx: <><A s="churnzero" r={refs} /> for teams that want AI agents, a Customer Intelligence Profile and automated intervention when accounts show risk. See our dedicated guide: <Link href="/resources/guides/best-ai-agents-for-churn-reduction" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Best AI Agents for Churn Reduction (2026)</Link>.</>
            },
            {
              useCase: 'Mid-market SaaS CS teams',
              jsx: <><A s="vitally" r={refs} /> for B2B SaaS companies that want health scoring, an AI Copilot and lifecycle playbooks without an enterprise-scale implementation, with 30+ integrations and a hosted MCP server. <A s="planhat" r={refs} /> is worth evaluating alongside it for teams that want CRM, customer success and professional services in one platform, with its Pi AI agent.</>
            },
            {
              useCase: 'Customer onboarding and time-to-value',
              jsx: <><A s="everafter" r={refs} /> for building customer-facing onboarding hubs that guide new accounts through setup, training, and early adoption without requiring CS manager involvement at every step. See our dedicated guide: <Link href="/resources/guides/best-ai-agents-for-customer-onboarding" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Best AI Agents for Customer Onboarding (2026)</Link>.</>
            },
            {
              useCase: 'Relationship intelligence and communication signals',
              jsx: <><A s="staircase-ai" r={refs} /> for teams that want churn risk signals derived from emails, calls, Slack and tickets rather than product usage metrics alone. Useful as a signal layer on top of an existing CS platform for teams that have gaps in product usage data.</>
            },
            {
              useCase: 'Small CS teams and budget-conscious buyers',
              jsx: <><A s="custify" r={refs} /> for small SaaS CS teams that need health scoring, churn prediction and lifecycle automation without the overhead of an enterprise deployment. <A s="akita" r={refs} /> is built for SaaS startups, with automated health scoring and playbook automation for teams that are beginning to formalize their CS process.</>
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
              term: 'Health scoring methodology',
              def: (<>How the platform builds customer health scores determines how useful they are in practice. Some platforms let you build custom models with weighted inputs across usage, support, NPS, and engagement data; <A s="skalin" r={refs} /> uses self-calibrating health scores. Pre-built models are faster to deploy but can be less precise for your specific customer behavior patterns. Ask each vendor which inputs the score uses and whether you can change the weights.</>)
            },
            {
              term: 'Playbook automation',
              def: (<>Playbooks are the CS equivalent of sales sequences: automated workflows that trigger actions, tasks, and communications when accounts meet defined conditions. <A s="gainsight" r={refs} />, <A s="vitally" r={refs} /> and <A s="akita" r={refs} /> all include playbooks, and <A s="catalyst-cs" r={refs} /> offers autonomous playbook execution. Compare how much configuration each needs for the playbooks you plan to run.</>)
            },
            {
              term: 'CRM integration depth',
              def: (<>Most platforms in this category integrate with <Link href="/integrations/salesforce" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Salesforce</Link> and <Link href="/integrations/hubspot" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>HubSpot</Link>, but integration depth varies. Bidirectional sync, field-level mapping, and the ability to trigger CS workflows from CRM events are the markers of a mature integration. Shallow integrations that only pull contact data add limited value.</>)
            },
            {
              term: 'Customer-facing portals',
              def: (<><A s="everafter" r={refs} /> and <A s="clientsuccess" r={refs} /> both offer customer-facing portals where accounts can track their own progress, access resources, and complete onboarding tasks. This reduces CS manager time spent on routine status updates and gives customers a self-serve path to value.</>)
            },
            {
              term: 'Forecasting and revenue impact reporting',
              def: (<><A s="gainsight" r={refs} /> includes renewal forecasting, and <A s="totango" r={refs} /> offers predictive revenue intelligence. For CS leaders presenting to finance or executive teams, this matters: it connects CS activity to revenue outcomes rather than just health scores and CSAT.</>)
            },
            {
              term: 'Implementation time and CS ops requirements',
              def: (<>Enterprise platforms like <A s="gainsight" r={refs} /> typically need dedicated CS ops resources and a longer implementation. Platforms aimed at smaller teams, such as <A s="vitally" r={refs} />, <A s="custify" r={refs} /> and <A s="akita" r={refs} />, are worth comparing on how much setup they need without specialist help. Ask each vendor for a realistic implementation timeline and factor implementation cost into total cost of ownership when comparing tiers.</>)
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
          Teams evaluating customer success tooling should also consider the adjacent AI Customer Support Agents category, which covers platforms like <A s="pylon" r={refs} /> and <A s="decagon" r={refs} /> that handle the reactive support side of the post-sale relationship. The line between customer success and customer support is blurring as AI takes on more of both, and many post-sale stacks combine a CS platform for proactive lifecycle management with a support platform for reactive ticket resolution. See our guide: <Link href="/resources/guides/best-ai-agents-for-customer-support" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Best AI Agents for Customer Support Teams (2026)</Link>.
        </p>

        <p style={{ fontSize: '0.875rem', color: '#9CA3AF', lineHeight: 1.6, marginTop: '2rem' }}>
          All agents listed above are editorially reviewed by The AI Agent Index. Scores reflect public signals including G2 ratings, product documentation, and verified user evidence. See our <Link href="/methodology" style={{ color: '#6B7280' }}>editorial methodology</Link>.
        </p>
      </div>

      {/* Newsletter */}
      <div style={{ marginBottom: '3rem' }}>
        <NewsletterSignup />
      </div>

      {/* FAQs - rendered from the same data as the FAQPage JSON-LD, so the visible FAQ and the structured data always match (10-30c) */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '1.25rem' }}>Frequently Asked Questions</h2>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '1rem' }}>
          {faqLd.mainEntity.map((item) => (
            <div key={item.name} style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1.25rem 1.5rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.5rem' }}>{item.name}</h3>
              <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.75, margin: 0 }}>{item.acceptedAnswer.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        <Link href="/ai-customer-success-agents" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>All AI Customer Success Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Browse the full category &#x2192;</p>
        </Link>
        <Link href="/resources/guides/best-ai-agents-for-churn-reduction" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Best AI Agents for Churn Reduction</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>{t('{{churnzero.name}}, {{gainsight.name}}, {{planhat.name}}')} &#x2192;</p>
        </Link>
        <Link href="/resources/guides/best-ai-agents-for-customer-onboarding" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Best AI Agents for Onboarding</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>{t('{{everafter.name}}, {{vitally.name}}, {{clientsuccess.name}}')} &#x2192;</p>
        </Link>
        <Link href="/resources/guides/best-ai-agents-for-customer-support" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Best AI Customer Support Agents</p>
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
      <GuideCitations slug="best-ai-customer-success-agents" table="guides" />
    </div>
  )
}