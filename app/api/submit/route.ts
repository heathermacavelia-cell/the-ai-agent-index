import { createClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, developer, website_url, short_description, long_description, primary_category, pricing_model, starting_price, customer_segment, submitter_email } = body

    if (!name?.trim() || !developer?.trim() || !short_description?.trim() || !primary_category || !pricing_model || !customer_segment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!submitter_email || !emailRegex.test(submitter_email)) {
      return NextResponse.json({ error: 'Valid contact email required' }, { status: 400 })
    }

    const supabase = createClient()

    let slug = slugify(name)
    const { data: existing } = await supabase.from('agents').select('slug').eq('slug', slug).single()
    if (existing) slug = slug + '-' + Date.now().toString().slice(-4)

    const searchText = [name, developer, short_description, long_description ?? ''].join(' ')

    const { error } = await supabase.from('agents').insert({
      name: name.trim(),
      slug,
      developer: developer.trim(),
      website_url: website_url?.trim() || null,
      short_description: short_description.trim(),
      long_description: long_description?.trim() || null,
      primary_category,
      pricing_model,
      starting_price: starting_price ? parseFloat(starting_price) : null,
      customer_segment,
      industry_tags: [],
      capability_tags: [],
      is_active: true,
      is_featured: false,
      is_verified: false,
      rating_avg: 0,
      rating_count: 0,
      editorial_rating: null,
      search_text: searchText,
    })

    if (error) throw error
    return NextResponse.json({ success: true, slug })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Submission failed' }, { status: 500 })
  }
}