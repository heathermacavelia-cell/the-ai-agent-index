import type { Metadata } from 'next'
import StackSubmitForm from '@/components/StackSubmitForm'

export const metadata: Metadata = {
  title: 'Submit Your AI Agent Stack',
  description: 'Share the AI agent stack your team uses to automate a workflow. Community stacks are reviewed before publishing.',
  alternates: { canonical: 'https://theaiagentindex.com/stacks/submit' },
}

export default function StackSubmitPage() {
  return (
    <div style={{ backgroundColor: '#030712', minHeight: '100vh', color: 'white' }}>
      <section style={{ maxWidth: '640px', margin: '0 auto', padding: '5rem 1.5rem 6rem' }}>
        <a href="/stacks" style={{ color: '#6B7280', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-block', marginBottom: '2rem' }}>← Back to stacks</a>
        <div style={{ display: 'inline-block', backgroundColor: '#0F172A', border: '1px solid #1F2937', borderRadius: '2rem', padding: '0.25rem 0.875rem', marginBottom: '1.25rem' }}>
          <span style={{ color: '#60A5FA', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Community Stacks</span>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>Share your stack</h1>
        <p style={{ color: '#9CA3AF', fontSize: '0.9375rem', lineHeight: 1.7, marginBottom: '2.5rem' }}>
          Running a combination of AI agents that genuinely automates a workflow for your business? Submit it and help other teams skip the trial and error.
          All community stacks are reviewed before publishing — we verify the agents are real, the handoffs make sense, and the stack is genuinely useful.
        </p>
        <div style={{ backgroundColor: '#0F172A', border: '1px solid #1F2937', borderRadius: '0.5rem', padding: '1rem', marginBottom: '2rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          <p style={{ color: '#9CA3AF', fontSize: '0.8125rem', lineHeight: 1.65 }}>
            Your job title and company type will be shown on the published stack to add credibility. Your email and full name are never displayed publicly.
          </p>
        </div>
        <StackSubmitForm />
      </section>
    </div>
  )
}