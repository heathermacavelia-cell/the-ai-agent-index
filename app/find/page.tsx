import Link from 'next/link'
import FindClient from './FindClient'

export default function FindPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'system-ui, sans-serif' }}>

      {/* Nav */}
      <div style={{ borderBottom: '1px solid #e5e7eb', background: '#fff', padding: '16px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '14px' }}>← Back to Index</Link>
        </div>
      </div>

      {/* Hero — server-rendered so the h1 ships in the initial HTML */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '60px 24px 0' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: '#eff6ff', color: '#2563eb', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px', marginBottom: '20px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            AI-Powered Matching
          </div>
          <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#111827', marginBottom: '16px', lineHeight: '1.2' }}>
            Describe what you want to automate
          </h1>
          <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '32px', lineHeight: '1.6' }}>
            Tell us your business problem in plain English. We&apos;ll find the AI agents that can solve it.
          </p>
        </div>
      </div>

      <FindClient />
    </div>
  )
}