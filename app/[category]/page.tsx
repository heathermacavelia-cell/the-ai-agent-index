import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CATEGORY_SLUGS } from '@/lib/taxonomy'
import type { Agent } from '@/types/agent'
import type { Metadata } from 'next'

interface Props {
  params: { category: string }
}

const CATEGORY_META: Record<string, {
  icon: string
  description: string
  longDescription: string
  color: string
  lightColor: string
  borderColor: string
  bgGrad: string
}> = {
  'ai-sales-agents': {
    icon: '📈',
    description: 'Lead generation, outbound automation, pipeline intelligence',
    longDescription: 'AI agents that automate prospecting, outbound email, lead enrichment, CRM workflows, and revenue forecasting.',
    color: 'text-emerald-700',
    lightColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    bgGrad: 'from-emerald-50 to-white',
  },
  'ai-customer-support-agents': {
    icon: '💬',
    description: 'Ticket resolution, omnichannel support, autonomous helpdesk',
    longDescription: 'AI agents that autonomously resolve support tickets, triage queries, and provide omnichannel customer service at scale.',
    color: 'text-violet-700',
    lightColor: 'bg-violet-50',
    borderColor: 'border-violet-200',
    bgGrad: 'from-violet-50 to-white',
  },
  'ai-research-agents': {
    icon: '🔍',
    description: 'Deep research, academic literature, web synthesis',
    longDescription: 'AI agents that conduct multi-step web research, search academic literature, synthesise findings, and generate structured reports.',
    color: 'text-amber-700',
    lightColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    bgGrad: 'from-amber-50 to-white',
  },
  'ai-marketing-agents': {
    icon: '📣',
    description: 'Content creation, SEO, paid media, campaign automation',
    longDescription: 'AI agents that generate marketing content, optimise SEO, automate paid campaigns, and personalise messaging at scale.',
    color: 'text-rose-700',
    lightColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    bgGrad: 'from-rose-50 to-white',
  },
  'ai-coding-agents': {
    icon: '⚡',
    description: 'Code generation, agentic coding, IDE integration, terminals',
    longDescription: 'AI agents that write, review, and refactor code — from inline autocomplete to fully autonomous multi-file engineering tasks.',
    color: 'text-blue-700',
    lightColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    bgGrad: 'from-blue-50 to-white',
  },
}

const PRICING_COLORS: Record<string, string> = {
  free: 'bg-green-50 text-green-700',
  freemium: 'bg-teal-50 text-teal-700',
  subscription: 'bg-blue-50 text-blue-700',
  'usage-based': 'bg-orange-50 text-orange-700',
  custom: 'bg-gray-100 text-gray-600',
}

const SEGMENT_COLORS: Record<string, string> = {
  b2c: 'bg-purple-50 text-purple-700',
  smb: 'bg-sky-50 text-sky-700',
  b2b: 'bg-indigo-50 text-indigo-700',
  enterprise: 'bg-gray-100 text-gray-700',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const displayName = Object.entries(CATEGORY_SLUGS).find(([, slug]) => slug === params.category)?.[0]
  if (!displayName) return {}
  return {
    title: displayName,
    description: CATEGORY_META[params.category]?.longDescription,
  }
}

export async function generateStaticParams() {
  return Object.values(CATEGORY_SLUGS).map((slug) => ({ category: slug }))
}

function StarRating({ avg }: { avg: number }) {
  const stars = Math.round(avg)
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`w-3 h-3 ${i <= stars ? 'text-amber-400' : 'text-gray-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs text-gray-500 ml-1">{avg > 0 ? avg.toFixed(1) : '—'}</span>
    </div>
  )
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

  const agentList: Agent[] = agents ?? []
  const featuredCount = agentList.filter((a) => a.is_featured).length

  return (
    <div>
      <section className={`bg-gradient-to-b ${meta?.bgGrad ?? 'from-gray-50 to-white'} border-b border-gray-200`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
            <svg className="w-3 h-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900">{displayName}</span>
          </nav>

          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-2xl ${meta?.lightColor ?? 'bg-gray-100'} border ${meta?.borderColor ?? 'border-gray-200'} flex items-center justify-center text-2xl flex-shrink-0`}>
              {meta?.icon ?? '🤖'}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{displayName}</h1>
              <p className="text-gray-600 max-w-xl leading-relaxed">{meta?.longDescription}</p>
              <div className="flex items-center gap-4 mt-3">
                <span className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-900">{agentList.length}</span> agents
                </span>
                {featuredCount > 0 && (
                  <span className="text-sm text-gray-500">
                    <span className="font-semibold text-gray-900">{featuredCount}</span> featured
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {agentList.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No agents found in this category.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agentList.map((agent) => (
              <Link
                key={agent.id}
                href={`/agents/${agent.slug}`}
                className="group block bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-50 transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                        {agent.name}
                      </h2>
                      {agent.is_featured && (
                        <span className="flex-shrink-0 inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white uppercase tracking-wide">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{agent.developer}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${PRICING_COLORS[agent.pricing_model] ?? 'bg-gray-100 text-gray-600'}`}>
                      {agent.pricing_model}
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${SEGMENT_COLORS[agent.customer_segment] ?? 'bg-gray-100 text-gray-600'}`}>
                      {agent.customer_segment}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-2">
                  {agent.short_description}
                </p>

                <StarRating avg={agent.rating_avg ?? 0} />

                <div className="mt-3 flex flex-wrap gap-1">
                  {agent.capability_tags?.slice(0, 3).map((tag) => (
                    <span key={tag} className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-mono bg-gray-100 text-gray-500">
                      {tag}
                    </span>
                  ))}
                  {(agent.capability_tags?.length ?? 0) > 3 && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] text-gray-400">
                      +{(agent.capability_tags?.length ?? 0) - 3}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
