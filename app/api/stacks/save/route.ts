import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { email, stackName } = await request.json()

    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

    const supabase = createServiceClient()
    await supabase.from('newsletter_subscribers').upsert({ email }, { onConflict: 'email' })

    await resend.emails.send({
      from: 'noreply@theaiagentindex.com',
      to: email,
      subject: `Your saved stack: ${stackName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; color: #111;">
          <h2 style="color: #1D4ED8;">You saved: ${stackName}</h2>
          <p>You can find it any time at <a href="https://theaiagentindex.com/stacks">theaiagentindex.com/stacks</a>.</p>
          <p>We'll also send you a weekly digest of new stacks and notable agent updates — unsubscribe any time.</p>
          <p style="color: #6b7280; font-size: 0.875rem; margin-top: 2rem;">The AI Agent Index · <a href="https://theaiagentindex.com">theaiagentindex.com</a></p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Stack save error:', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}