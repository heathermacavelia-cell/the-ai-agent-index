'use client'
import { useEffect, useState } from 'react'

// Homepage hero proof line. The count is the live 7-day AI read total from
// /api/ai-stats (the same source /advertise uses), so it never goes stale.
// These are READS by AI systems, not citations - do not reword it as citations.
function formatCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'
  return String(n)
}

export default function HeroAiReads() {
  const [total, setTotal] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/ai-stats')
      .then(r => (r.ok ? r.json() : null))
      .then(d => { if (d && typeof d.total === 'number') setTotal(d.total) })
      .catch(() => {})
  }, [])

  return (
    <p className="hp-sub">
      <strong style={{ color: '#111827' }}>Built for AI assistants to read:</strong> structured data on every page, a <a href="/api/agents" className="hp-link">public API</a> and an <a href="/mcp-servers#connect" className="hp-link">MCP server</a>.
      {total !== null && total > 0 && <> AI systems read it {formatCount(total)}+ times in the last 7 days.</>}
    </p>
  )
}
