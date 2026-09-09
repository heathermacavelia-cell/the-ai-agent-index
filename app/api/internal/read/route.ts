// app/api/internal/read/route.ts
//
// ============================================================================
// READ-ONLY DATA ROUTE. THIS FILE CAN FETCH ROWS AND NOTHING ELSE.
// ============================================================================
//
// WHY IT IS SAFE, AND HOW TO CHECK THAT YOURSELF:
//
//   1. It imports `supabase`, the ANON client from lib/supabase.ts, the same
//      one the public website uses. It does NOT import `createServiceClient`,
//      which is the one that bypasses row level security.
//   2. The only database call in this file is `.select()`. The words
//      `.insert(`, `.update(`, `.delete(` and `.upsert(` do not appear
//      anywhere below. Search the file and confirm it.
//   3. It only answers GET. There is no POST, PUT, PATCH or DELETE handler,
//      so there is no way to send it anything to change.
//   4. It only reads the tables named in ALLOWED_TABLES. Anything else is
//      rejected before a query is built.
//   5. It requires READONLY_TOKEN. That secret is separate from
//      ADMIN_PASSWORD on purpose: it must NOT be the same value, because
//      ADMIN_PASSWORD unlocks the admin routes that approve, disapprove and
//      verify agents, and those write.
//
// TO REVOKE ACCESS: delete the READONLY_TOKEN environment variable in Vercel,
// or delete this file and push. Either one takes effect on the next deploy.
//
// ============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// The only tables this route will ever read.
// `subscribers` is deliberately NOT here: it holds real people's email
// addresses and nothing about this route needs them.
const ALLOWED_TABLES = [
  'agents',
  'changelog',
  'comparisons',
  'alternatives',
  'categories',
] as const

type AllowedTable = (typeof ALLOWED_TABLES)[number]

// Which column a `slug` filter applies to, per table.
const SLUG_COLUMN: Record<AllowedTable, string> = {
  agents: 'slug',
  changelog: 'agent_slug',
  comparisons: 'slug',
  alternatives: 'slug',
  categories: 'slug',
}

const DEFAULT_LIMIT = 200
const MAX_LIMIT = 1000

export async function GET(req: NextRequest) {
  const expected = process.env.READONLY_TOKEN

  // Fail closed: if the secret is not configured, the route does nothing.
  if (!expected) {
    return NextResponse.json(
      { error: 'Read route is not configured on this deployment.' },
      { status: 503 }
    )
  }

  if (req.headers.get('x-readonly-token') !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const params = req.nextUrl.searchParams
  const table = params.get('table') ?? ''

  if (!(ALLOWED_TABLES as readonly string[]).includes(table)) {
    return NextResponse.json(
      { error: 'Unknown or not-allowed table.', allowed: ALLOWED_TABLES },
      { status: 400 }
    )
  }

  const t = table as AllowedTable

  const requested = Number(params.get('limit') ?? DEFAULT_LIMIT)
  const limit = Number.isFinite(requested)
    ? Math.min(Math.max(1, Math.trunc(requested)), MAX_LIMIT)
    : DEFAULT_LIMIT

  // The only database operation in this file.
  let query = supabase.from(t).select('*').limit(limit)

  const slug = params.get('slug')
  if (slug) {
    query = query.eq(SLUG_COLUMN[t], slug)
  }

  // `since` only makes sense on changelog, which is the only allowed table
  // with a published_at column. Applied anywhere else it would error, so it
  // is ignored elsewhere rather than passed through.
  const since = params.get('since')
  if (since && t === 'changelog') {
    query = query.gte('published_at', since).order('published_at', { ascending: true })
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json(
      { error: error.message, table: t },
      { status: 500 }
    )
  }

  return NextResponse.json({
    table: t,
    limit,
    count: data?.length ?? 0,
    rows: data ?? [],
  })
}