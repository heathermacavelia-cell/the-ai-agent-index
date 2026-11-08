import type { Metadata } from 'next'
import { EDITOR_PERSON } from '@/lib/editor'
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
const GUIDE_SLUGS = ['aisdr', 'apollo-io', 'artisan-ava', 'avina', 'clay', 'cognism-v2', 'common-room', 'instantly-ai', 'lavender', 'lemlist', 'orange-slice', 'seamless-ai', 'warmly', 'zoominfo']

// The agents this guide lists, in this order, under the guide's own groups.
// Chosen by hand (Heather, 2026-10-29) - never by tag. Order is editorial, not a ranking.
const GUIDE_GROUPS: GuideGroup[] = [
  {
    heading: 'Data and enrichment',
    intro: 'Tools that find B2B contacts and accounts and fill in the data you need before outreach starts.',
    slugs: ['apollo-io', 'zoominfo', 'clay', 'cognism-v2', 'seamless-ai'],
  },
  {
    heading: 'Outreach',
    intro: 'Tools that send and manage cold outreach sequences, from email-only to multichannel.',
    slugs: ['instantly-ai', 'lemlist'],
  },
  {
    heading: 'Buying signals',
    intro: 'Tools that surface accounts showing interest, such as website visits or community activity, so outreach can be timed to them.',
    slugs: ['warmly', 'common-room', 'avina'],
  },
  {
    heading: 'Writing',
    intro: 'Help for reps writing individual sales emails before they send.',
    slugs: ['lavender'],
  },
  {
    heading: 'Workflow',
    intro: 'Tools that chain prospecting steps, from finding leads to pushing them to a CRM, into one workflow.',
    slugs: ['orange-slice'],
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

const DESCRIPTION = 'Apollo.io for data and sequencing, Clay for waterfall enrichment, Instantly.ai and lemlist for outreach, plus buying-signal tools. Independently researched.'

export const metadata: Metadata = {
  title: 'Apollo.io vs Clay vs Instantly.ai: B2B Prospecting Compared (2026)',
  description: DESCRIPTION,
  alternates: { canonical: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-b2b-prospecting' },
  openGraph: {
    images: [{ url: 'https://theaiagentindex.com/og-image-2026-11.png', width: 1200, height: 630 }],
    title: 'Apollo.io vs Clay vs Instantly.ai: B2B Prospecting Compared (2026)',
    description: DESCRIPTION,
    url: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-b2b-prospecting',
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://theaiagentindex.com/og-image-2026-11.png'],
    title: 'Apollo.io vs Clay vs Instantly.ai: B2B Prospecting Compared (2026)',
    description: DESCRIPTION,
  },
}

const articleLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  image: 'https://theaiagentindex.com/og-image-2026-11.png',
  headline: 'Best AI Agents for B2B Prospecting (2026)',
  description: 'AI agents for B2B prospecting compared by the job they do: contact data and enrichment, outreach, buying signals, email writing and workflow.',
  url: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-b2b-prospecting',
  author: EDITOR_PERSON,
  publisher: { '@type': 'Organization', name: 'The AI Agent Index', url: 'https://theaiagentindex.com' },
}

const faqItems = [
  {
    q: 'What is the best AI agent for B2B prospecting?',
    a: 'It depends on where your prospecting bottleneck sits. {{apollo-io.name}} combines a B2B contact database, enrichment and AI sequencing in one platform. {{clay.name}} suits teams that need custom enrichment pipelines that draw on many data vendors. {{instantly-ai.name}} suits high-volume cold email. {{lemlist.name}} suits personalized multichannel outreach.',
  },
  {
    q: 'What is the difference between {{apollo-io.name}} and {{clay.name}} for B2B prospecting?',
    a: '{{apollo-io.name}} is an all-in-one platform that provides a contact database, enrichment, and email sequencing in one tool. {{clay.name}} is a GTM data platform that runs waterfall enrichment across 200+ data and AI vendors, with Claygent for AI research and outreach and automation of its own. Clay plans meter both platform actions and data credits, and teams can pair it with a sending tool such as {{instantly-ai.name}} or {{lemlist.name}}.',
  },
  {
    q: 'What is the difference between {{apollo-io.name}} and {{instantly-ai.name}} for prospecting?',
    a: '{{apollo-io.name}} combines a contact database with outreach automation, making it a full-stack prospecting tool. {{instantly-ai.name}} focuses on cold email infrastructure: no limit on connected sending accounts (the mailboxes cost extra), automated warmup, and AI reply classification, and it sells access to its own lead database separately through Instantly Credits. Some teams use {{apollo-io.name}} to find and enrich prospects, then send their sequences through {{instantly-ai.name}}.',
  },
  {
    q: 'Can AI agents fully automate B2B prospecting?',
    a: 'AI agents can automate much of the prospecting workflow: finding contacts, enriching data, writing personalized outreach, and managing follow-up sequences. Human oversight remains important for ICP definition, message strategy, and handling replies. AI SDR tools such as {{artisan-ava.name}} and {{aisdr.name}} research prospects and run outreach on their own, but a human still sets the targeting and should check the messaging.',
  },
]

export default async function BestAIAgentsForB2BProspecting() {
  const meta = await getGuideMeta('best-ai-agents-for-b2b-prospecting')
  const published = isoDate(meta?.published_at)
  const audited = isoDate(meta?.last_audited_at)
  const updated = updatedLabel(meta?.last_audited_at)

  const supabase = createClient()
  const groups = await getGuideGroups(GUIDE_GROUPS)
  const listed = groups.flatMap((g) => g.agents)

  const refs = await buildRefMap(supabase, GUIDE_SLUGS)
  const t = (text: string) => resolveTemplates(text, refs)

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Best AI Agents for B2B Prospecting 2026',
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
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ ...articleLd, ...(published ? { datePublished: published } : {}), ...(audited ? { dateModified: audited } : {}) }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map(({ q, a }) => ({
          '@type': 'Question',
          name: t(q),
          acceptedAnswer: { '@type': 'Answer', text: t(a) },
        })),
      }) }} />

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>

        <nav style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8125rem', color: '#6B7280', marginBottom: '2rem' }}>
          <Link href="/" style={{ color: '#6B7280', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link href="/resources/guides" style={{ color: '#6B7280', textDecoration: 'none' }}>Guides</Link>
          <span>/</span>
          <span style={{ color: '#111827' }}>Best AI agents for B2B prospecting</span>
        </nav>

        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' as const }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Guide</span>
            <span style={{ fontSize: '0.75rem', color: '#6B7280', padding: '0.25rem 0.75rem', backgroundColor: '#F3F4F6', borderRadius: '9999px' }}>{updated}</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '0.25rem 0.75rem', borderRadius: '9999px', border: '1px solid #BFDBFE' }}>Independently Reviewed</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1rem' }}>
            Best AI agents for B2B prospecting (2026)
          </h1>
          <p style={{ fontSize: '1.0625rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '0.75rem' }}>
            AI agents now handle much of B2B prospecting: list building, data enrichment, personalized messaging, and follow-up sequences, work that used to sit with SDRs. This guide covers {listed.length} AI agents for B2B prospecting, grouped by the job they do: data and enrichment, outreach, buying signals, writing and workflow.
          </p>
          <p style={{ fontSize: '0.9375rem', color: '#6B7280', lineHeight: 1.7 }}>
            A useful distinction for buyers: finding prospects and sending to them are different problems that often need different tools. <A s="apollo-io" r={refs} /> covers both, with a contact database and AI sequencing in one platform. <A s="clay" r={refs} /> fits when data quality is the bottleneck, with waterfall enrichment across many data vendors. <A s="instantly-ai" r={refs} /> focuses on cold email sending infrastructure, with its lead database sold separately. <A s="lemlist" r={refs} /> focuses on personalized multichannel outreach, with a lead database on every plan and contact data credits sold as an add-on. <A s="zoominfo" r={refs} /> is an enterprise-scale data option, starting with a free ZoomInfo Lite plan.
          </p>
        </div>

        <GuideAgentList groups={GUIDE_GROUPS} />

        {/* At-a-glance comparison. Prices come from each listing's own starting price, so they update when a listing is re-audited. */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>
            <A s="apollo-io" r={refs} /> vs <A s="clay" r={refs} /> vs <A s="instantly-ai" r={refs} />, plus <A s="lemlist" r={refs} />, at a glance
          </h2>
          <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '1rem' }}>
            All four now touch both data and outreach, but each starts from a different job. Starting prices are each tool&apos;s lowest paid plan as recorded on its listing.
          </p>
          <div style={{ overflowX: 'auto' as const }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' as const, fontSize: '0.8125rem', color: '#374151', minWidth: '560px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB', textAlign: 'left' as const }}>
                  {['Tool', 'Main job', 'Contact data', 'Outreach', 'Starting price'].map((h) => (
                    <th key={h} style={{ padding: '0.625rem 0.75rem', borderBottom: '1px solid #E5E7EB', fontWeight: 600, color: '#111827' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { s: 'apollo-io', job: 'Find contacts and run outreach in one platform', data: 'Built-in B2B contact database', out: 'Email sequences, dialer and CRM sync', price: t('{{apollo-io.starting_price}}, per user, free plan available') },
                  { s: 'clay', job: 'Enrich and research leads with custom workflows', data: 'Marketplace of data and AI vendors, paid with data credits', out: 'Outreach and automation built in, often paired with a sender', price: t('{{clay.starting_price}}, free plan available') },
                  { s: 'instantly-ai', job: 'Send cold email at volume', data: 'Lead database sold separately through Instantly Credits', out: 'No limit on connected accounts (mailboxes cost extra), warmup and AI reply sorting', price: t('{{instantly-ai.starting_price}} for Outreach') },
                  { s: 'lemlist', job: 'Personalized multichannel outreach', data: 'Lead database on every plan, contact data credits sold as an add-on', out: 'Email on the entry plan, LinkedIn, calls and SMS on Multichannel', price: t('{{lemlist.starting_price}} for the Email plan') },
                ].map((row) => (
                  <tr key={row.s} style={{ verticalAlign: 'top' as const }}>
                    <td style={{ padding: '0.625rem 0.75rem', borderBottom: '1px solid #F3F4F6', fontWeight: 600 }}><A s={row.s} r={refs} /></td>
                    <td style={{ padding: '0.625rem 0.75rem', borderBottom: '1px solid #F3F4F6' }}>{row.job}</td>
                    <td style={{ padding: '0.625rem 0.75rem', borderBottom: '1px solid #F3F4F6' }}>{row.data}</td>
                    <td style={{ padding: '0.625rem 0.75rem', borderBottom: '1px solid #F3F4F6' }}>{row.out}</td>
                    <td style={{ padding: '0.625rem 0.75rem', borderBottom: '1px solid #F3F4F6', whiteSpace: 'nowrap' as const }}>{row.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>How to choose the right B2B prospecting tool</h2>
          <p style={{ color: '#374151', lineHeight: 1.7, marginBottom: '1rem' }}>
            The right tool depends on where your biggest prospecting bottleneck sits. Here is a simple framework:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.75rem', marginBottom: '1.5rem' }}>
            {[
              { condition: 'you need data + outreach in one platform', slug: 'apollo-io', affiliate: 'https://get.apollo.io/bhdw03dqyvi6' },
              { condition: 'you already have data and need scale + deliverability', slug: 'instantly-ai', affiliate: 'https://refer.instantly.ai/1w78xzeoje3x' },
              { condition: 'you need multichannel (email + LinkedIn) and prioritize personalization', slug: 'lemlist', affiliate: 'https://get.lemlist.com/1ozfabw1y8l1' },
              { condition: 'you have a complex ICP and need enrichment from multiple sources', slug: 'clay', affiliate: null },
              { condition: 'you are an agency running campaigns for multiple clients', slug: 'instantly-ai', affiliate: 'https://refer.instantly.ai/1w78xzeoje3x' },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem', padding: '0.875rem 1rem', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.5rem', alignItems: 'flex-start', flexWrap: 'wrap' as const }}>
                <span style={{ fontSize: '0.875rem', color: '#374151', flex: 1 }}>If <strong>{row.condition}</strong></span>
                {row.affiliate && refs[row.slug]?.name && refs[row.slug]?.is_active !== false ? (
                  <a href={row.affiliate} target="_blank" rel="sponsored noopener noreferrer" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2563EB', textDecoration: 'none', flexShrink: 0 }}>&#x2192; {refs[row.slug]?.name}</a>
                ) : (
                  <span style={{ fontSize: '0.875rem', flexShrink: 0 }}>&#x2192; <A s={row.slug} r={refs} /></span>
                )}
              </div>
            ))}
          </div>

          <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', marginTop: '1.75rem' }}>Also worth exploring</h3>
          <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '0.75rem' }}>
            Beyond the four tools in the framework above, several other agents in the index are relevant to B2B prospecting: <A s="zoominfo" r={refs} /> for verified contact and company data with org charts and technographics, with intent signals starting at Copilot Advanced, AI agents on quoted plans and an MCP server that needs a ZoomInfo license; <A s="cognism-v2" r={refs} /> for B2B data with phone-verified mobiles and, on its Pro package, intent signals; <A s="warmly" r={refs} /> for website visitor de-anonymization, with an autonomous outbound TAM Agent that has no published price; <A s="common-room" r={refs} /> for community and buyer-intent signals in product-led and developer-led sales; <A s="avina" r={refs} /> for custom buying signals, with AI Outbound and CRM sync from its Team plan and account scoring from Growth (Avina does not send email itself, it works through your sequencer); <A s="orange-slice" r={refs} /> for building prospecting workflows in plain English, from finding and enriching leads to pushing them to a CRM; and <A s="lavender" r={refs} /> for improving the quality of individual rep emails before they send.
          </p>

          <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', marginTop: '1.75rem' }}>Rules to check before you send</h3>
          <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '0.75rem' }}>
            Any outreach these tools help you send goes out under your name, so the sending rules are yours to meet. Email falls under CAN-SPAM in the US and CASL in Canada, and cold B2B email is not exempt from CASL. Calls and texts have consent rules of their own. Read the rules section of our <Link href="/resources/guides/best-ai-agents-for-cold-email" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>cold email guide</Link> and the <Link href="/resources/guides/how-ai-agents-are-changing-sales" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>voice section of our sales guide</Link> before you launch.
          </p>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '1.25rem' }}>Frequently asked questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '1rem' }}>
            {faqItems.map(({ q, a }) => (
              <div key={q} style={{ border: '1px solid #E5E7EB', borderRadius: '0.5rem', padding: '1.25rem' }}>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }}>{t(q)}</h3>
                <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.7, margin: 0 }}>{t(a)}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <NewsletterSignup sourcePage="guide-best-ai-agents-for-b2b-prospecting" sourceType="guide" />
        </div>

        <div style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>Related resources</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.5rem' }}>
            {[
              { href: '/stacks/full-outbound-sales-stack', label: 'Full outbound sales stack: Apollo.io + Instantly.ai + lemlist' },
              { href: '/resources/guides/best-ai-agents-for-cold-email', label: 'Best AI agents for cold email' },
              { href: '/resources/guides/best-ai-agents-for-outbound-sales', label: 'Best AI agents for outbound sales' },
              { href: '/resources/guides/how-to-automate-sales-outreach', label: 'How to automate sales outreach with AI' },
              { href: '/compare/lemlist-vs-instantly-ai', label: 'lemlist vs Instantly.ai: full comparison' },
              { href: '/integrations/linkedin', label: 'Best AI agents for LinkedIn' },
              { href: '/integrations/salesforce', label: 'Best AI agents for Salesforce' },
              { href: '/ai-sales-agents', label: 'Browse all AI sales agents' },
            ].map((link) => (
              <Link key={link.href} href={link.href} style={{ fontSize: '0.875rem', color: '#2563EB', textDecoration: 'none' }}>&#x2192; {link.label}</Link>
            ))}
          </div>
        </div>

        <p style={{ fontSize: '0.75rem', color: '#9CA3AF', lineHeight: 1.6 }}>
          Some links in this guide are affiliate links. If you sign up through them, we may earn a commission at no extra cost to you. This never affects a rating or our editorial assessments. See our <Link href="/methodology" style={{ color: '#9CA3AF' }}>editorial methodology</Link>.
        </p>

        <GuideCitations slug="best-ai-agents-for-b2b-prospecting" table="guides" />

      </div>
    </>
  )
}