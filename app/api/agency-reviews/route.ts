import { createServiceClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { agency_id, rating, comment, reviewer_name, reviewer_company, project_type, reviewer_email } = body

    if (!agency_id || !rating || !comment || !reviewer_email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be 1-5' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(reviewer_email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Check for existing review by this email on this agency
    const { data: existing } = await supabase
      .from('agency_reviews')
      .select('id')
      .eq('agency_id', agency_id)
      .eq('reviewer_email', reviewer_email.toLowerCase().trim())
      .single()

    if (existing) {
      // Update existing review instead of creating duplicate
      const { error } = await supabase
        .from('agency_reviews')
        .update({
          rating,
          comment,
          reviewer_name: reviewer_name || null,
          reviewer_company: reviewer_company || null,
          project_type: project_type || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)

      if (error) {
        console.error('Error updating agency review:', error)
        return NextResponse.json({ error: 'Failed to update review' }, { status: 500 })
      }

      return NextResponse.json({ success: true, updated: true })
    }

    // Insert new review
    const { error } = await supabase
      .from('agency_reviews')
      .insert({
        agency_id,
        rating,
        comment,
        reviewer_name: reviewer_name || null,
        reviewer_company: reviewer_company || null,
        project_type: project_type || null,
        reviewer_email: reviewer_email.toLowerCase().trim(),
        is_approved: false,
      })

    if (error) {
      console.error('Error inserting agency review:', error)
      return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 })
    }

    return NextResponse.json({ success: true, updated: false })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}