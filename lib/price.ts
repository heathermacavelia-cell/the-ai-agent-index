export interface PriceInfo {
  starting_price?: number | null
  pricing_model?: string | null
  billing_period?: string | null
  price_unit?: string | null
  price_currency?: string | null
}

/**
 * Format a price figure for display.
 *
 * Integers stay bare so "$49" does not become "$49.00".
 * Fractional values pad to at least two decimals so 0.4 renders "$0.40" and
 * 37.6 renders "$37.60". Values with more than two decimals keep their real
 * precision, so 0.041 renders "0.041" rather than being rounded to "0.04".
 *
 * Every price string in this file and in the local formatPrice copies elsewhere
 * must go through this. A bare `'$' + number` drops trailing zeros and publishes
 * a wrong price, including into JSON-LD.
 */
export function money(n: number): string {
  if (Number.isInteger(n)) return String(n)
  const decimals = (String(n).split('.')[1] ?? '').length
  return n.toFixed(Math.max(2, decimals))
}

/**
 * Format a price figure for a HUMAN-READABLE surface: tiles, cards and prose.
 *
 * Whole numbers of 1,000 or more get a thousands separator, so 1000 renders
 * "1,000" and 14400 renders "14,400". Everything else is exactly money().
 *
 * Added 2026-10-06 (backlog A18). money() itself is deliberately untouched,
 * because JSON-LD, llms-full.txt and the markdown API need the bare number.
 * Never use this for a machine-readable price.
 */
export function displayMoney(n: number): string {
  if (Number.isInteger(n) && Math.abs(n) >= 1000) return n.toLocaleString('en-US')
  return money(n)
}

/**
 * The prefix that precedes a price figure, taken from the row's own
 * price_currency column.
 *
 * USD renders '$'. Every other currency renders its ISO code and a space, so
 * "EUR 12.99/mo" rather than a symbol that would have to survive email, JSON,
 * llms.txt and the markdown API. ASCII only, by ruling of 2026-08-14d.
 *
 * A row fetched by a query that forgot to select price_currency arrives here
 * as undefined and falls back to '$'. THAT FAILURE IS SILENT and renders as a
 * page that looks correct. Every price query in the app selects the column.
 * If you add a new one, add the column to it.
 */
export function currencyPrefix(info: PriceInfo): string {
  if (isPercentOfSpend(info)) return ''
  const code = info.price_currency ?? 'USD'
  return code === 'USD' ? '$' : code + ' '
}

/**
 * A fee charged as a percentage of what the customer spends elsewhere
 * (added 2026-11-06, Mindra: 5% of the ad spend it manages). Stored as
 * starting_price = the percentage, billing_period = 'usage', and a price_unit
 * that starts with 'percent' (e.g. 'percent of managed monthly ad spend').
 * It is not a currency amount: no currency prefix, no '/mo', no JSON-LD Offer.
 */
export function isPercentOfSpend(info: PriceInfo): boolean {
  return /^percent\b/i.test(info.price_unit ?? '')
}

/** "5% of managed monthly ad spend" for a percent-of-spend row. */
function percentLabel(info: PriceInfo): string {
  return displayMoney(info.starting_price as number) + '% ' + (info.price_unit ?? '').replace(/^percent\s*/i, '')
}

/**
 * A shut-down product. pricing_model = 'discontinued' with starting_price NULL
 * (added 2026-11-05, Fetcher). Every price surface says so rather than showing
 * a last-known price or "custom pricing", neither of which is true.
 */
export function isDiscontinued(info: PriceInfo): boolean {
  return info.pricing_model === 'discontinued'
}

/**
 * The per-entity unit of a SUBSCRIPTION price, as a "/unit" slot that goes
 * before "/mo": "seat" -> "/seat", "per user/month" -> "/user". Returns ''
 * when there is nothing to show.
 *
 * Added 2026-11-22. Before this, every subscription price dropped price_unit,
 * so a per-seat price ("$19 per seat a month, billed annually") rendered as
 * "$19/mo billed annually" and read as a flat monthly price for the whole team.
 *
 * Shown only for a single-word entity (seat, user, agent, workspace, ...).
 * NOT shown for:
 *   - 'account' / 'business': the whole customer, adds nothing.
 *   - multi-word units ("per 50 tickets", "per WhatsApp number",
 *     "per year, including ..."): these are not a per-entity price and need
 *     their own wording; they render exactly as before.
 *   - usage and percent-of-spend rows, which already print their unit.
 */
export function subscriptionUnit(info: PriceInfo): string {
  if (info.billing_period === 'usage' || isPercentOfSpend(info)) return ''
  const word = (info.price_unit ?? '').trim().replace(/^per\s+/i, '').replace(/\s*\/\s*month$/i, '').trim()
  if (!/^[a-z]+$/i.test(word)) return ''
  if (/^(account|business)$/i.test(word)) return ''
  return '/' + word.toLowerCase()
}

/**
 * Full inline form, for prose and template variables.
 * e.g. "$7/mo billed annually", "$19/seat/mo billed annually".
 * opts.omitUnit: the surrounding prose already names the unit
 * ("{{x.starting_price}} per seat"), so do not print it twice.
 */
export function formatPrice(info: PriceInfo, opts?: { omitUnit?: boolean }): string {
  if (isDiscontinued(info)) return 'no longer sold'
  if (info.starting_price === 0 || info.pricing_model === 'free') return 'free'
  if (info.starting_price == null) return 'custom pricing'
  if (isPercentOfSpend(info)) return percentLabel(info)
  // Usage pricing is per-unit, not per-month. Never append "/mo".
  if (info.billing_period === 'usage') {
    return currencyPrefix(info) + displayMoney(info.starting_price) + (info.price_unit ? ' ' + info.price_unit : ' usage-based')
  }
  const unit = opts?.omitUnit ? '' : subscriptionUnit(info)
  const base = currencyPrefix(info) + displayMoney(info.starting_price) + unit + '/mo'
  if (info.billing_period === 'annual') return base + ' billed annually'
  return base
}

/** Compact card form. e.g. "From $7/mo" | "$0.99 per resolution" | "Free" */
export function formatCardPrice(info: PriceInfo, prefix = ''): string {
  if (isDiscontinued(info)) return 'Discontinued'
  if (info.starting_price === 0 || info.pricing_model === 'free') return 'Free'
  if (info.starting_price == null) return 'Custom'
  if (isPercentOfSpend(info)) return percentLabel(info)
  if (info.billing_period === 'usage') {
    return currencyPrefix(info) + displayMoney(info.starting_price) + (info.price_unit ? ' ' + info.price_unit : '')
  }
  const base = prefix + currencyPrefix(info) + displayMoney(info.starting_price) + '/mo'
  if (info.billing_period === 'annual') return base + ' annual'
  return base
}

/** Small caption under a card price. e.g. "billed annually" | "" */
export function priceCaption(info: PriceInfo): string {
  if (!info.starting_price || info.starting_price <= 0) return ''
  if (info.billing_period === 'annual') return 'billed annually'
  return ''
}

export function formatStars(stars: number): string {
  if (stars >= 1000) {
    const k = stars / 1000
    return (k >= 100 ? Math.round(k).toString() : k.toFixed(1).replace(/\.0$/, '')) + 'k'
  }
  return String(stars)
}