// Single source of truth for vendor checkout links and listing-tier copy.
//
// THE LADDER AS RULED 2026-08-30/31:
//   self     - free. A lighter check of the basics. NO STATED TIMELINE AT ALL.
//   review   - $39 one-time. Full editorial audit. Live in 3 business days.
//   managed  - $99/month. Full audit, live in 1 business day, re-audit every 30 days.
//
// The $39 is taken UP FRONT and refunded in full if the listing does not
// qualify. There is no trial on it: a one-time payment has nothing to cancel.
//
// THE BADGE MEANS AUDITED, NEVER PAID, AND IT CARRIES ITS DATE. Any listing
// that passes a full audit carries it, including a free listing audited later.
// Paying buys speed and ongoing checks. It never affects rating, ranking or
// placement.
//
// Do not hardcode any of these URLs anywhere else. Import them from here.

// --- LEGACY: Vendor Managed, $9.99/mo ---------------------------------------
// RETIRED FOR NEW CUSTOMERS 2026-08-30 and removed from /submit.
// ONE EXISTING CUSTOMER IS GRANDFATHERED ON THIS PLAN PERMANENTLY, SO THIS
// STRIPE LINK MUST STAY LIVE AND UNTOUCHED. /advertise still imports these
// three constants until that page is rewritten.
export const VENDOR_MANAGED_PAYMENT_LINK =
  'https://buy.stripe.com/5kQ6oH9cy4w57i36L7djO00'
export const VENDOR_MANAGED_PRICE = '$9.99'
export const VENDOR_MANAGED_PERIOD = 'USD/mo'
export const VENDOR_MANAGED_TRIAL_DAYS = 14

// --- CURRENT LADDER ---------------------------------------------------------
// Live Stripe payment links, created 2026-08-31. Both are USD, both carry a
// required "Agent name or listing URL" custom field, neither has a free trial.
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

// --- PLACEMENT PRODUCTS -----------------------------------------------------
// RULED 2026-08-31: every paid placement now INCLUDES ongoing accuracy
// maintenance, because a stale listing in a featured slot damages the index as
// much as it damages the vendor. Each price rose by about $50 to carry it.
//
// This also resolves the dominance problem the change created: with
// maintenance included at the old $79, Premium Featured would have been
// strictly better than Editorial Managed at $99 and nobody would ever have
// bought the accuracy tier.
//
// NOT YET REFLECTED ON /advertise, the vendor dashboard rate card, or the green
// pill on agent pages. Those are the next deploy. Nothing imports this block
// yet - it is here so the prices have one home when they do.
export const PLACEMENT_TIERS = [
  { id: 'premium-featured', name: 'Premium Featured Listing', price: '$129/mo', previously: '$79/mo' },
  { id: 'comparison-placement', name: 'Comparison Placement', price: '$199/mo', previously: '$149/mo' },
  { id: 'category-sponsor', name: 'Category Sponsor', price: '$299/mo', previously: '$249/mo' },
  { id: 'listing-banner', name: 'Agent Listing Banner', price: '$399/mo', previously: '$349/mo' },
]