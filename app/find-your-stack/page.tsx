import StackQuiz from '@/components/StackQuiz'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Find Your AI Agent Stack — The AI Agent Index',
  description: 'Answer 5 quick questions and get a personalised AI agent stack recommendation for your team. Free, instant, and shareable.',
  alternates: {
    canonical: 'https://theaiagentindex.com/find-your-stack',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Find Your AI Agent Stack',
  description: 'Answer 5 questions to get a personalised AI agent stack recommendation for your team.',
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
      </div>
    </div>
  )
}