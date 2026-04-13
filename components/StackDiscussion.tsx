'use client'

import { useState, useEffect } from 'react'

interface Discussion {
  id: string
  parent_id: string | null
  author_name: string
  body: string
  upvotes: number
  report_count: number
  created_at: string
  replies?: Discussion[]
}

interface Props {
  stackId: string
  stackSlug: string
  initialDiscussions: Discussion[]
}

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago'
  if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago'
  return Math.floor(seconds / 86400) + 'd ago'
}

function CommentForm({
  stackId,
  parentId,
  onSuccess,
  onCancel,
  isReply = false,
}: {
  stackId: string
  parentId?: string
  onSuccess: () => void
  onCancel?: () => void
  isReply?: boolean
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [body, setBody] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [error, setError] = useState('')
  const maxChars = isReply ? 2000 : 1000

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !body.trim()) {
      setError('All fields are required.')
      setStatus('error')
      return
    }
    setStatus('loading')
    setError('')
    try {
      const res = await fetch('/api/discussions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stack_id: stackId,
          parent_id: parentId ?? null,
          author_name: name.trim(),
          author_email: email.trim(),
          body: body.trim(),
          honeypot,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong.')
        setStatus('error')
        return
      }
      setName('')
      setEmail('')
      setBody('')
      onSuccess()
    } catch {
      setError('Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {/* Honeypot — hidden from humans */}
      <input
        type="text"
        value={honeypot}
        onChange={e => setHoneypot(e.target.value)}
        style={{ display: 'none' }}
        tabIndex={-1}
        autoComplete="off"
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div>
          <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.375rem' }}>
            Display name <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <input
            type="text"
            placeholder="How you'll appear publicly"
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={50}
            style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #D1D5DB', borderRadius: '0.5rem', fontSize: '0.875rem', color: '#111827', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.375rem' }}>
            Email <span style={{ color: '#EF4444' }}>*</span>
            <span style={{ fontWeight: 400, color: '#9CA3AF', marginLeft: '0.375rem', fontSize: '0.75rem' }}>
              🔒 Never displayed
            </span>
          </label>
          <input
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #D1D5DB', borderRadius: '0.5rem', fontSize: '0.875rem', color: '#111827', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
      </div>
      <div>
        <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.375rem' }}>
          {isReply ? 'Reply' : 'Comment'} <span style={{ color: '#EF4444' }}>*</span>
        </label>
        <textarea
          placeholder={isReply ? 'Write a reply…' : 'Ask a question or share your experience with this stack…'}
          value={body}
          onChange={e => setBody(e.target.value)}
          maxLength={maxChars}
          rows={isReply ? 3 : 4}
          style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #D1D5DB', borderRadius: '0.5rem', fontSize: '0.875rem', color: '#111827', outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
        />
        <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: '0.25rem 0 0', textAlign: 'right' }}>
          {body.length}/{maxChars}
        </p>
      </div>
      {error && (
        <p style={{ fontSize: '0.8125rem', color: '#DC2626', margin: 0 }}>{error}</p>
      )}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <button
          onClick={handleSubmit}
          disabled={status === 'loading'}
          style={{ padding: '0.5rem 1.125rem', backgroundColor: status === 'loading' ? '#93C5FD' : '#2563EB', color: 'white', border: 'none', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 600, cursor: status === 'loading' ? 'wait' : 'pointer' }}>
          {status === 'loading' ? 'Posting…' : isReply ? 'Post reply' : 'Post comment'}
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            style={{ padding: '0.5rem 0.875rem', backgroundColor: 'transparent', color: '#6B7280', border: '1px solid #E5E7EB', borderRadius: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
            Cancel
          </button>
        )}
        <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: 0 }}>
          You'll receive an email confirmation with a link to delete your comment.
        </p>
      </div>
    </div>
  )
}

function DiscussionItem({
  post,
  stackId,
  onRefresh,
  depth = 0,
}: {
  post: Discussion
  stackId: string
  onRefresh: () => void
  depth?: number
}) {
  const [showReply, setShowReply] = useState(false)
  const [upvoted, setUpvoted] = useState(false)
  const [upvoteCount, setUpvoteCount] = useState(post.upvotes)
  const [reported, setReported] = useState(false)

  useEffect(() => {
    const voted = localStorage.getItem('upvoted_' + post.id)
    if (voted) setUpvoted(true)
    const rep = localStorage.getItem('reported_' + post.id)
    if (rep) setReported(true)
  }, [post.id])

  const handleUpvote = async () => {
    if (upvoted) return
    localStorage.setItem('upvoted_' + post.id, '1')
    setUpvoted(true)
    setUpvoteCount(c => c + 1)
    await fetch('/api/discussions/upvote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ discussion_id: post.id }),
    })
  }

  const handleReport = async () => {
    if (reported) return
    localStorage.setItem('reported_' + post.id, '1')
    setReported(true)
    await fetch('/api/discussions/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ discussion_id: post.id }),
    })
  }

  return (
    <div style={{ marginLeft: depth > 0 ? '2rem' : '0', borderLeft: depth > 0 ? '2px solid #E5E7EB' : 'none', paddingLeft: depth > 0 ? '1rem' : '0' }}>
      <div style={{ backgroundColor: depth > 0 ? '#FAFAFA' : 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1rem 1.25rem', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{ width: '1.75rem', height: '1.75rem', borderRadius: '50%', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#2563EB' }}>
              {post.author_name.charAt(0).toUpperCase()}
            </div>
            <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827' }}>{post.author_name}</span>
            <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{timeAgo(post.created_at)}</span>
          </div>
        </div>
        <p style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.7, margin: '0 0 0.75rem' }}>{post.body}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={handleUpvote}
            style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: upvoted ? '#2563EB' : '#6B7280', backgroundColor: upvoted ? '#EFF6FF' : 'transparent', border: upvoted ? '1px solid #BFDBFE' : '1px solid transparent', borderRadius: '0.375rem', padding: '0.25rem 0.5rem', cursor: upvoted ? 'default' : 'pointer', fontWeight: upvoted ? 600 : 400 }}>
            ▲ {upvoteCount}
          </button>
          {depth === 0 && (
            <button
              onClick={() => setShowReply(r => !r)}
              style={{ fontSize: '0.8125rem', color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem 0' }}>
              Reply
            </button>
          )}
          <button
            onClick={handleReport}
            style={{ fontSize: '0.8125rem', color: reported ? '#9CA3AF' : '#6B7280', background: 'none', border: 'none', cursor: reported ? 'default' : 'pointer', padding: '0.25rem 0', marginLeft: 'auto' }}>
            {reported ? 'Flagged' : 'Flag'}
          </button>
        </div>
      </div>

      {showReply && (
        <div style={{ marginBottom: '1rem', marginLeft: '2rem' }}>
          <CommentForm
            stackId={stackId}
            parentId={post.id}
            isReply
            onSuccess={() => { setShowReply(false); onRefresh() }}
            onCancel={() => setShowReply(false)}
          />
        </div>
      )}

      {post.replies?.map(reply => (
        <DiscussionItem key={reply.id} post={reply} stackId={stackId} onRefresh={onRefresh} depth={1} />
      ))}
    </div>
  )
}

export default function StackDiscussion({ stackId, stackSlug, initialDiscussions }: Props) {
  const [discussions, setDiscussions] = useState<Discussion[]>(initialDiscussions)
  const [sort, setSort] = useState<'newest' | 'top'>('newest')
  const [showForm, setShowForm] = useState(false)

  const fetchDiscussions = async () => {
    const res = await fetch('/api/discussions?stack_id=' + stackId + '&sort=' + sort)
    if (res.ok) {
      const data = await res.json()
      setDiscussions(data)
    }
  }

  const sorted = [...discussions].sort((a, b) => {
    if (sort === 'top') return b.upvotes - a.upvotes
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  const topLevel = sorted.filter(d => !d.parent_id)
  const replies = sorted.filter(d => d.parent_id)

  const threaded = topLevel.map(post => ({
    ...post,
    replies: replies.filter(r => r.parent_id === post.id),
  }))

  const totalCount = discussions.length

  return (
    <div style={{ marginTop: '3rem', borderTop: '1px solid #E5E7EB', paddingTop: '2.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', margin: 0 }}>
          Discussion {totalCount > 0 && <span style={{ fontSize: '1rem', fontWeight: 500, color: '#6B7280' }}>({totalCount})</span>}
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {(['newest', 'top'] as const).map(s => (
            <button key={s} onClick={() => setSort(s)}
              style={{ padding: '0.375rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.8125rem', fontWeight: 500, border: '1px solid', borderColor: sort === s ? '#2563EB' : '#E5E7EB', backgroundColor: sort === s ? '#EFF6FF' : 'white', color: sort === s ? '#2563EB' : '#6B7280', cursor: 'pointer', textTransform: 'capitalize' }}>
              {s === 'newest' ? 'Newest' : 'Top'}
            </button>
          ))}
          <button onClick={() => setShowForm(f => !f)}
            style={{ padding: '0.375rem 1rem', borderRadius: '0.5rem', fontSize: '0.8125rem', fontWeight: 600, border: 'none', backgroundColor: '#2563EB', color: 'white', cursor: 'pointer' }}>
            + Add comment
          </button>
        </div>
      </div>

      {showForm && (
        <div style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.875rem', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <CommentForm
            stackId={stackId}
            onSuccess={() => { setShowForm(false); fetchDiscussions() }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {threaded.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1.5rem', backgroundColor: '#F9FAFB', borderRadius: '0.875rem', border: '1px solid #E5E7EB' }}>
          <p style={{ fontSize: '1rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>No discussion yet</p>
          <p style={{ fontSize: '0.875rem', color: '#9CA3AF', margin: '0 0 1.25rem' }}>Be the first to ask a question or share your experience with this stack.</p>
          <button onClick={() => setShowForm(true)}
            style={{ padding: '0.5rem 1.125rem', backgroundColor: '#2563EB', color: 'white', border: 'none', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
            Start the discussion →
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {threaded.map(post => (
            <DiscussionItem key={post.id} post={post} stackId={stackId} onRefresh={fetchDiscussions} />
          ))}
        </div>
      )}
    </div>
  )
}