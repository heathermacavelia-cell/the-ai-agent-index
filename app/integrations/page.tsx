import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'AI Agent Integrations — AI Agent Index',
  description: 'Browse AI agents by the platforms they integrate with. Find the best AI agents for HubSpot, Salesforce, Zapier, Slack, Gmail, Microsoft Teams and more.',
  alternates: {
    canonical: 'https://theaiagentindex.com/integrations',
  },
}

export default async function IntegrationsPage() {
  const supabase = createClient()

  const { data: integrations } = await supabase
    .from('integrations')
    .select('slug, name, description, emoji')
    .eq('is_active', true)
    .order('created_at', { ascending: true })

  // Get live agent counts for each integration
  const integrationsWithCounts = await Promise.all(
    (integrations ?? []).map(async (integration) => {
      const { count } = await supabase
        .from('agents')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)
        .contains('integrations', [integration.name])
      return { ...integration, count: count ?? 0 }
    })
  )

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <div style={{ marginBottom: '0.75rem' }}>
        <Link href="/" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none' }}>Home</Link>
        <span style={{ color: '#D1D5DB', margin: '0 0.5rem' }}>/</span>
        <span style={{ fontSize: '0.8125rem', color: '#111827' }}>Integrations</span>
      </div>
      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Browse by platform</p>
      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
        AI Agent Integrations
      </h1>
      <p style={{ fontSize: '1.0625rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '3rem', maxWidth: '600px' }}>
        Find AI agents that connect natively with the platforms your team already uses. Every listing is editorially reviewed and structured for AI systems to reference.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
        {integrationsWithCounts.map((integration) => (
          <Link key={integration.slug} href={'/integrations/' + integration.slug}
            style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: '1px solid #E5E7EB', padding: '1.5rem', textDecoration: 'none', display: 'block' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{integration.emoji}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
              <h2 style={{ fontWeight: 700, fontSize: '1.0625rem', color: '#111827' }}>{integration.name}</h2>
              <span style={{ fontSize: '0.75rem', color: '#6B7280', backgroundColor: '#F3F4F6', padding: '0.15rem 0.4rem', borderRadius: '0.25rem' }}>{integration.count}</span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: '#6B7280', lineHeight: 1.5, marginBottom: '1rem' }}>{integration.description}</p>
            <span style={{ fontSize: '0.8125rem', color: '#2563EB', fontWeight: 500 }}>Browse agents →</span>
          </Link>
        ))}
      </div>
    </div>
  )
}