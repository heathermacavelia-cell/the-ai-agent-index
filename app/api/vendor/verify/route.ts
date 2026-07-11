import { createServiceClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { randomBytes } from 'crypto'

function esc(s: string): string {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export async function POST(req: NextRequest) {
  try {
    const { email, agent_slug } = await req.json()

    if (!email || !agent_slug) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const cleanEmail = String(email).toLowerCase().trim()
    const cleanSlug = String(agent_slug).toLowerCase().trim()
    const supabase = createServiceClient()
    const resend = new Resend(process.env.RESEND_API_KEY)

    const { data: claim } = await supabase
      .from('agent_claims')
      .select('id, claimant_name, claimant_email, agent_name, status')
      .eq('agent_slug', cleanSlug)
      .eq('claimant_email', cleanEmail)
      .in('status', ['approved', 'pending'])
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (claim && claim.status === 'approved') {
      // Known claimant: send the rotating 24-hour access link
      const accessToken = randomBytes(32).toString('hex')
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

      await supabase
        .from('agent_claims')
        .update({ access_token: accessToken, access_token_expires: expires })
        .eq('id', claim.id)

      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://theaiagentindex.com'
      const magicLink = siteUrl + '/vendor/dashboard/' + cleanSlug + '?token=' + accessToken

      const text =
`Hi,

Here is your dashboard access link for ${claim.agent_name}:
${magicLink}

The link works for 24 hours and is replaced each time you request a new one. If you did not request this, you can ignore this email.

Heather
The AI Agent Index`

      try {
        await resend.emails.send({
          from: 'Heather at The AI Agent Index <hello@theaiagentindex.com>',
          to: claim.claimant_email,
          subject: 'Your dashboard link: ' + claim.agent_name,
          text,
          html: `
            <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#111827;font-size:15px;line-height:1.6">
              <p>Hi,</p>
              <p>Here is your dashboard access link for <strong>${esc(claim.agent_name)}</strong>:</p>
              <p><a href="${magicLink}" style="display:inline-block;padding:12px 24px;background:#2563EB;color:white;border-radius:8px;text-decoration:none;font-weight:600">Access vendor dashboard</a></p>
              <p style="color:#6B7280;font-size:13px">The link works for 24 hours and is replaced each time you request a new one. If you did not request this, you can ignore this email.</p>
              <p>Heather<br/>The AI Agent Index</p>
            </div>
          `,
        })
      } catch (emailErr) {
        console.error('Failed to send vendor access email:', emailErr)
      }
    } else if (!claim) {
      // Unknown email: treat as an access/claim request, but only for real agents
      const { data: agent } = await supabase
        .from('agents')
        .select('id, name, slug')
        .eq('slug', cleanSlug)
        .eq('is_active', true)
        .single()

      if (agent) {
        await supabase.from('agent_claims').insert({
          agent_id: agent.id,
          agent_slug: agent.slug,
          agent_name: agent.name,
          claimant_name: cleanEmail.split('@')[0],
          claimant_email: cleanEmail,
          company_domain: cleanEmail.split('@')[1],
          domain_verified: false,
          status: 'pending',
          verification_token: randomBytes(32).toString('hex'),
        })

        try {
          await resend.emails.send({
            from: 'The AI Agent Index <hello@theaiagentindex.com>',
            to: 'hello@theaiagentindex.com',
            subject: 'Dashboard access request needs review: ' + agent.name,
            html: '<p><strong>' + esc(cleanEmail) + '</strong> requested vendor dashboard access for <strong>' + esc(agent.name) + '</strong> (' + esc(agent.slug) + ') but does not match an approved claim.</p>' +
              '<p>A pending claim has been added to your queue. Approve it to grant access, or reject it.</p>' +
              '<p><a href="https://theaiagentindex.com/admin/reviews">Review claims in admin</a></p>',
          })
        } catch (emailErr) {
          console.error('Failed to send access request notification:', emailErr)
        }
      }
    }
    // If a pending claim already exists, do nothing: you have already been notified.

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}