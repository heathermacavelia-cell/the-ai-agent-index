// Supabase returns at most 1,000 rows per request. Any count built from a
// plain select silently stops at 1,000 rows, which is how the Advertise page
// came to show "1K+ AI reads". This helper pages through every row.
//
// The builder MUST order by every selected column. Rows that tie on all of
// them are identical in what we read, so page boundaries cannot skip or
// double-count a value.

type Page<T> = PromiseLike<{ data: T[] | null; error: { message: string } | null }>

export async function fetchAllRows<T>(
  build: (from: number, to: number) => Page<T>,
  pageSize = 1000,
  maxPages = 500,
): Promise<{ data: T[]; error: string | null }> {
  const all: T[] = []
  for (let page = 0; page < maxPages; page++) {
    const from = page * pageSize
    const { data, error } = await build(from, from + pageSize - 1)
    if (error) return { data: all, error: error.message }
    const rows = data ?? []
    all.push(...rows)
    if (rows.length < pageSize) break
  }
  return { data: all, error: null }
}
