'use client'
import { useCompare } from './CompareProvider'

interface Props {
  slug: string
  name: string
  websiteUrl?: string | null
  faviconDomain?: string | null
}

export default function CompareCardButton({ slug, name, websiteUrl, faviconDomain }: Props) {
  const { addAgent, removeAgent, isOnBoard } = useCompare()
  const onBoard = isOnBoard(slug)

  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onBoard
          ? removeAgent(slug)
          : addAgent({ slug, name, websiteUrl, faviconDomain })
      }}
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        fontSize: '0.75rem',
        fontWeight: 600,
        color: onBoard ? '#2563EB' : '#2563EB',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem',
        opacity: onBoard ? 1 : 0.7,
        transition: 'opacity 0.15s',
      }}
      onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
      onMouseLeave={e => (e.currentTarget.style.opacity = onBoard ? '1' : '0.7')}
    >
      {onBoard ? '✓ Added' : '+ Compare'}
    </button>
  )
}