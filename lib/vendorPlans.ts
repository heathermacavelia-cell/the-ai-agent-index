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
//   category  - $199 to $499/month by category traffic (ruled 2026-09-27),
//               one per category. Everything in featured, plus the category
//               spotlight AND the banner on every listing in it.
//
// PRICING RULES, ruled 2026-09-27 and updated 2026-10-25 (Heather): prices
// follow traffic but a sponsor is never bid against. Own the Category is priced
// per category from that category's trailing 30-day visits, refreshed monthly.
// An UNSOLD category's price may move at any monthly refresh. A category WITH a
// paying sponsor gets 3 months' notice of any change to the sponsor's price, and
// an increase is capped at 25% at a time. The old 6-month start-price lock is
// dropped (2026-10-25). If a category's traffic falls below its band, the
// sponsor's price drops to the lower band. A sponsor keeps
// the category for as long as they keep paying. Stripe keeps every existing
// subscription on its own price, so a new rate reaches new buyers only; an
// increase for an existing sponsor is a manual change in Stripe at renewal.
// Editorial Managed ($99/mo) and Premium Featured ($129/mo) were MERGED into
// Featured Listing; Category Sponsor ($299) and Agent Listing Banner ($399)
// were MERGED into Own the Category. Nobody held any of them, so nothing was
// grandfathered. The newsletter perk was DROPPED from every product.
//
// THE BADGE MEANS AUDITED, NEVER PAID, AND IT CARRIES ITS DATE.
// Paid placement is labeled BOOSTED / SPONSORED so a first-time reader can tell.

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
// WHILE A LINK IS EMPTY THE PAGE FALLS BACK TO THE INQUIRY FORM, so an empty
// string is safe to deploy.
export const FEATURED_PAYMENT_LINK = 'https://buy.stripe.com/3cI4gzcoKe6FdGr2uRdjO04'
// FEATURED LISTING, ANNUAL (Heather 2026-11-10): $1,290 USD a year, two months
// free. Same Stripe product as the monthly link, its own yearly price, renews
// automatically. Opened by Claude 2026-11-10: per year, USD 1,290, both custom
// fields. Stripe's renewal-reminder email is OFF ON PURPOSE (it cannot be limited
// to yearly plans and would email every monthly subscriber every month). For each
// annual sale, Claude schedules a task ~30 days before renewal that drafts a
// reminder for Heather to send. Card-network rules require that reminder.
export const FEATURED_ANNUAL_PAYMENT_LINK = 'https://buy.stripe.com/eVqfZhbkG6Ed8m7b1ndjO0p'
export const FEATURED_ANNUAL_PRICE = '$1,290'
// FOUNDING PRICE (Heather 2026-11-10): the first 10 Featured vendors keep the
// price they signed up at while continuously subscribed. Nothing to set in
// Stripe: a later increase is a NEW price for new buyers only. Everyone else
// renews at the price of the day, with 60 days' notice and any increase capped
// at 25% at a time. When 10 vendors hold Featured, set this note to ''.
export const FEATURED_FOUNDING_NOTE = 'Founding price: the first 10 Featured vendors keep the price they sign up at for as long as they stay subscribed.'
export const COMPARISON_PAYMENT_LINK = 'https://buy.stripe.com/cNibJ1dsO7Ih59Vc5rdjO05'
export const CATEGORY_PAYMENT_LINK = 'https://buy.stripe.com/14A00j2OabYx59V1qNdjO06'

// --- OWN THE CATEGORY, PRICED BY TRAFFIC (ruled 2026-09-27) -------------------
// ONE STRIPE PAYMENT LINK PER CATEGORY (Heather, 2026-09-27), so a price change
// touches one category only and a buyer can never pick the wrong category.
// Each link: USD, monthly subscription, product "Own the Category - {label}",
// required custom field "Agent name or listing URL". Paste each link here.
// WHILE A LINK IS EMPTY, THAT CATEGORY'S BUTTON FALLS BACK TO THE INQUIRY FORM,
// so empty is safe to deploy. CATEGORY_PAYMENT_LINK above (the old $499 link
// with a Category dropdown) is used by nothing once these are filled - DEACTIVATE
// it in Stripe only AFTER the new links are live and verified. Do not delete it.
// A PRICE CHANGE = a NEW link for that category pasted here, then the
// old link deactivated. Existing sponsors stay on their own subscription price.
// Created by Heather 2026-09-27; each opened by Claude 09-27 and confirmed:
// product "Own the Category - {label}", correct USD price, monthly.
export const CATEGORY_LINKS: Record<string, string> = {
  'ai-coding-agents': 'https://buy.stripe.com/cNi28rdsOfaJ59VedzdjO07',
  'ai-workflow-agents': 'https://buy.stripe.com/cNi3cv9cy3s16dZ0mJdjO08',
  'ai-research-agents': 'https://buy.stripe.com/aFa7sL4WibYx8m74CZdjO09',
  'ai-customer-support-agents': 'https://buy.stripe.com/14A3cvagC6EdcCn8TfdjO0o', // $249 from 2026-10-08 (Q4 review); old $199 link 9B6cN52Oa0fP8m7glHdjO0a to be deactivated
  'ai-marketing-agents': 'https://buy.stripe.com/cNibJ13Sed2B31N1qNdjO0b',
  'ai-sales-agents': 'https://buy.stripe.com/6oU3cv0G2aUtdGr4CZdjO0c',
  'ai-hr-agents': 'https://buy.stripe.com/cNibJ1bkG3s1eKv9XjdjO0d',
  'ai-customer-success-agents': 'https://buy.stripe.com/9B66oH9cy4w59qb1qNdjO0e',
}

// The bands. A category's band is set by hand at a monthly refresh from its
// visits in CATEGORY_SPONSORS below (unsold categories only - a sponsor's price
// changes only after 3 months' notice). Floor is $199 because Own the
// Category includes Featured Listing ($129).
export const CATEGORY_BANDS = [
  { price: '$499', minVisits: 3000 },
  { price: '$299', minVisits: 1000 },
  { price: '$249', minVisits: 600 },
  { price: '$199', minVisits: 0 },
]

// Shown beside every price on /advertise. Plain language, one source.
export const PRICING_TERMS = [
  'Category prices follow each category\'s traffic, which we update monthly. A category nobody has bought can change price at any monthly update.',
  'Once you are the sponsor, you get 3 months\' notice of any change to your price, and any increase is capped at 25% at a time.',
  'If a category\'s traffic falls, its price falls too.',
  'While you keep paying, your category stays yours. Nobody can outbid you for it.',
]

// THE TRAFFIC SNAPSHOT behind the category prices. Vercel Web Analytics,
// production, Oct 10 - Nov 8 2026, pulled 2026-11-09 (claude/traffic-snapshot-2026-11-09.md).
// EXCLUDES Singapore, China and Hong Kong, whose traffic is spread thinly
// across every page and behaves like automated traffic. "Visits" = page
// visits summed per page, NOT unique people - never call them people.
// Category total = category page + its listings + comparison pages (counted
// under the first-named agent) + alternatives pages.
// CADENCE (Heather, 2026-09-27, updated 2026-10-25): TRAFFIC NUMBERS ARE
// REFRESHED MONTHLY. A monthly refresh updates visits and TRAFFIC_PERIOD, and may
// move the price and checkout of an UNSOLD category only. A sponsored category's
// price changes only after 3 months' notice to the sponsor.
export const TRAFFIC_PERIOD = 'Oct 10 - Nov 8, 2026'
// The price-change sentence on its own, so /advertise/agencies can strip it
// (Agency Spotlight has its own terms).
export const PRICE_CHANGE_NOTE = 'A category nobody has bought can change price at a monthly update. A sponsor gets 3 months\' notice of any change to their price.'
export const TRAFFIC_SOURCE_NOTE = 'Visits in the 30 days ' + TRAFFIC_PERIOD + ', from Vercel Web Analytics. These count page visits, not unique people, and exclude traffic from Singapore, China and Hong Kong, which behaves like automated traffic. Traffic is updated monthly. ' + PRICE_CHANGE_NOTE
// Across the whole site, same period and exclusions.
export const COMPARISON_SITE_VISITS = 2605
export const ALTERNATIVES_SITE_VISITS = 2639

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

// 'managed' is no longer offered on the submit form. Since 2026-09-27 a row with
// submitted_tier = 'managed' is a PAYING Featured Listing holder: the homepage
// Featured table (app/page.tsx pickFeatured) always shows those rows first.
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
    // Since 2026-09-27 free listings have an ESTIMATED wait, calculated live in
    // lib/freeQueue.ts. This string is only a fallback when the count is unreadable.
    timeline: 'our weekly batches',
    checkout: '',
    summary: 'Listed after a light check of the basics, with your data as you supply it.',
    points: [
      'A lighter check of the basics, and your listing says so',
      'The fields a reader needs: what it does, who it is for, category and pricing',
      'Published in our weekly batches, oldest first. We show the current estimated wait before you submit',
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
  {
    // Featured Listing as a submission tier (Heather 2026-11-09: "why pay for a
    // listing that goes stale?"). Default choice on /submit. A NEW listing goes
    // live within 3 business days (same audit as the review); an existing listing
    // upgrading keeps /advertise's 1 business day. On payment set
    // submitted_tier = 'managed' and vendor_managed = true: 'managed' is the one
    // marker for a paying Featured holder (homepage Featured table, vendor box).
    id: 'managed',
    name: 'Featured Listing',
    price: '$129',
    cadence: 'a month',
    timeline: '3 business days',
    badge: 'Recommended',
    checkout: FEATURED_PAYMENT_LINK,
    summary: 'The full audit, then re-audited every 14 days so your listing never goes stale.',
    points: [
      'Everything in the Editorial Review: the full audit, the structured data AI systems read and the dated audited badge',
      'Re-audited every 14 days against your live pricing, plans and features, with a report to you after each one',
      'AI assistants repeat what your listing says, so it stays current when your product changes',
      'A guaranteed spot in the homepage Featured Agents table and a branded banner on your listing',
      'Live within 3 business days',
      'Cancel anytime. Refunded in full if your agent does not qualify',
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
    // Agents only from 2026-10-08 (Heather): the agencies directory is too new to
    // charge $129 for. Agencies buy Agency Spotlight instead (/advertise/agencies).
    availability: 'Agents only',
    who: 'Keep your listing right, and make it look like yours.',
    lead: 'Your listing is fully audited, then re-audited every 14 days, so when your pricing or features change the record buyers and AI systems read changes with it. It also gets a guaranteed spot in the Featured Agents table on the homepage and a full-width branded banner on your own page.',
    short: 'Re-audited every 14 days with a report to you each time, a guaranteed homepage Featured spot and a branded banner with your demo video.',
    features: [
      'Everything in the $39 Editorial Review, included: the full audit, the structured data AI systems read and the dated audited badge',
      'Re-audited every 14 days against your live pricing, plans, features and security pages',
      'A report after every re-audit: what we checked and changed, how often AI systems read your listing, the questions Microsoft Copilot answered from it when Bing reports them, and where else buyers find you on this site',
      'Your launches added within 1 business day: send us the release and we verify it, add it to your listing and log it in our changelog',
      'A guaranteed spot in the homepage Featured Agents table, which shows 5 listings at a time',
      'A full-width branded banner on your listing, with your logo, your hook, one call-to-action button with your link and wording, and your product demo video',
      'Your own tracking link on your Visit buttons',
      'Live within 1 business day',
      'Pay monthly and cancel anytime, or pay yearly and get two months free',
    ],
    note: 'The homepage Featured table shows 5 listings at a time. Featured Listing holders always appear first, and the remaining spots rotate among our partner listings. If more than 5 vendors hold Featured, their spots rotate.',
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
    // Traffic proof shown on /advertise from COMPARISON_SITE_VISITS / ALTERNATIVES_SITE_VISITS.
    short: 'Everything in Featured, plus a place on the comparison and alternatives pages where buyers decide.',
    features: [
      'Everything in Featured Listing',
      'Placement on one alternatives page of your choice, with a positioning snippet',
      'One custom comparison page written by our editorial team, on a matchup you pick',
      '"Also Consider" placement on up to three competitor listings of your choice',
      'Labeled "Sponsored" so readers know it is paid',
    ],
    note: 'Where a vendor shapes how their own side of a comparison reads, the page says so, and the other product stays our independent assessment. Any claim you supply is verified like every other claim on this site.',
    badge: null,
    highlight: false,
  },
  {
    id: 'own-the-category',
    name: 'Own the Category',
    // Priced per category since 2026-09-27. Emails and the dashboard quote this
    // as "from $199 a month"; the per-category price and checkout live in
    // CATEGORY_SPONSORS. checkout is empty ON PURPOSE: the buyer must pick a
    // category first, so buttons send them to /advertise#availability.
    price: 'from $199',
    period: 'USD/mo',
    checkout: '',
    spots: 'One per category, eight in total',
    availability: 'Agents only',
    who: 'Be the first thing every buyer in your category sees.',
    lead: 'A full-width spotlight at the top of your category page, above every listing, and your banner at the top of every competitor listing in the category. Someone reading a competitor review has already narrowed their shortlist. This is the only placement that reaches them there.',
    short: 'Everything in Featured, plus the top of your category page and a banner on every competitor listing in it. One per category, priced by its traffic.',
    features: [
      'Everything in Featured Listing',
      'A full-width spotlight on your category page, above the agent listings, with logo, description, capability tags and a button',
      'A banner at the top of every other agent listing in your category',
      'Never shown on your own listing, and never on another category',
      'Labeled "Sponsored" so readers know it is paid',
    ],
    note: 'Eight categories, one sponsor each, each priced by its own traffic. Pick yours in the table below, which shows every category\'s visits and price.',
    badge: 'Highest reach',
    highlight: false,
  },
]

export function getPlacement(id: string): Placement {
  return PLACEMENTS.find(p => p.id === id) ?? PLACEMENTS[0]
}

// --- CATEGORY AVAILABILITY AND PRICE, for the Own the Category grid ---------
// sponsor: set to the sponsor's agent name when it sells, back to null when it
// ends. The grid on /advertise reads this directly.
// price / checkout: this category's band (CATEGORY_BANDS). Change at a
// monthly refresh only, and only for an unsold category - a current sponsor's
// price changes only after 3 months' notice.
// visits / comparisonVisits / alternativesVisits: TRAFFIC_PERIOD snapshot.
export interface CategorySponsor {
  slug: string
  label: string
  sponsor: string | null
  price: string
  checkout: string
  visits: number
  comparisonVisits: number
  alternativesVisits: number
}

export const CATEGORY_SPONSORS: CategorySponsor[] = [
  { slug: 'ai-coding-agents', label: 'Coding', sponsor: null, price: '$499', checkout: CATEGORY_LINKS['ai-coding-agents'], visits: 5250, comparisonVisits: 673, alternativesVisits: 2349 },
  { slug: 'ai-workflow-agents', label: 'Workflow', sponsor: null, price: '$299', checkout: CATEGORY_LINKS['ai-workflow-agents'], visits: 2060, comparisonVisits: 646, alternativesVisits: 122 },
  { slug: 'ai-research-agents', label: 'Research', sponsor: null, price: '$249', checkout: CATEGORY_LINKS['ai-research-agents'], visits: 1084, comparisonVisits: 313, alternativesVisits: 79 },
  { slug: 'ai-customer-support-agents', label: 'Customer Support', sponsor: null, price: '$249', checkout: CATEGORY_LINKS['ai-customer-support-agents'], visits: 905, comparisonVisits: 237, alternativesVisits: 11 },
  { slug: 'ai-marketing-agents', label: 'Marketing', sponsor: null, price: '$199', checkout: CATEGORY_LINKS['ai-marketing-agents'], visits: 1134, comparisonVisits: 254, alternativesVisits: 8 },
  { slug: 'ai-sales-agents', label: 'Sales', sponsor: null, price: '$199', checkout: CATEGORY_LINKS['ai-sales-agents'], visits: 879, comparisonVisits: 128, alternativesVisits: 29 },
  { slug: 'ai-hr-agents', label: 'HR', sponsor: null, price: '$199', checkout: CATEGORY_LINKS['ai-hr-agents'], visits: 568, comparisonVisits: 234, alternativesVisits: 17 },
  { slug: 'ai-customer-success-agents', label: 'Customer Success', sponsor: null, price: '$199', checkout: CATEGORY_LINKS['ai-customer-success-agents'], visits: 284, comparisonVisits: 81, alternativesVisits: 24 },
]

// --- INDEPENDENT AGENT TEST, ruled 2026-11-09e / priced 2026-11-10 (Heather) ---
// One-time. The vendor pays for the TEST, never the result: same published task
// list for every agent of its type, one retry per failed task in a fresh session,
// findings shown to the vendor before publication, retest after fixes, and the
// rating is never touched. Do NOT advertise that a vendor can block results.
// Task lists exist per agent_type; only 'workflow-builder' has one (v1, 2026-11-09).
// Stripe (created by Heather 2026-11-10, opened by Claude: USD one-time, fields
// Business name + Agent name or listing URL): test $799, retest $299.
export const AGENT_TEST = {
  name: 'Independent Agent Test',
  price: '$799',
  period: 'USD one-time',
  checkout: 'https://buy.stripe.com/8x2fZhgF08Ml31N8TfdjO0q',
  retestPrice: '$299',
  retestCheckout: 'https://buy.stripe.com/3cI3cvbkGd2B9qbd9vdjO0r',
  availability: 'Workflow builders',
  example: '/agents/zapier/test',
  who: 'Show buyers what your agent actually does.',
  lead: 'We run your agent through the same published task list as every agent of its type and publish the full results on their own page, linked from your listing. Buyers, and the AI systems that read this site, get a dated, hands-on record of what it did well and where it struggled.',
  features: [
    'The same published task list as every agent of its type, so results compare fairly',
    'One retry for any task that fails, in a fresh session',
    'You see our findings before publication, and we retest after you fix them',
    'A full report at its own page and a short summary in your listing hero',
    'The report says you paid for the test and saw the findings first. Paying never changes your rating',
    'Retest any time after you ship fixes or new features',
  ],
  note: 'Available now for workflow builders. For other agent types, ask us and we will tell you when the task list for your type is ready.',
}

// DEMO VIDEO ADD-ON RETIRED 2026-11-10 (Heather): nobody bought it. A demo video
// is now part of Featured Listing (shown in the branded banner). Rows with
// demo_video_url still render it; nothing on the site sells it separately.
// --- AGENCY SPOTLIGHT, ruled 2026-10-08 (Heather) ------------------------------
// Agencies are placed where buyers already are: a small Sponsored box on an agent
// category's listing, comparison, alternatives and category pages, up to
// AGENCY_SPOTLIGHT_SLOTS agencies per category. Inside the box, an agency that
// lists the tool on the page (tool_specializations) shows first.
//
// TERMS (Heather 2026-10-08): 1, 3 or 6 months, PAID UP FRONT, NO AUTO-RENEW.
// 3 months is 10% off, 6 months 15% off. A term keeps the price it was bought
// at; renewing is a new purchase at the price of the day. Traffic is checked
// MONTHLY (refresh CATEGORY_SPONSORS visits); a category's price moves only when
// its visits cross into another band, so the Stripe links rarely change.
// Coding is NOT offered: its readers are developers who build it themselves.
//
// HOW A SALE GOES LIVE: one row in agency_spotlights (agency_slug, category_slug,
// start_date, end_date, term_months). The box reads it on every render and drops
// the agency the day after end_date. Nothing else to switch off.
//
// STRIPE: one ONE-TIME payment link per band and term (9 links), USD, custom
// field "Agency name or website". The category travels on the link as
// ?client_reference_id=spotlight-{category slug} and shows on the payment in
// Stripe. WHILE A LINK IS EMPTY THE BUTTON FALLS BACK TO THE CONTACT FORM.
export const AGENCY_SPOTLIGHT_SLOTS = 3
export const AGENCY_SPOTLIGHT_EXCLUDED = ['ai-coding-agents']
export type SpotlightTerm = 1 | 3 | 6
export const SPOTLIGHT_TERMS: SpotlightTerm[] = [1, 3, 6]

export interface SpotlightBand {
  id: 'high' | 'mid' | 'low'
  minVisits: number
  monthly: number
  prices: Record<SpotlightTerm, number>
}
export const AGENCY_SPOTLIGHT_BANDS: SpotlightBand[] = [
  { id: 'high', minVisits: 1000, monthly: 49, prices: { 1: 49, 3: 132, 6: 250 } },
  { id: 'mid', minVisits: 300, monthly: 29, prices: { 1: 29, 3: 78, 6: 148 } },
  { id: 'low', minVisits: 0, monthly: 19, prices: { 1: 19, 3: 51, 6: 97 } },
]

// Paste each Stripe link here once created (one-time payment, USD).
// Created by Heather 2026-10-08; each opened by Claude 2026-10-08 and confirmed:
// product name, USD amount, one-time, required field "Agency name or website".
// high = "Workflow", mid = "Research, Support, Marketing or Sales",
// low = "HR or Customer Success" (the Stripe product names).
export const AGENCY_SPOTLIGHT_LINKS: Record<SpotlightBand['id'], Record<SpotlightTerm, string>> = {
  high: {
    1: 'https://buy.stripe.com/bJebJ1dsO5A945R8TfdjO0f',
    3: 'https://buy.stripe.com/8x24gz60m6EdcCn9XjdjO0g',
    6: 'https://buy.stripe.com/eVq3cv1K6d2Bauf3yVdjO0h',
  },
  mid: {
    1: 'https://buy.stripe.com/dRm5kD60m7Ih31Nc5rdjO0i',
    3: 'https://buy.stripe.com/fZu7sL2Oae6FfOz8TfdjO0j',
    6: 'https://buy.stripe.com/00wcN574qd2B0TF7PbdjO0k',
  },
  low: {
    1: 'https://buy.stripe.com/bJeaEX88ufaJ9qbc5rdjO0l',
    3: 'https://buy.stripe.com/6oUdR9bkG0fPfOz8TfdjO0m',
    6: 'https://buy.stripe.com/cNi28rgF0geNaufedzdjO0n',
  },
}

export interface SpotlightCategory {
  slug: string
  label: string
  visits: number
  comparisonVisits: number
  alternativesVisits: number
  band: SpotlightBand
}

export function spotlightBandFor(visits: number): SpotlightBand {
  return AGENCY_SPOTLIGHT_BANDS.find(b => visits >= b.minVisits) ?? AGENCY_SPOTLIGHT_BANDS[AGENCY_SPOTLIGHT_BANDS.length - 1]
}

// Same traffic snapshot as Own the Category (TRAFFIC_PERIOD), coding excluded.
export const SPOTLIGHT_CATEGORIES: SpotlightCategory[] = CATEGORY_SPONSORS
  .filter(c => !AGENCY_SPOTLIGHT_EXCLUDED.includes(c.slug))
  .map(c => ({ slug: c.slug, label: c.label, visits: c.visits, comparisonVisits: c.comparisonVisits, alternativesVisits: c.alternativesVisits, band: spotlightBandFor(c.visits) }))

export function spotlightCheckout(category: string, term: SpotlightTerm): string {
  const cat = SPOTLIGHT_CATEGORIES.find(c => c.slug === category)
  if (!cat) return ''
  const link = AGENCY_SPOTLIGHT_LINKS[cat.band.id][term]
  return link ? link + '?client_reference_id=spotlight-' + category : ''
}

export function isSpotlightCategory(category: string | null | undefined): boolean {
  return !!category && SPOTLIGHT_CATEGORIES.some(c => c.slug === category)
}
