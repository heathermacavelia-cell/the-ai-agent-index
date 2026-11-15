import type { Metadata } from 'next'
import { PLACEMENTS, FEATURED_ANNUAL_PAYMENT_LINK, FEATURED_ANNUAL_PRICE, FEATURED_FOUNDING_NOTE } from '@/lib/vendorPlans'

// EXAMPLE Featured Listing report (Heather 2026-11-15). Every name and number on
// this page is MADE UP to show the layout; it is not any vendor's data. Built from
// the Granola report shape (claude/featured-report-template.md) with the vendor,
// competitors, questions and figures replaced. noindex so search engines and AI
// systems do not pick up sample figures as facts about the site. Not in sitemap.ts.
export const metadata: Metadata = {
  title: 'Example Featured Listing report',
  description: 'What a Featured Listing vendor receives after every 14-day re-check. Sample data.',
  alternates: { canonical: 'https://theaiagentindex.com/advertise/sample-report' },
  robots: { index: false, follow: true },
}

const featured = PLACEMENTS[0]

const serif = 'var(--font-serif), Georgia, serif'
const section: React.CSSProperties = { padding: '2rem 0 0.5rem', breakInside: 'avoid' }
const eyebrow: React.CSSProperties = { fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#2563EB', margin: '0 0 0.375rem' }
const h2: React.CSSProperties = { fontFamily: serif, fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: '0 0 0.5rem' }
const body: React.CSSProperties = { color: '#374151', fontSize: '0.9375rem', lineHeight: 1.6, margin: '0 0 0.875rem' }
const small: React.CSSProperties = { color: '#6B7280', fontSize: '0.8125rem', lineHeight: 1.55, margin: '0.75rem 0 0' }
const table: React.CSSProperties = { border: '1px solid #E5E7EB', borderRadius: '0.625rem', overflow: 'hidden' }
const th: React.CSSProperties = { padding: '0.625rem 1rem', backgroundColor: '#F9FAFB', fontSize: '0.75rem', fontWeight: 600, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.05em' }
const td: React.CSSProperties = { padding: '0.75rem 1rem', borderTop: '1px solid #E5E7EB', fontSize: '0.875rem', color: '#111827' }
const num: React.CSSProperties = { textAlign: 'right', fontWeight: 600, whiteSpace: 'nowrap' }

const glance = [
  { n: '640', label: 'Microsoft Copilot answers that cited your pages in the last 14 days', accent: true },
  { n: '31', label: 'times Google AI Overviews and AI Mode linked your pages, last 28 days', accent: true },
  { n: '219', label: 'reads of your pages by AI assistants (ChatGPT, Claude, Perplexity and others), last 30 days', accent: true },
  { n: '5', label: 'changes made to your listing at this re-check', accent: false },
]

const questions = [
  { q: '"example agent vs competitor a for small sales teams"', page: 'Example Agent vs Competitor A', n: 182 },
  { q: '"does example agent integrate with hubspot and salesforce"', page: 'Your listing', n: 147 },
  { q: '"example agent pricing per seat annual"', page: 'Your listing', n: 121 },
  { q: '"example agent soc 2 data residency comparison"', page: 'Example Agent vs Competitor B', n: 64 },
]

const pages = [
  { page: 'Your listing', ai: 82, people: 14 },
  { page: 'Comparisons: Example Agent vs Competitor A, Competitor B and 6 more', ai: 96, people: 22 },
  { page: 'Alternatives: Example Agent alternatives, plus a pick on two competitors’ alternatives pages', ai: 41, people: 9 },
]

const category = [
  { name: 'Example Agent', n: 82, you: true },
  { name: 'Competitor A', n: 64 },
  { name: 'Competitor B', n: 57 },
  { name: 'Competitor C', n: 49 },
  { name: 'Competitor D', n: 33 },
]

export default function SampleReportPage() {
  const max = Math.max(...category.map(c => c.n))
  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '2rem 1.5rem 5rem' }}>
      <div role="note" style={{ backgroundColor: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: '0.625rem', padding: '0.875rem 1.125rem', marginBottom: '1.5rem' }}>
        <p style={{ margin: 0, fontSize: '0.875rem', color: '#78350F', lineHeight: 1.6 }}>
          <strong>Example report with sample data.</strong> &ldquo;Example Agent&rdquo;, its competitors, the questions and every number below are made up to show what the report looks like. Your report uses your own listing and your own numbers.
        </p>
      </div>

      <div style={{ backgroundColor: '#030712', color: '#F9FAFB', borderRadius: '0.875rem', padding: '2rem 2rem 1.75rem' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#93C5FD', margin: '0 0 0.5rem' }}>Featured Listing report &middot; Example</p>
        <h1 style={{ fontFamily: serif, fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', lineHeight: 1.1, fontWeight: 700, margin: '0 0 0.625rem', letterSpacing: '-0.015em' }}>Example Agent on The AI Agent Index</h1>
        <p style={{ fontSize: '0.9375rem', color: '#D1D5DB', margin: 0 }}>What a Featured vendor receives after every 14-day re-check, by email.</p>
      </div>

      <div style={section}>
        <h2 style={h2}>At a glance</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.75rem' }}>
          {glance.map(g => (
            <div key={g.label} style={{ border: '1px solid #E5E7EB', borderRadius: '0.625rem', padding: '1rem' }}>
              <p style={{ margin: '0 0 0.25rem', fontSize: '1.875rem', fontWeight: 700, color: g.accent ? '#2563EB' : '#111827' }}>{g.n}</p>
              <p style={{ margin: 0, fontSize: '0.8125rem', color: '#4B5563', lineHeight: 1.45 }}>{g.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={section}>
        <p style={eyebrow}>1 &middot; The headline</p>
        <h2 style={h2}>What AI assistants answered using your pages</h2>
        <p style={body}>The questions buyers asked when an AI assistant used one of our pages about you to answer. Only the site that was cited can see these, so your own analytics cannot show them to you.</p>
        <div style={table}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 0.6fr) 96px' }}>
            <div style={th}>Question asked</div><div style={th}>Our page used</div><div style={{ ...th, textAlign: 'right' }}>Answers</div>
            {questions.map(q => (
              <div key={q.q} style={{ display: 'contents' }}>
                <div style={td}>{q.q}</div><div style={{ ...td, color: '#4B5563' }}>{q.page}</div><div style={{ ...td, ...num }}>{q.n}</div>
              </div>
            ))}
          </div>
        </div>
        <p style={small}>Copilot cited our pages about Example Agent 640 times in 14 days; these four questions carry most of it. Sources: Bing Webmaster Tools AI Performance for our site (Microsoft Copilot and partners, a sample); Google Search Console, Generative AI report; AI reads from our server logs.</p>
      </div>

      <div style={section}>
        <p style={eyebrow}>2 &middot; Coverage</p>
        <h2 style={h2}>Where you appear</h2>
        <p style={body}>Every page on the site that names you, with how often AI assistants and people read it in the last 30 days.</p>
        <div style={table}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 96px 80px' }}>
            <div style={th}>Page</div><div style={{ ...th, textAlign: 'right' }}>AI reads</div><div style={{ ...th, textAlign: 'right' }}>People</div>
            {pages.map(p => (
              <div key={p.page} style={{ display: 'contents' }}>
                <div style={td}>{p.page}</div><div style={{ ...td, ...num }}>{p.ai}</div><div style={{ ...td, ...num }}>{p.people}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={section}>
        <p style={eyebrow}>3 &middot; Traffic</p>
        <h2 style={h2}>Visits and clicks</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
          <div style={{ backgroundColor: '#F9FAFB', borderRadius: '0.625rem', padding: '1rem' }}>
            <p style={{ margin: '0 0 0.25rem', fontSize: '1.625rem', fontWeight: 700, color: '#111827' }}>45</p>
            <p style={{ margin: 0, fontSize: '0.8125rem', color: '#4B5563' }}>people viewed the pages above, last 30 days</p>
          </div>
          <div style={{ backgroundColor: '#F9FAFB', borderRadius: '0.625rem', padding: '1rem' }}>
            <p style={{ margin: '0 0 0.25rem', fontSize: '1.625rem', fontWeight: 700, color: '#111827' }}>6</p>
            <p style={{ margin: 0, fontSize: '0.8125rem', color: '#4B5563' }}>clicks to your site we counted: 4 from your banner, 2 from your pricing link</p>
          </div>
        </div>
        <p style={small}>Your own tracking dashboard will usually show more clicks than we count: it counts every hit on your link, and we leave out automated traffic. We show both so the numbers reconcile. Most of the value is in the AI answers above, which send few clicks to anyone.</p>
      </div>

      <div style={section}>
        <p style={eyebrow}>4 &middot; Accuracy</p>
        <h2 style={h2}>What we checked and changed</h2>
        <p style={body}>A full re-check of your listing against your own pricing, product, docs, security and changelog pages, and the review sites. AI assistants repeat what they read, so this is what keeps their answers about you current.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
          <div style={{ border: '1px solid #E5E7EB', borderRadius: '0.625rem', padding: '1rem' }}>
            <p style={{ margin: '0 0 0.5rem', fontWeight: 600, color: '#111827' }}>Updated on your listing</p>
            <ul style={{ margin: 0, paddingLeft: '1.1rem', color: '#374151', fontSize: '0.875rem', lineHeight: 1.6 }}>
              <li>New Team plan added to your pricing</li>
              <li>Your MCP server added to integrations</li>
              <li>SOC 2 Type II report now listed under security</li>
              <li>Integration count updated from your integrations page</li>
              <li>Review count updated</li>
            </ul>
          </div>
          <div style={{ border: '1px solid #E5E7EB', borderRadius: '0.625rem', padding: '1rem' }}>
            <p style={{ margin: '0 0 0.5rem', fontWeight: 600, color: '#111827' }}>Confirmed still correct</p>
            <ul style={{ margin: 0, paddingLeft: '1.1rem', color: '#374151', fontSize: '0.875rem', lineHeight: 1.6 }}>
              <li>Plans and plan limits</li>
              <li>Data-training policy</li>
              <li>Languages and deployment</li>
              <li>Contract terms</li>
            </ul>
          </div>
        </div>
        <p style={small}>The comparison pages that name you were corrected the same day, so they match your listing. Next re-check: in 14 days.</p>
      </div>

      <div style={section}>
        <p style={eyebrow}>5 &middot; Your category</p>
        <h2 style={h2}>How you compare on our site</h2>
        <p style={body}>AI reads of each listing in your category in the last 30 days.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {category.map(c => (
            <div key={c.name} style={{ display: 'grid', gridTemplateColumns: '130px minmax(0, 1fr) 40px', gap: '0.75rem', alignItems: 'center', fontSize: '0.875rem' }}>
              <div style={{ fontWeight: c.you ? 700 : 400, color: '#111827' }}>{c.name}</div>
              <div style={{ height: '0.75rem', borderRadius: '0.375rem', backgroundColor: c.you ? '#2563EB' : '#D1D5DB', width: Math.round((c.n / max) * 100) + '%' }} />
              <div style={{ textAlign: 'right', fontWeight: c.you ? 700 : 400 }}>{c.n}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={section}>
        <p style={eyebrow}>6 &middot; One thing worth doing</p>
        <div style={{ backgroundColor: '#EFF6FF', borderRadius: '0.625rem', padding: '1.25rem' }}>
          <p style={{ margin: '0 0 0.375rem', fontWeight: 700, fontSize: '1.0625rem', color: '#111827' }}>Buyers are asking AI about your security and data residency</p>
          <p style={{ margin: 0, color: '#374151', fontSize: '0.9375rem', lineHeight: 1.6 }}>Copilot answered security and data-residency comparisons that name you 64 times using our pages. Your listing names your SOC 2 report but only US hosting, because that is all your security page says. If EU hosting is coming, send us the page and it goes on your listing within 1 business day.</p>
        </div>
      </div>

      <p style={{ ...small, marginTop: '1.5rem' }}>How we count: &ldquo;read&rdquo; means an AI system fetched the page; &ldquo;cited&rdquo; and &ldquo;linked&rdquo; come from Microsoft&rsquo;s and Google&rsquo;s own reports for our site. Each figure is a count of times, not people, and we never add one source to another.</p>

      <div style={{ marginTop: '2.5rem', backgroundColor: '#0B1220', borderRadius: '0.875rem', padding: '1.75rem', color: 'white' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#60A5FA', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.5rem' }}>Get this report for your agent</p>
        <h2 style={{ fontFamily: serif, fontSize: '1.375rem', fontWeight: 700, margin: '0 0 0.5rem' }}>Featured Listing, {featured.price} a month</h2>
        <p style={{ fontSize: '0.875rem', color: '#D1D5DB', lineHeight: 1.65, margin: '0 0 1.25rem' }}>{featured.short} Your first report comes after your first re-check. Ratings and rankings are earned and never sold.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <a href={featured.checkout} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', fontSize: '0.875rem', fontWeight: 700, color: 'white', backgroundColor: '#2563EB', textDecoration: 'none', padding: '0.625rem 1.125rem', borderRadius: '0.5rem' }}>
            Start Featured Listing, {featured.price}/month &rarr;
          </a>
          {FEATURED_ANNUAL_PAYMENT_LINK && (
            <a href={FEATURED_ANNUAL_PAYMENT_LINK} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', fontSize: '0.875rem', fontWeight: 700, color: '#D1D5DB', border: '1px solid #374151', textDecoration: 'none', padding: '0.625rem 1.125rem', borderRadius: '0.5rem' }}>
              Or pay yearly, {FEATURED_ANNUAL_PRICE}/year &rarr;
            </a>
          )}
        </div>
        <p style={{ fontSize: '0.8125rem', color: '#9CA3AF', lineHeight: 1.6, margin: '1rem 0 0' }}>
          Not listed yet? <a href="/submit" style={{ color: '#60A5FA', textDecoration: 'none', fontWeight: 600 }}>Submit your agent and choose Featured &rarr;</a> &nbsp;&middot;&nbsp; <a href="/advertise#placements" style={{ color: '#60A5FA', textDecoration: 'none', fontWeight: 600 }}>See everything Featured includes</a>
        </p>
        {FEATURED_FOUNDING_NOTE && <p style={{ fontSize: '0.8125rem', color: '#34D399', fontWeight: 600, lineHeight: 1.6, margin: '0.75rem 0 0' }}>{FEATURED_FOUNDING_NOTE}</p>}
      </div>
    </div>
  )
}
