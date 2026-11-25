import { createHmac } from 'crypto'
import { AGENCY_REVIEW_PAYMENT_LINK, EDITORIAL_REVIEW_PAYMENT_LINK } from '@/lib/vendorPlans'

// THE DAY-3 AND DAY-14 QUEUE REMINDERS, agreed with Heather 2026-11-04.
// Submissions before this date had the one-off free-queue email instead, so
// nobody receives both.
export const REMINDERS_START = '2026-11-02T00:00:00Z'

export const SITE_URL = 'https://theaiagentindex.com'

// Addresses that are not the vendor's own mailbox: AI relay inboxes and bulk
// submitters. They stay in the queue, they just do not get a sales reminder.
const RELAY_DOMAINS = new Set([
  'mail.grokbot.com', 'agentmail.to', '387654.com', 'thereisnomoat.fyi',
  'aihubora.com', 'hifromsaascity.com', 'welcometosaascity.com',
  'shorebytelab.co', 'mail.instinct.com', 'example.com',
])

export function isRelayAddress(email: string): boolean {
  return RELAY_DOMAINS.has(email.split('@')[1]?.toLowerCase() ?? '')
}

export type QueueKind = 'agent' | 'agency'
export type ReminderType = 'day3' | 'day14' | 'unpaid'

// The unsubscribe link carries no email address. The signature stops anyone
// opting out a listing they do not own by guessing its slug.
export function unsubscribeSignature(kind: string, slug: string): string {
  return createHmac('sha256', process.env.CRON_SECRET ?? '').update(kind + ':' + slug).digest('hex').slice(0, 32)
}

export function unsubscribeUrl(kind: QueueKind, slug: string): string {
  return SITE_URL + '/api/queue-unsubscribe?k=' + kind + '&s=' + encodeURIComponent(slug) + '&t=' + unsubscribeSignature(kind, slug)
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const P = 'style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#334155"'
const para = (s: string) => '<p ' + P + '>' + s + '</p>'
const button = (href: string, label: string) =>
  '<p style="margin:18px 0"><a href="' + href + '" style="display:inline-block;background:#2563EB;color:#ffffff;padding:11px 20px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px">' + label + '</a></p>'

function shell(body: string, unsub: string): string {
  return '<div style="font-family:Helvetica,Arial,sans-serif;max-width:560px;color:#334155">' + body +
    para('Heather<br>The AI Agent Index') +
    '<p style="margin:24px 0 0;font-size:12px;line-height:1.6;color:#64748B">theaiagentindex.com &middot; ' + esc(process.env.MAILING_ADDRESS ?? '') + ' &middot; <a href="' + unsub + '" style="color:#64748B">Unsubscribe</a></p>' +
    '</div>'
}

export function buildReminder(args: {
  type: ReminderType
  kind: QueueKind
  name: string
  wait: string
  unsub: string
  count?: number
}): { subject: string; html: string } {
  // 2026-11-25 (Heather): rewritten after the 11-05 to 11-25 sends brought no
  // payments. No week counts (the estimate had reached 38 weeks), the $39 offer
  // kept short, and a question that invites a reply. The day-14 email is retired
  // in the cron route; `wait` is no longer shown.
  const { type, kind, unsub } = args
  const n = esc(args.name)
  const plural = (args.count ?? 1) > 1
  const agent = kind === 'agent'
  const pay = agent ? EDITORIAL_REVIEW_PAYMENT_LINK : AGENCY_REVIEW_PAYMENT_LINK
  const review = agent ? 'Editorial Review' : 'Independent Review'

  if (type === 'unpaid') {
    return {
      subject: 'Your $39 review for ' + args.name,
      html: shell(
        para('Hi,') +
        para('You picked the $39 ' + review + ' for ' + n + ", but I can't find a payment for it yet. If checkout didn't finish, you can pay here:") +
        button(pay, 'Pay $39') +
        para("If you've already paid, thank you, and please ignore this. If you'd rather list for free, you don't need to do anything. It will move to the free queue in a week."),
        unsub
      ),
    }
  }

  return {
    subject: args.name + (plural ? ' are in line for free listings' : ' is in line for a free listing'),
    html: shell(
      para('Hi,') +
      para('Thanks for submitting ' + n + '. ' + (plural ? "They're" : "It's") + " saved and you don't need to do anything else.") +
      para("We publish free listings every week, oldest first. I'll email you the day " + (plural ? 'each one goes' : 'yours goes') + ' live.') +
      para(agent
        ? "If you'd rather not wait, the $39 Editorial Review gets you live within 3 business days. We check your pricing, features and MCP status against your own site and rate the listing."
        : "If you'd rather not wait, the $39 Independent Review gets you live within 3 business days. We check your listing against your own site and add the Independently Reviewed badge.") +
      button(pay, 'Get the review: $39') +
      para('<span style="font-size:13px;color:#64748B">Use the same name at checkout so we can match it to your submission.</span>') +
      para('One question while you wait: is there anything about ' + n + " you'd want buyers to know that isn't on your homepage? Just reply."),
      unsub
    ),
  }
}
