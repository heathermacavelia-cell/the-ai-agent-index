'use client'
import { useState } from 'react'
import Link from 'next/link'
import {
  REVIEWER_ROLES, COMPANY_SIZES, USAGE_DURATIONS, REVIEWER_INDUSTRIES, COUNTRIES, REVIEW_LIMITS,
} from '@/lib/reviewOptions'

// The full-page review form (2026-10-23). Replaces the sidebar form on the listing.
// Saves the review as pending and emails a confirmation link - see app/api/reviews/route.ts.

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const card: React.CSSProperties = { backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '1rem' }
const sectionTitle: React.CSSProperties = { fontSize: '0.9375rem', fontWeight: 700, color: '#111827', margin: '0 0 0.25rem' }
const sectionNote: React.CSSProperties = { fontSize: '0.8125rem', color: '#6B7280', margin: '0 0 1rem', lineHeight: 1.5 }
const label: React.CSSProperties = { display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '0.375rem' }
const input: React.CSSProperties = { width: '100%', padding: '0.625rem 0.75rem', border: '1px solid #D1D5DB', borderRadius: '0.5rem', fontSize: '0.875rem', backgroundColor: 'white', boxSizing: 'border-box', fontFamily: 'inherit', color: '#111827' }
const hint: React.CSSProperties = { fontSize: '0.75rem', color: '#6B7280', marginTop: '0.3rem' }
const req = <span style={{ color: '#DC2626' }}> *</span>
const opt = <span style={{ color: '#9CA3AF', fontWeight: 400 }}> (optional)</span>
const grid2: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }

function Select({ id, value, onChange, options, placeholder }: { id: string; value: string; onChange: (v: string) => void; options: readonly string[]; placeholder: string }) {
  return (
    <select id={id} value={value} onChange={(e) => onChange(e.target.value)} style={{ ...input, appearance: 'auto' }}>
      <option value="">{placeholder}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}

function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0)
  const words = ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent']
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <div role="radiogroup" aria-label="Star rating" style={{ display: 'flex', gap: '4px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button key={star} type="button" role="radio" aria-checked={value === star} aria-label={star + ' star' + (star > 1 ? 's' : '')}
            onClick={() => onChange(star)} onMouseEnter={() => setHovered(star)} onMouseLeave={() => setHovered(0)}
            style={{ fontSize: '2rem', lineHeight: 1, background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: star <= (hovered || value) ? '#2563EB' : '#D1D5DB' }}>
            &#9733;
          </button>
        ))}
      </div>
      <span style={{ fontSize: '0.875rem', color: '#4B5563', minWidth: '5rem' }}>{words[hovered || value]}</span>
    </div>
  )
}

export default function ReviewPageForm({ agentId, agentName, agentSlug }: { agentId: string; agentName: string; agentSlug: string }) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [role, setRole] = useState('')
  const [size, setSize] = useState('')
  const [industry, setIndustry] = useState('')
  const [usage, setUsage] = useState('')
  const [country, setCountry] = useState('')
  const [region, setRegion] = useState('')
  const [city, setCity] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('') // honeypot
  const [alternatives, setAlternatives] = useState<string[]>([])
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sentTo, setSentTo] = useState('')
  const [wasUpdate, setWasUpdate] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setAlternatives([])
    if (rating === 0) return setError('Please choose a star rating.')
    if (!role || !size) return setError('Please choose your role and company size.')
    if (!displayName.trim()) return setError('Please choose a display name.')
    if (!emailRegex.test(email.trim())) return setError('Please enter a valid email address.')
    setSubmitting(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_id: agentId, rating, comment,
          reviewer_name: displayName, reviewer_email: email.trim(),
          reviewer_role: role, reviewer_company_size: size, reviewer_industry: industry,
          usage_duration: usage, reviewer_country: country, reviewer_region: region, reviewer_city: city,
          website,
        }),
      })
      const data = await res.json()
      if (res.status === 409 && data.error === 'name_taken') {
        setAlternatives(data.alternatives ?? [])
        setError('That display name is taken. Pick one below or type your own.')
        return
      }
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.')
      setWasUpdate(data.action === 'updated')
      setSentTo(email.trim())
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (sentTo) {
    return (
      <div style={{ ...card, textAlign: 'center', padding: '2.5rem 1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', margin: '0 0 0.5rem' }}>Check your email</h2>
        <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.6, margin: '0 0 0.5rem' }}>
          We sent a confirmation link to <strong>{sentTo}</strong>. Click it and your {wasUpdate ? 'updated review' : 'review'} of {agentName} goes live.
        </p>
        <p style={{ fontSize: '0.8125rem', color: '#6B7280', lineHeight: 1.6, margin: '0 0 1.5rem' }}>
          The link works for 7 days. Nothing is published until you confirm. Not there? Check your spam folder.
        </p>
        <Link href={'/agents/' + agentSlug} style={{ display: 'inline-block', padding: '0.625rem 1.25rem', borderRadius: '0.5rem', backgroundColor: '#2563EB', color: 'white', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
          Back to {agentName}
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div style={card}>
        <h2 style={sectionTitle}>Your rating</h2>
        <p style={sectionNote}>How well does {agentName} do the job you use it for?</p>
        <label style={label}>Overall rating{req}</label>
        <StarInput value={rating} onChange={setRating} />
        <div style={{ marginTop: '1.25rem' }}>
          <label htmlFor="rv-comment" style={label}>Your review{opt}</label>
          <textarea id="rv-comment" value={comment} onChange={(e) => setComment(e.target.value)} rows={5} maxLength={REVIEW_LIMITS.comment}
            placeholder="What do you use it for? What works well, and what doesn't?"
            style={{ ...input, resize: 'vertical' }} />
        </div>
      </div>

      <div style={card}>
        <h2 style={sectionTitle}>About you</h2>
        <p style={sectionNote}>This helps readers find reviews from people like them. Readers see your role, company size, industry and region. Never your city or email.</p>
        <div style={grid2}>
          <div>
            <label htmlFor="rv-role" style={label}>Your role{req}</label>
            <Select id="rv-role" value={role} onChange={setRole} options={REVIEWER_ROLES} placeholder="Choose your role" />
          </div>
          <div>
            <label htmlFor="rv-size" style={label}>Company size{req}</label>
            <Select id="rv-size" value={size} onChange={setSize} options={COMPANY_SIZES} placeholder="Choose a size" />
          </div>
          <div>
            <label htmlFor="rv-industry" style={label}>Industry{opt}</label>
            <Select id="rv-industry" value={industry} onChange={setIndustry} options={REVIEWER_INDUSTRIES} placeholder="Choose an industry" />
          </div>
          <div>
            <label htmlFor="rv-usage" style={label}>How long have you used it?{opt}</label>
            <Select id="rv-usage" value={usage} onChange={setUsage} options={USAGE_DURATIONS} placeholder="Choose one" />
          </div>
          <div>
            <label htmlFor="rv-country" style={label}>Country{opt}</label>
            <Select id="rv-country" value={country} onChange={setCountry} options={COUNTRIES} placeholder="Choose a country" />
          </div>
          <div>
            <label htmlFor="rv-region" style={label}>State or province{opt}</label>
            <input id="rv-region" type="text" value={region} onChange={(e) => setRegion(e.target.value)} maxLength={REVIEW_LIMITS.region} placeholder="e.g. Ontario" style={input} />
          </div>
          <div>
            <label htmlFor="rv-city" style={label}>City{opt}</label>
            <input id="rv-city" type="text" value={city} onChange={(e) => setCity(e.target.value)} maxLength={REVIEW_LIMITS.city} style={input} />
            <p style={hint}>Never shown on the site.</p>
          </div>
        </div>
      </div>

      <div style={card}>
        <h2 style={sectionTitle}>Your account</h2>
        <p style={sectionNote}>We email you a link to confirm the review is yours. Your email address is never shown.</p>
        <div style={grid2}>
          <div>
            <label htmlFor="rv-name" style={label}>Display name{req}</label>
            <input id="rv-name" type="text" value={displayName} onChange={(e) => { setDisplayName(e.target.value); setAlternatives([]) }} maxLength={REVIEW_LIMITS.name} placeholder="Shown with your review" style={input} />
            {alternatives.length > 0 && (
              <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                {alternatives.map((alt) => (
                  <button key={alt} type="button" onClick={() => { setDisplayName(alt); setAlternatives([]) }}
                    style={{ padding: '0.25rem 0.625rem', fontSize: '0.75rem', backgroundColor: '#F3F4F6', border: '1px solid #E5E7EB', borderRadius: '9999px', cursor: 'pointer' }}>
                    {alt}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <label htmlFor="rv-email" style={label}>Email{req}</label>
            <input id="rv-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" autoComplete="email" style={input} />
            <p style={hint}>Already reviewed {agentName}? Use the same email to update your review.</p>
          </div>
        </div>
        {/* Honeypot - hidden from people, filled by bots */}
        <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: '1px', height: '1px', overflow: 'hidden' }}>
          <label htmlFor="rv-website">Website</label>
          <input id="rv-website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </div>
      </div>

      {error && <p role="alert" style={{ color: '#DC2626', fontSize: '0.875rem', margin: '0 0 1rem' }}>{error}</p>}
      <button type="submit" disabled={submitting}
        style={{ width: '100%', padding: '0.875rem', backgroundColor: submitting ? '#93C5FD' : '#2563EB', color: 'white', border: 'none', borderRadius: '0.5rem', fontSize: '0.9375rem', fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer' }}>
        {submitting ? 'Sending...' : 'Submit review'}
      </button>
      <p style={{ fontSize: '0.75rem', color: '#6B7280', textAlign: 'center', marginTop: '0.75rem', lineHeight: 1.5 }}>
        By submitting you agree that your review, display name, role, company size, industry and region may be shown publicly. See our <Link href="/privacy" style={{ color: '#2563EB' }}>privacy policy</Link>.
      </p>
    </form>
  )
}
