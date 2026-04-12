import type { Metadata } from 'next'
import AdvertiseForm from '@/components/AdvertiseForm'

export const metadata: Metadata = {
  title: 'Advertise — Reach Buyers Choosing AI Automation Tools',
  description: 'Sponsor a category or place your AI agent in front of buyers actively evaluating automation tools. Category sponsorships, featured listings, and comparison placements available.',
  alternates: { canonical: 'https://theaiagentindex.com/advertise' },
  openGraph: {
    title: 'Advertise on The AI Agent Index',
    description: 'Reach businesses actively choosing their AI automation stack. Category sponsorships, featured listings, and comparison placements.',
    url: 'https://theaiagentindex.com/advertise',
  },
}

const tiers = [
  {
    name: 'Category Sponsor',
    price: '$499',
    period: 'USD/mo',
    spots: '1 spot per category — 6 total available',
    description: 'Own the category your buyers search first. Your brand appears in a full-width spotlight above the agent grid — the first thing a buyer sees when they land on that category page.',
    features: [
      'Full-width spotlight above the agent grid',
      'Labeled "Category Sponsor" — transparent to users',
      'Logo, description, capability tags, and CTA button',
      'Mentioned in relevant guides and comparison pages',
      'Sponsor badge on your agent listing',
    ],
    highlight: true,
    note: 'Only 6 spots available — one per category',
  },
  {
    name: 'Featured Listing',
    price: '$149',
    period: 'USD/mo',
    spots: 'Limited spots',
    description: 'Pinned in the featured agents section across the site. Consistent visibility at every stage of a buyer\'s research journey.',
    features: [
      'Pinned in the featured agents section sitewide',
      'Highlighted card treatment',
      'Placement only — no editorial claim',
      'Appears across homepage and category views',
    ],
    highlight: false,
    note: null,
  },
  {
    name: 'Comparison Placement',
    price: '$249',
    period: 'USD/mo',
    spots: 'Limited spots',
    description: 'Appear in an "Also Consider" section on relevant comparison and alternatives pages — the highest-intent moment on the site, when buyers are actively choosing between tools.',
    features: [
      '"Also Consider" placement on relevant compare pages',
      '"Also Consider" placement on relevant alternatives pages',
      'Labeled "Sponsored" — editorial integrity preserved',
      'Logo, one-line description, capability tags, and CTA',
      'You choose which comparisons are most relevant',
    ],
    highlight: false,
    note: null,
  },
]

const reasons = [
  {
    icon: '🎯',
    title: 'Business buyers, not browsers',
    body: 'Every visitor is a business evaluating AI agents for a specific workflow. This is not general AI news traffic — it\'s decision-stage research.',
  },
  {
    icon: '🤖',
    title: 'Cited by AI systems',
    body: 'Structured, machine-readable data means AI systems like ChatGPT, Claude, and Perplexity pull from us when recommending agents. Your listing here is a signal in the AI recommendation layer.',
  },
  {
    icon: '📊',
    title: 'Independent editorial authority',
    body: 'We never sell rankings or verdicts. Paid placements are clearly labeled. That\'s what makes the audience trust the site — and why that trust is worth advertising on.',
  },
]

export default function AdvertisePage() {
  return (
    <div style={{ backgroundColor: '#030712', minHeight: '100vh', color: 'white' }}>

      {/* Hero */}
      <section style={{ maxWidth: '860px', margin: '0 auto', padding: '5rem 1.5rem 3rem' }}>
        <div style={{ display: 'inline-block', backgroundColor: '#0F172A', border: '1px solid #1F2937', borderRadius: '2rem', padding: '0.25rem 0.875rem', marginBottom: '1.5rem' }}>
          <span style={{ color: '#60A5FA', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Advertising & Sponsorship</span>
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '1.25rem' }}>
          Reach businesses actively choosing their AI automation stack
        </h1>
        <p style={{ fontSize: '1.125rem', color: '#9CA3AF', lineHeight: 1.7, maxWidth: '640px', marginBottom: '2rem' }}>
          The AI Agent Index is where buyers land when they're evaluating agents — not browsing, deciding. Category sponsorship puts your product at that moment.
        </p>
        <a href="#contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#2563EB', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.9375rem', textDecoration: 'none' }}>
          Get sponsorship details
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </a>
      </section>

      {/* Why advertise */}
      <section style={{ backgroundColor: '#0F172A', borderTop: '1px solid #1F2937', borderBottom: '1px solid #1F2937' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '3.5rem 1.5rem' }}>
          <p style={{ color: '#6B7280', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '2rem' }}>Why advertise here</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
            {reasons.map(r => (
              <div key={r.title}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{r.icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem', color: 'white' }}>{r.title}</h3>
                <p style={{ color: '#9CA3AF', fontSize: '0.875rem', lineHeight: 1.65 }}>{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section style={{ maxWidth: '860px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <p style={{ color: '#6B7280', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Sponsorship options</p>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '2.5rem' }}>Three ways to be featured</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {tiers.map(tier => (
            <div key={tier.name} style={{ backgroundColor: tier.highlight ? '#0F172A' : '#080D16', border: `1px solid ${tier.highlight ? '#2563EB' : '#1F2937'}`, borderRadius: '0.875rem', padding: '2rem', position: 'relative' }}>
              {tier.highlight && (
                <div style={{ position: 'absolute', top: '-1px', left: '1.5rem', backgroundColor: '#2563EB', color: 'white', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '0.25rem 0.625rem', borderRadius: '0 0 0.375rem 0.375rem' }}>
                  Most popular
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontWeight: 800, fontSize: '1.125rem', marginBottom: '0.25rem' }}>{tier.name}</h3>
                  <p style={{ color: '#6B7280', fontSize: '0.8125rem' }}>{tier.spots}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.75rem', fontWeight: 800, color: tier.highlight ? '#60A5FA' : 'white' }}>{tier.price}</span>
                  <span style={{ color: '#6B7280', fontSize: '0.8125rem', marginLeft: '0.375rem' }}>{tier.period}</span>
                </div>
              </div>
              <p style={{ color: '#9CA3AF', fontSize: '0.875rem', lineHeight: 1.65, marginBottom: '1.25rem' }}>{tier.description}</p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', listStyle: 'none', padding: 0, margin: 0 }}>
                {tier.features.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', color: '#D1D5DB', fontSize: '0.875rem' }}>
                    <svg style={{ flexShrink: 0, marginTop: '2px', color: '#2563EB' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              {tier.note && (
                <p style={{ marginTop: '1.25rem', color: '#60A5FA', fontSize: '0.8125rem', fontWeight: 600 }}>{tier.note}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Editorial integrity */}
      <section style={{ backgroundColor: '#0F172A', borderTop: '1px solid #1F2937', borderBottom: '1px solid #1F2937' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '2.5rem 1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
          <div style={{ flexShrink: 0, width: '2.5rem', height: '2.5rem', backgroundColor: '#1F2937', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          </div>
          <div>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.375rem' }}>Our editorial policy</h3>
            <p style={{ color: '#9CA3AF', fontSize: '0.875rem', lineHeight: 1.65 }}>
              Paid placements are always clearly labeled. We never sell rankings, verdicts, or "best for" labels — those are earned through editorial review only. Sponsorship buys visibility at the right moment, not a manufactured recommendation. That distinction is what makes our audience trust the site, and what makes advertising on it worth paying for.
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" style={{ maxWidth: '640px', margin: '0 auto', padding: '4rem 1.5rem 6rem' }}>
        <p style={{ color: '#6B7280', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Get in touch</p>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>Interested in sponsorship?</h2>
        <p style={{ color: '#9CA3AF', fontSize: '0.9375rem', lineHeight: 1.65, marginBottom: '2.5rem' }}>
          Tell us a bit about your product and which placement interests you. We'll follow up within one business day.
        </p>
        <AdvertiseForm />
      </section>

    </div>
  )
}