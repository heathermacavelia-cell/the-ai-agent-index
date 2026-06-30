import type { Metadata } from 'next'
import NewsletterSignup from '@/components/NewsletterSignup'

export const metadata: Metadata = {
  title: 'AI Agent Price & Rating Tracker — The AI Agent Index',
  description: 'We verify pricing, integrations, and review data on 330+ AI agents every 14 days. Get notified when something changes. Not affiliated.',
}

export default function NewsletterPage() {
  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <a href="/resources" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', marginBottom: '1.5rem', display: 'inline-block' }}>← Resources</a>
      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Newsletter</p>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#111827', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>AI Agent Price &amp; Rating Tracker</h1>
      <p style={{ color: '#6B7280', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
        AI agents change pricing, ship integrations, and get acquired faster than any team can track. We verify every listing in our directory against live vendor data every 14 days and publish what changed, what moved, and what launched. One email, every two weeks.
      </p>
      <NewsletterSignup sourcePage="/resources/newsletter" sourceType="other" />
    </div>
  )
}