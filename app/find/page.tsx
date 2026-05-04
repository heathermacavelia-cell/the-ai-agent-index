'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import AgentLogo from '@/components/AgentLogo'
import CompareButton from '@/components/CompareButton'

interface Match {
  slug: string
  name: string
  reason: string
  fit_score: number
  pricing_model: string
  primary_category?: string
  website_url?: string | null
  favicon_domain?: string | null
}

interface Group {
  label: string | null
  agents: Match[]
}

type QueryType = 'specific' | 'category' | 'comparison' | 'multi_domain' | 'no_match'

interface MatchResponse {
  query_type: QueryType
  groups: Group[]
  message?: string
  error?: string
}

interface StackAgent {
  agent_slug: string
  name: string
  website_url: string
}

interface Stack {
  id: string
  name: string
  slug: string
  tagline: string
  primary_category: string
  difficulty: string
  is_editorial: boolean
  agents: StackAgent[]
}

const EXAMPLE_QUERIES = [
  'Automatically post website updates to my Facebook business page',
  'Follow up with leads who fill out my contact form',
  'Summarize customer support tickets and suggest replies',
  'Generate weekly SEO reports for my clients',
]

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: '#16a34a',
  moderate: '#d97706',
  complex: '#dc2626',
}

const CATEGORY_LABELS: Record<string, string> = {
  'ai-sales-agents': 'Sales',
  'ai-customer-support-agents': 'Support',
  'ai-research-agents': 'Research',
  'ai-marketing-agents': 'Marketing',
  'ai-coding-agents': 'Coding',
  'ai-hr-agents': 'HR',
  'ai-workflow-agents': 'Workflow',
}

function FindPageInner() {
  const [query, setQuery] = useState('')
  const [groups, setGroups] = useState<Group[]>([])
  const [queryType, setQueryType] = useState<QueryType | null>(null)
  const [noMatchMessage, setNoMatchMessage] = useState('')
  const [stacks, setStacks] = useState<Stack[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)
  const [activeTab, setActiveTab] = useState<'agents' | 'stacks'>('agents')

  const [waitlistEmail, setWaitlistEmail] = useState('')
  const [waitlistName, setWaitlistName] = useState('')
  const [waitlistCompany, setWaitlistCompany] = useState('')
  const [waitlistServices, setWaitlistServices] = useState('')
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false)
  const [waitlistLoading, setWaitlistLoading] = useState(false)

  const searchParams = useSearchParams()

  const allMatches: Match[] = groups.flatMap(g => g.agents)
  const totalMatches = allMatches.length

  // For category queries, derive the category slug from the first match's primary_category
  // We don't have primary_category on Match directly, so we infer the category from the first agent's slug
  // by looking at its position. Better: we surface a CTA only when query_type is "category" and we know which one.
  const categoryCtaSlug = (queryType === 'category' && allMatches.length > 0)
    ? inferCategoryFromMatches(allMatches)
    : null

  async function fetchStacksForAgents(agentSlugs: string[]) {
    if (!agentSlugs.length) return
    try {
      const results = await Promise.all(
        agentSlugs.slice(0, 3).map(slug =>
          fetch(`/api/stacks?agent=${slug}`).then(r => r.json())
        )
      )
      const seen = new Set<string>()
      const merged: Stack[] = []
      for (const batch of results) {
        if (!Array.isArray(batch)) continue
        for (const stack of batch) {
          if (!seen.has(stack.id)) {
            seen.add(stack.id)
            merged.push(stack)
          }
        }
      }
      setStacks(merged)
    } catch {
      setStacks([])
    }
  }

  async function runSearch(q: string) {
    setLoading(true)
    setError('')
    setSearched(false)
    setStacks([])
    setGroups([])
    setQueryType(null)
    setNoMatchMessage('')
    try {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      })
      const data: MatchResponse = await res.json()
      if (data.error) { setError(data.error); return }
      const responseGroups: Group[] = Array.isArray(data.groups) ? data.groups : []
      setGroups(responseGroups)
      setQueryType(data.query_type ?? null)
      setNoMatchMessage(data.message ?? '')
      setSearched(true)
      setActiveTab('agents')
      const slugs = responseGroups.flatMap(g => g.agents.map(a => a.slug))
      await fetchStacksForAgents(slugs)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const q = searchParams.get('q')
    if (q && q.trim().length >= 5) {
      setQuery(q)
      runSearch(q)
    }
  }, [searchParams])

  async function handleSearch() {
    if (!query.trim() || query.trim().length < 5) {
      setError('Please describe what you want to automate in more detail')
      return
    }
    await runSearch(query)
  }

  async function handleWaitlist() {
    if (!waitlistEmail || !waitlistEmail.includes('@')) return
    setWaitlistLoading(true)
    try {
      await fetch('/api/partner-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: waitlistEmail,
          name: waitlistName,
          company: waitlistCompany,
          services: waitlistServices,
        }),
      })
      setWaitlistSubmitted(true)
    } catch {
      setWaitlistSubmitted(true)
    } finally {
      setWaitlistLoading(false)
    }
  }

  const pricingColor = (model: string) => {
    if (model === 'free') return '#16a34a'
    if (model === 'freemium') return '#2563eb'
    return '#6b7280'
  }

  function renderAgentCard(match: Match, isFirstOverall: boolean) {
    return (
      <div key={match.slug} style={{ background: '#fff', border: isFirstOverall ? '2px solid #2563eb' : '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', position: 'relative' }}>
        {isFirstOverall && (
          <div style={{ position: 'absolute', top: '-12px', left: '20px', background: '#2563eb', color: '#fff', fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', letterSpacing: '0.05em' }}>
            BEST MATCH
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AgentLogo name={match.name} websiteUrl={match.website_url} faviconDomain={match.favicon_domain} size="md" />
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: '0 0 4px' }}>{match.name}</h3>
              <span style={{ fontSize: '12px', fontWeight: '600', color: pricingColor(match.pricing_model), background: '#f9fafb', padding: '2px 8px', borderRadius: '4px', textTransform: 'capitalize' }}>
                {match.pricing_model}
              </span>
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: '28px', fontWeight: '800', color: match.fit_score >= 80 ? '#16a34a' : match.fit_score >= 60 ? '#2563eb' : '#6b7280' }}>
              {match.fit_score}%
            </div>
            <div style={{ fontSize: '11px', color: '#9ca3af' }}>fit score</div>
          </div>
        </div>
        <p style={{ fontSize: '15px', color: '#374151', lineHeight: '1.6', marginBottom: '16px' }}>{match.reason}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <Link
            href={`/agents/${match.slug}`}
            style={{ display: 'inline-block', background: isFirstOverall ? '#2563eb' : '#f3f4f6', color: isFirstOverall ? '#fff' : '#374151', textDecoration: 'none', padding: '8px 20px', borderRadius: '6px', fontSize: '14px', fontWeight: '600' }}
          >
            View {match.name} →
          </Link>
          <CompareButton agent={{ slug: match.slug, name: match.name, websiteUrl: match.website_url ?? null, faviconDomain: match.favicon_domain ?? null }} />
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'system-ui, sans-serif' }}>

      {/* Nav */}
      <div style={{ borderBottom: '1px solid #e5e7eb', background: '#fff', padding: '16px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '14px' }}>← Back to Index</Link>
        </div>
      </div>

      {/* Hero */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '60px 24px 48px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: '#eff6ff', color: '#2563eb', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px', marginBottom: '20px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            AI-Powered Matching
          </div>
          <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#111827', marginBottom: '16px', lineHeight: '1.2' }}>
            Describe what you want to automate
          </h1>
          <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '32px', lineHeight: '1.6' }}>
            Tell us your business problem in plain English. We&apos;ll find the AI agents that can solve it.
          </p>

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <textarea
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSearch() } }}
              placeholder="e.g. I want to automatically post updates from my website to my Facebook business page..."
              style={{ width: '100%', minHeight: '100px', padding: '16px', fontSize: '16px', border: '2px solid #e5e7eb', borderRadius: '12px', resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', lineHeight: '1.5' }}
              onFocus={e => { e.target.style.borderColor = '#2563eb' }}
              onBlur={e => { e.target.style.borderColor = '#e5e7eb' }}
            />
          </div>

          <button
            onClick={handleSearch}
            disabled={loading}
            style={{ background: loading ? '#93c5fd' : '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', padding: '14px 32px', fontSize: '16px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', width: '100%', transition: 'background 0.2s' }}
          >
            {loading ? 'Finding best matches...' : 'Find My AI Agent →'}
          </button>

          {error && (
            <p style={{ color: '#dc2626', fontSize: '14px', marginTop: '12px' }}>{error}</p>
          )}

          {/* Examples */}
          <div style={{ marginTop: '24px', textAlign: 'left' }}>
            <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '10px' }}>Try an example:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {EXAMPLE_QUERIES.map(q => (
                <button
                  key={q}
                  onClick={() => setQuery(q)}
                  style={{ background: '#f3f4f6', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '13px', color: '#374151', cursor: 'pointer' }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {searched && (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 24px' }}>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0', marginBottom: '32px', borderBottom: '2px solid #e5e7eb' }}>
            <button
              onClick={() => setActiveTab('agents')}
              style={{
                padding: '10px 24px', fontSize: '15px', fontWeight: '600', border: 'none', cursor: 'pointer',
                background: 'none', borderBottom: activeTab === 'agents' ? '2px solid #2563eb' : '2px solid transparent',
                color: activeTab === 'agents' ? '#2563eb' : '#6b7280', marginBottom: '-2px', transition: 'all 0.15s',
              }}
            >
              Best Agents
              <span style={{ marginLeft: '8px', backgroundColor: activeTab === 'agents' ? '#eff6ff' : '#f3f4f6', color: activeTab === 'agents' ? '#2563eb' : '#9ca3af', fontSize: '12px', fontWeight: 700, padding: '2px 7px', borderRadius: '999px' }}>
                {totalMatches}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('stacks')}
              style={{
                padding: '10px 24px', fontSize: '15px', fontWeight: '600', border: 'none', cursor: 'pointer',
                background: 'none', borderBottom: activeTab === 'stacks' ? '2px solid #2563eb' : '2px solid transparent',
                color: activeTab === 'stacks' ? '#2563eb' : '#6b7280', marginBottom: '-2px', transition: 'all 0.15s',
              }}
            >
              Workflow Stacks
              <span style={{ marginLeft: '8px', backgroundColor: activeTab === 'stacks' ? '#eff6ff' : '#f3f4f6', color: activeTab === 'stacks' ? '#2563eb' : '#9ca3af', fontSize: '12px', fontWeight: 700, padding: '2px 7px', borderRadius: '999px' }}>
                {stacks.length}
              </span>
            </button>
          </div>

          {/* Agents tab */}
          {activeTab === 'agents' && (
            <>
              {queryType === 'no_match' || totalMatches === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 24px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
                  <p style={{ fontSize: '18px', color: '#374151', fontWeight: 600, marginBottom: '12px' }}>
                    No agent in our directory matches that query.
                  </p>
                  {noMatchMessage && (
                    <p style={{ fontSize: '15px', color: '#6b7280', marginBottom: '24px', lineHeight: '1.6' }}>
                      {noMatchMessage}
                    </p>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginTop: '16px' }}>
                    <Link href="/" style={{ display: 'inline-block', background: '#2563eb', color: '#fff', textDecoration: 'none', padding: '10px 20px', borderRadius: '6px', fontSize: '14px', fontWeight: '600' }}>
                      Browse all agents
                    </Link>
                    <button
                      onClick={() => { setQuery(''); setSearched(false); setGroups([]); setQueryType(null); setNoMatchMessage('') }}
                      style={{ background: '#f3f4f6', color: '#374151', border: 'none', padding: '10px 20px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
                    >
                      Try a different query
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
                    {totalMatches} agent{totalMatches !== 1 ? 's' : ''} matched — ranked by fit to your use case
                  </p>

                  {groups.map((group, gIdx) => {
                    const isMultiDomain = groups.length > 1
                    const cardsBeforeThisGroup = groups.slice(0, gIdx).reduce((sum, g) => sum + g.agents.length, 0)
                    return (
                      <div key={`${group.label ?? 'group'}-${gIdx}`} style={{ marginBottom: gIdx < groups.length - 1 ? '32px' : '0' }}>
                        {isMultiDomain && group.label && (
                          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #e5e7eb' }}>
                            {group.label}
                          </h2>
                        )}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {group.agents.map((match, idx) => {
                            const overallIdx = cardsBeforeThisGroup + idx
                            return renderAgentCard(match, overallIdx === 0)
                          })}
                        </div>
                      </div>
                    )
                  })}

                  {/* Category CTA: link to category page where filter pills live */}
                  {queryType === 'category' && categoryCtaSlug && (
                    <div style={{ marginTop: '24px', textAlign: 'center' }}>
                      <Link href={`/${categoryCtaSlug}`} style={{ color: '#2563eb', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
                        Browse all {CATEGORY_LABELS[categoryCtaSlug] ?? 'agents'} agents and filter by use case →
                      </Link>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* Stacks tab */}
          {activeTab === 'stacks' && (
            <>
              {stacks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <p style={{ fontSize: '18px', color: '#6b7280' }}>No matching stacks found yet.</p>
                  <p style={{ fontSize: '14px', color: '#9ca3af', marginTop: '8px' }}>
                    <Link href="/stacks" style={{ color: '#2563eb' }}>Browse all stacks</Link> or <Link href="/stacks/submit" style={{ color: '#2563eb' }}>submit your own</Link>.
                  </p>
                </div>
              ) : (
                <>
                  <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
                    {stacks.length} workflow stack{stacks.length !== 1 ? 's' : ''} featuring agents that match your query
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {stacks.map((stack, i) => (
                      <Link key={stack.id} href={`/stacks/${stack.slug}`} style={{ textDecoration: 'none' }}>
                        <div style={{ background: '#fff', border: i === 0 ? '2px solid #2563eb' : '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', position: 'relative', cursor: 'pointer' }}>
                          {i === 0 && (
                            <div style={{ position: 'absolute', top: '-12px', left: '20px', background: '#2563eb', color: '#fff', fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', letterSpacing: '0.05em' }}>
                              BEST MATCH
                            </div>
                          )}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', gap: '1rem' }}>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                              <span style={{ backgroundColor: '#f3f4f6', color: '#6b7280', fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                {CATEGORY_LABELS[stack.primary_category] ?? stack.primary_category}
                              </span>
                              {stack.is_editorial && (
                                <span style={{ backgroundColor: '#eff6ff', color: '#2563eb', fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px' }}>
                                  Editorial
                                </span>
                              )}
                            </div>
                            <span style={{ color: DIFFICULTY_COLORS[stack.difficulty] ?? '#6b7280', fontSize: '12px', fontWeight: 600, flexShrink: 0, textTransform: 'capitalize' }}>
                              {stack.difficulty}
                            </span>
                          </div>
                          <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#111827', marginBottom: '6px' }}>{stack.name}</h3>
                          <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6', marginBottom: '16px' }}>{stack.tagline}</p>

                          {stack.agents && stack.agents.length > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                              {stack.agents.map((agent, idx) => (
                                <div key={agent.agent_slug} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <span style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '3px 8px', fontSize: '12px', color: '#374151', fontWeight: 500 }}>
                                    {agent.name ?? agent.agent_slug}
                                  </span>
                                  {idx < stack.agents.length - 1 && (
                                    <span style={{ color: '#d1d5db', fontSize: '12px' }}>→</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div style={{ marginTop: '24px', textAlign: 'center' }}>
                    <Link href="/stacks" style={{ color: '#2563eb', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
                      Browse all stacks →
                    </Link>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}

      {/* Partner Waitlist */}
      <div style={{ background: '#1e3a5f', marginTop: '60px', padding: '60px 24px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#fff', marginBottom: '12px' }}>
            Need help implementing an AI agent?
          </h2>
          <p style={{ fontSize: '16px', color: '#93c5fd', marginBottom: '8px', lineHeight: '1.6' }}>
            We&apos;re building a network of vetted AI implementation specialists, people who can set up and configure AI agents for your business.
          </p>
          <p style={{ fontSize: '14px', color: '#60a5fa', marginBottom: '32px' }}>
            Join the waitlist and we&apos;ll connect you when it launches.
          </p>

          {waitlistSubmitted ? (
            <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', color: '#16a34a', fontSize: '18px', fontWeight: '700' }}>
              ✓ You&apos;re on the list! We&apos;ll be in touch.
            </div>
          ) : (
            <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', textAlign: 'left' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input type="text" placeholder="Your name" value={waitlistName} onChange={e => setWaitlistName(e.target.value)}
                    style={{ flex: 1, padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '14px', outline: 'none' }} />
                  <input type="text" placeholder="Company (optional)" value={waitlistCompany} onChange={e => setWaitlistCompany(e.target.value)}
                    style={{ flex: 1, padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '14px', outline: 'none' }} />
                </div>
                <input type="email" placeholder="Your email address" value={waitlistEmail} onChange={e => setWaitlistEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                <textarea placeholder="What kind of automation do you need help with? (optional)" value={waitlistServices} onChange={e => setWaitlistServices(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '14px', outline: 'none', minHeight: '80px', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }} />
                <button onClick={handleWaitlist} disabled={waitlistLoading || !waitlistEmail}
                  style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', padding: '12px', fontSize: '15px', fontWeight: '600', cursor: waitlistLoading || !waitlistEmail ? 'not-allowed' : 'pointer', opacity: !waitlistEmail ? 0.6 : 1 }}>
                  {waitlistLoading ? 'Saving...' : 'Join the Waitlist'}
                </button>
              </div>
              <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '12px', textAlign: 'center' }}>
                Are you an AI implementation specialist? <a href="mailto:hello@theaiagentindex.com" style={{ color: '#2563eb' }}>Apply to be a partner →</a>
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}

// Pick the most common primary_category across the returned matches.
// Used to surface a "Browse all X agents" CTA when query_type is "category".
function inferCategoryFromMatches(matches: Match[]): string | null {
  const counts: Record<string, number> = {}
  for (const m of matches) {
    if (m.primary_category) {
      counts[m.primary_category] = (counts[m.primary_category] || 0) + 1
    }
  }
  let best: string | null = null
  let bestCount = 0
  for (const [cat, count] of Object.entries(counts)) {
    if (count > bestCount) { best = cat; bestCount = count }
  }
  return best
}

export default function FindPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <FindPageInner />
    </Suspense>
  )
}