import { createClient } from '@/lib/supabase'
import { isOnOurRadar, displayRating } from '@/lib/rating'

export type BadgeType = 'listed' | 'mcp-server' | 'category-leader' | 'rated' | 'transparent-pricing'

// Prestige order: used by /badges pages and emails to pick the "best" badge
export const BADGE_ORDER: BadgeType[] = ['rated', 'category-leader', 'mcp-server', 'transparent-pricing', 'listed']

export interface BadgeInfo {
  type: BadgeType
  label: string
  sublabel: string
  color: 'green' | 'blue' | 'slate'
}

export function currentQuarterLabel(date = new Date()): string {
  const q = Math.floor(date.getUTCMonth() / 3) + 1
  return 'Q' + q + ' ' + date.getUTCFullYear()
}


// All badges the agent currently qualifies for, in prestige order.
// Live data in, badges out: any DB change is reflected on the next call.
// Every badge carries the agent's own name so a hotlinked badge always
// identifies its rightful owner (anti-theft by design).
export async function getEligibleBadges(agent: {
  slug: string
  name: string
  is_active: boolean
  primary_category: string
  mcp_status: string | null
  pricing_transparency: string | null
  editorial_rating: number | null
  editorial_rating_notes: string | null
  rating_avg: number | null
  rating_count: number | null
}): Promise<BadgeInfo[]> {
  if (!agent.is_active) return []

  const badges: BadgeInfo[] = []
  const year = new Date().getUTCFullYear()
  const nameSub = agent.name.toUpperCase() + ' \u00B7 AI AGENT INDEX'
  const categorySub = agent.name.toUpperCase() + ' \u00B7 ' + agent.primary_category.replace(/-/g, ' ').toUpperCase()

  const rating = displayRating(agent)
  if (rating != null && rating >= 4.5 && !isOnOurRadar(agent)) {
    badges.push({ type: 'rated', label: 'Rated ' + rating.toFixed(1) + ' \u2605', sublabel: nameSub, color: 'green' })
  }

  // Category Leader: top 5 in primary category by editorial rating, quarter-stamped
  try {
    const supabase = createClient()
    const { data: top } = await supabase
      .from('agents')
      .select('slug, editorial_rating, editorial_rating_notes, rating_avg, rating_count')
      .eq('primary_category', agent.primary_category)
      .eq('is_active', true)
      .not('editorial_rating', 'is', null)
      .order('editorial_rating', { ascending: false })
      .limit(12)
    const leaders = (top ?? []).filter((t) => !isOnOurRadar(t)).slice(0, 5)
    if (leaders.some((t) => t.slug === agent.slug)) {
      badges.push({ type: 'category-leader', label: 'Category Leader \u00B7 ' + currentQuarterLabel(), sublabel: categorySub, color: 'blue' })
    }
  } catch {
    // If the leaderboard query fails, simply omit the badge rather than guess
  }

  if (agent.mcp_status === 'server' || agent.mcp_status === 'both') {
    badges.push({ type: 'mcp-server', label: 'MCP Server Verified', sublabel: nameSub, color: 'green' })
  }

  if (agent.pricing_transparency === 'public') {
    badges.push({ type: 'transparent-pricing', label: 'Transparent Pricing', sublabel: nameSub, color: 'blue' })
  }

  badges.push({ type: 'listed', label: 'Listed ' + year, sublabel: nameSub, color: 'slate' })

  return badges.sort((a, b) => BADGE_ORDER.indexOf(a.type) - BADGE_ORDER.indexOf(b.type))
}