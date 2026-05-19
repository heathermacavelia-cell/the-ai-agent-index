import { createServiceClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const supabase = createServiceClient()

  const { data: agents, error } = await supabase
    .from('agents')
    .select('id, slug, github_repo_url')
    .not('github_repo_url', 'is', null)
    .eq('is_active', true)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!agents || agents.length === 0) return NextResponse.json({ updated: 0 })

  const githubHeaders: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'TheAIAgentIndex-StarTracker',
  }

  if (process.env.GITHUB_TOKEN) {
    githubHeaders['Authorization'] = `token ${process.env.GITHUB_TOKEN}`
  }

  let updated = 0
  const errors: string[] = []

  for (const agent of agents) {
    try {
      const match = agent.github_repo_url.match(/github\.com\/([^\/]+\/[^\/\?#]+)/)
      if (!match) continue

      const repoPath = match[1].replace(/\.git$/, '').replace(/\/$/, '')
      const res = await fetch(`https://api.github.com/repos/${repoPath}`, { headers: githubHeaders })

      if (!res.ok) {
        errors.push(`${agent.slug}: ${res.status}`)
        continue
      }

      const data = await res.json()

      await supabase
        .from('agents')
        .update({ github_stars: data.stargazers_count, updated_at: new Date().toISOString() })
        .eq('id', agent.id)

      updated++
    } catch (err) {
      errors.push(`${agent.slug}: ${String(err)}`)
    }
  }

  return NextResponse.json({ updated, total: agents.length, errors: errors.length > 0 ? errors : undefined })
}