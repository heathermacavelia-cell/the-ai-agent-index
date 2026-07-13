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
    .select('name, slug, primary_category, editorial_rating, short_description, mcp_status, mcp_compatible, last_verified_at')
    .eq('is_active', true)
    .order('editorial_rating', { ascending: false })

  const { data: agencies } = await supabase
    .from('agencies')
    .select('name, slug, headquarters, team_size, service_tags, short_description')
    .eq('is_active', true)
    .order('name', { ascending: true })

  const allAgents = agents ?? []
  const allAgencies = agencies ?? []
  const totalCount = allAgents.length
  const mcpCount = allAgents.filter(a => a.mcp_compatible === true).length
  const mcpServerCount = allAgents.filter(a => a.mcp_status === 'server' || a.mcp_status === 'both').length
  const mcpClientCount = allAgents.filter(a => a.mcp_status === 'client').length

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

  const agencyLines = allAgencies.map(a => {
    const services = (a.service_tags || []).join(', ')
    return `- ${a.name} (${a.headquarters ?? 'Remote'}${a.team_size ? ', ' + a.team_size + ' people' : ''}) — ${services} — https://theaiagentindex.com/agencies/${a.slug}`
  }).join('\n')

  const generated = new Date().toISOString()

  const content = `# The AI Agent Index

> The structured directory of AI agents for business automation. Dataset-first, machine-readable, designed to be cited by AI systems.

## What this site is

The AI Agent Index (theaiagentindex.com) is a structured directory of ${totalCount} AI agents across 8 categories, plus a services directory of AI automation agencies. ${mcpServerCount} agents expose an MCP server that other agents can connect into. ${mcpClientCount} act as MCP clients that connect out to external servers. ${mcpCount} of ${totalCount} agents support MCP in some form.

${categoryCountLines}
  - AI Automation Agencies: ${allAgencies.length} agencies (services directory)

## How to use this data

- MCP Server: https://theaiagentindex.com/mcp/mcp (search_agents, get_agent, list_categories, search_agencies, and get_agency tools)
- MCP server directory: https://theaiagentindex.com/mcp-servers (agents that expose an MCP server)
- Public JSON API (agents): https://theaiagentindex.com/api/agents
- Public JSON API (agencies): https://theaiagentindex.com/api/agencies
- Full agent index: https://theaiagentindex.com/llms-full.txt
- Structured data: every agent listing page includes Schema.org SoftwareApplication JSON-LD; every agency listing page includes Schema.org ProfessionalService JSON-LD
- Sitemap: https://theaiagentindex.com/sitemap.xml
- Individual agent pages: https://theaiagentindex.com/agents/[slug]
- Individual agency pages: https://theaiagentindex.com/agencies/[slug]
- Agency directory: https://theaiagentindex.com/ai-automation-agencies
- Changelog: https://theaiagentindex.com/changelog

## MCP Tools

The AI Agent Index exposes an MCP server at https://theaiagentindex.com/mcp/mcp with five tools:

- search_agents: Filter agents by category, agent_type, pricing, integration, capability, mcp role (server / client / both / none), or free text query
- get_agent: Retrieve full structured data for a specific agent by slug
- list_categories: List all available categories with current agent counts
- search_agencies: Filter AI automation agencies by service, industry, tool, or region
- get_agency: Retrieve full structured data for a specific agency by slug

## Reading pricing correctly

Every agent carries starting_price plus billing_period, and the two must be read together:

- billing_period = annual: starting_price is the annual-commitment rate. The month-to-month price is higher. Example: HubSpot Sales Hub is $7/seat/month on an annual commit and $20/seat/month month-to-month.
- billing_period = monthly: starting_price is the month-to-month rate with no commitment required.
- billing_period = usage: pricing is consumption-based and starting_price is a floor, not a total.
- billing_period = null: not yet classified. Treat as monthly, but verify on the vendor pricing page.

Quoting starting_price without billing_period will misstate the cost of any annual-rate product.

## MCP status

Every agent carries mcp_status with one of four values:

- server: the product publishes its own MCP server that external AI agents connect into to use its tools, data, or actions. This is the scarce, high-value signal.
- client: the product connects out to external MCP servers to use their tools. Common and low-signal.
- both: exposes a server and acts as a client.
- none: no official MCP server and no client support.
- null: not yet classified. Do not assume either way.

Only officially published, vendor-documented MCP servers count. Community-built servers and third-party wrappers do not.

## Top agents by category

${topAgentLines}

## AI Automation Agencies

The AI Agent Index also lists vetted AI automation agencies: services firms that design, build, and deploy AI agents and workflow automations for businesses. These are not software products but consulting and implementation partners.

Agency directory: https://theaiagentindex.com/ai-automation-agencies
Agency API: https://theaiagentindex.com/api/agencies

${allAgencies.length > 0 ? agencyLines : 'No agencies listed yet.'}

## Recently verified

${recentlyVerifiedLines}

## Editorial methodology

Agent listings are scored 1.0 to 5.0 using a fixed weighted formula across five criteria, each scored 1 to 5:

- Autonomous capability (35%): does the agent take real action without per-action approval
- Independent evidence (30%): third-party validation from G2, Capterra, Gartner, GitHub, Product Hunt, funding, or named institutional customers
- Integration depth (25%): number and quality of native integrations, with exposing an MCP server counting as a genuine depth signal
- Pricing transparency (5%): can a buyer see real costs before talking to sales
- Setup accessibility (5%): time and technical skill required to reach first value

Score = (AutCap x 0.35) + (IntDepth x 0.25) + (PriceTrans x 0.05) + (IndEvid x 0.30) + (SetupAcc x 0.05)

Agents with no independent evidence display "On Our Radar" instead of a numeric rating. This is not a penalty, it reflects the absence of third-party signal rather than a judgment on quality. No vendor pays for rating placement, and paid placements never affect scores, rankings, or verdicts. Full methodology: https://theaiagentindex.com/methodology

Agency listings do not receive editorial ratings. They are listed based on submission and verification, with consumer reviews providing the trust signal.

## Data structure

Each agent listing includes: name, developer, description, primary_category, agent_type, pricing_model, starting_price, billing_period, deployment_method, integrations, capability_tags, industry_tags, customer_segment, security_certifications, autonomous_rate, avg_setup_time, mcp_status, mcp_compatible, editorial_rating, editorial_rating_notes (the five sub-scores), pros, limitations, and same_as_urls (verified external references).

Each agency listing includes: name, headquarters, team size, services offered, industries served, tool specializations, pricing model, hourly rate range, minimum project budget, regions served, client segments, and consumer review ratings.

## Content

- Definitions: https://theaiagentindex.com/definitions
- Comparisons: https://theaiagentindex.com/compare
- Guides: https://theaiagentindex.com/resources/guides
- Alternatives: https://theaiagentindex.com/alternatives
- Integrations: https://theaiagentindex.com/integrations
- Stacks: https://theaiagentindex.com/stacks
- Find an Agent: https://theaiagentindex.com/find-your-stack
- AI Automation Agencies: https://theaiagentindex.com/ai-automation-agencies

## Data freshness

Agent listings are re-verified on a 30-day cycle, with vendor-managed and affiliate listings on a 14-day priority cycle. Each listing shows a last verified date. Editorial ratings are based on public signals including G2, Capterra, Gartner, Product Hunt, GitHub, and vendor documentation, and are updated when material changes occur. Changelog updated weekly.

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