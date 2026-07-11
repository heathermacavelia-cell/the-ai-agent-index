export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? ''

export async function POST(req: NextRequest) {
  const password = req.headers.get('x-admin-password')
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id, note } = await req.json()
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const supabase = createServiceClient()

  const { data: agency, error: fetchError } = await supabase
    .from('agencies')
    .select('name, contact_email')
    .eq('id', id)
    .single()

  if (fetchError || !agency) {
    return NextResponse.json({ error: 'Agency not found' }, { status: 404 })
  }

  if (agency.contact_email) {
    try {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: 'Heather at The AI Agent Index <hello@theaiagentindex.com>',
        to: agency.contact_email,
        subject: `Your submission to The AI Agent Index: ${agency.name}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #111827;">
            <p style="font-size: 15px; margin-bottom: 16px;">Hi,</p>
            <p style="font-size: 15px; margin-bottom: 16px;">
              Thank you for submitting <strong>${agency.name}</strong> to the AI Automation Agencies directory on The AI Agent Index.
            </p>
            <p style="font-size: 15px; margin-bottom: 16px;">
              After reviewing your submission, we won't be including it in the directory at this time.
            </p>
            ${note ? `
            <div style="background: #F9FAFB; border-left: 3px solid #D1D5DB; border-radius: 4px; padding: 12px 16px; margin-bottom: 16px;">
              <p style="font-size: 13px; font-weight: 600; color: #6B7280; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em;">Editorial note</p>
              <p style="font-size: 14px; color: #374151; margin: 0; line-height: 1.6;">${note}</p>
            </div>
            ` : ''}
            <p style="font-size: 15px; margin-bottom: 16px;">
              If you believe this decision was made in error or if circumstances change, you're welcome to resubmit at
              <a href="https://theaiagentindex.com/submit-agency" style="color: #059669;">theaiagentindex.com/submit-agency</a>.
            </p>
            <p style="font-size: 15px; margin-bottom: 0;">
              Thanks again for taking the time to submit.
            </p>
            <p style="font-size: 15px; margin-top: 16px; color: #6B7280;">
              — The AI Agent Index editorial team
            </p>
            <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 24px 0;" />
            <p style="font-size: 12px; color: #9CA3AF; margin: 0;">
              <a href="https://theaiagentindex.com" style="color: #9CA3AF;">theaiagentindex.com</a> · Not affiliated with any listed vendor.
            </p>
          </div>
        `,
      })
    } catch (emailErr) {
      console.error('Agency rejection email error:', emailErr)
    }
  }

  const { error: deleteError } = await supabase
    .from('agencies')
    .delete()
    .eq('id', id)

  if (deleteError) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}