import { createServiceClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

export async function GET(req: NextRequest) {
  const pass = req.headers.get('x-admin-password')
  if (!pass || pass !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()

  const { data: discussions, error } = await supabase
    .from('stack_discussions')
    .select('id, author_name, author_email, body, upvotes, report_count, is_deleted, created_at, parent_id, stack_id')
    .order('report_count', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) return NextResponse.json({ error: 'Failed' }, { status: 500 })

  const stackIds = [...new Set((discussions ?? []).map(d => d.stack_id))]
  const { data: stacks } = stackIds.length
    ? await supabase.from('stacks').select('id, name, slug').in('id', stackIds)
    : { data: [] }

  const stackMap = Object.fromEntries((stacks ?? []).map(s => [s.id, s]))

  const enriched = (discussions ?? []).map(d => ({
    ...d,
    stack_name: stackMap[d.stack_id]?.name ?? null,
    stack_slug: stackMap[d.stack_id]?.slug ?? null,
  }))

  return NextResponse.json(enriched)
}