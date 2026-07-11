import { createClient } from '@/lib/supabase'

export type BadgeType = 'listed' | 'mcp-server' | 'category-leader' | 'rated' | 'transparent-pricing'

// Prestige order: used by /badges pages and emails to pick the "best" badge
export const BADGE_ORDER: BadgeType[] = ['rated', 'category-leader', 'mcp-server', 'transparent-pricing', 'listed']

export interface BadgeInfo {
  type: BadgeType
  label: string
  sublabel: string
  color: 'green' | 'blue' | 'slate'
}

const DEFAULT_SUB = 'THE AI AGENT INDEX'

export function currentQuarterLabel(date = new Date()): string {
  const q = Math.floor(date.getUTCMonth() / 3) + 1
  return 'Q' + q + ' ' + date.getUTCFullYear()
}

// Displayed rating: editorial score blended with community reviews per methodology thresholds
export function displayedRating(agent: {
  editorial_rating: number | null
  rating_avg: number | null
  rating_count: number | null
}): number | null {
  const editorial = agent.editorial_rating != null ? Number(agent.editorial_rating) : null
  if (editorial == null) return null
  const count = agent.rating_count ?? 0
  const community = agent.rating_avg != null ? Number(agent.rating_avg) : 0
  let value = editorial
  if (count >= 26) value = 0.4 * editorial + 0.6 * community
  else if (count >= 5) value = 0.5 * editorial + 0.5 * community
  return Math.round(value * 10) / 10
}

// "On Our Radar" check, mirrors the homepage logic
export function isOnOurRadar(agent: {
  editorial_rating: number | null
  editorial_rating_notes: string | null
}): boolean {
  const rating = agent.editorial_rating != null ? Number(agent.editorial_rating) : null
  const indEvid = agent.editorial_rating_notes
    ? parseInt((agent.editorial_rating_notes.match(/IndEvid (\d)/) ?? [])[1] ?? '5')
    : 5
  return (rating !== null && rating < 3.0) || indEvid === 1
}

// All badges the agent currently qualifies for, in prestige order.
// Live data in, badges out: any DB change is reflected on the next call.
export async function getEligibleBadges(agent: {
  slug: string
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
  const categorySub = DEFAULT_SUB + ' \u00B7 ' + agent.primary_category.replace(/-/g, ' ').toUpperCase()

  const rating = displayedRating(agent)
  if (rating != null && rating >= 4.5 && !isOnOurRadar(agent)) {
    badges.push({ type: 'rated', label: 'Rated ' + rating.toFixed(1) + ' \u2605', sublabel: DEFAULT_SUB, color: 'green' })
  }

  // Category Leader: top 5 in primary category by editorial rating, quarter-stamped
  try {
    const supabase = createClient()
    const { data: top } = await supabase
      .from('agents')
      .select('slug')
      .eq('primary_category', agent.primary_category)
      .eq('is_active', true)
      .not('editorial_rating', 'is', null)
      .order('editorial_rating', { ascending: false })
      .limit(5)
    if ((top ?? []).some((t) => t.slug === agent.slug)) {
      badges.push({ type: 'category-leader', label: 'Category Leader \u00B7 ' + currentQuarterLabel(), sublabel: categorySub, color: 'blue' })
    }
  } catch {
    // If the leaderboard query fails, simply omit the badge rather than guess
  }

  if (agent.mcp_status === 'server' || agent.mcp_status === 'both') {
    badges.push({ type: 'mcp-server', label: 'MCP Server Verified', sublabel: DEFAULT_SUB, color: 'green' })
  }

  if (agent.pricing_transparency === 'public') {
    badges.push({ type: 'transparent-pricing', label: 'Transparent Pricing', sublabel: DEFAULT_SUB, color: 'blue' })
  }

  badges.push({ type: 'listed', label: 'Listed ' + year, sublabel: DEFAULT_SUB, color: 'slate' })

  return badges.sort((a, b) => BADGE_ORDER.indexOf(a.type) - BADGE_ORDER.indexOf(b.type))
}