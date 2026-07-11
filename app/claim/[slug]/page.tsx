import { createClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ClaimForm from '@/components/ClaimForm'

interface Props {
  params: { slug: string }
}

export default async function ClaimPage({ params }: Props) {
  const supabase = createClient()
  const { data: agent } = await supabase
    .from('agents')
    .select('id, name, slug, developer, is_verified, vendor_claimed')
    .eq('slug', params.slug)
    .single()

  if (!agent) notFound()

  if (agent.vendor_claimed) {
    return (
      <div style={{ maxWidth: '520px', margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
        <h1 style={{ fontWeight: 700, fontSize: '1.25rem', color: '#111827', marginBottom: '8px' }}>This listing is already claimed.</h1>
        <p style={{ fontSize: '0.9375rem', color: '#6B7280', lineHeight: 1.6, marginBottom: '20px' }}>
          If you manage {agent.name}, access your dashboard below. If you believe this listing was claimed by someone who should not control it, email hello@theaiagentindex.com and we will investigate.
        </p>
        <Link href="/vendor" style={{ display: 'inline-block', padding: '0.625rem 1.5rem', borderRadius: '0.5rem', backgroundColor: '#2563EB', color: 'white', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
          Vendor dashboard →
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div style={{ maxWidth: '640px', margin: '3rem auto 0', padding: '0 24px' }}>
        <div style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.625rem' }}>Claiming is free and gets you</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', fontSize: '0.875rem', color: '#374151', lineHeight: 1.6 }}>
            <span>The Verified badge and checkmark on your listing</span>
            <span>Embeddable badges for your own site (<Link href={'/badges/' + agent.slug} style={{ color: '#2563EB' }}>see what {agent.name} has earned</Link>)</span>
            <span>A review collection link: verified user reviews raise your displayed rating</span>
            <span>The vendor dashboard: logo upload, listing corrections, and optional paid visibility</span>
          </div>
        </div>
      </div>
      <ClaimForm agent={agent} />
    </div>
  )
}