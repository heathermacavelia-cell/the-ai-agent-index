export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient()
  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, excerpt, meta_title, meta_description, cover_image_url')
    .eq('slug', params.slug)
    .eq('is_published', true)
    .single()

  if (!post) return { title: 'Post Not Found' }

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    alternates: {
      canonical: `https://theaiagentindex.com/blog/${params.slug}`,
    },
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      url: `https://theaiagentindex.com/blog/${params.slug}`,
      type: 'article',
      ...(post.cover_image_url ? { images: [{ url: post.cover_image_url }] } : {}),
    },
  }
}

/* Simple markdown-to-HTML for blog content */
function renderMarkdown(md: string): string {
  let html = md
    // Headings
    .replace(/^### (.+)$/gm, '<h3 style="font-size:1.125rem;font-weight:700;color:#111827;margin:2rem 0 0.75rem;">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 style="font-size:1.375rem;font-weight:800;color:#111827;margin:2.5rem 0 1rem;letter-spacing:-0.01em;">$1</h2>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:#2563EB;text-decoration:underline;" target="_blank" rel="noopener noreferrer">$1</a>')
    // Paragraphs
    .split('\n\n')
    .map(block => {
      if (block.startsWith('<h2') || block.startsWith('<h3')) return block
      return `<p style="font-size:1.0625rem;line-height:1.75;color:#374151;margin-bottom:1.25rem;">${block}</p>`
    })
    .join('\n')
  return html
}

export default async function BlogPostPage({ params }: Props) {
  const supabase = createClient()
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_published', true)
    .single()

  if (!post) notFound()

  const date = new Date(post.published_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    url: `https://theaiagentindex.com/blog/${post.slug}`,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'The AI Agent Index',
      url: 'https://theaiagentindex.com',
    },
    ...(post.cover_image_url ? { image: post.cover_image_url } : {}),
  }

  const contentHtml = renderMarkdown(post.content)

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '64px 24px' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Back link */}
      <Link
        href="/blog"
        style={{
          fontSize: '0.8125rem',
          color: '#6B7280',
          textDecoration: 'none',
          display: 'inline-block',
          marginBottom: '2rem',
        }}
      >
        ← Back to Blog
      </Link>

      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <span style={{
            fontSize: '0.6875rem',
            fontWeight: 700,
            color: '#2563EB',
            backgroundColor: '#EFF6FF',
            padding: '0.2rem 0.625rem',
            borderRadius: '9999px',
            textTransform: 'uppercase' as const,
            letterSpacing: '0.05em',
          }}>
            {post.category}
          </span>
          <span style={{ fontSize: '0.8125rem', color: '#9CA3AF' }}>{date}</span>
        </div>

        <h1 style={{
          fontSize: '2.25rem',
          fontWeight: 800,
          color: '#111827',
          lineHeight: 1.2,
          letterSpacing: '-0.025em',
          marginBottom: '1rem',
        }}>
          {post.title}
        </h1>

        <p style={{ fontSize: '1.125rem', color: '#6B7280', lineHeight: 1.6 }}>
          {post.excerpt}
        </p>

        <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#9CA3AF' }}>
          By {post.author}
        </div>
      </div>

      {/* Cover image */}
      {post.cover_image_url && (
        <div style={{ marginBottom: '2.5rem', borderRadius: '0.875rem', overflow: 'hidden' }}>
          <img
            src={post.cover_image_url}
            alt={post.title}
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>
      )}

      {/* Content */}
      <div dangerouslySetInnerHTML={{ __html: contentHtml }} />

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid #E5E7EB' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {post.tags.map((tag: string) => (
              <span
                key={tag}
                style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  backgroundColor: '#F3F4F6',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div style={{
        marginTop: '3rem',
        padding: '2rem',
        backgroundColor: '#F9FAFB',
        borderRadius: '0.875rem',
        border: '1px solid #E5E7EB',
        textAlign: 'center',
      }}>
        <p style={{ fontWeight: 700, color: '#111827', fontSize: '1.0625rem', marginBottom: '0.5rem' }}>
          Explore the directory
        </p>
        <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '1rem' }}>
          Search, filter, and compare over 300 AI agents across eight business categories.
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-block',
            padding: '0.625rem 1.5rem',
            backgroundColor: '#2563EB',
            color: 'white',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          Browse AI Agents
        </Link>
      </div>
    </div>
  )
}