import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import GuideCitations from '@/components/GuideCitations'
import NewsletterSignup from '@/components/NewsletterSignup'
import { getGuideMeta, isoDate, updatedLabel } from '@/lib/guideMeta'
import GuideAgentList from '@/components/GuideAgentList'
import { getGuideGroups, type GuideGroup } from '@/lib/guideAgents'
import { buildRefMap, resolveTemplates, type RefMap } from '@/lib/templates'

// Agent names in this guide's prose and FAQ come from the database, not from this file.
// GUIDE_SLUGS lists every agent the prose names. A name that is renamed in the database
// updates here automatically. A slug that does not exist renders its raw template, loudly.
const GUIDE_SLUGS = ['cocounsel', 'eve-legal', 'harvey-ai', 'lexis-plus-protege', 'spellbook']

// The agents this guide lists, in this order, under the guide's three types.
// Chosen by hand (Heather, 2026-10-29) - never by tag. Order is editorial, not a ranking.
const GUIDE_GROUPS: GuideGroup[] = [
  {
    heading: 'Legal research',
    intro: 'Research agents that answer legal questions in plain language and cite the legal sources behind each answer.',
    slugs: ['cocounsel', 'lexis-plus-protege', 'harvey-ai'],
  },
  {
    heading: 'Contract review and drafting',
    intro: 'Tools for transactional lawyers who review and draft contracts inside the editors they already use.',
    slugs: ['spellbook'],
  },
  {
    heading: 'Firm operations',
    intro: 'Agents that handle case workflows for a specific type of practice, from client intake to demand letters.',
    slugs: ['eve-legal'],
  },
]

const AGENT_LINK_STYLE = { color: '#2563EB', textDecoration: 'none', fontWeight: 500 }

function A({ s, r }: { s: string; r: RefMap }) {
  const ref = r[s]
  if (!ref || !ref.name) return <>{'{{' + s + '.name}}'}</>
  if (ref.is_active === false) return <>{ref.name}</>
  return <Link href={'/agents/' + s} style={AGENT_LINK_STYLE}>{ref.name}</Link>
}

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'AI Agents for Legal: Research, Contracts, Firm Operations (2026)',
  description: 'Legal AI agents for research, contract review and firm operations, from CoCounsel and Harvey AI to Spellbook. Citation accuracy and data security.',
  alternates: { canonical: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-legal' },
  openGraph: {
    title: 'AI Agents for Legal: Research, Contracts, Firm Operations (2026)',
    description: 'Legal AI agents for research, contract review and firm operations, from CoCounsel and Harvey AI to Spellbook. Citation accuracy and data security.',
    url: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-legal',
    type: 'article',
    siteName: 'The AI Agent Index',
  },
  twitter: {
    card: 'summary',
    title: 'AI Agents for Legal: Research, Contracts, Firm Operations (2026)',
    description: 'Legal AI agents for research, contract review and firm operations, from CoCounsel and Harvey AI to Spellbook. Citation accuracy and data security.',
  },
}

const faqItems = [
  {
    q: 'What are the best AI agents for legal teams in 2026?',
    a: 'It depends on the work. For legal research, {{cocounsel.name}} draws on Westlaw, Practical Law and a firm\'s own documents, and {{lexis-plus-protege.name}} runs agentic workflows over LexisNexis content with Shepard\'s Citations validation. {{harvey-ai.name}} is an enterprise legal AI platform whose agents run legal work end to end. For contract review and drafting, {{spellbook.name}} works in Word, Google Docs and the web for transactional lawyers. For plaintiff firms, {{eve-legal.name}} handles intake calls, medical chronologies, demand letters and discovery. All of these are built for legal work, not general AI tools applied to legal tasks.',
  },
  {
    q: 'Can AI agents replace lawyers?',
    a: 'No. AI agents cannot replicate the legal judgment, client counseling, courtroom advocacy, and strategic reasoning that define legal expertise. What they can do is speed up document-heavy, pattern-recognition work such as research, contract review, drafting, and due diligence. Legal teams that use AI well hand that volume to the tools so lawyers can focus on the work that requires legal judgment.',
  },
  {
    q: 'Are legal AI agents accurate enough for professional use?',
    a: 'Tools built for legal work are designed to ground answers in legal sources and to show the citations behind them, which makes their output easier to check than a general-purpose chatbot. Some also validate citations, as {{lexis-plus-protege.name}} does with Shepard\'s Citations. That said, human review of all AI-generated legal output remains essential before it enters client work or filings. The professional standard has not changed. The speed at which lawyers can produce reviewed, accurate work has.',
  },
  {
    q: 'How much time can AI agents save legal teams?',
    a: 'Time savings vary by task type and by firm, and published figures are mostly vendor claims. Contract review and due diligence, legal research, and first drafts of standard documents are where teams most often report gains, because AI handles the first pass and lawyers review it. The way to know for your team is to time a few real matters before and after a trial, with the same review standard applied to both.',
  },
  {
    q: 'What should legal teams look for when evaluating AI agents?',
    a: 'The most important criteria are: whether the tool is built on legal content rather than a general AI model alone; citation accuracy and whether the agent links directly to its source material; data security practices and whether client data is used to train future models (get the answer in the contract); integration with your existing document management platform; and total cost of ownership including implementation time. For any shortlisted tool, test it against real examples from your own practice area before purchasing.',
  },
]

const useCases = [
  {
    title: 'Legal Research',
    description: `Legal research is where many legal teams first see time savings from AI agents. Traditional legal research requires constructing precise Boolean queries across databases, manually reviewing results, and synthesizing findings into a structured memo. AI-powered legal research agents accept natural language questions and return synthesized, cited answers much faster.

The key differentiator for legal research agents is citation accuracy. General AI models can invent legal citations, citing cases that do not exist or misrepresenting holdings, which is professionally unacceptable. Tools built for legal research ground their answers in legal sources and are designed to show where each answer comes from. Every AI-generated research output should still be verified before it enters client work, and tools that link directly to source material make that verification faster.

Some research agents are built on established legal research content. {{cocounsel.name}} from Thomson Reuters reasons from Westlaw, Practical Law and a firm's own documents. {{lexis-plus-protege.name}} runs agentic workflows over LexisNexis legal content and validates citations with Shepard's Citations. {{harvey-ai.name}} is an enterprise legal AI platform whose Harvey Agents run legal work end to end, and it holds SOC 2 Type II and ISO 27001 certifications. For law firms, the value is throughput: research tasks finish sooner, and partners can get an initial research brief on a new matter faster.`,
  },
  {
    title: 'Contract Review and Analysis',
    description: `Contract review is one of the highest-volume, most time-intensive tasks in legal work. An AI contract review agent can work through large sets of contracts, flagging non-standard clauses, identifying risk provisions, extracting key dates and obligations, comparing language against approved playbook standards, and generating structured review summaries.

The value is not just speed. AI contract review agents are also consistent: they apply the same playbook every time, without the variation that comes from different reviewers interpreting the same provision differently. For M&A due diligence, where legal teams need to review many target company contracts under time pressure, that first pass can shorten the review considerably.

The critical distinction when evaluating contract review tools is whether the agent understands legal language in context, or performs sophisticated keyword matching. Stronger tools can identify when a liability cap is missing, when an assignment clause is unusually broad relative to market standard, or when a termination provision conflicts with another clause, not simply flag that those terms do or do not appear in the document. {{spellbook.name}} is built for transactional lawyers and works inside Word, Google Docs and the web. Contract lifecycle management (approval routing, signature workflows and renewal tracking) is handled by dedicated CLM platforms, which this index does not currently list.`,
  },
  {
    title: 'Firm Operations and Case Workflows',
    description: `Some legal AI agents are built around the workflow of a particular type of practice rather than a single task. Instead of answering one research question or reviewing one contract, they take on a sequence of steps that a firm repeats on every matter.

For plaintiff firms, that sequence often runs from the first client call through to the demand letter. {{eve-legal.name}}, from Butler Labs, is built for plaintiff firms and covers intake calls, medical chronologies, demand letters, discovery and research. Work that would otherwise pass between intake staff, paralegals and attorneys can start from a single structured record of the matter.

Teams that get the most value from workflow agents are typically those where these steps have been handled informally through shared drives, email threads, and spreadsheet trackers. As with every legal AI tool, each output still needs review by the attorney responsible for the matter.`,
  },
  {
    title: 'Document Drafting and Generation',
    description: `AI agents can draft legal documents (memos, briefs, client letters, contract provisions, regulatory submissions, and standard form agreements) faster than drafting from a blank page. Good legal drafting agents maintain consistent legal terminology, structure arguments correctly for the document type, and generate first drafts that lawyers review and refine rather than author from scratch.

The workflow shift is meaningful. A first draft can be generated in minutes and then refined, rather than written from scratch. {{cocounsel.name}} supports drafting from Westlaw, Practical Law and a firm's own documents, and {{spellbook.name}} drafts contract language inside Word and Google Docs. For smaller firms and solo practitioners, AI drafting tools provide leverage that was previously only available to practices large enough to employ multiple junior attorneys.

The important constraint is that AI-generated legal drafts require careful human review before they are used in client work, court filings, or negotiations. The goal is to move the lawyer from blank-page authoring to expert editing, which is a more efficient and higher-value use of legal judgment, not to remove the lawyer from the drafting process entirely.`,
  },
  {
    title: 'Compliance and Regulatory Monitoring',
    description: `Regulatory landscapes change constantly across every sector. Financial services, healthcare, data privacy, employment, and environmental compliance all require in-house legal teams to track changes across multiple jurisdictions, assess their impact on the business, and ensure compliance before enforcement actions occur. This is very hard to do manually at any meaningful breadth.

AI agents built for regulatory monitoring track regulatory publications, government announcements, and regulatory databases, summarize relevant changes, and alert the legal team to developments that require action. Useful tools map regulatory changes against your specific business activities and surface what is relevant to your risk profile, rather than delivering an undifferentiated stream of regulatory news that no one has time to read.

This is an area where purpose-built legal AI tools are still developing. Many current solutions are embedded within broader legal technology platforms rather than available as standalone agents. For teams whose primary need is research and synthesis of regulatory developments, AI research agents provide a practical starting point while the dedicated compliance monitoring market matures.`,
    categoryLink: { href: '/ai-research-agents', label: 'Browse AI Research Agents' },
  },
  {
    title: 'E-Discovery and Document Review',
    description: `E-discovery (the identification, collection, and review of electronically stored information in litigation) involves some of the highest document volumes in legal work. Cases can involve very large volumes of emails, documents, and messages that need to be reviewed for relevance, responsiveness, and privilege. Technology-assisted review is widely used for large-scale discovery.

AI agents process large document sets, apply relevance classifications, flag privileged communications for attorney review, identify high-priority documents, and generate review summaries for human counsel. The result is that attorney review time is concentrated on the documents that actually matter rather than being diluted across everything in the set.

Large-scale e-discovery is primarily an enterprise market with significant integration requirements, and much of its AI is embedded within established review platforms rather than available as standalone agents. For plaintiff firms, {{eve-legal.name}} includes discovery alongside intake and demand letters. Legal teams evaluating this space should look at established platform vendors alongside newer standalone agent approaches.`,
    categoryLink: { href: '/ai-research-agents', label: 'Browse AI Research Agents' },
  },
]

const evaluationCriteria = [
  {
    title: 'Legal-specific grounding, not a general model alone',
    detail: 'The most important question to ask any legal AI vendor. General AI models applied to legal tasks are more prone to invented citations and imprecise legal language than tools grounded in legal content. Ask vendors exactly which legal content their answers draw on, how they check citations, and what testing they have done against general-purpose models. Verify this through your own testing before purchase.',
  },
  {
    title: 'Citation accuracy and source transparency',
    detail: 'Every legal AI output used in client work or filings needs verified citations. Ask whether the agent provides direct links to source material for every claim it makes, whether it explicitly flags low-confidence outputs, and what error rate the vendor has measured for citation accuracy. This should be testable with real examples from your own practice area during any trial period.',
  },
  {
    title: 'Data security and confidentiality practices',
    detail: 'Attorney-client privilege makes data security non-negotiable for legal AI tools. Confirm whether the vendor uses your inputs to train future models, and get the answer committed in the contract. Confirm where data is stored and processed, which security certifications the vendor holds (SOC 2 Type II at minimum), and whether the product meets any data residency requirements your jurisdiction or clients impose.',
  },
  {
    title: 'Integration with your existing legal technology stack',
    detail: 'Legal teams run on specific platforms: iManage, NetDocuments, Clio, various practice management and billing systems. An AI agent that cannot integrate with your document management system creates friction that reduces adoption and limits usefulness. Check native integrations before shortlisting. A tool that requires lawyers to copy-paste content out of your DMS and into an AI interface will not be used consistently.',
  },
  {
    title: 'Pricing model and total cost of ownership',
    detail: 'Many legal AI tools are not publicly priced and require a sales conversation. This is common in the legal technology market but worth planning for when building a business case. Factor in implementation time, training requirements, any professional services fees, and minimum contract terms when calculating total cost of ownership. Check whether pricing is per seat, since per-seat models can become expensive quickly for larger teams.',
  },
]

const chooseRows: { condition: string; slug?: string; recommendation?: string; href?: string }[] = [
  { condition: 'Your primary need is legal research and drafting grounded in Westlaw and Practical Law', slug: 'cocounsel' },
  { condition: 'You want research workflows over LexisNexis content with Shepard\'s Citations validation', slug: 'lexis-plus-protege' },
  { condition: 'You want an enterprise legal AI platform whose agents run legal work end to end', slug: 'harvey-ai' },
  { condition: 'You are a transactional lawyer reviewing and drafting contracts in Word or Google Docs', slug: 'spellbook' },
  { condition: 'You run a plaintiff firm and want help with intake, medical chronologies and demand letters', slug: 'eve-legal' },
  { condition: 'You need compliance monitoring or regulatory research across jurisdictions', recommendation: 'Browse AI Research Agents', href: '/ai-research-agents' },
]

export default async function BestAIAgentsForLegal() {
  const meta = await getGuideMeta('best-ai-agents-for-legal')
  const published = isoDate(meta?.published_at)
  const audited = isoDate(meta?.last_audited_at)
  const updated = updatedLabel(meta?.last_audited_at)

  const supabase = createClient()
  const groups = await getGuideGroups(GUIDE_GROUPS)
  const listed = groups.flatMap((g) => g.agents)

  const refs = await buildRefMap(supabase, GUIDE_SLUGS)
  const t = (text: string) => resolveTemplates(text, refs)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Best AI Agents for Legal Teams (2026)',
    description: 'Legal AI agents for research, contract review and firm operations, from CoCounsel and Harvey AI to Spellbook. Citation accuracy and data security.',
    url: 'https://theaiagentindex.com/resources/guides/best-ai-agents-for-legal',
    author: { '@type': 'Organization', name: 'The AI Agent Index', url: 'https://theaiagentindex.com' },
    publisher: { '@type': 'Organization', name: 'The AI Agent Index', url: 'https://theaiagentindex.com' },
    ...(published ? { datePublished: published } : {}),
    ...(audited ? { dateModified: audited } : {}),
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: t(a) },
    })),
  }

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Best AI Agents for Legal Teams (2026)',
    numberOfItems: listed.length,
    itemListElement: listed.map((agent, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'SoftwareApplication',
        name: agent.name,
        description: agent.short_description,
        url: `https://theaiagentindex.com/agents/${agent.slug}`,
      }
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>

        {/* Breadcrumb */}
        <nav style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8125rem', color: '#6B7280', marginBottom: '2rem' }}>
          <Link href="/" style={{ color: '#6B7280', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link href="/resources/guides" style={{ color: '#6B7280', textDecoration: 'none' }}>Guides</Link>
          <span>/</span>
          <span style={{ color: '#111827' }}>Best AI Agents for Legal Teams</span>
        </nav>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' as const }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Independently Reviewed</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Guide</span>
            <span style={{ fontSize: '0.75rem', color: '#6B7280', padding: '0.25rem 0.75rem', backgroundColor: '#F3F4F6', borderRadius: '9999px' }}>{updated}</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1.5rem' }}>
            Best AI Agents for Legal Teams (2026)
          </h1>

          <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem' }}>
            Legal AI is moving from cautious pilots to day-to-day use. Law firms are deploying AI agents across research, drafting, and document review workflows, and in-house legal teams are using AI to reduce outside counsel spend and increase the output of small internal teams. The question is no longer whether legal teams should use AI: it is which tools are mature enough to trust with real work, and for which specific tasks.
          </p>

          <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem' }}>
            The tools that matter are not general-purpose AI assistants applied to legal tasks. They are built on legal content (case law, statutes, regulatory material, contract language) and designed around the citation and accuracy requirements that professional legal work demands. Tools such as <A s="cocounsel" r={refs} />, which reasons from Westlaw and Practical Law, and <A s="lexis-plus-protege" r={refs} />, which validates citations with Shepard&apos;s Citations, show the difference: grounding and citation checking matter when work product enters client files or court filings.
          </p>

          <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem' }}>
            AI agents are effective at the document-heavy, pattern-recognition work that takes up much of a legal team&apos;s time: research, contract review, due diligence, drafting, and compliance monitoring. They are not effective at the judgment-intensive work that defines legal expertise: client counseling, courtroom advocacy, strategic decision-making, and the application of legal reasoning to novel fact patterns. Legal teams that use AI well let it handle the former so lawyers can concentrate on the latter.
          </p>

          <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.75 }}>
            This guide covers {listed.length} AI agents for legal work, grouped into legal research, contract review and drafting, and firm operations, followed by what to evaluate before purchasing and a decision framework for choosing based on your team&apos;s primary use case. All agents listed have been editorially reviewed.
          </p>
        </div>

        <GuideAgentList groups={GUIDE_GROUPS} />

        {/* Use cases */}
        {useCases.map((useCase, index) => (
          <div key={index} style={{ marginBottom: '2.5rem', border: '1px solid #E5E7EB', borderRadius: '0.75rem', overflow: 'hidden' }}>
            <div style={{ backgroundColor: '#F9FAFB', padding: '1.25rem 1.5rem', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#2563EB', fontVariantNumeric: 'tabular-nums', letterSpacing: '0.02em' }}>{String(index + 1).padStart(2, '0')}</span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', margin: 0 }}>{useCase.title}</h2>
            </div>
            <div style={{ padding: '1.5rem' }}>
              {t(useCase.description).split('\n\n').map((para, i) => (
                <p key={i} style={{ color: '#374151', lineHeight: 1.75, marginBottom: '1rem', fontSize: '0.9375rem' }}>{para}</p>
              ))}

              {useCase.categoryLink && (
                <div style={{ marginTop: '0.5rem', padding: '0.875rem 1rem', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem', color: '#374151' }}>Browse agents for this use case</span>
                  <Link href={useCase.categoryLink.href} style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2563EB', textDecoration: 'none' }}>
                    {useCase.categoryLink.label} &#x2192;
                  </Link>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Newsletter */}
        <div style={{ marginBottom: '2.5rem' }}>
          <NewsletterSignup />
        </div>

        {/* What to look for */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>
            What to look for when evaluating legal AI agents
          </h2>
          <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.75, marginBottom: '1.5rem' }}>
            In legal AI, marketing claims can run ahead of measured capability. These are the criteria that separate tools worth deploying from tools worth avoiding.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.875rem' }}>
            {evaluationCriteria.map((criterion, i) => (
              <div key={i} style={{ padding: '1.25rem', border: '1px solid #E5E7EB', borderRadius: '0.75rem', backgroundColor: 'white' }}>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>{criterion.title}</h3>
                <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.7, margin: 0 }}>{criterion.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How to choose */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>How to choose an AI agent for legal</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.75rem' }}>
            {chooseRows.map((row, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem', padding: '0.875rem 1rem', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.5rem', alignItems: 'flex-start', flexWrap: 'wrap' as const }}>
                <span style={{ fontSize: '0.875rem', color: '#374151', flex: 1 }}>If <strong>{row.condition}</strong></span>
                {row.slug ? (
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2563EB', flexShrink: 0 }}>&#x2192; <A s={row.slug} r={refs} /></span>
                ) : (
                  <Link href={row.href ?? '/'} style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2563EB', textDecoration: 'none', flexShrink: 0 }}>&#x2192; {row.recommendation}</Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '1.25rem' }}>Frequently Asked Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '1rem' }}>
            {faqItems.map(({ q, a }) => (
              <div key={q} style={{ border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.25rem 1.5rem' }}>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>{q}</h3>
                <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.75, margin: 0 }}>{t(a)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related resources */}
        <div style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>Related Resources</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.5rem' }}>
            {[
              { href: '/resources/guides/best-ai-research-agents', label: 'Best AI Research Agents (2026)' },
              { href: '/resources/guides/best-ai-agents-for-finance', label: 'Best AI Agents for Finance and Banking' },
              { href: '/resources/guides/how-to-evaluate-an-ai-agent', label: 'How to Evaluate an AI Agent' },
              { href: '/resources/guides/best-ai-agents-for-startups', label: 'Best AI Agents for Startups' },
              { href: '/ai-research-agents', label: 'Browse All AI Research Agents' },
            ].map((link) => (
              <Link key={link.href} href={link.href} style={{ fontSize: '0.875rem', color: '#2563EB', textDecoration: 'none' }}>&#x2192; {link.label}</Link>
            ))}
          </div>
        </div>

        {/* Methodology */}
        <div style={{ marginBottom: '2rem', padding: '1.25rem', backgroundColor: '#EFF6FF', borderRadius: '0.75rem', border: '1px solid #BFDBFE' }}>
          <p style={{ fontSize: '0.875rem', color: '#1E40AF', lineHeight: 1.7, margin: 0 }}>
            <strong>Methodology:</strong> Agents in this guide are editorially selected based on public reviews, feature depth, security certifications, and category relevance. The legal AI market is still developing and several use cases are currently served mainly by enterprise platforms with embedded AI rather than standalone agents. This guide will be expanded as dedicated legal AI agents accumulate sufficient public data for editorial review. See our <Link href="/methodology" style={{ color: '#2563EB' }}>full methodology</Link>.
          </p>
        </div>

        <GuideCitations slug="best-ai-agents-for-legal" table="guides" />

      </div>
    </>
  )
}
