import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Resources — AI Agent Index',
  description: 'Guides, comparisons, and newsletters about AI agents for business automation.',
}

const GUIDES_COUNT = 7
const COMPARISONS_COUNT = 10

export default function ResourcesPage() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <div style={{ marginBottom: '3rem' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Knowledge base</p>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>Resources</h1>
        <p style={{ color: '#6B7280', fontSize: '1rem', lineHeight: 1.6, maxWidth: '560px' }}>
          Guides, comparisons, and insights to help you evaluate, deploy, and get more from AI agents.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
        {[
          { href: '/compare', icon: '⚖️', title: 'Comparisons', description: 'Side-by-side agent breakdowns to help you choose the right tool for your use case.', count: COMPARISONS_COUNT + ' comparisons' },
          { href: '/resources/guides', icon: '📖', title: 'Guides', description: 'Step-by-step guides on evaluating, deploying, and building with AI agents.', count: GUIDES_COUNT + ' guides' },
          { href: '/resources/newsletter', icon: '📬', title: 'Newsletter', description: 'The AI Agent Index Weekly — agents gaining community trust, builder wins, and what\'s shipping.', count: 'Subscribe' },
        ].map((item) => (
          <a key={item.href} href={item.href}
            style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: '1px solid #E5E7EB', padding: '1.5rem', textDecoration: 'none', display: 'block' }}>
            <div style={{ fontSize: '1.75rem', marginBottom: '0.875rem' }}>{item.icon}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
              <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#111827' }}>{item.title}</h2>
              <span style={{ fontSize: '0.625rem', backgroundColor: '#F3F4F6', color: '#6B7280', padding: '0.15rem 0.5rem', borderRadius: '9999px', fontWeight: 600, textTransform: 'uppercase' }}>{item.count}</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#6B7280', lineHeight: 1.6 }}>{item.description}</p>
          </a>
        ))}
      </div>
    </div>
  )
}