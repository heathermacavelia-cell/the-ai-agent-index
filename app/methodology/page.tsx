import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Editorial Methodology — How We Research and Rank AI Agents',
  description: 'How The AI Agent Index researches, scores, and maintains AI agent listings. Transparent criteria, independent editorial judgement, and clear separation between paid placements and rankings.',
  alternates: { canonical: 'https://theaiagentindex.com/methodology' },
}

const sections = [
  'Why this page exists',
  'What qualifies as an AI agent',
  'How agents get listed',
  'How we score agents',
  'How we prevent fake or hallucinated listings',
  'What "Verified" means',
  'Affiliate disclosure',
  'How paid placements work',
  'How we keep listings current',
  'Disputes and corrections',
]

export default function MethodologyPage() {
  return (
    <main style={{ maxWidth: '760px', margin: '0 auto', padding: '4rem 1.5rem 6rem' }}>
      <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
        Editorial Methodology
      </p>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', marginBottom: '0.75rem', lineHeight: 1.2 }}>
        How we research, score, and maintain listings
      </h1>
      <p style={{ fontSize: '1rem', color: '#6B7280', lineHeight: 1.7, marginBottom: '0.5rem' }}>
        Transparent criteria, independent editorial judgement, and a clear separation between paid placements and rankings. This page explains exactly how the index works.
      </p>
      <p style={{ fontSize: '0.875rem', color: '#9CA3AF', marginBottom: '3rem' }}>
        Last updated: May 2026
      </p>

      {/* Table of contents */}
      <nav style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '3rem' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.875rem' }}>On this page</p>
        <ol style={{ margin: 0, padding: '0 0 0 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          {sections.map((s, i) => (
            <li key={i} style={{ fontSize: '0.875rem' }}>
              <a href={'#s' + (i + 1)} style={{ color: '#2563EB', textDecoration: 'none' }}>
                {String(i + 1).padStart(2, '0')} {s}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>

        {/* 01 */}
        <section id="s1">
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>01</p>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>Why this page exists</h2>
          <div style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p>Most directories do not explain how they rank things because the answer is "whoever paid us." That is not how this works.</p>
            <p>The AI Agent Index is built to be the most trusted, structured resource for businesses evaluating AI agents. That trust only holds if we are transparent about how listings are researched, how scores are assigned, and how paid placements are kept completely separate from editorial judgement. This page explains all of it.</p>
          </div>
        </section>

        {/* 02 */}
        <section id="s2">
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>02</p>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>What qualifies as an AI agent</h2>
          <div style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p>Not every AI-powered tool belongs in this index. To be listed, a product must be genuinely autonomous: capable of executing multi-step workflows, making decisions, and taking actions without requiring a human to drive every step.</p>
            <p>Products that do not qualify:</p>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <li>AI chatbots or copilots that only respond to prompts</li>
              <li>AI-assisted features embedded in broader SaaS platforms with no standalone agent capability</li>
              <li>Automation tools that rely entirely on rigid rule-based logic with no AI reasoning layer</li>
            </ul>
            <p>If a product sits in a grey area, we err on the side of exclusion and revisit as the product matures. Quality of scope matters more than volume of listings.</p>
          </div>
        </section>

        {/* 03 */}
        <section id="s3">
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>03</p>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>How agents get listed</h2>
          <div style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p>There are two routes onto the index:</p>
            <p><strong>Editorial listings</strong> are researched independently using publicly available information: product documentation, G2 reviews, company websites, GitHub repositories, and third-party coverage. These listings include editorial scores, pros, limitations, and best-for assessments.</p>
            <p><strong>Vendor-submitted listings</strong> are submitted by the vendor via our <Link href="/submit" style={{ color: '#2563EB', textDecoration: 'none' }}>/submit</Link> page and reviewed before activation. We verify the product is real, active, and meets the autonomous agent qualification above. Vendor-submitted listings carry no editorial scores, pros, limitations, or ratings until independently reviewed.</p>
            <p>No listing is activated without human review.</p>
          </div>
        </section>

        {/* 04 */}
        <section id="s4">
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>04</p>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>How we score agents</h2>
          <div style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <p>Editorial scores are calculated using a fixed weighted formula across five criteria. Scores are not paid assessments and cannot be purchased. The same formula applies to every listing.</p>

            {/* Formula box */}
            <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '0.75rem', padding: '1.5rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>Scoring formula</p>
              <code style={{ fontSize: '0.9375rem', color: '#1E40AF', fontFamily: 'monospace', display: 'block', marginBottom: '1rem', lineHeight: 1.6 }}>
                Score = (AutCap × 0.35) + (IntDepth × 0.25) + (PriceTrans × 0.15) + (IndEvid × 0.15) + (SetupAcc × 0.10)
              </code>
              <p style={{ fontSize: '0.8125rem', color: '#3B82F6', margin: 0 }}>Each criterion is scored 1–5. Maximum score: 5.0.</p>
            </div>

            {/* Criteria table */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              <div style={{ border: '1px solid #E5E7EB', borderRadius: '0.625rem', overflow: 'hidden' }}>
                <div style={{ backgroundColor: '#F9FAFB', padding: '0.875rem 1.25rem', borderBottom: '1px solid #E5E7EB' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, color: '#111827', fontSize: '0.9375rem' }}>Autonomous capability</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563EB', backgroundColor: '#EFF6FF', padding: '0.2rem 0.5rem', borderRadius: '0.25rem' }}>35%</span>
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: '0.25rem 0 0' }}>Does it execute multi-step tasks autonomously, without constant human input?</p>
                </div>
                <div style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[
                    ['5', 'Fully autonomous multi-step execution, handles edge cases, proven at scale'],
                    ['4', 'Autonomous with optional human checkpoints, strong execution record'],
                    ['3', 'Partially autonomous, requires per-workflow configuration or approval'],
                    ['2', 'Primarily AI-assisted with human driving each major decision'],
                    ['1', 'AI-enhanced but essentially manual, agent label is marketing'],
                  ].map(([score, desc]) => (
                    <div key={score} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8125rem' }}>
                      <span style={{ fontWeight: 700, color: '#111827', flexShrink: 0, width: '1rem' }}>{score}</span>
                      <span style={{ color: '#374151' }}>{desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ border: '1px solid #E5E7EB', borderRadius: '0.625rem', overflow: 'hidden' }}>
                <div style={{ backgroundColor: '#F9FAFB', padding: '0.875rem 1.25rem', borderBottom: '1px solid #E5E7EB' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, color: '#111827', fontSize: '0.9375rem' }}>Integration depth</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563EB', backgroundColor: '#EFF6FF', padding: '0.2rem 0.5rem', borderRadius: '0.25rem' }}>25%</span>
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: '0.25rem 0 0' }}>Native connections to tools businesses already use. Depth over breadth.</p>
                </div>
                <div style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[
                    ['5', 'Deep native integrations with 5+ major platforms, API-first, bidirectional sync'],
                    ['4', 'Strong native integrations, 3-5 major platforms, reliable sync'],
                    ['3', 'Adequate integrations, mix of native and Zapier/Make connections'],
                    ['2', 'Limited native integrations, primarily webhook or API-only'],
                    ['1', 'Minimal integrations, mostly manual data handling'],
                  ].map(([score, desc]) => (
                    <div key={score} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8125rem' }}>
                      <span style={{ fontWeight: 700, color: '#111827', flexShrink: 0, width: '1rem' }}>{score}</span>
                      <span style={{ color: '#374151' }}>{desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ border: '1px solid #E5E7EB', borderRadius: '0.625rem', overflow: 'hidden' }}>
                <div style={{ backgroundColor: '#F9FAFB', padding: '0.875rem 1.25rem', borderBottom: '1px solid #E5E7EB' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, color: '#111827', fontSize: '0.9375rem' }}>Pricing transparency</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563EB', backgroundColor: '#EFF6FF', padding: '0.2rem 0.5rem', borderRadius: '0.25rem' }}>15%</span>
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: '0.25rem 0 0' }}>Can evaluators see real costs before talking to sales?</p>
                </div>
                <div style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[
                    ['5', 'Full public pricing, all tiers clearly stated, no hidden fees'],
                    ['4', 'Most pricing public, some enterprise custom tiers'],
                    ['3', 'Partial pricing, mix of public rates and contact-sales'],
                    ['2', 'Minimal public pricing, primarily sales-led'],
                    ['1', 'Fully opaque, zero public pricing information'],
                  ].map(([score, desc]) => (
                    <div key={score} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8125rem' }}>
                      <span style={{ fontWeight: 700, color: '#111827', flexShrink: 0, width: '1rem' }}>{score}</span>
                      <span style={{ color: '#374151' }}>{desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ border: '1px solid #E5E7EB', borderRadius: '0.625rem', overflow: 'hidden' }}>
                <div style={{ backgroundColor: '#F9FAFB', padding: '0.875rem 1.25rem', borderBottom: '1px solid #E5E7EB' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, color: '#111827', fontSize: '0.9375rem' }}>Independent evidence</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563EB', backgroundColor: '#EFF6FF', padding: '0.2rem 0.5rem', borderRadius: '0.25rem' }}>15%</span>
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: '0.25rem 0 0' }}>Third-party validation beyond vendor claims. G2, analyst coverage, GitHub activity, documented deployments.</p>
                </div>
                <div style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[
                    ['5', '200+ verified G2 reviews at 4.0+, significant analyst coverage, proven enterprise deployments'],
                    ['4', '50-200 G2 reviews at 3.8+, credible third-party coverage or strong GitHub signal'],
                    ['3', '10-50 reviews, some independent validation, limited analyst coverage'],
                    ['2', 'Minimal external validation, primarily vendor-sourced evidence'],
                    ['1', 'No independent evidence found beyond the vendor\'s own marketing'],
                  ].map(([score, desc]) => (
                    <div key={score} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8125rem' }}>
                      <span style={{ fontWeight: 700, color: '#111827', flexShrink: 0, width: '1rem' }}>{score}</span>
                      <span style={{ color: '#374151' }}>{desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ border: '1px solid #E5E7EB', borderRadius: '0.625rem', overflow: 'hidden' }}>
                <div style={{ backgroundColor: '#F9FAFB', padding: '0.875rem 1.25rem', borderBottom: '1px solid #E5E7EB' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, color: '#111827', fontSize: '0.9375rem' }}>Setup accessibility</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563EB', backgroundColor: '#EFF6FF', padding: '0.2rem 0.5rem', borderRadius: '0.25rem' }}>10%</span>
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: '0.25rem 0 0' }}>Time and technical skill required to reach first value.</p>
                </div>
                <div style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[
                    ['5', 'Self-serve free trial, no-code setup, under 1 hour to first result'],
                    ['4', 'Self-serve signup, moderate configuration, under 1 day typical'],
                    ['3', 'Some technical skill required, 1-5 days typical setup time'],
                    ['2', 'Technical team needed, 1-4 weeks typical implementation'],
                    ['1', 'Complex implementation project, months to full deployment'],
                  ].map(([score, desc]) => (
                    <div key={score} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8125rem' }}>
                      <span style={{ fontWeight: 700, color: '#111827', flexShrink: 0, width: '1rem' }}>{score}</span>
                      <span style={{ color: '#374151' }}>{desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Score interpretation */}
            <div style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.25rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.875rem' }}>Score interpretation</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  ['4.5 – 5.0', 'Exceptional', 'Category-defining, independently verified at scale'],
                  ['4.0 – 4.4', 'Strong', 'Well-evidenced, reliable, broadly capable'],
                  ['3.5 – 3.9', 'Solid', 'Capable with some limitations or evidence gaps'],
                  ['3.0 – 3.4', 'Adequate', 'Functional but notable gaps in capability or evidence'],
                  ['Below 3.0', 'Limited', 'Early stage, thin evidence, or significant limitations'],
                ].map(([range, label, desc]) => (
                  <div key={range} style={{ display: 'flex', gap: '1rem', fontSize: '0.8125rem', alignItems: 'flex-start' }}>
                    <span style={{ fontFamily: 'monospace', color: '#111827', fontWeight: 600, flexShrink: 0, width: '6rem' }}>{range}</span>
                    <span style={{ fontWeight: 600, color: '#111827', flexShrink: 0, width: '5rem' }}>{label}</span>
                    <span style={{ color: '#6B7280' }}>{desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <p>Scores reflect a point-in-time assessment based on public evidence and are updated when material changes occur. Every score is calculated using the formula above with sub-scores documented internally. Scores cannot be purchased or influenced by vendor relationships.</p>
          </div>
        </section>

        {/* 05 */}
        <section id="s5">
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>05</p>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>How we prevent fake or hallucinated listings</h2>
          <div style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p>AI agent directories face a specific risk: AI systems can generate plausible-sounding but non-existent products. Every listing on this index goes through a minimum six-step verification before activation:</p>
            <ol style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Company website is live, accessible, and the product is generally available (not waitlist-only)</li>
              <li>Public pricing page exists and is viewable without a login or demo request</li>
              <li>The product is discoverable on G2, Product Hunt, or GitHub with at least one independent signal</li>
              <li>The domain resolves to a real product (not a landing page or coming-soon page)</li>
              <li>MCP compatibility is verified against official company documentation only (community builds do not count)</li>
              <li>All data fields are sourced from the company's own documentation, not inferred or assumed</li>
            </ol>
            <p>Products that fail any of these checks are excluded until they meet the bar. If a listed product is later found to have been deactivated, acquired, or substantially changed, it is flagged for review and updated or removed within seven days.</p>
          </div>
        </section>

        {/* 06 */}
        <section id="s6">
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>06</p>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>What "Verified" means</h2>
          <div style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p>A verified badge means the vendor has claimed their listing and confirmed the accuracy of their key fields: pricing, deployment method, integrations, and product description.</p>
            <p>Verified status does not mean:</p>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <li>We have independently tested the product</li>
              <li>The vendor has paid for preferential treatment</li>
              <li>The editorial score has been reviewed or boosted</li>
            </ul>
            <p>Verification is a signal of data accuracy, not editorial endorsement.</p>
          </div>
        </section>

        {/* 07 */}
        <section id="s7">
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>07</p>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>Affiliate disclosure</h2>
          <div style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p>Some listings on this index include affiliate links. If you click through and make a purchase, we may earn a commission at no extra cost to you.</p>
            <p>Affiliate relationships are disclosed on relevant listing pages. They have no effect on editorial scores, organic ranking position, or the content of reviews and comparisons. An agent with an affiliate link is held to exactly the same editorial standard as one without.</p>
            <p>We only maintain affiliate relationships with products we believe are genuinely useful to the businesses this index serves.</p>
          </div>
        </section>

        {/* 08 */}
        <section id="s8">
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>08</p>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>How paid placements work</h2>
          <div style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p>The index offers three paid placement products. Every paid placement is clearly labeled so users always know what they are looking at.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ border: '1px solid #E5E7EB', borderRadius: '0.625rem', padding: '1.25rem' }}>
                <p style={{ fontWeight: 700, color: '#111827', marginBottom: '0.375rem' }}>Featured Listing</p>
                <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.7, marginBottom: '0.75rem' }}>Featured listings appear at the top of their category page by default and carry a "Featured Listing" banner on their individual listing page. The banner includes an editorial characterization: a short, specific description of what the tool is best known for, written by our editorial team based on independent research.</p>
                <div style={{ backgroundColor: '#FEF9EC', border: '1px solid #FDE68A', borderRadius: '0.5rem', padding: '0.875rem 1rem' }}>
                  <p style={{ fontSize: '0.8125rem', color: '#92400E', fontWeight: 600, marginBottom: '0.25rem' }}>Important: how the "known for" characterization works</p>
                  <p style={{ fontSize: '0.8125rem', color: '#78350F', lineHeight: 1.6, margin: 0 }}>The editorial characterization (for example: "Multichannel outbound with hyper-personalisation") is written by our editorial team based on public evidence. It describes what the tool is genuinely best known for in its category. It is not supplied by the vendor, it does not claim the tool is the best overall, and it is subject to the same editorial standards as any other content on this site. Payment for a Featured Listing does not influence the characterization that appears.</p>
                </div>
              </div>

              <div style={{ border: '1px solid #E5E7EB', borderRadius: '0.625rem', padding: '1.25rem' }}>
                <p style={{ fontWeight: 700, color: '#111827', marginBottom: '0.375rem' }}>Category Sponsorship</p>
                <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.7 }}>Full-width spotlight above the category agent grid, clearly labeled "Category Sponsor." One sponsor per category. Does not affect the listing's position within the organic grid below.</p>
              </div>

              <div style={{ border: '1px solid #E5E7EB', borderRadius: '0.625rem', padding: '1.25rem' }}>
                <p style={{ fontWeight: 700, color: '#111827', marginBottom: '0.375rem' }}>Comparison Placement</p>
                <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.7 }}>"Also Consider" placement on relevant compare and alternatives pages, labeled "Sponsored." Does not affect the editorial verdicts or rankings on those pages.</p>
              </div>
            </div>

            <p>Paid placement never affects:</p>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <li>A product's editorial score</li>
              <li>Its organic position within the agent grid (below any featured placement)</li>
              <li>The content of comparisons, verdicts, or best-for assessments</li>
              <li>Whether it gets listed at all</li>
            </ul>
            <p>We do not sell rankings. We do not sell editorial verdicts. Those are earned through the scoring criteria above, or they do not exist.</p>
          </div>
        </section>

        {/* 09 */}
        <section id="s9">
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>09</p>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>How we keep listings current</h2>
          <div style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p>Stale data is a trust problem. We maintain listings through a weekly review process every Friday: checking agent changelogs for meaningful updates, flagging deprecated products, and updating pricing and feature information when changes are confirmed.</p>
            <p>Each listing shows a last verified date so you can assess how recently the information was checked. If you notice outdated information before we do, see the section below.</p>
          </div>
        </section>

        {/* 10 */}
        <section id="s10">
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>10</p>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>Disputes and corrections</h2>
          <div style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p>If your product is listed and you believe the information is inaccurate, or if you are a user who has spotted an error, contact us at <a href="mailto:hello@theaiagentindex.com" style={{ color: '#2563EB', textDecoration: 'none' }}>hello@theaiagentindex.com</a> with the listing URL and the specific correction.</p>
            <p>We review all correction requests and update listings where the evidence supports a change. We do not alter editorial scores or assessments based on vendor requests alone: only on new public evidence that warrants a reassessment.</p>
          </div>
        </section>

      </div>

      {/* Footer CTA */}
      <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #E5E7EB', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <a href="mailto:hello@theaiagentindex.com" style={{ fontSize: '0.875rem', color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Questions about a listing? Email us →</a>
        <Link href="/advertise" style={{ fontSize: '0.875rem', color: '#6B7280', textDecoration: 'none' }}>View advertising options →</Link>
        <Link href="/submit" style={{ fontSize: '0.875rem', color: '#6B7280', textDecoration: 'none' }}>Submit an agent →</Link>
      </div>
    </main>
  )
}