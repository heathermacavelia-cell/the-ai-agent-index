'use client'
import { useState } from 'react'

interface DemoVideoProps {
  url: string
  type: 'mp4' | 'youtube' | 'vimeo'
  variant?: 'banner' | 'standalone'
}

function getEmbedUrl(url: string, type: 'youtube' | 'vimeo'): string {
  if (type === 'youtube') {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]+)/)
    const id = match ? match[1] : url
    return 'https://www.youtube.com/embed/' + id + '?autoplay=1&rel=0'
  }
  if (type === 'vimeo') {
    const match = url.match(/vimeo\.com\/(\d+)/)
    const id = match ? match[1] : url
    return 'https://player.vimeo.com/video/' + id + '?autoplay=1'
  }
  return url
}

export default function DemoVideo({ url, type, variant = 'banner' }: DemoVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const isBanner = variant === 'banner'
  const borderStyle = isBanner ? '1px solid rgba(255,255,255,0.12)' : '1px solid #E5E7EB'
  const playBg = isBanner ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.06)'
  const playBorder = isBanner ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.08)'
  const playIconColor = isBanner ? '#fff' : '#374151'
  const thumbBg = isBanner ? 'linear-gradient(135deg, #2a2a4a 0%, #1B1B2F 100%)' : '#F9FAFB'
  const labelColor = isBanner ? 'rgba(255,255,255,0.4)' : '#9CA3AF'

  if (isPlaying && type === 'mp4') {
    return (
      <div style={{ width: '100%', borderRadius: '0.5rem', overflow: 'hidden', aspectRatio: '16/9', position: 'relative', border: borderStyle, background: '#000' }}>
        <video
          src={url}
          autoPlay
          controls
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>
    )
  }

  if (isPlaying && (type === 'youtube' || type === 'vimeo')) {
    return (
      <div style={{ width: '100%', borderRadius: '0.5rem', overflow: 'hidden', aspectRatio: '16/9', position: 'relative', border: borderStyle }}>
        <iframe
          src={getEmbedUrl(url, type)}
          style={{ width: '100%', height: '100%', border: 'none' }}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <div
      onClick={() => setIsPlaying(true)}
      style={{
        width: '100%',
        borderRadius: '0.5rem',
        overflow: 'hidden',
        aspectRatio: '16/9',
        position: 'relative',
        border: borderStyle,
        cursor: 'pointer',
        background: thumbBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        background: playBg,
        border: playBorder,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1,
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill={playIconColor}><path d="M8 5v14l11-7z"/></svg>
      </div>
      <span style={{
        position: 'absolute',
        top: '0.375rem',
        right: '0.5rem',
        fontSize: '0.5625rem',
        color: labelColor,
        letterSpacing: '0.03em',
        fontWeight: 600,
        textTransform: 'uppercase',
      }}>
        Product demo
      </span>
    </div>
  )
}