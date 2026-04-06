import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import type { Metadata } from 'next'
import AgentLogo from '@/components/AgentLogo'
export const revalidate = 86400

export const metadata: Metadata = {
  title: 'AI Agent Alternatives — The AI Agent Index',
  description: 'Find the best alternatives to popular AI agents. Compare pricing, capabilities, and integrations across sales, support, coding, and marketing agents.',
  alternates: { canonical: 'https://theaiagentindex.com/alternatives' },
}

export default async function AlternativesIndexPage() {
  const supabase = createClient()
  const { data: alternatives } = await supabase
    .from('alternatives')
    .select('slug, title, intro, agent_slug')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  const agentSlugs = (alternatives ?? []).map((a) => a.agent_slug).filter(Boolean)
  const { data: agents } = agentSlugs.length > 0
    ? await supabase.from('agents').select('slug, name, website_url').in('slug', agentSlugs)
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {(alternatives ?? []).map((alt) => {
          const agent = agentMap[alt.agent_slug]
          return (
            <Link key={alt.slug} href={'/alternatives/' + alt.slug} style={{ textDecoration: 'none' }}>
              <div style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {agent && (
                  <div style={{ flexShrink: 0 }}>
                    <AgentLogo name={agent.name} websiteUrl={agent.website_url} faviconDomain={agent.favicon_domain} size="sm" />
                  </div>
                )}
                <div>
                  <h2 style={{ fontWeight: 700, fontSize: '1.0625rem', color: '#111827', marginBottom: '0.375rem' }}>{alt.title}</h2>
                  <p style={{ fontSize: '0.875rem', color: '#6B7280', lineHeight: 1.6, margin: 0 }}>{alt.intro.slice(0, 160)}...</p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}