export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CATEGORY_SLUGS } from '@/lib/taxonomy'
import type { Metadata } from 'next'
import CategoryPageClient from '@/components/CategoryPageClient'

interface Props {
  params: { category: string }
}

const CATEGORY_META: Record<string, { icon: React.ReactNode; description: string; longDescription: string; bgColor: string; borderColor: string }> = {
  'ai-sales-agents': { icon: <img src="/icons/icon-sales.png" alt="AI Sales Agents" style={{ width: '2.5rem', height: '2.5rem', objectFit: 'contain' }} />, description: 'Lead generation, outbound automation, pipeline intelligence', longDescription: 'AI agents that automate prospecting, outbound email, lead enrichment, CRM workflows, and revenue forecasting.', bgColor: '#F0FDF4', borderColor: '#BBF7D0' },
  'ai-customer-support-agents': { icon: <img src="/icons/icon-support.png" alt="AI Customer Support Agents" style={{ width: '2.5rem', height: '2.5rem', objectFit: 'contain' }} />, description: 'Ticket resolution, omnichannel support, autonomous helpdesk', longDescription: 'AI agents that autonomously resolve support tickets, triage queries, and provide omnichannel customer service at scale.', bgColor: '#FAF5FF', borderColor: '#E9D5FF' },
  'ai-research-agents': { icon: <img src="/icons/icon-research.png" alt="AI Research Agents" style={{ width: '2.5rem', height: '2.5rem', objectFit: 'contain' }} />, description: 'Deep research, academic literature, web synthesis', longDescription: 'AI agents that conduct multi-step web research, search academic literature, synthesise findings, and generate structured reports.', bgColor: '#FFFBEB', borderColor: '#FDE68A' },
  'ai-marketing-agents': { icon: <img src="/icons/icon-marketing.png" alt="AI Marketing Agents" style={{ width: '2.5rem', height: '2.5rem', objectFit: 'contain' }} />, description: 'Content creation, SEO, paid media, campaign automation', longDescription: 'AI agents that generate marketing content, optimise SEO, automate paid campaigns, and personalise messaging at scale.', bgColor: '#FFF1F2', borderColor: '#FECDD3' },
  'ai-coding-agents': { icon: <img src="/icons/icon-coding.png" alt="AI Coding Agents" style={{ width: '2.5rem', height: '2.5rem', objectFit: 'contain' }} />, description: 'Code generation, agentic coding, IDE integration', longDescription: 'AI agents that write, review, and refactor code — from inline autocomplete to fully autonomous multi-file engineering tasks.', bgColor: '#EFF6FF', borderColor: '#BFDBFE' },
  'ai-hr-agents': { icon: <img src="/icons/icon-hr.png" alt="AI HR Agents" style={{ width: '2.5rem', height: '2.5rem', objectFit: 'contain' }} />, description: 'Hiring, onboarding, payroll automation, compliance, workforce management', longDescription: 'AI agents that automate recruiting, onboarding, payroll processing, compliance monitoring, and workforce management across global teams.', bgColor: '#F0FDFA', borderColor: '#99F6E4' },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const displayName = Object.entries(CATEGORY_SLUGS).find(([, slug]) => slug === params.category)?.[0]
  if (!displayName) return {}
  const url = 'https://theaiagentindex.com/' + params.category
  return {
    title: displayName + ' — AI Agent Index',
    description: CATEGORY_META[params.category]?.longDescription,
    openGraph: {
      title: displayName + ' — AI Agent Index',
      description: CATEGORY_META[params.category]?.longDescription,
      url,
      type: 'website',
      siteName: 'The AI Agent Index',
    },
    twitter: {
      card: 'summary',
      title: displayName + ' — AI Agent Index',
      description: CATEGORY_META[params.category]?.longDescription,
    },
    alternates: { canonical: url },
  }
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
    .select('*')
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
            <div style={{ width: '3.5rem', height: '3.5rem', backgroundColor: 'white', border: '1px solid', borderColor: meta?.borderColor ?? '#E5E7EB', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
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
        <CategoryPageClient agents={agentList} categorySlug={category} />
      </section>
    </div>
  )
}