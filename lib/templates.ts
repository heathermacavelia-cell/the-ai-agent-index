import { formatPrice, formatStars, type PriceInfo } from '@/lib/price'

/**
 * ONE resolver for the {{...}} template variables that appear in editorial prose.
 *
 * WHY THIS FILE EXISTS. Before it, the same logic lived in ELEVEN places
 * (four prose surfaces, the agents/compare/markdown APIs, the MCP route and
 * three newsletter pages). Two of those copies disagreed in production: the
 * agents API returned the raw template for an unknown slug while the agent
 * page printed "custom pricing" for the same slug on the same row. That is how
 * `nectar-agent` came to publish a price for Brandwatch, a vendor delisted on
 * 2026-05-08 - one surface showed braces, one invented a price, and a third
 * dropped the sentence. Nobody wrote that; eleven copies did.
 *
 * The newsletter archives are deliberately hardcoded and must NOT be migrated
 * to this file. A dated back issue is a record of what was true on its date.
 */

/** {{slug.starting_price}} - renders another agent's entry price. */
export const PRICE_VAR_REGEX = /\{\{([a-z0-9-]+)\.starting_price\}\}/g

/** {{slug.name}} - renders another agent's CURRENT display name. */
export const NAME_VAR_REGEX = /\{\{([a-z0-9-]+)\.name\}\}/g

/** {{github_stars}} - the OWNING agent's star count. Not slug-keyed. */
export const STARS_VAR_REGEX = /\{\{github_stars\}\}/g

/** Any template at all. Used to decide whether a text is author-controlled. */
export const ANY_VAR_REGEX = /\{\{[a-z0-9_.-]+\}\}/

export interface AgentRef {
  slug: string
  name: string | null
  is_active: boolean | null
  price: PriceInfo
}

export type RefMap = Record<string, AgentRef>

/**
 * Every slug referenced by any template in the supplied texts.
 * Pass every string that will be rendered, including array members.
 */
export function collectTemplateSlugs(texts: (string | null | undefined)[]): string[] {
  const slugs = new Set<string>()
  for (const t of texts) {
    if (typeof t !== 'string' || t.indexOf('{{') === -1) continue
    for (const m of t.matchAll(PRICE_VAR_REGEX)) slugs.add(m[1])
    for (const m of t.matchAll(NAME_VAR_REGEX)) slugs.add(m[1])
  }
  return [...slugs]
}

/**
 * Look the referenced slugs up ONCE.
 *
 * NOTE THE ABSENT is_active FILTER, WHICH IS DELIBERATE. A delisted agent is
 * still a real company a sentence may legitimately name, so we need to know
 * that it EXISTS and that it is INACTIVE - which is a different answer from
 * "not found". Filtering here is what made the agents API disagree with the
 * agent page.
 *
 * price_currency MUST stay in the select. lib/price.ts falls back to '$' when
 * it is missing and that failure is silent.
 */
export async function buildRefMap(
  supabase: { from: (t: string) => any },
  slugs: string[]
): Promise<RefMap> {
  const map: RefMap = {}
  if (slugs.length === 0) return map
  const { data } = await supabase
    .from('agents')
    .select('slug, name, is_active, starting_price, pricing_model, billing_period, price_unit, price_currency')
    .in('slug', slugs)
  for (const r of data ?? []) {
    map[r.slug] = {
      slug: r.slug,
      name: r.name ?? null,
      is_active: r.is_active ?? null,
      price: {
        starting_price: r.starting_price,
        pricing_model: r.pricing_model,
        billing_period: r.billing_period ?? null,
        price_unit: r.price_unit ?? null,
        price_currency: r.price_currency ?? null,
      },
    }
  }
  return map
}

/**
 * Resolve every template in one string.
 *
 * THE FALLBACK RULE, AND IT IS THE WHOLE POINT OF THIS FILE:
 *
 *   PRICE, referent missing OR inactive -> return the RAW TEMPLATE.
 *   NAME,  referent missing             -> return the RAW TEMPLATE.
 *   NAME,  referent inactive            -> return the plain NAME.
 *
 * A price is a claim we must be able to stand behind, so an unresolvable one
 * FAILS LOUDLY: raw braces are ugly, visible, and already caught by the
 * raw-brace check every live verification runs. Printing "custom pricing"
 * instead is what let a fabricated price sit on a live page for three months.
 *
 * A NAME is not a claim, so a delisted vendor still renders its name - it just
 * gets no link, because we no longer publish a page to link to.
 */
export function resolveTemplates(
  text: string,
  refs: RefMap,
  ownStars?: number | null
): string {
  if (typeof text !== 'string' || text.indexOf('{{') === -1) return text
  let out = text.replace(PRICE_VAR_REGEX, (match, slug) => {
    const ref = refs[slug]
    if (!ref) return match
    if (ref.is_active === false) return match
    return formatPrice(ref.price)
  })
  out = out.replace(NAME_VAR_REGEX, (match, slug) => {
    const ref = refs[slug]
    if (!ref || !ref.name) return match
    return ref.name
  })
  if (typeof ownStars === 'number') {
    out = out.replace(STARS_VAR_REGEX, formatStars(ownStars))
  }
  return out
}

/**
 * True when a text is AUTHOR-CONTROLLED - it contains at least one template.
 *
 * Auto-linking must be skipped on such a text. That is what makes the
 * migration to intentional linking safe and incremental: an untouched field
 * keeps today's behaviour, and the moment an author templates one name in it,
 * that field stops being auto-linked and becomes fully deliberate. No flag to
 * set, no list of converted pages to maintain, and it is reversible.
 */
export function isAuthorLinked(text: string | null | undefined): boolean {
  return typeof text === 'string' && ANY_VAR_REGEX.test(text)
}

/**
 * Slugs a text asks to LINK, in order. Consumers render the anchor themselves
 * because the markup differs per surface (next/link on pages, plain text in
 * the APIs and llms.txt, where a link would be noise).
 */
export function linkedSlugs(text: string | null | undefined): string[] {
  if (typeof text !== 'string') return []
  return [...text.matchAll(NAME_VAR_REGEX)].map(m => m[1])
}