import { createClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

const CATEGORY_LABELS: Record<string, string> = {
  'ai-sales-agents': 'AI Sales Agents',
  'ai-customer-support-agents': 'AI Customer Support Agents',
  'ai-research-agents': 'AI Research Agents',
  'ai-marketing-agents': 'AI Marketing Agents',
  'ai-coding-agents': 'AI Coding Agents',
  'ai-hr-agents': 'AI HR Agents',
  'ai-workflow-agents': 'AI Workflow Agents',
  'ai-customer-success-agents': 'AI Customer Success Agents',
}

const SERVICE_LABELS: Record<string, string> = {
  'ai-agent-building': 'AI Agent Building', 'workflow-automation': 'Workflow Automation',
  'ai-strategy': 'AI Strategy', 'chatbot-development': 'Chatbot Development',
  'data-pipeline': 'Data Pipeline', 'ai-training': 'AI Training',
  'prompt-engineering': 'Prompt Engineering', 'custom-integrations': 'Custom Integrations',
  'voice-agents': 'Voice Agents', 'rag-development': 'RAG Development',
}

export async function GET() {
  const supabase = createClient()

  const { data: agents, error: agentsError } = await supabase
    .from('agents')
    .select('name, slug, primary_category, editorial_rating, pricing_model, starting_price, billing_period, short_description, mcp_status, mcp_compatible, pricing_transparency, contract_type, data_training, human_in_loop')
    .eq('is_active', true)
    .order('primary_category', { ascending: true })
    .order('editorial_rating', { ascending: false })

  const { data: agencies, error: agenciesError } = await supabase
    .from('agencies')
    .select('name, slug, headquarters, team_size, company_type, service_tags, industry_tags, tool_specializations, pricing_model, hourly_rate_range, minimum_project_budget, regions_served, client_segments, short_description, clutch_rating, rating_avg, rating_count')
    .eq('is_active', true)
    .order('name', { ascending: true })

  if (agentsError) {
    return new Response('Failed to fetch agents', { status: 500 })
  }

  const allAgents = agents ?? []
  const allAgencies = agencies ?? []

  const byCategory: Record<string, typeof allAgents> = {}
  for (const agent of allAgents) {
    const cat = agent.primary_category
    if (!byCategory[cat]) byCategory[cat] = []
    byCategory[cat].push(agent)
  }

  const generated = new Date().toISOString()

  const agentSections = Object.entries(byCategory).map(([slug, catAgents]) => {
    const label = CATEGORY_LABELS[slug] ?? slug
    const categoryUrl = `https://theaiagentindex.com/${slug}`
    const header = `## ${label} (${catAgents.length} agents)\nCategory page: ${categoryUrl}`

    const lines = catAgents.map(a => {
      const rating = a.editorial_rating != null ? Number(a.editorial_rating).toFixed(1) : 'unrated'
      const price = a.starting_price
        ? `$${a.starting_price}/mo${a.billing_period === 'annual' ? ' (billed annually)' : a.billing_period === 'usage' ? ' (usage-based)' : ''}`
        : (a.pricing_model ?? 'custom')
      const mcp = a.mcp_status === 'server' ? ' | MCP server' : a.mcp_status === 'both' ? ' | MCP server+client' : a.mcp_status === 'client' ? ' | MCP client' : a.mcp_status === 'none' ? '' : (a.mcp_compatible === true ? ' | MCP-compatible' : '')
      const transparency = a.pricing_transparency ? ` | Pricing: ${a.pricing_transparency}` : ''
      const contract = a.contract_type ? ` | Contract: ${a.contract_type}` : ''
      const dataTraining = a.data_training ? ` | Data training: ${a.data_training}` : ''
      const autonomy = a.human_in_loop ? ` | Autonomy: ${a.human_in_loop}` : ''
      return `### ${a.name}\n- URL: https://theaiagentindex.com/agents/${a.slug}\n- Editorial rating: ${rating}/5\n- Pricing: ${price}${mcp}${transparency}${contract}${dataTraining}${autonomy}\n- ${a.short_description}`
    }).join('\n\n')

    return `${header}\n\n${lines}`
  }).join('\n\n---\n\n')

  const agencySection = allAgencies.length > 0 ? allAgencies.map(a => {
    const services = (a.service_tags || []).map((s: string) => SERVICE_LABELS[s] ?? s).join(', ')
    const industries = (a.industry_tags || []).join(', ')
    const tools = (a.tool_specializations || []).join(', ')
    const regions = (a.regions_served || []).join(', ')
    const clients = (a.client_segments || []).join(', ')
    const pricing = [
      a.pricing_model,
      a.hourly_rate_range,
      a.minimum_project_budget ? 'Min. ' + a.minimum_project_budget : null,
    ].filter(Boolean).join(' | ')
    const rating = a.rating_count > 0 ? `${Number(a.rating_avg).toFixed(1)}/5 (${a.rating_count} reviews)` : 'No reviews yet'
    const clutch = a.clutch_rating ? ` | Clutch: ${a.clutch_rating}/5` : ''

    return `### ${a.name}
- URL: https://theaiagentindex.com/agencies/${a.slug}
- Location: ${a.headquarters ?? 'Not specified'} | Team: ${a.team_size ?? 'Not specified'} | Type: ${a.company_type ?? 'agency'}
- Services: ${services || 'Not specified'}
- Industries: ${industries || 'Not specified'}
- Tools: ${tools || 'Not specified'}
- Pricing: ${pricing || 'Contact for pricing'}
- Regions: ${regions || 'Not specified'}
- Clients: ${clients || 'Not specified'}
- Rating: ${rating}${clutch}
- ${a.short_description}`
  }).join('\n\n') : 'No agencies listed yet.'

  const content = `# The AI Agent Index — Full Directory

> Complete listing of all ${allAgents.length} active AI agents and ${allAgencies.length} AI automation agencies indexed at theaiagentindex.com.
> Compact overview: https://theaiagentindex.com/llms.txt
> Structured JSON API (agents): https://theaiagentindex.com/api/agents
> Structured JSON API (agencies): https://theaiagentindex.com/api/agencies
> Last generated: ${generated}

---

# Part 1: AI Agents (Software Products)

${agentSections}

---

# Part 2: AI Automation Agencies (Services Directory)

Directory page: https://theaiagentindex.com/ai-automation-agencies

AI automation agencies are services firms that design, build, and deploy AI agents, workflow automations, and chatbots for businesses. Unlike the software products listed above, these are consulting and implementation partners you hire to build custom solutions.

Agency listings do not receive editorial ratings. Consumer reviews provide the trust signal. Agencies can submit for listing at https://theaiagentindex.com/submit-agency.

${agencySection}
`

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}