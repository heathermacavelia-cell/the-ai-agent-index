import { createClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { ratingPayload } from '@/lib/rating'
import { buildRefMap, collectTemplateSlugs, resolveTemplates } from '@/lib/templates'

export const dynamic = 'force-dynamic'

// ============================================================
// Template resolution
// ============================================================
// short_description, best_for, pros and limitations carry
// {{slug.starting_price}}, {{slug.name}} and {{github_stars}} templates.
// Returning them raw hands placeholders to any machine consumer of this
// endpoint.
//
// The resolver moved to lib/templates.ts on 2026-08-20. The local copy it
// replaces matched lib/price's formatPrice exactly but had NO is_active check,
// so a delisted referent resolved to a real-looking price instead of failing
// loudly. Do not reintroduce a local copy.

// ============================================================
// Rating shaping
// ============================================================
// Route each row's rating through lib/rating.ts so this endpoint emits the SAME structured
// editorial_rating object as /api/agents: { sub_scores, total, note? } where total is the
// number when scored or the string "On Our Radar" when suppressed. The raw
// editorial_rating_notes string (which would leak a suppressed total) is removed, and
// community_rating becomes a separate sibling present only when real reviews exist.
function shapeRating(row: any): any {
  const { community, ...editorial } = ratingPayload(row)
  const next = { ...row, editorial_rating: editorial }
  if (community) next.community_rating = community
  delete next.editorial_rating_notes
  delete next.rating_avg
  delete next.rating_count
  return next
}

export async function GET(request: NextRequest) {
  const slugsParam = request.nextUrl.searchParams.get('slugs')
  if (!slugsParam) {
    return NextResponse.json({ error: 'slugs parameter required' }, { status: 400 })
  }

  const slugs = slugsParam.split(',').map(s => s.trim()).filter(Boolean).slice(0, 4)
  if (slugs.length === 0) {
    return NextResponse.json({ error: 'at least one slug required' }, { status: 400 })
  }

  const supabase = createClient()
  const { data: agents, error } = await supabase
    .from('agents')
    .select('slug, name, developer, short_description, primary_category, pricing_model, starting_price, billing_period, price_unit, price_currency, editorial_rating, editorial_rating_notes, rating_avg, rating_count, best_for, pros, limitations, deployment_method, deployment_difficulty, avg_setup_time, integrations, website_url, favicon_domain, logo_url, customer_segment, g2_rating, g2_review_count, github_stars, mcp_compatible, mcp_status, pricing_transparency, contract_type, data_training, human_in_loop, security_certifications, capability_tags')
    .in('slug', slugs)
    .eq('is_active', true)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const rows = agents ?? []

  // ----- Resolve templates before returning -----
  // short_description is included deliberately: it is selected and returned by
  // this endpoint, and the copy this replaced never resolved it.
  const texts: string[] = []
  for (const row of rows) {
    texts.push(...(row.pros ?? []), ...(row.limitations ?? []), row.best_for ?? '', row.short_description ?? '')
  }
  const refs = await buildRefMap(supabase, collectTemplateSlugs(texts))

  const resolved = rows.map((row) => {
    const stars = typeof row.github_stars === 'number' ? row.github_stars : null
    const resolve = (text: string): string => resolveTemplates(text, refs, stars)

    return {
      ...row,
      short_description: row.short_description ? resolve(row.short_description) : row.short_description,
      pros: row.pros ? row.pros.map(resolve) : row.pros,
      limitations: row.limitations ? row.limitations.map(resolve) : row.limitations,
      best_for: row.best_for ? resolve(row.best_for) : row.best_for,
    }
  })

  // Shape every row's rating: suppression-aware total, structured sub-scores, separate
  // community block. Same contract as /api/agents.
  const shaped = resolved.map(shapeRating)

  return NextResponse.json(shaped, {
    status: 200,
    headers: { 'Cache-Control': 'public, s-maxage=300' },
  })
}