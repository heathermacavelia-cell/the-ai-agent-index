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

export async function GET(req: NextRequest) {
  return (await optOut(req))
    ? page("Done. We won't email you about badges again. Your listing is not affected.")
    : page('This link is not valid. Reply to our email and we will remove you by hand.')
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ success: await optOut(req) })
}
