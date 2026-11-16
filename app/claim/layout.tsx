import type { Metadata } from 'next'

// Claim pages are a form for vendors, one per listing. They were indexable and,
// with no metadata of their own, reused the homepage title (Ahrefs + live check
// 2026-11-16). Keep them out of search; follow stays on so the link back to the
// listing still counts. Same pattern as /agents/{slug}/review.
export const metadata: Metadata = {
  title: 'Claim a listing | The AI Agent Index',
  robots: { index: false, follow: true },
}

export default function ClaimLayout({ children }: { children: React.ReactNode }) {
  return children
}
