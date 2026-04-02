import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Compare AI Agents — AI Agent Index',
  description: 'Side-by-side comparisons of the top AI agents across sales, support, research, marketing, and coding.',
  alternates: {
    canonical: 'https://theaiagentindex.com/compare',
  },
}

const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  'AI Coding Agents': { bg: '#EFF6FF', color: '#1D4ED8' },
  'AI Customer Support Agents': { bg: '#FAF5FF', color: '#7E22CE' },
  'AI Sales Agents': { bg: '#F0FDF4', color: '#15803D' },
  'AI Marketing Agents': { bg: '#FFF1F2', color: '#BE123C' },
  'AI Research Agents': { bg: '#FFFBEB', color: '#B45309' },
  'AI HR Agents': { bg: '#F0FDFA', color: '#0F766E' },
}

export default async function CompareIndexPage() {
  const supabase = createClient()
  const { data: comparisons } = await supabase
    .from('comparisons')
    .select('slug, agent_a, agent_b, category')
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {(comparisons ?? []).map((comp) => {
          const style = CATEGORY_COLORS[comp.category] ?? { bg: '#F3F4F6', color: '#374151' }
          return (
            <Link key={comp.slug} href={'/compare/' + comp.slug}
              style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.25rem 1.5rem', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#111827', marginBottom: '0.25rem' }}>
                  {comp.agent_a} vs {comp.agent_b}
                </div>
                <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', backgroundColor: style.bg, color: style.color, fontWeight: 500 }}>
                  {comp.category}
                </span>
              </div>
              <span style={{ color: '#2563EB', fontSize: '1rem', flexShrink: 0 }}>→</span>
            </Link>
          )
        })}
      </div>

      <div style={{ marginTop: '3rem', padding: '1.5rem', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.75rem' }}>
        <p style={{ fontSize: '0.9375rem', color: '#6B7280', lineHeight: 1.6, margin: 0 }}>
          <strong style={{ color: '#374151' }}>Want to compare two specific agents?</strong> Use the URL pattern <code style={{ backgroundColor: '#E5E7EB', padding: '0.1rem 0.375rem', borderRadius: '0.25rem', fontSize: '0.875rem' }}>/compare/agent-a-vs-agent-b</code> — any two agents in the index can be compared directly.
        </p>
      </div>
    </div>
  )
}