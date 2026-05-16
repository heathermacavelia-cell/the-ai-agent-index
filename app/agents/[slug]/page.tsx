import { createClient } from '@/lib/supabase'
import { headers } from 'next/headers'
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import AgentPageClient from '@/components/AgentPageClient'

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

const AFFILIATE_META: Record<string, { title: string; description: string }> = {
  'apollo-io': {
    title: 'Apollo.io Review (2026): Pricing, Pros & Alternatives',
    description: 'Independent Apollo.io review: pricing, features, integrations, pros and limitations. Compare to top B2B prospecting alternatives. Not affiliated.',
  },
  'instantly-ai': {
    title: 'Instantly.ai Review (2026): Pricing, Pros & Alternatives',
    description: 'Independent Instantly.ai review: pricing, features, integrations, pros and limitations. Compare to top cold email alternatives. Not affiliated.',
  },
  'instantly-ai-sales-agent': {
    title: 'Instantly AI Sales Agent Review (2026): Pricing & Pros',
    description: 'Instantly AI Sales Agent: pricing, capabilities, integrations, and how it compares to other AI SDRs. Not affiliated.',
  },
  'lemlist': {
    title: 'Lemlist Review (2026): Pricing, Pros & Alternatives',
    description: 'Independent Lemlist review: pricing, features, integrations, pros and limitations. Compare to top multichannel outreach alternatives. Not affiliated.',
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient()
  const { data: agent } = await supabase
    .from('agents')
    .select('name, short_description, developer, primary_category, pricing_model, starting_price, meta_title, meta_description')
    .eq('slug', params.slug)
    .single()
  if (!agent) return {}

  const url = 'https://theaiagentindex.com/agents/' + params.slug
  const monthYear = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const pricingStr = agent.starting_price != null && agent.starting_price > 0
    ? `from $${agent.starting_price}/mo`
    : agent.pricing_model === 'free'
    ? 'free'
    : agent.pricing_model === 'freemium'
    ? 'freemium'
    : null

  const affiliate = AFFILIATE_META[params.slug]

  const title = affiliate?.title
    ?? agent.meta_title
    ?? `${agent.name} Review (2026) — Pricing, Pros & Alternatives | The AI Agent Index`

  const description = affiliate?.description
    ?? agent.meta_description
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
  const additionalProperties: Array<{ '@type': string; name: string; value: string | number }> = []
  if (agent.agent_type) {
    additionalProperties.push({ '@type': 'PropertyValue', name: 'agentType', value: agent.agent_type })
  }
  if (agent.editorial_rating != null) {
    additionalProperties.push({ '@type': 'PropertyValue', name: 'editorialRating', value: agent.editorial_rating })
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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: agent.name,
    description: agent.short_description,
    applicationCategory: agent.primary_category,
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: agent.starting_price?.toString() ?? '0', priceCurrency: 'USD' },
    url: agent.website_url ?? '',
    author: { '@type': 'Organization', name: agent.developer },
    sameAs: agent.same_as_urls?.length ? agent.same_as_urls : undefined,
    additionalProperty: additionalProperties.length > 0 ? additionalProperties : undefined,
    aggregateRating: (agent.rating_count > 0 || (reviews && reviews.length > 0)) ? {
      '@type': 'AggregateRating',
      ratingValue: agent.rating_avg > 0 ? agent.rating_avg : (agent.editorial_rating ?? 0),
      reviewCount: agent.rating_count > 0 ? agent.rating_count : reviews?.length ?? 1,
      bestRating: 5,
      worstRating: 1
    } : undefined,
    review: reviews?.map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.reviewer_name },
      reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5, worstRating: 1 },
      reviewBody: r.comment ?? '',
      datePublished: r.created_at,
      dateModified: r.updated_at ?? r.created_at,
    })) ?? []
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AgentPageClient
        agent={agent}
        initialReviews={reviews ?? []}
        similarAgents={similarAgents ?? []}
        relatedContent={{
          ownAlternatives: ownAlternatives ?? null,
          guides: relatedGuides ?? [],
        }}
      />
    </>
  )
}