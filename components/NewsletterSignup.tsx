'use client'

import { useState } from 'react'

interface NewsletterSignupProps {
  sourcePage?: string
  sourceType?: 'agent' | 'alternatives' | 'comparison' | 'guide' | 'homepage' | 'other'
}

export default function NewsletterSignup({ sourcePage = 'newsletter_page', sourceType = 'other' }: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit() {
    if (!email.trim()) return

    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), sourcePage, sourceType }),
      })

      const data = await res.json()

      if (!res.ok) {
        setStatus('error')
        setMessage(data.error || 'Something went wrong.')
        return
      }

      setStatus('success')
      setMessage(
        data.message === 'already_subscribed'
          ? "You're already subscribed!"
          : "You're in. We'll send verified updates every two weeks."
      )
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="border border-blue-200 bg-blue-50 rounded-lg p-6 my-8">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-sm font-medium text-blue-900">{message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="border border-gray-200 bg-gray-50 rounded-lg p-6 my-8">
      <div className="max-w-xl">
        <h3 className="text-base font-semibold text-gray-900 mb-1">
          AI Agent Price &amp; Rating Tracker
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          We verify pricing, integrations, and review data on 330+ AI agents every 14 days. Get notified when something changes.
        </p>
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (status === 'error') setStatus('idle')
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit()
            }}
            placeholder="you@company.com"
            className="flex-1 min-w-0 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            disabled={status === 'loading'}
          />
          <button
            onClick={handleSubmit}
            disabled={status === 'loading' || !email.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap transition-colors"
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </div>
        {status === 'error' && (
          <p className="text-sm text-red-600 mt-2">{message}</p>
        )}
        <p className="text-xs text-gray-400 mt-3">
          No spam. Unsubscribe anytime. We never share your email.
        </p>
      </div>
    </div>
  )
}