import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Agent Comparisons — AI Agent Index',
  description: 'Side-by-side comparisons of AI agents across categories to help you choose the right tool.',
}

export default function ComparisonsPage() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <a href="/resources" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginBottom: '1.5rem' }}>← Resources</a>
      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Comparisons</p>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#111827', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>AI Agent Comparisons</h1>
      <p style={{ color: '#6B7280', fontSize: '1rem', lineHeight: 1.6, maxWidth: '560px', marginBottom: '3rem' }}>
        Detailed side-by-side breakdowns to help you choose the right agent for your use case.
      </p>
      <div style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: '1px solid #E5E7EB', padding: '3rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚖️</div>
        <h2 style={{ fontWeight: 600, fontSize: '1rem', color: '#111827', marginBottom: '0.5rem' }}>Comparisons coming soon</h2>
        <p style={{ fontSize: '0.875rem', color: '#6B7280', maxWidth: '400px', margin: '0 auto' }}>
          We're building out detailed comparisons across every category. Check back soon or subscribe to the newsletter to be notified.
        </p>
        <a href="/resources/newsletter" style={{ display: 'inline-flex', marginTop: '1.5rem', padding: '0.625rem 1.25rem', backgroundColor: '#2563EB', color: 'white', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
          Get notified →
        </a>
      </div>
    </div>
  )
}