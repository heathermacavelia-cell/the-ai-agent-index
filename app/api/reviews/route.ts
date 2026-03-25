import { createServiceClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

function generateDisplayName(email: string): string {
  return email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase()
}

function generateAlternatives(base: string): string[] {
  const suffixes = ['_2', '_x', '_user', Math.floor(Math.random() * 90 + 10).toString()]
  return suffixes.map((s) => `${base}${s}`)
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const agent_id = searchParams.get('agent_id')
  const email = searchParams.get('email')
  if (!agent_id) return NextResponse.json({ error: 'Missing agent_id' }, { status: 400 })

  const supabase = createServiceClient()

  if (email) {
    const { data: existing } = await supabase
      .from('reviews')
      .select('id, rating, comment, created_at, updated_at, reviewer_email')
      .eq('agent_id', agent_id)
      .eq('reviewer_email', email)
      .single()

    const { data: profile } = await supabase
      .from('reviewer_profiles')
      .select('display_name')
      .eq('email', email)
      .single()

    const suggestedName = profile?.display_name ?? generateDisplayName(email)
    return NextResponse.json({ existing: existing ?? null, suggestedName })
  }

  const { data, error } = await supabase
    .from('reviews')
    .select('id, rating, comment, reviewer_name, created_at, updated_at')
    .eq('agent_id', agent_id)
    .eq('is_approved', true)
    .order('updated_at', { ascending: false })

  if (error) return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store' } })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { agent_id, rating, comment, reviewer_name, reviewer_email, newsletter_opt_in } = body

    if (!agent_id || !rating || rating < 1 || rating > 5)
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    if (!reviewer_email || !reviewer_email.includes('@'))
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    if (!reviewer_name?.trim())
      return NextResponse.json({ error: 'Display name required' }, { status: 400 })

    const supabase = createServiceClient()

    const { data: existingProfile } = await supabase
      .from('reviewer_profiles')
      .select('id, email, display_name')
      .eq('email', reviewer_email)
      .single()

    if (!existingProfile) {
      const { data: nameTaken } = await supabase
        .from('reviewer_profiles')
        .select('id')
        .eq('display_name', reviewer_name.trim())
        .single()

      if (nameTaken) {
        const base = generateDisplayName(reviewer_email)
        const alternatives = generateAlternatives(base)
        return NextResponse.json({ error: 'name_taken', alternatives }, { status: 409 })
      }

      await supabase.from('reviewer_profiles').insert({
        email: reviewer_email,
        display_name: reviewer_name.trim(),
        newsletter_opt_in: newsletter_opt_in ?? false,
      })
    }

    const displayName = existingProfile?.display_name ?? reviewer_name.trim()

    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('agent_id', agent_id)
      .eq('reviewer_email', reviewer_email)
      .single()

    if (existingReview) {
      await supabase
        .from('reviews')
        .update({ rating: parseInt(rating), comment: comment?.trim() || null, reviewer_name: displayName })
        .eq('id', existingReview.id)
      return NextResponse.json({ success: true, action: 'updated' })
    }

    await supabase.from('reviews').insert({
      agent_id,
      rating: parseInt(rating),
      comment: comment?.trim() || null,
      reviewer_name: displayName,
      reviewer_email,
      is_approved: true,
    })

    return NextResponse.json({ success: true, action: 'created' })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 })
  }
}