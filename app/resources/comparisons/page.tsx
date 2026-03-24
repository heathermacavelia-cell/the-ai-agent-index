import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'AI Agent Comparisons — AI Agent Index',
  description: 'Side-by-side comparisons of AI agents across categories to help you choose the right tool.',
}

const COMPARISONS = [
  { slug: 'cursor-vs-github-copilot', a: 'Cursor', b: 'GitHub Copilot', category: 'AI Coding Agents' },
  { slug: 'cursor-vs-windsurf', a: 'Cursor', b: 'Windsurf', category: 'AI Coding Agents' },
  { slug: 'github-copilot-vs-windsurf', a: 'GitHub Copilot', b: 'Windsurf', category: 'AI Coding Agents' },
  { slug: 'intercom-fin-vs-zendesk-ai', a: 'Intercom Fin', b: 'Zendesk AI', category: 'AI Customer Support Agents' },
  { slug: 'gorgias-vs-tidio', a: 'Gorgias', b: 'Tidio', category: 'AI Customer Support Agents' },
  { slug: 'gong-vs-clari', a: 'Gong', b: 'Clari', category: 'AI Sales Agents' },
  { slug: 'clay-vs-instantly-ai', a: 'Clay', b: 'Instantly.ai', category: 'AI Sales Agents' },
{ slug: 'jasper-vs-copy-ai', a: 'Jasper', b: 'Copy.ai', category: 'AI Marketing Agents' },
  { slug: 'perplexity-ai-vs-chatgpt-deep-research', a: 'Perplexity AI', b: 'ChatGPT Deep Research', category: 'AI Research Agents' },
  { slug: 'elicit-vs-consensus', a: 'Elicit', b: 'Consensus', category: 'AI Research Agents' },
]

export default function ComparisonsPage() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <a href="/resources" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginBottom: '1.5rem' }}>← Resources</a>
      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Comparisons</p>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#111827', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>AI Agent Comparisons</h1>
      <p style={{ color: '#6B7280', fontSize: '1rem', lineHeight: 1.6, maxWidth: '560px', marginBottom: '3rem' }}>
        Side-by-side breakdowns of competing AI agents across categories — pricing, capabilities, integrations, and ratings. All data sourced from The AI Agent Index.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {COMPARISONS.map((comp) => (
          <Link key={comp.slug} href={'/compare/' + comp.slug}
            style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: '1px solid #E5E7EB', padding: '1.25rem 1.5rem', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <h2 style={{ fontWeight: 600, fontSize: '1rem', color: '#111827', marginBottom: '0.25rem' }}>{comp.a} vs {comp.b}</h2>
              <span style={{ fontSize: '0.75rem', color: '#6B7280', backgroundColor: '#F3F4F6', padding: '0.15rem 0.5rem', borderRadius: '9999px' }}>{comp.category}</span>
          </div>
            <span style={{ color: '#2563EB', fontSize: '1.25rem', flexShrink: 0 }}>→</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
