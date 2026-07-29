// Shared vendor-domain rules. One copy, imported by both the submission-approval
// path and the vendor dashboard access path, so the two can never drift apart.

// Free/public mailbox providers: never treat a shared domain as proof of company control.
export const PUBLIC_EMAIL_DOMAINS = new Set([
    'gmail.com', 'googlemail.com', 'outlook.com', 'hotmail.com', 'hotmail.co.uk',
    'live.com', 'msn.com', 'yahoo.com', 'yahoo.co.uk', 'yahoo.ca', 'ymail.com', 'icloud.com',
    'me.com', 'mac.com', 'aol.com', 'proton.me', 'protonmail.com', 'pm.me',
    'gmx.com', 'gmx.net', 'mail.com', 'zoho.com', 'yandex.com', 'yandex.ru',
    'fastmail.com', 'hey.com', 'tutanota.com', 'qq.com', '163.com', '126.com',
  ])
  
  export function normDomain(d: string | null | undefined): string {
    return String(d || '').toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '').trim()
  }
  
  export function emailDomainOf(email: string | null | undefined): string {
    return normDomain(String(email || '').split('@')[1])
  }
  
  // True only when the address is at a real company domain that matches the agent's own.
  export function isCompanyDomainMatch(email: string | null | undefined, agentDomain: string | null | undefined): boolean {
    const e = emailDomainOf(email)
    const a = normDomain(agentDomain)
    if (!e || !a) return false
    if (PUBLIC_EMAIL_DOMAINS.has(e)) return false
    return e === a
  }