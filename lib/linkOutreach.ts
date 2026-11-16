import { createHmac } from 'crypto'

// VENDOR LINK OUTREACH, agreed with Heather 2026-11-16.
// One personal email per vendor address asking them to add their free badge.
// Deliberately NON-commercial: no prices, no paid tiers, no upsell. Nothing
// about a listing changes whether or not the vendor links (ruling 2026-09-12b).
// Wording and research: claude/vendor-link-outreach-2026-11-16.md

export const SITE_URL = 'https://theaiagentindex.com'
export const FOLLOW_UP_AFTER_DAYS = 7 // about five business days

// Vendors who already link to us (GSC Links, 2026-11-16) and listings with an
// open dispute. Matched against the vendor's email domain and website domain.
export const EXCLUDED_DOMAINS = new Set([
  'looot.ai', 'superbot.gg', 'sales-label.com', 'eesel.ai', 'shouldiuse.io',
])
export const EXCLUDED_SLUGS = new Set(['dash'])

export function outreachSignature(slug: string): string {
  return createHmac('sha256', process.env.CRON_SECRET ?? '').update('link-outreach:' + slug).digest('hex').slice(0, 32)
}

export function outreachUnsubscribeUrl(slug: string): string {
  return SITE_URL + '/api/outreach-unsubscribe?s=' + encodeURIComponent(slug) + '&t=' + outreachSignature(slug)
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const P = 'style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#1F2937"'
const para = (s: string) => '<p ' + P + '>' + s + '</p>'
const link = (href: string) => '<a href="' + href + '" style="color:#2563EB">' + esc(href) + '</a>'

function shell(body: string, unsub: string, first = true): string {
  return '<div style="font-family:Helvetica,Arial,sans-serif;max-width:560px;color:#1F2937">' + body +
    para((first ? 'Thanks,<br>' : '') + 'Heather MacAvelia<br>Editor, The AI Agent Index') +
    (first ? para('<span style="font-size:13px;color:#64748B">Not interested? Reply &ldquo;no thanks&rdquo; and I won&rsquo;t follow up.</span>') : '') +
    '<p style="margin:24px 0 0;font-size:12px;line-height:1.6;color:#64748B">theaiagentindex.com &middot; ' + esc(process.env.MAILING_ADDRESS ?? '') + ' &middot; <a href="' + unsub + '" style="color:#64748B">Unsubscribe</a></p>' +
    '</div>'
}

function joinList(items: string[]): string {
  if (items.length <= 1) return items[0] ?? ''
  return items.slice(0, -1).join(', ') + ' and ' + items[items.length - 1]
}

export interface OutreachListing {
  slug: string
  name: string
  rating: number | null      // the rating the listing shows, null when not shown
  verifiedAt: string | null  // last_verified_at
  createdAt: string
  badgeLabels: string[]      // eligible badges, best first
}

// Names ending in s take a bare apostrophe ("Docs'" not "Docs's").
const possessive = (name: string) => name + (/s$/i.test(name) ? '’' : '’s')
// "Rated 4.5 ★" is a badge label; inside a sentence it reads "your 4.5 rating".
const inSentence = (label: string) => label.replace(/^Rated ([0-9.]+).*$/, 'your $1 rating')

const monthDay = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', timeZone: 'UTC' })
const monthYear = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })

// main = the listing the email is about; others = more listings at the same address.
export function buildOutreach(main: OutreachListing, others: OutreachListing[], unsub: string): { subject: string; html: string } {
  const n = esc(main.name)
  const listing = SITE_URL + '/agents/' + main.slug
  const badges = SITE_URL + '/badges/' + main.slug
  const audited = !!main.verifiedAt
  const showRating = audited && main.rating != null && main.rating >= 4.0
  const named = main.badgeLabels.filter((l) => !l.startsWith('Listed ')).map(inSentence)
  const otherLine = others.length
    ? para('Your other listing' + (others.length > 1 ? 's' : '') + ' ' + (others.length > 1 ? 'have' : 'has') + ' a badge page too: ' +
        others.map((o) => esc(o.name) + ' (' + link(SITE_URL + '/badges/' + o.slug) + ')').join(', ') + '.')
    : ''

  const subject = showRating
    ? main.name + ' is rated ' + main.rating!.toFixed(1) + ' on The AI Agent Index'
    : possessive(main.name) + ' listing on The AI Agent Index'

  const body = audited
    ? para('Hi ' + n + ' team,') +
      para('I&rsquo;m Heather, the editor of The AI Agent Index. We checked ' + esc(possessive(main.name)) + ' listing against your own pricing, security and docs pages on ' + monthDay(main.verifiedAt!) + ', and it&rsquo;s live here: ' + link(listing)) +
      para('If it&rsquo;s useful, there&rsquo;s a free badge for your site' + (named.length ? ' showing ' + esc(joinList(named)) : '') + ': ' + link(badges) + '. It&rsquo;s a copy-and-paste snippet that links to the listing, so buyers can see the independent check for themselves.') +
      otherLine +
      para('Adding it or not changes nothing about your listing or rating.') +
      para('If anything on the page is wrong or out of date, just reply and I&rsquo;ll fix it.')
    : para('Hi ' + n + ' team,') +
      para('I&rsquo;m Heather, the editor of The AI Agent Index. ' + n + ' has been listed since ' + monthYear(main.createdAt) + ': ' + link(listing)) +
      para('Buyers and AI assistants use the index to compare business AI agents. If you&rsquo;d like to point your own visitors to the listing, there&rsquo;s a free badge for your site here: ' + link(badges) + '. It&rsquo;s one copy-and-paste snippet.') +
      otherLine +
      para('Adding it or not changes nothing about your listing.') +
      para('If anything on the page is wrong or out of date, just reply and I&rsquo;ll fix it.')

  return { subject, html: shell(body, unsub) }
}

export function buildFollowUp(main: OutreachListing, firstSubject: string, unsub: string): { subject: string; html: string } {
  const n = esc(main.name)
  const body =
    para('Hi ' + n + ' team,') +
    para('Just bumping this in case it got buried. The badge snippet for ' + n + ' is here: ' + link(SITE_URL + '/badges/' + main.slug) + '. No reply needed if it&rsquo;s not for you.')
  return { subject: 'Re: ' + firstSubject, html: shell(body, unsub, false) }
}
