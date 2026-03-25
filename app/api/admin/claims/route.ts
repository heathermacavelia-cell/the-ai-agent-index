import { createServiceClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

function checkAuth(req: NextRequest) {
  const pass = req.headers.get('x-admin-password')
  return pass === process.env.ADMIN_PASSWORD
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = createServiceClient()
  const { data } = await supabase.from('agent_claims').select('*').order('submitted_at', { ascending: false })
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
    const { data: claim } = await supabase.from('agent_claims').select('agent_id, claimant_email, agent_name, agent_slug').eq('id', claim_id).single()
    if (claim) {
      await supabase.from('agents').update({ is_verified: true }).eq('id', claim.agent_id)
      await supabase.from('agent_claims').update({ status: 'approved', reviewed_at: new Date().toISOString() }).eq('id', claim_id)
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'The AI Agent Index <noreply@theaiagentindex.com>',
          to: claim.claimant_email,
          subject: 'Your listing has been verified — ' + claim.agent_name,
          html: '<div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px"><h2 style="color:#111827">Your listing is now verified ✅</h2><p style="color:#4B5563">Congratulations! <strong>' + claim.agent_name + '</strong> now displays a Verified badge on The AI Agent Index.</p><a href="' + process.env.NEXT_PUBLIC_SITE_URL + '/agents/' + claim.agent_slug + '" style="display:inline-block;background:#2563EB;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">View your listing →</a></div>',
        }),
      })
    }
  } else {
    await supabase.from('agent_claims').update({ status: 'rejected', reviewed_at: new Date().toISOString() }).eq('id', claim_id)
  }
  return NextResponse.json({ ok: true })
}