import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { email, name, company, services } = await req.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    const supabase = createServiceClient()
    const { error } = await supabase
      .from('partner_waitlist')
      .insert({ email, name, company, services })

    if (error) {
      console.error('Waitlist insert error:', error)
      return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
    }

    // Notify Heather of new partner signup
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'noreply@theaiagentindex.com',
      to: 'hello@theaiagentindex.com',
      subject: 'New Partner Waitlist Signup',
      html: `
        <h2>New Partner Waitlist Signup</h2>
        <table style="border-collapse:collapse;width:100%;max-width:500px">
          <tr><td style="padding:8px;border:1px solid #E5E7EB;font-weight:600;background:#F9FAFB">Name</td><td style="padding:8px;border:1px solid #E5E7EB">${name || '—'}</td></tr>
          <tr><td style="padding:8px;border:1px solid #E5E7EB;font-weight:600;background:#F9FAFB">Email</td><td style="padding:8px;border:1px solid #E5E7EB">${email}</td></tr>
          <tr><td style="padding:8px;border:1px solid #E5E7EB;font-weight:600;background:#F9FAFB">Company</td><td style="padding:8px;border:1px solid #E5E7EB">${company || '—'}</td></tr>
          <tr><td style="padding:8px;border:1px solid #E5E7EB;font-weight:600;background:#F9FAFB">Services</td><td style="padding:8px;border:1px solid #E5E7EB">${Array.isArray(services) ? services.join(', ') : services || '—'}</td></tr>
        </table>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Waitlist error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}