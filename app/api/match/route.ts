import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json()
    if (!query || query.trim().length < 5) {
      return NextResponse.json({ error: 'Please describe what you want to automate' }, { status: 400 })
    }

    const supabase = createClient()
    const { data: agents, error } = await supabase
      .from('agents')
      .select('name, slug, short_description, primary_category, capability_tags, industry_tags, pricing_model, website_url, favicon_domain')
      .eq('is_active', true)
      .limit(250)

    if (error || !agents) {
      return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 })
    }

    const prompt = `You are an AI agent matching expert for The AI Agent Index. A business owner has described what they want to automate. Find the best matching AI agents from the directory.

User's request: "${query}"

Available agents:
${JSON.stringify(agents)}

Return ONLY a valid JSON array with no markdown or explanation. Top 3-5 best matches in this format:
[
  {
    "slug": "agent-slug",
    "name": "Agent Name",
    "reason": "2-3 sentences explaining why this agent fits their specific use case",
    "fit_score": 95,
    "pricing_model": "freemium"
  }
]

Rules:
- Only return agents that genuinely match the need
- fit_score is 0-100, be honest
- reason must be specific to their exact use case, never generic
- Order by fit_score descending
- If fewer than 3 genuinely match, return fewer`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await response.json()
    const text = data.content?.[0]?.text || '[]'

    let matches
    try {
      matches = JSON.parse(text)
    } catch {
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      matches = jsonMatch ? JSON.parse(jsonMatch[0]) : []
    }

    return NextResponse.json({ matches })
  } catch (err) {
    console.error('Match API error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}