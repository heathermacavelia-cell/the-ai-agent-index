// Tags are stored as slugs ("crm-sync"). This turns one into readable text and
// keeps acronyms upper case, so a pill says "CRM sync", not "Crm sync".
const ACRONYMS = new Set(['ai', 'api', 'b2b', 'b2c', 'bpo', 'ci', 'cd', 'cli', 'crm', 'cx', 'etl', 'gtm', 'hr', 'ide', 'kyc', 'llm', 'mcp', 'ocr', 'pr', 'qa', 'rag', 'roi', 'rpa', 'sdr', 'seo', 'smb', 'sms', 'soc', 'sql', 'ugc', 'ui', 'ux'])

export function capabilityLabel(tag: string): string {
  const words = tag.split(/[-_\s]+/).filter(Boolean).map((w) => (ACRONYMS.has(w.toLowerCase()) ? w.toUpperCase() : w.toLowerCase()))
  const text = words.join(' ')
  return text.charAt(0).toUpperCase() + text.slice(1)
}
