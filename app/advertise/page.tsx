import type { Metadata } from 'next'
import AdvertiseForm from '@/components/AdvertiseForm'

export const metadata: Metadata = {
  title: 'Advertise | The AI Agent Index',
  description: 'Sponsor a category or place your AI agent in front of buyers actively evaluating automation tools. Featured listings, premium banners, category sponsorships, and comparison placements available.',
  alternates: { canonical: 'https://theaiagentindex.com/advertise' },
  openGraph: {
    title: 'Advertise on The AI Agent Index',
    description: 'Reach businesses actively choosing their AI automation stack. Featured listings, premium banners, category sponsorships, and comparison placements.',
    url: 'https://theaiagentindex.com/advertise',
  },
}

const tiers = [
  {
    name: 'Agent Listing Banner',
    price: '$599',
    period: 'USD/mo',
    spots: '1 spot per category',
    description: 'Your brand at the top of every agent listing page in your category. When a buyer reads any agent review in your category, your banner is the first thing they see. The highest-intent placement on the site: the buyer has already narrowed to a specific tool and is deep in evaluation mode.',
    features: [
      'Horizontal banner at the top of every agent listing in the category',
      'Logo, tagline, pricing, and CTA button in one compact row',
      'Appears on 30-50+ individual agent pages per category',
      'Does not appear on your own agent listing page',
      'Labeled "Sponsored" for full transparency',
    ],
    highlight: true,
    note: 'Highest impression volume. 8 spots total, one per category.',
    badge: 'Highest value',
    availability: 'Agents only',
  },
  {
    name: 'Category Sponsor',
    price: '$499',
    period: 'USD/mo',
    spots: '1 spot per category',
    description: 'Own the category your buyers search first. Your brand appears in a full-width spotlight on the category page, right after the page title. The first thing a buyer sees when they land on that category.',
    features: [
      'Full-width spotlight on the category page, above the agent listings',
      'Logo, description, capability tags, and CTA button',
      'Mentioned in relevant guides and comparison pages',
      'Sponsor badge on your agent listing',
      'Labeled "Category Sponsor" for full transparency',
    ],
    highlight: false,
    note: '8 spots total, one per category.',
    badge: null,
    availability: 'Agents only',
  },
  {
    name: 'Comparison Placement',
    price: '$249',
    period: 'USD/mo',
    spots: 'Limited spots',
    description: 'Appear in an "Also Consider" section on comparison pages, alternatives pages, and individual agent listing pages. The highest-intent moments on the site, when buyers are actively choosing between tools or reading about a competitor.',
    features: [
      '"Also Consider" placement on relevant compare pages',
      '"Also Consider" placement on relevant alternatives pages',
      '"Also Consider" placement on agent listing pages in your category',
      'Logo, rating, pricing, one-line description, and CTA',
      'You choose which comparisons and categories are most relevant',
    ],
    highlight: false,
    note: null,
    badge: null,
    availability: 'Agents only',
  },
  {
    name: 'Premium Featured Listing',
    price: '$149',
    period: 'USD/mo',
    spots: 'Limited spots',
    description: 'A full-width branded banner on your agent or agency listing page. Custom marketing hook, your logo, social proof, and a single dominant CTA designed to convert comparison-intent visitors. Everything in the Featured Listing, plus the banner that makes your listing stand out from every other page on the site.',
    features: [
      'Everything in the Featured Listing ($49/mo tier)',
      'Full-width branded banner with your logo and background branding',
      'Custom marketing hook and optional subhook',
      'Single dominant CTA button with your chosen link and text',
      'G2 rating and pricing displayed as social proof beside CTA',
      'Standard "Visit site" button demoted to secondary styling',
      'Optional: add a product demo video for $79/mo (save $20 vs standalone)',
    ],
    highlight: false,
    note: 'Available for both agent and agency listings. Agency listings include the banner but not homepage placement.',
    badge: 'Most popular',
    availability: 'Agents + Agencies',
  },
  {
    name: 'Featured Listing',
    price: '$49',
    period: 'USD/mo',
    spots: 'Limited spots',
    description: 'The simplest way to stand out. A Featured badge and pinned homepage placement that keeps your agent visible at every stage of a buyer\'s research journey.',
    features: [
      'Featured badge on your agent card sitewide',
      'Pinned in the featured agents section on the homepage',
      'Highlighted card treatment on category pages',
      'Placement only: editorial rating and ranking are never influenced',
    ],
    highlight: false,
    note: null,
    badge: null,
    availability: 'Agents only',
  },
  {
    name: 'Demo Video Add-On',
    price: '$99',
    period: 'USD/mo standalone',
    spots: '$79/mo when bundled with Premium Featured Listing',
    description: 'Embed a product demo video directly on your listing page. Video plays in the hero section where buyers make their first impression. Under 2 minutes recommended. Supports YouTube, Vimeo, and MP4.',
    features: [
      'Product demo embedded in the hero section of your listing page',
      'Click-to-play with thumbnail preview',
      'Desktop: positioned beside your listing hook. Mobile: stacks below',
      'Duration badge displayed on thumbnail',
      'Available for both agent and agency listings',
    ],
    highlight: false,
    note: '$79/mo when purchased with a Premium Featured Listing. $99/mo as a standalone add-on.',
    badge: 'Add-on',
    availability: 'Agents + Agencies',
  },
]

const reasons = [
  {
    icon: '🎯',
    title: 'Business buyers, not browsers',
    body: 'Every visitor is a business evaluating AI agents for a specific workflow. This is not general AI news traffic. It\'s decision-stage research.',
  },
  {
    icon: '🤖',
    title: 'Cited by AI systems',
    body: 'Structured, machine-readable data means AI systems like ChatGPT, Claude, and Perplexity pull from us when recommending agents. Your listing here is a signal in the AI recommendation layer.',
  },
  {
    icon: '📊',
    title: 'Independent editorial authority',
    body: 'We never sell rankings or verdicts. Paid placements are clearly labeled. That\'s what makes the audience trust the site, and why that trust is worth advertising on.',
  },
]

const aiPlatforms = [
  { name: 'ChatGPT', domain: 'chatgpt.com', sessions: 111 },
  { name: 'Perplexity', domain: 'perplexity.ai', sessions: 60 },
  { name: 'Claude', domain: 'claude.ai', sessions: 52 },
  { name: 'Gemini', domain: 'gemini.google.com', sessions: 21 },
  { name: 'Copilot', domain: 'copilot.microsoft.com', sessions: 14 },
  { name: 'NotebookLM', domain: 'notebooklm.google.com', sessions: 4 },
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
          The AI Agent Index is where buyers land when they're evaluating agents — not browsing, deciding. Place your product at that moment.
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

      {/* AI Citation Proof */}
      <section id="ai-citations" style={{ maxWidth: '860px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <p style={{ color: '#6B7280', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Verified AI distribution</p>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>Your listings reach buyers through AI, not just search</h2>
        <p style={{ color: '#9CA3AF', fontSize: '0.9375rem', lineHeight: 1.65, marginBottom: '2.5rem', maxWidth: '640px' }}>
          When someone asks ChatGPT, Claude, or Perplexity to recommend an AI agent, this directory is one of the sources they cite. That means your listing here doesn't just rank on Google: it gets surfaced inside AI conversations where buyers are making decisions.
        </p>

        {/* Three proof points */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          <div style={{ backgroundColor: '#0F172A', border: '1px solid #1F2937', borderRadius: '0.875rem', padding: '1.5rem' }}>
            <p style={{ fontSize: '2.25rem', fontWeight: 800, color: '#60A5FA', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>6</p>
            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#F9FAFB', marginBottom: '0.375rem' }}>AI platforms citing this directory</p>
            <p style={{ fontSize: '0.8125rem', color: '#6B7280', lineHeight: 1.5 }}>ChatGPT, Claude, Perplexity, Gemini, Copilot, and NotebookLM all send measurable referral traffic.</p>
          </div>
          <div style={{ backgroundColor: '#0F172A', border: '1px solid #1F2937', borderRadius: '0.875rem', padding: '1.5rem' }}>
            <p style={{ fontSize: '2.25rem', fontWeight: 800, color: '#60A5FA', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>2.3%</p>
            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#F9FAFB', marginBottom: '0.375rem' }}>AI referral share of total traffic</p>
            <p style={{ fontSize: '0.8125rem', color: '#6B7280', lineHeight: 1.5 }}>The cross-industry average is 1.08% (Conductor, 2026). We more than double that at 2.3% within our first three months.</p>
          </div>
          <div style={{ backgroundColor: '#0F172A', border: '1px solid #1F2937', borderRadius: '0.875rem', padding: '1.5rem' }}>
            <p style={{ fontSize: '2.25rem', fontWeight: 800, color: '#60A5FA', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>5x</p>
            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#F9FAFB', marginBottom: '0.375rem' }}>Higher conversion from AI referrals</p>
            <p style={{ fontSize: '0.8125rem', color: '#6B7280', lineHeight: 1.5 }}>Industry research shows AI-referred visitors convert at 14.2% vs 2.8% for organic search (Frase/Semrush, 2026).</p>
          </div>
        </div>

        {/* Platform breakdown */}
        <div style={{ backgroundColor: '#0F172A', border: '1px solid #1F2937', borderRadius: '0.875rem', padding: '1.75rem' }}>
          <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#9CA3AF', marginBottom: '1.25rem' }}>Referral sessions by platform (GA4, March 25 – June 30, 2026)</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '1rem' }}>
            {aiPlatforms.map(p => (
              <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <img
                  src={'https://www.google.com/s2/favicons?domain=' + p.domain + '&sz=32'}
                  alt={p.name}
                  width={18}
                  height={18}
                  style={{ borderRadius: '3px', opacity: 0.9 }}
                />
                <div>
                  <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#F9FAFB', margin: 0 }}>{p.name}</p>
                  <p style={{ fontSize: '0.6875rem', color: '#6B7280', margin: 0 }}>{p.sessions} sessions</p>
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '0.75rem', color: '#4B5563', marginTop: '1.25rem', lineHeight: 1.5 }}>
            Measured via Google Analytics 4. Actual AI-referred traffic is likely higher: free-tier ChatGPT users and AI Overviews do not send referrer data. Updated monthly.
          </p>
        </div>

        {/* Why this matters for advertisers */}
        <div style={{ marginTop: '2rem', padding: '1.5rem', border: '1px solid rgba(37,99,235,0.2)', borderRadius: '0.875rem', background: 'rgba(37,99,235,0.04)' }}>
          <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#60A5FA', marginBottom: '0.5rem' }}>What this means for your listing</p>
          <p style={{ fontSize: '0.875rem', color: '#9CA3AF', lineHeight: 1.65 }}>
            Most directories are built for Google only. This one is purpose-built with JSON-LD schema, a public JSON API, an MCP server, and structured taxonomy so that AI systems can read, understand, and cite it. When a buyer asks an AI assistant to recommend tools in your category, your listing on this site is part of what that AI draws from. No other AI agent directory offers this level of AI-native distribution.
          </p>
        </div>
      </section>

      {/* Tiers */}
      <section style={{ maxWidth: '860px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <p style={{ color: '#6B7280', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Sponsorship options</p>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>Six ways to be featured</h2>
        <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '2.5rem' }}>All placements are clearly labeled. Editorial ratings and rankings are never influenced by sponsorship.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {tiers.map(tier => (
            <div key={tier.name} style={{ backgroundColor: tier.highlight ? '#0F172A' : '#080D16', border: `1px solid ${tier.highlight ? '#2563EB' : '#1F2937'}`, borderRadius: '0.875rem', padding: '2rem', position: 'relative' }}>
              {tier.badge && (
                <div style={{ position: 'absolute', top: '-1px', left: '1.5rem', backgroundColor: tier.badge === 'Highest value' ? '#2563EB' : tier.badge === 'Most popular' ? '#F97316' : '#6B7280', color: 'white', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '0.25rem 0.625rem', borderRadius: '0 0 0.375rem 0.375rem' }}>
                  {tier.badge}
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontWeight: 800, fontSize: '1.125rem', marginBottom: '0.25rem' }}>{tier.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
                    <p style={{ color: '#6B7280', fontSize: '0.8125rem', margin: 0 }}>{tier.spots}</p>
                    <span style={{ fontSize: '0.6875rem', color: tier.availability === 'Agents + Agencies' ? '#34D399' : '#9CA3AF', backgroundColor: tier.availability === 'Agents + Agencies' ? 'rgba(52,211,153,0.1)' : 'rgba(156,163,175,0.1)', padding: '0.125rem 0.5rem', borderRadius: '0.25rem', border: `1px solid ${tier.availability === 'Agents + Agencies' ? 'rgba(52,211,153,0.2)' : 'rgba(156,163,175,0.15)'}` }}>{tier.availability}</span>
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
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '2.5rem 1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
          <div style={{ flexShrink: 0, width: '2.5rem', height: '2.5rem', backgroundColor: '#1F2937', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          </div>
          <div>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.375rem' }}>Our editorial policy</h3>
            <p style={{ color: '#9CA3AF', fontSize: '0.875rem', lineHeight: 1.65 }}>
              Paid placements are always clearly labeled. We never sell rankings, verdicts, or "best for" labels: those are earned through editorial review only. Sponsorship buys visibility at the right moment, not a manufactured recommendation. That distinction is what makes our audience trust the site, and what makes advertising on it worth paying for.
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