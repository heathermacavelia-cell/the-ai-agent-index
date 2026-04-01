'use client'

interface AgentLogoProps {
  name: string
  websiteUrl?: string | null
}

function getLogoUrl(websiteUrl: string | null | undefined): string | null {
  if (!websiteUrl) return null
  try {
    const domain = new URL(websiteUrl).hostname.replace('www.', '')
    return `https://img.logo.dev/${domain}?token=pk_De4GcChRRW2mF6EALgFsKQ&size=40&format=png`
  } catch {
    return null
  }
}

export default function AgentLogo({ name, websiteUrl }: AgentLogoProps) {
  const logoUrl = getLogoUrl(websiteUrl)
  const initial = name.charAt(0).toUpperCase()

  if (logoUrl) {
    return (
      <div style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
        <img
          src={logoUrl}
          alt={name + ' logo'}
          style={{ width: '24px', height: '24px', objectFit: 'contain' }}
          onError={(e) => {
            const target = e.currentTarget
            target.style.display = 'none'
            const parent = target.parentElement
            if (parent) {
              parent.style.backgroundColor = '#2563EB'
              parent.innerHTML = `<span style="color:white;font-size:13px;font-weight:700">${initial}</span>`
            }
          }}
        />
      </div>
    )
  }

  return (
    <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <span style={{ color: 'white', fontSize: '13px', fontWeight: 700 }}>{initial}</span>
    </div>
  )
}