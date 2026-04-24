import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase'
import ContentList from '@/components/ContentList'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'AI Agent Definitions & Glossary',
  description: 'Clear definitions of AI agent terminology — what they are, how they work, and how to evaluate them for your business.',
  alternates: { canonical: 'https://theaiagentindex.com/definitions' },
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
      <ContentList items={definitions ?? []} basePath="/definitions/" linkLabel="Read definition" />
    </div>
  )
}