// lib/submissionScreen.ts
//
// Conservative spam screening for the /submit form.
// It ONLY auto-rejects on signals that a legitimate product could never trip:
//   1. The "website" is an anonymous file/paste host (catbox.moe, file.io, etc.)
//   2. The contact email is a true disposable/temp-mail domain
// Everything weaker is returned as a soft flag and still goes to human review.
//
// Deliberately NOT blocked (these are used by legitimate founders):
//   - proton.me, gmail.com, icloud.com, outlook.com and other real mail providers
//   - custom / high pricing, b2b segment, "MCP" wording, etc.

const ANON_FILE_HOSTS = [
    'catbox.moe',        // covers files.catbox.moe and litterbox.catbox.moe
    'file.io',
    'anonfiles.com',
    'gofile.io',
    'bashupload.com',
    'tmpfiles.org',
    'filebin.net',
    '0x0.st',
    'x0.at',
    'oshi.at',
    'uguu.se',
    'temp.sh',
    'transfer.sh',
    'pastebin.com',
    'paste.ee',
    'controlc.com',
    'ghostbin.com',
  ];
  
  // True throwaway mail only. proton.me / gmail.com / etc. are intentionally absent.
  const DISPOSABLE_EMAIL_DOMAINS = [
    'mailinator.com',
    'guerrillamail.com',
    '10minutemail.com',
    'tempmail.com',
    'temp-mail.org',
    'yopmail.com',
    'trashmail.com',
    'sharklasers.com',
    'getnada.com',
    'dispostable.com',
  ];
  
  function hostFromUrl(raw?: string | null): string | null {
    if (!raw) return null;
    try {
      const u = new URL(raw.trim());
      return u.hostname.toLowerCase().replace(/^www\./, '');
    } catch {
      return null;
    }
  }
  
  function domainMatches(host: string, blocked: string): boolean {
    return host === blocked || host.endsWith('.' + blocked);
  }
  
  export type ScreenResult =
    | { action: 'auto_reject'; reason: string }
    | { action: 'review'; flags: string[] };
  
  export function screenSubmission(input: {
    websiteUrl?: string | null;
    contactEmail?: string | null;
  }): ScreenResult {
    const host = hostFromUrl(input.websiteUrl);
    const emailDomain = (input.contactEmail || '').split('@')[1]?.toLowerCase() || '';
  
    // HARD RULE 1 — anonymous file/paste host as the "website".
    if (host && ANON_FILE_HOSTS.some((b) => domainMatches(host, b))) {
      return {
        action: 'auto_reject',
        reason: `Website is an anonymous file host (${host}), not a product site.`,
      };
    }
  
    // HARD RULE 2 — disposable/temp-mail contact (NOT proton/gmail/etc).
    if (emailDomain && DISPOSABLE_EMAIL_DOMAINS.some((b) => domainMatches(emailDomain, b))) {
      return {
        action: 'auto_reject',
        reason: `Contact uses a disposable email domain (${emailDomain}).`,
      };
    }
  
    // SOFT FLAGS — never auto-reject, just annotate for the human reviewer.
    const flags: string[] = [];
    if (host && input.websiteUrl) {
      try {
        const path = new URL(input.websiteUrl).pathname;
        if (/\.(html?|pdf|zip|txt|docx?)$/i.test(path)) {
          flags.push('website URL points to a raw file, not a page');
        }
      } catch {
        /* ignore */
      }
    }
    if (!host) flags.push('website URL missing or unparseable');
  
    return { action: 'review', flags };
  }