export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase'
import BlogList from '@/components/BlogList'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'AI Agent News, Reviews, and Analysis',
  description: 'Editorial analysis, agent reviews, and industry commentary from The AI Agent Index.',
  alternates: {
    canonical: 'https://theaiagentindex.com/blog',
  },
}

export default async function BlogPage() {
  const supabase = createClient()
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, title, excerpt, category, tags, cover_image_url, author, published_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  const items = posts ?? []

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'The AI Agent Index Blog',
    description: 'Editorial analysis, agent reviews, and industry commentary from The AI Agent Index.',
    url: 'https://theaiagentindex.com/blog',
    blogPost: items.map(post => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      url: `https://theaiagentindex.com/blog/${post.slug}`,
      datePublished: post.published_at,
      author: {
        '@type': 'Person',
        name: post.author,
      },
    })),
  }

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '64px 24px' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div style={{ marginBottom: '48px' }}>
        <p style={{
          fontSize: '11px',
          fontWeight: 700,
          color: '#2563EB',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: '12px',
        }}>
          Blog
        </p>
        <h1 style={{
          fontSize: '36px',
          fontWeight: 800,
          color: '#111827',
          marginBottom: '12px',
          letterSpacing: '-0.02em',
        }}>
          Analysis & Commentary
        </h1>
        <p style={{ fontSize: '16px', color: '#6B7280', lineHeight: '1.6' }}>
          Editorial analysis, agent reviews, partner spotlights, and industry commentary.
        </p>
      </div>

      <BlogList posts={items} />
    </div>
  )
}