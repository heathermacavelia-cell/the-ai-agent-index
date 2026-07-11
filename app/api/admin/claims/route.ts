export const dynamic = 'force-dynamic'
import { createServiceClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

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
    const { data: claim } = await supabase
      .from('agent_claims')
      .select('agent_id, claimant_email, agent_name, agent_slug')
      .eq('id', claim_id)
      .single()

    if (claim) {
      await supabase.from('agents').update({ is_verified: true, vendor_claimed: true }).eq('id', claim.agent_id)
      await supabase.from('agent_claims').update({ status: 'approved', reviewed_at: new Date().toISOString() }).eq('id', claim_id)

      const site = 'https://theaiagentindex.com'
      const listingUrl = site + '/agents/' + claim.agent_slug
      const badgesUrl = site + '/badges/' + claim.agent_slug
      const reviewUrl = listingUrl + '#leave-review'

      const text =
`Hi,

Your claim for ${claim.agent_name} is approved. Your listing now shows the Verified badge and a verified checkmark on the byline:
${listingUrl}

Your badges are ready. Free to embed on your own site, they update automatically and link buyers back to your listing:
${badgesUrl}

Grow your rating. Verified user reviews raise your displayed rating. Share this link with your customers:
${reviewUrl}
How scoring works: ${site}/methodology#s5

Your vendor dashboard has logo upload, listing updates, and visibility options:
${site}/vendor

If you want more visibility, Vendor Managed is $9.99/mo: priority re-verification every 14 days, homepage rotation in Recently Verified, a one-time newsletter feature, and your own marketing hook on the homepage card. Paid options never affect ratings or placement.
Sign up: https://buy.stripe.com/5kQ6oH9cy4w57i36L7djO00

Questions? Just reply to this email.

Heather
The AI Agent Index`

      try {
        const resend = new Resend(process.env.RESEND_API_KEY)
        await resend.emails.send({
          from: 'Heather at The AI Agent Index <hello@theaiagentindex.com>',
          to: claim.claimant_email,
          subject: 'Your listing is verified: ' + claim.agent_name,
          text,
          html: `
            <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#111827;font-size:15px;line-height:1.6">
              <p>Hi,</p>
              <p>Your claim for <strong>${claim.agent_name}</strong> is approved. Your listing now shows the Verified badge and a verified checkmark on the byline:</p>
              <p><a href="${listingUrl}" style="color:#2563EB">${listingUrl.replace('https://', '')}</a></p>
              <p><strong>Your badges are ready.</strong> Free to embed on your own site, they update automatically and link buyers back to your listing.<br/>
              <a href="${badgesUrl}" style="color:#2563EB">Get your embed codes</a></p>
              <p><strong>Grow your rating.</strong> Verified user reviews raise your displayed rating. Share this link with your customers:<br/>
              <a href="${reviewUrl}" style="color:#2563EB">${listingUrl.replace('https://', '')}#leave-review</a><br/>
              <a href="${site}/methodology#s5" style="color:#6B7280;font-size:13px">How scoring works</a></p>
              <p><strong>Your vendor dashboard</strong> has logo upload, listing updates, and visibility options.<br/>
              <a href="${site}/vendor" style="color:#2563EB">Open the vendor dashboard</a></p>
              <p>If you want more visibility, <strong>Vendor Managed</strong> is $9.99/mo: priority re-verification every 14 days, homepage rotation in Recently Verified, a one-time newsletter feature, and your own marketing hook on the homepage card. Paid options never affect ratings or placement.<br/>
              <a href="https://buy.stripe.com/5kQ6oH9cy4w57i36L7djO00" style="color:#2563EB">Sign up for Vendor Managed</a></p>
              <p>Questions? Just reply to this email.</p>
              <p>Heather<br/>The AI Agent Index</p>
            </div>
          `,
        })
      } catch (emailErr) {
        console.error('Failed to send claim approval email:', emailErr)
      }
    }
  } else {
    await supabase.from('agent_claims').update({ status: 'rejected', reviewed_at: new Date().toISOString() }).eq('id', claim_id)
  }
  return NextResponse.json({ ok: true })
}