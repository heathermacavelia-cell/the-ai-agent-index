import StackQuiz from '@/components/StackQuiz'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Find Your AI Agent Stack',
  description: 'Answer 5 quick questions and get a personalized AI agent stack recommendation for your team. Free, instant, and shareable.',
  alternates: {
    canonical: 'https://theaiagentindex.com/find-your-stack',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Find Your AI Agent Stack',
  description: 'Answer 5 questions to get a personalized AI agent stack recommendation for your team.',
  step: [
    { '@type': 'HowToStep', name: 'Choose your primary goal', text: 'Select what you most want to automate or improve.' },
    { '@type': 'HowToStep', name: 'Select your team size', text: 'Tell us how many people are on your team.' },
    { '@type': 'HowToStep', name: 'Select your existing tools', text: 'Tell us which platforms you already use.' },
    { '@type': 'HowToStep', name: 'Set your budget', text: 'Choose your monthly budget for AI tools.' },
    { '@type': 'HowToStep', name: 'Rate your technical level', text: 'Tell us how technical your team is.' },
  ],
}

export default function FindYourStackPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '64px 24px' }}>
        <div style={{ marginBottom: '48px' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
            ✦ Stack Builder
          </p>
          <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#111827', marginBottom: '12px', letterSpacing: '-0.02em' }}>
            Find your AI agent stack
          </h1>
          <p style={{ fontSize: '16px', color: '#6B7280', lineHeight: '1.6' }}>
            Answer 5 quick questions and we'll recommend the best AI agents for your team — matched to your goals, budget, and tools.
          </p>
        </div>

        <StackQuiz />

        {/* How it works — server-rendered explainer */}
        <div style={{ marginTop: '64px', borderTop: '1px solid #E5E7EB', paddingTop: '48px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', marginBottom: '16px', letterSpacing: '-0.01em' }}>
            How the stack builder works
          </h2>
          <p style={{ fontSize: '16px', color: '#374151', lineHeight: '1.7', marginBottom: '16px' }}>
            A single AI agent rarely covers an entire business workflow. Most teams need a small combination of agents that hand off to each other: one to generate, one to act, one to track. The stack builder is designed to find that combination for your specific situation rather than pointing you at one tool and leaving the rest to you.
          </p>
          <p style={{ fontSize: '16px', color: '#374151', lineHeight: '1.7', marginBottom: '24px' }}>
            The five questions take about a minute and shape the recommendation in concrete ways:
          </p>
          <ul style={{ margin: '0 0 24px', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li style={{ fontSize: '15px', color: '#374151', lineHeight: '1.6' }}>
              <strong>Your primary goal</strong> sets the category focus, whether that is sales, support, marketing, research, coding, HR, or workflow automation.
            </li>
            <li style={{ fontSize: '15px', color: '#374151', lineHeight: '1.6' }}>
              <strong>Team size and budget</strong> filter out agents that are priced or scaled for the wrong stage, so a solo founder and a 200-person company do not get the same answer.
            </li>
            <li style={{ fontSize: '15px', color: '#374151', lineHeight: '1.6' }}>
              <strong>Your existing tools</strong> bias the results toward agents that integrate with what you already run, instead of forcing a rip-and-replace.
            </li>
            <li style={{ fontSize: '15px', color: '#374151', lineHeight: '1.6' }}>
              <strong>Your technical level</strong> adjusts for setup complexity, so the recommendation matches what your team can realistically deploy.
            </li>
          </ul>

          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>What you&apos;ll get</h3>
          <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: '1.7', marginBottom: '16px' }}>
            You get a recommended stack: a short, ordered set of AI agents that work together to cover your goal end to end, each linked to its full listing with pricing, capabilities, and an independent editorial rating. The result is free, needs no account, and is shareable, so you can send it to a colleague or revisit it later.
          </p>
          <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: '1.7' }}>
            Recommendations reflect fit and editorial assessment, never paid placement. Prefer to start from a specific problem instead of a questionnaire? Use the{' '}
            <Link href="/find" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>plain-English agent matcher</Link>, or{' '}
            <Link href="/stacks" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>browse all curated stacks</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}