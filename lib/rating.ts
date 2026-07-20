// lib/rating.ts
//
// SINGLE SOURCE OF TRUTH for two questions every rating surface must answer identically:
//   1. Do we show a number at all, or "On Our Radar"?  -> isOnOurRadar / resolveRating().suppressed
//   2. If a number, WHICH number?                       -> displayRating / resolveRating().value
//
// Every human-facing and machine-readable surface routes through this module so nothing
// drifts. See project-instructions PART 16 + the July 20 2026 rating-rebuild spec.
//
// LOCKED with Heather (do not "simplify"):
//   - The blend is floor-and-recalc, NOT the naive `rating_count > 0 ? rating_avg : editorial`.
//   - On Our Radar suppression: editorial_rating < 3.0  OR  IndEvid == 1.
//   - Sub-scores STAY PUBLIC (transparency is an asset). The only rule is: never emit the
//     numeric TOTAL for a suppressed agent (the raw notes string ends "= 3.35", which would
//     contradict the visible "On Our Radar").

export const ON_OUR_RADAR_LABEL = 'On Our Radar'
export const ON_OUR_RADAR_REASON = 'no independent third-party evidence yet'

// Minimal shape every caller already has from `select('*')` (or must add to its select).
export interface RatingAgent {
  editorial_rating: number | null
  editorial_rating_notes: string | null
  rating_avg: number | null
  rating_count: number | null
}

export interface SubScores {
  autCap: number
  intDepth: number
  priceTrans: number
  indEvid: number
  setupAcc: number
}

// Editorial formula weights — LOCKED, project-instructions STEP 10. Never change.
const W = { autCap: 0.35, intDepth: 0.25, priceTrans: 0.05, indEvid: 0.3, setupAcc: 0.05 }

// Half-up rounding to one decimal. Matches the "stored value ~0.05 above the noted total is
// half-up rounding BY DESIGN" rule in STEP 10.
function round1(n: number): number {
  return Math.round((n + Number.EPSILON) * 10) / 10
}

// Pull one "Label N" integer out of editorial_rating_notes.
// The separator between sub-scores is a UTF-8 middot in the DB (it only looks like mojibake in
// the SQL client). We key off the labels, so the separator is irrelevant and safe.
function parseScore(notes: string, label: string): number | null {
  const m = notes.match(new RegExp(label + '\\s+(\\d)'))
  return m ? parseInt(m[1], 10) : null
}

export function parseSubScores(notes: string | null): SubScores | null {
  if (!notes) return null
  const autCap = parseScore(notes, 'AutCap')
  const intDepth = parseScore(notes, 'IntDepth')
  const priceTrans = parseScore(notes, 'PriceTrans')
  const indEvid = parseScore(notes, 'IndEvid')
  const setupAcc = parseScore(notes, 'SetupAcc')
  if (
    autCap == null || intDepth == null || priceTrans == null ||
    indEvid == null || setupAcc == null
  ) {
    return null
  }
  return { autCap, intDepth, priceTrans, indEvid, setupAcc }
}

// IndEvid sub-score, defaulting to 5 when notes are absent/unparseable (spec 3a).
export function indEvidScore(agent: RatingAgent): number {
  if (!agent.editorial_rating_notes) return 5
  const v = parseScore(agent.editorial_rating_notes, 'IndEvid')
  return v == null ? 5 : v
}

// Community-review floor for IndEvid. Only RAISES, never lowers (spec 3a blend table).
//   0 reviews    -> no floor
//   1-4 reviews  -> 3
//   5+ reviews   -> 4
function indEvidFloor(reviews: number): number {
  if (reviews >= 5) return 4
  if (reviews >= 1) return 3
  return 0
}

function recomputeEditorial(subs: SubScores, effectiveIndEvid: number): number {
  return (
    subs.autCap * W.autCap +
    subs.intDepth * W.intDepth +
    subs.priceTrans * W.priceTrans +
    effectiveIndEvid * W.indEvid +
    subs.setupAcc * W.setupAcc
  )
}

export interface ResolvedRating {
  suppressed: boolean       // true => surface shows ON_OUR_RADAR_LABEL, never a number
  value: number | null      // the number to display when not suppressed; null when suppressed
  usedCommunity: boolean     // true => the blend folded in community rating_avg
  effectiveIndEvid: number   // IndEvid after the community floor
}

// THE resolver. Every other export is a thin wrapper around this so no two surfaces can
// answer differently.
export function resolveRating(agent: RatingAgent): ResolvedRating {
  const reviews = agent.rating_count ?? 0
  const subs = parseSubScores(agent.editorial_rating_notes)
  const rawIndEvid = indEvidScore(agent)

  // Effective IndEvid after the community floor (floor only raises).
  const effectiveIndEvid = Math.max(rawIndEvid, indEvidFloor(reviews))

  // Effective editorial number.
  //   Recompute from sub-scores ONLY when the community floor actually RAISES IndEvid
  //   (effectiveIndEvid > rawIndEvid). Otherwise the recompute would merely reproduce the
  //   stored editorial_rating, and re-deriving + re-rounding a float can disagree with the
  //   already-rounded stored value (perplexity's 4.15 -> stored 4.2 is exactly this trap).
  //   So when the floor is a no-op — which is EVERY real agent today — we use the stored
  //   value verbatim and the helper can never contradict the stored rating. reviews === 0
  //   also uses the stored value (spec: do NOT recompute the 0-review path).
  const floorLifted = subs != null && effectiveIndEvid > rawIndEvid
  const editorialNumber: number | null = floorLifted
    ? recomputeEditorial(subs as SubScores, effectiveIndEvid)
    : agent.editorial_rating

  // Blend with the community average per band (spec 3a). 1-4 reviews stays editorial-only.
  let value: number | null = editorialNumber
  let usedCommunity = false
  const community = agent.rating_avg
  if (reviews >= 5 && editorialNumber != null && community != null) {
    value = reviews >= 26
      ? 0.4 * editorialNumber + 0.6 * community
      : 0.5 * editorialNumber + 0.5 * community
    usedCommunity = true
  }

  const displayValue = value == null ? null : round1(value)

  // On Our Radar uses the EFFECTIVE (floored/blended) values, so a real review base can lift an
  // agent OUT of suppression (IndEvid 1 -> 3). For the current all-zero-review catalog, effective
  // == raw, so this is EXACTLY the locked rule: editorial_rating < 3.0 || IndEvid === 1.
  const suppressed =
    (displayValue != null && displayValue < 3.0) || effectiveIndEvid === 1

  return {
    suppressed,
    value: suppressed ? null : displayValue,
    usedCommunity,
    effectiveIndEvid,
  }
}

// --- Named wrappers the surfaces call ---------------------------------------

// true => render ON_OUR_RADAR_LABEL instead of any number.
export function isOnOurRadar(agent: RatingAgent): boolean {
  return resolveRating(agent).suppressed
}

// The number to show, or null when suppressed (caller renders ON_OUR_RADAR_LABEL on null).
// Returning null on suppression is deliberate: a surface that does
//   `displayRating(a) ?? ON_OUR_RADAR_LABEL`
// is automatically correct and cannot leak a suppressed total.
export function displayRating(agent: RatingAgent): number | null {
  return resolveRating(agent).value
}

// --- Structured payload for machine-readable surfaces (spec 3b.2) -----------
// One object emitted by /api/agents, /api/markdown, /llms-full.txt, /mcp, JSON-LD, etc. so
// they all expose the same thing the UI shows. Shape confirmed with Heather July 20:
//   - `sub_scores` is ALWAYS present (transparency is an asset — DECISIONS #3), with verbose,
//     self-documenting keys so an LLM can cite them cleanly.
//   - `total` carries the number when scored, or the literal string "On Our Radar" when
//     suppressed — never a numeric total for a suppressed agent. An LLM reads "On Our Radar"
//     straight into the total's place, which is exactly what we want it citing.
//   - `note` (the suppression reason) is present ONLY when suppressed.
//   - `community` is present ONLY when real reviews exist; omitted otherwise (cleaner than a
//     null for a machine consumer). This is about OUTPUT — the rating_avg COLUMN stays.
export interface RatingPayload {
  sub_scores: {
    autonomous_capability: number
    integration_depth: number
    pricing_transparency: number
    independent_evidence: number
    setup_accessibility: number
  } | null
  total: number | string
  note?: string
  community?: { average: number; count: number }
}

export function ratingPayload(agent: RatingAgent): RatingPayload {
  const resolved = resolveRating(agent)
  const subs = parseSubScores(agent.editorial_rating_notes)

  const payload: RatingPayload = {
    sub_scores: subs
      ? {
          autonomous_capability: subs.autCap,
          integration_depth: subs.intDepth,
          pricing_transparency: subs.priceTrans,
          independent_evidence: subs.indEvid,
          setup_accessibility: subs.setupAcc,
        }
      : null,
    // resolved.value is null exactly when suppressed (or when editorial_rating is missing);
    // either way we emit the label, never a bare null and never a suppressed number.
    total: resolved.value != null ? resolved.value : ON_OUR_RADAR_LABEL,
  }

  if (resolved.suppressed) payload.note = ON_OUR_RADAR_REASON

  const reviews = agent.rating_count ?? 0
  if (reviews > 0 && agent.rating_avg != null) {
    payload.community = { average: round1(agent.rating_avg), count: reviews }
  }

  return payload
}