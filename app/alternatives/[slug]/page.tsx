import { createClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { cache } from 'react'
import GuideCitations from '@/components/GuideCitations'
import AgentLogo from '@/components/AgentLogo'
export const dynamic = 'force-dynamic'
import NewsletterSignup from '@/components/NewsletterSignup'

interface Props {
  params: { slug: string }
}

/**
 * Single source of truth for alternatives page data. Wrapped in React cache()
 * so the same request from generateMetadata + the page component dedupes
 * automatically — one set of DB queries per request, identical data both
 * sides. Returns null if the alternatives entry or main agent is missing
 * so callers can branch into 404/empty metadata.
 */
const getPageData = cache(async (slug: string) => {
  const supabase = createClient()

  const { data: alt } = await supabase
    .from('alternatives')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!alt) return null

  const { data: mainAgent } = await supabase
    .from('agents')
    .select('*')
    .eq('slug', alt.agent_slug)
    .eq('is_active', true)
    .single()

  if (!mainAgent) return null

  // Support multi-category alternatives: use alt.categories array if populated,
  // otherwise fall back to the single alt.category field. This allows pages like
  // drift-alternatives to pull from both ai-sales-agents and ai-customer-support-agents.
  const categories: string[] = (alt.categories && alt.categories.length > 0)
    ? alt.categories
    : [alt.category]

  // Build candidate pool query with multi-category support
  let poolQuery = supabase
    .from('agents')
    .select('*')
    .in('primary_category', categories)
    .eq('is_active', true)
    .neq('slug', alt.agent_slug)
    .order('editorial_rating', { ascending: false, nullsFirst: false })
    .order('rating_avg', { ascending: false })
    .limit(50)

  // If filter_tags are set, narrow pool to agents sharing at least one tag.
  // This prevents broad categories from surfacing unrelated agents.
  if (alt.filter_tags && alt.filter_tags.length > 0) {
    poolQuery = poolQuery.overlaps('capability_tags', alt.filter_tags)
  }

  const { data: candidatePool } = await poolQuery

  const mainType = mainAgent.agent_type ?? null

  const ranked = (candidatePool ?? [])
    .map((a: any) => ({
      ...a,
      isSameUseCase: Boolean(mainType) && a.agent_type === mainType,
    }))
    .sort((a: any, b: any) => {
      if (a.isSameUseCase && !b.isSameUseCase) return -1
      if (!a.isSameUseCase && b.isSameUseCase) return 1
      const aEr = a.editorial_rating ?? -1
      const bEr = b.editorial_rating ?? -1
      if (aEr !== bEr) return bEr - aEr
      return (b.rating_avg ?? 0) - (a.rating_avg ?? 0)
    })

  return { alt, mainAgent, alternatives: ranked.slice(0, 9) }
})

/**
 * Build dynamic meta_title that always reflects the current top-3 alternatives.
 * Falls back to fewer names if the full version exceeds 60 characters.
 */
function buildMetaTitle(mainAgentName: string, alternatives: any[]): string {
  const year = new Date().getFullYear()
  const base = `Best ${mainAgentName} Alternatives (${year})`
  const names = alternatives.map(a => a.name)

  const tryWith = (count: number) => {
    if (count === 0) return base
    return `${base}: ${names.slice(0, count).join(', ')} & More`
  }

  for (const count of [3, 2, 1, 0]) {
    const candidate = tryWith(count)
    if (candidate.length <= 60) return candidate
  }
  return base
}

/**
 * Build dynamic meta_description that always reflects the current top alternatives.
 * Always ends with "Not affiliated." per editorial standards.
 * Falls back to shorter forms if the full version exceeds 160 characters.
 */
function buildMetaDescription(mainAgentName: string, alternatives: any[]): string {
  const total = alternatives.length
  const top3 = alternatives.slice(0, 3).map(a => a.name).join(', ')
  const top2 = alternatives.slice(0, 2).map(a => a.name).join(', ')
  const remaining3 = Math.max(0, total - 3)
  const remaining2 = Math.max(0, total - 2)

  const candidates = [
    `Compare ${mainAgentName} alternatives: ${top3}, and ${remaining3} more. Pricing, capabilities, and editorial ratings. Not affiliated.`,
    `Compare ${mainAgentName} alternatives: ${top2}, and ${remaining2} more. Pricing and editorial ratings. Not affiliated.`,
    `Compare top ${mainAgentName} alternatives. Pricing, capabilities, and editorial ratings. Not affiliated.`,
    `Compare top ${mainAgentName} alternatives. Editorial ratings. Not affiliated.`,
  ]

  for (const c of candidates) {
    if (c.length <= 160) return c
  }
  return candidates[candidates.length - 1]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getPageData(params.slug)
  if (!data) return {}

  const { alt, mainAgent, alternatives } = data

  // Use stored meta values if set — gives per-page control.
  // Falls back to dynamic builders for pages without custom meta.
  const metaTitle = alt.meta_title || buildMetaTitle(mainAgent.name, alternatives)
  const metaDescription = alt.meta_description || buildMetaDescription(mainAgent.name, alternatives)
  const url = 'https://theaiagentindex.com/alternatives/' + params.slug

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: { title: metaTitle, description: metaDescription, url, type: 'website', siteName: 'The AI Agent Index' },
    twitter: { card: 'summary' },
    alternates: { canonical: url },
  }
}

export default async function AlternativesPage({ params }: Props) {
  const data = await getPageData(params.slug)
  if (!data) notFound()

  const { alt, mainAgent, alternatives } = data

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://theaiagentindex.com'
  const dateModified = new Date().toISOString().split('T')[0]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: alt.title,
    description: alt.intro.slice(0, 160),
    url: siteUrl + '/alternatives/' + params.slug,
    dateModified: dateModified,
    publisher: { '@type': 'Organization', name: 'The AI Agent Index', url: siteUrl },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Alternatives', item: siteUrl + '/alternatives' },
      { '@type': 'ListItem', position: 3, name: alt.title, item: siteUrl + '/alternatives/' + params.slug },
    ],
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What are the best alternatives to ' + mainAgent.name + '?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The best alternatives to ' + mainAgent.name + ' depend on your use case and budget. Top options include ' + alternatives.slice(0, 3).map((a: any) => a.name).join(', ') + '. Each offers different pricing models, capability sets, and integration options. See the full list below.',
        },
      },
      {
        '@type': 'Question',
        name: 'Why do teams look for ' + mainAgent.name + ' alternatives?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: alt.why_look,
        },
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6B7280', marginBottom: '2rem' }}>
          <Link href="/" style={{ color: '#6B7280', textDecoration: 'none' }}>Home</Link>
          <span style={{ color: '#D1D5DB' }}>/</span>
          <Link href="/alternatives" style={{ color: '#6B7280', textDecoration: 'none' }}>Alternatives</Link>
          <span style={{ color: '#D1D5DB' }}>/</span>
          <span style={{ color: '#111827' }}>{alt.title}</span>
        </nav>

        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', marginBottom: '0.75rem', lineHeight: 1.2 }}>
          {alt.title}
        </h1>

        <p style={{ color: '#4B5563', fontSize: '1.0625rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          {alt.intro}
        </p>

        <div style={{ backgroundColor: '#FEF9EC', border: '1px solid #FDE68A', borderRadius: '0.75rem', padding: '1.25rem 1.5rem', marginBottom: '2.5rem' }}>
          <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#92400E', marginBottom: '0.375rem' }}>Why teams look for alternatives</p>
          <p style={{ fontSize: '0.9375rem', color: '#78350F', lineHeight: 1.7, margin: 0 }}>{alt.why_look}</p>
        </div>

        {alt.content && (
          <div style={{ marginBottom: '2.5rem' }}>
            {alt.content.split('\n\n').map((paragraph: string, i: number) => (
              <p key={i} style={{ color: '#374151', fontSize: '0.9375rem', lineHeight: 1.8, marginBottom: '1.25rem' }}>
                {paragraph}
              </p>
            ))}
          </div>
        )}

        <div style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <AgentLogo name={mainAgent.name} websiteUrl={mainAgent.website_url} faviconDomain={mainAgent.favicon_domain} size="md" />
              <div>
                <h2 style={{ fontWeight: 700, fontSize: '1.125rem', color: '#111827', marginBottom: '0.125rem' }}>{mainAgent.name}</h2>
                <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>by {mainAgent.developer}</p>
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: '9999px', backgroundColor: '#F3F4F6', color: '#374151', fontWeight: 600 }}>
              Currently reviewing
            </span>
          </div>
          <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.6, marginBottom: '1rem' }}>{mainAgent.short_description}</p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {(mainAgent.capability_tags ?? []).slice(0, 5).map((tag: string) => (
              <span key={tag} style={{ fontSize: '0.75rem', backgroundColor: '#F3F4F6', color: '#374151', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', fontFamily: 'monospace' }}>{tag}</span>
            ))}
          </div>
          <Link href={'/agents/' + mainAgent.slug} style={{ fontSize: '0.875rem', color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>
            View full {mainAgent.name} profile →
          </Link>
        </div>

        <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>
          {alternatives.length} alternatives to {mainAgent.name}
        </h2>
        <p style={{ color: '#6B7280', fontSize: '0.9375rem', marginBottom: '1.5rem' }}>
          Ranked by use case match, then editorial rating. All listings include structured data, pricing, and capability tags.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
          {alternatives.map((agent: any, index: number) => (
            <Link key={agent.slug} href={'/agents/' + agent.slug} style={{ textDecoration: 'none' }}>
              <div style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.25rem 1.5rem', display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '1rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                  <span style={{ width: '1.5rem', height: '1.5rem', borderRadius: '50%', backgroundColor: '#EFF6FF', color: '#1D4ED8', fontWeight: 700, fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {index + 1}
                  </span>
                  <AgentLogo name={agent.name} websiteUrl={agent.website_url} faviconDomain={agent.favicon_domain} size="sm" />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, color: '#111827', fontSize: '1rem' }}>{agent.name}</span>
                    {agent.is_featured && (
                      <span style={{ fontSize: '0.6875rem', padding: '1px 6px', borderRadius: '9999px', backgroundColor: '#2563EB', color: 'white', fontWeight: 700, textTransform: 'uppercase' }}>Featured</span>
                    )}
                    {agent.isSameUseCase && (
                      <span style={{ fontSize: '0.6875rem', padding: '1px 6px', borderRadius: '9999px', backgroundColor: '#DBEAFE', color: '#1E40AF', fontWeight: 700, textTransform: 'uppercase' }}>Same use case</span>
                    )}
                    <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>by {agent.developer}</span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.5, margin: '0 0 0.5rem' }}>{agent.short_description}</p>
                  <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                    {(agent.capability_tags ?? []).slice(0, 4).map((tag: string) => (
                      <span key={tag} style={{ fontSize: '0.6875rem', backgroundColor: '#F3F4F6', color: '#6B7280', padding: '0.15rem 0.4rem', borderRadius: '0.2rem', fontFamily: 'monospace' }}>{tag}</span>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#111827', marginBottom: '0.25rem' }}>
                    {agent.starting_price != null ? (agent.starting_price === 0 ? 'Free' : '$' + agent.starting_price + '/mo') : 'Custom'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'capitalize' }}>{agent.pricing_model}</div>
                  {agent.editorial_rating > 0 && (
                    <div style={{ fontSize: '0.75rem', color: '#D97706', marginTop: '0.25rem' }}>★ {agent.editorial_rating.toFixed(1)}</div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2.5rem', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '1.5rem' }}>Frequently asked questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <h3 style={{ fontWeight: 600, color: '#111827', marginBottom: '0.5rem', fontSize: '1rem' }}>
                What are the best alternatives to {mainAgent.name}?
              </h3>
              <p style={{ color: '#4B5563', fontSize: '0.9375rem', lineHeight: 1.7 }}>
                The best alternatives to {mainAgent.name} depend on your use case and budget. Top options include {alternatives.slice(0, 3).map((a: any) => a.name).join(', ')}. Each offers different pricing models, capability sets, and integration options. See the full list above.
              </p>
            </div>
            <div>
              <h3 style={{ fontWeight: 600, color: '#111827', marginBottom: '0.5rem', fontSize: '1rem' }}>
                Why do teams look for {mainAgent.name} alternatives?
              </h3>
              <p style={{ color: '#4B5563', fontSize: '0.9375rem', lineHeight: 1.7 }}>
                {alt.why_look}
              </p>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.5rem', textAlign: 'center' }}>
          <p style={{ fontWeight: 700, color: '#111827', fontSize: '1.125rem', marginBottom: '0.5rem' }}>
            Browse all {alt.category.replace('ai-', '').split('-').join(' ')}
          </p>
          <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
            Compare pricing, capabilities, and integrations across every agent in this category.
          </p>
          <Link href={'/' + alt.category} style={{ display: 'inline-block', backgroundColor: '#2563EB', color: 'white', padding: '0.625rem 1.5rem', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: 600, fontSize: '0.9375rem' }}>
            View all {alt.category.replace('ai-', '').split('-').join(' ')} →
          </Link>
        </div>

        <GuideCitations slug={params.slug} table="alternatives" />

      </div>
      {/* Newsletter */}
      <div style={{ marginTop: '2.5rem' }}>
        <NewsletterSignup source={'alternatives-' + params.slug} dark={false} />
      </div>
    </>
  )
}