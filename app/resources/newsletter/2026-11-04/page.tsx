// app/resources/newsletter/2026-11-04/page.tsx
// Newsletter Issue #8: static, dated, frozen archive copy.
// Prices are a point-in-time snapshot (verified November 4, 2026) and are
// intentionally NOT templated: an archived issue must not silently rewrite
// itself later. Do not convert these to {{slug.starting_price}}.
// No em dashes anywhere (house style). No inline affiliate disclosure boxes
// (Heather, 2026-09-22); one general footer line remains.
// No mailing address on this page (Heather, 2026-10-20): the address is in the email footer only.

import type { Metadata } from 'next'

const ISSUE_URL = 'https://theaiagentindex.com/resources/newsletter/2026-11-04'
const TITLE = 'Price & Rating Tracker: Issue #8 (November 2026)'
const DESC =
  'Notion moved to Standard and Select credits, and Gainsight said it will end per-seat pricing next year. Elicit, Linked API, Spellar and Noded raised prices, and Gemini 4 Argon and Claude Haiku 5.5 shipped.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: ISSUE_URL },
  openGraph: { title: TITLE, description: DESC, url: ISSUE_URL, type: 'article', siteName: 'The AI Agent Index' },
  twitter: { card: 'summary', title: TITLE, description: DESC },
}

const MONO = "'DM Mono', ui-monospace, Menlo, monospace"
const sec: React.CSSProperties = {
  fontFamily: MONO, fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase',
  color: '#2563EB', marginTop: '2.25rem', paddingBottom: '0.625rem',
}
const item: React.CSSProperties = { padding: '1.375rem 0', borderTop: '1px solid #E2E8F0' }
const kick = (color: string): React.CSSProperties => ({
  fontFamily: MONO, fontSize: '0.6875rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase',
  color, marginBottom: '0.625rem',
})
const body: React.CSSProperties = { fontSize: '0.9375rem', lineHeight: 1.65, color: '#334155', margin: 0 }
const h3: React.CSSProperties = { fontSize: '1.0625rem', lineHeight: 1.35, fontWeight: 700, color: '#0F172A', margin: 0 }
const nameLink: React.CSSProperties = { color: '#0F172A', textDecoration: 'underline' }
const link: React.CSSProperties = { color: '#2563EB', textDecoration: 'underline' }
const strongLink: React.CSSProperties = { color: '#2563EB', fontWeight: 700, textDecoration: 'underline' }
const logo: React.CSSProperties = { width: 24, height: 24, borderRadius: 6, border: '1px solid #E2E8F0', background: '#FFFFFF', objectFit: 'contain', flex: 'none' }
const logoLg: React.CSSProperties = { ...logo, width: 32, height: 32 }
const tbl: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', margin: '0.25rem 0 0.875rem' }
const th: React.CSSProperties = {
  textAlign: 'left', padding: '0.5rem 0.625rem', fontFamily: MONO, fontSize: '0.6875rem', fontWeight: 500,
  letterSpacing: '0.06em', textTransform: 'uppercase', color: '#64748B', borderBottom: '1px solid #CBD5E1',
}
const td: React.CSSProperties = { padding: '0.625rem', borderBottom: '1px solid #E2E8F0', color: '#334155' }
const was: React.CSSProperties = { ...td, color: '#94A3B8', textDecoration: 'line-through' }
const now: React.CSSProperties = { ...td, fontWeight: 700, color: '#0F172A' }
const row: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }


const logoBox: React.CSSProperties = { ...logoLg, display: 'inline-block' }
const NEW_LISTINGS = [
  { slug: 'hyperresearch', name: 'Hyperresearch', price: '$9 per run', desc: "AI deep research API that checks cited claims against their sources.", logo: true },
  { slug: 'agent-opus', name: 'Agent Opus', price: 'free, Pro $29/mo', desc: "AI video agent that makes a finished video from an idea, script or recording.", logo: true },
  { slug: 'jetbrains-air', name: 'JetBrains Air', price: 'free, Business $20 per seat', desc: "JetBrains' system for running coding agents side by side.", logo: true },
  { slug: 'zoo-code', name: 'Zoo Code', price: 'free, Team $25 per seat', desc: "Open-source coding agent for VS Code, forked from Roo Code by its community.", logo: true },
  { slug: 'zoominfo', name: 'ZoomInfo', price: 'free Lite plan, paid by quote', desc: "B2B data and AI go-to-market platform with an MCP server.", logo: true },
  { slug: 'read-ai', name: 'Read AI', price: 'free, paid from $15/mo annually', desc: "AI meeting assistant for Zoom, Teams and Google Meet.", logo: true },
  { slug: 'smartlead', name: 'Smartlead', price: 'from $39/mo', desc: "Cold email platform with AI agents and an MCP server.", logo: true },
  { slug: 'bamboohr', name: 'BambooHR', price: 'from $10 per employee/mo', desc: "HR, payroll and benefits software with Bamboo AI.", logo: true },
  { slug: 'seon', name: 'SEON', price: 'from $699/mo', desc: "Fraud prevention and AML platform with real-time risk signals.", logo: true },
  { slug: 'ironclad', name: 'Ironclad', price: 'by quote', desc: "AI contract lifecycle platform with Ironclad Agent.", logo: true },
  { slug: 'luminance', name: 'Luminance', price: 'by quote', desc: "AI contract intelligence platform with the Lumi assistant.", logo: true },
  { slug: 'feedzai', name: 'Feedzai', price: 'by quote', desc: "AI financial crime platform for banks and payment providers.", logo: true },
  { slug: 'sardine', name: 'Sardine', price: 'by quote', desc: "Agentic risk platform for fraud prevention, KYC and AML.", logo: true },
  { slug: 'shift-technology', name: 'Shift Technology', price: 'by quote', desc: "AI agents for insurers that detect claims, policy and document fraud.", logo: false },
]

export default function NewsletterIssue08() {
  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>
      <a href="/resources/newsletter" style={{ fontSize: '0.8125rem', color: '#64748B', textDecoration: 'none', marginBottom: '1.5rem', display: 'inline-block' }}>&larr; Newsletter</a>

      {/* Masthead */}
      <div style={{ height: 4, background: '#2563EB', borderRadius: 2, marginBottom: '1.5rem' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0F172A' }}>The AI Agent Index</span>
        <span style={{ fontFamily: MONO, fontSize: '0.6875rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748B' }}>Issue 8 &middot; Nov 4, 2026</span>
      </div>
      <h1 style={{ fontSize: '2rem', lineHeight: 1.15, fontWeight: 700, color: '#0F172A', margin: '1.5rem 0 0.875rem', letterSpacing: '-0.01em' }}>Price &amp; Rating Tracker</h1>
      <p style={{ ...body, fontSize: '1.0625rem', lineHeight: 1.6, color: '#1E293B' }}>
        Notion moved to a new credit system, Gainsight said it will stop charging per seat, and Gemini 4 Argon, Claude Haiku 5.5 and Fin 4 all shipped.
      </p>
      <div style={{ marginTop: '1.25rem', padding: '0.875rem 1rem', background: '#F8FAFC', borderRadius: 8, display: 'flex', flexWrap: 'wrap', gap: '0.375rem 1.125rem', fontSize: '0.8125rem', color: '#334155' }}>
        <span style={{ fontFamily: MONO, fontSize: '0.6875rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#475569' }}>In this issue</span>
        <span>Headline</span>
        <span>Prices <span style={{ fontFamily: MONO, color: '#64748B' }}>6</span></span>
        <span>Launches <span style={{ fontFamily: MONO, color: '#64748B' }}>15</span></span>
        <span>Removed <span style={{ fontFamily: MONO, color: '#64748B' }}>2</span></span>
        <span>New listings <span style={{ fontFamily: MONO, color: '#64748B' }}>14</span></span>
        <span>Ratings <span style={{ fontFamily: MONO, color: '#64748B' }}>2</span></span>
      </div>
      <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '0.875rem 0 0' }}>
        Covers changes we confirmed since our last issue on October 21. Prices verified November 4, 2026.
      </p>

      {/* THE HEADLINE */}
      <div style={sec}>The headline</div>
      <div style={item}>
        <div style={kick('#B45309')}>Pricing &middot; Plans</div>
        <div style={{ ...row, marginBottom: '0.75rem' }}>
          <img src="/logos/notion-ai.png" alt="Notion AI logo" width={24} height={24} style={logo} />
          <h2 style={{ fontSize: '1.4375rem', lineHeight: 1.25, fontWeight: 700, color: '#0F172A', margin: 0 }}><a href="/agents/notion-ai" style={{ color: '#0F172A', textDecoration: 'none' }}>Notion AI</a> moved to a new credit system</h2>
        </div>
        <p style={{ ...body, marginBottom: '0.75rem' }}>Business and Enterprise seats now include 1,500 Standard credits a month, used when Notion picks the model, and 500 Select credits, used when you pick the model or run Custom Agents. Admins can buy more at $10 per 1,000. New customers moved on October 19 and existing customers on November 2.</p>
        <p style={body}>Notion Agents also gained their own computer and browser, and can now stay on one task for 24 hours, up from five minutes.</p>
      </div>

      {/* PRICE CHANGES */}
      <div style={sec}>Price changes</div>
      <div style={item}>
        <div style={kick('#B45309')}>Pricing &middot; Plans</div>
        <div style={row}>
          <img src="/logos/gainsight.png" alt="Gainsight logo" width={24} height={24} style={logo} />
          <h3 style={h3}><a href="/agents/gainsight" style={nameLink}>Gainsight</a> will drop per-seat pricing next year</h3>
        </div>
        <p style={body}>On October 20, Gainsight preannounced value-based pricing for Gainsight CS, available next year. Prices will scale with ARR and the number of customers managed, with <a href="/agents/staircase-ai" style={link}>Staircase AI</a> included and no charge for MCP access.</p>
      </div>
      <div style={item}>
        <div style={kick('#B45309')}>Pricing &middot; Increase</div>
        <div style={row}>
          <img src="/logos/atlassian-rovo.png" alt="Atlassian logo" width={24} height={24} style={logo} />
          <h3 style={h3}><a href="/agents/atlassian-rovo" style={nameLink}>Atlassian</a> raised Cloud list prices</h3>
        </div>
        <div style={{ overflowX: 'auto' }}><table style={tbl}>
          <thead><tr><th style={th}>Plan</th><th style={th}>Was</th><th style={th}>Now</th><th style={th}>Billed</th></tr></thead>
          <tbody>
            <tr><td style={td}>Confluence Standard, 10 users</td><td style={was}>$6.70</td><td style={now}>$7.15 per user</td><td style={td}>Monthly</td></tr>
            <tr><td style={td}>Confluence Premium, 10 users</td><td style={was}>$13.20</td><td style={now}>$14.10 per user</td><td style={td}>Monthly</td></tr>
          </tbody>
        </table></div>
        <p style={body}>The increase took effect on October 13 and covers Jira, Confluence and other Cloud apps.</p>
      </div>
      <div style={item}>
        <div style={kick('#B45309')}>Pricing &middot; Increase</div>
        <div style={row}>
          <img src="/logos/noded.png" alt="Noded logo" width={24} height={24} style={logo} />
          <h3 style={h3}><a href="/agents/noded" style={nameLink}>Noded</a> repriced its plans</h3>
        </div>
        <div style={{ overflowX: 'auto' }}><table style={tbl}>
          <thead><tr><th style={th}>Plan</th><th style={th}>Was</th><th style={th}>Now</th><th style={th}>Billed</th></tr></thead>
          <tbody>
            <tr><td style={td}>Growth</td><td style={was}>$1,000</td><td style={now}>$2,000</td><td style={td}>Annually</td></tr>
            <tr><td style={td}>Growth</td><td style={was}>$1,250</td><td style={now}>$2,500</td><td style={td}>Monthly</td></tr>
          </tbody>
        </table></div>
        <p style={body}>Scale now runs from $4,000 to $8,000 a month by account count.</p>
      </div>
      <div style={item}>
        <div style={kick('#B45309')}>Pricing &middot; Increase</div>
        <div style={row}>
          <img src="/logos/elicit.png" alt="Elicit logo" width={24} height={24} style={logo} />
          <img src="/logos/linked-api.png" alt="Linked API logo" width={24} height={24} style={logo} />
          <h3 style={h3}><a href="/agents/elicit" style={nameLink}>Elicit</a> and <a href="/agents/linked-api" style={nameLink}>Linked API</a> raised prices</h3>
        </div>
        <div style={{ overflowX: 'auto' }}><table style={tbl}>
          <thead><tr><th style={th}>Plan</th><th style={th}>Was</th><th style={th}>Now</th><th style={th}>Billed</th></tr></thead>
          <tbody>
            <tr><td style={td}>Elicit Scale</td><td style={was}>$169</td><td style={now}>$229 per user</td><td style={td}>Annually</td></tr>
            <tr><td style={td}>Elicit Scale</td><td style={was}>$279</td><td style={now}>$375 per user</td><td style={td}>Monthly</td></tr>
            <tr><td style={td}>Linked API Core</td><td style={was}>$49</td><td style={now}>$70 per seat</td><td style={td}>Annually</td></tr>
            <tr><td style={td}>Linked API Core</td><td style={was}>$69</td><td style={now}>$99 per seat</td><td style={td}>Monthly</td></tr>
            <tr><td style={td}>Linked API Plus</td><td style={was}>$74</td><td style={now}>$105 per seat</td><td style={td}>Annually</td></tr>
            <tr><td style={td}>Linked API Plus</td><td style={was}>$99</td><td style={now}>$149 per seat</td><td style={td}>Monthly</td></tr>
          </tbody>
        </table></div>
      </div>
      <div style={item}>
        <div style={kick('#B45309')}>Pricing &middot; Increase</div>
        <div style={row}>
          <img src="/logos/spellar-ai.png" alt="Spellar AI logo" width={24} height={24} style={logo} />
          <h3 style={h3}><a href="/agents/spellar-ai" style={nameLink}>Spellar</a> raised Pro and opened Teams</h3>
        </div>
        <div style={{ overflowX: 'auto' }}><table style={tbl}>
          <thead><tr><th style={th}>Plan</th><th style={th}>Was</th><th style={th}>Now</th><th style={th}>Billed</th></tr></thead>
          <tbody>
            <tr><td style={td}>Spellar Pro</td><td style={was}>$11.99</td><td style={now}>$15</td><td style={td}>Annually</td></tr>
            <tr><td style={td}>Spellar Pro</td><td style={was}>$18.99</td><td style={now}>$20</td><td style={td}>Monthly</td></tr>
          </tbody>
        </table></div>
        <p style={body}>Spellar Teams is now self-serve at $20 per seat from 5 seats.</p>
      </div>

      {/* LAUNCHES */}
      <div style={sec}>Launches</div>
      <div style={item}>
        <div style={kick('#475569')}>Model</div>
        <div style={row}>
          <img src="/logos/gemini-spark.png" alt="Gemini logo" width={24} height={24} style={logo} />
          <h3 style={h3}>Google released <a href="/agents/gemini" style={nameLink}>Gemini 4 Argon</a></h3>
        </div>
        <p style={body}>On October 13, Gemini 4 Argon began rolling out globally to Google AI Pro and Ultra subscribers in the Gemini app. It is Google&rsquo;s newest frontier model for complex tasks.</p>
      </div>
      <div style={item}>
        <div style={kick('#475569')}>Also shipped</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <p style={body}><a href="/agents/claude" style={strongLink}>Claude Haiku 5.5</a> launched October 7 from $0.10/$0.50 per million tokens, with a 1M-token context window.</p>
          <p style={body}><a href="/agents/openai-codex" style={strongLink}>OpenAI Codex</a> added GPT-6.1 Terra on Plus, Pro, Business, Enterprise and Edu plans.</p>
          <p style={body}><a href="/agents/intercom-fin" style={strongLink}>Fin 4</a> launched October 7 with upgrades across Fin&rsquo;s Customer Agent and Operator.</p>
          <p style={body}><a href="/agents/opus-clip" style={strongLink}>OpusClip 4.0</a> added Auto-edit, Recipes, Viral Hook, Motion Graphics and an AI Producer plugin.</p>
          <p style={body}><a href="/agents/make" style={strongLink}>Make</a> added agent orchestration and opened a waitlist for Make Process Intelligence.</p>
          <p style={body}><a href="/agents/lindy" style={strongLink}>Lindy Apps</a> builds internal tools on your integrations from a chat request.</p>
          <p style={body}><a href="/agents/gorgias" style={strongLink}>Gorgias</a> took its AI Agent to Instagram, Facebook and WhatsApp in its Fall 2026 release.</p>
          <p style={body}><a href="/agents/instantly-ai" style={strongLink}>Instantly</a> launched AI Client Finder, covering nearly 555M people, businesses and creators.</p>
          <p style={body}><a href="/agents/microsoft-copilot-studio" style={strongLink}>Copilot Studio</a> opened a customer conversation harness in public preview.</p>
          <p style={body}><a href="/agents/findem" style={strongLink}>Findem</a> launched ReadySlate, where Enterprise customers pay only for candidates they unlock.</p>
          <p style={body}><a href="/agents/claude-code" style={strongLink}>Claude Code Review</a> is generally available to Team and Enterprise organizations.</p>
          <p style={body}><a href="/agents/exa-ai" style={strongLink}>Exa 3.0</a> added Exa Lite at $4 per 1,000 requests.</p>
          <p style={body}><a href="/agents/lumen5" style={strongLink}>Lumen5</a> added an API and an MCP server.</p>
          <p style={body}><a href="/agents/softsync-ai" style={strongLink}>SoftSync</a> relaunched as an all-in-one AI CRM.</p>
        </div>
      </div>

      {/* REMOVED */}
      <div style={sec}>Removed from the index</div>
      <div style={item}>
        <div style={kick('#B91C1C')}>Removed</div>
        <p style={{ ...body, marginBottom: '0.75rem' }}><strong style={{ color: '#0F172A' }}>Tycoon</strong>: its site now sells company data to AI labs. See other <a href="/ai-workflow-agents" style={link}>AI workflow agents</a>.</p>
        <p style={body}><strong style={{ color: '#0F172A' }}>AurionX</strong>: its site is now an AI tools directory. See other <a href="/ai-customer-support-agents" style={link}>AI customer support agents</a>.</p>
      </div>

      {/* NEW TO THE INDEX */}
      <div style={sec}>New to the index</div>
      <div style={item}>
        <p style={{ ...body, marginBottom: '0.375rem' }}>41 products joined the index. 14 have full audited listings.</p>
        {NEW_LISTINGS.map((a) => (
          <div key={a.slug} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '0.75rem 0', borderTop: '1px solid #F1F5F9' }}>
            {a.logo ? <img src={`/logos/${a.slug}.png`} alt={`${a.name} logo`} width={32} height={32} style={logoLg} /> : <span style={logoBox} />}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
                <a href={`/agents/${a.slug}`} style={{ ...strongLink, fontSize: '0.9375rem' }}>{a.name}</a>
                <span style={{ fontFamily: MONO, fontSize: '0.8125rem', color: '#475569' }}>{a.price}</span>
              </div>
              <div style={{ fontSize: '0.875rem', lineHeight: 1.55, color: '#475569', marginTop: 2 }}>{a.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* RATINGS */}
      <div style={sec}>Ratings</div>
      <div style={item}>
        <div style={kick('#15803D')}>Rating up</div>
        <div style={{ overflowX: 'auto' }}><table style={tbl}>
          <thead><tr><th style={th}>Agent</th><th style={th}>Was</th><th style={th}>Now</th><th style={th}>Why</th></tr></thead>
          <tbody>
            <tr><td style={td}><a href="/agents/kiro" style={strongLink}>Kiro</a></td><td style={was}>4.1</td><td style={{ ...now, color: '#15803D' }}>4.4</td><td style={td}>Changed since our last check: its Gartner Peer Insights reviews passed 200, now 441 at 4.7.</td></tr>
            <tr><td style={td}><a href="/agents/litmaps" style={strongLink}>Litmaps</a></td><td style={was}>3.5</td><td style={{ ...now, color: '#15803D' }}>3.7</td><td style={td}>It shipped a beta MCP server that reads and writes.</td></tr>
          </tbody>
        </table></div>
        <p style={{ ...body, fontSize: '0.875rem', color: '#475569' }}>Our <a href="/methodology" style={link}>methodology</a> explains how the scores are built.</p>
      </div>

      {/* FOOTER (no mailing address on the public page) */}
      <div style={{ marginTop: '1.5rem', padding: '1.5rem 1.25rem', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', borderRadius: 8 }}>
        <p style={{ fontSize: '0.8125rem', lineHeight: 1.6, color: '#475569', margin: 0 }}>
          Prices are in US dollars, read on each vendor&rsquo;s own site on November 4, 2026. This page is a frozen archive copy and is not updated afterwards, so check the current listing before you buy. Listings are free and editorial, and advertising never changes a rating or a ranking. Some listings carry affiliate links or sponsored placements, labeled on each listing page.
        </p>
      </div>
    </div>
  )
}
