export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CATEGORY_SLUGS } from '@/lib/taxonomy'
import type { Metadata } from 'next'
import CategoryPageClient from '@/components/CategoryPageClient'
import { buildRefMap, collectTemplateSlugs, linkedSlugs, renderNameTemplatesHtml, resolveTemplates } from '@/lib/templates'
import { displayRating } from '@/lib/rating'
import CategoryTopRated from '@/components/CategoryTopRated'
import CategorySponsor from '@/components/CategorySponsor'
import RelatedGuides from '@/components/RelatedGuides'
import { categoryMeta } from '@/lib/categoryMeta'
import { longDate } from '@/lib/siteStats'
import NewsletterSignup from '@/components/NewsletterSignup'
import AgencySpotlight from '@/components/AgencySpotlight'

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
  meta_title_template?: string | null
  meta_description_template?: string | null
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

// Template resolution moved to lib/templates.ts on 2026-08-20. The local copy
// removed here had no is_active check, so a delisted referent resolved to a
// real-looking price instead of failing loudly into the raw-brace check.
// Do not reintroduce a local copy.

/** Auto-linking is switched off for a field by handing it an empty name map. */
const NO_AUTO_LINKS: Record<string, string> = {}

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
    .select('slug, meta_title, meta_description, meta_title_template, meta_description_template')
    .eq('slug', params.category)
    .maybeSingle()

  if (!cat) return {}
  const { count } = await supabase
    .from('agents')
    .select('slug', { count: 'exact', head: true })
    .eq('primary_category', params.category)
    .eq('is_active', true)
  const url = 'https://theaiagentindex.com/' + params.category
  const { title, description } = await categoryMeta(cat, count ?? null)
  return {
    title: { absolute: title },
    description,
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      siteName: 'The AI Agent Index',
    },
    twitter: {
      card: 'summary',
      title,
      description,
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
    .select('id, slug, name, developer, website_url, favicon_domain, logo_url, last_verified_at, mcp_status, short_description, best_for, primary_category, agent_type, capability_tags, industry_tags, customer_segment, pricing_model, starting_price, billing_period, price_unit, price_currency, editorial_rating, editorial_rating_notes, rating_avg, rating_count, is_featured, mcp_compatible')
    .eq('primary_category', category)
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .order('rating_avg', { ascending: false })

  const agentList = agents ?? []
  // The newest verification in this category, so the date moves on its own.
  const newestVerified = agentList.reduce<string | null>((max, a) => {
    const v = (a as { last_verified_at?: string | null }).last_verified_at ?? null
    return v && (!max || v > max) ? v : max
  }, null)
  const meta = await categoryMeta(cat, agents ? agentList.length : null)

  // Top five by the PUBLISHED rating (the number each listing shows, via
  // lib/rating), never the raw column, so the box and the listings agree.
  // Feeds both the visible "Highest-rated" box and the ItemList JSON-LD.
  const editorPicks = agentList
    .map(a => ({ ...a, rating: displayRating(a) }))
    .filter((a): a is typeof a & { rating: number } => a.rating != null && a.pricing_model !== 'discontinued')
    .sort((a, b) => b.rating - a.rating || a.name.localeCompare(b.name))
    .slice(0, 5)
  const topRatedHeading = 'Highest-rated ' + displayName.split(' ').map((w, i) => (i === 0 || w === 'AI' || w === 'HR') ? w : w.toLowerCase()).join(' ').replace(/^AI /, 'AI ')

  // Alternatives pages for agents in this category (internal links, SEO 2026-11-07).
  const { data: categoryAlternatives } = await supabase
    .from('alternatives')
    .select('slug, agent_slug')
    .eq('is_active', true)
    .in('agent_slug', agentList.map(a => a.slug))
  const altLinks = (categoryAlternatives ?? [])
    .map(r => ({ slug: r.slug as string, name: agentList.find(a => a.slug === r.agent_slug)?.name ?? '' }))
    .filter(r => r.name)
    .sort((a, b) => a.name.localeCompare(b.name))

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
  // Scan EVERY editorial field, not just editorial_content. intro, the three
  // hero cards, and the FAQ answers are all hand-written and can carry
  // templates. An unresolved one renders as raw braces, and for the FAQs it
  // lands in the FAQ JSON-LD.
  const templateScanText = [
    cat.editorial_content ?? '',
    cat.intro ?? '',
    cat.what_it_does ?? '',
    cat.who_its_for ?? '',
    cat.what_to_look_for ?? '',
    ...faqs.flatMap((f) => [f.q, f.a]),
  ].join(' ')

  const refs = await buildRefMap(supabase, collectTemplateSlugs([templateScanText]))

  // ----- Resolve templates in every editorial field -----
  const resolvedIntro = resolveTemplates(cat.intro ?? '', refs)
  const resolvedWhatItDoes = resolveTemplates(cat.what_it_does ?? '', refs)
  const resolvedWhoItsFor = resolveTemplates(cat.who_its_for ?? '', refs)
  const resolvedWhatToLookFor = resolveTemplates(cat.what_to_look_for ?? '', refs)
  const resolvedFaqs: FAQ[] = faqs.map((f) => ({
    q: resolveTemplates(f.q, refs),
    a: resolveTemplates(f.a, refs),
  }))

  // ----- Render editorial content with template vars, links, and markdown -----
  let editorialHtml: string | null = null
  if (cat.editorial_content) {
    // The author-linked test MUST run on the RAW field, BEFORE resolution.
    // Step 1 below removes every brace, so testing the processed string would
    // silently never fire. It keys on {{slug.name}} ONLY - a price or stars
    // template says nothing about link intent, and gating on any template at
    // all would have stripped auto-linking from 354 fields catalog-wide on the
    // day it shipped (measured 2026-08-20).
    const authorLinked = linkedSlugs(cat.editorial_content).length > 0

    let processed = cat.editorial_content
    // 1. Resolve template variables. On an author-linked field the
    //    {{slug.name}} templates are KEPT, so step 3 can render them as
    //    anchors. Braces survive the markdown pass untouched, which is the
    //    whole reason this ordering works.
    processed = resolveTemplates(processed, refs, undefined, { keepNameTemplates: authorLinked })
    // 2. Convert markdown to HTML
    editorialHtml = renderEditorialMarkdown(processed)
    // 3. Links. An author-linked field gets ONLY the links it asked for; every
    //    other field keeps today's automatic linking, byte for byte.
    editorialHtml = authorLinked
      ? renderNameTemplatesHtml(editorialHtml, refs)
      : applyInternalLinks(editorialHtml, agentNameMap)
  }

  // Schema: CollectionPage wrapping ItemList
  const collectionPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: meta.title,
    description: meta.description,
    url: 'https://theaiagentindex.com/' + category,
    dateModified: newestVerified ?? cat.updated_at,
    provider: {
      '@type': 'Organization',
      name: 'The AI Agent Index',
      url: 'https://theaiagentindex.com',
    },
    mainEntity: {
      '@type': 'ItemList',
      name: meta.title,
      description: meta.description,
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
    mainEntity: resolvedFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  } : null

  return (
    <div className="cp">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}

      <section className="cp-band" style={{ backgroundColor: cat.bg_color, borderBottomColor: cat.border_color }}>
        <div className="hp-wrap">
          <nav className="cp-crumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>{displayName}</span>
          </nav>
          <h1 className="cp-h1">{meta.title}</h1>
          <p className="cp-updated">{newestVerified ? 'Updated ' + longDate(newestVerified) : formatUpdatedPill(cat.updated_at)}</p>
          <p className="cp-intro">{resolvedIntro}</p>
        </div>
      </section>

      <section className="cp-list">
        <div className="hp-wrap">
          {/* Sold as "above the category agent grid" - it stays there. */}
          <CategorySponsor categorySlug={category} />
          <CategoryTopRated heading={topRatedHeading} agents={editorPicks} />
          <CategoryPageClient agents={agentList} categorySlug={category} />
        </div>
      </section>

      <section style={{ paddingBottom: '4rem' }}>
        <div className="hp-wrap">
          <div className="cp-grid3 cp-after-boxes">
            <div className="cp-box" style={{ backgroundColor: cat.bg_color, borderColor: cat.border_color }}><h2>What it does</h2><p>{resolvedWhatItDoes}</p></div>
            <div className="cp-box" style={{ backgroundColor: cat.bg_color, borderColor: cat.border_color }}><h2>Who it&apos;s for</h2><p>{resolvedWhoItsFor}</p></div>
            <div className="cp-box" style={{ backgroundColor: cat.bg_color, borderColor: cat.border_color }}><h2>What to look for</h2><p>{resolvedWhatToLookFor}</p></div>
          </div>
          {altLinks.length > 0 && (
            <div style={{ margin: '0 0 2.5rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', margin: '0 0 0.75rem' }}>Alternatives to popular {displayName.replace(/^AI /, 'AI ').toLowerCase().replace(/^ai /, 'AI ').replace(/\bhr\b/, 'HR')}</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {altLinks.map(l => (
                  <Link key={l.slug} href={'/alternatives/' + l.slug} style={{ fontSize: '0.875rem', color: '#2563EB', backgroundColor: 'white', border: '1px solid #E5E7EB', padding: '0.375rem 0.75rem', borderRadius: '0.5rem', textDecoration: 'none' }}>{l.name} alternatives</Link>
                ))}
              </div>
            </div>
          )}
          <div className="cp-article">
            <div className="hp-min0">
              {editorialHtml && <div className="cp-editorial" dangerouslySetInnerHTML={{ __html: editorialHtml }} />}
              {faqs.length > 0 && (
                <div className="cp-faq-block">
                  <h2 className="cp-faq-title">Frequently asked questions</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                    {resolvedFaqs.map((faq, i) => (
                      <div key={i} style={{ borderBottom: i < faqs.length - 1 ? '1px solid #E2E5EA' : 'none', paddingBottom: i < faqs.length - 1 ? '1.75rem' : 0 }}>
                        <h3 style={{ fontWeight: 600, color: '#111827', marginBottom: '0.625rem', fontSize: '1rem', lineHeight: 1.4 }}>{faq.q}</h3>
                        <p style={{ color: '#374151', fontSize: '1rem', lineHeight: 1.6 }}>{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <aside>
              <div className="cp-rail-guides"><RelatedGuides category={category} limit={8} /></div>
              <div className="cp-rail-sticky"><NewsletterSignup sourcePage={'/' + category} sourceType="other" /></div>
            </aside>
          </div>
          <div className="cp-spot"><AgencySpotlight categorySlug={category} /></div>
        </div>
      </section>
    </div>
  )
}