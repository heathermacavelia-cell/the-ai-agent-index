import { createServiceClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { discussion_id, action } = await req.json()
    if (!discussion_id) return NextResponse.json({ error: 'discussion_id required' }, { status: 400 })

    const supabase = createServiceClient()
    const increment = action === 'remove' ? -1 : 1
    const { error } = await supabase.rpc('increment_discussion_upvotes', { discussion_id, increment_by: increment })
    if (error) throw error

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}