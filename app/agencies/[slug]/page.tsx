export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { Agency, AgencyReview } from '@/types/agency'
import AgencyPageClient from '@/components/AgencyPageClient'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient()
  const { data } = await supabase.from('agencies').select('name, meta_title, meta_description, slug').eq('slug', params.slug).eq('is_active', true).maybeSingle()
  if (!data) return {}
  const url = 'https://theaiagentindex.com/agencies/' + data.slug
  return {
    title: { absolute: data.meta_title ?? data.name },
    description: data.meta_description ?? '',
    openGraph: { title: data.meta_title ?? data.name, description: data.meta_description ?? '', url, type: 'website', siteName: 'The AI Agent Index' },
    twitter: { card: 'summary', title: data.meta_title ?? data.name, description: data.meta_description ?? '' },
    alternates: { canonical: url },
  }
}

export default async function AgencyPage({ params }: Props) {
  const supabase = createClient()
  const { data: agency } = await supabase
    .from('agencies')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .maybeSingle()

  if (!agency) notFound()

  const { data: reviews } = await supabase
    .from('agency_reviews')
    .select('*')
    .eq('agency_id', agency.id)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: agency.name,
    description: agency.short_description,
    url: agency.website_url,
    ...(agency.headquarters && { address: { '@type': 'PostalAddress', addressLocality: agency.headquarters } }),
    ...(agency.founded_year && { foundingDate: String(agency.founded_year) }),
    ...(agency.rating_count > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: agency.rating_avg,
        reviewCount: agency.rating_count,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AgencyPageClient
        agency={agency as Agency}
        reviews={(reviews ?? []) as AgencyReview[]}
      />
    </>
  )
}