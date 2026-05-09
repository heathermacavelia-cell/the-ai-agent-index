import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import AgentLogo from '@/components/AgentLogo'

export const dynamic = 'force-dynamic'

interface Props {
  params: { slug: string }
}

interface FaqItem {
  q: string
  a: string
}

const CATEGORY_LABELS: Record<string, string> = {
  'ai-sales-agents': 'AI Sales Agents',
  'ai-customer-support-agents': 'AI Customer Support Agents',
  'ai-marketing-agents': 'AI Marketing Agents',
  'ai-research-agents': 'AI Research Agents',
  'ai-coding-agents': 'AI Coding Agents',
  'ai-hr-agents': 'AI HR Agents',
  'ai-workflow-agents': 'AI Workflow Agents',
  'ai-customer-success-agents': 'AI Customer Success Agents',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient()
  const { data: integration } = await supabase
    .from('integrations')
    .select('name, description, meta_title, meta_description')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single()

  if (!integration) return {}

  const title = integration.meta_title ?? `Best AI Agents With ${integration.name} Integration (2026)`
  const description =
    integration.meta_description ??
    `Find AI agents that integrate natively with ${integration.name}. Editorially reviewed with structured data on pricing, capabilities, and setup time. Not affiliated.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: 'https://theaiagentindex.com/integrations/' + params.slug,
      type: 'website',
      siteName: 'The AI Agent Index',
    },
    twitter: { card: 'summary' },
    alternates: { canonical: 'https://theaiagentindex.com/integrations/' + params.slug },
  }
}

export default async function IntegrationPage({ params }: Props) {
  const supabase = createClient()

  const { data: integration } = await supabase
    .from('integrations')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single()

  if (!integration) notFound()

  const { data: agents } = await supabase
    .from('agents')
    .select(
      'id, name, slug, developer, website_url, favicon_domain, short_description, primary_category, pricing_model, rating_avg, rating_count, editorial_rating, is_featured, is_verified'
    )
    .eq('is_active', true)
    .contains('integrations', [integration.name])
    .order('is_featured', { ascending: false })
    .order('editorial_rating', { ascending: false })

  const byCategory: Record<string, typeof agents> = {}
  for (const agent of agents ?? []) {
    if (!byCategory[agent.primary_category]) byCategory[agent.primary_category] = []
    byCategory[agent.primary_category]!.push(agent)
  }

  const faqs: FaqItem[] = Array.isArray(integration.faq) ? integration.faq : []
  const agentCount = agents?.length ?? 0

  // Build body paragraphs from long_description
  const bodyParagraphs: string[] = integration.long_description
    ? integration.long_description.split('\n\n').filter(Boolean)
    : []

  // Build JSON-LD blocks
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: integration.meta_title ?? `Best AI Agents With ${integration.name} Integration (2026)`,
    description:
      integration.description ??
      `AI agents that integrate with ${integration.name} for business automation. Editorially reviewed.`,
    url: 'https://theaiagentindex.com/integrations/' + params.slug,
    numberOfItems: agentCount,
    itemListElement:
      agents?.map((agent, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'SoftwareApplication',
          name: agent.name,
          description: agent.short_description,
          url: `https://theaiagentindex.com/agents/${agent.slug}`,
          applicationCategory: agent.primary_category,
        },
      })) ?? [],
  }

  const faqSchema =
    faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.q,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.a,
            },
          })),
        }
      : null

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Breadcrumb */}
      <div style={{ marginBottom: '0.75rem' }}>
        <Link href="/" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none' }}>
          Home
        </Link>
        <span style={{ color: '#D1D5DB', margin: '0 0.5rem' }}>/</span>
        <Link
          href="/integrations"
          style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none' }}
        >
          Integrations
        </Link>
        <span style={{ color: '#D1D5DB', margin: '0 0.5rem' }}>/</span>
        <span style={{ fontSize: '0.8125rem', color: '#111827' }}>{integration.name}</span>
      </div>

      {/* H1 — driven from DB meta_title */}
      <h1
        style={{
          fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
          fontWeight: 800,
          color: '#111827',
          lineHeight: 1.2,
          marginBottom: '1.25rem',
          letterSpacing: '-0.02em',
        }}
      >
        {integration.meta_title ?? `Best AI Agents With ${integration.name} Integration (2026)`}
      </h1>

      {/* Lead paragraph — driven from DB description */}
      {integration.description && (
        <p
          style={{
            fontSize: '1.0625rem',
            color: '#374151',
            lineHeight: 1.75,
            marginBottom: '1.25rem',
            maxWidth: '700px',
          }}
        >
          {integration.description}
        </p>
      )}

      {/* Count badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.375rem',
          backgroundColor: '#EFF6FF',
          border: '1px solid #BFDBFE',
          borderRadius: '9999px',
          padding: '0.3rem 0.875rem',
          marginBottom: '2rem',
        }}
      >
        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1D4ED8' }}>
          {agentCount} agents reviewed
        </span>
        <span style={{ fontSize: '0.8125rem', color: '#3B82F6' }}>·</span>
        <span style={{ fontSize: '0.8125rem', color: '#3B82F6' }}>editorially scored</span>
      </div>

      {/* Body — long_description split into paragraphs */}
      {bodyParagraphs.length > 0 && (
        <div style={{ marginBottom: '3.5rem', maxWidth: '700px' }}>
          {bodyParagraphs.map((para, i) => (
            <p
              key={i}
              style={{
                fontSize: '0.9375rem',
                color: '#4B5563',
                lineHeight: 1.8,
                marginBottom: i < bodyParagraphs.length - 1 ? '1.25rem' : 0,
              }}
            >
              {para}
            </p>
          ))}
        </div>
      )}

      {/* Agent grid grouped by category */}
      {Object.entries(byCategory).map(([category, categoryAgents]) => (
        <div key={category} style={{ marginBottom: '3rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
              paddingBottom: '0.75rem',
              borderBottom: '2px solid #E5E7EB',
            }}
          >
            <h2 style={{ fontWeight: 700, fontSize: '1.125rem', color: '#111827' }}>
              {CATEGORY_LABELS[category] ?? category}
            </h2>
            <Link
              href={'/' + category}
              style={{ fontSize: '0.8125rem', color: '#2563EB', textDecoration: 'none' }}
            >
              View all {CATEGORY_LABELS[category] ?? category} →
            </Link>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1rem',
            }}
          >
            {categoryAgents?.map((agent) => {
              const displayRating =
                (agent.rating_count ?? 0) > 0
                  ? agent.rating_avg
                  : (agent.editorial_rating ?? 0)
              return (
                <Link
                  key={agent.slug}
                  href={'/agents/' + agent.slug}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '0.875rem',
                    border: '1px solid #E5E7EB',
                    padding: '1.25rem',
                    textDecoration: 'none',
                    display: 'block',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.625rem',
                      marginBottom: '0.5rem',
                    }}
                  >
                    <AgentLogo
                      name={agent.name}
                      websiteUrl={agent.website_url}
                      faviconDomain={agent.favicon_domain}
                      size="sm"
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          flexWrap: 'wrap' as const,
                          marginBottom: '0.2rem',
                        }}
                      >
                        <span
                          style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#111827' }}
                        >
                          {agent.name}
                        </span>
                        {agent.is_verified && (
                          <span
                            style={{
                              fontSize: '0.625rem',
                              fontWeight: 700,
                              backgroundColor: '#DCFCE7',
                              color: '#16A34A',
                              padding: '0.1rem 0.4rem',
                              borderRadius: '9999px',
                              textTransform: 'uppercase' as const,
                            }}
                          >
                            Verified
                          </span>
                        )}
                        {agent.is_featured && (
                          <span
                            style={{
                              fontSize: '0.625rem',
                              fontWeight: 700,
                              backgroundColor: '#DBEAFE',
                              color: '#1D4ED8',
                              padding: '0.1rem 0.4rem',
                              borderRadius: '9999px',
                              textTransform: 'uppercase' as const,
                            }}
                          >
                            Featured
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                        by {agent.developer}
                      </span>
                    </div>
                    {displayRating > 0 && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          flexShrink: 0,
                        }}
                      >
                        <span style={{ color: '#2563EB', fontSize: '0.75rem' }}>★</span>
                        <span
                          style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151' }}
                        >
                          {Number(displayRating).toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                  <p
                    style={{
                      fontSize: '0.8125rem',
                      color: '#4B5563',
                      lineHeight: 1.55,
                      marginBottom: '0.75rem',
                    }}
                  >
                    {agent.short_description}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: '#6B7280',
                        backgroundColor: '#F3F4F6',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '0.25rem',
                        textTransform: 'capitalize' as const,
                      }}
                    >
                      {agent.pricing_model}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 500 }}>
                      View →
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      ))}

      {/* FAQ section */}
      {faqs.length > 0 && (
        <div style={{ marginTop: '3.5rem', marginBottom: '2rem' }}>
          <h2
            style={{
              fontSize: '1.375rem',
              fontWeight: 700,
              color: '#111827',
              marginBottom: '1.5rem',
              letterSpacing: '-0.01em',
            }}
          >
            Frequently Asked Questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.875rem' }}>
            {faqs.map((faq, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.75rem',
                  padding: '1.25rem 1.5rem',
                }}
              >
                <h3
                  style={{
                    fontSize: '0.9375rem',
                    fontWeight: 700,
                    color: '#111827',
                    marginBottom: '0.5rem',
                    lineHeight: 1.4,
                  }}
                >
                  {faq.q}
                </h3>
                <p
                  style={{
                    fontSize: '0.875rem',
                    color: '#4B5563',
                    lineHeight: 1.75,
                    margin: 0,
                  }}
                >
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit CTA */}
      <div
        style={{
          backgroundColor: '#F0F9FF',
          border: '1px solid #BAE6FD',
          borderRadius: '0.875rem',
          padding: '1.5rem',
          marginTop: '2rem',
        }}
      >
        <h3
          style={{ fontWeight: 700, fontSize: '1rem', color: '#0C4A6E', marginBottom: '0.5rem' }}
        >
          Missing an agent?
        </h3>
        <p
          style={{
            fontSize: '0.875rem',
            color: '#0369A1',
            lineHeight: 1.6,
            marginBottom: '1rem',
          }}
        >
          If you build or use an AI agent that integrates with {integration.name} and it is not
          listed here, submit it to the index.
        </p>
        <Link
          href="/submit"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0.5rem 1rem',
            backgroundColor: '#0284C7',
            color: 'white',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          Submit your agent →
        </Link>
      </div>
    </div>
  )
}