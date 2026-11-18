// app/resources/newsletter/2026-11-18/page.tsx
// Newsletter Issue #9: static, dated, frozen archive copy.
// Prices are a point-in-time snapshot (verified November 18, 2026) and are
// intentionally NOT templated: an archived issue must not silently rewrite
// itself later. Do not convert these to {{slug.starting_price}}.
// No em dashes anywhere (house style). No inline affiliate disclosure boxes
// (Heather, 2026-09-22); one general footer line remains.
// No mailing address on this page (Heather, 2026-10-20): the address is in the email footer only.

import type { Metadata } from 'next'

const ISSUE_URL = 'https://theaiagentindex.com/resources/newsletter/2026-11-18'
const TITLE = 'Price & Rating Tracker: Issue #9 (November 2026)'
const DESC =
  'AiSDR, Adapt, Snyk and ThoughtSpot moved to usage pricing, Anthropic split Max into Max and Ultra, Claude Fable 5.2 got cheaper, and OpenAI extended Cursor\u2019s model access.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: ISSUE_URL },
  openGraph: { images: [{ url: 'https://theaiagentindex.com/og-image-2026-11.png', width: 1200, height: 630 }],  title: TITLE, description: DESC, url: ISSUE_URL, type: 'article', siteName: 'The AI Agent Index' },
  twitter: { images: ['https://theaiagentindex.com/og-image-2026-11.png'],  card: 'summary', title: TITLE, description: DESC },
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
  { slug: 'anara', name: 'Anara', price: 'free, Plus $8/seat/mo yearly', desc: 'AI research workspace for finding papers and getting cited answers.' },
  { slug: 'converso', name: 'Converso', price: 'free, Pro $18/mo yearly', desc: 'AI support and sales agent with a shared inbox for WhatsApp and webchat, priced per conversation.' },
  { slug: 'docket', name: 'Docket', price: 'from $4K/mo yearly', desc: 'AI marketing agent that answers B2B website visitors and books meetings.' },
  { slug: 'freebuff', name: 'Freebuff', price: 'free with ads, paid from $8/mo', desc: 'Ad-supported AI coding agent for the terminal, desktop and browser.' },
  { slug: 'jimo-adoption-agent', name: 'Jimo Adoption Agent', price: '$79/mo yearly', desc: 'In-app AI agent that answers from your docs and guides users through B2B SaaS apps.' },
  { slug: 'legora', name: 'Legora', price: 'by quote', desc: 'AI platform for law firms and in-house teams: research, review and drafting.' },
  { slug: 'quick-bi', name: 'Quick BI', price: '$50 per seat/mo, 10 seats min', desc: "Alibaba Cloud's AI data analysis agent for plain-language questions." },
  { slug: 'spara', name: 'Spara', price: 'from $2,100/mo yearly', desc: 'AI agents that qualify inbound B2B buyers and book meetings across chat, email and voice.' },
]

export default function NewsletterIssue09() {
  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>
      <a href="/resources/newsletter" style={{ fontSize: '0.8125rem', color: '#64748B', textDecoration: 'none', marginBottom: '1.5rem', display: 'inline-block' }}>&larr; Newsletter</a>

      {/* Masthead */}
      <div style={{ height: 4, background: '#2563EB', borderRadius: 2, marginBottom: '1.5rem' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0F172A' }}>The AI Agent Index</span>
        <span style={{ fontFamily: MONO, fontSize: '0.6875rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748B' }}>Issue 9 &middot; Nov 18, 2026</span>
      </div>
      <h1 style={{ fontSize: '2rem', lineHeight: 1.15, fontWeight: 700, color: '#0F172A', margin: '1.5rem 0 0.875rem', letterSpacing: '-0.01em' }}>Price &amp; Rating Tracker</h1>
      <p style={{ ...body, fontSize: '1.0625rem', lineHeight: 1.6, color: '#1E293B' }}>
        AiSDR, Adapt, Snyk and ThoughtSpot moved to usage pricing, Anthropic added an Ultra plan, and OpenAI extended Cursor&rsquo;s access to its models with no new end date.
      </p>
      <div style={{ marginTop: '1.25rem', padding: '0.875rem 1rem', background: '#F8FAFC', borderRadius: 8, display: 'flex', flexWrap: 'wrap', gap: '0.375rem 1.125rem', fontSize: '0.8125rem', color: '#334155' }}>
        <span style={{ fontFamily: MONO, fontSize: '0.6875rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#475569' }}>In this issue</span>
        <span>Headline</span>
        <span>Prices <span style={{ fontFamily: MONO, color: '#64748B' }}>9</span></span>
        <span>Ownership <span style={{ fontFamily: MONO, color: '#64748B' }}>8</span></span>
        <span>Launches <span style={{ fontFamily: MONO, color: '#64748B' }}>15</span></span>
        <span>Spotlight</span>
        <span>Shut down <span style={{ fontFamily: MONO, color: '#64748B' }}>1</span></span>
        <span>New listings <span style={{ fontFamily: MONO, color: '#64748B' }}>8</span></span>
        <span>Ratings <span style={{ fontFamily: MONO, color: '#64748B' }}>6</span></span>
      </div>
      <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '0.875rem 0 0' }}>
        Covers changes we confirmed since our last issue on November 4. Prices verified November 18, 2026.
      </p>

      {/* THE HEADLINE */}
      <div style={sec}>The headline</div>
      <div style={item}>
        <div style={kick('#B45309')}>Pricing &middot; Usage</div>
        <div style={{ ...row, marginBottom: '0.75rem' }}>
          <h2 style={{ fontSize: '1.4375rem', lineHeight: 1.25, fontWeight: 700, color: '#0F172A', margin: 0 }}>Four vendors swapped plans and seats for pay-per-use</h2>
        </div>
        <p style={{ ...body, marginBottom: '0.75rem' }}><a href="/agents/aisdr" style={link}>AiSDR</a> retired its Solo, Explore and Scale plans and now charges $1.50 per person prospected, billed daily with no monthly fee. <a href="/agents/adapt" style={link}>Adapt</a> Cloud has no platform or seat fee and bills only for usage, from $0.093 per running hour for its smallest sandbox. <a href="/agents/snyk-ai" style={link}>Snyk</a> retired Ignite and sells enterprise access as a Platform Subscription of prepaid credits at $1 each, spent against a public rate card. <a href="/agents/thoughtspot" style={link}>ThoughtSpot</a>&rsquo;s new AgentSpot, launched October 22, charges per conversation, workflow run or app session, and has a free plan.</p>
        <p style={{ ...body, marginBottom: '0.75rem' }}>For a buyer, the bill now follows use rather than headcount: easier to start, harder to forecast. Ask for an estimate at your own volume before you sign. <a href="/agents/zapier" style={link}>Zapier</a> moved the same way: Zapier Agents now runs as AI by Zapier steps inside Zaps, billed in tasks.</p>
        <div style={{ overflowX: 'auto' }}><table style={tbl}>
          <thead><tr><th style={th}>Vendor</th><th style={th}>Was</th><th style={th}>Now</th></tr></thead>
          <tbody>
            <tr><td style={td}>AiSDR</td><td style={was}>Solo $250/mo, Explore $900/mo, Scale $2,500/mo</td><td style={now}>$1.50 per person prospected, no monthly fee</td></tr>
            <tr><td style={td}>Adapt</td><td style={was}>Managed, $8 per user/mo plus usage</td><td style={now}>Cloud: no platform or seat fee, usage only</td></tr>
            <tr><td style={td}>Snyk</td><td style={was}>Ignite, $1,260 per developer/yr</td><td style={now}>Prepaid credits at $1 each</td></tr>
            <tr><td style={td}>ThoughtSpot AgentSpot</td><td style={td}>New product</td><td style={now}>Per conversation, run or session; free plan</td></tr>
          </tbody>
        </table></div>
      </div>

      {/* PRICE CHANGES */}
      <div style={sec}>Price changes</div>
      <div style={item}>
        <div style={kick('#B45309')}>Pricing &middot; Plans</div>
        <div style={{ ...row, marginBottom: '0.75rem' }}>
          <img src="/logos/claude-mark.png" alt="Claude logo" width={24} height={24} style={logo} />
          <h3 style={h3}><a href="/agents/claude-cowork" style={nameLink}>Anthropic</a> split Max into Max and Ultra</h3>
        </div>
        <p style={body}>On October 30, Anthropic replaced Max 5x and Max 20x with two plans: Max at $100 a month with 5x Pro usage, and Ultra at $200 a month with 10x Pro&rsquo;s weekly usage and, for verified accounts, no 5-hour limit.</p>
      </div>
      <div style={item}>
        <div style={kick('#B45309')}>Pricing &middot; Decrease</div>
        <div style={{ ...row, marginBottom: '0.75rem' }}>
          <img src="/logos/claude.png" alt="Claude logo" width={24} height={24} style={logo} />
          <h3 style={h3}><a href="/agents/claude" style={nameLink}>Claude Fable 5.2</a> costs less than Fable 5.1</h3>
        </div>
        <div style={{ overflowX: 'auto' }}><table style={tbl}>
          <thead><tr><th style={th}>Model</th><th style={th}>Was</th><th style={th}>Now</th><th style={th}>Per</th></tr></thead>
          <tbody>
            <tr><td style={td}>Fable, input</td><td style={was}>$10</td><td style={now}>$8</td><td style={td}>Million tokens</td></tr>
            <tr><td style={td}>Fable, output</td><td style={was}>$50</td><td style={now}>$40</td><td style={td}>Million tokens</td></tr>
          </tbody>
        </table></div>
        <p style={body}>Released November 9 with a 1M-token context window.</p>
      </div>
      <div style={item}>
        <div style={kick('#B45309')}>Pricing &middot; Included</div>
        <div style={{ ...row, marginBottom: '0.75rem' }}>
          <img src="/logos/chatgpt.png" alt="ChatGPT logo" width={24} height={24} style={logo} />
          <h3 style={h3}><a href="/agents/chatgpt" style={nameLink}>ChatGPT</a> Pro and Business now include API credits</h3>
        </div>
        <p style={body}>Eligible subscribers can claim monthly OpenAI API credits. On Pro, the credits match the plan price: $100, $200 or $500 a month. On Business, they are $20 per Standard seat and $100 per Premium seat, capped at $500 a month per workspace. Unused credits do not roll over.</p>
      </div>
      <div style={item}>
        <div style={kick('#B45309')}>Pricing &middot; Plans</div>
        <div style={{ ...row, marginBottom: '0.75rem' }}>
          <img src="/logos/github-copilot.png" alt="GitHub Copilot logo" width={24} height={24} style={logo} />
          <h3 style={h3}><a href="/agents/github-copilot" style={nameLink}>GitHub Copilot</a> comes with GitHub Enterprise for account-team customers</h3>
        </div>
        <p style={body}>Enterprises working with a GitHub or Microsoft account team can get Copilot for every GitHub Enterprise Cloud user, and $10 per user per month as Copilot Standalone for everyone else. Neither includes AI credits, so usage is metered from the first request. Business at $19 and Enterprise at $39 stay on sale, and self-serve access comes later in stages.</p>
      </div>
      <div style={item}>
        <div style={kick('#B45309')}>Pricing &middot; Plans</div>
        <div style={{ ...row, marginBottom: '0.75rem' }}>
          <img src="/logos/openhands.png" alt="OpenHands logo" width={24} height={24} style={logo} />
          <h3 style={h3}><a href="/agents/openhands" style={nameLink}>OpenHands</a> added a $500 Teams plan</h3>
        </div>
        <div style={{ overflowX: 'auto' }}><table style={tbl}>
          <thead><tr><th style={th}>Plan</th><th style={th}>Was</th><th style={th}>Now</th><th style={th}>Billed</th></tr></thead>
          <tbody>
            <tr><td style={td}>Teams, up to 10 users</td><td style={td}>New</td><td style={now}>$500</td><td style={td}>Monthly</td></tr>
            <tr><td style={td}>Each extra seat</td><td style={td}>New</td><td style={now}>$50</td><td style={td}>Monthly</td></tr>
          </tbody>
        </table></div>
        <p style={body}>Teams comes with a 30-day trial. The free hosted tier is no longer on the pricing page; the open-source version is still free to self-host.</p>
      </div>
      <div style={item}>
        <div style={kick('#B45309')}>Pricing &middot; Published</div>
        <div style={{ ...row, marginBottom: '0.75rem' }}>
          <img src="/logos/fathom.png" alt="Fathom logo" width={24} height={24} style={logo} />
          <h3 style={h3}><a href="/agents/fathom" style={nameLink}>Fathom</a> published its Enterprise price</h3>
        </div>
        <div style={{ overflowX: 'auto' }}><table style={tbl}>
          <thead><tr><th style={th}>Plan</th><th style={th}>Was</th><th style={th}>Now</th><th style={th}>Billed</th></tr></thead>
          <tbody>
            <tr><td style={td}>Enterprise</td><td style={td}>Contact sales</td><td style={now}>$35 per user/mo</td><td style={td}>Annually</td></tr>
          </tbody>
        </table></div>
      </div>
      <div style={item}>
        <div style={kick('#B45309')}>Pricing &middot; Increase</div>
        <div style={{ ...row, marginBottom: '0.75rem' }}>
          <img src="/logos/openjobs-ai.png" alt="Metix AI logo" width={24} height={24} style={logo} />
          <h3 style={h3}><a href="/agents/openjobs-ai" style={nameLink}>Metix AI</a> doubled its entry price</h3>
        </div>
        <div style={{ overflowX: 'auto' }}><table style={tbl}>
          <thead><tr><th style={th}>Plan</th><th style={th}>Was</th><th style={th}>Now</th><th style={th}>Billed</th></tr></thead>
          <tbody>
            <tr><td style={td}>Starter</td><td style={was}>$49</td><td style={now}>$99</td><td style={td}>Monthly</td></tr>
          </tbody>
        </table></div>
        <p style={body}>Yearly billing takes 10% off. Each plan now includes AI Agents, and work inside an Agent&rsquo;s workflow uses no Credits.</p>
      </div>
      <div style={item}>
        <div style={kick('#B45309')}>Pricing &middot; Included</div>
        <div style={{ ...row, marginBottom: '0.75rem' }}>
          <img src="/logos/wati.png" alt="Wati logo" width={24} height={24} style={logo} />
          <h3 style={h3}><a href="/agents/wati" style={nameLink}>Wati</a> now includes Astra AI agents in every plan</h3>
        </div>
        <div style={{ overflowX: 'auto' }}><table style={tbl}>
          <thead><tr><th style={th}>Plan</th><th style={th}>Was</th><th style={th}>Now</th><th style={th}>Per month</th></tr></thead>
          <tbody>
            <tr><td style={td}>Growth</td><td style={was}>250 credits</td><td style={now}>2,000 credits, 1 agent</td><td style={td}>Wati AI</td></tr>
            <tr><td style={td}>Pro</td><td style={was}>500 credits</td><td style={now}>5,000 credits, 2 agents</td><td style={td}>Wati AI</td></tr>
            <tr><td style={td}>Business</td><td style={was}>1,500 credits</td><td style={now}>20,000 credits, unlimited agents</td><td style={td}>Wati AI</td></tr>
          </tbody>
        </table></div>
        <p style={body}>Astra used to be sold separately. Plan prices are unchanged, and the credits are shared between Wati AI and Astra.</p>
      </div>
      <div style={item}>
        <div style={kick('#B91C1C')}>Shutting down</div>
        <div style={{ ...row, marginBottom: '0.75rem' }}>
          <img src="/logos/stagewise.png" alt="Stagewise logo" width={24} height={24} style={logo} />
          <h3 style={h3}><a href="/agents/stagewise" style={nameLink}>Stagewise</a> accounts end after November</h3>
        </div>
        <p style={body}>After November, the Stagewise IDE runs on your own model plan or API key. The team has largely paused Stagewise to build Klex Bots, and says bug fixes and small improvements will continue.</p>
      </div>

      {/* OWNERSHIP */}
      <div style={sec}>Ownership</div>
      <div style={item}>
        <div style={kick('#6D28D9')}>Supply</div>
        <div style={{ ...row, marginBottom: '0.75rem' }}>
          <img src="/logos/cursor.png" alt="Cursor logo" width={24} height={24} style={logo} />
          <h3 style={h3}>OpenAI extended <a href="/agents/cursor" style={nameLink}>Cursor</a>&rsquo;s access to its models</h3>
        </div>
        <p style={body}>In August, OpenAI said it would wind down its contract supplying models to Cursor after SpaceX acquired Cursor, with a proposed shutoff of November 12, and that Cursor would get no future OpenAI models. On November 12 it extended the access temporarily. It has not given a new end date.</p>
      </div>
      <div style={item}>
        <div style={kick('#6D28D9')}>Acquisitions &middot; Renames</div>
        <p style={{ ...body, marginBottom: '0.75rem' }}><a href="/agents/cohere-coral" style={link}>Cohere</a> completed its acquisition of AISLE on November 13 and formed Cohere Cyber; the team behind code review platform cubic also joined.</p>
        <p style={{ ...body, marginBottom: '0.75rem' }}><a href="/agents/sierra" style={link}>Sierra</a> acquired Anon, which lets AI agents use websites that have no API.</p>
        <p style={{ ...body, marginBottom: '0.75rem' }}><a href="/agents/harvey-ai" style={link}>Harvey</a> acquired Aida, a sales execution platform, its fifth acquisition this year.</p>
        <p style={{ ...body, marginBottom: '0.75rem' }}><a href="/agents/factory-ai" style={link}>Factory</a> acquired Typedef on October 30, and HumanLayer joined Factory on November 4.</p>
        <p style={{ ...body, marginBottom: '0.75rem' }}><a href="/agents/optimizely-ai" style={link}>Optimizely</a> renamed Opal, its marketing agent platform, to Mark on October 15.</p>
        <p style={{ ...body, marginBottom: '0.75rem' }}><a href="/agents/opencode" style={link}>OpenCode</a>&rsquo;s pay-as-you-go model service, OpenCode Zen, now appears as OpenCode Console.</p>
        <p style={body}><a href="/agents/marketmuse" style={link}>MarketMuse</a> is now part of Siteimprove.ai&rsquo;s Content Strategy agents; logins are unchanged.</p>
      </div>

      {/* LAUNCHES */}
      <div style={sec}>Launches</div>
      <div style={item}>
        <div style={kick('#475569')}>Product</div>
        <div style={{ ...row, marginBottom: '0.75rem' }}>
          <img src="/logos/github-copilot.png" alt="GitHub Copilot logo" width={24} height={24} style={logo} />
          <h3 style={h3}><a href="/agents/github-copilot" style={nameLink}>GitHub Copilot</a> Fusion picks the model for you</h3>
        </div>
        <p style={body}>Copilot Fusion is generally available on all Copilot plans. Instead of choosing a model, a developer picks Standard, High or Max effort, and Copilot routes each prompt: one model, a hand-off to a stronger one when a quality check fails, or one model reviewing another. Paid plans get a temporary 30% discount on model costs with Fusion. The same day, GitHub opened 26 verified connectors, including Slack, Figma, Notion and Linear, in public preview.</p>
      </div>
      <div style={item}>
        <div style={kick('#475569')}>Also shipped</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <p style={body}><a href="/agents/attentive-ai" style={strongLink}>Attentive</a> made its MCP server generally available on November 9, with read and write access from ChatGPT and Claude.</p>
          <p style={body}><a href="/agents/coderabbit" style={strongLink}>CodeRabbit</a> launched a hosted MCP server on November 13 for GitHub Cloud organizations in its US region.</p>
          <p style={body}><a href="/agents/anyword" style={strongLink}>Anyword</a> launched a remote MCP server with 13 tools that score and improve marketing copy.</p>
          <p style={body}><a href="/agents/brave-search-api" style={strongLink}>Brave Search API</a> now accepts x402 payments in USDC on Base, at $5 per 1,000 requests, with no account needed.</p>
          <p style={body}><a href="/agents/browser-use" style={strongLink}>Browser Use 1.0</a> rebuilt its open-source library so the agent writes Python that controls Chrome directly.</p>
          <p style={body}><a href="/agents/contentful-ai" style={strongLink}>Contentful</a>&rsquo;s Content Operations Agent is generally available on Pro plans and above, and asks before it publishes.</p>
          <p style={body}><a href="/agents/klaviyo-ai" style={strongLink}>Klaviyo</a> released its first mobile app, an iPhone app for its Composer marketing agent.</p>
          <p style={body}><a href="/agents/otter-ai" style={strongLink}>Otter</a> now transcribes 17 languages, adding Italian, Korean, Polish and eight more.</p>
          <p style={body}><a href="/agents/fireflies-ai" style={strongLink}>Fireflies</a> relaunched Fred as an AI teammate that also handles email and Slack, connected to 240+ apps.</p>
          <p style={body}><a href="/agents/lexis-plus-protege" style={strongLink}>Lexis+ with Protégé</a> added Shepard&rsquo;s Verify and Vaults of up to 100,000 documents, rolling out in the US.</p>
          <p style={body}><a href="/agents/harvey-ai" style={strongLink}>Harvey</a> put agents in its Outlook add-in that triage email and draft replies, with nothing sent until the lawyer reviews it.</p>
          <p style={body}><a href="/agents/churnzero" style={strongLink}>ChurnZero</a>&rsquo;s AI connections can now create tasks, notes and success plans, once an admin turns on each record type.</p>
          <p style={body}><a href="/agents/cursor" style={strongLink}>Cursor</a> Projects went multiplayer in a beta for all users, so teammates can work alongside its agents.</p>
          <p style={body}><a href="/agents/persado" style={strongLink}>Persado</a> is now listed in Microsoft Marketplace as an agent for Microsoft 365 Copilot.</p>
        </div>
      </div>

      {/* SPOTLIGHT (affiliate, labeled) */}
      <div style={sec}>Spotlight</div>
      <div style={item}>
        <div style={kick('#475569')}>Spotlight &middot; Affiliate</div>
        <div style={{ ...row, marginBottom: '0.75rem' }}>
          <img src="/logos/granola.png" alt="Granola logo" width={24} height={24} style={logo} />
          <h3 style={h3}><a href="/agents/granola" style={nameLink}>Granola</a> takes meeting notes without a bot on the call</h3>
        </div>
        <p style={{ ...body, marginBottom: '0.75rem' }}>Granola uses your computer&rsquo;s audio, so no bot joins the meeting, and it works with Zoom, Google Meet, Teams and other meeting apps on macOS, Windows, iOS and Android. Basic is free. Business, at $14 per user per month, adds integrations such as Notion, HubSpot and Zapier, pre-meeting briefs, and the agent briefs Granola launched on November 11.</p>
        <p style={{ ...body, marginBottom: '0.75rem' }}>New users get their first month free through our link.</p>
        <a href="https://go.granola.ai/aai-newsletter" rel="sponsored noopener" style={{ display: 'inline-block', margin: '0.25rem 0 0.75rem', padding: '0.6875rem 1.25rem', background: '#2563EB', color: '#FFFFFF', fontWeight: 700, borderRadius: 8, textDecoration: 'none' }}>Try Granola free</a>
        <p style={{ ...body, fontSize: '0.8125rem', color: '#64748B' }}>Affiliate link: we may earn a commission if you sign up. It does not change our review or rating.</p>
      </div>

      {/* SHUT DOWN */}
      <div style={sec}>Shut down</div>
      <div style={item}>
        <div style={kick('#B91C1C')}>Discontinued</div>
        <p style={body}><strong style={{ color: '#0F172A' }}><a href="/agents/fetcher" style={link}>Fetcher</a></strong> retired its candidate sourcing platform in October after <a href="/agents/juicebox-peoplegpt" style={link}>Juicebox</a> agreed to buy its assets. Its listing stays, marked discontinued.</p>
      </div>

      {/* NEW TO THE INDEX */}
      <div style={sec}>New to the index</div>
      <div style={item}>
        <p style={{ ...body, marginBottom: '0.375rem' }}>33 products joined the index. 8 have full audited listings.</p>
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
        <div style={kick('#15803D')}>Rating up</div>
        <div style={{ overflowX: 'auto' }}><table style={tbl}>
          <thead><tr><th style={th}>Agent</th><th style={th}>Was</th><th style={th}>Now</th><th style={th}>Why</th></tr></thead>
          <tbody>
            <tr><td style={td}><a href="/agents/snyk-ai" style={strongLink}>Snyk</a></td><td style={was}>4.3</td><td style={{ ...now, color: '#15803D' }}>4.6</td><td style={td}>Forrester named it a Leader in its Agentic Development Security Tools Wave, Q4 2026 (November 4).</td></tr>
            <tr><td style={td}><a href="/agents/zapier" style={strongLink}>Zapier</a></td><td style={was}>4.3</td><td style={{ ...now, color: '#15803D' }}>4.6</td><td style={td}>AI by Zapier steps, which can add their own tools, now run inside any paid Zap (October 6).</td></tr>
            <tr><td style={td}><a href="/agents/vidyard" style={strongLink}>Vidyard</a></td><td style={was}>4.4</td><td style={{ ...now, color: '#15803D' }}>4.6</td><td style={td}>It published an MCP server, available on every plan including Free.</td></tr>
            <tr><td style={td}><a href="/agents/litmaps" style={strongLink}>Litmaps</a></td><td style={was}>3.7</td><td style={{ ...now, color: '#15803D' }}>4.1</td><td style={td}>It began rolling out Ask Litmaps, which answers research questions with cited articles.</td></tr>
            <tr><td style={td}><a href="/agents/decagon" style={strongLink}>Decagon</a></td><td style={was}>3.9</td><td style={{ ...now, color: '#15803D' }}>4.4</td><td style={td}>Changed since our last check: its G2 reviews passed 100, now 155 at 4.4.</td></tr>
            <tr><td style={td}><a href="/agents/scite-ai" style={strongLink}>Scite</a></td><td style={was}>4.0</td><td style={{ ...now, color: '#15803D' }}>4.3</td><td style={td}>Changed since our last check: its Trustpilot reviews now number 274 at 4.4.</td></tr>
          </tbody>
        </table></div>
        <p style={{ ...body, fontSize: '0.875rem', color: '#475569' }}>Our <a href="/methodology" style={link}>methodology</a> explains how the scores are built.</p>
      </div>

      {/* FOOTER (no mailing address on the public page) */}
      <div style={{ marginTop: '1.5rem', padding: '1.5rem 1.25rem', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', borderRadius: 8 }}>
        <p style={{ fontSize: '0.8125rem', lineHeight: 1.6, color: '#475569', margin: 0 }}>
          Prices are in US dollars, read on each vendor&rsquo;s own site on November 18, 2026. This page is a frozen archive copy and is not updated afterwards, so check the current listing before you buy. Ratings are editorial, and no payment or advertising changes a rating or a ranking. Some listings carry affiliate links or sponsored placements, labeled on each listing page.
        </p>
      </div>
    </div>
  )
}
