// scripts/audit-sameas.mjs
// Audits same_as_urls across all active agents.
// READ-ONLY: never writes to Supabase, never deploys.
// Output: scripts/sameas-audit-YYYY-MM-DD.csv on your local machine.

import { createClient } from '@supabase/supabase-js'
import { writeFileSync } from 'fs'
import { config } from 'dotenv'

config({ path: '.env.local' })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

// Trusted-source rules: skip URLs that match these patterns since they were
// sourced from the agent's footer (high reliability) or are bot-blocked
// platforms where automated checking is unreliable but the URLs are typically valid.
const TRUSTED_DOMAINS = [
  'linkedin.com',
  'x.com',
  'twitter.com',
  'github.com',
]

function shouldSkipUrl(url, agentWebsiteUrl) {
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, '')
    
    // Skip if it matches the agent's own website
    if (agentWebsiteUrl) {
      try {
        const agentHost = new URL(agentWebsiteUrl).hostname.replace(/^www\./, '')
        if (host === agentHost || host.endsWith('.' + agentHost)) return true
      } catch {}
    }
    
    // Skip trusted domains (footer-sourced or known bot-blockers)
    if (TRUSTED_DOMAINS.some(d => host === d || host.endsWith('.' + d))) return true
    
    return false
  } catch {
    return false
  }
}

function classifyResponse(status, finalUrl, originalUrl) {
  // 200-299 → OK, not in report
  if (status >= 200 && status < 300) return { severity: 'OK', notes: '' }
  
  // 301/302/307/308 → redirect; URL changed but destination may still be valid
  if ([301, 302, 307, 308].includes(status)) {
    const dest = finalUrl !== originalUrl ? finalUrl : '(unknown)'
    return { severity: 'MEDIUM', notes: `Redirects to ${dest}` }
  }
  
  // 404/410 → page is gone, definite remove
  if ([404, 410].includes(status)) return { severity: 'HIGH', notes: 'Page not found' }
  
  // 403/401/451 → bot-blocked or access denied; usually means URL exists but we can't verify
  if ([401, 403, 451].includes(status)) return { severity: 'LOW', notes: 'Access blocked, manual check needed' }
  
  // 5xx → server error, transient
  if (status >= 500) return { severity: 'LOW', notes: `Server error ${status}, may be transient` }
  
  // 999 → LinkedIn-style "no bots"; we shouldn't see this since we skip LinkedIn, but just in case
  if (status === 999) return { severity: 'LOW', notes: 'Bot-blocked (999)' }
  
  // 0 → fetch failed entirely (DNS, timeout, network)
  if (status === 0) return { severity: 'LOW', notes: 'Fetch failed (DNS/timeout/network)' }
  
  return { severity: 'LOW', notes: `Unexpected status ${status}` }
}

async function checkUrl(url) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000) // 10s timeout
  
  try {
    // First try HEAD (lightweight)
    const headRes = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AIAgentIndex-Audit/1.0; +https://theaiagentindex.com)',
      },
    })
    clearTimeout(timeout)
    return { status: headRes.status, finalUrl: headRes.url }
  } catch (e) {
    clearTimeout(timeout)
    
    // Some servers reject HEAD. Retry with GET as a fallback.
    try {
      const ctrl2 = new AbortController()
      const t2 = setTimeout(() => ctrl2.abort(), 10000)
      const getRes = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        signal: ctrl2.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; AIAgentIndex-Audit/1.0; +https://theaiagentindex.com)',
        },
      })
      clearTimeout(t2)
      return { status: getRes.status, finalUrl: getRes.url }
    } catch (e2) {
      return { status: 0, finalUrl: url }
    }
  }
}

// Run checks in parallel batches to keep things fast but polite
async function runInBatches(items, batchSize, fn) {
  const results = []
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    const batchResults = await Promise.all(batch.map(fn))
    results.push(...batchResults)
    process.stdout.write(`\r  Checked ${Math.min(i + batchSize, items.length)}/${items.length}`)
  }
  process.stdout.write('\n')
  return results
}

function csvEscape(s) {
  if (s == null) return ''
  const str = String(s)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"'
  }
  return str
}

async function main() {
  console.log('Fetching active agents from Supabase...')
  const { data: agents, error } = await supabase
    .from('agents')
    .select('slug, name, website_url, same_as_urls')
    .eq('is_active', true)
  
  if (error) {
    console.error('Supabase error:', error)
    process.exit(1)
  }
  
  console.log(`Found ${agents.length} active agents.`)
  
  // Build the list of (agent, url) pairs to check, applying trust filter
  const tasks = []
  let skippedTrusted = 0
  let agentsWithUrls = 0
  
  for (const agent of agents) {
    const urls = agent.same_as_urls ?? []
    if (urls.length > 0) agentsWithUrls++
    for (const url of urls) {
      if (shouldSkipUrl(url, agent.website_url)) {
        skippedTrusted++
        continue
      }
      tasks.push({ agent, url })
    }
  }
  
  console.log(`${agentsWithUrls} agents have same_as_urls.`)
  console.log(`Skipped ${skippedTrusted} trusted URLs (footer-sourced or known bot-blockers).`)
  console.log(`Will check ${tasks.length} speculative URLs.`)
  console.log('')
  console.log('Checking URLs (10 in parallel)...')
  
  const results = await runInBatches(tasks, 10, async ({ agent, url }) => {
    const { status, finalUrl } = await checkUrl(url)
    const { severity, notes } = classifyResponse(status, finalUrl, url)
    return {
      agent_slug: agent.slug,
      agent_name: agent.name,
      bad_url: url,
      status_code: status,
      severity,
      redirect_destination: finalUrl !== url ? finalUrl : '',
      notes,
    }
  })
  
  // Filter out OK results — only report problems
  const problems = results.filter(r => r.severity !== 'OK')
  
  // Sort by severity (HIGH first), then by agent slug
  const severityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 }
  problems.sort((a, b) => {
    const sd = severityOrder[a.severity] - severityOrder[b.severity]
    if (sd !== 0) return sd
    return a.agent_slug.localeCompare(b.agent_slug)
  })
  
  // Write CSV
  const headers = ['agent_slug', 'agent_name', 'bad_url', 'status_code', 'severity', 'redirect_destination', 'notes']
  const csvLines = [headers.join(',')]
  for (const p of problems) {
    csvLines.push(headers.map(h => csvEscape(p[h])).join(','))
  }
  
  const today = new Date().toISOString().slice(0, 10)
  const outPath = `scripts/sameas-audit-${today}.csv`
  writeFileSync(outPath, csvLines.join('\n'))
  
  console.log('')
  console.log('=== AUDIT COMPLETE ===')
  console.log(`Total URLs checked: ${results.length}`)
  console.log(`OK (not in report): ${results.filter(r => r.severity === 'OK').length}`)
  console.log(`HIGH severity (404/410): ${problems.filter(p => p.severity === 'HIGH').length}`)
  console.log(`MEDIUM severity (redirects): ${problems.filter(p => p.severity === 'MEDIUM').length}`)
  console.log(`LOW severity (bot-blocked, transient errors): ${problems.filter(p => p.severity === 'LOW').length}`)
  console.log('')
  console.log(`Report written to: ${outPath}`)
  console.log('Open in Excel/Sheets and start with HIGH severity rows.')
}

main().catch(e => {
  console.error('Audit script failed:', e)
  process.exit(1)
})