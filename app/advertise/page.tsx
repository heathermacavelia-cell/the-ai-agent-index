import type { Metadata } from 'next'
import AdvertiseForm from '@/components/AdvertiseForm'
import AiCrawlerStats from '@/components/AiCrawlerStats'
import { TIERS, PLACEMENTS, DEMO_VIDEO } from '@/lib/vendorPlans'

export const metadata: Metadata = {
  title: 'Advertise | The AI Agent Index',
  description: 'Reach buyers evaluating AI agents. Audited listings from $39. Featured placements, category sponsorships and comparison placements, all with ongoing accuracy maintenance.',
  alternates: { canonical: 'https://theaiagentindex.com/advertise' },
  openGraph: {
    title: 'Advertise on The AI Agent Index',
    description: 'Reach businesses actively choosing their AI automation stack. Audited listings, featured placements, category sponsorships and comparison placements.',
    url: 'https://theaiagentindex.com/advertise',
  },
}

const review = TIERS.find(t => t.id === 'review')!
const managed = TIERS.find(t => t.id === 'managed')!

const reasons = [
  {
    icon: '🎯',
    title: 'Buyers, not browsers',
    body: 'Nobody lands here casually. Every visitor is a business working out which AI agent to put into a specific workflow. They arrive at the decision stage, comparing named products against each other.',
  },
  {
    icon: '🤖',
    title: 'Built to be read by machines',
    body: 'JSON-LD on every page, a public JSON API, an MCP server and a clean taxonomy. Most directories are built for Google. This one is built so that AI systems can parse your product without guessing, and the logs show them doing it every day.',
  },
  {
    icon: '📊',
    title: 'Credibility you can borrow',
    body: 'Buyers arrive here already trusting the verdicts, because those are earned rather than sold. Your placement sits inside that trust, which is worth considerably more than the same space on a page nobody believes.',
  },
]

const badgeExplainer = [
  {
    name: 'Audited',
    color: '#3B82F6',
    border: 'rgba(59,130,246,0.3)',
    bg: 'rgba(59,130,246,0.08)',
    description: 'This listing has been checked against live sources by our editorial team, and the badge carries the date. Buyers can see at a glance how current the information in front of them is. An Editorial Review puts one on your listing.',
    visual: 'Blue pill with a date',
  },
  {
    name: 'Claimed',
    color: '#3B82F6',
    border: 'rgba(59,130,246,0.3)',
    bg: 'rgba(59,130,246,0.08)',
    description: 'The vendor has identified themselves as the owner of this listing. Claiming is free. It tells readers the company behind the product is engaged with what is published here.',
    visual: 'Blue checkmark on the developer byline',
  },
  {
    name: 'Boosted',
    color: '#A78BFA',
    border: 'rgba(167,139,250,0.35)',
    bg: 'rgba(167,139,250,0.08)',
    description: 'This vendor has invested in their listing. Boosted listings hold prime placement and are re-audited every 14 days, so what a buyer sees is both the most prominent version of the product and the most current.',
    visual: 'Violet pill on boosted listings',
  },
]

const eyebrow = { color: '#6B7280', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const }
const h2 = { fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' as const }
const card = { backgroundColor: '#080D16', border: '1px solid #1F2937', borderRadius: '0.875rem' }

function Check() {
  return <svg style={{ flexShrink: 0, marginTop: '2px', color: '#2563EB' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
}

export default function AdvertisePage() {
  return (
    <div style={{ backgroundColor: '#030712', minHeight: '100vh', color: 'white' }}>

      {/* Hero */}
      <section style={{ maxWidth: '860px', margin: '0 auto', padding: '5rem 1.5rem 3rem' }}>
        <div style={{ display: 'inline-block', backgroundColor: '#0F172A', border: '1px solid #1F2937', borderRadius: '2rem', padding: '0.25rem 0.875rem', marginBottom: '1.5rem' }}>
          <span style={{ color: '#60A5FA', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Advertising and sponsorship</span>
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '1.25rem' }}>
          Your buyers are asking an AI which agent to use
        </h1>
        <p style={{ fontSize: '1.125rem', color: '#9CA3AF', lineHeight: 1.7, maxWidth: '660px', marginBottom: '1.25rem' }}>
          They are also landing here, at the moment they compare named products against each other. This is the directory built so that both of them, the person and the machine, can read your product properly.
        </p>
        <p style={{ fontSize: '0.9375rem', color: '#D1D5DB', lineHeight: 1.7, maxWidth: '660px', marginBottom: '2rem' }}>
          An audited listing is <strong style={{ color: 'white' }}>{review.price} once</strong>. Placement starts at <strong style={{ color: 'white' }}>{PLACEMENTS[0].price}/month</strong>, and every placement keeps your data current for as long as it runs.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a href="#listing" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#2563EB', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.9375rem', textDecoration: 'none' }}>
            Get listed properly
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </a>
          <a href="#placements" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'transparent', color: '#9CA3AF', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.9375rem', textDecoration: 'none', border: '1px solid #374151' }}>
            See placements
          </a>
        </div>
      </section>

      {/* AI distribution proof */}
      <section id="ai-citations" style={{ backgroundColor: '#0F172A', borderTop: '1px solid #1F2937', borderBottom: '1px solid #1F2937' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '3.5rem 1.5rem' }}>
          <p style={{ ...eyebrow, marginBottom: '0.75rem' }}>Measured, not claimed</p>
          <h2 style={{ ...h2, marginBottom: '0.75rem' }}>AI systems read this directory every day</h2>
          <p style={{ color: '#9CA3AF', fontSize: '0.9375rem', lineHeight: 1.65, marginBottom: '2.5rem', maxWidth: '660px' }}>
            These are not projections. Every number below comes from our own server logs, classified request by request, and refreshes on its own. When ChatGPT, Claude, Perplexity or Google AI go looking for information about agents in your category, this is them arriving.
          </p>

          <AiCrawlerStats />

          <div style={{ marginTop: '2rem', padding: '1.5rem', border: '1px solid rgba(37,99,235,0.2)', borderRadius: '0.875rem', background: 'rgba(37,99,235,0.04)' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#60A5FA', marginBottom: '0.5rem' }}>What that means for your listing</p>
            <p style={{ fontSize: '0.875rem', color: '#9CA3AF', lineHeight: 1.65 }}>
              An AI system reading your own website has to interpret marketing prose. Reading your listing here, it gets typed, structured data: what kind of agent it is, which workflows and languages it supports, how it deploys, what your contract and data-training terms are, whether you run an MCP server, and the identity links that tell it your product pages are all one product. Most of that never appears on the page a person sees. It is the part the machines use, and it is only as good as the last time somebody checked it.
            </p>
          </div>
        </div>
      </section>

      {/* Why here */}
      <section style={{ maxWidth: '860px', margin: '0 auto', padding: '3.5rem 1.5rem' }}>
        <p style={{ ...eyebrow, marginBottom: '2rem' }}>Why here</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
          {reasons.map(r => (
            <div key={r.title}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{r.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem', color: 'white' }}>{r.title}</h3>
              <p style={{ color: '#9CA3AF', fontSize: '0.875rem', lineHeight: 1.65 }}>{r.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Step one: the listing itself */}
      <section id="listing" style={{ backgroundColor: '#0F172A', borderTop: '1px solid #1F2937', borderBottom: '1px solid #1F2937' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '4rem 1.5rem' }}>
          <p style={{ ...eyebrow, marginBottom: '0.75rem' }}>Start here</p>
          <h2 style={{ ...h2, marginBottom: '0.75rem' }}>First, get the data right</h2>
          <p style={{ color: '#9CA3AF', fontSize: '0.9375rem', lineHeight: 1.65, marginBottom: '2.5rem', maxWidth: '660px' }}>
            Paying for placement on top of a listing nobody has checked is buying attention for the wrong information. An audit comes first, and you can buy one right now without talking to anybody.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {[review, managed].map(t => (
              <div key={t.id} style={{ ...card, borderColor: t.id === 'managed' ? '#2563EB' : '#1F2937', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontWeight: 800, fontSize: '1.125rem', marginBottom: '0.5rem' }}>{t.name}</h3>
                <p style={{ margin: '0 0 0.25rem' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 800, color: t.id === 'managed' ? '#60A5FA' : 'white', letterSpacing: '-0.02em' }}>{t.price}</span>
                  <span style={{ color: '#6B7280', fontSize: '0.8125rem', marginLeft: '0.375rem' }}>{t.cadence}</span>
                </p>
                <p style={{ color: '#34D399', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '1rem' }}>Live in {t.timeline}</p>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', listStyle: 'none', padding: 0, margin: '0 0 1.5rem', flexGrow: 1 }}>
                  {t.points.map(p => (
                    <li key={p} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', color: '#D1D5DB', fontSize: '0.875rem', lineHeight: 1.55 }}>
                      <Check />{p}
                    </li>
                  ))}
                </ul>
                <a href={t.checkout} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'block', textAlign: 'center', backgroundColor: t.id === 'managed' ? '#2563EB' : '#22C55E', color: 'white', fontWeight: 700, fontSize: '0.9375rem', textDecoration: 'none', padding: '0.75rem 1.25rem', borderRadius: '0.5rem' }}>
                  {t.id === 'managed' ? 'Subscribe to Editorial Managed' : 'Buy an Editorial Review'}
                </a>
                <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.75rem', textAlign: 'center', lineHeight: 1.5 }}>
                  {t.id === 'managed'
                    ? 'Cancel anytime. Refunded in full if your agent does not qualify.'
                    : 'Refunded in full, automatically, if your agent does not qualify.'}
                </p>
              </div>
            ))}
          </div>

          <p style={{ color: '#6B7280', fontSize: '0.8125rem', marginTop: '1.5rem', lineHeight: 1.6 }}>
            A free listing is always available and always will be. It gets a lighter check and no promised timeline. <a href="/submit" style={{ color: '#60A5FA', textDecoration: 'none' }}>Submit one here</a>.
          </p>
        </div>
      </section>

      {/* Placements */}
      <section id="placements" style={{ maxWidth: '860px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <p style={{ ...eyebrow, marginBottom: '0.75rem' }}>Placements</p>
        <h2 style={{ ...h2, marginBottom: '0.75rem' }}>Then, be where the decision happens</h2>
        <p style={{ color: '#9CA3AF', fontSize: '0.9375rem', lineHeight: 1.65, marginBottom: '0.75rem', maxWidth: '660px' }}>
          Four placements, each aimed at a different moment in a buyer&apos;s search. Every one includes a re-audit of your listing every 14 days, so what buyers find is as current as it is prominent.
        </p>
        <p style={{ color: '#34D399', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '2.5rem' }}>
          Founding advertiser rates. Whatever you pay today is what you keep paying: these prices are locked for early partners and rise as traffic scales.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {PLACEMENTS.map(p => (
            <div key={p.id} style={{ ...card, backgroundColor: p.highlight ? '#0F172A' : '#080D16', borderColor: p.highlight ? '#2563EB' : '#1F2937', padding: '2rem', position: 'relative' }}>
              {p.badge && (
                <div style={{ position: 'absolute', top: '-1px', left: '1.5rem', backgroundColor: p.badge === 'Most popular' ? '#F97316' : '#2563EB', color: 'white', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '0.25rem 0.625rem', borderRadius: '0 0 0.375rem 0.375rem' }}>
                  {p.badge}
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.875rem' }}>
                <div>
                  <h3 style={{ fontWeight: 800, fontSize: '1.125rem', marginBottom: '0.25rem' }}>{p.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
                    <p style={{ color: '#6B7280', fontSize: '0.8125rem', margin: 0 }}>{p.spots}</p>
                    <span style={{ fontSize: '0.6875rem', color: p.availability === 'Agents + Agencies' ? '#34D399' : '#9CA3AF', backgroundColor: p.availability === 'Agents + Agencies' ? 'rgba(52,211,153,0.1)' : 'rgba(156,163,175,0.1)', padding: '0.125rem 0.5rem', borderRadius: '0.25rem', border: `1px solid ${p.availability === 'Agents + Agencies' ? 'rgba(52,211,153,0.2)' : 'rgba(156,163,175,0.15)'}` }}>{p.availability}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.75rem', fontWeight: 800, color: p.highlight ? '#60A5FA' : 'white' }}>{p.price}</span>
                  <span style={{ color: '#6B7280', fontSize: '0.8125rem', marginLeft: '0.375rem' }}>{p.period}</span>
                </div>
              </div>

              <p style={{ color: '#F3F4F6', fontSize: '0.9375rem', fontWeight: 600, lineHeight: 1.6, marginBottom: '0.625rem' }}>{p.who}</p>
              <p style={{ color: '#9CA3AF', fontSize: '0.875rem', lineHeight: 1.65, marginBottom: '1.25rem' }}>{p.lead}</p>

              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', listStyle: 'none', padding: 0, margin: 0 }}>
                {p.features.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', color: '#D1D5DB', fontSize: '0.875rem', lineHeight: 1.55 }}>
                    <Check />{f}
                  </li>
                ))}
              </ul>

              {p.note && <p style={{ marginTop: '1.25rem', color: '#6B7280', fontSize: '0.8125rem', lineHeight: 1.6 }}>{p.note}</p>}

              <a href="#contact" style={{ display: 'inline-block', marginTop: '1.5rem', backgroundColor: p.highlight ? '#2563EB' : 'transparent', border: p.highlight ? '1px solid #2563EB' : '1px solid #374151', color: p.highlight ? 'white' : '#D1D5DB', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none', padding: '0.625rem 1.25rem', borderRadius: '0.5rem' }}>
                Enquire about {p.name}
              </a>
            </div>
          ))}

          {/* Demo video add-on */}
          <div style={{ ...card, padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.875rem' }}>
              <div>
                <h3 style={{ fontWeight: 800, fontSize: '1.125rem', marginBottom: '0.25rem' }}>{DEMO_VIDEO.name}</h3>
                <span style={{ fontSize: '0.6875rem', color: '#34D399', backgroundColor: 'rgba(52,211,153,0.1)', padding: '0.125rem 0.5rem', borderRadius: '0.25rem', border: '1px solid rgba(52,211,153,0.2)' }}>{DEMO_VIDEO.availability}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white' }}>{DEMO_VIDEO.price}</span>
                <span style={{ color: '#6B7280', fontSize: '0.8125rem', marginLeft: '0.375rem' }}>{DEMO_VIDEO.period}</span>
              </div>
            </div>
            <p style={{ color: '#9CA3AF', fontSize: '0.875rem', lineHeight: 1.65, marginBottom: '1.25rem' }}>{DEMO_VIDEO.lead}</p>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', listStyle: 'none', padding: 0, margin: 0 }}>
              {DEMO_VIDEO.features.map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', color: '#D1D5DB', fontSize: '0.875rem', lineHeight: 1.55 }}>
                  <Check />{f}
                </li>
              ))}
            </ul>
            <p style={{ marginTop: '1.25rem', color: '#6B7280', fontSize: '0.8125rem' }}>{DEMO_VIDEO.standalone} without another paid product.</p>
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section style={{ backgroundColor: '#0F172A', borderTop: '1px solid #1F2937', borderBottom: '1px solid #1F2937' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '3.5rem 1.5rem' }}>
          <p style={{ ...eyebrow, marginBottom: '0.75rem' }}>Trust signals</p>
          <h2 style={{ ...h2, marginBottom: '0.75rem' }}>Three badges buyers look for</h2>
          <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '2rem' }}>Each one tells a buyer something specific about the listing in front of them.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {badgeExplainer.map(b => (
              <div key={b.name} style={{ padding: '1.5rem', border: `1px solid ${b.border}`, borderRadius: '0.875rem', backgroundColor: b.bg }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.25rem 0.625rem', borderRadius: '0.25rem', border: `1px solid ${b.border}`, marginBottom: '0.875rem' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={b.color} strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: b.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{b.name}</span>
                </div>
                <p style={{ color: '#D1D5DB', fontSize: '0.8125rem', lineHeight: 1.6, marginBottom: '0.5rem' }}>{b.description}</p>
                <p style={{ color: '#6B7280', fontSize: '0.75rem', fontStyle: 'italic' }}>{b.visual}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial policy */}
      <section style={{ maxWidth: '860px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
          <div style={{ flexShrink: 0, width: '2.5rem', height: '2.5rem', backgroundColor: '#1F2937', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          </div>
          <div>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.375rem' }}>Why a placement here is worth more than a banner elsewhere</h3>
            <p style={{ color: '#9CA3AF', fontSize: '0.875rem', lineHeight: 1.65 }}>
              Buyers trust this index because the verdicts are not for sale. That trust is the whole asset, and it is what your placement borrows: appearing beside an assessment a buyer believes is worth far more than appearing beside one they suspect was bought. Your money buys position, speed and a listing kept accurate. The credibility it sits next to is what makes those worth having.
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact">
        <div style={{ maxWidth: '640px', margin: '0 auto', padding: '2rem 1.5rem 6rem' }}>
          <p style={{ ...eyebrow, marginBottom: '0.75rem' }}>Get in touch</p>
          <h2 style={{ ...h2, marginBottom: '0.75rem' }}>Talk to us about a placement</h2>
          <p style={{ color: '#9CA3AF', fontSize: '0.9375rem', lineHeight: 1.65, marginBottom: '2.5rem' }}>
            Editorial Review and Editorial Managed are self-serve, so use the buttons above and skip this entirely. For a Featured listing, Comparison Placement, Category Sponsor or Listing Banner, tell us about your product and which placement you have in mind. We reply within one business day.
          </p>
          <AdvertiseForm />
        </div>
      </section>

    </div>
  )
}