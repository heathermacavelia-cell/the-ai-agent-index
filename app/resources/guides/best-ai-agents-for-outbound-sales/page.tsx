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
const GUIDE_SLUGS = ['11x-alice', 'aisdr', 'apollo-io', 'artisan-ava', 'avina', 'clari-copilot', 'clay', 'cognism-v2', 'common-room', 'gong', 'instantly-ai', 'lavender', 'lemlist', 'orange-slice', 'outreach', 'regie-ai', 'salesloft', 'unify', 'warmly', 'smartlead']

// The agents this guide lists, in this order, under the guide's three types.
// Chosen by hand (Heather, 2026-10-29) - never by tag. Order is editorial, not a ranking.
const GUIDE_GROUPS: GuideGroup[] = [
  {
    heading: 'AI SDRs',
    intro: 'Agents that research prospects, run outreach and book meetings with less step-by-step work from a human rep.',
    slugs: ['artisan-ava', '11x-alice', 'aisdr', 'jason-ai'],
  },
  {
    heading: 'Sequencers',
    intro: 'Sending and sales engagement platforms that run multi-step outreach sequences, from cold email infrastructure to enterprise engagement suites.',
    slugs: ['instantly-ai', 'lemlist', 'smartlead', 'reply-io', 'outreach', 'salesloft', 'regie-ai'],
  },
  {
    heading: 'Data and signals',
    intro: 'Contact data, enrichment and buying-signal tools that decide who to contact and when.',
    slugs: ['apollo-io', 'zoominfo', 'clay', 'cognism-v2', 'unify', 'warmly', 'avina', 'common-room'],
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
  title: 'AI Outbound Sales Agents: SDR vs Sequencer vs Data (2026)',
  description: 'Compare AI SDRs, sequencers and data tools for outbound, from Artisan Ava and 11x Alice to Instantly.ai, Apollo.io and Clay. Independently researched.',
  openGraph: {
    title: 'AI Outbound Sales Agents: SDR vs Sequencer vs Data (2026)',
    description: 'Compare AI SDRs, sequencers and data tools for outbound, from Artisan Ava and 11x Alice to Instantly.ai, Apollo.io and Clay. Independently researched.',
    url: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-outbound-sales',
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary',
    title: 'AI Outbound Sales Agents: SDR vs Sequencer vs Data (2026)',
    description: 'Compare AI SDRs, sequencers and data tools for outbound, from Artisan Ava and 11x Alice to Instantly.ai, Apollo.io and Clay. Independently researched.',
  },
  alternates: { canonical: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-outbound-sales' },
}

export default async function OutboundSalesGuidePage() {
  const meta = await getGuideMeta('best-ai-agents-for-outbound-sales')
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
    headline: 'Best AI Agents for Outbound Sales (2026)',
    description: t('AI SDRs, sequencers and data tools for outbound sales compared, from {{artisan-ava.name}} and {{11x-alice.name}} to {{instantly-ai.name}}, {{apollo-io.name}} and {{clay.name}}.'),
    url: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-outbound-sales',
    ...(published ? { datePublished: published } : {}),
    ...(audited ? { dateModified: audited } : {}),
    author: { '@type': 'Organization', name: 'The AI Agent Index', url: 'https://theaiagentindex.com' },
    publisher: { '@type': 'Organization', name: 'The AI Agent Index', url: 'https://theaiagentindex.com' },
  }

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Best AI Agents for Outbound Sales (2026)',
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
        name: 'What is the best AI agent for outbound sales?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: t('It depends on which part of outbound you need to cover. {{apollo-io.name}} combines a B2B database of 240M+ contacts with AI sequencing and outreach in one product. {{instantly-ai.name}} is built for high-volume cold email, with unlimited sending accounts and automated warmup. {{clay.name}} suits teams that want to build their own enrichment workflows, with waterfall enrichment across 200+ data and AI vendors. {{artisan-ava.name}}, {{11x-alice.name}} and {{aisdr.name}} are AI SDRs for teams that want prospecting and outreach handled with less step-by-step human work.')
        }
      },
      {
        '@type': 'Question',
        name: 'What is an autonomous AI SDR?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: t('An autonomous AI SDR is a software agent that replaces or augments human sales development rep work without requiring human involvement at each step. These tools identify target accounts, enrich contact data, write personalized messages, manage multi-step follow-up sequences, and route warm replies to human reps. {{artisan-ava.name}}, {{11x-alice.name}} and {{aisdr.name}} are examples. They offer more automation but less control over individual message quality than human-assisted sequencing tools.')
        }
      },
      {
        '@type': 'Question',
        name: 'What is the best tool for high-volume cold email?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: t('{{instantly-ai.name}} is built for high-volume cold email infrastructure, with unlimited sending accounts, automated warmup and AI reply classification. It is often paired with {{apollo-io.name}} for prospect data or {{clay.name}} for custom enrichment workflows. {{lemlist.name}} is an alternative for teams that want multichannel sequences across email, LinkedIn, calling, SMS and WhatsApp, with AI personalization for each contact.')
        }
      },
      {
        '@type': 'Question',
        name: 'How important is email deliverability for outbound sales tools?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: t('Deliverability is a core infrastructure factor in outbound email. Tools that manage sending accounts and domain warm-up help protect inbox placement in ways that sending from a single existing mailbox does not. Without proper deliverability infrastructure, even well-written personalized emails can land in spam at scale. {{instantly-ai.name}} builds sending accounts and automated warmup into the product rather than leaving them to the user.')
        }
      },
      {
        '@type': 'Question',
        name: 'What is the difference between email sequencing tools and autonomous AI SDRs?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: t('Sales engagement platforms like {{outreach.name}} and {{salesloft.name}} are built around sequences that your team configures: send email one, wait three days, send a follow-up, repeat. Reps stay in control of the messaging and the logic, and {{outreach.name}} now adds AI agents on top. AI SDRs like {{artisan-ava.name}} and {{11x-alice.name}} take on more of the work themselves, researching prospects, writing personalized messages and running follow-up with less human involvement at each step. Sequencing tools offer more control; AI SDRs aim to cover more outreach with fewer people.')
        }
      },
      {
        '@type': 'Question',
        name: 'How do AI outbound tools integrate with CRM systems?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Look for bidirectional sync with HubSpot and Salesforce so sequence activity, contact status, and reply data are reflected in pipeline records without manual data entry. Check which plans include CRM sync, and whether it writes back activity or only imports contacts. Without CRM sync, outbound activity lives in the sending tool and has to be manually reconciled with pipeline, which creates data quality problems at scale.'
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
        <span style={{ fontSize: '0.8125rem', color: '#111827' }}>Best AI Agents for Outbound Sales</span>
      </div>

      {/* Header pills */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' as const }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Independently Reviewed</span>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Guide</span>
        <span style={{ fontSize: '0.75rem', color: '#6B7280', padding: '0.25rem 0.75rem', backgroundColor: '#F3F4F6', borderRadius: '9999px' }}>{updated}</span>
      </div>

      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
        Best AI Agents for Outbound Sales (2026)
      </h1>

      <p style={{ fontSize: '1.0625rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '0.75rem', maxWidth: '680px' }}>
        Salesforce&apos;s 2026 State of Sales report finds 55% of sales professionals now use AI for prospecting. Sales teams name AI and AI agents their top growth tactic for 2026. This guide covers {listed.length} AI agents for outbound sales, grouped into three types: AI SDRs, sequencers, and data and signal tools.
      </p>
      <p style={{ fontSize: '0.9375rem', color: '#6B7280', lineHeight: 1.7, marginBottom: '1rem', maxWidth: '680px' }}>
        AI outbound agents replace or augment human SDR work. They identify target accounts, enrich contact data, write personalized messages, manage multi-step follow-up sequences, and route warm replies to human reps. A working outbound stack combines prospect data, deliverability infrastructure, and CRM sync in a single workflow.
      </p>

      <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '2rem', maxWidth: '680px' }}>
        <p style={{ fontSize: '0.875rem', color: '#0369A1', lineHeight: 1.6, margin: 0 }}>
          <strong>New to AI SDRs?</strong> Read our structured definition: <Link href="/definitions/what-is-an-ai-sdr" style={{ color: '#2563EB' }}>What is an AI SDR?</Link> covering how they work, key capabilities, and how to evaluate them.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' as const, marginBottom: '2.5rem' }}>
        <Link href="/integrations/hubspot" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', backgroundColor: '#F9FAFB', padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>HubSpot integrations &#x2192;</Link>
        <Link href="/integrations/salesforce" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', backgroundColor: '#F9FAFB', padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>Salesforce integrations &#x2192;</Link>
        <Link href="/integrations/gmail" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', backgroundColor: '#F9FAFB', padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>Gmail integrations &#x2192;</Link>
        <Link href="/integrations/linkedin" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', backgroundColor: '#F9FAFB', padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>LinkedIn integrations &#x2192;</Link>
      </div>

      <GuideAgentList groups={GUIDE_GROUPS} />

      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2.5rem', marginBottom: '3rem', maxWidth: '680px' }}>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#111827', marginBottom: '1rem', letterSpacing: '-0.01em' }}>
          How to evaluate AI agents for outbound sales
        </h2>
        <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1rem' }}>
          The category spans three distinct tool types and getting the categorization right is half the buying decision. AI SDRs like <A s="artisan-ava" r={refs} />, <A s="11x-alice" r={refs} />, and <A s="aisdr" r={refs} /> research prospects, run outreach and book meetings with less step-by-step work from a rep. Sequencers run the outreach itself: <A s="instantly-ai" r={refs} /> provides cold email infrastructure with sending accounts and automated warmup, <A s="lemlist" r={refs} /> runs multichannel sequences across email, LinkedIn, calling, SMS and WhatsApp, and enterprise engagement platforms like <A s="outreach" r={refs} /> and <A s="salesloft" r={refs} /> manage the wider sales engagement workflow. Data and signal tools like <A s="apollo-io" r={refs} /> and <A s="clay" r={refs} /> source and enrich prospect data, while tools like <A s="unify" r={refs} /> and <A s="warmly" r={refs} /> add intent data and website visitor signals.
        </p>
        <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1rem' }}>
          The most important evaluation criteria are deliverability, personalization quality, and CRM sync. Deliverability determines whether your emails reach the inbox at all. Tools that manage sending infrastructure, warm-up schedules, and multiple sending accounts help protect inbox placement in ways that a single existing mailbox does not. Personalization quality shapes reply rates. Generic AI-written emails have trained buyers to ignore them, and openers built from real enrichment data tend to read as more relevant than template-based ones; track your own baseline to see what works. Email coaching tools like <A s="lavender" r={refs} /> complement your sending stack by scoring each message in real time before it sends.
        </p>

        <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', marginTop: '1.75rem' }}>
          Recommended stack by use case
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.75rem', marginBottom: '1.5rem' }}>
          {[
            {
              useCase: 'High-volume cold email',
              jsx: <><A s="instantly-ai" r={refs} /> for deliverability infrastructure paired with <A s="apollo-io" r={refs} /> for prospect data. The first manages sending accounts and warm-up; the second provides the contact database and enrichment. Add <A s="lavender" r={refs} /> for real-time email quality coaching before sending.</>
            },
            {
              useCase: 'Multichannel outreach (email + LinkedIn)',
              jsx: <><A s="lemlist" r={refs} /> for multichannel sequences combining email, LinkedIn, calling, SMS and WhatsApp touches with AI personalization. Suited to teams running lower-volume, higher-touch outreach.</>
            },
            {
              useCase: 'Custom data workflows and enrichment',
              jsx: <><A s="clay" r={refs} /> for building custom enrichment workflows with waterfall enrichment across 200+ data and AI vendors and Claygent AI research. Suited to ops teams who want to own the data layer. Pair with <A s="instantly-ai" r={refs} /> or <A s="lemlist" r={refs} /> for sending.</>
            },
            {
              useCase: 'Enterprise-scale outbound',
              jsx: <><A s="outreach" r={refs} /> or <A s="salesloft" r={refs} /> for enterprise sales engagement that combines sequencing with conversation intelligence, deals and forecasting. Suited to large sales orgs that need governance and reporting alongside automation.</>
            },
            {
              useCase: 'Intent-based prospecting',
              jsx: <><A s="apollo-io" r={refs} /> for prospecting from its built-in database of 240M+ contacts. <A s="unify" r={refs} /> combines intent data with B2B contact data and outbound action, <A s="warmly" r={refs} /> de-anonymizes website visitors, and <A s="avina" r={refs} /> adds custom buying signals and account scoring. <A s="cognism-v2" r={refs} /> provides phone-verified mobile numbers and intent signals.</>
            },
            {
              useCase: 'Full autonomous SDR',
              jsx: <><A s="artisan-ava" r={refs} />, <A s="11x-alice" r={refs} />, or <A s="aisdr" r={refs} /> for handling prospecting, personalization, sequencing, and follow-up without human involvement at each step. Less control over each message, but a fit for teams short on SDR headcount. <A s="orange-slice" r={refs} /> takes a different approach: you describe a sales workflow in plain English and it prospects, enriches, qualifies and pushes leads to your CRM.</>
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
            { term: 'Deliverability infrastructure', def: 'Sending account rotation and domain warm-up. Essential for any tool sending at volume. Look for tools that manage this automatically rather than requiring manual configuration.' },
            { term: 'Data enrichment depth', def: (<>How many data sources the tool queries to build prospect profiles. Firmographic data, technographic signals, and intent data are the key inputs. <A s="clay" r={refs} />, for example, runs waterfall enrichment across 200+ data and AI vendors.</>) },
            { term: 'Personalization engine', def: (<>Whether the tool writes openers based on real prospect data (LinkedIn activity, company news, job changes) rather than templated variables. Email coaching tools like <A s="lavender" r={refs} /> improve quality further.</>) },
            { term: 'CRM sync', def: (<>Bidirectional sync with <Link href="/integrations/hubspot" style={{ color: '#2563EB', textDecoration: 'none' }}>HubSpot</Link> or <Link href="/integrations/salesforce" style={{ color: '#2563EB', textDecoration: 'none' }}>Salesforce</Link> so sequence activity is reflected in pipeline without manual data entry.</>)},
            { term: 'Agentic follow-up', def: 'Autonomous follow-up decisions based on prospect behavior such as opens, clicks, and replies, rather than fixed time-based sequences. This is where newer autonomous SDR tools differentiate from traditional sequence tools.' },
            { term: 'Analytics and coaching', def: (<>Conversation intelligence tools like <A s="gong" r={refs} /> and <A s="clari-copilot" r={refs} /> analyze what happens after outreach lands, helping teams improve messaging over time.</>)},
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
          Several agents in the index are worth evaluating depending on your use case: <A s="regie-ai" r={refs} /> for a sales engagement platform where AI agents and human reps work together; <A s="orange-slice" r={refs} /> for building prospecting and enrichment workflows in plain English; <A s="lavender" r={refs} /> for email coaching and its Ora AI sales agent; <A s="cognism-v2" r={refs} /> for B2B data with phone-verified mobiles and CRM enrichment; and <A s="common-room" r={refs} /> for buyer-intent signals in product-led and developer-led sales.
        </p>

        <p style={{ fontSize: '0.875rem', color: '#9CA3AF', lineHeight: 1.6, marginTop: '2rem' }}>
          All agents listed above are editorially reviewed by The AI Agent Index. Scores reflect public signals including G2 ratings, product documentation, and verified user evidence. See our <Link href="/methodology" style={{ color: '#6B7280' }}>editorial methodology</Link>.
        </p>
      </div>

      {/* Newsletter */}
      <div style={{ marginBottom: '3rem' }}>
        <NewsletterSignup />
      </div>

      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        <Link href="/ai-sales-agents" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>All AI Sales Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Browse the full category &#x2192;</p>
        </Link>
        <Link href="/resources/guides/best-ai-agents-for-cold-email" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Best Cold Email Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>lemlist vs Instantly.ai vs Apollo.io &#x2192;</p>
        </Link>
        <Link href="/resources/guides/how-to-automate-sales-outreach" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>How to Automate Outreach</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Step-by-step guide &#x2192;</p>
        </Link>
        <Link href="/definitions/what-is-an-ai-sdr" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>What is an AI SDR?</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Read the definition &#x2192;</p>
        </Link>
        <Link href="/stacks/full-outbound-sales-stack" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Full Outbound Sales Stack</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>See the recommended stack &#x2192;</p>
        </Link>
        <Link href="/integrations/hubspot" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Best for HubSpot</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Filter by integration &#x2192;</p>
        </Link>
      </div>
      <GuideCitations slug="best-ai-agents-for-outbound-sales" table="guides" />
    </div>
  )
}