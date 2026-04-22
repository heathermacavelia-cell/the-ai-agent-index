'use client'
import { useCompare, CompareAgent } from './CompareProvider'
import { useRouter } from 'next/navigation'

interface CompareButtonProps {
  agent: CompareAgent
}

export default function CompareButton({ agent }: CompareButtonProps) {
  const { addAgent, removeAgent, isOnBoard, count } = useCompare()
  const router = useRouter()
  const onBoard = isOnBoard(agent.slug)

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
      <button
        onClick={() => onBoard ? removeAgent(agent.slug) : addAgent(agent)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.375rem',
          padding: '0.4rem 0.875rem',
          fontSize: '0.8125rem',
          fontWeight: 600,
          borderRadius: '9999px',
          border: onBoard ? '1px solid #2563EB' : '1px solid #D1D5DB',
          backgroundColor: onBoard ? '#EFF6FF' : 'white',
          color: onBoard ? '#2563EB' : '#374151',
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}
      >
        {onBoard ? (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            On Compare Board
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add to Compare Board
          </>
        )}
      </button>
      {count >= 1 && (
        <button
          onClick={() => router.push('/compare/build')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            padding: '0.4rem 0.875rem',
            fontSize: '0.8125rem',
            fontWeight: 500,
            borderRadius: '9999px',
            border: '1px solid #E5E7EB',
            backgroundColor: '#F9FAFB',
            color: '#6B7280',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          View Compare Board ({count})
        </button>
      )}
    </div>
  )
}