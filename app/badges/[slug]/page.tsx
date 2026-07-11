export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase'
import { getEligibleBadges } from '@/lib/badges'
import BadgeEmbeds from '@/components/BadgeEmbeds'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  return {
    title: 'Badges and embed codes',
    robots: { index: false, follow: true },
  }
}

export default async function AgentBadgesPage({ params }: { params: { slug: string } }) {
  const supabase = createClient()
  const { data: agent } = await supabase
    .from('agents')
    .select('slug, name, is_active, primary_category, mcp_status, pricing_transparency, editorial_rating, editorial_rating_notes, rating_avg, rating_count')
    .eq('slug', params.slug)
    .single()

  if (!agent || !agent.is_active) notFound()

  const badges = await getEligibleBadges(agent)
  const serializable = badges.map(b => ({ type: b.type, label: b.label }))

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6B7280', marginBottom: '1.5rem' }}>
        <Link href="/" style={{ color: '#6B7280', textDecoration: 'none' }}>Home</Link>
        <span style={{ color: '#D1D5DB' }}>/</span>
        <Link href={'/agents/' + agent.slug} style={{ color: '#6B7280', textDecoration: 'none' }}>{agent.name}</Link>
        <span style={{ color: '#D1D5DB' }}>/</span>
        <span style={{ color: '#111827' }}>Badges</span>
      </nav>

      <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
        Badges for {agent.name}
      </h1>
      <p style={{ color: '#6B7280', fontSize: '0.9375rem', lineHeight: 1.7, marginBottom: '0.5rem' }}>
        {agent.name} currently qualifies for {badges.length} badge{badges.length === 1 ? '' : 's'}. All badges are free to display and cannot be purchased. Each badge renders live from our database: if eligibility changes, the badge updates or disappears automatically, so what your site shows always matches what our data says.
      </p>
      <p style={{ fontSize: '0.8125rem', color: '#9CA3AF', marginBottom: '2rem' }}>
        <Link href="/badges" style={{ color: '#2563EB', textDecoration: 'none' }}>How badges are earned →</Link>
      </p>

      <BadgeEmbeds slug={agent.slug} name={agent.name} badges={serializable} />
    </div>
  )
}