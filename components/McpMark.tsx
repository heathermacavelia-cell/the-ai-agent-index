// The Model Context Protocol's own mark (the three linked strokes), taken from
// the official logo at modelcontextprotocol.io (logo/light.svg, mark paths only,
// wordmark dropped), 2026-09-27. Drawn in currentColor so it takes the color of
// the text beside it. Used ONLY to say "this agent speaks MCP" - the way a
// GitHub star says "GitHub" - never to suggest the protocol endorses a listing.
// Heather 2026-09-27: MCP tracking is a big part of the site; one consistent
// mark wherever MCP appears, instead of a generic icon or emoji.
export default function McpMark({ size = 16, title }: { size?: number; title?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="8 16 176 176"
      fill="none"
      stroke="currentColor"
      strokeWidth={14}
      strokeLinecap="round"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      style={{ flexShrink: 0, display: 'inline-block', verticalAlign: 'middle' }}
    >
      <path d="M25 97.8528L92.8823 29.9706C102.255 20.598 117.451 20.598 126.823 29.9706V29.9706C136.196 39.3431 136.196 54.5391 126.823 63.9117L75.5581 115.177" />
      <path d="M76.2653 114.47L126.823 63.9117C136.196 54.5391 151.392 54.5391 160.765 63.9117L161.118 64.2652C170.491 73.6378 170.491 88.8338 161.118 98.2063L99.7248 159.6C96.6006 162.724 96.6006 167.789 99.7248 170.913L112.331 183.52" />
      <path d="M109.853 46.9411L59.6482 97.1457C50.2757 106.518 50.2757 121.714 59.6482 131.087V131.087C69.0208 140.459 84.2168 140.459 93.5894 131.087L143.794 80.8822" />
    </svg>
  )
}
