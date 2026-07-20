import { createClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// ============================================================
// Template resolution
// ============================================================
// pros, limitations, and best_for carry {{slug.starting_price}} and
// {{github_stars}} templates. Returning them raw hands placeholders to any
// machine consumer of this endpoint.

const PRICE_VAR_REGEX = /\{\{([a-z0-9-]+)\.starting_price\}\}/g

interface PriceInfo {
  starting_price: number | null
  pricing_model: string | null
  billing_period: string | null
  price_unit: string | null
}

function formatStars(stars: number): string {
  if (stars >= 1000) {
    const k = stars / 1000
    return (k >= 100 ? Math.round(k).toString() : k.toFixed(1).replace(/\.0$/, '')) + 'k'
  }
  return String(stars)
}

function formatPrice(info: PriceInfo): string {
  if (info.starting_price === 0 || info.pricing_model === 'free') return 'free'
  if (info.starting_price == null) return 'custom pricing'
  // Usage pricing is per-unit, not per-month. Never append "/mo".
  if (info.billing_period === 'usage') {
    return '$' + info.starting_price + (info.price_unit ? ' ' + info.price_unit : ' usage-based')
  }
  const base = '$' + info.starting_price + '/mo'
  if (info.billing_period === 'annual') return base + ' billed annually'
  return base
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
    .select('slug, name, developer, short_description, primary_category, pricing_model, starting_price, billing_period, price_unit, editorial_rating, editorial_rating_notes, best_for, pros, limitations, deployment_method, deployment_difficulty, avg_setup_time, integrations, website_url, favicon_domain, logo_url, customer_segment, g2_rating, g2_review_count, github_stars, mcp_compatible, mcp_status, pricing_transparency, contract_type, data_training, human_in_loop, security_certifications, capability_tags')
    .in('slug', slugs)
    .eq('is_active', true)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const rows = agents ?? []

  // ----- Resolve templates before returning -----
  const referenced = new Set<string>()
  for (const row of rows) {
    const texts = [...(row.pros ?? []), ...(row.limitations ?? []), row.best_for ?? '']
    for (const t of texts) {
      if (typeof t !== 'string') continue
      for (const m of t.matchAll(PRICE_VAR_REGEX)) referenced.add(m[1])
    }
  }

  const priceMap: Record<string, PriceInfo> = {}
  if (referenced.size > 0) {
    const { data: priceAgents } = await supabase
      .from('agents')
      .select('slug, starting_price, pricing_model, billing_period, price_unit')
      .in('slug', [...referenced])
    for (const pa of priceAgents ?? []) {
      priceMap[pa.slug] = {
        starting_price: pa.starting_price,
        pricing_model: pa.pricing_model,
        billing_period: pa.billing_period ?? null,
        price_unit: pa.price_unit ?? null,
      }
    }
  }

  const resolved = rows.map((row) => {
    const stars = typeof row.github_stars === 'number' ? row.github_stars : null
    const resolve = (text: string): string => {
      if (typeof text !== 'string') return text
      let out = text.replace(PRICE_VAR_REGEX, (match, slug) => {
        const info = priceMap[slug]
        if (!info) return match
        return formatPrice(info)
      })
      if (stars != null) {
        out = out.replace(/\{\{github_stars\}\}/g, formatStars(stars))
      }
      return out
    }

    return {
      ...row,
      pros: row.pros ? row.pros.map(resolve) : row.pros,
      limitations: row.limitations ? row.limitations.map(resolve) : row.limitations,
      best_for: row.best_for ? resolve(row.best_for) : row.best_for,
    }
  })

  return NextResponse.json(resolved, {
    status: 200,
    headers: { 'Cache-Control': 'public, s-maxage=300' },
  })
}