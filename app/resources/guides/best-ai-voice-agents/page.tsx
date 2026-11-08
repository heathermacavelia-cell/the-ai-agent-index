import Link from 'next/link'
import { EDITOR_PERSON } from '@/lib/editor'
import type { Metadata } from 'next'
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
const GUIDE_SLUGS = ['balto', 'close-crm', 'cresta', 'eleven-agents', 'genesys-cloud', 'lindy', 'ringfoods', 'talkdesk', 'valory-ai', 'voiceflow', 'workforce-wave']

// The agents this guide lists, in this order, under the guide's four types.
// Chosen 2026-11-03. Order is editorial, not a ranking. aircall-ai stays out until its overdue
// audit runs. Every feature below was read on the vendor page 2026-11-03.
const GUIDE_GROUPS: GuideGroup[] = [
  {
    heading: 'Build your own voice agent',
    intro: 'Platforms for teams that want to design, test and run their own agent on phone and web.',
    slugs: ['eleven-agents', 'voiceflow'],
  },
  {
    heading: 'Phone agents for small businesses',
    intro: 'Agents that answer calls and book appointments, with little or no building on your side.',
    slugs: ['workforce-wave', 'lindy', 'valory-ai', 'ringfoods'],
  },
  {
    heading: 'Sales calls',
    intro: 'A voice agent inside a CRM that calls warm leads.',
    slugs: ['close-crm'],
  },
  {
    heading: 'Contact centers',
    intro: 'Enterprise platforms that add AI voice agents to a staffed contact center.',
    slugs: ['talkdesk', 'genesys-cloud', 'cresta', 'balto'],
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


const META_DESCRIPTION = 'ElevenAgents and Voiceflow to build, Workforce Wave and Lindy for small business phones, Talkdesk and Genesys for contact centers. Pricing and consent rules.'

export const metadata: Metadata = {
  title: 'Best AI Voice Agents: ElevenAgents, Talkdesk and More (2026)',
  description: META_DESCRIPTION,
  openGraph: {
    images: [{ url: 'https://theaiagentindex.com/og-image-2026-11.png', width: 1200, height: 630 }],
    title: 'Best AI Voice Agents: ElevenAgents, Talkdesk and More (2026)',
    description: META_DESCRIPTION,
    url: 'https://theaiagentindex.com/resources/guides/best-ai-voice-agents',
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://theaiagentindex.com/og-image-2026-11.png'],
    title: 'Best AI Voice Agents: ElevenAgents, Talkdesk and More (2026)',
    description: META_DESCRIPTION,
  },
  alternates: {
    canonical: 'https://theaiagentindex.com/resources/guides/best-ai-voice-agents',
  },
}

// Prices are not shown here: the cards carry live pricing.
const comparisonRows = [
  { slug: 'eleven-agents', start: 'Free plan with call minutes included', ai: 'Plans billed by call minutes, then per minute, with model cost taken from credits' },
  { slug: 'voiceflow', start: 'Free plan with a one-time credit grant; free trial, no card, for agencies', ai: 'Usage-based for agencies; plan prices shown after sign-up or a demo' },
  { slug: 'workforce-wave', start: 'First agent free, no card', ai: 'Monthly plans with included minutes, then per minute' },
  { slug: 'lindy', start: 'Free credits for 7 days, no card', ai: 'Per user, with credits. Phone calls use credits per minute, and the phone number is a separate monthly fee' },
  { slug: 'valory-ai', start: 'Walkthrough with the vendor', ai: 'Monthly managed plan with included minutes, plus one-time setup' },
  { slug: 'ringfoods', start: 'Free trial', ai: 'Monthly plan' },
  { slug: 'close-crm', start: '14-day trial, no card', ai: 'Per user, with monthly AI credits' },
  { slug: 'talkdesk', start: 'Through sales', ai: 'Per user, by edition. Voice starts on a higher edition than the price on its card' },
  { slug: 'genesys-cloud', start: 'Through sales', ai: 'Per user, billed annually, by edition' },
  { slug: 'cresta', start: 'Demo', ai: 'By quote' },
  { slug: 'balto', start: 'Through sales', ai: 'Its Togo voice agent is priced by the minute, not by seat' },
]

const faqItems = [
  {
    q: 'What is the best AI voice agent in 2026?',
    a: 'It depends on who answers the phone today. {{eleven-agents.name}} and {{voiceflow.name}} suit teams that want to build their own agent. {{workforce-wave.name}} and {{lindy.name}} suit small businesses that want calls answered with little setup, and {{valory-ai.name}} suits Australian service businesses that want it fully managed. {{talkdesk.name}}, {{genesys-cloud.name}}, {{cresta.name}} and {{balto.name}} suit staffed contact centers.',
  },
  {
    q: 'What does an AI voice agent cost?',
    a: 'Most small business and build-your-own options charge by the minute or include a monthly allowance of minutes, while contact center platforms mostly charge per user. Current plans are on each listing. Estimate your monthly call minutes first, then compare what you would pay beyond the allowance, because overage is where bills grow.',
  },
  {
    q: 'Can an AI voice agent make outbound calls?',
    a: 'Many can, but outbound calling carries real legal risk. In the US, the FCC ruled in 2024 that AI-generated voices are artificial voices under the Telephone Consumer Protection Act. Telemarketing calls in an AI voice need prior express written consent. Other calls depend on their purpose and the type of line: many need prior express consent, some residential calls are exempt, and emergency calls need none. Warm leads who asked to hear from you are a better fit than cold lists, but warm does not mean consented, so keep a record of the consent. {{close-crm.name}} describes cold outbound as a weak fit for its Chloe agents, and Chloe calls US and Canadian numbers in English only.',
  },
  {
    q: 'Can an AI voice agent replace a receptionist?',
    a: 'For routine calls it often can: answering questions, taking messages and booking appointments, including after hours. Keep a clear route to a person for complaints, emergencies and anything unusual, and test it with real calls before you turn it on.',
  },
  {
    q: 'Do callers know they are talking to AI?',
    a: 'Tell them, and in some places you must. The EU AI Act\'s Article 50 transparency rule for AI systems that interact with people has applied since August 2, 2026. It binds the provider of the AI system, so ask your vendor how it is met. In Utah, disclosure is due if the person asks, and regulated high-risk uses must disclose verbally at the start. Maine\'s chatbot disclosure law covers aural communications. California\'s and New Jersey\'s bot laws are written for online accounts, so do not count on them either way for phone calls. Say so at the start of the call, and tell callers if the call is recorded, because recording consent rules vary by place. Telling people also sets expectations and gives people a chance to ask for a person.',
  },
]

export default async function BestAIVoiceAgentsPage() {
  const meta = await getGuideMeta('best-ai-voice-agents')
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
    image: 'https://theaiagentindex.com/og-image-2026-11.png',
    headline: 'Best AI Voice Agents: ElevenAgents, Talkdesk and More (2026)',
    description: META_DESCRIPTION,
    url: 'https://theaiagentindex.com/resources/guides/best-ai-voice-agents',
    ...(published ? { datePublished: published } : {}),
    ...(audited ? { dateModified: audited } : {}),
    author: EDITOR_PERSON,
    publisher: { '@type': 'Organization', name: 'The AI Agent Index', url: 'https://theaiagentindex.com' },
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(({ q, a }) => ({
      '@type': 'Question',
      name: t(q),
      acceptedAnswer: { '@type': 'Answer', text: t(a) },
    })),
  }

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Best AI Voice Agents (2026)',
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

  const h2 = { fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }
  const para = { fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1rem' }
  const card = { backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }
  const cardTitle = { fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }
  const cardSub = { fontSize: '0.8125rem', color: '#6B7280' }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />

      <div style={{ marginBottom: '0.75rem' }}>
        <Link href="/" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none' }}>Home</Link>
        <span style={{ color: '#D1D5DB', margin: '0 0.5rem' }}>/</span>
        <Link href="/resources/guides" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none' }}>Guides</Link>
        <span style={{ color: '#D1D5DB', margin: '0 0.5rem' }}>/</span>
        <span style={{ fontSize: '0.8125rem', color: '#111827' }}>Best AI voice agents</span>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' as const }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Guide</span>
        {updated && <span style={{ fontSize: '0.75rem', color: '#6B7280', padding: '0.25rem 0.75rem', backgroundColor: '#F3F4F6', borderRadius: '9999px' }}>{updated}</span>}
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '0.25rem 0.75rem', borderRadius: '9999px', border: '1px solid #BFDBFE' }}>Independently Reviewed</span>
      </div>

      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
        Best AI voice agents (2026)
      </h1>

      <p style={{ fontSize: '1.0625rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '0.75rem' }}>
        AI voice agents answer and make phone calls by talking with people in real time. A missed call is often a lost customer, and that has made the phone a practical place to put AI to work. This guide covers {listed.length} voice agents, grouped by who they suit.
      </p>
      <p style={{ fontSize: '0.9375rem', color: '#6B7280', lineHeight: 1.7, marginBottom: '1.75rem' }}>
        The main choice is how much you want to build. Some tools hand you a working receptionist, some give you a platform to design your own, and some add AI to a contact center you already run.
      </p>

      <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#0369A1', lineHeight: 1.6, margin: 0 }}>
          <strong>Quick recommendation:</strong> For a small business that wants calls answered, look at <A s="workforce-wave" r={refs} /> or <A s="lindy" r={refs} />. To build your own agent, look at <A s="eleven-agents" r={refs} />. For a staffed contact center, look at <A s="talkdesk" r={refs} /> or <A s="genesys-cloud" r={refs} />.
        </p>
      </div>

      <GuideAgentList groups={GUIDE_GROUPS} />

      <h2 style={h2}>How they charge</h2>
      <div style={{ overflowX: 'auto' as const, marginBottom: '3rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#F9FAFB' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #E5E7EB', color: '#6B7280', fontWeight: 600 }}>Agent</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #E5E7EB', color: '#6B7280', fontWeight: 600 }}>How you start</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #E5E7EB', color: '#6B7280', fontWeight: 600 }}>How you pay</th>
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map((row) => (
              <tr key={row.slug}>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid #F3F4F6', color: '#111827', fontWeight: 500 }}><A s={row.slug} r={refs} /></td>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid #F3F4F6', color: '#4B5563' }}>{row.start}</td>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid #F3F4F6', color: '#4B5563' }}>{row.ai}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 style={h2}>What to check before you buy</h2>
      <div style={{ marginBottom: '3rem' }}>
        <p style={para}>
          <strong>Consent for outbound calls.</strong> In the US, the <a href="https://docs.fcc.gov/public/attachments/FCC-24-17A1.pdf" rel="noopener noreferrer" target="_blank" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>FCC ruled in 2024</a> that AI-generated voices count as artificial voices under the Telephone Consumer Protection Act. Under the <a href="https://www.ecfr.gov/current/title-47/chapter-I/subchapter-B/part-64/subpart-L/section-64.1200" rel="noopener noreferrer" target="_blank" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>FCC&apos;s rules</a>, telemarketing calls in an AI voice need prior express written consent. Other calls depend on their purpose and the type of line: many need prior express consent, some residential calls are exempt, and emergency calls need none. A new FCC rule on revoking consent takes effect on November 25, 2026. Rules differ by country, so do not assume the vendor has covered them.
        </p>
        <p style={para}>
          <strong>Minutes and overage.</strong> Work out your monthly call minutes, then price the calls beyond your allowance. Also check whether a phone number, setup fee or outbound calling costs extra. <A s="valory-ai" r={refs} />, for example, charges one-time setup and sells outbound calling as an add-on on its entry plan.
        </p>
        <p style={para}>
          <strong>The handoff to a person.</strong> Call the agent yourself with an awkward request. It should pass the call to a person with the context attached, not loop or hang up.
        </p>
        <p style={para}>
          <strong>Regulated calls.</strong> If callers share health details, confirm the plan you would buy covers it. <A s="workforce-wave" r={refs} /> offers a HIPAA BAA on its Platform and Enterprise plans, and its security page lists SOC 2 as in progress, so ask for the current status. <A s="lindy" r={refs} /> offers a signed BAA on Enterprise.
        </p>
        <p style={para}>
          <strong>Languages.</strong> A language list does not tell you how well an agent handles accents or switching mid-call. Test the languages your callers actually use.
        </p>
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ ...h2, marginBottom: '1rem' }}>How to choose</h2>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.75rem' }}>
          {[
            { condition: 'you want to design and test your own voice agent', recommendation: <><A s="eleven-agents" r={refs} /> or <A s="voiceflow" r={refs} /></> },
            { condition: 'you want calls answered with little setup', recommendation: <><A s="workforce-wave" r={refs} /> or <A s="lindy" r={refs} /></> },
            { condition: 'you are an Australian service business that wants it fully managed', recommendation: <A s="valory-ai" r={refs} /> },
            { condition: 'you run a restaurant and need calls and reservations handled', recommendation: <A s="ringfoods" r={refs} /> },
            { condition: 'you want an agent to call warm leads from your CRM', recommendation: <A s="close-crm" r={refs} /> },
            { condition: 'you run a staffed contact center', recommendation: <><A s="talkdesk" r={refs} />, <A s="genesys-cloud" r={refs} /> or <A s="cresta" r={refs} /></> },
            { condition: 'you want live help for human agents plus a voice agent', recommendation: <A s="balto" r={refs} /> },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', gap: '1rem', padding: '0.875rem 1rem', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.5rem', alignItems: 'flex-start', flexWrap: 'wrap' as const }}>
              <span style={{ fontSize: '0.875rem', color: '#374151', flex: 1 }}>If <strong>{row.condition}</strong></span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2563EB', maxWidth: '100%' }}>&#x2192; {row.recommendation}</span>
            </div>
          ))}
        </div>
      </div>

      <h2 style={{ ...h2, marginBottom: '1rem' }}>Frequently asked questions</h2>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '1rem', marginBottom: '2.5rem' }}>
        {faqItems.map(({ q, a }) => (
          <div key={q} style={{ backgroundColor: '#F9FAFB', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1.25rem' }}>
            <p style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.5rem' }}>{t(q)}</p>
            <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.65, margin: 0 }}>{t(a)}</p>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <NewsletterSignup sourcePage="guide-best-ai-voice-agents" sourceType="guide" />
      </div>

      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/ai-customer-support-agents" style={card}>
          <p style={cardTitle}>AI customer support agents</p>
          <p style={cardSub}>Browse full category &#x2192;</p>
        </Link>
        <Link href="/resources/guides/best-ai-agents-for-customer-support" style={card}>
          <p style={cardTitle}>Best AI customer support agents</p>
          <p style={cardSub}>Full guide &#x2192;</p>
        </Link>
        <Link href="/resources/guides/best-ai-crm-agents" style={card}>
          <p style={cardTitle}>Best AI CRM agents</p>
          <p style={cardSub}>Full guide &#x2192;</p>
        </Link>
      </div>

      <p style={{ fontSize: '0.875rem', color: '#9CA3AF', lineHeight: 1.6 }}>
        All agents listed are editorially reviewed by The AI Agent Index. See our <Link href="/methodology" style={{ color: '#6B7280' }}>editorial methodology</Link>.
      </p>

      <GuideCitations slug="best-ai-voice-agents" table="guides" />
    </div>
  )
}
