'use client'

import { useEffect, useState } from 'react'

interface Platform {
  name: string
  count: number
}

interface AiStats {
  total: number
  platforms: Platform[]
}

const DOMAIN_MAP: Record<string, string> = {
  'ChatGPT': 'chatgpt.com',
  'GPTBot': 'openai.com',
  'Claude': 'claude.ai',
  'Perplexity': 'perplexity.ai',
  'NotebookLM': 'notebooklm.google.com',
  'Apple Intelligence': 'apple.com',
  'You.com': 'you.com',
  'Gemini': 'gemini.google.com',
  'ByteDance': 'bytedance.com',
  'Petal': 'aspiegel.com',
  'Common Crawl': 'commoncrawl.org',
  'Cohere': 'cohere.com',
  'Diffbot': 'diffbot.com',
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'
  return n.toLocaleString()
}

export default function AiCrawlerStats() {
  const [stats, setStats] = useState<AiStats | null>(null)

  useEffect(() => {
    fetch('/api/ai-stats')
      .then(r => r.json())
      .then(data => setStats(data))
      .catch(() => {})
  }, [])

  // Show nothing while loading or if no data
  if (!stats || stats.total === 0) {
    return null
  }

  // Only show the major AI platforms, not generic crawlers
  const majorPlatforms = stats.platforms.filter(p =>
    ['ChatGPT', 'Claude', 'Perplexity', 'NotebookLM', 'Apple Intelligence', 'Gemini', 'You.com', 'GPTBot'].includes(p.name)
  )

  const platformCount = majorPlatforms.length

  return (
    <div>
      {/* Headline stat */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div style={{ backgroundColor: '#080D16', border: '1px solid #1F2937', borderRadius: '0.875rem', padding: '1.5rem' }}>
          <p style={{ fontSize: '2.25rem', fontWeight: 800, color: '#60A5FA', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
            {formatCount(stats.total)}+
          </p>
          <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#F9FAFB', marginBottom: '0.375rem' }}>AI queries in the last 7 days</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', lineHeight: 1.5 }}>
            The number of times AI systems read this directory to build their answers. Live count from server logs.
          </p>
        </div>
        <div style={{ backgroundColor: '#080D16', border: '1px solid #1F2937', borderRadius: '0.875rem', padding: '1.5rem' }}>
          <p style={{ fontSize: '2.25rem', fontWeight: 800, color: '#60A5FA', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>{platformCount}</p>
          <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#F9FAFB', marginBottom: '0.375rem' }}>AI platforms reading this data</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', lineHeight: 1.5 }}>
            ChatGPT, Claude, Perplexity{platformCount > 3 ? `, and ${platformCount - 3} more` : ''} actively crawl this directory to answer user questions about AI agents.
          </p>
        </div>
        <div style={{ backgroundColor: '#080D16', border: '1px solid #1F2937', borderRadius: '0.875rem', padding: '1.5rem' }}>
          <p style={{ fontSize: '2.25rem', fontWeight: 800, color: '#60A5FA', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>5x</p>
          <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#F9FAFB', marginBottom: '0.375rem' }}>Higher conversion from AI referrals</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', lineHeight: 1.5 }}>
            Industry research shows AI-referred visitors convert at 14.2% vs 2.8% for organic search (Frase/Semrush, 2026).
          </p>
        </div>
      </div>

      {/* Platform breakdown */}
      <div style={{ backgroundColor: '#080D16', border: '1px solid #1F2937', borderRadius: '0.875rem', padding: '1.75rem' }}>
        <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#9CA3AF', marginBottom: '1.25rem' }}>AI platform activity (last 7 days, from server logs)</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
          {majorPlatforms.map(p => (
            <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <img
                src={'https://www.google.com/s2/favicons?domain=' + (DOMAIN_MAP[p.name] ?? 'google.com') + '&sz=32'}
                alt={p.name}
                width={18}
                height={18}
                style={{ borderRadius: '3px', opacity: 0.9 }}
              />
              <div>
                <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#F9FAFB', margin: 0 }}>{p.name}</p>
                <p style={{ fontSize: '0.6875rem', color: '#6B7280', margin: 0 }}>{formatCount(p.count)} queries</p>
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '0.75rem', color: '#4B5563', marginTop: '1.25rem', lineHeight: 1.5 }}>
          Measured via server-side request classification. These are AI systems actively reading listing data to generate answers, not human page views. Updated in real time.
        </p>
      </div>
    </div>
  )
}