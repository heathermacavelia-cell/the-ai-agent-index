export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CATEGORY_SLUGS } from '@/lib/taxonomy'
import type { Metadata } from 'next'
import CategoryPageClient from '@/components/CategoryPageClient'

interface Props {
  params: { category: string }
}

interface FAQ {
  q: string
  a: string
}

const CATEGORY_META: Record<string, {
  icon: React.ReactNode
  description: string
  longDescription: string
  bgColor: string
  borderColor: string
  metaTitle: string
  metaDescription: string
  intro: string
  whatItDoes: string
  whoItsFor: string
  whatToLookFor: string
  quickPicks: string
  faqs: FAQ[]
}> = {
  'ai-sales-agents': {
    icon: <img src="/icons/icon-sales.png" alt="AI Sales Agents" style={{ width: '2.5rem', height: '2.5rem', objectFit: 'contain' }} />,
    description: 'Lead generation, outbound automation, pipeline intelligence',
    longDescription: 'AI agents that automate prospecting, outbound email, lead enrichment, CRM workflows, and revenue forecasting.',
    bgColor: '#F0FDF4',
    borderColor: '#BBF7D0',
    metaTitle: 'Best AI Sales Agents (2026)',
    metaDescription: '50+ AI sales agents ranked: Apollo, Gong, Artisan Ava, Instantly, Outreach and more. Independent comparison with verified pricing. Not affiliated.',
    intro: 'AI sales agents are purpose-built tools that automate the most time-consuming parts of the sales process: prospecting, outreach, follow-up, and pipeline management. Unlike general-purpose AI assistants, sales agents integrate directly with CRMs, email platforms, and data enrichment tools to handle the full sales workflow.',
    whatItDoes: 'The best AI sales agents handle lead sourcing and enrichment, write and send personalised outbound sequences, follow up autonomously, qualify inbound leads, update CRM records, and surface pipeline intelligence that helps sales teams prioritise the right accounts.',
    whoItsFor: 'AI sales agents are used by SDRs and BDRs to scale outbound volume, by sales managers to improve pipeline visibility, and by founders running lean go-to-market operations who need to generate pipeline without a full sales team.',
    whatToLookFor: 'When evaluating AI sales agents, look for native CRM integrations (HubSpot, Salesforce), email deliverability features, data accuracy for lead enrichment, personalisation quality, and clear pricing. The most effective tools fit into your existing stack rather than requiring a full workflow rebuild.',
    quickPicks: 'Best autonomous outbound SDR: Artisan Ava or Instantly AI Sales Agent. Best for Salesforce enterprise teams: Salesforce Agentforce. Best free starting point: HubSpot Sales Hub. Best for SMBs: Close CRM from $35/seat. Best for data enrichment and outreach combined: Apollo from $49/seat.',
    faqs: [
      {
        q: 'What is an AI sales agent?',
        a: 'An AI sales agent is software that uses artificial intelligence to autonomously handle sales tasks including prospecting, outbound outreach, lead qualification, follow-up, and CRM updates without requiring human input for each individual action. Unlike traditional sales automation tools that follow rigid rule-based sequences, AI sales agents use LLMs to personalise messaging, adapt to replies, and make decisions throughout the sales workflow.',
      },
      {
        q: 'What are the best AI sales agents in 2026?',
        a: 'The best AI sales agents depend on your use case. For autonomous outbound prospecting, Artisan Ava and Instantly AI Sales Agent are leading options. For Salesforce-native enterprise teams, Salesforce Agentforce provides the deepest CRM integration. For revenue intelligence and pipeline visibility, Gong and Clari are the category standards. For SMBs wanting an affordable all-in-one option, Close CRM and HubSpot Sales Hub offer strong AI capabilities at accessible price points.',
      },
      {
        q: 'How much does an AI sales agent cost?',
        a: 'AI sales agent pricing ranges from free tiers (HubSpot Sales Hub free tier) to $49/seat/month for mid-market platforms like Apollo, to $25,000-$200,000+ per year for enterprise autonomous SDR platforms like Artisan Ava. Most mid-market options fall between $30 and $150 per seat per month. Outreach and Salesloft typically run $130-200+ per user per month at scale. Custom enterprise pricing is common for the most capable autonomous platforms.',
      },
      {
        q: 'Can AI sales agents replace human SDRs?',
        a: 'AI sales agents can handle high-volume, repetitive outbound tasks at scale that would otherwise require multiple SDRs. They work best paired with human reps who focus on complex conversations and relationship-building rather than as a complete replacement. Fully autonomous options like Artisan Ava are increasingly capable at prospecting and first-touch outreach, but human oversight remains important for complex enterprise deals and relationship-sensitive accounts.',
      },
      {
        q: 'What is the difference between an AI sales agent and sales automation?',
        a: 'Traditional sales automation follows rigid rule-based sequences: send email on day 1, follow up on day 3, call on day 7. AI sales agents use LLMs to personalise messaging based on prospect data, adapt to replies and objections, qualify leads dynamically, and make decisions throughout the process. The result is higher personalisation at scale and the ability to handle novel situations that break rigid automation sequences.',
      },
    ],
  },
  'ai-customer-support-agents': {
    icon: <img src="/icons/icon-support.png" alt="AI Customer Support Agents" style={{ width: '2.5rem', height: '2.5rem', objectFit: 'contain' }} />,
    description: 'Ticket resolution, omnichannel support, autonomous helpdesk',
    longDescription: 'AI agents that autonomously resolve support tickets, triage queries, and provide omnichannel customer service at scale.',
    bgColor: '#FAF5FF',
    borderColor: '#E9D5FF',
    metaTitle: 'Best AI Customer Support Agents (2026)',
    metaDescription: 'Compare AI customer support agents: Intercom Fin, Zendesk AI, Sierra, Ada and more. Verified pricing and autonomous resolution rates. Not affiliated.',
    intro: 'AI customer support agents resolve customer queries autonomously without routing every ticket to a human agent. The best tools handle the full resolution lifecycle: understanding the query, retrieving relevant information, taking action where possible, and escalating only when genuinely needed.',
    whatItDoes: 'AI support agents triage and categorise incoming tickets, resolve common queries end-to-end, draft responses for human review, manage omnichannel conversations across chat, email, and social, and surface patterns in support volume that help teams improve their knowledge base.',
    whoItsFor: 'AI support agents are used by SaaS companies scaling customer success without growing headcount, ecommerce businesses managing high ticket volumes, and enterprise teams looking to reduce first response time and cost per resolution.',
    whatToLookFor: 'Look for autonomous resolution rate (how many tickets it closes without human involvement), native integration with your helpdesk (Zendesk, Intercom, Freshdesk), multilingual support if you serve global customers, and transparent pricing that scales predictably with ticket volume.',
    quickPicks: 'Best autonomous resolution rate: Intercom Fin at $0.99/resolution. Best enterprise with governance: Sierra (custom, typically $200K+/year). Best for SMBs and ecommerce: Tidio from free. Best for Zendesk users: Zendesk AI included in Suite plans from $55/agent. Best value mid-market: Freshdesk Freddy AI from $15/agent.',
    faqs: [
      {
        q: 'What is an AI customer support agent?',
        a: 'An AI customer support agent is software that autonomously resolves customer support tickets and queries without routing every conversation to a human agent. The best tools handle the full resolution cycle: understanding the query in natural language, retrieving the answer from a knowledge base, taking action in external systems where needed, and escalating to a human only when the query genuinely requires it.',
      },
      {
        q: 'What autonomous resolution rates can AI support agents achieve?',
        a: 'Leading platforms like Intercom Fin report 50% or higher autonomous resolution for common SaaS support queries. Actual rates depend heavily on query complexity, knowledge base quality, and how well the agent is configured for your specific product and customer base. Simple, repetitive queries (password resets, billing questions, how-to questions) see the highest automation rates.',
      },
      {
        q: 'How is AI support agent pricing structured?',
        a: 'Pricing models vary significantly. Outcome-based pricing charges per resolved ticket (Intercom Fin at $0.99/resolution). Per-seat subscription pricing covers agent users regardless of ticket volume (Zendesk Suite from $55/agent/month). Custom enterprise contracts are common for platforms like Sierra and Ada. Outcome-based pricing aligns cost with value but can be unpredictable at high volume.',
      },
      {
        q: 'What is the difference between an AI chatbot and an AI support agent?',
        a: 'Chatbots follow scripted decision trees and can only handle queries they have been explicitly programmed for. AI support agents use LLMs to understand natural language, retrieve information dynamically from knowledge bases and external systems, take actions like processing refunds or updating account settings, and handle queries they have not been explicitly trained on by reasoning from available context.',
      },
      {
        q: 'Which AI support agents are best for ecommerce?',
        a: 'Tidio integrates directly with Shopify, WooCommerce, and BigCommerce and is widely used by small to mid-size ecommerce stores. Freshdesk Freddy AI covers ecommerce workflows at mid-market scale. For high-volume enterprise ecommerce, Zendesk AI and Ada are the most common choices, with Intercom Fin used by brands that prioritise autonomous resolution rate.',
      },
    ],
  },
  'ai-research-agents': {
    icon: <img src="/icons/icon-research.png" alt="AI Research Agents" style={{ width: '2.5rem', height: '2.5rem', objectFit: 'contain' }} />,
    description: 'Deep research, academic literature, web synthesis',
    longDescription: 'AI agents that conduct multi-step web research, search academic literature, synthesise findings, and generate structured reports.',
    bgColor: '#FFFBEB',
    borderColor: '#FDE68A',
    metaTitle: 'Best AI Research Agents (2026)',
    metaDescription: 'Compare AI research agents: Perplexity, Elicit, Consensus, Harvey AI, NotebookLM and more. Verified pricing and autonomy levels. Not affiliated.',
    intro: 'AI research agents go beyond simple search: they plan multi-step research tasks, retrieve information from multiple sources, synthesise findings, and produce structured outputs. The best tools can conduct systematic literature reviews, monitor competitor activity, and generate research reports in a fraction of the time traditional research takes.',
    whatItDoes: 'Research agents conduct real-time web searches with citations, search and extract data from academic databases, synthesise findings across multiple sources into coherent summaries, track topics over time, and produce structured reports with source attribution.',
    whoItsFor: 'AI research agents are used by analysts and consultants who need comprehensive market intelligence, academics conducting systematic literature reviews, journalists and content teams tracking fast-moving topics, and business teams needing competitive intelligence at scale.',
    whatToLookFor: 'Look for citation quality and source transparency, access to academic databases if you need peer-reviewed research, the ability to handle multi-step research tasks autonomously, and output format flexibility. The most useful research agents produce structured, verifiable outputs rather than unattributed summaries.',
    quickPicks: 'Best for general deep research: Perplexity Pro or ChatGPT Deep Research. Best for academic literature: Elicit or Consensus. Best for legal research: Harvey AI or CoCounsel. Best for document analysis: NotebookLM (free). Best for systematic literature review: Elicit.',
    faqs: [
      {
        q: 'What is an AI research agent?',
        a: 'An AI research agent is software that autonomously conducts multi-step research tasks: planning search queries, searching multiple sources simultaneously, synthesising findings across sources, and producing structured reports with citations. Unlike a standard AI assistant that answers from training data, a research agent actively searches the web and databases in real time to provide current, sourced information.',
      },
      {
        q: 'How do AI research agents differ from standard AI assistants?',
        a: 'Standard AI assistants answer questions from training data with a knowledge cutoff date. AI research agents actively search the web and academic databases in real time, synthesise multiple sources, and produce structured outputs with verifiable citations. They are purpose-built for research workflows rather than general conversation.',
      },
      {
        q: 'What are the best AI research agents for academic use?',
        a: 'Elicit specialises in systematic literature review and academic paper analysis, helping researchers find, summarise, and extract data from peer-reviewed papers. Consensus searches peer-reviewed research directly and aggregates findings across studies. Both provide citations and are designed for evidence-based research workflows. For broader web and academic research combined, Perplexity with its academic search mode is widely used.',
      },
      {
        q: 'How accurate are AI research agents?',
        a: 'Accuracy varies significantly by tool and query type. Tools like Perplexity, Elicit, and Consensus provide source citations that allow direct verification. General-purpose agents that synthesise without citing sources are more prone to hallucination. For critical research, always verify key claims against original sources regardless of which tool you use.',
      },
      {
        q: 'Can AI research agents access academic databases?',
        a: 'Elicit and Consensus index peer-reviewed literature directly and are designed for academic database search. Perplexity has academic search modes that prioritise scholarly sources. General-purpose research agents like ChatGPT Deep Research primarily search the open web rather than paywalled academic databases. For systematic literature reviews requiring comprehensive academic coverage, Elicit is the most purpose-built option.',
      },
    ],
  },
  'ai-marketing-agents': {
    icon: <img src="/icons/icon-marketing.png" alt="AI Marketing Agents" style={{ width: '2.5rem', height: '2.5rem', objectFit: 'contain' }} />,
    description: 'Content creation, SEO, paid media, campaign automation',
    longDescription: 'AI agents that generate marketing content, optimise SEO, automate paid campaigns, and personalise messaging at scale.',
    bgColor: '#FFF1F2',
    borderColor: '#FECDD3',
    metaTitle: 'Best AI Marketing Agents (2026)',
    metaDescription: 'Compare AI marketing agents: Writesonic, Jasper, Copy.ai, Surfer SEO and more. Verified pricing and editorial ratings. Not affiliated.',
    intro: 'AI marketing agents automate the content and campaign workflows that consume the most marketing team time: writing, optimising, scheduling, and analysing. The best tools go beyond content generation to handle full campaign workflows, from brief to distribution, with minimal human intervention.',
    whatItDoes: 'Marketing agents generate and optimise content for web, email, and social, conduct keyword research and SEO analysis, manage and optimise paid media campaigns, personalise messaging at scale, automate campaign scheduling, and surface performance analytics.',
    whoItsFor: 'AI marketing agents are used by lean marketing teams that need to produce high content volume, agencies managing multiple client campaigns, growth teams focused on SEO and content at scale, and ecommerce businesses running complex paid media operations.',
    whatToLookFor: 'Look for brand voice consistency, integration with your existing marketing stack (CMS, ad platforms, email tools), SEO feature depth if content is a primary use case, and whether the tool handles full campaign workflows or just content generation.',
    quickPicks: 'Best for AI SEO and GEO: Writesonic from $79/mo. Best for enterprise content: Jasper. Best for B2B copy and sequences: Copy.ai. Best for social media management: Sprout Social or FeedHive. Best for on-page SEO: Surfer SEO.',
    faqs: [
      {
        q: 'What is an AI marketing agent?',
        a: 'An AI marketing agent is software that autonomously handles marketing workflows including content creation, SEO optimisation, social media scheduling, paid campaign management, and performance analysis. The most advanced tools plan and execute full campaign workflows rather than just assisting with individual tasks like writing.',
      },
      {
        q: 'What is the difference between AI marketing tools and AI marketing agents?',
        a: 'Traditional AI marketing tools assist humans with specific tasks like writing a blog post or suggesting keywords. AI marketing agents go further by autonomously planning and executing marketing workflows: generating content, optimising for search, scheduling posts, and analysing performance with minimal human direction between steps.',
      },
      {
        q: 'Which AI marketing agents are best for SEO in 2026?',
        a: 'Writesonic combines traditional SEO with GEO (Generative Engine Optimisation) for teams optimising for both Google and AI search systems like ChatGPT and Perplexity. Surfer SEO focuses specifically on on-page SEO optimisation and content scoring. For pure content production with SEO built in, Jasper and Copy.ai are widely used at enterprise scale.',
      },
      {
        q: 'How much do AI marketing agents cost?',
        a: 'Pricing ranges from free tiers for basic use to $79/month for tools like Writesonic Starter, $199/month for professional plans with full SEO and GEO tooling, and enterprise custom pricing for agency-scale deployments. Social media and paid media management tools typically use custom enterprise pricing based on accounts managed and ad spend.',
      },
      {
        q: 'Can AI marketing agents replace a content team?',
        a: 'AI marketing agents significantly reduce the human time required for high-volume content production. Most teams use them to scale output rather than replace writers entirely. Human review and editing remains important for brand voice, accuracy, and quality control, particularly for content that carries editorial or regulatory responsibility.',
      },
    ],
  },
  'ai-coding-agents': {
    icon: <img src="/icons/icon-coding.png" alt="AI Coding Agents" style={{ width: '2.5rem', height: '2.5rem', objectFit: 'contain' }} />,
    description: 'Code generation, agentic coding, IDE integration',
    longDescription: 'AI agents that write, review, and refactor code — from inline autocomplete to fully autonomous multi-file engineering tasks.',
    bgColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    metaTitle: 'Best AI Coding Agents (2026)',
    metaDescription: 'Compare AI coding agents: Cursor, GitHub Copilot, Claude Code, OpenHands and more. Verified pricing and autonomy data. Not affiliated.',
    intro: 'AI coding agents have moved well beyond autocomplete. The best tools today handle multi-file refactoring, write and run tests, debug failures, and execute complex engineering tasks with minimal human direction. They integrate directly into development environments and connect to the same tools developers already use.',
    whatItDoes: 'Coding agents provide inline code suggestions and autocomplete, generate entire functions and components from natural language descriptions, review and explain existing code, refactor across multiple files, run tests and debug failures, and in the most advanced cases operate as fully autonomous software engineers.',
    whoItsFor: 'AI coding agents are used by individual developers looking to ship faster, engineering teams increasing throughput without growing headcount, non-technical founders building with AI assistance, and enterprises standardising code quality across large codebases.',
    whatToLookFor: 'Look for IDE integration with your editor of choice, support for your primary programming languages, context window size for large codebase understanding, agentic capability for multi-step tasks, and pricing that fits your usage pattern. Some tools charge per completion, others are flat subscription.',
    quickPicks: 'Best IDE with agentic mode: Cursor. Best for GitHub workflows: GitHub Copilot. Best fully autonomous engineering: Claude Code or OpenHands (73,700+ GitHub stars). Best for full-stack web apps without code: Lovable or Bolt.new. Best open source self-hosted: OpenHands (MIT licence, free).',
    faqs: [
      {
        q: 'What is an AI coding agent?',
        a: 'An AI coding agent is software that uses AI to write, review, debug, and refactor code. The most advanced tools operate as autonomous software engineers: they accept a task description, plan the implementation, write code across multiple files, run tests, debug failures, and iterate until the task is complete without requiring approval at each step.',
      },
      {
        q: 'What is the best AI coding agent in 2026?',
        a: 'The right choice depends on your workflow. For IDE integration with manual control over each change, Cursor and GitHub Copilot are the most widely adopted. For autonomous multi-step engineering tasks where you want the agent to work independently, Claude Code and OpenHands handle complex implementations end-to-end. For building web applications without writing code, Lovable and Bolt.new are the leading no-code options.',
      },
      {
        q: 'How do AI coding agents compare to GitHub Copilot?',
        a: 'GitHub Copilot is primarily an autocomplete and inline suggestion tool that completes code as you type. More advanced AI coding agents like Claude Code, Cursor Agent, and OpenHands handle multi-file changes, run tests, debug failures, and complete entire tasks autonomously rather than just completing individual lines or functions. The distinction is between assistance and autonomy.',
      },
      {
        q: 'Are AI coding agents suitable for production code?',
        a: 'With appropriate human review, yes. Most engineering teams use AI coding agents for first drafts, boilerplate generation, test writing, and well-scoped tasks, with human code review before merging. Fully autonomous deployment to production without human review is not recommended for critical or security-sensitive systems. The current best practice is human-in-the-loop review of AI-generated code before it ships.',
      },
      {
        q: 'What programming languages do AI coding agents support?',
        a: 'Most major AI coding agents support the major languages: Python, JavaScript, TypeScript, Java, Go, Rust, C++, and others. Language support quality varies — agents trained on large open-source corpora tend to perform better on widely-used languages with abundant training data. For less common languages, check specific tool documentation for support quality.',
      },
    ],
  },
  'ai-hr-agents': {
    icon: <img src="/icons/icon-hr.png" alt="AI HR Agents" style={{ width: '2.5rem', height: '2.5rem', objectFit: 'contain' }} />,
    description: 'Hiring, onboarding, payroll automation, compliance, workforce management',
    longDescription: 'AI agents that automate recruiting, onboarding, payroll processing, compliance monitoring, and workforce management across global teams.',
    bgColor: '#F0FDFA',
    borderColor: '#99F6E4',
    metaTitle: 'Best AI HR Agents (2026)',
    metaDescription: 'Compare AI HR agents: Deel, Rippling, Ashby, Greenhouse, Workday and more. Verified pricing and integration depth. Not affiliated.',
    intro: 'AI HR agents automate the administrative and compliance-heavy workflows that consume HR teams: from sourcing and screening candidates to processing payroll and monitoring regulatory compliance. The best tools reduce time-to-hire, eliminate manual data entry, and ensure compliance across multiple jurisdictions automatically.',
    whatItDoes: 'HR agents source and screen candidates, automate interview scheduling, manage onboarding workflows, process payroll with compliance checks, monitor regulatory changes across jurisdictions, handle benefits administration, and surface workforce analytics that help HR teams make better decisions.',
    whoItsFor: 'AI HR agents are used by HR teams at growing companies that need to scale hiring without scaling admin overhead, global companies managing compliance across multiple countries, and lean people operations teams running HR functions with limited headcount.',
    whatToLookFor: 'Look for compliance coverage in the countries where you hire, payroll accuracy guarantees, integration with your existing HRIS and ATS, and whether the tool handles the specific HR workflow you most need to automate. Recruiting, payroll, and compliance tools are quite different in their specialisation.',
    quickPicks: 'Best for global payroll and contractor management: Deel. Best for fast-growing US companies: Rippling from $8/seat. Best structured hiring ATS: Ashby or Greenhouse. Best enterprise HRIS: Workday. Best for SMB all-in-one HR: Rippling.',
    faqs: [
      {
        q: 'What is an AI HR agent?',
        a: 'An AI HR agent is software that automates HR workflows including candidate sourcing and screening, interview scheduling, onboarding, payroll processing, compliance monitoring, and benefits administration. The most advanced platforms handle the full employee lifecycle from hire to offboard, integrating with existing HRIS, ATS, and payroll systems.',
      },
      {
        q: 'What HR tasks can AI agents automate?',
        a: 'AI HR agents handle candidate sourcing and screening at scale, automate interview scheduling across calendars, manage onboarding document collection and e-signing, process multi-country payroll with compliance checks, monitor regulatory changes across jurisdictions, surface workforce analytics for retention risk and headcount planning, and automate benefits administration workflows.',
      },
      {
        q: 'How much do AI HR agents cost?',
        a: 'Pricing varies widely by scope. ATS tools like Ashby typically run $3-5 per employee per month. Full global HR platforms like Deel and Rippling use custom pricing based on headcount and features selected. Enterprise HRIS platforms like Workday are quoted on enterprise contracts typically starting at $150,000+ per year for mid-market deployments.',
      },
      {
        q: 'What is the difference between an ATS and an AI HR agent?',
        a: 'An ATS (Applicant Tracking System) manages the hiring pipeline and tracks candidates through stages. AI HR agents go further by autonomously sourcing candidates from multiple channels, screening applications against job criteria, drafting personalised outreach, and in some cases conducting initial screening conversations. Platforms like Rippling and Deel also extend well beyond hiring to cover the full employee lifecycle.',
      },
      {
        q: 'Which AI HR agents are best for global teams?',
        a: 'Deel is the leading option for international contractor and employee management, covering payroll in 150+ countries with local compliance built in. Rippling is strong for US-headquartered companies with growing global teams. Workday is the enterprise standard for large multinationals with complex multi-country HR requirements.',
      },
    ],
  },
  'ai-workflow-agents': {
    icon: <img src="/icons/icon-workflow.png" alt="AI Workflow Agents" style={{ width: '2.5rem', height: '2.5rem', objectFit: 'contain' }} />,
    description: 'Cross-app orchestration, browser RPA, no-code agent builders',
    longDescription: 'AI agents that orchestrate multi-step workflows across apps, automate browser tasks, and let you build custom agents — the connective layer between your tools.',
    bgColor: '#FFF7ED',
    borderColor: '#FDBA74',
    metaTitle: 'Best AI Workflow Agents (2026)',
    metaDescription: 'Compare AI workflow agents: Zapier, Make, n8n, Skyvern, Lindy and more. Verified pricing, integrations, and autonomy ratings. Not affiliated.',
    intro: 'AI workflow agents are the connective layer between your tools: they orchestrate multi-step processes across apps, automate browser-based tasks, and in some cases let you build entirely custom AI agents without code. Unlike domain-specific agents built for sales or support, workflow agents are cross-functional infrastructure that any team can use.',
    whatItDoes: 'Workflow agents connect apps through automated triggers and actions, automate repetitive browser tasks like scraping and form filling, build custom AI agents from natural language descriptions, orchestrate multi-step processes across CRMs, spreadsheets, email, and communication tools, and handle data transformation and routing between systems.',
    whoItsFor: 'AI workflow agents are used by operations teams connecting fragmented tool stacks, founders and small teams automating manual processes without hiring, agencies managing repeatable workflows across clients, and technical teams building custom AI agents for specific business logic.',
    whatToLookFor: 'Look for the breadth of app integrations, whether the tool supports AI-powered reasoning or just rule-based logic, pricing predictability at your expected volume, self-hosting options if data control matters, and how much technical skill is required. Some tools are pure no-code while others reward coding ability.',
    quickPicks: 'Best for no-code automation: Zapier or Make. Best self-hosted open source: n8n (free). Best AI browser automation: Skyvern from free. Best for building custom AI agents: n8n or Lindy. Best Microsoft 365 integration: Microsoft Copilot Studio.',
    faqs: [
      {
        q: 'What is an AI workflow agent?',
        a: 'An AI workflow agent is software that automates multi-step processes across apps, orchestrates data flows between tools, and in some cases enables you to build custom AI agents without writing code. Unlike traditional automation that follows rigid rules, AI workflow agents use LLM reasoning to handle ambiguous inputs, make decisions mid-workflow, and adapt to unexpected outputs.',
      },
      {
        q: 'What is the difference between Zapier and an AI workflow agent?',
        a: 'Zapier automates rule-based workflows triggered by specific events: when X happens in app A, do Y in app B. AI workflow agents add reasoning to this: they can handle ambiguous inputs, make decisions at each step, adapt when something unexpected happens, and in some cases plan entire workflows from a natural language description. Tools like n8n combine traditional automation with AI reasoning in a single platform.',
      },
      {
        q: 'Which workflow agents are best for non-technical users?',
        a: 'Make and Zapier have the most accessible no-code interfaces and the largest app ecosystems, making them the default choice for non-technical users. Lindy is designed for business users building AI agents with no development background. Claude for Excel and Claude for Word are purpose-built for users working entirely within Microsoft Office.',
      },
      {
        q: 'What is the best self-hosted workflow automation tool?',
        a: 'n8n is the most widely used open-source self-hosted workflow automation platform, offering a visual workflow builder, 400+ integrations, and the ability to run entirely on your own infrastructure with no data leaving your environment. It is free to self-host with an optional cloud plan. Skyvern also offers self-hosted browser automation for teams that need RPA without a SaaS dependency.',
      },
      {
        q: 'How much do AI workflow agents cost?',
        a: 'Pricing ranges from free self-hosted options (n8n, Skyvern free tier) to $16/month for Make Pro, $19/month for Zapier Starter, and enterprise custom pricing for Microsoft Copilot Studio and Tines. Most mid-market teams spend $50-300/month on workflow automation at moderate volumes. High-volume enterprise deployments with many integrations and tasks typically require custom pricing.',
      },
    ],
  },
  'ai-customer-success-agents': {
    icon: <img src="/icons/icon-customer-success.png" alt="AI Customer Success Agents" style={{ width: '2.5rem', height: '2.5rem', objectFit: 'contain' }} />,
    description: 'Churn prevention, health scoring, renewal automation',
    longDescription: 'AI agents that monitor customer health, predict churn, automate renewal workflows, and help CS teams scale without adding headcount.',
    bgColor: '#F0F9FF',
    borderColor: '#BAE6FD',
    metaTitle: 'Best AI Customer Success Agents (2026)',
    metaDescription: 'Compare AI customer success agents: Gainsight, ChurnZero, Vitally, Planhat, Totango and more. Verified pricing and integration depth. Not affiliated.',
    intro: 'AI customer success agents monitor account health, predict churn risk, and automate the renewal and expansion workflows that CS teams struggle to scale manually. Unlike general-purpose AI assistants, these tools are purpose-built for post-sale revenue management, integrating with your CRM, product analytics, and billing data to surface risk signals and trigger action before accounts go dark.',
    whatItDoes: 'AI customer success agents continuously score account health across usage, engagement, and support signals, fire automated playbooks for renewals, escalations, and QBR preparation, surface expansion opportunities, and help small CS teams manage hundreds of accounts proactively rather than reactively.',
    whoItsFor: 'AI customer success agents are used by SaaS companies with recurring revenue models that need to reduce churn without growing CS headcount, mid-market teams scaling from 5 to 50 CSMs, and enterprise CS orgs that need to automate the data aggregation and playbook execution that currently consumes analyst and ops time.',
    whatToLookFor: 'Look for native integration with your CRM and product analytics stack, health score transparency (what signals drive the score), autonomous playbook execution vs. just alerting, pricing that scales predictably with customer count, and implementation time. The best mid-market tools are operational in weeks, not months.',
    quickPicks: 'Best enterprise CS platform: Gainsight. Best for mid-market SaaS: ChurnZero or Vitally. Best for startup and scale-up CSMs: Planhat or Custify. Best health scoring depth: Gainsight or Staircase AI. Best digital-first CS: Vitally.',
    faqs: [
      {
        q: 'What is an AI customer success agent?',
        a: 'An AI customer success agent is software that monitors account health, predicts churn risk, and automates renewal and expansion workflows for post-sale revenue management. These platforms aggregate signals from product usage, support tickets, NPS scores, and stakeholder engagement to score accounts by health and trigger automated playbooks when intervention is needed.',
      },
      {
        q: 'What is the difference between a CRM and a customer success platform?',
        a: 'CRMs like Salesforce and HubSpot manage sales pipeline and store customer records. Customer success platforms like Gainsight and ChurnZero focus specifically on post-sale account health: they ingest product usage data, track engagement signals, score churn risk, manage renewal timelines, and trigger CS playbooks autonomously. They are designed to answer "which accounts are at risk right now" rather than "what is the pipeline value."',
      },
      {
        q: 'How do AI customer success agents predict churn?',
        a: 'They aggregate signals from multiple sources including product usage frequency and depth, support ticket volume and sentiment, NPS and CSAT scores, stakeholder engagement (email replies, meeting attendance), and contract data (days to renewal, expansion or contraction history). AI models trained on these signals score each account by churn probability, with high-risk accounts triggering automated alerts and intervention playbooks.',
      },
      {
        q: 'How much do AI customer success platforms cost?',
        a: 'Pricing is typically custom-quoted based on the number of accounts managed or CSM seats. Enterprise platforms like Gainsight typically run $25,000-$150,000+ per year. Mid-market options like Vitally, Planhat, and Custify are more accessible but still primarily custom-quoted, generally ranging from $1,000-$5,000 per month for growing SaaS companies. Most require a discovery call before pricing is shared.',
      },
      {
        q: 'Can AI customer success agents work for small CS teams?',
        a: 'Yes. Tools like Planhat, Custify, Vitally, and Staircase AI are specifically designed for smaller CS teams that need to manage a high ratio of accounts per CSM. They automate health scoring, trigger playbooks when thresholds are hit, and surface the most at-risk accounts each morning so a small team can act proactively without manual data aggregation. Implementation time for these tools is typically 2-8 weeks rather than the 3-6 month enterprise deployments required by Gainsight.',
      },
    ],
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const meta = CATEGORY_META[params.category]
  if (!meta) return {}
  const url = 'https://theaiagentindex.com/' + params.category
  return {
    title: meta.metaTitle,
    description: meta.metaDescription,
    openGraph: {
      title: meta.metaTitle,
      description: meta.metaDescription,
      url,
      type: 'website',
      siteName: 'The AI Agent Index',
    },
    twitter: {
      card: 'summary',
      title: meta.metaTitle,
      description: meta.metaDescription,
    },
    alternates: { canonical: url },
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category } = params
  const validSlugs = Object.values(CATEGORY_SLUGS)
  if (!validSlugs.includes(category)) notFound()

  const displayName = Object.entries(CATEGORY_SLUGS).find(([, slug]) => slug === category)?.[0] ?? category
  const meta = CATEGORY_META[category]

  const supabase = createClient()
  const { data: agents } = await supabase
    .from('agents')
    .select('*')
    .eq('primary_category', category)
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .order('rating_avg', { ascending: false })

  const agentList = agents ?? []

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: meta?.metaTitle,
    description: meta?.metaDescription,
    url: 'https://theaiagentindex.com/' + category,
    numberOfItems: agentList.length,
    itemListElement: agentList.slice(0, 10).map((agent, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: agent.name,
      description: agent.short_description,
      url: 'https://theaiagentindex.com/agents/' + agent.slug,
    })),
  }

  const faqJsonLd = meta?.faqs && meta.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: meta.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  } : null

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}

      {/* Hero */}
      <section style={{ backgroundColor: meta?.bgColor ?? '#F9FAFB', borderBottom: '1px solid', borderColor: meta?.borderColor ?? '#E5E7EB', padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6B7280', marginBottom: '1.5rem' }}>
            <Link href="/" style={{ color: '#6B7280', textDecoration: 'none' }}>Home</Link>
            <span style={{ color: '#D1D5DB' }}>/</span>
            <span style={{ color: '#111827' }}>{displayName}</span>
          </nav>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', marginBottom: '2rem' }}>
            <div style={{ width: '3.5rem', height: '3.5rem', backgroundColor: 'white', border: '1px solid', borderColor: meta?.borderColor ?? '#E5E7EB', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
              {meta?.icon ?? '🤖'}
            </div>
            <div>
              <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>{meta?.metaTitle ?? displayName}</h1>
              <p style={{ color: '#6B7280', maxWidth: '680px', lineHeight: 1.6, fontSize: '0.9375rem' }}>{meta?.intro}</p>
            </div>
          </div>

          {/* Content grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
            <div style={{ background: 'white', border: '1px solid', borderColor: meta?.borderColor ?? '#E5E7EB', borderRadius: '0.75rem', padding: '1.25rem' }}>
              <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>What it does</p>
              <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.6 }}>{meta?.whatItDoes}</p>
            </div>
            <div style={{ background: 'white', border: '1px solid', borderColor: meta?.borderColor ?? '#E5E7EB', borderRadius: '0.75rem', padding: '1.25rem' }}>
              <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Who it&apos;s for</p>
              <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.6 }}>{meta?.whoItsFor}</p>
            </div>
            <div style={{ background: 'white', border: '1px solid', borderColor: meta?.borderColor ?? '#E5E7EB', borderRadius: '0.75rem', padding: '1.25rem' }}>
              <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>What to look for</p>
              <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.6 }}>{meta?.whatToLookFor}</p>
            </div>
          </div>

          {/* Quick picks */}
          {meta?.quickPicks && (
            <div style={{ marginTop: '1rem', padding: '1rem 1.25rem', backgroundColor: 'white', border: '1px solid', borderColor: meta.borderColor, borderRadius: '0.75rem' }}>
              <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Our picks: </span>
              <span style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.6 }}>{meta.quickPicks}</span>
            </div>
          )}
        </div>
      </section>

      <section style={{ padding: '2rem 1.5rem 4rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <CategoryPageClient agents={agentList} categorySlug={category} />

          {/* FAQ section */}
          {meta?.faqs && meta.faqs.length > 0 && (
            <div style={{ marginTop: '4rem', paddingTop: '3rem', borderTop: '1px solid #E5E7EB' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '2rem', letterSpacing: '-0.01em' }}>
                Frequently asked questions
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                {meta.faqs.map((faq, i) => (
                  <div key={i} style={{ borderBottom: i < meta.faqs.length - 1 ? '1px solid #F3F4F6' : 'none', paddingBottom: i < meta.faqs.length - 1 ? '1.75rem' : 0 }}>
                    <h3 style={{ fontWeight: 600, color: '#111827', marginBottom: '0.625rem', fontSize: '1rem', lineHeight: 1.4 }}>{faq.q}</h3>
                    <p style={{ color: '#4B5563', fontSize: '0.9375rem', lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}