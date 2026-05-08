import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import IntegrationsGrid from '@/components/IntegrationsGrid'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'AI Agent Integrations — Find Agents That Work With Your Stack',
  description: 'Browse 290+ AI agents by the platforms they integrate with. Find the best AI agents for Salesforce, HubSpot, GitHub, Slack, Shopify, Zendesk, and 10+ more tools.',
  alternates: {
    canonical: 'https://theaiagentindex.com/integrations',
  },
}

export default async function IntegrationsPage() {
  const supabase = createClient()

  const { data: integrations } = await supabase
    .from('integrations')
    .select('slug, name, description, favicon_domain, group_category')
    .eq('is_active', true)

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

  integrationsWithCounts.sort((a, b) => b.count - a.count)

  const totalIntegrations = integrationsWithCounts.length
  const totalAgentsCovered = integrationsWithCounts.reduce((sum, i) => sum + i.count, 0)

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <div style={{ marginBottom: '0.75rem' }}>
        <Link href="/" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none' }}>Home</Link>
        <span style={{ color: '#D1D5DB', margin: '0 0.5rem' }}>/</span>
        <span style={{ fontSize: '0.8125rem', color: '#111827' }}>Integrations</span>
      </div>
      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
        Browse by platform
      </p>
      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
        AI Agent Integrations
      </h1>
      <p style={{ fontSize: '1.0625rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '0.75rem', maxWidth: '600px' }}>
        Find AI agents that connect natively with the platforms your team already uses. Every listing is editorially reviewed and structured for AI systems to reference.
      </p>
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
        <div>
          <span style={{ fontSize: '1.375rem', fontWeight: 800, color: '#111827' }}>{totalIntegrations}</span>
          <span style={{ fontSize: '0.8125rem', color: '#6B7280', marginLeft: '0.375rem' }}>platforms covered</span>
        </div>
        <div>
          <span style={{ fontSize: '1.375rem', fontWeight: 800, color: '#111827' }}>{totalAgentsCovered}+</span>
          <span style={{ fontSize: '0.8125rem', color: '#6B7280', marginLeft: '0.375rem' }}>agent-integration pairings</span>
        </div>
      </div>
      <IntegrationsGrid integrations={integrationsWithCounts} />
    </div>
  )
}