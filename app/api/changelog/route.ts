import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = createClient();

  const { count: totalAgents } = await supabase
    .from('agents')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  const { data: recentAdditions } = await supabase
    .from('agents')
    .select('slug, name, primary_category, created_at')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(30);

  const { data: recentUpdates } = await supabase
    .from('agents')
    .select('slug, name, primary_category, created_at, updated_at')
    .eq('is_active', true)
    .order('updated_at', { ascending: false })
    .limit(20);

  const now = new Date().toISOString();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const changelog = {
    generated_at: now,
    directory: 'The AI Agent Index',
    description: 'A structured, machine-readable directory of AI agents for business automation.',
    url: 'https://theaiagentindex.com',
    api_version: '1.0',
    stats: {
      total_agents: totalAgents ?? 0,
      as_of: now,
    },
    recent_additions: (recentAdditions ?? [])
      .filter((a) => new Date(a.created_at) > thirtyDaysAgo)
      .map((a) => ({
        name: a.name,
        slug: a.slug,
        url: `https://theaiagentindex.com/agents/${a.slug}`,
        category: a.primary_category,
        added_at: a.created_at,
      })),
    recent_updates: (recentUpdates ?? [])
      .filter((a) => {
        const updated = new Date(a.updated_at).getTime();
        const created = new Date(a.created_at).getTime();
        return updated - created > 60000;
      })
      .map((a) => ({
        name: a.name,
        slug: a.slug,
        url: `https://theaiagentindex.com/agents/${a.slug}`,
        category: a.primary_category,
        updated_at: a.updated_at,
      })),
  };

  return NextResponse.json(changelog, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600',
      'Content-Type': 'application/json',
    },
  });
}