// SINGLE SOURCE OF TRUTH FOR EVERY PRICE AND CHECKOUT LINK ON THIS SITE.
//
// If a price appears on a page, it is imported from here. Never hardcode one.
// This exists because /advertise, /submit, the vendor dashboard, /methodology,
// /terms and the vendor emails all quote the rate card, and several copies of a
// price is several chances to be wrong on the page a customer is reading.
//
// THE LADDER, ruled 2026-09-25 (replaces the 2026-08-31 ladder):
//   self      - free. A lighter check of the basics. NO STATED TIMELINE.
//   review    - $39 one-time. Full editorial audit. Live in 3 business days.
//   featured  - $129/month. Everything in review, re-audited every 14 days with
//               a note to the vendor, homepage Featured spot, branded banner.
//   comparison- $199/month. Everything in featured, plus comparison placement.
//   category  - $499/month, one per category. Everything in featured, plus the
//               category spotlight AND the banner on every listing in it.
// Editorial Managed ($99/mo) and Premium Featured ($129/mo) were MERGED into
// Featured Listing; Category Sponsor ($299) and Agent Listing Banner ($399)
// were MERGED into Own the Category. Nobody held any of them, so nothing was
// grandfathered. The newsletter perk was DROPPED from every product.
//
// THE BADGE MEANS AUDITED, NEVER PAID, AND IT CARRIES ITS DATE.
// Paid placement is labelled BOOSTED / SPONSORED so a first-time reader can tell.

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
// Created 2026-08-31. USD. Required "Agent name or listing URL" custom field.
// No free trial.
export const EDITORIAL_REVIEW_PAYMENT_LINK =
  'https://buy.stripe.com/28E5kD2Oa9Qp7i31qNdjO01'
// RETIRED 2026-09-25: the $99 Editorial Managed link
// (https://buy.stripe.com/3cI5kDcoKfaJ0TFglHdjO02) is no longer used anywhere.
// Archive it in Stripe. Do not delete it.

// --- PLACEMENT CHECKOUT LINKS, ruled 2026-09-25 -------------------------------
// Every placement is self-serve. Paste each Stripe Payment Link here once it is
// created (USD, monthly subscription, required custom field "Agent name or
// listing URL"; Own the Category also needs a required dropdown "Category").
// WHILE A LINK IS EMPTY THE PAGE FALLS BACK TO THE ENQUIRY FORM, so an empty
// string is safe to deploy.
export const FEATURED_PAYMENT_LINK = ''
export const COMPARISON_PAYMENT_LINK = ''
export const CATEGORY_PAYMENT_LINK = ''

// --- AGENCY INDEPENDENT REVIEW, ruled 2026-09-21b ----------------------------
// $39 one-time, the SAME price as the agent Editorial Review (ruling 12).
// Buys the "Independently Reviewed" badge, a place above free listings in the
// hub sort, and a self-hosted logo on the card and listing page (ruling 13).
// Its OWN Stripe link, separate from the agent one (ruled 2026-09-21c), so an
// agency payment can be told apart from an agent payment in Stripe.
// USD, one-time, required custom field "Agency name or website".
export const AGENCY_REVIEW_PAYMENT_LINK =
  'https://buy.stripe.com/eVq6oHewS5A9cCnd9vdjO03'
export const AGENCY_REVIEW_PRICE = '$39'
export const AGENCY_REVIEW_TIMELINE = '3 business days'

// 'managed' stays in the type only because old rows and old form posts may
// still carry it. It is no longer offered anywhere.
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
  badge?: string
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
      'The link to your site is marked as unreviewed (rel="ugc") until we audit your listing',
      'Open to community reviews',
    ],
  },
  {
    id: 'review',
    name: 'Editorial Review',
    price: '$39',
    cadence: 'one-time',
    timeline: '3 business days',
    badge: 'Recommended',
    checkout: EDITORIAL_REVIEW_PAYMENT_LINK,
    summary: 'A full editorial audit against your live public sources.',
    points: [
      'Your own tracking link on your listing\'s Visit buttons, with your website URL kept clean in the data AI systems read',
      'A full editorial audit: pricing, features, integrations, security claims and MCP status, all checked against your live sources',
      'The structured fields AI systems read - agent type, supported workflows and languages, deployment methods, contract and data-training terms, MCP role, and the sameAs links that identify your product across the web. Most of these never appear on the page a person sees',
      'Live within 3 business days',
      'An audited badge carrying the date we checked it',
      'Paid up front and refunded in full if your agent does not qualify',
    ],
  },
]

export function getTier(id: TierId): Tier {
  return TIERS.find(t => t.id === id) ?? TIERS[0]
}

// --- PLACEMENTS -------------------------------------------------------------
// A ladder: each step up puts the vendor somewhere new. Every placement includes
// the full audit and a re-audit every 14 days, so a promoted listing is never a
// stale one - and the re-audit is work the index needs done anyway.

export interface Placement {
  id: string
  name: string
  price: string
  period: string
  checkout: string
  spots: string
  availability: string
  who: string
  lead: string
  short: string
  features: string[]
  note: string | null
  badge: string | null
  highlight: boolean
}

export const PLACEMENTS: Placement[] = [
  {
    id: 'featured-listing',
    name: 'Featured Listing',
    price: '$129',
    period: 'USD/mo',
    checkout: FEATURED_PAYMENT_LINK,
    spots: 'Cancel anytime',
    availability: 'Agents + Agencies',
    who: 'Keep your listing right, and make it look like yours.',
    lead: 'Your listing is fully audited, then re-audited every 14 days, so when your pricing or features change the record buyers and AI systems read changes with it. It also gets a spot in the Featured Agents section on the homepage and a full-width branded banner on your own page.',
    short: 'Re-audited every 14 days, a homepage Featured spot and a branded banner on your own listing.',
    features: [
      'Everything in the $39 Editorial Review, included: the full audit, the structured data AI systems read and the dated audited badge',
      'Re-audited every 14 days against your live pricing, plans, features and security pages, with a short note after each one: what we checked and what we changed',
      'A spot in the Featured Agents section on the homepage',
      'A full-width branded banner on your listing, with your logo, your hook and one call-to-action button with your link and wording',
      'Your own tracking link on your Visit buttons',
      'Live within 1 business day',
      'Cancel anytime',
    ],
    note: 'Agency listings get the banner but not the homepage spot. If more vendors hold Featured than there are homepage spots, the spots rotate.',
    badge: null,
    highlight: true,
  },
  {
    id: 'comparison-placement',
    name: 'Comparison Placement',
    price: '$199',
    period: 'USD/mo',
    checkout: COMPARISON_PAYMENT_LINK,
    spots: 'Limited spots',
    availability: 'Agents only',
    who: 'Show up where buyers compare you with your competitors.',
    lead: 'Comparison pages are where buyers arrive already deciding. This puts you on the alternatives page of your choice, gives you a comparison page written by our editorial team, and places you as an "Also Consider" on up to three competitor listings.',
    short: 'Everything in Featured, plus a place on the comparison and alternatives pages where buyers decide.',
    features: [
      'Everything in Featured Listing',
      'Placement on one alternatives page of your choice, with a positioning snippet',
      'One custom comparison page written by our editorial team, on a matchup you pick',
      '"Also Consider" placement on up to three competitor listings of your choice',
      'Labelled "Sponsored" so readers know it is paid',
    ],
    note: 'Where a vendor shapes how their own side of a comparison reads, the page says so, and the other product stays our independent assessment. Any claim you supply is verified like every other claim on this site.',
    badge: null,
    highlight: false,
  },
  {
    id: 'own-the-category',
    name: 'Own the Category',
    price: '$499',
    period: 'USD/mo',
    checkout: CATEGORY_PAYMENT_LINK,
    spots: 'One per category, eight in total',
    availability: 'Agents only',
    who: 'Be the first thing every buyer in your category sees.',
    lead: 'A full-width spotlight at the top of your category page, above every listing, and your banner at the top of every competitor listing in the category. Someone reading a competitor review has already narrowed their shortlist. This is the only placement that reaches them there.',
    short: 'Everything in Featured, plus the top of your category page and a banner on every competitor listing in it. One per category.',
    features: [
      'Everything in Featured Listing',
      'A full-width spotlight on your category page, above the agent listings, with logo, description, capability tags and a button',
      'A banner at the top of every other agent listing in your category',
      'Never shown on your own listing, and never on another category',
      'Labelled "Sponsored" so readers know it is paid',
    ],
    note: 'Eight categories, one sponsor each. When a category is taken it is taken.',
    badge: 'Highest reach',
    highlight: false,
  },
]

export function getPlacement(id: string): Placement {
  return PLACEMENTS.find(p => p.id === id) ?? PLACEMENTS[0]
}

// --- CATEGORY AVAILABILITY, for the Own the Category grid --------------------
// Set a category's value to the sponsor's agent name when it sells, and back
// to null when it ends. The grid on /advertise reads this directly.
export const CATEGORY_SPONSORS: { slug: string; label: string; sponsor: string | null }[] = [
  { slug: 'ai-sales-agents', label: 'Sales', sponsor: null },
  { slug: 'ai-customer-support-agents', label: 'Customer Support', sponsor: null },
  { slug: 'ai-research-agents', label: 'Research', sponsor: null },
  { slug: 'ai-marketing-agents', label: 'Marketing', sponsor: null },
  { slug: 'ai-coding-agents', label: 'Coding', sponsor: null },
  { slug: 'ai-hr-agents', label: 'HR', sponsor: null },
  { slug: 'ai-workflow-agents', label: 'Workflow', sponsor: null },
  { slug: 'ai-customer-success-agents', label: 'Customer Success', sponsor: null },
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