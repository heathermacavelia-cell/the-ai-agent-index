import { createServiceClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const HEATHER_EMAIL = 'heather@theaiagentindex.com'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://theaiagentindex.com'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  try {
    const { stack_id, parent_id, author_name, author_email, body, honeypot } = await req.json()

    if (honeypot) return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })

    if (!stack_id || !author_name || !author_email || !body) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 })
    }
    if (!isValidEmail(author_email)) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }
    if (author_name.length < 2 || author_name.length > 50) {
      return NextResponse.json({ error: 'Display name must be 2–50 characters' }, { status: 400 })
    }
    if (!parent_id && body.length > 1000) {
      return NextResponse.json({ error: 'Comments must be under 1000 characters' }, { status: 400 })
    }
    if (parent_id && body.length > 2000) {
      return NextResponse.json({ error: 'Replies must be under 2000 characters' }, { status: 400 })
    }
    if (body.trim().length < 10) {
      return NextResponse.json({ error: 'Comment must be at least 10 characters' }, { status: 400 })
    }

    const supabase = createServiceClient()

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const { count } = await supabase
      .from('stack_discussions')
      .select('*', { count: 'exact', head: true })
      .eq('author_email', author_email.toLowerCase().trim())
      .gte('created_at', oneHourAgo)

    if ((count ?? 0) >= 6) {
      return NextResponse.json({ error: 'Too many posts. Please wait before posting again.' }, { status: 429 })
    }
    // Enforce consistent display name per email
const { data: existingPost } = await supabase
.from('stack_discussions')
.select('author_name')
.eq('author_email', author_email.toLowerCase().trim())
.eq('is_deleted', false)
.limit(1)
.single()

if (existingPost && existingPost.author_name !== author_name.trim()) {
return NextResponse.json({
  error: 'This email is already associated with the display name "' + existingPost.author_name + '". Please use the same name.',
}, { status: 400 })
}

    const { data: post, error } = await supabase
      .from('stack_discussions')
      .insert({
        stack_id,
        parent_id: parent_id ?? null,
        author_name: author_name.trim(),
        author_email: author_email.toLowerCase().trim(),
        body: body.trim(),
      })
      .select('id, delete_token, parent_id')
      .single()

    if (error || !post) throw error

    await supabase.from('newsletter_subscribers').upsert(
      { email: author_email.toLowerCase().trim(), source: 'stack_discussion' },
      { onConflict: 'email', ignoreDuplicates: true }
    )

    const { data: stack } = await supabase
      .from('stacks')
      .select('name, slug, submitter_email, submitter_name')
      .eq('id', stack_id)
      .single()

    if (stack) {
      const stackUrl = `${SITE_URL}/stacks/${stack.slug}`
      const deleteUrl = `${SITE_URL}/api/discussions/delete?token=${post.delete_token}`

      await resend.emails.send({
        from: 'The AI Agent Index <hello@theaiagentindex.com>',
        to: author_email,
        subject: 'Your comment on ' + stack.name,
        html: `<p>Hi ${author_name},</p>
          <p>Your comment has been posted on <a href="${stackUrl}">${stack.name}</a>.</p>
          <p>If you need to remove your comment, <a href="${deleteUrl}">click here to delete it</a>.</p>
          <p>You'll be notified if someone replies to your comment.</p>
          <p style="font-size:12px;color:#9CA3AF;">The AI Agent Index · <a href="${SITE_URL}/unsubscribe">Unsubscribe</a></p>`,
      })

      if (!parent_id && stack.submitter_email && stack.submitter_email !== author_email) {
        await resend.emails.send({
          from: 'The AI Agent Index <hello@theaiagentindex.com>',
          to: stack.submitter_email,
          subject: 'New discussion on your stack: ' + stack.name,
          html: `<p>Hi ${stack.submitter_name ?? 'there'},</p>
            <p><strong>${author_name}</strong> posted a comment on your stack <a href="${stackUrl}">${stack.name}</a>:</p>
            <blockquote style="border-left:3px solid #2563EB;padding-left:12px;color:#374151;">${body.trim()}</blockquote>
            <p><a href="${stackUrl}">View and reply →</a></p>
            <p style="font-size:12px;color:#9CA3AF;">The AI Agent Index · <a href="${SITE_URL}/unsubscribe">Unsubscribe</a></p>`,
        })
      }

      if (parent_id) {
        const { data: parent } = await supabase
          .from('stack_discussions')
          .select('author_email, author_name')
          .eq('id', parent_id)
          .single()

        if (parent && parent.author_email !== author_email) {
          await resend.emails.send({
            from: 'The AI Agent Index <hello@theaiagentindex.com>',
            to: parent.author_email,
            subject: author_name + ' replied to your comment',
            html: `<p>Hi ${parent.author_name},</p>
              <p><strong>${author_name}</strong> replied to your comment on <a href="${stackUrl}">${stack.name}</a>:</p>
              <blockquote style="border-left:3px solid #2563EB;padding-left:12px;color:#374151;">${body.trim()}</blockquote>
              <p><a href="${stackUrl}">View the reply →</a></p>
              <p style="font-size:12px;color:#9CA3AF;">The AI Agent Index · <a href="${SITE_URL}/unsubscribe">Unsubscribe</a></p>`,
          })
        }
      }
    }

    return NextResponse.json({ success: true, id: post.id })
  } catch {
    return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 })
  }
}
export async function GET(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url)
      const stack_id = searchParams.get('stack_id')
      if (!stack_id) return NextResponse.json({ error: 'stack_id required' }, { status: 400 })
  
      const supabase = createServiceClient()
      const { data, error } = await supabase
        .from('stack_discussions')
        .select('id, parent_id, author_name, body, upvotes, report_count, created_at')
        .eq('stack_id', stack_id)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })
  
      if (error) throw error
      return NextResponse.json(data ?? [])
    } catch {
      return NextResponse.json({ error: 'Failed' }, { status: 500 })
    }
  }