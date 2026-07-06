import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How We Research & Rank AI Agents',
  description: 'How The AI Agent Index researches, scores, and maintains AI agent listings. Transparent criteria, independent editorial judgment, and clear separation between paid placements and rankings.',
  alternates: { canonical: 'https://theaiagentindex.com/methodology' },
}

const sections = [
  'Why this page exists',
  'What qualifies as an AI agent',
  'How agents get listed',
  'How we score agents',
  'How community reviews affect ratings',
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
        Transparent criteria, independent editorial judgment, and a clear separation between paid placements and rankings. This page explains exactly how the index works.
      </p>
      <p style={{ fontSize: '0.875rem', color: '#9CA3AF', marginBottom: '3rem' }}>
        Last updated: July 2026
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
            <p>Most directories do not explain how they rank things because the answer is &quot;whoever paid us.&quot; That is not how this works.</p>
            <p>The AI Agent Index is built to be the most trusted, structured resource for businesses evaluating AI agents. That trust only holds if we are transparent about how listings are researched, how scores are assigned, and how paid placements are kept completely separate from editorial judgment. This page explains all of it.</p>
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
                Score = (AutCap x 0.35) + (IntDepth x 0.25) + (PriceTrans x 0.05) + (IndEvid x 0.30) + (SetupAcc x 0.05)
              </code>
              <p style={{ fontSize: '0.8125rem', color: '#3B82F6', margin: 0 }}>Each criterion is scored 1 to 5. Maximum score: 5.0.</p>
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
                  <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: '0.25rem 0 0' }}>Native connections to tools businesses already use. Depth over breadth. MCP (Model Context Protocol) compatibility is weighted as a strong integration signal.</p>
                </div>
                <div style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[
                    ['5', 'Deep native integrations with 5+ major platforms plus MCP server or equivalent protocol, API-first, bidirectional sync'],
                    ['4', 'Strong native integrations, 3 to 5 major platforms, reliable sync'],
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
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563EB', backgroundColor: '#EFF6FF', padding: '0.2rem 0.5rem', borderRadius: '0.25rem' }}>5%</span>
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: '0.25rem 0 0' }}>Can evaluators see real costs before talking to sales?</p>
                </div>
                <div style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[
                    ['5', 'Full public pricing, all tiers clearly stated, no sales conversation needed for any plan'],
                    ['4', 'Three or more tiers fully public, only enterprise or custom tier requires sales'],
                    ['3', 'Partial pricing, some tiers visible but significant details or tiers hidden'],
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

              {/* Independent evidence with institutional signals */}
              <div style={{ border: '1px solid #E5E7EB', borderRadius: '0.625rem', overflow: 'hidden' }}>
                <div style={{ backgroundColor: '#F9FAFB', padding: '0.875rem 1.25rem', borderBottom: '1px solid #E5E7EB' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, color: '#111827', fontSize: '0.9375rem' }}>Independent evidence</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563EB', backgroundColor: '#EFF6FF', padding: '0.2rem 0.5rem', borderRadius: '0.25rem' }}>30%</span>
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: '0.25rem 0 0' }}>Third-party validation beyond vendor claims. G2, analyst coverage, GitHub activity, Product Hunt signal, funding, documented deployments, and community reviews on The AI Agent Index. For specialized professional tools, institutional adoption signals also apply.</p>
                </div>
                <div style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[
                    ['5', '200+ verified reviews at 4.0+ on G2, Capterra, or Gartner Peer Insights, OR GitHub 100k+ stars, OR PH Product of the Year with 50+ verified reviews at 4.5+, OR Gartner Magic Quadrant Leader, OR 20+ individually named institutional customers confirmed in official press materials'],
                    ['4', '50 to 199 reviews at 4.0+ on G2/Capterra/Gartner, Gartner MQ Leader or Challenger, GitHub 50k+ stars, 25+ reviews AND 200+ Product Hunt upvotes, $500M+ institutional funding, 10+ individually named institutional customers confirmed in official press, OR 5+ community reviews on The AI Agent Index'],
                    ['3', 'G2 profile with under 25 reviews at 4.0+, Product Hunt 50 to 200 upvotes, GitHub 10k to 50k stars, $100M to $499M in confirmed funding, 3 to 9 individually named Fortune 500, government agency, or Tier-1 academic institution customers confirmed in official press, OR 1 to 4 community reviews on The AI Agent Index'],
                    ['2', 'Under 10 reviews across all platforms, Product Hunt under 50 upvotes, GitHub 500 to 10k stars, OR 1 to 2 individually named institutional customers confirmed in official press materials'],
                    ['1', 'No independent evidence found across G2, Capterra, Gartner Peer Insights, Product Hunt, GitHub, Trustpilot, and The AI Agent Index, and no named institutional customers'],
                  ].map(([score, desc]) => (
                    <div key={score} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8125rem' }}>
                      <span style={{ fontWeight: 700, color: '#111827', flexShrink: 0, width: '1rem' }}>{score}</span>
                      <span style={{ color: '#374151' }}>{desc}</span>
                    </div>
                  ))}
                </div>
                {/* Institutional signals callout */}
                <div style={{ padding: '0 1.25rem 1.25rem' }}>
                  <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '0.5rem', padding: '0.875rem 1rem' }}>
                    <p style={{ fontSize: '0.8125rem', color: '#92400E', fontWeight: 600, marginBottom: '0.375rem' }}>Note: institutional signals for specialized professional tools</p>
                    <p style={{ fontSize: '0.8125rem', color: '#78350F', lineHeight: 1.6, margin: 0 }}>For life sciences AI, legal AI, academic research platforms, and government-facing products, public review platforms structurally under-represent real adoption. Enterprise pharma teams, research institutions, government agencies, and major law firms operate under procurement constraints and NDAs that prevent public vendor reviews. For these tools, named customers confirmed in official vendor press releases or case studies count as qualifying evidence, but only after all standard signals (G2, Capterra, Gartner, Product Hunt, GitHub, Trustpilot) have been checked. Qualifying institutional categories: Fortune 500 companies, government agencies (FDA, NIH, EMA, NHS, etc.), Tier-1 research universities (top 50 globally by research output), AmLaw 100 law firms, and top 20 global financial institutions. Vendor claims of customer counts without individual names do not qualify on their own.</p>
                  </div>
                </div>
              </div>

              <div style={{ border: '1px solid #E5E7EB', borderRadius: '0.625rem', overflow: 'hidden' }}>
                <div style={{ backgroundColor: '#F9FAFB', padding: '0.875rem 1.25rem', borderBottom: '1px solid #E5E7EB' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, color: '#111827', fontSize: '0.9375rem' }}>Setup accessibility</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563EB', backgroundColor: '#EFF6FF', padding: '0.2rem 0.5rem', borderRadius: '0.25rem' }}>5%</span>
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: '0.25rem 0 0' }}>Time and technical skill required to reach first value.</p>
                </div>
                <div style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[
                    ['5', 'Self-serve free trial, no-code setup, under 1 hour to first result'],
                    ['4', 'Self-serve signup, moderate configuration, under 1 day typical'],
                    ['3', 'Some technical skill required, 1 to 5 days typical setup time'],
                    ['2', 'Technical team needed, 1 to 4 weeks typical implementation'],
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
                  ['4.5 to 5.0', 'Exceptional', 'Category-defining, independently verified at scale'],
                  ['4.0 to 4.4', 'Strong', 'Well-evidenced, reliable, broadly capable'],
                  ['3.5 to 3.9', 'Solid', 'Capable with some limitations or evidence gaps'],
                  ['3.0 to 3.4', 'Adequate', 'Functional but notable gaps in capability or evidence'],
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

        {/* 05 - Community reviews */}
        <section id="s5">
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>05</p>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>How community reviews affect ratings</h2>
          <div style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p>Every agent listing page includes a community review section where users can rate and comment on tools they have used. Community reviews submitted on The AI Agent Index are treated as independent evidence and directly influence the displayed rating.</p>
            <p>The impact scales with review volume:</p>

            <div style={{ border: '1px solid #E5E7EB', borderRadius: '0.625rem', overflow: 'hidden' }}>
              <div style={{ backgroundColor: '#F9FAFB', padding: '0.875rem 1.25rem', borderBottom: '1px solid #E5E7EB' }}>
                <span style={{ fontWeight: 700, color: '#111827', fontSize: '0.9375rem' }}>Community review thresholds</span>
              </div>
              <div style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  ['0 reviews', 'Editorial score only. If the tool lacks independent evidence from any source, it displays "On Our Radar" instead of a numeric score.'],
                  ['1 to 4 reviews', 'The Independent Evidence sub-score receives a floor of 3 (up from 1). The editorial rating recalculates with this higher sub-score. The numeric rating becomes visible, replacing "On Our Radar." The displayed score is editorial only.'],
                  ['5 to 25 reviews', 'The Independent Evidence sub-score receives a floor of 4. The displayed rating becomes a 50/50 blend of the recalculated editorial score and the community review average.'],
                  ['26+ reviews', 'The Independent Evidence sub-score receives a floor of 4. The displayed rating becomes a 40/60 blend: 40% recalculated editorial score, 60% community review average.'],
                ].map(([threshold, desc]) => (
                  <div key={threshold} style={{ display: 'flex', gap: '1rem', fontSize: '0.8125rem', alignItems: 'flex-start' }}>
                    <span style={{ fontWeight: 700, color: '#111827', flexShrink: 0, width: '7rem' }}>{threshold}</span>
                    <span style={{ color: '#374151', lineHeight: 1.6 }}>{desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <p>Community reviews can only raise the Independent Evidence sub-score, never lower it. If external signals such as G2 reviews or GitHub stars already place the sub-score higher than the community review floor, the higher value applies.</p>
            <p>This system ensures that newer tools are not permanently penalized for lacking reviews on platforms like G2 or Capterra. A handful of genuine user reviews on The AI Agent Index is enough to move a listing out of &quot;On Our Radar&quot; and display a competitive score. At the same time, the editorial component anchors the rating so it cannot be manipulated by a small number of extreme ratings.</p>
          </div>
        </section>

        {/* 06 */}
        <section id="s6">
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>06</p>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>How we prevent fake or hallucinated listings</h2>
          <div style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p>AI agent directories face a specific risk: AI systems can generate plausible-sounding but non-existent products. Every listing on this index goes through a minimum six-step verification before activation:</p>
            <ol style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Company website is live, accessible, and the product is generally available (not waitlist-only)</li>
              <li>Public pricing page exists and is viewable without a login or demo request</li>
              <li>The product is discoverable on G2, Product Hunt, or GitHub with at least one independent signal</li>
              <li>The domain resolves to a real product (not a landing page or coming-soon page)</li>
              <li>MCP compatibility is verified against official company documentation only (community builds do not count)</li>
              <li>All data fields are sourced from the company&apos;s own documentation, not inferred or assumed</li>
            </ol>
            <p>Products that fail any of these checks are excluded until they meet the bar. If a listed product is later found to have been deactivated, acquired, or substantially changed, it is flagged for review and updated or removed within seven days.</p>
          </div>
        </section>

        {/* 07 */}
        <section id="s7">
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>07</p>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>What &quot;Verified&quot; means</h2>
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

        {/* 08 */}
        <section id="s8">
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>08</p>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>Affiliate disclosure</h2>
          <div style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p>Some listings on this index include affiliate links. If you click through and make a purchase, we may earn a commission at no extra cost to you.</p>
            <p>Affiliate relationships are disclosed on relevant listing pages. They have no effect on editorial scores, organic ranking position, or the content of reviews and comparisons. An agent with an affiliate link is held to exactly the same editorial standard as one without.</p>
            <p>We only maintain affiliate relationships with products we believe are genuinely useful to the businesses this index serves.</p>
          </div>
        </section>

        {/* 09 */}
        <section id="s9">
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>09</p>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>How paid placements work</h2>
          <div style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p>The index offers four paid placement products. Every paid placement is clearly labeled so users always know what they are looking at.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ border: '1px solid #E5E7EB', borderRadius: '0.625rem', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
                  <p style={{ fontWeight: 700, color: '#111827', margin: 0 }}>Vendor Managed</p>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', backgroundColor: '#ECFDF5', padding: '0.2rem 0.5rem', borderRadius: '0.25rem' }}>$9.99/mo</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.7 }}>Self-serve listing management for vendors who want to take ownership of their presence on the index. Includes a Featured badge, homepage rotation in the Recently Verified section, priority editorial re-verification every 14 days (instead of the standard 30-day cycle), a custom marketing hook on the homepage card, and a one-time feature in our newsletter. No sales call required. This is the fastest way for a vendor to ensure their listing stays accurate and visible. Editorial scores remain fully independent and are not influenced by Vendor Managed status.</p>
              </div>

              <div style={{ border: '1px solid #E5E7EB', borderRadius: '0.625rem', padding: '1.25rem' }}>
                <p style={{ fontWeight: 700, color: '#111827', marginBottom: '0.375rem' }}>Premium Featured Listing</p>
                <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.7, marginBottom: '0.75rem' }}>Permanent homepage placement in the Featured Agents section with a full-width editorial banner on the listing page. The banner includes an editorial characterization: a short, specific description of what the tool is best known for, written by our editorial team based on independent research.</p>
                <div style={{ backgroundColor: '#FEF9EC', border: '1px solid #FDE68A', borderRadius: '0.5rem', padding: '0.875rem 1rem' }}>
                  <p style={{ fontSize: '0.8125rem', color: '#92400E', fontWeight: 600, marginBottom: '0.25rem' }}>Important: how the &quot;known for&quot; characterization works</p>
                  <p style={{ fontSize: '0.8125rem', color: '#78350F', lineHeight: 1.6, margin: 0 }}>The editorial characterization (for example: &quot;Multichannel outbound with hyper-personalization&quot;) is written by our editorial team based on public evidence. It describes what the tool is genuinely best known for in its category. It is not supplied by the vendor, it does not claim the tool is the best overall, and it is subject to the same editorial standards as any other content on this site. Payment for a Featured Listing does not influence the characterization that appears.</p>
                </div>
              </div>

              <div style={{ border: '1px solid #E5E7EB', borderRadius: '0.625rem', padding: '1.25rem' }}>
                <p style={{ fontWeight: 700, color: '#111827', marginBottom: '0.375rem' }}>Category Sponsorship</p>
                <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.7 }}>Full-width spotlight above the category agent grid, clearly labeled &quot;Category Sponsor.&quot; One sponsor per category. Does not affect the listing&apos;s position within the organic grid below.</p>
              </div>

              <div style={{ border: '1px solid #E5E7EB', borderRadius: '0.625rem', padding: '1.25rem' }}>
                <p style={{ fontWeight: 700, color: '#111827', marginBottom: '0.375rem' }}>Comparison Placement</p>
                <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.7 }}>&quot;Also Consider&quot; placement on relevant compare and alternatives pages, labeled &quot;Sponsored.&quot; Does not affect the editorial verdicts or rankings on those pages.</p>
              </div>
            </div>

            <p>Paid placement never affects:</p>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <li>A product&apos;s editorial score</li>
              <li>Its organic position within the agent grid (below any featured placement)</li>
              <li>The content of comparisons, verdicts, or best-for assessments</li>
              <li>Whether it gets listed at all</li>
            </ul>
            <p>We do not sell rankings. We do not sell editorial verdicts. Those are earned through the scoring criteria above, or they do not exist.</p>
          </div>
        </section>

        {/* 10 */}
        <section id="s10">
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>10</p>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>How we keep listings current</h2>
          <div style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p>Stale data is a trust problem. We maintain listings through a continuous re-audit cycle. Vendor Managed listings receive priority re-verification every 14 days. All other listings are re-verified on a 30-day cycle. Re-audits check pricing, feature changes, G2 review counts, security certifications, and product positioning against live vendor sources.</p>
            <p>Each listing shows a last verified date so you can assess how recently the information was checked. Vendors who want their listing re-verified more frequently can sign up for the <Link href="/advertise" style={{ color: '#2563EB', textDecoration: 'none' }}>Vendor Managed tier</Link> to move to the 14-day priority cycle. If you notice outdated information before we do, see the section below.</p>
          </div>
        </section>

        {/* 11 */}
        <section id="s11">
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>11</p>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>Disputes and corrections</h2>
          <div style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p>If your product is listed and you believe the information is inaccurate, or if you are a user who has spotted an error, contact us at <a href="mailto:hello@theaiagentindex.com" style={{ color: '#2563EB', textDecoration: 'none' }}>hello@theaiagentindex.com</a> with the listing URL and the specific correction.</p>
            <p>We review all correction requests and update listings where the evidence supports a change. We do not alter editorial scores or assessments based on vendor requests alone: only on new public evidence that warrants a reassessment.</p>
          </div>
        </section>

      </div>

      {/* Footer CTA */}
      <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #E5E7EB', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <a href="mailto:hello@theaiagentindex.com" style={{ fontSize: '0.875rem', color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Questions about a listing? Email us</a>
        <Link href="/advertise" style={{ fontSize: '0.875rem', color: '#6B7280', textDecoration: 'none' }}>View advertising options</Link>
        <Link href="/submit" style={{ fontSize: '0.875rem', color: '#6B7280', textDecoration: 'none' }}>Submit an agent</Link>
      </div>
    </main>
  )
}