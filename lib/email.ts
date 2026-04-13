import { createServiceClient } from '@/lib/supabase'
import { Resend } from 'resend'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://theaiagentindex.com'

interface SendEmailParams {
  to: string
  subject: string
  html: string
  source?: string
}

export async function sendEmail({ to, subject, html, source = 'transactional' }: SendEmailParams) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const supabase = createServiceClient()

  // Upsert subscriber and get token
  const { data: subscriber } = await supabase
    .from('newsletter_subscribers')
    .upsert({ email: to.toLowerCase().trim(), source }, { onConflict: 'email', ignoreDuplicates: true })
    .select('token')
    .single()

  // Fetch token if upsert didn't return it
  let token = subscriber?.token
  if (!token) {
    const { data } = await supabase
      .from('newsletter_subscribers')
      .select('token')
      .eq('email', to.toLowerCase().trim())
      .single()
    token = data?.token
  }

  const unsubscribeUrl = token
    ? `${SITE_URL}/unsubscribe?token=${token}`
    : `${SITE_URL}/unsubscribe`

  return resend.emails.send({
    from: 'The AI Agent Index <hello@theaiagentindex.com>',
    to,
    subject,
    html: html + `
      <div style="margin-top:2rem;padding-top:1rem;border-top:1px solid #E5E7EB;">
        <p style="font-size:0.75rem;color:#9CA3AF;margin:0;">
          The AI Agent Index · 
          <a href="${unsubscribeUrl}" style="color:#9CA3AF;">Unsubscribe</a>
        </p>
      </div>
    `,
    headers: {
      'List-Unsubscribe': `<${unsubscribeUrl}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
  })
}