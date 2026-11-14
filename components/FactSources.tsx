// Shows where each key fact on a listing was read, and when (Heather 2026-11-13).
// Data lives in agents.fact_sources (jsonb), written at each audit:
//   { "read": "2026-11-15",
//     "facts": { "pricing": ["https://..."], "security": [...], "data_training": [...],
//                "mcp": [...], "integrations": [...], "autonomy": [...] },
//     "pages": ["https://...", { "url": "https://...", "read": "2026-11-14" }] }
// A source may be a URL string (dated by "read") or { url, read }.
// Anything missing or malformed renders nothing, so a listing without sources looks as before.

type Src = { url: string; read: string | null }

export const FACT_LABELS: [string, string][] = [
  ['pricing', 'Pricing'],
  ['security', 'Security'],
  ['data_training', 'Data training'],
  ['mcp', 'MCP'],
  ['integrations', 'Integrations'],
  ['autonomy', 'Autonomy'],
]

const isDate = (v: unknown): v is string => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v)

function norm(item: unknown, fallback: string | null): Src | null {
  const url = typeof item === 'string' ? item : (item && typeof item === 'object' ? (item as { url?: unknown }).url : null)
  if (typeof url !== 'string' || !/^https:\/\/[^\s]+$/.test(url)) return null
  const own = item && typeof item === 'object' ? (item as { read?: unknown }).read : null
  return { url, read: isDate(own) ? own : fallback }
}

function list(v: unknown, fallback: string | null): Src[] {
  if (!Array.isArray(v)) return []
  return v.map(x => norm(x, fallback)).filter((x): x is Src => x !== null)
}

export function parseFactSources(raw: unknown): { facts: Record<string, Src[]>; pages: Src[] } | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as { read?: unknown; facts?: unknown; pages?: unknown }
  const fallback = isDate(r.read) ? r.read : null
  const facts: Record<string, Src[]> = {}
  if (r.facts && typeof r.facts === 'object') {
    for (const [k] of FACT_LABELS) {
      const l = list((r.facts as Record<string, unknown>)[k], fallback)
      if (l.length) facts[k] = l
    }
  }
  const pages = list(r.pages, fallback)
  if (!Object.keys(facts).length && !pages.length) return null
  return { facts, pages }
}

export function shortUrl(u: string): string {
  const s = u.replace(/^https:\/\//, '').replace(/^www\./, '').replace(/[?#].*$/, '').replace(/\/$/, '')
  return s.length > 52 ? s.slice(0, 51) + '…' : s
}

export function fmtRead(d: string | null): string {
  if (!d) return ''
  const t = new Date(d + 'T12:00:00Z')
  return isNaN(t.getTime()) ? '' : t.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
}

function latest(srcs: Src[]): string | null {
  return srcs.map(s => s.read).filter((x): x is string => !!x).sort().pop() ?? null
}

/** One small "Source: ... · read ..." line for inside a fact card. Plain text, because the card may already be a link. */
export function SourceLine({ raw, fact }: { raw: unknown; fact: string }) {
  const p = parseFactSources(raw)
  const srcs = p?.facts[fact]
  if (!srcs || !srcs.length) return null
  const when = fmtRead(latest(srcs))
  return (
    <p style={{ fontSize: '0.625rem', color: '#9CA3AF', margin: '0.375rem 0 0', lineHeight: 1.4, wordBreak: 'break-word' }}>
      Source: {srcs.map(s => shortUrl(s.url)).join(', ')}{when ? ' · read ' + when : ''}
    </p>
  )
}

/** The full list, for the end of the technical details box. */
export default function FactSources({ raw }: { raw: unknown }) {
  const p = parseFactSources(raw)
  if (!p) return null
  const link = (s: Src) => (
    <a key={s.url} href={s.url} target="_blank" rel="nofollow noopener noreferrer" style={{ color: '#2563EB', textDecoration: 'none', wordBreak: 'break-word' }}>{shortUrl(s.url)}</a>
  )
  const join = (srcs: Src[]) => srcs.flatMap((s, i) => (i ? [<span key={'sep' + i}>, </span>, link(s)] : [link(s)]))
  const all = [...Object.values(p.facts).flat(), ...p.pages]
  const count = new Set(all.map(s => s.url)).size
  const when = fmtRead(latest(all))
  return (
    <div style={{ marginTop: '1rem', paddingTop: '0.875rem', borderTop: '1px solid #E5E7EB' }}>
      <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', margin: '0 0 0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        Sources{count ? ' · ' + count + ' vendor page' + (count === 1 ? '' : 's') : ''}{when ? ', read ' + when : ''}
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', fontSize: '0.8125rem', color: '#374151', lineHeight: 1.5 }}>
        {FACT_LABELS.filter(([k]) => p.facts[k]).map(([k, label]) => (
          <div key={k}><span style={{ color: '#6B7280' }}>{label}: </span>{join(p.facts[k])}</div>
        ))}
        {p.pages.length > 0 && (
          <div><span style={{ color: '#6B7280' }}>Also read: </span>{join(p.pages)}</div>
        )}
      </div>
    </div>
  )
}
