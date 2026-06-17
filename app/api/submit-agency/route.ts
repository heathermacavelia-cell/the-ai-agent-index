export const dynamic = 'force-dynamic'
import { createServiceClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

const SERVICE_LABELS: Record<string, string> = {
  'ai-agent-building': 'AI Agent Building', 'workflow-automation': 'Workflow Automation',
  'ai-strategy': 'AI Strategy', 'chatbot-development': 'Chatbot Development',
  'data-pipeline': 'Data Pipeline', 'ai-training': 'AI Training',
  'prompt-engineering': 'Prompt Engineering', 'custom-integrations': 'Custom Integrations',
  'voice-agents': 'Voice Agents', 'rag-development': 'RAG Development',
}

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

      const servicesDisplay = (service_tags || []).map((s: string) => SERVICE_LABELS[s] ?? s).join(', ')
      const industriesDisplay = (industry_tags || []).length > 0 ? (industry_tags || []).join(', ') : 'Not specified'
      const toolsDisplay = (tool_specializations || []).length > 0 ? (tool_specializations || []).join(', ') : 'Not specified'
      const regionsDisplay = (regions_served || []).length > 0 ? (regions_served || []).join(', ') : 'Not specified'
      const clientsDisplay = (client_segments || []).length > 0 ? (client_segments || []).join(', ') : 'Not specified'
      const pricingDisplay = [
        pricing_model ? pricing_model.charAt(0).toUpperCase() + pricing_model.slice(1) : null,
        hourly_rate_range,
        minimum_project_budget ? 'Min. ' + minimum_project_budget : null,
      ].filter(Boolean).join(' · ') || 'Not specified'

      await resend.emails.send({
        from: 'The AI Agent Index <hello@theaiagentindex.com>',
        to: 'hello@theaiagentindex.com',
        subject: `New agency submission: ${name.trim()}${interested_in_ads ? ' ⭐ WANTS ADS' : ''}`,
        html: `
          <div style="font-family:system-ui,sans-serif;max-width:600px">
            <p style="font-size:15px;color:#111827">A new agency has been submitted and is pending your review.</p>

            ${interested_in_ads ? `
            <div style="background:#FFFBEB;border:2px solid #F59E0B;border-radius:8px;padding:12px 16px;margin:12px 0">
              <p style="margin:0;font-size:14px;font-weight:700;color:#D97706">⭐ This agency is interested in advertising options (Featured Listing, Verified Badge, Category Sponsor)</p>
            </div>
            ` : ''}

            <div style="background:#F0FDF4;border:1px solid #A7F3D0;border-radius:8px;padding:20px;margin:16px 0">
              <h2 style="margin:0 0 4px;font-size:18px;color:#111827">${name.trim()}</h2>
              <p style="margin:0 0 12px;font-size:13px;color:#6B7280">${domain} · ${headquarters.trim()} · ${team_size} people</p>

              <table style="border-collapse:collapse;width:100%;font-size:14px">
                <tr style="border-bottom:1px solid #D1FAE5">
                  <td style="padding:8px 12px 8px 0;color:#6B7280;width:120px">Services</td>
                  <td style="padding:8px 0;color:#111827">${servicesDisplay}</td>
                </tr>
                <tr style="border-bottom:1px solid #D1FAE5">
                  <td style="padding:8px 12px 8px 0;color:#6B7280">Industries</td>
                  <td style="padding:8px 0;color:#111827">${industriesDisplay}</td>
                </tr>
                <tr style="border-bottom:1px solid #D1FAE5">
                  <td style="padding:8px 12px 8px 0;color:#6B7280">Tools</td>
                  <td style="padding:8px 0;color:#111827">${toolsDisplay}</td>
                </tr>
                <tr style="border-bottom:1px solid #D1FAE5">
                  <td style="padding:8px 12px 8px 0;color:#6B7280">Pricing</td>
                  <td style="padding:8px 0;color:#111827">${pricingDisplay}</td>
                </tr>
                <tr style="border-bottom:1px solid #D1FAE5">
                  <td style="padding:8px 12px 8px 0;color:#6B7280">Regions</td>
                  <td style="padding:8px 0;color:#111827">${regionsDisplay}</td>
                </tr>
                <tr style="border-bottom:1px solid #D1FAE5">
                  <td style="padding:8px 12px 8px 0;color:#6B7280">Clients</td>
                  <td style="padding:8px 0;color:#111827">${clientsDisplay}</td>
                </tr>
                <tr style="border-bottom:1px solid #D1FAE5">
                  <td style="padding:8px 12px 8px 0;color:#6B7280">Website</td>
                  <td style="padding:8px 0"><a href="${website_url.trim()}" style="color:#059669">${website_url.trim()}</a></td>
                </tr>
                ${linkedin_url ? `<tr style="border-bottom:1px solid #D1FAE5"><td style="padding:8px 12px 8px 0;color:#6B7280">LinkedIn</td><td style="padding:8px 0"><a href="${linkedin_url}" style="color:#059669">${linkedin_url}</a></td></tr>` : ''}
                ${clutch_url ? `<tr style="border-bottom:1px solid #D1FAE5"><td style="padding:8px 12px 8px 0;color:#6B7280">Clutch</td><td style="padding:8px 0"><a href="${clutch_url}" style="color:#059669">${clutch_url}</a></td></tr>` : ''}
                <tr>
                  <td style="padding:8px 12px 8px 0;color:#6B7280">Contact</td>
                  <td style="padding:8px 0"><a href="mailto:${contact_email}" style="color:#059669">${contact_email}</a></td>
                </tr>
              </table>
            </div>

            <div style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:8px;padding:16px;margin:16px 0">
              <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#92400E;text-transform:uppercase;letter-spacing:0.05em">Short Description</p>
              <p style="margin:0;font-size:14px;color:#374151;line-height:1.5">${short_description.trim()}</p>
            </div>

            ${long_description ? `
            <div style="background:white;border:1px solid #E5E7EB;border-radius:8px;padding:16px;margin:16px 0">
              <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.05em">Detailed Description</p>
              <p style="margin:0;font-size:14px;color:#374151;line-height:1.6;white-space:pre-line">${long_description}</p>
            </div>
            ` : ''}

            <div style="margin:20px 0">
              <a href="https://theaiagentindex.com/admin/reviews" style="display:inline-block;background:#059669;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px">Review in Admin →</a>
              <a href="${website_url.trim()}" style="display:inline-block;background:#F3F4F6;color:#374151;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px;margin-left:8px">Visit Website →</a>
            </div>

            <p style="color:#9CA3AF;font-size:12px;margin-top:16px">— The AI Agent Index</p>
          </div>
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