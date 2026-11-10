import Link from 'next/link'

// The vendor box at the foot of a listing's sidebar (Heather 2026-11-09).
// tier 'standard'  - 30-day / free / $39 rows: accuracy pitch for Featured.
// tier 'fourteen'  - affiliate, vendor_managed and legacy (noded) rows: already
//                    re-checked every 14 days, so the pitch is the placement only.
// tier 'featured'  - paying Featured Listing holders (submitted_tier = 'managed',
//                    set by SQL when payment starts): no upsell, a quiet note.
// aiReads30 is shown only at 10 or more - AI READS from our logs, never citations.
export interface VendorBoxData {
  tier: 'standard' | 'fourteen' | 'featured'
  aiReads30: number | null
  lastChecked: string
}

const MIN_READS_SHOWN = 10

export default function VendorListingBox({ data, slug, claimed }: { data: VendorBoxData; slug: string; claimed: boolean }) {
  const reads = data.aiReads30 !== null && data.aiReads30 >= MIN_READS_SHOWN ? data.aiReads30 : null
  const readsLine = reads !== null ? <>AI systems read this listing <strong style={{ color: '#111827' }}>{reads.toLocaleString('en-US')} times</strong> in the last 30 days. </> : null
  const p = { fontSize: '0.8125rem', color: '#4B5563', marginBottom: '0.75rem', lineHeight: 1.55 } as const
  const h = { fontWeight: 700, color: '#111827', marginBottom: '0.375rem', fontSize: '0.75rem', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }
  const primary = { display: 'block', textAlign: 'center' as const, padding: '0.5rem 1rem', borderRadius: '0.5rem', backgroundColor: '#1D4ED8', color: '#FFFFFF', fontSize: '0.8125rem', fontWeight: 600, textDecoration: 'none' }
  const secondary = { display: 'block', textAlign: 'center' as const, marginTop: '0.5rem', fontSize: '0.8125rem', color: '#374151', fontWeight: 500, textDecoration: 'underline' }
  const ownerLink = claimed
    ? <Link href="/vendor" style={secondary}>Vendor dashboard</Link>
    : <Link href={'/claim/' + slug} style={secondary}>Claim it free</Link>

  if (data.tier === 'featured') {
    return (
      <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #E5E7EB', padding: '1.25rem' }}>
        <h3 style={h}>Featured listing</h3>
        <p style={p}>{readsLine}Re-checked every 14 days.</p>
        {ownerLink}
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#F8FAFF', borderRadius: '0.5rem', border: '1px solid #C7D2FE', padding: '1.25rem' }}>
      <h3 style={h}>Is this your product?</h3>
      {data.tier === 'standard' ? (
        <p style={p}>
          {readsLine}{data.lastChecked ? <>Last checked {data.lastChecked}. </> : null}AI assistants repeat what this page says, so keep it current: Featured Listings are re-checked every 14 days.
        </p>
      ) : (
        <p style={p}>
          {readsLine}It is re-checked every 14 days. Featured Listing adds a guaranteed homepage spot and a report to you after every re-audit.
        </p>
      )}
      <Link href="/advertise#placements" style={primary}>Get Featured →</Link>
      {ownerLink}
    </div>
  )
}
