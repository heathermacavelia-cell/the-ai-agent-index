export const dynamic = 'force-dynamic'
import { createServiceClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

function checkAuth(req: NextRequest) {
  const pass = req.headers.get('x-admin-password')
  return pass === process.env.ADMIN_PASSWORD
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = createServiceClient()
  const { data } = await supabase.from('agent_claims').select('*').order('created_at', { ascending: false })
  return NextResponse.json(data ?? [])
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { claim_id, action } = await req.json()
  if (!claim_id || !['approve', 'reject'].includes(action)) {
    return NextResponse.json({ error: 'Invalid' }, { status: 400 })
  }
  const supabase = createServiceClient()

  if (action === 'approve') {
    const { data: claim } = await supabase
      .from('agent_claims')
      .select('agent_id, claimant_email, agent_name, agent_slug')
      .eq('id', claim_id)
      .single()

    if (claim) {
      await supabase.from('agents').update({ is_verified: true, vendor_claimed: true }).eq('id', claim.agent_id)

      // RULING 21: the ask depends on the tier this listing already holds.
      // agent_claims does not carry it, so read it off the agent row.
      const { data: tierRow } = await supabase
        .from('agents')
        .select('submitted_tier')
        .eq('id', claim.agent_id)
        .single()
      const tier = tierRow?.submitted_tier ?? 'self'
      await supabase.from('agent_claims').update({ status: 'approved', reviewed_at: new Date().toISOString() }).eq('id', claim_id)

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

Your vendor dashboard has logo upload, listing updates, and visibility options:
${site}/vendor

${tier === 'managed' || tier === 'legacy'
  ? 'Your listing is audited and kept current, so accuracy is handled. What it does not do is put you in front of buyers who are looking at someone else. Placements start at $129 a month for a permanent slot in Featured Agents and a branded banner on your own page, and every placement carries a 14-day re-audit cycle rather than 30.\nSee the placements: ' + site + '/advertise'
  : tier === 'review'
    ? 'Your badge carries the date we checked your listing, and that date is the part that ages. Editorial Managed is $99 a month and re-audits your listing every 30 days, so when your pricing moves or you ship a feature, the record AI systems read moves with it.\nSee what it includes: ' + site + '/advertise#listing'
    : 'An Editorial Review is $39 once, and what it buys is the structured data underneath your page: agent type, supported workflows and languages, deployment methods, contract and data-training terms, MCP role, and the identity links that tell an AI system your pages are all one product. Most of it never appears on the page a person reads. It is what our JSON-LD, our public API and our MCP server hand to the systems answering questions about your category.\nSee what it includes: ' + site + '/advertise#listing'}

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
              <a href="${site}/vendor" style="color:#2563EB">Open the vendor dashboard</a></p>
                            ${tier === 'managed' || tier === 'legacy'
                ? '<p>Your listing is audited and kept current, so accuracy is handled. What it does not do is put you in front of buyers who are looking at someone else. <strong>Placements start at $129 a month</strong> for a permanent slot in Featured Agents and a branded banner on your own page, and every placement carries a 14-day re-audit cycle rather than 30.<br/><a href="' + site + '/advertise" style="color:#2563EB">See the placements</a></p>'
                : tier === 'review'
                  ? '<p>Your badge carries the date we checked your listing, and that date is the part that ages. <strong>Editorial Managed is $99 a month</strong> and re-audits your listing every 30 days, so when your pricing moves or you ship a feature, the record AI systems read moves with it.<br/><a href="' + site + '/advertise#listing" style="color:#2563EB">See what it includes</a></p>'
                  : '<p><strong>An Editorial Review is $39 once</strong>, and what it buys is the structured data underneath your page: agent type, supported workflows and languages, deployment methods, contract and data-training terms, MCP role, and the identity links that tell an AI system your pages are all one product. Most of it never appears on the page a person reads. It is what our JSON-LD, our public API and our MCP server hand to the systems answering questions about your category.<br/><a href="' + site + '/advertise#listing" style="color:#2563EB">See what it includes</a></p>'}
              <p style="font-size:13px;color:#6B7280">Ratings and rankings are the one thing money never touches. Those are earned, and we do not sell them.</p>
              <p>Questions? Just reply to this email.</p>
              <p>Heather<br/>The AI Agent Index</p>
            </div>
          `,
        })
      } catch (emailErr) {
        console.error('Failed to send claim approval email:', emailErr)
      }
    }
  } else {
    await supabase.from('agent_claims').update({ status: 'rejected', reviewed_at: new Date().toISOString() }).eq('id', claim_id)
  }
  return NextResponse.json({ ok: true })
}