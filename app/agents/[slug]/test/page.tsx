import { createClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import AgentLogo from '@/components/AgentLogo'
import { EDITOR_PERSON } from '@/lib/editor'
import { getAgentTest, type TaskResult } from '@/lib/agentTests'

export const dynamic = 'force-dynamic'

// Independent Agent Test report (2026-11-10). Plain server-rendered HTML: real
// headings, real tables, no results hidden behind scripts, so readers, search
// engines and AI systems all read the same page. Data lives in lib/agentTests.ts.

interface Props {
  params: { slug: string }
}

const SITE = 'https://theaiagentindex.com'

async function getAgent(slug: string) {
  const supabase = createClient()
  const { data } = await supabase
    .from('agents')
    .select('name, slug, developer, logo_url, website_url, favicon_domain')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  return data
}

function longDate(iso: string): string {
  return new Date(iso + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'America/Toronto' })
}

function pageTitle(name: string, passed: number, of: number, month: string): string {
  return `${name} hands-on test (${month}): ${passed} of ${of} tasks passed`
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const test = getAgentTest(params.slug)
  if (!test) return { title: 'Test not found', robots: { index: false, follow: false } }
  const month = new Date(test.publishedOn + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'America/Toronto' })
  const title = pageTitle(test.agentName, test.score.passed, test.score.of, month)
  const description = `We gave ${test.agentName}'s AI builder the same 9 real tasks we give every ${test.agentType}. What worked, what failed and why, with both runs shown. ${test.sponsor ? 'Paid test.' : 'Not paid for.'}`
  const url = `${SITE}/agents/${test.slug}/test`
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      images: [{ url: `${SITE}/og-image-2026-11.png`, width: 1200, height: 630 }],
      title,
      description,
      url,
      type: 'article',
      siteName: 'The AI Agent Index',
    },
    twitter: { images: [`${SITE}/og-image-2026-11.png`], card: 'summary', title, description },
  }
}

const RESULT_LABEL: Record<TaskResult, string> = {
  pass: 'Passed',
  partial: 'Partial',
  fail: 'Not passed',
  'not-scored': 'Not scored',
}

function ResultPill({ result }: { result: TaskResult }) {
  const styles: Record<TaskResult, { bg: string; fg: string; bd: string }> = {
    pass: { bg: '#ECFDF5', fg: '#047857', bd: '#A7F3D0' },
    partial: { bg: '#FFFBEB', fg: '#B45309', bd: '#FDE68A' },
    fail: { bg: '#FEF2F2', fg: '#B91C1C', bd: '#FECACA' },
    'not-scored': { bg: '#F3F4F6', fg: '#4B5563', bd: '#E5E7EB' },
  }
  const s = styles[result]
  return (
    <span style={{ display: 'inline-block', padding: '0.125rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', backgroundColor: s.bg, color: s.fg, border: '1px solid ' + s.bd, whiteSpace: 'nowrap' }}>
      {RESULT_LABEL[result]}
    </span>
  )
}

const h2: React.CSSProperties = { fontSize: '1.25rem', fontWeight: 700, color: '#111827', margin: '0 0 1rem' }
const body: React.CSSProperties = { fontSize: '0.9375rem', color: '#374151', lineHeight: 1.75 }
const th: React.CSSProperties = { textAlign: 'left', padding: '0.5rem 0.625rem', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', borderBottom: '1px solid #E5E7EB', whiteSpace: 'nowrap' }
const td: React.CSSProperties = { padding: '0.5rem 0.625rem', fontSize: '0.875rem', color: '#374151', borderBottom: '1px solid #F3F4F6', verticalAlign: 'top' }

export default async function AgentTestPage({ params }: Props) {
  const test = getAgentTest(params.slug)
  if (!test) notFound()
  const agent = await getAgent(params.slug)
  if (!agent) notFound()

  const url = `${SITE}/agents/${test.slug}/test`
  const published = longDate(test.publishedOn)
  const { passed, partial, failed, of } = test.score

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: pageTitle(test.agentName, passed, of, new Date(test.publishedOn + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'America/Toronto' })),
    description: test.headline,
    datePublished: test.publishedOn,
    dateModified: test.publishedOn,
    url,
    mainEntityOfPage: url,
    author: EDITOR_PERSON,
    publisher: { '@type': 'Organization', name: 'The AI Agent Index', url: SITE },
    about: {
      '@type': 'SoftwareApplication',
      name: test.agentName,
      applicationCategory: 'BusinessApplication',
      ...(agent.website_url ? { url: agent.website_url } : {}),
    },
    ...(test.sponsor ? { sponsor: { '@type': 'Organization', name: test.sponsor } } : {}),
  }

  return (
    <main style={{ maxWidth: '780px', margin: '0 auto', padding: '2.5rem 1.5rem 6rem' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Link href={'/agents/' + agent.slug} style={{ fontSize: '0.8125rem', color: '#2563EB', textDecoration: 'none' }}>
        &larr; Back to the {agent.name} listing
      </Link>

      {/* Disclosure first: who paid, and that the rating is untouched */}
      <p style={{ margin: '1.25rem 0 0', padding: '0.625rem 0.875rem', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.5rem', fontSize: '0.8125rem', color: '#4B5563', lineHeight: 1.6 }}>
        {test.sponsor
          ? 'The vendor paid for this test and saw our findings before publication. Payment covers the test, not the result.'
          : `${test.agentName} did not pay for this test and was not contacted before publication.`}{' '}
        This test does not change {test.agentName}&apos;s rating on the index.
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.75rem 0 0.75rem' }}>
        <AgentLogo name={agent.name} websiteUrl={agent.website_url} faviconDomain={agent.favicon_domain} logoUrl={agent.logo_url} size="md" />
        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
          Hands-on test &middot; {published}
        </p>
      </div>
      <h1 style={{ fontFamily: 'var(--font-serif), Georgia, serif', fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 600, color: '#111827', lineHeight: 1.2, margin: '0 0 1.25rem' }}>
        Can {agent.name}&apos;s AI build a real business workflow? We gave it 9 tasks.
      </h1>

      {/* Score card */}
      <section aria-label="Test result" style={{ border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.25rem 1.5rem', marginBottom: '2rem', backgroundColor: 'white' }}>
        <p style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: '#111827', lineHeight: 1.2 }}>
          {passed} of {of} tasks passed
        </p>
        <p style={{ margin: '0.25rem 0 1rem', fontSize: '0.875rem', color: '#6B7280' }}>
          {partial} partial &middot; {failed} not passed &middot; best of two runs where a task failed first
        </p>
        <dl style={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', gap: '0.375rem 1rem', margin: 0, fontSize: '0.8125rem' }}>
          <dt style={{ color: '#6B7280' }}>Tested</dt><dd style={{ margin: 0, color: '#111827' }}>{test.testedOn}</dd>
          <dt style={{ color: '#6B7280' }}>Plan</dt><dd style={{ margin: 0, color: '#111827' }}>{test.plan}</dd>
          <dt style={{ color: '#6B7280' }}>AI builder</dt><dd style={{ margin: 0, color: '#111827' }}>{test.aiBuilder}</dd>
          <dt style={{ color: '#6B7280' }}>Task list</dt><dd style={{ margin: 0, color: '#111827' }}>The standard {test.agentType} test (9 tasks, same for every tool)</dd>
        </dl>
      </section>

      <div style={{ ...body, display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
        {test.verdict.map((p, i) => <p key={i} style={{ margin: 0 }}>{p}</p>)}
      </div>

      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={h2}>What did {test.agentName} do well?</h2>
        <ul style={{ ...body, margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {test.strengths.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={h2}>Where did it struggle?</h2>
        <ul style={{ ...body, margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {test.struggles.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={h2}>Results at a glance</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={th}>#</th>
                <th style={th}>Task</th>
                <th style={th}>Result</th>
                <th style={th}>Corrections</th>
                <th style={th}>Manual steps</th>
                <th style={th}>Minutes</th>
              </tr>
            </thead>
            <tbody>
              {test.tasks.map(t => (
                <tr key={t.n}>
                  <td style={td}>{t.n}</td>
                  <td style={td}><a href={'#task-' + t.n} style={{ color: '#2563EB', textDecoration: 'none' }}>{t.name}</a></td>
                  <td style={td}><ResultPill result={t.result} /></td>
                  <td style={td}>{t.corrections ?? '-'}</td>
                  <td style={td}>{t.manualSteps ?? '-'}</td>
                  <td style={td}>{t.minutes ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: '0.5rem 0 0' }}>
          Counts are for the scored run. A correction is us fixing something the AI got wrong; a manual step is a click the AI handed back to us.
        </p>
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={h2}>Task by task</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {test.tasks.map(t => (
            <article key={t.n} id={'task-' + t.n} style={{ borderTop: '1px solid #E5E7EB', paddingTop: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9CA3AF' }}>Task {t.n}</span>
                <ResultPill result={t.result} />
              </div>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#111827', margin: '0 0 0.625rem' }}>{t.question}</h3>
              {t.prompt ? (
                <blockquote style={{ margin: '0 0 0.75rem', padding: '0.5rem 0.875rem', borderLeft: '3px solid #2563EB', backgroundColor: '#F8FAFF', fontSize: '0.875rem', color: '#1F2937' }}>
                  <span style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.125rem' }}>Prompt, typed exactly</span>
                  &ldquo;{t.prompt}&rdquo;
                </blockquote>
              ) : (
                <p style={{ margin: '0 0 0.75rem', fontSize: '0.8125rem', color: '#6B7280' }}>No prompt: this task checks the finished workflow&apos;s default behavior.</p>
              )}
              <p style={{ ...body, margin: '0 0 0.75rem', fontWeight: 600, color: '#111827' }}>{t.summary}</p>
              {t.runs.map((r, i) => (
                <div key={i} style={{ margin: '0 0 0.75rem' }}>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#374151', margin: '0 0 0.375rem' }}>
                    {r.label} {t.runs.length > 1 && <ResultPill result={r.result} />}
                  </h4>
                  {r.text.map((p, j) => <p key={j} style={{ ...body, margin: '0 0 0.5rem' }}>{p}</p>)}
                </div>
              ))}
              {t.whyItMatters && (
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.7 }}>
                  <strong style={{ color: '#111827' }}>Why it matters: </strong>{t.whyItMatters}
                </p>
              )}
            </article>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={h2}>What should buyers know before building this in {test.agentName}?</h2>
        <ul style={{ ...body, margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {test.buyerNotes.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={h2}>Which {test.agentName} plan do these tasks need?</h2>
        <div style={{ ...body, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {test.planCheck.map((p, i) => <p key={i} style={{ margin: 0 }}>{p}</p>)}
        </div>
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={h2}>How we tested</h2>
        <div style={{ ...body, display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
          {test.howWeTested.map((p, i) => <p key={i} style={{ margin: 0 }}>{p}</p>)}
        </div>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: '0 0 0.5rem' }}>The five test emails</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr><th style={th}>Subject</th><th style={th}>Body</th><th style={th}>What it tests</th></tr>
            </thead>
            <tbody>
              {test.fixtures.map((f, i) => (
                <tr key={i}><td style={td}>{f.subject}</td><td style={td}>{f.body}</td><td style={td}>{f.note}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p style={{ fontSize: '0.875rem', color: '#6B7280', lineHeight: 1.7 }}>
        Published {published} by <Link href="/about" style={{ color: '#2563EB', textDecoration: 'none' }}>The AI Agent Index</Link>.
        See the full <Link href={'/agents/' + agent.slug} style={{ color: '#2563EB', textDecoration: 'none' }}>{agent.name} listing</Link> for pricing, ratings and alternatives,
        and <Link href="/methodology" style={{ color: '#2563EB', textDecoration: 'none' }}>our methodology</Link> for how listings are scored.
      </p>
    </main>
  )
}
