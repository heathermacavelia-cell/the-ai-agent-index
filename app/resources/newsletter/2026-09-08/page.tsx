// app/resources/newsletter/2026-09-08/page.tsx
// Newsletter Issue #4: static, dated, frozen archive copy.
// Prices are a point-in-time snapshot (verified September 8, 2026) and are
// intentionally NOT templated: an archived issue must not silently rewrite
// itself later. Do not convert these to {{slug.starting_price}}.
// Uses inline styles to match the site convention (see resources/newsletter/page.tsx).
// No em dashes anywhere (house style).
// NOTE: unlike issues #1 to #3, this issue contains a paid placement and an
// affiliate link (hubspot-sales-hub). The disclosure appears inline in the
// price section as well as in the footer. Do not copy issue #3's footer here.

import type { Metadata } from 'next'

const ISSUE_URL = 'https://theaiagentindex.com/resources/newsletter/2026-09-08'
const TITLE = 'Price & Rating Tracker: Issue #4 (September 2026)'
const DESC =
  'Salesloft has retired the Clari brand and clari.com redirects on September 15. HubSpot raised Sales Hub Starter on both terms. Gemini Spark and Tycoon added MCP, and Copilot Business opened up. Verified against live vendor data.'

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
const alertNote: React.CSSProperties = {
  fontSize: '0.9375rem', lineHeight: 1.6, color: '#374151', margin: '1rem 0 0',
  background: '#FEF7F7', border: '1px solid #F0D5D5', borderRadius: '8px', padding: '0.875rem 1rem',
}
const th: React.CSSProperties = {
  textAlign: 'left', fontSize: '0.6875rem', fontWeight: 700, color: '#6B7280',
  textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0.5rem 0.75rem',
  borderBottom: '1px solid #E5E7EB', background: '#F9FAFB',
}
const td: React.CSSProperties = {
  fontSize: '0.875rem', color: '#374151', padding: '0.75rem', borderBottom: '1px solid #F3F4F6',
}

export default function NewsletterIssue04() {
  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>
      <a href="/resources/newsletter" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', marginBottom: '1.5rem', display: 'inline-block' }}>&larr; Newsletter</a>

      {/* Masthead */}
      <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>The AI Agent Index</p>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#111827', margin: '0 0 0.375rem', letterSpacing: '-0.02em' }}>Price &amp; Rating Tracker</h1>
      <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '1rem' }}>Issue #4 &middot; September 8, 2026</div>
      <p style={{ ...body, marginBottom: '0.5rem' }}>
        We read the pricing pages so you don&rsquo;t have to, and publish what actually changed across <a href="/" style={linkBlue}>the full index</a>. When a company won&rsquo;t say when it changed something, we tell you that instead of picking a date that looks tidy.
      </p>
      <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: 0, paddingBottom: '1.25rem', borderBottom: '1px solid #E5E7EB' }}>
        Prices below are a snapshot verified on September 8, 2026, and are not updated after publication. This issue covers everything since our last issue on August 12.
      </p>

      {/* THE HEADLINE */}
      <div style={sectionLabel}>The Headline</div>
      <h2 style={{ fontSize: '1.3125rem', lineHeight: 1.3, fontWeight: 800, color: '#111827', margin: '0 0 0.875rem' }}>Salesloft has retired the Clari brand</h2>
      <p style={{ ...body, marginBottom: '0.875rem' }}>
        Nine months after the merger closed, Salesloft has put both companies under one name. If you bought Clari, the product you use is still there, but almost everything about how it is labelled has changed.
      </p>

      <p style={lede}><a href="/agents/clari" style={linkBlue}>Clari</a> is now Clari Forecast</p>
      <p style={body}>
        Enterprise forecasting keeps the Clari name, and it is the only product that does. Revenue intelligence, deal management and conversation intelligence all move to the Salesloft name.
      </p>

      <p style={lede}><a href="/agents/clari-copilot" style={linkBlue}>Clari Copilot</a> is now Salesloft Conversation Intelligence</p>
      <p style={body}>
        Salesloft has also merged its own Conversations product into it. The two overlapping call products that ran side by side since the merger closed are now a single product, and the old Conversations page redirects to it.
      </p>

      <p style={lede}><a href="/agents/salesloft" style={linkBlue}>Salesloft</a> is the brand over all of it</p>
      <p style={body}>
        One company, one platform name, with Clari Forecast the single exception.
      </p>

      <p style={alertNote}>
        <strong>Worth doing this week.</strong> A banner on clari.com reads <strong>&quot;One company, one site. This page will redirect on 9/15/26.&quot;</strong> That is next Tuesday. If clari.com is sitting in a bookmark, a saved report link, an SSO tile or an integration, check it before then.
      </p>

      {/* PRICE CHANGES */}
      <div style={sectionLabel}>Price Changes</div>

      <p style={lede}><a href="/agents/hubspot-sales-hub" style={linkBlue}>HubSpot Sales Hub</a> put Starter up on both terms</p>
      <p style={{ ...body, marginBottom: '0.875rem' }}>
        Starter is the entry tier, and both ways of paying for it went up.
      </p>

      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #E5E7EB', margin: '0 0 0.875rem' }}>
        <thead>
          <tr>
            <th style={th}>Plan</th>
            <th style={th}>Was</th>
            <th style={th}>Now</th>
            <th style={th}>Term</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={td}>Sales Hub Starter</td>
            <td style={{ ...td, color: '#9CA3AF', textDecoration: 'line-through' }}>$7/mo/seat</td>
            <td style={{ ...td, fontWeight: 700, color: '#111827' }}>$9/mo/seat</td>
            <td style={td}>Annual</td>
          </tr>
          <tr>
            <td style={td}>Sales Hub Starter</td>
            <td style={{ ...td, color: '#9CA3AF', textDecoration: 'line-through' }}>$10/mo/seat</td>
            <td style={{ ...td, fontWeight: 700, color: '#111827' }}>$15/mo/seat</td>
            <td style={td}>Month to month</td>
          </tr>
        </tbody>
      </table>

      <p style={{ ...body, marginBottom: '0.875rem' }}>
        HubSpot&rsquo;s $20 list rate did not change, and neither did Professional, Enterprise, either onboarding fee, or any HubSpot Credits rate or allowance. Only the two Starter figures moved. HubSpot does not publish a date for the change. We last read $7 and $10 live on August 10, so it happened between then and now.
      </p>
      <p style={{ ...body, color: '#6B7280', marginBottom: '0.875rem' }}>
        For anyone who has been reading since the start: Issue #1 reported HubSpot cutting Starter to $7 back in July. That price lasted under two months.
      </p>
      <p style={note}>
        <strong>Disclosure.</strong> HubSpot Sales Hub is a sponsored placement on our site and our link to it is an affiliate link, so we may earn a commission if you buy through it. We read this price on HubSpot&rsquo;s own pricing page on the day of publication. What a vendor pays never changes a rating, a ranking, or a number we print.
      </p>

      {/* ALSO WORTH KNOWING */}
      <div style={sectionLabel}>Also Worth Knowing</div>

      <p style={lede}><a href="/agents/gemini-spark" style={linkBlue}>Gemini Spark</a> can now connect to your own tools</p>
      <p style={{ ...body, marginBottom: '0.875rem' }}>
        You can point it at an MCP server URL and it will use that tool, which makes it an MCP client. Read the limits before you plan around it. Google states it is available in the United States only, in English only, and only if you sign in with a personal Google account, so a work or school account will not do it. Write actions still need you to confirm them by hand.
      </p>

      <p style={lede}><a href="/agents/tycoon-ai" style={linkBlue}>Tycoon</a> published an MCP server, and changed its name</p>
      <p style={{ ...body, marginBottom: '0.875rem' }}>
        Claude Code and Codex can now connect to Tycoon, ask it questions and read its task list. Tycoon says this is available to every customer. The product itself was repositioned from Astra, an AI chief executive for solo founders, to Tycoon Agent, a manager for a team&rsquo;s other AI agents. Tycoon publishes no date for either, so we date both to when we found them.
      </p>

      <p style={lede}><a href="/agents/github-copilot" style={linkBlue}>GitHub Copilot</a> Business no longer needs a sales call</p>
      <p style={body}>
        Business at $19 per user per month and Enterprise at $39 can now be bought directly, alongside the existing contact sales route. GitHub attaches its own caution on the page: &quot;We&rsquo;re gradually enabling new sign-ups.&quot; Neither price changed.
      </p>

      {/* RATINGS */}
      <div style={sectionLabel}>Ratings</div>
      <p style={note}>
        <strong>No rating changes this issue.</strong> Nothing a vendor did in this window moved one of our scores. We do adjust our own scores as we learn more about a product, but that is us getting better rather than a company getting better, so we do not report it as news. Our <a href="/methodology" style={linkBlue}>methodology</a> explains how the scores are built.
      </p>

      {/* FOOTER */}
      <p style={{ fontSize: '0.8125rem', lineHeight: 1.6, color: '#6B7280', marginTop: '2.5rem', paddingTop: '1.25rem', borderTop: '1px solid #E5E7EB' }}>
        Every price here is in US dollars and was read on the vendor&rsquo;s own site on September 8, 2026. This page is a frozen archive copy and is not updated afterwards, so check the current listing before you buy. Listings are free and editorial. Advertising never changes a rating or a ranking. One vendor in this issue, HubSpot Sales Hub, is a paid placement and an affiliate link, and is disclosed above where it appears.
      </p>
    </div>
  )
}