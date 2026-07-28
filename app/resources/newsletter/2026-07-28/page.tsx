// app/resources/newsletter/2026-07-28/page.tsx
// Newsletter Issue #2: static, dated, frozen archive copy.
// Prices are a point-in-time snapshot (verified July 28, 2026) and are
// intentionally NOT templated: an archived issue must not silently rewrite
// itself later. Do not convert these to {{slug.starting_price}}.
// Uses inline styles to match the site convention (see resources/newsletter/page.tsx).
// No em dashes anywhere (house style).

import type { Metadata } from 'next'

const ISSUE_URL = 'https://theaiagentindex.com/resources/newsletter/2026-07-28'
const TITLE = 'Price & Rating Tracker: Issue #2 (July 2026)'
const DESC =
  'Noded cut its price 80%. Sierra, Anaconda and Genesys each bought an agent company. Artisan and Elentaria pulled public pricing, and Ashby shipped an MCP server. Verified against live vendor data.'

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
const th: React.CSSProperties = {
  textAlign: 'left', padding: '0.5rem 0.5rem 0.5rem 0', borderBottom: '2px solid #E5E7EB',
  fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#6B7280',
}
const td: React.CSSProperties = { padding: '0.625rem 0.5rem 0.625rem 0', borderBottom: '1px solid #F3F4F6', fontSize: '0.875rem', color: '#374151', lineHeight: 1.5 }

const RATINGS: { name: string; was: string; now: string; up: boolean; why: string }[] = [
  { name: 'Nova Recruiter', was: '3.2', now: '4.0', up: true, why: '60+ ATS integrations, plus an official MCP server' },
  { name: 'Juicebox (PeopleGPT)', was: '3.3', now: '3.8', up: true, why: 'Stronger independent evidence and a fully public pricing ladder' },
  { name: 'hireEZ', was: '4.2', now: '4.5', up: true, why: 'A published entry price, stronger integration depth, faster setup' },
  { name: 'Ashby', was: '3.9', now: '4.2', up: true, why: 'Custom AI agents and an action-taking MCP server' },
  { name: 'Metix AI', was: '3.3', now: '3.6', up: true, why: 'The Deel partnership lifted integration depth' },
  { name: 'Tabstack', was: '4.1', now: '4.0', up: false, why: 'An enterprise contact-sales tier capped pricing transparency' },
]

export default function NewsletterIssue02() {
  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>
      <a href="/resources/newsletter" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', marginBottom: '1.5rem', display: 'inline-block' }}>&larr; Newsletter</a>

      {/* Masthead */}
      <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>The AI Agent Index</p>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#111827', margin: '0 0 0.375rem', letterSpacing: '-0.02em' }}>Price &amp; Rating Tracker</h1>
      <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '1rem' }}>Issue #2 &middot; July 28, 2026</div>
      <p style={{ ...body, marginBottom: '0.5rem' }}>
        Every two weeks we read the pricing pages so you don&rsquo;t have to, and publish what actually changed across <a href="/" style={linkBlue}>the full index</a>. Verified against live vendor data, not vendor marketing.
      </p>
      <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: 0, paddingBottom: '1.25rem', borderBottom: '1px solid #E5E7EB' }}>
        Prices below are a snapshot verified on July 28, 2026, and are not updated after publication.
      </p>

      {/* THE HEADLINE */}
      <div style={sectionLabel}>The Headline</div>
      <h2 style={{ fontSize: '1.3125rem', lineHeight: 1.3, fontWeight: 800, color: '#111827', margin: '0 0 0.875rem' }}>The tool we featured two weeks ago just cut its price 80%</h2>
      <p style={{ ...body, marginBottom: '0.875rem' }}>
        Noded dropped its Per Seat plan from <strong>$100 to $20 per seat per month</strong> on an annual commitment, and from $125 to $25 month-to-month. The 500 pooled Outcome Generations and the $1 overage are unchanged, so this is a straight 5x reduction on the same product.
      </p>
      <p style={{ ...body, marginBottom: '0.875rem' }}>
        Issue #1 carried a sponsored spotlight on Noded and quoted the $100 figure. That number is no longer current, and this is what the tracker is for. The listing has been updated.
      </p>
      <div style={{ background: '#F9FAFB', borderLeft: '3px solid #D1D5DB', padding: '0.75rem 0.875rem', margin: '0 0 0.875rem' }}>
        <p style={{ fontSize: '0.8125rem', lineHeight: 1.6, color: '#6B7280', margin: 0 }}>
          <strong style={{ color: '#374151' }}>Disclosure:</strong> Noded pays us for a managed listing, and Issue #1&rsquo;s spotlight was a paid placement. This issue has no sponsored placement. We report a price change on a paying vendor the same way we report one on anybody else, and Noded&rsquo;s 4.0 rating is unchanged.
        </p>
      </div>
      <p style={{ ...body, marginBottom: '0.875rem' }}>
        At $20 a seat, Noded is now one of the cheapest ways into a post-sales context layer, and it remains one of very few customer success tools that exposes an MCP server.
      </p>
      <p style={body}><a href="/agents/noded" style={linkBlue}>Read the Noded listing &rarr;</a></p>

      {/* PRICE MOVES */}
      <div style={sectionLabel}>Price Moves</div>

      <p style={lede}>Juicebox repriced down and roughly doubled what you get.</p>
      <p style={body}>
        Starter is now <strong>$99 per seat per month billed yearly, or $119 monthly</strong>, with 500 contact credits (email only), 500 export credits, and unlimited projects. We previously had it at $139 per seat with 250 contact credits and 3 projects. Growth is $179 yearly or $199 monthly and adds phone to its 1,500 contact credits. A custom-priced Business tier now carries ATS and CRM integration, network sourcing, and SSO. Verified in both toggle states. <a href="/agents/juicebox-peoplegpt" style={linkBlue}>Listing &rarr;</a>
      </p>

      <p style={lede}>Artisan pulled its self-serve pricing entirely.</p>
      <p style={body}>
        Artisan launched Ava 2.0 in May with a free tier and public $250 per month pricing. Both are gone. It is back to quote-only Team, Scale, and Enterprise plans, with no free tier. <a href="/agents/artisan-ava" style={linkBlue}>Listing &rarr;</a>
      </p>

      <p style={lede}>Elentaria did the same.</p>
      <p style={body}>
        Its public tiers, which started at $890 per month, have been removed in favor of demo-led custom pricing, alongside a reposition from an AI GTM channel-scoring operator to a broader revenue execution platform. <a href="/agents/elentaria" style={linkBlue}>Listing &rarr;</a>
      </p>

      <p style={{ ...body, marginTop: '1.25rem' }}>
        Two vendors going quote-only in one fortnight is worth naming. When pricing moves behind a demo, comparison gets harder for you and easier for them.
      </p>

      {/* ACQUISITIONS */}
      <div style={sectionLabel}>Three Agent Companies Got Bought</div>
      <p style={{ ...body, marginBottom: '1rem' }}>
        <strong style={{ color: '#111827' }}>Sierra acquired Takeoff</strong> on July 23. Takeoff is a long-horizon agent runtime built over 14 months; its founder says the company was approaching a near eight-figure run rate with a three-person team. The combined teams are building Horizon, a platform for agents that pursue multi-step goals over days or months. The example the announcement uses is a loan officer agent.
      </p>
      <p style={{ ...body, marginBottom: '1rem' }}>
        <strong style={{ color: '#111827' }}>Anaconda acquired Kilo Code</strong> on July 15, folding it in as the agentic engineering layer of Anaconda&rsquo;s AI development platform. Kilo&rsquo;s codebase stays open source and source-available.
      </p>
      <p style={body}>
        <strong style={{ color: '#111827' }}>Genesys acquired Pinkfish</strong>, an agentic orchestration company. Genesys says Pinkfish brings more than 500 integrations supporting 25,000 MCP tools across CRM, ERP, IT, HR, order management, and billing. Genesys expects the capabilities to reach Genesys Cloud customers through the AppFoundry Marketplace by the end of July. This one closed June 30 and we did not carry it in Issue #1.
      </p>

      {/* MCP */}
      <div style={sectionLabel}>More MCP</div>
      <p style={{ ...body, marginBottom: '1rem' }}>
        <strong style={{ color: '#111827' }}>Ashby shipped an MCP server, in beta.</strong> It sits at mcp.ashbyhq.com/mcp/v1, is client-agnostic, and works with Claude, ChatGPT, Cursor, or any MCP-compatible tool. It takes actions in Ashby rather than only reading, so an assistant can operate inside the recruiting pipeline. It is available on every Ashby plan, but an organization admin has to enable the toggle in admin settings first, and Analytics-only organizations cannot use it at all. Ashby had listed this as coming soon. Ashby published no dated announcement; we verified it live on July 28. <a href="/agents/ashby" style={linkBlue}>Listing &rarr;</a>
      </p>
      <p style={body}>
        <strong style={{ color: '#111827' }}>Avoma shipped one too</strong>, connecting Claude and ChatGPT directly to meeting transcripts, notes, scorecards, and deal outcomes. Live by early July. <a href="/agents/avoma" style={linkBlue}>Listing &rarr;</a>
      </p>

      {/* REBRANDS */}
      <div style={sectionLabel}>Rebrands and Vendor Moves</div>
      <p style={{ ...body, marginBottom: '1rem' }}>
        <strong style={{ color: '#111827' }}>Coda is now Superhuman Docs.</strong> Coda was rebranded under Superhuman, the company formerly named Grammarly, which acquired Coda in 2024. Pro went from $10 to $12 per month billed annually, or $15 monthly. Team was renamed Business and went from $30 to $33, or $40 monthly. Both are priced per Doc Maker rather than per seat. A Docs MCP server was added, and it writes: you can create docs and update tables from Claude, ChatGPT, or Cursor. <a href="/agents/coda-ai" style={linkBlue}>Listing &rarr;</a>
      </p>
      <p style={{ ...body, marginBottom: '1rem' }}>
        <strong style={{ color: '#111827' }}>OpenJobs AI is now Metix AI, and has raised $5.5M.</strong> The rebrand landed July 7. Total raised is $5.5M across two oversubscribed rounds, most recently a $3M round led by Rsquared Investment, the Singapore firm behind Bossjob. The Mira product name is unchanged. Corroborated by Dealroom and Preqin. <a href="/agents/openjobs-ai" style={linkBlue}>Listing &rarr;</a>
      </p>
      <p style={body}>
        <strong style={{ color: '#111827' }}>Metix and Deel announced a global partnership.</strong> Deel&rsquo;s employer-of-record and payroll infrastructure is available white-labeled inside Mira, so an accepted offer can move to compliant onboarding and payroll across 130 or more countries without leaving the platform. It runs both ways: Deel&rsquo;s customers get access to Mira&rsquo;s sourcing. The announcement carries an on-record quote from Deel&rsquo;s COO, Dan Westgarth. Deel has not published its own release and no trade outlet has covered it, so Metix&rsquo;s release is the only source.
      </p>

      {/* RATINGS */}
      <div style={sectionLabel}>Rating Movements</div>
      <p style={{ ...body, marginBottom: '1rem' }}>
        Six agents moved after full re-audits this cycle. Our ratings are editorial, out of 5, and every listing publishes all five sub-scores and the formula.
      </p>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
        <thead>
          <tr>
            <th style={th}>Agent</th>
            <th style={{ ...th, textAlign: 'center', padding: '0.5rem' }}>Was</th>
            <th style={{ ...th, textAlign: 'center', padding: '0.5rem' }}>Now</th>
            <th style={{ ...th, padding: '0.5rem 0 0.5rem 0.5rem' }}>What moved it</th>
          </tr>
        </thead>
        <tbody>
          {RATINGS.map((r) => (
            <tr key={r.name}>
              <td style={{ ...td, color: '#111827', fontWeight: 600 }}>{r.name}</td>
              <td style={{ ...td, textAlign: 'center', padding: '0.625rem 0.5rem', color: '#9CA3AF' }}>{r.was}</td>
              <td style={{ ...td, textAlign: 'center', padding: '0.625rem 0.5rem', color: r.up ? '#16A34A' : '#DC2626', fontWeight: 700 }}>{r.now}</td>
              <td style={{ ...td, padding: '0.625rem 0 0.625rem 0.5rem', fontSize: '0.8125rem' }}>{r.why}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#6B7280', margin: 0 }}>
        One note on Nova Recruiter: it prices in euros only, at EUR 0, EUR 49, and EUR 199 per month, with no USD option on its pricing page. Our listing currently shows that entry figure with a dollar sign. The number is right, the symbol is not, and we are fixing it.
      </p>

      {/* ALSO NOTED */}
      <div style={sectionLabel}>Also Noted</div>
      <p style={body}>
        HubSpot launched Agent Hub, a central place to build and manage AI agents across the platform, alongside an Agent Builder. JetBrains shipped 2026.2, which exposes testing, profiling, and refactoring skills to AI agents and makes GitHub Copilot a natively integrated agent out of the box. And we added Vercel Agent, ChatGPT Work, OpenWorker, Orbit, Skalin, and Vecbase to the index.
      </p>

      {/* METHOD */}
      <div style={{ marginTop: '2.25rem', border: '1px solid #E5E7EB', background: '#F9FAFB', borderRadius: '8px', padding: '1.125rem 1.25rem' }}>
        <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', margin: '0 0 0.5rem' }}>How we do this</p>
        <p style={{ ...body, fontSize: '0.875rem', marginBottom: '0.875rem' }}>
          Every number in this issue was read off the vendor&rsquo;s live page this week, not carried forward from a previous issue. When a figure we published stops matching what the vendor shows, we change it and we say so here, including when the vendor is a paying placement. That is the whole point of the tracker.
        </p>
        <p style={{ fontSize: '0.875rem', margin: 0 }}><a href="/" style={linkBlue}>Browse the full index &rarr;</a></p>
      </div>

      {/* Footer */}
      <div style={{ marginTop: '2rem', borderTop: '1px solid #E5E7EB', paddingTop: '1.25rem' }}>
        <p style={{ fontSize: '0.75rem', lineHeight: 1.6, color: '#9CA3AF', margin: 0 }}>
          The AI Agent Index is a structured, independent directory of <a href="/" style={{ color: '#6B7280', textDecoration: 'underline' }}>AI agents</a>, built to be read by humans and AI systems alike. We take no vendor payment for ratings. Paid placements are labeled Sponsored, and this issue has none.
        </p>
        <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: '0.75rem 0 0' }}>
          <a href="/resources/newsletter" style={{ color: '#6B7280', textDecoration: 'underline' }}>Get this every two weeks</a> &middot; <a href="/" style={{ color: '#6B7280', textDecoration: 'underline' }}>Browse the index</a>
        </p>
      </div>
    </div>
  )
}