import type { Metadata } from 'next'
import SubmitForm from '@/components/SubmitForm'
import NewsletterSignup from '@/components/NewsletterSignup'
import { TIERS, PLACEMENTS, AGENT_TEST, CATEGORY_SPONSORS } from '@/lib/vendorPlans'
import { getAiReadsSummary } from '@/lib/aiReads'
import { freeQueueWeeks, waitLabel } from '@/lib/freeQueue'

// The free-queue estimate and the AI-read counts are read live. Refresh hourly.
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Submit an AI Agent',
  description: 'Submit your AI agent to the AI Agent Index. Free and paid listings, structured data, discoverable by AI systems.',
  alternates: { canonical: 'https://theaiagentindex.com/submit' },
}

export default async function SubmitPage() {
  const freeWeeks = await freeQueueWeeks(false)
  // AI reads per category, last 30 days, from our own logs (same source as
  // /advertise). Say "read", never "cited". Null if the logs are unreadable.
  const ai = await getAiReadsSummary(CATEGORY_SPONSORS.map(c => c.slug))
  const aiByCategory: Record<string, number> = {}
  let aiTotal = 0
  if (ai) for (const c of CATEGORY_SPONSORS) { const n = ai.byCategory[c.slug]?.total ?? 0; aiByCategory[c.slug] = n; aiTotal += n }
  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Submit a listing</p>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#111827', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>Submit your AI agent</h1>
        <p style={{ color: '#6B7280', fontSize: '1rem', lineHeight: 1.6, maxWidth: '640px' }}>
          Get your agent in front of builders, buyers, and the AI systems that reference this index. Every listing is independently researched and written by our editorial team, structured for AI discoverability.
        </p>
        <p style={{ color: '#9CA3AF', fontSize: '0.875rem', marginTop: '0.75rem' }}>
          Not a software product? <a href="/submit-agency" style={{ color: '#059669', textDecoration: 'none', fontWeight: 600 }}>Submit an AI automation agency (services firm) instead &rarr;</a>
        </p>
      </div>

      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: '0.375rem' }}>Choose how your listing is handled</h2>
        <p style={{ color: '#6B7280', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
          You do not choose now. Fill in the form below and pick at the end. A free listing is always available.
        </p>
        {aiTotal > 0 && (
          <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '0.75rem', padding: '0.875rem 1.125rem', marginBottom: '1.25rem' }}>
            <p style={{ fontSize: '0.875rem', color: '#1E3A8A', lineHeight: 1.6, margin: 0 }}>
              <strong>AI systems read the listings, comparisons and category pages here {aiTotal.toLocaleString('en-US')} times in the last 30 days</strong>, counted in our own server logs. Your listing is what they read about you. A one-time review is right on the day we check it. A Featured Listing keeps it right.
            </p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          {TIERS.map(tier => {
            const paid = tier.id !== 'self'
            return (
              <div key={tier.id} style={{
                backgroundColor: 'white',
                border: tier.badge ? '2px solid #2563EB' : paid ? '1px solid #BFDBFE' : '1px solid #E5E7EB',
                borderRadius: '0.875rem',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
              }}>
                {tier.badge && (
                  <span style={{ alignSelf: 'flex-start', fontSize: '0.6875rem', fontWeight: 700, color: 'white', backgroundColor: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', marginBottom: '0.5rem' }}>{tier.badge}</span>
                )}
                <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', margin: '0 0 0.25rem' }}>{tier.name}</p>
                <p style={{ margin: '0 0 0.75rem', display: 'flex', alignItems: 'baseline', gap: '0.375rem' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, color: paid ? '#1D4ED8' : '#111827', letterSpacing: '-0.02em' }}>{tier.price}</span>
                  {tier.cadence && <span style={{ fontSize: '0.8125rem', color: '#6B7280' }}>{tier.cadence}</span>}
                </p>
                {tier.annualPrice && (
                  <p style={{ margin: '-0.5rem 0 0.75rem', fontSize: '0.75rem', color: '#4B5563' }}>or {tier.annualPrice} a year, two months free</p>
                )}
                <p style={{
                  fontSize: '0.75rem', fontWeight: 700, color: paid ? '#1D4ED8' : '#374151',
                  backgroundColor: paid ? '#EFF6FF' : '#F3F4F6',
                  padding: '0.25rem 0.5rem', borderRadius: '0.375rem',
                  display: 'inline-block', alignSelf: 'flex-start', margin: '0 0 0.875rem',
                }}>
                  {tier.id === 'self'
                    ? (freeWeeks ? 'Estimated live in ' + waitLabel(freeWeeks) : 'Published in weekly batches')
                    : tier.id === 'managed' ? 'Live in ' + tier.timeline + ', then every 14 days' : 'Live in ' + tier.timeline}
                </p>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {tier.points.map(point => (
                    <li key={point} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8125rem', color: '#374151', lineHeight: 1.5 }}>
                      <span style={{ color: paid ? '#2563EB' : '#9CA3AF', fontWeight: 700, flexShrink: 0 }}>&#8226;</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                {tier.note && (
                  <p style={{ margin: '0.875rem 0 0', fontSize: '0.75rem', fontWeight: 600, color: '#047857', lineHeight: 1.5 }}>{tier.note}</p>
                )}
              </div>
            )
          })}
        </div>

        <div style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1rem 1.25rem', marginTop: '1rem' }}>
          <p style={{ fontSize: '0.8125rem', color: '#374151', lineHeight: 1.6, margin: 0 }}>
          <strong>What paying buys.</strong> The full audit puts the structured data behind your listing that our JSON-LD, public API and MCP server hand to AI systems answering questions about your category. Featured keeps it current. Ratings and rankings are earned and never sold.
          </p>
        </div>
      </div>

      <div style={{ marginBottom: '2.5rem', backgroundColor: '#0B1220', borderRadius: '0.875rem', padding: '1.75rem', color: 'white' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#60A5FA', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.5rem' }}>Want more than a listing?</p>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.5rem', letterSpacing: '-0.01em' }}>Be the first name buyers see, or show them it works.</h2>
        <p style={{ fontSize: '0.875rem', color: '#9CA3AF', lineHeight: 1.65, margin: '0 0 1.25rem' }}>
          Placements put you where buyers compare named products. Each one includes a Featured Listing, so you never pay for both. The hands-on test shows buyers what your agent actually does.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.875rem', marginBottom: '1.25rem' }}>
          {PLACEMENTS.filter(p => p.id !== 'featured-listing').map(p => (
            <div key={p.id} style={{ border: p.highlight ? '1px solid #2563EB' : '1px solid #1F2937', borderRadius: '0.75rem', padding: '1rem', backgroundColor: '#0F172A', display: 'flex', flexDirection: 'column' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 700, margin: '0 0 0.25rem' }}>{p.name}</p>
              <p style={{ margin: '0 0 0.5rem' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#60A5FA' }}>{p.price}</span>
                <span style={{ fontSize: '0.75rem', color: '#6B7280', marginLeft: '0.25rem' }}>{p.period}</span>
              </p>
              <p style={{ fontSize: '0.8125rem', color: '#D1D5DB', lineHeight: 1.55, margin: 0, flexGrow: 1 }}>{p.short}</p>
            </div>
          ))}
          <div style={{ border: '1px solid #1F2937', borderRadius: '0.75rem', padding: '1rem', backgroundColor: '#0F172A', display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 700, margin: '0 0 0.25rem' }}>{AGENT_TEST.name}</p>
            <p style={{ margin: '0 0 0.5rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#60A5FA' }}>{AGENT_TEST.price}</span>
              <span style={{ fontSize: '0.75rem', color: '#6B7280', marginLeft: '0.25rem' }}>{AGENT_TEST.period}</span>
            </p>
            <p style={{ fontSize: '0.8125rem', color: '#D1D5DB', lineHeight: 1.55, margin: 0, flexGrow: 1 }}>We run your agent through the same task list as every agent of its type and publish the results. Workflow builders now.</p>
          </div>
        </div>
        <a href="/advertise#placements" style={{ display: 'inline-block', fontSize: '0.875rem', fontWeight: 700, color: 'white', backgroundColor: '#2563EB', textDecoration: 'none', padding: '0.625rem 1.125rem', borderRadius: '0.5rem' }}>
          See placements and the test &rarr;
        </a>
        <p style={{ fontSize: '0.75rem', color: '#6B7280', lineHeight: 1.5, margin: '0.875rem 0 0' }}>
          Placements are labeled on the page and never change a rating or a ranking. You can submit below first and add a placement any time.
        </p>
      </div>

      <SubmitForm freeWaitWeeks={freeWeeks} aiReadsByCategory={aiByCategory} />
      <NewsletterSignup sourcePage="/submit" sourceType="other" />
    </div>
  )
}