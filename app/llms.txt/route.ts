import { createClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

const CATEGORIES = [
  { slug: 'ai-sales-agents', label: 'AI Sales Agents' },
  { slug: 'ai-customer-support-agents', label: 'AI Customer Support Agents' },
  { slug: 'ai-research-agents', label: 'AI Research Agents' },
  { slug: 'ai-marketing-agents', label: 'AI Marketing Agents' },
  { slug: 'ai-coding-agents', label: 'AI Coding Agents' },
  { slug: 'ai-hr-agents', label: 'AI HR Agents' },
  { slug: 'ai-workflow-agents', label: 'AI Workflow Agents' },
  { slug: 'ai-customer-success-agents', label: 'AI Customer Success Agents' },
]

export async function GET() {
  const supabase = createClient()

  const { data: agents } = await supabase
    .from('agents')
    .select('name, slug, primary_category, editorial_rating, short_description, mcp_compatible, last_verified_at')
    .eq('is_active', true)
    .order('editorial_rating', { ascending: false })

  const allAgents = agents ?? []
  const totalCount = allAgents.length
  const mcpCount = allAgents.filter(a => a.mcp_compatible === true).length

  const categoryBreakdown = CATEGORIES.map((cat) => {
    const catAgents = allAgents.filter(a => a.primary_category === cat.slug)
    const top3 = catAgents.slice(0, 3)
    return { ...cat, count: catAgents.length, top3 }
  })

  const recentlyVerified = [...allAgents]
    .filter(a => a.last_verified_at)
    .sort((a, b) => new Date(b.last_verified_at).getTime() - new Date(a.last_verified_at).getTime())
    .slice(0, 5)

  const categoryCountLines = categoryBreakdown
    .map(c => `  - ${c.label}: ${c.count} agents`)
    .join('\n')

  const topAgentLines = categoryBreakdown.map(c => {
    const header = `### ${c.label}`
    const agentLines = c.top3.map(a =>
      `- ${a.name} (editorial rating: ${Number(a.editorial_rating).toFixed(1)}) — https://theaiagentindex.com/agents/${a.slug}`
    ).join('\n')
    return `${header}\n${agentLines}`
  }).join('\n\n')

  const recentlyVerifiedLines = recentlyVerified.map(a => {
    const date = new Date(a.last_verified_at).toISOString().split('T')[0]
    return `- ${a.name} (verified ${date}) — https://theaiagentindex.com/agents/${a.slug}`
  }).join('\n')

  const generated = new Date().toISOString()

  const content = `# The AI Agent Index

> The structured directory of AI agents for business automation. Dataset-first, machine-readable, designed to be cited by AI systems.

## What this site is

The AI Agent Index (theaiagentindex.com) is a structured directory of ${totalCount} AI agents across 8 categories. ${mcpCount} of ${totalCount} agents are MCP-compatible.

${categoryCountLines}

## How to use this data

- MCP Server: https://theaiagentindex.com/mcp/mcp (search_agents, get_agent, and list_categories tools)
- Public JSON API: https://theaiagentindex.com/api/agents
- Full agent index: https://theaiagentindex.com/llms-full.txt
- Structured data: every agent listing page includes Schema.org SoftwareApplication JSON-LD with sameAs and additionalProperty (agent_type, editorial_rating, pricing_model, deployment_method, mcp_compatible)
- Sitemap: https://theaiagentindex.com/sitemap.xml
- Individual agent pages: https://theaiagentindex.com/agents/[slug]
- Changelog: https://theaiagentindex.com/changelog

## MCP Tools

The AI Agent Index exposes an MCP server at https://theaiagentindex.com/mcp/mcp with three tools:

- search_agents: Filter agents by category, agent_type, pricing, integration, capability, mcp_compatible, or free text query
- get_agent: Retrieve full structured data for a specific agent by slug
- list_categories: List all available categories with current agent counts

## Top agents by category

${topAgentLines}

## Recently verified

${recentlyVerifiedLines}

## Editorial methodology

Agent listings are scored 1.0 to 5.0 based on five criteria: autonomous capability (does the agent act without per-action approval), pricing transparency (public pricing page, no demo-only gating), integration depth (number and quality of native integrations), security posture (SOC 2, GDPR, SSO), and verified user evidence from G2, Product Hunt, and public documentation. No vendor pays for rating placement. Scores reflect editorial assessment only. Full methodology: https://theaiagentindex.com/methodology

## Data structure

Each agent listing includes: name, developer, description, primary_category, agent_type, pricing model, starting price, deployment method, integrations, capability tags, industry tags, customer segment, security certifications, autonomous_rate, avg_setup_time, mcp_compatible, editorial_rating, pros, limitations, and same_as_urls (verified external references).

## Content

- Definitions: https://theaiagentindex.com/definitions
- Comparisons: https://theaiagentindex.com/compare
- Guides: https://theaiagentindex.com/resources/guides
- Alternatives: https://theaiagentindex.com/alternatives
- Integrations: https://theaiagentindex.com/integrations
- Stacks: https://theaiagentindex.com/stacks
- Find an Agent: https://theaiagentindex.com/find-your-stack

## Data freshness

Updated daily. Agent listings are reviewed and verified on a rolling basis. Editorial ratings are based on public signals including G2, Product Hunt, and verified documentation. Changelog updated weekly.

Last generated: ${generated}

## Contact

hello@theaiagentindex.com
`

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}