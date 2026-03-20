import { createClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import ClaimForm from '@/components/ClaimForm'

interface Props {
  params: { slug: string }
}

export default async function ClaimPage({ params }: Props) {
  const supabase = createClient()
  const { data: agent } = await supabase
    .from('agents')
    .select('id, name, slug, developer, is_verified')
    .eq('slug', params.slug)
    .single()

  if (!agent) notFound()

  if (agent.is_verified) {
    return (
      <div style={{ maxWidth: '520px', margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '16px' }}>Already verified</div>
        <h1 style={{ fontWeight: 700, fontSize: '1.25rem', color: '#111827', marginBottom: '8px' }}>This listing has already been claimed and verified.</h1>
      </div>
    )
  }

  return <ClaimForm agent={agent} />
}
