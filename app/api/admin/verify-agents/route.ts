import { createServiceClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? ''

export async function GET(req: NextRequest) {
  const pass = req.headers.get('x-admin-password')
  if (pass !== ADMIN_PASSWORD) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('agents')
    .select('id, name, slug, developer, primary_category, website_url, pricing_model, starting_price, short_description, last_verified_at, verified_by, is_active, editorial_rating')
    .eq('is_active', true)
    .order('last_verified_at', { ascending: true, nullsFirst: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}