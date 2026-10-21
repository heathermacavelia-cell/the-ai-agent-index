// app/resources/newsletter/2026-10-21/page.tsx
// Newsletter Issue #7: static, dated, frozen archive copy.
// Prices are a point-in-time snapshot (verified October 21, 2026) and are
// intentionally NOT templated: an archived issue must not silently rewrite
// itself later. Do not convert these to {{slug.starting_price}}.
// First issue in the Issue #7 look (blue, DM Mono labels, logos) approved 2026-10-20.
// No em dashes anywhere (house style). No inline affiliate disclosure boxes
// (Heather, 2026-09-22); one general footer line remains.
// No mailing address on this page (Heather, 2026-10-20): the address is in the email footer only.

import type { Metadata } from 'next'

const ISSUE_URL = 'https://theaiagentindex.com/resources/newsletter/2026-10-21'
const TITLE = 'Price & Rating Tracker: Issue #7 (October 2026)'
const DESC =
  'Cursor moved into The X Subscription. Lindy, Klaviyo, Apollo and Tabstack changed their pricing, and Harness bought Cosmos and the Auggie CLI from Augment Code. Verified against live vendor data.'

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

const NEW_LISTINGS = [
  { slug: 'dessa', name: 'Dessa', price: 'from \u20ac375/mo', desc: 'AI agent for ecommerce support and sales, built by the team at Trengo.' },
  { slug: 'hyper', name: 'Hyper', price: 'free, paid from $20/mo', desc: 'Software engineering agent by ASI Flow that plans, builds, tests and ships pull requests.' },
  { slug: 'polyant', name: 'Polyant', price: 'free to self-host', desc: 'Open-source platform for running teams of AI agents in regulated EU enterprises.' },
  { slug: 'revnu', name: 'Revnu', price: 'from $99/mo', desc: 'AI growth agent for software companies: outreach, ads and search pages.' },
  { slug: 'superbot', name: 'superbot', price: 'free, paid from $20/mo', desc: 'Personal AI agent that makes pictures, video, songs, 3D models and apps and uses your computer, on desktop, phone and web.' },
]

export default function NewsletterIssue07() {
  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>
      <a href="/resources/newsletter" style={{ fontSize: '0.8125rem', color: '#64748B', textDecoration: 'none', marginBottom: '1.5rem', display: 'inline-block' }}>&larr; Newsletter</a>

      {/* Masthead */}
      <div style={{ height: 4, background: '#2563EB', borderRadius: 2, marginBottom: '1.5rem' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0F172A' }}>The AI Agent Index</span>
        <span style={{ fontFamily: MONO, fontSize: '0.6875rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748B' }}>Issue 7 &middot; Oct 21, 2026</span>
      </div>
      <h1 style={{ fontSize: '2rem', lineHeight: 1.15, fontWeight: 700, color: '#0F172A', margin: '1.5rem 0 0.875rem', letterSpacing: '-0.01em' }}>Price &amp; Rating Tracker</h1>
      <p style={{ ...body, fontSize: '1.0625rem', lineHeight: 1.6, color: '#1E293B' }}>
        Cursor moved into The X Subscription, Lindy, Klaviyo, Apollo and Tabstack changed their pricing, and Harness bought part of Augment Code.
      </p>
      <div style={{ marginTop: '1.25rem', padding: '0.875rem 1rem', background: '#F8FAFC', borderRadius: 8, display: 'flex', flexWrap: 'wrap', gap: '0.375rem 1.125rem', fontSize: '0.8125rem', color: '#334155' }}>
        <span style={{ fontFamily: MONO, fontSize: '0.6875rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#475569' }}>In this issue</span>
        <span>Headline</span>
        <span>Prices <span style={{ fontFamily: MONO, color: '#64748B' }}>4</span></span>
        <span>Ownership <span style={{ fontFamily: MONO, color: '#64748B' }}>1</span></span>
        <span>Launches <span style={{ fontFamily: MONO, color: '#64748B' }}>9</span></span>
        <span>Removed <span style={{ fontFamily: MONO, color: '#64748B' }}>2</span></span>
        <span>New listings <span style={{ fontFamily: MONO, color: '#64748B' }}>5</span></span>
      </div>
      <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '0.875rem 0 0' }}>
        Covers everything since our last issue on October 7. Prices verified October 21, 2026.
      </p>

      {/* THE HEADLINE */}
      <div style={sec}>The headline</div>
      <div style={item}>
        <div style={kick('#B45309')}>Pricing &middot; Plans</div>
        <div style={{ ...row, marginBottom: '0.75rem' }}>
          <img src="/logos/cursor.png" alt="Cursor logo" width={24} height={24} style={logo} />
          <h2 style={{ fontSize: '1.4375rem', lineHeight: 1.25, fontWeight: 700, color: '#0F172A', margin: 0 }}><a href="/agents/cursor" style={{ color: '#0F172A', textDecoration: 'none' }}>Cursor</a> is now part of The X Subscription</h2>
        </div>
        <p style={{ ...body, marginBottom: '0.75rem' }}>
          Since October 12, Cursor is sold through The X Subscription, one plan that covers Grok, Cursor and X Premium. Individual plans run from free to $200/mo, and team seats cost $30, $100 or $200 a month.
        </p>
        <table style={tbl}>
          <thead><tr><th style={th}>Old plans</th><th style={th}>New plans</th></tr></thead>
          <tbody>
            <tr><td style={was}>Hobby free</td><td style={td}>Free <strong style={{ color: '#0F172A' }}>$0</strong></td></tr>
            <tr><td style={was}>Pro $20/mo</td><td style={td}>Plus <strong style={{ color: '#0F172A' }}>$8/mo</strong></td></tr>
            <tr><td style={was}>Pro+ $60/mo</td><td style={td}>Premium <strong style={{ color: '#0F172A' }}>$30/mo</strong></td></tr>
            <tr><td style={was}>Ultra $200/mo</td><td style={td}>Super <strong style={{ color: '#0F172A' }}>$100/mo</strong> &middot; Ultra <strong style={{ color: '#0F172A' }}>$200/mo</strong></td></tr>
            <tr><td style={was}>Teams $40 or $120</td><td style={td}>Teams <strong style={{ color: '#0F172A' }}>$30, $100 or $200</strong> per seat</td></tr>
          </tbody>
        </table>
        <p style={body}>
          Two things change for coding teams. Cloud agents and Bugbot now start at Premium, and third-party models such as Claude and GPT are billed per use at API list price. Existing Pro, Pro+, Ultra and Teams plans continue until customers switch.
        </p>
      </div>

      {/* PRICE CHANGES */}
      <div style={sec}>Price changes</div>
      <div style={item}>
        <div style={kick('#B45309')}>Pricing &middot; Plans</div>
        <div style={row}>
          <img src="/logos/lindy.png" alt="Lindy logo" width={24} height={24} style={logo} />
          <h3 style={h3}><a href="/agents/lindy" style={nameLink}>Lindy</a> replaced its three plans with one Team plan</h3>
        </div>
        <p style={body}>
          Plus, Pro and Max are gone. A new workspace now starts free with $50 in credits for 7 days, no card needed. Team costs $29.99 per active user a month for 3,000 credits, with higher credit levels available and top-ups at $10 per 1,000 credits.
        </p>
      </div>
      <div style={item}>
        <div style={kick('#B45309')}>Pricing &middot; Increase</div>
        <div style={row}>
          <img src="/logos/klaviyo-ai.png" alt="Klaviyo logo" width={80} height={24} style={{ width: 80, height: 24, objectFit: 'contain', flex: 'none' }} />
          <img src="/logos/tabstack.png" alt="Tabstack logo" width={24} height={24} style={logo} />
          <h3 style={h3}><a href="/agents/klaviyo-ai" style={nameLink}>Klaviyo</a> and <a href="/agents/tabstack" style={nameLink}>Tabstack</a> raised entry prices</h3>
        </div>
        <table style={tbl}>
          <thead><tr><th style={th}>Plan</th><th style={th}>Was</th><th style={th}>Now</th><th style={th}>Billed</th></tr></thead>
          <tbody>
            <tr><td style={td}>Klaviyo Marketing, 500 profiles</td><td style={was}>$78/mo</td><td style={now}>$90/mo</td><td style={td}>Monthly</td></tr>
            <tr><td style={td}>Tabstack entry plan</td><td style={was}>$0 + usage</td><td style={now}>$10/mo</td><td style={td}>Monthly</td></tr>
          </tbody>
        </table>
        <p style={body}>
          Klaviyo&rsquo;s Email plan stays at $20/mo. The increase is on the Marketing plan, which bundles email with Social Marketing and Customer Hub. Tabstack&rsquo;s new Starter plan includes 100,000 credits, and new accounts still get 10,000 free credits.
        </p>
        <p style={{ ...body, marginTop: '0.75rem' }}>
          Klaviyo is also running a $19 first-month offer for new accounts until November 30, so its pricing page shows a lower first-month price. The figures above are the regular monthly rates.
        </p>
      </div>
      <div style={item}>
        <div style={kick('#B45309')}>Pricing &middot; New tier</div>
        <div style={row}>
          <img src="/logos/apollo-io.png" alt="Apollo.io logo" width={24} height={24} style={logo} />
          <h3 style={h3}><a href="/agents/apollo-io" style={nameLink}>Apollo.io</a> split its Inbound add-on in two</h3>
        </div>
        <table style={tbl}>
          <thead><tr><th style={th}>Add-on</th><th style={th}>Billed yearly</th><th style={th}>Billed monthly</th></tr></thead>
          <tbody>
            <tr><td style={td}>Inbound Essentials</td><td style={now}>$119/mo</td><td style={td}>$149/mo</td></tr>
            <tr><td style={td}>Inbound Max</td><td style={now}>$639/mo</td><td style={td}>$799/mo</td></tr>
          </tbody>
        </table>
        <p style={body}>Prices are per team. Max raises website visitor identification to 2,000,000 contacts and companies a month.</p>
      </div>

      {/* OWNERSHIP */}
      <div style={sec}>Ownership</div>
      <div style={item}>
        <div style={kick('#6D28D9')}>Acquisition</div>
        <div style={row}>
          <img src="/logos/augment-code.png" alt="Augment Code logo" width={24} height={24} style={logo} />
          <h3 style={h3}>Harness bought Cosmos and the Auggie CLI from <a href="/agents/augment-code" style={nameLink}>Augment Code</a></h3>
        </div>
        <p style={body}>
          On October 8 Harness acquired Cosmos, the Auggie CLI and the Code Context Engine, and the team behind them joined Harness. Cosmos becomes the Harness Cosmos Software Factory Agent. Augment Code still sells its plans and has not said what the sale means for them.
        </p>
      </div>

      {/* LAUNCHES */}
      <div style={sec}>Launches</div>
      <div style={item}>
        <div style={kick('#475569')}>Product</div>
        <div style={row}>
          <img src="/logos/clay.png" alt="Clay logo" width={24} height={24} style={logo} />
          <h3 style={h3}><a href="/agents/clay" style={nameLink}>Clay</a> launched Workflows at Sculpt</h3>
        </div>
        <p style={body}>
          Workflows is a visual canvas for building go-to-market systems. Clay also opened a beta of a new Clay agent that runs and schedules plays from chat, and previewed an Inbound SDR Agent.
        </p>
      </div>
      <div style={item}>
        <div style={kick('#475569')}>Also shipped</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <p style={body}><a href="/agents/lindy" style={strongLink}>Lindy</a> can now learn a task by watching you do it once, and make and answer phone calls from its own number.</p>
          <p style={body}><a href="/agents/close-crm" style={strongLink}>Close CRM</a> took Chloe Chat out of beta on every plan, with a free weekly allowance. It asks before changing any record.</p>
          <p style={body}><a href="/agents/spellar-ai" style={strongLink}>Spellar AI</a> launched an MCP server, so Claude, ChatGPT, Cursor and other assistants can read your meetings. It can never delete anything.</p>
          <p style={body}><a href="/agents/replit-agent" style={strongLink}>Replit Agent</a> added Bring Your Own Cloud for Azure, Google Cloud and AWS, in preview and early access for Enterprise customers.</p>
          <p style={body}><a href="/agents/cline" style={strongLink}>Cline</a> Cloud Agents take a task on a GitHub repository from the browser and return a branch or pull request, up to 10 at once.</p>
          <p style={body}><a href="/agents/akiflow" style={strongLink}>Akiflow</a> added two-way iCloud Calendar sync, Travel Time blocks and an Apple Watch app.</p>
          <p style={body}><a href="/agents/cohere-coral" style={strongLink}>Cohere</a> launched North 2, with new agent orchestration, skills, memory and admin cost controls.</p>
          <p style={body}><a href="/agents/surfer-seo" style={strongLink}>Surfer</a> took its MCP server out of beta on Pro, Peace of Mind and Enterprise plans.</p>
        </div>
      </div>

      {/* REMOVED */}
      <div style={sec}>Removed from the index</div>
      <div style={item}>
        <div style={kick('#B91C1C')}>Removed</div>
        <p style={{ ...body, marginBottom: '0.75rem' }}>
          <strong style={{ color: '#0F172A' }}>Plandex</strong> is no longer maintained. Its website and docs no longer load, and the code has not changed since October 2025. See other <a href="/ai-coding-agents" style={link}>AI coding agents</a>.
        </p>
        <p style={body}>
          <strong style={{ color: '#0F172A' }}>Bing Deep Search</strong> no longer appears on Bing, whose AI search now sits under its AI Mode tab. See other <a href="/ai-research-agents" style={link}>AI research agents</a>.
        </p>
      </div>

      {/* NEW TO THE INDEX */}
      <div style={sec}>New to the index</div>
      <div style={item}>
        <p style={{ ...body, marginBottom: '0.375rem' }}>19 products joined the index. Five have full audited listings.</p>
        {NEW_LISTINGS.map((a) => (
          <div key={a.slug} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '0.75rem 0', borderTop: '1px solid #F1F5F9' }}>
            <img src={`/logos/${a.slug}.png`} alt={`${a.name} logo`} width={32} height={32} style={logoLg} />
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
        <p style={{ ...body, fontSize: '0.875rem', color: '#475569' }}>
          <strong style={{ color: '#0F172A' }}>No rating changes to report this issue.</strong> Our <a href="/methodology" style={link}>methodology</a> explains how the scores are built.
        </p>
      </div>

      {/* FOOTER (no mailing address on the public page) */}
      <div style={{ marginTop: '1.5rem', padding: '1.5rem 1.25rem', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', borderRadius: 8 }}>
        <p style={{ fontSize: '0.8125rem', lineHeight: 1.6, color: '#475569', margin: 0 }}>
          Prices are in US dollars unless marked, read on each vendor&rsquo;s own site on October 21, 2026. This page is a frozen archive copy and is not updated afterwards, so check the current listing before you buy. Listings are free and editorial, and advertising never changes a rating or a ranking. Some listings carry affiliate links or sponsored placements, labelled on each listing page.
        </p>
      </div>
    </div>
  )
}
