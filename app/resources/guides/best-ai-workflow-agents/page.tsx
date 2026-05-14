import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import type { Metadata } from 'next'
import GuideCitations from '@/components/GuideCitations'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Best AI Agents for Workflow Automation (2026)',
  description: 'Compare the top AI workflow automation agents for 2026. Zapier, Make, n8n, Lindy, and Bardeen reviewed and ranked. Not affiliated.',
  openGraph: {
    title: 'Best AI Agents for Workflow Automation (2026)',
    description: 'Compare the top AI workflow automation agents for 2026. Zapier, Make, n8n, Lindy, and Bardeen reviewed and ranked. Not affiliated.',
    url: 'https://theaiagentindex.com/resources/guides/best-ai-workflow-agents',
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary',
    title: 'Best AI Agents for Workflow Automation (2026)',
    description: 'Zapier, Make, n8n, Lindy, Bardeen, and Tines compared for workflow automation. Features, pricing, and use case recommendations.',
  },
  alternates: { canonical: 'https://theaiagentindex.com/resources/guides/best-ai-workflow-agents' },
}

export default async function WorkflowAgentsGuidePage() {
  const supabase = createClient()
  const { data: agents } = await supabase
    .from('agents')
    .select('id, name, slug, developer, short_description, primary_category, pricing_model, starting_price, rating_avg, rating_count, is_featured, is_verified, capability_tags, integrations')
    .eq('is_active', true)
    .eq('primary_category', 'ai-workflow-agents')
    .contains('capability_tags', ['workflow-builder'])
    .order('is_featured', { ascending: false })
    .order('rating_avg', { ascending: false })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Best AI Agents for Workflow Automation 2026',
    description: 'Compare the top AI workflow automation agents for 2026. Zapier, Make, n8n, Lindy, and Bardeen reviewed and ranked.',
    url: 'https://theaiagentindex.com/resources/guides/best-ai-workflow-agents',
    publisher: { '@type': 'Organization', name: 'The AI Agent Index', url: 'https://theaiagentindex.com' },
    mainEntity: {
      '@type': 'ItemList',
      name: 'Best AI Agents for Workflow Automation 2026',
      numberOfItems: agents?.length ?? 0,
      itemListElement: agents?.map((agent, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'SoftwareApplication',
          name: agent.name,
          description: agent.short_description,
          url: `https://theaiagentindex.com/agents/${agent.slug}`,
        }
      })) ?? []
    }
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div style={{ marginBottom: '0.75rem' }}>
        <Link href="/" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none' }}>Home</Link>
        <span style={{ color: '#D1D5DB', margin: '0 0.5rem' }}>/</span>
        <Link href="/resources/guides" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none' }}>Guides</Link>
        <span style={{ color: '#D1D5DB', margin: '0 0.5rem' }}>/</span>
        <span style={{ fontSize: '0.8125rem', color: '#111827' }}>Best AI Agents for Workflow Automation</span>
      </div>

      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Guide</p>
      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
        Best AI Agents for Workflow Automation (2026)
      </h1>

      <p style={{ fontSize: '1.0625rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '0.75rem', maxWidth: '680px' }}>
        McKinsey&apos;s 2025 State of AI report finds that 72% of organisations now use AI in at least one business function, with workflow automation consistently ranked among the top productivity use cases. This guide covers {agents?.length ?? 0} AI agents purpose-built for workflow automation, covering no-code integration platforms, autonomous process agents, browser automation, and developer-first orchestration tools.
      </p>
      <p style={{ fontSize: '0.9375rem', color: '#6B7280', lineHeight: 1.7, marginBottom: '1rem', maxWidth: '680px' }}>
        Workflow automation agents connect your tools, execute multi-step processes, and make decisions without manual intervention at each step. The category ranges from no-code platforms like <Link href="/agents/zapier" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Zapier</Link> and <Link href="/agents/make" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Make</Link> that connect thousands of apps, to autonomous agents like <Link href="/agents/lindy" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Lindy</Link> and <Link href="/agents/beam-ai" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Beam AI</Link> that handle entire workflows end to end, to developer-first orchestration frameworks like <Link href="/agents/n8n" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>n8n</Link> and <Link href="/agents/mastra" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Mastra</Link> that give engineering teams full control over logic and data flow.
      </p>

      <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '2rem', maxWidth: '680px' }}>
        <p style={{ fontSize: '0.875rem', color: '#0369A1', lineHeight: 1.6, margin: 0 }}>
          <strong>New to AI agents?</strong> Read our structured definition: <Link href="/resources/guides/what-is-an-ai-agent" style={{ color: '#2563EB' }}>What is an AI Agent?</Link> covering how they work, how they differ from standard automation, and what to look for when evaluating them.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' as const, marginBottom: '2.5rem' }}>
        <Link href="/integrations/slack" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', backgroundColor: '#F9FAFB', padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>Slack integrations →</Link>
        <Link href="/integrations/hubspot" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', backgroundColor: '#F9FAFB', padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>HubSpot integrations →</Link>
        <Link href="/integrations/salesforce" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', backgroundColor: '#F9FAFB', padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>Salesforce integrations →</Link>
        <Link href="/integrations/gmail" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', backgroundColor: '#F9FAFB', padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>Gmail integrations →</Link>
        <Link href="/integrations/zapier" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', backgroundColor: '#F9FAFB', padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>Zapier integrations →</Link>
        <Link href="/integrations/notion" style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', backgroundColor: '#F9FAFB', padding: '0.375rem 0.875rem', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>Notion integrations →</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
        {agents?.map((agent, index) => (
          <Link key={agent.slug} href={'/agents/' + agent.slug}
            style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: agent.is_featured ? '1px solid #BFDBFE' : '1px solid #E5E7EB', padding: '1.25rem', textDecoration: 'none', display: 'block', position: 'relative' }}>
            {index < 3 && (
              <span style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', fontSize: '0.625rem', fontWeight: 700, backgroundColor: '#FEF3C7', color: '#D97706', padding: '0.15rem 0.4rem', borderRadius: '9999px', textTransform: 'uppercase' as const }}>
                #{index + 1}
              </span>
            )}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ flex: 1, paddingRight: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' as const, marginBottom: '0.2rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#111827' }}>{agent.name}</span>
                  {agent.is_verified && <span style={{ fontSize: '0.625rem', fontWeight: 700, backgroundColor: '#DCFCE7', color: '#16A34A', padding: '0.1rem 0.4rem', borderRadius: '9999px', textTransform: 'uppercase' as const }}>Verified</span>}
                  {agent.is_featured && <span style={{ fontSize: '0.625rem', fontWeight: 700, backgroundColor: '#DBEAFE', color: '#1D4ED8', padding: '0.1rem 0.4rem', borderRadius: '9999px', textTransform: 'uppercase' as const }}>Featured</span>}
                </div>
                <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>by {agent.developer}</span>
              </div>
              {agent.rating_avg > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
                  <span style={{ color: '#2563EB', fontSize: '0.75rem' }}>★</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151' }}>{Number(agent.rating_avg).toFixed(1)}</span>
                </div>
              )}
            </div>
            <p style={{ fontSize: '0.8125rem', color: '#4B5563', lineHeight: 1.55, marginBottom: '0.75rem' }}>{agent.short_description}</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.75rem', color: '#6B7280', backgroundColor: '#F3F4F6', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', textTransform: 'capitalize' as const }}>{agent.pricing_model}</span>
              <span style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 500 }}>View →</span>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2.5rem', marginBottom: '3rem', maxWidth: '680px' }}>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#111827', marginBottom: '1rem', letterSpacing: '-0.01em' }}>
          How to evaluate AI workflow automation agents
        </h2>
        <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1rem' }}>
          The workflow automation category splits into four distinct tool types, and picking the wrong type wastes months of setup time. No-code integration platforms like <Link href="/agents/zapier" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Zapier</Link> and <Link href="/agents/make" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Make</Link> connect third-party apps through pre-built connectors and visual workflow builders, best for teams that want automation without writing code. Open-source and developer-first orchestration tools like <Link href="/agents/n8n" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>n8n</Link> and <Link href="/agents/mastra" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Mastra</Link> give engineering teams full control over logic, data, and deployment. Autonomous AI-first agents like <Link href="/agents/lindy" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Lindy</Link> and <Link href="/agents/beam-ai" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Beam AI</Link> go further, making decisions within workflows rather than just moving data between steps. Browser automation tools like <Link href="/agents/bardeen" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Bardeen</Link>, <Link href="/agents/skyvern" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Skyvern</Link>, and <Link href="/agents/browse-ai" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Browse AI</Link> handle tasks on the web that traditional API-based tools cannot reach.
        </p>
        <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1rem' }}>
          The most important evaluation criteria are connector count, pricing model, and AI decision-making capability. Connector count determines whether your existing tools are covered without custom development. Pricing model determines whether automation costs scale predictably as usage grows, since per-task pricing can become expensive quickly at volume. AI decision-making is the differentiator between traditional automation and genuine agents that handle conditional logic, exception handling, and multi-step reasoning inside a workflow. Enterprise and compliance-heavy teams should also evaluate <Link href="/agents/tines" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Tines</Link>, which is purpose-built for security operations workflows with strong audit and access controls.
        </p>

        <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', marginTop: '1.75rem' }}>
          Recommended stack by use case
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.75rem', marginBottom: '1.5rem' }}>
          {[
            {
              useCase: 'No-code automation for non-technical teams',
              jsx: <><Link href="/agents/zapier" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Zapier</Link> for breadth of app coverage with the lowest setup barrier. Over 7,000 app connectors and a large library of pre-built templates mean most common workflows are ready to activate. Use <Link href="/agents/make" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Make</Link> when you need more complex multi-step logic, conditional branching, or data transformation inside workflows without writing code.</>
            },
            {
              useCase: 'Developer-first orchestration',
              jsx: <><Link href="/agents/n8n" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>n8n</Link> for open-source workflow orchestration with self-hosting and full customisation. <Link href="/agents/mastra" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Mastra</Link> for TypeScript-native multi-agent workflows with built-in memory and tool integration. <Link href="/agents/composio" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Composio</Link> for connecting AI agents to 250+ external tools through a standardised integration layer.</>
            },
            {
              useCase: 'AI-first autonomous workflows',
              jsx: <><Link href="/agents/lindy" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Lindy</Link> for email, calendar, and meeting workflows managed autonomously without trigger-based setup. <Link href="/agents/beam-ai" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Beam AI</Link> for deploying autonomous process agents that handle document processing, data extraction, and operational tasks end to end.</>
            },
            {
              useCase: 'Browser and web automation',
              jsx: <><Link href="/agents/bardeen" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Bardeen</Link> for browser-based automation with a Chrome extension and AI-assisted workflow building. <Link href="/agents/skyvern" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Skyvern</Link> for production-grade browser automation that handles dynamic pages. <Link href="/agents/browse-ai" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Browse AI</Link> for no-code web scraping and data extraction from any website on a schedule.</>
            },
            {
              useCase: 'Meeting and conversation automation',
              jsx: <>See our dedicated guide: <Link href="/resources/guides/best-ai-meeting-agents" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Best AI Meeting Agents (2026)</Link>, covering <Link href="/agents/fathom" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Fathom</Link>, <Link href="/agents/fireflies-ai" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Fireflies.ai</Link>, <Link href="/agents/tldv" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>tl;dv</Link>, <Link href="/agents/granola" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Granola</Link>, and <Link href="/agents/shadow" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Shadow</Link> for automatic transcription, summarisation, and action item extraction.</>
            },
            {
              useCase: 'Scheduling and calendar management',
              jsx: <>See our dedicated guide: <Link href="/resources/guides/best-ai-scheduling-agents" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Best AI Scheduling Agents (2026)</Link>, covering <Link href="/agents/reclaim-ai" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Reclaim.ai</Link>, <Link href="/agents/motion" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Motion</Link>, <Link href="/agents/akiflow" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Akiflow</Link>, and <Link href="/agents/lindy" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Lindy</Link> for autonomous calendar optimisation and meeting booking.</>
            },
          ].map((item) => (
            <div key={item.useCase} style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.625rem', padding: '1rem' }}>
              <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#111827', marginBottom: '0.375rem' }}>{item.useCase}</p>
              <p style={{ fontSize: '0.8125rem', color: '#6B7280', lineHeight: 1.6, margin: 0 }}>{item.jsx}</p>
            </div>
          ))}
        </div>

        <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', marginTop: '1.75rem' }}>
          Key capabilities to look for
        </h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column' as const, gap: '0.625rem', marginBottom: '1.5rem' }}>
          {[
            {
              term: 'Connector count and coverage',
              def: (<><Link href="/agents/zapier" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Zapier</Link> leads with 7,000+ connectors. <Link href="/agents/make" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Make</Link>, <Link href="/agents/n8n" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>n8n</Link>, and <Link href="/agents/tines" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Tines</Link> cover the majority of enterprise tools. The number of pre-built app integrations determines whether your existing stack is covered without custom development. Check your specific tools before committing.</>)
            },
            {
              term: 'Trigger types',
              def: 'Workflows can be triggered by webhooks, schedules, events, emails, or manual input. The trigger set determines what processes are automatable. Webhook support is essential for real-time workflows. Schedule-based triggers are sufficient for batch processes.'
            },
            {
              term: 'AI decision-making within workflows',
              def: (<>Traditional automation follows fixed if-then logic. Agents like <Link href="/agents/lindy" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Lindy</Link> and <Link href="/agents/beam-ai" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Beam AI</Link> make conditional decisions, handle exceptions, and route between workflow paths based on content rather than predefined rules. This is the core differentiator between automation platforms and AI agents.</>)
            },
            {
              term: 'Error handling and retry logic',
              def: 'Production workflows fail. Tools that handle errors gracefully, retry failed steps, and alert on exceptions reduce manual intervention. This is often underweighted during evaluation and becomes critical at scale.'
            },
            {
              term: 'Pricing model and task economics',
              def: 'Per-task pricing scales poorly at volume. Flat monthly pricing is predictable but may include usage caps. Usage-based pricing offers flexibility but requires monitoring. Calculate your expected monthly task count before choosing a plan.'
            },
            {
              term: 'Self-hosting and data residency',
              def: (<>Open-source tools like <Link href="/agents/n8n" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>n8n</Link> support self-hosted deployment, keeping workflow data inside your own infrastructure. Important for compliance-heavy industries handling sensitive data.</>)
            },
          ].map((item) => (
            <li key={item.term} style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.6, display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <span style={{ color: '#2563EB', flexShrink: 0, fontWeight: 700, marginTop: '2px' }}>→</span>
              <span><strong>{item.term}:</strong> {item.def}</span>
            </li>
          ))}
        </ul>

        <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', marginTop: '1.75rem' }}>
          Also worth exploring
        </h3>
        <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '0.75rem' }}>
          Several agents in the index are worth evaluating for specific workflow needs: <Link href="/agents/tines" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Tines</Link> for security operations workflows with enterprise-grade access controls; <Link href="/agents/voiceflow" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Voiceflow</Link> for building conversational workflow agents with no-code tooling; <Link href="/agents/relevance-ai" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Relevance AI</Link> for building custom AI agents that run sales and marketing workflows; <Link href="/agents/botpress" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Botpress</Link> for open-source conversational agent deployment; <Link href="/agents/microsoft-copilot-studio" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Microsoft Copilot Studio</Link> for teams in the Microsoft 365 ecosystem who want to build custom agents without leaving that environment.
        </p>

        <p style={{ fontSize: '0.875rem', color: '#9CA3AF', lineHeight: 1.6, marginTop: '2rem' }}>
          All agents listed above are editorially reviewed by The AI Agent Index. Scores reflect public signals including G2 ratings, product documentation, and verified user evidence. See our <Link href="/methodology" style={{ color: '#6B7280' }}>editorial methodology</Link>.
        </p>
      </div>

      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        <Link href="/ai-workflow-agents" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>All AI Workflow Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Browse the full category →</p>
        </Link>
        <Link href="/resources/guides/best-ai-meeting-agents" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Best AI Meeting Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Fathom vs Fireflies vs tl;dv →</p>
        </Link>
        <Link href="/resources/guides/best-ai-scheduling-agents" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Best AI Scheduling Agents</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Reclaim vs Motion vs Akiflow →</p>
        </Link>
        <Link href="/resources/guides/what-is-an-ai-agent" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>What is an AI Agent?</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Read the definition →</p>
        </Link>
        <Link href="/resources/guides/multi-agent-orchestration" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Multi-Agent Orchestration</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>The complete guide →</p>
        </Link>
        <Link href="/integrations/zapier" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', padding: '1rem', textDecoration: 'none', display: 'block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>Best for Zapier</p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Filter by integration →</p>
        </Link>
      </div>
      <GuideCitations slug="best-ai-workflow-agents" table="guides" />
    </div>
  )
}