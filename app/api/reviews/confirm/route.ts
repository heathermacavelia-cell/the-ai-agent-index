import { createServiceClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

// Confirms a review from the emailed link (2026-10-23).
// The link opens /reviews/confirm, which POSTs here when the person clicks the button.
// It is a POST, not a link-click GET, so an email scanner that pre-opens links cannot
// confirm a review on its own.

const LINK_DAYS = 7

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json()
    if (typeof token !== 'string' || !/^[0-9a-f-]{36}$/i.test(token))
      return NextResponse.json({ error: 'invalid' }, { status: 400 })

    const supabase = createServiceClient()
    const { data: review } = await supabase
      .from('reviews')
      .select('id, agent_id, reviewer_email, reviewer_name, is_approved, pending_edit, confirm_sent_at')
      .eq('confirm_token', token)
      .maybeSingle()
    if (!review) return NextResponse.json({ error: 'invalid' }, { status: 404 })

    const sentAt = review.confirm_sent_at ? Date.parse(review.confirm_sent_at) : 0
    if (!sentAt || Date.now() - sentAt > LINK_DAYS * 86400000)
      return NextResponse.json({ error: 'expired' }, { status: 410 })

    const now = new Date().toISOString()
    const update: Record<string, unknown> = { confirm_token: null, confirmed_at: now }
    if (review.is_approved && review.pending_edit) {
      Object.assign(update, review.pending_edit, { pending_edit: null, edited_at: now })
    } else {
      update.is_approved = true
    }

    const { error } = await supabase.from('reviews').update(update).eq('id', review.id)
    if (error) throw error

    // The display name is reserved only once the email owner has confirmed.
    const finalName = (update.reviewer_name as string | undefined) ?? review.reviewer_name
    if (review.reviewer_email && finalName) {
      const { data: profile } = await supabase
        .from('reviewer_profiles')
        .select('id')
        .eq('email', review.reviewer_email)
        .maybeSingle()
      if (!profile) {
        await supabase.from('reviewer_profiles').insert({ email: review.reviewer_email, display_name: finalName })
      }
    }

    const { data: agent } = await supabase.from('agents').select('slug').eq('id', review.agent_id).single()
    return NextResponse.json({ success: true, slug: agent?.slug ?? null })
  } catch (err) {
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}
