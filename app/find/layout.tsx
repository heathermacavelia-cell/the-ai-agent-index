import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Find an AI Agent',
  description: 'Describe what you want to automate in plain English and we\'ll match you to the right AI agent.',
  alternates: {
    canonical: 'https://theaiagentindex.com/find',
  },
}

export default function FindLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}