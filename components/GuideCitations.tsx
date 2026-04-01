import React from 'react'
import { createClient } from '@/lib/supabase'

interface Citation {
  title: string
  url: string
  source: string
  year?: number
}

interface Props {
  slug: string
  table: 'guides' | 'alternatives'
}

const linkStyle: React.CSSProperties = {
  fontSize: '0.875rem',
  color: '#2563EB',
  textDecoration: 'none',
  fontWeight: 500,
}

const sourceStyle: React.CSSProperties = {
  fontSize: '0.8125rem',
  color: '#6B7280',
}

const numberStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  color: '#9CA3AF',
  fontWeight: 600,
  flexShrink: 0,
  width: '1.25rem',
}

export default async function GuideCitations({ slug, table }: Props) {
  const supabase = createClient()

  const { data } = await supabase
    .from(table)
    .select('external_citations')
    .eq('slug', slug)
    .single()

  const citations: Citation[] = data?.external_citations ?? []
  if (!citations || citations.length === 0) return null

  const citationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Sources and References',
    itemListElement: citations.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'CreativeWork',
        name: c.title,
        url: c.url,
        publisher: { '@type': 'Organization', name: c.source },
      },
    })),
  }

  return (
    <React.Fragment>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(citationJsonLd) }}
      />
      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2rem', marginTop: '2.5rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>
          Sources & References
        </h2>
        <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {citations.map((c, i) => (
            <li key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'baseline' }}>
              <span style={numberStyle}>{i + 1}.</span>
              <div>
                <a href={c.url} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                  {c.title}
                </a>
                <span style={sourceStyle}>
                  {' '}— {c.source}{c.year ? ', ' + c.year : ''}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </React.Fragment>
  )
}