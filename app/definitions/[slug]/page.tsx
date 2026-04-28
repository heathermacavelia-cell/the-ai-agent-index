import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient()
  const { data: def } = await supabase.from('definitions').select('title, meta_title, meta_description').eq('slug', params.slug).eq('is_active', true).single()
  if (!def) return {}
  const metaTitle = def.meta_title ?? def.title
  const metaDescription = def.meta_description ?? def.title
  const url = 'https://theaiagentindex.com/definitions/' + params.slug
  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: { title: metaTitle, description: metaDescription, url, type: 'website', siteName: 'The AI Agent Index' },
    twitter: { card: 'summary', title: metaTitle, description: metaDescription },
    alternates: { canonical: url },
  }
}

export default async function DefinitionPage({ params }: Props) {
  const supabase = createClient()
  const { data: def } = await supabase
    .from('definitions')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single()

  if (!def) notFound()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://theaiagentindex.com'

  const faqs: { q: string; a: string }[] = def.faqs ?? []

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: def.title,
    description: def.meta_description ?? def.description,
    url: siteUrl + '/definitions/' + params.slug,
    publisher: { '@type': 'Organization', name: 'The AI Agent Index', url: siteUrl },
    dateModified: new Date().toISOString().split('T')[0],
  }

  const faqJsonLd = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  } : null

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Definitions', item: siteUrl + '/definitions' },
      { '@type': 'ListItem', position: 3, name: def.title, item: siteUrl + '/definitions/' + params.slug },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6B7280', marginBottom: '2rem' }}>
          <Link href="/" style={{ color: '#6B7280', textDecoration: 'none' }}>Home</Link>
          <span style={{ color: '#D1D5DB' }}>/</span>
          <Link href="/definitions" style={{ color: '#6B7280', textDecoration: 'none' }}>Definitions</Link>
          <span style={{ color: '#D1D5DB' }}>/</span>
          <span style={{ color: '#111827' }}>{def.title}</span>
        </nav>

        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', marginBottom: '1rem', lineHeight: 1.2 }}>
          {def.title}
        </h1>
        <p style={{ fontSize: '1.125rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '2.5rem', borderBottom: '1px solid #E5E7EB', paddingBottom: '2.5rem' }}>
          {def.meta_description ?? def.description}
        </p>

        {def.what_it_is && (
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }}>What it is</h2>
            <p style={{ color: '#374151', lineHeight: 1.8, fontSize: '1rem' }}>{def.what_it_is}</p>
          </section>
        )}

        {def.how_it_works && (
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }}>How it works</h2>
            <p style={{ color: '#374151', lineHeight: 1.8, fontSize: '1rem' }}>{def.how_it_works}</p>
          </section>
        )}

        {def.key_capabilities && def.key_capabilities.length > 0 && (
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }}>Key capabilities</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {def.key_capabilities.map((cap: string) => (
                <li key={cap} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.9375rem', color: '#374151', lineHeight: 1.6 }}>
                  <span style={{ color: '#2563EB', flexShrink: 0, fontWeight: 700, marginTop: '1px' }}>✓</span>
                  <span>{cap}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {def.use_cases && def.use_cases.length > 0 && (
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }}>Common use cases</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {def.use_cases.map((uc: string) => (
                <li key={uc} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.9375rem', color: '#374151', lineHeight: 1.6 }}>
                  <span style={{ color: '#6B7280', flexShrink: 0 }}>→</span>
                  <span>{uc}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {def.how_to_evaluate && def.how_to_evaluate.length > 0 && (
          <section style={{ marginBottom: '2.5rem', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }}>How to evaluate one</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {def.how_to_evaluate.map((item: string) => (
                <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.9375rem', color: '#374151', lineHeight: 1.6 }}>
                  <span style={{ color: '#D97706', flexShrink: 0, fontWeight: 700 }}>?</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {faqs.length > 0 && (
          <section style={{ marginBottom: '3rem', borderTop: '1px solid #E5E7EB', paddingTop: '2.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '1.5rem' }}>Frequently asked questions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {faqs.map((faq) => (
                <div key={faq.q}>
                  <h3 style={{ fontWeight: 600, color: '#111827', marginBottom: '0.5rem', fontSize: '1rem' }}>{faq.q}</h3>
                  <p style={{ color: '#4B5563', fontSize: '0.9375rem', lineHeight: 1.7 }}>{faq.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {def.category && def.category_label && (
          <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '0.75rem', padding: '1.5rem', textAlign: 'center' }}>
            <p style={{ fontWeight: 600, color: '#1D4ED8', marginBottom: '0.5rem', fontSize: '1rem' }}>
              Browse {def.category_label}
            </p>
            <p style={{ color: '#3B82F6', fontSize: '0.9375rem', marginBottom: '1rem' }}>
              Compare every indexed {def.category_label.toLowerCase()} — pricing, capabilities, integrations, and ratings.
            </p>
            <Link href={'/' + def.category}
              style={{ display: 'inline-block', backgroundColor: '#2563EB', color: 'white', padding: '0.625rem 1.5rem', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: 600, fontSize: '0.9375rem' }}>
              View all {def.category_label} →
            </Link>
          </div>
        )}
      </div>
    </>
  )
}