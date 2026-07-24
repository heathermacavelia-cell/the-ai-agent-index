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
    const { data } = await supabase
      .from('agents')
      .select('slug, name, short_description')
      .eq('is_active', true)
      .or(`name.ilike.%${safe}%,search_text.ilike.%${safe}%`)
      .order('name')
      .limit(limit)

  return NextResponse.json(data ?? [])
}