// app/resources/newsletter/2026-09-22/page.tsx
// Newsletter Issue #5: static, dated, frozen archive copy.
// Prices are a point-in-time snapshot (verified September 22, 2026) and are
// intentionally NOT templated: an archived issue must not silently rewrite
// itself later. Do not convert these to {{slug.starting_price}}.
// Uses inline styles to match the site convention (see resources/newsletter/page.tsx).
// No em dashes anywhere (house style).
// NOTE: Heather ruled 2026-09-22 that the newsletter carries no inline
// affiliate disclosure boxes; links go to our own listing pages, which carry
// the disclosure. One general footer line remains.

import type { Metadata } from 'next'

const ISSUE_URL = 'https://theaiagentindex.com/resources/newsletter/2026-09-22'
const TITLE = 'Price & Rating Tracker: Issue #5 (September 2026)'
const DESC =
  'Salesforce completed its acquisition of Fin. HubSpot Sales Hub Starter went back down to $7. Harvey raised $550M, Freshworks made its MCP server generally available, and OpenAI introduced GPT-6 Astra. Verified against live vendor data.'

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

export default function NewsletterIssue05() {
  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>
      <a href="/resources/newsletter" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', marginBottom: '1.5rem', display: 'inline-block' }}>&larr; Newsletter</a>

      {/* Masthead */}
      <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>The AI Agent Index</p>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#111827', margin: '0 0 0.375rem', letterSpacing: '-0.02em' }}>Price &amp; Rating Tracker</h1>
      <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '1rem' }}>Issue #5 &middot; September 22, 2026</div>
      <p style={{ ...body, marginBottom: '0.5rem' }}>
        We read the pricing pages so you don&rsquo;t have to, and publish what actually changed across <a href="/" style={linkBlue}>the full index</a>. When a company won&rsquo;t say when it changed something, we tell you that instead of picking a date that looks tidy.
      </p>
      <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: 0, paddingBottom: '1.25rem', borderBottom: '1px solid #E5E7EB' }}>
        Prices below are a snapshot verified on September 22, 2026, and are not updated after publication. This issue covers everything since our last issue on September 8.
      </p>

      {/* THE HEADLINE */}
      <div style={sectionLabel}>The Headline</div>
      <h2 style={{ fontSize: '1.3125rem', lineHeight: 1.3, fontWeight: 800, color: '#111827', margin: '0 0 0.875rem' }}>Salesforce now owns Fin</h2>
      <p style={{ ...body, marginBottom: '0.875rem' }}>
        Salesforce completed its acquisition of Fin, the company formerly called Intercom, on September 10. Fin makes the <a href="/agents/intercom-fin" style={linkBlue}>Fin AI customer agent</a>, and Salesforce says Fin broadens its customer service AI portfolio alongside <a href="/agents/salesforce-agentforce" style={linkBlue}>Agentforce</a>.
      </p>
      <p style={body}>
        If you are comparing customer service agents, Fin and Agentforce now come from the same company.
      </p>

      {/* PRICE CHANGES */}
      <div style={sectionLabel}>Price Changes</div>

      <p style={lede}><a href="/agents/hubspot-sales-hub" style={linkBlue}>HubSpot Sales Hub</a> Starter went back down</p>
      <p style={{ ...body, marginBottom: '0.875rem' }}>
        Issue #4 reported HubSpot raising Starter on both billing terms. It did not last. By September 10 both prices were back where they were, and they were still there when we checked again today.
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
            <td style={{ ...td, color: '#9CA3AF', textDecoration: 'line-through' }}>$9/mo/seat</td>
            <td style={{ ...td, fontWeight: 700, color: '#111827' }}>$7/mo/seat</td>
            <td style={td}>Annual</td>
          </tr>
          <tr>
            <td style={td}>Sales Hub Starter</td>
            <td style={{ ...td, color: '#9CA3AF', textDecoration: 'line-through' }}>$15/mo/seat</td>
            <td style={{ ...td, fontWeight: 700, color: '#111827' }}>$10/mo/seat</td>
            <td style={td}>Month to month</td>
          </tr>
        </tbody>
      </table>

      <p style={{ ...body, marginBottom: '0.875rem' }}>
        HubSpot published no announcement either time, so both dates are when we found the change on its pricing page.
      </p>

      <p style={lede}><a href="/agents/chatgpt" style={linkBlue}>ChatGPT</a> Pro at $200 is closed to new sign-ups</p>
      <p style={body}>
        On September 10 OpenAI paused new sign-ups and upgrades to the $200 a month Pro tier. The $100 a month Pro tier is still available.
      </p>

      {/* ALSO WORTH KNOWING */}
      <div style={sectionLabel}>Also Worth Knowing</div>

      <p style={lede}>OpenAI introduced GPT-6 Astra, and plans to retire custom GPTs</p>
      <p style={{ ...body, marginBottom: '0.875rem' }}>
        GPT-6 Astra arrived in <a href="/agents/chatgpt" style={linkBlue}>ChatGPT</a> on September 3, rolling out on the web to Plus, Pro, Business, Enterprise and Edu users, with mobile to follow. It landed just before our last issue and we missed it then. Separately, on September 11 OpenAI said it plans to retire custom GPTs across ChatGPT plans and move them to plugins. Existing GPTs keep working until the retirement date for each plan, so if your team depends on one, now is the time to note who built it.
      </p>

      <p style={lede}><a href="/agents/harvey-ai" style={linkBlue}>Harvey</a> raised $550M and bought Guardrails AI</p>
      <p style={{ ...body, marginBottom: '0.875rem' }}>
        On September 9 Harvey announced a $550M round at a $15.5B valuation, co-led by Diffusion and Lightspeed Venture Partners. The same day it announced it had acquired Guardrails AI, whose open-source guardrails help teams find where AI agents stray from intended behavior.
      </p>

      <p style={lede}>Freshworks made its MCP server generally available</p>
      <p style={{ ...body, marginBottom: '0.875rem' }}>
        Since September 10, the Freshworks MCP integration for <a href="/agents/freshservice" style={linkBlue}>Freshservice</a> and <a href="/agents/freshdesk-freddy" style={linkBlue}>Freshdesk</a> is open on the Growth, Pro and Enterprise plans instead of an Enterprise-only early access program. Each plan includes a monthly allowance of 100, 500 or 1,000 actions, where one action is one successful tool call. Early access customers move to standard pricing and limits on October 1.
      </p>

      <p style={lede}><a href="/agents/pipedrive-ai" style={linkBlue}>Pipedrive</a> Nova is out of waitlist</p>
      <p style={{ ...body, marginBottom: '0.875rem' }}>
        Pipedrive made Nova generally available on September 16. It briefs a rep before a meeting, transcribes the call and drafts the CRM updates afterward, and Pipedrive includes it in all plans at no additional cost.
      </p>


      <p style={lede}>Three smaller launches</p>
      <p style={body}>
        <a href="/agents/opus-clip" style={linkBlue}>OpusClip</a> became an official Claude connector on September 11, so it can be added from inside Claude without API keys. <a href="/agents/sanity" style={linkBlue}>Sanity</a> released Knowledge Bases and Workflows in beta and launched Content Variants on September 14. <a href="/agents/mem0" style={linkBlue}>Mem0</a> joined the Vercel Marketplace on September 16, so Vercel users can add agent memory with billing on their Vercel invoice.
      </p>

      {/* NEW TO THE INDEX */}
      <div style={sectionLabel}>New to the Index</div>
      <p style={body}>
        Eight products joined the index in this window. Data and analytics:{' '}
        <a href="/agents/thoughtspot" style={linkBlue}>ThoughtSpot</a>, <a href="/agents/hex" style={linkBlue}>Hex</a>, <a href="/agents/sigma-computing" style={linkBlue}>Sigma</a> and <a href="/agents/otto-astronomer" style={linkBlue}>Otto</a>, Astronomer&rsquo;s agent for Apache Airflow. Customer support:{' '}
        <a href="/agents/arten-ai" style={linkBlue}>Arten AI</a> and <a href="/agents/maxdesk" style={linkBlue}>Maxdesk</a>. For agent builders:{' '}
        <a href="/agents/salestouch" style={linkBlue}>SalesTouch</a>, a LinkedIn MCP server, and <a href="/agents/thordata" style={linkBlue}>Thordata</a>, a web data platform. Each listing has current pricing.
      </p>

      {/* RATINGS */}
      <div style={sectionLabel}>Ratings</div>
      <p style={note}>
        <strong>No rating changes this issue.</strong> Nothing a vendor did in this window moved one of our scores. We do adjust our own scores as we learn more about a product, but that is us getting better rather than a company getting better, so we do not report it as news. Our <a href="/methodology" style={linkBlue}>methodology</a> explains how the scores are built.
      </p>

      {/* FOOTER */}
      <p style={{ fontSize: '0.8125rem', lineHeight: 1.6, color: '#6B7280', marginTop: '2.5rem', paddingTop: '1.25rem', borderTop: '1px solid #E5E7EB' }}>
        Every price here is in US dollars and was read on the vendor&rsquo;s own site on September 22, 2026. This page is a frozen archive copy and is not updated afterwards, so check the current listing before you buy. Listings are free and editorial. Advertising never changes a rating or a ranking. Some listings on our site carry affiliate links or sponsored placements, and each is labelled on its listing page.
      </p>
    </div>
  )
}
