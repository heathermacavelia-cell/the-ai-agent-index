// app/resources/newsletter/2026-07-14/page.tsx
// Newsletter Issue #1 — static, dated, frozen archive copy.
// Prices are a point-in-time snapshot (verified July 14, 2026) and are
// intentionally NOT templated: an archived issue must not silently rewrite
// itself later. Do not convert these to {{slug.starting_price}}.
// Uses inline styles to match the site convention (see resources/newsletter/page.tsx).

import type { Metadata } from 'next'

const ISSUE_URL = 'https://theaiagentindex.com/resources/newsletter/2026-07-14'
const TITLE = 'Price & Rating Tracker — Issue #1 (July 2026)'
const DESC =
  'HubSpot cut Sales Hub to $7. Gemini dropped to $4.99. Klaviyo moved its marketing agent behind a paywall, and five platforms shipped MCP. Verified against live vendor data.'

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
const body: React.CSSProperties = { fontSize: '0.9375rem', lineHeight: 1.65, color: '#374151', margin: '0 0 0 0' }
const lede: React.CSSProperties = { fontSize: '0.9375rem', fontWeight: 700, color: '#111827', margin: '1.25rem 0 0.25rem' }
const linkBlue: React.CSSProperties = { color: '#2563EB', textDecoration: 'underline' }

export default function NewsletterIssue01() {
  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>
      <a href="/resources/newsletter" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', marginBottom: '1.5rem', display: 'inline-block' }}>← Newsletter</a>

      {/* Masthead */}
      <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>The AI Agent Index</p>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#111827', margin: '0 0 0.375rem', letterSpacing: '-0.02em' }}>Price &amp; Rating Tracker</h1>
      <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '1rem' }}>Issue #1 · July 14, 2026</div>
      <p style={{ ...body, marginBottom: '0.5rem' }}>
        Every two weeks we read the pricing pages so you don&rsquo;t have to, and publish what actually changed across <a href="/" style={linkBlue}>344+ AI agents</a>. Verified against live vendor data, not vendor marketing.
      </p>
      <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: 0, paddingBottom: '1.25rem', borderBottom: '1px solid #E5E7EB' }}>
        Prices below are a snapshot verified on July 14, 2026, and are not updated after publication.
      </p>

      {/* Presented by Noded */}
      <div style={{ marginTop: '1.5rem', background: '#06171B', borderRadius: '8px', padding: '1rem 1.125rem' }}>
        <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#6EE7B7', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Presented by Noded</div>
        <p style={{ fontSize: '0.875rem', lineHeight: 1.55, color: '#E5E7EB', margin: '0.375rem 0 0' }}>
          The post-sales customer context graph. Auto-builds a live account story from 20+ tools — and is one of the very few customer success tools that exposes an MCP server.{' '}
          <a href="https://theaiagentindex.com/agents/noded?utm_source=newsletter_archive" style={{ color: '#6EE7B7', textDecoration: 'underline' }}>Read our independent review →</a>
        </p>
      </div>

      {/* PRICE MOVES */}
      <div style={sectionLabel}>Price Moves</div>
      <p style={body}>The headline this fortnight: two major tools got <strong>cheaper</strong>, and one made its AI agent an expensive add-on.</p>

      <p style={lede}>HubSpot cut Sales Hub Starter from $15 to $7 per seat.</p>
      <p style={body}>The annual rate on the entry tier dropped by more than half, to $7/seat/mo (month-to-month holds at $20). One of the cheapest ways into a full CRM with AI. <a href="/agents/hubspot-sales-hub" style={linkBlue}>Listing →</a></p>

      <p style={lede}>Google dropped Gemini&rsquo;s entry plan to $4.99.</p>
      <p style={body}>Google AI Plus fell from $7.99 to $4.99/mo in the US, adding Gemini&rsquo;s paid features at the lowest price point yet. <a href="/agents/gemini" style={linkBlue}>Listing →</a></p>

      <p style={lede}>Klaviyo moved its marketing agent behind a paywall.</p>
      <p style={body}>Composer — formerly the &ldquo;Marketing Agent,&rdquo; and previously part of the base plan — is now a separate add-on listed at <strong>$157/mo</strong> for 16,000 credits. Customer Agent is another $200/mo. Entry email pricing is unchanged at $20/mo. (Both add-ons are currently 30% off on introductory pricing, which will end.) <a href="/agents/klaviyo-ai" style={linkBlue}>Listing →</a></p>

      <p style={{ ...body, marginTop: '1.25rem' }}>
        <strong>Also moved:</strong> <a href="/agents/surfer-seo" style={linkBlue}>Surfer</a> added a new entry tier, Discovery at $49/mo (billed yearly), down from a $99 starting point. <a href="/agents/consensus" style={linkBlue}>Consensus</a> nudged Pro from $10 to $12/mo and capped Deep reviews at 200 per month.
      </p>

      {/* MCP WAVE */}
      <div style={sectionLabel}>The MCP Wave</div>
      <p style={body}>Model Context Protocol — the standard that lets external AI agents plug directly into a product — went from novelty to table stakes in two weeks. Five platforms we track shipped one:</p>
      <ul style={{ ...body, paddingLeft: '1.25rem', marginTop: '0.75rem' }}>
        <li><strong>Pipedrive</strong> — native MCP server (June 30)</li>
        <li><strong>Salesforce Agentforce</strong> — server + client, GA</li>
        <li><strong>Gong</strong> — server + client, GA</li>
        <li><strong>Hootsuite</strong> — native MCP server</li>
        <li><strong>Make</strong> — added a client, so it&rsquo;s now both server and client</li>
      </ul>
      <p style={{ ...body, marginTop: '0.75rem' }}>Whether a tool exposes an MCP server is quickly becoming a real differentiator. <a href="/mcp-servers" style={linkBlue}>See every agent with one →</a></p>

      {/* GONE */}
      <div style={sectionLabel}>Gone</div>
      <p style={body}><strong>Roo Code shut down.</strong> The VS Code extension closed on May 15 and the repo is archived; the team is pointing users to the ZooCode fork and Cline.</p>

      {/* SPOTLIGHT */}
      <div style={{ marginTop: '2.25rem', border: '1px solid #E5E7EB', background: '#F9FAFB', borderRadius: '8px', padding: '1.25rem 1.375rem' }}>
        <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Sponsored · Agent Spotlight</div>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827', margin: '0.5rem 0 0' }}>Noded — a customer context graph that actually acts</h2>
        <p style={{ ...body, marginTop: '0.75rem' }}>
          Most customer success tools are systems of record you have to feed. Noded is the opposite: it reads the high-signal context out of the 20+ tools your account data already lives in — Salesforce, Slack, Gong, Zendesk, Jira, Linear, Gainsight — and assembles a live story for every account, with no fields to fill and no dashboard to maintain.
        </p>
        <ul style={{ ...body, paddingLeft: '1.25rem', marginTop: '0.75rem' }}>
          <li style={{ marginBottom: '0.375rem' }}><strong>It exposes an MCP server.</strong> Almost nothing in customer success does. Query the full stack from Claude, ChatGPT, or Gemini, and Noded acts back inside Slack, Salesforce, and Linear.</li>
          <li style={{ marginBottom: '0.375rem' }}><strong>Built by people who&rsquo;ve done this before</strong> — the team behind Salesforce Flow, the Slack Platform, and Boomi.</li>
          <li><strong>It never trains on your customer data</strong>, and stores nothing with LLM providers.</li>
        </ul>
        <p style={{ ...body, marginTop: '0.75rem' }}>Pricing is public: $100 per seat/mo billed annually ($125 month-to-month), including 500 pooled runs. No free tier.</p>
        <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
          <a href="/agents/noded" style={{ display: 'inline-block', background: '#06171B', color: '#FFFFFF', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', padding: '0.625rem 1.125rem', borderRadius: '6px' }}>Read our full independent review →</a>
          <a href="https://getnoded.ai?utm_source=aiagentindex&utm_medium=newsletter_archive" style={{ fontSize: '0.875rem', ...linkBlue }}>Visit Noded</a>
        </div>
        <p style={{ fontSize: '0.75rem', lineHeight: 1.5, color: '#9CA3AF', margin: '0.875rem 0 0' }}>
          Noded is a paid Featured placement. Our editorial review and 4.0/5 rating were produced independently, on the same methodology we apply to every agent in the index.
        </p>
      </div>

      {/* Footer */}
      <div style={{ marginTop: '2rem', borderTop: '1px solid #E5E7EB', paddingTop: '1.25rem' }}>
        <p style={{ fontSize: '0.75rem', lineHeight: 1.6, color: '#9CA3AF', margin: 0 }}>
          The AI Agent Index is a structured, independent directory of <a href="/" style={{ color: '#6B7280', textDecoration: 'underline' }}>344+ AI agents</a>, built to be read by humans and AI systems alike. We take no vendor payment for ratings or placement.
        </p>
        <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: '0.75rem 0 0' }}>
          <a href="/resources/newsletter" style={{ color: '#6B7280', textDecoration: 'underline' }}>Get this every two weeks</a> · <a href="/" style={{ color: '#6B7280', textDecoration: 'underline' }}>Browse the index</a>
        </p>
      </div>
    </div>
  )
}