import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with The AI Agent Index team for support, vendor inquiries, or general questions.',
}

export default function ContactPage() {
  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6B7280', marginBottom: '2rem' }}>
        <Link href="/" style={{ color: '#6B7280', textDecoration: 'none' }}>Home</Link>
        <span style={{ color: '#D1D5DB' }}>/</span>
        <span style={{ color: '#111827' }}>Contact</span>
      </nav>

      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
        Contact us
      </h1>
      <p style={{ color: '#4B5563', fontSize: '1.0625rem', lineHeight: 1.7, marginBottom: '3rem' }}>
        Have a question, found an error in a listing, or want to submit an agent? We would love to hear from you.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        <div style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.5rem' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#111827', marginBottom: '0.375rem' }}>General enquiries</h2>
          <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.6, marginBottom: '0.75rem' }}>
            For questions about the index, data accuracy, or anything else.
          </p>
          <a href="mailto:hello@theaiagentindex.com"
            style={{ fontSize: '0.9375rem', color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>
            hello@theaiagentindex.com
          </a>
        </div>

        <div style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.5rem' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#111827', marginBottom: '0.375rem' }}>Claim or update a listing</h2>
          <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.6, marginBottom: '0.75rem' }}>
            Are you a vendor and want to claim your listing, correct information, or get a Verified badge?
          </p>
          <Link href="/submit"
            style={{ fontSize: '0.9375rem', color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>
            Claim your listing →
          </Link>
        </div>

        <div style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.5rem' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#111827', marginBottom: '0.375rem' }}>Submit a new agent</h2>
          <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.6, marginBottom: '0.75rem' }}>
            Know an AI agent that should be listed? Submit it for review.
          </p>
          <Link href="/submit"
            style={{ fontSize: '0.9375rem', color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>
            Submit an agent →
          </Link>
        </div>

        <div style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.5rem' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#111827', marginBottom: '0.375rem' }}>Response time</h2>
          <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.6 }}>
            We aim to respond to all enquiries within 2 business days. The AI Agent Index is an independent directory — we are a small team and appreciate your patience.
          </p>
        </div>

      </div>
    </div>
  )
}