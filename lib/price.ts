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
  const code = info.price_currency ?? 'USD'
  return code === 'USD' ? '$' : code + ' '
}

/** Full inline form, for prose and template variables. e.g. "$7/mo billed annually" */
export function formatPrice(info: PriceInfo): string {
  if (info.starting_price === 0 || info.pricing_model === 'free') return 'free'
  if (info.starting_price == null) return 'custom pricing'
  // Usage pricing is per-unit, not per-month. Never append "/mo".
  if (info.billing_period === 'usage') {
    return currencyPrefix(info) + money(info.starting_price) + (info.price_unit ? ' ' + info.price_unit : ' usage-based')
  }
  const base = currencyPrefix(info) + money(info.starting_price) + '/mo'
  if (info.billing_period === 'annual') return base + ' billed annually'
  return base
}

/** Compact card form. e.g. "From $7/mo" | "$0.99 per resolution" | "Free" */
export function formatCardPrice(info: PriceInfo, prefix = ''): string {
  if (info.starting_price === 0 || info.pricing_model === 'free') return 'Free'
  if (info.starting_price == null) return 'Custom'
  if (info.billing_period === 'usage') {
    return currencyPrefix(info) + money(info.starting_price) + (info.price_unit ? ' ' + info.price_unit : '')
  }
  const base = prefix + currencyPrefix(info) + money(info.starting_price) + '/mo'
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