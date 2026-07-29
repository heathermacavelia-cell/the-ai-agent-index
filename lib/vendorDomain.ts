// Shared vendor-domain rules. One copy, imported by both the submission-approval
// path and the vendor dashboard access path, so the two can never drift apart.

// Global providers that operate under many country domains. Matched by prefix,
// so yahoo.de, yahoo.co.jp, hotmail.fr, live.co.uk and gmx.at are all covered.
const PUBLIC_EMAIL_FAMILIES = /^(yahoo|ymail|rocketmail|hotmail|outlook|live|msn|gmx|aol|icloud)\./

// Free/public mailboxes that do not follow a family pattern.
export const PUBLIC_EMAIL_DOMAINS = new Set([
  'gmail.com', 'googlemail.com', 'me.com', 'mac.com',
  'proton.me', 'protonmail.com', 'protonmail.ch', 'pm.me',
  'mail.com', 'email.com', 'usa.com', 'zoho.com', 'zohomail.com',
  'yandex.com', 'yandex.ru', 'mail.ru', 'inbox.ru', 'bk.ru', 'list.ru',
  'fastmail.com', 'fastmail.fm', 'hey.com', 'tutanota.com', 'tuta.io',
  'web.de', 't-online.de', 'freenet.de', 'orange.fr', 'wanadoo.fr',
  'free.fr', 'laposte.net', 'sfr.fr', 'libero.it', 'virgilio.it',
  'seznam.cz', 'wp.pl', 'o2.pl', 'interia.pl', 'bol.com.br', 'uol.com.br',
  'naver.com', 'daum.net', 'hanmail.net', 'nate.com',
  'qq.com', 'foxmail.com', '163.com', '126.com', '139.com',
  'sina.com', 'sina.cn', 'sohu.com', 'aliyun.com',
  'rediffmail.com', 'sify.com', 'shaw.ca', 'rogers.com', 'sympatico.ca',
  'bell.net', 'telus.net', 'videotron.ca', 'btinternet.com', 'sky.com',
  'comcast.net', 'verizon.net', 'att.net', 'cox.net', 'charter.net',
  'bigpond.com', 'optusnet.com.au', 'xtra.co.nz',
])

export function normDomain(d: string | null | undefined): string {
  return String(d || '').toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '').trim()
}

export function emailDomainOf(email: string | null | undefined): string {
  return normDomain(String(email || '').split('@')[1])
}

// A shared mailbox domain is never proof of company control.
export function isPublicEmailDomain(d: string | null | undefined): boolean {
  const domain = normDomain(d)
  if (!domain) return false
  return PUBLIC_EMAIL_DOMAINS.has(domain) || PUBLIC_EMAIL_FAMILIES.test(domain)
}

// True only when the address is at a real company domain that matches the agent's own.
export function isCompanyDomainMatch(email: string | null | undefined, agentDomain: string | null | undefined): boolean {
  const e = emailDomainOf(email)
  const a = normDomain(agentDomain)
  if (!e || !a) return false
  if (isPublicEmailDomain(e)) return false
  return e === a
}