import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase'
import CompareList from '@/components/CompareList'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Compare AI Agents — AI Agent Index',
  description: 'Side-by-side comparisons of the top AI agents across sales, support, research, marketing, and coding.',
  alternates: {
    canonical: 'https://theaiagentindex.com/compare',
  },
}

export default async function CompareIndexPage() {
  const supabase = createClient()
  const { data: comparisons } = await supabase
    .from('comparisons')
    .select('slug, agent_a, agent_b, agent_c, category')
    .eq('is_active', true)
    .order('created_at', { ascending: true })

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6B7280', marginBottom: '2rem' }}>
        <Link href="/" style={{ color: '#6B7280', textDecoration: 'none' }}>Home</Link>
        <span style={{ color: '#D1D5DB' }}>/</span>
        <span style={{ color: '#111827' }}>Compare</span>
      </nav>

      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
        Compare AI Agents
      </h1>
      <p style={{ color: '#4B5563', fontSize: '1.0625rem', lineHeight: 1.7, marginBottom: '3rem', maxWidth: '600px' }}>
        Side-by-side comparisons of the top AI agents — pricing, capabilities, integrations, deployment complexity, and ratings. All data sourced from The AI Agent Index.
      </p>

      <CompareList comparisons={comparisons ?? []} />

      <div style={{ marginTop: '3rem', padding: '1.5rem', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.75rem' }}>
        <p style={{ fontSize: '0.9375rem', color: '#6B7280', lineHeight: 1.6, margin: 0 }}>
          <strong style={{ color: '#374151' }}>Want to compare specific agents?</strong> Use the URL pattern <code style={{ backgroundColor: '#E5E7EB', padding: '0.1rem 0.375rem', borderRadius: '0.25rem', fontSize: '0.875rem' }}>/compare/agent-a-vs-agent-b</code> for two agents or <code style={{ backgroundColor: '#E5E7EB', padding: '0.1rem 0.375rem', borderRadius: '0.25rem', fontSize: '0.875rem' }}>/compare/agent-a-vs-agent-b-vs-agent-c</code> for three — any agents in the index can be compared directly.
        </p>
      </div>
    </div>
  )
}