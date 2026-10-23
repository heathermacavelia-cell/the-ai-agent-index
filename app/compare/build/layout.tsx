import type { Metadata } from 'next'

// /compare/build is an interactive tool, not content. Give it its own title and
// keep it out of search indexes (Bing Site Scan, 2026-10-23: it was indexable
// with the homepage title and no heading). Links on it are still followed.
export const metadata: Metadata = {
  title: 'Build a Comparison | The AI Agent Index',
  robots: { index: false, follow: true },
}

export default function CompareBuildLayout({ children }: { children: React.ReactNode }) {
  return children
}
