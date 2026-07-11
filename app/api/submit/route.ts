import { createServiceClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { screenSubmission } from '@/lib/submissionScreen'

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      name, developer, website_url, pricing_url, logo_url, short_description,
      primary_category, pricing_model, starting_price, customer_segment, submitter_email,
      mcp_claim, mcp_docs_url, notes, interested_in_ads
    } = body
    // Vendor research pointers, preserved for the editorial audit.
    const long_description = [
      mcp_claim ? 'Vendor MCP claim: ' + mcp_claim + (mcp_docs_url ? ' (docs: ' + mcp_docs_url + ')' : '') + '.' : '',
      notes ? 'Vendor notes: ' + notes : '',
    ].filter(Boolean).join(' ') || null

    if (!name?.trim() || !developer?.trim() || !short_description?.trim() || !primary_category || !pricing_model || !customer_segment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const urlRegex = /^https?:\/\/.+\..+/
    if (!website_url?.trim() || !urlRegex.test(website_url.trim())) {
      return NextResponse.json({ error: 'A valid website URL is required' }, { status: 400 })
    }
    if (!pricing_url?.trim() || !urlRegex.test(pricing_url.trim())) {
      return NextResponse.json({ error: 'A valid public pricing page URL is required' }, { status: 400 })
    }
    const desc = short_description.trim()
    if (desc.length < 120 || desc.length > 220) {
      return NextResponse.json({ error: 'Description must be 120 to 220 characters' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!submitter_email || !emailRegex.test(submitter_email)) {
      return NextResponse.json({ error: 'Valid contact email required' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Spam screen: log auto-rejects to rejected_submissions, then drop (no agents row, no email).
    const screen = screenSubmission({
      websiteUrl: website_url,
      contactEmail: submitter_email,
      text: [short_description, long_description].filter(Boolean).join(' '),
    })
    if (screen.action === 'auto_reject') {
      try {
        await supabase.from('rejected_submissions').insert({
          name: name?.trim() || null,
          developer: developer?.trim() || null,
          website_url: website_url?.trim() || null,
          short_description: short_description?.trim() || null,
          long_description: long_description?.trim() || null,
          primary_category: primary_category || null,
          pricing_model: pricing_model || null,
          starting_price: starting_price ? parseFloat(starting_price) : null,
          customer_segment: customer_segment || null,
          submitter_email: submitter_email.trim().toLowerCase(),
          reason: screen.reason,
          raw_payload: body,
        })
      } catch (logErr) {
        console.error('Failed to log rejected submission:', logErr)
      }
      console.log('Submission auto-rejected:', screen.reason, '| from:', submitter_email)
      return NextResponse.json({ success: true })
    }

    // Spam screen: quarantine borderline cases — log + notify, but do NOT queue.
    if (screen.action === 'quarantine') {
      try {
        await supabase.from('rejected_submissions').insert({
          name: name?.trim() || null,
          developer: developer?.trim() || null,
          website_url: website_url?.trim() || null,
          short_description: short_description?.trim() || null,
          long_description: long_description?.trim() || null,
          primary_category: primary_category || null,
          pricing_model: pricing_model || null,
          starting_price: starting_price ? parseFloat(starting_price) : null,
          customer_segment: customer_segment || null,
          submitter_email: submitter_email.trim().toLowerCase(),
          reason: 'QUARANTINED: ' + screen.flags.join('; '),
          raw_payload: body,
        })
      } catch (logErr) {
        console.error('Failed to log quarantined submission:', logErr)
      }

      try {
        const { Resend } = await import('resend')
        const resend = new Resend(process.env.RESEND_API_KEY)
        const safe = (s: string) => s.replace(/</g, '&lt;').replace(/>/g, '&gt;')
        await resend.emails.send({
          from: 'The AI Agent Index <hello@theaiagentindex.com>',
          to: 'hello@theaiagentindex.com',
          subject: `⚠️ Flagged submission needs review: ${name.trim()}`,
          html: `
            <div style="font-family:system-ui,sans-serif;max-width:600px">
              <div style="background:#FEF2F2;border:2px solid #EF4444;border-radius:8px;padding:12px 16px;margin:12px 0">
                <p style="margin:0;font-size:14px;font-weight:700;color:#B91C1C">⚠️ Auto-quarantined — NOT added to the pending queue.</p>
                <p style="margin:8px 0 0;font-size:13px;color:#7F1D1D">Do not open the website link. Review below and only add it manually if it is clearly legitimate.</p>
              </div>
              <div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;padding:16px;margin:12px 0;font-size:14px;color:#111827">
                <p style="margin:0 0 8px"><strong>Why flagged:</strong> ${safe(screen.flags.join('; '))}</p>
                <p style="margin:0 0 4px"><strong>Name:</strong> ${safe(name.trim())} · by ${safe(developer.trim())}</p>
                <p style="margin:0 0 4px"><strong>Website (not linked):</strong> ${website_url?.trim() ? safe(website_url.trim()) : 'Not provided'}</p>
                <p style="margin:0 0 4px"><strong>Contact:</strong> ${safe(submitter_email)}</p>
                <p style="margin:0"><strong>Short description:</strong> ${safe(short_description.trim())}</p>
              </div>
              <p style="color:#9CA3AF;font-size:12px">— The AI Agent Index spam screen</p>
            </div>
          `,
        })
      } catch (emailErr) {
        console.error('Failed to send quarantine notification email:', emailErr)
      }

      console.log('Submission quarantined:', screen.flags.join('; '), '| from:', submitter_email)
      return NextResponse.json({ success: true })
    }

    let slug = slugify(name)
    const { data: existing } = await supabase.from('agents').select('slug').eq('slug', slug).single()
    if (existing) slug = slug + '-' + Date.now().toString().slice(-4)

    const searchText = [name, developer, short_description, long_description ?? ''].join(' ')

    const { error } = await supabase.from('agents').insert({
      name: name.trim(),
      slug,
      developer: developer.trim(),
      website_url: website_url.trim(),
      pricing_url: pricing_url.trim(),
      logo_url: logo_url?.trim() || null,
      short_description: short_description.trim(),
      long_description,
      primary_category,
      pricing_model,
      starting_price: starting_price ? parseFloat(starting_price) : null,
      customer_segment,
      submitter_email: submitter_email.trim().toLowerCase(),
      industry_tags: [],
      capability_tags: [],
      is_active: false,
      is_featured: false,
      is_verified: false,
      rating_avg: 0,
      rating_count: 0,
      editorial_rating: null,
      search_text: searchText,
    })

    if (error) throw error

    try {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)

      const domain = website_url?.trim() ? website_url.trim().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0] : null
      const pricingDisplay = starting_price ? `${pricing_model} — $${starting_price}/mo` : pricing_model
      const categoryDisplay = primary_category.replace('ai-', '').replace(/-agents$/, '').replace(/-/g, ' ')

      await resend.emails.send({
        from: 'The AI Agent Index <hello@theaiagentindex.com>',
        to: 'hello@theaiagentindex.com',
        subject: `New agent submission: ${name.trim()}${interested_in_ads ? ' ⭐ WANTS ADS' : ''}`,
        html: `
          <div style="font-family:system-ui,sans-serif;max-width:600px">
            <p style="font-size:15px;color:#111827">A new agent has been submitted and is pending your approval.</p>
            ${interested_in_ads ? `
              <div style="background:#FFFBEB;border:2px solid #F59E0B;border-radius:8px;padding:12px 16px;margin:12px 0">
                <p style="margin:0;font-size:14px;font-weight:700;color:#D97706">⭐ This vendor is interested in advertising options (Featured Listing, Sponsored Placement, Comparison Ads)</p>
              </div>
              ` : ''}

            <div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;padding:20px;margin:16px 0">
              <h2 style="margin:0 0 4px;font-size:18px;color:#111827">${name.trim()}</h2>
              <p style="margin:0 0 12px;font-size:13px;color:#6B7280">by ${developer.trim()}${domain ? ' · ' + domain : ''}</p>

              <table style="border-collapse:collapse;width:100%;font-size:14px">
                <tr style="border-bottom:1px solid #F3F4F6">
                  <td style="padding:8px 12px 8px 0;color:#9CA3AF;width:120px">Category</td>
                  <td style="padding:8px 0;color:#111827;text-transform:capitalize">${categoryDisplay}</td>
                </tr>
                <tr style="border-bottom:1px solid #F3F4F6">
                  <td style="padding:8px 12px 8px 0;color:#9CA3AF">Pricing</td>
                  <td style="padding:8px 0;color:#111827">${pricingDisplay}</td>
                </tr>
                <tr style="border-bottom:1px solid #F3F4F6">
                  <td style="padding:8px 12px 8px 0;color:#9CA3AF">Segment</td>
                  <td style="padding:8px 0;color:#111827">${customer_segment}</td>
                </tr>
                <tr style="border-bottom:1px solid #F3F4F6">
                  <td style="padding:8px 12px 8px 0;color:#9CA3AF">Website</td>
                  <td style="padding:8px 0">${website_url?.trim() ? '<a href="' + website_url.trim() + '" style="color:#2563EB">' + website_url.trim() + '</a>' : '<span style="color:#9CA3AF">Not provided</span>'}</td>
                </tr>
                <tr style="border-bottom:1px solid #F3F4F6">
                  <td style="padding:8px 12px 8px 0;color:#9CA3AF">Pricing page</td>
                  <td style="padding:8px 0">${pricing_url?.trim() ? '<a href="' + pricing_url.trim() + '" style="color:#2563EB">' + pricing_url.trim() + '</a>' : '<span style="color:#9CA3AF">Not provided</span>'}</td>
                </tr>
                <tr style="border-bottom:1px solid #F3F4F6">
                  <td style="padding:8px 12px 8px 0;color:#9CA3AF">MCP claim</td>
                  <td style="padding:8px 0;color:#111827">${mcp_claim ? mcp_claim + (mcp_docs_url?.trim() ? ' — <a href="' + mcp_docs_url.trim() + '" style="color:#2563EB">docs</a>' : '') : '<span style="color:#9CA3AF">Not stated</span>'}</td>
                </tr>
                <tr>
                  <td style="padding:8px 12px 8px 0;color:#9CA3AF">Contact</td>
                  <td style="padding:8px 0"><a href="mailto:${submitter_email}" style="color:#2563EB">${submitter_email}</a></td>
                </tr>
              </table>
            </div>

            <div style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:8px;padding:16px;margin:16px 0">
              <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#92400E;text-transform:uppercase;letter-spacing:0.05em">Short Description</p>
              <p style="margin:0;font-size:14px;color:#374151;line-height:1.5">${short_description.trim()}</p>
            </div>

            ${long_description?.trim() ? `
            <div style="background:white;border:1px solid #E5E7EB;border-radius:8px;padding:16px;margin:16px 0">
              <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.05em">Detailed Description</p>
              <p style="margin:0;font-size:14px;color:#374151;line-height:1.6">${long_description.trim()}</p>
            </div>
            ` : ''}

            <div style="margin:20px 0">
              <a href="https://theaiagentindex.com/admin/reviews" style="display:inline-block;background:#2563EB;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px">Review in Admin →</a>
              <a href="${website_url?.trim() || '#'}" style="display:inline-block;background:#F3F4F6;color:#374151;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px;margin-left:8px">Visit Website →</a>
            </div>

            <p style="color:#9CA3AF;font-size:12px;margin-top:16px">— The AI Agent Index</p>
          </div>
        `,
      })
    } catch (emailErr) {
      console.error('Failed to send admin notification email:', emailErr)
    }

    return NextResponse.json({ success: true, slug })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Submission failed' }, { status: 500 })
  }
}