import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for The AI Agent Index — what data we collect, how we use it, and your rights.',
}

export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6B7280', marginBottom: '2rem' }}>
        <Link href="/" style={{ color: '#6B7280', textDecoration: 'none' }}>Home</Link>
        <span style={{ color: '#D1D5DB' }}>/</span>
        <span style={{ color: '#111827' }}>Privacy Policy</span>
      </nav>

      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
        Privacy Policy
      </h1>
      <p style={{ fontSize: '0.875rem', color: '#9CA3AF', marginBottom: '3rem' }}>
        Last updated: March 20, 2026
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', color: '#374151', fontSize: '0.9375rem', lineHeight: 1.8 }}>

        <section>
          <h2 style={{ fontWeight: 700, fontSize: '1.125rem', color: '#111827', marginBottom: '0.75rem' }}>Overview</h2>
          <p>The AI Agent Index ("we", "us", "our") is an independent directory of AI agents for business automation, operated at theaiagentindex.com. This policy explains what personal information we collect, how we use it, and your rights regarding that information.</p>
          <p style={{ marginTop: '0.75rem' }}>We collect minimal personal data and do not sell, rent, or trade your information with third parties.</p>
        </section>

        <section>
          <h2 style={{ fontWeight: 700, fontSize: '1.125rem', color: '#111827', marginBottom: '0.75rem' }}>Information we collect</h2>
          <p style={{ marginBottom: '0.75rem' }}>We collect information in the following circumstances:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingLeft: '1rem', borderLeft: '3px solid #E5E7EB' }}>
            <div>
              <p style={{ fontWeight: 600, color: '#111827', marginBottom: '0.25rem' }}>Reviews and ratings</p>
              <p>When you submit a review, we collect your name, email address, star rating, and comment. Your email address is never displayed publicly — it is used only to prevent duplicate submissions and for occasional service communications.</p>
            </div>
            <div>
              <p style={{ fontWeight: 600, color: '#111827', marginBottom: '0.25rem' }}>Agent submissions</p>
              <p>When you submit an agent for listing, we collect your name, email address, and the agent details you provide. This information is used to process and manage the submission.</p>
            </div>
            <div>
              <p style={{ fontWeight: 600, color: '#111827', marginBottom: '0.25rem' }}>Listing claims</p>
              <p>When you claim a listing, we collect your name, work email address, job title, and company domain for identity verification purposes.</p>
            </div>
            <div>
              <p style={{ fontWeight: 600, color: '#111827', marginBottom: '0.25rem' }}>Newsletter</p>
              <p>If you subscribe to our newsletter, we collect your email address. You can unsubscribe at any time by clicking the unsubscribe link in any email we send.</p>
            </div>
            <div>
              <p style={{ fontWeight: 600, color: '#111827', marginBottom: '0.25rem' }}>Analytics</p>
              <p>We use Google Analytics to understand how visitors use the site. This collects anonymised usage data including pages visited, time on site, and general geographic location. No personally identifiable information is collected through analytics.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 style={{ fontWeight: 700, fontSize: '1.125rem', color: '#111827', marginBottom: '0.75rem' }}>How we use your information</h2>
          <p>We use collected information solely to operate and improve The AI Agent Index. Specifically:</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0.75rem 0 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              'To display approved reviews on agent listing pages',
              'To process and review agent submission and claim requests',
              'To send transactional emails related to your submissions or claims',
              'To send newsletters to subscribers who have opted in',
              'To understand site usage and improve the directory',
            ].map((item) => (
              <li key={item} style={{ display: 'flex', gap: '0.625rem', alignItems: 'flex-start' }}>
                <span style={{ color: '#2563EB', flexShrink: 0 }}>→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 style={{ fontWeight: 700, fontSize: '1.125rem', color: '#111827', marginBottom: '0.75rem' }}>Data storage</h2>
          <p>Your data is stored securely in Supabase (Postgres), hosted in Canada. We use industry-standard security practices to protect your information. We do not store payment information — no financial data is ever collected by this site.</p>
        </section>

        <section>
          <h2 style={{ fontWeight: 700, fontSize: '1.125rem', color: '#111827', marginBottom: '0.75rem' }}>Third-party services</h2>
          <p>We use the following third-party services that may process data on our behalf:</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0.75rem 0 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              'Supabase — database and authentication infrastructure',
              'Vercel — website hosting and deployment',
              'Resend — transactional email delivery',
              'Google Analytics — anonymised usage analytics',
            ].map((item) => (
              <li key={item} style={{ display: 'flex', gap: '0.625rem', alignItems: 'flex-start' }}>
                <span style={{ color: '#6B7280', flexShrink: 0 }}>·</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 style={{ fontWeight: 700, fontSize: '1.125rem', color: '#111827', marginBottom: '0.75rem' }}>Your rights</h2>
          <p>You have the right to request access to, correction of, or deletion of any personal data we hold about you. To make a request, email us at <a href="mailto:hello@theaiagentindex.com" style={{ color: '#2563EB' }}>hello@theaiagentindex.com</a>. We will respond within 30 days.</p>
        </section>

        <section>
          <h2 style={{ fontWeight: 700, fontSize: '1.125rem', color: '#111827', marginBottom: '0.75rem' }}>Cookies</h2>
          <p>We use minimal cookies required for site operation and analytics. We do not use advertising or tracking cookies. You can disable cookies in your browser settings, though this may affect some site functionality.</p>
        </section>

        <section>
          <h2 style={{ fontWeight: 700, fontSize: '1.125rem', color: '#111827', marginBottom: '0.75rem' }}>Changes to this policy</h2>
          <p>We may update this policy as the site evolves. The date at the top of this page reflects the most recent update. Continued use of the site after changes constitutes acceptance of the updated policy.</p>
        </section>

        <section>
          <h2 style={{ fontWeight: 700, fontSize: '1.125rem', color: '#111827', marginBottom: '0.75rem' }}>Contact</h2>
          <p>For any privacy-related questions or requests, contact us at <a href="mailto:hello@theaiagentindex.com" style={{ color: '#2563EB' }}>hello@theaiagentindex.com</a>.</p>
        </section>

      </div>
    </div>
  )
}