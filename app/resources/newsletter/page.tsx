import type { Metadata } from 'next'
import NewsletterSignup from '@/components/NewsletterSignup'

export const metadata: Metadata = {
  title: 'AI Agent Price & Rating Tracker — The AI Agent Index',
  description: 'Price changes, new launches, acquisitions, and rating updates across 344+ AI agents. Verified against live vendor data, not vendor marketing. Not affiliated.',
}

export default function NewsletterPage() {
  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <a href="/resources" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', marginBottom: '1.5rem', display: 'inline-block' }}>← Resources</a>
      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Newsletter</p>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#111827', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>AI Agent Price &amp; Rating Tracker</h1>
      <p style={{ color: '#6B7280', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
        AI agents change pricing, ship integrations, and get acquired faster than any team can track. Every two weeks we publish what actually changed: price moves, new launches, acquisitions, and rating updates. Verified against live vendor data, not vendor marketing.
      </p>
      <NewsletterSignup sourcePage="/resources/newsletter" sourceType="other" />

      <div style={{ marginTop: '3rem' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Latest issue</p>
        <a href="/resources/newsletter/2026-07-14" style={{ display: 'block', textDecoration: 'none', border: '1px solid #E5E7EB', borderRadius: '10px', padding: '1.25rem 1.5rem', transition: 'border-color 0.15s' }}>
          <div style={{ fontSize: '0.8125rem', color: '#6B7280', marginBottom: '0.375rem' }}>Issue #1 · July 14, 2026</div>
          <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', lineHeight: 1.35, marginBottom: '0.5rem' }}>HubSpot cut to $7, Gemini to $4.99, and the MCP wave</div>
          <div style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.55 }}>Two major tools got cheaper, Klaviyo moved its marketing agent behind a paywall, and five platforms shipped MCP in two weeks.</div>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2563EB', marginTop: '0.75rem' }}>Read issue #1 →</div>
        </a>
      </div>
    </div>
  )
}