import Link from 'next/link'
import { resolveRating } from '@/lib/rating'
import { getGuideGroups, type GuideGroup } from '@/lib/guideAgents'

/**
 * The agent cards on a guide, grouped under the guide's own headings, in the order the
 * guide picked. Same card design guides used before, without the #1-#3 badges: the order
 * is editorial, not a score (Heather, 2026-10-29). A group with no active agents is not shown.
 */
export default async function GuideAgentList({ groups }: { groups: GuideGroup[] }) {
  const resolved = await getGuideGroups(groups)
  return (
    <div style={{ marginBottom: '3rem' }}>
      {resolved.filter((g) => g.agents.length > 0).map((g) => (
        <section key={g.heading} style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', marginBottom: '0.375rem', letterSpacing: '-0.01em' }}>
            {g.heading}
          </h2>
          {g.intro && (
            <p style={{ fontSize: '0.875rem', color: '#6B7280', lineHeight: 1.6, marginBottom: '1rem', maxWidth: '680px' }}>{g.intro}</p>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {g.agents.map((agent) => (
              <Link key={agent.slug} href={'/agents/' + agent.slug}
                style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: agent.is_featured ? '1px solid #BFDBFE' : '1px solid #E5E7EB', padding: '1.25rem', textDecoration: 'none', display: 'block', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div style={{ flex: 1, paddingRight: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' as const, marginBottom: '0.2rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#111827' }}>{agent.name}</span>
                      {agent.is_verified && <span style={{ fontSize: '0.625rem', fontWeight: 700, backgroundColor: '#DCFCE7', color: '#16A34A', padding: '0.1rem 0.4rem', borderRadius: '9999px', textTransform: 'uppercase' as const }}>Verified</span>}
                      {agent.is_featured && <span style={{ fontSize: '0.625rem', fontWeight: 700, backgroundColor: '#DBEAFE', color: '#1D4ED8', padding: '0.1rem 0.4rem', borderRadius: '9999px', textTransform: 'uppercase' as const }}>Featured</span>}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>by {agent.developer}</span>
                  </div>
                  {(() => {
                    const r = resolveRating({
                      editorial_rating: agent.editorial_rating ?? null,
                      editorial_rating_notes: agent.editorial_rating_notes ?? null,
                      rating_avg: agent.rating_avg ?? null,
                      rating_count: agent.rating_count ?? null,
                    })
                    if (r.suppressed) return (
                      <span style={{ fontSize: '0.5625rem', fontWeight: 700, color: '#92400E', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '0.25rem', padding: '0.1rem 0.35rem', textTransform: 'uppercase', letterSpacing: '0.03em', whiteSpace: 'nowrap', flexShrink: 0 }}>On Our Radar</span>
                    )
                    if (r.value == null) return null
                    return (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
                        <span style={{ color: '#2563EB', fontSize: '0.75rem' }}>&#x2605;</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151' }}>{r.value.toFixed(1)}</span>
                      </div>
                    )
                  })()}
                </div>
                <p style={{ fontSize: '0.8125rem', color: '#4B5563', lineHeight: 1.55, marginBottom: '0.75rem' }}>{agent.short_description}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.75rem', color: '#6B7280', backgroundColor: '#F3F4F6', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', textTransform: 'capitalize' as const }}>{agent.pricing_model}</span>
                  <span style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 500 }}>View &#x2192;</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
