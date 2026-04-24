import type { Metadata } from 'next'
import PartnerWaitlistForm from '@/components/PartnerWaitlistForm'

export const metadata: Metadata = {
  title: 'Find an AI Implementation Specialist',
  description: 'Join our waitlist to be connected with a vetted AI implementation specialist who can set up and configure AI agents for your business.',
  alternates: { canonical: 'https://theaiagentindex.com/partner-waitlist' },
}

export default function PartnerWaitlistPage() {
  return (
    <div style={{ backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '5rem 1.5rem 6rem' }}>
        <a href="/stacks" style={{ color: '#6B7280', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-block', marginBottom: '2.5rem' }}>← Back to stacks</a>

        <div style={{ backgroundColor: 'white', borderRadius: '1rem', border: '1px solid #E5E7EB', padding: '2.5rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
            Need help implementing an AI agent stack?
          </h1>
          <p style={{ color: '#6B7280', fontSize: '0.9375rem', lineHeight: 1.7, marginBottom: '0.5rem' }}>
            We're building a network of vetted AI implementation specialists — people who can set up and configure AI agents and automation stacks for your business.
          </p>
          <p style={{ color: '#6B7280', fontSize: '0.9375rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            Join the waitlist and we'll connect you when it launches.
          </p>
          <PartnerWaitlistForm />
        </div>
      </div>
    </div>
  )
}