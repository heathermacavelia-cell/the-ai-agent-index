'use client'

interface AgentLogoProps {
  name: string
  websiteUrl?: string | null
  faviconDomain?: string | null
  size?: 'sm' | 'md'
}

function getLogoUrl(websiteUrl: string | null | undefined, faviconDomain: string | null | undefined): string | null {
  if (faviconDomain) {
    return `https://www.google.com/s2/favicons?domain=${faviconDomain}&sz=64`
  }
  if (!websiteUrl) return null
  try {
    const domain = new URL(websiteUrl).hostname.replace('www.', '')
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
  } catch {
    return null
  }
}

export default function AgentLogo({ name, websiteUrl, faviconDomain, size = 'sm' }: AgentLogoProps) {
  const logoUrl = getLogoUrl(websiteUrl, faviconDomain)
  const initial = name.charAt(0).toUpperCase()
  const dimension = size === 'md' ? '48px' : '32px'
  const imgSize = size === 'md' ? '32px' : '22px'
  const fontSize = size === 'md' ? '16px' : '13px'

  const fallbackStyle: React.CSSProperties = {
    width: dimension, height: dimension, borderRadius: '8px',
    backgroundColor: '#2563EB', display: 'flex',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  }

  if (logoUrl) {
    return (
      <div
        style={{ width: dimension, height: dimension, borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0, position: 'relative' }}
      >
        <img
          src={logoUrl}
          alt={name + ' logo'}
          style={{ width: imgSize, height: imgSize, objectFit: 'contain', imageRendering: 'crisp-edges' }}
          onLoad={(e) => {
            const img = e.currentTarget
            const parent = img.parentElement
            if (!parent) return
            if (img.naturalWidth <= 16 && img.naturalHeight <= 16) {
              parent.innerHTML = `<div style="width:${dimension};height:${dimension};border-radius:8px;background-color:#2563EB;display:flex;align-items:center;justify-content:center;"><span style="color:white;font-size:${fontSize};font-weight:700">${initial}</span></div>`
            }
          }}
          onError={(e) => {
            const parent = e.currentTarget.parentElement
            if (!parent) return
            parent.innerHTML = `<div style="width:${dimension};height:${dimension};border-radius:8px;background-color:#2563EB;display:flex;align-items:center;justify-content:center;"><span style="color:white;font-size:${fontSize};font-weight:700">${initial}</span></div>`
          }}
        />
      </div>
    )
  }

  return (
    <div style={fallbackStyle}>
      <span style={{ color: 'white', fontSize: fontSize, fontWeight: 700 }}>{initial}</span>
    </div>
  )
}