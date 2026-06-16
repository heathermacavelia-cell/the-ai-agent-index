export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { Agency, AgencyReview } from '@/types/agency'
import AgentLogo from '@/components/AgentLogo'
import AgencyReviewSection from '@/components/AgencyReviewSection'

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

export default async function AgencyPage({ params }: Props) {
  const supabase = createClient()
  const { data: agency } = await supabase
    .from('agencies')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .maybeSingle()

  if (!agency) notFound()
  const a = agency as Agency

  const { data: reviews } = await supabase
    .from('agency_reviews')
    .select('*')
    .eq('agency_id', a.id)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })

  const approvedReviews = (reviews ?? []) as AgencyReview[]

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
  }

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section style={{ backgroundColor: '#F0FDF4', borderBottom: '1px solid #BBF7D0', padding: '2.5rem 1.5rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6B7280', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <Link href="/" style={{ color: '#6B7280', textDecoration: 'none' }}>Home</Link>
            <span style={{ color: '#D1D5DB' }}>/</span>
            <Link href="/ai-automation-agencies" style={{ color: '#6B7280', textDecoration: 'none' }}>AI Automation Agencies</Link>
            <span style={{ color: '#D1D5DB' }}>/</span>
            <span style={{ color: '#111827' }}>{a.name}</span>
          </nav>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
            <AgentLogo name={a.name} websiteUrl={a.website_url} faviconDomain={a.favicon_domain} size="lg" />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.375rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-0.02em' }}>{a.name}</h1>
                {a.is_verified && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', padding: '0.2rem 0.625rem', borderRadius: '9999px', fontSize: '0.6875rem', fontWeight: 700, backgroundColor: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0' }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                    Verified
                  </span>
                )}
                <span style={{ padding: '0.2rem 0.625rem', borderRadius: '9999px', fontSize: '0.6875rem', fontWeight: 700, backgroundColor: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Services
                </span>
              </div>
              <p style={{ color: '#4B5563', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>{a.short_description}</p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                {a.headquarters && <span style={{ fontSize: '0.8125rem', color: '#6B7280' }}>📍 {a.headquarters}</span>}
                {a.team_size && <span style={{ fontSize: '0.8125rem', color: '#6B7280' }}>👥 {a.team_size}</span>}
                {a.founded_year && <span style={{ fontSize: '0.8125rem', color: '#6B7280' }}>📅 Founded {a.founded_year}</span>}
                {a.website_url && (
                  <a href={a.website_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8125rem', color: '#2563EB', textDecoration: 'none', fontWeight: 600 }}>
                    Visit website →
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: '2rem 1.5rem 4rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div className="agency-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', alignItems: 'start' }}>

            {/* Main content */}
            <div>
              {/* Long description */}
              {a.long_description && (
                <div style={{ marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }}>About {a.name}</h2>
                  <div style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                    {a.long_description}
                  </div>
                </div>
              )}

              {/* Services */}
              {a.service_tags.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }}>Services</h2>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                    {a.service_tags.map(tag => (
                      <span key={tag} style={{ padding: '0.375rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.8125rem', fontWeight: 500, backgroundColor: '#F0FDF4', color: '#059669', border: '1px solid #A7F3D0' }}>
                        {SERVICE_LABELS[tag] ?? tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tool specializations */}
              {a.tool_specializations.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }}>Tool Expertise</h2>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                    {a.tool_specializations.map(tool => (
                      <span key={tool} style={{ padding: '0.375rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.8125rem', fontWeight: 500, backgroundColor: '#F3F4F6', color: '#374151', border: '1px solid #E5E7EB' }}>
                        {TOOL_LABELS[tool] ?? tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Industries served */}
              {a.industry_tags.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }}>Industries Served</h2>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                    {a.industry_tags.map(tag => (
                      <span key={tag} style={{ padding: '0.375rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.8125rem', fontWeight: 500, backgroundColor: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews section - prominent */}
              <AgencyReviewSection agencyId={a.id} agencyName={a.name} reviews={approvedReviews} />
            </div>

            {/* Sidebar */}
            <div>
              {/* Quick facts card */}
              <div style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>Quick Facts</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {a.pricing_model && (
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Pricing model</span>
                      <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', margin: '0.125rem 0 0' }}>{a.pricing_model}</p>
                    </div>
                  )}
                  {a.hourly_rate_range && (
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Hourly rate</span>
                      <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', margin: '0.125rem 0 0' }}>{a.hourly_rate_range}</p>
                    </div>
                  )}
                  {a.minimum_project_budget && (
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Minimum budget</span>
                      <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', margin: '0.125rem 0 0' }}>{a.minimum_project_budget}</p>
                    </div>
                  )}
                  {a.team_size && (
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Team size</span>
                      <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', margin: '0.125rem 0 0' }}>{a.team_size}</p>
                    </div>
                  )}
                  {a.regions_served.length > 0 && (
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Regions served</span>
                      <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', margin: '0.125rem 0 0' }}>{a.regions_served.join(', ')}</p>
                    </div>
                  )}
                  {a.company_type && (
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Company type</span>
                      <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', margin: '0.125rem 0 0', textTransform: 'capitalize' }}>{a.company_type}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* External profiles */}
              {(a.clutch_url || a.trustpilot_url || a.linkedin_url) && (
                <div style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>External Profiles</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {a.clutch_url && (
                      <a href={a.clutch_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8125rem', color: '#2563EB', textDecoration: 'none' }}>
                        Clutch {a.clutch_rating ? `(${a.clutch_rating}/5)` : ''} →
                      </a>
                    )}
                    {a.trustpilot_url && (
                      <a href={a.trustpilot_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8125rem', color: '#2563EB', textDecoration: 'none' }}>
                        Trustpilot {a.trustpilot_rating ? `(${a.trustpilot_rating}/5)` : ''} →
                      </a>
                    )}
                    {a.linkedin_url && (
                      <a href={a.linkedin_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8125rem', color: '#2563EB', textDecoration: 'none' }}>
                        LinkedIn →
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Contact CTA */}
              {a.website_url && (
                <a href={a.website_url} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'block', textAlign: 'center', padding: '0.75rem', backgroundColor: '#059669', color: 'white', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 700, textDecoration: 'none' }}>
                  Visit {a.name} →
                </a>
              )}
            </div>
          </div>

          {/* Responsive override for sidebar on mobile */}
          <style>{`
            @media (max-width: 768px) {
              .agency-layout {
                grid-template-columns: 1fr !important;
              }
            }
          `}</style>
        </div>
      </section>
    </div>
  )
}