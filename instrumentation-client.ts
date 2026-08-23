// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://28b68028f9d7e5aa444ba940afc31a1f@o4511230485790720.ingest.us.sentry.io/4511230493196288",

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 0.1,
  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,

  ignoreErrors: [
    // --- Expected post-deploy chunk load errors ---
    // These fire when a user has an old build cached or open in a tab during a new
    // deploy — the browser tries to load JS chunks with old hashes that no longer
    // exist on the new deploy. ChunkLoadErrorHandler component auto-reloads the page
    // when these fire, so the user gets a working experience; we just don't want the
    // noise in Sentry.
    'ChunkLoadError',
    /Loading chunk \d+ failed/,
    /Loading CSS chunk \d+ failed/,
    /failed to fetch dynamically imported module/,
    /Importing a module script failed/,

    // --- Third-party errors that occur inside our pages but are not our code ---
    // Added 2026-08-23 after a review of all 9 open Sentry issues found 7 of them
    // originated in browser extensions, userscripts, or link scanners. None of them
    // are actionable by us and none correspond to a page failing to render.

    // Microsoft Office / Outlook "SafeLinks" scanner. Fires when a link to the site
    // is opened from Outlook. Verified against JAVASCRIPT-NEXTJS-N.
    'Object Not Found Matching Id',

    // A browser extension injecting its content script into the page twice, so its
    // own top-level `const` is declared a second time. Verified against
    // JAVASCRIPT-NEXTJS-7: the identifier in question ('originalQuery') appears
    // ZERO times in our server HTML and zero times in the live DOM. Kept as a
    // general pattern because different extensions collide on different names.
    /Identifier '.*' has already been declared/,

    // React's DOM node is removed out from under it by a translation extension or
    // userscript that rewrote the DOM. Verified against JAVASCRIPT-NEXTJS-X, whose
    // stack contains `app:///userscript.html`.
    "Failed to execute 'removeChild' on 'Node'",

    // Tampermonkey-style userscripts rejecting with a raw GM_xmlhttpRequest
    // response object. Matched on the distinctive key list rather than on
    // "promise rejection with keys" generally, so that a genuine rejection of ours
    // would still be reported. Verified against JAVASCRIPT-NEXTJS-Z.
    /promise rejection with keys: context, finalUrl/,
  ],

  // Drop events whose topmost stack frame lives in code we do not ship.
  // Added 2026-08-23. See the note on translate.goog below before removing.
  denyUrls: [
    // Google Translate's proxy (theaiagentindex-com.translate.goog) and the
    // translate_http bundle it injects. Verified against JAVASCRIPT-NEXTJS-10,
    // where every frame was inside Google's own el_main bundle and the triggering
    // event was `goog-gt-popupShown`.
    //
    // TRADEOFF: if one of our pages ever breaks specifically for visitors reading
    // it through Google Translate, we will not hear about it. Accepted because all
    // observed events came from Google's popup code, not ours.
    /translate\.goog/,
    /translate_http/,

    // Browser extensions and userscript managers.
    /^chrome-extension:\/\//,
    /^moz-extension:\/\//,
    /^safari-(web-)?extension:\/\//,
    /userscript\.html/,
  ],
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;