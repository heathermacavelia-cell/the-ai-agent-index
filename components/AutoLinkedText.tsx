'use client'
import Link from 'next/link'
import { Fragment, ReactNode } from 'react'
import type { TemplateSegment } from '@/lib/templates'

/**
 * The link style used for BOTH automatic and deliberate links on this surface,
 * so converting a field from one to the other changes nothing a reader sees.
 */
const LINK_STYLE: React.CSSProperties = { color: '#2563EB', textDecoration: 'none', fontWeight: 500 }

export default function AutoLinkedText({
  text = '',
  agentNameMap,
  style,
  segments,
}: {
  text?: string
  agentNameMap: Record<string, string>
  style?: React.CSSProperties
  segments?: TemplateSegment[]
}) {
  // ----- DELIBERATE LINKING -------------------------------------------------
  // When the caller passes segments it has already decided this field is
  // author-linked and split it on the SERVER with segmentNameTemplates, so no
  // raw {{slug.name}} reaches the client (2026-10-02, B48). Every link comes
  // from a segment; NOTHING is linked automatically. The caller must pass
  // NO_AUTO_LINKS as agentNameMap in the same breath - this branch ignores it,
  // but leaving a real map there would misread on the next person to open it.
  if (segments) {
    return (
      <span style={style}>
        {segments.map((seg, i) =>
          seg.slug ? (
            <Link key={i} href={'/agents/' + seg.slug} style={LINK_STYLE}>
              {seg.text}
            </Link>
          ) : (
            <Fragment key={i}>{seg.text}</Fragment>
          )
        )}
      </span>
    )
  }

  // ----- AUTOMATIC LINKING - unchanged --------------------------------------
  const names = Object.keys(agentNameMap).sort((a, b) => b.length - a.length)
  if (names.length === 0) return <span style={style}>{text}</span>

  const escaped = names.map(n => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const pattern = new RegExp('(?<![A-Za-z0-9_])(' + escaped.join('|') + ')(?![A-Za-z0-9_])', 'g')
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
        style={LINK_STYLE}
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