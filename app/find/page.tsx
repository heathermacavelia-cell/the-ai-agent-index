'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface Match {
  slug: string
  name: string
  reason: string
  fit_score: number
  pricing_model: string
}

const EXAMPLE_QUERIES = [
  'Automatically post website updates to my Facebook business page',
  'Follow up with leads who fill out my contact form',
  'Summarize customer support tickets and suggest replies',
  'Generate weekly SEO reports for my clients',
]

function FindPageInner() {
  const [query, setQuery] = useState('')
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)

  const [waitlistEmail, setWaitlistEmail] = useState('')
  const [waitlistName, setWaitlistName] = useState('')
  const [waitlistCompany, setWaitlistCompany] = useState('')
  const [waitlistServices, setWaitlistServices] = useState('')
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false)
  const [waitlistLoading, setWaitlistLoading] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    const q = searchParams.get('q')
    if (q && q.trim().length >= 5) {
      setQuery(q)
      setTimeout(() => {
        fetch('/api/match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: q }),
        }).then(r => r.json()).then(data => {
          setMatches(data.matches || [])
          setSearched(true)
          setLoading(false)
        }).catch(() => setLoading(false))
        setLoading(true)
      }, 100)
    }
  }, [searchParams])

  async function handleSearch() {
    if (!query.trim() || query.trim().length < 5) {
      setError('Please describe what you want to automate in more detail')
      return
    }
    setLoading(true)
    setError('')
    setSearched(false)
    try {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })
      const data = await res.json()
      if (data.error) { setError(data.error); return }
      setMatches(data.matches || [])
      setSearched(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
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
            Tell us your business problem in plain English. We'll find the AI agents that can solve it.
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
          {matches.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p style={{ fontSize: '18px', color: '#6b7280' }}>No strong matches found for that query.</p>
              <p style={{ fontSize: '14px', color: '#9ca3af', marginTop: '8px' }}>Try describing your problem differently, or <Link href="/" style={{ color: '#2563eb' }}>browse all agents</Link>.</p>
            </div>
          ) : (
            <>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
                {matches.length} agent{matches.length !== 1 ? 's' : ''} matched your request
              </h2>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>Ranked by fit to your specific use case</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {matches.map((match, i) => (
                  <div key={match.slug} style={{ background: '#fff', border: i === 0 ? '2px solid #2563eb' : '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', position: 'relative' }}>
                    {i === 0 && (
                      <div style={{ position: 'absolute', top: '-12px', left: '20px', background: '#2563eb', color: '#fff', fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', letterSpacing: '0.05em' }}>
                        BEST MATCH
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: '0 0 4px' }}>{match.name}</h3>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: pricingColor(match.pricing_model), background: '#f9fafb', padding: '2px 8px', borderRadius: '4px', textTransform: 'capitalize' }}>
                          {match.pricing_model}
                        </span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '28px', fontWeight: '800', color: match.fit_score >= 80 ? '#16a34a' : match.fit_score >= 60 ? '#2563eb' : '#6b7280' }}>
                          {match.fit_score}%
                        </div>
                        <div style={{ fontSize: '11px', color: '#9ca3af' }}>fit score</div>
                      </div>
                    </div>
                    <p style={{ fontSize: '15px', color: '#374151', lineHeight: '1.6', marginBottom: '16px' }}>{match.reason}</p>
                    <Link
                      href={`/agents/${match.slug}`}
                      style={{ display: 'inline-block', background: i === 0 ? '#2563eb' : '#f3f4f6', color: i === 0 ? '#fff' : '#374151', textDecoration: 'none', padding: '8px 20px', borderRadius: '6px', fontSize: '14px', fontWeight: '600' }}
                    >
                      View {match.name} →
                    </Link>
                  </div>
                ))}
              </div>
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
            We're building a network of vetted AI implementation specialists — people who can set up and configure AI agents for your business.
          </p>
          <p style={{ fontSize: '14px', color: '#60a5fa', marginBottom: '32px' }}>
            Join the waitlist and we'll connect you when it launches.
          </p>

          {waitlistSubmitted ? (
            <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', color: '#16a34a', fontSize: '18px', fontWeight: '700' }}>
              ✓ You're on the list! We'll be in touch.
            </div>
          ) : (
            <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', textAlign: 'left' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={waitlistName}
                    onChange={e => setWaitlistName(e.target.value)}
                    style={{ flex: 1, padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
                  />
                  <input
                    type="text"
                    placeholder="Company (optional)"
                    value={waitlistCompany}
                    onChange={e => setWaitlistCompany(e.target.value)}
                    style={{ flex: 1, padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
                  />
                </div>
                <input
                  type="email"
                  placeholder="Your email address"
                  value={waitlistEmail}
                  onChange={e => setWaitlistEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
                <textarea
                  placeholder="What kind of automation do you need help with? (optional)"
                  value={waitlistServices}
                  onChange={e => setWaitlistServices(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '14px', outline: 'none', minHeight: '80px', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
                />
                <button
                  onClick={handleWaitlist}
                  disabled={waitlistLoading || !waitlistEmail}
                  style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', padding: '12px', fontSize: '15px', fontWeight: '600', cursor: waitlistLoading || !waitlistEmail ? 'not-allowed' : 'pointer', opacity: !waitlistEmail ? 0.6 : 1 }}
                >
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

export default function FindPage() {
  return (
    <Suspense fallback={<div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>Loading...</div>}>
      <FindPageInner />
    </Suspense>
  )
}
