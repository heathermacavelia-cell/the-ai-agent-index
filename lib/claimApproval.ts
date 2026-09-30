// Claim approval, shared by the admin Claims tab and the automatic
// domain-match path on /claim/verify, so both send the same email.
import { randomBytes } from 'crypto'
import { Resend } from 'resend'
import { createServiceClient } from '@/lib/supabase'
import { getPlacement, getTier, EDITORIAL_REVIEW_PAYMENT_LINK } from '@/lib/vendorPlans'

type Supa = ReturnType<typeof createServiceClient>

// Issue a rotating 24-hour dashboard token on a claim and return the link.
// Same token scheme as /api/vendor/verify: requesting a new link replaces this one.
export async function createDashboardLink(supabase: Supa, claimId: string, slug: string): Promise<string | null> {
  const accessToken = randomBytes(32).toString('hex')
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  const { error } = await supabase
    .from('agent_claims')
    .update({ access_token: accessToken, access_token_expires: expires })
    .eq('id', claimId)
  if (error) {
    console.error('Failed to set dashboard token:', error)
    return null
  }
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://theaiagentindex.com'
  return siteUrl + '/vendor/dashboard/' + slug + '?token=' + accessToken
}

// Approve a claim: mark the listing claimed, approve the claim row, and email the
// claimant the approval with a dashboard link. Returns false if the claim is missing.
export async function approveClaim(
  supabase: Supa,
  claimId: string,
  opts: { decision?: string } = {},
): Promise<boolean> {
  const { data: claim } = await supabase
    .from('agent_claims')
    .select('agent_id, claimant_email, agent_name, agent_slug')
    .eq('id', claimId)
    .single()

  if (!claim) return false

  await supabase.from('agents').update({ vendor_claimed: true }).eq('id', claim.agent_id)

  // RULING 21: the ask depends on the tier this listing already holds.
  // agent_claims does not carry it, so read it off the agent row.
  const { data: tierRow } = await supabase
    .from('agents')
    .select('submitted_tier')
    .eq('id', claim.agent_id)
    .single()
  const tier = tierRow?.submitted_tier ?? 'self'
  await supabase.from('agent_claims').update({
      status: 'approved',
      reviewed_at: new Date().toISOString(),
      ...(opts.decision ? { admin_decision: opts.decision, domain_verified: true } : {}),
    }).eq('id', claimId)

  // A 24-hour dashboard link goes in the approval email itself, so a vendor is
  // never left with only the /vendor request form.
  const dashboardLink = await createDashboardLink(supabase, claimId, claim.agent_slug)
  const vendorPageUrl = 'https://theaiagentindex.com/vendor?slug=' + encodeURIComponent(claim.agent_slug)

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

Your vendor dashboard has logo upload, listing updates, and visibility options. Open it here (this link works for 24 hours):
${dashboardLink ?? vendorPageUrl}
After that, get a fresh link any time at ${vendorPageUrl} with this email address.

${tier === 'managed' || tier === 'legacy'
? 'Your listing is audited and kept current, so accuracy is handled. What it does not do is put you in front of buyers who are looking at someone else. Comparison Placement (' + getPlacement('comparison-placement').price + ' a month) puts you on the comparison and alternatives pages where buyers decide, and Own the Category (' + getPlacement('own-the-category').price + ' a month, one per category) puts you at the top of your category page and on every competitor listing in it.\nSee the placements: ' + site + '/advertise#placements'
: tier === 'review'
  ? 'Your badge carries the date we checked your listing, and that date is the part that ages. Featured Listing is ' + getPlacement('featured-listing').price + ' a month: we re-audit your listing every 14 days and send you a short note of what we checked and what we changed, and it adds a spot in the homepage Featured section and a branded banner on your own page.\nSee what it includes: ' + site + '/advertise#placements'
  : 'An Editorial Review is ' + getTier('review').price + ' once, and what it buys is the structured data underneath your page: agent type, supported workflows and languages, deployment methods, contract and data-training terms, MCP role, and the identity links that tell an AI system your pages are all one product. Most of it never appears on the page a person reads. It is what our JSON-LD, our public API and our MCP server hand to the systems answering questions about your category.\nGet an Editorial Review: ' + EDITORIAL_REVIEW_PAYMENT_LINK + '\n\nIf you want buyers to see you first, Featured Listing is ' + getPlacement('featured-listing').price + ' a month and includes that audit, a re-audit every 14 days, a homepage spot and a branded banner on your own listing.\nSee the placements: ' + site + '/advertise#placements'}

Ratings and rankings are the one thing money never touches. Those are earned, and we do not sell them.

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
          <a href="${dashboardLink ?? vendorPageUrl}" style="color:#2563EB">Open the vendor dashboard</a> (this link works for 24 hours)<br/>
          <span style="font-size:13px;color:#6B7280">After that, get a fresh link any time at <a href="${vendorPageUrl}" style="color:#6B7280">theaiagentindex.com/vendor</a> with this email address.</span></p>
                        ${tier === 'managed' || tier === 'legacy'
            ? '<p>Your listing is audited and kept current, so accuracy is handled. What it does not do is put you in front of buyers who are looking at someone else. <strong>Comparison Placement (' + getPlacement('comparison-placement').price + ' a month)</strong> puts you on the comparison and alternatives pages where buyers decide, and <strong>Own the Category (' + getPlacement('own-the-category').price + ' a month, one per category)</strong> puts you at the top of your category page and on every competitor listing in it.<br/><a href="' + site + '/advertise#placements" style="color:#2563EB">See the placements</a></p>'
            : tier === 'review'
              ? '<p>Your badge carries the date we checked your listing, and that date is the part that ages. <strong>Featured Listing is ' + getPlacement('featured-listing').price + ' a month</strong>: we re-audit your listing every 14 days and send you a short note of what we checked and what we changed, and it adds a spot in the homepage Featured section and a branded banner on your own page.<br/><a href="' + site + '/advertise#placements" style="color:#2563EB">See what it includes</a></p>'
              : '<p><strong>An Editorial Review is ' + getTier('review').price + ' once</strong>, and what it buys is the structured data underneath your page: agent type, supported workflows and languages, deployment methods, contract and data-training terms, MCP role, and the identity links that tell an AI system your pages are all one product. Most of it never appears on the page a person reads. It is what our JSON-LD, our public API and our MCP server hand to the systems answering questions about your category.<br/><a href="' + EDITORIAL_REVIEW_PAYMENT_LINK + '" style="color:#2563EB">Get an Editorial Review</a></p><p>If you want buyers to see you first, <strong>Featured Listing is ' + getPlacement('featured-listing').price + ' a month</strong> and includes that audit, a re-audit every 14 days, a homepage spot and a branded banner on your own listing.<br/><a href="' + site + '/advertise#placements" style="color:#2563EB">See the placements</a></p>'}
          <p style="font-size:13px;color:#6B7280">Ratings and rankings are the one thing money never touches. Those are earned, and we do not sell them.</p>
          <p>Questions? Just reply to this email.</p>
          <p>Heather<br/>The AI Agent Index</p>
        </div>
      `,
    })
  } catch (emailErr) {
    console.error('Failed to send claim approval email:', emailErr)
  }
  return true
}
