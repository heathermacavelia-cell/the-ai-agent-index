import { createServiceClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

// IndexNow: tells Bing (and Yandex, Naver, Seznam, Yep) which pages changed.
// Google does not use IndexNow. Runs once a day from vercel.json.
// The key is public by design - it is the same value served at /<key>.txt.
const SITE = 'https://theaiagentindex.com'
const HOST = 'theaiagentindex.com'
const KEY = '8952e4f1373ae1af9682699d28ff88c3'
const ENDPOINT = 'https://www.bing.com/indexnow'
const WINDOW_HOURS = 25 // one hour of overlap so nothing falls between two daily runs

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const supabase = createServiceClient()
  const since = new Date(Date.now() - WINDOW_HOURS * 3600 * 1000)
    .toISOString()
    .replace(/\.\d{3}Z$/, 'Z')

  const [agents, comparisons, alternatives, categories] = await Promise.all([
    supabase
      .from('agents')
      .select('slug')
      .eq('is_active', true)
      .or(`updated_at.gte.${since},last_verified_at.gte.${since}`),
    supabase
      .from('comparisons')
      .select('slug')
      .eq('is_active', true)
      .or(`updated_at.gte.${since},last_audited_at.gte.${since}`),
    supabase
      .from('alternatives')
      .select('slug')
      .eq('is_active', true)
      .or(`updated_at.gte.${since},last_audited_at.gte.${since}`),
    supabase
      .from('categories')
      .select('slug')
      .or(`updated_at.gte.${since},last_verified_at.gte.${since}`),
  ])

  const errors = [agents, comparisons, alternatives, categories]
    .map((r) => r.error?.message)
    .filter(Boolean)
  if (errors.length > 0) {
    return NextResponse.json({ error: errors }, { status: 500 })
  }

  const urls = Array.from(
    new Set([
      ...(agents.data ?? []).map((r) => `${SITE}/agents/${r.slug}`),
      ...(comparisons.data ?? []).map((r) => `${SITE}/compare/${r.slug}`),
      ...(alternatives.data ?? []).map((r) => `${SITE}/alternatives/${r.slug}`),
      ...(categories.data ?? []).map((r) => `${SITE}/${r.slug}`),
    ])
  ).slice(0, 10000)

  if (urls.length === 0) {
    return NextResponse.json({ submitted: 0, since })
  }

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: `${SITE}/${KEY}.txt`,
      urlList: urls,
    }),
  })

  return NextResponse.json({
    submitted: urls.length,
    indexnowStatus: res.status,
    since,
    counts: {
      agents: agents.data?.length ?? 0,
      comparisons: comparisons.data?.length ?? 0,
      alternatives: alternatives.data?.length ?? 0,
      categories: categories.data?.length ?? 0,
    },
  })
}
