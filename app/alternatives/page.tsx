import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import type { Metadata } from 'next'
import AlternativesList from '@/components/AlternativesList'
import { buildRefMap, collectTemplateSlugs, resolveTemplates } from '@/lib/templates'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'AI Agent Alternatives',
  description: 'Find the best alternatives to popular AI agents. Compare pricing, capabilities, and integrations across sales, support, coding, and marketing agents.',
  alternates: { canonical: 'https://theaiagentindex.com/alternatives' },
}

export default async function AlternativesIndexPage() {
  const supabase = createClient()
  const { data: rawAlternatives } = await supabase
    .from('alternatives')
    .select('slug, title, intro, agent_slug')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  // The cards show the first 160 characters of each intro, so templates must be
  // resolved HERE, on the server, before the text is cut. Passing the stored intro
  // straight through published raw {{slug.name}} / {{slug.starting_price}} on the
  // hub (found live 2026-10-02). Same shared resolver as the alternatives page.
  const introRefs = await buildRefMap(supabase, collectTemplateSlugs((rawAlternatives ?? []).map((a) => a.intro)))
  const alternatives = (rawAlternatives ?? []).map((a) => ({ ...a, intro: resolveTemplates(a.intro ?? '', introRefs) }))

  const agentSlugs = (alternatives ?? []).map((a) => a.agent_slug).filter(Boolean)
  const { data: agents } = agentSlugs.length > 0
    ? await supabase.from('agents').select('slug, name, website_url, favicon_domain').in('slug', agentSlugs)
    : { data: [] }

  const agentMap = Object.fromEntries((agents ?? []).map((a) => [a.slug, a]))

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6B7280', marginBottom: '2rem' }}>
        <Link href="/" style={{ color: '#6B7280', textDecoration: 'none' }}>Home</Link>
        <span style={{ color: '#D1D5DB' }}>/</span>
        <span style={{ color: '#111827' }}>Alternatives</span>
      </nav>

      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
        AI Agent Alternatives
      </h1>
      <p style={{ color: '#4B5563', fontSize: '1.0625rem', lineHeight: 1.7, marginBottom: '3rem' }}>
        Looking for an alternative to a specific AI agent? Compare pricing, capabilities, and integrations to find the right fit for your team.
      </p>

      <AlternativesList alternatives={alternatives ?? []} agentMap={agentMap} />
    </div>
  )
}