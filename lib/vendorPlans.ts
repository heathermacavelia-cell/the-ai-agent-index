// Single source of truth for the Vendor Managed self-serve checkout.
//
// The Stripe payment link carries a 14-day free trial with the card collected
// up front. Nothing is charged during the trial, so if a submitted agent turns
// out not to be a fit for the index we cancel before the trial ends and the
// customer is never charged and there is nothing to refund.
//
// Do not hardcode this URL anywhere else. Import it from here.

export const VENDOR_MANAGED_PAYMENT_LINK =
  'https://buy.stripe.com/5kQ6oH9cy4w57i36L7djO00'

export const VENDOR_MANAGED_PRICE = '$9.99'
export const VENDOR_MANAGED_PERIOD = 'USD/mo'
export const VENDOR_MANAGED_TRIAL_DAYS = 14