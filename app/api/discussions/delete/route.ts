import { createServiceClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token')
    if (!token) return NextResponse.json({ error: 'Token required' }, { status: 400 })

    const supabase = createServiceClient()
    const { error } = await supabase
      .from('stack_discussions')
      .update({ is_deleted: true })
      .eq('delete_token', token)

    if (error) throw error
    return NextResponse.redirect(new URL('/discussions/deleted', req.url))
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}