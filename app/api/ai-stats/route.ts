import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const supabase = createServiceClient()

    // Get AI crawler hits from last 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { data, error } = await supabase
      .from('traffic_logs')
      .select('bot_name, hit_count')
      .eq('visitor_type', 'ai_crawler')
      .gte('window_start', sevenDaysAgo.toISOString())

    if (error) {
      return NextResponse.json({ total: 0, platforms: [] }, { status: 200 })
    }

    // Aggregate by bot_name
    const platformMap = new Map<string, number>()
    let total = 0

    for (const row of data ?? []) {
      if (!row.bot_name) continue
      const current = platformMap.get(row.bot_name) ?? 0
      platformMap.set(row.bot_name, current + row.hit_count)
      total += row.hit_count
    }

    // Map bot names to display names
    const displayNames: Record<string, string> = {
      'ChatGPT-User': 'ChatGPT',
      'GPTBot': 'GPTBot',
      'ClaudeBot': 'Claude',
      'Claude-Web': 'Claude',
      'PerplexityBot': 'Perplexity',
      'NotebookLM': 'NotebookLM',
      'Applebot': 'Apple Intelligence',
      'YouBot': 'You.com',
      'cohere-ai': 'Cohere',
      'Google-Extended': 'Gemini',
      'Bytespider': 'ByteDance',
      'PetalBot': 'Petal',
      'CCBot': 'Common Crawl',
      'Diffbot': 'Diffbot',
    }

    // Merge Claude variants
    const merged = new Map<string, number>()
    for (const [botName, count] of platformMap) {
      const display = displayNames[botName] ?? botName
      const current = merged.get(display) ?? 0
      merged.set(display, current + count)
    }

    // Sort by count descending, take top platforms
    const platforms = Array.from(merged.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)

    return NextResponse.json(
      { total, platforms },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        },
      }
    )
  } catch {
    return NextResponse.json({ total: 0, platforms: [] }, { status: 200 })
  }
}