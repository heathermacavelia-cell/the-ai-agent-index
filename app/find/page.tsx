import Link from 'next/link'
import FindClient from './FindClient'

export default function FindPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'system-ui, sans-serif' }}>

      {/* Nav */}
      <div style={{ borderBottom: '1px solid #e5e7eb', background: '#fff', padding: '16px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '14px' }}>← Back to Index</Link>
        </div>
      </div>

      {/* Hero — server-rendered so the h1 ships in the initial HTML */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '60px 24px 0' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: '#eff6ff', color: '#2563eb', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px', marginBottom: '20px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            AI-Powered Matching
          </div>
          <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#111827', marginBottom: '16px', lineHeight: '1.2' }}>
            Describe what you want to automate
          </h1>
          <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '32px', lineHeight: '1.6' }}>
            Tell us your business problem in plain English. We&apos;ll find the AI agents that can solve it.
          </p>
        </div>
      </div>

      <FindClient />

      {/* How it works — server-rendered explainer */}
      <div style={{ background: '#fff', borderTop: '1px solid #e5e7eb', padding: '56px 24px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#111827', marginBottom: '16px', letterSpacing: '-0.01em' }}>
            How the agent matcher works
          </h2>
          <p style={{ fontSize: '16px', color: '#374151', lineHeight: '1.7', marginBottom: '16px' }}>
            Most directories make you already know the category you want. This tool works the other way around: you describe the outcome you are after in plain language, and it maps that description against every active agent in the index. Instead of browsing by label, you start from the job to be done.
          </p>
          <p style={{ fontSize: '16px', color: '#374151', lineHeight: '1.7', marginBottom: '24px' }}>
            The more specific your description, the better the match. &quot;Follow up with leads who fill out my contact form and log them in HubSpot&quot; returns sharper results than &quot;sales tool,&quot; because the matcher reads for the actual task, the tools involved, and the workflow you are trying to close.
          </p>

          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>What you get back</h3>
          <ul style={{ margin: '0 0 24px', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li style={{ fontSize: '15px', color: '#374151', lineHeight: '1.6' }}>
              <strong>Ranked agents with a fit score.</strong> Each result shows how closely it matches your described use case, plus a one-line reason so you can see why it surfaced.
            </li>
            <li style={{ fontSize: '15px', color: '#374151', lineHeight: '1.6' }}>
              <strong>Workflow stacks.</strong> When a single agent will not cover the whole job, the Stacks tab shows curated multi-agent combinations that handle the full workflow end to end.
            </li>
            <li style={{ fontSize: '15px', color: '#374151', lineHeight: '1.6' }}>
              <strong>Editorial context.</strong> Every result links to a full listing with pricing, capabilities, integrations, and an independent editorial rating, so you can evaluate before you commit.
            </li>
          </ul>

          <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: '1.7' }}>
            The matcher is free, requires no account, and only ever returns agents that are actually listed in the index. Rankings reflect fit to your query and editorial assessment, never paid placement. If nothing in the directory genuinely fits, it will tell you that rather than force a weak match. Prefer a guided path instead? Try the{' '}
            <Link href="/find-your-stack" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>5-question stack quiz</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}