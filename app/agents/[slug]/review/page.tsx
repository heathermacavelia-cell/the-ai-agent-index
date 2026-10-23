import { createClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import AgentLogo from '@/components/AgentLogo'
import ReviewPageForm from '@/components/ReviewPageForm'

export const dynamic = 'force-dynamic'

// The review form has its own page (2026-10-23), reached from every "Leave a review" link
// on a listing. The agent comes from the URL, so the reviewer never has to pick it.

interface Props {
  params: { slug: string }
}

async function getAgent(slug: string) {
  const supabase = createClient()
  const { data } = await supabase
    .from('agents')
    .select('id, name, slug, developer, logo_url, website_url, favicon_domain')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  return data
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const agent = await getAgent(params.slug)
  if (!agent) return { title: 'Review not found', robots: { index: false, follow: false } }
  return {
    title: `Review ${agent.name}`,
    description: `Share your experience with ${agent.name} on The AI Agent Index.`,
    // A form page has nothing for search engines. The listing is the page that ranks.
    robots: { index: false, follow: true },
    alternates: { canonical: `/agents/${agent.slug}` },
  }
}

export default async function ReviewPage({ params }: Props) {
  const agent = await getAgent(params.slug)
  if (!agent) notFound()

  return (
    <div style={{ backgroundColor: '#F9FAFB', minHeight: '100vh', padding: '2rem 1rem 4rem' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <Link href={'/agents/' + agent.slug} style={{ fontSize: '0.8125rem', color: '#2563EB', textDecoration: 'none' }}>
          &larr; Back to {agent.name}
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.25rem 0 1.5rem' }}>
          <AgentLogo name={agent.name} websiteUrl={agent.website_url} faviconDomain={agent.favicon_domain} logoUrl={agent.logo_url} size="md" />
          <div>
            <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Write a review</p>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: '0.125rem 0 0' }}>{agent.name}</h1>
            {agent.developer && <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: '0.125rem 0 0' }}>by {agent.developer}</p>}
          </div>
        </div>
        <ReviewPageForm agentId={agent.id} agentName={agent.name} agentSlug={agent.slug} />
      </div>
    </div>
  )
}
