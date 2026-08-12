// app/resources/newsletter/2026-08-12/page.tsx
// Newsletter Issue #3: static, dated, frozen archive copy.
// Prices are a point-in-time snapshot (verified August 12, 2026) and are
// intentionally NOT templated: an archived issue must not silently rewrite
// itself later. Do not convert these to {{slug.starting_price}}.
// Uses inline styles to match the site convention (see resources/newsletter/page.tsx).
// No em dashes anywhere (house style).

import type { Metadata } from 'next'

const ISSUE_URL = 'https://theaiagentindex.com/resources/newsletter/2026-08-12'
const TITLE = 'Price & Rating Tracker: Issue #3 (August 2026)'
const DESC =
  'Rippling, Respond.io, Pipecorn and CampaignStack shipped MCP servers. Jasper raised Pro to $59 a seat, and Kilo Code announced a 5% fee that has not started. Verified against live vendor data.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: ISSUE_URL },
  openGraph: { title: TITLE, description: DESC, url: ISSUE_URL, type: 'article', siteName: 'The AI Agent Index' },
  twitter: { card: 'summary', title: TITLE, description: DESC },
}

const sectionLabel: React.CSSProperties = {
  fontSize: '0.75rem', fontWeight: 700, color: '#16A34A', textTransform: 'uppercase',
  letterSpacing: '0.06em', borderBottom: '2px solid #16A34A', paddingBottom: '0.375rem',
  marginTop: '2.25rem', marginBottom: '1rem',
}
const body: React.CSSProperties = { fontSize: '0.9375rem', lineHeight: 1.65, color: '#374151', margin: 0 }
const lede: React.CSSProperties = { fontSize: '0.9375rem', fontWeight: 700, color: '#111827', margin: '1.25rem 0 0.25rem' }
const linkBlue: React.CSSProperties = { color: '#2563EB', textDecoration: 'underline' }
const note: React.CSSProperties = {
  fontSize: '0.875rem', lineHeight: 1.6, color: '#4B5563', margin: 0,
  background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '0.875rem 1rem',
}

export default function NewsletterIssue03() {
  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>
      <a href="/resources/newsletter" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', marginBottom: '1.5rem', display: 'inline-block' }}>&larr; Newsletter</a>

      {/* Masthead */}
      <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>The AI Agent Index</p>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#111827', margin: '0 0 0.375rem', letterSpacing: '-0.02em' }}>Price &amp; Rating Tracker</h1>
      <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '1rem' }}>Issue #3 &middot; August 12, 2026</div>
      <p style={{ ...body, marginBottom: '0.5rem' }}>
        Every two weeks we read the pricing pages so you don&rsquo;t have to, and publish what actually changed across <a href="/" style={linkBlue}>the full index</a>. When a company won&rsquo;t say when it changed something, we tell you that instead of picking a date that looks tidy.
      </p>
      <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: 0, paddingBottom: '1.25rem', borderBottom: '1px solid #E5E7EB' }}>
        Prices below are a snapshot verified on August 12, 2026, and are not updated after publication.
      </p>

      {/* THE HEADLINE */}
      <div style={sectionLabel}>The Headline</div>
      <h2 style={{ fontSize: '1.3125rem', lineHeight: 1.3, fontWeight: 800, color: '#111827', margin: '0 0 0.875rem' }}>Four platforms shipped MCP servers in two weeks</h2>
      <p style={{ ...body, marginBottom: '0.875rem' }}>
        An MCP server lets other AI tools plug straight into a product and use its features, instead of a developer wiring up every API call by hand. Four listings gained one this cycle, and in two cases the tools on offer can write and send rather than only read.
      </p>

      <p style={lede}><a href="/agents/rippling" style={linkBlue}>Rippling</a></p>
      <p style={body}>
        Rippling now has its own MCP server. It also sells something that is easy to mistake for the same thing: an MCP Gateway, part of its IT product, which lets an admin control which MCP servers their staff are allowed to reach. Rippling has not said when either one launched, and the documentation sits behind a login, so we date this to when we found it, in July 2026.
      </p>

      <p style={lede}><a href="/agents/respond-io" style={linkBlue}>Respond.io</a></p>
      <p style={body}>
        Its developer site documents an MCP server that Claude Desktop, ChatGPT and Cursor can connect to, with tools including get_contact, send_message and create_comment, over both HTTP and STDIO. Those last two send and write rather than just read, which is worth knowing before you point an AI assistant at a live customer inbox. No launch date is published here either, so again, July 2026, when we found it.
      </p>

      <p style={lede}><a href="/agents/pipecorn" style={linkBlue}>Pipecorn</a> (new listing)</p>
      <p style={{ ...body, marginBottom: '0.875rem' }}>
        A B2B contact data platform, formerly ProntoHQ, that runs a lead through more than 100 data providers one after another until it finds a verified email or mobile number. It has an MCP server, and a free plan that works without a card.
      </p>
      <p style={body}>
        Its pricing page needs a warning. The cheapest paid tier is <strong>$41 a month billed yearly, or $49 if you pay monthly</strong>, but only at its smallest size of 3,000 credits a month. The page loads showing a 6,000 credit version instead, at $83 or $99. Same tier, different volume, and all four prices are real. Check which one you are looking at before you compare it to anything.
      </p>

      <p style={lede}><a href="/agents/campaignstack" style={linkBlue}>CampaignStack</a> (new listing)</p>
      <p style={body}>
        LinkedIn and email outbound, built for lead generation agencies. It ships an MCP server with a documented set of tools. Pricing is per workspace rather than per seat, from $82 a month on annual billing, and there is a free tier.
      </p>

      {/* PRICE CHANGES */}
      <div style={sectionLabel}>Price Changes</div>

      <p style={lede}><a href="/agents/jasper" style={linkBlue}>Jasper</a> put Pro up $10 on both terms</p>
      <p style={{ ...body, marginBottom: '0.875rem' }}>
        Pay yearly and Pro is now <strong>$59 per seat per month</strong>, up from $49. Pay monthly and it is <strong>$69</strong>, up from $59. Business remains quote only. Jasper does not say when the change happened, so we date it to August 2026.
      </p>
      <p style={{ ...body, color: '#6B7280' }}>
        Ignore the badge on the billing toggle. It advertises around 20% off for paying yearly, but $59 against $69 is 14.5%.
      </p>

      <p style={lede}><a href="/agents/kilo-code" style={linkBlue}>Kilo Code</a> is adding a 5% fee, but not yet</p>
      <p style={{ ...body, marginBottom: '0.875rem' }}>
        Kilo will charge a 5% processing fee when you top up credits by card, and will start billing for cloud compute time while your machine is awake. Kilo&rsquo;s own wording is that this begins <strong>September 1, 2026 &quot;at the earliest&quot;</strong>, and that anything you buy or use before then is unaffected. We keep the &quot;at the earliest&quot; because Kilo wrote it, and it means the date can slip.
      </p>
      <p style={{ ...body, color: '#6B7280' }}>
        Confusingly, the comparison table further down that same page already lists the 5% fee against all three plans, as though it were live. Kilo Code itself remains free for individuals.
      </p>

      {/* ALSO WORTH KNOWING */}
      <div style={sectionLabel}>Also Worth Knowing</div>
      <p style={{ ...body, marginBottom: '0.875rem' }}>
        <a href="/agents/cursor" style={linkBlue}>Cursor</a> added Google Workspace Plugins on August 3, 2026, giving its coding agents direct access to Gmail, Drive and Calendar. Read the scope before you switch it on: as well as searching and reading, the plugins can draft and send mail, manage threads and create calendar events.
      </p>
      <p style={body}>
        <a href="/agents/perplexity-ai" style={linkBlue}>Perplexity</a> added shared workspaces with shared files, Personal Computer for Windows, a Model Council mode for comparing answers side by side, and the Kimi K3 model, dated August 4, 2026 in its changelog.
      </p>

      {/* RATINGS */}
      <div style={sectionLabel}>Ratings</div>
      <p style={note}>
        <strong>No rating changes this issue.</strong> We went back over a lot of listings in the past two weeks, and none of it turned up a rating change caused by something a vendor actually did. We do adjust our own scores as we learn more about a product, but that is us getting better rather than a company getting better, so we do not report it as news. Our <a href="/methodology" style={linkBlue}>methodology</a> explains how the scores are built.
      </p>

      {/* FOOTER */}
      <p style={{ fontSize: '0.8125rem', lineHeight: 1.6, color: '#6B7280', marginTop: '2.5rem', paddingTop: '1.25rem', borderTop: '1px solid #E5E7EB' }}>
        Every price here is in US dollars and was read on the vendor&rsquo;s own site on August 12, 2026. This page is a frozen archive copy and is not updated afterwards, so check the current listing before you buy. Listings are free and editorial. Advertising never changes a rating or a ranking. No vendor in this issue is an affiliate or a paid placement.
      </p>
    </div>
  )
}