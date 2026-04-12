import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const body = await request.json()
    const { name, tagline, description, workflow_goal, category, agents, how_they_connect, submitter_title, submitter_company_type, email } = body

    if (!name || !category || !agents || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createServiceClient()
    await supabase.from('stacks').insert({
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      tagline: tagline || name,
      description: `${description || ''}\n\nAgents: ${agents}\n\nHow they connect: ${how_they_connect || 'Not provided'}`,
      workflow_goal: workflow_goal || '',
      primary_category: category,
      is_editorial: false,
      is_community: true,
      is_active: false,
      is_approved: false,
      submitter_title: submitter_title || null,
      submitter_company_type: submitter_company_type || null,
    })

    await resend.emails.send({
      from: 'noreply@theaiagentindex.com',
      to: 'hello@theaiagentindex.com',
      replyTo: email,
      subject: `New community stack submission: ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px;">
          <h2 style="color: #1D4ED8;">New stack submission</h2>
          <table style="border-collapse: collapse; width: 100%;">
            <tr><td style="padding: 8px 12px; border: 1px solid #e5e7eb; background: #f9fafb; font-weight: 600; width: 140px;">Stack name</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">${name}</td></tr>
            <tr><td style="padding: 8px 12px; border: 1px solid #e5e7eb; background: #f9fafb; font-weight: 600;">Category</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">${category}</td></tr>
            <tr><td style="padding: 8px 12px; border: 1px solid #e5e7eb; background: #f9fafb; font-weight: 600;">Goal</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">${workflow_goal}</td></tr>
            <tr><td style="padding: 8px 12px; border: 1px solid #e5e7eb; background: #f9fafb; font-weight: 600;">Agents</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; white-space: pre-wrap;">${agents}</td></tr>
            <tr><td style="padding: 8px 12px; border: 1px solid #e5e7eb; background: #f9fafb; font-weight: 600;">Connection</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">${how_they_connect || '—'}</td></tr>
            <tr><td style="padding: 8px 12px; border: 1px solid #e5e7eb; background: #f9fafb; font-weight: 600;">Job title</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">${submitter_title || '—'}</td></tr>
            <tr><td style="padding: 8px 12px; border: 1px solid #e5e7eb; background: #f9fafb; font-weight: 600;">Company type</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">${submitter_company_type || '—'}</td></tr>
            <tr><td style="padding: 8px 12px; border: 1px solid #e5e7eb; background: #f9fafb; font-weight: 600;">Email</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb;"><a href="mailto:${email}">${email}</a></td></tr>
          </table>
          <p style="margin-top: 1.5rem; color: #6b7280; font-size: 0.875rem;">Review and approve in Supabase — set is_active=true and is_approved=true when ready to publish.</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Stack submit error:', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}