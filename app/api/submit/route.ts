import { createServiceClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      name, developer, website_url, short_description, long_description,
      primary_category, pricing_model, starting_price, customer_segment, submitter_email
    } = body

    if (!name?.trim() || !developer?.trim() || !short_description?.trim() || !primary_category || !pricing_model || !customer_segment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!submitter_email || !emailRegex.test(submitter_email)) {
      return NextResponse.json({ error: 'Valid contact email required' }, { status: 400 })
    }

    const supabase = createServiceClient()

    let slug = slugify(name)
    const { data: existing } = await supabase.from('agents').select('slug').eq('slug', slug).single()
    if (existing) slug = slug + '-' + Date.now().toString().slice(-4)

    const searchText = [name, developer, short_description, long_description ?? ''].join(' ')

    const { error } = await supabase.from('agents').insert({
      name: name.trim(),
      slug,
      developer: developer.trim(),
      website_url: website_url?.trim() || null,
      short_description: short_description.trim(),
      long_description: long_description?.trim() || null,
      primary_category,
      pricing_model,
      starting_price: starting_price ? parseFloat(starting_price) : null,
      customer_segment,
      submitter_email: submitter_email.trim().toLowerCase(),
      industry_tags: [],
      capability_tags: [],
      is_active: false,   // pending admin approval
      is_featured: false,
      is_verified: false,
      rating_avg: 0,
      rating_count: 0,
      editorial_rating: null,
      search_text: searchText,
    })

    if (error) throw error

    // Notify Heather of new submission
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: 'noreply@theaiagentindex.com',
        to: 'hello@theaiagentindex.com',
        subject: 'New agent submission: ' + name.trim(),
        html: `
          <p>A new agent has been submitted to The AI Agent Index and is pending your approval.</p>
          <table style="border-collapse:collapse;width:100%;max-width:480px">
            <tr><td style="padding:6px 0;color:#6B7280;font-size:14px">Agent</td><td style="padding:6px 0;font-weight:600">${name.trim()}</td></tr>
            <tr><td style="padding:6px 0;color:#6B7280;font-size:14px">Developer</td><td style="padding:6px 0">${developer.trim()}</td></tr>
            <tr><td style="padding:6px 0;color:#6B7280;font-size:14px">Category</td><td style="padding:6px 0">${primary_category}</td></tr>
            <tr><td style="padding:6px 0;color:#6B7280;font-size:14px">Pricing</td><td style="padding:6px 0">${pricing_model}</td></tr>
            <tr><td style="padding:6px 0;color:#6B7280;font-size:14px">Submitted by</td><td style="padding:6px 0">${submitter_email}</td></tr>
          </table>
          <p style="margin-top:1.5rem"><a href="https://theaiagentindex.com/admin" style="background:#2563EB;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:600">Review in Admin →</a></p>
          <p style="color:#6B7280;font-size:13px;margin-top:1rem">— The AI Agent Index</p>
        `,
      })
    } catch (emailErr) {
      console.error('Failed to send admin notification email:', emailErr)
      // Don't fail the submission if email fails
    }

    return NextResponse.json({ success: true, slug })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Submission failed' }, { status: 500 })
  }
}