'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

const PRICING_MODELS = ['free', 'freemium', 'subscription', 'usage-based', 'custom']
const CUSTOMER_SEGMENTS = ['b2c', 'smb', 'b2b', 'enterprise']
const DEPLOYMENT_DIFFICULTY = ['easy', 'moderate', 'complex']
const DEPLOYMENT_METHODS = ['cloud', 'self-hosted', 'api', 'no-code', 'browser-extension']
const CAPABILITY_TAGS = ['lead-generation', 'outbound-automation', 'ticket-resolution', 'market-research', 'content-creation', 'code-generation', 'data-analysis', 'scheduling', 'reporting', 'email-optimisation', 'seo', 'web-search', 'citations', 'deep-research', 'multilingual', 'autonomous', 'no-code', 'workflow-builder', 'crm-sync', 'intent-detection', 'personalisation', 'forecasting', 'pipeline-management', 'conversation-intelligence', 'ecommerce-support', 'order-management', 'literature-review', 'systematic-review', 'paid-media', 'bid-optimisation', 'brand-voice', 'campaign-automation', 'ide', 'multi-file-editing', 'autocomplete', 'agentic-coding', 'terminal-agent', 'git-native', 'open-source', 'byok']
const INDUSTRY_TAGS = ['saas', 'ecommerce', 'real-estate', 'legal', 'finance', 'healthcare', 'insurance', 'b2b', 'enterprise', 'smb', 'startups', 'devtools', 'pharma', 'retail', 'dtc', 'agencies', 'open-source', 'cloud', 'aws', 'career', 'hr', 'recruiting']
const SECURITY_CERTS = ['SOC 2 Type I', 'SOC 2 Type II', 'GDPR', 'HIPAA', 'ISO 27001', 'CCPA']
const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Portuguese', 'Italian', 'Dutch', 'Japanese', 'Chinese', 'Korean', 'Arabic']
const INTEGRATIONS = ['HubSpot', 'Salesforce', 'Zapier', 'Slack', 'Gmail', 'Outlook', 'LinkedIn', 'Notion', 'Airtable', 'Google Sheets', 'Microsoft Teams', 'Zoom', 'GitHub', 'Jira', 'Stripe', 'Shopify', 'Intercom', 'Zendesk']

function MultiSelect({ label, options, value, onChange }: { label: string, options: string[], value: string[], onChange: (v: string[]) => void }) {
  const toggle = (opt: string) => {
    onChange(value.includes(opt) ? value.filter(v => v !== opt) : [...value, opt])
  }
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', color: '#374151', marginBottom: '0.5rem' }}>{label}</label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
        {options.map(opt => (
          <button key={opt} onClick={() => toggle(opt)} type="button"
            style={{ padding: '0.25rem 0.625rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 500, border: '1px solid', cursor: 'pointer',
              backgroundColor: value.includes(opt) ? '#2563EB' : 'white',
              color: value.includes(opt) ? 'white' : '#374151',
              borderColor: value.includes(opt) ? '#2563EB' : '#D1D5DB' }}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function VendorDashboard({ params }: { params: { slug: string } }) {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const [agent, setAgent] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [vendorNotes, setVendorNotes] = useState('')

  // Immediate fields
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [longDescription, setLongDescription] = useState('')
  const [pricingUrl, setPricingUrl] = useState('')

  // Approval fields
  const [name, setName] = useState('')
  const [pricingModel, setPricingModel] = useState('')
  const [startingPrice, setStartingPrice] = useState('')
  const [customerSegment, setCustomerSegment] = useState('')
  const [deploymentDifficulty, setDeploymentDifficulty] = useState('')
  const [deploymentMethod, setDeploymentMethod] = useState<string[]>([])
  const [integrations, setIntegrations] = useState<string[]>([])
  const [capabilityTags, setCapabilityTags] = useState<string[]>([])
  const [industryTags, setIndustryTags] = useState<string[]>([])
  const [supportedLanguages, setSupportedLanguages] = useState<string[]>([])
  const [securityCerts, setSecurityCerts] = useState<string[]>([])

  useEffect(() => {
    if (!token) { setError('Invalid access link.'); setLoading(false); return }
    fetch('/api/agents?slug=' + params.slug)
      .then(r => r.json())
      .then((data: unknown) => {
        const agents = data as Record<string, unknown>[]
        const found = agents?.find((a) => a.slug === params.slug) ?? null
        if (!found) { setError('Agent not found.'); setLoading(false); return }
        setAgent(found)
        setWebsiteUrl((found.website_url as string) ?? '')
        setLogoUrl((found.logo_url as string) ?? '')
        setShortDescription((found.short_description as string) ?? '')
        setLongDescription((found.long_description as string) ?? '')
        setPricingUrl((found.pricing_url as string) ?? '')
        setName((found.name as string) ?? '')
        setPricingModel((found.pricing_model as string) ?? '')
        setStartingPrice(found.starting_price != null ? String(found.starting_price) : '')
        setCustomerSegment((found.customer_segment as string) ?? '')
        setDeploymentDifficulty((found.deployment_difficulty as string) ?? '')
        setDeploymentMethod((found.deployment_method as string[]) ?? [])
        setIntegrations((found.integrations as string[]) ?? [])
        setCapabilityTags((found.capability_tags as string[]) ?? [])
        setIndustryTags((found.industry_tags as string[]) ?? [])
        setSupportedLanguages((found.supported_languages as string[]) ?? [])
        setSecurityCerts((found.security_certifications as string[]) ?? [])
        setLoading(false)
      })
      .catch(() => { setError('Failed to load agent data.'); setLoading(false) })
  }, [params.slug, token])

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/vendor/submit-edits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_slug: params.slug,
          token,
          vendor_notes: vendorNotes,
          website_url: websiteUrl,
          logo_url: logoUrl,
          short_description: shortDescription,
          long_description: longDescription,
          pricing_url: pricingUrl,
          name,
          pricing_model: pricingModel,
          starting_price: startingPrice ? parseFloat(startingPrice) : null,
          customer_segment: customerSegment,
          deployment_difficulty: deploymentDifficulty,
          deployment_method: deploymentMethod,
          integrations,
          capability_tags: capabilityTags,
          industry_tags: industryTags,
          supported_languages: supportedLanguages,
          security_certifications: securityCerts,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSaved(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div style={{ maxWidth: '780px', margin: '4rem auto', padding: '0 1.5rem', textAlign: 'center', color: '#6B7280' }}>Loading your dashboard...</div>
  if (error && !agent) return <div style={{ maxWidth: '780px', margin: '4rem auto', padding: '0 1.5rem', textAlign: 'center', color: '#EF4444' }}>{error}</div>

  if (saved) return (
    <div style={{ maxWidth: '780px', margin: '4rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
      <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>✅</div>
      <h1 style={{ fontWeight: 700, fontSize: '1.25rem', color: '#111827', marginBottom: '0.5rem' }}>Changes submitted</h1>
      <p style={{ color: '#6B7280', fontSize: '0.9375rem', lineHeight: 1.6 }}>
        Basic details have been updated immediately. Any changes requiring review have been sent to our team — we will notify you by email once reviewed.
      </p>
      <a href={'/agents/' + params.slug} style={{ display: 'inline-block', marginTop: '1.5rem', padding: '0.625rem 1.25rem', backgroundColor: '#2563EB', color: 'white', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}>View your listing →</a>
    </div>
  )

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.375rem' }}>Vendor Dashboard</p>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>{String(agent?.name ?? '')}</h1>
        <a href={'/agents/' + params.slug} style={{ fontSize: '0.875rem', color: '#2563EB' }}>View public listing →</a>
      </div>

      <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '0.75rem', padding: '1rem 1.25rem', marginBottom: '2rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#0369A1', margin: 0 }}>
          <strong>Basic details</strong> (description, website, logo) update immediately. <strong>Structural fields</strong> (pricing, tags, integrations) are reviewed by our team before going live to maintain data integrity.
        </p>
      </div>

      <div style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.875rem', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#111827', marginBottom: '1.25rem' }}>Basic details <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#16A34A', backgroundColor: '#DCFCE7', padding: '0.15rem 0.5rem', borderRadius: '9999px', marginLeft: '0.5rem' }}>Updates immediately</span></h2>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', color: '#374151', marginBottom: '0.375rem' }}>Agent name</label>
          <input value={name} onChange={e => setName(e.target.value)}
            style={{ width: '100%', padding: '0.625rem 0.875rem', border: '1px solid #D1D5DB', borderRadius: '0.5rem', fontSize: '0.875rem', boxSizing: 'border-box' as const }} />
          <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '0.25rem' }}>Name changes require review before going live.</p>
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', color: '#374151', marginBottom: '0.375rem' }}>Website URL</label>
          <input value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)}
            style={{ width: '100%', padding: '0.625rem 0.875rem', border: '1px solid #D1D5DB', borderRadius: '0.5rem', fontSize: '0.875rem', boxSizing: 'border-box' as const }} />
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', color: '#374151', marginBottom: '0.375rem' }}>Logo URL</label>
          <input value={logoUrl} onChange={e => setLogoUrl(e.target.value)}
            style={{ width: '100%', padding: '0.625rem 0.875rem', border: '1px solid #D1D5DB', borderRadius: '0.5rem', fontSize: '0.875rem', boxSizing: 'border-box' as const }} />
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', color: '#374151', marginBottom: '0.375rem' }}>Short description <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(max 160 chars)</span></label>
          <textarea value={shortDescription} onChange={e => setShortDescription(e.target.value)} maxLength={160} rows={3}
            style={{ width: '100%', padding: '0.625rem 0.875rem', border: '1px solid #D1D5DB', borderRadius: '0.5rem', fontSize: '0.875rem', boxSizing: 'border-box' as const, resize: 'vertical' as const }} />
          <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '0.25rem' }}>{shortDescription.length}/160</p>
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', color: '#374151', marginBottom: '0.375rem' }}>Long description</label>
          <textarea value={longDescription} onChange={e => setLongDescription(e.target.value)} rows={5}
            style={{ width: '100%', padding: '0.625rem 0.875rem', border: '1px solid #D1D5DB', borderRadius: '0.5rem', fontSize: '0.875rem', boxSizing: 'border-box' as const, resize: 'vertical' as const }} />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', color: '#374151', marginBottom: '0.375rem' }}>Pricing page URL</label>
          <input value={pricingUrl} onChange={e => setPricingUrl(e.target.value)}
            style={{ width: '100%', padding: '0.625rem 0.875rem', border: '1px solid #D1D5DB', borderRadius: '0.5rem', fontSize: '0.875rem', boxSizing: 'border-box' as const }} />
        </div>
      </div>

      <div style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.875rem', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#111827', marginBottom: '1.25rem' }}>Structural fields <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#D97706', backgroundColor: '#FEF3C7', padding: '0.15rem 0.5rem', borderRadius: '9999px', marginLeft: '0.5rem' }}>Requires review</span></h2>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', color: '#374151', marginBottom: '0.375rem' }}>Pricing model</label>
          <select value={pricingModel} onChange={e => setPricingModel(e.target.value)}
            style={{ width: '100%', padding: '0.625rem 0.875rem', border: '1px solid #D1D5DB', borderRadius: '0.5rem', fontSize: '0.875rem', backgroundColor: 'white' }}>
            <option value="">Select...</option>
            {PRICING_MODELS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', color: '#374151', marginBottom: '0.375rem' }}>Starting price (USD/month)</label>
          <input type="number" value={startingPrice} onChange={e => setStartingPrice(e.target.value)} placeholder="0"
            style={{ width: '100%', padding: '0.625rem 0.875rem', border: '1px solid #D1D5DB', borderRadius: '0.5rem', fontSize: '0.875rem', boxSizing: 'border-box' as const }} />
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', color: '#374151', marginBottom: '0.375rem' }}>Primary customer segment</label>
          <select value={customerSegment} onChange={e => setCustomerSegment(e.target.value)}
            style={{ width: '100%', padding: '0.625rem 0.875rem', border: '1px solid #D1D5DB', borderRadius: '0.5rem', fontSize: '0.875rem', backgroundColor: 'white' }}>
            <option value="">Select...</option>
            {CUSTOMER_SEGMENTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', color: '#374151', marginBottom: '0.375rem' }}>Deployment difficulty</label>
          <select value={deploymentDifficulty} onChange={e => setDeploymentDifficulty(e.target.value)}
            style={{ width: '100%', padding: '0.625rem 0.875rem', border: '1px solid #D1D5DB', borderRadius: '0.5rem', fontSize: '0.875rem', backgroundColor: 'white' }}>
            <option value="">Select...</option>
            {DEPLOYMENT_DIFFICULTY.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <MultiSelect label="Deployment methods" options={DEPLOYMENT_METHODS} value={deploymentMethod} onChange={setDeploymentMethod} />
        <MultiSelect label="Integrations" options={INTEGRATIONS} value={integrations} onChange={setIntegrations} />
        <MultiSelect label="Capability tags" options={CAPABILITY_TAGS} value={capabilityTags} onChange={setCapabilityTags} />
        <MultiSelect label="Industry tags" options={INDUSTRY_TAGS} value={industryTags} onChange={setIndustryTags} />
        <MultiSelect label="Supported languages" options={LANGUAGES} value={supportedLanguages} onChange={setSupportedLanguages} />
        <MultiSelect label="Security certifications" options={SECURITY_CERTS} value={securityCerts} onChange={setSecurityCerts} />
      </div>

      <div style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.875rem', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#111827', marginBottom: '0.5rem' }}>Notes for our team</h2>
        <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.75rem' }}>Optional — add context about your changes to help us review faster.</p>
        <textarea value={vendorNotes} onChange={e => setVendorNotes(e.target.value)} rows={4} placeholder="e.g. We updated our pricing in January 2026..."
          style={{ width: '100%', padding: '0.625rem 0.875rem', border: '1px solid #D1D5DB', borderRadius: '0.5rem', fontSize: '0.875rem', boxSizing: 'border-box' as const, resize: 'vertical' as const }} />
      </div>

      {error && <p style={{ color: '#EF4444', fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</p>}

      <button onClick={handleSave} disabled={saving}
        style={{ width: '100%', padding: '0.875rem', backgroundColor: saving ? '#93C5FD' : '#2563EB', color: 'white', border: 'none', borderRadius: '0.75rem', fontSize: '1rem', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer' }}>
        {saving ? 'Submitting changes...' : 'Submit changes'}
      </button>
      <p style={{ fontSize: '0.75rem', color: '#9CA3AF', textAlign: 'center', marginTop: '0.75rem' }}>
        Basic details go live immediately. Structural changes are reviewed within 1-2 business days.
      </p>
    </div>
  )
}
