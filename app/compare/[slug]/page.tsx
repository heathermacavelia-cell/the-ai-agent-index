import { createClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import AgentLogo from '@/components/AgentLogo'
import NewsletterSignup from '@/components/NewsletterSignup'

export const dynamic = 'force-dynamic'

interface Props {
  params: { slug: string }
}

function parseCompareSlug(slug: string): { slugA: string; slugB: string; slugC?: string } | null {
  const parts = slug.split('-vs-')
  if (parts.length === 2) return { slugA: parts[0], slugB: parts[1] }
  if (parts.length === 3) return { slugA: parts[0], slugB: parts[1], slugC: parts[2] }
  return null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const parsed = parseCompareSlug(params.slug)
  if (!parsed) return {}
  const supabase = createClient()
  const [{ data: a }, { data: b }, { data: comp }] = await Promise.all([
    supabase.from('agents').select('name').eq('slug', parsed.slugA).single(),
    supabase.from('agents').select('name').eq('slug', parsed.slugB).single(),
    supabase.from('comparisons').select('verdict').eq('slug', params.slug).single(),
  ])
  if (!a || !b) return {}
  const year = new Date().getFullYear()
  const title = parsed.slugC
    ? `${a.name} vs ${b.name} vs ${parsed.slugC} (${year}): Which is Best?`
    : `${a.name} vs ${b.name} (${year}): Which is Better?`
  const verdictOpener = comp?.verdict ? comp.verdict.split('.')[0] + '.' : null
  const description = verdictOpener
    ? `${verdictOpener} Full independent comparison: pricing, features, integrations, and editorial verdict.`
    : `Independent side-by-side comparison of ${a.name} vs ${b.name} — pricing, capabilities, and editorial verdict. Updated ${year}.`
  return {
    title,
    description,
    openGraph: { title, description, url: 'https://theaiagentindex.com/compare/' + params.slug, type: 'website', siteName: 'The AI Agent Index' },
    twitter: { card: 'summary' },
    alternates: { canonical: 'https://theaiagentindex.com/compare/' + params.slug },
  }
}

export default async function ComparePage({ params }: Props) {
  const parsed = parseCompareSlug(params.slug)
  if (!parsed) notFound()

  const supabase = createClient()
  const isThreeWay = !!parsed.slugC

  const [{ data: a }, { data: b }, cResult, { data: comparison }] = await Promise.all([
    supabase.from('agents').select('*').eq('slug', parsed.slugA).eq('is_active', true).single(),
    supabase.from('agents').select('*').eq('slug', parsed.slugB).eq('is_active', true).single(),
    parsed.slugC
      ? supabase.from('agents').select('*').eq('slug', parsed.slugC).eq('is_active', true).single()
      : Promise.resolve({ data: null }),
    supabase.from('comparisons').select('verdict, verdict_3way, best_for_a, best_for_b, best_for_c').eq('slug', params.slug).single(),
  ])

  if (!a || !b) notFound()
  const c = cResult?.data ?? null

  const agentSlugs = [parsed.slugA, parsed.slugB, ...(parsed.slugC ? [parsed.slugC] : [])]
  const agentNames = [a.name, b.name, ...(c ? [c.name] : [])]

  const [{ data: altPages }, { data: relatedA }, { data: relatedB }] = await Promise.all([
    supabase.from('alternatives').select('slug, agent_slug').in('agent_slug', agentSlugs).eq('is_active', true),
    supabase.from('comparisons').select('slug, agent_a, agent_b').eq('is_active', true).neq('slug', params.slug).in('agent_a', agentNames).limit(4),
    supabase.from('comparisons').select('slug, agent_a, agent_b').eq('is_active', true).neq('slug', params.slug).in('agent_b', agentNames).limit(4),
  ])

  const altSlugA = altPages?.find(p => p.agent_slug === parsed.slugA)?.slug ?? null
  const altSlugB = altPages?.find(p => p.agent_slug === parsed.slugB)?.slug ?? null
  const altSlugC = parsed.slugC ? (altPages?.find(p => p.agent_slug === parsed.slugC)?.slug ?? null) : null

  const seenSlugs = new Set<string>()
  const relatedComparisons = [...(relatedA ?? []), ...(relatedB ?? [])]
    .filter(r => {
      if (seenSlugs.has(r.slug)) return false
      seenSlugs.add(r.slug)
      return true
    })
    .slice(0, 4)
    .map(r => ({ slug: r.slug, label: `${r.agent_a} vs ${r.agent_b}` }))

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://theaiagentindex.com'
  const year = new Date().getFullYear()
  const dateModified = new Date().toISOString().split('T')[0]

  const agents = isThreeWay && c ? [a, b, c] : [a, b]
  const bestFors = [comparison?.best_for_a, comparison?.best_for_b, comparison?.best_for_c]
  const title = isThreeWay && c
    ? `${a.name} vs ${b.name} vs ${c.name}`
    : `${a.name} vs ${b.name}`

  const activeVerdict = isThreeWay ? (comparison?.verdict_3way ?? comparison?.verdict) : comparison?.verdict

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title + ' — Which AI Agent is Right for You? (' + year + ')',
    description: 'Side-by-side comparison of ' + title + ' across pricing, capabilities, integrations, and deployment.',
    url: siteUrl + '/compare/' + params.slug,
    dateModified,
    publisher: { '@type': 'Organization', name: 'The AI Agent Index', url: siteUrl },
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the difference between ' + title + '?',
        acceptedAnswer: { '@type': 'Answer', text: activeVerdict ?? '' },
      },
      {
        '@type': 'Question',
        name: 'Which is best for my team — ' + title + '?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: agents.map((ag, i) => ag.name + ' is best for: ' + (bestFors[i] ?? ag.customer_segment + ' teams')).join(' '),
        },
      },
    ],
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Compare', item: siteUrl + '/compare' },
      { '@type': 'ListItem', position: 3, name: title, item: siteUrl + '/compare/' + params.slug },
    ],
  }

  const gridCols = isThreeWay ? '1fr 1fr 1fr' : '1fr 1fr'

  const FIELD_ROWS = [
    { label: 'Pricing model', vals: agents.map(ag => ag.pricing_model), format: 'capitalize' },
    { label: 'Starting price', vals: agents.map(ag => ag.starting_price != null ? (ag.starting_price === 0 ? 'Free' : '$' + ag.starting_price + '/mo') : 'Contact sales'), format: 'text' },
    { label: 'Customer segment', vals: agents.map(ag => ag.customer_segment?.toUpperCase()), format: 'text' },
    { label: 'Deployment', vals: agents.map(ag => ag.deployment_method?.join(', ') ?? '—'), format: 'text' },
    { label: 'Setup difficulty', vals: agents.map(ag => ag.deployment_difficulty ?? '—'), format: 'capitalize' },
    { label: 'Avg setup time', vals: agents.map(ag => ag.avg_setup_time ?? '—'), format: 'text' },
    { label: 'Rating', vals: agents.map(ag => ag.rating_avg > 0 ? ag.rating_avg.toFixed(1) + ' / 5' : '—'), format: 'text' },
  ]

  const tableGridCols = isThreeWay ? '1.2fr 1fr 1fr 1fr' : '1fr 1fr 1fr'

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6B7280', marginBottom: '2rem' }}>
          <Link href="/" style={{ color: '#6B7280', textDecoration: 'none' }}>Home</Link>
          <span style={{ color: '#D1D5DB' }}>/</span>
          <Link href="/compare" style={{ color: '#6B7280', textDecoration: 'none' }}>Compare</Link>
          <span style={{ color: '#D1D5DB' }}>/</span>
          <span style={{ color: '#111827' }}>{title}</span>
        </nav>

        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', marginBottom: '0.75rem', lineHeight: 1.2 }}>
          {title} ({year})
        </h1>
        <p style={{ color: '#4B5563', fontSize: '1.0625rem', lineHeight: 1.7, marginBottom: '0.5rem' }}>
          {isThreeWay ? 'Three-way comparison of ' : 'Side-by-side comparison of '}{title} — pricing, capabilities, integrations, deployment complexity, and ratings. Last updated {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.
        </p>
        <p style={{ fontSize: '0.8125rem', color: '#9CA3AF', marginBottom: '2rem' }}>
          Data sourced from The AI Agent Index · Updated daily
        </p>

        {activeVerdict && (
          <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '0.875rem', padding: '1.5rem', marginBottom: '2.5rem' }}>
            <div style={{ marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#1D4ED8', backgroundColor: '#DBEAFE', padding: '0.2rem 0.5rem', borderRadius: '0.25rem' }}>
                {isThreeWay ? 'Three-Way Editorial Verdict' : 'Editorial Verdict'}
              </span>
            </div>
            <p style={{ fontSize: '1rem', color: '#1E3A5F', lineHeight: 1.7, margin: 0, fontWeight: 500 }}>{activeVerdict}</p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: '1rem', marginBottom: '2.5rem' }}>
          {agents.map((agent, i) => (
            <div key={agent.slug} style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <AgentLogo name={agent.name} websiteUrl={agent.website_url} faviconDomain={agent.favicon_domain} size="md" />
                <div>
                  <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#111827', marginBottom: '0.125rem' }}>{agent.name}</h2>
                  <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>by {agent.developer}</p>
                </div>
              </div>
              <p style={{ fontSize: '0.8125rem', color: '#4B5563', lineHeight: 1.6, marginBottom: '0.875rem' }}>{agent.short_description}</p>
              {bestFors[i] && (
                <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '0.5rem', padding: '0.625rem 0.875rem', marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#15803D', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Best for</p>
                  <p style={{ fontSize: '0.75rem', color: '#166534', lineHeight: 1.5, margin: 0 }}>{bestFors[i]}</p>
                </div>
              )}
              <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.6875rem', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', backgroundColor: '#EFF6FF', color: '#1D4ED8', fontWeight: 600 }}>{agent.pricing_model}</span>
                <span style={{ fontSize: '0.6875rem', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', backgroundColor: '#F3F4F6', color: '#374151', fontWeight: 600 }}>{agent.customer_segment?.toUpperCase()}</span>
              </div>
              {agent.website_url && (
                <a href={agent.website_url} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'block', textAlign: 'center', padding: '0.5rem', borderRadius: '0.5rem', backgroundColor: '#2563EB', color: 'white', textDecoration: 'none', fontSize: '0.8125rem', fontWeight: 600 }}>
                  Visit {agent.name} →
                </a>
              )}
            </div>
          ))}
        </div>

        <div style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', overflow: 'hidden', marginBottom: '2.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: tableGridCols, backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB', padding: '0.75rem 1.25rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#6B7280' }}>Feature</span>
            {agents.map(ag => <span key={ag.slug} style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#111827' }}>{ag.name}</span>)}
          </div>
          {FIELD_ROWS.map((row, i) => (
            <div key={row.label} style={{ display: 'grid', gridTemplateColumns: tableGridCols, padding: '0.875rem 1.25rem', borderBottom: i < FIELD_ROWS.length - 1 ? '1px solid #F3F4F6' : 'none', backgroundColor: i % 2 === 0 ? 'white' : '#FAFAFA' }}>
              <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>{row.label}</span>
              {row.vals.map((val, j) => (
                <span key={j} style={{ fontSize: '0.875rem', color: '#111827', fontWeight: 500, textTransform: row.format === 'capitalize' ? 'capitalize' : 'none' }}>{val}</span>
              ))}
            </div>
          ))}
        </div>

        <div style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '2.5rem' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.125rem', color: '#111827', marginBottom: '1.25rem' }}>Capabilities</h2>
          <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: '1.5rem' }}>
            {agents.map(agent => (
              <div key={agent.slug}>
                <h3 style={{ fontWeight: 600, fontSize: '0.875rem', color: '#374151', marginBottom: '0.75rem' }}>{agent.name}</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                  {agent.capability_tags?.map((tag: string) => (
                    <span key={tag} style={{ fontSize: '0.75rem', backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', fontFamily: 'monospace' }}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.125rem', color: '#111827', margin: 0 }}>Pros &amp; Limitations</h2>
            <span style={{ fontSize: '0.6875rem', color: '#9CA3AF', backgroundColor: '#F3F4F6', padding: '0.2rem 0.5rem', borderRadius: '0.25rem' }}>Editorial assessment</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: '1.5rem' }}>
            {agents.map(agent => (
              <div key={agent.slug}>
                <h3 style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#111827', marginBottom: '1rem' }}>{agent.name}</h3>
                {agent.pros?.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Pros</p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {agent.pros.map((pro: string) => (
                        <li key={pro} style={{ fontSize: '0.8125rem', color: '#374151', display: 'flex', gap: '0.5rem', lineHeight: 1.5 }}>
                          <span style={{ color: '#16A34A', flexShrink: 0 }}>✓</span><span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {agent.limitations?.length > 0 && (
                  <div>
                    <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Limitations</p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {agent.limitations.map((lim: string) => (
                        <li key={lim} style={{ fontSize: '0.8125rem', color: '#374151', display: 'flex', gap: '0.5rem', lineHeight: 1.5 }}>
                          <span style={{ color: '#D97706', flexShrink: 0 }}>⚠</span><span>{lim}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2.5rem', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '1.5rem' }}>Frequently asked questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ backgroundColor: '#F9FAFB', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1.25rem' }}>
              <h3 style={{ fontWeight: 600, color: '#111827', marginBottom: '0.5rem', fontSize: '1rem' }}>
                What is the difference between {title}?
              </h3>
              <p style={{ color: '#4B5563', fontSize: '0.9375rem', lineHeight: 1.7, margin: 0 }}>{activeVerdict ?? 'See the full comparison above.'}</p>
            </div>
            <div style={{ backgroundColor: '#F9FAFB', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1.25rem' }}>
              <h3 style={{ fontWeight: 600, color: '#111827', marginBottom: '0.5rem', fontSize: '1rem' }}>
                Which is best for my team — {title}?
              </h3>
              <p style={{ color: '#4B5563', fontSize: '0.9375rem', lineHeight: 1.7, margin: 0 }}>
                {agents.map((ag, i) => bestFors[i] ? `${ag.name} is best for: ${bestFors[i]}.` : '').filter(Boolean).join(' ')}
              </p>
            </div>
            <div style={{ backgroundColor: '#F9FAFB', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1.25rem' }}>
              <h3 style={{ fontWeight: 600, color: '#111827', marginBottom: '0.5rem', fontSize: '1rem' }}>
                How does pricing compare between {title}?
              </h3>
              <p style={{ color: '#4B5563', fontSize: '0.9375rem', lineHeight: 1.7, margin: 0 }}>
                {agents.map(ag => ag.name + ' uses a ' + ag.pricing_model + ' model' + (ag.starting_price != null ? ', starting at $' + ag.starting_price + ' per month' : '') + '.').join(' ')}
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: '1rem', marginBottom: '2rem' }}>
          {agents.map(agent => (
            <Link key={agent.slug} href={'/agents/' + agent.slug}
              style={{ display: 'block', backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.25rem', textDecoration: 'none', textAlign: 'center' }}>
              <p style={{ fontWeight: 600, color: '#111827', marginBottom: '0.25rem' }}>View full {agent.name} profile</p>
              <p style={{ fontSize: '0.8125rem', color: '#2563EB', margin: 0 }}>Pricing, reviews, integrations →</p>
            </Link>
          ))}
        </div>

        {(altSlugA || altSlugB || altSlugC) && (
          <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: '1rem', marginBottom: '2rem' }}>
            {[
              { slug: altSlugA, name: a.name },
              { slug: altSlugB, name: b.name },
              ...(c && altSlugC ? [{ slug: altSlugC, name: c.name }] : []),
            ].filter(x => x.slug).map(x => (
              <Link key={x.slug} href={'/alternatives/' + x.slug}
                style={{ display: 'block', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1rem 1.25rem', textDecoration: 'none' }}>
                <p style={{ fontWeight: 600, color: '#111827', marginBottom: '0.25rem', fontSize: '0.9375rem' }}>Best {x.name} alternatives</p>
                <p style={{ fontSize: '0.8125rem', color: '#2563EB', margin: 0 }}>See all alternatives →</p>
              </Link>
            ))}
          </div>
        )}

        {relatedComparisons.length > 0 && (
          <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>Related comparisons</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
              {relatedComparisons.map(r => (
                <Link key={r.slug} href={'/compare/' + r.slug}
                  style={{ fontSize: '0.875rem', color: '#2563EB', backgroundColor: '#EFF6FF', padding: '0.375rem 0.875rem', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: 500 }}>
                  {r.label} →
                </Link>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: '2.5rem' }}>
          <NewsletterSignup source={'compare-' + params.slug} dark={false} />
        </div>

      </div>
    </>
  )
}