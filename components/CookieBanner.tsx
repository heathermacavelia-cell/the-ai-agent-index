'use client'
import { useState, useEffect } from 'react'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent')
    if (!consent) setVisible(true)
  }, [])

  function accept() {
    localStorage.setItem('cookie_consent', 'accepted')
    window.dispatchEvent(new Event('cookie_consent_updated'))
    setVisible(false)
  }

  function decline() {
    localStorage.setItem('cookie_consent', 'declined')
    window.dispatchEvent(new Event('cookie_consent_updated'))
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#0F172A',
      borderTop: '1px solid #1F2937',
      zIndex: 9999,
      padding: '0.875rem 1.5rem',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem',
        flexWrap: 'wrap',
      }}>
        <p style={{
          color: '#9CA3AF',
          fontSize: '0.8125rem',
          lineHeight: 1.6,
          margin: 0,
          flex: 1,
          minWidth: '200px',
        }}>
          We use Google Analytics to understand how visitors use this site. No personal data is sold or shared with third parties.{' '}
          <a href="/privacy" style={{ color: '#60A5FA', textDecoration: 'none' }}>Privacy policy</a>
        </p>
        <div style={{ display: 'flex', gap: '0.625rem', flexShrink: 0 }}>
          <button
            onClick={decline}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              border: '1px solid #374151',
              backgroundColor: 'transparent',
              color: '#9CA3AF',
              fontSize: '0.8125rem',
              cursor: 'pointer',
              fontWeight: 500,
              whiteSpace: 'nowrap',
            }}>
            Decline
          </button>
          <button
            onClick={accept}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              border: 'none',
              backgroundColor: '#2563EB',
              color: 'white',
              fontSize: '0.8125rem',
              cursor: 'pointer',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}>
            Accept analytics
          </button>
        </div>
      </div>
    </div>
  )
}