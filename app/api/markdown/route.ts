import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path') || '/'
  const supabase = createClient()

  let markdown = ''

  if (path === '/') {
    const { count } = await supabase.from('agents').select('slug', { count: 'exact', head: true }).eq('is_active', true)
    markdown = `# The AI Agent Index

The structured, machine-readable directory of AI agents for business automation.

Browse ${count ?? 0}+ AI agents across sales, support, research, marketing, coding, and HR.

## Categories

- [AI Sales Agents](/ai-sales-agents)
- [AI Customer Support Agents](/ai-customer-support-agents)
- [AI Research Agents](/ai-research-agents)
- [AI Marketing Agents](/ai-marketing-agents)
- [AI Coding Agents](/ai-coding-agents)
- [AI HR Agents](/ai-hr-agents)

## Resources

- [API](/api/agents) — Public JSON API
- [Guides](/resources/guides)
- [Comparisons](/compare)
- [Alternatives](/alternatives)
- [Definitions](/definitions)
- [Stacks](/stacks)

## About

The AI Agent Index is a dataset-first directory designed to be cited by AI systems. Every listing includes structured JSON-LD schema markup, editorial ratings, and verified data.

Learn more at [theaiagentindex.com](https://theaiagentindex.com)
`
  } else if (path.startsWith('/agents/')) {
    const slug = path.replace('/agents/', '')
    const { data: agent } = await supabase
      .from('agents')
      .select('name, developer, short_description, long_description, primary_category, pricing_model, starting_price, website_url, editorial_rating, best_for, pros, limitations')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (agent) {
      markdown = `# ${agent.name}

**Developer:** ${agent.developer}
**Category:** ${agent.primary_category}
**Pricing:** ${agent.pricing_model}${agent.starting_price ? ` (from $${agent.starting_price})` : ''}
${agent.editorial_rating ? `**Editorial Rating:** ${agent.editorial_rating}/10` : ''}
${agent.website_url ? `**Website:** ${agent.website_url}` : ''}

## Overview

${agent.short_description}

${agent.long_description || ''}

${agent.best_for ? `## Best For\n\n${agent.best_for}` : ''}

${agent.pros ? `## Pros\n\n${agent.pros}` : ''}

${agent.limitations ? `## Limitations\n\n${agent.limitations}` : ''}

---

View on The AI Agent Index: [theaiagentindex.com/agents/${slug}](https://theaiagentindex.com/agents/${slug})
`
    } else {
      markdown = `# Not Found\n\nNo agent found at this path.`
    }
  } else {
    markdown = `# The AI Agent Index\n\nVisit [theaiagentindex.com](https://theaiagentindex.com) for the full directory of AI agents.`
  }

  return new NextResponse(markdown, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  })
}