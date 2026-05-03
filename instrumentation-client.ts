// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://28b68028f9d7e5aa444ba940afc31a1f@o4511230485790720.ingest.us.sentry.io/4511230493196288",

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,
  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,

  // Filter out expected post-deploy chunk load errors. These fire when a user has
  // an old build cached or open in a tab during a new deploy — the browser tries
  // to load JS chunks with old hashes that no longer exist on the new deploy.
  // ChunkLoadErrorHandler component auto-reloads the page when these fire, so the
  // user gets a working experience; we just don't want the noise in Sentry.
  ignoreErrors: [
    'ChunkLoadError',
    /Loading chunk \d+ failed/,
    /Loading CSS chunk \d+ failed/,
    /failed to fetch dynamically imported module/,
    /Importing a module script failed/,
  ],
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;