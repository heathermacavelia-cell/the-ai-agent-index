export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Changelog',
  description: 'Recent updates, new agents, pricing changes and new integrations tracked across the AI Agent Index.',
  alternates: {
    canonical: 'https://theaiagentindex.com/changelog',
  },
}

const TYPE_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  pricing: { label: 'Pricing', color: '#2563EB', bg: '#EFF6FF' },
  integration: { label: 'Integration', color: '#7C3AED', bg: '#F5F3FF' },
  verified: { label: 'Verified', color: '#059669', bg: '#ECFDF5' },
  new_agent: { label: 'New Agent', color: '#10B981', bg: '#D1FAE5' },
  feature: { label: 'Feature', color: '#D97706', bg: '#FFFBEB' },
}

export default async function ChangelogPage() {
  const supabase = createClient()
  const { data: entries } = await supabase
    .from('changelog')
    .select('*')
    .order('published_at', { ascending: false })

  const items = entries ?? []

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'AI Agent Index Changelog',
    itemListElement: items.map((entry, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: entry.agent_name,
      description: entry.description,
    })),
  }

  return (
    <div style={{ maxWidth: '768px', margin: '0 auto', padding: '64px 24px' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div style={{ marginBottom: '48px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
          Agent Updates
        </p>
        <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#111827', marginBottom: '12px', letterSpacing: '-0.02em' }}>
          Changelog
        </h1>
        <p style={{ fontSize: '16px', color: '#6B7280', lineHeight: '1.6' }}>
          Pricing changes, new integrations, newly verified agents and new listings — curated weekly.
        </p>
      </div>

      {items.length === 0 ? (
        <p style={{ color: '#9CA3AF', fontSize: '15px' }}>No updates yet — check back soon.</p>
      ) : (
        <div style={{ position: 'relative', paddingLeft: '24px', borderLeft: '2px solid #F3F4F6' }}>
          {items.map((entry) => {
            const typeStyle = TYPE_STYLES[entry.change_type] ?? { label: entry.change_type, color: '#6B7280', bg: '#F9FAFB' }
            const date = new Date(entry.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            return (
              <div key={entry.id} style={{ marginBottom: '40px', position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-33px', top: '4px', width: '8px', height: '8px', borderRadius: '50%', background: typeStyle.color, border: '2px solid white' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', color: '#9CA3AF', fontFamily: 'monospace' }}>{date}</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: typeStyle.color, background: typeStyle.bg, borderRadius: '999px', padding: '2px 10px' }}>
                    {typeStyle.label}
                  </span>
                </div>
                <div style={{ fontWeight: 600, color: '#111827', fontSize: '15px', marginBottom: '4px' }}>
                {entry.agent_slug ? (
                    <Link href={`/agents/${entry.agent_slug}`} style={{ color: '#111827', textDecoration: 'none' }}>
                      {entry.agent_name}
                    </Link>
                  ) : (
                    entry.agent_name
                  )}
                </div>
                <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.6', margin: 0 }}>
                  {entry.description}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}