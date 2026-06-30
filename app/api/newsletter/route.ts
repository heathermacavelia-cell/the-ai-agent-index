import { createServiceClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  try {
    const { email, sourcePage, sourceType } = await req.json()
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    const supabase = createServiceClient()
    const normalizedEmail = email.toLowerCase().trim()

    // Check if already subscribed
    const { data: existing } = await supabase
      .from('subscribers')
      .select('id, is_active')
      .eq('email', normalizedEmail)
      .single()

    if (existing) {
      if (existing.is_active) {
        return NextResponse.json({ success: true, message: 'already_subscribed' })
      }
      // Resubscribe
      await supabase
        .from('subscribers')
        .update({
          is_active: true,
          unsubscribed_at: null,
          source_page: sourcePage || null,
          source_type: sourceType || null,
          subscribed_at: new Date().toISOString(),
        })
        .eq('id', existing.id)

      return NextResponse.json({ success: true, message: 'resubscribed' })
    }

    // New subscriber
    const { error: insertError } = await supabase
      .from('subscribers')
      .insert({
        email: normalizedEmail,
        source_page: sourcePage || null,
        source_type: sourceType || null,
      })

    if (insertError) throw insertError
    return NextResponse.json({ success: true, message: 'subscribed' })
  } catch {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }
    const supabase = createServiceClient()
    const { error } = await supabase
      .from('subscribers')
      .update({ is_active: false, unsubscribed_at: new Date().toISOString() })
      .eq('email', email.toLowerCase().trim())
      .eq('is_active', true)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}