import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, query, timeRange } = body;

    // Validate password against environment variable
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword || password !== adminPassword) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServiceClient();

    // Calculate date filter
    const now = new Date();
    switch (timeRange) {
      case '24h': now.setHours(now.getHours() - 24); break;
      case '7d': now.setDate(now.getDate() - 7); break;
      case '30d': now.setDate(now.getDate() - 30); break;
      case '90d': now.setDate(now.getDate() - 90); break;
      default: now.setDate(now.getDate() - 7);
    }
    const since = now.toISOString();

    if (query === 'daily') {
      const { data, error } = await supabase
        .from('traffic_logs')
        .select('window_start, visitor_type, hit_count')
        .gte('window_start', since)
        .order('window_start', { ascending: true });

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ data });
    }

    if (query === 'pages') {
      const { data, error } = await supabase
        .from('traffic_logs')
        .select('path, visitor_type, hit_count')
        .gte('window_start', since);

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ data });
    }

    if (query === 'crawlers') {
      const { data, error } = await supabase
        .from('traffic_logs')
        .select('bot_name, visitor_type, hit_count, path')
        .gte('window_start', since)
        .not('bot_name', 'is', null);

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ data });
    }

    if (query === 'api') {
      const { data, error } = await supabase
        .from('traffic_logs')
        .select('bot_name, hit_count')
        .gte('window_start', since)
        .eq('visitor_type', 'api_consumer');

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ data });
    }

    return NextResponse.json({ error: 'Invalid query' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}