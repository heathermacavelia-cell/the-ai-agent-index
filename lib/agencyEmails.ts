// The "your listing is live" email for agencies. Added 2026-10-06 (Heather):
// approving an agency sent nothing, so a vendor never learned their listing was
// up. Same upsell logic as the agent approval email in
// app/api/admin/approve-agent/route.ts, on the agency ladder:
//   free (submitted_tier 'self')      -> the $39 Independent Review, then Featured Listing
//   chose the review ('review')        -> what the review adds and when, then Featured Listing
//   already reviewed / legacy          -> Featured Listing only
// Every price and link comes from lib/vendorPlans. Never hardcode one here.
import { Resend } from 'resend'
import {
  AGENCY_REVIEW_PAYMENT_LINK,
  AGENCY_REVIEW_PRICE,
  AGENCY_REVIEW_TIMELINE,
  getPlacement,
} from '@/lib/vendorPlans'

export interface AgencyEmailRow {
  name: string
  slug: string
  contact_email: string | null
  submission_notes: string | null
  submitted_tier: string | null
  listing_tier: string | null
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

// Returns true when an email was handed to Resend, false when there was no
// address to send to. Throws on a send error so the caller can report it.
export async function sendAgencyLiveEmail(agency: AgencyEmailRow): Promise<boolean> {
  if (!agency.contact_email) return false

  const site = 'https://theaiagentindex.com'
  const listingUrl = site + '/agencies/' + agency.slug
  const hubUrl = site + '/ai-automation-agencies'
  const placementsUrl = site + '/advertise#placements'
  const featured = getPlacement('featured-listing')

  // Approve sets Claimed only on a self-submitted row (app/api/admin/agencies).
  const claimed = (agency.submission_notes ?? '').startsWith('Vendor submission')
  const reviewed = agency.listing_tier === 'reviewed' || agency.listing_tier === 'legacy'
  const choseReview = !reviewed && agency.submitted_tier === 'review'

  const claimedText = claimed
    ? 'It shows as Claimed, because you submitted it yourself. '
    : ''

  // FREE. Every claim below is what the code does for listing_tier 'reviewed':
  // the badge and its date (lib/agencyTier reviewedLabel), the place above free
  // listings (compareAgencies), the self-hosted logo (paidAgencyLogo) and the
  // plain website link instead of rel="ugc" (hasReviewedLink).
  const reviewOfferText =
`Free listings stay free. An Independent Review is ${AGENCY_REVIEW_PRICE} once, and we complete it within ${AGENCY_REVIEW_TIMELINE} of payment. We check your listing against your live site, and it adds the Independently Reviewed badge with the date we checked it, a place above free listings in the directory, your own logo on your card and listing page, and a plain link to your website (until then the link is marked rel="ugc", as it is on every listing we have not reviewed):
${AGENCY_REVIEW_PAYMENT_LINK}`

  const reviewOfferHtml =
`<p>Free listings stay free. <strong>An Independent Review is ${AGENCY_REVIEW_PRICE} once</strong>, and we complete it within ${AGENCY_REVIEW_TIMELINE} of payment. We check your listing against your live site, and it adds the Independently Reviewed badge with the date we checked it, a place above free listings in the directory, your own logo on your card and listing page, and a plain link to your website (until then the link is marked rel="ugc", as it is on every listing we have not reviewed).<br/>
<a href="${AGENCY_REVIEW_PAYMENT_LINK}" style="color:#2563EB">Get an Independent Review</a></p>`

  // CHOSE THE REVIEW ON THE FORM. Choosing it is not paying for it, and paying
  // is not the review being done, so this says what happens next, not that it has.
  const reviewPendingText =
`You chose the ${AGENCY_REVIEW_PRICE} Independent Review. Once your payment is confirmed we complete it within ${AGENCY_REVIEW_TIMELINE}, and the Independently Reviewed badge, the review date and your own logo appear on your listing then. If you have not paid yet, this is the link:
${AGENCY_REVIEW_PAYMENT_LINK}`

  const reviewPendingHtml =
`<p>You chose the <strong>${AGENCY_REVIEW_PRICE} Independent Review</strong>. Once your payment is confirmed we complete it within ${AGENCY_REVIEW_TIMELINE}, and the Independently Reviewed badge, the review date and your own logo appear on your listing then. If you have not paid yet, this is the link:<br/>
<a href="${AGENCY_REVIEW_PAYMENT_LINK}" style="color:#2563EB">Pay for the Independent Review</a></p>`

  // SPONSORED. Featured Listing is the one placement sold to agencies
  // (availability 'Agents + Agencies'); agencies get the banner, not the homepage spot.
  const featuredText =
`${reviewed ? 'Your listing is reviewed. ' : 'If you want buyers to see you first, '}Featured Listing is ${featured.price} a month: a full-width branded banner on your listing with your logo, your hook and one call-to-action button, and we re-check your listing every 14 days and send you a short note of what we checked and changed. It is labeled Sponsored. Agency listings get the banner but not the homepage Featured spot:
${placementsUrl}`

  const featuredHtml =
`<p>${reviewed ? 'Your listing is reviewed. ' : 'If you want buyers to see you first, '}<strong>Featured Listing is ${featured.price} a month</strong>: a full-width branded banner on your listing with your logo, your hook and one call-to-action button, and we re-check your listing every 14 days and send you a short note of what we checked and changed. It is labeled Sponsored. Agency listings get the banner but not the homepage Featured spot.<br/>
<a href="${placementsUrl}" style="color:#2563EB">See what it includes</a></p>`

  const upgradeText = reviewed
    ? featuredText
    : (choseReview ? reviewPendingText : reviewOfferText) + '\n\n' + featuredText
  const upgradeHtml = reviewed
    ? featuredHtml
    : (choseReview ? reviewPendingHtml : reviewOfferHtml) + featuredHtml

  const text =
`Hi,

${agency.name} has been approved and is now live in the AI Automation Agencies directory on The AI Agent Index:
${listingUrl}

${claimedText}You can see it alongside the other agencies here:
${hubUrl}

Two things you can do right now:

1. Collect reviews. Clients can leave a review on your listing page, and every review is checked before it is published. Share this link with the clients you have worked with:
${listingUrl}

2. Keep it accurate. If anything on your listing is out of date, reply to this email and we will update it.

${upgradeText}

Ratings and rankings are the one thing money never touches. Those are earned, and we do not sell them.

Questions? Just reply to this email.

Heather
The AI Agent Index`

  const n = esc(agency.name)
  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#111827;font-size:15px;line-height:1.6">
      <p>Hi,</p>
      <p><strong>${n}</strong> has been approved and is now live in the AI Automation Agencies directory on The AI Agent Index:</p>
      <p><a href="${listingUrl}" style="color:#2563EB">${listingUrl.replace('https://', '')}</a></p>
      <p>${claimedText}You can see it alongside the other agencies in the <a href="${hubUrl}" style="color:#2563EB">directory</a>.</p>
      <p style="margin-top:20px"><strong>Two things you can do right now:</strong></p>
      <p><strong>1. Collect reviews.</strong> Clients can leave a review on your listing page, and every review is checked before it is published. Share your listing link with the clients you have worked with.</p>
      <p><strong>2. Keep it accurate.</strong> If anything on your listing is out of date, reply to this email and we will update it.</p>
      ${upgradeHtml}
      <p style="font-size:13px;color:#6B7280">Ratings and rankings are the one thing money never touches. Those are earned, and we do not sell them.</p>
      <p>Questions? Just reply to this email.</p>
      <p>Heather<br/>The AI Agent Index</p>
    </div>
  `

  const resend = new Resend(process.env.RESEND_API_KEY)
  const { error } = await resend.emails.send({
    from: 'Heather at The AI Agent Index <hello@theaiagentindex.com>',
    to: agency.contact_email,
    subject: agency.name + ' is now live on The AI Agent Index',
    text,
    html,
  })
  if (error) throw new Error(typeof error === 'string' ? error : (error as { message?: string }).message ?? 'Resend error')
  return true
}
