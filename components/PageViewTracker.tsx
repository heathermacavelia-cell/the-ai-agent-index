'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

// Counts one human page view per page shown in a real browser, including
// in-site navigation. The referrer is sent only with the first view of a
// visit, because later in-site pages would otherwise repeat it.
// Mounted once in app/layout.tsx. Changes nothing on the page.

export default function PageViewTracker() {
  const pathname = usePathname()
  const first = useRef(true)

  useEffect(() => {
    if (!pathname) return
    try {
      if ((navigator as Navigator & { webdriver?: boolean }).webdriver) return // automated browser
      const ref = first.current ? document.referrer : ''
      first.current = false
      const body = JSON.stringify({ path: pathname, ref })
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/pv', new Blob([body], { type: 'application/json' }))
      } else {
        fetch('/api/pv', { method: 'POST', body, headers: { 'Content-Type': 'application/json' }, keepalive: true })
      }
    } catch {
      // ignore
    }
  }, [pathname])

  return null
}
