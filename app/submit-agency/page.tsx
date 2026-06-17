import type { Metadata } from 'next'
import AgencySubmitForm from '@/components/AgencySubmitForm'

export const metadata: Metadata = {
  title: 'Submit an AI Automation Agency',
  description: 'List your AI automation agency in The AI Agent Index. Free listings with optional verified badges and advertising.',
}

export default function SubmitAgencyPage() {
  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Services Directory</p>
          <span style={{ fontSize: '0.5625rem', padding: '0.1rem 0.375rem', borderRadius: '9999px', backgroundColor: '#ECFDF5', color: '#059669', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', border: '1px solid #A7F3D0' }}>New</span>
        </div>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#111827', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>List your AI automation agency</h1>
        <p style={{ color: '#6B7280', fontSize: '1rem', lineHeight: 1.6, marginBottom: '0.25rem' }}>
          Get your agency in front of businesses looking to hire AI automation specialists. Listings include structured data for AI discoverability and are open to client reviews.
        </p>
        <p style={{ color: '#9CA3AF', fontSize: '0.875rem', lineHeight: 1.6 }}>
          Not a services firm? <a href="/submit" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 600 }}>Submit an AI agent (software product) instead →</a>
        </p>
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
          {['Free to list', 'Reviewed before publishing', 'AI-indexed with Schema.org markup', 'Open to client reviews'].map((item) => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: '#374151' }}>
              <span style={{ color: '#059669', fontWeight: 700 }}>✓</span> {item}
            </div>
          ))}
        </div>
      </div>
      <AgencySubmitForm />
    </div>
  )
}