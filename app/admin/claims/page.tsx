import { createClient } from '@/lib/supabase'
import Link from 'next/link'
export const dynamic = 'force-dynamic'

export default async function AdminClaimsPage() {
  const supabase = createClient()
  const { data: claims } = await supabase
    .from('agent_claims')
    .select('*')
    .order('created_at', { ascending: false })

  const pending = claims?.filter(c => c.status === 'pending') ?? []
  const reviewed = claims?.filter(c => c.status !== 'pending') ?? []

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <h1 style={{ fontWeight: 700, fontSize: '1.5rem', color: '#111827' }}>Claim requests</h1>
        <Link href="/admin/reviews" style={{ fontSize: '0.875rem', color: '#6B7280' }}>Reviews queue</Link>
      </div>

      <h2 style={{ fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6B7280', marginBottom: '12px' }}>
        Pending ({pending.length})
      </h2>

      {pending.length === 0 && (
        <p style={{ color: '#9CA3AF', fontSize: '0.9375rem', marginBottom: '32px' }}>No pending claims.</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}>
        {pending.map((claim: any) => (
          <div key={claim.id} style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, color: '#111827' }}>{claim.agent_name}</span>
                  {claim.domain_verified && (
                    <span style={{ fontSize: '0.75rem', backgroundColor: '#F0FDF4', color: '#16A34A', border: '1px solid #BBF7D0', padding: '2px 8px', borderRadius: '9999px' }}>Domain match</span>
                  )}
                  {claim.email_verified && (
                    <span style={{ fontSize: '0.75rem', backgroundColor: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE', padding: '2px 8px', borderRadius: '9999px' }}>Email verified</span>
                  )}
                </div>
                <p style={{ fontSize: '0.875rem', color: '#4B5563', margin: '0 0 2px' }}>{claim.claimant_name}{claim.claimant_title ? ' - ' + claim.claimant_title : ''}</p>
                <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: '0 0 2px' }}>{claim.claimant_email}</p>
                <p style={{ fontSize: '0.8125rem', color: '#9CA3AF', margin: 0 }}>Domain: {claim.company_domain} - Submitted: {new Date(claim.created_at).toLocaleDateString()}</p>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <Link href={'/agents/' + claim.agent_slug} target="_blank"
                  style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #E5E7EB', fontSize: '0.8125rem', color: '#374151', textDecoration: 'none' }}>
                  View listing
                </Link>
                <form action={'/api/admin/claims'} method="POST" style={{ display: 'inline' }}>
                  <input type="hidden" name="claim_id" value={claim.id} />
                  <input type="hidden" name="action" value="approve" />
                  <button type="submit" style={{ padding: '6px 12px', borderRadius: '6px', backgroundColor: '#16A34A', color: 'white', border: 'none', fontSize: '0.8125rem', cursor: 'pointer' }}>
                    Approve
                  </button>
                </form>
                <form action={'/api/admin/claims'} method="POST" style={{ display: 'inline' }}>
                  <input type="hidden" name="claim_id" value={claim.id} />
                  <input type="hidden" name="action" value="reject" />
                  <button type="submit" style={{ padding: '6px 12px', borderRadius: '6px', backgroundColor: '#DC2626', color: 'white', border: 'none', fontSize: '0.8125rem', cursor: 'pointer' }}>
                    Reject
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>

      {reviewed.length > 0 && (
        <>
          <h2 style={{ fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6B7280', marginBottom: '12px' }}>
            Reviewed ({reviewed.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {reviewed.map((claim: any) => (
              <div key={claim.id} style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontWeight: 500, color: '#374151', marginRight: '8px' }}>{claim.agent_name}</span>
                  <span style={{ fontSize: '0.8125rem', color: '#9CA3AF' }}>{claim.claimant_email}</span>
                </div>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: claim.status === 'approved' ? '#16A34A' : '#DC2626', textTransform: 'uppercase' }}>
                  {claim.status}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}