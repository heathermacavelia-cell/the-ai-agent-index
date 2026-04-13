import { createServiceClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const HEATHER_EMAIL = 'heather@theaiagentindex.com'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://theaiagentindex.com'

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  try {
    const { discussion_id } = await req.json()
    if (!discussion_id) return NextResponse.json({ error: 'discussion_id required' }, { status: 400 })

    const supabase = createServiceClient()

    const { data: post } = await supabase
      .from('stack_discussions')
      .select('body, author_name, report_count, stack_id')
      .eq('id', discussion_id)
      .single()

    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    await supabase
      .from('stack_discussions')
      .update({ report_count: (post.report_count ?? 0) + 1 })
      .eq('id', discussion_id)

    if ((post.report_count ?? 0) === 0) {
      const adminUrl = `${SITE_URL}/admin`
      await resend.emails.send({
        from: 'The AI Agent Index <hello@theaiagentindex.com>',
        to: HEATHER_EMAIL,
        subject: '⚠️ Comment flagged for review',
        html: `<p>A comment has been flagged:</p>
          <blockquote style="border-left:3px solid #EF4444;padding-left:12px;color:#374151;">${post.body}</blockquote>
          <p>Posted by: ${post.author_name}</p>
          <p><a href="${adminUrl}">Review in admin →</a></p>`,
      })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}