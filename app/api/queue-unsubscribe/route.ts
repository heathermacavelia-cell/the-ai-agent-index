import { createServiceClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { unsubscribeSignature } from '@/lib/queueReminders'

export const dynamic = 'force-dynamic'

// Stops queue reminders for an address. It does not touch the submission: the
// listing stays in the queue and the "your listing is live" email still goes.
async function optOut(req: NextRequest): Promise<boolean> {
  const params = new URL(req.url).searchParams
  const kind = params.get('k')
  const slug = params.get('s') ?? ''
  if ((kind !== 'agent' && kind !== 'agency') || !slug) return false
  if (params.get('t') !== unsubscribeSignature(kind, slug)) return false

  const supabase = createServiceClient()
  const column = kind === 'agent' ? 'submitter_email' : 'contact_email'
  const { data } = await supabase.from(kind === 'agent' ? 'agents' : 'agencies').select(column).eq('slug', slug).maybeSingle()
  const email = (data as any)?.[column]
  if (!email) return true // already approved away or declined: nothing left to stop
  await supabase.from('agents').update({ queue_emails_opt_out: true }).eq('submitter_email', email)
  await supabase.from('agencies').update({ queue_emails_opt_out: true }).eq('contact_email', email)
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
    ? page("You're unsubscribed from these reminders. Your submission stays in the queue, and we'll still email you when your listing is live.")
    : page('This link is not valid. Reply to any of our emails and we will remove you by hand.')
}

// Mail apps use this for their one-click unsubscribe button.
export async function POST(req: NextRequest) {
  return NextResponse.json({ success: await optOut(req) })
}
