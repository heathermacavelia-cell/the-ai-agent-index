import { createClient } from '@/lib/supabase'

const phBadgeSrc = 'https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1118070&theme=dark'
const phBadgeHref = 'https://www.producthunt.com/products/the-ai-agent-index'

const blBadgeSrc = 'https://betalist.com/badges/featured?id=158356&theme=dark'
const blBadgeHref = 'https://betalist.com/startups/the-ai-agent-index?utm_campaign=badge-the-ai-agent-index&utm_medium=badge&utm_source=badge-featured'

async function getAgentCount(): Promise<number> {
  try {
    const supabase = createClient()
    const { count } = await supabase
      .from('agents')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
    return count ?? 270
  } catch {
    return 270
  }
}

export default async function Footer() {
  const agentCount = await getAgentCount()

  return (
    <footer style={{ backgroundColor: '#030712', borderTop: '1px solid #1F2937' }}>

      {/* Stats bar */}
      <div style={{ borderBottom: '1px solid #1F2937', padding: '1rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center', justifyContent: 'center' }}>
          {[
            [`${agentCount}+`, 'AI agents indexed'],
            ['7', 'categories'],
            ['Public JSON API', 'GET /api/agents'],
            ['Machine-readable', 'built for AI citation'],
            ['Updated', 'daily'],
          ].map(([stat, label]) => (
            <div key={stat} style={{ textAlign: 'center' }}>
              <span style={{ color: '#2563EB', fontWeight: 700, fontSize: '0.9375rem' }}>{stat}</span>
              <span style={{ color: '#6B7280', fontSize: '0.8125rem', marginLeft: '0.375rem' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div style={{ width: '1.5rem', height: '1.5rem', backgroundColor: '#2563EB', borderRadius: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1L12.5 4V10L7 13L1.5 10V4L7 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                  <circle cx="7" cy="7" r="1.5" fill="white"/>
                </svg>
              </div>
              <span style={{ color: 'white', fontWeight: 700, fontSize: '0.875rem' }}>AI Agent Index</span>
            </div>
            <p style={{ color: '#6B7280', fontSize: '0.8125rem', lineHeight: 1.6, marginBottom: '1rem' }}>
              The structured, dataset-first directory of AI agents. Machine-readable by design.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <a href="https://x.com/AIAgentIndex" target="_blank" rel="noopener noreferrer"
                style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '0.8125rem', padding: '0.25rem 0.625rem', border: '1px solid #374151', borderRadius: '0.375rem' }}>
                𝕏 Twitter
              </a>
              <a href="https://www.linkedin.com/company/the-ai-agent-index" target="_blank" rel="noopener noreferrer"
                style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '0.8125rem', padding: '0.25rem 0.625rem', border: '1px solid #374151', borderRadius: '0.375rem' }}>
                LinkedIn
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <p style={{ color: 'white', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.875rem' }}>Categories</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                ['AI Sales Agents', '/ai-sales-agents'],
                ['AI Customer Support', '/ai-customer-support-agents'],
                ['AI Research Agents', '/ai-research-agents'],
                ['AI Marketing Agents', '/ai-marketing-agents'],
                ['AI Coding Agents', '/ai-coding-agents'],
                ['AI HR Agents', '/ai-hr-agents'],
                ['AI Workflow Agents', '/ai-workflow-agents'],
                ['Agent Stacks →', '/stacks'],
              ].map(([label, href]) => (
                <a key={href} href={href} style={{ color: href === '/stacks' ? '#60A5FA' : '#9CA3AF', fontSize: '0.8125rem', textDecoration: 'none', fontWeight: href === '/stacks' ? 600 : 400 }}>{label}</a>
              ))}
            </div>
          </div>

          {/* Learn */}
          <div>
            <p style={{ color: 'white', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.875rem' }}>Learn</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                ['What is an AI Sales Agent?', '/definitions/what-is-an-ai-sales-agent'],
                ['What is an AI Support Agent?', '/definitions/what-is-an-ai-customer-support-agent'],
                ['What is an AI Research Agent?', '/definitions/what-is-an-ai-research-agent'],
                ['What is an AI Marketing Agent?', '/definitions/what-is-an-ai-marketing-agent'],
                ['What is an AI Coding Agent?', '/definitions/what-is-an-ai-coding-agent'],
                ['All definitions →', '/definitions'],
              ].map(([label, href]) => (
                <a key={href} href={href} style={{ color: '#9CA3AF', fontSize: '0.8125rem', textDecoration: 'none' }}>{label}</a>
              ))}
            </div>
          </div>

          {/* Compare */}
          <div>
            <p style={{ color: 'white', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.875rem' }}>Compare</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                ['Cursor vs GitHub Copilot', '/compare/cursor-vs-github-copilot'],
                ['Intercom Fin vs Zendesk AI', '/compare/intercom-fin-vs-zendesk-ai'],
                ['Gong vs Clari', '/compare/gong-vs-clari'],
                ['Jasper vs Copy.ai', '/compare/jasper-vs-copy-ai'],
                ['Perplexity vs ChatGPT', '/compare/perplexity-ai-vs-chatgpt-deep-research'],
                ['All comparisons →', '/compare'],
              ].map(([label, href]) => (
                <a key={href} href={href} style={{ color: '#9CA3AF', fontSize: '0.8125rem', textDecoration: 'none' }}>{label}</a>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <p style={{ color: 'white', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.875rem' }}>Resources</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                ['Guides', '/resources/guides'],
                ['Alternatives', '/alternatives'],
                ['Agent Stacks', '/stacks'],
                ['Submit a Stack', '/stacks/submit'],
                ['Newsletter', '/resources/newsletter'],
                ['Changelog', '/changelog'],
                ['Submit an Agent', '/submit'],
                ['Find an Agent', '/find'],
                ['About', '/about'],
                ['Methodology', '/methodology'],
              ].map(([label, href]) => (
                <a key={href} href={href} style={{ color: '#9CA3AF', fontSize: '0.8125rem', textDecoration: 'none' }}>{label}</a>
              ))}
            </div>
          </div>

          {/* Integrations + Data Access */}
          <div>
            <p style={{ color: 'white', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.875rem' }}>Integrations</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {[
                ['Best for HubSpot', '/integrations/hubspot'],
                ['Best for Salesforce', '/integrations/salesforce'],
                ['Best for Zapier', '/integrations/zapier'],
                ['Best for Slack', '/integrations/slack'],
              ].map(([label, href]) => (
                <a key={href} href={href} style={{ color: '#9CA3AF', fontSize: '0.8125rem', textDecoration: 'none' }}>{label}</a>
              ))}
            </div>
            <p style={{ color: 'white', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.875rem' }}>Data Access</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                ['/api/agents', '/api/agents', 'JSON API'],
                ['/api/stacks', '/api/stacks', 'Stacks API'],
                ['/sitemap.xml', '/sitemap.xml', 'Sitemap'],
                ['/search', '/search', 'Search'],
              ].map(([path, href, label]) => (
                <a key={href} href={href} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#2563EB', fontSize: '0.7rem', fontFamily: 'monospace', backgroundColor: '#0F172A', padding: '0.15rem 0.4rem', borderRadius: '0.25rem', border: '1px solid #1E3A5F', whiteSpace: 'nowrap' }}>{path}</span>
                  <span style={{ color: '#6B7280', fontSize: '0.75rem' }}>{label}</span>
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid #1F2937', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <a href={phBadgeHref} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block' }}>
              <img alt="The AI Agent Index on Product Hunt" width="250" height="54" src={phBadgeSrc} />
            </a>
            <a href={blBadgeHref} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block' }}>
              <img alt="The AI Agent Index - Featured on BetaList" width={156} height={54} src={blBadgeSrc} />
            </a>
            <div
              aria-label="Cloudflare Agent Readiness Score 83 out of 100"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0 0.875rem',
                height: '54px',
                backgroundColor: '#0F172A',
                border: '1px solid #1F2937',
                borderRadius: '0.375rem',
                color: '#9CA3AF',
                fontSize: '0.75rem',
                whiteSpace: 'nowrap',
                boxSizing: 'border-box',
              }}
            >
              <span style={{ color: '#F38020', fontSize: '0.875rem' }}>⚡</span>
              <span>
                Cloudflare Agent Readiness{' '}
                <strong style={{ color: 'white', fontWeight: 700 }}>83/100</strong>
              </span>
            </div>
          </div>
          <p style={{ color: '#4B5563', fontSize: '0.75rem' }}>© 2026 The AI Agent Index. Built for humans and AI systems.</p>
          <p style={{ color: '#374151', fontSize: '0.7rem' }}>Some listings may contain affiliate links. This never influences our editorial ratings or placement.</p>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <a href="/about" style={{ color: '#4B5563', fontSize: '0.75rem', textDecoration: 'none' }}>About</a>
            <a href="/privacy" style={{ color: '#4B5563', fontSize: '0.75rem', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="/methodology" style={{ color: '#4B5563', fontSize: '0.75rem', textDecoration: 'none' }}>Methodology</a>
            <a href="/advertise" style={{ color: '#4B5563', fontSize: '0.75rem', textDecoration: 'none' }}>Advertise</a>
            <a href="/contact" style={{ color: '#4B5563', fontSize: '0.75rem', textDecoration: 'none' }}>Contact</a>
            <a href="https://x.com/AIAgentIndex" target="_blank" rel="noopener noreferrer" style={{ color: '#4B5563', fontSize: '0.75rem', textDecoration: 'none' }}>𝕏 Twitter</a>
            <a href="https://www.linkedin.com/company/the-ai-agent-index" target="_blank" rel="noopener noreferrer" style={{ color: '#4B5563', fontSize: '0.75rem', textDecoration: 'none' }}>LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  )
}