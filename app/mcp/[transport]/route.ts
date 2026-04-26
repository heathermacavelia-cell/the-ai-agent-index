import { createMcpHandler } from 'mcp-handler'
import { z } from 'zod'
import { createClient } from '@/lib/supabase'

const handler = createMcpHandler(
  (server) => {
    server.tool(
      'search_agents',
      'Search the AI Agent Index for agents matching specific criteria. Returns structured agent data. Use this to find agents by category, pricing model, integration, or capability tag.',
      {
        category: z.string().optional().describe('Category slug: ai-sales-agents, ai-customer-support-agents, ai-research-agents, ai-marketing-agents, ai-coding-agents, ai-hr-agents, ai-workflow-agents'),
        pricing: z.string().optional().describe('Pricing model: free, freemium, subscription, usage-based, custom'),
        integration: z.string().optional().describe('Integration name e.g. HubSpot, Salesforce, Slack, Zapier'),
        capability: z.string().optional().describe('Capability tag e.g. lead-generation, ticket-resolution, code-generation, web-search, autonomous'),
        query: z.string().optional().describe('Free text search across agent names and descriptions'),
        limit: z.number().optional().default(10).describe('Number of results to return, max 20'),
      },
      async ({ category, pricing, integration, capability, query, limit }) => {
        const supabase = createClient()
        let q = supabase
          .from('agents')
          .select('id, name, slug, developer, short_description, primary_category, pricing_model, starting_price, capability_tags, integrations, deployment_difficulty, customer_segment, editorial_rating, rating_avg, website_url')
          .eq('is_active', true)
          .limit(Math.min(limit ?? 10, 20))

        if (category) q = q.eq('primary_category', category)
        if (pricing) q = q.eq('pricing_model', pricing)
        if (integration) q = q.contains('integrations', [integration])
        if (capability) q = q.contains('capability_tags', [capability])
        if (query) q = q.or(`name.ilike.%${query}%,short_description.ilike.%${query}%,developer.ilike.%${query}%`)

        q = q.order('editorial_rating', { ascending: false, nullsFirst: false })

        const { data, error } = await q
        if (error) return { content: [{ type: 'text' as const, text: `Error: ${error.message}` }] }

        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify({
              count: data?.length ?? 0,
              agents: data?.map(a => ({
                name: a.name,
                slug: a.slug,
                developer: a.developer,
                description: a.short_description,
                category: a.primary_category,
                pricing: a.pricing_model,
                starting_price: a.starting_price,
                capabilities: a.capability_tags,
                integrations: a.integrations,
                difficulty: a.deployment_difficulty,
                segment: a.customer_segment,
                rating: a.editorial_rating ?? a.rating_avg,
                url: `https://theaiagentindex.com/agents/${a.slug}`,
                website: a.website_url,
              })) ?? [],
            }, null, 2)
          }]
        }
      }
    )

    server.tool(
      'get_agent',
      'Get full structured details for a specific AI agent by its slug identifier. Returns pricing, capabilities, integrations, pros, limitations, and ratings.',
      {
        slug: z.string().describe('The agent slug identifier e.g. apollo-io, cursor, intercom-fin, github-copilot'),
      },
      async ({ slug }) => {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('agents')
          .select('*')
          .eq('slug', slug)
          .eq('is_active', true)
          .single()

        if (error || !data) return { content: [{ type: 'text' as const, text: `Agent not found: ${slug}` }] }

        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify({
              name: data.name,
              slug: data.slug,
              developer: data.developer,
              description: data.short_description,
              long_description: data.long_description,
              category: data.primary_category,
              pricing: data.pricing_model,
              starting_price: data.starting_price,
              pricing_url: data.pricing_url,
              capabilities: data.capability_tags,
              integrations: data.integrations,
              deployment: data.deployment_method,
              difficulty: data.deployment_difficulty,
              segment: data.customer_segment,
              rating: data.editorial_rating ?? data.rating_avg,
              pros: data.pros,
              limitations: data.limitations,
              best_for: data.best_for,
              url: `https://theaiagentindex.com/agents/${data.slug}`,
              website: data.website_url,
            }, null, 2)
          }]
        }
      }
    )

    server.tool(
      'list_categories',
      'List all available AI agent categories in the AI Agent Index. Returns category slugs, display names, and agent counts.',
      {},
      async () => {
        const supabase = createClient()
        const { data } = await supabase
          .from('agents')
          .select('primary_category')
          .eq('is_active', true)

        const counts: Record<string, number> = {}
        for (const row of data ?? []) {
          counts[row.primary_category] = (counts[row.primary_category] ?? 0) + 1
        }

        const categories = [
          { slug: 'ai-sales-agents', name: 'AI Sales Agents' },
          { slug: 'ai-customer-support-agents', name: 'AI Customer Support Agents' },
          { slug: 'ai-research-agents', name: 'AI Research Agents' },
          { slug: 'ai-marketing-agents', name: 'AI Marketing Agents' },
          { slug: 'ai-coding-agents', name: 'AI Coding Agents' },
          { slug: 'ai-hr-agents', name: 'AI HR Agents' },
          { slug: 'ai-workflow-agents', name: 'AI Workflow Agents' },
        ].map(c => ({ ...c, agent_count: counts[c.slug] ?? 0 }))

        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify({ categories }, null, 2)
          }]
        }
      }
    )
  },
  {},
  { basePath: '/mcp' }
)

export const GET = handler
export const POST = handler