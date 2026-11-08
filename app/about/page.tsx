import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { getSiteStats, categoryCountWord } from '@/lib/siteStats'
import { EDITOR, EDITOR_PERSON } from '@/lib/editor'

// Rewritten 2026-11-07 (Heather: "very transparently"). The old page said the
// index sells no badges and that affiliate status does not affect placement.
// Both stopped being true once paid reviews, Featured listings and affiliate
// banners existed, so this version says exactly what is paid for and what is not.
// Every claim here matches /methodology. Counts are computed, never typed.

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'About The AI Agent Index | Heather MacAvelia, Founder',
  description: 'Who runs The AI Agent Index, how every listing is researched and verified, and what buyers, vendors and agencies get. Ratings are never for sale.',
  alternates: { canonical: 'https://theaiagentindex.com/about' },
  openGraph: { images: [{ url: 'https://theaiagentindex.com/og-image-2026-11.png', width: 1200, height: 630 }],
    title: 'About The AI Agent Index',
    description: 'Who runs the index, how every listing is verified, and what buyers, vendors and agencies get.',
    url: 'https://theaiagentindex.com/about',
    type: 'profile',
    siteName: 'The AI Agent Index',
  },
}

const h2 = { fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginTop: '2.5rem', marginBottom: '1rem' } as const
const p = { marginBottom: '1.25rem' } as const
const li = { marginBottom: '0.5rem' } as const
const a = { color: '#2563EB' } as const

export default async function AboutPage() {
  const stats = await getSiteStats()
  const supabase = createClient()
  const { count: agencyCount } = await supabase
    .from('agencies')
    .select('slug', { count: 'exact', head: true })
    .eq('is_active', true)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About The AI Agent Index',
    url: 'https://theaiagentindex.com/about',
    description: 'Who runs The AI Agent Index, how every listing is verified, and what buyers, vendors and agencies get.',
    mainEntity: EDITOR_PERSON,
    publisher: { '@type': 'Organization', name: 'The AI Agent Index', url: 'https://theaiagentindex.com' },
  }

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB', padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6B7280', marginBottom: '1.5rem' }}>
            <Link href="/" style={{ color: '#6B7280', textDecoration: 'none' }}>Home</Link>
            <span style={{ color: '#D1D5DB' }}>/</span>
            <span style={{ color: '#111827' }}>About</span>
          </nav>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            About The AI Agent Index
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#374151', lineHeight: 1.6, margin: 0 }}>
            The AI Agent Index helps businesses choose AI agents with confidence, and helps the companies that build them reach buyers who are ready to decide.
            {stats ? <> {stats.agents.toLocaleString('en-US')} agents across {categoryCountWord()} categories</> : null}
            {agencyCount ? <>, plus {agencyCount} AI automation agencies</> : null}{stats || agencyCount ? ', each checked against the vendor\'s own pages.' : null}
          </p>
        </div>
      </section>

      <section style={{ padding: '3rem 1.5rem 5rem' }}>
        <article style={{ maxWidth: '720px', margin: '0 auto', fontSize: '1rem', color: '#374151', lineHeight: 1.7 }}>

          <h2 id="heather" style={{ ...h2, marginTop: 0, scrollMarginTop: '5rem' }}>Who runs it</h2>
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            {EDITOR.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={EDITOR.image} alt={EDITOR.name} width={112} height={112} style={{ borderRadius: '9999px', objectFit: 'cover', flexShrink: 0 }} />
            )}
            <div style={{ flex: 1, minWidth: '240px' }}>
              <p style={{ margin: '0 0 0.25rem', fontWeight: 700, color: '#111827', fontSize: '1.125rem' }}>{EDITOR.name}</p>
              <p style={{ margin: '0 0 0.75rem', color: '#6B7280', fontSize: '0.9375rem' }}>Founder and editor · Ontario, Canada · <a href={EDITOR.linkedin} target="_blank" rel="me noopener noreferrer" style={a}>LinkedIn</a></p>
              <p style={{ margin: '0 0 1rem' }}>
                I&apos;m Heather. I have a degree in economics, I worked as a corporate accountant, and I&apos;ve spent more than ten years in performance marketing, mostly paid acquisition and search. Accounting taught me that every number has to tie back to a source. Marketing taught me how much of what buyers read is written to sell rather than to inform.
              </p>
              <p style={{ margin: 0 }}>
                I built The AI Agent Index to be the resource I wanted when evaluating software: one place where the pricing, features and fine print have actually been checked, and where a rating means something because it can&apos;t be bought. I direct every audit and make every editorial decision on this site.
              </p>
            </div>
          </div>

          <h2 style={h2}>How we research every listing</h2>
          <p style={p}>
            Each audit starts from the details the vendor submits and then goes to the source: the vendor&apos;s own pricing, product, security and legal pages, plus review sites such as G2, Capterra and Product Hunt. AI research tools help us cover more ground in less time, and I decide what is published. Nothing goes live until it ties back to a page you could check yourself. If a vendor&apos;s pages contradict each other, we leave the claim out instead of guessing.
          </p>
          <p style={p}>
            Every listing shows the date it was last verified. Listings with a paid placement or an affiliate relationship are re-checked every 14 days, so the details stay current as products change. Changes are logged on the public <Link href="/changelog" style={a}>changelog</Link>, and the scoring rules are on the <Link href="/methodology" style={a}>methodology</Link> page.
          </p>

          <h2 style={h2}>What buyers get</h2>
          <ul style={{ marginBottom: '1.25rem', paddingLeft: '1.5rem' }}>
            <li style={li}><strong>Checked pricing.</strong> Starting prices, billing terms and what the entry plan actually includes, verified on the vendor&apos;s site.</li>
            <li style={li}><strong>Ratings that can&apos;t be bought.</strong> Editorial ratings come from evidence: reviews, integrations, pricing transparency, security and how much the agent really does on its own.</li>
            <li style={li}><strong>The details that decide a purchase.</strong> Contract terms, whether your data trains their models, MCP support, security certifications and integrations, side by side.</li>
            <li style={li}><strong>Help choosing.</strong> Head-to-head <Link href="/compare" style={a}>comparisons</Link>, <Link href="/alternatives" style={a}>alternatives</Link> pages, buying <Link href="/resources/guides" style={a}>guides</Link>, and a directory of <Link href="/ai-automation-agencies" style={a}>AI automation agencies</Link> when you want someone to build and run it for you.</li>
          </ul>

          <h2 style={h2}>What vendors and agencies get</h2>
          <p style={p}>
            Buyers come here when they are comparing options, from Google and increasingly from AI assistants: our pages are cited by Microsoft Copilot and appear in Google&apos;s AI Overviews. A listing here puts your product in front of people at the moment they are deciding.
          </p>
          <ul style={{ marginBottom: '1.25rem', paddingLeft: '1.5rem' }}>
            <li style={li}><strong>Free listing.</strong> Any AI agent or agency that fits the index can be listed at no cost.</li>
            <li style={li}><strong>Editorial Review ($39 once).</strong> A full audit within 3 business days, a followed link to your site, and an editorial rating once the evidence supports one.</li>
            <li style={li}><strong>Featured Listing, Comparison Placement and Own the Category.</strong> Placement on the pages where buyers compare you with competitors, from your own listing to the top of your category, with re-checks every 14 days so your listing stays accurate. See <Link href="/advertise" style={a}>Advertise</Link>.</li>
            <li style={li}><strong>For agencies:</strong> a paid review with the &quot;Independently Reviewed&quot; badge, and Agency Spotlight placement next to the tools you work with. See <Link href="/advertise/agencies" style={a}>agency advertising</Link>.</li>
          </ul>
          <p style={p}>
            Paid placements and affiliate links are always labeled, and paying never changes a rating or what an audit finds. That is exactly why a placement here is worth having: buyers trust what they read, so they act on it.
          </p>

          <h2 style={h2}>Use the data</h2>
          <ul style={{ marginBottom: '1.25rem', paddingLeft: '1.5rem' }}>
            <li style={li}><strong>Public API:</strong> <Link href="/api/agents" style={a}>/api/agents</Link> returns every active agent as JSON.</li>
            <li style={li}><strong>MCP server:</strong> <code style={{ background: '#F3F4F6', padding: '0.125rem 0.375rem', borderRadius: '0.25rem', fontSize: '0.9em' }}>https://theaiagentindex.com/mcp/mcp</code> lets AI assistants search agents and agencies directly.</li>
            <li style={li}><strong>llms.txt:</strong> <Link href="/llms.txt" style={a}>/llms.txt</Link> gives AI crawlers an overview of the site.</li>
          </ul>
          <p style={p}>If you cite the index, please link back. If you build on the data, no permission is needed.</p>

          <h2 style={h2}>Contact and corrections</h2>
          <ul style={{ marginBottom: '1.25rem', paddingLeft: '1.5rem' }}>
            <li style={li}>Email: <a href="mailto:hello@theaiagentindex.com" style={a}>hello@theaiagentindex.com</a></li>
            <li style={li}>Vendors: send updates or corrections to the email above with a link to the page that shows the change, and we will check it on your site.</li>
            <li style={li}>List your product: <Link href="/submit" style={a}>submit an agent</Link> · <Link href="/submit-agency" style={a}>submit an agency</Link></li>
          </ul>

        </article>
      </section>
    </div>
  )
}
