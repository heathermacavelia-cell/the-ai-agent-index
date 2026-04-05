export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { CATEGORY_SLUGS } from '@/lib/taxonomy'
import type { Agent } from '@/types/agent'
import MatchTeaser from '@/components/MatchTeaser'
import HeroSearch from '@/components/HeroSearch'
import AgentLogo from '@/components/AgentLogo'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The AI Agent Index — Structured Directory of AI Agents',
  description: 'The structured directory of AI agents for business automation. Dataset-first, machine-readable, designed to be cited by AI systems.',
  alternates: {
    canonical: 'https://theaiagentindex.com',
  },
}

const CATEGORY_META: Record<string, { icon: React.ReactNode; description: string; color: string; lightColor: string; borderColor: string }> = {
  'ai-sales-agents': { icon: <img src="/icons/icon-sales.png" alt="AI Sales Agents" style={{ width: '1.875rem', height: '1.875rem', objectFit: 'contain' }} />, description: 'Lead generation, outbound automation, pipeline intelligence', color: 'text-emerald-700', lightColor: 'bg-emerald-50', borderColor: 'border-emerald-200' },
  'ai-customer-support-agents': { icon: <img src="/icons/icon-support.png" alt="AI Customer Support Agents" style={{ width: '1.875rem', height: '1.875rem', objectFit: 'contain' }} />, description: 'Ticket resolution, omnichannel support, autonomous helpdesk', color: 'text-violet-700', lightColor: 'bg-violet-50', borderColor: 'border-violet-200' },
  'ai-research-agents': { icon: <img src="/icons/icon-research.png" alt="AI Research Agents" style={{ width: '1.875rem', height: '1.875rem', objectFit: 'contain' }} />, description: 'Deep research, academic literature, web synthesis', color: 'text-amber-700', lightColor: 'bg-amber-50', borderColor: 'border-amber-200' },
  'ai-marketing-agents': { icon: <img src="/icons/icon-marketing.png" alt="AI Marketing Agents" style={{ width: '1.875rem', height: '1.875rem', objectFit: 'contain' }} />, description: 'Content creation, paid media, campaign automation', color: 'text-rose-700', lightColor: 'bg-rose-50', borderColor: 'border-rose-200' },
  'ai-coding-agents': { icon: <img src="/icons/icon-coding.png" alt="AI Coding Agents" style={{ width: '1.875rem', height: '1.875rem', objectFit: 'contain' }} />, description: 'Code generation, agentic coding, IDE integration, terminals', color: 'text-blue-700', lightColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  'ai-hr-agents': { icon: <img src="/icons/icon-hr.png" alt="AI HR Agents" style={{ width: '1.875rem', height: '1.875rem', objectFit: 'contain' }} />, description: 'Hiring, onboarding, payroll automation, compliance, workforce management', color: 'text-teal-700', lightColor: 'bg-teal-50', borderColor: 'border-teal-200' },
}

const PRICING_COLORS: Record<string, string> = {
  free: 'bg-green-50 text-green-700',
  freemium: 'bg-teal-50 text-teal-700',
  subscription: 'bg-blue-50 text-blue-700',
  'usage-based': 'bg-orange-50 text-orange-700',
  custom: 'bg-gray-100 text-gray-600',
}

const INTEGRATION_SLUGS = ['hubspot', 'salesforce', 'slack', 'zapier', 'gmail', 'microsoft-teams']
const INTEGRATION_NAMES: Record<string, string> = {
  'hubspot': 'HubSpot',
  'salesforce': 'Salesforce',
  'slack': 'Slack',
  'zapier': 'Zapier',
  'gmail': 'Gmail',
  'microsoft-teams': 'Teams',
}
const INTEGRATION_VALUES: Record<string, string> = {
  'hubspot': 'HubSpot',
  'salesforce': 'Salesforce',
  'slack': 'Slack',
  'zapier': 'Zapier',
  'gmail': 'Gmail',
  'microsoft-teams': 'Microsoft Teams',
}

// These 4 affiliate agents are always featured regardless of rating
const AFFILIATE_SLUGS = ['apollo-io', 'instantly-ai', 'instantly-ai-sales-agent', 'lemlist']

async function getCategoryCounts(): Promise<Record<string, number>> {
  const supabase = createClient()
  const counts: Record<string, number> = {}
  for (const slug of Object.values(CATEGORY_SLUGS)) {
    const { count } = await supabase.from('agents').select('*', { count: 'exact', head: true }).eq('primary_category', slug).eq('is_active', true)
    counts[slug] = count ?? 0
  }
  return counts
}

async function getIntegrationCounts(): Promise<Record<string, number>> {
  const supabase = createClient()
  const counts: Record<string, number> = {}
  for (const slug of INTEGRATION_SLUGS) {
    const integrationValue = INTEGRATION_VALUES[slug]
    const { count } = await supabase.from('agents').select('*', { count: 'exact', head: true }).eq('is_active', true).contains('integrations', [integrationValue])
    counts[slug] = count ?? 0
  }
  return counts
}

async function getFeaturedAgents(): Promise<Agent[]> {
  const supabase = createClient()

  // Always show 4 affiliate agents
  const { data: affiliates } = await supabase
    .from('agents')
    .select('*')
    .in('slug', AFFILIATE_SLUGS)
    .eq('is_active', true)

  // Fill remaining 5 spots with highest editorial rating (non-affiliates)
  const { data: topRated } = await supabase
    .from('agents')
    .select('*')
    .eq('is_active', true)
    .not('slug', 'in', `(${AFFILIATE_SLUGS.map(s => `"${s}"`).join(',')})`)
    .not('editorial_rating', 'is', null)
    .order('editorial_rating', { ascending: false })
    .limit(5)

  return [...(affiliates ?? []), ...(topRated ?? [])]
}

async function getRecentlyAddedAgents(): Promise<Agent[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('agents')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(6)
  return data ?? []
}

function StarRating({ avg, count }: { avg: number; count: number }) {
  const stars = Math.round(avg)
  const els = []
  for (let i = 1; i <= 5; i++) {
    els.push(<svg key={i} className={`w-3 h-3 ${i <= stars ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)
  }
  return <div className="flex items-center gap-1.5"><div className="flex items-center gap-0.5">{els}</div><span className="text-xs text-gray-500">{avg > 0 ? avg.toFixed(1) : '--'}{count > 0 && <span className="ml-1">({count})</span>}</span></div>
}

function AgentCard({ agent, showNewListing }: { agent: Agent; showNewListing?: boolean }) {
  const meta = CATEGORY_META[agent.primary_category]
  const tagEls = []
  for (const tag of (agent.capability_tags ?? []).slice(0, 3)) {
    tagEls.push(<span key={tag} className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-mono bg-gray-100 text-gray-500">{tag}</span>)
  }
  // Use editorial_rating as fallback when no user reviews yet
  const displayRating = (agent.rating_avg ?? 0) > 0 ? (agent.rating_avg ?? 0) : (agent.editorial_rating ?? 0)
  return (
    <Link href={`/agents/${agent.slug}`} className="group block bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-50 transition-all duration-200 hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <AgentLogo name={agent.name} websiteUrl={agent.website_url} />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors truncate">{agent.name}</h3>
              {showNewListing && (
                <span style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', padding: '2px 6px', borderRadius: '9999px', fontSize: '10px', fontWeight: 700, backgroundColor: '#10B981', color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  New Listing
                </span>
              )}
              {!showNewListing && agent.is_featured && (
                <span style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', padding: '2px 6px', borderRadius: '9999px', fontSize: '10px', fontWeight: 700, backgroundColor: '#2563EB', color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Featured
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{agent.developer}</p>
          </div>
        </div>
        <span className={`flex-shrink-0 text-xs font-medium px-2 py-1 rounded-md ${PRICING_COLORS[agent.pricing_model] ?? 'bg-gray-100 text-gray-600'}`}>{agent.pricing_model}</span>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-2">{agent.short_description}</p>
      <StarRating avg={displayRating} count={agent.rating_count ?? 0} />
      <div className="mt-3 flex flex-wrap gap-1">{tagEls}</div>
      {meta && <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1.5"><span className="text-xs flex items-center">{meta.icon}</span><span className={`text-[11px] font-medium ${meta.color}`}>{agent.primary_category.replace('ai-', '').split('-').join(' ')}</span></div>}
    </Link>
  )
}

export default async function HomePage() {
  const counts = await getCategoryCounts()
  const integrationCounts = await getIntegrationCounts()
  const featuredAgents = await getFeaturedAgents()
  const recentAgents = await getRecentlyAddedAgents()
  let totalAgents = 0
  for (const slug of Object.keys(counts)) { totalAgents += counts[slug] }

  const topFeatured = featuredAgents[0]
  const footerJson = topFeatured
    ? JSON.stringify([{ name: topFeatured.name, slug: topFeatured.slug, rating_avg: topFeatured.rating_avg }])
    : '[{"name":"Cursor","slug":"cursor","rating_avg":4.7}]'

  const categoryCards = []
  for (const [displayName, slug] of Object.entries(CATEGORY_SLUGS)) {
    const meta = CATEGORY_META[slug]
    const count = counts[slug] ?? 0
    categoryCards.push(
      <Link key={slug} href={`/${slug}`} className={`group block bg-white rounded-xl border ${meta?.borderColor ?? 'border-gray-200'} p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5`}>
        <div className="flex items-center justify-between mb-4">
          <div className={`w-10 h-10 rounded-xl ${meta?.lightColor ?? 'bg-gray-50'} flex items-center justify-center overflow-hidden`}>
            {meta?.icon ?? '🤖'}
          </div>
          <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded">{count} agents</span>
        </div>
        <h3 className="font-semibold text-gray-900 mb-1.5 group-hover:text-blue-600 transition-colors">{displayName}</h3>
        <p className="text-sm text-gray-500 leading-relaxed mb-4">{meta?.description}</p>
        <div className={`flex items-center gap-1 text-sm font-medium ${meta?.color ?? 'text-blue-600'}`}>
          View agents
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </div>
      </Link>
    )
  }
  const agentCards = []
  for (const agent of featuredAgents) { agentCards.push(<AgentCard key={agent.id} agent={agent} />) }
  const recentCards = []
  for (const agent of recentAgents) { recentCards.push(<AgentCard key={agent.id} agent={agent} showNewListing={true} />) }

  return (
    <div>
      <section className="bg-gray-950 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-900 border border-gray-700 text-gray-400 text-xs font-mono mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"/>{totalAgents} agents indexed · public JSON API
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight mb-5">The AI Agent Index</h1>
            <p className="text-lg text-gray-400 leading-relaxed mb-8 max-w-xl">The structured directory of AI agents for business automation. Dataset-first, machine-readable, designed to be cited by AI systems.</p>
            <HeroSearch />
          </div>
          <div className="mt-12 pt-10 border-t border-gray-800 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[{label:'AI agents indexed',value:String(totalAgents)},{label:'Business categories',value:'6'},{label:'Free to search',value:'100%'},{label:'Updated',value:'Daily'}].map(function(item){return <div key={item.label}><p className="text-2xl font-bold text-white">{item.value}</p><p className="text-sm text-gray-500 mt-0.5">{item.label}</p></div>})}
          </div>
        </div>
      </section>

      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8"><p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1.5">Browse by function</p><h2 className="text-2xl font-bold text-gray-900">Categories</h2></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{categoryCards}</div>
      </section>

      <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'><MatchTeaser /></section>

      <section style={{borderTop:'1px solid #F3F4F6',backgroundColor:'#F9FAFB'}}>
        <div style={{maxWidth:'1280px',margin:'0 auto',padding:'4rem 1.5rem'}}>
          <div style={{marginBottom:'2rem'}}>
            <p style={{fontSize:'0.75rem',fontWeight:600,color:'#2563EB',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'0.375rem'}}>Browse by platform</p>
            <h2 style={{fontSize:'1.5rem',fontWeight:700,color:'#111827',marginBottom:'0.5rem'}}>Integrations</h2>
            <p style={{color:'#6B7280',fontSize:'0.9375rem'}}>Find AI agents that connect natively with the tools your team already uses.</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))',gap:'1rem'}}>
            {INTEGRATION_SLUGS.map(function(slug){
              const count = integrationCounts[slug] ?? 0
              return (
                <a key={slug} href={'/integrations/'+slug} style={{backgroundColor:'white',borderRadius:'0.875rem',border:'1px solid #E5E7EB',padding:'1.25rem',textAlign:'center',textDecoration:'none',display:'block'}}>
                  <p style={{fontWeight:600,fontSize:'0.9375rem',color:'#111827',margin:'0 0 0.25rem'}}>{INTEGRATION_NAMES[slug]}</p>
                  <p style={{fontSize:'0.75rem',color:'#2563EB',margin:0}}>{count}+ agents</p>
                </a>
              )
            })}
          </div>
          <div style={{marginTop:'1.5rem',textAlign:'center'}}><a href='/integrations' style={{fontSize:'0.875rem',color:'#2563EB',fontWeight:500,textDecoration:'none'}}>View all integrations</a></div>
        </div>
      </section>

      {featuredAgents.length > 0 && (
        <section className="border-t border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="mb-8"><p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1.5">Editorially selected</p><h2 className="text-2xl font-bold text-gray-900">Featured Agents</h2></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{agentCards}</div>
          </div>
        </section>
      )}

      {recentAgents.length > 0 && (
        <section className="border-t border-gray-100 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Recently Added</h2>
              </div>
              <Link href="/search" className="text-sm font-medium text-blue-600 hover:text-blue-700">View all agents →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{recentCards}</div>
          </div>
        </section>
      )}

      <section className="bg-gray-950 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3">Why this exists</p>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-snug">Built for AI systems, not just search engines</h2>
              <p className="text-gray-400 leading-relaxed mb-6">Most directories are SEO-only. This one is designed so AI systems can actually read and cite it.</p>
              <div className="flex flex-wrap gap-2">{['JSON-LD schema','Public JSON API','Structured taxonomy','Clean URLs','Dynamic sitemap'].map(function(tag){return <span key={tag} className="px-2.5 py-1 rounded-md bg-gray-900 border border-gray-700 text-gray-400 text-xs font-mono">{tag}</span>})}</div>
            </div>
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 font-mono text-sm overflow-x-auto">
              <pre className="text-gray-300 text-xs leading-relaxed">{footerJson}</pre>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}