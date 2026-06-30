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
          : "You're in. First issue lands in your inbox soon."
      )
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-gray-950 rounded-xl py-12 px-6 my-10 text-center">
        <div className="flex items-center justify-center gap-2">
          <svg className="w-6 h-6 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-base font-medium text-white">{message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-950 rounded-xl py-12 px-6 sm:px-10 my-10">
      <div className="max-w-lg mx-auto text-center">
        <p className="text-xs font-semibold tracking-widest text-blue-400 uppercase mb-3">
          Free &middot; Every Two Weeks
        </p>
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 tracking-tight">
          AI Agent Price &amp; Rating Tracker
        </h3>
        <p className="text-sm sm:text-base text-gray-400 leading-relaxed mb-6">
          We verify pricing, integrations, and review data on 330+ AI agents every 14 days. Get notified when something changes.
        </p>
        <div className="flex gap-2 max-w-md mx-auto">
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
            className="flex-1 min-w-0 px-4 py-3 text-sm bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={status === 'loading'}
          />
          <button
            onClick={handleSubmit}
            disabled={status === 'loading' || !email.trim()}
            className="px-5 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-950 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap transition-colors"
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </div>
        {status === 'error' && (
          <p className="text-sm text-red-400 mt-3">{message}</p>
        )}
        <p className="text-xs text-gray-600 mt-4">
          No spam. Unsubscribe anytime. We never share your email.
        </p>
      </div>
    </div>
  )
}