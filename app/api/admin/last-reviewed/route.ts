import { createServiceClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

function checkAuth(req: NextRequest) {
  return req.headers.get('x-admin-password') === (process.env.ADMIN_PASSWORD ?? 'changeme')
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = createServiceClient()
  const { data } = await supabase.from('admin_last_reviewed').select('*').eq('id', 1).single()
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { type } = await req.json()
  const supabase = createServiceClient()
  const field = type === 'reviews' ? 'reviews_reviewed_at' : 'agents_reviewed_at'
  await supabase.from('admin_last_reviewed').update({ [field]: new Date().toISOString() }).eq('id', 1)
  return NextResponse.json({ success: true })
}