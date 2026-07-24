import { createClient } from '@/lib/supabase'
import { headers } from 'next/headers'
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import AgentPageClient from '@/components/AgentPageClient'
import { getEligibleBadges } from '@/lib/badges'
import AgentListingBanner from '@/components/AgentListingBanner'
import ComparisonPlacement from '@/components/ComparisonPlacement'
import NewsletterSignup from '@/components/NewsletterSignup'
import { displayRating } from '@/lib/rating'

interface Props {
  params: { slug: string }
}

// ============================================================
// Similar Agents Algorithm — Tuning Knobs
// ============================================================
const AGENT_TYPE_WEIGHT = 50
const IDF_SCALE = 6
const SAME_CATEGORY_WEIGHT = 8
const SIMILAR_AGENTS_LIMIT = 3



export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient()
  const { data: agent } = await supabase
    .from('agents')
    .select('name, short_description, developer, primary_category, pricing_model, starting_price, meta_title, meta_description, updated_at')
    .eq('slug', params.slug)
    .single()
  if (!agent) return {}

  const url = 'https://theaiagentindex.com/agents/' + params.slug
  const monthYear = agent.updated_at
    ? new Date(agent.updated_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'America/Toronto' })
    : new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'America/Toronto' })

  const pricingStr = agent.starting_price != null && agent.starting_price > 0
    ? `from $${agent.starting_price}/mo`
    : agent.pricing_model === 'free'
    ? 'free'
    : agent.pricing_model === 'freemium'
    ? 'freemium'
    : null

    const title = agent.meta_title
    ?? `${agent.name} Review (2026): Pricing, Pros and Alternatives | The AI Agent Index`

  const description = agent.meta_description
    ?? (pricingStr
      ? `Independent ${agent.name} review: ${pricingStr}, verified pros and limitations, and how it compares to top alternatives. Not affiliated. Updated ${monthYear}.`
      : `Independent ${agent.name} review: verified pricing, pros, limitations, and how it compares to top alternatives. Not affiliated. Updated ${monthYear}.`)

  return {
    title,
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

export default async function AgentPage({ params }: Props) {
  headers()
  const supabase = createClient()
  const { data: agent } = await supabase.from('agents').select('*').eq('slug', params.slug).eq('is_active', true).single()
  if (!agent) notFound()

  const { data: reviews } = await supabase
    .from('reviews')
    .select('id, rating, comment, reviewer_name, created_at, updated_at')
    .eq('agent_id', agent.id)
    .eq('is_approved', true)
    .order('updated_at', { ascending: false })

  // Pull all active agents (except current) for similar-agent scoring.
  // At ~5K listings this should move to a Supabase RPC for performance.
  const { data: candidatePool } = await supabase
    .from('agents')
    .select('id, name, slug, short_description, rating_avg, capability_tags, primary_category, agent_type')
    .eq('is_active', true)
    .neq('slug', params.slug)

  const pool = candidatePool ?? []
  const currentTags: string[] = agent.capability_tags ?? []
  const currentType: string | null = agent.agent_type ?? null

  // ----- IDF computation -----
  const tagDocFrequency = new Map<string, number>()
  const allDocs = [agent, ...pool]
  for (const doc of allDocs) {
    const tags: string[] = doc.capability_tags ?? []
    const uniqueTags = new Set(tags)
    uniqueTags.forEach((t) => {
      tagDocFrequency.set(t, (tagDocFrequency.get(t) ?? 0) + 1)
    })
  }

  const totalDocs = allDocs.length
  const idfWeight = (tag: string): number => {
    const df = tagDocFrequency.get(tag) ?? 0
    return Math.log((totalDocs + 1) / (df + 1)) + 1
  }

  // ----- Score each candidate -----
  const currentTagSet = new Set(currentTags)

  const scoredCandidates = pool.map((c) => {
    const candidateTags: string[] = c.capability_tags ?? []
    const sharedTags = candidateTags.filter((t) => currentTagSet.has(t))
    const tagScore = sharedTags.reduce((sum, t) => sum + idfWeight(t), 0) * IDF_SCALE

    const sameType = (currentType !== null && c.agent_type === currentType) ? 1 : 0
    const typeScore = sameType * AGENT_TYPE_WEIGHT

    const sameCategory = c.primary_category === agent.primary_category ? 1 : 0
    const categoryScore = sameCategory * SAME_CATEGORY_WEIGHT

    const score = typeScore + tagScore + categoryScore + (c.rating_avg ?? 0)
    return {
      ...c,
      _score: score,
      _sharedTagCount: sharedTags.length,
      _sameType: sameType,
    }
  })

  const similarAgents = scoredCandidates
    .filter((c) => c._sameType > 0 || c._sharedTagCount > 0 || c.primary_category === agent.primary_category)
    .sort((a, b) => b._score - a._score)
    .slice(0, SIMILAR_AGENTS_LIMIT)
    .map(({ id, name, slug, short_description, rating_avg, capability_tags }) => ({
      id, name, slug, short_description, rating_avg, capability_tags
    }))

  // ----- Agent name map for internal linking -----
  // Built from the already-fetched candidatePool — no extra query needed.
  // Only include names with 4+ characters to avoid false positives on
  // short common words (e.g. "Clay", "Fin", "Ada").
  const agentNameMap: Record<string, string> = {}
  for (const c of pool) {
    if (c.name && c.name.length >= 4) {
      agentNameMap[c.name] = c.slug
    }
  }

  // ----- Price map for {{slug.starting_price}} template variables -----
  const textToScan = [
    agent.long_description ?? '',
    ...(agent.pros ?? []),
    ...(agent.limitations ?? []),
    agent.short_description ?? '',
  ].join(' ')
  const priceVarMatches = textToScan.match(/\{\{([a-z0-9-]+)\.starting_price\}\}/g) ?? []
  const priceSlugs = [...new Set(priceVarMatches.map((m: string) => m.replace('{{', '').replace('.starting_price}}', '')))]
  let priceMap: Record<string, { starting_price: number | null; pricing_model: string | null; billing_period: string | null; price_unit: string | null }> = {}
  if (priceSlugs.length > 0) {
    const { data: priceAgents } = await supabase
      .from('agents')
      .select('slug, starting_price, pricing_model, billing_period, price_unit')
      .in('slug', priceSlugs)
    if (priceAgents) {
      for (const pa of priceAgents) {
        priceMap[pa.slug] = { starting_price: pa.starting_price, pricing_model: pa.pricing_model, billing_period: pa.billing_period ?? null, price_unit: pa.price_unit ?? null }
      }
    }
  }

 // ----- Affiliate detection -----
 // Source of truth is the is_affiliate column (backfilled for the affiliate cohort),
 // not runtime host-inference, which wrongly flagged legit subdomains
 // (e.g. oz.anyreach.ai vs favicon_domain anyreach.ai) as affiliate.
 const isAffiliate = agent.is_affiliate ?? false
  // ----- Related content queries -----
  // 1. This agent's own alternatives page (if one exists)
  const { data: ownAlternatives } = await supabase
    .from('alternatives')
    .select('slug, title')
    .eq('agent_slug', params.slug)
    .eq('is_active', true)
    .maybeSingle()

  // 2. Guides that belong to this agent's category
  const { data: relatedGuides } = await supabase
    .from('guides')
    .select('slug, title')
    .eq('primary_category', agent.primary_category)
    .eq('is_active', true)
    .order('title')

 // ----- JSON-LD -----
 // Suppression + display value come from the shared helper (same as every other surface).
 // editorialForLd is null exactly when the agent is On Our Radar, so guarding on it also
 // guarantees we never emit an editorial rating for a suppressed agent.
 const editorialForLd = displayRating(agent)
 const additionalProperties: Array<{ '@type': string; name: string; value: string | number }> = []
  if (agent.agent_type) {
    additionalProperties.push({ '@type': 'PropertyValue', name: 'agentType', value: agent.agent_type })
  }
  if (editorialForLd != null) {
    additionalProperties.push({ '@type': 'PropertyValue', name: 'editorialRating', value: editorialForLd })
  }
  if (agent.pricing_model) {
    additionalProperties.push({ '@type': 'PropertyValue', name: 'pricingModel', value: agent.pricing_model })
  }
  if (agent.deployment_method && Array.isArray(agent.deployment_method) && agent.deployment_method.length > 0) {
    additionalProperties.push({ '@type': 'PropertyValue', name: 'deploymentMethod', value: agent.deployment_method.join(', ') })
  }
  if (agent.autonomous_rate) {
    additionalProperties.push({ '@type': 'PropertyValue', name: 'autonomousRate', value: agent.autonomous_rate })
  }
  if (agent.pricing_transparency) {
    additionalProperties.push({ '@type': 'PropertyValue', name: 'pricingTransparency', value: agent.pricing_transparency })
  }
  if (agent.contract_type) {
    additionalProperties.push({ '@type': 'PropertyValue', name: 'contractType', value: agent.contract_type })
  }
  if (agent.data_training) {
    additionalProperties.push({ '@type': 'PropertyValue', name: 'dataTraining', value: agent.data_training })
  }
  if (agent.human_in_loop) {
    additionalProperties.push({ '@type': 'PropertyValue', name: 'humanInLoop', value: agent.human_in_loop })
  }
  if (agent.mcp_status) {
    additionalProperties.push({ '@type': 'PropertyValue', name: 'mcpRole', value: agent.mcp_status })
  }

  // ----- Offers: only with an honest price -----
  const hasNumericPrice = typeof agent.starting_price === 'number' && agent.starting_price > 0

  // priceSpecification, built honestly per billing model:
  //   annual  -> recurring monthly rate, annual commitment (P1Y)
  //   monthly -> recurring month-to-month rate (P1M)
  //   null    -> unclassified; treated as month-to-month (unchanged behavior)
  //   usage   -> per-unit price (e.g. per minute / per resolution). NOT a recurring
  //              monthly charge, so take the unit from price_unit and OMIT
  //              billingDuration/billingIncrement, which only apply to subscriptions.
  const priceSpecification = agent.billing_period === 'usage'
    ? {
        '@type': 'UnitPriceSpecification',
        price: String(agent.starting_price),
        priceCurrency: 'USD',
        unitText: agent.price_unit ?? 'per unit',
      }
    : {
        '@type': 'UnitPriceSpecification',
        price: String(agent.starting_price),
        priceCurrency: 'USD',
        billingDuration: agent.billing_period === 'annual' ? 'P1Y' : 'P1M',
        billingIncrement: 1,
        unitText: agent.billing_period === 'annual'
          ? 'per month, annual commitment'
          : 'per month, month-to-month',
      }

  const offers = hasNumericPrice
    ? {
        '@type': 'Offer',
        price: String(agent.starting_price),
        priceCurrency: 'USD',
        priceSpecification,
      }
    : agent.pricing_model === 'free'
    ? { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
    : undefined

  // ----- Reviews -----
  const userReviews = (reviews ?? []).map((r) => ({
    '@type': 'Review',
    author: { '@type': 'Person', name: r.reviewer_name },
    reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5, worstRating: 1 },
    reviewBody: r.comment ?? '',
    datePublished: r.created_at,
    dateModified: r.updated_at ?? r.created_at,
  }))

  const editorialReview = (editorialForLd != null)
    ? {
        '@type': 'Review',
        author: { '@type': 'Organization', name: 'The AI Agent Index' },
        reviewRating: { '@type': 'Rating', ratingValue: editorialForLd, bestRating: 5, worstRating: 1 },
        reviewBody: agent.short_description ?? undefined,
        datePublished: agent.created_at ?? undefined,
        dateModified: agent.updated_at ?? agent.created_at ?? undefined,
      }
    : null

  const allReviews = editorialReview ? [editorialReview, ...userReviews] : userReviews

  // aggregateRating represents USER reviews only (Google requires it be user-sourced). Our
  // editorial score lives separately in editorialReview above and is NEVER folded in here.
  const communityCount = agent.rating_count > 0 ? agent.rating_count : userReviews.length
  const communityAvg = agent.rating_avg > 0
    ? agent.rating_avg
    : (userReviews.length > 0
        ? Math.round((userReviews.reduce((s, r) => s + (r.reviewRating?.ratingValue ?? 0), 0) / userReviews.length) * 10) / 10
        : 0)
  const aggregateRating = communityCount > 0 && communityAvg > 0
    ? {
        '@type': 'AggregateRating',
        ratingValue: communityAvg,
        reviewCount: communityCount,
        bestRating: 5,
        worstRating: 1,
      }
    : undefined

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: agent.name,
    description: agent.short_description,
    applicationCategory: agent.primary_category,
    operatingSystem: 'Web',
    datePublished: agent.created_at ?? undefined,
    dateModified: agent.updated_at ?? agent.created_at ?? undefined,
    offers,
    url: agent.website_url ?? '',
    author: { '@type': 'Organization', name: agent.developer },
    sameAs: agent.same_as_urls?.length ? agent.same_as_urls : undefined,
    additionalProperty: additionalProperties.length > 0 ? additionalProperties : undefined,
    aggregateRating,
    review: allReviews.length > 0 ? allReviews : undefined,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '1.5rem 1.5rem 0' }}>
        <AgentListingBanner categorySlug={agent.primary_category} currentAgentSlug={params.slug} />
      </div>
      <AgentPageClient
        agent={agent}
        earnedBadges={(await getEligibleBadges(agent)).map(b => ({ type: b.type, label: b.label }))}
        initialReviews={reviews ?? []}
        similarAgents={similarAgents ?? []}
        relatedContent={{
          ownAlternatives: ownAlternatives ?? null,
          guides: relatedGuides ?? [],
        }}
        agentNameMap={agentNameMap}
        priceMap={priceMap}
        isAffiliate={isAffiliate}
      />
      <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 1.5rem 2rem' }}>
        <ComparisonPlacement categorySlug={agent.primary_category} currentAgentSlug={params.slug} />
      </div>
      <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 1.5rem 3rem' }}>
        <NewsletterSignup sourcePage={'/agents/' + params.slug} sourceType="agent" />
      </div>
    </>
  )
}