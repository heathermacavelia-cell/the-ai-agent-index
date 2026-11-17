import { createServiceClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { outreachSignature } from '@/lib/linkOutreach'

export const dynamic = 'force-dynamic'

// Stops the badge/link outreach for every listing at the same vendor address.
// It changes nothing on the listing itself.
async function optOut(req: NextRequest): Promise<boolean> {
  const params = new URL(req.url).searchParams
  const slug = params.get('s') ?? ''
  if (!slug || params.get('t') !== outreachSignature(slug)) return false
  const supabase = createServiceClient()
  const { data } = await supabase.from('agents').select('contact_email, submitter_email').eq('slug', slug).maybeSingle()
  const email = String(data?.contact_email || data?.submitter_email || '').trim()
  await supabase.from('agents').update({ link_outreach_opt_out: true }).eq('slug', slug)
  if (email) {
    await supabase.from('agents').update({ link_outreach_opt_out: true }).ilike('contact_email', email)
    await supabase.from('agents').update({ link_outreach_opt_out: true }).ilike('submitter_email', email)
  }
  return true
}

const page = (message: string) =>
  new NextResponse(
    '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>The AI Agent Index</title></head>' +
    '<body style="font-family:Helvetica,Arial,sans-serif;max-width:480px;margin:6rem auto;padding:0 1.5rem;text-align:center;color:#334155"><p style="font-size:16px;line-height:1.6">' + message + '</p></body></html>',
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  )

// GET only shows a confirm button. Company email scanners (Microsoft Safe Links,
// Mimecast, Proofpoint) open every link in an email to check it, and a GET that
// opted people out would unsubscribe them without anyone clicking (2026-11-17).
// The opt-out itself happens on POST: the button below, or a mail app's
// one-click unsubscribe (List-Unsubscribe-Post), both of which are real choices.
export async function GET(req: NextRequest) {
  const params = new URL(req.url).searchParams
  const slug = params.get('s') ?? ''
  if (!slug || params.get('t') !== outreachSignature(slug)) {
    return page('This link is not valid. Reply to our email and we will remove you by hand.')
  }
  const action = '/api/outreach-unsubscribe?s=' + encodeURIComponent(slug) + '&t=' + encodeURIComponent(params.get('t') ?? '')
  return page(
    'Stop emails about the listing badge?</p>' +
    '<form method="post" action="' + action + '" style="margin-top:1.25rem">' +
    '<button type="submit" style="font:inherit;font-size:15px;padding:0.6rem 1.25rem;border-radius:6px;border:1px solid #334155;background:#334155;color:#fff;cursor:pointer">Yes, stop these emails</button>' +
    '</form><p style="font-size:13px;color:#64748B;margin-top:1rem">Your listing is not affected either way.'
  )
}

export async function POST(req: NextRequest) {
  const ok = await optOut(req)
  // A mail app's one-click unsubscribe posts "List-Unsubscribe=One-Click"; it only needs a 200.
  // The confirm button posts an ordinary form; show the person a page.
  const type = req.headers.get('content-type') || ''
  const body = type.includes('application/x-www-form-urlencoded') ? await req.text() : ''
  if (body.includes('List-Unsubscribe=One-Click')) return NextResponse.json({ success: ok })
  return ok
    ? page("Done. We won't email you about badges again. Your listing is not affected.")
    : page('This link is not valid. Reply to our email and we will remove you by hand.')
}
