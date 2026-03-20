import Link from 'next/link'
import { notFound } from 'next/navigation'
import { fetchAgentsByCategoryAndIndustry } from '@/lib/supabase'
import { PRIMARY_CATEGORIES, INDUSTRY_TAGS, CATEGORY_SLUGS, INDUSTRY_SLUGS } from '@/lib/taxonomy'
import { getCategoryFromSlug, getIndustryFromSlug } from '@/lib/utils'
import { AgentCard } from '@/components/AgentCard'
import { FilterPills } from '@/components/FilterPills'
import type { Metadata } from 'next'
export const revalidate = 3600

type Props = {
  params: { category: string; industry: string }
}

const CATEGORY_VERBS: Record<string, string> = {
  'ai-sales-agents': 'automate sales, generate leads, and close more deals',
  'ai-customer-support-agents': 'resolve support tickets, reduce wait times, and improve CSAT',
  'ai-research-agents': 'conduct deep research, synthesise data, and accelerate decision-making',
  'ai-marketing-agents': 'create content, automate campaigns, and grow pipeline',
  'ai-coding-agents': 'write, review, and ship code faster',
}

const CATEGORY_SHORT: Record<string, string> = {
  'ai-sales-agents': 'AI sales agents',
  'ai-customer-support-agents': 'AI customer support agents',
  'ai-research-agents': 'AI research agents',
  'ai-marketing-agents': 'AI marketing agents',
  'ai-coding-agents': 'AI coding agents',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const categoryLabel = getCategoryFromSlug(params.category)
  const industryLabel = getIndustryFromSlug(params.industry)
  if (!categoryLabel || !industryLabel) return {}
  const year = new Date().getFullYear()
  const shortCat = CATEGORY_SHORT[params.category] ?? categoryLabel.toLowerCase()
  return {
    title: 'Best ' + categoryLabel + ' for ' + industryLabel + ' (' + year + ') — AI Agent Index',
    description: 'Compare the best ' + shortCat + ' for ' + industryLabel + '. Structured data on pricing, capabilities, integrations, and deployment for every agent.',
  }
}

export default async function CategoryIndustryPage({ params }: Props) {
  const categoryLabel = getCategoryFromSlug(params.category)
  const industryLabel = getIndustryFromSlug(params.industry)
  if (!categoryLabel || !industryLabel) notFound()

    const agents = await fetchAgentsByCategoryAndIndustry(params.category, params.industry)
  const year = new Date().getFullYear()
  const shortCat = CATEGORY_SHORT[params.category] ?? categoryLabel.toLowerCase()
  const verb = CATEGORY_VERBS[params.category] ?? 'automate workflows'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://theaiagentindex.com'

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Best ' + categoryLabel + ' for ' + industryLabel + ' (' + year + ')',
    description: 'Ranked list of the best ' + shortCat + ' for ' + industryLabel + ' businesses.',
    url: siteUrl + '/' + params.category + '/' + params.industry,
    numberOfItems: agents.length,
    itemListElement: agents.map((agent, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: agent.name,
      url: siteUrl + '/agents/' + agent.slug,
      description: agent.short_description,
    })),
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What are the best ' + shortCat + ' for ' + industryLabel + '?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: agents.length > 0
            ? 'The top ' + shortCat + ' for ' + industryLabel + ' include ' + agents.slice(0, 3).map(a => a.name).join(', ') + '. These agents are ranked by rating and feature depth on The AI Agent Index.'
            : 'The AI Agent Index tracks the best ' + shortCat + ' for ' + industryLabel + '. Check back as new agents are added regularly.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I choose an AI agent for ' + industryLabel + '?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'When evaluating ' + shortCat + ' for ' + industryLabel + ', consider: pricing model (free vs subscription vs usage-based), deployment difficulty (easy vs complex), key integrations with your existing stack, and whether the agent specialises in ' + industryLabel + ' workflows. The AI Agent Index provides structured data on all of these dimensions for every listed agent.',
        },
      },
      {
        '@type': 'Question',
        name: 'Are there free AI agents for ' + industryLabel + '?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, several ' + shortCat + ' offer free or freemium plans suitable for ' + industryLabel + ' teams. Use the pricing filter on The AI Agent Index to find agents with free tiers.',
        },
      },
    ],
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: categoryLabel, item: siteUrl + '/' + params.category },
      { '@type': 'ListItem', position: 3, name: industryLabel, item: siteUrl + '/' + params.category + '/' + params.industry },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem 5rem' }}>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6B7280', marginBottom: '2rem' }}>
          <Link href="/" style={{ color: '#6B7280', textDecoration: 'none' }}>Home</Link>
          <span style={{ color: '#D1D5DB' }}>/</span>
          <Link href={'/' + params.category} style={{ color: '#6B7280', textDecoration: 'none' }}>{categoryLabel}</Link>
          <span style={{ color: '#D1D5DB' }}>/</span>
          <span style={{ color: '#111827' }}>{industryLabel}</span>
        </nav>

        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', marginBottom: '1rem', lineHeight: 1.2 }}>
            Best {categoryLabel} for {industryLabel} ({year})
          </h1>
          <p style={{ color: '#4B5563', fontSize: '1.0625rem', lineHeight: 1.7, maxWidth: '680px', marginBottom: '1rem' }}>
            We track and rank the best {shortCat} built for {industryLabel} businesses. Every agent below is evaluated on pricing, deployment complexity, integrations, and capability depth — so you can choose the right tool to {verb} in {industryLabel}.
          </p>
          <p style={{ color: '#6B7280', fontSize: '0.9375rem' }}>
            {agents.length} agent{agents.length === 1 ? '' : 's'} indexed
            {agents.length > 0 && (
              <span style={{ marginLeft: '0.5rem', color: '#9CA3AF' }}>· Updated {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            )}
          </p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <FilterPills
            categorySlug={params.category}
            industries={INDUSTRY_TAGS as unknown as string[]}
            activeIndustrySlug={params.industry}
          />
        </div>

        {agents.length === 0 ? (
          <div style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '3rem', textAlign: 'center' }}>
            <p style={{ color: '#6B7280', marginBottom: '1rem' }}>No agents indexed for this category and industry yet.</p>
            <Link href={'/' + params.category} style={{ color: '#2563EB', fontSize: '0.9375rem' }}>
              Browse all {categoryLabel} →
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {agents.map((agent, i) => (
              <div key={agent.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ flexShrink: 0, width: '2rem', height: '2rem', backgroundColor: i < 3 ? '#2563EB' : '#F3F4F6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8125rem', fontWeight: 700, color: i < 3 ? 'white' : '#6B7280', marginTop: '1rem' }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <AgentCard agent={agent} />
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '4rem', borderTop: '1px solid #E5E7EB', paddingTop: '3rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '1.5rem' }}>
            Frequently asked questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <h3 style={{ fontWeight: 600, color: '#111827', marginBottom: '0.5rem', fontSize: '1rem' }}>
                What are the best {shortCat} for {industryLabel}?
              </h3>
              <p style={{ color: '#4B5563', fontSize: '0.9375rem', lineHeight: 1.7 }}>
                {agents.length > 0
                  ? 'Based on our index, the top ' + shortCat + ' for ' + industryLabel + ' are ' + agents.slice(0, 3).map(a => a.name).join(', ') + '. These are ranked by rating and capability depth across ' + agents.length + ' indexed agents.'
                  : 'The AI Agent Index tracks ' + shortCat + ' for ' + industryLabel + '. Check back as new agents are added regularly.'}
              </p>
            </div>
            <div>
              <h3 style={{ fontWeight: 600, color: '#111827', marginBottom: '0.5rem', fontSize: '1rem' }}>
                How do I choose an AI agent for {industryLabel}?
              </h3>
              <p style={{ color: '#4B5563', fontSize: '0.9375rem', lineHeight: 1.7 }}>
                When evaluating {shortCat} for {industryLabel}, consider pricing model (free vs subscription vs usage-based), deployment difficulty, integrations with your existing stack, and whether the agent specialises in {industryLabel} workflows. Every agent on this page includes structured data on all of these dimensions.
              </p>
            </div>
            <div>
              <h3 style={{ fontWeight: 600, color: '#111827', marginBottom: '0.5rem', fontSize: '1rem' }}>
                Are there free AI agents for {industryLabel}?
              </h3>
              <p style={{ color: '#4B5563', fontSize: '0.9375rem', lineHeight: 1.7 }}>
                Yes — several {shortCat} offer free or freemium plans. Use the filter pills above to narrow by pricing, or browse the full <Link href={'/' + params.category} style={{ color: '#2563EB' }}>{categoryLabel}</Link> index.
              </p>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

export async function generateStaticParams() {
  const params: { category: string; industry: string }[] = []
  for (const category of PRIMARY_CATEGORIES) {
    const categorySlug = CATEGORY_SLUGS[category]
    for (const industry of INDUSTRY_TAGS) {
      const industrySlug = INDUSTRY_SLUGS[industry]
      params.push({ category: categorySlug, industry: industrySlug })
    }
  }
  return params
}