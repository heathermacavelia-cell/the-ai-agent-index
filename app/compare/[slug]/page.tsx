import { createClient } from '@/lib/supabase'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import AgentLogo from '@/components/AgentLogo'
import NewsletterSignup from '@/components/NewsletterSignup'

export const dynamic = 'force-dynamic'

interface Props {
  params: { slug: string }
}

// ============================================================
// Template resolution + price formatting
// ============================================================
// pros, limitations, best_for, AND the comparisons row (verdict, best_for_a/b/c)
// contain {{slug.starting_price}} and {{github_stars}} templates. Rendering them
// raw leaks placeholders to users and into the FAQ JSON-LD.
//
// The verdict and best_for_* live on the COMPARISONS row, not the agent rows, so
// they must be fed into the resolver explicitly. Miss that and their slugs are
// never collected, the placeholder never resolves, and we publish literal braces.

const PRICE_VAR_REGEX = /\{\{([a-z0-9-]+)\.starting_price\}\}/g

interface PriceInfo {
  starting_price: number | null
  pricing_model: string | null
  billing_period: string | null
  price_unit: string | null
}

function formatStars(stars: number): string {
  if (stars >= 1000) {
    const k = stars / 1000
    return (k >= 100 ? Math.round(k).toString() : k.toFixed(1).replace(/\.0$/, '')) + 'k'
  }
  return String(stars)
}

function formatPrice(info: PriceInfo): string {
  if (info.starting_price === 0 || info.pricing_model === 'free') return 'free'
  if (info.starting_price == null) return 'custom pricing'
  // Usage pricing is per-unit, not per-month. Never append "/mo".
  if (info.billing_period === 'usage') {
    return '$' + info.starting_price + (info.price_unit ? ' ' + info.price_unit : ' usage-based')
  }
  const base = '$' + info.starting_price + '/mo'
  if (info.billing_period === 'annual') return base + ' billed annually'
  return base
}

/** Table cell version: short, with the qualifier on a second line. */
function priceCellPrimary(ag: any): string {
  if (ag.starting_price == null) return 'Contact sales'
  if (ag.starting_price === 0 || ag.pricing_model === 'free') return 'Free'
  return '$' + ag.starting_price
}

function priceCellQualifier(ag: any): string {
  if (ag.starting_price == null || ag.starting_price === 0) return ''
  if (ag.billing_period === 'usage') return ag.price_unit ?? 'usage-based'
  if (ag.billing_period === 'annual') return '/mo, billed annually'
  return '/mo'
}

/** Plain-English price for the FAQ and its JSON-LD. */
function priceSentence(ag: any): string {
  if (ag.starting_price == null) return `${ag.name} uses a ${ag.pricing_model ?? 'custom'} model with pricing on request.`
  if (ag.starting_price === 0 || ag.pricing_model === 'free') return `${ag.name} is free to start.`
  if (ag.billing_period === 'usage') {
    const unit = ag.price_unit ?? 'per unit'
    return `${ag.name} uses a ${ag.pricing_model} model, charging $${ag.starting_price} ${unit}.`
  }
  const qualifier = ag.billing_period === 'annual'
    ? ' per month on an annual commitment (month-to-month costs more)'
    : ' per month'
  return `${ag.name} uses a ${ag.pricing_model} model, starting at $${ag.starting_price}${qualifier}.`
}

async function buildResolver(
  supabase: ReturnType<typeof createClient>,
  agents: any[],
  extraTexts: string[] = []
): Promise<(text: string, agent: any) => string> {
  const texts: string[] = [...extraTexts]
  for (const ag of agents) {
    texts.push(...(ag.pros ?? []), ...(ag.limitations ?? []), ag.best_for ?? '')
  }

  const slugs = new Set<string>()
  for (const t of texts) {
    if (typeof t !== 'string') continue
    for (const m of t.matchAll(PRICE_VAR_REGEX)) slugs.add(m[1])
  }

  const priceMap: Record<string, PriceInfo> = {}
  if (slugs.size > 0) {
    const { data } = await supabase
      .from('agents')
      .select('slug, starting_price, pricing_model, billing_period, price_unit')
      .in('slug', [...slugs])
    for (const pa of data ?? []) {
      priceMap[pa.slug] = {
        starting_price: pa.starting_price,
        pricing_model: pa.pricing_model,
        billing_period: pa.billing_period ?? null,
        price_unit: pa.price_unit ?? null,
      }
    }
  }

  // github_stars is per-agent, so the resolver takes the owning agent.
  return (text: string, agent: any): string => {
    if (typeof text !== 'string') return text
    let out = text.replace(PRICE_VAR_REGEX, (match, slug) => {
      const info = priceMap[slug]
      if (!info) return match
      return formatPrice(info)
    })
    const stars = typeof agent?.github_stars === 'number' ? agent.github_stars : null
    if (stars != null) {
      out = out.replace(/\{\{github_stars\}\}/g, formatStars(stars))
    }
    return out
  }
}

function parseCompareSlug(slug: string): { slugA: string; slugB: string; slugC?: string } | null {
  const parts = slug.split('-vs-')
  if (parts.length === 2) return { slugA: parts[0], slugB: parts[1] }
  if (parts.length === 3) return { slugA: parts[0], slugB: parts[1], slugC: parts[2] }
  return null
}

/**
 * Checks if the current slug should redirect to the reverse editorial comparison.
 * Returns the reverse slug to redirect to, or null if no redirect needed.
 * Skips 3-way comparisons.
 */
async function getEditorialRedirect(slug: string, parsed: { slugA: string; slugB: string; slugC?: string }): Promise<string | null> {
  if (parsed.slugC) return null
  const reverseSlug = `${parsed.slugB}-vs-${parsed.slugA}`
  if (reverseSlug === slug) return null

  const supabase = createClient()
  const { data: editorialVersions } = await supabase
    .from('comparisons')
    .select('slug')
    .in('slug', [slug, reverseSlug])
    .eq('is_active', true)

  const hasCurrentEditorial = editorialVersions?.some(v => v.slug === slug)
  const hasReverseEditorial = editorialVersions?.some(v => v.slug === reverseSlug)

  if (!hasCurrentEditorial && hasReverseEditorial) {
    return reverseSlug
  }
  return null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const parsed = parseCompareSlug(params.slug)
  if (!parsed) return {}

  // Redirect reverse slugs to editorial comparison
  const redirectSlug = await getEditorialRedirect(params.slug, parsed)
  if (redirectSlug) {
    return {
      alternates: { canonical: 'https://theaiagentindex.com/compare/' + redirectSlug },
    }
  }

  const supabase = createClient()
  const [{ data: a }, { data: b }, { data: comp }] = await Promise.all([
    supabase.from('agents').select('name').eq('slug', parsed.slugA).single(),
    supabase.from('agents').select('name').eq('slug', parsed.slugB).single(),
    supabase.from('comparisons').select('verdict, meta_title, meta_description').eq('slug', params.slug).single(),
  ])
  if (!a || !b) return {}
  const year = new Date().getFullYear()
  const twoWay = (suffix: string) => `${a.name} vs ${b.name}${suffix}`
  const threeWay = (suffix: string) => `${a.name} vs ${b.name} vs ${parsed.slugC}${suffix}`

  let defaultTitle: string
  if (parsed.slugC) {
    defaultTitle = [
      threeWay(` (${year}): Which is Best?`),
      threeWay(` (${year})`),
      threeWay(''),
    ].find(t => t.length <= 60) ?? threeWay('')
  } else {
    defaultTitle = [
      twoWay(` (${year}): Which is Better?`),
      twoWay(` (${year})`),
      twoWay(''),
    ].find(t => t.length <= 60) ?? twoWay('')
  }

  // The fallback description is built from the verdict's first sentence. Templates
  // are NOT resolved here, so a {{slug.starting_price}} in sentence one would leak
  // literal braces into the meta tag. Strip any placeholder rather than publish it.
  const rawOpener = comp?.verdict ? comp.verdict.split('.')[0] + '.' : null
  const verdictOpener = rawOpener && !PRICE_VAR_REGEX.test(rawOpener) ? rawOpener : null
  PRICE_VAR_REGEX.lastIndex = 0 // regex is /g and stateful; reset after .test()

  const defaultDescription = verdictOpener
    ? `${verdictOpener} Independent comparison: pricing, capabilities and editorial verdict. Not affiliated.`
    : `Independent side-by-side comparison of ${a.name} vs ${b.name}: pricing, capabilities, and editorial verdict. Not affiliated. Updated ${year}.`
  const title = comp?.meta_title ?? defaultTitle
  const description = comp?.meta_description ?? defaultDescription
  return {
    title: { absolute: title },
    description,
    openGraph: { title, description, url: 'https://theaiagentindex.com/compare/' + params.slug, type: 'website', siteName: 'The AI Agent Index' },
    twitter: { card: 'summary' },
    alternates: { canonical: 'https://theaiagentindex.com/compare/' + params.slug },
  }
}

function renderBadge(value: string, color: 'green' | 'amber' | 'red' | 'blue' | 'gray') {
  const colors = {
    green: { bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0' },
    amber: { bg: '#FFFBEB', text: '#92400E', border: '#FDE68A' },
    red: { bg: '#FEF2F2', text: '#991B1B', border: '#FECACA' },
    blue: { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE' },
    gray: { bg: '#F3F4F6', text: '#374151', border: '#E5E7EB' },
  }
  const c = colors[color]
  return (
    <span style={{
      display: 'inline-block',
      padding: '0.2rem 0.625rem',
      backgroundColor: c.bg,
      color: c.text,
      border: '1px solid ' + c.border,
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: 600,
      textTransform: 'capitalize',
    }}>
      {value}
    </span>
  )
}

function getPricingTransparencyColor(val: string): 'green' | 'amber' | 'red' | 'gray' {
  if (val === 'public') return 'green'
  // mostly-public is the common Free/Pro/Team + Enterprise-custom pattern.
  // Without this case it fell through to gray, which read as "unknown".
  if (val === 'mostly-public') return 'green'
  if (val === 'partial') return 'amber'
  if (val === 'quote-only' || val === 'not-public') return 'red'
  return 'gray'
}

/** MCP label from the four-value mcp_status, falling back to the legacy boolean. */
function mcpLabel(ag: any): string {
  if (ag.mcp_status === 'server') return 'Server'
  if (ag.mcp_status === 'both') return 'Server + client'
  if (ag.mcp_status === 'client') return 'Client'
  if (ag.mcp_status === 'none') return 'No'
  return ag.mcp_compatible === true ? 'Yes' : ag.mcp_compatible === false ? 'No' : '—'
}

export default async function ComparePage({ params }: Props) {
  const parsed = parseCompareSlug(params.slug)
  if (!parsed) notFound()

  // Redirect reverse slugs to editorial comparison when one exists
  const redirectSlug = await getEditorialRedirect(params.slug, parsed)
  if (redirectSlug) {
    redirect(`/compare/${redirectSlug}`)
  }

  const supabase = createClient()
  const isThreeWay = !!parsed.slugC

  const [{ data: a }, { data: b }, cResult, { data: comparison }] = await Promise.all([
    supabase.from('agents').select('*').eq('slug', parsed.slugA).eq('is_active', true).single(),
    supabase.from('agents').select('*').eq('slug', parsed.slugB).eq('is_active', true).single(),
    parsed.slugC
      ? supabase.from('agents').select('*').eq('slug', parsed.slugC).eq('is_active', true).single()
      : Promise.resolve({ data: null }),
      supabase.from('comparisons').select('verdict, verdict_3way, best_for_a, best_for_b, best_for_c, created_at, updated_at').eq('slug', params.slug).single(),
  ])

  if (!a || !b) notFound()
  const c = cResult?.data ?? null

  const agentSlugs = [parsed.slugA, parsed.slugB, ...(parsed.slugC ? [parsed.slugC] : [])]
  const agentNames = [a.name, b.name, ...(c ? [c.name] : [])]

  const [{ data: altPages }, { data: relatedA }, { data: relatedB }] = await Promise.all([
    supabase.from('alternatives').select('slug, agent_slug').in('agent_slug', agentSlugs).eq('is_active', true),
    supabase.from('comparisons').select('slug, agent_a, agent_b, agent_c').eq('is_active', true).neq('slug', params.slug).in('agent_a', agentNames).limit(4),
    supabase.from('comparisons').select('slug, agent_a, agent_b, agent_c').eq('is_active', true).neq('slug', params.slug).in('agent_b', agentNames).limit(4),
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
    .map(r => ({
      slug: r.slug,
      label: r.agent_c
        ? `${r.agent_a} vs ${r.agent_b} vs ${r.agent_c}`
        : `${r.agent_a} vs ${r.agent_b}`,
    }))

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://theaiagentindex.com'
    const year = new Date().getFullYear()
  
    // Dates come from the DB, never new Date() at render. Computing dateModified as
    // new Date() told Google the page changed today, every day. The comparison row is
    // the primary source; fall back to the agent rows for compare pages that have no
    // editorial comparison row. Formatted in America/Toronto to match the guides.
    const toISODate = (ts: string | null | undefined): string | null =>
      ts ? new Date(ts).toLocaleDateString('en-CA', { timeZone: 'America/Toronto' }) : null
    const agentCreatedDates = [a, b, ...(c ? [c] : [])].map((ag) => ag.created_at).filter(Boolean).sort()
    const agentUpdatedDates = [a, b, ...(c ? [c] : [])].map((ag) => ag.updated_at).filter(Boolean).sort()
    const publishedSource = comparison?.created_at ?? agentCreatedDates[0] ?? null
    const modifiedSource = comparison?.updated_at ?? agentUpdatedDates[agentUpdatedDates.length - 1] ?? null
    const datePublished = toISODate(publishedSource)
    const dateModified = toISODate(modifiedSource)

  const agents = isThreeWay && c ? [a, b, c] : [a, b]
  const bestFors = [comparison?.best_for_a, comparison?.best_for_b, comparison?.best_for_c]
  const title = isThreeWay && c
    ? `${a.name} vs ${b.name} vs ${c.name}`
    : `${a.name} vs ${b.name}`

  const activeVerdict = isThreeWay
    ? (comparison?.verdict_3way ?? comparison?.verdict)
    : comparison?.verdict

  // Resolve templates before ANY rendering, including JSON-LD.
  // activeVerdict and bestFors go INTO the resolver. resolvedVerdict and
  // resolvedBestFors come OUT, and are the only ones that ever reach the page.
  const resolve = await buildResolver(supabase, agents, [
    activeVerdict ?? '',
    ...bestFors.map(bf => bf ?? ''),
  ])
  const resolvedPros = agents.map(ag => (ag.pros ?? []).map((p: string) => resolve(p, ag)))
  const resolvedLimitations = agents.map(ag => (ag.limitations ?? []).map((l: string) => resolve(l, ag)))
  const resolvedVerdict = activeVerdict ? resolve(activeVerdict, a) : null
  const resolvedBestFors = bestFors.map((bf, i) => (bf ? resolve(bf, agents[i] ?? a) : bf))

  const priceFaqText = agents.map(ag => priceSentence(ag)).join(' ')

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title + ': Which AI Agent is Right for You? (' + year + ')',
    description: 'Side-by-side comparison of ' + title + ' across pricing, capabilities, integrations, and deployment.',
    url: siteUrl + '/compare/' + params.slug,
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    publisher: { '@type': 'Organization', name: 'The AI Agent Index', url: siteUrl },
  }

  // Never emit an FAQ entry with an empty answer. An empty acceptedAnswer in
  // structured data is worse than omitting the block entirely.
  const faqEntries = [
    resolvedVerdict
      ? {
          '@type': 'Question',
          name: 'What is the difference between ' + title + '?',
          acceptedAnswer: { '@type': 'Answer', text: resolvedVerdict },
        }
      : null,
    resolvedBestFors.some(Boolean)
      ? {
          '@type': 'Question',
          name: 'Which is best for my team: ' + title + '?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: agents
              .map((ag, i) => (resolvedBestFors[i] ? ag.name + ' is best for: ' + resolvedBestFors[i] : null))
              .filter(Boolean)
              .join(' '),
          },
        }
      : null,
    {
      '@type': 'Question',
      name: 'How does pricing compare between ' + title + '?',
      acceptedAnswer: { '@type': 'Answer', text: priceFaqText },
    },
  ].filter(Boolean)

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqEntries,
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
    { label: 'Pricing model', vals: agents.map(ag => ag.pricing_model ?? '—'), format: 'capitalize' },
    { label: 'Starting price', vals: agents.map(ag => ag.slug), format: 'price' },
    { label: 'Pricing transparency', vals: agents.map(ag => ag.pricing_transparency ?? '—'), format: 'badge-pricing' },
    { label: 'Contract type', vals: agents.map(ag => ag.contract_type ?? '—'), format: 'badge-gray' },
    { label: 'Customer segment', vals: agents.map(ag => ag.customer_segment?.toUpperCase() ?? '—'), format: 'text' },
    { label: 'Deployment', vals: agents.map(ag => ag.deployment_method?.join(', ') ?? '—'), format: 'text' },
    { label: 'Setup difficulty', vals: agents.map(ag => ag.deployment_difficulty ?? '—'), format: 'badge-difficulty' },
    { label: 'Avg setup time', vals: agents.map(ag => ag.avg_setup_time ?? '—'), format: 'text' },
    { label: 'Editorial rating', vals: agents.map(ag => ag.editorial_rating ? Number(ag.editorial_rating).toFixed(1) + ' / 5' : '—'), format: 'text' },
    { label: 'G2 rating', vals: agents.map(ag => ag.g2_rating ? ag.g2_rating + '/5' + (ag.g2_review_count ? ' (' + ag.g2_review_count.toLocaleString() + ' reviews)' : '') : 'No G2 listing'), format: 'text' },
    { label: 'MCP', vals: agents.map(ag => mcpLabel(ag)), format: 'badge-mcp' },
    { label: 'GitHub stars', vals: agents.map(ag => ag.github_stars ? formatStars(ag.github_stars) : 'N/A'), format: 'text' },
    { label: 'Data training', vals: agents.map(ag => ag.data_training ?? '—'), format: 'badge-training' },
    { label: 'Human in loop', vals: agents.map(ag => ag.human_in_loop ?? '—'), format: 'badge-gray' },
    { label: 'Security certs', vals: agents.map(ag => (ag.security_certifications && ag.security_certifications.length > 0) ? ag.security_certifications.join(', ') : 'None confirmed'), format: 'text' },
  ]

  function renderFieldValue(val: string, format: string, colIndex: number) {
    if (format === 'price') {
      const ag = agents[colIndex]
      const primary = priceCellPrimary(ag)
      const qualifier = priceCellQualifier(ag)
      if (primary === 'Contact sales') {
        return <span style={{ color: '#9CA3AF' }}>Contact sales</span>
      }
      return (
        <span>
          <span style={{ fontWeight: 700 }}>{primary}</span>
          {qualifier && (
            <span style={{ display: 'block', fontSize: '0.6875rem', color: '#6B7280', fontWeight: 400, marginTop: '0.1rem' }}>
              {qualifier}
            </span>
          )}
        </span>
      )
    }
    if (val === '—' || val === 'N/A' || val === 'No G2 listing' || val === 'None confirmed') {
      return <span style={{ color: '#9CA3AF' }}>{val}</span>
    }
    switch (format) {
      case 'capitalize':
        return <span style={{ textTransform: 'capitalize' }}>{val}</span>
      case 'badge-pricing':
        return renderBadge(val.replace(/-/g, ' '), getPricingTransparencyColor(val))
      case 'badge-difficulty': {
        const color = val === 'easy' ? 'green' : val === 'moderate' ? 'amber' : val === 'complex' ? 'red' : 'gray'
        return renderBadge(val, color as 'green' | 'amber' | 'red' | 'gray')
      }
      case 'badge-mcp': {
        // Exposing a server is the scarce signal. Being a client is common.
        if (val === 'Server' || val === 'Server + client') return renderBadge(val, 'green')
        if (val === 'Client') return renderBadge('Client', 'blue')
        if (val === 'Yes') return renderBadge('Yes', 'green')
        if (val === 'No') return renderBadge('No', 'gray')
        return <span style={{ color: '#9CA3AF' }}>{val}</span>
      }
      case 'badge-training': {
        const color = val === 'no' ? 'green' : val === 'opt-out' ? 'amber' : val === 'yes' ? 'red' : 'gray'
        return renderBadge(val.replace(/-/g, ' '), color as 'green' | 'amber' | 'red' | 'gray')
      }
      case 'badge-gray':
        return renderBadge(val.replace(/-/g, ' '), 'gray')
      default:
        return val
    }
  }

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
        {isThreeWay ? 'Three-way comparison of ' : 'Side-by-side comparison of '}{title}: pricing, capabilities, integrations, deployment complexity, and ratings.{modifiedSource ? ' Last updated ' + new Date(modifiedSource).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'America/Toronto' }) + '.' : ''}
        </p>
        <p style={{ fontSize: '0.8125rem', color: '#9CA3AF', marginBottom: '2rem' }}>
          Data sourced from The AI Agent Index
        </p>

        {resolvedVerdict && (
          <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '0.875rem', padding: '1.5rem', marginBottom: '2.5rem' }}>
            <div style={{ marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#1D4ED8', backgroundColor: '#DBEAFE', padding: '0.2rem 0.5rem', borderRadius: '0.25rem' }}>
                {isThreeWay ? 'Three-Way Editorial Verdict' : 'Editorial Verdict'}
              </span>
            </div>
            <p style={{ fontSize: '1rem', color: '#1E3A5F', lineHeight: 1.7, margin: 0, fontWeight: 500, whiteSpace: 'pre-line' }}>{resolvedVerdict}</p>
          </div>
        )}

        {/* Agent cards */}
        <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: '1rem', marginBottom: '2.5rem' }}>
          {agents.map((agent, i) => (
            <div key={agent.slug} style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <AgentLogo name={agent.name} websiteUrl={agent.website_url} faviconDomain={agent.favicon_domain} logoUrl={agent.logo_url} size="md" />
                <div>
                  <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#111827', marginBottom: '0.125rem' }}>{agent.name}</h2>
                  <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>by {agent.developer}</p>
                </div>
              </div>
              <p style={{ fontSize: '0.8125rem', color: '#4B5563', lineHeight: 1.6, marginBottom: '0.875rem' }}>{agent.short_description}</p>
              {resolvedBestFors[i] && (
                <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '0.5rem', padding: '0.625rem 0.875rem', marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#15803D', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Best for</p>
                  <p style={{ fontSize: '0.75rem', color: '#166534', lineHeight: 1.5, margin: 0 }}>{resolvedBestFors[i]}</p>
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

        {/* Feature comparison table */}
        <div style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', overflow: 'hidden', marginBottom: '2.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: gridCols, backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
            {agents.map(ag => (
              <div key={ag.slug} style={{ padding: '0.875rem 1rem', textAlign: 'center', fontSize: '0.8125rem', fontWeight: 700, color: '#111827' }}>
                {ag.name}
              </div>
            ))}
          </div>
          {FIELD_ROWS.map((row, i) => (
            <div key={row.label} style={{ borderBottom: i < FIELD_ROWS.length - 1 ? '1px solid #F3F4F6' : 'none', backgroundColor: i % 2 === 0 ? 'white' : '#FAFAFA' }}>
              <div style={{ padding: '0.75rem 1rem 0.25rem', fontSize: '0.6875rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center' }}>
                {row.label}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: gridCols }}>
                {row.vals.map((val, j) => (
                  <div key={j} style={{ padding: '0.25rem 1rem 0.875rem', fontSize: '0.875rem', color: '#111827', fontWeight: 500, lineHeight: 1.5, textAlign: 'center' }}>
                    {renderFieldValue(val, row.format, j)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Capabilities */}
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

        {/* Pros & Limitations */}
        <div style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.125rem', color: '#111827', margin: 0 }}>Pros &amp; Limitations</h2>
            <span style={{ fontSize: '0.6875rem', color: '#9CA3AF', backgroundColor: '#F3F4F6', padding: '0.2rem 0.5rem', borderRadius: '0.25rem' }}>Editorial assessment</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: '1.5rem' }}>
            {agents.map((agent, i) => (
              <div key={agent.slug}>
                <h3 style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#111827', marginBottom: '1rem' }}>{agent.name}</h3>
                {resolvedPros[i].length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Pros</p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {resolvedPros[i].map((pro: string) => (
                        <li key={pro} style={{ fontSize: '0.8125rem', color: '#374151', display: 'flex', gap: '0.5rem', lineHeight: 1.5 }}>
                          <span style={{ color: '#16A34A', flexShrink: 0 }}>✓</span><span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {resolvedLimitations[i].length > 0 && (
                  <div>
                    <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Limitations</p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {resolvedLimitations[i].map((lim: string) => (
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

        {/* FAQs */}
        <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2.5rem', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '1.5rem' }}>Frequently asked questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {resolvedVerdict && (
              <div style={{ backgroundColor: '#F9FAFB', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1.25rem' }}>
                <h3 style={{ fontWeight: 600, color: '#111827', marginBottom: '0.5rem', fontSize: '1rem' }}>
                  What is the difference between {title}?
                </h3>
                <p style={{ color: '#4B5563', fontSize: '0.9375rem', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>{resolvedVerdict}</p>
              </div>
            )}
            {resolvedBestFors.some(Boolean) && (
              <div style={{ backgroundColor: '#F9FAFB', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1.25rem' }}>
                <h3 style={{ fontWeight: 600, color: '#111827', marginBottom: '0.5rem', fontSize: '1rem' }}>
                  Which is best for my team: {title}?
                </h3>
                <p style={{ color: '#4B5563', fontSize: '0.9375rem', lineHeight: 1.7, margin: 0 }}>
                  {agents.map((ag, i) => resolvedBestFors[i] ? `${ag.name} is best for: ${resolvedBestFors[i]}.` : '').filter(Boolean).join(' ')}
                </p>
              </div>
            )}
            <div style={{ backgroundColor: '#F9FAFB', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1.25rem' }}>
              <h3 style={{ fontWeight: 600, color: '#111827', marginBottom: '0.5rem', fontSize: '1rem' }}>
                How does pricing compare between {title}?
              </h3>
              <p style={{ color: '#4B5563', fontSize: '0.9375rem', lineHeight: 1.7, margin: 0 }}>
                {priceFaqText}
              </p>
            </div>
          </div>
        </div>

        {/* Full profile links */}
        <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: '1rem', marginBottom: '2rem' }}>
          {agents.map(agent => (
            <Link key={agent.slug} href={'/agents/' + agent.slug}
              style={{ display: 'block', backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.25rem', textDecoration: 'none', textAlign: 'center' }}>
              <p style={{ fontWeight: 600, color: '#111827', marginBottom: '0.25rem' }}>View full {agent.name} profile</p>
              <p style={{ fontSize: '0.8125rem', color: '#2563EB', margin: 0 }}>Pricing, reviews, integrations →</p>
            </Link>
          ))}
        </div>

        {/* Alternatives links */}
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

        {/* Related comparisons */}
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
        <NewsletterSignup sourcePage={'/compare/' + params.slug} sourceType="comparison" />
        </div>

      </div>
    </>
  )
}