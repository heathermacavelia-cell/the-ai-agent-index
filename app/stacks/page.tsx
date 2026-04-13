import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase'
import StackCard from '@/components/StackCard'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'AI Agent Stacks — Curated Multi-Agent Workflows for Business Automation',
  description: 'Browse curated and community-verified AI agent stacks. Find the right combination of agents to automate your full business workflow.',
  alternates: { canonical: 'https://theaiagentindex.com/stacks' },
  openGraph: {
    title: 'AI Agent Stacks — Multi-Agent Workflows for Business Automation',
    description: 'Curated and community-verified AI agent stacks for automating complete business workflows.',
    url: 'https://theaiagentindex.com/stacks',
  },
}

const CATEGORIES = [
  { slug: 'ai-sales-agents', label: 'Sales' },
  { slug: 'ai-customer-support-agents', label: 'Support' },
  { slug: 'ai-research-agents', label: 'Research' },
  { slug: 'ai-marketing-agents', label: 'Marketing' },
  { slug: 'ai-coding-agents', label: 'Coding' },
  { slug: 'ai-hr-agents', label: 'HR' },
]

const DIFFICULTIES = ['easy', 'moderate', 'complex']

export default async function StacksPage({
  searchParams,
}: {
  searchParams: { category?: string; difficulty?: string; agent?: string }
}) {
  const supabase = createClient()

  let stackIds: string[] | null = null
  let filterAgentName: string | null = null
  if (searchParams.agent) {
    const { data: agentStacks } = await supabase
      .from('stack_agents')
      .select('stack_id')
      .eq('agent_slug', searchParams.agent)
    stackIds = (agentStacks ?? []).map(sa => sa.stack_id)

    const { data: agentData } = await supabase
      .from('agents')
      .select('name')
      .eq('slug', searchParams.agent)
      .single()
    filterAgentName = agentData?.name ?? searchParams.agent
  }

  let query = supabase
    .from('stacks')
    .select('*')
    .eq('is_active', true)
    .eq('is_approved', true)

  if (stackIds !== null) {
    if (stackIds.length === 0) {
      return (
        <div style={{ backgroundColor: '#030712', minHeight: '100vh', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
            <p style={{ color: '#9CA3AF', marginBottom: '1rem' }}>No stacks found featuring {filterAgentName}.</p>
            <a href="/stacks" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 600 }}>Browse all stacks →</a>
          </div>
        </div>
      )
    }
    query = query.in('id', stackIds)
  }

  if (searchParams.category) query = query.eq('primary_category', searchParams.category)
  if (searchParams.difficulty) query = query.eq('difficulty', searchParams.difficulty)

  const { data: stacks } = await query
    .order('is_editorial', { ascending: false })
    .order('upvote_count', { ascending: false })

  const { data: stackAgents } = await supabase
    .from('stack_agents')
    .select('stack_id, agent_slug, step_order')
    .order('step_order')

  const agentSlugs = [...new Set(stackAgents?.map(sa => sa.agent_slug) ?? [])]

  const { data: agents } = agentSlugs.length
    ? await supabase
        .from('agents')
        .select('slug, name, website_url, favicon_domain, mcp_compatible')
        .in('slug', agentSlugs)
    : { data: [] }

  const agentMap = Object.fromEntries((agents ?? []).map(a => [a.slug, a]))

  // Fetch discussion counts
  const stackIdList = (stacks ?? []).map(s => s.id)
  const { data: discussionRows } = stackIdList.length
    ? await supabase
        .from('stack_discussions')
        .select('stack_id')
        .in('stack_id', stackIdList)
        .eq('is_deleted', false)
    : { data: [] }

  const countMap: Record<string, number> = {}
  for (const row of discussionRows ?? []) {
    countMap[row.stack_id] = (countMap[row.stack_id] ?? 0) + 1
  }

  const stacksWithAgents = (stacks ?? []).map(stack => ({
    ...stack,
    agents: (stackAgents ?? [])
      .filter(sa => sa.stack_id === stack.id)
      .sort((a, b) => a.step_order - b.step_order)
      .map(sa => agentMap[sa.agent_slug])
      .filter(Boolean),
    discussion_count: countMap[stack.id] ?? 0,
  }))

  const activeCategory = searchParams.category ?? ''
  const activeDifficulty = searchParams.difficulty ?? ''

  const stacksJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'AI Agent Stacks',
    description: 'Curated multi-agent workflows for business automation',
    url: 'https://theaiagentindex.com/stacks',
    numberOfItems: stacksWithAgents.length,
    itemListElement: stacksWithAgents.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: s.name,
      url: `https://theaiagentindex.com/stacks/${s.slug}`,
    })),
  }

  return (
    <div style={{ backgroundColor: '#030712', minHeight: '100vh', color: 'white' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(stacksJsonLd) }} />

      {/* Hero */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 1.5rem 2rem' }}>
        <div style={{ display: 'inline-block', backgroundColor: '#0F172A', border: '1px solid #1F2937', borderRadius: '2rem', padding: '0.25rem 0.875rem', marginBottom: '1.25rem' }}>
          <span style={{ color: '#60A5FA', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Agent Stacks</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
            {filterAgentName ? `Stacks featuring ${filterAgentName}` : 'Multi-agent workflows for business automation'}
          </h1>
          <a href="/stacks/submit" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', backgroundColor: '#1F2937', color: '#D1D5DB', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', flexShrink: 0 }}>
            + Submit your stack
          </a>
        </div>
        <p style={{ color: '#9CA3AF', fontSize: '1rem', lineHeight: 1.7, maxWidth: '640px' }}>
          {filterAgentName
            ? `Curated and community-verified workflow stacks that include ${filterAgentName}.`
            : 'Curated and community-verified combinations of AI agents that work together to automate complete business workflows.'}
        </p>
        {filterAgentName && (
          <a href="/stacks" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: '#6B7280', fontSize: '0.8125rem', textDecoration: 'none', marginTop: '0.75rem' }}>
            ← Browse all stacks
          </a>
        )}
      </section>

      {/* Filters */}
      {!filterAgentName && (
        <section style={{ borderTop: '1px solid #1F2937', borderBottom: '1px solid #1F2937', backgroundColor: '#0F172A' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1rem 1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ color: '#6B7280', fontSize: '0.8125rem', fontWeight: 600 }}>Category:</span>
            <a href="/stacks" style={{ color: !activeCategory ? 'white' : '#6B7280', fontSize: '0.8125rem', padding: '0.25rem 0.625rem', borderRadius: '0.375rem', textDecoration: 'none', backgroundColor: !activeCategory ? '#1F2937' : 'transparent', border: '1px solid', borderColor: !activeCategory ? '#374151' : 'transparent' }}>All</a>
            {CATEGORIES.map(c => (
              <a key={c.slug} href={`/stacks?category=${c.slug}${activeDifficulty ? `&difficulty=${activeDifficulty}` : ''}`}
                style={{ color: activeCategory === c.slug ? 'white' : '#6B7280', fontSize: '0.8125rem', padding: '0.25rem 0.625rem', borderRadius: '0.375rem', textDecoration: 'none', backgroundColor: activeCategory === c.slug ? '#1F2937' : 'transparent', border: '1px solid', borderColor: activeCategory === c.slug ? '#374151' : 'transparent' }}>
                {c.label}
              </a>
            ))}
            <span style={{ color: '#374151', margin: '0 0.25rem' }}>|</span>
            <span style={{ color: '#6B7280', fontSize: '0.8125rem', fontWeight: 600 }}>Difficulty:</span>
            {DIFFICULTIES.map(d => (
              <a key={d} href={`/stacks?difficulty=${d}${activeCategory ? `&category=${activeCategory}` : ''}`}
                style={{ color: activeDifficulty === d ? 'white' : '#6B7280', fontSize: '0.8125rem', padding: '0.25rem 0.625rem', borderRadius: '0.375rem', textDecoration: 'none', backgroundColor: activeDifficulty === d ? '#1F2937' : 'transparent', border: '1px solid', borderColor: activeDifficulty === d ? '#374151' : 'transparent', textTransform: 'capitalize' }}>
                {d}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Stack grid */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 1.5rem 6rem' }}>
        {stacksWithAgents.length === 0 ? (
          <p style={{ color: '#6B7280', textAlign: 'center', padding: '4rem 0' }}>No stacks found for this filter.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
            {stacksWithAgents.map(stack => (
              <StackCard
                key={stack.id}
                name={stack.name}
                slug={stack.slug}
                tagline={stack.tagline}
                primary_category={stack.primary_category}
                difficulty={stack.difficulty}
                is_editorial={stack.is_editorial}
                upvote_count={stack.upvote_count}
                agents={stack.agents}
                discussion_count={stack.discussion_count}
              />
            ))}
          </div>
        )}

        <div style={{ marginTop: '4rem', backgroundColor: '#0F172A', border: '1px solid #1F2937', borderRadius: '0.875rem', padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#9CA3AF', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Running a stack that works well for your business?</p>
          <p style={{ color: 'white', fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem' }}>Share it with the community</p>
          <a href="/stacks/submit" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#2563EB', color: 'white', padding: '0.625rem 1.25rem', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>
            Submit your stack →
          </a>
        </div>
      </section>
    </div>
  )
}