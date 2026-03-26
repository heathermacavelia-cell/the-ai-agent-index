import { createClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  try {
    const { email, source } = await req.json()
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }
    const supabase = createClient()

    await supabase.from('newsletter_subscribers').upsert(
      { email: email.toLowerCase().trim(), source: source ?? 'newsletter_page' },
      { onConflict: 'email' }
    )

    if (source === 'review') {
      await supabase.from('reviewer_profiles')
        .upsert({ email: email.toLowerCase().trim(), newsletter_opt_in: true }, { onConflict: 'email' })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}