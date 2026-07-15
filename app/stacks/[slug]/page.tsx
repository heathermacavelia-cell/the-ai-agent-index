import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import AgentLogo from '@/components/AgentLogo'
import SaveStackForm from '@/components/SaveStackForm'
import StackUpvote from '@/components/StackUpvote'
import StackDiscussion from '@/components/StackDiscussion'

export const dynamic = 'force-dynamic'

const CATEGORY_LABELS: Record<string, string> = {
  'ai-sales-agents': 'Sales',
  'ai-customer-support-agents': 'Support',
  'ai-research-agents': 'Research',
  'ai-marketing-agents': 'Marketing',
  'ai-coding-agents': 'Coding',
  'ai-hr-agents': 'HR',
  'ai-workflow-agents': 'Workflow',
  'ai-customer-success-agents': 'Customer Success',
}

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: '#16A34A',
  moderate: '#D97706',
  complex: '#DC2626',
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = createClient()
  const { data: stack } = await supabase.from('stacks').select('name, tagline, slug, meta_title, meta_description').eq('slug', params.slug).single()
  if (!stack) return {}
  // Per-stack overrides fall back to the template. Colon, not an em dash (house style).
  const title = stack.meta_title ?? `${stack.name}: AI Agent Stack`
  const description = stack.meta_description ?? stack.tagline
  return {
    title,
    description,
    alternates: { canonical: `https://theaiagentindex.com/stacks/${stack.slug}` },
    openGraph: { title: stack.meta_title ?? stack.name, description, url: `https://theaiagentindex.com/stacks/${stack.slug}` },
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
    .select('slug, name, short_description, website_url, favicon_domain, logo_url, mcp_compatible, mcp_status, starting_price, pricing_model')
    .in('slug', agentSlugs)

  const agentMap = Object.fromEntries((agents ?? []).map(a => [a.slug, a]))

  const steps = (stackAgents ?? []).map(sa => ({
    ...sa,
    agent: agentMap[sa.agent_slug],
  })).filter(s => s.agent)

  // ============================================================
  // MCP status for the stack
  // ============================================================
  // The old logic badged a stack "MCP Native" whenever every agent had
  // mcp_compatible = true, and then claimed the agents could connect to each
  // other natively. That is false for a stack of MCP *clients*: a client
  // consumes external servers, it does not expose one, so two clients cannot
  // connect to each other. Only an agent that exposes a server can be
  // connected INTO.
  //
  // "MCP Native" now means every agent in the stack exposes an MCP server.
  const exposesServer = (a: any) => a?.mcp_status === 'server' || a?.mcp_status === 'both'
  const supportsMcpSomehow = (a: any) =>
    a?.mcp_status === 'server' || a?.mcp_status === 'both' || a?.mcp_status === 'client' ||
    // Legacy rows that predate mcp_status.
    (a?.mcp_status == null && a?.mcp_compatible === true)

  const allServers = steps.length > 0 && steps.every(s => exposesServer(s.agent))
  const anyServer = steps.some(s => exposesServer(s.agent))
  const allSupportMcp = steps.length > 0 && steps.every(s => supportsMcpSomehow(s.agent))
  const anyMcp = steps.some(s => supportsMcpSomehow(s.agent))

  // Fetch initial discussions server-side for SEO
  const { data: initialDiscussions } = await supabase
    .from('stack_discussions')
    .select('id, parent_id, author_name, body, upvotes, report_count, created_at')
    .eq('stack_id', stack.id)
    .eq('is_deleted', false)
    .order('created_at', { ascending: false })

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
          {allServers && (
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
                    <AgentLogo name={step.agent.name} websiteUrl={step.agent.website_url} faviconDomain={step.agent.favicon_domain} logoUrl={step.agent.logo_url} size="sm" />
                    <a href={`/agents/${step.agent_slug}`} style={{ color: '#111827', fontWeight: 700, fontSize: '1rem', textDecoration: 'none' }}>{step.agent.name}</a>
                    {exposesServer(step.agent) ? (
                      <span title="Exposes an MCP server that other agents can connect into." style={{ backgroundColor: '#F0FDF4', color: '#16A34A', border: '1px solid #BBF7D0', fontSize: '0.625rem', fontWeight: 600, padding: '0.15rem 0.4rem', borderRadius: '0.25rem' }}>MCP server</span>
                    ) : step.agent.mcp_status === 'client' ? (
                      <span title="Connects out to external MCP servers, but does not expose one." style={{ backgroundColor: '#F3F4F6', color: '#6B7280', border: '1px solid #E5E7EB', fontSize: '0.625rem', fontWeight: 600, padding: '0.15rem 0.4rem', borderRadius: '0.25rem' }}>MCP client</span>
                    ) : (step.agent.mcp_status == null && step.agent.mcp_compatible === true) ? (
                      <span style={{ backgroundColor: '#F3F4F6', color: '#6B7280', border: '1px solid #E5E7EB', fontSize: '0.625rem', fontWeight: 600, padding: '0.15rem 0.4rem', borderRadius: '0.25rem' }}>MCP</span>
                    ) : null}
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
      {anyMcp && (
        <section style={{ maxWidth: '860px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
          <div style={{
            backgroundColor: allServers ? '#F0FDF4' : '#F9FAFB',
            border: '1px solid',
            borderColor: allServers ? '#BBF7D0' : '#E5E7EB',
            borderRadius: '0.875rem',
            padding: '1.5rem',
            display: 'flex',
            gap: '1rem',
            alignItems: 'flex-start',
          }}>
            <div style={{ flexShrink: 0, width: '2rem', height: '2rem', backgroundColor: allServers ? '#DCFCE7' : '#F3F4F6', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={allServers ? '#16A34A' : '#6B7280'} strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
            </div>
            <div>
              <p style={{ color: allServers ? '#15803D' : '#374151', fontWeight: 700, fontSize: '0.9375rem', marginBottom: '0.375rem' }}>
                {allServers
                  ? 'Every agent in this stack exposes an MCP server'
                  : anyServer
                  ? 'Some agents in this stack expose an MCP server'
                  : 'The agents in this stack support MCP as clients'}
              </p>
              <p style={{ color: allServers ? '#166534' : '#4B5563', fontSize: '0.875rem', lineHeight: 1.65 }}>
                MCP (Model Context Protocol) is an open standard for connecting AI agents to tools and data.{' '}
                {allServers
                  ? 'Because each agent here publishes its own MCP server, an assistant or orchestrator can connect into every step of this stack directly, without custom API glue.'
                  : anyServer
                  ? 'The agents that publish a server can be connected into directly by an AI assistant. The others act as clients, meaning they consume external tools rather than exposing their own, so those steps still need conventional integration.'
                  : 'These agents act as MCP clients: they connect out to external MCP servers to use their tools, but they do not expose servers of their own. That means they cannot be driven by another agent through MCP, and the steps between them still need conventional integration.'}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Discussion */}
      <section style={{ maxWidth: '860px', margin: '0 auto', padding: '0 1.5rem 2.5rem' }}>
        <StackDiscussion
          stackId={stack.id}
          stackSlug={stack.slug}
          initialDiscussions={initialDiscussions ?? []}
        />
      </section>

      {/* Footer nav */}
      <section style={{ maxWidth: '860px', margin: '0 auto', padding: '0 1.5rem 5rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <a href="/stacks" style={{ color: '#9CA3AF', fontSize: '0.875rem', textDecoration: 'none' }}>← Back to all stacks</a>
        <a href="/stacks/submit" style={{ color: '#2563EB', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 600 }}>Submit your own stack →</a>
      </section>
    </div>
  )
}