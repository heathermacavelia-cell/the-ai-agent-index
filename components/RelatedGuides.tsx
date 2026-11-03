import Link from 'next/link'
import { createClient } from '@/lib/supabase'

/**
 * Plain links to guides. Category, alternatives and comparison pages show the guides in
 * their category plus two general guides. The homepage passes a fixed list of slugs.
 * Titles come from the guides table, so a retitled guide updates everywhere.
 * Added 2026-11-03: until then no category, alternatives, comparison or home page linked
 * to any guide.
 */
const GENERAL_GUIDES = ['what-is-an-ai-agent', 'how-to-evaluate-an-ai-agent']

interface GuideLink {
  slug: string
  title: string
}

interface Props {
  category?: string
  slugs?: string[]
  heading?: string
  limit?: number
}

export default async function RelatedGuides({ category, slugs, heading = 'Related guides', limit = 6 }: Props) {
  const supabase = createClient()
  const wanted = slugs ?? GENERAL_GUIDES
  const { data: fixed } = await supabase
    .from('guides')
    .select('slug, title')
    .eq('is_active', true)
    .in('slug', wanted)
  const ordered = wanted
    .map((s) => (fixed ?? []).find((g: GuideLink) => g.slug === s))
    .filter((g): g is GuideLink => Boolean(g))

  let inCategory: GuideLink[] = []
  if (category) {
    const { data } = await supabase
      .from('guides')
      .select('slug, title')
      .eq('is_active', true)
      .eq('primary_category', category)
      .order('title')
      .limit(limit)
    inCategory = (data ?? []) as GuideLink[]
  }

  const links = [...inCategory, ...ordered.filter((g) => !inCategory.some((c) => c.slug === g.slug))]
  if (links.length === 0) return null

  return (
    <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2rem', marginTop: '2rem', marginBottom: '2rem' }}>
      <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>{heading}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {links.map((g) => (
          <Link key={g.slug} href={'/resources/guides/' + g.slug} style={{ fontSize: '0.875rem', color: '#2563EB', textDecoration: 'none' }}>
            {g.title}
          </Link>
        ))}
      </div>
    </div>
  )
}
