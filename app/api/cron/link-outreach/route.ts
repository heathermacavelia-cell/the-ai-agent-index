import { createServiceClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getEligibleBadges } from '@/lib/badges'
import { displayRating } from '@/lib/rating'
import { isRelayAddress } from '@/lib/queueReminders'
import {
  EXCLUDED_DOMAINS, EXCLUDED_SLUGS, FOLLOW_UP_AFTER_DAYS, OutreachListing,
  buildFollowUp, buildOutreach, outreachUnsubscribeUrl,
} from '@/lib/linkOutreach'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const DAY = 86400000
const MAX_PER_RUN = 20 // small daily batches protect the sending domain
const PAUSE_MS = 600

const domainOf = (s: string) => s.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0].toLowerCase()

export async function GET(req: Request) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }
  // Off until Heather sets LINK_OUTREACH_ENABLED=true in Vercel.
  if (process.env.LINK_OUTREACH_ENABLED !== 'true') {
    return NextResponse.json({ skipped: 'LINK_OUTREACH_ENABLED is not true' })
  }
  if (!process.env.MAILING_ADDRESS) {
    return NextResponse.json({ error: 'MAILING_ADDRESS is not set' }, { status: 500 })
  }

  const supabase = createServiceClient()
  const resend = new Resend(process.env.RESEND_API_KEY)
  const now = Date.now()

  const { data, error } = await supabase
    .from('agents')
    .select('id, slug, name, website_url, contact_email, submitter_email, is_active, primary_category, mcp_status, pricing_transparency, editorial_rating, editorial_rating_notes, rating_avg, rating_count, last_verified_at, created_at, queue_emails_opt_out, link_outreach_opt_out, link_outreach_sent_at, link_outreach_followup_sent_at')
    .eq('is_active', true)
    .limit(2000)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Group listings by vendor address: one email per address, never one per listing.
  const byEmail = new Map<string, any[]>()
  for (const a of data ?? []) {
    const email = String(a.contact_email || a.submitter_email || '').trim().toLowerCase()
    if (!email || !email.includes('@') || isRelayAddress(email)) continue
    if (a.queue_emails_opt_out || a.link_outreach_opt_out) continue
    if (EXCLUDED_SLUGS.has(a.slug)) continue
    const site = domainOf(a.website_url ?? '')
    const mailDomain = email.split('@')[1]
    if (EXCLUDED_DOMAINS.has(mailDomain) || EXCLUDED_DOMAINS.has(site)) continue
    byEmail.set(email, [...(byEmail.get(email) ?? []), a])
  }

  const toListing = async (a: any): Promise<OutreachListing> => ({
    slug: a.slug,
    name: a.name,
    rating: displayRating(a),
    verifiedAt: a.last_verified_at,
    createdAt: a.created_at,
    badgeLabels: (await getEligibleBadges(a)).map((b) => b.label),
  })

  // Follow-ups first (they are the oldest conversations), then first emails.
  const followUps: [string, any[]][] = []
  const firsts: [string, any[]][] = []
  for (const [email, rows] of Array.from(byEmail.entries())) {
    // A follow-up already went to this address: the conversation is finished.
    if (rows.some((r) => r.link_outreach_followup_sent_at)) continue
    const sent = rows.map((r) => r.link_outreach_sent_at).filter(Boolean).sort()[0]
    if (sent) {
      if (now - Date.parse(sent) >= FOLLOW_UP_AFTER_DAYS * DAY) followUps.push([email, rows])
    } else {
      firsts.push([email, rows])
    }
  }
  // Audited listings first, best rated first.
  firsts.sort((a, b) => (displayRating(b[1][0]) ?? 0) - (displayRating(a[1][0]) ?? 0))

  let sentFirst = 0, sentFollow = 0
  const failed: string[] = []
  const queue = [...followUps.map((x) => ({ kind: 'follow' as const, x })), ...firsts.map((x) => ({ kind: 'first' as const, x }))]
  for (const { kind, x: [email, rows] } of queue.slice(0, MAX_PER_RUN)) {
    rows.sort((a, b) => (displayRating(b) ?? 0) - (displayRating(a) ?? 0))
    const listings = await Promise.all(rows.map(toListing))
    const main = listings[0]
    const unsub = outreachUnsubscribeUrl(main.slug)
    const first = buildOutreach(main, listings.slice(1), unsub)
    const msg = kind === 'first' ? first : buildFollowUp(main, first.subject, unsub)
    const { error: sendError } = await resend.emails.send({
      from: 'Heather at The AI Agent Index <hello@theaiagentindex.com>',
      to: email,
      replyTo: 'hello@theaiagentindex.com',
      subject: msg.subject,
      html: msg.html,
      headers: {
        'List-Unsubscribe': `<${unsub}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
    })
    if (sendError) {
      failed.push(main.slug)
    } else {
      // Stamped only after a successful send, so a failure retries tomorrow.
      const stamp = new Date().toISOString()
      const update = kind === 'first' ? { link_outreach_sent_at: stamp } : { link_outreach_followup_sent_at: stamp }
      await supabase.from('agents').update(update).in('id', rows.map((r) => r.id))
      if (kind === 'first') sentFirst++; else sentFollow++
    }
    await new Promise((resolve) => setTimeout(resolve, PAUSE_MS))
  }

  return NextResponse.json({
    sentFirst, sentFollow, failed,
    waitingFirst: Math.max(0, firsts.length - Math.max(0, MAX_PER_RUN - followUps.length)),
    addresses: byEmail.size,
  })
}
