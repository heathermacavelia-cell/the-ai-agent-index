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