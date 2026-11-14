import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { getSiteStats, getCatalogRows, categoryCountWord } from '@/lib/siteStats'
import { EDITOR, EDITOR_PERSON } from '@/lib/editor'

// Rewritten 2026-11-07 (Heather: "very transparently"), then 2026-11-14 (Heather: the
// site must explain the work that goes into each listing, why buyers should shop
// here and why vendors should list here). The 11-14 version also fixes three
// claims that were not true for every listing: "each checked against the vendor's
// own pages" and "every listing shows the date it was last verified" (unaudited
// free listings show "Not yet audited" instead), and "each audit starts from the
// details the vendor submits" (a submission is evidence, not the starting point).
// Every claim here matches /methodology. Counts are computed, never typed.

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'About The AI Agent Index | Heather MacAvelia, Founder',
  description: 'Who runs The AI Agent Index, what goes into every audited listing, and why buyers shop here and vendors list here. Ratings are never for sale.',
  alternates: { canonical: 'https://theaiagentindex.com/about' },
  openGraph: { images: [{ url: 'https://theaiagentindex.com/og-image-2026-11.png', width: 1200, height: 630 }],
    title: 'About The AI Agent Index',
    description: 'Who runs the index, what goes into every audited listing, and what buyers, vendors and agencies get.',
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
  const rows = await getCatalogRows()
  const now = Date.now()
  const audited = rows ? rows.filter(r => r.last_verified_at).length : null
  const audited30 = rows ? rows.filter(r => r.last_verified_at && Date.parse(r.last_verified_at) >= now - 30 * 86400000).length : null
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
    description: 'Who runs The AI Agent Index, what goes into every audited listing, and what buyers, vendors and agencies get.',
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
            The AI Agent Index is an independent research index of business AI agents. It helps businesses shortlist on checked facts, and it gives the companies that build those agents a listing that buyers, and the AI assistants buyers ask, can rely on.
            {stats ? <> {stats.agents.toLocaleString('en-US')} agents across {categoryCountWord()} categories</> : null}
            {stats && audited ? <>, {audited.toLocaleString('en-US')} of them audited against the vendor&apos;s own pages and dated</> : null}
            {agencyCount ? <>, plus {agencyCount} AI automation agencies</> : null}{stats || agencyCount ? '.' : null}
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

          <h2 id="audit" style={{ ...h2, scrollMarginTop: '5rem' }}>What goes into an audited listing</h2>
          <p style={p}>
            An audited listing usually takes hours of reading, not minutes. Most of that time goes into pages a buyer would rarely think to open, because that is where plan limits, pricing caveats, scheduled retirements and data terms tend to live. Every audit works through the same sequence:
          </p>
          <ol style={{ marginBottom: '1.25rem', paddingLeft: '1.5rem' }}>
            <li style={li}><strong>Our own record first.</strong> We read everything the listing currently says, field by field, and treat every figure in it as a claim to re-check rather than a fact to keep.</li>
            <li style={li}><strong>Pricing, every way it is shown.</strong> Each billing toggle and plan tab, so the listing can give both the monthly and the annual price, what the entry plan leaves out, and which plan a capability actually sits on.</li>
            <li style={li}><strong>The product itself.</strong> Product pages, documentation, the help centre and developer docs, including the full integrations list as the vendor publishes it, not a sample.</li>
            <li style={li}><strong>What has changed.</strong> The changelog, release notes, blog, newsroom and investor releases, where launches, price changes, acquisitions and retirements usually appear first. Each change we confirm is logged on the public <Link href="/changelog" style={a}>changelog</Link> under the vendor&apos;s own date.</li>
            <li style={li}><strong>Security, privacy and terms.</strong> Trust portals, the terms of service, privacy policy and data processing addendum, read for certifications and for whether customer data is used to train the vendor&apos;s models, in the vendor&apos;s own words.</li>
            <li style={li}><strong>Independent evidence.</strong> G2, Capterra, Trustpilot, Product Hunt and the app stores are read for review counts and ratings. They inform the rating. They are never the source of a product fact.</li>
            <li style={li}><strong>Every copy of a fact.</strong> A price or feature can appear on comparison pages, alternatives pages, guides and the changelog as well as on the listing. When it changes, every copy changes in the same pass.</li>
            <li style={li}><strong>The source record and the live check.</strong> Each published fact is tied to the page it was read on and the date it was read. Listings now show those sources on the page as each one is re-audited. Nothing counts as done until the change has been checked on the live page.</li>
          </ol>
          <p style={p}>
            AI research tools help us read more pages in less time. Every fact they surface is confirmed on the vendor&apos;s own page before it is published, and I make every editorial decision.
          </p>
          <p style={p}>
            A re-audit repeats the whole sequence. It is not a scan for what changed, because a fact nobody re-reads is exactly the kind that goes stale. The checklist behind it is written down, and most of its rules exist because we once got something wrong and worked out how it happened. When a reader or a vendor shows us an error, the listing is corrected and the checklist gains the step that would have caught it.
          </p>
          <p style={p}>
            {audited30 ? <>{audited30.toLocaleString('en-US')} listings were audited in the last 30 days. </> : null}A listing we have not audited is labeled &quot;Not yet audited&quot; and carries no rating, so you always know which kind of page you are reading. The full rules are on the <Link href="/methodology" style={a}>methodology</Link> page.
          </p>

          <h2 style={h2}>Why buyers shop here</h2>
          <ul style={{ marginBottom: '1.25rem', paddingLeft: '1.5rem' }}>
            <li style={li}><strong>The same facts for every agent.</strong> Each audited listing answers the same questions, so you compare like with like: price on each billing term, what the entry plan leaves out, contract terms, whether your data trains their models, security certifications, MCP support, integrations and how much the agent does on its own.</li>
            <li style={li}><strong>Dates you can check.</strong> Every audited listing shows the day it was last verified. Listings with a paid placement or an affiliate relationship are re-checked every 14 days, and the date tells you how current any other listing is.</li>
            <li style={li}><strong>A rating that is arithmetic, not opinion.</strong> One published formula with five sub-scores, all shown on the listing. Paying cannot change it.</li>
            <li style={li}><strong>Honesty about gaps.</strong> Where a vendor does not publish something, the listing says so instead of estimating it. Where its own pages disagree, we leave the claim out or state both.</li>
            <li style={li}><strong>Help choosing.</strong> Head-to-head <Link href="/compare" style={a}>comparisons</Link>, <Link href="/alternatives" style={a}>alternatives</Link> pages, buying <Link href="/resources/guides" style={a}>guides</Link>, and a directory of <Link href="/ai-automation-agencies" style={a}>AI automation agencies</Link> when you want someone to build and run it for you.</li>
          </ul>

          <h2 style={h2}>Why vendors list here</h2>
          <p style={p}>
            Buyers reach these pages when they are comparing named products, from search and increasingly through AI assistants: our pages are cited by Microsoft Copilot and appear in Google&apos;s AI Overviews. Behind every page sits structured data, a public API and an MCP server, so an assistant reading your listing gets typed facts rather than marketing copy to interpret. What it repeats about your product is only as accurate as the last time somebody checked, and keeping it checked is the work we do.
          </p>
          <ul style={{ marginBottom: '1.25rem', paddingLeft: '1.5rem' }}>
            <li style={li}><strong>Free listing.</strong> Any AI agent or agency that fits the index can be listed at no cost. A free agent listing gets a lighter check of the basics, and the page says so.</li>
            <li style={li}><strong>Editorial Review ($39 once).</strong> The full audit described above within 3 business days, a followed link to your site, and an editorial rating once the evidence supports one.</li>
            <li style={li}><strong>Featured Listing, Comparison Placement and Own the Category.</strong> Each includes the full audit, a re-audit every 14 days and a report after each re-check, plus placement where buyers compare you with competitors, from your own listing to the top of your category. See <Link href="/advertise" style={a}>Advertise</Link>.</li>
            <li style={li}><strong>For agencies:</strong> a paid review with the &quot;Independently Reviewed&quot; badge, and Agency Spotlight placement next to the tools you work with. See <Link href="/advertise/agencies" style={a}>agency advertising</Link>.</li>
          </ul>
          <p style={p}>
            Paid placements and affiliate links are always labeled, and paying never changes a rating or what an audit finds. That independence is what makes a placement worth having: buyers believe what sits next to it.
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
            <li style={li}>Vendors: if something on your listing is out of date, email us a link to the page that shows the change and we will check it on your site.</li>
            <li style={li}>List your product: <Link href="/submit" style={a}>submit an agent</Link> · <Link href="/submit-agency" style={a}>submit an agency</Link></li>
          </ul>

        </article>
      </section>
    </div>
  )
}
