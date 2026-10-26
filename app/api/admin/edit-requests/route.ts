export const dynamic = 'force-dynamic'
import { createServiceClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

function esc(s: string): string {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export async function GET(req: NextRequest) {
  const pass = req.headers.get('x-admin-password')
  if (pass !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('agent_edit_requests')
    .select('*')
    .order('submitted_at', { ascending: false })
  return NextResponse.json(data ?? [])
}

export async function POST(req: NextRequest) {
  const pass = req.headers.get('x-admin-password')
  if (pass !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { id, action, admin_notes } = await req.json()
    if (!id || !action) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const supabase = createServiceClient()

    const { data: request } = await supabase
      .from('agent_edit_requests')
      .select('*')
      .eq('id', id)
      .single()

    if (!request) return NextResponse.json({ error: 'Request not found' }, { status: 404 })

    // 2026-10-26 (Heather): Approve NO LONGER writes anything to the listing.
    // Edits are applied by hand (SQL), checked on the live page, and then
    // Approve only closes the request and sends the 'your edits are live' email.
    // Reject closes it and sends the 'unable to apply' email, as before.

    await supabase.from('agent_edit_requests').update({
      status: action === 'approve' ? 'approved' : 'rejected',
      admin_notes: admin_notes || null,
      reviewed_at: new Date().toISOString(),
    }).eq('id', id)

    const listingUrl = 'https://theaiagentindex.com/agents/' + request.agent_slug

    const subject = action === 'approve'
      ? 'Your edits to ' + request.agent_name + ' are live'
      : 'Update on your edits to ' + request.agent_name

    const text = action === 'approve'
      ? `Hi,

Your requested edits to ${request.agent_name} have been approved and are now live:
${listingUrl}
${admin_notes ? '\nNote from our team: ' + admin_notes + '\n' : ''}
Questions? Just reply to this email.

Heather
The AI Agent Index`
      : `Hi,

After review, we were unable to apply some of your requested edits to ${request.agent_name}.
${admin_notes ? '\nReason: ' + admin_notes + '\n' : ''}
Your listing: ${listingUrl}

Questions? Just reply to this email.

Heather
The AI Agent Index`

    const html = action === 'approve'
      ? `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#111827;font-size:15px;line-height:1.6">
         <p>Hi,</p>
         <p>Your requested edits to <strong>${esc(request.agent_name)}</strong> have been approved and are now live:</p>
         <p><a href="${listingUrl}" style="color:#2563EB">${esc(listingUrl.replace('https://', ''))}</a></p>
         ${admin_notes ? '<p><strong>Note from our team:</strong> ' + esc(admin_notes) + '</p>' : ''}
         <p>Questions? Just reply to this email.</p>
         <p>Heather<br/>The AI Agent Index</p>
         </div>`
      : `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#111827;font-size:15px;line-height:1.6">
         <p>Hi,</p>
         <p>After review, we were unable to apply some of your requested edits to <strong>${esc(request.agent_name)}</strong>.</p>
         ${admin_notes ? '<p><strong>Reason:</strong> ' + esc(admin_notes) + '</p>' : ''}
         <p>Your listing: <a href="${listingUrl}" style="color:#2563EB">${esc(listingUrl.replace('https://', ''))}</a></p>
         <p>Questions? Just reply to this email.</p>
         <p>Heather<br/>The AI Agent Index</p>
         </div>`

    await resend.emails.send({
      from: 'Heather at The AI Agent Index <hello@theaiagentindex.com>',
      to: request.claimant_email,
      subject,
      text,
      html,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}