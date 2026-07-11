import { createServiceClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const VALID_TIERS: Record<string, string> = {
  'premium-featured': 'Premium Featured Listing ($79/mo)',
  'comparison-placement': 'Comparison Placement ($149/mo)',
  'category-sponsor': 'Category Sponsor ($249/mo)',
  'listing-banner': 'Agent Listing Banner ($349/mo)',
  'demo-video': 'Demo Video Add-On ($29/mo bundled, $49/mo standalone)',
}

function esc(s: string): string {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export async function POST(req: NextRequest) {
  try {
    const { agent_slug, token, tier } = await req.json()
    if (!agent_slug || !token || !VALID_TIERS[tier]) {
      return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 })
    }

    const supabase = createServiceClient()

    const { data: claim } = await supabase
      .from('agent_claims')
      .select('id, claimant_email, claimant_name, agent_name, access_token_expires')
      .eq('agent_slug', agent_slug)
      .eq('access_token', token)
      .eq('status', 'approved')
      .single()

    if (!claim || !claim.access_token_expires || new Date(claim.access_token_expires) < new Date()) {
      return NextResponse.json({ error: 'Invalid or expired access link' }, { status: 401 })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'The AI Agent Index <hello@theaiagentindex.com>',
      to: 'hello@theaiagentindex.com',
      replyTo: claim.claimant_email,
      subject: 'Ad inquiry: ' + claim.agent_name + ' wants ' + VALID_TIERS[tier],
      html: '<p><strong>' + esc(claim.claimant_email) + '</strong> requested information about <strong>' + esc(VALID_TIERS[tier]) + '</strong> for <strong>' + esc(claim.agent_name) + '</strong> (' + esc(agent_slug) + ') from the vendor dashboard.</p>' +
        '<p>Hit reply to respond directly to the vendor.</p>',
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}