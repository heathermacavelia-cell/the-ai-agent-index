'use client'
import { useRouter } from 'next/navigation'
import AgentLogo from '@/components/AgentLogo'
import Link from 'next/link'
import type { Agent } from '@/types/agent'

export default function FeaturedAgentsTable({ agents }: { agents: Agent[] }) {
  const router = useRouter()

  return (
    <div style={{ border: '1px solid #1F2937', borderRadius: '12px', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #1F2937' }}>
            <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Agent</th>
            <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em' }} className="hide-mobile">Category</th>
            <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em' }} className="hide-mobile">Rating</th>
            <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em' }} className="hide-mobile">Pricing</th>
            <th style={{ padding: '12px 20px', textAlign: 'right', fontSize: '11px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}></th>
          </tr>
        </thead>
        <tbody>
          {agents.map((agent, i) => {
            const displayRating = (agent.editorial_rating ?? 0) > 0 ? agent.editorial_rating : (agent.rating_avg ?? 0)
            const categoryLabel = agent.primary_category.replace('ai-', '').replace(/-agents$/, '').split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
            const pricingLabel = agent.pricing_model ? agent.pricing_model.charAt(0).toUpperCase() + agent.pricing_model.slice(1) : '—'
            return (
              <tr
                key={agent.id}
                onClick={() => router.push(`/agents/${agent.slug}`)}
                style={{
                  borderBottom: i < agents.length - 1 ? '1px solid #1F2937' : 'none',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                className="feat-row"
              >
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <AgentLogo name={agent.name} websiteUrl={agent.website_url} faviconDomain={agent.favicon_domain} size="sm" />
                    <div>
                      <div style={{ fontWeight: 600, color: '#F9FAFB', fontSize: '14px' }}>{agent.name}</div>
                      <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px', maxWidth: '320px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{agent.short_description}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px 20px' }} className="hide-mobile">
                  <span style={{ fontSize: '12px', fontWeight: 500, color: '#9CA3AF', background: '#1F2937', borderRadius: '999px', padding: '3px 10px' }}>{categoryLabel}</span>
                </td>
                <td style={{ padding: '16px 20px' }} className="hide-mobile">
                  <span style={{ fontSize: '13px', color: '#F9FAFB' }}>★ {displayRating ? Number(displayRating).toFixed(1) : '—'}</span>
                </td>
                <td style={{ padding: '16px 20px' }} className="hide-mobile">
                  <span style={{ fontSize: '13px', color: '#9CA3AF' }}>{pricingLabel}</span>
                </td>
                <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                  <span style={{ fontSize: '14px', color: '#2563EB', fontWeight: 600 }}>→</span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}