import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

// Records one human page view. Called by components/PageViewTracker.tsx from
// the reader's browser, so scrapers that fetch pages without running them are
// not counted. Before 2026-09-25 human views were counted server-side in
// middleware, which counted scrapers as people (about 6x Vercel's figure).
// Human rows in traffic_logs are comparable only from the deploy date onward.

export const dynamic = 'force-dynamic'

const BOT_UA = /bot|crawler|spider|scraper|fetcher|curl|wget|python-requests|axios|node-fetch|Go-http-client|Java\/|HeadlessChrome|Lighthouse|PageSpeed/i
const SKIP_PREFIXES = ['/api/', '/admin', '/_next/', '/vendor', '/claim/verify']

export async function POST(request: NextRequest) {
  try {
    const ua = request.headers.get('user-agent') ?? ''
    if (!ua || BOT_UA.test(ua)) return new NextResponse(null, { status: 204 })

    const body = JSON.parse(await request.text())
    const rawPath = typeof body?.path === 'string' ? body.path : ''
    const path = rawPath.split('?')[0].split('#')[0]
    if (!path.startsWith('/') || path.length > 200 || !/^[a-zA-Z0-9\-_/.]+$/.test(path)) {
      return new NextResponse(null, { status: 204 })
    }
    if (SKIP_PREFIXES.some(p => path.startsWith(p))) return new NextResponse(null, { status: 204 })

    let referrerDomain: string | null = null
    if (typeof body?.ref === 'string' && body.ref) {
      try {
        const host = new URL(body.ref).hostname.replace(/^www\./, '')
        referrerDomain = host && host !== 'theaiagentindex.com' ? host.slice(0, 100) : null
      } catch {
        referrerDomain = null
      }
    }

    const windowStart = new Date()
    windowStart.setSeconds(0, 0)
    const supabase = createServiceClient()
    await supabase.from('traffic_logs').insert({
      window_start: windowStart.toISOString(),
      path,
      visitor_type: 'human',
      bot_name: null,
      referrer_domain: referrerDomain,
      hit_count: 1,
    })
  } catch {
    // Never let counting break anything for the reader.
  }
  return new NextResponse(null, { status: 204 })
}
