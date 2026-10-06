export const dynamic = 'force-dynamic'
import { createServiceClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { sendAgencyLiveEmail } from '@/lib/agencyEmails'

function checkAuth(req: NextRequest) {
  return req.headers.get('x-admin-password') === (process.env.ADMIN_PASSWORD ?? 'changeme')
}

const EMAIL_COLUMNS = 'name, slug, contact_email, submission_notes, submitted_tier, listing_tier, is_active'

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('agencies')
    .select('id, name, slug, website_url, favicon_domain, headquarters, team_size, service_tags, industry_tags, tool_specializations, pricing_model, hourly_rate_range, minimum_project_budget, contact_email, submission_notes, submitted_tier, short_description, is_active, is_verified, is_featured, created_at')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id, action } = await req.json()
  if (!id || !action) return NextResponse.json({ error: 'Missing id or action' }, { status: 400 })
  const supabase = createServiceClient()

  if (action === 'approve') {
    // Ruled 2026-09-21c: an agency that submitted its own listing through the
    // form is shown as Claimed once approved. Editorially added rows are not.
    // listing_tier is NEVER written here - the paid badge is set by SQL when a
    // paid review is delivered.
    const { data: row, error: readError } = await supabase.from('agencies').select(EMAIL_COLUMNS).eq('id', id).maybeSingle()
    if (readError || !row) return NextResponse.json({ error: 'Failed to approve' }, { status: 500 })
    const selfSubmitted = (row.submission_notes ?? '').startsWith('Vendor submission')
    const { error } = await supabase.from('agencies')
      .update(selfSubmitted ? { is_active: true, vendor_claimed: true } : { is_active: true })
      .eq('id', id)
    if (error) return NextResponse.json({ error: 'Failed to approve' }, { status: 500 })

    // Added 2026-10-06: tell the agency its listing is live (approve sent nothing
    // before). A failed email never undoes the approval; it is reported back so
    // the admin page can say so, and "Send live email" can be used to retry.
    let emailed = false
    let emailError: string | null = null
    try {
      emailed = await sendAgencyLiveEmail(row)
    } catch (e) {
      emailError = e instanceof Error ? e.message : 'Email failed'
      console.error('Agency live email failed:', e)
    }
    return NextResponse.json({ success: true, emailed, emailError })
  } else if (action === 'send-live-email') {
    // Sends the live email for a listing that is ALREADY live - for agencies
    // approved before 2026-10-06, or to retry a failed send. Refuses a pending row,
    // so it can never tell anyone a listing is live when it is not.
    const { data: row, error: readError } = await supabase.from('agencies').select(EMAIL_COLUMNS).eq('id', id).maybeSingle()
    if (readError || !row) return NextResponse.json({ error: 'Agency not found' }, { status: 404 })
    if (!row.is_active) return NextResponse.json({ error: 'This listing is not live yet. Approve it first.' }, { status: 400 })
    if (!row.contact_email) return NextResponse.json({ error: 'No contact email on this listing.' }, { status: 400 })
    try {
      await sendAgencyLiveEmail(row)
    } catch (e) {
      console.error('Agency live email failed:', e)
      return NextResponse.json({ error: e instanceof Error ? e.message : 'Email failed' }, { status: 500 })
    }
    return NextResponse.json({ success: true, emailed: true })
  } else if (action === 'reject' || action === 'delete') {
    const { error } = await supabase.from('agencies').delete().eq('id', id)
    if (error) return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
