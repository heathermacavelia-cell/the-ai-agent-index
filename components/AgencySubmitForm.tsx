'use client'
import { useState } from 'react'

const SERVICE_OPTIONS = [
  { value: 'ai-agent-building', label: 'AI Agent Building' },
  { value: 'workflow-automation', label: 'Workflow Automation' },
  { value: 'ai-strategy', label: 'AI Strategy & Consulting' },
  { value: 'chatbot-development', label: 'Chatbot Development' },
  { value: 'custom-integrations', label: 'Custom Integrations' },
  { value: 'voice-agents', label: 'Voice Agents' },
  { value: 'rag-development', label: 'RAG Development' },
  { value: 'data-pipeline', label: 'Data Pipeline & Analytics' },
  { value: 'prompt-engineering', label: 'Prompt Engineering' },
  { value: 'ai-training', label: 'AI Training & Workshops' },
]

const INDUSTRY_OPTIONS = [
  'SaaS', 'Finance', 'Healthcare', 'Ecommerce', 'Real Estate', 'Legal',
  'Manufacturing', 'Professional Services', 'Retail', 'Insurance', 'Education', 'Other',
]

const TEAM_SIZES = ['1 (Solo)', '2-9', '10-49', '50-199', '200+']
const PRICING_MODELS = ['Project-based', 'Retainer', 'Hourly', 'Custom']
const HOURLY_RANGES = ['Under $50/hr', '$50-$99/hr', '$100-$149/hr', '$150-$199/hr', '$200+/hr', 'Not applicable']
const MIN_BUDGETS = ['No minimum', 'Under $5,000', '$5,000-$10,000', '$10,000-$25,000', '$25,000-$50,000', '$50,000+']
const REGIONS = ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East & Africa', 'Global / Remote']
const CLIENT_SEGMENTS = ['Small Business (under $10M)', 'Midmarket ($10M-$1B)', 'Enterprise ($1B+)']

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.625rem 0.875rem', border: '1px solid #D1D5DB',
  borderRadius: '0.5rem', fontSize: '0.9375rem', color: '#111827', outline: 'none',
  boxSizing: 'border-box', fontFamily: 'inherit',
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#111827', marginBottom: '0.375rem',
}

const hintStyle: React.CSSProperties = {
  fontSize: '0.75rem', color: '#9CA3AF', marginTop: '0.25rem',
}

function CheckboxGroup({ options, selected, onChange }: { options: string[]; selected: string[]; onChange: (v: string[]) => void }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
      {options.map(opt => {
        const isSelected = selected.includes(opt)
        return (
          <button key={opt} type="button"
            onClick={() => onChange(isSelected ? selected.filter(s => s !== opt) : [...selected, opt])}
            style={{
              padding: '0.375rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.8125rem',
              fontWeight: 500, cursor: 'pointer', border: '1px solid', transition: 'all 0.15s',
              backgroundColor: isSelected ? '#059669' : 'white',
              color: isSelected ? 'white' : '#374151',
              borderColor: isSelected ? '#059669' : '#D1D5DB',
            }}>
            {isSelected && '✓ '}{opt}
          </button>
        )
      })}
    </div>
  )
}

function ServiceCheckboxGroup({ selected, onChange }: { selected: string[]; onChange: (v: string[]) => void }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
      {SERVICE_OPTIONS.map(opt => {
        const isSelected = selected.includes(opt.value)
        return (
          <button key={opt.value} type="button"
            onClick={() => onChange(isSelected ? selected.filter(s => s !== opt.value) : [...selected, opt.value])}
            style={{
              padding: '0.375rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.8125rem',
              fontWeight: 500, cursor: 'pointer', border: '1px solid', transition: 'all 0.15s',
              backgroundColor: isSelected ? '#059669' : 'white',
              color: isSelected ? 'white' : '#374151',
              borderColor: isSelected ? '#059669' : '#D1D5DB',
            }}>
            {isSelected && '✓ '}{opt.label}
          </button>
        )
      })}
    </div>
  )
}

export default function AgencySubmitForm() {
  const [name, setName] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [longDescription, setLongDescription] = useState('')
  const [headquarters, setHeadquarters] = useState('')
  const [teamSize, setTeamSize] = useState('')
  const [services, setServices] = useState<string[]>([])
  const [industries, setIndustries] = useState<string[]>([])
  const [tools, setTools] = useState('')
  const [regions, setRegions] = useState<string[]>([])
  const [clientSegments, setClientSegments] = useState<string[]>([])
  const [pricingModel, setPricingModel] = useState('')
  const [hourlyRange, setHourlyRange] = useState('')
  const [minBudget, setMinBudget] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [clutchUrl, setClutchUrl] = useState('')
  const [interestedInAds, setInterestedInAds] = useState(false)

  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const charCount = shortDescription.length

  async function handleSubmit() {
    if (!name.trim()) { setError('Agency name is required'); return }
    if (!websiteUrl.trim()) { setError('Website URL is required'); return }
    if (!contactEmail.trim() || !contactEmail.includes('@')) { setError('Valid contact email is required'); return }
    if (!shortDescription.trim() || shortDescription.length < 120 || shortDescription.length > 220) { setError('Short description must be 120-220 characters'); return }
    if (!headquarters.trim()) { setError('Headquarters location is required'); return }
    if (!teamSize) { setError('Team size is required'); return }
    if (services.length === 0) { setError('Select at least one service'); return }

    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/submit-agency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          website_url: websiteUrl.trim(),
          contact_email: contactEmail.trim().toLowerCase(),
          short_description: shortDescription.trim(),
          long_description: longDescription.trim() || null,
          headquarters: headquarters.trim(),
          team_size: teamSize,
          service_tags: services,
          industry_tags: industries,
          tool_specializations: tools.split(',').map(t => t.trim().toLowerCase().replace(/\s+/g, '-')).filter(Boolean),
          regions_served: regions,
          client_segments: clientSegments,
          pricing_model: pricingModel || null,
          hourly_rate_range: hourlyRange || null,
          minimum_project_budget: minBudget || null,
          linkedin_url: linkedinUrl.trim() || null,
          logo_url: logoUrl.trim() || null,
          clutch_url: clutchUrl.trim() || null,
          interested_in_ads: interestedInAds,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Submission failed. Please try again.')
        return
      }
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1.5rem', backgroundColor: '#F0FDF4', borderRadius: '0.75rem', border: '1px solid #A7F3D0' }}>
        <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#059669', marginBottom: '0.5rem' }}>Submission received!</p>
        <p style={{ fontSize: '1rem', color: '#065F46', lineHeight: 1.6, marginBottom: '1rem' }}>
          We will review your agency listing and reach out if we need any additional details. Listings are typically reviewed within 48 hours.
        </p>
        {interestedInAds && (
          <p style={{ fontSize: '0.875rem', color: '#065F46' }}>
            We noted your interest in advertising options and will include that in our follow-up.
          </p>
        )}
        <a href="/ai-automation-agencies" style={{ display: 'inline-block', marginTop: '1rem', color: '#059669', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
          ← Browse AI Automation Agencies
        </a>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Section: Company basics */}
      <div style={{ borderBottom: '1px solid #F3F4F6', paddingBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>Company Details</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Agency name <span style={{ color: '#EF4444' }}>*</span></label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Taycon AI" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Website URL <span style={{ color: '#EF4444' }}>*</span></label>
              <input value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)} placeholder="https://..." style={inputStyle} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Contact email <span style={{ color: '#EF4444' }}>*</span></label>
              <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder="you@company.com" style={inputStyle} />
              <p style={hintStyle}>For listing management only. Not displayed publicly.</p>
            </div>
            <div>
              <label style={labelStyle}>Headquarters <span style={{ color: '#EF4444' }}>*</span></label>
              <input value={headquarters} onChange={e => setHeadquarters(e.target.value)} placeholder="e.g. Vancouver, BC, Canada" style={inputStyle} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Team size <span style={{ color: '#EF4444' }}>*</span></label>
              <select value={teamSize} onChange={e => setTeamSize(e.target.value)} style={inputStyle}>
                <option value="">Select...</option>
                {TEAM_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Logo URL</label>
              <input value={logoUrl} onChange={e => setLogoUrl(e.target.value)} placeholder="https://yoursite.com/logo.png" style={inputStyle} />
              <p style={hintStyle}>Direct link. PNG or SVG, square preferred.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section: Description */}
      <div style={{ borderBottom: '1px solid #F3F4F6', paddingBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>Description</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Short description <span style={{ color: '#EF4444' }}>*</span></label>
            <textarea value={shortDescription} onChange={e => setShortDescription(e.target.value)} rows={2}
              placeholder="One to two sentences describing what your agency does and who you serve."
              style={{ ...inputStyle, resize: 'vertical' }} />
            <p style={{ ...hintStyle, color: charCount < 120 || charCount > 220 ? '#EF4444' : '#9CA3AF' }}>
              {charCount}/220 characters (minimum 120)
            </p>
          </div>
          <div>
            <label style={labelStyle}>Detailed description</label>
            <textarea value={longDescription} onChange={e => setLongDescription(e.target.value)} rows={5}
              placeholder="Tell potential clients about your approach, notable projects, tech stack, and what makes you different. Specific examples of past work are more useful than general claims."
              style={{ ...inputStyle, resize: 'vertical' }} />
            <p style={hintStyle}>Include specific deployment examples and measurable outcomes where possible.</p>
          </div>
        </div>
      </div>

      {/* Section: Services & expertise */}
      <div style={{ borderBottom: '1px solid #F3F4F6', paddingBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>Services &amp; Expertise</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={labelStyle}>Services offered <span style={{ color: '#EF4444' }}>*</span></label>
            <ServiceCheckboxGroup selected={services} onChange={setServices} />
          </div>
          <div>
            <label style={labelStyle}>Industries served</label>
            <CheckboxGroup options={INDUSTRY_OPTIONS} selected={industries} onChange={setIndustries} />
          </div>
          <div>
            <label style={labelStyle}>Tools and platforms</label>
            <input value={tools} onChange={e => setTools(e.target.value)}
              placeholder="e.g. OpenAI, Anthropic, LangChain, Make, n8n, Zapier, HubSpot"
              style={inputStyle} />
            <p style={hintStyle}>Comma-separated. Include LLM providers, frameworks, and integration platforms you work with.</p>
          </div>
        </div>
      </div>

      {/* Section: Clients & regions */}
      <div style={{ borderBottom: '1px solid #F3F4F6', paddingBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>Clients &amp; Regions</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={labelStyle}>Regions served</label>
            <CheckboxGroup options={REGIONS} selected={regions} onChange={setRegions} />
          </div>
          <div>
            <label style={labelStyle}>Typical client size</label>
            <CheckboxGroup options={CLIENT_SEGMENTS} selected={clientSegments} onChange={setClientSegments} />
          </div>
        </div>
      </div>

      {/* Section: Pricing */}
      <div style={{ borderBottom: '1px solid #F3F4F6', paddingBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>Pricing</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Pricing model</label>
            <select value={pricingModel} onChange={e => setPricingModel(e.target.value)} style={inputStyle}>
              <option value="">Select...</option>
              {PRICING_MODELS.map(p => <option key={p} value={p.toLowerCase()}>{p}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Hourly rate range</label>
            <select value={hourlyRange} onChange={e => setHourlyRange(e.target.value)} style={inputStyle}>
              <option value="">Select...</option>
              {HOURLY_RANGES.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Minimum project budget</label>
            <select value={minBudget} onChange={e => setMinBudget(e.target.value)} style={inputStyle}>
              <option value="">Select...</option>
              {MIN_BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Section: Links */}
      <div style={{ borderBottom: '1px solid #F3F4F6', paddingBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>External Profiles</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>LinkedIn URL</label>
            <input value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/company/..." style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Clutch profile URL</label>
            <input value={clutchUrl} onChange={e => setClutchUrl(e.target.value)} placeholder="https://clutch.co/profile/..." style={inputStyle} />
          </div>
        </div>
      </div>

      {/* Vendor Managed upgrade */}
      <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '0.75rem', padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.625rem' }}>
          <span style={{ fontSize: '0.625rem', fontWeight: 700, backgroundColor: '#2563EB', color: 'white', padding: '0.15rem 0.5rem', borderRadius: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>$9.99/mo</span>
          <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#1E40AF' }}>Vendor Managed</span>
        </div>
        <p style={{ fontSize: '0.8125rem', color: '#1E3A5F', lineHeight: 1.6, margin: '0 0 0.5rem' }}>
          Priority verification every 14 days, placement on our agencies page, a one-time feature in our newsletter, and your own marketing hook. Self-serve signup after your listing is approved.
        </p>
        <a href="/advertise#tiers" target="_blank" rel="noopener noreferrer"
          style={{ fontSize: '0.8125rem', color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}>
          Learn more about Vendor Managed →
        </a>
      </div>

      {/* Advertising interest */}
      <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '0.75rem', padding: '1.25rem' }}>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={interestedInAds} onChange={e => setInterestedInAds(e.target.checked)}
            style={{ marginTop: '0.25rem', width: '1.125rem', height: '1.125rem', accentColor: '#D97706', cursor: 'pointer' }} />
          <div>
            <p style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#92400E', margin: '0 0 0.25rem' }}>
              I am interested in premium advertising options
            </p>
            <p style={{ fontSize: '0.8125rem', color: '#A16207', lineHeight: 1.5, margin: 0 }}>
              Featured listings ($79/mo), category sponsorships, comparison placements, and more. Check this box and we will follow up with details.
            </p>
          </div>
        </label>
      </div>

      {/* Submit */}
      {error && <p style={{ color: '#EF4444', fontSize: '0.875rem' }}>{error}</p>}

      <button onClick={handleSubmit} disabled={submitting}
        style={{
          width: '100%', padding: '0.875rem', backgroundColor: '#059669', color: 'white',
          borderRadius: '0.5rem', fontSize: '1rem', fontWeight: 700, border: 'none',
          cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1,
          transition: 'background 0.15s',
        }}>
        {submitting ? 'Submitting...' : 'Submit Agency for Review →'}
      </button>

      <p style={{ fontSize: '0.75rem', color: '#9CA3AF', textAlign: 'center' }}>
        Submissions are reviewed before publishing. We may reach out for additional details.
      </p>
    </div>
  )
}