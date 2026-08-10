import { createClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim()
  const limit = parseInt(searchParams.get('limit') ?? '8')

  if (!q || q.length < 2) return NextResponse.json([])

    const safe = q.replace(/[%,()'":\\]/g, '').trim()
    if (!safe) return NextResponse.json([])
  
      const supabase = createClient()

      // Name matches must never lose to alphabetical ordering. A brand name like
      // "hubspot" appears in dozens of listings' search_text as an integration,
      // so .order('name') alone lets those outrank the product's own listing.
      const [nameRes, textRes] = await Promise.all([
        supabase
          .from('agents')
          .select('slug, name, short_description')
          .eq('is_active', true)
          .ilike('name', `%${safe}%`)
          .order('name')
          .limit(limit),
        supabase
          .from('agents')
          .select('slug, name, short_description')
          .eq('is_active', true)
          .or(`name.ilike.%${safe}%,search_text.ilike.%${safe}%`)
          .order('name')
          .limit(limit * 4),
      ])
  
      const seen = new Set<string>()
      const data = [...(nameRes.data ?? []), ...(textRes.data ?? [])].filter((a) => {
        if (seen.has(a.slug)) return false
        seen.add(a.slug)
        return true
      }).slice(0, limit)

  return NextResponse.json(data ?? [])
}