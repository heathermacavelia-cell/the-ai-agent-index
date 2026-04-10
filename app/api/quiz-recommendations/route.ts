import { createClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

const GOAL_TAGS: Record<string, string[]> = {
  leads: ['lead-generation', 'outbound-automation', 'email-optimisation', 'intent-detection'],
  support: ['ticket-resolution', 'chat', 'omnichannel', 'autonomous', 'escalation'],
  research: ['web-search', 'citations', 'deep-research', 'literature-review', 'data-analysis'],
  content: ['content-creation', 'brand-voice', 'seo', 'campaign-automation'],
  coding: ['code-generation', 'agentic-coding', 'ide', 'multi-file-editing', 'autocomplete'],
}

const BUDGET_ORDER: Record<string, number> = {
  free: 0, freemium: 1, subscription: 2, 'usage-based': 2, custom: 3,
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const goal = searchParams.get('goal') ?? ''
  const size = searchParams.get('size') ?? ''
  const integration = searchParams.get('integration') ?? ''
  const budget = searchParams.get('budget') ?? ''
  const technical = searchParams.get('technical') ?? ''

  const supabase = createClient()
  const { data: agents } = await supabase
    .from('agents')
    .select('id, name, slug, short_description, website_url, favicon_domain, pricing_model, editorial_rating, rating_avg, capability_tags, integrations, deployment_difficulty, customer_segment')
    .eq('is_active', true)

  if (!agents) return NextResponse.json([])

  const goalTags = GOAL_TAGS[goal] ?? []
  const budgetLevel = BUDGET_ORDER[budget] ?? 3
  const technicalLevels: Record<string, number> = { easy: 0, moderate: 1, complex: 2 }
  const userTechLevel = technicalLevels[technical] ?? 2

  const scored = agents
    .map((agent) => {
      let score = 0
      const agentBudgetLevel = BUDGET_ORDER[agent.pricing_model] ?? 3
      const agentTechLevel = technicalLevels[agent.deployment_difficulty ?? 'easy'] ?? 0
      const tags: string[] = agent.capability_tags ?? []
      const integrations: string[] = agent.integrations ?? []

      // Goal match — most important signal
      const tagMatches = tags.filter(t => goalTags.includes(t)).length
      score += tagMatches * 10

      // Budget fit — must not exceed user budget
      if (agentBudgetLevel <= budgetLevel) score += 8
      else score -= 50

      // Technical fit — must not exceed user technical level
      if (agentTechLevel <= userTechLevel) score += 5
      else score -= 15

      // Segment match
      if (agent.customer_segment === size) score += 6
      else if (agent.customer_segment === 'b2b' && (size === 'smb' || size === 'b2b')) score += 3

      // Integration match
      if (integration !== 'none' && integrations.some(i => i.toLowerCase().includes(integration.toLowerCase()))) score += 8

      // Quality signal
      const rating = agent.editorial_rating ?? agent.rating_avg ?? 0
      score += rating * 2

      return { ...agent, score }
    })
    .filter(a => a.score > 10)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)

  return NextResponse.json(scored)
}