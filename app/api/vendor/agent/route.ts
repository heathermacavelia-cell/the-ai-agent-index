import { createServiceClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { agent_slug, token } = await req.json()
    if (!agent_slug || !token) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createServiceClient()

    const { data: claim } = await supabase
      .from('agent_claims')
      .select('id, agent_id, access_token_expires')
      .eq('agent_slug', agent_slug)
      .eq('access_token', token)
      .eq('status', 'approved')
      .single()

    if (!claim || !claim.access_token_expires || new Date(claim.access_token_expires) < new Date()) {
      return NextResponse.json({ error: 'Invalid or expired access link. Request a new one from the vendor page.' }, { status: 401 })
    }

    const { data: agent } = await supabase
      .from('agents')
      .select('name, slug, website_url, logo_url, short_description, long_description, pricing_url, vendor_hook, vendor_managed, pricing_model, starting_price, customer_segment, deployment_difficulty, deployment_method, integrations, capability_tags, industry_tags, supported_languages, security_certifications')
      .eq('id', claim.agent_id)
      .single()

    if (!agent) return NextResponse.json({ error: 'Agent not found' }, { status: 404 })

    return NextResponse.json(agent)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}