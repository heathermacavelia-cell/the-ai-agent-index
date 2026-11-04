import Link from 'next/link'
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
const GUIDE_SLUGS = ['adcreative-ai', 'agent-opus', 'invideo', 'luma-agents', 'lumen5', 'opus-clip', 'superscale', 'vidyard']

// The agents this guide lists, in this order, under the guide's four types.
// Chosen 2026-11-03. Order is editorial, not a ranking. Free listings are left out.
// Every plan fact below was read on the vendor page 2026-11-03.
const GUIDE_GROUPS: GuideGroup[] = [
  {
    heading: 'Make a video from a brief',
    intro: 'Agents that plan and produce a finished video from an idea, script or references.',
    slugs: ['invideo', 'agent-opus', 'luma-agents'],
  },
  {
    heading: 'Repurpose what you already have',
    intro: 'Tools that turn blogs, documents and long recordings into shorter videos.',
    slugs: ['lumen5', 'opus-clip'],
  },
  {
    heading: 'Video ads',
    intro: 'Tools built around paid social, with video as one of the ad formats.',
    slugs: ['adcreative-ai', 'superscale'],
  },
  {
    heading: 'Video for sales and B2B teams',
    intro: 'A platform for personal video messages, AI avatars and video analytics.',
    slugs: ['vidyard'],
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


const META_DESCRIPTION = 'Make, clip and repurpose marketing video with AI: Invideo, Luma, Lumen5, Opus Clip, AdCreative and Vidyard. Credits, limits and disclosure rules compared.'

export const metadata: Metadata = {
  title: 'Best AI Video Agents for Marketing: Invideo, Opus and More (2026)',
  description: META_DESCRIPTION,
  openGraph: {
    images: [{ url: 'https://theaiagentindex.com/og-image.png', width: 1200, height: 630 }],
    title: 'Best AI Video Agents for Marketing: Invideo, Opus and More (2026)',
    description: META_DESCRIPTION,
    url: 'https://theaiagentindex.com/resources/guides/best-ai-video-marketing-agents',
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://theaiagentindex.com/og-image.png'],
    title: 'Best AI Video Agents for Marketing: Invideo, Opus and More (2026)',
    description: META_DESCRIPTION,
  },
  alternates: {
    canonical: 'https://theaiagentindex.com/resources/guides/best-ai-video-marketing-agents',
  },
}

// Prices are not shown here: the cards carry live pricing.
const comparisonRows = [
  { slug: 'invideo', start: 'Paid plans, no free plan listed', ai: 'Monthly credits per seat, and unused credits do not roll over' },
  { slug: 'agent-opus', start: 'Free plan with 60 credits a month', ai: 'Credits, charged by mode, model and length' },
  { slug: 'luma-agents', start: 'Paid plans, no free plan listed', ai: 'Monthly credits, and cost rises with resolution and length' },
  { slug: 'lumen5', start: 'Free plan, paid plans billed yearly', ai: 'Plan fee, with yearly limits on AI voice and animation minutes' },
  { slug: 'opus-clip', start: 'Free trial, no card', ai: 'Monthly credits, and they roll over for 2 months on Pro' },
  { slug: 'adcreative-ai', start: 'Free trial, then paid plans', ai: 'Monthly credits, and product videos start on Professional' },
  { slug: 'superscale', start: 'Get started free, then paid plans', ai: 'Monthly credits with a cap on AI generations' },
  { slug: 'vidyard', start: 'Free plan with 15 AI videos, no card', ai: 'Per seat, with Video Agent as a paid add-on' },
]

const faqItems = [
  {
    q: 'What is the best AI video tool for marketing in 2026?',
    a: 'It depends on what you start with. {{invideo.name}} and {{luma-agents.name}} suit making new video from a brief, {{lumen5.name}} and {{opus-clip.name}} suit turning existing content into video, {{adcreative-ai.name}} and {{superscale.name}} suit paid social, and {{vidyard.name}} suits sales teams. Make the same 30-second video in two tools and compare the result and the credits used.',
  },
  {
    q: 'Do I have to label AI-generated marketing videos?',
    a: 'Often, yes, depending on where the video runs and what it shows. In the EU, anyone using AI to make a deepfake must disclose it under Article 50 of the AI Act, which applies from August 2, 2026. YouTube requires disclosure of realistic AI-generated or altered content. Check each ad platform too, and ask a lawyer about anything sensitive.',
  },
  {
    q: 'Can I use an AI avatar as a customer testimonial?',
    a: 'No. The US FTC rule on fake reviews and testimonials covers testimonials that misrepresent they come from someone who does not exist or who has no real experience of the product. An AI avatar reading a made-up customer story fits that description. A real customer who agreed to the wording is a different matter, but disclose the production if it could mislead.',
  },
  {
    q: 'How far do the credits go?',
    a: 'It depends on what you make. Longer clips, higher resolution and premium models all cost more, and regenerating a scene costs credits again. On {{luma-agents.name}}, a 5-second 1080p Ray3.2 clip costs 400 credits and a 720p clip costs 100. Before you pay, work out your cost per finished video, including retries.',
  },
  {
    q: 'Can I clone a voice or use someone else as an avatar?',
    a: 'Only with their clear permission, in writing, and covering how the clone will be used and for how long. {{lumen5.name}} includes voice clones on Starter and Pro, and {{vidyard.name}} includes custom avatars. Clone your own voice or a colleague who has agreed, and never a public figure.',
  },
]

export default async function BestAiVideoMarketingAgentsPage() {
  const meta = await getGuideMeta('best-ai-video-marketing-agents')
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
    image: 'https://theaiagentindex.com/og-image.png',
    headline: 'Best AI Video Agents for Marketing: Invideo, Opus and More (2026)',
    description: META_DESCRIPTION,
    url: 'https://theaiagentindex.com/resources/guides/best-ai-video-marketing-agents',
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
      name: t(q),
      acceptedAnswer: { '@type': 'Answer', text: t(a) },
    })),
  }

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Best AI Video Agents for Marketing (2026)',
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
        <span style={{ fontSize: '0.8125rem', color: '#111827' }}>Best AI video agents for marketing</span>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' as const }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Guide</span>
        {updated && <span style={{ fontSize: '0.75rem', color: '#6B7280', padding: '0.25rem 0.75rem', backgroundColor: '#F3F4F6', borderRadius: '9999px' }}>{updated}</span>}
        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '0.25rem 0.75rem', borderRadius: '9999px', border: '1px solid #BFDBFE' }}>Independently Reviewed</span>
      </div>

      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
        Best AI video agents for marketing (2026)
      </h1>

      <p style={{ fontSize: '1.0625rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '0.75rem' }}>
        AI video agents turn a brief, a blog post or a long recording into finished marketing video. Some generate every shot, some cut what you already have, and some are built around ads. This guide covers {listed.length} tools, grouped by what you start with.
      </p>
      <p style={{ fontSize: '0.9375rem', color: '#6B7280', lineHeight: 1.7, marginBottom: '1.75rem' }}>
        Making a video is now the easy part. The differences show up in what each finished video costs in credits, how much control you have over the result, and what you have to disclose when you publish it.
      </p>

      <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#0369A1', lineHeight: 1.6, margin: 0 }}>
          <strong>Quick recommendation:</strong> To make a new video from a brief, try <A s="invideo" r={refs} /> or <A s="luma-agents" r={refs} />. To reuse content you already have, try <A s="lumen5" r={refs} /> or <A s="opus-clip" r={refs} />. For paid social ads, look at <A s="adcreative-ai" r={refs} />.
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

      <h2 style={h2}>What to check before you publish</h2>
      <div style={{ marginBottom: '3rem' }}>
        <p style={para}>
          <strong>Disclosure.</strong> Under Article 50 of the EU AI Act, people who use AI to make a deepfake must disclose it, and that duty applies from August 2, 2026. YouTube requires creators to disclose realistic AI-generated or altered content, and says repeat non-disclosure can lead to removal or suspension from its Partner Program.
        </p>
        <p style={para}>
          <strong>Testimonials.</strong> The US FTC rule on fake reviews and testimonials covers testimonials from people who do not exist or never used the product. Keep AI avatars out of customer stories unless a real customer gave the story and agreed to the format.
        </p>
        <p style={para}>
          <strong>Faces and voices.</strong> Get written permission before you clone anyone, including staff who might later leave. Agree what happens to the clone when they do.
        </p>
        <p style={para}>
          <strong>Credits.</strong> Regenerating or editing a video uses credits too. <A s="invideo" r={refs} /> says unused credits do not roll over and that it can change credit costs, so budget per finished video rather than per month.
        </p>
        <p style={para}>
          <strong>Commercial rights.</strong> Check that your plan allows commercial use and read how it treats stock, music and third-party models. The terms can differ by plan and by model.
        </p>
        <p style={para}>
          <strong>Data training.</strong> Footage and scripts can contain customer or unreleased product details. Policies differ by vendor and plan, and each listing shows its data training status.
        </p>
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ ...h2, marginBottom: '1rem' }}>How to choose</h2>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.75rem' }}>
          {[
            { condition: 'you want a finished video from a brief or script', recommendation: <><A s="invideo" r={refs} /> or <A s="agent-opus" r={refs} /></> },
            { condition: 'you want agents working with several image and video models', recommendation: <A s="luma-agents" r={refs} /> },
            { condition: 'you want to turn blog posts and documents into video', recommendation: <A s="lumen5" r={refs} /> },
            { condition: 'you want short clips from long videos', recommendation: <A s="opus-clip" r={refs} /> },
            { condition: 'you run paid social and want ads at volume', recommendation: <><A s="adcreative-ai" r={refs} /> or <A s="superscale" r={refs} /></> },
            { condition: 'you want personal video in sales outreach', recommendation: <A s="vidyard" r={refs} /> },
            { condition: 'you want agents for the rest of your marketing', recommendation: <Link href="/resources/guides/best-ai-agents-for-marketing-teams" style={AGENT_LINK_STYLE}>Best AI agents for marketing teams</Link> },
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
        <NewsletterSignup sourcePage="guide-best-ai-video-marketing-agents" sourceType="guide" />
      </div>

      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/ai-marketing-agents" style={card}>
          <p style={cardTitle}>AI marketing agents</p>
          <p style={cardSub}>Browse full category &#x2192;</p>
        </Link>
        <Link href="/resources/guides/best-ai-agents-for-marketing-teams" style={card}>
          <p style={cardTitle}>Best AI agents for marketing teams</p>
          <p style={cardSub}>Full guide &#x2192;</p>
        </Link>
        <Link href="/resources/guides/best-ai-voice-agents" style={card}>
          <p style={cardTitle}>Best AI voice agents</p>
          <p style={cardSub}>Full guide &#x2192;</p>
        </Link>
      </div>

      <p style={{ fontSize: '0.875rem', color: '#9CA3AF', lineHeight: 1.6 }}>
        All agents listed are editorially reviewed by The AI Agent Index. See our <Link href="/methodology" style={{ color: '#6B7280' }}>editorial methodology</Link>.
      </p>

      <GuideCitations slug="best-ai-video-marketing-agents" table="guides" />
    </div>
  )
}
