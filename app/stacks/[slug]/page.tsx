import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import AgentLogo from '@/components/AgentLogo'
import SaveStackForm from '@/components/SaveStackForm'
import StackUpvote from '@/components/StackUpvote'

export const dynamic = 'force-dynamic'

const CATEGORY_LABELS: Record<string, string> = {
  'ai-sales-agents': 'Sales',
  'ai-customer-support-agents': 'Support',
  'ai-research-agents': 'Research',
  'ai-marketing-agents': 'Marketing',
  'ai-coding-agents': 'Coding',
  'ai-hr-agents': 'HR',
}

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: '#16A34A',
  moderate: '#D97706',
  complex: '#DC2626',
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = createClient()
  const { data: stack } = await supabase.from('stacks').select('name, tagline, slug').eq('slug', params.slug).single()
  if (!stack) return {}
  return {
    title: `${stack.name} — AI Agent Stack`,
    description: stack.tagline,
    alternates: { canonical: `https://theaiagentindex.com/stacks/${stack.slug}` },
    openGraph: { title: stack.name, description: stack.tagline, url: `https://theaiagentindex.com/stacks/${stack.slug}` },
  }
}

export default async function StackPage({ params }: { params: { slug: string } }) {
  const supabase = createClient()

  const { data: stack } = await supabase
    .from('stacks')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .eq('is_approved', true)
    .single()

  if (!stack) notFound()

  const { data: stackAgents } = await supabase
    .from('stack_agents')
    .select('*')
    .eq('stack_id', stack.id)
    .order('step_order')

  const agentSlugs = (stackAgents ?? []).map(sa => sa.agent_slug)

  const { data: agents } = await supabase
    .from('agents')
    .select('slug, name, short_description, website_url, favicon_domain, mcp_compatible, starting_price, pricing_model')
    .in('slug', agentSlugs)

  const agentMap = Object.fromEntries((agents ?? []).map(a => [a.slug, a]))

  const steps = (stackAgents ?? []).map(sa => ({
    ...sa,
    agent: agentMap[sa.agent_slug],
  })).filter(s => s.agent)

  const allMCP = steps.length > 0 && steps.every(s => s.agent?.mcp_compatible === true)
  const anyMCP = steps.some(s => s.agent?.mcp_compatible === true)

  const stackJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: stack.name,
    description: stack.description,
    url: `https://theaiagentindex.com/stacks/${stack.slug}`,
    step: steps.map(s => ({
      '@type': 'HowToStep',
      position: s.step_order,
      name: s.role_in_stack,
      text: s.connection_description,
      itemListElement: {
        '@type': 'SoftwareApplication',
        name: s.agent?.name,
        url: s.agent?.website_url,
      },
    })),
  }

  return (
    <div style={{ backgroundColor: '#F9FAFB', minHeight: '100vh', color: '#111827' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(stackJsonLd) }} />

      {/* Breadcrumb */}
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '1.5rem 1.5rem 0' }}>
        <p style={{ color: '#9CA3AF', fontSize: '0.8125rem' }}>
          <a href="/" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Home</a>
          {' / '}
          <a href="/stacks" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Stacks</a>
          {' / '}
          <span style={{ color: '#6B7280' }}>{stack.name}</span>
        </p>
      </div>

      {/* Hero */}
      <section style={{ maxWidth: '860px', margin: '0 auto', padding: '2rem 1.5rem 2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          <span style={{ backgroundColor: '#F3F4F6', color: '#6B7280', fontSize: '0.6875rem', fontWeight: 600, padding: '0.2rem 0.625rem', borderRadius: '0.375rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {CATEGORY_LABELS[stack.primary_category] ?? stack.primary_category}
          </span>
          <span style={{ backgroundColor: stack.is_editorial ? '#EFF6FF' : '#F3F4F6', color: stack.is_editorial ? '#2563EB' : '#6B7280', fontSize: '0.6875rem', fontWeight: 600, padding: '0.2rem 0.625rem', borderRadius: '0.375rem' }}>
            {stack.is_editorial ? 'Curated by AI Agent Index' : 'Community Stack'}
          </span>
          <span style={{ color: DIFFICULTY_COLORS[stack.difficulty] ?? '#6B7280', fontSize: '0.6875rem', fontWeight: 600, padding: '0.2rem 0.625rem', borderRadius: '0.375rem', border: '1px solid', borderColor: DIFFICULTY_COLORS[stack.difficulty] ?? '#D1D5DB', textTransform: 'capitalize' }}>
            {stack.difficulty} to implement
          </span>
          {allMCP && (
            <span style={{ backgroundColor: '#F0FDF4', color: '#16A34A', border: '1px solid #BBF7D0', fontSize: '0.6875rem', fontWeight: 600, padding: '0.2rem 0.625rem', borderRadius: '0.375rem' }}>
              MCP Native
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.02em', margin: 0, color: '#111827' }}>{stack.name}</h1>
          <StackUpvote stackId={stack.id} initialCount={stack.upvote_count ?? 0} />
        </div>
        <p style={{ color: '#4B5563', fontSize: '1.0625rem', lineHeight: 1.75, maxWidth: '640px' }}>{stack.description}</p>
      </section>

      {/* Agent Sequence */}
      <section style={{ maxWidth: '860px', margin: '0 auto', padding: '0 1.5rem 2.5rem' }}>
        <p style={{ color: '#9CA3AF', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
          The workflow — {steps.length} agents in sequence
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {steps.map((step, i) => (
            <div key={step.id}>
              <div style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.875rem', padding: '1.5rem', display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '1rem', alignItems: 'start' }}>
                <div style={{ width: '2rem', height: '2rem', backgroundColor: '#EFF6FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ color: '#2563EB', fontSize: '0.8125rem', fontWeight: 800 }}>{step.step_order}</span>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.375rem' }}>
                    <AgentLogo name={step.agent.name} websiteUrl={step.agent.website_url} faviconDomain={step.agent.favicon_domain} size="sm" />
                    <a href={`/agents/${step.agent_slug}`} style={{ color: '#111827', fontWeight: 700, fontSize: '1rem', textDecoration: 'none' }}>{step.agent.name}</a>
                    {step.agent.mcp_compatible === true && (
                      <span style={{ backgroundColor: '#F0FDF4', color: '#16A34A', border: '1px solid #BBF7D0', fontSize: '0.625rem', fontWeight: 600, padding: '0.15rem 0.4rem', borderRadius: '0.25rem' }}>MCP</span>
                    )}
                  </div>
                  <p style={{ color: '#2563EB', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.5rem' }}>{step.role_in_stack}</p>
                  <p style={{ color: '#6B7280', fontSize: '0.875rem', lineHeight: 1.65 }}>{step.agent.short_description}</p>
                </div>

                <a href={step.agent.website_url} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'white', fontSize: '0.75rem', textDecoration: 'none', flexShrink: 0, border: '1px solid #2563EB', padding: '0.375rem 0.625rem', borderRadius: '0.375rem', backgroundColor: '#2563EB' }}>
                  Visit
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                </a>
              </div>

              {i < steps.length - 1 && step.connection_description && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1.5rem' }}>
                  <div style={{ width: '2rem', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></svg>
                  </div>
                  <p style={{ color: '#9CA3AF', fontSize: '0.8125rem', fontStyle: 'italic', flex: 1 }}>{step.connection_description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Save + Implementation */}
      <section style={{ backgroundColor: 'white', borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '2.5rem 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          <div>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.375rem', color: '#111827' }}>Save this stack</h3>
            <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '1.25rem' }}>Get this stack plus weekly new stacks and agent updates delivered to your inbox.</p>
            <SaveStackForm stackName={stack.name} stackSlug={stack.slug} />
          </div>

          <div style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.5rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.375rem', color: '#111827' }}>Need help implementing this?</h3>
            <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '1.25rem' }}>Connect with a vetted AI implementation specialist who can set up this stack for your business.</p>
            <a href="/partner-waitlist" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', backgroundColor: '#2563EB', color: 'white', padding: '0.625rem 1.25rem', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>
              Find an implementation specialist →
            </a>
          </div>
        </div>
      </section>

      {/* MCP callout */}
      {anyMCP && (
        <section style={{ maxWidth: '860px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
          <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '0.875rem', padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ flexShrink: 0, width: '2rem', height: '2rem', backgroundColor: '#DCFCE7', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
            </div>
            <div>
              <p style={{ color: '#15803D', fontWeight: 700, fontSize: '0.9375rem', marginBottom: '0.375rem' }}>
                {allMCP ? 'This entire stack is MCP compatible' : 'Some agents in this stack support MCP'}
              </p>
              <p style={{ color: '#166534', fontSize: '0.875rem', lineHeight: 1.65 }}>
                MCP (Model Context Protocol) is an open standard that enables AI agents to connect natively. {allMCP ? 'All agents in this stack support MCP, enabling native agent-to-agent connections without manual data handoffs.' : 'As more agents adopt MCP, connections in this stack will become increasingly automated.'}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Footer nav */}
      <section style={{ maxWidth: '860px', margin: '0 auto', padding: '0 1.5rem 5rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <a href="/stacks" style={{ color: '#9CA3AF', fontSize: '0.875rem', textDecoration: 'none' }}>← Back to all stacks</a>
        <a href="/stacks/submit" style={{ color: '#2563EB', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 600 }}>Submit your own stack →</a>
      </section>
    </div>
  )
}