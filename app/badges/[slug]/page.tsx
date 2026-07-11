export const dynamic = 'force-dynamic'

import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vendor Badges: Earned, Free to Display, Never Sold',
  description: 'How AI agents earn badges on The AI Agent Index. Public criteria, live-rendering SVGs, free for every vendor. Badges cannot be purchased.',
  alternates: { canonical: 'https://theaiagentindex.com/badges' },
  openGraph: {
    title: 'Vendor Badges: Earned, Free to Display, Never Sold',
    description: 'How AI agents earn badges on The AI Agent Index. Public criteria, free for every vendor.',
    url: 'https://theaiagentindex.com/badges',
    type: 'website',
    siteName: 'The AI Agent Index',
  },
}

const BADGES = [
  {
    name: 'Rated 4.5+',
    criteria: 'Displayed rating of 4.5 or higher. The displayed rating blends our editorial score with verified community reviews, so collecting reviews from real users is the path to this badge.',
    updates: 'Live: shows your current rating and updates as it changes.',
  },
  {
    name: 'Category Leader',
    criteria: 'Top 5 in your primary category by editorial rating. Stamped with the current quarter and refreshed automatically as ratings change.',
    updates: 'Quarterly stamp, recalculated continuously.',
  },
  {
    name: 'MCP Server Verified',
    criteria: 'The product exposes its own MCP server, verified against official vendor documentation only. Community builds and third-party wrappers do not count.',
    updates: 'Verified during editorial re-audits.',
  },
  {
    name: 'Transparent Pricing',
    criteria: 'Every pricing tier is publicly listed and self-serve purchasable, with no sales conversation required for any plan.',
    updates: 'Verified against your live pricing page during re-audits.',
  },
  {
    name: 'Listed',
    criteria: 'Every active, independently reviewed listing qualifies. Stamped with the current year.',
    updates: 'Always available while your listing is active.',
  },
]

export default function BadgesPage() {
  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
        Vendor Badges
      </p>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', marginBottom: '0.75rem', lineHeight: 1.2 }}>
        Earned, free to display, never sold
      </h1>
      <p style={{ color: '#6B7280', fontSize: '0.9375rem', lineHeight: 1.7, marginBottom: '2.5rem' }}>
        Every badge on The AI Agent Index is earned against public criteria and is free for any vendor to embed, including unclaimed listings. Badges cannot be purchased, and paid placements never affect eligibility. Each badge is a live image rendered from our database: if your product stops qualifying, the badge quietly disappears from your site rather than displaying a stale claim.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
        {BADGES.map(b => (
          <div key={b.name} style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.25rem' }}>
            <p style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.375rem' }}>{b.name}</p>
            <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.6, marginBottom: '0.375rem' }}>{b.criteria}</p>
            <p style={{ fontSize: '0.8125rem', color: '#9CA3AF', margin: 0 }}>{b.updates}</p>
          </div>
        ))}
      </div>

      <div style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '2rem' }}>
        <p style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#111827', marginBottom: '0.375rem' }}>Get your badges</p>
        <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.6, margin: 0 }}>
          Find your agent on the index, then visit theaiagentindex.com/badges/your-agent-slug for live previews in dark, light, and outline themes with copy-paste embed code. Ratings improve with verified community reviews: see <Link href="/methodology#s5" style={{ color: '#2563EB' }}>how community reviews affect ratings</Link>.
        </p>
      </div>

      <p style={{ fontSize: '0.8125rem', color: '#9CA3AF', lineHeight: 1.6 }}>
        Full scoring methodology: <Link href="/methodology" style={{ color: '#2563EB' }}>how we research and rank AI agents</Link>. Questions about a badge? Email hello@theaiagentindex.com.
      </p>
    </div>
  )
}