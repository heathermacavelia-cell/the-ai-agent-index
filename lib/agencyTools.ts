// ONE HOME FOR AGENCY TOOL NAMES, 2026-10-08. Until now the hub and the listing
// page each kept their own TOOL_LABELS map, the two drifted, and the hub's Tools
// filter showed Make, OpenAI, Python, HubSpot, React and Anthropic twice because
// some rows stored "Make" and others "make". Every agency surface now reads tools
// through normalizeTools() and labels them through toolLabel().
//
// Stored values are lowercase slugs ("microsoft-365"). The submit form already
// slugifies; normalizeTools() also folds the Claude aliases into "anthropic".

export const TOOL_LABELS: Record<string, string> = {
  'anthropic': 'Anthropic Claude',
  'openai': 'OpenAI',
  'langchain': 'LangChain',
  'hugging-face': 'Hugging Face',
  'h2o-ai': 'H2O.ai',
  'make': 'Make',
  'n8n': 'n8n',
  'zapier': 'Zapier',
  'pickaxe': 'Pickaxe',
  'hubspot': 'HubSpot',
  'salesforce': 'Salesforce',
  'mulesoft': 'MuleSoft',
  'voiceflow': 'Voiceflow',
  'botpress': 'Botpress',
  'twilio': 'Twilio',
  'xero': 'Xero',
  'simpro': 'simPRO',
  'shopify': 'Shopify',
  'microsoft-365': 'Microsoft 365',
  'google-workspace': 'Google Workspace',
  'aws': 'AWS',
  'aws-bedrock': 'AWS Bedrock',
  'aws-lambda': 'AWS Lambda',
  'azure': 'Azure',
  'google-cloud': 'Google Cloud',
  'python': 'Python',
  'typescript': 'TypeScript',
  'react': 'React',
  'node.js': 'Node.js',
  'fastapi': 'FastAPI',
  'crm-integrations': 'CRM Integrations',
  'lead-qualification': 'Lead Qualification',
  'automated-follow-up': 'Automated Follow-up',
}

// Different spellings of one tool. Anthropic's model is Claude, so all three are one tool.
const TOOL_ALIASES: Record<string, string> = {
  'claude': 'anthropic',
  'anthropic-claude': 'anthropic',
}

export function normalizeTool(value: string): string {
  const slug = String(value).trim().toLowerCase().replace(/\s+/g, '-')
  return TOOL_ALIASES[slug] ?? slug
}

// Normalised, de-duplicated, original order kept.
export function normalizeTools(values: unknown): string[] {
  if (!Array.isArray(values)) return []
  const out: string[] = []
  for (const v of values) {
    const t = normalizeTool(String(v))
    if (t && !out.includes(t)) out.push(t)
  }
  return out
}

// A tool nobody has labelled yet still renders properly: "foo-bar" -> "Foo Bar".
export function toolLabel(slug: string): string {
  return TOOL_LABELS[slug] ?? slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}
