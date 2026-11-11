export const dynamic = 'force-dynamic'
import { createServiceClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? ''

export async function GET(req: NextRequest) {
  const pass = req.headers.get('x-admin-password')
  if (pass !== ADMIN_PASSWORD) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('agents')
    .select('id, name, slug, developer, primary_category, website_url, pricing_model, starting_price, short_description, last_verified_at, verified_by, is_active, editorial_rating, is_affiliate, vendor_managed, submitted_tier')
    .eq('is_active', true)
    .order('last_verified_at', { ascending: true, nullsFirst: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Free listings have no re-audit timeline (listing-tier ruling 7). A free
  // listing is one that was never audited (no last_verified_at) on the free
  // tier. Paid tiers (review, managed, legacy), affiliates and vendor-managed
  // rows always stay in the queue, even before their first audit.
  const queue = (data ?? []).filter((a: { last_verified_at: string | null; submitted_tier: string | null; is_affiliate: boolean; vendor_managed: boolean }) =>
    a.last_verified_at || a.is_affiliate || a.vendor_managed || (a.submitted_tier && a.submitted_tier !== 'self')
  )
  return NextResponse.json(queue)
}