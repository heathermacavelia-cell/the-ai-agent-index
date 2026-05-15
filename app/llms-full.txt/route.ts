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

export async function GET() {
  const supabase = createClient()

  const { data: agents, error } = await supabase
    .from('agents')
    .select('name, slug, primary_category, editorial_rating, pricing_model, starting_price, short_description, mcp_compatible')
    .eq('is_active', true)
    .order('primary_category', { ascending: true })
    .order('editorial_rating', { ascending: false })

  if (error) {
    return new Response('Failed to fetch agents', { status: 500 })
  }

  const allAgents = agents ?? []

  const byCategory: Record<string, typeof allAgents> = {}
  for (const agent of allAgents) {
    const cat = agent.primary_category
    if (!byCategory[cat]) byCategory[cat] = []
    byCategory[cat].push(agent)
  }

  const generated = new Date().toISOString()

  const sections = Object.entries(byCategory).map(([slug, catAgents]) => {
    const label = CATEGORY_LABELS[slug] ?? slug
    const categoryUrl = `https://theaiagentindex.com/${slug}`
    const header = `## ${label} (${catAgents.length} agents)\nCategory page: ${categoryUrl}`

    const lines = catAgents.map(a => {
      const rating = a.editorial_rating != null ? Number(a.editorial_rating).toFixed(1) : 'unrated'
      const price = a.starting_price ? `$${a.starting_price}/mo` : (a.pricing_model ?? 'custom')
      const mcp = a.mcp_compatible === true ? ' | MCP-compatible' : ''
      return `### ${a.name}\n- URL: https://theaiagentindex.com/agents/${a.slug}\n- Editorial rating: ${rating}/5\n- Pricing: ${price}${mcp}\n- ${a.short_description}`
    }).join('\n\n')

    return `${header}\n\n${lines}`
  }).join('\n\n---\n\n')

  const content = `# The AI Agent Index — Full Agent Directory

> Complete listing of all ${allAgents.length} active AI agents indexed at theaiagentindex.com.
> Compact overview: https://theaiagentindex.com/llms.txt
> Structured JSON API: https://theaiagentindex.com/api/agents
> Last generated: ${generated}

---

${sections}
`

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}