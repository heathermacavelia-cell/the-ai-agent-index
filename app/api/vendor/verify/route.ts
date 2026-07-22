import { createServiceClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { randomBytes } from 'crypto'

function esc(s: string): string {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// Free/public mailbox providers: never treat a shared domain as proof of company control.
const PUBLIC_EMAIL_DOMAINS = new Set([
  'gmail.com', 'googlemail.com', 'outlook.com', 'hotmail.com', 'hotmail.co.uk',
  'live.com', 'msn.com', 'yahoo.com', 'yahoo.co.uk', 'ymail.com', 'icloud.com',
  'me.com', 'mac.com', 'aol.com', 'proton.me', 'protonmail.com', 'pm.me',
  'gmx.com', 'gmx.net', 'mail.com', 'zoho.com', 'yandex.com', 'yandex.ru',
  'fastmail.com', 'hey.com', 'tutanota.com', 'qq.com', '163.com', '126.com',
])

function normDomain(d: string | null | undefined): string {
  return String(d || '').toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '').trim()
}

export async function POST(req: NextRequest) {
  try {
    const { email, agent_slug } = await req.json()

    if (!email || !agent_slug) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const cleanEmail = String(email).toLowerCase().trim()
    const cleanSlug = String(agent_slug).toLowerCase().trim()
    const emailDomain = normDomain(cleanEmail.split('@')[1])
    const supabase = createServiceClient()
    const resend = new Resend(process.env.RESEND_API_KEY)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://theaiagentindex.com'

    // Issue a rotating 24-hour access link for an approved claim and email it to the claimant.
    async function grantAccess(claimId: string, agentName: string, toEmail: string) {
      const accessToken = randomBytes(32).toString('hex')
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

      await supabase
        .from('agent_claims')
        .update({ access_token: accessToken, access_token_expires: expires })
        .eq('id', claimId)

      const magicLink = siteUrl + '/vendor/dashboard/' + cleanSlug + '?token=' + accessToken

      const text =
`Hi,

Here is your dashboard access link for ${agentName}:
${magicLink}

The link works for 24 hours and is replaced each time you request a new one. If you did not request this, you can ignore this email.

Heather
The AI Agent Index`

      try {
        await resend.emails.send({
          from: 'Heather at The AI Agent Index <hello@theaiagentindex.com>',
          to: toEmail,
          subject: 'Your dashboard link: ' + agentName,
          text,
          html: `
            <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#111827;font-size:15px;line-height:1.6">
              <p>Hi,</p>
              <p>Here is your dashboard access link for <strong>${esc(agentName)}</strong>:</p>
              <p><a href="${magicLink}" style="display:inline-block;padding:12px 24px;background:#2563EB;color:white;border-radius:8px;text-decoration:none;font-weight:600">Access vendor dashboard</a></p>
              <p style="color:#6B7280;font-size:13px">The link works for 24 hours and is replaced each time you request a new one. If you did not request this, you can ignore this email.</p>
              <p>Heather<br/>The AI Agent Index</p>
            </div>
          `,
        })
      } catch (emailErr) {
        console.error('Failed to send vendor access email:', emailErr)
      }
    }

    // 1. Exact-email lookup (existing behavior).
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
      await grantAccess(claim.id, claim.agent_name, cleanEmail)
      return NextResponse.json({ success: true })
    }

    // Need the agent for both domain authorization and the review path.
    const { data: agent } = await supabase
      .from('agents')
      .select('id, name, slug, favicon_domain')
      .eq('slug', cleanSlug)
      .eq('is_active', true)
      .single()

    if (!agent) {
      // Unknown/inactive agent: do nothing, as before.
      return NextResponse.json({ success: true })
    }

    // 2. Domain-authorization fallback: a non-public email domain that matches the
    //    agent's own root domain, or the domain of any already-approved claim.
    const agentDomain = normDomain(agent.favicon_domain)
    let domainAuthorized = false
    if (emailDomain && !PUBLIC_EMAIL_DOMAINS.has(emailDomain)) {
      if (agentDomain && agentDomain === emailDomain) {
        domainAuthorized = true
      } else {
        const { data: approvedClaims } = await supabase
          .from('agent_claims')
          .select('claimant_email')
          .eq('agent_slug', cleanSlug)
          .eq('status', 'approved')
        domainAuthorized = (approvedClaims || []).some(
          (c) => normDomain(String(c.claimant_email || '').split('@')[1]) === emailDomain
        )
      }
    }

    if (domainAuthorized) {
      let claimId = claim?.id
      if (claimId) {
        // Upgrade the requester's existing pending row to approved.
        await supabase
          .from('agent_claims')
          .update({
            status: 'approved',
            domain_verified: true,
            reviewed_at: new Date().toISOString(),
            admin_decision: 'auto-approved-domain',
          })
          .eq('id', claimId)
      } else {
        const { data: inserted } = await supabase
          .from('agent_claims')
          .insert({
            agent_id: agent.id,
            agent_slug: agent.slug,
            agent_name: agent.name,
            claimant_name: cleanEmail.split('@')[0],
            claimant_email: cleanEmail,
            company_domain: emailDomain,
            domain_verified: true,
            status: 'approved',
            admin_decision: 'auto-approved-domain',
            reviewed_at: new Date().toISOString(),
            verification_token: randomBytes(32).toString('hex'),
          })
          .select('id')
          .single()
        claimId = inserted?.id
      }

      if (claimId) {
        await grantAccess(claimId, agent.name, cleanEmail)
        // FYI only, no action needed.
        try {
          await resend.emails.send({
            from: 'The AI Agent Index <hello@theaiagentindex.com>',
            to: 'hello@theaiagentindex.com',
            subject: 'Vendor dashboard auto-granted: ' + agent.name,
            html: '<p><strong>' + esc(cleanEmail) + '</strong> was auto-granted dashboard access for <strong>' + esc(agent.name) + '</strong> (' + esc(agent.slug) + ') because their email domain matches an already-approved vendor domain. No action needed.</p>',
          })
        } catch (emailErr) {
          console.error('Failed to send auto-grant FYI:', emailErr)
        }
      }
      return NextResponse.json({ success: true })
    }

    // 3. Not domain-authorized and no exact match: create a pending claim + notify review.
    if (!claim) {
      await supabase.from('agent_claims').insert({
        agent_id: agent.id,
        agent_slug: agent.slug,
        agent_name: agent.name,
        claimant_name: cleanEmail.split('@')[0],
        claimant_email: cleanEmail,
        company_domain: emailDomain,
        domain_verified: !!agentDomain && agentDomain === emailDomain,
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
    // If a pending claim already exists and the domain isn't authorized: do nothing (already notified).

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}