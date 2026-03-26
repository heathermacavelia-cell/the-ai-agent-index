import { createClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { agent_slug, agent_name, claimant_name, claimant_email, claimant_title, company_domain } = body

    if (!agent_slug || !agent_name || !claimant_name || !claimant_email || !company_domain) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const emailDomain = claimant_email.split('@')[1]?.toLowerCase()
    const claimedDomain = company_domain.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '').trim()
    const domainMatch = emailDomain === claimedDomain

    const supabase = createClient()
    const { data: agent } = await supabase.from('agents').select('id').eq('slug', agent_slug).single()
    if (!agent) return NextResponse.json({ error: 'Agent not found' }, { status: 404 })

    const { data: existing } = await supabase.from('agent_claims')
      .select('id, status')
      .eq('agent_id', agent.id)
      .eq('claimant_email', claimant_email)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'A claim from this email already exists for this listing' }, { status: 409 })
    }

    const verification_token = randomBytes(32).toString('hex')

    const { error: insertError } = await supabase.from('agent_claims').insert({
      agent_id: agent.id,
      agent_slug,
      agent_name,
      claimant_name,
      claimant_email,
      claimant_title: claimant_title || null,
      company_domain: claimedDomain,
      domain_verified: domainMatch,
      status: 'pending',
      verification_token,
    })

    if (insertError) {
      console.error('Insert error:', insertError)
      return NextResponse.json({ error: 'Failed to submit claim' }, { status: 500 })
    }

    const verifyUrl = process.env.NEXT_PUBLIC_SITE_URL + '/claim/verify?token=' + verification_token

    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + process.env.RESEND_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'The AI Agent Index <noreply@theaiagentindex.com>',
        to: claimant_email,
        subject: 'Verify your claim for ' + agent_name + ' on The AI Agent Index',
        html: '<div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px">' +
          '<h2 style="font-size:1.25rem;font-weight:700;color:#111827;margin-bottom:8px">Verify your listing claim</h2>' +
          '<p style="color:#4B5563;margin-bottom:24px">Hi ' + claimant_name + ', you submitted a claim for <strong>' + agent_name + '</strong> on The AI Agent Index. Click the button below to verify your email and submit your claim for review.</p>' +
          (domainMatch ? '<p style="color:#16A34A;background:#F0FDF4;border:1px solid #BBF7D0;padding:12px 16px;border-radius:8px;margin-bottom:24px;font-size:0.875rem">Your email domain matches the company domain - this will speed up verification.</p>' : '') +
          '<a href="' + verifyUrl + '" style="display:inline-block;background:#2563EB;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:0.9375rem">Verify my email</a>' +
          '<p style="color:#9CA3AF;font-size:0.75rem;margin-top:32px">If you did not submit this claim, you can ignore this email. This link expires in 48 hours.</p>' +
          '</div>',
      }),
    })

    if (!emailRes.ok) {
      console.error('Resend error:', await emailRes.text())
    }

    return NextResponse.json({ success: true, domain_match: domainMatch })
  } catch (err) {
    console.error('Claims POST error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
