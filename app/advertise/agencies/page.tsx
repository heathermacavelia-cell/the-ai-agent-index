import type { Metadata } from 'next'
import Link from 'next/link'
import AdvertiseForm from '@/components/AdvertiseForm'
import { createClient } from '@/lib/supabase'
import {
  SPOTLIGHT_CATEGORIES, SPOTLIGHT_TERMS, AGENCY_SPOTLIGHT_SLOTS, spotlightCheckout,
  TRAFFIC_SOURCE_NOTE, AGENCY_REVIEW_PRICE, AGENCY_REVIEW_TIMELINE,
} from '@/lib/vendorPlans'

// AGENCY ADVERTISING, ruled 2026-10-08 (Heather). Agencies are priced apart
// from agent vendors: Agency Spotlight by category, 1/3/6 months paid up front,
// no auto-renew. Every price, link and traffic figure comes from lib/vendorPlans.
// Spots left is read live from agency_spotlights, so refresh every 10 minutes.
export const revalidate = 600

export const metadata: Metadata = {
  title: 'Advertise Your AI Agency | The AI Agent Index',
  description: 'Put your AI automation agency in front of businesses comparing AI tools. Agency Spotlight from $19 a month, 1, 3 or 6 months paid up front, no auto-renew.',
  alternates: { canonical: 'https://theaiagentindex.com/advertise/agencies' },
}

const eyebrow = { color: '#6B7280', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const }
const h2 = { fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' as const }
const card = { backgroundColor: '#080D16', border: '1px solid #1F2937', borderRadius: '0.875rem' }

function Check() {
  return <svg style={{ flexShrink: 0, marginTop: '2px', color: '#34D399' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
}

const howItWorks = [
  'A small box headed "Prefer to have it built for you?" on every listing, comparison and alternatives page in the category you choose, and on the category page itself',
  'Up to ' + AGENCY_SPOTLIGHT_SLOTS + ' agencies per category, never more',
  'If you list the tool a page is about (Make, Zapier, n8n, HubSpot and so on), you show first on that page, with "Works with" beside your name',
  'Each card links to your listing in our agency directory',
  'Labeled Sponsored. It never changes a rating, a ranking or anything we write about the tools',
  'Live within 1 business day of payment',
]

const terms = [
  '1, 3 or 6 months, paid up front. 3 months saves 10%, 6 months saves 15%.',
  'No auto-renew. Your Spotlight ends on its end date and nothing more is charged.',
  'The price you pay is fixed for your whole term.',
  'We check traffic every month. A category’s price only changes when its traffic moves into a different band, and a new price applies to new purchases only.',
]

export default async function AdvertiseAgenciesPage() {
  const supabase = createClient()
  const today = new Date().toISOString().split('T')[0]
  const { data: active } = await supabase
    .from('agency_spotlights')
    .select('category_slug')
    .lte('start_date', today)
    .gte('end_date', today)
  const taken = new Map<string, number>()
  for (const r of active ?? []) taken.set(r.category_slug as string, (taken.get(r.category_slug as string) ?? 0) + 1)

  return (
    <div style={{ backgroundColor: '#030712', minHeight: '100vh', color: 'white' }}>

      <section style={{ maxWidth: '860px', margin: '0 auto', padding: '5rem 1.5rem 2.5rem' }}>
        <div style={{ display: 'inline-block', backgroundColor: '#0F172A', border: '1px solid #1F2937', borderRadius: '2rem', padding: '0.25rem 0.875rem', marginBottom: '1.5rem' }}>
          <span style={{ color: '#34D399', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>For AI automation agencies</span>
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '1.25rem' }}>
          Be there when a business decides it would rather not build it themselves
        </h1>
        <p style={{ fontSize: '1.0625rem', color: '#9CA3AF', lineHeight: 1.7, maxWidth: '660px', marginBottom: '1.25rem' }}>
          Businesses come here to compare AI tools for a job: a support agent, a sales workflow, an automation between their apps. Some of them get halfway through the comparison and realize they want someone to build it. Agency Spotlight puts your agency on those pages, at that moment.
        </p>
        <p style={{ fontSize: '0.9375rem', color: '#D1D5DB', lineHeight: 1.7, maxWidth: '660px', marginBottom: '2rem' }}>
          From <strong style={{ color: 'white' }}>${SPOTLIGHT_CATEGORIES.reduce((m, c) => Math.min(m, c.band.monthly), Infinity)} a month</strong>. Pay for 1, 3 or 6 months up front. No contract and no auto-renew.
        </p>
        <a href="#categories" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#059669', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.9375rem', textDecoration: 'none' }}>
          See categories, traffic and prices
        </a>
      </section>

      <section style={{ maxWidth: '860px', margin: '0 auto', padding: '1rem 1.5rem 3rem' }}>
        <p style={{ ...eyebrow, marginBottom: '1rem' }}>How Agency Spotlight works</p>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', listStyle: 'none', padding: 0, margin: 0 }}>
          {howItWorks.map(f => (
            <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', color: '#D1D5DB', fontSize: '0.9375rem', lineHeight: 1.55 }}><Check />{f}</li>
          ))}
        </ul>
      </section>

      <section id="categories" style={{ backgroundColor: '#0F172A', borderTop: '1px solid #1F2937', borderBottom: '1px solid #1F2937' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '3.5rem 1.5rem' }}>
          <p style={{ ...eyebrow, marginBottom: '0.75rem' }}>Categories, traffic and prices</p>
          <h2 style={{ ...h2, marginBottom: '0.75rem' }}>Priced by the traffic each category actually gets</h2>
          <p style={{ color: '#9CA3AF', fontSize: '0.9375rem', lineHeight: 1.65, marginBottom: '2rem', maxWidth: '680px' }}>
            The visits below are real, from our analytics, and they count every page your Spotlight appears on in that category: the category page, its listings, and its comparison and alternatives pages. Coding is not offered: its readers are developers who build things themselves.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.875rem' }}>
            {SPOTLIGHT_CATEGORIES.map(c => {
              const left = Math.max(0, AGENCY_SPOTLIGHT_SLOTS - (taken.get(c.slug) ?? 0))
              const full = left === 0
              return (
                <div key={c.slug} style={{ ...card, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', borderColor: full ? '#1F2937' : 'rgba(52,211,153,0.3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.5rem' }}>
                    <Link href={'/' + c.slug} style={{ color: 'white', fontWeight: 700, fontSize: '1rem', textDecoration: 'none' }}>{c.label}</Link>
                    <span style={{ color: full ? '#6B7280' : '#34D399', fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {full ? 'Full' : left + ' of ' + AGENCY_SPOTLIGHT_SLOTS + ' open'}
                    </span>
                  </div>
                  <p style={{ margin: 0, color: '#D1D5DB', fontSize: '0.875rem' }}>
                    <strong style={{ color: 'white', fontSize: '1.25rem' }}>{c.visits.toLocaleString('en-US')}</strong> visits in 30 days
                  </p>
                  <p style={{ margin: 0, color: '#9CA3AF', fontSize: '0.75rem' }}>
                    {(c.comparisonVisits + c.alternativesVisits).toLocaleString('en-US')} of them on comparison and alternatives pages
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.375rem', marginTop: '0.5rem' }}>
                    {SPOTLIGHT_TERMS.map(t => {
                      const href = full ? '' : spotlightCheckout(c.slug, t)
                      const label = t === 1 ? '1 month' : t + ' months'
                      const inner = (
                        <>
                          <span style={{ display: 'block', fontSize: '0.6875rem', color: '#9CA3AF' }}>{label}</span>
                          <span style={{ display: 'block', fontSize: '1rem', fontWeight: 800, color: 'white' }}>${c.band.prices[t]}</span>
                          {t > 1 && <span style={{ display: 'block', fontSize: '0.625rem', color: '#34D399' }}>save {t === 3 ? '10' : '15'}%</span>}
                        </>
                      )
                      const style = { display: 'block', textAlign: 'center' as const, padding: '0.5rem 0.25rem', borderRadius: '0.5rem', border: '1px solid #374151', backgroundColor: '#0B1220', textDecoration: 'none' }
                      if (full) return <div key={t} style={{ ...style, opacity: 0.5 }}>{inner}</div>
                      return href
                        ? <a key={t} href={href} target="_blank" rel="noopener noreferrer" style={style}>{inner}</a>
                        : <a key={t} href="#contact" style={style}>{inner}</a>
                    })}
                  </div>
                  <p style={{ margin: '0.25rem 0 0', color: '#6B7280', fontSize: '0.6875rem' }}>USD, paid once. ${c.band.monthly}/month on a 1-month term.</p>
                </div>
              )
            })}
          </div>
          <p style={{ color: '#6B7280', fontSize: '0.75rem', lineHeight: 1.6, marginTop: '1.25rem', marginBottom: 0 }}>{TRAFFIC_SOURCE_NOTE.replace(' Prices are reviewed once a quarter.', '')}</p>
        </div>
      </section>

      <section style={{ maxWidth: '860px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <p style={{ ...eyebrow, marginBottom: '1rem' }}>The terms, in plain words</p>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', listStyle: 'none', padding: 0, margin: '0 0 2.5rem' }}>
          {terms.map(f => (
            <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', color: '#D1D5DB', fontSize: '0.9375rem', lineHeight: 1.55 }}><Check />{f}</li>
          ))}
        </ul>
        <div style={{ ...card, padding: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>Not listed yet, or want the Independently Reviewed badge?</h3>
          <p style={{ color: '#9CA3AF', fontSize: '0.875rem', lineHeight: 1.65, margin: 0 }}>
            A listing in our agency directory is free. An Independent Review is {AGENCY_REVIEW_PRICE} once, done within {AGENCY_REVIEW_TIMELINE} of payment: we check your listing against your live site, and it adds the Independently Reviewed badge with its date, a place above free listings in the directory, and your own logo. <Link href="/submit-agency" style={{ color: '#60A5FA', textDecoration: 'none' }}>List your agency</Link>
          </p>
        </div>
      </section>

      <section id="contact">
        <div style={{ maxWidth: '640px', margin: '0 auto', padding: '1rem 1.5rem 6rem' }}>
          <p style={{ ...eyebrow, marginBottom: '0.75rem' }}>Questions first?</p>
          <h2 style={{ ...h2, marginBottom: '0.75rem' }}>Ask us about a Spotlight</h2>
          <p style={{ color: '#9CA3AF', fontSize: '0.9375rem', lineHeight: 1.65, marginBottom: '2rem' }}>
            Tell us your agency and the category you have in mind. We reply within one business day.
          </p>
          <AdvertiseForm />
        </div>
      </section>
    </div>
  )
}
