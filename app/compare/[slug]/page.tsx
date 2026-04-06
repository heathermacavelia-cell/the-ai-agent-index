import { createClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import AgentLogo from '@/components/AgentLogo'

export const dynamic = 'force-dynamic'

interface Props {
  params: { slug: string }
}

function parseCompareSlug(slug: string): { slugA: string; slugB: string } | null {
  const parts = slug.split('-vs-')
  if (parts.length !== 2) return null
  return { slugA: parts[0], slugB: parts[1] }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const parsed = parseCompareSlug(params.slug)
  if (!parsed) return {}
  const supabase = createClient()
  const [{ data: a }, { data: b }] = await Promise.all([
    supabase.from('agents').select('name, short_description').eq('slug', parsed.slugA).single(),
    supabase.from('agents').select('name, short_description').eq('slug', parsed.slugB).single(),
  ])
  if (!a || !b) return {}
  return {
    title: a.name + ' vs ' + b.name + ' (' + new Date().getFullYear() + ') — AI Agent Index',
    description: 'Compare ' + a.name + ' and ' + b.name + ' side by side — pricing, capabilities, integrations, deployment, and ratings.',
    openGraph: { title: a.name + ' vs ' + b.name, description: 'Compare ' + a.name + ' and ' + b.name + ' side by side — pricing, capabilities, integrations, deployment, and ratings.', url: 'https://theaiagentindex.com/compare/' + params.slug, type: 'website', siteName: 'The AI Agent Index' },
    twitter: { card: 'summary' },
    alternates: { canonical: 'https://theaiagentindex.com/compare/' + params.slug },
  }
}

export default async function ComparePage({ params }: Props) {
  const parsed = parseCompareSlug(params.slug)
  if (!parsed) notFound()

  const supabase = createClient()
  const [{ data: a }, { data: b }] = await Promise.all([
    supabase.from('agents').select('*').eq('slug', parsed.slugA).eq('is_active', true).single(),
    supabase.from('agents').select('*').eq('slug', parsed.slugB).eq('is_active', true).single(),
  ])

  if (!a || !b) notFound()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://theaiagentindex.com'
  const year = new Date().getFullYear()
  const dateModified = new Date().toISOString().split('T')[0]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.name + ' vs ' + b.name + ' — Which AI Agent is Right for You? (' + year + ')',
    description: 'Side-by-side comparison of ' + a.name + ' and ' + b.name + ' across pricing, capabilities, integrations, and deployment.',
    url: siteUrl + '/compare/' + params.slug,
    dateModified: dateModified,
    publisher: { '@type': 'Organization', name: 'The AI Agent Index', url: siteUrl },
  }

  const aTopPro = a.pros?.[0] ?? (a.name + ' offers strong capabilities for ' + a.customer_segment + ' teams')
  const bTopPro = b.pros?.[0] ?? (b.name + ' offers strong capabilities for ' + b.customer_segment + ' teams')
  const aTopLim = a.limitations?.[0] ?? ('Best suited for ' + a.customer_segment + ' use cases')
  const bTopLim = b.limitations?.[0] ?? ('Best suited for ' + b.customer_segment + ' use cases')

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the difference between ' + a.name + ' and ' + b.name + '?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: a.name + ' is a ' + a.pricing_model + ' ' + a.primary_category.split('-').join(' ') + ' targeting ' + a.customer_segment + ' customers. A key strength is: ' + aTopPro + '. ' + b.name + ' is a ' + b.pricing_model + ' tool targeting ' + b.customer_segment + ' customers. A key strength is: ' + bTopPro + '.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is ' + a.name + ' or ' + b.name + ' better for my team?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: a.name + ' suits ' + a.customer_segment + ' teams with ' + (a.deployment_difficulty ?? 'moderate') + ' setup complexity. Note that ' + aTopLim + '. ' + b.name + ' is designed for ' + b.customer_segment + ' teams with ' + (b.deployment_difficulty ?? 'moderate') + ' setup complexity. Note that ' + bTopLim + '. Review the full comparison below for a detailed breakdown.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does ' + a.name + ' pricing compare to ' + b.name + '?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: a.name + ' uses a ' + a.pricing_model + ' model' + (a.starting_price != null ? ', starting at $' + a.starting_price : '') + '. ' + b.name + ' uses a ' + b.pricing_model + ' model' + (b.starting_price != null ? ', starting at $' + b.starting_price : '') + '.',
        },
      },
      {
        '@type': 'Question',
        name: 'What are the main limitations of ' + a.name + ' vs ' + b.name + '?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'For ' + a.name + ': ' + (a.limitations?.slice(0, 2).join('. ') ?? 'See the full comparison above') + '. For ' + b.name + ': ' + (b.limitations?.slice(0, 2).join('. ') ?? 'See the full comparison above') + '.',
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
      { '@type': 'ListItem', position: 3, name: a.name + ' vs ' + b.name, item: siteUrl + '/compare/' + params.slug },
    ],
  }

  const FIELD_ROWS = [
    { label: 'Pricing model', keyA: a.pricing_model, keyB: b.pricing_model, format: 'capitalize' },
    { label: 'Starting price', keyA: a.starting_price != null ? (a.starting_price === 0 ? 'Free' : '$' + a.starting_price + '/mo') : 'Contact sales', keyB: b.starting_price != null ? (b.starting_price === 0 ? 'Free' : '$' + b.starting_price + '/mo') : 'Contact sales', format: 'text' },
    { label: 'Customer segment', keyA: a.customer_segment?.toUpperCase(), keyB: b.customer_segment?.toUpperCase(), format: 'text' },
    { label: 'Deployment', keyA: a.deployment_method?.join(', ') ?? '—', keyB: b.deployment_method?.join(', ') ?? '—', format: 'text' },
    { label: 'Setup difficulty', keyA: a.deployment_difficulty ?? '—', keyB: b.deployment_difficulty ?? '—', format: 'capitalize' },
    { label: 'Avg setup time', keyA: a.avg_setup_time ?? '—', keyB: b.avg_setup_time ?? '—', format: 'text' },
    { label: 'Model architecture', keyA: a.model_architecture ?? '—', keyB: b.model_architecture ?? '—', format: 'text' },
    { label: 'Rating', keyA: a.rating_avg > 0 ? a.rating_avg.toFixed(1) + ' / 5' : '—', keyB: b.rating_avg > 0 ? b.rating_avg.toFixed(1) + ' / 5' : '—', format: 'text' },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6B7280', marginBottom: '2rem' }}>
          <Link href="/" style={{ color: '#6B7280', textDecoration: 'none' }}>Home</Link>
          <span style={{ color: '#D1D5DB' }}>/</span>
          <Link href="/compare" style={{ color: '#6B7280', textDecoration: 'none' }}>Compare</Link>
          <span style={{ color: '#D1D5DB' }}>/</span>
          <span style={{ color: '#111827' }}>{a.name} vs {b.name}</span>
        </nav>

        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', marginBottom: '0.75rem', lineHeight: 1.2 }}>
          {a.name} vs {b.name} ({year})
        </h1>
        <p style={{ color: '#4B5563', fontSize: '1.0625rem', lineHeight: 1.7, marginBottom: '0.5rem' }}>
          Side-by-side comparison of {a.name} and {b.name} — pricing, capabilities, integrations, deployment complexity, and ratings. Last updated {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.
        </p>
        <p style={{ fontSize: '0.8125rem', color: '#9CA3AF', marginBottom: '3rem' }}>
          Data sourced from The AI Agent Index · Updated daily
        </p>

        {/* Hero comparison cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2.5rem' }}>
          {[a, b].map((agent) => (
            <div key={agent.slug} style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <AgentLogo name={agent.name} websiteUrl={agent.website_url} faviconDomain={agent.favicon_domain} size="md" />
                <div>
                  <h2 style={{ fontWeight: 700, fontSize: '1.125rem', color: '#111827', marginBottom: '0.125rem' }}>{agent.name}</h2>
                  <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>by {agent.developer}</p>
                </div>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.6, marginBottom: '1rem' }}>{agent.short_description}</p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.625rem', borderRadius: '0.25rem', backgroundColor: '#EFF6FF', color: '#1D4ED8', fontWeight: 600 }}>
                  {agent.pricing_model}
                </span>
                <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.625rem', borderRadius: '0.25rem', backgroundColor: '#F3F4F6', color: '#374151', fontWeight: 600 }}>
                  {agent.customer_segment?.toUpperCase()}
                </span>
              </div>
              {agent.website_url && (
                <a href={agent.website_url} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'block', textAlign: 'center', padding: '0.5rem', borderRadius: '0.5rem', backgroundColor: '#2563EB', color: 'white', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}>
                  Visit {agent.name} →
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Comparison table */}
        <div style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', overflow: 'hidden', marginBottom: '2.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB', padding: '0.75rem 1.25rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#6B7280' }}>Feature</span>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#111827' }}>{a.name}</span>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#111827' }}>{b.name}</span>
          </div>
          {FIELD_ROWS.map((row, i) => (
            <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '0.875rem 1.25rem', borderBottom: i < FIELD_ROWS.length - 1 ? '1px solid #F3F4F6' : 'none', backgroundColor: i % 2 === 0 ? 'white' : '#FAFAFA' }}>
              <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>{row.label}</span>
              <span style={{ fontSize: '0.875rem', color: '#111827', fontWeight: 500, textTransform: row.format === 'capitalize' ? 'capitalize' : 'none' }}>{row.keyA}</span>
              <span style={{ fontSize: '0.875rem', color: '#111827', fontWeight: 500, textTransform: row.format === 'capitalize' ? 'capitalize' : 'none' }}>{row.keyB}</span>
            </div>
          ))}
        </div>

        {/* Capabilities comparison */}
        {(a.capability_tags?.length > 0 || b.capability_tags?.length > 0) && (
          <div style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '2.5rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.125rem', color: '#111827', marginBottom: '1.25rem' }}>Capabilities</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {[a, b].map((agent) => (
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
        )}

        {/* Pros & Limitations comparison */}
        {(a.pros?.length > 0 || b.pros?.length > 0) && (
          <div style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h2 style={{ fontWeight: 700, fontSize: '1.125rem', color: '#111827', margin: 0 }}>Pros &amp; Limitations</h2>
              <span style={{ fontSize: '0.6875rem', color: '#9CA3AF', backgroundColor: '#F3F4F6', padding: '0.2rem 0.5rem', borderRadius: '0.25rem' }}>Editorial assessment</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {[a, b].map((agent) => (
                <div key={agent.slug}>
                  <h3 style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#111827', marginBottom: '1rem' }}>{agent.name}</h3>
                  {agent.pros?.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Pros</p>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {agent.pros.map((pro: string) => (
                          <li key={pro} style={{ fontSize: '0.8125rem', color: '#374151', display: 'flex', gap: '0.5rem', lineHeight: 1.5 }}>
                            <span style={{ color: '#16A34A', flexShrink: 0 }}>✓</span>
                            <span>{pro}</span>
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
                            <span style={{ color: '#D97706', flexShrink: 0 }}>⚠</span>
                            <span>{lim}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ */}
        <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2.5rem', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '1.5rem' }}>Frequently asked questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            <div style={{ backgroundColor: '#F9FAFB', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1.25rem' }}>
              <h3 style={{ fontWeight: 600, color: '#111827', marginBottom: '0.5rem', fontSize: '1rem' }}>
                What is the difference between {a.name} and {b.name}?
              </h3>
              <p style={{ color: '#4B5563', fontSize: '0.9375rem', lineHeight: 1.7, margin: 0 }}>
                {a.name} is a {a.pricing_model} {a.primary_category.split('-').join(' ')} targeting {a.customer_segment} customers. {a.pros?.[0] && `A standout strength: ${a.pros[0]}.`} {b.name} is a {b.pricing_model} tool targeting {b.customer_segment} customers. {b.pros?.[0] && `A standout strength: ${b.pros[0]}.`} See the full comparison table above for a detailed breakdown.
              </p>
            </div>

            <div style={{ backgroundColor: '#F9FAFB', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1.25rem' }}>
              <h3 style={{ fontWeight: 600, color: '#111827', marginBottom: '0.5rem', fontSize: '1rem' }}>
                Is {a.name} or {b.name} better for my team?
              </h3>
              <p style={{ color: '#4B5563', fontSize: '0.9375rem', lineHeight: 1.7, margin: 0 }}>
                {a.name} suits {a.customer_segment} teams with {a.deployment_difficulty ?? 'moderate'} setup complexity{a.starting_price != null ? `, starting at $${a.starting_price}` : ''}. {a.limitations?.[0] && `Key consideration: ${a.limitations[0]}.`} {b.name} is designed for {b.customer_segment} teams with {b.deployment_difficulty ?? 'moderate'} setup complexity{b.starting_price != null ? `, starting at $${b.starting_price}` : ''}. {b.limitations?.[0] && `Key consideration: ${b.limitations[0]}.`} Consider your budget, team size, and existing integrations before choosing.
              </p>
            </div>

            <div style={{ backgroundColor: '#F9FAFB', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1.25rem' }}>
              <h3 style={{ fontWeight: 600, color: '#111827', marginBottom: '0.5rem', fontSize: '1rem' }}>
                How does {a.name} pricing compare to {b.name}?
              </h3>
              <p style={{ color: '#4B5563', fontSize: '0.9375rem', lineHeight: 1.7, margin: 0 }}>
                {a.name} uses a {a.pricing_model} model{a.starting_price != null ? `, starting at $${a.starting_price} per month` : ''}. {b.name} uses a {b.pricing_model} model{b.starting_price != null ? `, starting at $${b.starting_price} per month` : ''}. Both pricing structures are tracked and updated regularly on The AI Agent Index.
              </p>
            </div>

            <div style={{ backgroundColor: '#F9FAFB', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1.25rem' }}>
              <h3 style={{ fontWeight: 600, color: '#111827', marginBottom: '0.5rem', fontSize: '1rem' }}>
                What are the main limitations of {a.name} vs {b.name}?
              </h3>
              <p style={{ color: '#4B5563', fontSize: '0.9375rem', lineHeight: 1.7, margin: 0 }}>
                {a.name} limitations include: {a.limitations?.slice(0, 2).join('; ') ?? 'see the full editorial assessment above'}. {b.name} limitations include: {b.limitations?.slice(0, 2).join('; ') ?? 'see the full editorial assessment above'}. Review the Pros &amp; Limitations section above for the complete editorial assessment.
              </p>
            </div>

          </div>
        </div>

        {/* CTA */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Link href={'/agents/' + a.slug}
            style={{ display: 'block', backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.25rem', textDecoration: 'none', textAlign: 'center' }}>
            <p style={{ fontWeight: 600, color: '#111827', marginBottom: '0.25rem' }}>View full {a.name} profile</p>
            <p style={{ fontSize: '0.8125rem', color: '#2563EB' }}>Pricing, reviews, integrations →</p>
          </Link>
          <Link href={'/agents/' + b.slug}
            style={{ display: 'block', backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.25rem', textDecoration: 'none', textAlign: 'center' }}>
            <p style={{ fontWeight: 600, color: '#111827', marginBottom: '0.25rem' }}>View full {b.name} profile</p>
            <p style={{ fontSize: '0.8125rem', color: '#2563EB' }}>Pricing, reviews, integrations →</p>
          </Link>
        </div>

      </div>
    </>
  )
}