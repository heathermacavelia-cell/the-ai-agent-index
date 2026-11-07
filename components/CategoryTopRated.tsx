import Link from 'next/link'
import AgentLogo from '@/components/AgentLogo'
import { formatCardPrice } from '@/lib/price'

// "Highest-rated in this category" (SEO 2026-11-07, Heather: "Yes we should do
// that if it makes a difference"). The pages that outrank our category pages are
// short curated lists, and Google's Oct 2026 guidance puts the page's main answer
// near the top. This is that answer: the top five by our published editorial
// rating, nothing else. No rank numbers or #1 badges (Heather 2026-10-29 removed
// those from guides), and it sits BELOW the category sponsor, which is sold as
// the first thing above every listing.

export interface TopRatedAgent {
  slug: string
  name: string
  developer: string
  logo_url?: string | null
  website_url?: string | null
  favicon_domain?: string | null
  best_for?: string | null
  short_description?: string | null
  starting_price: number | null
  pricing_model: string
  billing_period?: string | null
  price_unit?: string | null
  price_currency?: string | null
  rating: number
}

function priceLabel(a: TopRatedAgent): string {
  if (a.pricing_model === 'discontinued') return 'Discontinued'
  if (a.starting_price != null && a.starting_price > 0) return formatCardPrice(a, 'From ')
  if (a.starting_price === 0 || a.pricing_model === 'free') return 'Free'
  if (a.pricing_model === 'freemium') return 'Free plan'
  return 'Custom pricing'
}

export default function CategoryTopRated({ heading, agents }: { heading: string; agents: TopRatedAgent[] }) {
  if (agents.length < 3) return null
  return (
    <div style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.875rem', padding: '1.25rem 1.25rem 0.5rem', margin: '0 0 1.5rem' }}>
      <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', margin: '0 0 0.25rem' }}>{heading}</h2>
      <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: '0 0 0.75rem' }}>
        Sorted by our editorial rating. Ratings can&apos;t be bought. <Link href="/methodology" style={{ color: '#2563EB', textDecoration: 'none' }}>How we rate</Link>
      </p>
      <div>
        {agents.map((a) => (
          <Link key={a.slug} href={'/agents/' + a.slug} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0', borderTop: '1px solid #F3F4F6', textDecoration: 'none', color: 'inherit' }}>
            <AgentLogo name={a.name} logoUrl={a.logo_url} websiteUrl={a.website_url} faviconDomain={a.favicon_domain} size="sm" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#111827', margin: 0 }}>{a.name}</h3>
              <p style={{ fontSize: '0.8125rem', color: '#4B5563', margin: '0.125rem 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {a.best_for || a.short_description || a.developer}
              </p>
            </div>
            <div style={{ flexShrink: 0, textAlign: 'right' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#111827' }}><span style={{ color: '#2563EB' }}>★</span> {a.rating.toFixed(1)}</div>
              <div style={{ fontSize: '0.75rem', color: '#6B7280', whiteSpace: 'nowrap' }}>{priceLabel(a)}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
