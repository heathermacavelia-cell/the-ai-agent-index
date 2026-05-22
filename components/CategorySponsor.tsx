import { createClient } from '@/lib/supabase'

export default async function CategorySponsor({ categorySlug }: { categorySlug: string }) {
  const supabase = createClient()
  const today = new Date().toISOString().split('T')[0]

  const { data: sponsor } = await supabase
    .from('sponsors')
    .select('*')
    .eq('category_slug', categorySlug)
    .eq('tier', 'category')
    .eq('is_active', true)
    .lte('start_date', today)
    .or(`end_date.is.null,end_date.gte.${today}`)
    .maybeSingle()

  if (!sponsor) return null

  const { data: agent } = await supabase
    .from('agents')
    .select('name, starting_price, pricing_model')
    .eq('slug', sponsor.agent_slug as string)
    .maybeSingle()

  const bgColor = (sponsor.banner_bg_color as string) ?? '#1e293b'

  const pricingLabel = (() => {
    const price = agent?.starting_price as number | null
    const model = agent?.pricing_model as string | null
    if (!price && model === 'free') return 'Free'
    if (!price) return 'Custom pricing'
    return `From $${price}/mo`
  })()

  const highlights = (sponsor.feature_highlights as string[] | null) ?? []
  const agentName = (agent?.name as string) ?? ''

  return (
    <div className="mb-8 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
      <div
        className="relative flex items-center justify-center min-h-[140px] px-8 py-8"
        style={{ backgroundColor: bgColor }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/20 pointer-events-none" />
        {sponsor.banner_image_url && (
          <div
            className="absolute inset-0 opacity-10 bg-center bg-cover pointer-events-none"
            style={{ backgroundImage: `url(${sponsor.banner_image_url as string})` }}
          />
        )}
        <span className="absolute top-3 right-3 z-10 text-[10px] font-medium tracking-widest uppercase text-white/50 bg-black/20 px-2 py-1 rounded-full">
          Category Sponsor
        </span>
        {sponsor.logo_url ? (
          <img
            src={sponsor.logo_url as string}
            alt={agentName}
            className="relative z-10 h-16 w-auto max-w-[280px] object-contain"
          />
        ) : (
          <span className="relative z-10 text-white text-4xl font-bold tracking-tight">
            {agentName}
          </span>
        )}
      </div>
      <div className="bg-white border-t border-slate-100 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-900 text-base mb-0.5">{agentName}</p>
          {sponsor.tagline && (
            <p className="text-sm text-slate-500 leading-snug mb-2">{sponsor.tagline as string}</p>
          )}
          {highlights.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {highlights.slice(0, 3).map((item, i) => (
                <span key={i} className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
          <div className="sm:text-right">
            <p className="text-sm font-semibold text-slate-900">{pricingLabel}</p>
            {sponsor.social_proof && (
              <p className="text-xs text-slate-400">{sponsor.social_proof as string}</p>
            )}
          </div>
          <a href={sponsor.cta_url as string} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-semibold whitespace-nowrap">
            {sponsor.cta_text as string}
          </a>
        </div>
      </div>
    </div>
  )
}