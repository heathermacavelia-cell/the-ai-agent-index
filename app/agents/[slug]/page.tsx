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
// Score = sum of IDF weights for shared capability_tags
//       + (same primary_category × SAME_CATEGORY_WEIGHT)
//       + rating_avg (acts as natural tiebreaker, 0-5 range)
//
// IDF (Inverse Document Frequency) automatically weights rare
// tags higher than common ones. A tag shared by 3 agents counts
// for much more than a tag shared by 30 agents — because rare
// shared tags signal real competitive overlap, while common
// tags (like crm-sync) are nearly universal and signal little.
//
// IDF formula: ln((N + 1) / (df + 1)) + 1
//   where N = total agents in pool, df = agents using this tag.
//
// IDF_SCALE multiplies the resulting weight to keep it in the
// same order of magnitude as SAME_CATEGORY_WEIGHT and rating.
// Increase IDF_SCALE to make tag overlap dominate; decrease to
// let category and rating carry more weight.
// ============================================================
const IDF_SCALE = 6
const SAME_CATEGORY_WEIGHT = 8
const SIMILAR_AGENTS_LIMIT = 3

const AFFILIATE_META: Record<string, { title: string; description: string }> = {
  'apollo-io': {
    title: 'Apollo.io Review (2026) — Pricing, Features & Alternatives',
    description: 'Comprehensive Apollo.io profile covering pricing, features, integrations, pros and limitations. Compare Apollo.io with top alternatives for B2B prospecting and outbound sales.',
  },
  'instantly-ai': {
    title: 'Instantly.ai Review (2026) — Pricing, Features & Alternatives',
    description: 'Comprehensive Instantly.ai profile covering pricing, features, integrations, pros and limitations. Compare Instantly.ai with top alternatives for cold email and outbound automation.',
  },
  'instantly-ai-sales-agent': {
    title: 'Instantly AI Sales Agent Review (2026) — Pricing & Features',
    description: 'Full profile of the Instantly AI Sales Agent — pricing, capabilities, integrations, and how it compares to other AI sales agents for autonomous outbound.',
  },
  'lemlist': {
    title: 'Lemlist Review (2026) — Pricing, Features & Alternatives',
    description: 'Comprehensive Lemlist profile covering pricing, features, integrations, pros and limitations. Compare Lemlist with top alternatives for multichannel outreach and cold email.',
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

  // Build a pricing string for the default description
  const pricingStr = agent.starting_price != null && agent.starting_price > 0
    ? `from $${agent.starting_price}/mo`
    : agent.pricing_model === 'free'
    ? 'free'
    : agent.pricing_model === 'freemium'
    ? 'freemium'
    : null

  // Three-tier fallback: affiliate override → custom DB field → smart template
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
    .select('id, name, slug, short_description, rating_avg, capability_tags, primary_category')
    .eq('is_active', true)
    .neq('slug', params.slug)

  const pool = candidatePool ?? []
  const currentTags: string[] = agent.capability_tags ?? []

  // ----- IDF computation -----
  // Build document-frequency map: how many agents use each tag.
  // The "corpus" here is the candidate pool plus the current agent,
  // so IDF reflects the full active catalog.
  const tagDocFrequency = new Map<string, number>()
  const allDocs = [agent, ...pool]
  for (const doc of allDocs) {
    const tags: string[] = doc.capability_tags ?? []
    // Use a Set so duplicate tags within one listing don't double-count
    const uniqueTags = new Set(tags)
    uniqueTags.forEach((t) => {
      tagDocFrequency.set(t, (tagDocFrequency.get(t) ?? 0) + 1)
    })
  }

  const totalDocs = allDocs.length
  // IDF formula: ln((N + 1) / (df + 1)) + 1
  // The +1 smoothing prevents division by zero and dampens extremes.
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
    const sameCategory = c.primary_category === agent.primary_category ? 1 : 0
    const score = tagScore + (sameCategory * SAME_CATEGORY_WEIGHT) + (c.rating_avg ?? 0)
    return {
      ...c,
      _score: score,
      _sharedTagCount: sharedTags.length,
    }
  })

  const similarAgents = scoredCandidates
    .filter((c) => c._sharedTagCount > 0 || c.primary_category === agent.primary_category)
    .sort((a, b) => b._score - a._score)
    .slice(0, SIMILAR_AGENTS_LIMIT)
    .map(({ id, name, slug, short_description, rating_avg, capability_tags }) => ({
      id, name, slug, short_description, rating_avg, capability_tags
    }))

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
      <AgentPageClient agent={agent} initialReviews={reviews ?? []} similarAgents={similarAgents ?? []} />
    </>
  )
}