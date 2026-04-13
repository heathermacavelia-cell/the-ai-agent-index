import { createServiceClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'changeme'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://theaiagentindex.com'

function checkAuth(request: Request) {
  return request.headers.get('x-admin-password') === ADMIN_PASSWORD
}

export async function GET(request: Request) {
  if (!checkAuth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('stacks')
    .select('*')
    .eq('is_community', true)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
  return NextResponse.json(data ?? [])
}

export async function POST(request: Request) {
  if (!checkAuth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const resend = new Resend(process.env.RESEND_API_KEY)
  const supabase = createServiceClient()
  const { id, action, comment } = await request.json()
  if (!id || !action) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  // Fetch stack for email
  const { data: stack } = await supabase
    .from('stacks')
    .select('name, slug, submitter_email, submitter_name')
    .eq('id', id)
    .single()

  if (action === 'approve') {
    await supabase.from('stacks').update({ is_active: true, is_approved: true, status: 'approved' }).eq('id', id)
    if (stack?.submitter_email) {
      await resend.emails.send({
        from: 'The AI Agent Index <hello@theaiagentindex.com>',
        to: stack.submitter_email,
        subject: 'Your stack is live: ' + stack.name,
        html: `
          <div style="font-family:sans-serif;max-width:600px;">
            <h2 style="color:#16A34A;">Your stack is live! 🎉</h2>
            <p>Your stack <strong>${stack.name}</strong> has been approved and is now live on The AI Agent Index.</p>
            <p><a href="${SITE_URL}/stacks/${stack.slug}" style="background:#2563EB;color:white;padding:0.5rem 1rem;border-radius:0.375rem;text-decoration:none;font-weight:600;">View your stack →</a></p>
            ${comment ? `<p style="margin-top:1.5rem;padding:1rem;background:#F9FAFB;border-radius:0.5rem;border-left:3px solid #2563EB;"><strong>Note from our team:</strong><br>${comment}</p>` : ''}
            <p style="color:#6b7280;font-size:0.875rem;margin-top:1.5rem;">The AI Agent Index · <a href="${SITE_URL}/stacks">Browse stacks</a></p>
          </div>
        `,
      })
    }
  } else if (action === 'reject') {
    await supabase.from('stacks').update({ is_active: false, is_approved: false, status: 'rejected' }).eq('id', id)
    if (stack?.submitter_email) {
      await resend.emails.send({
        from: 'The AI Agent Index <hello@theaiagentindex.com>',
        to: stack.submitter_email,
        subject: 'Update on your stack submission: ' + stack.name,
        html: `
          <div style="font-family:sans-serif;max-width:600px;">
            <h2 style="color:#111827;">Update on your submission</h2>
            <p>Thank you for submitting <strong>${stack.name}</strong> to The AI Agent Index.</p>
            <p>After review, we weren't able to approve this stack at this time.</p>
            ${comment ? `<p style="margin-top:1rem;padding:1rem;background:#F9FAFB;border-radius:0.5rem;border-left:3px solid #EF4444;"><strong>Reason:</strong><br>${comment}</p>` : ''}
            <p>You're welcome to revise and resubmit at any time.</p>
            <p><a href="${SITE_URL}/stacks/submit" style="background:#2563EB;color:white;padding:0.5rem 1rem;border-radius:0.375rem;text-decoration:none;font-weight:600;">Resubmit →</a></p>
            <p style="color:#6b7280;font-size:0.875rem;margin-top:1.5rem;">The AI Agent Index · <a href="${SITE_URL}/stacks">Browse stacks</a></p>
          </div>
        `,
      })
    }
  } else if (action === 'delete') {
    await supabase.from('stacks').delete().eq('id', id)
  }

  return NextResponse.json({ success: true })
}