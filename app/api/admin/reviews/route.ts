export const dynamic = 'force-dynamic'
import { createServiceClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

function checkAuth(req: NextRequest) {
  return req.headers.get('x-admin-password') === (process.env.ADMIN_PASSWORD ?? 'changeme')
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = createServiceClient()
  const { searchParams } = new URL(req.url)
  const reviewType = searchParams.get('type') ?? 'agent'

  if (reviewType === 'agency') {
    const { data, error } = await supabase
      .from('agency_reviews')
      .select('id, rating, comment, reviewer_name, reviewer_company, project_type, created_at, is_approved, agency_id, agencies(name, slug)')
      .order('created_at', { ascending: false })
    if (error) return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
    return NextResponse.json(data)
  }

  const { data, error } = await supabase
    .from('reviews')
    .select('id, rating, comment, reviewer_name, reviewer_email, created_at, updated_at, is_approved, agent_id, agents(name, slug)')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id, is_approved, type } = await req.json()
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  const supabase = createServiceClient()
  const table = type === 'agency' ? 'agency_reviews' : 'reviews'
  const { error } = await supabase.from(table).update({ is_approved }).eq('id', id)
  if (error) return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const type = searchParams.get('type') ?? 'review'
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  const supabase = createServiceClient()
  if (type === 'agent') {
    await supabase.from('agents').delete().eq('id', id)
  } else if (type === 'agency-review') {
    await supabase.from('agency_reviews').delete().eq('id', id)
  } else {
    await supabase.from('reviews').delete().eq('id', id)
  }
  return NextResponse.json({ success: true })
}