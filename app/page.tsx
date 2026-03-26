export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { CATEGORY_SLUGS } from '@/lib/taxonomy'
import type { Agent } from '@/types/agent'
import MatchTeaser from '@/components/MatchTeaser'

const CATEGORY_META: Record<string, { icon: string; description: string; color: string; lightColor: string; borderColor: string }> = {
  'ai-sales-agents': { icon: '📈', description: 'Lead generation, outbound automation, pipeline intelligence', color: 'text-emerald-700', lightColor: 'bg-emerald-50', borderColor: 'border-emerald-200' },
  'ai-customer-support-agents': { icon: '💬', description: 'Ticket resolution, omnichannel support, autonomous helpdesk', color: 'text-violet-700', lightColor: 'bg-violet-50', borderColor: 'border-violet-200' },
  'ai-research-agents': { icon: '🔍', description: 'Deep research, academic literature, web synthesis', color: 'text-amber-700', lightColor: 'bg-amber-50', borderColor: 'border-amber-200' },
  'ai-marketing-agents': { icon: '📣', description: 'Content creation, paid media, campaign automation', color: 'text-rose-700', lightColor: 'bg-rose-50', borderColor: 'border-rose-200' },
  'ai-coding-agents': { icon: '⚡', description: 'Code generation, agentic coding, IDE integration, terminals', color: 'text-blue-700', lightColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  'ai-hr-agents': { icon: '👥', description: 'Hiring, onboarding, payroll automation, compliance, workforce management', color: 'text-teal-700', lightColor: 'bg-teal-50', borderColor: 'border-teal-200' },
}

const PRICING_COLORS: Record<string, string> = {
  free: 'bg-green-50 text-green-700',
  freemium: 'bg-teal-50 text-teal-700',
  subscription: 'bg-blue-50 text-blue-700',
  'usage-based': 'bg-orange-50 text-orange-700',
  custom: 'bg-gray-100 text-gray-600',
}

async function getCategoryCounts(): Promise<Record<string, number>> {
  const supabase = createClient()
  const counts: Record<string, number> = {}
  for (const slug of Object.values(CATEGORY_SLUGS)) {
    const { count } = await supabase.from('agents').select('*', { count: 'exact', head: true }).eq('primary_category', slug).eq('is_active', true)
    counts[slug] = count ?? 0
  }
  return counts
}

async function getFeaturedAgents(): Promise<Agent[]> {
  const supabase = createClient()
  const { data } = await supabase.from('agents').select('*').eq('is_featured', true).eq('is_active', true).order('rating_avg', { ascending: false }).limit(9)
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

function AgentCard({ agent }: { agent: Agent }) {
  const meta = CATEGORY_META[agent.primary_category]
  const tagEls = []
  for (const tag of (agent.capability_tags ?? []).slice(0, 3)) {
    tagEls.push(<span key={tag} className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-mono bg-gray-100 text-gray-500">{tag}</span>)
  }
  return (
    <Link href={`/agents/${agent.slug}`} className="group block bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-50 transition-all duration-200 hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors truncate">{agent.name}</h3>
            {agent.is_featured && <span className="flex-shrink-0 inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white uppercase tracking-wide">Featured</span>}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">{agent.developer}</p>
        </div>
        <span className={`flex-shrink-0 text-xs font-medium px-2 py-1 rounded-md ${PRICING_COLORS[agent.pricing_model] ?? 'bg-gray-100 text-gray-600'}`}>{agent.pricing_model}</span>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-2">{agent.short_description}</p>
      <StarRating avg={agent.rating_avg ?? 0} count={agent.rating_count ?? 0} />
      <div className="mt-3 flex flex-wrap gap-1">{tagEls}</div>
      {meta && <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1.5"><span className="text-xs">{meta.icon}</span><span className={`text-[11px] font-medium ${meta.color}`}>{agent.primary_category.replace('ai-', '').split('-').join(' ')}</span></div>}
    </Link>
  )
}

export default async function HomePage() {
  const counts = await getCategoryCounts()
  const featuredAgents = await getFeaturedAgents()
  let totalAgents = 0
  for (const slug of Object.keys(counts)) { totalAgents += counts[slug] }
  const categoryCards = []
  for (const [displayName, slug] of Object.entries(CATEGORY_SLUGS)) {
    const meta = CATEGORY_META[slug]
    const count = counts[slug] ?? 0
    categoryCards.push(
      <Link key={slug} href={`/${slug}`} className={`group block bg-white rounded-xl border ${meta?.borderColor ?? 'border-gray-200'} p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5`}>
        <div className="flex items-center justify-between mb-4">
          <div className={`w-10 h-10 rounded-xl ${meta?.lightColor ?? 'bg-gray-50'} flex items-center justify-center text-xl`}>{meta?.icon ?? '🤖'}</div>
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
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="#categories" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors">Browse agents</a>
              <a href="/api/agents" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-gray-700 hover:border-gray-500 text-gray-400 font-mono text-sm transition-colors">GET /api/agents</a>
            </div>
          </div>
          <div className="mt-12 pt-10 border-t border-gray-800 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[{label:'Agents indexed',value:String(totalAgents)},{label:'Categories',value:'6'},{label:'Schema fields',value:'30+'},{label:'JSON API endpoints',value:'1'}].map(function(item){return <div key={item.label}><p className="text-2xl font-bold text-white">{item.value}</p><p className="text-sm text-gray-500 mt-0.5">{item.label}</p></div>})}
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
            {[{slug:'hubspot',name:'HubSpot',count:'90+'},{slug:'salesforce',name:'Salesforce',count:'89+'},{slug:'slack',name:'Slack',count:'82+'},{slug:'zapier',name:'Zapier',count:'54+'},{slug:'gmail',name:'Gmail',count:'26+'},{slug:'microsoft-teams',name:'Teams',count:'10+'}].map(function(p){return(
              <a key={p.slug} href={'/integrations/'+p.slug} style={{backgroundColor:'white',borderRadius:'0.875rem',border:'1px solid #E5E7EB',padding:'1.25rem',textAlign:'center',textDecoration:'none',display:'block'}}>
                <p style={{fontWeight:600,fontSize:'0.9375rem',color:'#111827',margin:'0 0 0.25rem'}}>{p.name}</p>
                <p style={{fontSize:'0.75rem',color:'#2563EB',margin:0}}>{p.count} agents</p>
              </a>
            )})}
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
              <pre className="text-gray-300 text-xs leading-relaxed">{`[{"name":"Cursor","slug":"cursor","rating_avg":4.8}]`}</pre>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}