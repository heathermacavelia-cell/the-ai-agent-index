import { cache } from 'react'
import { createClient } from '@/lib/supabase'

/**
 * Live count of active agents. Single source of truth for any surface that
 * publishes a figure. Returns null if the query fails, and every caller must
 * handle null by printing no number rather than a remembered one.
 *
 * Do not hardcode this value anywhere. It has been wrong by as much as 88.
 */
export const getActiveAgentCount = cache(async (): Promise<number | null> => {
  const supabase = createClient()
  const { count, error } = await supabase
    .from('agents')
    .select('slug', { count: 'exact', head: true })
    .eq('is_active', true)

  if (error) return null
  return count ?? null
})