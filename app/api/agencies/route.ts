export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const supabase = createClient()
  const { searchParams } = new URL(req.url)

  let query = supabase
    .from('agencies')
    .select('id, name, slug, website_url, favicon_domain, short_description, headquarters, team_size, company_type, service_tags, industry_tags, tool_specializations, pricing_model, hourly_rate_range, minimum_project_budget, is_verified, is_featured, rating_avg, rating_count, clutch_url, clutch_rating, trustpilot_url, trustpilot_rating, linkedin_url, regions_served, created_at, updated_at')
    .eq('is_active', true)

  const service = searchParams.get('service')
  if (service) query = query.contains('service_tags', [service])

  const tool = searchParams.get('tool')
  if (tool) query = query.contains('tool_specializations', [tool])

  const industry = searchParams.get('industry')
  if (industry) query = query.contains('industry_tags', [industry])

  const verified = searchParams.get('verified')
  if (verified === 'true') query = query.eq('is_verified', true)

  const { data, error } = await query.order('name', { ascending: true })

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch agencies' }, { status: 500 })
  }

  return NextResponse.json(data ?? [], {
    headers: {
      'Cache-Control': 'public, s-maxage=3600',
      'Content-Type': 'application/json',
    },
  })
}