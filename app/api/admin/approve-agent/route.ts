import { createServiceClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { randomBytes } from 'crypto'

export async function POST(req: NextRequest) {
  const pass = req.headers.get('x-admin-password')
  if (pass !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const supabase = createServiceClient()

  const { data: agent, error: fetchError } = await supabase
    .from('agents')
    .select('name, slug, submitter_email')
    .eq('id', id)
    .single()

  if (fetchError || !agent) {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
  }

  // Approve the agent
  const { error } = await supabase
  .from('agents')
  .update({ is_active: true, is_verified: true })
  .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Auto-create an approved claim for the submitter so they can access vendor dashboard
  if (agent.submitter_email) {
    const verification_token = randomBytes(32).toString('hex')

    const { data: existingClaim } = await supabase
      .from('agent_claims')
      .select('id')
      .eq('agent_id', id)
      .eq('claimant_email', agent.submitter_email)
      .single()

    if (!existingClaim) {
      await supabase.from('agent_claims').insert({
        agent_id: id,
        agent_slug: agent.slug,
        agent_name: agent.name,
        claimant_name: agent.submitter_email.split('@')[0],
        claimant_email: agent.submitter_email,
        company_domain: agent.submitter_email.split('@')[1],
        domain_verified: false,
        status: 'approved',
        verification_token,
      })
    }

    // Send vendor onboarding email
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: 'The AI Agent Index <hello@theaiagentindex.com>',
        to: agent.submitter_email,
        subject: agent.name + ' is now live on The AI Agent Index',
        html: `
          <p>Hi,</p>
          <p>Great news — <strong>${agent.name}</strong> has been approved and is now live on The AI Agent Index.</p>
          <p><a href="https://theaiagentindex.com/agents/${agent.slug}" style="color:#2563EB">View your listing →</a></p>
          <hr style="border:none;border-top:1px solid #E5E7EB;margin:1.5rem 0" />
          <p><strong>Want to get verified?</strong></p>
          <p>Verified listings stand out in the index and are more likely to be cited by AI systems. To get your listing verified, access your vendor dashboard and fill in the full details — integrations, pricing, deployment info, and more.</p>
          <p style="margin-top:1rem">
            <a href="https://theaiagentindex.com/vendor" style="background:#2563EB;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:600;display:inline-block">
              Access your vendor dashboard →
            </a>
          </p>
          <p style="font-size:13px;color:#6B7280;margin-top:1rem">
            Use the email you submitted with (<strong>${agent.submitter_email}</strong>) and the agent slug <strong>${agent.slug}</strong> to access your dashboard.
          </p>
          <p style="color:#6B7280;font-size:13px;margin-top:1.5rem">— The AI Agent Index<br>Questions? Reply to this email or contact us at hello@theaiagentindex.com</p>
        `,
      })
    } catch (emailErr) {
      console.error('Failed to send vendor onboarding email:', emailErr)
    }
  }

  return NextResponse.json({ success: true })
}