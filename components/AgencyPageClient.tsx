'use client'
import { useState } from 'react'
import Link from 'next/link'
import AgentLogo from '@/components/AgentLogo'
import AgencyReviewSection from '@/components/AgencyReviewSection'
import FeaturedListingBanner from '@/components/FeaturedListingBanner'
import DemoVideo from '@/components/DemoVideo'
import type { Agency, AgencyReview } from '@/types/agency'

const SERVICE_LABELS: Record<string, string> = {
  'ai-agent-building': 'AI Agent Building', 'workflow-automation': 'Workflow Automation',
  'ai-strategy': 'AI Strategy', 'chatbot-development': 'Chatbot Development',
  'data-pipeline': 'Data Pipeline', 'ai-training': 'AI Training',
  'prompt-engineering': 'Prompt Engineering', 'custom-integrations': 'Custom Integrations',
  'voice-agents': 'Voice Agents', 'rag-development': 'RAG Development',
  'voice-ai': 'Voice AI', 'process-automation': 'Process Automation',
  'data-analytics': 'Data Analytics', 'cloud-optimization': 'Cloud Optimization',
  'rpa': 'RPA',
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

function VerifiedBadge() {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
      padding: '0.2rem 0.625rem 0.2rem 0.2rem', borderRadius: '9999px',
      fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.05em',
      backgroundColor: '#DBEAFE', color: '#1D4ED8', border: '1px solid #93C5FD',
    }}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: '1rem', height: '1rem', borderRadius: '9999px', backgroundColor: '#2563EB',
      }}>
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
      Verified
    </span>
  )
}

interface AgencyWithSegments extends Agency {
  client_segments?: string[]
}

export default function AgencyPageClient({
  agency,
  reviews,
}: {
  agency: AgencyWithSegments
  reviews: AgencyReview[]
}) {
  const a = agency
  const clientSegments = a.client_segments ?? []

  const descriptionParagraphs = a.long_description
    ? a.long_description.split(/\n\n+/).filter(p => p.trim().length > 0)
    : []

  const hasPremiumBanner = a.is_featured && a.featured_hook

  return (
    <div>
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

      {/* Premium featured banner */}
      {hasPremiumBanner && (
        <div style={{ maxWidth: '880px', margin: '0 auto', padding: '0 1.5rem' }}>
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

      <div style={{ maxWidth: '880px', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Header */}
        <div style={{ padding: '2rem 0 1.75rem', borderBottom: '1px solid #E5E7EB' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <AgentLogo name={a.name} websiteUrl={a.website_url} faviconDomain={a.favicon_domain} size="lg" />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-0.02em' }}>{a.name}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flexWrap: 'wrap' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', padding: '0.2rem 0.625rem', borderRadius: '9999px', fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.05em', backgroundColor: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0' }}>Services</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', padding: '0.2rem 0.625rem', borderRadius: '9999px', fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.05em', backgroundColor: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                    Independently Reviewed
                  </span>
                  {a.vendor_claimed && <VerifiedBadge />}
                </div>
              </div>
              <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.6, margin: 0 }}>{a.short_description}</p>

              {/* Standalone demo video for non-featured agencies */}
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

        {/* Action bar */}
        <div className="agency-action-bar">
          {a.website_url && (
            hasPremiumBanner ? (
              <a href={a.website_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.75rem 1.25rem', background: 'transparent', color: '#6B7280', border: '1px solid #D1D5DB', borderRadius: '0.5rem', fontSize: '0.8125rem', fontWeight: 500, textDecoration: 'none' }}>
                Visit Website
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>
              </a>
            ) : (
              <>
                <a href={a.website_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.75rem 1.5rem', background: '#111827', color: 'white', borderRadius: '0.5rem', fontSize: '0.9375rem', fontWeight: 700, textDecoration: 'none' }}>
                  Get in Touch
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
                <a href={a.website_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.75rem 1.25rem', background: 'white', color: '#374151', border: '1px solid #D1D5DB', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
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
          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '0.75rem', padding: '1.25rem' }}>
            <p style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: '0.75rem', color: '#64748B' }}>Budget &amp; Pricing</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {a.hourly_rate_range && <FactItem icon="💵" label="Hourly rate" value={a.hourly_rate_range} />}
              {a.minimum_project_budget && <FactItem icon="📋" label="Min. project budget" value={a.minimum_project_budget} />}
              {a.pricing_model && <FactItem icon="🔄" label="Engagement model" value={a.pricing_model.charAt(0).toUpperCase() + a.pricing_model.slice(1)} />}
              {!a.hourly_rate_range && !a.minimum_project_budget && !a.pricing_model && (
                <p style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>Contact for pricing</p>
              )}
            </div>
          </div>

          <div style={{ background: '#FAFAFA', border: '1px solid #F3F4F6', borderRadius: '0.75rem', padding: '1.25rem' }}>
            <p style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: '0.75rem', color: '#9CA3AF' }}>Services</p>
            {a.service_tags.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                {a.service_tags.map(tag => (
                  <InfoPill key={tag} color="#059669" bg="#F0FDF4" border="#A7F3D0">{SERVICE_LABELS[tag] ?? tag}</InfoPill>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>Not specified</p>
            )}
          </div>

          <div style={{ background: '#FAFAFA', border: '1px solid #F3F4F6', borderRadius: '0.75rem', padding: '1.25rem' }}>
            <p style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: '0.75rem', color: '#9CA3AF' }}>Industries</p>
            {a.industry_tags.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                {a.industry_tags.map(tag => (
                  <InfoPill key={tag} color="#92400E" bg="#FFFBEB" border="#FDE68A">{tag}</InfoPill>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>Not specified</p>
            )}
          </div>

          <div style={{ background: '#FAFAFA', border: '1px solid #F3F4F6', borderRadius: '0.75rem', padding: '1.25rem' }}>
            <p style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: '0.75rem', color: '#9CA3AF' }}>Tools &amp; Platforms</p>
            {a.tool_specializations.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
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
          <div className="agency-regions-row">
            {a.regions_served.length > 0 && (
              <div>
                <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Regions Served</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                  {a.regions_served.map(region => (
                    <InfoPill key={region}>{region}</InfoPill>
                  ))}
                </div>
              </div>
            )}
            {clientSegments.length > 0 && (
              <div>
                <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Typical Clients</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
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
          <div style={{ padding: '1.75rem 0', borderBottom: '1px solid #E5E7EB' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', marginBottom: '0.875rem' }}>About {a.name}</h2>
            {descriptionParagraphs.map((p, i) => (
              <p key={i} style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.7, margin: i < descriptionParagraphs.length - 1 ? '0 0 0.75rem' : 0 }}>{p}</p>
            ))}
          </div>
        )}

        {/* Reviews section */}
        <div style={{ padding: '1.75rem 0 3rem' }}>
          <AgencyReviewSection agencyId={a.id} agencyName={a.name} reviews={reviews} />
        </div>

      </div>

      <style>{`
        .agency-facts-row { display: flex; align-items: center; gap: 1.25rem; flex-wrap: wrap; margin-top: 0.75rem; }
        .agency-facts-row span { font-size: 0.8125rem; color: #6B7280; }
        .agency-action-bar { display: flex; align-items: center; gap: 0.75rem; padding: 1.25rem 0; border-bottom: 1px solid #E5E7EB; flex-wrap: wrap; }
        .agency-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; padding: 1.75rem 0; border-bottom: 1px solid #E5E7EB; }
        .agency-regions-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; padding: 1.25rem 0; border-bottom: 1px solid #E5E7EB; }
        @media (max-width: 640px) {
          .agency-grid { grid-template-columns: 1fr; }
          .agency-regions-row { grid-template-columns: 1fr; }
          .agency-action-bar { flex-direction: column; align-items: stretch; }
          .agency-action-bar a { justify-content: center; }
        }
      `}</style>
    </div>
  )
}