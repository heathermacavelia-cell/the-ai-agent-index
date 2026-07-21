const fs = require('fs')
const path = require('path')

const GUIDES = [
  'best-ai-workflow-agents',
  'best-ai-agents-for-customer-onboarding',
  'best-ai-agents-for-outbound-sales',
  'best-ai-scheduling-agents',
  'best-ai-agents-for-churn-reduction',
  'best-ai-customer-success-agents',
  'best-ai-meeting-agents',
]

const IMPORT_ANCHOR = "import { getGuideMeta, isoDate, updatedLabel } from '@/lib/guideMeta'"
const IMPORT_ADD = "\nimport { resolveRating } from '@/lib/rating'"

const SELECT_FIND = 'editorial_rating, rating_avg, rating_count'
const SELECT_REPLACE = 'editorial_rating, editorial_rating_notes, rating_avg, rating_count'

const DISPLAY_RE = /\{\(agent\.editorial_rating \?\? 0\) > 0 && \([\s\S]*?\.toFixed\(1\)\}<\/span>\s*<\/div>\s*\)\}/

const DISPLAY_REPLACE = `{(() => {
                const r = resolveRating({
                  editorial_rating: agent.editorial_rating ?? null,
                  editorial_rating_notes: agent.editorial_rating_notes ?? null,
                  rating_avg: agent.rating_avg ?? null,
                  rating_count: agent.rating_count ?? null,
                })
                if (r.suppressed) return (
                  <span style={{ fontSize: '0.5625rem', fontWeight: 700, color: '#92400E', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '0.25rem', padding: '0.1rem 0.35rem', textTransform: 'uppercase', letterSpacing: '0.03em', whiteSpace: 'nowrap', flexShrink: 0 }}>On Our Radar</span>
                )
                if (r.value == null) return null
                return (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
                    <span style={{ color: '#2563EB', fontSize: '0.75rem' }}>&#x2605;</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151' }}>{r.value.toFixed(1)}</span>
                  </div>
                )
              })()}`

let ok = 0, skipped = 0
const failed = []

for (const g of GUIDES) {
  const file = path.join('app/resources/guides', g, 'page.tsx')
  if (!fs.existsSync(file)) { failed.push(g + ' (file not found)'); continue }
  let src = fs.readFileSync(file, 'utf8')

  if (src.includes("from '@/lib/rating'")) { skipped++; console.log('SKIP (already patched): ' + g); continue }
  if (!src.includes(IMPORT_ANCHOR)) { failed.push(g + ' (import anchor not found)'); continue }
  if (!src.includes(SELECT_FIND)) { failed.push(g + ' (select string not found)'); continue }
  if (!DISPLAY_RE.test(src)) { failed.push(g + ' (display block not matched)'); continue }

  src = src.replace(IMPORT_ANCHOR, IMPORT_ANCHOR + IMPORT_ADD)
  src = src.replace(SELECT_FIND, SELECT_REPLACE)
  src = src.replace(DISPLAY_RE, DISPLAY_REPLACE)

  fs.writeFileSync(file, src, 'utf8')
  ok++
  console.log('PATCHED: ' + g)
}

console.log('\n--- Summary ---')
console.log('Patched: ' + ok + ' | Skipped: ' + skipped + ' | Failed: ' + failed.length)
failed.forEach(f => console.log('  FAIL: ' + f))
