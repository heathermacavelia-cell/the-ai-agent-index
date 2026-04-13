import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { sendEmail } from '@/lib/email'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://theaiagentindex.com'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      name, tagline, description, workflow_goal, category, difficulty,
      agents, submitter_title, submitter_company_type, email,
    } = body

    if (!name || !category || !difficulty || !email || !agents?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createServiceClient()

    const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const { data: existing } = await supabase.from('stacks').select('slug').ilike('slug', baseSlug + '%')
    const slug = existing && existing.length > 0 ? baseSlug + '-' + Date.now() : baseSlug

    const finalDescription = description?.trim() ||
      [tagline, workflow_goal ? 'Goal: ' + workflow_goal : ''].filter(Boolean).join(' ')

    const agentSummary = (agents as any[]).map((a: any, i: number) =>
      `${i + 1}. ${a.name}${a.type === 'unlisted' ? ' (not yet listed)' : ''} — ${a.role}${a.connection ? ' [' + a.connection + ']' : ''}`
    ).join('\n')

    const { data: stack, error } = await supabase
      .from('stacks')
      .insert({
        name,
        slug,
        tagline: tagline || name,
        description: finalDescription + '\n\nAgents:\n' + agentSummary,
        workflow_goal: workflow_goal || '',
        primary_category: category,
        difficulty,
        is_editorial: false,
        is_community: true,
        is_active: false,
        is_approved: false,
        status: 'pending',
        submitter_title: submitter_title || null,
        submitter_company_type: submitter_company_type || null,
        submitter_email: email,
        submitter_name: null,
        submission_agents: agents,
      })
      .select('id')
      .single()

    if (error || !stack) throw error

    await sendEmail({
      to: 'heather@theaiagentindex.com',
      subject: `New stack submission: ${name}`,
      source: 'admin-notification',
      html: `
        <div style="font-family:sans-serif;max-width:600px;">
          <h2 style="color:#1D4ED8;">New stack submission</h2>
          <table style="border-collapse:collapse;width:100%;">
            <tr><td style="padding:8px 12px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:600;width:140px;">Stack name</td><td style="padding:8px 12px;border:1px solid #e5e7eb;">${name}</td></tr>
            <tr><td style="padding:8px 12px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:600;">Category</td><td style="padding:8px 12px;border:1px solid #e5e7eb;">${category}</td></tr>
            <tr><td style="padding:8px 12px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:600;">Difficulty</td><td style="padding:8px 12px;border:1px solid #e5e7eb;">${difficulty}</td></tr>
            <tr><td style="padding:8px 12px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:600;">Goal</td><td style="padding:8px 12px;border:1px solid #e5e7eb;">${workflow_goal || '—'}</td></tr>
            <tr><td style="padding:8px 12px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:600;">Agents</td><td style="padding:8px 12px;border:1px solid #e5e7eb;white-space:pre-wrap;">${agentSummary}</td></tr>
            <tr><td style="padding:8px 12px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:600;">Job title</td><td style="padding:8px 12px;border:1px solid #e5e7eb;">${submitter_title || '—'}</td></tr>
            <tr><td style="padding:8px 12px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:600;">Company</td><td style="padding:8px 12px;border:1px solid #e5e7eb;">${submitter_company_type || '—'}</td></tr>
            <tr><td style="padding:8px 12px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:600;">Email</td><td style="padding:8px 12px;border:1px solid #e5e7eb;"><a href="mailto:${email}">${email}</a></td></tr>
          </table>
          <p style="margin-top:1.5rem;"><a href="${SITE_URL}/admin/reviews" style="background:#2563EB;color:white;padding:0.5rem 1rem;border-radius:0.375rem;text-decoration:none;font-weight:600;">Review in admin →</a></p>
        </div>
      `,
    })

    await sendEmail({
      to: email,
      subject: `We received your stack submission: ${name}`,
      source: 'stack_submission',
      html: `
        <div style="font-family:sans-serif;max-width:600px;">
          <h2 style="color:#1D4ED8;">Stack received — thank you!</h2>
          <p>We've received your submission for <strong>${name}</strong> and will review it shortly.</p>
          <p>You'll get an email when it's approved and live, or if we have any questions.</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Stack submit error:', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}