'use client'

import { useEffect } from 'react'

// Listens for clicks on any link carrying data-out="{slug}" and reports them
// to /api/out. It does not change the link, its rel attributes or where it
// goes. Mounted once in app/layout.tsx.

export default function OutboundClickTracker() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.type === 'auxclick' && e.button !== 1) return // middle-click only
      const target = e.target as Element | null
      const link = target && target.closest ? (target.closest('a[data-out]') as HTMLAnchorElement | null) : null
      if (!link) return
      const slug = link.getAttribute('data-out')
      if (!slug) return
      const from = link.getAttribute('data-out-from') || 'listing'
      const body = JSON.stringify({ slug, from })
      try {
        if (navigator.sendBeacon) {
          navigator.sendBeacon('/api/out', new Blob([body], { type: 'application/json' }))
        } else {
          fetch('/api/out', { method: 'POST', body, headers: { 'Content-Type': 'application/json' }, keepalive: true })
        }
      } catch {
        // ignore
      }
    }
    document.addEventListener('click', onClick, true)
    document.addEventListener('auxclick', onClick, true)
    return () => {
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('auxclick', onClick, true)
    }
  }, [])
  return null
}
