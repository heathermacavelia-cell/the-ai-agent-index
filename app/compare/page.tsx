import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase'
import CompareList from '@/components/CompareList'
export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Compare AI Agents',
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
      <p style={{ color: '#4B5563', fontSize: '1.0625rem', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '600px' }}>
        Side-by-side comparisons of the top AI agents — pricing, capabilities, integrations, deployment complexity, and ratings. All data sourced from The AI Agent Index.
      </p>

      {/* Build Your Own Comparison CTA */}
      <Link
        href="/compare/build"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          backgroundColor: '#0F172A',
          borderRadius: '0.875rem',
          textDecoration: 'none',
          marginBottom: '3rem',
          border: '1px solid #1F2937',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '0.625rem',
            backgroundColor: '#1E3A5F',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
          </div>
          <div>
            <p style={{ fontSize: '1rem', fontWeight: 700, color: 'white', margin: 0 }}>
              Build Your Own Comparison
            </p>
            <p style={{ fontSize: '0.8125rem', color: '#9CA3AF', margin: '0.125rem 0 0' }}>
              Pick 2–4 agents and compare them side by side — pricing, ratings, pros, limitations.
            </p>
          </div>
        </div>
        <span style={{ color: '#60A5FA', fontSize: '1.25rem', fontWeight: 600, flexShrink: 0 }}>→</span>
      </Link>

      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
        Editorial comparisons
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