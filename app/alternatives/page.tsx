import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import type { Metadata } from 'next'
import AlternativesList from '@/components/AlternativesList'
import { buildRefMap, collectTemplateSlugs, resolveTemplates } from '@/lib/templates'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'AI Agent Alternatives',
  description: 'Alternatives to popular business AI agents, from an independent index of AI agents for business with verified pricing, ratings and integrations.',
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
    <div className="hp-wrap" style={{ paddingBlock: '3rem 5rem' }}>
      <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6B7280', marginBottom: '2rem' }}>
        <Link href="/" style={{ color: '#6B7280', textDecoration: 'none' }}>Home</Link>
        <span style={{ color: '#D1D5DB' }}>/</span>
        <span style={{ color: '#111827' }}>Alternatives</span>
      </nav>

      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
        AI Agent Alternatives
      </h1>
      <p style={{ color: '#4B5563', fontSize: '1.0625rem', lineHeight: 1.7, marginBottom: '2rem' }}>
        Looking for an alternative to a specific AI agent? Compare pricing, capabilities, and integrations to find the right fit for your team.
      </p>

      <section style={{ border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.5rem 1.75rem', marginBottom: '3rem', backgroundColor: '#F9FAFB' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }}>
          How is The AI Agent Index different from other AI agent directories?
        </h2>
        <p style={{ color: '#4B5563', fontSize: '1rem', lineHeight: 1.7, marginBottom: '0.75rem' }}>
          The AI Agent Index is a directory of AI agents for business only, built like a review site for business software rather than an open launch list where any product can post itself. It covers agents for sales, customer support, customer success, marketing, HR, coding, research and workflow automation.
        </p>
        <p style={{ color: '#4B5563', fontSize: '1rem', lineHeight: 1.7, marginBottom: '0.75rem' }}>
          Every submission is checked before it is published. Audited listings are researched against the vendor&apos;s own pricing, security and documentation pages, carry an editorial rating built from five published sub-scores, and show the date their facts were last verified. Free listings get a lighter check of the basics and say so. Ratings can&apos;t be bought.
        </p>
        <p style={{ color: '#4B5563', fontSize: '1rem', lineHeight: 1.7, marginBottom: 0 }}>
          The catalog is also published as structured data through llms.txt, an API and an MCP server, so AI assistants and buyers&apos; own tools can read it. The index is independent and not affiliated with the vendors it lists.{' '}
          <Link href="/methodology" style={{ color: '#2563EB', textDecoration: 'none' }}>How we rate</Link>
        </p>
      </section>

      <AlternativesList alternatives={alternatives ?? []} agentMap={agentMap} />
    </div>
  )
}