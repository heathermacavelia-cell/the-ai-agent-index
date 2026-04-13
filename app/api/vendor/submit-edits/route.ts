import { createServiceClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const IMMEDIATE_FIELDS = ['website_url', 'logo_url', 'short_description', 'long_description', 'pricing_url']
const APPROVAL_FIELDS = ['name', 'pricing_model', 'starting_price', 'customer_segment', 'deployment_method', 'deployment_difficulty', 'integrations', 'capability_tags', 'industry_tags', 'supported_languages', 'security_certifications']

export async function POST(req: NextRequest) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const body = await req.json()
    const { agent_slug, token, vendor_notes, ...fields } = body

    if (!agent_slug || !token) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Verify token matches an approved claim for this agent
    const { data: claim } = await supabase
      .from('agent_claims')
      .select('id, claimant_email, claimant_name, agent_id, agent_name')
      .eq('agent_slug', agent_slug)
      .eq('verification_token', token)
      .eq('status', 'approved')
      .single()

    if (!claim) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
    }

    // Fetch current agent data to compare
    const { data: currentAgent } = await supabase
      .from('agents')
      .select('*')
      .eq('id', claim.agent_id)
      .single()

    // Separate immediate vs approval fields - only include changed values
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
      } else if (APPROVAL_FIELDS.includes(key)) {
        approvalUpdates[key] = value
      }
    }

    // Apply immediate fields directly to agents table
    if (Object.keys(immediateUpdates).length > 0) {
      await supabase.from('agents').update(immediateUpdates).eq('id', claim.agent_id)
    }

    // Queue approval fields as edit request
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

      // Notify admin via email
      await resend.emails.send({
        from: 'The AI Agent Index <hello@theaiagentindex.com>',
        to: 'hello@theaiagentindex.com',
        subject: 'New vendor edit request — ' + claim.agent_name,
        html: '<p><strong>' + claim.claimant_name + '</strong> (' + claim.claimant_email + ') has submitted edits to <strong>' + claim.agent_name + '</strong> that require your approval.</p>' +
          (vendor_notes ? '<p><strong>Vendor notes:</strong> ' + vendor_notes + '</p>' : '') +
          '<p><a href="https://theaiagentindex.com/admin/reviews">Review in admin panel →</a></p>',
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