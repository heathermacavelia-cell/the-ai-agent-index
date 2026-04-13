import Link from 'next/link'

export default function CommentDeletedPage() {
  return (
    <div style={{ maxWidth: '480px', margin: '6rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
      <div style={{ width: '3rem', height: '3rem', backgroundColor: '#F0FDF4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
        <span style={{ fontSize: '1.5rem' }}>✓</span>
      </div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '0.75rem' }}>Comment deleted</h1>
      <p style={{ color: '#6B7280', fontSize: '0.9375rem', lineHeight: 1.7, marginBottom: '2rem' }}>
        Your comment has been removed from the discussion.
      </p>
      <Link href="/stacks" style={{ display: 'inline-block', padding: '0.625rem 1.25rem', backgroundColor: '#2563EB', color: 'white', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: 600, fontSize: '0.9375rem' }}>
        Back to Stacks →
      </Link>
    </div>
  )
}