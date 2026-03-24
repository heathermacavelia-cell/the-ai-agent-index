import { createClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function GET(req: NextRequest) {
  const pass = req.headers.get('x-admin-password')
  if (pass !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const supabase = createClient()
  const { data } = await supabase
    .from('agent_edit_requests')
    .select('*')
    .order('submitted_at', { ascending: false })
  return NextResponse.json(data ?? [])
}

export async function POST(req: NextRequest) {
  const pass = req.headers.get('x-admin-password')
  if (pass !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { id, action, admin_notes } = await req.json()
    if (!id || !action) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const supabase = createClient()

    // Get the edit request
    const { data: request } = await supabase
      .from('agent_edit_requests')
      .select('*')
      .eq('id', id)
      .single()

    if (!request) return NextResponse.json({ error: 'Request not found' }, { status: 404 })

    const APPROVAL_FIELDS = ['name', 'pricing_model', 'starting_price', 'customer_segment', 'deployment_method', 'deployment_difficulty', 'integrations', 'capability_tags', 'industry_tags', 'supported_languages', 'security_certifications']

    if (action === 'approve') {
      // Apply approved fields to agents table
      const updates: Record<string, unknown> = {}
      for (const field of APPROVAL_FIELDS) {
        if (request[field] !== null && request[field] !== undefined) {
          updates[field] = request[field]
        }
      }
      if (Object.keys(updates).length > 0) {
        await supabase.from('agents').update(updates).eq('id', request.agent_id)
      }
    }

    // Update edit request status
    await supabase.from('agent_edit_requests').update({
      status: action === 'approve' ? 'approved' : 'rejected',
      admin_notes: admin_notes || null,
      reviewed_at: new Date().toISOString(),
    }).eq('id', id)

    // Email vendor
    const subject = action === 'approve'
      ? 'Your edits to ' + request.agent_name + ' have been approved'
      : 'Update on your edits to ' + request.agent_name

    const html = action === 'approve'
      ? '<p>Hi,</p><p>Your requested edits to <strong>' + request.agent_name + '</strong> have been approved and are now live on The AI Agent Index.</p>' +
        (admin_notes ? '<p><strong>Note from our team:</strong> ' + admin_notes + '</p>' : '') +
        '<p><a href="https://theaiagentindex.com/agents/' + request.agent_slug + '">View your listing →</a></p>' +
        '<p style="color:#6B7280;font-size:14px;">— The AI Agent Index</p>'
      : '<p>Hi,</p><p>After review, we were unable to apply some of your requested edits to <strong>' + request.ageame + '</strong>.</p>' +
        (admin_notes ? '<p><strong>Reason:</strong> ' + admin_notes + '</p>' : '') +
        '<p>If you have questions, reply to this email or contact us at hello@theaiagentindex.com.</p>' +
        '<p><a href="https://theaiagentindex.com/agents/' + request.agent_slug + '">View your listing →</a></p>' +
        '<p style="color:#6B7280;font-size:14px;">— The AI Agent Index</p>'

    await resend.emails.send({
      from: 'noreply@theaiagentindex.com',
      to: request.claimant_email,
      subject,
      html,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
