import { createServiceClient } from '@/lib/supabase'

// THE FREE-LISTING QUEUE, ruled 2026-09-27 (Heather).
// Free listings are published in weekly batches of FREE_LISTINGS_PER_WEEK.
// The estimate shown to a submitter is calculated live from the real queue, so
// it grows when submissions outpace approvals and shrinks when they do not.
// Heather's rulings: show ONLY an estimated time to go live, never a queue
// position; pair it with the $39 Editorial Review as "skip the queue".
//
// Raise this number if Heather commits to more approvals a week. Declined
// submissions are deleted, so most people go live a little sooner than the
// estimate says - which is the safe side to be wrong on.
export const FREE_LISTINGS_PER_WEEK = 8

// THE QUEUE, measured 2026-09-27: an inactive agent row is in the free queue
// only if it came from the submit form (submitter_email set), chose the free
// tier and has never been audited. Inactive rows WITHOUT a submitter email that
// WERE audited are listings taken down (76 of them on 2026-09-27) and must
// never count.
export async function countFreeQueue(): Promise<number | null> {
  try {
    const supabase = createServiceClient()
    const { count, error } = await supabase
      .from('agents')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', false)
      .eq('submitted_tier', 'self')
      .not('submitter_email', 'is', null)
      .is('last_verified_at', null)
    if (error || count == null) return null
    return count
  } catch {
    return null
  }
}

// Weeks until a submission at the BACK of the queue goes live.
// `includesNewSubmission`: true when the count already contains the person we
// are telling (right after their row is inserted); false on the submit page,
// where they would join behind everyone counted.
export function weeksForQueue(count: number, includesNewSubmission: boolean): number {
  const position = includesNewSubmission ? count : count + 1
  return Math.max(1, Math.ceil(position / FREE_LISTINGS_PER_WEEK))
}

export function waitLabel(weeks: number): string {
  return weeks === 1 ? 'about 1 week' : 'about ' + weeks + ' weeks'
}

// Returns null when the count cannot be read. Every caller falls back to
// wording with no number rather than guessing one.
export async function freeQueueWeeks(includesNewSubmission: boolean): Promise<number | null> {
  const count = await countFreeQueue()
  return count == null ? null : weeksForQueue(count, includesNewSubmission)
}
