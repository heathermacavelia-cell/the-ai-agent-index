import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// ============================================================
// Template resolution
// ============================================================
// long_description, pros, limitations, and best_for contain
// {{slug.starting_price}} and {{github_stars}} templates. They must be
// resolved before serving, or AI consumers receive raw placeholders.

const PRICE_VAR_REGEX = /\{\{([a-z0-9-]+)\.starting_price\}\}/g

interface PriceInfo {
  starting_price: number | null
  pricing_model: string | null
  billing_period: string | null
}

function formatStars(stars: number): string {
  if (stars >= 1000) {
    const k = stars / 1000
    return (k >= 100 ? Math.round(k).toString() : k.toFixed(1).replace(/\.0$/, '')) + 'k'
  }
  return String(stars)
}

function formatPrice(info: PriceInfo): string {
  if (info.starting_price === 0 || info.pricing_model === 'free') return 'free'
  if (info.starting_price == null) return 'custom pricing'
  const base = '$' + info.starting_price + '/mo'
  if (info.billing_period === 'annual') return base + ' billed annually'
  if (info.billing_period === 'usage') return base + ' usage-based'
  return base
}

/** Human-readable price line for the agent's own pricing header. */
function selfPriceLine(agent: any): string {
  if (agent.starting_price == null || agent.starting_price === 0) {
    return agent.pricing_model ?? 'custom'
  }
  const qualifier =
    agent.billing_period === 'annual' ? ', billed annually'
    : agent.billing_period === 'usage' ? ', usage-based'
    : ''
  return `${agent.pricing_model} (from $${agent.starting_price}/mo${qualifier})`
}

async function buildResolver(
  supabase: ReturnType<typeof createClient>,
  texts: (string | null | undefined)[],
  githubStars: number | null
): Promise<(text: string) => string> {
  const slugs = new Set<string>()
  for (const t of texts) {
    if (typeof t !== 'string') continue
    for (const m of t.matchAll(PRICE_VAR_REGEX)) slugs.add(m[1])
  }

  const priceMap: Record<string, PriceInfo> = {}
  if (slugs.size > 0) {
    const { data } = await supabase
      .from('agents')
      .select('slug, starting_price, pricing_model, billing_period')
      .in('slug', [...slugs])
    for (const pa of data ?? []) {
      priceMap[pa.slug] = {
        starting_price: pa.starting_price,
        pricing_model: pa.pricing_model,
        billing_period: pa.billing_period ?? null,
      }
    }
  }

  return (text: string): string => {
    if (typeof text !== 'string') return text
    let out = text.replace(PRICE_VAR_REGEX, (match, slug) => {
      const info = priceMap[slug]
      if (!info) return match
      return formatPrice(info)
    })
    if (githubStars != null) {
      out = out.replace(/\{\{github_stars\}\}/g, formatStars(githubStars))
    }
    return out
  }
}

/** Render a text[] column as a markdown bullet list. */
function bulletList(items: string[] | null, resolve: (t: string) => string): string {
  if (!items || items.length === 0) return ''
  return items.map((i) => `- ${resolve(i)}`).join('\n')
}

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
- [AI Workflow Agents](/ai-workflow-agents)
- [AI Customer Success Agents](/ai-customer-success-agents)

## Resources

- [API](/api/agents) — Public JSON API
- [MCP Server](/mcp/mcp) — search_agents, get_agent, list_categories
- [Guides](/resources/guides)
- [Comparisons](/compare)
- [Alternatives](/alternatives)
- [Definitions](/definitions)
- [Stacks](/stacks)
- [Methodology](/methodology) — how listings are scored

## About

The AI Agent Index is a dataset-first directory designed to be cited by AI systems. Every listing includes structured JSON-LD schema markup, editorial ratings, and verified data.

Editorial ratings are scored on a 1.0 to 5.0 scale.

Learn more at [theaiagentindex.com](https://theaiagentindex.com)
`
  } else if (path.startsWith('/agents/')) {
    const slug = path.replace('/agents/', '')
    const { data: agent } = await supabase
      .from('agents')
      .select('name, developer, short_description, long_description, primary_category, pricing_model, starting_price, billing_period, website_url, editorial_rating, editorial_rating_notes, best_for, pros, limitations, mcp_status, github_stars, g2_rating, g2_review_count, last_verified_at')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (agent) {
      const resolve = await buildResolver(
        supabase,
        [agent.long_description, agent.best_for, ...(agent.pros ?? []), ...(agent.limitations ?? [])],
        typeof agent.github_stars === 'number' ? agent.github_stars : null
      )

      // "On Our Radar" listings have no independent evidence and display no
      // numeric rating on the site. The markdown feed must match, or AI systems
      // cite a score the site itself suppresses.
      const indEvid = agent.editorial_rating_notes?.match(/IndEvid (\d)/)?.[1]
      const isOnOurRadar = indEvid === '1' || (agent.editorial_rating != null && agent.editorial_rating < 3.0)

      const ratingLine = agent.editorial_rating != null && !isOnOurRadar
        // Scale is 1.0 to 5.0. It is NOT out of 10.
        ? `**Editorial Rating:** ${Number(agent.editorial_rating).toFixed(1)} / 5`
        : '**Editorial Rating:** On Our Radar (no independent evidence yet, no numeric score)'

      const subScores = agent.editorial_rating_notes && !isOnOurRadar
        ? `**Sub-scores:** ${agent.editorial_rating_notes}`
        : ''

      const mcpLine = agent.mcp_status
        ? `**MCP:** ${agent.mcp_status === 'server' ? 'Exposes an MCP server' : agent.mcp_status === 'both' ? 'Exposes an MCP server and acts as a client' : agent.mcp_status === 'client' ? 'MCP client only (connects out to external servers)' : 'No MCP support'}`
        : ''

      const g2Line = agent.g2_rating != null && agent.g2_review_count != null && agent.g2_review_count > 0
        ? `**G2:** ${Number(agent.g2_rating).toFixed(1)} / 5 from ${agent.g2_review_count.toLocaleString()} reviews`
        : ''

      const starsLine = agent.github_stars != null && agent.github_stars > 0
        ? `**GitHub:** ${formatStars(agent.github_stars)} stars`
        : ''

      const verifiedLine = agent.last_verified_at
        ? `**Last verified:** ${new Date(agent.last_verified_at).toISOString().split('T')[0]}`
        : ''

      const prosBlock = bulletList(agent.pros, resolve)
      const limitationsBlock = bulletList(agent.limitations, resolve)

      markdown = [
        `# ${agent.name}`,
        '',
        `**Developer:** ${agent.developer}`,
        `**Category:** ${agent.primary_category}`,
        `**Pricing:** ${selfPriceLine(agent)}`,
        ratingLine,
        subScores,
        mcpLine,
        g2Line,
        starsLine,
        agent.website_url ? `**Website:** ${agent.website_url}` : '',
        verifiedLine,
        '',
        '## Overview',
        '',
        agent.short_description ?? '',
        '',
        agent.long_description ? resolve(agent.long_description) : '',
        '',
        agent.best_for ? `## Best For\n\n${resolve(agent.best_for)}\n` : '',
        prosBlock ? `## Pros\n\n${prosBlock}\n` : '',
        limitationsBlock ? `## Limitations\n\n${limitationsBlock}\n` : '',
        '---',
        '',
        'Editorial ratings are scored 1.0 to 5.0. Methodology: https://theaiagentindex.com/methodology',
        '',
        `View on The AI Agent Index: [theaiagentindex.com/agents/${slug}](https://theaiagentindex.com/agents/${slug})`,
      ]
        .filter((line) => line !== '')
        .join('\n')
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