'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  category: string
  tags: string[]
  cover_image_url: string | null
  author: string
  published_at: string
}

interface Props {
  posts: BlogPost[]
}

const CATEGORY_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  editorial: { label: 'Editorial', color: '#2563EB', bg: '#EFF6FF' },
  review: { label: 'Review', color: '#059669', bg: '#ECFDF5' },
  'industry-news': { label: 'Industry News', color: '#7C3AED', bg: '#F5F3FF' },
  tutorial: { label: 'Tutorial', color: '#D97706', bg: '#FFFBEB' },
  partner: { label: 'Partner', color: '#DC2626', bg: '#FEF2F2' },
}

export default function BlogList({ posts }: Props) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const categories = useMemo(() => {
    const seen = new Set<string>()
    return posts
      .map(p => p.category)
      .filter(c => {
        if (seen.has(c)) return false
        seen.add(c)
        return true
      })
  }, [posts])

  const filtered = useMemo(() => {
    return posts.filter(p => {
      const matchesSearch = !search
        || p.title.toLowerCase().includes(search.toLowerCase())
        || p.excerpt.toLowerCase().includes(search.toLowerCase())
        || p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
      const matchesCategory = !activeCategory || p.category === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [posts, search, activeCategory])

  return (
    <div>
      {/* Search */}
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '420px',
            padding: '0.625rem 1rem',
            borderRadius: '0.625rem',
            border: '1px solid #E5E7EB',
            fontSize: '0.9375rem',
            color: '#111827',
            outline: 'none',
            boxSizing: 'border-box' as const,
          }}
        />
      </div>

      {/* Category pills */}
      {categories.length > 1 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
          <button
            onClick={() => setActiveCategory(null)}
            style={{
              padding: '0.375rem 0.875rem',
              borderRadius: '9999px',
              border: '1px solid',
              borderColor: activeCategory === null ? '#2563EB' : '#E5E7EB',
              backgroundColor: activeCategory === null ? '#EFF6FF' : 'white',
              color: activeCategory === null ? '#2563EB' : '#6B7280',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            All
          </button>
          {categories.map(cat => {
            const style = CATEGORY_STYLES[cat] ?? { label: cat, color: '#6B7280', bg: '#F9FAFB' }
            const isActive = activeCategory === cat
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(isActive ? null : cat)}
                style={{
                  padding: '0.375rem 0.875rem',
                  borderRadius: '9999px',
                  border: '1px solid',
                  borderColor: isActive ? style.color : '#E5E7EB',
                  backgroundColor: isActive ? style.bg : 'white',
                  color: isActive ? style.color : '#6B7280',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {style.label}
              </button>
            )
          })}
        </div>
      )}

      {/* Results count when searching */}
      {search && (
        <p style={{ fontSize: '0.8125rem', color: '#9CA3AF', marginBottom: '1rem' }}>
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Post grid */}
      {filtered.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#9CA3AF', backgroundColor: '#F9FAFB', borderRadius: '0.75rem', border: '1px solid #E5E7EB' }}>
          No posts found{search ? ` for "${search}"` : ''}.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {filtered.map(post => {
            const catStyle = CATEGORY_STYLES[post.category] ?? { label: post.category, color: '#6B7280', bg: '#F9FAFB' }
            const date = new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', borderRadius: '0.875rem', border: '1px solid #E5E7EB', overflow: 'hidden', backgroundColor: 'white', transition: 'box-shadow 0.15s ease' }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
              >
                {/* Cover image */}
                {post.cover_image_url ? (
                  <div style={{ width: '100%', height: '200px', overflow: 'hidden', backgroundColor: '#F3F4F6' }}>
                    <img
                      src={post.cover_image_url}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                ) : (
                  <div style={{ width: '100%', height: '200px', background: 'linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '2.5rem', opacity: 0.3 }}>✦</span>
                  </div>
                )}

                {/* Content */}
                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <span style={{
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      color: catStyle.color,
                      backgroundColor: catStyle.bg,
                      padding: '0.15rem 0.625rem',
                      borderRadius: '9999px',
                      textTransform: 'uppercase' as const,
                      letterSpacing: '0.05em',
                    }}>
                      {catStyle.label}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{date}</span>
                  </div>
                  <h2 style={{ fontWeight: 700, fontSize: '1.0625rem', color: '#111827', marginBottom: '0.5rem', lineHeight: 1.35 }}>
                    {post.title}
                  </h2>
                  <p style={{ fontSize: '0.875rem', color: '#6B7280', lineHeight: 1.6, flex: 1 }}>
                    {post.excerpt.length > 180 ? post.excerpt.slice(0, 180) + '...' : post.excerpt}
                  </p>
                  <span style={{ fontSize: '0.875rem', color: '#2563EB', fontWeight: 500, marginTop: '0.75rem' }}>
                    Read more →
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}