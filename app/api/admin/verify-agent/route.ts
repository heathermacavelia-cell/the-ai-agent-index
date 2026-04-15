import { createServiceClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? ''

export async function PATCH(req: NextRequest) {
  const pass = req.headers.get('x-admin-password')
  if (pass !== ADMIN_PASSWORD) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { agent_id } = await req.json()
  if (!agent_id) return NextResponse.json({ error: 'Missing agent_id' }, { status: 400 })

  const supabase = createServiceClient()
  const { error } = await supabase
    .from('agents')
    .update({
      last_verified_at: new Date().toISOString(),
      verified_by: 'editorial',
    })
    .eq('id', agent_id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}