import { createServiceClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { stack_id, fingerprint } = await request.json()
    if (!stack_id || !fingerprint) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const supabase = createServiceClient()

    const { error } = await supabase
      .from('stack_votes')
      .insert({ stack_id, fingerprint })

    if (error) {
      return NextResponse.json({ error: 'already_voted' }, { status: 409 })
    }

    const { data: stack } = await supabase
      .from('stacks')
      .select('upvote_count')
      .eq('id', stack_id)
      .single()

    const newCount = (stack?.upvote_count ?? 0) + 1
    await supabase.from('stacks').update({ upvote_count: newCount }).eq('id', stack_id)

    return NextResponse.json({ success: true, upvote_count: newCount })
  } catch (err) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}