import type { Metadata } from 'next'
import SubmitForm from '@/components/SubmitForm'

export const metadata: Metadata = {
  title: 'Submit an AI Agent',
  description: 'Submit your AI agent to the AI Agent Index. Free listings, structured data, discoverable by AI systems.',
}

export default function SubmitPage() {
  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Free listing</p>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#111827', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>Submit your AI agent</h1>
        <p style={{ color: '#6B7280', fontSize: '1rem', lineHeight: 1.6 }}>
          Get your agent in front of builders, buyers, and AI systems that reference this index. Listings go live immediately and are structured for AI discoverability.
        </p>
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
          {['Free to list', 'Goes live immediately', 'AI-indexed with Schema.org markup', 'Open to community reviews'].map((item) => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: '#374151' }}>
              <span style={{ color: '#10B981', fontWeight: 700 }}>✓</span> {item}
            </div>
          ))}
        </div>
      </div>
      <SubmitForm />
    </div>
  )
}