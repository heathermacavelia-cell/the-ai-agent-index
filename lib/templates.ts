import { formatPrice, formatStars, type PriceInfo } from '@/lib/price'
import {
  resolveRating,
  ON_OUR_RADAR_LABEL,
  type RatingAgent,
} from '@/lib/rating'

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
 *
 * RATINGS WERE ADDED 2026-09-07, FOR THE SAME REASON AND FROM THE SAME KIND OF
 * DEFECT. Three surfaces - the /ai-coding-agents category page and two
 * comparison pages - published Cursor at 4.8 editorial and 4.7 / 298 on G2,
 * hand-typed on the day they were written. The row reads 4.6 and 314. The
 * numbers did not drift; PROSE CANNOT DRIFT. They were correct when typed and
 * the row moved underneath them, which is the one failure mode a copy can
 * never detect about itself. Every hand-typed number in editorial prose is a
 * dated snapshot wearing the costume of a current fact.
 */

/** {{slug.starting_price}} - renders another agent's entry price. */
export const PRICE_VAR_REGEX = /\{\{([a-z0-9-]+)\.starting_price\}\}/g

/** {{slug.name}} - renders another agent's CURRENT display name. */
export const NAME_VAR_REGEX = /\{\{([a-z0-9-]+)\.name\}\}/g

/**
 * {{slug.rating}} - OUR editorial rating, as the site itself would show it.
 *
 * This variable NEVER reads editorial_rating. It calls resolveRating(), which
 * lib/rating.ts describes as "THE resolver. Every other export is a thin
 * wrapper around this so no two surfaces can answer differently." Prose is now
 * one of those surfaces, so it resolves through the same function or it becomes
 * the twelfth copy this file was written to delete.
 *
 * A SUPPRESSED AGENT RENDERS THE WORDS "On Our Radar", NOT A NUMBER. That is
 * not a failure to resolve - it is the correct published value, and the whole
 * point of routing through the resolver. Writing "{{clearscope.rating}} out of
 * 5" would then read badly, so DO NOT write a template into a sentence that
 * assumes a number. Write the sentence so the label reads correctly, or do not
 * template that clause.
 */
export const RATING_VAR_REGEX = /\{\{([a-z0-9-]+)\.rating\}\}/g

/** {{slug.g2_rating}} - the G2 average, one decimal, as every other surface renders it. */
export const G2_RATING_VAR_REGEX = /\{\{([a-z0-9-]+)\.g2_rating\}\}/g

/** {{slug.g2_review_count}} - the G2 review count, comma-grouped. */
export const G2_COUNT_VAR_REGEX = /\{\{([a-z0-9-]+)\.g2_review_count\}\}/g

/** {{github_stars}} - the OWNING agent's star count. Not slug-keyed. */
export const STARS_VAR_REGEX = /\{\{github_stars\}\}/g

/** Any template at all. Used to decide whether a text is author-controlled. */
export const ANY_VAR_REGEX = /\{\{[a-z0-9_.-]+\}\}/

/**
 * NOTE ON THE THREE RATING PATTERNS AND WHY THEY CANNOT COLLIDE.
 *
 * The slug class [a-z0-9-]+ excludes both '.' and '_'. So in the text
 * "{{cursor.g2_rating}}", RATING_VAR_REGEX cannot match: it would have to
 * consume "cursor.g2" as a slug, and '.' is not in the class. There is no
 * ordering dependency between the three replacements. This is asserted in the
 * harness rather than assumed, because "obviously cannot match" is exactly the
 * belief that produced rule 35.
 */

export interface AgentRef {
  slug: string
  name: string | null
  is_active: boolean | null
  price: PriceInfo
  /** The full shape resolveRating() requires. Never a single pre-computed number. */
  rating: RatingAgent
  g2_rating: number | null
  g2_review_count: number | null
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
    for (const m of t.matchAll(RATING_VAR_REGEX)) slugs.add(m[1])
    for (const m of t.matchAll(G2_RATING_VAR_REGEX)) slugs.add(m[1])
    for (const m of t.matchAll(G2_COUNT_VAR_REGEX)) slugs.add(m[1])
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
 *
 * editorial_rating_notes MUST stay in the select for the same class of reason.
 * resolveRating() parses the sub-scores out of it, and indEvidScore() defaults
 * a missing notes string to IndEvid 5 - which silently LIFTS an agent out of
 * On Our Radar suppression. A forgotten column here would publish a number for
 * an agent we deliberately do not score. Both failures are silent; both are
 * why every column this select carries is load-bearing.
 */
export async function buildRefMap(
  supabase: { from: (t: string) => any },
  slugs: string[]
): Promise<RefMap> {
  const map: RefMap = {}
  if (slugs.length === 0) return map
  const { data } = await supabase
    .from('agents')
    .select('slug, name, is_active, starting_price, pricing_model, billing_period, price_unit, price_currency, editorial_rating, editorial_rating_notes, rating_avg, rating_count, g2_rating, g2_review_count')
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
      rating: {
        editorial_rating: r.editorial_rating ?? null,
        editorial_rating_notes: r.editorial_rating_notes ?? null,
        rating_avg: r.rating_avg ?? null,
        rating_count: r.rating_count ?? null,
      },
      g2_rating: r.g2_rating ?? null,
      g2_review_count: r.g2_review_count ?? null,
    }
  }
  return map
}

/**
 * Comma grouping, written out rather than delegated to toLocaleString().
 *
 * toLocaleString() with no locale argument takes the RUNTIME's default. The
 * server that renders a page and the browser that hydrates it are two different
 * runtimes, and a review count that groups one way in Node and another in the
 * browser is a hydration mismatch inside editorial prose. ASCII only, per the
 * 2026-08-14d ruling, so no narrow no-break space.
 */
function groupThousands(n: number): string {
  const s = String(Math.trunc(Math.abs(n)))
  let out = ''
  for (let i = 0; i < s.length; i++) {
    if (i > 0 && (s.length - i) % 3 === 0) out += ','
    out += s[i]
  }
  return (n < 0 ? '-' : '') + out
}

/**
 * Options for resolveTemplates.
 *
 * keepNameTemplates leaves every {{slug.name}} in the string untouched, so a
 * later step can render it as a LINK rather than as bare text. Only a surface
 * that actually renders anchors may pass it. Anything that produces plain text
 * - the APIs, llms.txt, the MCP route, JSON-LD, meta descriptions - must leave
 * it off, because braces reaching those surfaces is the exact defect the
 * raw-brace check exists to catch.
 */
export interface ResolveOptions {
  keepNameTemplates?: boolean
}

/**
 * Resolve every template in one string.
 *
 * THE FALLBACK RULE, AND IT IS THE WHOLE POINT OF THIS FILE:
 *
 *   PRICE,  referent missing OR inactive -> return the RAW TEMPLATE.
 *   RATING, referent missing OR inactive -> return the RAW TEMPLATE.
 *   G2,     referent missing OR inactive -> return the RAW TEMPLATE.
 *   G2,     value absent or zero         -> return the RAW TEMPLATE.
 *   NAME,   referent missing             -> return the RAW TEMPLATE.
 *   NAME,   referent inactive            -> return the plain NAME.
 *
 * A price is a claim we must be able to stand behind, so an unresolvable one
 * FAILS LOUDLY: raw braces are ugly, visible, and already caught by the
 * raw-brace check every live verification runs. Printing "custom pricing"
 * instead is what let a fabricated price sit on a live page for three months.
 *
 * A RATING IS THE SAME KIND OF CLAIM AND GETS THE SAME TREATMENT, with one
 * distinction that matters: "On Our Radar" is a RESOLVED value, not a failure.
 * A suppressed agent resolves successfully to the label. Only a missing or
 * delisted referent falls back to braces.
 *
 * A G2 FIGURE IS A THIRD PARTY'S CLAIM, AND ABSENCE IS NOT ZERO. A row with no
 * G2 listing must not render "0 reviews" or "0.0/5" - the rest of the site
 * writes "No G2 listing" for that state, and prose that says 0 would be
 * asserting something G2 never published. So absent falls back to braces and
 * the sentence gets rewritten by a human, which is the correct outcome.
 *
 * A NAME is not a claim, so a delisted vendor still renders its name - it just
 * gets no link, because we no longer publish a page to link to.
 */
export function resolveTemplates(
  text: string,
  refs: RefMap,
  ownStars?: number | null,
  opts?: ResolveOptions
): string {
  if (typeof text !== 'string' || text.indexOf('{{') === -1) return text
  let out = text.replace(PRICE_VAR_REGEX, (match, slug) => {
    const ref = refs[slug]
    if (!ref) return match
    if (ref.is_active === false) return match
    return formatPrice(ref.price)
  })
  out = out.replace(RATING_VAR_REGEX, (match, slug) => {
    const ref = refs[slug]
    if (!ref) return match
    if (ref.is_active === false) return match
    const resolved = resolveRating(ref.rating)
    if (resolved.suppressed) return ON_OUR_RADAR_LABEL
    if (resolved.value == null) return match
    return resolved.value.toFixed(1)
  })
  out = out.replace(G2_RATING_VAR_REGEX, (match, slug) => {
    const ref = refs[slug]
    if (!ref) return match
    if (ref.is_active === false) return match
    if (ref.g2_rating == null || ref.g2_rating <= 0) return match
    return ref.g2_rating.toFixed(1)
  })
  out = out.replace(G2_COUNT_VAR_REGEX, (match, slug) => {
    const ref = refs[slug]
    if (!ref) return match
    if (ref.is_active === false) return match
    if (ref.g2_review_count == null || ref.g2_review_count <= 0) return match
    return groupThousands(ref.g2_review_count)
  })
  if (!opts?.keepNameTemplates) {
    out = out.replace(NAME_VAR_REGEX, (match, slug) => {
      const ref = refs[slug]
      if (!ref || !ref.name) return match
      return ref.name
    })
  }
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
 *
 * ANY_VAR_REGEX already matches the three rating variables, because its class
 * [a-z0-9_.-] covers both the dot and the underscore. Templating a rating into
 * a field therefore ALSO switches that field to intentional linking, exactly as
 * templating a price does. That is a real behaviour change on any field whose
 * first template is a rating, and it is the intended one.
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

/**
 * One piece of a text that is about to be rendered as React nodes.
 *
 * `slug` present  -> render an anchor to /agents/{slug} with `text` inside.
 * `slug` absent   -> render `text` as-is.
 */
export interface TemplateSegment {
  text: string
  slug?: string
}

/**
 * THE RENDERER HALF OF INTENTIONAL LINKING, FOR SURFACES THAT EMIT REACT NODES.
 *
 * Feed it a string that has already been through resolveTemplates with
 * { keepNameTemplates: true }, so prices, ratings and stars are resolved and
 * only {{slug.name}} is left. It splits the string on those templates and says,
 * per piece, whether it is an anchor.
 *
 * THE THREE OUTCOMES MIRROR resolveTemplates EXACTLY, and that is deliberate -
 * a field must not read differently depending on which surface renders it:
 *
 *   referent missing  -> the RAW TEMPLATE, as text. Fails loudly.
 *   referent inactive -> the plain NAME, NO link. We publish no page for it.
 *   referent active   -> the NAME, linked.
 *
 * EVERY occurrence is linked, unlike the auto-linker's once-per-name rule. The
 * author put each template where they wanted a link; that is the whole point.
 */
export function segmentNameTemplates(text: string, refs: RefMap): TemplateSegment[] {
  if (typeof text !== 'string' || text.length === 0) return []
  if (text.indexOf('{{') === -1) return [{ text }]
  const out: TemplateSegment[] = []
  let lastIndex = 0
  for (const m of text.matchAll(NAME_VAR_REGEX)) {
    const idx = m.index ?? 0
    if (idx > lastIndex) out.push({ text: text.slice(lastIndex, idx) })
    const ref = refs[m[1]]
    if (!ref || !ref.name) out.push({ text: m[0] })
    else if (ref.is_active === false) out.push({ text: ref.name })
    else out.push({ text: ref.name, slug: ref.slug })
    lastIndex = idx + m[0].length
  }
  if (lastIndex < text.length) out.push({ text: text.slice(lastIndex) })
  return out
}

/**
 * THE SAME RENDERER FOR SURFACES THAT BUILD AN HTML STRING - today only the
 * category page, whose editorial_content goes through a markdown pass.
 *
 * Run it AFTER the markdown pass, on the HTML, exactly where applyInternalLinks
 * runs. Braces survive a markdown pass untouched, which is what makes the
 * ordering work.
 *
 * `linkStyle` defaults to the category page's existing auto-link style so a
 * deliberate link is visually identical to the automatic one it replaces.
 *
 * THE INSIDE-AN-ANCHOR GUARD is the same one applyInternalLinks uses: a
 * template written inside a markdown link, [{{clay.name}}](https://...), would
 * otherwise nest anchors and produce invalid HTML. It renders as a plain name
 * instead.
 */
export function renderNameTemplatesHtml(
  html: string,
  refs: RefMap,
  linkStyle = 'color:#2563EB;text-decoration:underline;'
): string {
  if (typeof html !== 'string' || html.indexOf('{{') === -1) return html
  return html.replace(NAME_VAR_REGEX, (match: string, slug: string, offset: number) => {
    const ref = refs[slug]
    if (!ref || !ref.name) return match
    if (ref.is_active === false) return ref.name
    const before = html.slice(0, offset)
    if (before.lastIndexOf('<a ') > before.lastIndexOf('</a>')) return ref.name
    return '<a href="/agents/' + ref.slug + '" style="' + linkStyle + '">' + ref.name + '</a>'
  })
}