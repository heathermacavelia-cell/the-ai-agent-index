import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Editorial Methodology — How We Research and Rank AI Agents',
  description: 'How The AI Agent Index researches, scores, and maintains AI agent listings. Our ranking criteria, editorial independence policy, and affiliate disclosure.',
  alternates: { canonical: 'https://theaiagentindex.com/methodology' },
  openGraph: {
    title: 'Editorial Methodology — The AI Agent Index',
    description: 'How we research, score, and maintain AI agent listings. Transparent ranking criteria and editorial independence policy.',
    url: 'https://theaiagentindex.com/methodology',
  },
}

const sections = [
  {
    id: 'why',
    label: '01',
    title: 'Why this page exists',
    content: `Most directories don't explain how they rank things because the answer is "whoever paid us." That's not how this works.\n\nThe AI Agent Index is built to be the most trusted, structured resource for businesses evaluating AI agents. That trust only holds if we're transparent about how listings are researched, how scores are assigned, and how paid placements are kept completely separate from editorial judgement. This page explains all of it.`,
  },
  {
    id: 'qualifies',
    label: '02',
    title: 'What qualifies as an AI agent',
    content: `Not every AI-powered tool belongs in this index. To be listed, a product must be genuinely autonomous — capable of executing multi-step workflows, making decisions, and taking actions without requiring a human to drive every step.\n\nProducts that do not qualify:\n— AI chatbots or copilots that only respond to prompts\n— AI-assisted features embedded in broader SaaS platforms with no standalone agent capability\n— Automation tools that rely entirely on rigid rule-based logic with no AI reasoning layer\n\nIf a product sits in a grey area, we err on the side of exclusion and revisit as the product matures. Quality of scope matters more than volume of listings.`,
  },
  {
    id: 'listed',
    label: '03',
    title: 'How agents get listed',
    content: `There are two routes onto the index:\n\nEditorial listings are researched independently by our team using publicly available information — product documentation, G2 reviews, company websites, GitHub repositories, and third-party coverage. These listings include editorial scores, pros, limitations, and best-for assessments.\n\nVendor-submitted listings are submitted by the vendor via our /submit page and reviewed before activation. We verify the product is real, active, and meets the autonomous agent qualification above. Vendor-submitted listings are clearly distinguished — they carry no editorial scores, pros, limitations, or ratings until independently reviewed. Vendors can claim and verify their listing to confirm the accuracy of key fields.\n\nNo listing is activated without human review.`,
  },
  {
    id: 'scoring',
    label: '04',
    title: 'How we score agents',
    content: `Editorial scores are estimates based on public signals across five criteria. Scores are not paid assessments and cannot be purchased.\n\nCapability depth — Does the agent genuinely automate complex, multi-step workflows? We look for evidence of real autonomous execution, not just AI-assisted suggestions.\n\nIntegration breadth — How well does the agent connect to tools businesses already use? Depth of native integrations matters more than a long list of Zapier connections.\n\nDeployment accessibility — Can a non-technical team realistically get this running? We assess setup complexity, documentation quality, and time-to-value based on publicly available information and user evidence.\n\nPricing transparency — Is pricing clearly stated and accessible for the target customer segment? Hidden pricing, contact-us-only models, and opaque usage limits score lower.\n\nIndependent evidence — We weight verified third-party signals: G2 reviews, documented customer case studies, and credible third-party coverage. Vanity metrics like social followers or Product Hunt upvotes are noted but not weighted heavily — they are too easily gamed to be reliable indicators of product quality.\n\nScores reflect a point-in-time assessment and are updated when material changes occur.`,
  },
  {
    id: 'verified',
    label: '05',
    title: 'What "Verified" means',
    content: `A verified badge means the vendor has claimed their listing and confirmed the accuracy of their key fields — pricing, deployment method, integrations, and product description.\n\nVerified status does not mean:\n— We have independently tested the product\n— The vendor has paid for preferential treatment\n— The editorial score has been reviewed or boosted\n\nVerification is a signal of data accuracy, not editorial endorsement.`,
  },
  {
    id: 'affiliate',
    label: '06',
    title: 'Affiliate disclosure',
    content: `Some listings on this index include affiliate links. If you click through and make a purchase, we may earn a commission at no extra cost to you.\n\nAffiliate relationships are disclosed on relevant listing pages. They have no effect on editorial scores, organic ranking position, or the content of reviews and comparisons. An agent with an affiliate link is held to exactly the same editorial standard as one without.\n\nWe only maintain affiliate relationships with products we believe are genuinely useful to the businesses this index serves.`,
  },
  {
    id: 'paid',
    label: '07',
    title: 'How paid placements work',
    content: `The index offers three paid placement products: Category Sponsorships, Featured Listings, and Comparison Placements. Every paid placement is clearly labeled — "Category Sponsor," "Sponsored," or similar — so users always know what they're looking at.\n\nPaid placement never affects:\n— A product's editorial score\n— Its position within the organic agent grid\n— The content of comparisons, verdicts, or best-for assessments\n— Whether it gets listed at all\n\nWe do not sell rankings. We do not sell "best for" labels. We do not sell editorial verdicts. Those are earned through the scoring criteria above, or they don't exist. This distinction is non-negotiable — it's the foundation the site's authority is built on.`,
  },
  {
    id: 'current',
    label: '08',
    title: 'How we keep listings current',
    content: `Stale data is a trust problem. We maintain listings through a weekly review process every Friday — checking the agent changelog for meaningful updates, flagging deprecated products, and updating pricing and feature information when changes are confirmed.\n\nEach listing shows a last verified date so you can assess how recently the information was checked. If you notice outdated information before we do, see the section below.`,
  },
  {
    id: 'disputes',
    label: '09',
    title: 'Disputes and corrections',
    content: `If your product is listed and you believe the information is inaccurate, or if you're a user who has spotted an error, contact us at hello@theaiagentindex.com with the listing URL and the specific correction.\n\nWe review all correction requests and update listings where the evidence supports a change. We do not alter editorial scores or assessments based on vendor requests alone — only on new public evidence that warrants a reassessment.`,
  },
]

export default function MethodologyPage() {
  return (
    <div style={{ backgroundColor: '#F9FAFB', minHeight: '100vh', color: '#111827' }}>

      <style>{`
        .method-nav-link { color: #6B7280; font-size: 0.8125rem; text-decoration: none; padding: 0.25rem 0.625rem; border-radius: 0.375rem; border: 1px solid #E5E7EB; white-space: nowrap; transition: color 0.15s, border-color 0.15s; background: white; }
        .method-nav-link:hover { color: #111827; border-color: #D1D5DB; }
      `}</style>

      {/* Hero */}
      <section style={{ maxWidth: '860px', margin: '0 auto', padding: '5rem 1.5rem 3rem' }}>
        <div style={{ display: 'inline-block', backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '2rem', padding: '0.25rem 0.875rem', marginBottom: '1.5rem' }}>
          <span style={{ color: '#2563EB', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Editorial Methodology</span>
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '1.25rem', color: '#111827' }}>
          How we research, score, and maintain listings
        </h1>
        <p style={{ fontSize: '1.125rem', color: '#4B5563', lineHeight: 1.7, maxWidth: '640px', marginBottom: '1rem' }}>
          Transparent criteria, independent editorial judgement, and a clear separation between paid placements and rankings. This page explains exactly how the index works.
        </p>
        <p style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>Last updated: April 2026</p>
      </section>

      {/* Quick nav */}
      <section style={{ borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '1.25rem 1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {sections.map(s => (
            <a key={s.id} href={`#${s.id}`} className="method-nav-link">{s.title}</a>
          ))}
        </div>
      </section>

      {/* Sections */}
      <section style={{ maxWidth: '860px', margin: '0 auto', padding: '4rem 1.5rem 6rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {sections.map((s, i) => (
            <div key={s.id} id={s.id} style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '2rem', paddingTop: i === 0 ? '0' : '3.5rem', paddingBottom: '3.5rem', borderBottom: i < sections.length - 1 ? '1px solid #E5E7EB' : 'none' }}>
              <div style={{ paddingTop: '0.25rem' }}>
                <span style={{ color: '#D1D5DB', fontSize: '1.5rem', fontWeight: 800, fontFamily: 'monospace' }}>{s.label}</span>
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', letterSpacing: '-0.01em', color: '#111827' }}>{s.title}</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  {s.content.split('\n\n').map((para, j) => (
                    <p key={j} style={{ color: para.startsWith('—') ? '#9CA3AF' : '#4B5563', fontSize: '0.9375rem', lineHeight: 1.75, margin: 0, paddingLeft: para.startsWith('—') ? '1rem' : '0', whiteSpace: 'pre-line' }}>
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section style={{ backgroundColor: 'white', borderTop: '1px solid #E5E7EB' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '3rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <p style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.375rem', color: '#111827' }}>Questions about a listing?</p>
            <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>Contact us at hello@theaiagentindex.com</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <a href="/advertise" style={{ padding: '0.625rem 1.25rem', backgroundColor: '#F3F4F6', color: '#374151', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', border: '1px solid #E5E7EB' }}>View advertising options</a>
            <a href="/submit" style={{ padding: '0.625rem 1.25rem', backgroundColor: '#2563EB', color: 'white', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>Submit an agent</a>
          </div>
        </div>
      </section>
    </div>
  )
}