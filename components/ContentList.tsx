'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

interface ContentItem {
  slug: string
  title: string
  description: string
}

interface Props {
  items: ContentItem[]
  basePath: string
  linkLabel: string
}

export default function ContentList({ items, basePath, linkLabel }: Props) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query) return items
    return items.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description?.toLowerCase().includes(query.toLowerCase())
    )
  }, [items, query])

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '0.625rem 1rem',
            fontSize: '0.9375rem',
            border: '1px solid #E5E7EB',
            borderRadius: '0.5rem',
            outline: 'none',
            backgroundColor: 'white',
            color: '#111827',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {query && (
        <p style={{ fontSize: '0.8125rem', color: '#9CA3AF', marginBottom: '1rem' }}>
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#9CA3AF', backgroundColor: '#F9FAFB', borderRadius: '0.75rem', border: '1px solid #E5E7EB' }}>
            No results found for &ldquo;{query}&rdquo;
          </div>
        ) : (
          filtered.map(item => (
            <Link key={item.slug} href={basePath + item.slug}
              style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.5rem', textDecoration: 'none', display: 'block' }}>
              <h2 style={{ fontWeight: 700, fontSize: '1.0625rem', color: '#111827', marginBottom: '0.375rem' }}>{item.title}</h2>
              <p style={{ fontSize: '0.875rem', color: '#6B7280', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                {item.description && item.description.length > 160 ? item.description.slice(0, 160) + '...' : item.description}
              </p>
              <span style={{ fontSize: '0.875rem', color: '#2563EB', fontWeight: 500 }}>{linkLabel} →</span>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}