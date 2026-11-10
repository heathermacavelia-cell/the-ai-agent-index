import type { AgentTestSummary } from '@/lib/agentTests'

// Hands-on test strip in the listing hero (2026-11-10). Sits under the short
// description and Compare button, so it shows the same way on every layout:
// Featured listings keep their demo video in the dark band above the hero, and
// listings with a standalone video show the strip just above that video.
export default function AgentTestStrip({ test, agentName }: { test: AgentTestSummary; agentName: string }) {
  return (
    <a
      href={'/agents/' + test.slug + '/test'}
      className="agent-test-strip"
      style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginTop: '1rem', padding: '0.75rem 1rem', border: '1px solid #BFDBFE', borderRadius: '0.5rem', backgroundColor: '#F8FAFF', textDecoration: 'none', maxWidth: '640px' }}
    >
      <span style={{ flexShrink: 0, textAlign: 'center', minWidth: '3.5rem' }}>
        <span style={{ display: 'block', fontSize: '1.25rem', fontWeight: 800, color: '#1D4ED8', lineHeight: 1 }}>{test.passed}/{test.of}</span>
        <span style={{ display: 'block', fontSize: '0.5625rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '0.2rem' }}>tasks passed</span>
      </span>
      <span style={{ minWidth: 0 }}>
        <span style={{ display: 'block', fontSize: '0.625rem', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Hands-on test &middot; {test.testedMonth}{test.paid ? ' · Paid test' : ''}
        </span>
        <span style={{ display: 'block', fontSize: '0.875rem', color: '#1F2937', lineHeight: 1.45, marginTop: '0.125rem' }}>{test.headline}</span>
        <span style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#1D4ED8', marginTop: '0.25rem' }}>
          Read how {agentName}&apos;s AI did on all 9 tasks &rarr;
        </span>
      </span>
    </a>
  )
}
