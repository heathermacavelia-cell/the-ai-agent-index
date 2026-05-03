'use client'

import { useEffect } from 'react'

/**
 * Detects Next.js chunk load failures and forces a hard reload.
 *
 * Why this exists: when Vercel deploys a new build, JS chunk filenames change.
 * Users with the old HTML cached or open in a tab will request chunks that no
 * longer exist on the new deploy → ChunkLoadError. This handler catches that
 * and triggers a full page reload, which fetches the new HTML and the
 * matching new chunks. Brief flash, then a working page.
 *
 * Reload throttle: 30 seconds, keyed by pathname. Prevents infinite reload
 * loops if the new build is also somehow broken.
 */
export default function ChunkLoadErrorHandler() {
  useEffect(() => {
    function isChunkError(err: any): boolean {
      if (!err) return false
      const message = String(err.message || err || '')
      const name = String(err.name || '')
      return (
        name === 'ChunkLoadError' ||
        message.includes('Loading chunk') ||
        message.includes('Loading CSS chunk') ||
        message.includes('failed to fetch dynamically imported module') ||
        message.includes('Importing a module script failed')
      )
    }

    function reloadOnce() {
      const key = 'chunkErrorReload:' + window.location.pathname
      const lastReload = sessionStorage.getItem(key)
      const now = Date.now()
      if (!lastReload || now - parseInt(lastReload, 10) > 30000) {
        sessionStorage.setItem(key, String(now))
        window.location.reload()
      }
    }

    function onError(event: ErrorEvent) {
      if (isChunkError(event.error)) reloadOnce()
    }

    function onRejection(event: PromiseRejectionEvent) {
      if (isChunkError(event.reason)) reloadOnce()
    }

    window.addEventListener('error', onError)
    window.addEventListener('unhandledrejection', onRejection)

    return () => {
      window.removeEventListener('error', onError)
      window.removeEventListener('unhandledrejection', onRejection)
    }
  }, [])

  return null
}