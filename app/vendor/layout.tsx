import type { Metadata } from 'next'

// Private pages: keep them out of search results. The pages themselves are client
// components and cannot export metadata, so this layout carries it. Audit 2026-11-07:
// this section was indexable and reused the homepage title.
export const metadata: Metadata = {
  title: 'Private | The AI Agent Index',
  robots: { index: false, follow: false },
}

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return children
}
