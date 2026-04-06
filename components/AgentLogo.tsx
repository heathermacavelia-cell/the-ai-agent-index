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

  const fallbackDiv = (
    <div style={{ width: dimension, height: dimension, borderRadius: '8px', backgroundColor: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <span style={{ color: 'white', fontSize: fontSize, fontWeight: 700 }}>{initial}</span>
    </div>
  )

  if (logoUrl) {
    return (
      <div style={{ width: dimension, height: dimension, borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
        <img
          src={logoUrl}
          alt={name + ' logo'}
          style={{ width: imgSize, height: imgSize, objectFit: 'contain', imageRendering: 'crisp-edges' }}
          onLoad={(e) => {
            // Google returns a 16x16 grey globe when no favicon exists
            // Detect it by checking if naturalWidth is 16 (the placeholder size)
            const img = e.currentTarget
            if (img.naturalWidth <= 16 && img.naturalHeight <= 16) {
              img.style.display = 'none'
              const parent = img.parentElement
              if (parent) {
                parent.style.backgroundColor = '#2563EB'
                parent.style.border = 'none'
                parent.innerHTML = `<span style="color:white;font-size:${fontSize};font-weight:700">${initial}</span>`
              }
            }
          }}
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

  return fallbackDiv
}