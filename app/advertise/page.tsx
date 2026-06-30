import type { Metadata } from 'next'
import AdvertiseForm from '@/components/AdvertiseForm'
import AiCrawlerStats from '@/components/AiCrawlerStats'

export const metadata: Metadata = {
  title: 'Advertise | The AI Agent Index',
  description: 'Reach buyers evaluating AI agents. Vendor Managed listings from $9.99/mo. Featured placements, category sponsorships, and comparison placements. Early adopter pricing available now.',
  alternates: { canonical: 'https://theaiagentindex.com/advertise' },
  openGraph: {
    title: 'Advertise on The AI Agent Index',
    description: 'Reach businesses actively choosing their AI automation stack. Vendor Managed listings, featured placements, category sponsorships, and comparison placements.',
    url: 'https://theaiagentindex.com/advertise',
  },
}

const tiers = [
  {
    name: 'Vendor Managed',
    price: '$9.99',
    period: 'USD/mo',
    spots: 'Unlimited',
    description: 'The easiest way to take ownership of your listing. Your agent gets priority verification every 14 days, a Vendor Managed badge, homepage rotation in our Recently Verified section, a one-time feature in our newsletter, and your own marketing hook displayed on the homepage card. Self-serve signup, no sales call required.',
    features: [
      'Vendor Managed badge on your listing (category color-coded)',
      'Claimed and Independently Reviewed badges included',
      'Homepage rotation in the Recently Verified section with equal impression share',
      'Priority editorial verification every 14 days',
      'One-time feature in our biweekly newsletter',
      'Custom marketing hook displayed on your homepage card (editorially approved, ~150 characters)',
    ],
    highlight: false,
    note: 'Self-serve: sign up instantly with a credit card. No conversation needed.',
    badge: 'Start here',
    availability: 'Agents + Agencies',
    selfServe: true,
  },
  {
    name: 'Premium Featured Listing',
    price: '$79',
    period: 'USD/mo',
    spots: 'Limited spots',
    description: 'Permanent homepage placement in the Featured Agents section, a full-width branded banner on your listing page, and your custom marketing hook front and center. The listing that stands out from every other page on the site. Everything in Vendor Managed is included.',
    features: [
      'Everything in Vendor Managed ($9.99/mo tier) included',
      'Permanent placement in the Featured Agents section on the homepage',
      'Full-width branded banner on your listing page with logo and background branding',
      'Custom marketing hook and optional subhook on your listing page',
      'Single dominant CTA button with your chosen link and text',
      'G2 rating and pricing displayed as social proof beside CTA',
      'Standard "Visit site" button demoted to secondary styling',
      'One-time feature in our biweekly newsletter',
    ],
    highlight: true,
    note: 'Available for both agent and agency listings. Agency listings include the banner but not homepage placement.',
    badge: 'Most popular',
    availability: 'Agents + Agencies',
    selfServe: false,
  },
  {
    name: 'Comparison Placement',
    price: '$149',
    period: 'USD/mo',
    spots: 'Limited spots',
    description: 'Appear in an "Also Consider" section on comparison pages, alternatives pages, and individual agent listing pages. These are the highest-intent moments on the site, when buyers are actively choosing between tools or reading about a competitor. Everything in Vendor Managed is included.',
    features: [
      'Everything in Vendor Managed ($9.99/mo tier) included',
      '"Also Consider" placement on relevant compare pages',
      '"Also Consider" placement on relevant alternatives pages',
      '"Also Consider" placement on agent listing pages in your category',
      'Logo, rating, pricing, one-line description, and CTA',
      'You choose which comparisons and categories are most relevant',
      'One-time feature in our biweekly newsletter',
    ],
    highlight: false,
    note: null,
    badge: null,
    availability: 'Agents only',
    selfServe: false,
  },
  {
    name: 'Category Sponsor',
    price: '$249',
    period: 'USD/mo',
    spots: '1 spot per category',
    description: 'Own the category your buyers search first. Your brand appears in a full-width spotlight on the category page, right after the page title. The first thing a buyer sees when they land on that category. Everything in Vendor Managed is included.',
    features: [
      'Everything in Vendor Managed ($9.99/mo tier) included',
      'Full-width spotlight on the category page, above the agent listings',
      'Logo, description, capability tags, and CTA button',
      'Mentioned in relevant guides and comparison pages',
      'Sponsor badge on your agent listing',
      'Labeled "Category Sponsor" for full transparency',
      'One-time feature in our biweekly newsletter',
    ],
    highlight: false,
    note: '8 spots total, one per category.',
    badge: null,
    availability: 'Agents only',
    selfServe: false,
  },
  {
    name: 'Agent Listing Banner',
    price: '$349',
    period: 'USD/mo',
    spots: '1 spot per category',
    description: 'Your brand at the top of every agent listing page in your category. When a buyer reads any agent review in your category, your banner is the first thing they see. The buyer has already narrowed to a specific tool and is deep in evaluation mode. Everything in Vendor Managed is included.',
    features: [
      'Everything in Vendor Managed ($9.99/mo tier) included',
      'Horizontal banner at the top of every agent listing in the category',
      'Logo, tagline, pricing, and CTA button in one compact row',
      'Appears on 30-50+ individual agent pages per category',
      'Does not appear on your own agent listing page',
      'Labeled "Sponsored" for full transparency',
      'One-time feature in our biweekly newsletter',
    ],
    highlight: false,
    note: 'Highest impression volume. 8 spots total, one per category.',
    badge: 'Highest value',
    availability: 'Agents only',
    selfServe: false,
  },
  {
    name: 'Demo Video Add-On',
    price: '$49',
    period: 'USD/mo standalone',
    spots: '$29/mo when bundled with any paid tier',
    description: 'Embed a product demo video directly on your listing page. Video plays in the hero section where buyers make their first impression. Under 2 minutes recommended. Supports YouTube, Vimeo, and MP4.',
    features: [
      'Product demo embedded in the hero section of your listing page',
      'Click-to-play with thumbnail preview',
      'Desktop: positioned beside your listing hook. Mobile: stacks below',
      'Duration badge displayed on thumbnail',
      'Available for both agent and agency listings',
    ],
    highlight: false,
    note: '$29/mo when purchased with any paid tier. $49/mo as a standalone add-on.',
    badge: 'Add-on',
    availability: 'Agents + Agencies',
    selfServe: false,
  },
]

const reasons = [
  {
    icon: '🎯',
    title: 'Business buyers, not browsers',
    body: 'Every visitor is a business evaluating AI agents for a specific workflow. This is not general AI news traffic. These are decision-stage researchers actively comparing tools.',
  },
  {
    icon: '🤖',
    title: 'Cited by AI systems',
    body: 'Structured, machine-readable data means AI systems like ChatGPT, Claude, and Perplexity pull from this directory when recommending agents. Your listing here is a signal in the AI recommendation layer.',
  },
  {
    icon: '📊',
    title: 'Independent editorial authority',
    body: 'Rankings and verdicts are never sold. Paid placements are clearly labeled. That editorial independence is what makes the audience trust the site, and why that trust is worth advertising on.',
  },
]

const badgeExplainer = [
  {
    name: 'Independently Reviewed',
    color: '#3B82F6',
    border: 'rgba(59,130,246,0.3)',
    bg: 'rgba(59,130,246,0.08)',
    description: 'Every listing is independently reviewed by our editorial team using a structured 15-step audit process. Pricing, integrations, security certifications, and G2 data are verified against live sources. This badge appears on all listings and cannot be purchased.',
  },
  {
    name: 'Claimed',
    color: '#22C55E',
    border: 'rgba(34,197,94,0.3)',
    bg: 'rgba(34,197,94,0.08)',
    description: 'The vendor has identified themselves as the owner of this listing. Claiming is free and confirms that the company behind the product is actively aware of and engaged with their listing on this directory.',
  },
  {
    name: 'Vendor Managed',
    color: '#F59E0B',
    border: 'rgba(245,158,11,0.3)',
    bg: 'rgba(245,158,11,0.08)',
    description: 'The vendor pays to have their listing actively managed with priority verification every 14 days. Data is kept current, the listing rotates on the homepage, and the vendor controls their marketing hook. Included in all paid tiers.',
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
        <p style={{ fontSize: '1.125rem', color: '#9CA3AF', lineHeight: 1.7, maxWidth: '640px', marginBottom: '1rem' }}>
          The AI Agent Index is where buyers land when they are evaluating agents. Not browsing. Deciding. Place your product at that moment.
        </p>
        <p style={{ fontSize: '0.875rem', color: '#F59E0B', fontWeight: 600, marginBottom: '2rem' }}>
          Early adopter pricing available now. These rates are locked for founding advertisers.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a href="#tiers" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#2563EB', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.9375rem', textDecoration: 'none' }}>
            View pricing
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </a>
          <a href="#contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'transparent', color: '#9CA3AF', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.9375rem', textDecoration: 'none', border: '1px solid #374151' }}>
            Contact us
          </a>
        </div>
      </section>

      {/* AI Citation Proof */}
      <section id="ai-citations" style={{ backgroundColor: '#0F172A', borderTop: '1px solid #1F2937', borderBottom: '1px solid #1F2937' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '3.5rem 1.5rem' }}>
          <p style={{ color: '#6B7280', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Verified AI distribution</p>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>Your listings reach buyers through AI, not just search</h2>
          <p style={{ color: '#9CA3AF', fontSize: '0.9375rem', lineHeight: 1.65, marginBottom: '2.5rem', maxWidth: '640px' }}>
            When someone asks ChatGPT, Claude, or Perplexity to recommend an AI agent, this directory is one of the sources they cite. Your listing here does not just rank on Google: it gets surfaced inside AI conversations where buyers are making decisions.
          </p>

          <AiCrawlerStats />

          {/* What this means callout */}
          <div style={{ marginTop: '2rem', padding: '1.5rem', border: '1px solid rgba(37,99,235,0.2)', borderRadius: '0.875rem', background: 'rgba(37,99,235,0.04)' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#60A5FA', marginBottom: '0.5rem' }}>What this means for your listing</p>
            <p style={{ fontSize: '0.875rem', color: '#9CA3AF', lineHeight: 1.65 }}>
              Most directories are built for Google only. This one is purpose-built with JSON-LD schema, a public JSON API, an MCP server, and structured taxonomy so that AI systems can read, understand, and cite it. When a buyer asks an AI assistant to recommend tools in your category, your listing on this site is part of what that AI draws from. No other AI agent directory offers this level of AI-native distribution.
            </p>
          </div>
        </div>
      </section>

      {/* Why advertise */}
      <section style={{ maxWidth: '860px', margin: '0 auto', padding: '3.5rem 1.5rem' }}>
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
      </section>

      {/* Badge system explainer */}
      <section style={{ backgroundColor: '#0F172A', borderTop: '1px solid #1F2937', borderBottom: '1px solid #1F2937' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '3.5rem 1.5rem' }}>
          <p style={{ color: '#6B7280', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Trust badges</p>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>Three badges, three meanings</h2>
          <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '2rem' }}>Every badge on the site signals something specific. None can be faked. None are sold as endorsements.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {badgeExplainer.map(b => (
              <div key={b.name} style={{ padding: '1.5rem', border: `1px solid ${b.border}`, borderRadius: '0.875rem', backgroundColor: b.bg }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.25rem 0.625rem', borderRadius: '0.25rem', border: `1px solid ${b.border}`, marginBottom: '0.875rem' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={b.color} strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: b.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{b.name}</span>
                </div>
                <p style={{ color: '#D1D5DB', fontSize: '0.8125rem', lineHeight: 1.6 }}>{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section id="tiers" style={{ maxWidth: '860px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <p style={{ color: '#6B7280', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Early adopter pricing</p>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>Six ways to be featured</h2>
        <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>All placements are clearly labeled. Editorial ratings and rankings are never influenced by sponsorship.</p>
        <p style={{ color: '#F59E0B', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '2.5rem' }}>Founding advertiser rates. These prices are locked for early partners and will increase as traffic scales.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {tiers.map(tier => (
            <div key={tier.name} style={{ backgroundColor: tier.highlight ? '#0F172A' : '#080D16', border: `1px solid ${tier.highlight ? '#2563EB' : '#1F2937'}`, borderRadius: '0.875rem', padding: '2rem', position: 'relative' }}>
              {tier.badge && (
                <div style={{ position: 'absolute', top: '-1px', left: '1.5rem', backgroundColor: tier.badge === 'Highest value' ? '#2563EB' : tier.badge === 'Most popular' ? '#F97316' : tier.badge === 'Start here' ? '#22C55E' : '#6B7280', color: 'white', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '0.25rem 0.625rem', borderRadius: '0 0 0.375rem 0.375rem' }}>
                  {tier.badge}
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontWeight: 800, fontSize: '1.125rem', marginBottom: '0.25rem' }}>{tier.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
                    <p style={{ color: '#6B7280', fontSize: '0.8125rem', margin: 0 }}>{tier.spots}</p>
                    <span style={{ fontSize: '0.6875rem', color: tier.availability === 'Agents + Agencies' ? '#34D399' : '#9CA3AF', backgroundColor: tier.availability === 'Agents + Agencies' ? 'rgba(52,211,153,0.1)' : 'rgba(156,163,175,0.1)', padding: '0.125rem 0.5rem', borderRadius: '0.25rem', border: `1px solid ${tier.availability === 'Agents + Agencies' ? 'rgba(52,211,153,0.2)' : 'rgba(156,163,175,0.15)'}` }}>{tier.availability}</span>
                    {tier.selfServe && (
                      <span style={{ fontSize: '0.6875rem', color: '#F59E0B', backgroundColor: 'rgba(245,158,11,0.1)', padding: '0.125rem 0.5rem', borderRadius: '0.25rem', border: '1px solid rgba(245,158,11,0.2)' }}>Self-serve</span>
                    )}
                  </div>
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
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
            <div style={{ flexShrink: 0, width: '2.5rem', height: '2.5rem', backgroundColor: '#1F2937', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            </div>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.375rem' }}>Our editorial policy</h3>
              <p style={{ color: '#9CA3AF', fontSize: '0.875rem', lineHeight: 1.65 }}>
                Paid placements are always clearly labeled. Rankings, verdicts, and editorial ratings are never sold: those are earned through independent review only. The Vendor Managed badge signals active listing management, not editorial endorsement. Sponsorship buys visibility at the right moment, not a manufactured recommendation. That distinction is what makes the audience trust the site, and what makes advertising on it worth paying for.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact">
        <div style={{ maxWidth: '640px', margin: '0 auto', padding: '4rem 1.5rem 6rem' }}>
          <p style={{ color: '#6B7280', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Get in touch</p>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>Interested in sponsorship?</h2>
          <p style={{ color: '#9CA3AF', fontSize: '0.9375rem', lineHeight: 1.65, marginBottom: '2.5rem' }}>
            For Vendor Managed ($9.99/mo), sign up directly using the self-serve link above. For Premium Featured, Comparison Placement, Category Sponsor, or Agent Listing Banner, tell us about your product and which placement interests you. We will follow up within one business day.
          </p>
          <AdvertiseForm />
        </div>
      </section>

    </div>
  )
}