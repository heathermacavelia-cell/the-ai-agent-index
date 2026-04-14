'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

interface Comparison {
  slug: string
  agent_a: string
  agent_b: string
  agent_c: string | null
  category: string
}

const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  'AI Coding Agents': { bg: '#EFF6FF', color: '#1D4ED8' },
  'AI Customer Support Agents': { bg: '#FAF5FF', color: '#7E22CE' },
  'AI Sales Agents': { bg: '#F0FDF4', color: '#15803D' },
  'AI Marketing Agents': { bg: '#FFF1F2', color: '#BE123C' },
  'AI Research Agents': { bg: '#FFFBEB', color: '#B45309' },
  'AI HR Agents': { bg: '#F0FDFA', color: '#0F766E' },
}

export default function CompareList({ comparisons }: { comparisons: Comparison[] }) {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const categories = useMemo(() => {
    const cats = [...new Set(comparisons.map(c => c.category))].sort()
    return cats
  }, [comparisons])

  const filtered = useMemo(() => {
    return comparisons.filter(comp => {
      const matchesCategory = !activeCategory || comp.category === activeCategory
      const searchStr = [comp.agent_a, comp.agent_b, comp.agent_c ?? ''].join(' ').toLowerCase()
      const matchesQuery = !query || searchStr.includes(query.toLowerCase())
      return matchesCategory && matchesQuery
    })
  }, [comparisons, query, activeCategory])

  return (
    <div>
      {/* Search input */}
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Filter by agent name..."
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

      {/* Category pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setActiveCategory(null)}
          style={{
            padding: '0.375rem 0.875rem',
            borderRadius: '9999px',
            fontSize: '0.8125rem',
            fontWeight: 600,
            border: '1px solid',
            cursor: 'pointer',
            backgroundColor: !activeCategory ? '#111827' : 'white',
            color: !activeCategory ? 'white' : '#6B7280',
            borderColor: !activeCategory ? '#111827' : '#E5E7EB',
          }}
        >
          All
        </button>
        {categories.map(cat => {
          const style = CATEGORY_COLORS[cat] ?? { bg: '#F3F4F6', color: '#374151' }
          const isActive = activeCategory === cat
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(isActive ? null : cat)}
              style={{
                padding: '0.375rem 0.875rem',
                borderRadius: '9999px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                border: '1px solid',
                cursor: 'pointer',
                backgroundColor: isActive ? style.color : 'white',
                color: isActive ? 'white' : style.color,
                borderColor: isActive ? style.color : style.bg,
              }}
            >
              {cat}
            </button>
          )
        })}
      </div>

      {/* Results count */}
      {(query || activeCategory) && (
        <p style={{ fontSize: '0.8125rem', color: '#9CA3AF', marginBottom: '1rem' }}>
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#9CA3AF', backgroundColor: '#F9FAFB', borderRadius: '0.75rem', border: '1px solid #E5E7EB' }}>
            No comparisons found for &ldquo;{query}&rdquo;
          </div>
        ) : (
          filtered.map(comp => {
            const style = CATEGORY_COLORS[comp.category] ?? { bg: '#F3F4F6', color: '#374151' }
            return (
              <Link key={comp.slug} href={'/compare/' + comp.slug}
                style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.25rem 1.5rem', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: '#111827', marginBottom: '0.25rem' }}>
                    {comp.agent_a} vs {comp.agent_b}{comp.agent_c ? ' vs ' + comp.agent_c : ''}
                  </div>
                  <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', backgroundColor: style.bg, color: style.color, fontWeight: 500 }}>
                    {comp.category}
                  </span>
                </div>
                <span style={{ color: '#2563EB', fontSize: '1rem', flexShrink: 0 }}>→</span>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}