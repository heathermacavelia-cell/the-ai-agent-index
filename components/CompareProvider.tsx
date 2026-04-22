'use client'
import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export interface CompareAgent {
  slug: string
  name: string
  websiteUrl?: string | null
  faviconDomain?: string | null
}

interface CompareContextType {
  agents: CompareAgent[]
  addAgent: (agent: CompareAgent) => void
  removeAgent: (slug: string) => void
  clearBoard: () => void
  isOnBoard: (slug: string) => boolean
  count: number
}

const CompareContext = createContext<CompareContextType>({
  agents: [],
  addAgent: () => {},
  removeAgent: () => {},
  clearBoard: () => {},
  isOnBoard: () => false,
  count: 0,
})

export function CompareProvider({ children }: { children: ReactNode }) {
  const [agents, setAgents] = useState<CompareAgent[]>([])

  const addAgent = useCallback((agent: CompareAgent) => {
    setAgents(prev => {
      if (prev.length >= 4) return prev
      if (prev.some(a => a.slug === agent.slug)) return prev
      return [...prev, agent]
    })
  }, [])

  const removeAgent = useCallback((slug: string) => {
    setAgents(prev => prev.filter(a => a.slug !== slug))
  }, [])

  const clearBoard = useCallback(() => {
    setAgents([])
  }, [])

  const isOnBoard = useCallback((slug: string) => {
    return agents.some(a => a.slug === slug)
  }, [agents])

  return (
    <CompareContext.Provider value={{ agents, addAgent, removeAgent, clearBoard, isOnBoard, count: agents.length }}>
      {children}
    </CompareContext.Provider>
  )
}

export function useCompare() {
  return useContext(CompareContext)
}
