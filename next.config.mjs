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
      // Permanent redirects for renamed agent slugs.
      // Each entry preserves SEO equity from the old URL.
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