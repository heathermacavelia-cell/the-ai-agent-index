export const dynamic = 'force-dynamic'
import { createServiceClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { randomBytes } from 'crypto'
import { isCompanyDomainMatch } from '@/lib/vendorDomain'

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
    .select('name, slug, submitter_email, short_description, website_url, favicon_domain, submitted_tier, editorial_rating')
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

  // A self-submission only proves control of the listing when the submitter's
  // email is at the product's own company domain. Free mailboxes never qualify.
  const domainMatch = isCompanyDomainMatch(agent.submitter_email, agent.favicon_domain || agent.website_url)

  // Approve: listing goes live. vendor_claimed is granted only on a real
  // domain match; is_verified stays false until the vendor confirms details.
  const { error } = await supabase
    .from('agents')
    .update({ is_active: true, vendor_claimed: domainMatch })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Create a claim for the submitter. Approved (dashboard access) on a domain
  // match; otherwise pending, so it lands in the Claims tab for review.
  if (agent.submitter_email) {
    const verification_token = randomBytes(32).toString('hex')

    const { data: existingClaim } = await supabase
      .from('agent_claims')
      .select('id')
      .eq('agent_id', id)
      .eq('claimant_email', agent.submitter_email)
      .single()

    if (!existingClaim) {
      const { error: claimError } = await supabase.from('agent_claims').insert({
        agent_id: id,
        agent_slug: agent.slug,
        agent_name: agent.name,
        claimant_name: agent.submitter_email.split('@')[0],
        claimant_email: agent.submitter_email,
        company_domain: agent.submitter_email.split('@')[1],
        domain_verified: domainMatch,
        status: domainMatch ? 'approved' : 'pending',
        reviewed_at: domainMatch ? new Date().toISOString() : null,
        admin_decision: domainMatch ? 'auto-approved-domain' : null,
        verification_token,
      })
      if (claimError) {
        console.error('Failed to create claim on agent approval:', claimError)
      }
    }

    // Vendor onboarding email: live link, badges, review flywheel, dashboard
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const site = 'https://theaiagentindex.com'
      const listingUrl = site + '/agents/' + agent.slug
      const badgesUrl = site + '/badges/' + agent.slug
      const reviewUrl = listingUrl + '#leave-review'
      const claimUrl = site + '/claim/' + agent.slug

      // RULING 21: the ask depends on what this vendor already holds. A $99
      // subscriber is never shown the $39 entry fee, and the grandfathered
      // $9.99 customer is never shown a listing tier at all.
      const tier = agent.submitted_tier ?? 'self'

      // A row with no editorial number has not been audited, and community reviews can never become
      // its displayed rating: lib/rating.ts line 140 requires editorialNumber != null before it will
      // blend. Telling an unrated vendor that reviews raise their score is a promise the code cannot
      // keep, so the review paragraph branches here rather than on tier - an audited row can still
      // be tier 'self'.
      const rated = agent.editorial_rating != null

      const reviewsLine = rated
        ? `Verified user reviews show on your listing, and once you have five they are folded into the rating buyers see.`
        : `Your listing is not rated yet. We have recorded what you publish and have not audited it, so there is no editorial score for reviews to move. Reviews show on your page as community reviews, kept separate from any editorial score, and they are part of what earns a rating when the listing is audited.`

      const upgradeText =
        tier === 'managed' || tier === 'legacy'
          ? `Your listing is audited and kept current, so accuracy is handled. What it does not do is put you in front of buyers who are looking at someone else. Placements start at $129 a month for a permanent slot in Featured Agents and a branded banner on your own page, and every placement carries a 14-day re-audit cycle rather than 30:
${site}/advertise`
          : tier === 'review'
            ? `Your badge carries the date we checked your listing, and that date is the part that ages. Editorial Managed is $99 a month and re-audits your listing every 30 days, so when your pricing moves or you ship a feature, the record AI systems read moves with it:
${site}/advertise#listing`
            : `Free listings stay free. An Editorial Review is $39 once, and what it buys is the structured data underneath your page: agent type, supported workflows and languages, deployment methods, contract and data-training terms, MCP role, and the identity links that tell an AI system your pages are all one product. Most of it never appears on the page a person reads. It is what our JSON-LD, our public API and our MCP server hand to the systems answering questions about your category:
${site}/advertise#listing`

      const upgradeHtml =
        tier === 'managed' || tier === 'legacy'
          ? `<p>Your listing is audited and kept current, so accuracy is handled. What it does not do is put you in front of buyers who are looking at someone else. <strong>Placements start at $129 a month</strong> for a permanent slot in Featured Agents and a branded banner on your own page, and every placement carries a 14-day re-audit cycle rather than 30.<br/>
            <a href="${site}/advertise" style="color:#2563EB">See the placements</a></p>`
          : tier === 'review'
            ? `<p>Your badge carries the date we checked your listing, and that date is the part that ages. <strong>Editorial Managed is $99 a month</strong> and re-audits your listing every 30 days, so when your pricing moves or you ship a feature, the record AI systems read moves with it.<br/>
            <a href="${site}/advertise#listing" style="color:#2563EB">See what it includes</a></p>`
            : `<p>Free listings stay free. <strong>An Editorial Review is $39 once</strong>, and what it buys is the structured data underneath your page: agent type, supported workflows and languages, deployment methods, contract and data-training terms, MCP role, and the identity links that tell an AI system your pages are all one product. Most of it never appears on the page a person reads. It is what our JSON-LD, our public API and our MCP server hand to the systems answering questions about your category.<br/>
            <a href="${site}/advertise#listing" style="color:#2563EB">See what it includes</a></p>`

      const manageText = domainMatch
        ? `3. Manage your listing. Your vendor dashboard has logo upload and listing updates:
${site}/vendor
Sign in with this email and your agent slug: ${agent.slug}`
        : `3. Manage your listing. To get vendor dashboard access, submit a claim and we will verify you:
${claimUrl}
Automatic access requires an email address at your company domain, so a claim from a free email account is reviewed by hand.`

      const manageHtml = domainMatch
        ? `<p><strong>3. Manage your listing.</strong> Your vendor dashboard has logo upload and listing updates.<br/>
            <a href="${site}/vendor" style="color:#2563EB">Open the vendor dashboard</a><br/>
            <span style="color:#6B7280;font-size:13px">Sign in with this email and your agent slug: ${agent.slug}</span></p>`
        : `<p><strong>3. Manage your listing.</strong> To get vendor dashboard access, submit a claim and we will verify you.<br/>
            <a href="${claimUrl}" style="color:#2563EB">Claim your listing</a><br/>
            <span style="color:#6B7280;font-size:13px">Automatic access requires an email address at your company domain, so a claim from a free email account is reviewed by hand.</span></p>`

      const text =
`Hi,

${agent.name} has been approved and is now live on The AI Agent Index:
${listingUrl}

Three things you can do right now:

1. Grab your badges. Your listing has earned embeddable badges for your own site. They are free, update automatically, and link buyers back to your listing:
${badgesUrl}

2. Collect reviews. ${reviewsLine} Share this link with your customers:
${reviewUrl}
How scoring works: ${site}/methodology#s5

${manageText}

${upgradeText}

Ratings and rankings are the one thing money never touches. Those are earned, and we do not sell them.

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
                  <p><strong>2. Collect reviews.</strong> ${reviewsLine} Share this link with your customers:<br/>
            <a href="${reviewUrl}" style="color:#2563EB">${listingUrl.replace('https://', '')}#leave-review</a><br/>
            <a href="${site}/methodology#s5" style="color:#6B7280;font-size:13px">How scoring works</a></p>
            ${manageHtml}
            ${upgradeHtml}
            <p style="font-size:13px;color:#6B7280">Ratings and rankings are the one thing money never touches. Those are earned, and we do not sell them.</p>
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