// lib/submissionScreen.ts
//
// Spam screening for the /submit form. Three outcomes:
//   auto_reject — logged to rejected_submissions, dropped silently (obvious spam).
//   quarantine  — logged AND emailed to admin, but NOT added to the pending queue
//                 (borderline: a real product could look like this, but rarely does).
//   review      — normal path: inserted as pending + admin notified.
//
// Deliberately NOT blocked on their own (used by legitimate founders):
//   - proton.me, gmail.com, icloud.com, outlook.com and other real mail providers
//   - custom / high pricing, b2b segment, "MCP" wording, etc.

const ANON_FILE_HOSTS = [
  'catbox.moe',
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
  // Anonymous HTML paste/hosting hosts — a "product" on these is never real.
  'pastehtml.dev',
  'pastehtml.com',
  'htmlpasta.com',
  'htmlpreview.github.io',
  'rentry.co',
  'rentry.org',
  'telegra.ph',
  'justpaste.it',
];

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

// Free/anonymous mail — NOT blocked alone, only used to strengthen a crypto combo.
const FREE_OR_ANON_EMAIL = [
  'proton.me',
  'protonmail.com',
  'pm.me',
  'tutanota.com',
  'tuta.io',
  'gmail.com',
  'outlook.com',
  'hotmail.com',
  'icloud.com',
  'yandex.com',
  'gmx.com',
];

const CRYPTO_TERMS =
  /\b(crypto[-\s]?payable|pay(?:able)?\s+in\s+crypto|cryptocurrency|usdt|usdc|\bbtc\b|bitcoin|ethereum|\beth\b|stablecoin|escrow\s+wallet)\b/i;

const REDACTED_TERMS = /\b(redacted|non[-\s]?sensitive)\b.{0,40}\b(workflow|excerpt|input|document)/i;

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

function hasRandomSubdomain(host: string): boolean {
  const label = host.split('.')[0] ?? '';
  if (label.length < 16) return false;
  const hasDigit = /[0-9]/.test(label);
  const hasAlpha = /[a-z]/.test(label);
  const vowels = (label.match(/[aeiou]/g) || []).length;
  const vowelRatio = vowels / label.length;
  return hasDigit && hasAlpha && vowelRatio < 0.25;
}

export type ScreenResult =
  | { action: 'auto_reject'; reason: string }
  | { action: 'quarantine'; flags: string[] }
  | { action: 'review'; flags: string[] };

export function screenSubmission(input: {
  websiteUrl?: string | null;
  contactEmail?: string | null;
  text?: string | null;
}): ScreenResult {
  const host = hostFromUrl(input.websiteUrl);
  const emailDomain = (input.contactEmail || '').split('@')[1]?.toLowerCase() || '';
  const text = input.text || '';
  const randomSub = host ? hasRandomSubdomain(host) : false;
  const cryptoHit = CRYPTO_TERMS.test(text);
  const redactedHit = REDACTED_TERMS.test(text);
  const freeEmail = FREE_OR_ANON_EMAIL.some((b) => domainMatches(emailDomain, b));

  let rawFileUrl = false;
  if (host && input.websiteUrl) {
    try {
      rawFileUrl = /\.(html?|pdf|zip|txt|docx?)$/i.test(new URL(input.websiteUrl).pathname);
    } catch {
      /* ignore */
    }
  }

  // HARD RULE 1 — anonymous file/paste/HTML host as the "website".
  if (host && ANON_FILE_HOSTS.some((b) => domainMatches(host, b))) {
    return {
      action: 'auto_reject',
      reason: `Website is an anonymous file/paste host (${host}), not a product site.`,
    };
  }

  // HARD RULE 2 — disposable/temp-mail contact (NOT proton/gmail/etc).
  if (emailDomain && DISPOSABLE_EMAIL_DOMAINS.some((b) => domainMatches(emailDomain, b))) {
    return {
      action: 'auto_reject',
      reason: `Contact uses a disposable email domain (${emailDomain}).`,
    };
  }

  // HARD RULE 3 — crypto-payment solicitation plus another anonymity signal.
  if (cryptoHit && (freeEmail || randomSub || !host)) {
    return {
      action: 'auto_reject',
      reason: `Crypto-payment solicitation combined with an anonymity signal (${
        randomSub ? 'random-string domain' : !host ? 'no real website' : 'free/anonymous email'
      }).`,
    };
  }

  // Build flags.
  const flags: string[] = [];
  if (rawFileUrl) flags.push('website URL points to a raw file, not a page');
  if (!host) flags.push('website URL missing or unparseable');
  if (randomSub) flags.push('website uses a random-string subdomain');
  if (cryptoHit) flags.push('description mentions crypto payment');
  if (redactedHit) flags.push('asks for redacted workflow/document excerpts');
  if (
    host &&
    emailDomain &&
    !freeEmail &&
    !domainMatches(host, emailDomain) &&
    !host.endsWith('.' + emailDomain) &&
    !emailDomain.endsWith('.' + host)
  ) {
    flags.push('contact email domain does not match website domain');
  }

  // High-concern flags route to quarantine (logged + emailed, not queued).
  // Email/domain mismatch alone is common for legit Gmail founders, so it stays "review".
  const highConcern = randomSub || cryptoHit || redactedHit || rawFileUrl;
  if (highConcern) return { action: 'quarantine', flags };

  return { action: 'review', flags };
}