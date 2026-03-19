import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CATEGORY_SLUGS } from '@/lib/taxonomy'
import type { Metadata } from 'next'
import CategoryPageClient from '@/components/CategoryPageClient'

interface Props {
  params: { category: string }
}

const CATEGORY_META: Record<string, { icon: string; description: string; longDescription: string; bgColor: string; borderColor: string }> = {
  'ai-sales-agents': { icon: '💼', description: 'Lead generation, outbound automation, pipeline intelligence', longDescription: 'AI agents that automate prospecting, outbound email, lead enrichment, CRM workflows, and revenue forecasting.', bgColor: '#F0FDF4', borderColor: '#BBF7D0' },
  'ai-customer-support-agents': { icon: '🎧', description: 'Ticket resolution, omnichannel support, autonomous helpdesk', longDescription: 'AI agents that autonomously resolve support tickets, triage queries, and provide omnichannel customer service at scale.', bgColor: '#FAF5FF', borderColor: '#E9D5FF' },
  'ai-research-agents': { icon: '🔬', description: 'Deep research, academic literature, web synthesis', longDescription: 'AI agents that conduct multi-step web research, search academic literature, synthesise findings, and generate structured reports.', bgColor: '#FFFBEB', borderColor: '#FDE68A' },
  'ai-marketing-agents': { icon: '📣', description: 'Content creation, SEO, paid media, campaign automation', longDescription: 'AI agents that generate marketing content, optimise SEO, automate paid campaigns, and personalise messaging at scale.', bgColor: '#FFF1F2', borderColor: '#FECDD3' },
  'ai-coding-agents': { icon: '💻', description: 'Code generation, agentic coding, IDE integration', longDescription: 'AI agents that write, review, and refactor code — from inline autocomplete to fully autonomous multi-file engineering tasks.', bgColor: '#EFF6FF', borderColor: '#BFDBFE' },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const displayName = Object.entries(CATEGORY_SLUGS).find(([, slug]) => slug === params.category)?.[0]
  if (!displayName) return {}
  return {
    title: displayName + ' — AI Agent Index',
    description: CATEGORY_META[params.category]?.longDescription,
  }
}

export async function generateStaticParams() {
  return Object.values(CATEGORY_SLUGS).map((slug) => ({ category: slug }))
}

export default async function CategoryPage({ params }: Props) {
  const { category } = params
  const validSlugs = Object.values(CATEGORY_SLUGS)
  if (!validSlugs.includes(category)) notFound()

  const displayName = Object.entries(CATEGORY_SLUGS).find(([, slug]) => slug === category)?.[0] ?? category
  const meta = CATEGORY_META[category]

  const supabase = createClient()
  const { data: agents } = await supabase
    .from('agents')
    .select('id, name, slug, developer, short_description, primary_category, pricing_model, starting_price, customer_segment, rating_avg, rating_count, editorial_rating, is_featured, capability_tags, industry_tags')
    .eq('primary_category', category)
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .order('rating_avg', { ascending: false })

  const agentList = agents ?? []

  return (
    <div>
      <section style={{ backgroundColor: meta?.bgColor ?? '#F9FAFB', borderBottom: '1px solid', borderColor: meta?.borderColor ?? '#E5E7EB', padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6B7280', marginBottom: '1.5rem' }}>
            <Link href="/" style={{ color: '#6B7280', textDecoration: 'none' }}>Home</Link>
            <span style={{ color: '#D1D5DB' }}>/</span>
            <span style={{ color: '#111827' }}>{displayName}</span>
          </nav>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
            <div style={{ width: '3.5rem', height: '3.5rem', backgroundColor: 'white', border: '1px solid', borderColor: meta?.borderColor ?? '#E5E7EB', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
              {meta?.icon ?? '🤖'}
            </div>
            <div>
              <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>{displayName}</h1>
              <p style={{ color: '#6B7280', maxWidth: '560px', lineHeight: 1.6, fontSize: '0.9375rem' }}>{meta?.longDescription}</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
        <CategoryPageClient agents={agentList} />
      </section>
    </div>
  )
}