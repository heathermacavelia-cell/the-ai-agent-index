export const dynamic = 'force-dynamic'
import { createServiceClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      name, website_url, contact_email, short_description, long_description,
      headquarters, team_size, service_tags, industry_tags, tool_specializations,
      regions_served, client_segments, pricing_model, hourly_rate_range,
      minimum_project_budget, linkedin_url, logo_url, clutch_url, interested_in_ads,
    } = body

    if (!name?.trim()) return NextResponse.json({ error: 'Agency name is required' }, { status: 400 })
    if (!website_url?.trim()) return NextResponse.json({ error: 'Website URL is required' }, { status: 400 })

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!contact_email || !emailRegex.test(contact_email)) {
      return NextResponse.json({ error: 'Valid contact email is required' }, { status: 400 })
    }

    if (!short_description?.trim() || short_description.trim().length < 120 || short_description.trim().length > 220) {
      return NextResponse.json({ error: 'Short description must be 120-220 characters' }, { status: 400 })
    }

    if (!headquarters?.trim()) return NextResponse.json({ error: 'Headquarters is required' }, { status: 400 })
    if (!team_size) return NextResponse.json({ error: 'Team size is required' }, { status: 400 })
    if (!service_tags || service_tags.length === 0) return NextResponse.json({ error: 'Select at least one service' }, { status: 400 })

    const slug = name.trim().toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

    const domain = website_url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]

    const supabase = createServiceClient()

    const { data: existing } = await supabase
      .from('agencies')
      .select('id')
      .eq('slug', slug)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ error: 'An agency with this name already exists in our directory' }, { status: 400 })
    }

    const submissionNotes = interested_in_ads
      ? 'Vendor submission. Interested in advertising options (Featured Listing, Verified Badge, Category Sponsor).'
      : 'Vendor submission.'

    const { error: insertError } = await supabase.from('agencies').insert({
      name: name.trim(),
      slug,
      website_url: website_url.trim(),
      favicon_domain: domain,
      short_description: short_description.trim(),
      long_description: long_description || null,
      headquarters: headquarters.trim(),
      team_size,
      company_type: 'agency',
      service_tags: service_tags || [],
      industry_tags: industry_tags || [],
      tool_specializations: tool_specializations || [],
      regions_served: regions_served || [],
      client_segments: client_segments || [],
      pricing_model: pricing_model || null,
      hourly_rate_range: hourly_rate_range || null,
      minimum_project_budget: minimum_project_budget || null,
      linkedin_url: linkedin_url || null,
      logo_url: logo_url || null,
      clutch_url: clutch_url || null,
      contact_email: contact_email.trim().toLowerCase(),
      submission_notes: submissionNotes,
      is_active: false,
      is_verified: false,
      is_featured: false,
    })

    if (insertError) {
      console.error('Agency insert error:', insertError)
      return NextResponse.json({ error: 'Failed to submit. Please try again.' }, { status: 500 })
    }

    try {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: 'The AI Agent Index <hello@theaiagentindex.com>',
        to: 'hello@theaiagentindex.com',
        subject: `New agency submission: ${name.trim()}`,
        html: `
          <p>A new agency has been submitted to The AI Agent Index and is pending your review.</p>
          <table style="border-collapse:collapse;margin:16px 0">
            <tr><td style="padding:6px 16px 6px 0;color:#6B7280;font-size:14px">Agency</td><td style="padding:6px 0;font-weight:bold">${name.trim()}</td></tr>
            <tr><td style="padding:6px 16px 6px 0;color:#6B7280;font-size:14px">Website</td><td style="padding:6px 0"><a href="${website_url}">${website_url}</a></td></tr>
            <tr><td style="padding:6px 16px 6px 0;color:#6B7280;font-size:14px">Location</td><td style="padding:6px 0">${headquarters}</td></tr>
            <tr><td style="padding:6px 16px 6px 0;color:#6B7280;font-size:14px">Team size</td><td style="padding:6px 0">${team_size}</td></tr>
            <tr><td style="padding:6px 16px 6px 0;color:#6B7280;font-size:14px">Services</td><td style="padding:6px 0">${(service_tags || []).join(', ')}</td></tr>
            <tr><td style="padding:6px 16px 6px 0;color:#6B7280;font-size:14px">Submitted by</td><td style="padding:6px 0">${contact_email}</td></tr>
            <tr><td style="padding:6px 16px 6px 0;color:#6B7280;font-size:14px">Advertising interest</td><td style="padding:6px 0;font-weight:bold;color:${interested_in_ads ? '#D97706' : '#6B7280'}">${interested_in_ads ? 'YES' : 'No'}</td></tr>
          </table>
          <p>— The AI Agent Index</p>
        `,
      })
    } catch (emailErr) {
      console.error('Failed to send agency notification email:', emailErr)
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}