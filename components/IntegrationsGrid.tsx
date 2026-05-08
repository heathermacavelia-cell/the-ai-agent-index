'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

interface Integration {
  slug: string
  name: string
  description: string
  favicon_domain: string | null
  group_category: string | null
  count: number
}

interface Props {
  integrations: Integration[]
}

const GROUP_ORDER = ['CRM', 'Communication', 'DevTools', 'Sales', 'Productivity', 'Automation', 'eCommerce', 'Customer Support', 'HR']

export default function IntegrationsGrid({ integrations }: Props) {
  const [search, setSearch] = useState('')
  const [activeGroup, setActiveGroup] = useState<string | null>(null)

  const groups = useMemo(() => {
    const seen = new Set<string>()
    const result: string[] = []
    for (const g of GROUP_ORDER) {
      if (integrations.some(i => i.group_category === g)) {
        seen.add(g)
        result.push(g)
      }
    }
    for (const i of integrations) {
      if (i.group_category && !seen.has(i.group_category)) {
        result.push(i.group_category)
        seen.add(i.group_category)
      }
    }
    return result
  }, [integrations])

  const filtered = useMemo(() => {
    return integrations.filter(i => {
      const matchesSearch = !search || i.name.toLowerCase().includes(search.toLowerCase()) || i.description?.toLowerCase().includes(search.toLowerCase())
      const matchesGroup = !activeGroup || i.group_category === activeGroup
      return matchesSearch && matchesGroup
    })
  }, [integrations, search, activeGroup])

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="Search integrations..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', maxWidth: '420px', padding: '0.625rem 1rem', borderRadius: '0.625rem', border: '1px solid #E5E7EB', fontSize: '0.9375rem', color: '#111827', outline: 'none', boxSizing: 'border-box' }}
        />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveGroup(null)}
          style={{ padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid', borderColor: activeGroup === null ? '#2563EB' : '#E5E7EB', backgroundColor: activeGroup === null ? '#EFF6FF' : 'white', color: activeGroup === null ? '#1D4ED8' : '#6B7280', fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer' }}
        >
          All
        </button>
        {groups.map(group => (
          <button
            key={group}
            onClick={() => setActiveGroup(activeGroup === group ? null : group)}
            style={{ padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid', borderColor: activeGroup === group ? '#2563EB' : '#E5E7EB', backgroundColor: activeGroup === group ? '#EFF6FF' : 'white', color: activeGroup === group ? '#1D4ED8' : '#6B7280', fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer' }}
          >
            {group}
          </button>
        ))}
      </div>
      <p style={{ fontSize: '0.8125rem', color: '#9CA3AF', marginBottom: '1.25rem' }}>
        {filtered.length} integration{filtered.length !== 1 ? 's' : ''}
        {search && ` matching "${search}"`}
        {activeGroup && ` in ${activeGroup}`}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
        {filtered.map(integration => (
          <Link
            key={integration.slug}
            href={`/integrations/${integration.slug}`}
            style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: '1px solid #E5E7EB', padding: '1.25rem', textDecoration: 'none', display: 'block' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              {integration.favicon_domain ? (
                <img
                  src={`https://www.google.com/s2/favicons?domain=${integration.favicon_domain}&sz=64`}
                  alt={integration.name}
                  width={32}
                  height={32}
                  style={{ borderRadius: '0.375rem', flexShrink: 0 }}
                />
              ) : (
                <div style={{ width: 32, height: 32, borderRadius: '0.375rem', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
                  {integration.name[0]}
                </div>
              )}
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#111827' }}>{integration.name}</div>
                {integration.group_category && (
                  <div style={{ fontSize: '0.6875rem', color: '#9CA3AF', marginTop: '0.1rem' }}>{integration.group_category}</div>
                )}
              </div>
              <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#6B7280', backgroundColor: '#F3F4F6', padding: '0.15rem 0.4rem', borderRadius: '0.25rem', flexShrink: 0 }}>
                {integration.count}
              </span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: '#6B7280', lineHeight: 1.5, marginBottom: '0.75rem' }}>
              {integration.description}
            </p>
            <span style={{ fontSize: '0.8125rem', color: '#2563EB', fontWeight: 500 }}>Browse agents →</span>
          </Link>
        ))}
      </div>
      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#9CA3AF' }}>
          No integrations found{search && ` for "${search}"`}
        </div>
      )}
    </div>
  )
}