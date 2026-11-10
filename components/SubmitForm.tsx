'use client'
import { useEffect, useRef, useState } from 'react'
import { TIERS, getTier, type TierId } from '@/lib/vendorPlans'
import { CUSTOMER_SEGMENT_OPTIONS } from '@/lib/taxonomy'

const CATEGORIES = [
  { value: 'ai-sales-agents', label: 'AI Sales Agents' },
  { value: 'ai-customer-support-agents', label: 'AI Customer Support Agents' },
  { value: 'ai-research-agents', label: 'AI Research Agents' },
  { value: 'ai-marketing-agents', label: 'AI Marketing Agents' },
  { value: 'ai-coding-agents', label: 'AI Coding Agents' },
  { value: 'ai-hr-agents', label: 'AI HR Agents' },
  { value: 'ai-workflow-agents', label: 'AI Workflow Agents' },
  { value: 'ai-customer-success-agents', label: 'AI Customer Success Agents' },
]

const PRICING_MODELS = ['free', 'freemium', 'subscription', 'usage-based', 'custom']

const MCP_OPTIONS = [
  { value: '', label: 'Select...' },
  { value: 'none', label: 'No MCP support' },
  { value: 'client', label: 'MCP client (connects out to MCP servers)' },
  { value: 'server', label: 'MCP server (external agents connect into us)' },
  { value: 'both', label: 'Both server and client' },
  { value: 'not-sure', label: 'Not sure' },
]

const inputStyle = {
  width: '100%',
  padding: '0.625rem 0.875rem',
  border: '1px solid #E5E7EB',
  borderRadius: '0.5rem',
  fontSize: '0.9375rem',
  outline: 'none',
  boxSizing: 'border-box' as const,
  backgroundColor: 'white',
  color: '#111827',
}

const labelStyle = {
  display: 'block' as const,
  fontSize: '0.875rem',
  fontWeight: 600,
  color: '#374151',
  marginBottom: '0.375rem',
}

const fieldNote = {
  fontSize: '0.75rem',
  color: '#9CA3AF',
  marginTop: '0.25rem',
}

function isValidUrl(value: string): boolean {
  try {
    const u = new URL(value)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

// Mirrors waitLabel in lib/freeQueue.ts (that file is server-only).
function waitText(weeks: number) {
  return weeks === 1 ? 'about 1 week' : 'about ' + weeks + ' weeks'
}

export default function SubmitForm({ freeWaitWeeks = null }: { freeWaitWeeks?: number | null }) {
  const [form, setForm] = useState({
    name: '', developer: '', website_url: '', pricing_url: '', logo_url: '',
    short_description: '', primary_category: '',
    pricing_model: '', starting_price: '', customer_segment: '',
    mcp_claim: '', mcp_docs_url: '', notes: '',
    submitter_email: '',
  })
  const [selectedTier, setSelectedTier] = useState<TierId>('managed')
  const [interestedInAds, setInterestedInAds] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [waitWeeks, setWaitWeeks] = useState<number | null>(null)
  const [error, setError] = useState('')
  // After submit the long form is replaced by a short screen. Without this the
  // browser stays at the old scroll position, past the end of the new screen, so
  // a paying vendor landed at the page footer and never saw the payment step
  // (Heather 2026-11-01). Bring the payment step to the top of the view.
  const doneRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (submitted) doneRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [submitted])

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const descLen = form.short_description.trim().length
  const chosen = getTier(selectedTier)
  const isPaid = selectedTier !== 'self'

  async function handleSubmit() {
    setError('')
    if (!form.name.trim()) { setError('Agent name is required.'); return }
    if (!form.developer.trim()) { setError('Developer / company name is required.'); return }
    if (!form.website_url.trim() || !isValidUrl(form.website_url.trim())) { setError('A valid website URL is required (starting with https://).'); return }
    if (form.pricing_url.trim() && !isValidUrl(form.pricing_url.trim())) { setError('Pricing page URL must be a valid link (starting with https://).'); return }
    if (form.logo_url.trim() && !isValidUrl(form.logo_url.trim())) { setError('Logo URL must be a valid link (starting with https://).'); return }
    if (descLen < 120 || descLen > 220) { setError('Description must be between 120 and 220 characters (currently ' + descLen + ').'); return }
    if (!form.primary_category) { setError('Please select a category.'); return }
    if (!form.pricing_model) { setError('Please select a pricing model.'); return }
    if (!form.customer_segment) { setError('Please select a customer segment.'); return }
    if (form.mcp_claim === 'server' || form.mcp_claim === 'both') {
      if (!form.mcp_docs_url.trim() || !isValidUrl(form.mcp_docs_url.trim())) {
        setError('MCP server claims require a link to your official MCP documentation.'); return
      }
    }
    if (!form.submitter_email || !form.submitter_email.includes('@')) { setError('A valid contact email is required.'); return }

    setSubmitting(true)
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, short_description: form.short_description.trim(), interested_in_ads: interestedInAds, selected_tier: selectedTier }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Submission failed')
      setWaitWeeks(typeof data.waitWeeks === 'number' ? data.waitWeeks : null)
      setSubmitted(true)
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted && isPaid) return (
    <div ref={doneRef} style={{ scrollMarginTop: '6rem', backgroundColor: 'white', border: '2px solid #2563EB', borderRadius: '0.875rem', padding: '2rem' }}>
      <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.5rem' }}>Step 2 of 2: Payment</p>
      <h2 style={{ fontWeight: 800, fontSize: '1.5rem', color: '#111827', margin: '0 0 0.5rem', letterSpacing: '-0.01em' }}>
        Pay {chosen.price} to start your {chosen.name}
      </h2>
      <p style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.6, margin: '0 0 1.25rem' }}>
        Your details for <strong>{form.name.trim()}</strong> are saved. Your {chosen.timeline} clock starts once payment clears.
      </p>
      {chosen.checkout ? (
        <>
          <a href={chosen.checkout} target="_blank" rel="noopener noreferrer"
            style={{ display: 'block', textAlign: 'center', fontSize: '1.0625rem', color: 'white', backgroundColor: '#2563EB', fontWeight: 700, textDecoration: 'none', padding: '1rem 1.25rem', borderRadius: '0.625rem' }}>
            Pay {chosen.price} securely with Stripe &rarr;
          </a>
          <p style={{ fontSize: '0.8125rem', color: '#4B5563', lineHeight: 1.6, margin: '0.75rem 0 0' }}>
            Stripe&apos;s secure checkout opens in a new tab. When it asks for your agent name or listing URL, enter <strong>{form.name.trim()}</strong> so we can match your payment to this submission.
          </p>
        </>
      ) : (
        <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.6, margin: 0 }}>
          We will email you a secure payment link within one business day. Nothing is owed until then, and your submission is already safely with us either way.
        </p>
      )}
      <p style={{ fontSize: '0.75rem', color: '#64748B', lineHeight: 1.5, margin: '1rem 0 0', paddingTop: '1rem', borderTop: '1px solid #E5E7EB' }}>
        {selectedTier === 'review'
          ? 'Paid up front and refunded in full, automatically, if your agent does not qualify for the index. Once your listing is live the payment is final.'
          : 'Cancel anytime. If your agent does not qualify for the index we refund your first payment in full and cancel the subscription.'}
        {' '}Our editorial team independently researches your agent and writes the listing, and we email you when it goes live.
      </p>
      {interestedInAds && (
        <p style={{ fontSize: '0.8125rem', color: '#065F46', margin: '0.75rem 0 0' }}>
          We noted your interest in advertising options and will include that in our follow-up.
        </p>
      )}
    </div>
  )

  if (submitted) return (
    <div ref={doneRef} style={{ scrollMarginTop: '6rem', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '0.875rem', padding: '2.5rem', textAlign: 'center' }}>
      <h2 style={{ fontWeight: 700, fontSize: '1.125rem', color: '#111827', marginBottom: '0.5rem' }}>Submission received!</h2>
      <p style={{ fontSize: '0.875rem', color: '#6B7280', lineHeight: 1.6 }}>
        Our editorial team will independently research your agent and write the listing. If it qualifies, you&apos;ll get an email when it goes live with a link to claim your listing and access vendor options.
      </p>

      {(
        <div style={{ textAlign: 'left', marginTop: '1.25rem' }}>
          <div style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.125rem 1.25rem' }}>
            <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', margin: '0 0 0.25rem' }}>
              {waitWeeks
                ? <>Estimated to go live in <strong style={{ fontSize: '1.125rem', fontWeight: 800 }}>{waitText(waitWeeks)}</strong></>
                : 'Your free listing is in our queue'}
            </p>
            <p style={{ fontSize: '0.8125rem', color: '#6B7280', lineHeight: 1.6, margin: 0 }}>
              We publish free listings in weekly batches, oldest first, and email you when yours is live. This is an estimate, not a promise, and it is often sooner.
            </p>
          </div>
          <div style={{ backgroundColor: '#0B1220', borderRadius: '0.75rem', padding: '1.25rem', marginTop: '0.875rem', color: 'white' }}>
            <p style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.375rem' }}>Want to skip the queue, and stay current?</p>
            <p style={{ fontSize: '0.8125rem', color: '#D1D5DB', lineHeight: 1.6, margin: '0 0 0.875rem' }}>
              Your details are saved. A Featured Listing is {getTier('managed').price} {getTier('managed').cadence}: your listing goes live within {getTier('managed').timeline}, fully audited, then re-audited every 14 days so what buyers and AI assistants read about you stays current. Use the same agent name at checkout so we can match it to this submission.
            </p>
            <a href={getTier('managed').checkout} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-block', fontSize: '0.875rem', color: 'white', backgroundColor: '#2563EB', fontWeight: 700, textDecoration: 'none', padding: '0.625rem 1.125rem', borderRadius: '0.5rem' }}>
              Get Featured for {getTier('managed').price} {getTier('managed').cadence} &rarr;
            </a>
            <p style={{ fontSize: '0.75rem', color: '#9CA3AF', lineHeight: 1.5, margin: '0.75rem 0 0' }}>
              Or a one-time <a href={getTier('review').checkout} target="_blank" rel="noopener noreferrer" style={{ color: '#93C5FD' }}>Editorial Review for {getTier('review').price}</a>, live within {getTier('review').timeline}. Both are refunded in full if your agent does not qualify. Happy to wait? You do not need to do anything.
            </p>
          </div>
        </div>
      )}

      {interestedInAds && (
        <p style={{ fontSize: '0.8125rem', color: '#065F46', marginTop: '0.75rem' }}>
          We noted your interest in advertising options and will include that in our follow-up.
        </p>
      )}
    </div>
  )

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: '1px solid #E5E7EB', padding: '2rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Agent name <span style={{ color: '#EF4444' }}>*</span></label>
            <input type="text" value={form.name} onChange={e => update('name', e.target.value)}
              placeholder="e.g. GitHub Copilot" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Developer / company <span style={{ color: '#EF4444' }}>*</span></label>
            <input type="text" value={form.developer} onChange={e => update('developer', e.target.value)}
              placeholder="e.g. GitHub" style={inputStyle} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Website URL <span style={{ color: '#EF4444' }}>*</span></label>
            <input type="url" value={form.website_url} onChange={e => update('website_url', e.target.value)}
              placeholder="https://..." style={inputStyle} />
            <p style={fieldNote}>Your product homepage.</p>
          </div>
          <div>
          <label style={labelStyle}>Public pricing page</label>
            <input type="url" value={form.pricing_url} onChange={e => update('pricing_url', e.target.value)}
              placeholder="https://yoursite.com/pricing" style={inputStyle} />
            <p style={fieldNote}>If you have one. Public pricing improves your pricing transparency score. Leave blank for quote-only or custom pricing.</p>
          </div>
        </div>

        <div>
          <label style={labelStyle}>Logo URL</label>
          <input type="url" value={form.logo_url} onChange={e => update('logo_url', e.target.value)}
            placeholder="https://yoursite.com/logo.png" style={inputStyle} />
          <p style={fieldNote}>Direct link to your logo. PNG or SVG, square preferred.</p>
        </div>

        <div>
          <label style={labelStyle}>What does your agent do? <span style={{ color: '#EF4444' }}>*</span></label>
          <textarea value={form.short_description} onChange={e => update('short_description', e.target.value)}
            placeholder="What it does, who it is for, and what makes it different. 120 to 220 characters."
            rows={3} maxLength={220}
            style={{ ...inputStyle, resize: 'none', fontFamily: 'inherit' }} />
          <p style={{ ...fieldNote, color: descLen >= 120 && descLen <= 220 ? '#059669' : '#9CA3AF' }}>
            {descLen}/220 characters (minimum 120). Note: our editorial team independently researches and writes every listing. Your answers here guide that research.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Category <span style={{ color: '#EF4444' }}>*</span></label>
            <select value={form.primary_category} onChange={e => update('primary_category', e.target.value)} style={inputStyle}>
              <option value="">Select category...</option>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Pricing model <span style={{ color: '#EF4444' }}>*</span></label>
            <select value={form.pricing_model} onChange={e => update('pricing_model', e.target.value)} style={inputStyle}>
              <option value="">Select pricing...</option>
              {PRICING_MODELS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Starting price (USD)</label>
            <input type="number" value={form.starting_price} onChange={e => update('starting_price', e.target.value)}
              placeholder="0 for free" style={inputStyle} min="0" />
          </div>
          <div>
            <label style={labelStyle}>Customer segment <span style={{ color: '#EF4444' }}>*</span></label>
            <select value={form.customer_segment} onChange={e => update('customer_segment', e.target.value)} style={inputStyle}>
              <option value="">Select segment...</option>
              {CUSTOMER_SEGMENT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>MCP support</label>
            <select value={form.mcp_claim} onChange={e => update('mcp_claim', e.target.value)} style={inputStyle}>
              {MCP_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <p style={fieldNote}>We verify MCP claims against official documentation only.</p>
          </div>
          <div>
            <label style={labelStyle}>MCP documentation URL{(form.mcp_claim === 'server' || form.mcp_claim === 'both') && <span style={{ color: '#EF4444' }}> *</span>}</label>
            <input type="url" value={form.mcp_docs_url} onChange={e => update('mcp_docs_url', e.target.value)}
              placeholder="https://docs.yoursite.com/mcp" style={inputStyle} />
            <p style={fieldNote}>Required for MCP server claims.</p>
          </div>
        </div>

        <div>
          <label style={labelStyle}>Anything else we should know?</label>
          <input type="text" value={form.notes} onChange={e => update('notes', e.target.value)}
            placeholder="Optional: recent launches, key integrations, security certifications..." style={inputStyle} maxLength={300} />
        </div>

        <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '1.25rem' }}>
          <label style={labelStyle}>Your contact email <span style={{ color: '#EF4444' }}>*</span></label>
          <input type="email" value={form.submitter_email} onChange={e => update('submitter_email', e.target.value)}
            placeholder="your@email.com" style={inputStyle} />
          <p style={fieldNote}>Never displayed publicly. We use this to notify you when your listing is live and to let you claim it.</p>
        </div>

        {/* Tier choice. Last step before submitting, so nothing here is a surprise
            and nobody is asked for money before they know what they are getting. */}
        <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '1.25rem' }}>
          <label style={labelStyle}>How should we handle your listing? <span style={{ color: '#EF4444' }}>*</span></label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginTop: '0.5rem' }}>
            {TIERS.map(tier => {
              const active = selectedTier === tier.id
              return (
                <label key={tier.id} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer',
                  border: active ? '2px solid #2563EB' : '1px solid #E5E7EB',
                  backgroundColor: active ? '#EFF6FF' : 'white',
                  borderRadius: '0.625rem',
                  padding: active ? 'calc(0.875rem - 1px)' : '0.875rem',
                }}>
                  <input type="radio" name="listing-tier" value={tier.id} checked={active}
                    onChange={() => setSelectedTier(tier.id)}
                    style={{ marginTop: '0.2rem', width: '1.125rem', height: '1.125rem', accentColor: '#2563EB', cursor: 'pointer', flexShrink: 0 }} />
                  <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '0.5rem 1.25rem' }}>
                  <div style={{ flex: '1 1 260px' }}>
                    <p style={{ margin: '0 0 0.125rem', fontSize: '0.9375rem', fontWeight: 700, color: active ? '#1E40AF' : '#111827' }}>
                    {tier.name}: {tier.price}{tier.cadence ? ' ' + tier.cadence : ''}
                    {tier.badge && <span style={{ marginLeft: '0.5rem', fontSize: '0.6875rem', fontWeight: 700, color: 'white', backgroundColor: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0.125rem 0.4rem', borderRadius: '0.25rem', verticalAlign: 'middle' }}>{tier.badge}</span>}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.8125rem', color: '#4B5563', lineHeight: 1.5 }}>
                      {tier.summary}{' '}
                      {tier.id === 'self'
                        ? 'The link to your site stays marked as unreviewed until we audit it.'
                        : 'Live in ' + tier.timeline + '.'}
                    </p>
                  </div>
                  {/* Time to go live, set like a price column so the two options read
                      side by side. Plain type, no icons or tinted pills (Heather
                      2026-09-27: emoji badges read as generic AI and put vendors off). */}
                  <div style={{ flex: '0 0 auto', textAlign: 'right', minWidth: '8.5rem' }}>
                    <p style={{ margin: 0, fontSize: '0.6875rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Goes live in</p>
                    <p style={{ margin: '0.125rem 0 0', fontSize: '1.125rem', fontWeight: 800, letterSpacing: '-0.01em', color: tier.id === 'self' ? '#111827' : '#1D4ED8' }}>
                      {tier.id === 'self'
                        ? (freeWaitWeeks ? waitText(freeWaitWeeks).replace('about', 'About') : 'Weekly batches')
                        : tier.timeline.replace(/^./, c => c.toUpperCase())}
                    </p>
                    {tier.id === 'self' && freeWaitWeeks && (
                      <p style={{ margin: '0.125rem 0 0', fontSize: '0.75rem', color: '#6B7280' }}>current free queue</p>
                    )}
                  </div>
                  </div>
                </label>
              )
            })}
          </div>
          <p style={fieldNote}>
            {isPaid
              ? 'You are not charged yet. Submit below, then pay ' + chosen.price + ' on Stripe\'s secure checkout on the next screen. Nothing you have typed is lost if you decide not to.'
              : 'Free listings are never charged.'}
          </p>
        </div>

        {/* Shown to EVERY tier, free included - ruled 2026-08-31. The
            tier-appropriate ask (never selling the entry fee to someone already
            on the monthly plan) belongs in the approval email, not here. */}
        <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '0.75rem', padding: '1.25rem' }}>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={interestedInAds} onChange={e => setInterestedInAds(e.target.checked)}
              style={{ marginTop: '0.25rem', width: '1.125rem', height: '1.125rem', accentColor: '#D97706', cursor: 'pointer' }} />
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#92400E', margin: '0 0 0.25rem' }}>
                I am interested in placement options for my listing
              </p>
              <p style={{ fontSize: '0.8125rem', color: '#A16207', lineHeight: 1.5, margin: 0 }}>
                Featured Listing, Comparison Placement, Own the Category and demo videos. Every placement includes the full audit and a re-audit every 14 days, because a stale listing in a featured slot helps nobody. Tick this and we will follow up with details. These are advertising products, separate from your listing tier, and they never affect ratings or rankings.
              </p>
            </div>
          </label>
        </div>

        <p style={{ fontSize: '0.75rem', color: '#9CA3AF', lineHeight: 1.6, margin: 0 }}>
        A free listing is always available, and every listing is researched and written by our editorial team. Paying buys the full audit, the structured data behind it, and the speed. It does not buy a rating or a ranking. Those are earned.
        </p>

        {error && (
          <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '0.5rem', padding: '0.75rem 1rem' }}>
            <p style={{ fontSize: '0.875rem', color: '#EF4444' }}>{error}</p>
          </div>
        )}

        <button onClick={handleSubmit} disabled={submitting}
          style={{ width: '100%', padding: '0.875rem', backgroundColor: submitting ? '#93C5FD' : '#2563EB', color: 'white', border: 'none', borderRadius: '0.625rem', fontSize: '1rem', fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer' }}>
          {submitting ? 'Submitting...' : (isPaid ? 'Submit agent and continue to payment' : 'Submit agent')}
        </button>
      </div>
    </div>
  )
}