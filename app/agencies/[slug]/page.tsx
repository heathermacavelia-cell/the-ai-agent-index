export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { Agency, AgencyReview } from '@/types/agency'
import AgentLogo from '@/components/AgentLogo'
import AgencyReviewSection from '@/components/AgencyReviewSection'
import FeaturedListingBanner from '@/components/FeaturedListingBanner'
import DemoVideo from '@/components/DemoVideo'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient()
  const { data } = await supabase.from('agencies').select('name, meta_title, meta_description, slug').eq('slug', params.slug).eq('is_active', true).maybeSingle()
  if (!data) return {}
  const url = 'https://theaiagentindex.com/agencies/' + data.slug
  return {
    title: { absolute: data.meta_title ?? data.name },
    description: data.meta_description ?? '',
    openGraph: { title: data.meta_title ?? data.name, description: data.meta_description ?? '', url, type: 'website', siteName: 'The AI Agent Index' },
    twitter: { card: 'summary', title: data.meta_title ?? data.name, description: data.meta_description ?? '' },
    alternates: { canonical: url },
  }
}

const SERVICE_LABELS: Record<string, string> = {
  'ai-agent-building': 'AI Agent Building', 'workflow-automation': 'Workflow Automation',
  'ai-strategy': 'AI Strategy', 'chatbot-development': 'Chatbot Development',
  'data-pipeline': 'Data Pipeline', 'ai-training': 'AI Training',
  'prompt-engineering': 'Prompt Engineering', 'custom-integrations': 'Custom Integrations',
  'voice-agents': 'Voice Agents', 'rag-development': 'RAG Development',
}
const TOOL_LABELS: Record<string, string> = {
  'make': 'Make', 'n8n': 'n8n', 'zapier': 'Zapier', 'langchain': 'LangChain',
  'openai': 'OpenAI', 'anthropic': 'Anthropic', 'hubspot': 'HubSpot',
  'salesforce': 'Salesforce', 'voiceflow': 'Voiceflow', 'botpress': 'Botpress',
  'hugging-face': 'Hugging Face', 'h2o-ai': 'H2O.ai',
}

function InfoPill({ children, color = '#374151', bg = '#F3F4F6', border = '#E5E7EB' }: { children: React.ReactNode; color?: string; bg?: string; border?: string }) {
  return (
    <span style={{ display: 'inline-block', padding: '0.375rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.8125rem', fontWeight: 500, backgroundColor: bg, color, border: `1px solid ${border}`, lineHeight: 1 }}>
      {children}
    </span>
  )
}

function FactItem({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}>
      <span style={{ fontSize: '1.125rem', lineHeight: 1, flexShrink: 0, marginTop: '0.125rem' }}>{icon}</span>
      <div>
        <p style={{ fontSize: '0.6875rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 0.125rem', fontWeight: 600 }}>{label}</p>
        <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#111827', margin: 0 }}>{value}</p>
      </div>
    </div>
  )
}

interface AgencyWithSegments extends Agency {
  client_segments?: string[]
}

export default async function AgencyPage({ params }: Props) {
  const supabase = createClient()
  const { data: agency } = await supabase
    .from('agencies')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .maybeSingle()

  if (!agency) notFound()
  const a = agency as AgencyWithSegments

  const { data: reviews } = await supabase
    .from('agency_reviews')
    .select('*')
    .eq('agency_id', a.id)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })

  const approvedReviews = (reviews ?? []) as AgencyReview[]
  const clientSegments = a.client_segments ?? []

  const descriptionParagraphs = a.long_description
    ? a.long_description.split(/\n\n+/).filter(p => p.trim().length > 0)
    : []

  const hasPremiumBanner = a.is_featured && a.featured_hook

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: a.name,
    description: a.short_description,
    url: a.website_url,
    ...(a.headquarters && { address: { '@type': 'PostalAddress', addressLocality: a.headquarters } }),
    ...(a.founded_year && { foundingDate: String(a.founded_year) }),
    ...(a.rating_count > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: a.rating_avg,
        reviewCount: a.rating_count,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  }

  const hasExternalLinks = a.linkedin_url || (a.clutch_url && (a.clutch_rating ?? 0) > 0)

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <style>{`
        .agency-page { max-width: 880px; margin: 0 auto; padding: 0 1.5rem; }
        .agency-header { padding: 2rem 0 1.75rem; border-bottom: 1px solid #E5E7EB; }
        .agency-badges { display: flex; align-items: center; gap: 0.375rem; flex-wrap: wrap; }
        .agency-badge { display: inline-flex; align-items: center; gap: 0.2rem; padding: 0.2rem 0.625rem; border-radius: 9999px; font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
        .agency-facts-row { display: flex; align-items: center; gap: 1.25rem; flex-wrap: wrap; margin-top: 0.75rem; }
        .agency-facts-row span { font-size: 0.8125rem; color: #6B7280; }
        .agency-action-bar { display: flex; align-items: center; gap: 0.75rem; padding: 1.25rem 0; border-bottom: 1px solid #E5E7EB; flex-wrap: wrap; }
        .agency-cta-primary { display: inline-flex; align-items: center; gap: 0.375rem; padding: 0.75rem 1.5rem; background: #111827; color: white; border-radius: 0.5rem; font-size: 0.9375rem; font-weight: 700; text-decoration: none; transition: background 0.15s; }
        .agency-cta-primary:hover { background: #1F2937; }
        .agency-cta-secondary { display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.75rem 1.25rem; background: white; color: #374151; border: 1px solid #D1D5DB; border-radius: 0.5rem; font-size: 0.875rem; font-weight: 600; text-decoration: none; transition: border-color 0.15s; }
        .agency-cta-secondary:hover { border-color: #9CA3AF; }
        .agency-cta-ghost { display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.75rem 1.25rem; background: transparent; color: #6B7280; border: 1px solid #D1D5DB; border-radius: 0.5rem; font-size: 0.8125rem; font-weight: 500; text-decoration: none; transition: border-color 0.15s; }
        .agency-cta-ghost:hover { border-color: #9CA3AF; }
        .agency-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; padding: 1.75rem 0; border-bottom: 1px solid #E5E7EB; }
        .agency-grid-card { background: #FAFAFA; border: 1px solid #F3F4F6; border-radius: 0.75rem; padding: 1.25rem; }
        .agency-grid-card-primary { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 0.75rem; padding: 1.25rem; }
        .agency-grid-title { font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.75rem; color: #9CA3AF; }
        .agency-pills { display: flex; flex-wrap: wrap; gap: 0.375rem; }
        .agency-section { padding: 1.75rem 0; border-bottom: 1px solid #E5E7EB; }
        .agency-section-title { font-size: 0.6875rem; font-weight: 700; color: #9CA3AF; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.75rem; }
        .agency-desc-p { font-size: 0.9375rem; color: #374151; line-height: 1.7; margin: 0 0 0.75rem; }
        .agency-desc-p:last-child { margin-bottom: 0; }
        .agency-reviews-section { padding: 1.75rem 0 3rem; }
        .agency-premium-banner-wrap { max-width: 880px; margin: 0 auto; padding: 0 1.5rem; }
        @media (max-width: 640px) {
          .agency-grid { grid-template-columns: 1fr; }
          .agency-action-bar { flex-direction: column; align-items: stretch; }
          .agency-cta-primary, .agency-cta-secondary, .agency-cta-ghost { justify-content: center; }
        }
      `}</style>

      {/* Breadcrumb */}
      <div style={{ background: '#FAFAFA', borderBottom: '1px solid #F3F4F6', padding: '0.75rem 1.5rem' }}>
        <div style={{ maxWidth: '880px', margin: '0 auto' }}>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#9CA3AF' }}>
            <Link href="/" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <Link href="/ai-automation-agencies" style={{ color: '#9CA3AF', textDecoration: 'none' }}>AI Automation Agencies</Link>
            <span>/</span>
            <span style={{ color: '#6B7280' }}>{a.name}</span>
          </nav>
        </div>
      </div>

      {/* Premium featured banner — full width with content margins */}
      {hasPremiumBanner && (
        <div className="agency-premium-banner-wrap">
          <div style={{ backgroundColor: 'white', borderRadius: '0.625rem', border: '1px solid #E5E7EB', overflow: 'hidden', marginTop: '1.5rem' }}>
            <FeaturedListingBanner
              featuredHook={a.featured_hook!}
              featuredSubhook={a.featured_subhook}
              ctaText={a.cta_text || 'Get in Touch'}
              ctaUrl={a.cta_url || a.website_url || '#'}
              bannerImageUrl={a.banner_image_url}
              bannerColor={a.banner_color}
              logoUrl={a.logo_url}
              agentName={a.name}
              startingPrice={null}
              pricingModel={null}
              g2Rating={null}
              g2ReviewCount={null}
              demoVideoUrl={a.demo_video_url}
              demoVideoType={a.demo_video_type}
            />
          </div>
        </div>
      )}

      <div className="agency-page">

        {/* Header */}
        <div className="agency-header">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <AgentLogo name={a.name} websiteUrl={a.website_url} faviconDomain={a.favicon_domain} size="lg" />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-0.02em' }}>{a.name}</h1>
                <div className="agency-badges">
                  <span className="agency-badge" style={{ backgroundColor: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0' }}>Services</span>
                  {a.is_verified && (
                    <span className="agency-badge" style={{ backgroundColor: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE' }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                      Verified
                    </span>
                  )}
                </div>
              </div>
              <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.6, margin: 0 }}>{a.short_description}</p>

              {/* Standalone demo video for non-featured agencies with video add-on */}
              {a.demo_video_url && a.demo_video_type && !hasPremiumBanner && (
                <div style={{ marginTop: '1rem', maxWidth: '360px' }}>
                  <DemoVideo
                    url={a.demo_video_url}
                    type={a.demo_video_type as 'mp4' | 'youtube' | 'vimeo'}
                    variant="standalone"
                  />
                </div>
              )}

              <div className="agency-facts-row">
                {a.headquarters && <span>📍 {a.headquarters}</span>}
                {a.team_size && <span>👥 {a.team_size} people</span>}
                {a.founded_year && <span>Est. {a.founded_year}</span>}
                {a.rating_count > 0 && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span style={{ color: '#2563EB' }}>★</span>
                    <span style={{ fontWeight: 700, color: '#111827' }}>{a.rating_avg.toFixed(1)}</span>
                    <span>({a.rating_count} review{a.rating_count !== 1 ? 's' : ''})</span>
                  </span>
                )}
                {a.linkedin_url && (
                  <a href={a.linkedin_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8125rem', color: '#0A66C2', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#0A66C2"><path d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14m-.5 15.5v-5.3a3.26 3.26 0 00-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 011.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 001.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 00-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
                    LinkedIn
                  </a>
                )}
                {a.clutch_url && (a.clutch_rating ?? 0) > 0 && (
                  <a href={a.clutch_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8125rem', color: '#E54B22', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                    <span style={{ color: '#E54B22', fontSize: '0.75rem' }}>★</span>
                    Clutch {a.clutch_rating}/5
                    <span style={{ fontSize: '0.6875rem', color: '#9CA3AF', fontWeight: 400 }}>↗</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action bar — ghost buttons when premium banner is active */}
        <div className="agency-action-bar">
          {a.website_url && (
            hasPremiumBanner ? (
              <a href={a.website_url} target="_blank" rel="noopener noreferrer" className="agency-cta-ghost">
                Visit Website
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>
              </a>
            ) : (
              <>
                <a href={a.website_url} target="_blank" rel="noopener noreferrer" className="agency-cta-primary">
                  Get in Touch
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
                <a href={a.website_url} target="_blank" rel="noopener noreferrer" className="agency-cta-secondary">
                  Visit Website
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>
                </a>
              </>
            )
          )}
          {a.rating_count === 0 && (
            <span style={{ fontSize: '0.8125rem', color: '#9CA3AF', marginLeft: 'auto' }}>No reviews yet</span>
          )}
        </div>

        {/* At-a-glance grid */}
        <div className="agency-grid">
          <div className="agency-grid-card-primary">
            <p className="agency-grid-title" style={{ color: '#64748B' }}>Budget &amp; Pricing</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {a.hourly_rate_range && <FactItem icon="💵" label="Hourly rate" value={a.hourly_rate_range} />}
              {a.minimum_project_budget && <FactItem icon="📋" label="Min. project budget" value={a.minimum_project_budget} />}
              {a.pricing_model && <FactItem icon="🔄" label="Engagement model" value={a.pricing_model.charAt(0).toUpperCase() + a.pricing_model.slice(1)} />}
              {!a.hourly_rate_range && !a.minimum_project_budget && !a.pricing_model && (
                <p style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>Contact for pricing</p>
              )}
            </div>
          </div>

          <div className="agency-grid-card">
            <p className="agency-grid-title">Services</p>
            {a.service_tags.length > 0 ? (
              <div className="agency-pills">
                {a.service_tags.map(tag => (
                  <InfoPill key={tag} color="#059669" bg="#F0FDF4" border="#A7F3D0">{SERVICE_LABELS[tag] ?? tag}</InfoPill>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>Not specified</p>
            )}
          </div>

          <div className="agency-grid-card">
            <p className="agency-grid-title">Industries</p>
            {a.industry_tags.length > 0 ? (
              <div className="agency-pills">
                {a.industry_tags.map(tag => (
                  <InfoPill key={tag} color="#92400E" bg="#FFFBEB" border="#FDE68A">{tag}</InfoPill>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>Not specified</p>
            )}
          </div>

          <div className="agency-grid-card">
            <p className="agency-grid-title">Tools &amp; Platforms</p>
            {a.tool_specializations.length > 0 ? (
              <div className="agency-pills">
                {a.tool_specializations.map(tool => (
                  <InfoPill key={tool}>{TOOL_LABELS[tool] ?? tool}</InfoPill>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>Not specified</p>
            )}
          </div>
        </div>

        {/* Regions + Client segments row */}
        {(a.regions_served.length > 0 || clientSegments.length > 0) && (
          <div style={{ display: 'grid', gridTemplateColumns: a.regions_served.length > 0 && clientSegments.length > 0 ? '1fr 1fr' : '1fr', gap: '1rem', padding: '1.25rem 0', borderBottom: '1px solid #E5E7EB' }}>
            {a.regions_served.length > 0 && (
              <div>
                <p className="agency-section-title">Regions Served</p>
                <div className="agency-pills">
                  {a.regions_served.map(region => (
                    <InfoPill key={region}>{region}</InfoPill>
                  ))}
                </div>
              </div>
            )}
            {clientSegments.length > 0 && (
              <div>
                <p className="agency-section-title">Typical Clients</p>
                <div className="agency-pills">
                  {clientSegments.map((seg, i) => (
                    <InfoPill key={seg} color={i === 0 ? '#1D4ED8' : '#374151'} bg={i === 0 ? '#EFF6FF' : '#F3F4F6'} border={i === 0 ? '#BFDBFE' : '#E5E7EB'}>
                      {seg}{i === 0 ? ' (primary)' : ''}
                    </InfoPill>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* About section */}
        {descriptionParagraphs.length > 0 && (
          <div className="agency-section">
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', marginBottom: '0.875rem' }}>About {a.name}</h2>
            {descriptionParagraphs.map((p, i) => (
              <p key={i} className="agency-desc-p">{p}</p>
            ))}
          </div>
        )}

        {/* Reviews section */}
        <div className="agency-reviews-section">
          <AgencyReviewSection agencyId={a.id} agencyName={a.name} reviews={approvedReviews} />
        </div>

      </div>
    </div>
  )
}