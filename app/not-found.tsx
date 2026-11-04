import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="sp-page">
      <section className="hp-wrap" style={{ paddingBlock: '72px 96px' }}>
        <h1 className="cp-h1">We could not find that page</h1>
        <p className="sp-sub">It may have moved, or the link may be out of date. Try searching the directory.</p>
        <form action="/search" method="GET" className="sp-form">
          <input type="search" name="q" aria-label="Search AI agents" placeholder="Try: cold email, recruiting" maxLength={200} className="sp-input" />
          <button type="submit" className="sp-btn">Search</button>
        </form>
        <div className="sp-links">
          <Link href="/" className="hp-link">Back to the homepage</Link>
          <Link href="/#categories" className="hp-link">Browse by category</Link>
          <Link href="/ai-automation-agencies" className="hp-link">AI automation agencies</Link>
        </div>
      </section>
    </div>
  )
}
