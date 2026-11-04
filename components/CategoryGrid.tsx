import Link from 'next/link'
import AgentLogo from '@/components/AgentLogo'
import { CATEGORY_SLUGS } from '@/lib/taxonomy'
import { isInDate, ratingOf, type CatalogRow } from '@/lib/siteStats'

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'ai-sales-agents': 'Lead generation, outbound automation, pipeline intelligence',
  'ai-customer-support-agents': 'Ticket resolution, omnichannel support, autonomous helpdesk',
  'ai-research-agents': 'Deep research, academic literature, web synthesis',
  'ai-marketing-agents': 'Content creation, paid media, campaign automation',
  'ai-coding-agents': 'Code generation, agentic coding, IDE integration, terminals',
  'ai-hr-agents': 'Hiring, onboarding, payroll automation, compliance, workforce management',
  'ai-workflow-agents': 'Cross-app orchestration, browser RPA, no-code agent builders',
  'ai-customer-success-agents': 'Churn prevention, health scoring, renewal automation',
}

const CATEGORY_ACCENTS: Record<string, string> = {
  'ai-sales-agents': '#10B981',
  'ai-customer-support-agents': '#7C3AED',
  'ai-research-agents': '#D97706',
  'ai-marketing-agents': '#E11D48',
  'ai-coding-agents': '#2563EB',
  'ai-hr-agents': '#0D9488',
  'ai-workflow-agents': '#EA580C',
  'ai-customer-success-agents': '#0284C7',
}

function topRatedInDate(rows: CatalogRow[], category: string): { row: CatalogRow; rating: number }[] {
  const now = Date.now()
  return rows
    .filter((r) => r.primary_category === category && isInDate(r, now))
    .map((row) => ({ row, rating: ratingOf(row) }))
    .filter((x): x is { row: CatalogRow; rating: number } => x.rating != null)
    .sort((a, b) => b.rating - a.rating || Date.parse(b.row.last_verified_at ?? '') - Date.parse(a.row.last_verified_at ?? ''))
    .slice(0, 3)
}

export function buildCategoryRows(rows: CatalogRow[], perCategory: Record<string, number> | null | undefined) {
  return Object.entries(CATEGORY_SLUGS).map(([displayName, slug]) => ({
    slug,
    displayName,
    count: perCategory?.[slug] ?? null,
    top: topRatedInDate(rows, slug),
    description: CATEGORY_DESCRIPTIONS[slug] ?? '',
  }))
}

// The category name's link is stretched over the whole card in CSS, so the white
// space opens the category. The agent rows sit above it and open their listings.
export default function CategoryGrid({ rows }: { rows: ReturnType<typeof buildCategoryRows> }) {
  return (
    <div className="hp-cats">
      {rows.map((c) => (
        <div key={c.slug} className="hp-cat-card" style={{ borderTopColor: CATEGORY_ACCENTS[c.slug] ?? '#2563EB' }}>
          <div className="hp-cat-card-head">
            <a href={'/' + c.slug} className="hp-cat-name">{c.displayName}</a>
            <span className="hp-cat-count">{c.count ?? ''}</span>
          </div>
          <p className="hp-cat-desc">{c.description}</p>
          <div className="hp-cat-top">
            {c.top.map(({ row, rating }) => (
              <Link key={row.id} href={'/agents/' + row.slug} className="hp-top-agent" aria-label={row.name + ', rated ' + rating.toFixed(1)}>
                <AgentLogo name={row.name} logoUrl={row.logo_url} websiteUrl={row.website_url} faviconDomain={row.favicon_domain} size="xs" />
                <span className="hp-top-name">{row.name}</span>
                <span className="hp-star-num"><i>★</i>{rating.toFixed(1)}</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
