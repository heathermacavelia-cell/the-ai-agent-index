import type { Metadata } from 'next'
import NewsletterSignup from '@/components/NewsletterSignup'

export const metadata: Metadata = {
  title: 'Newsletter — AI Agent Index Weekly',
  description: 'The AI Agent Index Weekly — agents gaining community trust, what builders are shipping, and which tools are delivering results.',
}

export default function NewsletterPage() {
  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <a href="/resources" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', marginBottom: '1.5rem', display: 'inline-block' }}>← Resources</a>
      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Newsletter</p>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#111827', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>AI Agent Index Weekly</h1>
      <p style={{ color: '#6B7280', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
        Agents gaining real community trust, what builders are shipping, and which tools are actually delivering results — one focused email, every week.
      </p>
      <NewsletterSignup source="newsletter_page" />
    </div>
  )
}