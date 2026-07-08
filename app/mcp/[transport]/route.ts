import { createMcpHandler } from 'mcp-handler'
import { z } from 'zod'
import { createClient } from '@/lib/supabase'

const handler = createMcpHandler(
  (server) => {
    // ============================================================
    // search_agents
    // ============================================================
    server.registerTool(
      'search_agents',
      {
        title: 'Search AI Agents',
        description: 'Search the AI Agent Index for agents matching specific criteria. Returns structured agent data. Use this to find agents by category, sub-type, pricing model, integration, capability tag, or MCP role (mcp=server finds agents that expose an MCP server).',
        inputSchema: {
          category: z.string().optional().describe('Category slug: ai-sales-agents, ai-customer-support-agents, ai-research-agents, ai-marketing-agents, ai-coding-agents, ai-hr-agents, ai-workflow-agents, ai-customer-success-agents'),
          agent_type: z.string().optional().describe('Sub-type within a category for precise matching. Examples: prospecting, ai-sdr, crm, sales-engagement (sales); helpdesk, ticket-resolution, chatbot, voice-agent (support); academic-research, deep-research, vertical-research (research); paid-media, seo, content-creation, social-media, email-marketing (marketing); ide-assistant, autonomous-engineer, terminal-agent, vibe-coding (coding); recruiting, hris, interviewing, hr-automation (hr); workflow-builder, multi-agent-orchestration, knowledge-management, browser-automation, office-agents (workflow). Use list_categories first if unsure of available types.'),
          pricing: z.string().optional().describe('Pricing model: free, freemium, subscription, usage-based, custom'),
          integration: z.string().optional().describe('Integration name e.g. HubSpot, Salesforce, Slack, Zapier'),
          capability: z.string().optional().describe('Capability tag e.g. lead-generation, ticket-resolution, code-generation, web-search, autonomous'),
          mcp: z.string().optional().describe('MCP role: server (product exposes an MCP server agents can connect to), client (connects out to external servers), both, or none'),
          query: z.string().optional().describe('Free text search across agent names and descriptions'),
          limit: z.number().optional().default(10).describe('Number of results to return, max 20'),
        },
        outputSchema: {
          count: z.number().describe('Number of agents returned'),
          agents: z.array(z.object({
            name: z.string(),
            slug: z.string(),
            developer: z.string(),
            description: z.string().nullable(),
            category: z.string().nullable(),
            agent_type: z.string().nullable(),
            pricing: z.string().nullable(),
            starting_price: z.number().nullable(),
            capabilities: z.array(z.string()).nullable(),
            integrations: z.array(z.string()).nullable(),
            difficulty: z.string().nullable(),
            segment: z.string().nullable(),
            rating: z.number().nullable(),
            mcp_compatible: z.boolean().nullable(),
            mcp_status: z.string().nullable(),
            url: z.string(),
            website: z.string().nullable(),
          })).describe('Array of matching agents with full structured details'),
        },
        annotations: {
          title: 'Search AI Agents',
          readOnlyHint: true,
          idempotentHint: true,
          destructiveHint: false,
          openWorldHint: false,
        },
      },
      async ({ category, agent_type, pricing, integration, capability, query, limit, mcp }) => {
        const supabase = createClient()
        let q = supabase
          .from('agents')
          .select('id, name, slug, developer, short_description, primary_category, agent_type, pricing_model, starting_price, capability_tags, integrations, deployment_difficulty, customer_segment, editorial_rating, rating_avg, website_url, mcp_compatible, mcp_status')
          .eq('is_active', true)
          .limit(Math.min(limit ?? 10, 20))

        if (category) q = q.eq('primary_category', category)
        if (agent_type) q = q.eq('agent_type', agent_type)
        if (pricing) q = q.eq('pricing_model', pricing)
        if (integration) q = q.contains('integrations', [integration])
          if (capability) q = q.contains('capability_tags', [capability])
            if (mcp) q = q.eq('mcp_status', mcp)
        if (query) q = q.or(`name.ilike.%${query}%,short_description.ilike.%${query}%,developer.ilike.%${query}%`)

        q = q.order('editorial_rating', { ascending: false, nullsFirst: false })

        const { data, error } = await q
        if (error) {
          return { content: [{ type: 'text' as const, text: `Error: ${error.message}` }], isError: true }
        }

        const agents = (data ?? []).map(a => ({
          name: a.name, slug: a.slug, developer: a.developer, description: a.short_description,
          category: a.primary_category, agent_type: a.agent_type, pricing: a.pricing_model,
          starting_price: a.starting_price, capabilities: a.capability_tags, integrations: a.integrations,
          difficulty: a.deployment_difficulty, segment: a.customer_segment,
          rating: a.editorial_rating ?? a.rating_avg, mcp_compatible: a.mcp_compatible, mcp_status: a.mcp_status,
          url: `https://theaiagentindex.com/agents/${a.slug}`, website: a.website_url,
        }))

        const result = { count: agents.length, agents }
        return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }], structuredContent: result }
      }
    )

    // ============================================================
    // get_agent
    // ============================================================
    server.registerTool(
      'get_agent',
      {
        title: 'Get Agent Details',
        description: 'Get full structured details for a specific AI agent by its slug identifier. Returns pricing, capabilities, integrations, agent_type, pros, limitations, buyer decision fields, and ratings.',
        inputSchema: {
          slug: z.string().describe('The agent slug identifier e.g. apollo-io, cursor, intercom-fin, github-copilot'),
        },
        outputSchema: {
          name: z.string(), slug: z.string(), developer: z.string(),
          description: z.string().nullable(), long_description: z.string().nullable(),
          category: z.string().nullable(), agent_type: z.string().nullable(),
          pricing: z.string().nullable(), starting_price: z.number().nullable(),
          pricing_url: z.string().nullable(), pricing_transparency: z.string().nullable(),
          contract_type: z.string().nullable(), data_training: z.string().nullable(),
          human_in_loop: z.string().nullable(), mcp_compatible: z.boolean().nullable(), mcp_status: z.string().nullable(),
          capabilities: z.array(z.string()).nullable(), integrations: z.array(z.string()).nullable(),
          deployment: z.array(z.string()).nullable(), difficulty: z.string().nullable(),
          segment: z.string().nullable(), security_certifications: z.array(z.string()).nullable(),
          rating: z.number().nullable(), editorial_rating_notes: z.string().nullable(),
          pros: z.array(z.string()).nullable(), limitations: z.array(z.string()).nullable(),
          best_for: z.string().nullable(), g2_rating: z.number().nullable(),
          g2_review_count: z.number().nullable(), last_verified_at: z.string().nullable(),
          url: z.string(), website: z.string().nullable(),
        },
        annotations: { title: 'Get Agent Details', readOnlyHint: true, idempotentHint: true, destructiveHint: false, openWorldHint: false },
      },
      async ({ slug }) => {
        const supabase = createClient()
        const { data, error } = await supabase.from('agents').select('*').eq('slug', slug).eq('is_active', true).single()

        if (error || !data) {
          return { content: [{ type: 'text' as const, text: `Agent not found: ${slug}` }], isError: true }
        }

        const result = {
          name: data.name, slug: data.slug, developer: data.developer,
          description: data.short_description, long_description: data.long_description,
          category: data.primary_category, agent_type: data.agent_type,
          pricing: data.pricing_model, starting_price: data.starting_price,
          pricing_url: data.pricing_url, pricing_transparency: data.pricing_transparency,
          contract_type: data.contract_type, data_training: data.data_training,
          human_in_loop: data.human_in_loop, mcp_compatible: data.mcp_compatible, mcp_status: data.mcp_status,
          capabilities: data.capability_tags, integrations: data.integrations,
          deployment: data.deployment_method, difficulty: data.deployment_difficulty,
          segment: data.customer_segment, security_certifications: data.security_certifications,
          rating: data.editorial_rating ?? data.rating_avg,
          editorial_rating_notes: data.editorial_rating_notes,
          pros: data.pros, limitations: data.limitations, best_for: data.best_for,
          g2_rating: data.g2_rating, g2_review_count: data.g2_review_count,
          last_verified_at: data.last_verified_at,
          url: `https://theaiagentindex.com/agents/${data.slug}`, website: data.website_url,
        }

        return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }], structuredContent: result }
      }
    )

    // ============================================================
    // list_categories
    // ============================================================
    server.registerTool(
      'list_categories',
      {
        title: 'List Categories',
        description: 'List all available categories in the AI Agent Index, including AI agent software categories and the AI Automation Agencies services directory. Returns slugs, display names, and counts.',
        inputSchema: {},
        outputSchema: {
          categories: z.array(z.object({
            slug: z.string(), name: z.string(), type: z.string(), count: z.number(),
          })).describe('All categories with slugs, display names, type (agents or agencies), and counts'),
        },
        annotations: { title: 'List Categories', readOnlyHint: true, idempotentHint: true, destructiveHint: false, openWorldHint: false },
      },
      async () => {
        const supabase = createClient()
        const { data: agentData } = await supabase.from('agents').select('primary_category').eq('is_active', true)
        const { data: agencyData } = await supabase.from('agencies').select('id').eq('is_active', true)

        const counts: Record<string, number> = {}
        for (const row of agentData ?? []) {
          counts[row.primary_category] = (counts[row.primary_category] ?? 0) + 1
        }

        const categories = [
          { slug: 'ai-sales-agents', name: 'AI Sales Agents', type: 'agents' },
          { slug: 'ai-customer-support-agents', name: 'AI Customer Support Agents', type: 'agents' },
          { slug: 'ai-research-agents', name: 'AI Research Agents', type: 'agents' },
          { slug: 'ai-marketing-agents', name: 'AI Marketing Agents', type: 'agents' },
          { slug: 'ai-coding-agents', name: 'AI Coding Agents', type: 'agents' },
          { slug: 'ai-hr-agents', name: 'AI HR Agents', type: 'agents' },
          { slug: 'ai-workflow-agents', name: 'AI Workflow Agents', type: 'agents' },
          { slug: 'ai-customer-success-agents', name: 'AI Customer Success Agents', type: 'agents' },
          { slug: 'ai-automation-agencies', name: 'AI Automation Agencies', type: 'agencies' },
        ].map(c => ({ ...c, count: c.type === 'agencies' ? (agencyData ?? []).length : (counts[c.slug] ?? 0) }))

        const result = { categories }
        return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }], structuredContent: result }
      }
    )

    // ============================================================
    // search_agencies
    // ============================================================
    server.registerTool(
      'search_agencies',
      {
        title: 'Search AI Automation Agencies',
        description: 'Search the AI Agent Index for AI automation agencies (services firms that build AI solutions for clients). Filter by service type, industry, tools, or region.',
        inputSchema: {
          service: z.string().optional().describe('Service tag: ai-agent-building, workflow-automation, ai-strategy, chatbot-development, custom-integrations, voice-agents, rag-development, data-pipeline, prompt-engineering, ai-training'),
          industry: z.string().optional().describe('Industry served e.g. SaaS, Finance, Healthcare, Manufacturing'),
          tool: z.string().optional().describe('Tool or platform specialization e.g. openai, anthropic, langchain, make, n8n, zapier'),
          region: z.string().optional().describe('Region served e.g. North America, Europe, Global / Remote'),
          query: z.string().optional().describe('Free text search across agency names and descriptions'),
          limit: z.number().optional().default(10).describe('Number of results to return, max 20'),
        },
        outputSchema: {
          count: z.number().describe('Number of agencies returned'),
          agencies: z.array(z.object({
            name: z.string(),
            slug: z.string(),
            description: z.string(),
            headquarters: z.string().nullable(),
            team_size: z.string().nullable(),
            services: z.array(z.string()),
            industries: z.array(z.string()),
            tools: z.array(z.string()),
            pricing_model: z.string().nullable(),
            hourly_rate: z.string().nullable(),
            min_budget: z.string().nullable(),
            regions: z.array(z.string()),
            rating: z.number(),
            review_count: z.number(),
            url: z.string(),
            website: z.string().nullable(),
          })).describe('Array of matching agencies'),
        },
        annotations: { title: 'Search AI Automation Agencies', readOnlyHint: true, idempotentHint: true, destructiveHint: false, openWorldHint: false },
      },
      async ({ service, industry, tool, region, query, limit }) => {
        const supabase = createClient()
        let q = supabase
          .from('agencies')
          .select('name, slug, short_description, headquarters, team_size, service_tags, industry_tags, tool_specializations, pricing_model, hourly_rate_range, minimum_project_budget, regions_served, rating_avg, rating_count, website_url')
          .eq('is_active', true)
          .limit(Math.min(limit ?? 10, 20))

        if (service) q = q.contains('service_tags', [service])
        if (industry) q = q.contains('industry_tags', [industry])
        if (tool) q = q.contains('tool_specializations', [tool])
        if (region) q = q.contains('regions_served', [region])
        if (query) q = q.or(`name.ilike.%${query}%,short_description.ilike.%${query}%`)

        q = q.order('rating_avg', { ascending: false })

        const { data, error } = await q
        if (error) {
          return { content: [{ type: 'text' as const, text: `Error: ${error.message}` }], isError: true }
        }

        const agencies = (data ?? []).map(a => ({
          name: a.name, slug: a.slug, description: a.short_description,
          headquarters: a.headquarters, team_size: a.team_size,
          services: a.service_tags ?? [], industries: a.industry_tags ?? [],
          tools: a.tool_specializations ?? [], pricing_model: a.pricing_model,
          hourly_rate: a.hourly_rate_range, min_budget: a.minimum_project_budget,
          regions: a.regions_served ?? [], rating: a.rating_avg, review_count: a.rating_count,
          url: `https://theaiagentindex.com/agencies/${a.slug}`, website: a.website_url,
        }))

        const result = { count: agencies.length, agencies }
        return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }], structuredContent: result }
      }
    )

    // ============================================================
    // get_agency
    // ============================================================
    server.registerTool(
      'get_agency',
      {
        title: 'Get Agency Details',
        description: 'Get full structured details for a specific AI automation agency by its slug identifier.',
        inputSchema: {
          slug: z.string().describe('The agency slug identifier e.g. taycon-ai'),
        },
        outputSchema: {
          name: z.string(), slug: z.string(), description: z.string(),
          long_description: z.string().nullable(), headquarters: z.string().nullable(),
          team_size: z.string().nullable(), company_type: z.string().nullable(),
          services: z.array(z.string()), industries: z.array(z.string()),
          tools: z.array(z.string()), pricing_model: z.string().nullable(),
          hourly_rate: z.string().nullable(), min_budget: z.string().nullable(),
          regions: z.array(z.string()), clients: z.array(z.string()),
          rating: z.number(), review_count: z.number(),
          url: z.string(), website: z.string().nullable(),
        },
        annotations: { title: 'Get Agency Details', readOnlyHint: true, idempotentHint: true, destructiveHint: false, openWorldHint: false },
      },
      async ({ slug }) => {
        const supabase = createClient()
        const { data, error } = await supabase.from('agencies').select('*').eq('slug', slug).eq('is_active', true).single()

        if (error || !data) {
          return { content: [{ type: 'text' as const, text: `Agency not found: ${slug}` }], isError: true }
        }

        const result = {
          name: data.name, slug: data.slug, description: data.short_description,
          long_description: data.long_description, headquarters: data.headquarters,
          team_size: data.team_size, company_type: data.company_type,
          services: data.service_tags ?? [], industries: data.industry_tags ?? [],
          tools: data.tool_specializations ?? [], pricing_model: data.pricing_model,
          hourly_rate: data.hourly_rate_range, min_budget: data.minimum_project_budget,
          regions: data.regions_served ?? [], clients: data.client_segments ?? [],
          rating: data.rating_avg, review_count: data.rating_count,
          url: `https://theaiagentindex.com/agencies/${data.slug}`, website: data.website_url,
        }

        return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }], structuredContent: result }
      }
    )
  },
  {},
  { basePath: '/mcp' }
)

export const GET = handler
export const POST = handler