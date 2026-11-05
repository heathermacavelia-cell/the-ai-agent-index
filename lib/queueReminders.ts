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
}): { subject: string; html: string } {
  const { type, kind, wait, unsub } = args
  const n = esc(args.name)
  const agent = kind === 'agent'
  const pay = agent ? EDITORIAL_REVIEW_PAYMENT_LINK : AGENCY_REVIEW_PAYMENT_LINK
  const review = agent ? 'Editorial Review' : 'Independent Review'

  if (type === 'unpaid') {
    return {
      subject: 'Your $39 ' + review + ': ' + args.name,
      html: shell(
        para('Hi,') +
        para('Thanks for submitting ' + n + '. You chose the $39 ' + review + ', and your submission is saved with us, so there is nothing to fill in again.') +
        para("We haven't been able to match a payment to it yet. Once we do, your review is completed within 3 business days.") +
        button(pay, 'Complete payment: $39') +
        para("If you'd rather list for free, no action is needed. Your submission will move to the free queue and we'll email you when it's live. If you've already paid, thank you. Your review is under way and you can ignore this email."),
        unsub
      ),
    }
  }

  if (type === 'day14') {
    return {
      subject: 'Your free queue update',
      html: shell(
        para('Hi,') +
        para(n + " is still in our free queue, and we expect to reach it in " + wait + ". That's an estimate, and it's often sooner.") +
        para(agent
          ? "If you'd rather not wait, an Editorial Review is $39 one time: a full audit against your live sources, live within 3 business days."
          : "If you'd rather not wait, an Independent Review is $39 once, completed within 3 business days of payment.") +
        button(pay, 'Get the ' + review + ': $39'),
        unsub
      ),
    }
  }

  return {
    subject: 'Your place in the free queue',
    html: shell(
      para('Hi,') +
      para('Thanks for submitting ' + n + " to The AI Agent Index. Your free submission is saved, and you don't need to do anything else.") +
      para('We review free listings in weekly batches, oldest first. We expect to reach yours in ' + wait + ". That's an estimate, and it's often sooner. We'll email you when your listing is live.") +
      (agent
        ? para('A free listing shows only the basic details you supplied. It has no editorial review and no rating, and the link to your site stays marked as unreviewed.') +
          para('An Editorial Review is $39 one time. We audit your pricing, features, integrations, security claims and MCP status against your live sources, add the structured fields AI systems actually read, and rate your listing where the evidence supports a rating. The unreviewed mark comes off your link, and your listing goes live within 3 business days instead of waiting in the queue.')
        : para('A free listing shows only the basic details you supplied. It has no independent review, and the link to your site stays marked as unreviewed.') +
          para('An Independent Review is $39 once, completed within 3 business days of payment. We check your listing against your live site, and it adds the Independently Reviewed badge with the date we checked it, a place above free listings in the directory, and your own logo. The unreviewed mark comes off your link too.')) +
      button(pay, 'Get the ' + review + ': $39') +
      para("Use the same name at checkout so we can match it to your submission. It's refunded in full if you don't qualify, and your free submission stands either way."),
      unsub
    ),
  }
}
