export interface PriceInfo {
    starting_price?: number | null
    pricing_model?: string | null
    billing_period?: string | null
    price_unit?: string | null
  }
  
  /** Full inline form, for prose and template variables. e.g. "$7/mo billed annually" */
  export function formatPrice(info: PriceInfo): string {
    if (info.starting_price === 0 || info.pricing_model === 'free') return 'free'
    if (info.starting_price == null) return 'custom pricing'
    // Usage pricing is per-unit, not per-month. Never append "/mo".
    if (info.billing_period === 'usage') {
      return '$' + info.starting_price + (info.price_unit ? ' ' + info.price_unit : ' usage-based')
    }
    const base = '$' + info.starting_price + '/mo'
    if (info.billing_period === 'annual') return base + ' billed annually'
    return base
  }
  
  /** Compact card form. e.g. "From $7/mo" | "$0.99 per resolution" | "Free" */
  export function formatCardPrice(info: PriceInfo, prefix = ''): string {
    if (info.starting_price === 0 || info.pricing_model === 'free') return 'Free'
    if (info.starting_price == null) return 'Custom'
    if (info.billing_period === 'usage') {
      return '$' + info.starting_price + (info.price_unit ? ' ' + info.price_unit : '')
    }
    return prefix + '$' + info.starting_price + '/mo'
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