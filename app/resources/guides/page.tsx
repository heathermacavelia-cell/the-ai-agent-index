import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'AI Agent Guides — AI Agent Index',
  description: 'Practical guides on how to evaluate, deploy, and build with AI agents for business automation.',
}

const guides = [
  {
    slug: 'best-ai-agents-for-outbound-sales',
    title: 'Best AI Agents for Outbound Sales',
    description: 'A structured guide to the top AI SDRs and outbound automation tools — covering prospecting, personalised email outreach, follow-up sequencing, and lead qualification.',
    category: 'Sales',
    readTime: '5 min read',
  },
  {
    slug: 'hubspot-vs-ai-agents',
    title: 'HubSpot vs AI Agents — Do You Need Both?',
    description: 'HubSpot is a CRM. AI agents are autonomous workers. This guide explains the difference, whey overlap, and how to decide what your team actually needs.',
    category: 'Sales',
    readTime: '6 min read',
  },
  {
    slug: 'how-to-evaluate-an-ai-agent',
    title: 'How to Evaluate an AI Agent Before Buying',
    description: 'A structured framework for evaluating AI agents — covering accuracy, integration, deployment complexity, pricing, and trust signals. Built for B2B buyers.',
    category: 'Buying Advice',
    readTime: '7 min read',
  },
]

export default function GuidesPage() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <Link href="/resources" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginBottom: '1.5rem' }}>← Resources</Link>
      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Guides</p>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#111827', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>AI Agent Guides</h1>
      <p style={{ color: '#6B7280', fontSize: '1rem', lineHeight: 1.6, maxWidth: '560px', marginBottom: '3rem' }}>
        Practical guides on evaluating, deploying, and getting the most from AI agents.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {guides.map((guide) => (
          <Link key={guide.slug} href={'/resources/guides/' + guide.slug}
            style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: '1px solid #E5E7EB', padding: '1.5rem', textDecoration: 'none', display: 'block' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.6875rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.2rem 0.5rem', borderRadius: '9999px', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>{guide.category}</span>
              <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{guide.readTime}</span>
            </div>
            <h2 style={{ fontWeight: 700, fontSize: '1.0625rem', color: '#111827', marginBottom: '0.375rem' }}>{guide.title}</h2>
            <p style={{ fontSize: '0.875rem', color: '#6B7280', lineHeight: 1.6, marginBottom: '0.75rem' }}>{guide.description}</p>
            <span style={{ fontSize: '0.875rem', color: '#2563EB', fontWeight: 500 }}>Read guide →</span>
          </Link>
        ))}
      </div>
      <div style={{ marginTop: '3rem', backgroundColor: '#F9FAFB', borderRadius: '0.875rem', border: '1px solid #E5E7EB', padding: '1.5rem', textAlign: 'center' as const }}>
        <p style={{ fontWeight: 600, color: '#111827', marginBottom: '0.375rem' }}>More guides coming soon</p>
        <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '1rem' }}>Topics include how to evaluate AI agents, HubSpot vs AI agents, and more.</p>
        <Link href="/resources/newsletter" style={{ display: 'inline-flex', padding: '0.5rem 1.25rem', backgroundColor: '#2563EB', color: 'white', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
          Get notified →
        </Link>
      </div>
    </div>
  )
}