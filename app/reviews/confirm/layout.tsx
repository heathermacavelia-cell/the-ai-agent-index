import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Confirm your review',
  robots: { index: false, follow: false },
}

export default function ConfirmReviewLayout({ children }: { children: React.ReactNode }) {
  return children
}
