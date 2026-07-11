import { createServiceClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// Vendor-owned facts apply immediately. Everything editorial or structural
// goes through the review queue, per the propose-changes policy.
const IMMEDIATE_FIELDS = ['website_url', 'logo_url', 'pricing_url']
const APPROVAL_FIELDS = ['name', 'short_description', 'long_description', 'pricing_model', 'starting_price', 'customer_segment', 'deployment_method', 'deployment_difficulty', 'integrations', 'capability_tags', 'industry_tags', 'supported_languages', 'security_certifications']

function esc(s: string): string {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export async function POST(req: NextRequest) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const body = await req.json()
    const { agent_slug, token, vendor_notes, ...fields } = body

    if (!agent_slug || !token) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createServiceClient()

    const { data: claim } = await supabase
      .from('agent_claims')
      .select('id, claimant_email, claimant_name, agent_id, agent_name, access_token_expires')
      .eq('agent_slug', agent_slug)
      .eq('access_token', token)
      .eq('status', 'approved')
      .single()

    if (!claim || !claim.access_token_expires || new Date(claim.access_token_expires) < new Date()) {
      return NextResponse.json({ error: 'Invalid or expired access link. Request a new one from the vendor page.' }, { status: 401 })
    }

    const { data: currentAgent } = await supabase
      .from('agents')
      .select('*')
      .eq('id', claim.agent_id)
      .single()

    const immediateUpdates: Record<string, unknown> = {}
    const approvalUpdates: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(fields)) {
      if (value === null || value === undefined || value === '') continue
      const current = currentAgent?.[key]
      const isDifferent = Array.isArray(value)
        ? JSON.stringify(value.slice().sort()) !== JSON.stringify((Array.isArray(current) ? current.slice().sort() : []))
        : String(value) !== String(current ?? '')
      if (!isDifferent) continue
      if (IMMEDIATE_FIELDS.includes(key)) {
        immediateUpdates[key] = value
      } else if (key === 'vendor_hook') {
        // Marketing hook is a Vendor Managed perk and is editorially reviewed
        if (currentAgent?.vendor_managed) approvalUpdates[key] = value
      } else if (APPROVAL_FIELDS.includes(key)) {
        approvalUpdates[key] = value
      }
    }

    if (Object.keys(immediateUpdates).length > 0) {
      await supabase.from('agents').update(immediateUpdates).eq('id', claim.agent_id)
    }

    if (Object.keys(approvalUpdates).length > 0 || vendor_notes) {
      await supabase.from('agent_edit_requests').insert({
        agent_id: claim.agent_id,
        agent_slug,
        agent_name: claim.agent_name,
        claimant_email: claim.claimant_email,
        vendor_notes: vendor_notes || null,
        status: 'pending',
        ...approvalUpdates,
      })

      const fmt = (v: unknown) => {
        if (Array.isArray(v)) return v.join(', ')
        const s = String(v ?? '')
        return s.length > 400 ? s.slice(0, 400) + '...' : s
      }
      const diffRow = (key: string, from: unknown, to: unknown) =>
        '<tr>' +
        '<td style="padding:6px 10px;border-bottom:1px solid #F3F4F6;color:#6B7280;vertical-align:top;white-space:nowrap;font-family:monospace;font-size:12px">' + esc(key) + '</td>' +
        '<td style="padding:6px 10px;border-bottom:1px solid #F3F4F6;color:#9CA3AF;vertical-align:top;font-size:13px">' + esc(fmt(from)) + '</td>' +
        '<td style="padding:6px 10px;border-bottom:1px solid #F3F4F6;color:#111827;vertical-align:top;font-size:13px">' + esc(fmt(to)) + '</td>' +
        '</tr>'

      const approvalRows = Object.entries(approvalUpdates)
        .map(([key, value]) => diffRow(key, currentAgent?.[key], value)).join('')
      const immediateRows = Object.entries(immediateUpdates)
        .map(([key, value]) => diffRow(key, currentAgent?.[key], value)).join('')

      await resend.emails.send({
        from: 'The AI Agent Index <hello@theaiagentindex.com>',
        to: 'hello@theaiagentindex.com',
        replyTo: claim.claimant_email,
        subject: 'New vendor edit request: ' + claim.agent_name,
        html: '<div style="font-family:system-ui,sans-serif;max-width:640px">' +
          '<p><strong>' + esc(claim.claimant_name) + '</strong> (' + esc(claim.claimant_email) + ') submitted edits to <strong>' + esc(claim.agent_name) + '</strong>.</p>' +
          (vendor_notes ? '<p><strong>Vendor notes:</strong> ' + esc(vendor_notes) + '</p>' : '') +
          (approvalRows
            ? '<p style="margin:16px 0 6px;font-weight:700;color:#92400E">Needs your approval:</p>' +
              '<table style="border-collapse:collapse;width:100%"><tr><th style="text-align:left;padding:6px 10px;font-size:11px;color:#9CA3AF;text-transform:uppercase">Field</th><th style="text-align:left;padding:6px 10px;font-size:11px;color:#9CA3AF;text-transform:uppercase">Current</th><th style="text-align:left;padding:6px 10px;font-size:11px;color:#9CA3AF;text-transform:uppercase">Proposed</th></tr>' + approvalRows + '</table>'
            : '') +
          (immediateRows
            ? '<p style="margin:16px 0 6px;font-weight:700;color:#166534">Already applied (vendor-owned fields):</p>' +
              '<table style="border-collapse:collapse;width:100%"><tr><th style="text-align:left;padding:6px 10px;font-size:11px;color:#9CA3AF;text-transform:uppercase">Field</th><th style="text-align:left;padding:6px 10px;font-size:11px;color:#9CA3AF;text-transform:uppercase">Was</th><th style="text-align:left;padding:6px 10px;font-size:11px;color:#9CA3AF;text-transform:uppercase">Now</th></tr>' + immediateRows + '</table>'
            : '') +
          '<p style="margin-top:16px"><a href="https://theaiagentindex.com/admin/reviews">Review in admin panel</a></p>' +
          '</div>',
      })
    }

    return NextResponse.json({
      success: true,
      immediate_applied: Object.keys(immediateUpdates).length,
      pending_approval: Object.keys(approvalUpdates).length,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}