import { createClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = createClient()
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const difficulty = searchParams.get('difficulty')
  const agent = searchParams.get('agent')

  let query = supabase
    .from('stacks')
    .select('*')
    .eq('is_active', true)
    .eq('is_approved', true)

  if (category) query = query.eq('primary_category', category)
  if (difficulty) query = query.eq('difficulty', difficulty)

  const { data: stacks } = await query
    .order('is_editorial', { ascending: false })
    .order('upvote_count', { ascending: false })

  const { data: stackAgents } = await supabase
    .from('stack_agents')
    .select('*')
    .order('step_order')

  const filtered = agent
    ? (stackAgents ?? [])
        .filter(sa => sa.agent_slug === agent)
        .map(sa => sa.stack_id)
    : null

  const filteredStacks = filtered
    ? (stacks ?? []).filter(s => filtered.includes(s.id))
    : stacks ?? []

  const result = filteredStacks.map(stack => ({
    ...stack,
    agents: (stackAgents ?? [])
      .filter(sa => sa.stack_id === stack.id)
      .sort((a, b) => a.step_order - b.step_order),
  }))

  return NextResponse.json(result, {
    headers: { 'Cache-Control': 'public, s-maxage=3600', 'Content-Type': 'application/json' },
  })
}