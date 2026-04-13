import { Resend } from 'resend'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const body = await request.json()
    const { name, company, email, tier, category, message } = body

    if (!name || !email || !tier) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await resend.emails.send({
      from: 'The AI Agent Index <hello@theaiagentindex.com>',
      to: 'hello@theaiagentindex.com',
      replyTo: email,
      subject: `New sponsorship enquiry — ${tier}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px;">
          <h2 style="color: #1D4ED8;">New sponsorship enquiry</h2>
          <table style="border-collapse: collapse; width: 100%; margin-top: 1rem;">
            <tr><td style="padding: 10px 12px; border: 1px solid #e5e7eb; background: #f9fafb; font-weight: 600; width: 140px;">Name</td><td style="padding: 10px 12px; border: 1px solid #e5e7eb;">${name}</td></tr>
            <tr><td style="padding: 10px 12px; border: 1px solid #e5e7eb; background: #f9fafb; font-weight: 600;">Company</td><td style="padding: 10px 12px; border: 1px solid #e5e7eb;">${company || '—'}</td></tr>
            <tr><td style="padding: 10px 12px; border: 1px solid #e5e7eb; background: #f9fafb; font-weight: 600;">Email</td><td style="padding: 10px 12px; border: 1px solid #e5e7eb;"><a href="mailto:${email}" style="color: #1D4ED8;">${email}</a></td></tr>
            <tr><td style="padding: 10px 12px; border: 1px solid #e5e7eb; background: #f9fafb; font-weight: 600;">Tier</td><td style="padding: 10px 12px; border: 1px solid #e5e7eb;">${tier}</td></tr>
            <tr><td style="padding: 10px 12px; border: 1px solid #e5e7eb; background: #f9fafb; font-weight: 600;">Category</td><td style="padding: 10px 12px; border: 1px solid #e5e7eb;">${category || '—'}</td></tr>
            <tr><td style="padding: 10px 12px; border: 1px solid #e5e7eb; background: #f9fafb; font-weight: 600;">Message</td><td style="padding: 10px 12px; border: 1px solid #e5e7eb;">${message || '—'}</td></tr>
          </table>
          <p style="margin-top: 1.5rem; color: #6b7280; font-size: 0.875rem;">Reply directly to this email to respond to ${name}.</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Advertise form error:', err)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}