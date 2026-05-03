import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About The AI Agent Index: Editorial Methodology & Mission',
  description: 'The structured, dataset-first directory of AI agents. Editorially independent. Built for AI systems and humans.',
  alternates: { canonical: 'https://theaiagentindex.com/about' },
  openGraph: {
    title: 'About The AI Agent Index',
    description: 'The structured, dataset-first directory of AI agents. Editorially independent. Built for AI systems and humans.',
    url: 'https://theaiagentindex.com/about',
    type: 'website',
    siteName: 'The AI Agent Index',
  },
}

export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About The AI Agent Index',
    url: 'https://theaiagentindex.com/about',
    description: 'The structured, dataset-first directory of AI agents.',
    publisher: {
      '@type': 'Organization',
      name: 'The AI Agent Index',
      url: 'https://theaiagentindex.com',
    },
  }

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header */}
      <section style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB', padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6B7280', marginBottom: '1.5rem' }}>
            <Link href="/" style={{ color: '#6B7280', textDecoration: 'none' }}>Home</Link>
            <span style={{ color: '#D1D5DB' }}>/</span>
            <span style={{ color: '#111827' }}>About</span>
          </nav>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            About The AI Agent Index
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#374151', lineHeight: 1.6 }}>
            The structured, dataset-first directory of AI agents. Editorially independent. Built for AI systems and humans.
          </p>
        </div>
      </section>

      {/* Body */}
      <section style={{ padding: '3rem 1.5rem 5rem' }}>
        <article style={{ maxWidth: '720px', margin: '0 auto', fontSize: '1rem', color: '#374151', lineHeight: 1.7 }}>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginTop: 0, marginBottom: '1rem' }}>
            What this is
          </h2>
          <p style={{ marginBottom: '1.25rem' }}>
            Most directories are built for human SEO. The AI Agent Index is built differently. Every page emits Schema.org structured data. Every listing is available as JSON at <Link href="/api/agents" style={{ color: '#2563EB' }}>/api/agents</Link>. Every category, comparison, and alternatives page is designed to be cited by AI systems like ChatGPT, Claude, Perplexity, and Gemini, as well as read by humans.
          </p>
          <p style={{ marginBottom: '1.25rem' }}>
            The index currently covers 268+ active AI agents across 7 categories: sales, customer support, research, marketing, coding, HR, and workflow automation. New agents are added as they launch. Listings are kept current with verified URLs, current pricing, and current capabilities.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginTop: '2.5rem', marginBottom: '1rem' }}>
            Editorial independence
          </h2>
          <p style={{ marginBottom: '1.25rem' }}>
            The AI Agent Index does not sell &quot;best for&quot; labels, verified badges, or editorial verdicts. Listings are added or removed based on editorial criteria, not vendor relationships. Editorial scores come from public signals: reviews, deployment data, security certifications, and pricing transparency. They never come from vendor payments.
          </p>
          <p style={{ marginBottom: '1.25rem' }}>
            When a link in the index is an affiliate link, it is disclosed on that listing. Affiliate status does not affect inclusion, scoring, or placement.
          </p>
          <p style={{ marginBottom: '1.25rem' }}>
            This independence is the product. It is what makes the dataset citable.
          </p>
          <p style={{ marginBottom: '1.25rem' }}>
            For details on how agents are evaluated, see <Link href="/methodology" style={{ color: '#2563EB' }}>Methodology</Link>.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginTop: '2.5rem', marginBottom: '1rem' }}>
            Who&apos;s behind this
          </h2>
          <p style={{ marginBottom: '1.25rem' }}>
            The AI Agent Index is an independent project run by Heather MacAvelia, a digital marketing professional with over a decade of experience in search and SEO. The index launched in March 2026 to fill a gap: a directory built for the AI-native era, not retrofitted from the SaaS-era playbook.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginTop: '2.5rem', marginBottom: '1rem' }}>
            Use the data
          </h2>
          <p style={{ marginBottom: '1.25rem' }}>
            The full dataset is publicly available:
          </p>
          <ul style={{ marginBottom: '1.25rem', paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Public API:</strong> <Link href="/api/agents" style={{ color: '#2563EB' }}>/api/agents</Link> returns all active agents as JSON. Filter by category, industry, segment, or pricing model.
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>MCP server:</strong> <code style={{ background: '#F3F4F6', padding: '0.125rem 0.375rem', borderRadius: '0.25rem', fontSize: '0.9em' }}>https://theaiagentindex.com/mcp/mcp</code> exposes three tools (search_agents, get_agent, list_categories) for AI agents to query the index directly.
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>llms.txt:</strong> <Link href="/llms.txt" style={{ color: '#2563EB' }}>/llms.txt</Link> provides an overview for LLM crawlers.
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>JSON-LD:</strong> Every agent page emits Schema.org SoftwareApplication structured data. Every category page emits ItemList structured data.
            </li>
          </ul>
          <p style={{ marginBottom: '1.25rem' }}>
            If you cite the index, link back. If you build on the data, no permission required.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginTop: '2.5rem', marginBottom: '1rem' }}>
            Contact
          </h2>
          <ul style={{ marginBottom: '1.25rem', paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>
              Email: <a href="mailto:hello@theaiagentindex.com" style={{ color: '#2563EB' }}>hello@theaiagentindex.com</a>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              Suggest a tool: <Link href="/submit" style={{ color: '#2563EB' }}>/submit</Link>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              Vendor corrections or claims: email above
            </li>
          </ul>

          <div style={{ marginTop: '3rem', padding: '1.5rem', background: '#F9FAFB', borderLeft: '3px solid #2563EB', borderRadius: '0.25rem' }}>
            <p style={{ margin: 0, fontSize: '0.9375rem', color: '#374151', fontStyle: 'italic' }}>
              The AI Agent Index treats data as the product, not the wrapper. Every listing is a structured record before it is a page.
            </p>
          </div>

        </article>
      </section>
    </div>
  )
}