import { withSentryConfig } from '@sentry/nextjs';
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Link',
            value: '</.well-known/api-catalog>; rel="api-catalog", </sitemap.xml>; rel="sitemap", </llms.txt>; rel="ai-content"',
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      // Bare /agents has no index page and returned a 404, while /agents/<slug>
      // works. Visitors trim the URL by hand to look for a directory, so send them
      // to the real one. Added 2026-08-23.
      // NOTE: this matches ONLY the exact path /agents. Individual agent pages such
      // as /agents/opencode are untouched, because there is no /:slug wildcard here.
      {
        source: '/agents',
        destination: '/find',
        permanent: true,
      },
      {
        source: '/agents/people-ai',
        destination: '/agents/backstory',
        permanent: true,
      },
      {
        source: '/agents/phrasee',
        destination: '/agents/jacquard',
        permanent: true,
      },
      {
        source: '/mcp',
        destination: '/mcp/mcp',
        permanent: true,
      },
      {
        source: '/agents/elicit-systematic',
        destination: '/agents/elicit',
        permanent: true,
      },
      {
        source: '/agents/amazon-codewhisperer',
        destination: '/agents/amazon-q-developer',
        permanent: true,
      },
      {
        source: '/agents/drift',
        destination: '/agents/drift-conversational-marketing',
        permanent: true,
      },
      {
        source: '/alternatives/chatgpt',
        destination: '/alternatives/chatgpt-alternatives',
        permanent: true,
      },
      {
        source: '/alternatives/jasper',
        destination: '/alternatives/jasper-alternatives',
        permanent: true,
      },
      // Both 404 live and both sit in Google's Not found (404) report.
      // Found in the 2026-09-12 GSC audit.
      {
        source: '/alternatives/hubspot-sales-hub-alternatives',
        destination: '/alternatives/hubspot-alternatives',
        permanent: true,
      },
      {
        source: '/alternatives/bamboohr-alternatives',
        destination: '/ai-hr-agents',
        permanent: true,
      },
      // Segment "industry" pages stopped existing on 2026-09-12: B2B, SaaS,
      // SMB and the rest describe company shape, not industry, and the pages
      // were thin or empty. Send them to the category page, which lists every
      // agent in that category, rather than 404ing URLs Google already knows.
      {
        source: '/:category(ai-[a-z-]+-agents)/:segment(b2b|b2c|saas|enterprise|mid-market|smb|startups|agencies|devtools|open-source|cloud|aws|dtc|solo-professionals|career|hr|recruiting)',
        destination: '/:category',
        permanent: true,
      },
    ]
  },
};

export default withSentryConfig(nextConfig, {
  org: "the-ai-agent-index",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  webpack: {
    automaticVercelMonitors: true,
    treeshake: {
      removeDebugLogging: true,
    },
  }
});