'use client'
import { useState } from 'react'
import Link from 'next/link'
import AgentLogo from '@/components/AgentLogo'

const QUESTIONS = [
  {
    id: 'goal',
    question: 'What is your primary goal?',
    options: [
      { value: 'leads', label: '🎯 Generate more leads' },
      { value: 'support', label: '💬 Improve customer support' },
      { value: 'research', label: '🔍 Speed up research' },
      { value: 'content', label: '✍️ Create more content' },
      { value: 'coding', label: '💻 Build or ship code faster' },
    ],
  },
  {
    id: 'size',
    question: 'What is your team size?',
    options: [
      { value: 'b2c', label: '👤 Just me' },
      { value: 'smb', label: '👥 2–50 people' },
      { value: 'b2b', label: '🏢 51–500 people' },
      { value: 'enterprise', label: '🏦 500+ people' },
    ],
  },
  {
    id: 'integration',
    question: 'What tools does your team already use?',
    options: [
      { value: 'HubSpot', label: 'HubSpot' },
      { value: 'Salesforce', label: 'Salesforce' },
      { value: 'Slack', label: 'Slack' },
      { value: 'none', label: 'None of these / Not sure' },
    ],
  },
  {
    id: 'budget',
    question: 'What is your monthly budget for AI tools?',
    options: [
      { value: 'free', label: '🆓 Free only' },
      { value: 'freemium', label: '💵 Under $50/mo' },
      { value: 'subscription', label: '💳 $50–500/mo' },
      { value: 'custom', label: '🏷️ $500+/mo or custom pricing' },
    ],
  },
  {
    id: 'technical',
    question: 'How technical is your team?',
    options: [
      { value: 'easy', label: '😊 Not technical — we need simple setup' },
      { value: 'moderate', label: '🔧 Some technical skills' },
      { value: 'complex', label: '⚙️ Very technical — we can handle complex tools' },
    ],
  },
]

const GOAL_TAGS: Record<string, string[]> = {
  leads: ['lead-generation', 'outbound-automation', 'email-optimisation', 'intent-detection'],
  support: ['ticket-resolution', 'chat', 'omnichannel', 'autonomous', 'escalation'],
  research: ['web-search', 'citations', 'deep-research', 'literature-review', 'data-analysis'],
  content: ['content-creation', 'brand-voice', 'seo', 'campaign-automation'],
  coding: ['code-generation', 'agentic-coding', 'ide', 'multi-file-editing', 'autocomplete'],
}

const BUDGET_ORDER: Record<string, number> = {
  free: 0,
  freemium: 1,
  subscription: 2,
  'usage-based': 2,
  custom: 3,
}

type Answer = { goal: string; size: string; integration: string; budget: string; technical: string }
type AgentResult = {
  id: string; name: string; slug: string; short_description: string;
  website_url: string | null; favicon_domain: string | null;
  pricing_model: string; editorial_rating: number | null; rating_avg: number | null;
  capability_tags: string[]; integrations: string[] | null; deployment_difficulty: string | null;
  customer_segment: string;
}

async function fetchRecommendations(answers: Answer): Promise<AgentResult[]> {
  const params = new URLSearchParams({
    goal: answers.goal,
    size: answers.size,
    integration: answers.integration,
    budget: answers.budget,
    technical: answers.technical,
  })
  const res = await fetch(`/api/quiz-recommendations?${params.toString()}`)
  if (!res.ok) return []
  return res.json()
}

export default function StackQuiz() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Partial<Answer>>({})
  const [results, setResults] = useState<AgentResult[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [shareUrl, setShareUrl] = useState('')

  const question = QUESTIONS[step]
  const totalSteps = QUESTIONS.length

  async function handleAnswer(value: string) {
    const key = question.id as keyof Answer
    const newAnswers = { ...answers, [key]: value }
    setAnswers(newAnswers)

    if (step < totalSteps - 1) {
      setStep(step + 1)
    } else {
      setLoading(true)
      const recs = await fetchRecommendations(newAnswers as Answer)
      setResults(recs)
      setLoading(false)
      // Update URL with answers for shareability
      const params = new URLSearchParams(newAnswers as Record<string, string>)
      const newUrl = `${window.location.origin}/find-your-stack?${params.toString()}`
      window.history.replaceState({}, '', newUrl)
      setShareUrl(newUrl)
    }
  }

  function reset() {
    setStep(0)
    setAnswers({})
    setResults(null)
    window.history.replaceState({}, '', '/find-your-stack')
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <div style={{ fontSize: '32px', marginBottom: '16px' }}>⚡</div>
        <p style={{ fontSize: '16px', color: '#6B7280' }}>Finding your best agent stack...</p>
      </div>
    )
  }

  if (results !== null) {
    return (
      <div>
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#111827', marginBottom: '8px', letterSpacing: '-0.02em' }}>
            Your recommended stack
          </h2>
          <p style={{ fontSize: '15px', color: '#6B7280' }}>
            Based on your answers — {results.length} agent{results.length !== 1 ? 's' : ''} matched your needs.
          </p>
        </div>

        {results.length === 0 ? (
          <div style={{ padding: '40px', background: '#F9FAFB', borderRadius: '12px', textAlign: 'center' }}>
            <p style={{ color: '#6B7280' }}>No exact matches found. <Link href="/search" style={{ color: '#2563EB' }}>Browse all agents →</Link></p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
            {results.map((agent, i) => {
              const rating = agent.editorial_rating ?? agent.rating_avg ?? 0
              return (
                <Link key={agent.id} href={`/agents/${agent.slug}`} style={{ display: 'block', background: 'white', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '20px', textDecoration: 'none', transition: 'border-color 0.15s' }} className="quiz-result-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                    <div style={{ flexShrink: 0, width: '24px', height: '24px', borderRadius: '50%', background: '#2563EB', color: 'white', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</div>
                    <AgentLogo name={agent.name} websiteUrl={agent.website_url} faviconDomain={agent.favicon_domain} size="sm" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: '#111827', fontSize: '15px' }}>{agent.name}</div>
                    </div>
                    {rating > 0 && <span style={{ fontSize: '13px', color: '#111827' }}>★ {Number(rating).toFixed(1)}</span>}
                    <span style={{ fontSize: '11px', color: '#6B7280', background: '#F3F4F6', borderRadius: '999px', padding: '3px 10px', textTransform: 'capitalize' }}>{agent.pricing_model}</span>
                  </div>
                  <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.5', margin: '0 0 0 36px' }}>{agent.short_description}</p>
                </Link>
              )
            })}
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button onClick={reset} style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
            ← Retake quiz
          </button>
          <button onClick={() => {
            const url = shareUrl || window.location.href
            if (navigator.clipboard) {
              navigator.clipboard.writeText(url).catch(() => {
                prompt('Copy this link:', url)
              })
            } else {
              prompt('Copy this link:', url)
            }
          }} style={{ background: '#2563EB', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: 600, color: 'white', cursor: 'pointer' }}>
            Copy shareable link
          </button>
          <Link href="/search" style={{ display: 'inline-flex', alignItems: 'center', background: 'white', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: 600, color: '#374151', textDecoration: 'none' }}>
            Browse all agents →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Progress bar */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '13px', color: '#6B7280' }}>Question {step + 1} of {totalSteps}</span>
          <span style={{ fontSize: '13px', color: '#6B7280' }}>{Math.round(((step) / totalSteps) * 100)}% complete</span>
        </div>
        <div style={{ height: '4px', background: '#F3F4F6', borderRadius: '999px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(step / totalSteps) * 100}%`, background: '#2563EB', borderRadius: '999px', transition: 'width 0.3s' }} />
        </div>
      </div>

      <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', marginBottom: '24px', letterSpacing: '-0.01em' }}>
        {question.question}
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {question.options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleAnswer(option.value)}
            style={{ textAlign: 'left', background: 'white', border: '2px solid #E5E7EB', borderRadius: '10px', padding: '16px 20px', fontSize: '15px', fontWeight: 500, color: '#111827', cursor: 'pointer', transition: 'border-color 0.15s, background 0.15s' }}
            className="quiz-option-btn"
          >
            {option.label}
          </button>
        ))}
      </div>

      {step > 0 && (
        <button onClick={() => setStep(step - 1)} style={{ marginTop: '24px', background: 'none', border: 'none', fontSize: '14px', color: '#6B7280', cursor: 'pointer', padding: 0 }}>
          ← Back
        </button>
      )}
    </div>
  )
}