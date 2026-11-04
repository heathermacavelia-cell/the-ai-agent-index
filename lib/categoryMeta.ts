import { buildRefMap, collectTemplateSlugs, resolveTemplates } from '@/lib/templates'
import { createClient } from '@/lib/supabase'
import { trustLine } from '@/lib/trustLine'

/**
 * A category page's title and search description.
 *
 * The columns meta_title_template and meta_description_template hold the wording with three kinds
 * of placeholder, so nothing in them goes stale:
 *   {{count}}      live number of active agents in the category
 *   {{year}}       the current year
 *   {{slug.name}}  a listing's current name, so a rename carries through
 * A row with no template falls back to the older typed meta_title and meta_description.
 */
export async function categoryMeta(
  row: { slug: string; meta_title: string; meta_description: string; meta_title_template?: string | null; meta_description_template?: string | null },
  count: number | null,
): Promise<{ title: string; description: string }> {
  const titleT = row.meta_title_template
  const descT = row.meta_description_template
  // No live count means the typed wording is the only honest thing left to print.
  if (!titleT || !descT || count == null) {
    return { title: row.meta_title, description: trustLine(row.meta_description) }
  }
  const year = String(new Date().getFullYear())
  const fill = (s: string) => s.replace(/\{\{count\}\}/g, String(count)).replace(/\{\{year\}\}/g, year)
  const supabase = createClient()
  const refs = await buildRefMap(supabase, collectTemplateSlugs([titleT, descT]))
  return {
    title: resolveTemplates(fill(titleT), refs),
    description: trustLine(resolveTemplates(fill(descT), refs)),
  }
}
