export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'
import { getEligibleBadges, BadgeType } from '@/lib/badges'

const VALID_TYPES: BadgeType[] = ['listed', 'mcp-server', 'category-leader', 'rated', 'transparent-pricing']
const VALID_THEMES = ['dark', 'light', 'outline'] as const
type Theme = (typeof VALID_THEMES)[number]

// Zero-footprint SVG served when a claim has lapsed: never a false or
// unchosen badge on a vendor's site, per the invisible-on-lapse policy.
const TRANSPARENT = '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>'

const THEME_STYLES: Record<Theme, { bg: string; border: string; sub: string; main: string; green: string; blue: string; slate: string }> = {
  dark:    { bg: '#0F172A', border: '#1F2937', sub: '#94A3B8', main: '#F9FAFB', green: '#4ADE80', blue: '#60A5FA', slate: '#CBD5E1' },
  light:   { bg: '#FFFFFF', border: '#E5E7EB', sub: '#6B7280', main: '#111827', green: '#15803D', blue: '#2563EB', slate: '#4B5563' },
  outline: { bg: 'none',    border: '#9CA3AF', sub: '#6B7280', main: '#374151', green: '#15803D', blue: '#2563EB', slate: '#4B5563' },
}

const WIDTHS: Record<BadgeType, number> = {
  'rated': 200,
  'category-leader': 244,
  'mcp-server': 228,
  'transparent-pricing': 228,
  'listed': 216,
}

function renderBadge(label: string, color: 'green' | 'blue' | 'slate', type: BadgeType, theme: Theme): string {
  const t = THEME_STYLES[theme]
  const accent = t[color]
  const w = WIDTHS[type]
  const bgRect = t.bg === 'none'
    ? '<rect x="0.5" y="0.5" width="' + (w - 1) + '" height="53" rx="6" fill="none" stroke="' + t.border + '"/>'
    : '<rect x="0.5" y="0.5" width="' + (w - 1) + '" height="53" rx="6" fill="' + t.bg + '" stroke="' + t.border + '"/>'
  return '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="54" role="img" aria-label="' + label + ' on The AI Agent Index">'
    + bgRect
    + '<g transform="translate(12,17)">'
    + '<path d="M10 0L18.5 5V15L10 20L1.5 15V5L10 0Z" fill="none" stroke="' + accent + '" stroke-width="1.8" stroke-linejoin="round"/>'
    + '<circle cx="10" cy="10" r="2.4" fill="' + accent + '"/>'
    + '</g>'
    + '<text x="42" y="22" font-family="system-ui, -apple-system, sans-serif" font-size="9" letter-spacing="0.08em" fill="' + t.sub + '">THE AI AGENT INDEX</text>'
    + '<text x="42" y="39" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="600" fill="' + t.main + '">' + label + '</text>'
    + '</svg>'
}

function svgResponse(body: string, maxAge: number) {
  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, s-maxage=' + maxAge + ', stale-while-revalidate=86400',
    },
  })
}

export async function GET(req: NextRequest, { params }: { params: { slug: string; type: string } }) {
  const { slug, type } = params
  if (!VALID_TYPES.includes(type as BadgeType)) return svgResponse(TRANSPARENT, 300)

  const themeParam = new URL(req.url).searchParams.get('theme')
  const theme: Theme = VALID_THEMES.includes(themeParam as Theme) ? (themeParam as Theme) : 'dark'

  const supabase = createClient()
  const { data: agent } = await supabase
    .from('agents')
    .select('slug, is_active, primary_category, mcp_status, pricing_transparency, editorial_rating, editorial_rating_notes, rating_avg, rating_count')
    .eq('slug', slug)
    .single()

  if (!agent || !agent.is_active) return svgResponse(TRANSPARENT, 300)

  const badges = await getEligibleBadges(agent)
  const badge = badges.find((b) => b.type === type)
  if (!badge) return svgResponse(TRANSPARENT, 300)

  return svgResponse(renderBadge(badge.label, badge.color, badge.type, theme), 3600)
}