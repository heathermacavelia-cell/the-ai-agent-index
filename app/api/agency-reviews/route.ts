import { createServiceClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { agency_id, rating, comment, reviewer_name, reviewer_company, project_type } = body

    if (!agency_id || !rating || !comment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be 1-5' }, { status: 400 })
    }

    const supabase = createServiceClient()
    const { error } = await supabase
      .from('agency_reviews')
      .insert({
        agency_id,
        rating,
        comment,
        reviewer_name: reviewer_name || null,
        reviewer_company: reviewer_company || null,
        project_type: project_type || null,
        is_approved: false,
      })

    if (error) {
      console.error('Error inserting agency review:', error)
      return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}