import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { Agent } from '@/types/agent'
import AgentPageClient from '@/components/AgentPageClient'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient()
  const { data: agent } = await supabase.from('agents').select('name, short_description, developer').eq('slug', params.slug).single()
  if (!agent) return {}
  return { title: agent.name + ' -- ' + agent.developer, description: agent.short_description }
}

export default async function AgentPage({ params }: Props) {
  const supabase = createClient()
  const { data: agent } = await supabase.from('agents').select('*').eq('slug', params.slug).eq('is_active', true).single()
  if (!agent) notFound()

  const { data: reviews } = await supabase
    .from('reviews')
    .select('id, rating, comment, reviewer_name, created_at, updated_at')
    .eq('agent_id', agent.id)
    .eq('is_approved', true)
    .order('updated_at', { ascending: false })

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
      <AgentPageClient agent={agent} initialReviews={reviews ?? []} />
    </>
  )
}
