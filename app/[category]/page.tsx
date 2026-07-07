export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CATEGORY_SLUGS } from '@/lib/taxonomy'
import type { Metadata } from 'next'
import CategoryPageClient from '@/components/CategoryPageClient'
import CategorySponsor from '@/components/CategorySponsor'
import EditorPicks from '@/components/EditorPicks'
import NewsletterSignup from '@/components/NewsletterSignup'

interface Props {
  params: { category: string }
}

interface FAQ {
  q: string
  a: string
}

interface CategoryRow {
  slug: string
  display_name: string
  meta_title: string
  meta_description: string
  icon_path: string
  bg_color: string
  border_color: string
  description: string
  long_description: string
  intro: string
  editorial_content: string | null
  what_it_does: string
  who_its_for: string
  what_to_look_for: string
  faqs: FAQ[]
  updated_at: string
  last_verified_at: string | null
}

// Resolve {{slug.starting_price}} template variables in text.
function resolveTemplateVars(
  text: string,
  priceMap: Record<string, { starting_price: number | null; pricing_model: string | null }>
): string {
  return text.replace(/\{\{([a-z0-9-]+)\.starting_price\}\}/g, (match, slug) => {
    const info = priceMap[slug]
    if (!info) return match
    if (info.starting_price != null && info.starting_price > 0) return '$' + info.starting_price + '/mo'
    if (info.pricing_model === 'free') return 'free'
    return 'custom pricing'
  })
}

// Replace known agent names in text with links to their listing pages.
// Only matches names with 4+ characters to avoid false positives.
// Matches whole words only (not inside other words).
// Each agent is linked at most once per editorial content block.
function applyInternalLinks(
  text: string,
  agentNameMap: Record<string, string>
): string {
  const sortedNames = Object.keys(agentNameMap).sort((a, b) => b.length - a.length)
  const linked = new Set<string>()

  for (const name of sortedNames) {
    if (linked.has(name)) continue
    const slug = agentNameMap[name]
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    // Match the name only when NOT already inside an <a> tag.
    // The negative lookahead ensures we are not between <a and </a>.
    const regex = new RegExp('(?<![\\w/])(' + escaped + ')(?![\\w])', 'i')
    const match = regex.exec(text)
    if (match) {
      // Check if this match position is inside an existing <a> tag
      const before = text.slice(0, match.index)
      const lastOpenA = before.lastIndexOf('<a ')
      const lastCloseA = before.lastIndexOf('</a>')
      if (lastOpenA > lastCloseA) {
        // We are inside an <a> tag, skip this match
        continue
      }
      text = text.slice(0, match.index) +
        '<a href="/agents/' + slug + '" style="color:#2563EB;text-decoration:underline;">' + match[1] + '</a>' +
        text.slice(match.index + match[0].length)
      linked.add(name)
    }
  }

  return text
}

// Simple markdown-to-HTML for editorial_content (server-side only).
// Supports: ## H2, ### H3, **bold**, [text](url), blank-line paragraph breaks.
function renderEditorialMarkdown(md: string): string {
  const lines = md.split('\n')
  const htmlParts: string[] = []
  let paragraphBuffer: string[] = []

  function flushParagraph() {
    if (paragraphBuffer.length > 0) {
      const text = paragraphBuffer.join(' ')
      htmlParts.push('<p style="color:#374151;font-size:0.9375rem;line-height:1.7;margin:0 0 1rem 0;">' + inlineFormat(text) + '</p>')
      paragraphBuffer = []
    }
  }

  function inlineFormat(text: string): string {
    // Bold
    let result = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Links
    result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:#2563EB;text-decoration:underline;">$1</a>')
    return result
  }

  for (const line of lines) {
    const trimmed = line.trim()

    if (trimmed.startsWith('### ')) {
      flushParagraph()
      const heading = trimmed.slice(4)
      htmlParts.push('<h3 style="font-size:1.0625rem;font-weight:600;color:#111827;margin:1.75rem 0 0.625rem 0;line-height:1.4;">' + inlineFormat(heading) + '</h3>')
    } else if (trimmed.startsWith('## ')) {
      flushParagraph()
      const heading = trimmed.slice(3)
      htmlParts.push('<h2 style="font-size:1.25rem;font-weight:700;color:#111827;margin:2rem 0 0.75rem 0;line-height:1.3;letter-spacing:-0.01em;">' + inlineFormat(heading) + '</h2>')
    } else if (trimmed === '') {
      flushParagraph()
    } else {
      paragraphBuffer.push(trimmed)
    }
  }
  flushParagraph()

  return htmlParts.join('\n')
}

// Format updated_at as "Updated July 2026"
function formatUpdatedPill(dateStr: string): string {
  const d = new Date(dateStr)
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December']
  return 'Updated ' + months[d.getMonth()] + ' ' + d.getFullYear()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient()
  const { data: cat } = await supabase
    .from('categories')
    .select('meta_title, meta_description')
    .eq('slug', params.category)
    .maybeSingle()

  if (!cat) return {}
  const url = 'https://theaiagentindex.com/' + params.category
  return {
    title: { absolute: cat.meta_title },
    description: cat.meta_description,
    openGraph: {
      title: cat.meta_title,
      description: cat.meta_description,
      url,
      type: 'website',
      siteName: 'The AI Agent Index',
    },
    twitter: {
      card: 'summary',
      title: cat.meta_title,
      description: cat.meta_description,
    },
    alternates: { canonical: url },
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category } = params
  const validSlugs = Object.values(CATEGORY_SLUGS)
  if (!validSlugs.includes(category)) notFound()

  const displayName = Object.entries(CATEGORY_SLUGS).find(([, slug]) => slug === category)?.[0] ?? category

  const supabase = createClient()

  // Fetch category metadata from DB
  const { data: cat } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', category)
    .maybeSingle() as { data: CategoryRow | null }

  if (!cat) notFound()

  // Fetch agents for this category
  const { data: agents } = await supabase
    .from('agents')
    .select('*')
    .eq('primary_category', category)
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .order('rating_avg', { ascending: false })

  const agentList = agents ?? []

  // Build Editor's Picks: top 5 by editorial_rating
  const editorPicks = [...agentList]
    .filter(a => a.editorial_rating != null && a.editorial_rating > 0)
    .sort((a, b) => (b.editorial_rating ?? 0) - (a.editorial_rating ?? 0))
    .slice(0, 5)

  const faqs: FAQ[] = Array.isArray(cat.faqs) ? cat.faqs : []

  // ----- Build agent name map for internal linking (4+ char names only) -----
  const { data: allActiveAgents } = await supabase
    .from('agents')
    .select('name, slug')
    .eq('is_active', true)

  const agentNameMap: Record<string, string> = {}
  for (const a of (allActiveAgents ?? [])) {
    if (a.name && a.name.length >= 4) {
      agentNameMap[a.name] = a.slug
    }
  }

  // ----- Build price map for {{slug.starting_price}} template variables -----
  let priceMap: Record<string, { starting_price: number | null; pricing_model: string | null }> = {}
  if (cat.editorial_content) {
    const priceVarMatches = cat.editorial_content.match(/\{\{([a-z0-9-]+)\.starting_price\}\}/g) ?? []
    const priceSlugs = [...new Set(priceVarMatches.map((m: string) => m.replace('{{', '').replace('.starting_price}}', '')))]
    if (priceSlugs.length > 0) {
      const { data: priceAgents } = await supabase
        .from('agents')
        .select('slug, starting_price, pricing_model')
        .in('slug', priceSlugs)
      if (priceAgents) {
        for (const pa of priceAgents) {
          priceMap[pa.slug] = { starting_price: pa.starting_price, pricing_model: pa.pricing_model }
        }
      }
    }
  }

  // ----- Render editorial content with template vars, links, and markdown -----
  let editorialHtml: string | null = null
  if (cat.editorial_content) {
    let processed = cat.editorial_content
    // 1. Resolve template variables first
    processed = resolveTemplateVars(processed, priceMap)
    // 2. Convert markdown to HTML
    editorialHtml = renderEditorialMarkdown(processed)
    // 3. Apply internal links on the rendered HTML
    editorialHtml = applyInternalLinks(editorialHtml, agentNameMap)
  }

  // Schema: CollectionPage wrapping ItemList
  const collectionPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: cat.meta_title,
    description: cat.meta_description,
    url: 'https://theaiagentindex.com/' + category,
    dateModified: cat.updated_at,
    provider: {
      '@type': 'Organization',
      name: 'The AI Agent Index',
      url: 'https://theaiagentindex.com',
    },
    mainEntity: {
      '@type': 'ItemList',
      name: cat.meta_title,
      description: cat.meta_description,
      url: 'https://theaiagentindex.com/' + category,
      numberOfItems: agentList.length,
      itemListElement: editorPicks.map((agent, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: agent.name,
        description: agent.short_description,
        url: 'https://theaiagentindex.com/agents/' + agent.slug,
      })),
    },
  }

  // Schema: BreadcrumbList
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://theaiagentindex.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: displayName,
        item: 'https://theaiagentindex.com/' + category,
      },
    ],
  }

  // Schema: FAQPage
  const faqJsonLd = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  } : null

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}

      {/* Hero */}
      <section style={{ backgroundColor: cat.bg_color, borderBottom: '1px solid', borderColor: cat.border_color, padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6B7280', marginBottom: '1.5rem' }}>
            <Link href="/" style={{ color: '#6B7280', textDecoration: 'none' }}>Home</Link>
            <span style={{ color: '#D1D5DB' }}>/</span>
            <span style={{ color: '#111827' }}>{displayName}</span>
          </nav>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '3.5rem', height: '3.5rem', backgroundColor: 'white', border: '1px solid', borderColor: cat.border_color, borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
              <img src={cat.icon_path} alt={displayName} style={{ width: '2.5rem', height: '2.5rem', objectFit: 'contain' }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', margin: 0 }}>{cat.meta_title}</h1>
                <span style={{
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  color: '#15803D',
                  backgroundColor: '#F0FDF4',
                  border: '1px solid #BBF7D0',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '9999px',
                  whiteSpace: 'nowrap',
                }}>
                  {formatUpdatedPill(cat.updated_at)}
                </span>
              </div>
              <p style={{ color: '#6B7280', maxWidth: '680px', lineHeight: 1.6, fontSize: '0.9375rem' }}>{cat.intro}</p>
            </div>
          </div>

          {/* Category Sponsor */}
          <CategorySponsor categorySlug={category} />

          {/* Content grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
            <div style={{ background: 'white', border: '1px solid', borderColor: cat.border_color, borderRadius: '0.75rem', padding: '1.25rem' }}>
              <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>What it does</p>
              <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.6 }}>{cat.what_it_does}</p>
            </div>
            <div style={{ background: 'white', border: '1px solid', borderColor: cat.border_color, borderRadius: '0.75rem', padding: '1.25rem' }}>
              <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Who it&apos;s for</p>
              <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.6 }}>{cat.who_its_for}</p>
            </div>
            <div style={{ background: 'white', border: '1px solid', borderColor: cat.border_color, borderRadius: '0.75rem', padding: '1.25rem' }}>
              <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>What to look for</p>
              <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.6 }}>{cat.what_to_look_for}</p>
            </div>
          </div>

          {/* Editor's Picks (client component) */}
          <EditorPicks agents={editorPicks} borderColor={cat.border_color} />
        </div>
      </section>

      {/* Editorial content section (rendered between hero and agent listings) */}
      {editorialHtml && (
        <section style={{ padding: '2.5rem 1.5rem 0' }}>
          <div style={{ maxWidth: '780px', margin: '0 auto' }}
            dangerouslySetInnerHTML={{ __html: editorialHtml }}
          />
        </section>
      )}

      <section style={{ padding: '2rem 1.5rem 4rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          <CategoryPageClient agents={agentList} categorySlug={category} />

          {/* FAQ section */}
          {faqs.length > 0 && (
            <div style={{ marginTop: '4rem', paddingTop: '3rem', borderTop: '1px solid #E5E7EB' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '2rem', letterSpacing: '-0.01em' }}>
                Frequently asked questions
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                {faqs.map((faq, i) => (
                  <div key={i} style={{ borderBottom: i < faqs.length - 1 ? '1px solid #F3F4F6' : 'none', paddingBottom: i < faqs.length - 1 ? '1.75rem' : 0 }}>
                    <h3 style={{ fontWeight: 600, color: '#111827', marginBottom: '0.625rem', fontSize: '1rem', lineHeight: 1.4 }}>{faq.q}</h3>
                    <p style={{ color: '#4B5563', fontSize: '0.9375rem', lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div style={{ marginTop: '2rem' }}>
          <NewsletterSignup sourcePage={'/' + category} sourceType="other" />
        </div>
      </section>
    </div>
  )
}