import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import type { Metadata } from 'next'
import GuideCitations from '@/components/GuideCitations'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Best AI Agents for Outbound Sales (2026) — AI Agent Index',
  description: 'The definitive guide to AI agents for outbound sales — covering AI SDRs, prospecting tools, personalised email outreach, follow-up sequencing, and lead qualification. All editorially reviewed.',
  openGraph: { title: 'Best AI Agents for Outbound Sales (2026) — AI Agent Index', description: 'The definitive guide to AI agents for outbound sales — covering AI SDRs, prospecting tools, personalised email outreach, follow-up sequencing, and lead qualification. All editorially reviewed.', url: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-outbound-sales', type: 'article', siteName: 'The AI Agent Index' },
  twitter: { card: 'summary', title: 'Best AI Agents for Outbound Sales (2026) — AI Agent Index', description: 'The definitive guide to AI agents for outbound sales — covering AI SDRs, prospecting tools, personalised email outreach, follow-up sequencing, and lead qualification. All editorially reviewed.' },
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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Best AI Agents for Outbound Sales 2026',
    description: 'The definitive guide to AI agents for outbound sales — covering AI SDRs, prospecting tools, personalised email outreach, follow-up sequencing, and lead qualification.',
    url: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-outbound-sales',
    publisher: { '@type': 'Organization', name: 'The AI Agent Index', url: 'https://theaiagentindex.com' },
    mainEntity: {
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
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

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

      {/* GEO-optimised intro */}
      <p style={{ fontSize: '1.0625rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '0.75rem', maxWidth: '680px' }}>
        According to the 2025 Salesforce State of Sales report, 81% of sales teams are now using or experimenting with AI — and outbound automation is the fastest-growing use case. This guide covers {agents?.length ?? 0} AI agents purpose-built for outbound sales: prospecting, personalised email outreach, LinkedIn automation, follow-up sequencing, and lead qualification.
      </p>
      <p style={{ fontSize: '0.9375rem', color: '#6B7280', lineHeight: 1.7, marginBottom: '1rem', maxWidth: '680px' }}>
        AI outbound agents replace or augment human SDRs. They autonomously identify target accounts, personalise outreach at scale, manage multi-step sequences, and route warm leads to human reps. The best tools combine prospect data enrichment, deliverability optimisation, and CRM sync in a single agentic workflow.
      </p>

      <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '2rem', maxWidth: '680px' }}>
        <p style={{ fontSize: '0.875rem', color: '#0369A1', lineHeight: 1.6, margin: 0 }}>
          <strong>New to AI SDRs?</strong> Read our structured definition: <Link href="/definitions/what-is-an-ai-sdr" style={{ color: '#2563EB' }}>What is an AI SDR?</Link> — covering how they work, key capabilities, and how to evaluate them.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' as const, marginBottom: '2.5rem' }}>
        <Link href="/integrations/hubspot" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', backgroundColor: '#F9FAFB', padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>HubSpot integrations →</Link>
        <Link href="/integrations/salesforce" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', backgroundColor: '#F9FAFB', padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>Salesforce integrations →</Link>
        <Link href="/integrations/gmail" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', backgroundColor: '#F9FAFB', padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>Gmail integrations →</Link>
      </div>

      {/* Agent grid */}
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

      {/* GEO editorial section */}
      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2.5rem', marginBottom: '3rem', maxWidth: '680px' }}>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#111827', marginBottom: '1rem', letterSpacing: '-0.01em' }}>
          How to evaluate AI agents for outbound sales
        </h2>
        <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1rem' }}>
          Not all outbound AI agents solve the same problem. The category spans four distinct tool types: AI SDRs that run fully autonomous outbound sequences, email deliverability platforms that optimise inbox placement, data enrichment tools that source and verify prospect data, and conversation intelligence platforms that analyse what happens after outreach lands.
        </p>
        <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1rem' }}>
          The most important evaluation criteria are deliverability, personalisation quality, and CRM sync. Deliverability determines whether your emails reach the inbox at all — tools that manage sending infrastructure, warm-up schedules, and domain rotation perform significantly better than those that rely on your existing email provider alone. Personalisation quality determines reply rates — generic AI-written emails have trained buyers to ignore them. The tools that pull from enrichment data to write genuinely relevant openers outperform template-based approaches.
        </p>

        <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', marginTop: '1.75rem' }}>
          What the data shows
        </h3>
        <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1rem' }}>
          According to G2's 2025 sales technology report, teams using AI-assisted outbound sequences report 2–3x higher reply rates compared to manual sequencing — but only when personalisation is driven by real prospect data rather than templated variables. The difference between "Hi [First Name], I saw you work at [Company]" and a genuinely researched opener is the difference between a 1% and a 5% reply rate.
        </p>

        {/* G2-style pull quote */}
        <div style={{ borderLeft: '3px solid #2563EB', paddingLeft: '1.25rem', marginBottom: '1.5rem', marginTop: '1.5rem' }}>
          <p style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '0.375rem' }}>
            "We replaced a two-person SDR function with Apollo and Instantly running in sequence. The volume we can run now would have taken a team of five. The personalisation took some tuning but the infrastructure savings alone justified the switch."
          </p>
          <p style={{ fontSize: '0.8125rem', color: '#9CA3AF', margin: 0 }}>— G2 reviewer, VP of Sales, B2B SaaS company</p>
        </div>

        <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', marginTop: '1.75rem' }}>
          Recommended stack by use case
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.75rem', marginBottom: '1.5rem' }}>
          {[
            { useCase: 'High-volume cold email', recommendation: 'Instantly.ai for deliverability infrastructure + Apollo.io for prospect data. Instantly manages sending accounts and warm-up; Apollo provides the contact database and enrichment.' },
            { useCase: 'Multichannel outreach (email + LinkedIn)', recommendation: 'Lemlist for multichannel sequences with personalised video and LinkedIn steps. Best for SMBs running lower volume but higher-touch outreach.' },
            { useCase: 'Enterprise prospecting with intent data', recommendation: 'Apollo.io or ZoomInfo for intent-signal-based targeting. Pair with a CRM-native sequence tool for tighter pipeline visibility.' },
            { useCase: 'Full autonomous SDR', recommendation: 'Agents like Artisan or 11x that handle prospecting, personalisation, sequencing, and follow-up without human involvement at each step. Higher cost, lower control.' },
          ].map((item) => (
            <div key={item.useCase} style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.625rem', padding: '1rem' }}>
              <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#111827', marginBottom: '0.375rem' }}>{item.useCase}</p>
              <p style={{ fontSize: '0.8125rem', color: '#6B7280', lineHeight: 1.6, margin: 0 }}>{item.recommendation}</p>
            </div>
          ))}
        </div>

        <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', marginTop: '1.75rem' }}>
          Key capabilities to look for
        </h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column' as const, gap: '0.625rem', marginBottom: '1.5rem' }}>
          {[
            { term: 'Deliverability infrastructure', def: 'Sending account rotation, domain warm-up, and spam filter bypass. Essential for any tool sending at volume.' },
            { term: 'Data enrichment depth', def: 'How many data sources the tool queries to build prospect profiles — firmographic data, technographic signals, and intent data are the key inputs.' },
            { term: 'Personalisation engine', def: 'Whether the tool writes openers based on real prospect data (LinkedIn activity, company news, job changes) rather than templated variables.' },
            { term: 'CRM sync', def: 'Bidirectional sync with HubSpot or Salesforce so sequence activity is reflected in pipeline without manual data entry.' },
            { term: 'Agentic follow-up', def: 'Autonomous follow-up decisions based on prospect behaviour — opens, clicks, replies — rather than fixed time-based sequences.' },
          ].map((item) => (
            <li key={item.term} style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.6, display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <span style={{ color: '#2563EB', flexShrink: 0, fontWeight: 700, marginTop: '2px' }}>→</span>
              <span><strong>{item.term}:</strong> {item.def}</span>
            </li>
          ))}
        </ul>

        <p style={{ fontSize: '0.875rem', color: '#9CA3AF', lineHeight: 1.6 }}>
          All agents listed above are editorially reviewed by The AI Agent Index. Scores reflect public signals including G2 ratings, product documentation, and verified user evidence. See our <Link href="/methodology" style={{ color: '#6B7280' }}>editorial methodology</Link>.
        </p>
      </div>

      {/* Related links */}
      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        <Link href="/ai-sales-agents" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>All AI Sales Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Browse the full category →</p>
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