// app/resources/newsletter/2026-07-14/page.tsx
// Newsletter Issue #1 — static, dated, frozen archive copy.
// Prices are a point-in-time snapshot (verified July 14, 2026) and are
// intentionally NOT templated: an archived issue must not silently rewrite
// itself later. Do not convert these to {{slug.starting_price}}.

import type { Metadata } from 'next'
import Link from 'next/link'

const ISSUE_URL = 'https://theaiagentindex.com/resources/newsletter/2026-07-14'
const TITLE = 'Price & Rating Tracker — Issue #1 (July 2026)'
const DESC =
  'HubSpot cut Sales Hub to $7. Gemini dropped to $4.99. Klaviyo moved its marketing agent behind a paywall, and five platforms shipped MCP. Verified against live vendor data.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: ISSUE_URL },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: ISSUE_URL,
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: { card: 'summary', title: TITLE, description: DESC },
}

const linkCls = 'text-blue-600 underline'

export default function NewsletterIssue01() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-10">
      <nav className="mb-6 text-sm">
        <Link href="/resources/newsletter" className="text-gray-500 hover:underline">
          &larr; Newsletter
        </Link>
      </nav>

      <header className="border-b border-gray-200 pb-5">
        <div className="text-xs font-bold uppercase tracking-wide text-green-600">
          The AI Agent Index
        </div>
        <h1 className="mt-1 text-2xl font-extrabold text-gray-900">
          Price &amp; Rating Tracker
        </h1>
        <div className="mt-1 text-sm text-gray-500">Issue #1 · July 14, 2026</div>
        <p className="mt-4 text-[15px] leading-relaxed text-gray-700">
          Every two weeks we read the pricing pages so you don&rsquo;t have to, and publish
          what actually changed across 344+ AI agents. Verified against live vendor data,
          not vendor marketing.
        </p>
        <p className="mt-2 text-xs text-gray-400">
          Prices below are a snapshot verified on July 14, 2026, and are not updated after
          publication.
        </p>
      </header>

      {/* Presented by Noded */}
      <section className="mt-6 rounded-lg bg-[#06171b] p-4">
        <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
          Presented by Noded
        </div>
        <p className="mt-1.5 text-sm leading-snug text-gray-200">
          The post-sales customer context graph. Auto-builds a live account story from 20+
          tools &mdash; and is one of the very few customer success tools that exposes an MCP
          server.{' '}
          <a
            href="https://theaiagentindex.com/agents/noded?utm_source=newsletter_archive"
            className="text-emerald-300 underline"
          >
            Read our independent review &rarr;
          </a>
        </p>
      </section>

      {/* PRICE MOVES */}
      <section className="mt-8">
        <h2 className="border-b-2 border-green-600 pb-1.5 text-xs font-bold uppercase tracking-wide text-green-600">
          Price Moves
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-gray-700">
          The headline this fortnight: two major tools got <strong>cheaper</strong>, and one
          made its AI agent an expensive add-on.
        </p>

        <p className="mt-5 text-[15px] font-semibold text-gray-900">
          HubSpot cut Sales Hub Starter from $15 to $7 per seat.
        </p>
        <p className="text-[15px] leading-relaxed text-gray-700">
          The annual rate on the entry tier dropped by more than half, to $7/seat/mo
          (month-to-month holds at $20). One of the cheapest ways into a full CRM with AI.{' '}
          <Link href="/agents/hubspot-sales-hub" className={linkCls}>Listing &rarr;</Link>
        </p>

        <p className="mt-5 text-[15px] font-semibold text-gray-900">
          Google dropped Gemini&rsquo;s entry plan to $4.99.
        </p>
        <p className="text-[15px] leading-relaxed text-gray-700">
          Google AI Plus fell from $7.99 to $4.99/mo in the US, adding Gemini&rsquo;s paid
          features at the lowest price point yet.{' '}
          <Link href="/agents/gemini" className={linkCls}>Listing &rarr;</Link>
        </p>

        <p className="mt-5 text-[15px] font-semibold text-gray-900">
          Klaviyo moved its marketing agent behind a paywall.
        </p>
        <p className="text-[15px] leading-relaxed text-gray-700">
          Composer &mdash; formerly the &ldquo;Marketing Agent,&rdquo; and previously part of
          the base plan &mdash; is now a separate add-on listed at <strong>$157/mo</strong> for
          16,000 credits. Customer Agent is another $200/mo. Entry email pricing is unchanged
          at $20/mo. (Both add-ons are currently 30% off on introductory pricing, which will
          end.){' '}
          <Link href="/agents/klaviyo-ai" className={linkCls}>Listing &rarr;</Link>
        </p>

        <p className="mt-5 text-[15px] leading-relaxed text-gray-700">
          <strong>Also moved:</strong>{' '}
          <Link href="/agents/surfer-seo" className={linkCls}>Surfer</Link> added a new entry
          tier, Discovery at $49/mo (billed yearly), down from a $99 starting point.{' '}
          <Link href="/agents/consensus" className={linkCls}>Consensus</Link> nudged Pro from
          $10 to $12/mo and capped Deep reviews at 200 per month.
        </p>
      </section>

      {/* MCP WAVE */}
      <section className="mt-8">
        <h2 className="border-b-2 border-green-600 pb-1.5 text-xs font-bold uppercase tracking-wide text-green-600">
          The MCP Wave
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-gray-700">
          Model Context Protocol &mdash; the standard that lets external AI agents plug
          directly into a product &mdash; went from novelty to table stakes in two weeks. Five
          platforms we track shipped one:
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-[15px] text-gray-700">
          <li><strong>Pipedrive</strong> &mdash; native MCP server (June 30)</li>
          <li><strong>Salesforce Agentforce</strong> &mdash; server + client, GA</li>
          <li><strong>Gong</strong> &mdash; server + client, GA</li>
          <li><strong>Hootsuite</strong> &mdash; native MCP server</li>
          <li><strong>Make</strong> &mdash; added a client, so it&rsquo;s now both server and client</li>
        </ul>
        <p className="mt-3 text-[15px] leading-relaxed text-gray-700">
          Whether a tool exposes an MCP server is quickly becoming a real differentiator.{' '}
          <Link href="/mcp-servers" className={linkCls}>See every agent with one &rarr;</Link>
        </p>
      </section>

      {/* GONE */}
      <section className="mt-8">
        <h2 className="border-b-2 border-green-600 pb-1.5 text-xs font-bold uppercase tracking-wide text-green-600">
          Gone
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-gray-700">
          <strong>Roo Code shut down.</strong> The VS Code extension closed on May 15 and the
          repo is archived; the team is pointing users to the ZooCode fork and Cline.
        </p>
      </section>

      {/* SPOTLIGHT */}
      <section className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-5">
        <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
          Sponsored · Agent Spotlight
        </div>
        <h2 className="mt-2 text-lg font-extrabold text-gray-900">
          Noded &mdash; a customer context graph that actually acts
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-gray-700">
          Most customer success tools are systems of record you have to feed. Noded is the
          opposite: it reads the high-signal context out of the 20+ tools your account data
          already lives in &mdash; Salesforce, Slack, Gong, Zendesk, Jira, Linear, Gainsight
          &mdash; and assembles a live story for every account, with no fields to fill and no
          dashboard to maintain.
        </p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[15px] text-gray-700">
          <li>
            <strong>It exposes an MCP server.</strong> Almost nothing in customer success does.
            Query the full stack from Claude, ChatGPT, or Gemini, and Noded acts back inside
            Slack, Salesforce, and Linear.
          </li>
          <li>
            <strong>Built by people who&rsquo;ve done this before</strong> &mdash; the team
            behind Salesforce Flow, the Slack Platform, and Boomi.
          </li>
          <li>
            <strong>It never trains on your customer data</strong>, and stores nothing with LLM
            providers.
          </li>
        </ul>
        <p className="mt-3 text-[15px] leading-relaxed text-gray-700">
          Pricing is public: $100 per seat/mo billed annually ($125 month-to-month), including
          500 pooled runs. No free tier.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Link
            href="/agents/noded"
            className="inline-block rounded-md bg-[#06171b] px-4 py-2 text-sm font-semibold text-white"
          >
            Read our full independent review &rarr;
          </Link>
          <a
            href="https://getnoded.ai?utm_source=aiagentindex&utm_medium=newsletter_archive"
            className="text-sm text-blue-600 underline"
          >
            Visit Noded
          </a>
        </div>
        <p className="mt-3.5 text-xs leading-relaxed text-gray-400">
          Noded is a paid Featured placement. Our editorial review and 4.0/5 rating were
          produced independently, on the same methodology we apply to every agent in the index.
        </p>
      </section>

      <footer className="mt-8 border-t border-gray-200 pt-5">
        <p className="text-xs leading-relaxed text-gray-400">
          The AI Agent Index is a structured, independent directory of 344+ AI agents, built to
          be read by humans and AI systems alike. We take no vendor payment for ratings or
          placement.
        </p>
        <p className="mt-3 text-xs text-gray-400">
          <Link href="/resources/newsletter" className="text-gray-500 underline">
            Get this every two weeks
          </Link>{' '}
          ·{' '}
          <Link href="/" className="text-gray-500 underline">
            Browse the index
          </Link>
        </p>
      </footer>
    </main>
  )
}