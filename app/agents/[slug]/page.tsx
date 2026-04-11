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
  const { data: agent } = await supabase.from('agents').select('name, short_description, developer, primary_category').eq('slug', params.slug).single()
  if (!agent) return {}
  const url = 'https://theaiagentindex.com/agents/' + params.slug

  const affiliate = AFFILIATE_META[params.slug]
  const title = affiliate?.title ?? `${agent.name} Review (2026) — Features, Pricing & Alternatives | AI Agent Index`
  const description = affiliate?.description ?? `${agent.name} by ${agent.developer}. ${agent.short_description} Compare pricing, features, integrations, and alternatives.`

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

  const { data: similarAgents } = await supabase
    .from('agents')
    .select('id, name, slug, short_description, rating_avg, capability_tags')
    .eq('primary_category', agent.primary_category)
    .eq('is_active', true)
    .neq('slug', params.slug)
    .order('rating_avg', { ascending: false })
    .limit(3)

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
    aggregateRating: agent.rating_count > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: agent.rating_avg,
      reviewCount: agent.rating_count,
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