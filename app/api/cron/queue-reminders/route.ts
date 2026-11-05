import { createServiceClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { FREE_AGENCIES_PER_WEEK, FREE_LISTINGS_PER_WEEK, waitLabel, weeksForQueue } from '@/lib/freeQueue'
import { REMINDERS_START, ReminderType, QueueKind, buildReminder, isRelayAddress, unsubscribeUrl } from '@/lib/queueReminders'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const DAY = 86400000
const MAX_PER_RUN = 40 // anything over this waits for tomorrow's run
const PAUSE_MS = 600 // stays under Resend's request rate limit

interface Row {
  id: string
  slug: string
  name: string
  email: string
  submitted_tier: string
  created_at: string
  queue_reminder_3_sent_at: string | null
  queue_reminder_14_sent_at: string | null
}

interface Due {
  type: ReminderType
  kind: QueueKind
  rows: Row[]
  wait: string
}

const table = (kind: QueueKind) => (kind === 'agent' ? 'agents' : 'agencies')

async function loadQueue(kind: QueueKind): Promise<Row[]> {
  const supabase = createServiceClient()
  const emailColumn = kind === 'agent' ? 'submitter_email' : 'contact_email'
  const out: Row[] = []
  for (let from = 0; ; from += 1000) {
    const q = supabase
      .from(table(kind))
      .select(`id, slug, name, ${emailColumn}, submitted_tier, created_at, queue_reminder_3_sent_at, queue_reminder_14_sent_at`)
      .eq('is_active', false)
      .eq('queue_emails_opt_out', false)
      .in('submitted_tier', ['self', 'review'])
      .not(emailColumn, 'is', null)
      .order('created_at', { ascending: true })
      .range(from, from + 999)
    const { data, error } = await (kind === 'agent' ? q.is('last_verified_at', null) : q)
    if (error) throw new Error(error.message)
    const rows = (data ?? []) as any[]
    out.push(...rows.map((r) => ({ ...r, email: String(r[emailColumn]).trim().toLowerCase() })))
    if (rows.length < 1000) return out
  }
}

function dueList(kind: QueueKind, queue: Row[], now: number): Due[] {
  const perWeek = kind === 'agent' ? FREE_LISTINGS_PER_WEEK : FREE_AGENCIES_PER_WEEK
  const free = queue.filter((r) => r.submitted_tier === 'self')
  const start = Date.parse(REMINDERS_START)
  const groups = new Map<string, Due>()

  queue.forEach((r) => {
    if (Date.parse(r.created_at) < start || isRelayAddress(r.email)) return
    const age = now - Date.parse(r.created_at)
    let type: ReminderType | null = null
    if (r.submitted_tier === 'review') {
      if (age >= 3 * DAY && !r.queue_reminder_3_sent_at) type = 'unpaid'
    } else if (age >= 14 * DAY) {
      if (!r.queue_reminder_14_sent_at) type = 'day14'
    } else if (age >= 3 * DAY && !r.queue_reminder_3_sent_at) {
      type = 'day3'
    }
    if (!type) return
    // One address with several submissions due today gets one email.
    const key = type + ':' + r.email
    const existing = groups.get(key)
    if (existing) {
      existing.rows.push(r)
      return
    }
    const position = free.findIndex((f) => f.id === r.id) + 1
    const count = position > 0 ? position : free.length + 1
    groups.set(key, { type, kind, rows: [r], wait: waitLabel(weeksForQueue(count, true, perWeek)) })
  })
  return Array.from(groups.values())
}

function nameList(rows: Row[]): string {
  const names = Array.from(new Set(rows.map((r) => r.name)))
  if (names.length === 1) return names[0]
  return names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1]
}

// Ruling 2026-10-22: a $39 submission unpaid 7 days after its one follow-up is
// treated as free. Stamping day 14 here is what stops it getting a second
// reminder. A paid row is live inside 3 business days, so it never reaches this.
async function moveUnpaid(kind: QueueKind, queue: Row[], now: number): Promise<number> {
  const supabase = createServiceClient()
  const stale = queue.filter((r) =>
    r.submitted_tier === 'review' && r.queue_reminder_3_sent_at &&
    now - Date.parse(r.queue_reminder_3_sent_at) >= 7 * DAY)
  if (stale.length === 0) return 0
  const { error } = await supabase
    .from(table(kind))
    .update({ submitted_tier: 'self', queue_reminder_14_sent_at: new Date(now).toISOString() })
    .in('id', stale.map((r) => r.id))
  if (error) throw new Error(error.message)
  return stale.length
}

export async function GET(req: Request) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  // Canadian commercial email needs a mailing address. It is Heather's home
  // address and this repo is public, so it lives in Vercel, never in the code.
  if (!process.env.MAILING_ADDRESS) {
    return NextResponse.json({ error: 'MAILING_ADDRESS is not set' }, { status: 500 })
  }

  const now = Date.now()
  const supabase = createServiceClient()
  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    const [agents, agencies] = await Promise.all([loadQueue('agent'), loadQueue('agency')])
    const moved = (await moveUnpaid('agent', agents, now)) + (await moveUnpaid('agency', agencies, now))
    const due = [...dueList('agent', agents, now), ...dueList('agency', agencies, now)]

    let sent = 0
    const failed: string[] = []
    for (const d of due.slice(0, MAX_PER_RUN)) {
      const first = d.rows[0]
      const unsub = unsubscribeUrl(d.kind, first.slug)
      const { subject, html } = buildReminder({ type: d.type, kind: d.kind, name: nameList(d.rows), wait: d.wait, unsub })
      const { error } = await resend.emails.send({
        from: 'The AI Agent Index <hello@theaiagentindex.com>',
        to: first.email,
        subject,
        html,
        headers: {
          'List-Unsubscribe': `<${unsub}>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        },
      })
      if (error) {
        failed.push(first.slug)
      } else {
        // Written only after a successful send, so a failure retries tomorrow.
        // Day 14 also stamps day 3, so a late run never sends them out of order.
        const stamp = new Date().toISOString()
        const update = d.type === 'day14'
          ? { queue_reminder_3_sent_at: first.queue_reminder_3_sent_at ?? stamp, queue_reminder_14_sent_at: stamp }
          : { queue_reminder_3_sent_at: stamp }
        await supabase.from(table(d.kind)).update(update).in('id', d.rows.map((r) => r.id))
        sent++
      }
      await new Promise((resolve) => setTimeout(resolve, PAUSE_MS))
    }

    return NextResponse.json({ sent, failed, moved, due: due.length, waiting: Math.max(0, due.length - MAX_PER_RUN) })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Reminder run failed' }, { status: 500 })
  }
}
