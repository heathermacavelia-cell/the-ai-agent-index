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

// Map comparison slugs to their alternatives pages
function getAlternativesSlug(agentSlug: string): string | null {
  const map: Record<string, string> = {
    'apollo-io': 'apollo-io',
    'instantly-ai': 'instantly-ai',
    'cursor': 'cursor',
    'github-copilot': 'github-copilot',
    'intercom-fin': 'intercom-fin',
    'zendesk-ai': 'zendesk-ai',
    'gong': 'gong',
    'clay': 'clay',
    'lemlist': 'lemlist',
    'jasper': 'jasper',
    'copy-ai': 'copy-ai',
    'perplexity-ai': 'perplexity-ai',
    'deel': 'deel',
    'rippling': 'rippling',
    'chatgpt-deep-research': 'chatgpt',
  }
  return map[agentSlug] ?? null
}

// Related comparisons for each agent slug
const RELATED_COMPARISONS: Record<string, { slug: string; label: string }[]> = {
  'apollo-io': [
    { slug: 'apollo-io-vs-instantly-ai', label: 'Apollo.io vs Instantly.ai' },
    { slug: 'apollo-io-vs-lemlist', label: 'Apollo.io vs Lemlist' },
    { slug: 'clay-vs-instantly-ai', label: 'Clay vs Instantly.ai' },
  ],
  'instantly-ai': [
    { slug: 'apollo-io-vs-instantly-ai', label: 'Apollo.io vs Instantly.ai' },
    { slug: 'lemlist-vs-instantly-ai', label: 'Lemlist vs Instantly.ai' },
    { slug: 'clay-vs-instantly-ai', label: 'Clay vs Instantly.ai' },
  ],
  'lemlist': [
    { slug: 'apollo-io-vs-lemlist', label: 'Apollo.io vs Lemlist' },
    { slug: 'lemlist-vs-instantly-ai', label: 'Lemlist vs Instantly.ai' },
  ],
  'cursor': [
    { slug: 'cursor-vs-github-copilot', label: 'Cursor vs GitHub Copilot' },
    { slug: 'cursor-vs-windsurf', label: 'Cursor vs Windsurf' },
    { slug: 'github-copilot-vs-windsurf', label: 'GitHub Copilot vs Windsurf' },
  ],
  'github-copilot': [
    { slug: 'cursor-vs-github-copilot', label: 'Cursor vs GitHub Copilot' },
    { slug: 'devin-vs-github-copilot', label: 'Devin vs GitHub Copilot' },
    { slug: 'github-copilot-vs-windsurf', label: 'GitHub Copilot vs Windsurf' },
  ],
  'deel': [
    { slug: 'deel-vs-gusto', label: 'Deel vs Gusto' },
    { slug: 'rippling-vs-deel', label: 'Rippling vs Deel' },
    { slug: 'rippling-vs-gusto', label: 'Rippling vs Gusto' },
  ],
  'rippling': [
    { slug: 'rippling-vs-deel', label: 'Rippling vs Deel' },
    { slug: 'rippling-vs-gusto', label: 'Rippling vs Gusto' },
    { slug: 'deel-vs-gusto', label: 'Deel vs Gusto' },
  ],
  'intercom-fin': [
    { slug: 'intercom-fin-vs-zendesk-ai', label: 'Intercom Fin vs Zendesk AI' },
    { slug: 'gorgias-vs-tidio', label: 'Gorgias vs Tidio' },
  ],
  'zendesk-ai': [
    { slug: 'intercom-fin-vs-zendesk-ai', label: 'Intercom Fin vs Zendesk AI' },
    { slug: 'gorgias-vs-tidio', label: 'Gorgias vs Tidio' },
  ],
  'gong': [
    { slug: 'gong-vs-clari', label: 'Gong vs Clari' },
    { slug: 'hubspot-sales-hub-vs-salesforce-agentforce', label: 'HubSpot vs Salesforce Agentforce' },
  ],
  'perplexity-ai': [
    { slug: 'perplexity-ai-vs-chatgpt-deep-research', label: 'Perplexity vs ChatGPT Deep Research' },
    { slug: 'elicit-vs-consensus', label: 'Elicit vs Consensus' },
  ],
}

export default async function ComparePage({ params }: Props) {
  const parsed = parseCompareSlug(params.slug)
  if (!parsed) notFound()

  const supabase = createClient()
  const [{ data: a }, { data: b }, { data: comparison }] = await Promise.all([
    supabase.from('agents').select('*').eq('slug', parsed.slugA).eq('is_active', true).single(),
    supabase.from('agents').select('*').eq('slug', parsed.slugB).eq('is_active', true).single(),
    supabase.from('comparisons').select('verdict, best_for_a, best_for_b').eq('slug', params.slug).single(),
  ])

  if (!a || !b) notFound()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://theaiagentindex.com'
  const year = new Date().getFullYear()
  const dateModified = new Date().toISOString().split('T')[0]

  const altSlugA = getAlternativesSlug(parsed.slugA)
  const altSlugB = getAlternativesSlug(parsed.slugB)

  // Related comparisons — union of both agents, dedupe current page
  const relatedRaw = [
    ...(RELATED_COMPARISONS[parsed.slugA] ?? []),
    ...(RELATED_COMPARISONS[parsed.slugB] ?? []),
  ]
  const seen = new Set<string>()
  const relatedComparisons = relatedRaw.filter(r => {
    if (r.slug === params.slug || seen.has(r.slug)) return false
    seen.add(r.slug)
    return true
  }).slice(0, 4)

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
          text: comparison?.verdict ?? (a.name + ' is a ' + a.pricing_model + ' ' + a.primary_category.split('-').join(' ') + ' targeting ' + a.customer_segment + ' customers. A key strength is: ' + aTopPro + '. ' + b.name + ' is a ' + b.pricing_model + ' tool targeting ' + b.customer_segment + ' customers. A key strength is: ' + bTopPro + '.'),
        },
      },
      {
        '@type': 'Question',
        name: 'Is ' + a.name + ' or ' + b.name + ' better for my team?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: (comparison?.best_for_a ? a.name + ' is best for: ' + comparison.best_for_a + '. ' : '') + (comparison?.best_for_b ? b.name + ' is best for: ' + comparison.best_for_b + '.' : ''),
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
        <p style={{ fontSize: '0.8125rem', color: '#9CA3AF', marginBottom: '2rem' }}>
          Data sourced from The AI Agent Index · Updated daily
        </p>

        {/* Verdict box */}
        {comparison?.verdict && (
          <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '0.875rem', padding: '1.5rem', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#1D4ED8', backgroundColor: '#DBEAFE', padding: '0.2rem 0.5rem', borderRadius: '0.25rem' }}>Editorial Verdict</span>
            </div>
            <p style={{ fontSize: '1rem', color: '#1E3A5F', lineHeight: 1.7, margin: 0, fontWeight: 500 }}>{comparison.verdict}</p>
          </div>
        )}

        {/* Hero comparison cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2.5rem' }}>
          {[
            { agent: a, bestFor: comparison?.best_for_a },
            { agent: b, bestFor: comparison?.best_for_b },
          ].map(({ agent, bestFor }) => (
            <div key={agent.slug} style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <AgentLogo name={agent.name} websiteUrl={agent.website_url} faviconDomain={agent.favicon_domain} size="md" />
                <div>
                  <h2 style={{ fontWeight: 700, fontSize: '1.125rem', color: '#111827', marginBottom: '0.125rem' }}>{agent.name}</h2>
                  <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>by {agent.developer}</p>
                </div>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.6, marginBottom: '0.875rem' }}>{agent.short_description}</p>
              {bestFor && (
                <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '0.5rem', padding: '0.625rem 0.875rem', marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#15803D', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Best for</p>
                  <p style={{ fontSize: '0.8125rem', color: '#166534', lineHeight: 1.5, margin: 0 }}>{bestFor}</p>
                </div>
              )}
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
                {comparison?.verdict ?? (a.name + ' is a ' + a.pricing_model + ' ' + a.primary_category.split('-').join(' ') + ' targeting ' + a.customer_segment + ' customers. ' + (a.pros?.[0] ? 'A standout strength: ' + a.pros[0] + '.' : '') + ' ' + b.name + ' is a ' + b.pricing_model + ' tool targeting ' + b.customer_segment + ' customers. ' + (b.pros?.[0] ? 'A standout strength: ' + b.pros[0] + '.' : ''))}
              </p>
            </div>

            <div style={{ backgroundColor: '#F9FAFB', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1.25rem' }}>
              <h3 style={{ fontWeight: 600, color: '#111827', marginBottom: '0.5rem', fontSize: '1rem' }}>
                Is {a.name} or {b.name} better for my team?
              </h3>
              <p style={{ color: '#4B5563', fontSize: '0.9375rem', lineHeight: 1.7, margin: 0 }}>
                {comparison?.best_for_a ? <>{a.name} is best for: {comparison.best_for_a}. </> : null}
                {comparison?.best_for_b ? <>{b.name} is best for: {comparison.best_for_b}.</> : null}
                {!comparison?.best_for_a && !comparison?.best_for_b && (
                  <>{a.name} suits {a.customer_segment} teams with {a.deployment_difficulty ?? 'moderate'} setup complexity. {b.name} is designed for {b.customer_segment} teams with {b.deployment_difficulty ?? 'moderate'} setup complexity.</>
                )}
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
                {a.name} limitations include: {a.limitations?.slice(0, 2).join('; ') ?? 'see the full editorial assessment above'}. {b.name} limitations include: {b.limitations?.slice(0, 2).join('; ') ?? 'see the full editorial assessment above'}.
              </p>
            </div>
          </div>
        </div>

        {/* CTA — agent profile links */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          <Link href={'/agents/' + a.slug}
            style={{ display: 'block', backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.25rem', textDecoration: 'none', textAlign: 'center' }}>
            <p style={{ fontWeight: 600, color: '#111827', marginBottom: '0.25rem' }}>View full {a.name} profile</p>
            <p style={{ fontSize: '0.8125rem', color: '#2563EB', margin: 0 }}>Pricing, reviews, integrations →</p>
          </Link>
          <Link href={'/agents/' + b.slug}
            style={{ display: 'block', backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.25rem', textDecoration: 'none', textAlign: 'center' }}>
            <p style={{ fontWeight: 600, color: '#111827', marginBottom: '0.25rem' }}>View full {b.name} profile</p>
            <p style={{ fontSize: '0.8125rem', color: '#2563EB', margin: 0 }}>Pricing, reviews, integrations →</p>
          </Link>
        </div>

        {/* Alternatives links */}
        {(altSlugA || altSlugB) && (
          <div style={{ display: 'grid', gridTemplateColumns: altSlugA && altSlugB ? '1fr 1fr' : '1fr', gap: '1rem', marginBottom: '2rem' }}>
            {altSlugA && (
              <Link href={'/alternatives/' + altSlugA}
                style={{ display: 'block', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1rem 1.25rem', textDecoration: 'none' }}>
                <p style={{ fontWeight: 600, color: '#111827', marginBottom: '0.25rem', fontSize: '0.9375rem' }}>Best {a.name} alternatives</p>
                <p style={{ fontSize: '0.8125rem', color: '#2563EB', margin: 0 }}>See all alternatives →</p>
              </Link>
            )}
            {altSlugB && (
              <Link href={'/alternatives/' + altSlugB}
                style={{ display: 'block', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1rem 1.25rem', textDecoration: 'none' }}>
                <p style={{ fontWeight: 600, color: '#111827', marginBottom: '0.25rem', fontSize: '0.9375rem' }}>Best {b.name} alternatives</p>
                <p style={{ fontSize: '0.8125rem', color: '#2563EB', margin: 0 }}>See all alternatives →</p>
              </Link>
            )}
          </div>
        )}

        {/* Related comparisons */}
        {relatedComparisons.length > 0 && (
          <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2rem' }}>
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

      </div>
      {/* Newsletter */}
<div style={{ marginTop: '2.5rem' }}>
  <NewsletterSignup source={'compare-' + params.slug} dark={false} />
</div>
    </>
  )
}