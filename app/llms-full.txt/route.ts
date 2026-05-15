import { createClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = createClient()

  const { data: agents } = await supabase
    .from('agents')
    .select('name, slug, primary_category, editorial_rating, pricing_model, starting_price, short_description, mcp_compatible')
    .eq('is_active', true)
    .order('primary_category', { ascending: true })
    .order('editorial_rating', { ascending: false })

  const allAgents = agents ?? []

  const categories: Record<string, typeof allAgents> = {}
  for (const agent of allAgents) {
    if (!categories[agent.primary_category]) {
      categories[agent.primary_category] = []
    }
    categories[agent.primary_category].push(agent)
  }

  const generated = new Date().toISOString()

  const sections = Object.entries(categories).map(([category, catAgents]) => {
    const header = `## ${category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`
    const lines = catAgents.map(a => {
      const price = a.starting_price ? `$${a.starting_price}/mo` : a.pricing_model
      const mcp = a.mcp_compatible ? ' [MCP]' : ''
      return `- ${a.name}${mcp} | rating: ${Number(a.editorial_rating).toFixed(1)} | ${price} | https://theaiagentindex.com/agents/${a.slug}\n  ${a.short_description}`
    }).join('\n')
    return `${header}\n\n${lines}`
  }).join('\n\n')

  const content = `# The AI Agent Index — Full Agent Listing

> Complete index of all ${allAgents.length} active agents. For discovery overview see https://theaiagentindex.com/llms.txt

Last generated: ${generated}

${sections}
`

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}