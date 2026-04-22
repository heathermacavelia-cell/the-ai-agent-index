import { createClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

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
    .select('slug, name, developer, short_description, primary_category, pricing_model, starting_price, editorial_rating, best_for, pros, limitations, deployment_method, integrations, website_url, favicon_domain')
    .in('slug', slugs)
    .eq('is_active', true)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(agents ?? [], {
    status: 200,
    headers: { 'Cache-Control': 'public, s-maxage=300' },
  })
}