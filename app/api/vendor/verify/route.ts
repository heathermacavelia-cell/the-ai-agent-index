import { createServiceClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { randomBytes } from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const { email, agent_slug } = await req.json()

    if (!email || !agent_slug) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createServiceClient()

    const { data: claim } = await supabase
      .from('agent_claims')
      .select('id, claimant_name, claimant_email, agent_name')
      .eq('agent_slug', agent_slug.toLowerCase().trim())
      .eq('claimant_email', email.toLowerCase().trim())
      .eq('status', 'approved')
      .single()

    // Anti-enumeration: identical response whether or not a claim exists.
    if (claim) {
      const accessToken = randomBytes(32).toString('hex')
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

      await supabase
        .from('agent_claims')
        .update({ access_token: accessToken, access_token_expires: expires })
        .eq('id', claim.id)

      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://theaiagentindex.com'
      const magicLink = siteUrl + '/vendor/dashboard/' + agent_slug + '?token=' + accessToken

      const text =
`Hi,

Here is your dashboard access link for ${claim.agent_name}:
${magicLink}

The link works for 24 hours and is replaced each time you request a new one. If you did not request this, you can ignore this email.

Heather
The AI Agent Index`

      try {
        const resend = new Resend(process.env.RESEND_API_KEY)
        await resend.emails.send({
          from: 'Heather at The AI Agent Index <hello@theaiagentindex.com>',
          to: claim.claimant_email,
          subject: 'Your dashboard link: ' + claim.agent_name,
          text,
          html: `
            <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#111827;font-size:15px;line-height:1.6">
              <p>Hi,</p>
              <p>Here is your dashboard access link for <strong>${claim.agent_name}</strong>:</p>
              <p><a href="${magicLink}" style="display:inline-block;padding:12px 24px;background:#2563EB;color:white;border-radius:8px;text-decoration:none;font-weight:600">Access vendor dashboard</a></p>
              <p style="color:#6B7280;font-size:13px">The link works for 24 hours and is replaced each time you request a new one. If you did not request this, you can ignore this email.</p>
              <p>Heather<br/>The AI Agent Index</p>
            </div>
          `,
        })
      } catch (emailErr) {
        console.error('Failed to send vendor access email:', emailErr)
      }
    } else {
      console.log('Vendor access requested with no matching claim:', agent_slug, email)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}