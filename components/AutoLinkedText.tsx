'use client'
import Link from 'next/link'
import { ReactNode } from 'react'

export default function AutoLinkedText({
  text,
  agentNameMap,
  style,
}: {
  text: string
  agentNameMap: Record<string, string>
  style?: React.CSSProperties
}) {
  const names = Object.keys(agentNameMap).sort((a, b) => b.length - a.length)
  if (names.length === 0) return <span style={style}>{text}</span>

  const escaped = names.map(n => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const pattern = new RegExp('\\b(' + escaped.join('|') + ')\\b', 'g')
  const parts: ReactNode[] = []
  const linked = new Set<string>()
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(text)) !== null) {
    const name = match[1]
    const slug = agentNameMap[name]
    if (linked.has(name)) continue
    linked.add(name)
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    parts.push(
      <Link
        key={slug + '-' + match.index}
        href={'/agents/' + slug}
        style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}
      >
        {name}
      </Link>
    )
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  if (parts.length === 0) return <span style={style}>{text}</span>
  return <span style={style}>{parts}</span>
}