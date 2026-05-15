import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import type { Metadata } from 'next'
import GuideCitations from '@/components/GuideCitations'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Best AI Agents for Outbound Sales (2026)',
  description: 'Apollo, Instantly.ai, Lemlist, Clay, Artisan, and Outreach compared for outbound sales: prospect enrichment, personalised email at scale, and reply-rate data. Not affiliated.',
  openGraph: {
    title: 'Best AI Agents for Outbound Sales (2026)',
    description: 'Apollo, Instantly.ai, Lemlist, Clay, Artisan, and Outreach compared for outbound sales: prospect enrichment, personalised email at scale, and reply-rate data. Not affiliated.',
    url: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-outbound-sales',
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary',
    title: 'Best AI Agents for Outbound Sales (2026)',
    description: 'Apollo, Instantly.ai, Lemlist, Clay, and Artisan compared for outbound. Real reply-rate benchmarks and pricing.',
  },
  alternates: { canonical: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-outbound-sales' },
}

export default async function OutboundSalesGuidePage() {
  const supabase = createClient()
  const { data: agents } = await supabase
    .from('agents')
    .select('id, name, slug, developer, short_description, primary_category, pricing_model, starting_price, rating_avg, rating_count, is_featured, is_verified, capability_tags, integrations')
    .eq('is_active', true)
    .contains('capability_tags', ['outbound-automation'])
    .order('is_featured', { ascending: false })
    .order('rating_avg', { ascending: false })

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Best AI Agents for Outbound Sales 2026',
    description: 'Apollo, Instantly.ai, Lemlist, Clay, Artisan, and Outreach compared for outbound sales: prospect data, personalised email at scale, and reply-rate optimisation.',
    url: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-outbound-sales',
    publisher: { '@type': 'Organization', name: 'The AI Agent Index', url: 'https://theaiagentindex.com' },
  }

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Best AI Agents for Outbound Sales 2026',
    numberOfItems: agents?.length ?? 0,
    itemListElement: agents?.map((agent, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'SoftwareApplication',
        name: agent.name,
        description: agent.short_description,
        url: `https://theaiagentindex.com/agents/${agent.slug}`,
      }
    })) ?? []
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
          text: 'Apollo.io is the strongest all-in-one option for outbound sales, combining a database of 275 million contacts with sequencing, enrichment, and CRM sync. Instantly.ai leads for high-volume cold email deliverability. Clay is the best choice for teams that want full control over custom enrichment pipelines. Artisan Ava, 11x Alice, and AiSDR are the leading autonomous AI SDRs for teams that want prospecting and sequencing handled end-to-end without per-step human involvement.'
        }
      },
      {
        '@type': 'Question',
        name: 'What is an autonomous AI SDR?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'An autonomous AI SDR is a software agent that replaces or augments human sales development rep work without requiring human involvement at each step. These tools identify target accounts, enrich contact data, write personalised messages, manage multi-step follow-up sequences, and route warm replies to human reps. Artisan Ava, 11x Alice, AiSDR, and Avina are the primary autonomous AI SDRs in the market as of 2026. They offer higher automation but less control over individual message quality compared to human-assisted sequencing tools.'
        }
      },
      {
        '@type': 'Question',
        name: 'What is the best tool for high-volume cold email?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Instantly.ai leads for high-volume cold email infrastructure, managing sending account rotation, domain warm-up, and inbox placement at scale. It is typically paired with Apollo.io for prospect data or Clay for custom enrichment workflows. Lemlist is a strong alternative for teams that want multichannel sequences combining personalised video, email, and LinkedIn touches at lower volume but higher personalisation per contact.'
        }
      },
      {
        '@type': 'Question',
        name: 'How important is email deliverability for outbound sales tools?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Deliverability is the most important infrastructure factor in outbound email. Tools that manage sending account rotation, domain warm-up schedules, and spam filter bypass perform significantly better than tools that rely on your existing email provider alone. Without proper deliverability infrastructure, even well-written personalised emails will land in spam at scale. Instantly.ai and lemlist both manage deliverability as a core product feature rather than an afterthought.'
        }
      },
      {
        '@type': 'Question',
        name: 'What is the difference between email sequencing tools and autonomous AI SDRs?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Email sequencing tools like Outreach and Salesloft follow rules you configure: send email one, wait three days, send follow-up, repeat. A human still writes the messages and defines the logic. Autonomous AI SDRs like Artisan Ava and 11x Alice make decisions within the workflow, identifying prospects, writing personalised messages from enrichment data, and adjusting follow-up timing based on prospect behaviour without human involvement at each step. Sequencing tools offer more control; autonomous SDRs offer more scale at lower headcount cost.'
        }
      },
      {
        '@type': 'Question',
        name: 'How do AI outbound tools integrate with CRM systems?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The strongest outbound tools offer bidirectional sync with HubSpot and Salesforce so sequence activity, contact status, and reply data are reflected in pipeline records without manual data entry. Apollo.io, Outreach, and Salesloft have the deepest CRM integrations. Instantly.ai and lemlist offer HubSpot and Salesforce sync on paid plans. Without CRM sync, outbound activity lives in the sending tool and has to be manually reconciled with pipeline, which creates data quality problems at scale.'
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

      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Guide</p>
      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
        Best AI Agents for Outbound Sales (2026)
      </h1>

      <p style={{ fontSize: '1.0625rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '0.75rem', maxWidth: '680px' }}>
        Salesforce&apos;s 2026 State of Sales report finds 55% of sales teams now use AI specifically for prospecting, with outbound automation cited as the top growth tactic for the year. This guide covers {agents?.length ?? 0} AI agents purpose-built for outbound sales, covering data enrichment, personalised email at scale, multichannel sequencing, and autonomous SDRs.
      </p>
      <p style={{ fontSize: '0.9375rem', color: '#6B7280', lineHeight: 1.7, marginBottom: '1rem', maxWidth: '680px' }}>
        AI outbound agents replace or augment human SDR work. They identify target accounts, enrich contact data, write genuinely personalised messages, manage multi-step follow-up sequences, and route warm replies to human reps. The best tools combine prospect data, deliverability infrastructure, and CRM sync in a single workflow.
      </p>

      <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '2rem', maxWidth: '680px' }}>
        <p style={{ fontSize: '0.875rem', color: '#0369A1', lineHeight: 1.6, margin: 0 }}>
          <strong>New to AI SDRs?</strong> Read our structured definition: <Link href="/definitions/what-is-an-ai-sdr" style={{ color: '#2563EB' }}>What is an AI SDR?</Link> covering how they work, key capabilities, and how to evaluate them.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' as const, marginBottom: '2.5rem' }}>
        <Link href="/integrations/hubspot" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', backgroundColor: '#F9FAFB', padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>HubSpot integrations →</Link>
        <Link href="/integrations/salesforce" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', backgroundColor: '#F9FAFB', padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>Salesforce integrations →</Link>
        <Link href="/integrations/gmail" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', backgroundColor: '#F9FAFB', padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>Gmail integrations →</Link>
        <Link href="/integrations/linkedin" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', backgroundColor: '#F9FAFB', padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>LinkedIn integrations →</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
        {agents?.map((agent, index) => (
          <Link key={agent.slug} href={'/agents/' + agent.slug}
            style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: agent.is_featured ? '1px solid #BFDBFE' : '1px solid #E5E7EB', padding: '1.25rem', textDecoration: 'none', display: 'block', position: 'relative' }}>
            {index < 3 && (
              <span style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', fontSize: '0.625rem', fontWeight: 700, backgroundColor: '#FEF3C7', color: '#D97706', padding: '0.15rem 0.4rem', borderRadius: '9999px', textTransform: 'uppercase' as const }}>
                #{index + 1}
              </span>
            )}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ flex: 1, paddingRight: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' as const, marginBottom: '0.2rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#111827' }}>{agent.name}</span>
                  {agent.is_verified && <span style={{ fontSize: '0.625rem', fontWeight: 700, backgroundColor: '#DCFCE7', color: '#16A34A', padding: '0.1rem 0.4rem', borderRadius: '9999px', textTransform: 'uppercase' as const }}>Verified</span>}
                  {agent.is_featured && <span style={{ fontSize: '0.625rem', fontWeight: 700, backgroundColor: '#DBEAFE', color: '#1D4ED8', padding: '0.1rem 0.4rem', borderRadius: '9999px', textTransform: 'uppercase' as const }}>Featured</span>}
                </div>
                <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>by {agent.developer}</span>
              </div>
              {agent.rating_avg > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
                  <span style={{ color: '#2563EB', fontSize: '0.75rem' }}>★</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151' }}>{Number(agent.rating_avg).toFixed(1)}</span>
                </div>
              )}
            </div>
            <p style={{ fontSize: '0.8125rem', color: '#4B5563', lineHeight: 1.55, marginBottom: '0.75rem' }}>{agent.short_description}</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.75rem', color: '#6B7280', backgroundColor: '#F3F4F6', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', textTransform: 'capitalize' as const }}>{agent.pricing_model}</span>
              <span style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 500 }}>View →</span>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2.5rem', marginBottom: '3rem', maxWidth: '680px' }}>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#111827', marginBottom: '1rem', letterSpacing: '-0.01em' }}>
          How to evaluate AI agents for outbound sales
        </h2>
        <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1rem' }}>
          The category spans four distinct tool types and getting the categorisation right is half the buying decision. Autonomous AI SDRs like <Link href="/agents/artisan-ava" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Artisan Ava</Link>, <Link href="/agents/11x-alice" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>11x Alice</Link>, and <Link href="/agents/aisdr" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>AiSDR</Link> run fully autonomous outbound sequences end-to-end. Email deliverability platforms like <Link href="/agents/instantly-ai" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Instantly.ai</Link> and <Link href="/agents/lemlist" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>lemlist</Link> optimise inbox placement. Data enrichment and sequencing tools like <Link href="/agents/apollo-io" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Apollo.io</Link> and <Link href="/agents/clay" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Clay</Link> source and verify prospect data. Enterprise engagement platforms like <Link href="/agents/outreach" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Outreach</Link> and <Link href="/agents/salesloft" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Salesloft</Link> manage the full sales engagement workflow at scale.
        </p>
        <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1rem' }}>
          The most important evaluation criteria are deliverability, personalisation quality, and CRM sync. Deliverability determines whether your emails reach the inbox at all. Tools that manage sending infrastructure, warm-up schedules, and domain rotation perform significantly better than those that rely on your existing email provider alone. Personalisation quality determines reply rates. Generic AI-written emails have trained buyers to ignore them. The tools that pull from real enrichment data to write genuinely relevant openers outperform template-based approaches. Email coaching tools like <Link href="/agents/lavender" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Lavender</Link> complement your sending stack by improving the quality of each message before it sends.
        </p>

        <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', marginTop: '1.75rem' }}>
          Recommended stack by use case
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.75rem', marginBottom: '1.5rem' }}>
          {[
            {
              useCase: 'High-volume cold email',
              jsx: <><Link href="/agents/instantly-ai" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Instantly.ai</Link> for deliverability infrastructure paired with <Link href="/agents/apollo-io" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Apollo.io</Link> for prospect data. Instantly manages sending accounts and warm-up; Apollo provides the contact database and enrichment. Add <Link href="/agents/lavender" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Lavender</Link> for real-time email quality coaching before sending.</>
            },
            {
              useCase: 'Multichannel outreach (email + LinkedIn)',
              jsx: <><Link href="/agents/lemlist" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>lemlist</Link> for multichannel sequences combining personalised video, email, and LinkedIn touches. Best for SMBs running lower volume but higher-touch outreach.</>
            },
            {
              useCase: 'Custom data workflows and enrichment',
              jsx: <><Link href="/agents/clay" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Clay</Link> for building custom enrichment pipelines that pull from 100+ data sources, scoring rules, and waterfall logic. Best for ops teams who want to own the data layer. Pair with <Link href="/agents/instantly-ai" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Instantly.ai</Link> or <Link href="/agents/lemlist" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>lemlist</Link> for sending.</>
            },
            {
              useCase: 'Enterprise-scale outbound',
              jsx: <><Link href="/agents/outreach" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Outreach</Link> or <Link href="/agents/salesloft" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Salesloft</Link> for enterprise-level sales engagement with full CRM integration, rep coaching, and pipeline analytics. Best for large sales orgs that need governance and reporting alongside automation.</>
            },
            {
              useCase: 'Intent-based prospecting',
              jsx: <><Link href="/agents/apollo-io" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Apollo.io</Link> for intent-signal-based targeting with its built-in database of 275M+ contacts. Pair with a CRM-native sequence tool for tighter pipeline visibility. <Link href="/agents/unify" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Unify</Link> and <Link href="/agents/warmly" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Warmly</Link> are strong options for account-level intent signals and website visitor deanonymisation.</>
            },
            {
              useCase: 'Full autonomous SDR',
              jsx: <><Link href="/agents/artisan-ava" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Artisan Ava</Link>, <Link href="/agents/11x-alice" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>11x Alice</Link>, <Link href="/agents/aisdr" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>AiSDR</Link>, or <Link href="/agents/avina" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Avina</Link> for handling prospecting, personalisation, sequencing, and follow-up without human involvement at each step. Higher cost, lower control, but the right call for teams under-resourced on SDR headcount. <Link href="/agents/orange-slice" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Orange Slice</Link> is worth noting as an affordable entry point starting at $20/month.</>
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
            { term: 'Deliverability infrastructure', def: 'Sending account rotation, domain warm-up, and spam filter bypass. Essential for any tool sending at volume. Look for tools that manage this automatically rather than requiring manual configuration.' },
            { term: 'Data enrichment depth', def: 'How many data sources the tool queries to build prospect profiles. Firmographic data, technographic signals, and intent data are the key inputs. Apollo and Clay lead the category here.' },
            { term: 'Personalisation engine', def: 'Whether the tool writes openers based on real prospect data (LinkedIn activity, company news, job changes) rather than templated variables. Email coaching tools like Lavender improve quality further.' },
            { term: 'CRM sync', def: (<>Bidirectional sync with <Link href="/integrations/hubspot" style={{ color: '#2563EB', textDecoration: 'none' }}>HubSpot</Link> or <Link href="/integrations/salesforce" style={{ color: '#2563EB', textDecoration: 'none' }}>Salesforce</Link> so sequence activity is reflected in pipeline without manual data entry.</>)},
            { term: 'Agentic follow-up', def: 'Autonomous follow-up decisions based on prospect behaviour such as opens, clicks, and replies, rather than fixed time-based sequences. This is where newer autonomous SDR tools differentiate from traditional sequence tools.' },
            { term: 'Analytics and coaching', def: (<>Conversation intelligence tools like <Link href="/agents/gong" style={{ color: '#2563EB', textDecoration: 'none' }}>Gong</Link> and <Link href="/agents/clari" style={{ color: '#2563EB', textDecoration: 'none' }}>Clari</Link> analyse what happens after outreach lands, helping teams improve messaging over time.</>)},
          ].map((item) => (
            <li key={item.term} style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.6, display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <span style={{ color: '#2563EB', flexShrink: 0, fontWeight: 700, marginTop: '2px' }}>→</span>
              <span><strong>{item.term}:</strong> {item.def}</span>
            </li>
          ))}
        </ul>

        <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', marginTop: '1.75rem' }}>
          Also worth exploring
        </h3>
        <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '0.75rem' }}>
          Several newer agents in the index are worth evaluating depending on your use case: <Link href="/agents/regie-ai" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Regie.ai</Link> for AI-generated outbound sequences with intent data; <Link href="/agents/avina" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Avina</Link> for autonomous outbound starting at $149/month; <Link href="/agents/orange-slice" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Orange Slice</Link> as one of the most affordable autonomous outbound options at $20/month; <Link href="/agents/cognism-v2" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Cognism</Link> for EMEA-focused B2B data with strong compliance coverage; and <Link href="/agents/common-room" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Common Room</Link> for community and product-led signal-based outbound.
        </p>

        <p style={{ fontSize: '0.875rem', color: '#9CA3AF', lineHeight: 1.6, marginTop: '2rem' }}>
          All agents listed above are editorially reviewed by The AI Agent Index. Scores reflect public signals including G2 ratings, product documentation, and verified user evidence. See our <Link href="/methodology" style={{ color: '#6B7280' }}>editorial methodology</Link>.
        </p>
      </div>

      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        <Link href="/ai-sales-agents" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>All AI Sales Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Browse the full category →</p>
        </Link>
        <Link href="/resources/guides/best-ai-agents-for-cold-email" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Best Cold Email Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Lemlist vs Instantly vs Apollo →</p>
        </Link>
        <Link href="/resources/guides/how-to-automate-sales-outreach" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>How to Automate Outreach</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Step-by-step guide →</p>
        </Link>
        <Link href="/definitions/what-is-an-ai-sdr" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>What is an AI SDR?</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Read the definition →</p>
        </Link>
        <Link href="/stacks/full-outbound-sales-stack" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Full Outbound Sales Stack</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>See the recommended stack →</p>
        </Link>
        <Link href="/integrations/hubspot" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Best for HubSpot</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Filter by integration →</p>
        </Link>
      </div>
      <GuideCitations slug="best-ai-agents-for-outbound-sales" table="guides" />
    </div>
  )
}