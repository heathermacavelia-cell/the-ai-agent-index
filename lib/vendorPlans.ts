// SINGLE SOURCE OF TRUTH FOR EVERY PRICE AND CHECKOUT LINK ON THIS SITE.
//
// If a price appears on a page, it is imported from here. Never hardcode one.
// This exists because /advertise, the vendor dashboard and /methodology all
// quote the rate card, and three copies of a price is three chances to be
// wrong on the page a customer is reading.
//
// THE LISTING LADDER, ruled 2026-08-30/31:
//   self     - free. A lighter check of the basics. NO STATED TIMELINE.
//   review   - $39 one-time. Full editorial audit. Live in 3 business days.
//   managed  - $99/month. Full audit, live in 1 business day, re-audit every 30 days.
//
// PLACEMENTS, ruled 2026-08-31: every paid placement carries ongoing accuracy
// maintenance on a 14-DAY cycle - faster than Editorial Managed's 30 days.
// That is what justifies the price sitting above $99, and it is why a stale
// listing can never sit in a promoted slot.
//
// THE BADGE MEANS AUDITED, NEVER PAID, AND IT CARRIES ITS DATE.
// Paid placement is labelled BOOSTED so a first-time reader can tell.

// --- LEGACY: Vendor Managed, $9.99/mo ---------------------------------------
// RETIRED FOR NEW CUSTOMERS 2026-08-30. Removed from /submit and /advertise.
// ONE EXISTING CUSTOMER IS GRANDFATHERED PERMANENTLY, SO THIS STRIPE LINK MUST
// STAY LIVE AND UNTOUCHED. Nothing on the site offers it any more.
export const VENDOR_MANAGED_PAYMENT_LINK =
  'https://buy.stripe.com/5kQ6oH9cy4w57i36L7djO00'
export const VENDOR_MANAGED_PRICE = '$9.99'
export const VENDOR_MANAGED_PERIOD = 'USD/mo'
export const VENDOR_MANAGED_TRIAL_DAYS = 14

// --- LIVE CHECKOUT LINKS ----------------------------------------------------
// Created 2026-08-31. Both USD. Both carry a required "Agent name or listing
// URL" custom field. Neither has a free trial.
export const EDITORIAL_REVIEW_PAYMENT_LINK =
  'https://buy.stripe.com/28E5kD2Oa9Qp7i31qNdjO01'
export const EDITORIAL_MANAGED_PAYMENT_LINK =
  'https://buy.stripe.com/3cI5kDcoKfaJ0TFglHdjO02'

export type TierId = 'self' | 'review' | 'managed'

export interface Tier {
  id: TierId
  name: string
  price: string
  cadence: string
  timeline: string
  checkout: string
  summary: string
  points: string[]
}

export const TIERS: Tier[] = [
  {
    id: 'self',
    name: 'Self-managed',
    price: 'Free',
    cadence: '',
    timeline: 'no set timeline',
    checkout: '',
    summary: 'Listed after a light check of the basics, with your data as you supply it.',
    points: [
      'A lighter check of the basics, and your listing says so',
      'The fields a reader needs: what it does, who it is for, category and pricing',
      'No review timeline. We work through free submissions as capacity allows',
      'Open to community reviews',
    ],
  },
  {
    id: 'review',
    name: 'Editorial Review',
    price: '$39',
    cadence: 'one-time',
    timeline: '3 business days',
    checkout: EDITORIAL_REVIEW_PAYMENT_LINK,
    summary: 'A full editorial audit against your live public sources.',
    points: [
      'A full editorial audit: pricing, features, integrations, security claims and MCP status, all checked against your live sources',
      'The structured fields AI systems read - agent type, supported workflows and languages, deployment methods, contract and data-training terms, MCP role, and the sameAs links that identify your product across the web. Most of these never appear on the page a person sees',
      'Live within 3 business days',
      'An audited badge carrying the date we checked it',
      'A mention in our newsletter and a slot in the homepage rotation',
      'Your own marketing hook on your card, editorially approved',
      'Paid up front and refunded in full if your agent does not qualify',
    ],
  },
  {
    id: 'managed',
    name: 'Editorial Managed',
    price: '$99',
    cadence: 'per month',
    timeline: '1 business day',
    checkout: EDITORIAL_MANAGED_PAYMENT_LINK,
    summary: 'Everything in Editorial Review, plus a re-audit every 30 days.',
    points: [
      'Everything in Editorial Review',
      'Live within 1 business day',
      'Re-audited every 30 days, so your listing stays accurate as your product and pricing change - and the date on your badge stays recent',
      'Cancel anytime',
    ],
  },
]

export function getTier(id: TierId): Tier {
  return TIERS.find(t => t.id === id) ?? TIERS[0]
}

// --- PLACEMENTS -------------------------------------------------------------
// Prices rose about $50 each on 2026-08-31 when accuracy maintenance moved
// from the retiring $9.99 tier to a 14-day cycle carried by the placement
// itself. Nobody was paying for a placement at the time, so nothing was
// grandfathered.

export interface Placement {
  id: string
  name: string
  price: string
  period: string
  was: string | null
  spots: string
  availability: string
  who: string
  lead: string
  features: string[]
  note: string | null
  badge: string | null
  highlight: boolean
}

export const PLACEMENTS: Placement[] = [
  {
    id: 'premium-featured',
    name: 'Premium Featured Listing',
    price: '$129',
    period: 'USD/mo',
    was: '$79',
    spots: 'Limited spots',
    availability: 'Agents + Agencies',
    who: 'For a product that already converts once people find it.',
    lead: 'Permanent placement in the Featured Agents section on the homepage, and a full-width branded banner on your own listing with your hook, your colours and one dominant call to action. The page stops looking like a directory entry and starts looking like yours.',
    features: [
      'Permanent placement in the Featured Agents section on the homepage',
      'Full-width branded banner on your listing page, with logo and background branding',
      'Your marketing hook and an optional subhook, editorially approved',
      'One dominant CTA button with your link and your wording',
      'Your rating and starting price shown as social proof beside the CTA',
      'The standard "Visit site" button demoted to secondary',
      'Re-audited every 14 days, so a promoted listing is never a stale one',
      'A feature in our biweekly newsletter',
    ],
    note: 'Agency listings include the banner but not homepage placement.',
    badge: 'Most popular',
    highlight: true,
  },
  {
    id: 'comparison-placement',
    name: 'Comparison Placement',
    price: '$199',
    period: 'USD/mo',
    was: '$149',
    spots: 'Limited spots',
    availability: 'Agents only',
    who: 'For a product that wins on a straight comparison but keeps getting left out of them.',
    lead: 'Comparison pages are where buyers arrive already deciding. This puts you on the alternatives page of your choice, gives you a comparison page written by our editorial team, and places you as an "Also Consider" on up to three competitor listings.',
    features: [
      'Placement on one alternatives page of your choice, with a positioning snippet',
      'One custom comparison page written by our editorial team, on a matchup you pick',
      '"Also Consider" placement on up to three competitor listings of your choice',
      'Full-width branded banner with your CTA on your own listing page',
      'Re-audited every 14 days',
      'A feature in our biweekly newsletter',
    ],
    note: 'Where a vendor shapes how their own side of a comparison reads, the page says so, and the other product stays our independent assessment. Any claim you supply is verified like every other claim on this site.',
    badge: null,
    highlight: false,
  },
  {
    id: 'category-sponsor',
    name: 'Category Sponsor',
    price: '$299',
    period: 'USD/mo',
    was: '$249',
    spots: 'One per category, eight in total',
    availability: 'Agents only',
    who: 'For a product that wants to own the category, not a slot in it.',
    lead: 'A full-width spotlight at the top of your category page, above every listing. It is the first thing a buyer sees after they choose the category and before they see a single competitor.',
    features: [
      'Full-width spotlight on the category page, above the agent listings',
      'Logo, description, capability tags and a CTA button',
      'Mentioned in relevant guides and comparison pages',
      'A sponsor marker on your own listing',
      'Labelled "Category Sponsor" so readers know it is paid',
      'Re-audited every 14 days',
      'A feature in our biweekly newsletter',
    ],
    note: 'Eight categories, one sponsor each. When a category is taken it is taken.',
    badge: null,
    highlight: false,
  },
  {
    id: 'listing-banner',
    name: 'Agent Listing Banner',
    price: '$399',
    period: 'USD/mo',
    was: '$349',
    spots: 'One per category, eight in total',
    availability: 'Agents only',
    who: 'For a product being evaluated against everyone else in its category.',
    lead: 'Your banner sits at the top of every agent listing in your category. Someone reading a competitor review has already narrowed their shortlist and is deep in evaluation. This is the only placement that reaches them there.',
    features: [
      'A horizontal banner at the top of every agent listing in the category',
      'Logo, tagline, pricing and CTA in one compact row',
      'Appears across 30 to 50 individual listing pages per category',
      'Never appears on your own listing page',
      'Labelled "Sponsored" so readers know it is paid',
      'Re-audited every 14 days',
      'A feature in our biweekly newsletter',
    ],
    note: 'The highest impression volume of any placement.',
    badge: 'Highest reach',
    highlight: false,
  },
]

export const DEMO_VIDEO = {
  name: 'Demo Video Add-On',
  price: '$29',
  period: 'USD/mo with any paid tier',
  standalone: '$49/mo standalone',
  availability: 'Agents + Agencies',
  lead: 'A product demo embedded in your listing hero, where buyers form their first impression. Under two minutes works best.',
  features: [
    'Demo embedded in the hero section of your listing page',
    'Click to play, with a thumbnail preview and duration badge',
    'Sits beside your hook on desktop, stacks below on mobile',
    'YouTube, Vimeo and MP4 supported',
  ],
}