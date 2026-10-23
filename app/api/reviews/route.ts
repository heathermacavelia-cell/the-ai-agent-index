import { createServiceClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import {
  REVIEWER_ROLES, COMPANY_SIZES, USAGE_DURATIONS, REVIEWER_INDUSTRIES, COUNTRIES, REVIEW_LIMITS,
} from '@/lib/reviewOptions'

// 2026-10-23 rewrite. What changed and why:
// - A review is saved UNAPPROVED and goes live only when the reviewer clicks the link we email
//   (POST /api/reviews/confirm). Before this, reviews published instantly with no email check.
// - The "look up a review by email" GET branch is gone - it returned anyone's review to anyone.
// - Editing a live review stores the change in pending_edit; the live review stays as it was
//   until the new link is clicked.
// - The confirmation email is sent with Resend directly, NOT lib/email.ts sendEmail(), because
//   sendEmail() adds every recipient to newsletter_subscribers.
// - Reviewer role / size / industry / country / region / city / usage are new. City is stored
//   for our own reporting and is never returned by the GET below.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://theaiagentindex.com'
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const PUBLIC_COLUMNS =
  'id, rating, comment, reviewer_name, created_at, updated_at, edited_at, reviewer_role, reviewer_company_size, reviewer_industry, reviewer_country, reviewer_region, usage_duration'

function generateDisplayName(email: string): string {
  return email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase()
}

function generateAlternatives(base: string): string[] {
  const suffixes = ['_2', '_x', '_user', Math.floor(Math.random() * 90 + 10).toString()]
  return suffixes.map((s) => `${base}${s}`)
}

function pick(value: unknown, allowed: readonly string[]): string | null {
  return typeof value === 'string' && allowed.includes(value) ? value : null
}

function cleanText(value: unknown, max: number): string | null {
  if (typeof value !== 'string') return null
  const v = value.replace(/\s+/g, ' ').trim()
  return v ? v.slice(0, max) : null
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const agent_id = searchParams.get('agent_id')
  if (!agent_id) return NextResponse.json({ error: 'Missing agent_id' }, { status: 400 })

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('reviews')
    .select(PUBLIC_COLUMNS)
    .eq('agent_id', agent_id)
    .eq('is_approved', true)
    .order('updated_at', { ascending: false })

  if (error) return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store' } })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Honeypot: a hidden field people never see. Bots fill it. Pretend success, save nothing.
    if (typeof body.website === 'string' && body.website.trim() !== '') {
      return NextResponse.json({ success: true, status: 'check_email' })
    }

    const agent_id = typeof body.agent_id === 'string' ? body.agent_id : ''
    const rating = parseInt(body.rating, 10)
    const email = typeof body.reviewer_email === 'string' ? body.reviewer_email.toLowerCase().trim() : ''
    const name = cleanText(body.reviewer_name, REVIEW_LIMITS.name)
    const comment = typeof body.comment === 'string' && body.comment.trim() ? body.comment.trim().slice(0, REVIEW_LIMITS.comment) : null

    const fields = {
      reviewer_role: pick(body.reviewer_role, REVIEWER_ROLES),
      reviewer_company_size: pick(body.reviewer_company_size, COMPANY_SIZES),
      reviewer_industry: pick(body.reviewer_industry, REVIEWER_INDUSTRIES),
      reviewer_country: pick(body.reviewer_country, COUNTRIES),
      reviewer_region: cleanText(body.reviewer_region, REVIEW_LIMITS.region),
      reviewer_city: cleanText(body.reviewer_city, REVIEW_LIMITS.city),
      usage_duration: pick(body.usage_duration, USAGE_DURATIONS),
    }

    if (!agent_id || !(rating >= 1 && rating <= 5))
      return NextResponse.json({ error: 'Please choose a star rating.' }, { status: 400 })
    if (!emailRegex.test(email))
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    if (!name)
      return NextResponse.json({ error: 'Please choose a display name.' }, { status: 400 })
    if (!fields.reviewer_role || !fields.reviewer_company_size)
      return NextResponse.json({ error: 'Please choose your role and company size.' }, { status: 400 })

    const supabase = createServiceClient()

    const { data: agent } = await supabase
      .from('agents')
      .select('id, name, slug')
      .eq('id', agent_id)
      .eq('is_active', true)
      .single()
    if (!agent) return NextResponse.json({ error: 'Agent not found' }, { status: 404 })

    // A confirmed reviewer keeps the display name they already have.
    const { data: profile } = await supabase
      .from('reviewer_profiles')
      .select('display_name')
      .eq('email', email)
      .maybeSingle()

    let displayName = profile?.display_name ?? name
    if (!profile) {
      const { data: nameTaken } = await supabase
        .from('reviewer_profiles')
        .select('id')
        .eq('display_name', name)
        .maybeSingle()
      if (nameTaken) {
        return NextResponse.json(
          { error: 'name_taken', alternatives: generateAlternatives(generateDisplayName(email)) },
          { status: 409 }
        )
      }
      displayName = name
    }

    const token = crypto.randomUUID()
    const now = new Date().toISOString()
    const content = { rating, comment, reviewer_name: displayName, ...fields }

    const { data: existing } = await supabase
      .from('reviews')
      .select('id, is_approved')
      .eq('agent_id', agent_id)
      .eq('reviewer_email', email)
      .maybeSingle()

    let isUpdate = false
    if (existing && existing.is_approved) {
      // Live review: keep it as it is until the edit is confirmed.
      isUpdate = true
      const { error } = await supabase
        .from('reviews')
        .update({ pending_edit: content, confirm_token: token, confirm_sent_at: now })
        .eq('id', existing.id)
      if (error) throw error
    } else if (existing) {
      // Never confirmed: replace it and send a fresh link.
      const { error } = await supabase
        .from('reviews')
        .update({ ...content, is_approved: false, confirm_token: token, confirm_sent_at: now, pending_edit: null })
        .eq('id', existing.id)
      if (error) throw error
    } else {
      const { error } = await supabase.from('reviews').insert({
        agent_id,
        reviewer_email: email,
        ...content,
        is_approved: false,
        confirm_token: token,
        confirm_sent_at: now,
      })
      if (error) throw error
    }

    const confirmUrl = `${SITE_URL}/reviews/confirm?token=${token}`
    const agentName = escapeHtml(agent.name)
    const resend = new Resend(process.env.RESEND_API_KEY)
    const sent = await resend.emails.send({
      from: 'The AI Agent Index <hello@theaiagentindex.com>',
      to: email,
      subject: isUpdate ? `Confirm your updated review of ${agent.name}` : `Confirm your review of ${agent.name}`,
      html: `
        <div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;max-width:520px;color:#111827;line-height:1.6;">
          <p>Hi ${escapeHtml(displayName)},</p>
          <p>Thanks for ${isUpdate ? 'updating your review' : 'reviewing'} <strong>${agentName}</strong> on The AI Agent Index. Please confirm it's you and your review will go live.</p>
          <p style="margin:1.5rem 0;"><a href="${confirmUrl}" style="background:#2563EB;color:#ffffff;padding:0.7rem 1.2rem;border-radius:0.5rem;text-decoration:none;font-weight:600;">Confirm my review</a></p>
          <p style="font-size:0.85rem;color:#6B7280;">This link works for 7 days. If you didn't write this review, ignore this email and nothing will be published.</p>
          <p style="font-size:0.85rem;color:#6B7280;">Your email address is never shown on the site.</p>
          <p style="font-size:0.75rem;color:#9CA3AF;margin-top:2rem;">The AI Agent Index</p>
        </div>`,
      text: `Thanks for ${isUpdate ? 'updating your review' : 'reviewing'} ${agent.name} on The AI Agent Index.\n\nConfirm it's you and your review will go live:\n${confirmUrl}\n\nThis link works for 7 days. If you didn't write this review, ignore this email and nothing will be published.`,
    })
    if (sent.error) {
      return NextResponse.json({ error: 'We could not send the confirmation email. Please check the address and try again.' }, { status: 502 })
    }

    return NextResponse.json({ success: true, status: 'check_email', action: isUpdate ? 'updated' : 'created' })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 })
  }
}
