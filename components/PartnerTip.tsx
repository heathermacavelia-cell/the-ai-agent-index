import { createClient } from '@/lib/supabase'
import AgentLogo from '@/components/AgentLogo'
import Link from 'next/link'

// A small contextual tip pointing readers to a partner tool that fits the page
// (for example a meeting notetaker on sales pages). Rows live in `sponsors`
// with tier 'partner-tip'. A row shows only on the pages named in
// target_agent_slugs: a listing slug ('gong'), a category page
// ('category:ai-sales-agents') or an integration hub ('hub:hubspot').
// tagline = the one-sentence tip; cta_text / cta_url = the button.
// The label says Affiliate when the partner is one of our affiliates,
// otherwise Sponsored, and affiliate tips carry a commission line.

type Place = 'listing' | 'category' | 'hub'

export default async function PartnerTip({ place, slug, flush = false }: { place: Place; slug: string; flush?: boolean }) {
  const key = place === 'listing' ? slug : place + ':' + slug
  const supabase = createClient()
  const today = new Date().toISOString().split('T')[0]

  const { data: tips } = await supabase
    .from('sponsors')
    .select('*')
    .eq('tier', 'partner-tip')
    .eq('is_active', true)
    .contains('target_agent_slugs', [key])
    .lte('start_date', today)
    .or(`end_date.is.null,end_date.gte.${today}`)

  const tip = (tips ?? []).find(t => t.agent_slug !== slug && t.cta_url && t.tagline)
  if (!tip) return null

  const { data: agent } = await supabase
    .from('agents')
    .select('slug, name, website_url, favicon_domain, logo_url, is_affiliate')
    .eq('slug', tip.agent_slug as string)
    .eq('is_active', true)
    .maybeSingle()
  if (!agent) return null

  return (
    <aside style={{
      backgroundColor: '#F8FAFC', borderRadius: '0.5rem',
      border: '1px solid #E2E8F0', padding: '1rem 1.25rem', margin: flush ? 0 : '1.5rem 0',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem', flexWrap: 'wrap' }}>
        <div style={{ flexShrink: 0, lineHeight: 0 }}>
        <AgentLogo
          name={agent.name}
          websiteUrl={agent.website_url}
          faviconDomain={agent.favicon_domain}
          logoUrl={agent.logo_url}
          size="md"
        />
        </div>
        <div style={{ flex: 1, minWidth: '14rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <Link href={'/agents/' + agent.slug} style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', textDecoration: 'none' }}>
              {agent.name}
            </Link>
            <span style={{
              fontSize: '0.5625rem', fontWeight: 600, color: '#94A3B8',
              textTransform: 'uppercase', letterSpacing: '0.08em',
              backgroundColor: '#F1F5F9', padding: '0.15rem 0.45rem', borderRadius: '0.25rem',
            }}>
              {agent.is_affiliate ? 'Affiliate' : 'Sponsored'}
            </span>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.5, margin: 0 }}>
            {tip.tagline as string}
          </p>
          {tip.social_proof && (
            <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: '0.35rem 0 0' }}>{tip.social_proof as string}</p>
          )}
        </div>
        <a
          href={tip.cta_url as string}
          target="_blank"
          rel="sponsored noopener noreferrer"
          data-out={agent.slug}
          data-out-from={'tip-' + place}
          style={{
            display: 'inline-flex', alignItems: 'center',
            padding: '0.45rem 0.875rem', borderRadius: '0.375rem',
            backgroundColor: '#2563EB', color: 'white',
            fontSize: '0.8125rem', fontWeight: 600, textDecoration: 'none',
            whiteSpace: 'nowrap', flexShrink: 0, alignSelf: 'center',
          }}
        >
          {(tip.cta_text as string) ?? 'Learn more'} →
        </a>
      </div>
      {agent.is_affiliate && (
        <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: '0.625rem 0 0', lineHeight: 1.5 }}>
          We may earn a commission if you sign up through this link. It does not change our review or rating.
        </p>
      )}
    </aside>
  )
}
