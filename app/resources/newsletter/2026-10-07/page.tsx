// app/resources/newsletter/2026-10-07/page.tsx
// Newsletter Issue #6: static, dated, frozen archive copy.
// Prices are a point-in-time snapshot (verified October 7, 2026) and are
// intentionally NOT templated: an archived issue must not silently rewrite
// itself later. Do not convert these to {{slug.starting_price}}.
// Uses inline styles to match the site convention (see resources/newsletter/page.tsx).
// No em dashes anywhere (house style). No inline affiliate disclosure boxes
// (Heather, 2026-09-22); one general footer line remains.

import type { Metadata } from 'next'

const ISSUE_URL = 'https://theaiagentindex.com/resources/newsletter/2026-10-07'
const TITLE = 'Price & Rating Tracker: Issue #6 (October 2026)'
const DESC =
  'Microsoft rebuilt Copilot around Home, Code and Autopilot. OpenAI reopened Pro 200, added a $500 Pro plan and retired ChatGPT Agent. Ocoya, Predis.ai, lemlist and Profound changed pricing. Verified against live vendor data.'

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
const th: React.CSSProperties = {
  textAlign: 'left', fontSize: '0.6875rem', fontWeight: 700, color: '#6B7280',
  textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0.5rem 0.75rem',
  borderBottom: '1px solid #E5E7EB', background: '#F9FAFB',
}
const td: React.CSSProperties = {
  fontSize: '0.875rem', color: '#374151', padding: '0.75rem', borderBottom: '1px solid #F3F4F6',
}

export default function NewsletterIssue06() {
  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>
      <a href="/resources/newsletter" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', marginBottom: '1.5rem', display: 'inline-block' }}>&larr; Newsletter</a>

      {/* Masthead */}
      <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>The AI Agent Index</p>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#111827', margin: '0 0 0.375rem', letterSpacing: '-0.02em' }}>Price &amp; Rating Tracker</h1>
      <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '1rem' }}>Issue #6 &middot; October 7, 2026</div>
      <p style={{ ...body, marginBottom: '0.5rem' }}>
        Microsoft rebuilt Copilot around Home, Code and Autopilot, OpenAI added a $500 Pro plan and retired ChatGPT Agent, and four vendors changed their pricing.
      </p>
      <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: 0, paddingBottom: '1.25rem', borderBottom: '1px solid #E5E7EB' }}>
        Prices are a snapshot verified on October 7, 2026. This issue covers everything since our last issue on September 22.
      </p>

      {/* THE HEADLINE */}
      <div style={sectionLabel}>The Headline</div>
      <h2 style={{ fontSize: '1.3125rem', lineHeight: 1.3, fontWeight: 800, color: '#111827', margin: '0 0 0.875rem' }}>Microsoft rebuilt Copilot around Home, Code and Autopilot</h2>
      <p style={{ ...body, marginBottom: '0.875rem' }}>
        On September 25 Microsoft introduced a new Copilot with three parts. Home brings Chat and <a href="/agents/microsoft-copilot-cowork" style={linkBlue}>Cowork</a> together. Code builds an app, tracker or dashboard from a plain description. Autopilot, previously called <a href="/agents/microsoft-scout" style={linkBlue}>Microsoft Scout</a>, is a cloud-hosted agent that keeps working toward a goal without waiting for a prompt.
      </p>
      <p style={body}>
        The part that affects budgets: Cowork, Code and Autopilot all run on usage-based billing, separate from the per-user <a href="/agents/microsoft-365-copilot" style={linkBlue}>Microsoft 365 Copilot</a> license that covers Chat and Copilot in Word, Excel, PowerPoint, Outlook and Teams. Home and Code are rolling out through Microsoft&rsquo;s Frontier program, and Autopilot entered private preview at the end of September.
      </p>

      {/* PRICE CHANGES */}
      <div style={sectionLabel}>Price Changes</div>
      <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '8px', padding: '0.875rem 1rem', marginTop: '0.75rem' }}>
        <p style={{ ...lede, margin: '0 0 0.375rem' }}><a href="/agents/chatgpt" style={linkBlue}>ChatGPT</a> Pro 200 is open again, and Pro 500 is new</p>
        <p style={{ ...body, marginBottom: '0' }}>
          Our last issue reported that OpenAI had paused new Pro $200 sign-ups. On September 29 it reopened Pro 200 and added Pro 500 at $500/mo, the only Pro plan that includes Astra Ultrafast. New Pro 200 subscribers get a lower usage allowance than before. Anyone subscribed between September 22 and 29 keeps the old allowance through October 29.
        </p>
      </div>
      <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '8px', padding: '0.875rem 1rem', marginTop: '0.75rem' }}>
        <p style={{ ...lede, margin: '0 0 0.375rem' }}><a href="/agents/ocoya" style={linkBlue}>Ocoya</a> and <a href="/agents/predis-ai" style={linkBlue}>Predis.ai</a> raised their entry prices</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#FFFFFF', border: '1px solid #E5E7EB', margin: '0.375rem 0 0.75rem' }}>
          <thead><tr><th style={th}>Plan</th><th style={th}>Was</th><th style={th}>Now</th><th style={th}>Billed</th></tr></thead>
          <tbody>
          <tr>
            <td style={td}>Ocoya entry plan</td>
            <td style={{ ...td, color: '#9CA3AF', textDecoration: 'line-through' }}>$15/mo</td>
            <td style={{ ...td, fontWeight: 700, color: '#111827' }}>$29/mo</td>
            <td style={td}>Monthly</td>
          </tr>
          <tr>
            <td style={td}>Predis.ai Core</td>
            <td style={{ ...td, color: '#9CA3AF', textDecoration: 'line-through' }}>$19/mo</td>
            <td style={{ ...td, fontWeight: 700, color: '#111827' }}>$24/mo</td>
            <td style={td}>Yearly</td>
          </tr>
          <tr>
            <td style={td}>Predis.ai Rise</td>
            <td style={{ ...td, color: '#9CA3AF', textDecoration: 'line-through' }}>$40/mo</td>
            <td style={{ ...td, fontWeight: 700, color: '#111827' }}>$55/mo</td>
            <td style={td}>Yearly</td>
          </tr>
          </tbody>
        </table>
        <p style={{ ...body, marginBottom: '0' }}>
          Ocoya replaced four plans with three: Starter at $29/mo, Team at $79/mo and Agency at $199/mo, with two months free on yearly billing. Predis.ai also cut its free trial from 7 days to 3 and now takes a card to start it. Its month-to-month prices did not change.
        </p>
      </div>
      <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '8px', padding: '0.875rem 1rem', marginTop: '0.75rem' }}>
        <p style={{ ...lede, margin: '0 0 0.375rem' }}><a href="/agents/lemlist" style={linkBlue}>lemlist</a> now sells data in its own plans</p>
        <p style={{ ...body, marginBottom: '0' }}>
          lemlist moved contact data and buying signals into separate Data plans. Lead enrichment starts at $16/mo billed yearly for 2,000 credits a month, and buying intent signals start at $21/mo billed yearly for 100 signals.
        </p>
      </div>
      <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '8px', padding: '0.875rem 1rem', marginTop: '0.75rem' }}>
        <p style={{ ...lede, margin: '0 0 0.375rem' }}><a href="/agents/profound-aim" style={linkBlue}>Profound</a> dropped self-serve plans for brands</p>
        <p style={{ ...body, marginBottom: '0' }}>
          Brands now start with a free 7-day trial and move to a custom-priced Enterprise plan. The self-serve Starter and Growth plans are gone. Agencies can still sign up for Agency Growth at $99/mo.
        </p>
      </div>

      {/* NEW MODELS */}
      <div style={sectionLabel}>New Models</div>
      <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '0.875rem 1rem', marginTop: '0.75rem' }}>
        <p style={{ ...lede, margin: '0 0 0.375rem' }}>Two new Claude models, and GPT-6 in Codex</p>
        <p style={{ ...body, marginBottom: '0.75rem' }}>
          Anthropic released <a href="/agents/claude" style={linkBlue}>Claude</a> Opus 5.5 on September 22 at $4/$20 per million input/output tokens, 20% below Opus 5, and says it costs 40% less to run on typical workloads. Claude Sonnet 5.5 followed on September 28 at $2/$10 per million tokens with a 1M-token context window.
        </p>
        <p style={{ ...body, marginBottom: '0' }}>
          Also on September 22, OpenAI began rolling out GPT-6 Sol and GPT-6 Luna to <a href="/agents/openai-codex" style={linkBlue}>OpenAI Codex</a> at lower token prices than their GPT-5.6 predecessors. Sol is for complex coding and agentic work, Luna for focused, high-volume tasks.
        </p>
      </div>

      {/* SHUT DOWN */}
      <div style={sectionLabel}>Shut Down</div>
      <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '0.875rem 1rem', marginTop: '0.75rem' }}>
        <p style={{ ...lede, margin: '0 0 0.375rem' }}><a href="/agents/chatgpt-agent" style={linkBlue}>ChatGPT Agent</a> is no longer available</p>
        <p style={{ ...body, marginBottom: '0' }}>
          OpenAI now points former users to <a href="/agents/chatgpt-work" style={linkBlue}>ChatGPT Work</a> for longer, multi-step tasks and to cloud browser for browser workflows. OpenAI gave no end date. If you relied on it, <a href="/alternatives/chatgpt-agent-alternatives" style={linkBlue}>our ChatGPT Agent alternatives page</a> covers what to use instead.
        </p>
      </div>
      <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '0.875rem 1rem', marginTop: '0.75rem' }}>
        <p style={{ ...lede, margin: '0 0 0.375rem' }}><a href="/agents/perplexity-ai" style={linkBlue}>Perplexity</a> retired Sonar Chat Completions</p>
        <p style={{ ...body, marginBottom: '0' }}>
          Perplexity ended support for its Sonar Chat Completions API on September 27. Synchronous and streaming requests keep working and are being moved over to its Agent API gradually, model by model. Asynchronous requests no longer work, so check any integration that uses them.
        </p>
      </div>

      {/* NEW TO THE INDEX */}
      <div style={sectionLabel}>New to the Index</div>
      <p style={body}>
        22 products joined the index in this window. Five have full audited listings: <a href="/agents/junie" style={linkBlue}>Junie</a>, JetBrains&rsquo; AI coding agent for the terminal and JetBrains IDEs, free to start with paid plans from $8.33 per user per month. <a href="/agents/meta-muse" style={linkBlue}>Meta Muse</a>, Meta&rsquo;s personal AI agent, free with a usage limit or $20/mo for Power. <a href="/agents/coderabbit" style={linkBlue}>CodeRabbit</a>, AI code review for pull requests. <a href="/agents/kapa-ai" style={linkBlue}>kapa.ai</a>, which turns technical docs into cited answers for AI agents. And <a href="/agents/looot" style={linkBlue}>looot</a>, one key and one prepaid balance for paid data endpoints that agents can call.
      </p>

      {/* RATINGS */}
      <div style={sectionLabel}>Ratings</div>
      <p style={note}>
        <strong>No rating changes this issue.</strong> Nothing a vendor did in this window moved one of our scores. We do adjust our own scores as we learn more about a product, but that is us getting better rather than a company getting better, so we do not report it as news. Our <a href="/methodology" style={linkBlue}>methodology</a> explains how the scores are built.
      </p>

      {/* FOOTER */}
      <p style={{ fontSize: '0.8125rem', lineHeight: 1.6, color: '#6B7280', marginTop: '2.5rem', paddingTop: '1.25rem', borderTop: '1px solid #E5E7EB' }}>
        Every price here is in US dollars and was read on the vendor&rsquo;s own site on October 7, 2026. This page is a frozen archive copy and is not updated afterwards, so check the current listing before you buy. Listings are free and editorial. Advertising never changes a rating or a ranking. Some listings on our site carry affiliate links or sponsored placements, and each is labelled on its listing page.
      </p>
    </div>
  )
}
