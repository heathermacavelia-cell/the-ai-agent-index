'use client'

interface AgentLogoProps {
  name: string
  websiteUrl?: string | null
  size?: 'sm' | 'md'
}

function getLogoUrl(websiteUrl: string | null | undefined): string | null {
  if (!websiteUrl) return null
  try {
    const domain = new URL(websiteUrl).hostname.replace('www.', '')
    return `https://logo.clearbit.com/${domain}`
  } catch {
    return null
  }
}

export default function AgentLogo({ name, websiteUrl, size = 'sm' }: AgentLogoProps) {
  const logoUrl = getLogoUrl(websiteUrl)
  const initial = name.charAt(0).toUpperCase()
  const dimension = size === 'md' ? '48px' : '32px'
  const imgSize = size === 'md' ? '36px' : '26px'
  const fontSize = size === 'md' ? '16px' : '13px'

  if (logoUrl) {
    return (
      <div style={{ width: dimension, height: dimension, borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
        <img
          src={logoUrl}
          alt={name + ' logo'}
          style={{ width: imgSize, height: imgSize, objectFit: 'contain' }}
          onError={(e) => {
            const target = e.currentTarget
            target.style.display = 'none'
            const parent = target.parentElement
            if (parent) {
              parent.style.backgroundColor = '#2563EB'
              parent.style.border = 'none'
              parent.innerHTML = `<span style="color:white;font-size:${fontSize};font-weight:700">${initial}</span>`
            }
          }}
        />
      </div>
    )
  }

  return (
    <div style={{ width: dimension, height: dimension, borderRadius: '8px', backgroundColor: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <span style={{ color: 'white', fontSize: fontSize, fontWeight: 700 }}>{initial}</span>
    </div>
  )
}