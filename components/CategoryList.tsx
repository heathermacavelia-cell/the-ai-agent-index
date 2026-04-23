'use client'

import AgentLogo from '@/components/AgentLogo'

type TopAgent = {
  id: string
  name: string
  website_url: string | null
  favicon_domain: string | null
}

type CategoryRow = {
  slug: string
  displayName: string
  count: number
  topAgents: TopAgent[]
  description: string
  accentColor: string
}

const ICON_MAP: Record<string, string> = {
  'ai-sales-agents': '/icons/icon-sales.png',
  'ai-customer-support-agents': '/icons/icon-support.png',
  'ai-research-agents': '/icons/icon-research.png',
  'ai-marketing-agents': '/icons/icon-marketing.png',
  'ai-coding-agents': '/icons/icon-coding.png',
  'ai-hr-agents': '/icons/icon-hr.png',
  'ai-workflow-agents': '/icons/icon-workflow.png',
}

function CategoryRowItem({ row }: { row: CategoryRow }) {
  const iconSrc = ICON_MAP[row.slug]
  return (
    <a
      href={`/${row.slug}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem',
        backgroundColor: '#0F172A',
        border: '1px solid #1F2937',
        borderRadius: '0.875rem',
        padding: '1.25rem 1.5rem',
        textDecoration: 'none',
        transition: 'border-color 0.15s, background-color 0.15s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = row.accentColor
        e.currentTarget.style.backgroundColor = '#111827'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#1F2937'
        e.currentTarget.style.backgroundColor = '#0F172A'
      }}
    >
      <div style={{
        width: '2.75rem',
        height: '2.75rem',
        borderRadius: '0.625rem',
        backgroundColor: '#1F2937',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        overflow: 'hidden',
      }}>
        {iconSrc && <img src={iconSrc} alt={row.displayName} style={{ width: '1.875rem', height: '1.875rem', objectFit: 'contain' }} />}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
  <span style={{ color: 'white', fontWeight: 600, fontSize: '0.9375rem', display: 'block', marginBottom: '0.25rem' }}>{row.displayName}</span>
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
    <span style={{ color: '#6B7280', fontSize: '0.75rem', fontFamily: 'monospace', backgroundColor: '#1F2937', padding: '0.125rem 0.5rem', borderRadius: '0.25rem' }}>{row.count} agents</span>
  </div>
  <p style={{ color: '#6B7280', fontSize: '0.8125rem', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.description}</p>
</div>

      <div className="category-logos-hide" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
        {row.topAgents.slice(0, 4).map(agent => (
          <div
            key={agent.id}
            style={{
              width: '2rem',
              height: '2rem',
              borderRadius: '0.375rem',
              overflow: 'hidden',
              border: '1px solid #374151',
              backgroundColor: '#1F2937',
              flexShrink: 0,
            }}
            title={agent.name}
          >
            <AgentLogo name={agent.name} websiteUrl={agent.website_url} faviconDomain={agent.favicon_domain} size="sm" />
          </div>
        ))}
      </div>

      <div style={{ flexShrink: 0, color: '#4B5563' }}>
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </a>
  )
}

export default function CategoryList({ rows }: { rows: CategoryRow[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {rows.map(row => (
        <CategoryRowItem key={row.slug} row={row} />
      ))}
    </div>
  )
}