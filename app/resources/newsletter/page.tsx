import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Newsletter — AI Agent Index Weekly',
  description: 'The AI Agent Index Weekly — agents gaining community trust, what builders are shipping, and which tools are delivering results.',
}

export default function NewsletterPage() {
  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <a href="/resources" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginBottom: '1.5rem' }}>← Resources</a>
      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Newsletter</p>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#111827', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>AI Agent Index Weekly</h1>
      <p style={{ color: '#6B7280', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
        Agents gaining real community trust, what builders are shipping, and which tools are actually delivering results — one focused email, every week.
      </p>
      <NewsletterSignup />
    </div>
  )
}

function NewsletterSignup() {
  return (
    <div style={{ backgroundColor: '#030712', borderRadius: '1rem', padding: '2.5rem', color: 'white' }}>
      <div style={{ width: '2.5rem', height: '2.5rem', backgroundColor: '#2563EB', borderRadius: '0.625rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
        <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
          <path d="M7 1L12.5 4V10L7 13L1.5 10V4L7 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
          <circle cx="7" cy="7" r="1.5" fill="white"/>
        </svg>
      </div>
      <h2 style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.75rem' }}>Stay ahead of the curve</h2>
      <ul style={{ color: '#9CA3AF', fontSize: '0.875rem', lineHeight: 2, marginBottom: '2rem', paddingLeft: '1.25rem' }}>
        <li>Agents gaining the most community reviews each week</li>
        <li>New listings across all 5 categories</li>
        <li>Builder wins and real-world deployment stories</li>
        <li>Comparison and guide releases</li>
      </ul>
      <NewsletterForm />
    </div>
  )
}

function NewsletterForm() {
  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input type="email" placeholder="your@email.com"
          style={{ flex: 1, padding: '0.75rem 1rem', backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '0.625rem', fontSize: '0.9375rem', color: 'white', outline: 'none', boxSizing: 'border-box' }}
        />
        <button type="button"
          style={{ padding: '0.75rem 1.25rem', backgroundColor: '#2563EB', color: 'white', border: 'none', borderRadius: '0.625rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
          Subscribe
        </button>
      </div>
      <p style={{ fontSize: '0.75rem', color: '#4B5563', marginTop: '0.75rem' }}>One email a week. No noise. Unsubscribe anytime.</p>
    </div>
  )
}