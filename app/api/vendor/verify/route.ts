import { createServiceClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  try {
    const { email, agent_slug } = await req.json()

    if (!email || !agent_slug) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    const supabase = createServiceClient()

    // Check there is an approved claim for this email + slug
    const { data: claim } = await supabase
      .from('agent_claims')
      .select('id, claimant_name, agent_name, verification_token')
      .eq('agent_slug', agent_slug)
      .eq('claimant_email', email.toLowerCase().trim())
      .eq('status', 'approved')
      .single()

    if (!claim) {
      return NextResponse.json({ error: 'No approved claim found for this email and agent' }, { status: 404 })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://theaiagentindex.com'
    const magicLink = siteUrl + '/vendor/dashboard/' + agent_slug + '?token=' + claim.verification_token

    await resend.emails.send({
      from: 'noreply@theaiagentindex.com',
      to: email,
      subject: 'Your vendor dashboard link — ' + claim.agent_name,
      html: '<p>Hi ' + claim.claimant_name + ',</p>' +
        '<p>Click the link below to access your vendor dashboard for <strong>' + claim.agent_name + '</strong>. This link is unique to your account.</p>' +
        '<p><a href="' + magicLink + '" style="display:inline-block;padding:12px 24px;background:#2563EB;color:white;border-radius:8px;text-decoration:none;font-weight:600;">Access vendor dashboard →</a></p>' +
        '<p style="color:#6B7280;font-size:14px;">If you did not request this, you can safely ignore this email.</p>' +
        '<p style="color:#6B7280;font-size:14px;">— The AI Agent Index</p>',
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}