'use client'
import { useState, useEffect } from 'react'

function getFingerprint(): string {
  if (typeof window === 'undefined') return ''
  let fp = localStorage.getItem('aai_fp')
  if (!fp) {
    fp = Math.random().toString(36).slice(2) + Date.now().toString(36)
    localStorage.setItem('aai_fp', fp)
  }
  return fp
}

export default function StackUpvote({ stackId, initialCount }: { stackId: string; initialCount: number }) {
  const [count, setCount] = useState(initialCount)
  const [voted, setVoted] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    try {
      const voted = JSON.parse(localStorage.getItem('aai_voted') || '[]')
      setVoted(voted.includes(stackId))
    } catch {}
  }, [stackId])

  async function handleVote() {
    if (voted || loading) return
    setLoading(true)
    try {
      const fingerprint = getFingerprint()
      const res = await fetch('/api/stacks/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stack_id: stackId, fingerprint }),
      })
      if (res.ok) {
        const data = await res.json()
        setCount(data.upvote_count ?? count + 1)
        setVoted(true)
        const existing = JSON.parse(localStorage.getItem('aai_voted') || '[]')
        localStorage.setItem('aai_voted', JSON.stringify([...existing, stackId]))
      }
    } catch {}
    setLoading(false)
  }

  return (
    <button
      onClick={handleVote}
      disabled={voted || loading}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
        padding: '0.5rem 1rem', borderRadius: '0.5rem',
        border: `1px solid ${voted ? '#BBF7D0' : '#D1D5DB'}`,
        backgroundColor: voted ? '#F0FDF4' : 'white',
        color: voted ? '#16A34A' : '#374151',
        fontSize: '0.875rem', fontWeight: 600,
        cursor: voted || loading ? 'default' : 'pointer',
        transition: 'all 0.15s',
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill={voted ? '#16A34A' : 'none'} stroke={voted ? '#16A34A' : 'currentColor'} strokeWidth="2">
        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
        <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
      </svg>
      {voted ? 'Upvoted' : 'Upvote'}
      <span style={{ backgroundColor: voted ? '#DCFCE7' : '#F3F4F6', color: voted ? '#16A34A' : '#6B7280', fontSize: '0.75rem', fontWeight: 700, padding: '0.1rem 0.5rem', borderRadius: '9999px' }}>
        {count}
      </span>
    </button>
  )
}