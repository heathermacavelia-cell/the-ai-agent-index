import type { Metadata } from 'next'
import SubmitForm from '@/components/SubmitForm'
import NewsletterSignup from '@/components/NewsletterSignup'
import { TIERS } from '@/lib/vendorPlans'

export const metadata: Metadata = {
  title: 'Submit an AI Agent',
  description: 'Submit your AI agent to the AI Agent Index. Free and paid listings, structured data, discoverable by AI systems.',
}

export default function SubmitPage() {
  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Submit a listing</p>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#111827', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>Submit your AI agent</h1>
        <p style={{ color: '#6B7280', fontSize: '1rem', lineHeight: 1.6, maxWidth: '640px' }}>
          Get your agent in front of builders, buyers, and the AI systems that reference this index. Every listing is independently researched and written by our editorial team, structured for AI discoverability.
        </p>
        <p style={{ color: '#9CA3AF', fontSize: '0.875rem', marginTop: '0.75rem' }}>
          Not a software product? <a href="/submit-agency" style={{ color: '#059669', textDecoration: 'none', fontWeight: 600 }}>Submit an AI automation agency (services firm) instead &rarr;</a>
        </p>
      </div>

      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: '0.375rem' }}>Choose how your listing is handled</h2>
        <p style={{ color: '#6B7280', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
          You do not choose now. Fill in the form below and pick at the end. A free listing is always available.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          {TIERS.map(tier => {
            const paid = tier.id !== 'self'
            return (
              <div key={tier.id} style={{
                backgroundColor: 'white',
                border: paid ? '1px solid #BFDBFE' : '1px solid #E5E7EB',
                borderRadius: '0.875rem',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
              }}>
                <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', margin: '0 0 0.25rem' }}>{tier.name}</p>
                <p style={{ margin: '0 0 0.75rem', display: 'flex', alignItems: 'baseline', gap: '0.375rem' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, color: paid ? '#1D4ED8' : '#111827', letterSpacing: '-0.02em' }}>{tier.price}</span>
                  {tier.cadence && <span style={{ fontSize: '0.8125rem', color: '#6B7280' }}>{tier.cadence}</span>}
                </p>
                <p style={{
                  fontSize: '0.75rem', fontWeight: 700, color: paid ? '#1D4ED8' : '#6B7280',
                  backgroundColor: paid ? '#EFF6FF' : '#F3F4F6',
                  padding: '0.25rem 0.5rem', borderRadius: '0.375rem',
                  display: 'inline-block', alignSelf: 'flex-start', margin: '0 0 0.875rem',
                }}>
                  {tier.id === 'self' ? 'No set timeline' : 'Live in ' + tier.timeline}
                </p>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {tier.points.map(point => (
                    <li key={point} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8125rem', color: '#374151', lineHeight: 1.5 }}>
                      <span style={{ color: paid ? '#2563EB' : '#9CA3AF', fontWeight: 700, flexShrink: 0 }}>&#8226;</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        <div style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1rem 1.25rem', marginTop: '1rem' }}>
          <p style={{ fontSize: '0.8125rem', color: '#374151', lineHeight: 1.6, margin: 0 }}>
            <strong>What paying does and does not do.</strong> Paying buys speed, a full audit and ongoing checks. It never changes your rating, your ranking, or where you appear on this site, and it never will. Our editorial team researches and writes every listing either way. The audited badge means a listing has been audited, not that anyone paid for it &mdash; it carries the date we last checked, and a free listing we audit later carries the same badge on the same terms.
          </p>
        </div>
      </div>

      <SubmitForm />
      <NewsletterSignup sourcePage="/submit" sourceType="other" />
    </div>
  )
}