import { createServiceClient } from '@/lib/supabase'
import Link from 'next/link'

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
        subject: 'Claim ready to review: ' + claim.agent_name + (claim.domain_verified ? ' [DOMAIN MATCH]' : ' [UNVERIFIED DOMAIN]'),
        html: '<div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px">' +
          '<h2 style="font-size:1.25rem;font-weight:700;color:#111827;margin-bottom:16px">Claim verified and waiting on you</h2>' +
          '<p style="color:#4B5563;margin-bottom:8px"><strong>Listing:</strong> ' + esc(claim.agent_name) + ' (' + esc(claim.agent_slug) + ')</p>' +
          '<p style="color:#4B5563;margin-bottom:8px"><strong>Claimant:</strong> ' + esc(claim.claimant_name) + (claim.claimant_title ? ', ' + esc(claim.claimant_title) : '') + '</p>' +
          '<p style="color:#4B5563;margin-bottom:8px"><strong>Email:</strong> ' + esc(claim.claimant_email) + '</p>' +
          '<p style="color:#4B5563;margin-bottom:8px"><strong>Company domain:</strong> ' + esc(claim.company_domain) + '</p>' +
          '<p style="color:' + (claim.domain_verified ? '#16A34A' : '#B45309') + ';margin-bottom:24px"><strong>Domain match:</strong> ' + (claim.domain_verified ? 'yes' : 'NO, verify this claimant another way before approving') + '</p>' +
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
      <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🎉</div>
      <h1 style={{ fontWeight: 700, fontSize: '1.375rem', color: '#111827', marginBottom: '8px' }}>Email verified!</h1>
      <p style={{ color: '#4B5563', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '8px' }}>
        Your claim for <strong>{claim.agent_name}</strong> has been submitted for review.
      </p>
      {claim.domain_verified && (
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