import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { Agent } from '@/types/agent'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient()
  const { data: agent } = await supabase.from('agents').select('name, short_description, developer').eq('slug', params.slug).single()
  if (!agent) return {}
  return { title: `${agent.name} -- ${agent.developer}`, description: agent.short_description }
}

export default async function AgentPage({ params }: Props) {
  const supabase = createClient()
  const { data: agent } = await supabase.from('agents').select('*').eq('slug', params.slug).eq('is_active', true).single()
  if (!agent) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: agent.name,
    description: agent.short_description,
    applicationCategory: agent.primary_category,
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: agent.starting_price?.toString() ?? '0', priceCurrency: 'USD' },
    url: agent.website_url ?? '',
    author: { '@type': 'Organization', name: agent.developer },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <span className="text-gray-300">/</span>
          <Link href={`/${agent.primary_category}`} className="hover:text-gray-900 transition-colors capitalize">{agent.primary_category.split('-').join(' ')}</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900">{agent.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h1 className="text-2xl font-bold text-gray-900">{agent.name}</h1>
                    {agent.is_featured && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white uppercase tracking-wide">Featured</span>}
                    {agent.is_verified && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-green-600 text-white uppercase tracking-wide">Verified</span>}
                  </div>
                  <p className="text-gray-500">by {agent.developer}</p>
                </div>
                {agent.website_url && (
                  <a href={agent.website_url} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors">
                    Visit site
                  </a>
                )}
              </div>
              <p className="text-gray-700 leading-relaxed">{agent.short_description}</p>
              {agent.long_description && <p className="text-gray-600 leading-relaxed text-sm mt-4 pt-4 border-t border-gray-100">{agent.long_description}</p>}
            </div>

            {agent.capability_tags?.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="font-semibold text-gray-900 mb-4">Capabilities</h2>
                <div className="flex flex-wrap gap-2">
                  {agent.capability_tags.map(function(tag: string) { return <span key={tag} className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-mono bg-blue-50 text-blue-700 border border-blue-100">{tag}</span> })}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Technical Details</h2>
              <div className="space-y-3">
                {agent.deployment_method?.length > 0 && <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-sm text-gray-500">Deployment</span><div className="flex gap-1">{agent.deployment_method.map(function(d: string) { return <span key={d} className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600 font-mono">{d}</span> })}</div></div>}
                {agent.deployment_difficulty && <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-sm text-gray-500">Difficulty</span><span className="text-sm font-medium capitalize">{agent.deployment_difficulty}</span></div>}
                {agent.model_architecture && <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-sm text-gray-500">Model architecture</span><span className="text-sm font-mono">{agent.model_architecture}</span></div>}
                {agent.avg_setup_time && <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-sm text-gray-500">Avg setup time</span><span className="text-sm">{agent.avg_setup_time}</span></div>}
                {agent.integrations?.length > 0 && <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-sm text-gray-500">Integrations</span><div className="flex flex-wrap gap-1 justify-end">{agent.integrations.map(function(i: string) { return <span key={i} className="px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-600">{i}</span> })}</div></div>}
                {agent.security_certifications?.length > 0 && <div className="flex justify-between py-2"><span className="text-sm text-gray-500">Security</span><div className="flex flex-wrap gap-1 justify-end">{agent.security_certifications.map(function(s: string) { return <span key={s} className="px-1.5 py-0.5 rounded text-xs bg-green-50 text-green-700">{s}</span> })}</div></div>}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Commercial</h3>
              <div className="space-y-2.5">
                <div className="flex justify-between"><span className="text-sm text-gray-500">Pricing model</span><span className="text-sm font-medium capitalize">{agent.pricing_model}</span></div>
                {agent.starting_price != null && <div className="flex justify-between"><span className="text-sm text-gray-500">Starting price</span><span className="text-sm font-semibold">{agent.starting_price === 0 ? 'Free' : `$${agent.starting_price}`}</span></div>}
                <div className="flex justify-between"><span className="text-sm text-gray-500">Customer segment</span><span className="text-sm uppercase font-medium">{agent.customer_segment}</span></div>
              </div>
            </div>

            {agent.industry_tags?.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Industries</h3>
                <div className="flex flex-wrap gap-1.5">
                  {agent.industry_tags.map(function(tag: string) { return <span key={tag} className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600 capitalize">{tag}</span> })}
                </div>
              </div>
            )}

            {agent.rating_avg > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Rating</h3>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-900">{agent.rating_avg}</span>
                  <span className="text-gray-400 text-sm">/ 5</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{agent.rating_count} {agent.rating_count === 1 ? 'review' : 'reviews'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
