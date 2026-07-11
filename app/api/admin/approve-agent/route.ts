export const dynamic = 'force-dynamic'
import { createServiceClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { randomBytes } from 'crypto'

export async function POST(req: NextRequest) {
  const pass = req.headers.get('x-admin-password')
  if (pass !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const supabase = createServiceClient()

  const { data: agent, error: fetchError } = await supabase
    .from('agents')
    .select('name, slug, submitter_email, short_description')
    .eq('id', id)
    .single()

  if (fetchError || !agent) {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
  }

  // Refuse to approve a listing that violates the description constraint.
  // Fix it in Supabase or the admin editor first, then approve.
  const shortDesc = agent.short_description ?? ''
  if (shortDesc.length < 120 || shortDesc.length > 220) {
    return NextResponse.json(
      { error: 'short_description is ' + shortDesc.length + ' chars; must be 120 to 220. Fix the listing before approving.' },
      { status: 400 }
    )
  }

  // Approve: listing goes live. is_verified stays false until the vendor
  // confirms their details through the claim flow.
  const { error } = await supabase
    .from('agents')
    .update({ is_active: true })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Auto-create an approved claim for the submitter so they can access the vendor dashboard
  if (agent.submitter_email) {
    const verification_token = randomBytes(32).toString('hex')

    const { data: existingClaim } = await supabase
      .from('agent_claims')
      .select('id')
      .eq('agent_id', id)
      .eq('claimant_email', agent.submitter_email)
      .single()

    if (!existingClaim) {
      await supabase.from('agent_claims').insert({
        agent_id: id,
        agent_slug: agent.slug,
        agent_name: agent.name,
        claimant_name: agent.submitter_email.split('@')[0],
        claimant_email: agent.submitter_email,
        company_domain: agent.submitter_email.split('@')[1],
        domain_verified: false,
        status: 'approved',
        verification_token,
      })
    }

    // Vendor onboarding email: personal style, plain subject, text part included
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const listingUrl = 'https://theaiagentindex.com/agents/' + agent.slug

      const text =
`Hi,

${agent.name} has been approved and is now live on The AI Agent Index:
${listingUrl}

Your vendor dashboard is ready. From there you can confirm your listing details to earn the Verified badge, add your logo, and see when your listing is next re-verified:
https://theaiagentindex.com/vendor

Sign in with the email you submitted with (${agent.submitter_email}) and your agent slug (${agent.slug}).

Optional paid upgrades like Vendor Managed live in the dashboard. They never affect your rating or placement.

Questions? Just reply to this email.

Heather
The AI Agent Index`

      await resend.emails.send({
        from: 'Heather at The AI Agent Index <hello@theaiagentindex.com>',
        to: agent.submitter_email,
        subject: agent.name + ' is now live on The AI Agent Index',
        text,
        html: `
          <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#111827;font-size:15px;line-height:1.6">
            <p>Hi,</p>
            <p><strong>${agent.name}</strong> has been approved and is now live on The AI Agent Index:</p>
            <p><a href="${listingUrl}" style="color:#2563EB">${listingUrl.replace('https://', '')}</a></p>
            <p>Your vendor dashboard is ready. From there you can confirm your listing details to earn the Verified badge, add your logo, and see when your listing is next re-verified:</p>
            <p><a href="https://theaiagentindex.com/vendor" style="color:#2563EB">theaiagentindex.com/vendor</a></p>
            <p style="font-size:13px;color:#6B7280">Sign in with the email you submitted with (${agent.submitter_email}) and your agent slug (${agent.slug}).</p>
            <p>Optional paid upgrades like Vendor Managed live in the dashboard. They never affect your rating or placement.</p>
            <p>Questions? Just reply to this email.</p>
            <p>Heather<br/>The AI Agent Index</p>
          </div>
        `,
      })
    } catch (emailErr) {
      console.error('Failed to send vendor onboarding email:', emailErr)
    }
  }

  return NextResponse.json({ success: true })
}