'use client'
import { useState } from 'react'

const THEMES = ['dark', 'light', 'outline'] as const
type Theme = (typeof THEMES)[number]

const SITE = 'https://theaiagentindex.com'

export default function BadgeEmbeds({ slug, name, badges }: {
  slug: string
  name: string
  badges: { type: string; label: string }[]
}) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [copied, setCopied] = useState('')

  function snippet(type: string, label: string): string {
    return '<a href="' + SITE + '/agents/' + slug + '?utm_source=badge">\n'
      + '  <img src="' + SITE + '/api/badge/' + slug + '/' + type + '?theme=' + theme + '" alt="'
      + name + ' - ' + label + ' on The AI Agent Index" height="54" />\n'
      + '</a>'
  }

  async function copy(type: string, label: string) {
    try {
      await navigator.clipboard.writeText(snippet(type, label))
      setCopied(type)
      setTimeout(() => setCopied(''), 2000)
    } catch {
      setCopied('')
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {THEMES.map(t => (
          <button key={t} onClick={() => setTheme(t)}
            style={{
              fontSize: '0.8125rem', fontWeight: 600, padding: '0.375rem 1rem', borderRadius: '9999px',
              border: '1px solid', borderColor: theme === t ? '#111827' : '#E5E7EB',
              backgroundColor: theme === t ? '#111827' : 'white',
              color: theme === t ? 'white' : '#374151', cursor: 'pointer', textTransform: 'capitalize',
            }}>
            {t}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {badges.map((badge, i) => (
          <div key={badge.type} style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.875rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#111827' }}>{badge.label}</span>
              {i === 0 && (
                <span style={{ fontSize: '0.625rem', fontWeight: 700, color: '#1D4ED8', backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '9999px', padding: '0.15rem 0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Recommended
                </span>
              )}
            </div>
            <div style={{ padding: '1rem', backgroundColor: theme === 'dark' ? '#F9FAFB' : '#F3F4F6', borderRadius: '0.5rem', marginBottom: '0.875rem' }}>
              <img
                key={badge.type + theme}
                src={'/api/badge/' + slug + '/' + badge.type + '?theme=' + theme}
                alt={badge.label + ' badge preview'}
                height={54}
              />
            </div>
            <pre style={{ fontSize: '0.6875rem', backgroundColor: '#0F172A', color: '#E2E8F0', borderRadius: '0.5rem', padding: '0.875rem', overflowX: 'auto', margin: '0 0 0.75rem', lineHeight: 1.6 }}>
              {snippet(badge.type, badge.label)}
            </pre>
            <button onClick={() => copy(badge.type, badge.label)}
              style={{ fontSize: '0.8125rem', fontWeight: 600, padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', backgroundColor: copied === badge.type ? '#15803D' : '#2563EB', color: 'white', cursor: 'pointer' }}>
              {copied === badge.type ? 'Copied' : 'Copy embed code'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}