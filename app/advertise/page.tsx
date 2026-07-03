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
    description: 'The easiest way to take ownership of your listing. Your agent gets priority verification every 14 days, a Featured badge, homepage rotation in our Recently Verified section, a one-time feature in our newsletter, and your own marketing hook displayed on the homepage card. Self-serve signup, no sales call required.',
    features: [
      'Featured badge (green pill) on your agent listing page',
      'Category pill on homepage Recently Verified cards',
      'Claimed checkmark and Independently Reviewed badge included',
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
    description: 'The full visibility package for vendors who want to appear where buyers are actively comparing tools. Includes placement on an alternatives page of your choice, a custom comparison page we write editorially, "Also Consider" placement on competitor listings, and a full-width banner with custom CTA on your own listing. Everything in Vendor Managed is included.',
    features: [
      'Everything in Vendor Managed ($9.99/mo tier) included',
      'Placement on 1 alternatives page of your choice with a positioning snippet',
      '1 custom comparison page written by our editorial team (you choose the matchup)',
      '"Also Consider" placement on up to 3 competitor agent listings of your choice',
      'Full-width branded banner with custom CTA on your listing page',
      '14-day re-audit cycle: your listing is Chrome-verified against your live site every two weeks',
      'One-time feature in our biweekly newsletter',
    ],
    highlight: false,
    note: 'You choose which alternatives page, comparison matchup, and competitor listings are most relevant to your positioning.',
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
]

export default function AdvertisePage() {
  return (
    <div style={{ color: '#F9FAFB', minHeight: '100vh' }}>

      {/* Hero */}
      <section style={{ padding: '5rem 1.5rem 3rem', textAlign: 'center' }}>
        <p style={{ color: '#6B7280', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>Advertising &amp; Sponsorship</p>
        <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15, maxWidth: '720px', margin: '0 auto 1rem' }}>
          Reach businesses actively choosing their AI automation stack
        </h1>
        <p style={{ color: '#9CA3AF', fontSize: '1.0625rem', lineHeight: 1.6, maxWidth: '560px', margin: '0 auto 2rem' }}>
          The AI Agent Index is where buyers land when they are evaluating agents. Not browsing. Deciding. Place your product at that moment.
        </p>
        <p style={{ color: '#D97706', fontSize: '0.875rem', fontWeight: 500, marginBottom: '2rem' }}>
          Early adopter pricing available now. These rates are locked for founding advertisers.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#pricing" style={{ background: '#2563EB', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>View pricing</a>
          <a href="#contact" style={{ border: '1px solid #374151', color: '#D1D5DB', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>Contact us</a>
        </div>
      </section>

      {/* AI Distribution */}
      <section style={{ padding: '3rem 1.5rem 4rem' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <p style={{ color: '#6B7280', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Verified AI Distribution</p>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>Your listings reach buyers through AI, not just search</h2>
          <p style={{ color: '#9CA3AF', fontSize: '0.9375rem', lineHeight: 1.65, maxWidth: '640px', marginBottom: '2.5rem' }}>
            When someone asks ChatGPT, Claude, or Perplexity to recommend an AI agent, this directory is one of the sources they cite. Your listing here does not just rank on Google: it gets surfaced inside AI conversations where buyers are making decisions.
          </p>
          <AiCrawlerStats />
        </div>
      </section>

      {/* Why Advertise */}
      <section style={{ padding: '3rem 1.5rem 4rem' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <p style={{ color: '#6B7280', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Why advertise here</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginTop: '1.5rem' }}>
            {[
              { icon: '🎯', title: 'Business buyers, not browsers', desc: 'Every visitor is a business evaluating AI agents for a specific workflow. This is not general AI news traffic. These are decision-stage researchers actively comparing tools.' },
              { icon: '🤖', title: 'Cited by AI systems', desc: 'Structured, machine-readable data means AI systems like ChatGPT, Claude, and Perplexity pull from this directory when recommending agents. Your listing here is a signal in the AI recommendation layer.' },
              { icon: '📊', title: 'Independent editorial authority', desc: 'Rankings and verdicts are never sold. Paid placements are clearly labeled. That editorial independence is what makes the audience trust the site, and why that trust is worth advertising on.' },
            ].map((item) => (
              <div key={item.title} style={{ background: '#111827', border: '1px solid #1F2937', borderRadius: '0.75rem', padding: '1.5rem' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{item.icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>{item.title}</h3>
                <p style={{ color: '#9CA3AF', fontSize: '0.875rem', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Badge Explainer */}
      <section style={{ padding: '3rem 1.5rem 4rem' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <p style={{ color: '#6B7280', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Trust Badges</p>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '2rem' }}>Three signals, three meanings</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {[
              {
                name: 'INDEPENDENTLY REVIEWED',
                color: '#3B82F6',
                bgColor: 'rgba(59, 130, 246, 0.1)',
                borderColor: 'rgba(59, 130, 246, 0.3)',
                desc: 'Every listing is independently reviewed by our editorial team using a structured 15-step audit process. Pricing, integrations, security certifications, and G2 data are verified against live sources. This badge appears on all listings and cannot be purchased.',
                visual: 'Blue pill on every listing',
              },
              {
                name: 'CLAIMED',
                color: '#3B82F6',
                bgColor: 'rgba(59, 130, 246, 0.1)',
                borderColor: 'rgba(59, 130, 246, 0.3)',
                desc: 'The vendor has identified themselves as the owner of this listing. Claiming is free and confirms that the company behind the product is actively aware of and engaged with their listing. Displayed as a blue checkmark on the developer byline, not a pill badge.',
                visual: 'Blue checkmark on developer byline',
              },
              {
                name: 'FEATURED',
                color: '#10B981',
                bgColor: 'rgba(16, 185, 129, 0.1)',
                borderColor: 'rgba(16, 185, 129, 0.3)',
                desc: 'The vendor pays to have their listing actively managed with priority verification every 14 days. Data is kept current, the listing appears in homepage rotation, and the vendor controls their marketing hook. Included in all paid tiers. Displayed as a green pill on the agent listing page.',
                visual: 'Green pill on agent listing',
              },
            ].map((badge) => (
              <div key={badge.name} style={{ background: '#111827', border: '1px solid #1F2937', borderRadius: '0.75rem', padding: '1.5rem' }}>
                <div style={{ display: 'inline-block', background: badge.bgColor, border: `1px solid ${badge.borderColor}`, color: badge.color, fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.06em', padding: '0.25rem 0.625rem', borderRadius: '9999px', marginBottom: '1rem' }}>{badge.name}</div>
                <p style={{ color: '#9CA3AF', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>{badge.desc}</p>
                <p style={{ color: '#6B7280', fontSize: '0.75rem', fontStyle: 'italic' }}>{badge.visual}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section id="pricing" style={{ padding: '3rem 1.5rem 4rem' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <p style={{ color: '#6B7280', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Early Adopter Pricing</p>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>Six ways to be featured</h2>
          <p style={{ color: '#9CA3AF', fontSize: '0.9375rem', lineHeight: 1.65, marginBottom: '0.5rem' }}>All placements are clearly labeled. Editorial ratings and rankings are never influenced by sponsorship.</p>
          <p style={{ color: '#D97706', fontSize: '0.8125rem', marginBottom: '2.5rem' }}>Founding advertiser rates. These prices are locked for early partners and will increase as traffic scales.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {tiers.map((tier) => (
              <div key={tier.name} style={{
                background: '#111827',
                border: tier.highlight ? '2px solid #2563EB' : '1px solid #1F2937',
                borderRadius: '0.75rem',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
              }}>
                {/* Badge tab */}
                {tier.badge && (
                  <div style={{
                    position: 'absolute',
                    top: '-0.625rem',
                    left: '1.25rem',
                    background: tier.badge === 'Start here' ? '#059669' : tier.badge === 'Most popular' ? '#2563EB' : '#D97706',
                    color: '#fff',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    padding: '0.1875rem 0.625rem',
                    borderRadius: '0.25rem',
                  }}>{tier.badge}</div>
                )}

                {/* Header */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '1.0625rem' }}>{tier.name}</h3>
                    <span style={{ color: '#6B7280', fontSize: '0.75rem' }}>{tier.spots}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ color: '#6B7280', fontSize: '0.75rem' }}>{tier.availability}</span>
                    {tier.selfServe && (
                      <span style={{ background: 'rgba(234, 179, 8, 0.15)', color: '#EAB308', fontSize: '0.625rem', fontWeight: 600, padding: '0.125rem 0.5rem', borderRadius: '9999px' }}>Self-serve</span>
                    )}
                  </div>
                  <div style={{ marginTop: '0.75rem' }}>
                    <span style={{ fontSize: '2rem', fontWeight: 800 }}>{tier.price}</span>
                    <span style={{ color: '#6B7280', fontSize: '0.8125rem', marginLeft: '0.25rem' }}>{tier.period}</span>
                  </div>
                </div>

                {/* Description */}
                <p style={{ color: '#9CA3AF', fontSize: '0.8125rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>{tier.description}</p>

                {/* Features */}
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.25rem', flex: 1 }}>
                  {tier.features.map((f) => (
                    <li key={f} style={{ color: '#D1D5DB', fontSize: '0.8125rem', lineHeight: 1.5, padding: '0.375rem 0', borderBottom: '1px solid rgba(31, 41, 55, 0.5)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <span style={{ color: '#10B981', flexShrink: 0, marginTop: '0.125rem' }}>&#10003;</span>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Note */}
                {tier.note && (
                  <p style={{ color: '#6B7280', fontSize: '0.75rem', fontStyle: 'italic', marginBottom: '1rem' }}>{tier.note}</p>
                )}

                {/* CTA */}
                {tier.selfServe ? (
                  <a
                    href="https://buy.stripe.com/5kQ6oH9cy4w57i36L7djO00"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      background: '#059669',
                      color: '#fff',
                      padding: '0.625rem 1rem',
                      borderRadius: '0.5rem',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      textDecoration: 'none',
                    }}
                  >
                    Sign up now
                  </a>
                ) : (
                  <a
                    href="#contact"
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      border: '1px solid #374151',
                      color: '#D1D5DB',
                      padding: '0.625rem 1rem',
                      borderRadius: '0.5rem',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      textDecoration: 'none',
                    }}
                  >
                    Get started
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Demo Video Add-On */}
          <div style={{ marginTop: '1.5rem', background: '#111827', border: '1px solid #1F2937', borderRadius: '0.75rem', padding: '1.75rem', position: 'relative' }}>
            <div style={{
              position: 'absolute',
              top: '-0.625rem',
              left: '1.25rem',
              background: '#6B7280',
              color: '#fff',
              fontSize: '0.6875rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              padding: '0.1875rem 0.625rem',
              borderRadius: '0.25rem',
            }}>Add-on</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: '2rem' }}>
              <div style={{ flex: '1 1 320px' }}>
                <h3 style={{ fontWeight: 700, fontSize: '1.0625rem', marginBottom: '0.25rem' }}>Demo Video Add-On</h3>
                <p style={{ color: '#6B7280', fontSize: '0.75rem', marginBottom: '0.75rem' }}>$29/mo when bundled with any paid tier</p>
                <div style={{ marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 800 }}>$49</span>
                  <span style={{ color: '#6B7280', fontSize: '0.8125rem', marginLeft: '0.25rem' }}>USD/mo standalone</span>
                </div>
                <p style={{ color: '#9CA3AF', fontSize: '0.8125rem', lineHeight: 1.6 }}>
                  Embed a product demo video directly on your listing page. Video plays in the hero section where buyers make their first impression. Under 2 minutes recommended. Supports YouTube, Vimeo, and MP4.
                </p>
              </div>
              <div style={{ flex: '1 1 280px' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {[
                    'Product demo embedded in the hero section of your listing page',
                    'Click-to-play with thumbnail preview',
                    'Desktop: positioned beside your listing hook. Mobile: stacks below',
                    'Duration badge displayed on thumbnail',
                    'Available for both agent and agency listings',
                  ].map((f) => (
                    <li key={f} style={{ color: '#D1D5DB', fontSize: '0.8125rem', lineHeight: 1.5, padding: '0.375rem 0', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <span style={{ color: '#10B981', flexShrink: 0, marginTop: '0.125rem' }}>&#10003;</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <p style={{ color: '#6B7280', fontSize: '0.75rem', fontStyle: 'italic', marginTop: '0.75rem' }}>$29/mo when purchased with any paid tier. $49/mo as a standalone add-on.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Policy */}
      <section style={{ padding: '2rem 1.5rem 3rem' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div style={{ background: '#111827', border: '1px solid #1F2937', borderRadius: '0.75rem', padding: '1.5rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: '0.75rem' }}>Our editorial policy</h3>
            <p style={{ color: '#9CA3AF', fontSize: '0.8125rem', lineHeight: 1.65 }}>
              Paid placements are always clearly labeled. Rankings, verdicts, and editorial ratings are never sold: those are earned through independent review only. The Featured badge signals active listing management, not editorial endorsement. Sponsorship buys visibility at the right moment, not a manufactured recommendation. That distinction is what makes the audience trust the site, and what makes advertising on it worth paying for.
            </p>
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