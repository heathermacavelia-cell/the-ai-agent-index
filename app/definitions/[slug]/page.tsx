import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import NewsletterSignup from '@/components/NewsletterSignup'

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

// ============================================================
// Inline agent auto-linker
// ------------------------------------------------------------
// Mirrors the agentNameMap approach used on /agents/[slug]:
// exact DB agent names, names >= 4 chars only (avoids false
// positives on short words like "Fin", "Ada"), case-sensitive,
// longest-name-first so "Apollo.io" wins over "Apollo".
// First occurrence per PAGE only: each agent is linked once,
// tracked via the shared linkedSlugs set threaded through render.
// Returns plain strings when there is nothing to link, so
// non-matching text renders identically to before.
// ============================================================
function buildLinkify(agentNameMap: Record<string, string>, linkedSlugs: Set<string>) {
  const names = Object.keys(agentNameMap).sort((a, b) => b.length - a.length)
  if (names.length === 0) {
    return (text: string): ReactNode => text
  }
  const escaped = names.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const pattern = new RegExp('(?<![A-Za-z0-9])(' + escaped.join('|') + ')(?![A-Za-z0-9])', 'g')

  return function linkify(text: string): ReactNode {
    if (!text) return text
    const out: ReactNode[] = []
    let lastIndex = 0
    let key = 0
    let m: RegExpExecArray | null
    pattern.lastIndex = 0
    while ((m = pattern.exec(text)) !== null) {
      const name = m[1]
      const slug = agentNameMap[name]
      const start = m.index
      if (start > lastIndex) out.push(text.slice(lastIndex, start))
      if (slug && !linkedSlugs.has(slug)) {
        linkedSlugs.add(slug)
        out.push(
          <Link key={'lk' + key++} href={'/agents/' + slug} style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>
            {name}
          </Link>
        )
      } else {
        out.push(name)
      }
      lastIndex = start + name.length
    }
    if (lastIndex < text.length) out.push(text.slice(lastIndex))
    return out.length === 1 ? out[0] : out
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

  const relatedSlugs: string[] = def.related_slugs ?? []
  let relatedDefs: { slug: string; title: string }[] = []
  if (relatedSlugs.length > 0) {
    const { data: relatedData } = await supabase.from('definitions').select('slug, title').in('slug', relatedSlugs).eq('is_active', true)
    relatedDefs = relatedData ?? []
  }

  // ----- Related stacks (curated) -----
  // Curated slugs only. Category fallback is intentionally omitted because
  // stacks.primary_category is stored inconsistently (slug vs display label).
  const relatedStackSlugs: string[] = def.related_stack_slugs ?? []
  let relatedStacks: { slug: string; name: string; tagline: string | null; difficulty: string | null }[] = []
  if (relatedStackSlugs.length > 0) {
    const { data: stackData } = await supabase
      .from('stacks')
      .select('slug, name, tagline, difficulty')
      .in('slug', relatedStackSlugs)
      .eq('is_active', true)
    // Preserve the curated order.
    relatedStacks = relatedStackSlugs
      .map((s) => (stackData ?? []).find((d) => d.slug === s))
      .filter((x): x is { slug: string; name: string; tagline: string | null; difficulty: string | null } => Boolean(x))
  }

  // ----- Agent name map for inline linking -----
  // Names >= 4 chars only, exact DB name, case-sensitive. Same rule as /agents/[slug].
  const { data: agentPool } = await supabase
    .from('agents')
    .select('name, slug')
    .eq('is_active', true)
  const agentNameMap: Record<string, string> = {}
  for (const a of agentPool ?? []) {
    if (a.name && a.name.length >= 4) {
      agentNameMap[a.name] = a.slug
    }
  }
  const linkedSlugs = new Set<string>()
  const linkify = buildLinkify(agentNameMap, linkedSlugs)

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
            <p style={{ color: '#374151', lineHeight: 1.8, fontSize: '1rem' }}>{linkify(def.what_it_is)}</p>
          </section>
        )}

        {def.how_it_works && (
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }}>How it works</h2>
            <p style={{ color: '#374151', lineHeight: 1.8, fontSize: '1rem' }}>{linkify(def.how_it_works)}</p>
          </section>
        )}

        {def.key_capabilities && def.key_capabilities.length > 0 && (
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }}>Key capabilities</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {def.key_capabilities.map((cap: string) => (
                <li key={cap} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.9375rem', color: '#374151', lineHeight: 1.6 }}>
                  <span style={{ color: '#2563EB', flexShrink: 0, fontWeight: 700, marginTop: '1px' }}>✓</span>
                  <span>{linkify(cap)}</span>
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
                  <span>{linkify(uc)}</span>
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
                  <span>{linkify(item)}</span>
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
                  <p style={{ color: '#4B5563', fontSize: '0.9375rem', lineHeight: 1.7 }}>{linkify(faq.a)}</p>
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
              Compare every indexed {def.category_label.toLowerCase()}: pricing, capabilities, integrations, and ratings.
            </p>
            <Link href={'/' + def.category}
              style={{ display: 'inline-block', backgroundColor: '#2563EB', color: 'white', padding: '0.625rem 1.5rem', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: 600, fontSize: '0.9375rem' }}>
              View all {def.category_label} →
            </Link>
          </div>
        )}
      {relatedStacks.length > 0 && (
          <section style={{ marginTop: '2.5rem', borderTop: '1px solid #E5E7EB', paddingTop: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>Related agent stacks</h2>
            <p style={{ color: '#6B7280', fontSize: '0.9375rem', marginBottom: '1rem' }}>
              Curated combinations of agents that work together to automate a complete workflow.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {relatedStacks.map((s) => (
                <Link key={s.slug} href={'/stacks/' + s.slug} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #E5E7EB', textDecoration: 'none' }}>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
                    <span style={{ color: '#2563EB', fontWeight: 600, fontSize: '0.9375rem' }}>{s.name}</span>
                    {s.tagline && <span style={{ color: '#6B7280', fontSize: '0.8125rem' }}>{s.tagline}</span>}
                  </span>
                  <span style={{ flexShrink: 0, marginLeft: '0.75rem', color: '#2563EB' }}>→</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      {relatedDefs.length > 0 && (
          <section style={{ marginTop: '2.5rem', borderTop: '1px solid #E5E7EB', paddingTop: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>Related definitions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {relatedDefs.map((r) => (
                <Link key={r.slug} href={'/definitions/' + r.slug} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #E5E7EB', textDecoration: 'none', color: '#2563EB', fontWeight: 500, fontSize: '0.9375rem' }}>
                  <span>{r.title}</span>
                  <span style={{ flexShrink: 0, marginLeft: '0.5rem' }}>→</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      <NewsletterSignup sourcePage={'/definitions/' + params.slug} sourceType="other" />
      </div>
    </>
  )
}