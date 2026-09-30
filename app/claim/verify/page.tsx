import { createServiceClient } from '@/lib/supabase'
import Link from 'next/link'
import { approveClaim } from '@/lib/claimApproval'
import { isCompanyDomainMatch } from '@/lib/vendorDomain'

interface Props {
  searchParams: { token?: string }
}

export default async function VerifyClaimPage({ searchParams }: Props) {
  const token = searchParams.token

  if (!token) {
    return (
      <div style={{ maxWidth: '480px', margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
        <h1 style={{ fontWeight: 700, fontSize: '1.25rem', color: '#111827' }}>Invalid link</h1>
        <p style={{ color: '#6B7280' }}>This verification link is missing a token.</p>
      </div>
    )
  }

  const supabase = createServiceClient()
  const { data: claim } = await supabase
    .from('agent_claims')
    .select('*')
    .eq('verification_token', token)
    .single()

  if (!claim) {
    return (
      <div style={{ maxWidth: '480px', margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
        <h1 style={{ fontWeight: 700, fontSize: '1.25rem', color: '#111827' }}>Link not found</h1>
        <p style={{ color: '#6B7280' }}>This verification link is invalid or has expired.</p>
      </div>
    )
  }

  // Where a vendor gets a fresh 24-hour dashboard link, prefilled.
  const vendorPageUrl = '/vendor?slug=' + encodeURIComponent(claim.agent_slug) + '&email=' + encodeURIComponent(claim.claimant_email)

  // A claim that is already approved never goes back to the review queue.
  const approvedView = (
    <div style={{ maxWidth: '480px', margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
      <h1 style={{ fontWeight: 700, fontSize: '1.375rem', color: '#111827', marginBottom: '8px' }}>Your claim is approved</h1>
      <p style={{ color: '#4B5563', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '16px' }}>
        Your claim for <strong>{claim.agent_name}</strong> is approved. To open your vendor dashboard, request a sign-in link. It arrives by email and works for 24 hours.
      </p>
      <Link href={vendorPageUrl} style={{ display: 'inline-block', backgroundColor: '#2563EB', color: 'white', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '0.9375rem' }}>
        Get my dashboard link
      </Link>
      <div>
        <Link href={'/agents/' + claim.agent_slug} style={{ display: 'inline-block', marginTop: '24px', color: '#2563EB', fontSize: '0.875rem' }}>
          View listing
        </Link>
      </div>
    </div>
  )

  if (claim.status === 'approved') {
    if (!claim.email_verified) {
      await supabase
        .from('agent_claims')
        .update({ email_verified: true, email_verified_at: new Date().toISOString() })
        .eq('id', claim.id)
    }
    return approvedView
  }

  if (claim.email_verified) {
    return (
      <div style={{ maxWidth: '480px', margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
        <h1 style={{ fontWeight: 700, fontSize: '1.25rem', color: '#111827' }}>Already verified</h1>
        <p style={{ color: '#6B7280' }}>Your email has already been verified. We will review your claim shortly.</p>
        <Link href={'/agents/' + claim.agent_slug} style={{ display: 'inline-block', marginTop: '24px', color: '#2563EB', fontSize: '0.875rem' }}>
          View listing
        </Link>
      </div>
    )
  }

  await supabase
    .from('agent_claims')
    .update({ email_verified: true, email_verified_at: new Date().toISOString() })
    .eq('id', claim.id)

  const esc = (s: unknown) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  // Domain check against the LISTING's own domain (not the domain the claimant typed).
  const { data: agent } = await supabase
    .from('agents')
    .select('favicon_domain')
    .eq('id', claim.agent_id)
    .single()
  const domainMatch = isCompanyDomainMatch(claim.claimant_email, agent?.favicon_domain)

  // Company email at the listing's own domain: approve now and email the dashboard link.
  if (domainMatch && claim.status === 'pending') {
    const approved = await approveClaim(supabase, claim.id, { decision: 'auto-approved-domain' })
    if (approved) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + process.env.RESEND_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'The AI Agent Index <hello@theaiagentindex.com>',
            to: 'hello@theaiagentindex.com',
            subject: 'Claim auto-approved (domain match): ' + claim.agent_name,
            html: '<p><strong>' + esc(claim.claimant_email) + '</strong> verified their email and was auto-approved for <strong>' + esc(claim.agent_name) + '</strong> (' + esc(claim.agent_slug) + ') because their email domain matches the listing domain. The approval email with a dashboard link has been sent to them. No action needed.</p>',
          }),
        })
      } catch (notifyErr) {
        console.error('Claim auto-approve admin FYI threw:', notifyErr)
      }
      return (
        <div style={{ maxWidth: '480px', margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
          <h1 style={{ fontWeight: 700, fontSize: '1.375rem', color: '#111827', marginBottom: '8px' }}>Your claim is approved</h1>
          <p style={{ color: '#4B5563', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '8px' }}>
            Your email domain matches <strong>{claim.agent_name}</strong>, so your claim was approved automatically.
          </p>
          <p style={{ color: '#16A34A', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', padding: '10px 16px', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '16px' }}>
            Check your inbox: we have emailed you a link to your vendor dashboard. It works for 24 hours.
          </p>
          <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
            Need a new link later? <Link href={vendorPageUrl} style={{ color: '#2563EB' }}>Request one here</Link>.
          </p>
          <Link href={'/agents/' + claim.agent_slug} style={{ display: 'inline-block', marginTop: '24px', color: '#2563EB', fontSize: '0.875rem' }}>
            View listing
          </Link>
        </div>
      )
    }
  }

  try {
    const adminRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + process.env.RESEND_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'The AI Agent Index <hello@theaiagentindex.com>',
        to: 'hello@theaiagentindex.com',
        subject: 'Claim ready to review: ' + claim.agent_name + (domainMatch ? ' [DOMAIN MATCH]' : ' [UNVERIFIED DOMAIN]'),
        html: '<div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px">' +
          '<h2 style="font-size:1.25rem;font-weight:700;color:#111827;margin-bottom:16px">Claim verified and waiting on you</h2>' +
          '<p style="color:#4B5563;margin-bottom:8px"><strong>Listing:</strong> ' + esc(claim.agent_name) + ' (' + esc(claim.agent_slug) + ')</p>' +
          '<p style="color:#4B5563;margin-bottom:8px"><strong>Claimant:</strong> ' + esc(claim.claimant_name) + (claim.claimant_title ? ', ' + esc(claim.claimant_title) : '') + '</p>' +
          '<p style="color:#4B5563;margin-bottom:8px"><strong>Email:</strong> ' + esc(claim.claimant_email) + '</p>' +
          '<p style="color:#4B5563;margin-bottom:8px"><strong>Company domain:</strong> ' + esc(claim.company_domain) + '</p>' +
          '<p style="color:' + (domainMatch ? '#16A34A' : '#B45309') + ';margin-bottom:24px"><strong>Domain match:</strong> ' + (domainMatch ? 'yes' : 'NO, verify this claimant another way before approving') + '</p>' +
          '<p style="color:#4B5563;margin-bottom:8px">They have been told you will respond within 2 business days.</p>' +
          '<p style="color:#9CA3AF;font-size:0.8125rem">Review in the Claims tab: https://theaiagentindex.com/admin/reviews</p>' +
          '</div>',
      }),
    })
    if (!adminRes.ok) {
      console.error('Claim verified admin notification failed:', await adminRes.text())
    }
  } catch (notifyErr) {
    console.error('Claim verified admin notification threw:', notifyErr)
  }

  return (
    <div style={{ maxWidth: '480px', margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
      <h1 style={{ fontWeight: 700, fontSize: '1.375rem', color: '#111827', marginBottom: '8px' }}>Email verified!</h1>
      <p style={{ color: '#4B5563', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '8px' }}>
        Your claim for <strong>{claim.agent_name}</strong> has been submitted for review.
      </p>
      {domainMatch && (
        <p style={{ color: '#16A34A', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', padding: '10px 16px', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '16px' }}>
          Domain verified - your claim is prioritised for review.
        </p>
      )}
      <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>We will review within 2 business days and email you the outcome.</p>
      <Link href={'/agents/' + claim.agent_slug} style={{ display: 'inline-block', marginTop: '24px', color: '#2563EB', fontSize: '0.875rem' }}>
        Back to listing
      </Link>
    </div>
  )
}