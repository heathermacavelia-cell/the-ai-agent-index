import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'AI Agent Definitions & Glossary — AI Agent Index',
  description: 'Clear definitions of AI agent terminology — what they are, how they work, and how to evaluate them for your business.',
  alternates: {
    canonical: 'https://theaiagentindex.com/definitions',
  },
}

export default async function DefinitionsIndexPage() {
  const supabase = createClient()
  const { data: definitions } = await supabase
    .from('definitions')
    .select('slug, title, description')
    .eq('is_active', true)
    .order('created_at', { ascending: true })

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6B7280', marginBottom: '2rem' }}>
        <Link href="/" style={{ color: '#6B7280', textDecoration: 'none' }}>Home</Link>
        <span style={{ color: '#D1D5DB' }}>/</span>
        <span style={{ color: '#111827' }}>Definitions</span>
      </nav>

      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
        AI Agent Definitions
      </h1>
      <p style={{ color: '#4B5563', fontSize: '1.0625rem', lineHeight: 1.7, marginBottom: '3rem', maxWidth: '600px' }}>
        Clear, structured definitions of AI agent categories — what they are, how they work, and how to evaluate them for your business.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {(definitions ?? []).map((def) => (
          <Link key={def.slug} href={'/definitions/' + def.slug}
            style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.5rem', textDecoration: 'none', display: 'block' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.0625rem', color: '#111827', marginBottom: '0.375rem' }}>{def.title}</h2>
            <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.6, marginBottom: '0.75rem' }}>{def.description && def.description.length > 160 ? def.description.slice(0, 160) + '...' : def.description}</p>
            <span style={{ fontSize: '0.8125rem', color: '#2563EB' }}>Read definition →</span>
          </Link>
        ))}
      </div>
    </div>
  )
}