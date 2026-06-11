export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { Resend } from 'resend'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? ''

export async function POST(req: NextRequest) {
  const password = req.headers.get('x-admin-password')
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id, note } = await req.json()
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const supabase = createServiceClient()
  const resend = new Resend(process.env.RESEND_API_KEY)

  // Get the agent record before deleting
  const { data: agent, error: fetchError } = await supabase
    .from('agents')
    .select('name, submitter_email')
    .eq('id', id)
    .single()

  if (fetchError || !agent) {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
  }

  // Send rejection email if submitter_email exists
  if (agent.submitter_email) {
    try {
      await resend.emails.send({
        from: 'The AI Agent Index <hello@theaiagentindex.com>',
        to: agent.submitter_email,
        subject: `Your submission to The AI Agent Index: ${agent.name}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #111827;">
            <p style="font-size: 15px; margin-bottom: 16px;">Hi,</p>
            <p style="font-size: 15px; margin-bottom: 16px;">
              Thank you for submitting <strong>${agent.name}</strong> to The AI Agent Index.
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
              <a href="https://theaiagentindex.com/submit" style="color: #2563EB;">theaiagentindex.com/submit</a>.
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
      console.error('Resend error:', emailErr)
      // Don't block deletion if email fails
    }
  }

  // Delete the agent record
  const { error: deleteError } = await supabase
    .from('agents')
    .delete()
    .eq('id', id)

  if (deleteError) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}