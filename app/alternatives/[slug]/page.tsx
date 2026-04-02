import { createClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import GuideCitations from '@/components/GuideCitations'
import AgentLogo from '@/components/AgentLogo'
export const dynamic = 'force-dynamic'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient()
  const { data: alt } = await supabase.from('alternatives').select('*').eq('slug', params.slug).eq('is_active', true).single()
  if (!alt) return {}
  return {
    title: alt.title + ' — AI Agent Index',
    description: alt.intro.slice(0, 160),
    openGraph: { title: alt.title, description: alt.intro.slice(0, 160), url: 'https://theaiagentindex.com/alternatives/' + params.slug, type: 'website', siteName: 'The AI Agent Index' },
    twitter: { card: 'summary' },
    alternates: { canonical: 'https://theaiagentindex.com/alternatives/' + params.slug },
  }
}

export default async function AlternativesPage({ params }: Props) {
  const supabase = createClient()

  const { data: alt } = await supabase
    .from('alternatives')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single()

  if (!alt) notFound()

  const { data: mainAgent } = await supabase
    .from('agents')
    .select('*')
    .eq('slug', alt.agent_slug)
    .eq('is_active', true)
    .single()

  if (!mainAgent) notFound()

  const { data: alternatives } = await supabase
    .from('agents')
    .select('*')
    .eq('primary_category', alt.category)
    .eq('is_active', true)
    .neq('slug', alt.agent_slug)
    .order('rating_avg', { ascending: false })
    .limit(9)

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
          text: 'The best alternatives to ' + mainAgent.name + ' depend on your use case and budget. Top options include ' + (alternatives ?? []).slice(0, 3).map((a: any) => a.name).join(', ') + '. Each offers different pricing models, capability sets, and integration options — see the full list below.',
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

        <div style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <AgentLogo name={mainAgent.name} websiteUrl={mainAgent.website_url} size="md" />
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
          {(alternatives ?? []).length} alternatives to {mainAgent.name}
        </h2>
        <p style={{ color: '#6B7280', fontSize: '0.9375rem', marginBottom: '1.5rem' }}>
          Ranked by editorial rating. All listings include structured data, pricing, and capability tags.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
          {(alternatives ?? []).map((agent: any, index: number) => (
            <Link key={agent.slug} href={'/agents/' + agent.slug} style={{ textDecoration: 'none' }}>
              <div style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.25rem 1.5rem', display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '1rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                  <span style={{ width: '1.5rem', height: '1.5rem', borderRadius: '50%', backgroundColor: '#EFF6FF', color: '#1D4ED8', fontWeight: 700, fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {index + 1}
                  </span>
                  <AgentLogo name={agent.name} websiteUrl={agent.website_url} size="sm" />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, color: '#111827', fontSize: '1rem' }}>{agent.name}</span>
                    {agent.is_featured && (
                      <span style={{ fontSize: '0.6875rem', padding: '1px 6px', borderRadius: '9999px', backgroundColor: '#2563EB', color: 'white', fontWeight: 700, textTransform: 'uppercase' }}>Featured</span>
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
                  {agent.rating_avg > 0 && (
                    <div style={{ fontSize: '0.75rem', color: '#D97706', marginTop: '0.25rem' }}>★ {agent.rating_avg.toFixed(1)}</div>
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
                The best alternatives to {mainAgent.name} depend on your use case and budget. Top options include {(alternatives ?? []).slice(0, 3).map((a: any) => a.name).join(', ')}. Each offers different pricing models, capability sets, and integration options — see the full list above.
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
    </>
  )
}