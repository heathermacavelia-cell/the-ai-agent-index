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
  const shortDesc = agent.short_description ?? ''
  if (shortDesc.length < 120 || shortDesc.length > 220) {
    return NextResponse.json(
      { error: 'short_description is ' + shortDesc.length + ' chars; must be 120 to 220. Fix the listing before approving.' },
      { status: 400 }
    )
  }

 // Approve: listing goes live. Self-submitted listings count as claimed
  // (the vendor identified themselves by submitting). is_verified stays
  // false until they confirm their details through the dashboard.
  const { error } = await supabase
    .from('agents')
    .update({ is_active: true, vendor_claimed: Boolean(agent.submitter_email) })
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

    // Vendor onboarding email: live link, badges, review flywheel, dashboard
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const site = 'https://theaiagentindex.com'
      const listingUrl = site + '/agents/' + agent.slug
      const badgesUrl = site + '/badges/' + agent.slug
      const reviewUrl = listingUrl + '#leave-review'

      const text =
`Hi,

${agent.name} has been approved and is now live on The AI Agent Index:
${listingUrl}

Three things you can do right now:

1. Grab your badges. Your listing has earned embeddable badges for your own site. They are free, update automatically, and link buyers back to your listing:
${badgesUrl}

2. Collect reviews. New listings start On Our Radar without a public score until there is independent evidence. Verified user reviews unlock and raise your displayed rating. Share this link with your customers:
${reviewUrl}
How scoring works: ${site}/methodology#s5

3. Manage your listing. Your vendor dashboard has logo upload, listing updates, and optional visibility upgrades from $9.99/mo (paid options never affect your rating):
${site}/vendor
Sign in with this email and your agent slug: ${agent.slug}

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
            <p style="margin-top:20px"><strong>Three things you can do right now:</strong></p>
            <p><strong>1. Grab your badges.</strong> Your listing has earned embeddable badges for your own site. They are free, update automatically, and link buyers back to your listing.<br/>
            <a href="${badgesUrl}" style="color:#2563EB">Get your embed codes</a></p>
            <p><strong>2. Collect reviews.</strong> New listings start On Our Radar without a public score until there is independent evidence. Verified user reviews unlock and raise your displayed rating. Share this link with your customers:<br/>
            <a href="${reviewUrl}" style="color:#2563EB">${listingUrl.replace('https://', '')}#leave-review</a><br/>
            <a href="${site}/methodology#s5" style="color:#6B7280;font-size:13px">How scoring works</a></p>
            <p><strong>3. Manage your listing.</strong> Your vendor dashboard has logo upload, listing updates, and optional visibility upgrades from $9.99/mo. Paid options never affect your rating.<br/>
            <a href="${site}/vendor" style="color:#2563EB">Open the vendor dashboard</a><br/>
            <span style="color:#6B7280;font-size:13px">Sign in with this email and your agent slug: ${agent.slug}</span></p>
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