'use client'
import Script from 'next/script'
import { useEffect, useState } from 'react'

export default function GoogleAnalytics() {
  const [consent, setConsent] = useState<string | null>(null)

  useEffect(() => {
    setConsent(localStorage.getItem('cookie_consent'))
    function handleConsent() {
      setConsent(localStorage.getItem('cookie_consent'))
    }
    window.addEventListener('cookie_consent_updated', handleConsent)
    return () => window.removeEventListener('cookie_consent_updated', handleConsent)
  }, [])

  if (consent !== 'accepted') return null

  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-5HRTC5NWLC"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-5HRTC5NWLC');
        `}
      </Script>
    </>
  )
}