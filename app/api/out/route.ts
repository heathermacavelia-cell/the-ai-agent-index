import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

// Records one click on a link that sends a reader to a vendor's site.
// Called by components/OutboundClickTracker.tsx with navigator.sendBeacon, so
// the reader's click is never delayed or changed. The link itself is untouched.
//
// Stored in traffic_logs as path /out/{slug}/{from}, visitor_type 'human'.

export const dynamic = 'force-dynamic'

const SOURCES = new Set(['listing', 'pricing', 'compare', 'stack'])
const BOT_UA = /bot|crawler|spider|scraper|fetcher|curl|wget|python-requests|axios|node-fetch|Go-http-client|Java\/|HeadlessChrome/i

export async function POST(request: NextRequest) {
  try {
    const ua = request.headers.get('user-agent') ?? ''
    if (!ua || BOT_UA.test(ua)) return new NextResponse(null, { status: 204 })

    const body = JSON.parse(await request.text())
    const slug = typeof body?.slug === 'string' ? body.slug : ''
    const from = typeof body?.from === 'string' && SOURCES.has(body.from) ? body.from : 'listing'
    if (!/^[a-z0-9-]{1,100}$/.test(slug)) return new NextResponse(null, { status: 204 })

    const supabase = createServiceClient()
    const { data: agent } = await supabase
      .from('agents')
      .select('slug')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle()
    if (!agent) return new NextResponse(null, { status: 204 })

    const windowStart = new Date()
    windowStart.setSeconds(0, 0)
    await supabase.from('traffic_logs').insert({
      window_start: windowStart.toISOString(),
      path: '/out/' + slug + '/' + from,
      visitor_type: 'human',
      bot_name: null,
      referrer_domain: null,
      hit_count: 1,
    })
  } catch {
    // Never let tracking break anything for the reader.
  }
  return new NextResponse(null, { status: 204 })
}
