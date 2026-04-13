import { createServiceClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'changeme'

function checkAuth(request: Request) {
  return request.headers.get('x-admin-password') === ADMIN_PASSWORD
}

export async function GET(request: Request) {
  if (!checkAuth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('stacks')
    .select('*')
    .eq('is_community', true)
    .eq('is_approved', false)
    .eq('is_active', false)
    .order('created_at', { ascending: false })
  return NextResponse.json(data ?? [])
}

export async function POST(request: Request) {
  if (!checkAuth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = createServiceClient()
  const { id, action } = await request.json()
  if (!id || !action) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  if (action === 'approve') {
    await supabase.from('stacks').update({ is_active: true, is_approved: true }).eq('id', id)
  } else {
    await supabase.from('stacks').update({ is_active: false, is_approved: false }).eq('id', id)
  }
  return NextResponse.json({ success: true })
}