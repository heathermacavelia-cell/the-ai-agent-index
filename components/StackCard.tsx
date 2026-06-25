'use client'
import AgentLogo from '@/components/AgentLogo'

interface StackAgent {
  agent_slug: string
  name: string
  website_url: string
  favicon_domain?: string | null
  mcp_compatible: boolean | null
  starting_price?: number | null
}

interface StackCardProps {
  name: string
  slug: string
  tagline: string
  workflow_goal?: string | null
  primary_category: string
  difficulty: string
  is_editorial: boolean
  upvote_count?: number
  agents: StackAgent[]
  discussion_count?: number
}

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
  easy: '#10B981',
  moderate: '#F59E0B',
  complex: '#EF4444',
}

export default function StackCard({ name, slug, tagline, workflow_goal, primary_category, difficulty, is_editorial, upvote_count, agents, discussion_count }: StackCardProps) {
  const allMCP = agents.length > 0 && agents.every(a => a.mcp_compatible === true)

  const combinedPrice = agents.reduce((sum, a) => {
    if (a.starting_price != null && a.starting_price > 0) return sum + a.starting_price
    return sum
  }, 0)
  const allHavePrice = agents.every(a => a.starting_price != null && a.starting_price > 0)
  const priceLabel = combinedPrice > 0
    ? `From $${combinedPrice}/mo combined`
    : null

  return (
    <a href={`/stacks/${slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        style={{ backgroundColor: '#0F172A', border: '1px solid #1F2937', borderRadius: '0.875rem', padding: '1.5rem', cursor: 'pointer', transition: 'border-color 0.15s', display: 'flex', flexDirection: 'column', height: '100%' }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = '#2563EB')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = '#1F2937')}
      >
        {/* Top badges row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
            <span style={{ backgroundColor: '#1F2937', color: '#9CA3AF', fontSize: '0.6875rem', fontWeight: 600, padding: '0.2rem 0.5rem', borderRadius: '0.375rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {CATEGORY_LABELS[primary_category] ?? primary_category}
            </span>
            <span style={{ backgroundColor: is_editorial ? '#1E3A5F' : '#1F2937', color: is_editorial ? '#60A5FA' : '#9CA3AF', fontSize: '0.6875rem', fontWeight: 600, padding: '0.2rem 0.5rem', borderRadius: '0.375rem' }}>
              {is_editorial ? 'Editorial' : 'Community'}
            </span>
            {allMCP && (
              <span style={{ backgroundColor: '#064E3B', color: '#10B981', fontSize: '0.6875rem', fontWeight: 600, padding: '0.2rem 0.5rem', borderRadius: '0.375rem' }}>
                MCP Native
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
            {typeof upvote_count === 'number' && upvote_count > 0 && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#6B7280', fontSize: '0.75rem' }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
                {upvote_count}
              </span>
            )}
            {typeof discussion_count === 'number' && discussion_count > 0 && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#6B7280', fontSize: '0.75rem' }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                {discussion_count}
              </span>
            )}
            <span style={{ color: DIFFICULTY_COLORS[difficulty] ?? '#9CA3AF', fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize' }}>
              {difficulty}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 style={{ color: 'white', fontSize: '1rem', fontWeight: 700, marginBottom: '0.375rem', letterSpacing: '-0.01em' }}>{name}</h3>

        {/* Workflow goal or tagline */}
        <p style={{ color: '#9CA3AF', fontSize: '0.8125rem', lineHeight: 1.6, marginBottom: '1rem' }}>
          {workflow_goal || tagline}
        </p>

        {/* Agent step flow */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem', flex: 1 }}>
          {agents.map((agent, i) => (
            <div key={agent.agent_slug} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: '#4B5563', fontSize: '0.6875rem', fontWeight: 700, minWidth: '1rem', textAlign: 'center' }}>{i + 1}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', backgroundColor: '#1F2937', borderRadius: '0.5rem', padding: '0.375rem 0.625rem', flex: 1, minWidth: 0 }}>
                <AgentLogo name={agent.name} websiteUrl={agent.website_url} faviconDomain={agent.favicon_domain} size="sm" />
                <span
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.location.href = `/agents/${agent.agent_slug}` }}
                  style={{ color: '#D1D5DB', fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer', textDecoration: 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#60A5FA')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#D1D5DB')}
                >
                  {agent.name}
                </span>
                {agent.starting_price != null && agent.starting_price > 0 && (
                  <span style={{ color: '#6B7280', fontSize: '0.6875rem', marginLeft: 'auto', flexShrink: 0 }}>${agent.starting_price}/mo</span>
                )}
              </div>
              {i < agents.length - 1 && (
                <div style={{ position: 'absolute', left: '1.25rem', marginTop: '2rem' }}>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Combined price footer */}
        {priceLabel && (
          <div style={{ borderTop: '1px solid #1F2937', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#6B7280', fontSize: '0.75rem' }}>{priceLabel}</span>
            {!allHavePrice && (
              <span style={{ color: '#4B5563', fontSize: '0.625rem' }}>+ custom pricing agents</span>
            )}
          </div>
        )}
      </div>
    </a>
  )
}