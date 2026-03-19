import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: { q?: string }
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const q = searchParams.q ?? ''
  return {
    title: q ? `Search results for "${q}"` : 'Search AI Agents',
    description: 'Search the AI Agent Index — find agents by name, capability, industry, or use case.',
  }
}

export default async function SearchPage({ searchParams }: Props) {
  const q = searchParams.q?.trim() ?? ''
  const supabase = createClient()

  let agents: any[] = []

  if (q.length > 0) {
    const { data } = await supabase
      .from('agents')
      .select('id, name, slug, developer, short_description, primary_category, pricing_model, rating_avg, rating_count, editorial_rating, is_featured, capability_tags, industry_tags')
      .eq('is_active', true)
      .textSearch('search_text', q, { type: 'websearch', config: 'english' })
      .order('rating_avg', { ascending: false })
      .limit(30)
    agents = data ?? []
  }

  const jsonLd = q ? {
    '@context': 'https://schema.org',
    '@type': 'SearchResultsPage',
    name: `Search results for "${q}" — AI Agent Index`,
    url: `https://theaiagentindex.com/search?q=${encodeURIComponent(q)}`,
    numberOfItems: agents.length,
  } : null

  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
        <div className="max-w-2xl mx-auto mb-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {q ? `Results for "${q}"` : 'Search AI Agents'}
          </h1>
          <SearchInput initialQuery={q} />
        </div>

        {q && (
          <div className="mt-8">
            {agents.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg mb-2">No agents found for "{q}"</p>
                <p className="text-gray-400 text-sm">Try searching by capability, industry, or use case</p>
                <div className="mt-6 flex flex-wrap gap-2 justify-center">
                  {['lead generation', 'customer support', 'code generation', 'market research', 'content creation'].map((term) => (
                    <a key={term} href={'/search?q=' + encodeURIComponent(term)}
                      className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors">
                      {term}
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-6">{agents.length} agent{agents.length !== 1 ? 's' : ''} found</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {agents.map((agent) => {
                    const displayRating = agent.rating_count > 0 ? agent.rating_avg : agent.editorial_rating
                    return (
                      <Link key={agent.id} href={'/agents/' + agent.slug}
                        className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-sm transition-all block">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h2 className="font-semibold text-gray-900 text-sm">{agent.name}</h2>
                            <p className="text-xs text-gray-500">by {agent.developer}</p>
                          </div>
                          {agent.is_featured && (
                            <span className="flex-shrink-0 text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">Featured</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed mb-3 line-clamp-2">{agent.short_description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400 capitalize">{agent.primary_category.split('-').join(' ')}</span>
                          <div className="flex items-center gap-1">
                            <span style={{ color: '#2563EB', fontSize: '0.75rem' }}>★</span>
                            <span className="text-xs font-medium text-gray-700">{displayRating ? Number(displayRating).toFixed(1) : '—'}</span>
                          </div>
                        </div>
                        {agent.capability_tags && agent.capability_tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {agent.capability_tags.slice(0, 3).map((tag: string) => (
                              <span key={tag} className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-mono">{tag}</span>
                            ))}
                          </div>
                        )}
                      </Link>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {!q && (
          <div className="max-w-2xl mx-auto">
            <p className="text-center text-sm text-gray-400 mb-8">Try searching for a capability, industry, or tool name</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Lead generation', q: 'lead generation' },
                { label: 'Customer support', q: 'customer support' },
                { label: 'Code generation', q: 'code generation' },
                { label: 'Market research', q: 'market research' },
                { label: 'Content creation', q: 'content creation' },
                { label: 'Sales automation', q: 'sales automation' },
                { label: 'Real estate', q: 'real estate' },
                { label: 'Healthcare', q: 'healthcare' },
                { label: 'Freemium tools', q: 'freemium' },
              ].map((item) => (
                <a key={item.q} href={'/search?q=' + encodeURIComponent(item.q)}
                  className="p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors text-center">
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

function SearchInput({ initialQuery }: { initialQuery: string }) {
  return (
    <form action="/search" method="GET">
      <div style={{ position: 'relative' }}>
        <svg style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="search"
          name="q"
          defaultValue={initialQuery}
          placeholder="Search by name, capability, industry, or use case..."
          autoFocus
          style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 2.75rem', border: '2px solid #E5E7EB', borderRadius: '0.75rem', fontSize: '0.9375rem', outline: 'none', boxSizing: 'border-box', backgroundColor: 'white' }}
        />
        <button type="submit"
          style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', padding: '0.5rem 1rem', backgroundColor: '#2563EB', color: 'white', border: 'none', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
          Search
        </button>
      </div>
    </form>
  )
}