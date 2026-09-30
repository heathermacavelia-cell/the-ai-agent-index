export const dynamic = 'force-dynamic'
import { createServiceClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { approveClaim } from '@/lib/claimApproval'

function checkAuth(req: NextRequest) {
  const pass = req.headers.get('x-admin-password')
  return pass === process.env.ADMIN_PASSWORD
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = createServiceClient()
  const { data } = await supabase.from('agent_claims').select('*').order('created_at', { ascending: false })
  return NextResponse.json(data ?? [])
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { claim_id, action } = await req.json()
  if (!claim_id || !['approve', 'reject'].includes(action)) {
    return NextResponse.json({ error: 'Invalid' }, { status: 400 })
  }
  const supabase = createServiceClient()

  if (action === 'approve') {
    await approveClaim(supabase, claim_id)
  } else {
    await supabase.from('agent_claims').update({ status: 'rejected', reviewed_at: new Date().toISOString() }).eq('id', claim_id)
  }
  return NextResponse.json({ ok: true })
}