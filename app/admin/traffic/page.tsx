'use client';

import { useEffect, useState, useCallback } from 'react';

// ============================================
// ADMIN TRAFFIC DASHBOARD
// Authenticates via /api/admin/traffic using
// ADMIN_PASSWORD environment variable
// ============================================

interface DailyStats {
  date: string;
  human: number;
  ai_crawler: number;
  search_bot: number;
  api_consumer: number;
}

interface PageStats {
  path: string;
  human_hits: number;
  bot_hits: number;
  total_hits: number;
}

interface CrawlerStats {
  bot_name: string;
  visitor_type: string;
  hit_count: number;
  pages_hit: number;
}

interface ApiStats {
  bot_name: string;
  hit_count: number;
}

type TimeRange = '24h' | '7d' | '30d' | '90d';

async function fetchFromApi(password: string, query: string, timeRange: string) {
  const res = await fetch('/api/admin/traffic', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password, query, timeRange }),
  });
  if (res.status === 401) throw new Error('unauthorized');
  if (!res.ok) throw new Error('fetch-failed');
  return res.json();
}

export default function TrafficDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');

  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [topPages, setTopPages] = useState<PageStats[]>([]);
  const [crawlerStats, setCrawlerStats] = useState<CrawlerStats[]>([]);
  const [apiStats, setApiStats] = useState<ApiStats[]>([]);
  const [totals, setTotals] = useState({ human: 0, ai_crawler: 0, search_bot: 0, api_consumer: 0 });

  const handleLogin = async () => {
    setAuthError(false);
    try {
      // Test the password with a small query
      await fetchFromApi(passwordInput, 'daily', '24h');
      setPassword(passwordInput);
      setAuthenticated(true);
    } catch (err: any) {
      if (err.message === 'unauthorized') {
        setAuthError(true);
      }
    }
  };

  const fetchData = useCallback(async () => {
    if (!password) return;
    setLoading(true);

    try {
      // Fetch all four data sets in parallel
      const [dailyRes, pagesRes, crawlersRes, apiRes] = await Promise.all([
        fetchFromApi(password, 'daily', timeRange),
        fetchFromApi(password, 'pages', timeRange),
        fetchFromApi(password, 'crawlers', timeRange),
        fetchFromApi(password, 'api', timeRange),
      ]);

      // Process daily stats
      if (dailyRes.data) {
        const dayMap = new Map<string, DailyStats>();
        for (const row of dailyRes.data) {
          const date = new Date(row.window_start).toISOString().split('T')[0];
          if (!dayMap.has(date)) {
            dayMap.set(date, { date, human: 0, ai_crawler: 0, search_bot: 0, api_consumer: 0 });
          }
          const day = dayMap.get(date)!;
          const vt = row.visitor_type as keyof Omit<DailyStats, 'date'>;
          if (vt in day) day[vt] += row.hit_count;
        }
        setDailyStats(Array.from(dayMap.values()));

        const t = { human: 0, ai_crawler: 0, search_bot: 0, api_consumer: 0 };
        for (const day of dayMap.values()) {
          t.human += day.human;
          t.ai_crawler += day.ai_crawler;
          t.search_bot += day.search_bot;
          t.api_consumer += day.api_consumer;
        }
        setTotals(t);
      }

      // Process page stats
      if (pagesRes.data) {
        const pageMap = new Map<string, PageStats>();
        for (const row of pagesRes.data) {
          if (!pageMap.has(row.path)) {
            pageMap.set(row.path, { path: row.path, human_hits: 0, bot_hits: 0, total_hits: 0 });
          }
          const page = pageMap.get(row.path)!;
          if (row.visitor_type === 'human') {
            page.human_hits += row.hit_count;
          } else {
            page.bot_hits += row.hit_count;
          }
          page.total_hits += row.hit_count;
        }
        const sorted = Array.from(pageMap.values())
          .sort((a, b) => b.human_hits - a.human_hits)
          .slice(0, 25);
        setTopPages(sorted);
      }

      // Process crawler stats
      if (crawlersRes.data) {
        const crawlerMap = new Map<string, CrawlerStats>();
        const crawlerPages = new Map<string, Set<string>>();
        for (const row of crawlersRes.data) {
          const name = row.bot_name ?? 'unknown';
          if (!crawlerMap.has(name)) {
            crawlerMap.set(name, { bot_name: name, visitor_type: row.visitor_type, hit_count: 0, pages_hit: 0 });
            crawlerPages.set(name, new Set());
          }
          crawlerMap.get(name)!.hit_count += row.hit_count;
          crawlerPages.get(name)!.add(row.path);
        }
        for (const [name, pages] of crawlerPages) {
          crawlerMap.get(name)!.pages_hit = pages.size;
        }
        setCrawlerStats(Array.from(crawlerMap.values()).sort((a, b) => b.hit_count - a.hit_count));
      }

      // Process API stats
      if (apiRes.data) {
        const apiMap = new Map<string, number>();
        for (const row of apiRes.data) {
          const name = row.bot_name ?? 'direct-api';
          apiMap.set(name, (apiMap.get(name) ?? 0) + row.hit_count);
        }
        setApiStats(
          Array.from(apiMap.entries())
            .map(([bot_name, hit_count]) => ({ bot_name, hit_count }))
            .sort((a, b) => b.hit_count - a.hit_count)
        );
      }
    } catch (err: any) {
      if (err.message === 'unauthorized') {
        setAuthenticated(false);
        setPassword('');
        setAuthError(true);
      }
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [password, timeRange]);

  useEffect(() => {
    if (authenticated) fetchData();
  }, [authenticated, timeRange, fetchData]);

  // --- Auth gate ---
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 w-full max-w-sm">
          <h1 className="text-lg font-semibold text-gray-900 mb-1">Traffic Dashboard</h1>
          <p className="text-sm text-gray-500 mb-6">Enter admin password to continue</p>
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => { setPasswordInput(e.target.value); setAuthError(false); }}
            onKeyDown={(e) => { if (e.key === 'Enter') handleLogin(); }}
            placeholder="Password"
            className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-1 ${
              authError ? 'border-red-300' : 'border-gray-300'
            }`}
            autoFocus
          />
          {authError && (
            <p className="text-xs text-red-500 mb-3">Incorrect password</p>
          )}
          {!authError && <div className="mb-4" />}
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            View Dashboard
          </button>
        </div>
      </div>
    );
  }

  const totalAll = totals.human + totals.ai_crawler + totals.search_bot + totals.api_consumer;
  const humanPct = totalAll > 0 ? Math.round((totals.human / totalAll) * 100) : 0;
  const maxDailyTotal = Math.max(...dailyStats.map(d => d.human + d.ai_crawler + d.search_bot + d.api_consumer), 1);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Traffic Analytics</h1>
            <p className="text-sm text-gray-500 mt-1">Human visitors vs bots and AI crawlers</p>
          </div>
          <div className="flex items-center gap-2">
            {(['24h', '7d', '30d', '90d'] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {range}
              </button>
            ))}
            <button
              onClick={() => fetchData()}
              className="px-3 py-1.5 text-sm rounded-md font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors ml-2"
              title="Refresh data"
            >
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-sm text-gray-500">Loading traffic data...</div>
          </div>
        ) : dailyStats.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-500 text-sm">No traffic data yet. The middleware will start logging once deployed.</p>
            <p className="text-gray-400 text-xs mt-2">Data appears here within 60 seconds of the first visitor.</p>
          </div>
        ) : (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <SummaryCard label="Human Visitors" value={totals.human} accent="blue" subtitle={`${humanPct}% of total`} />
              <SummaryCard label="AI Crawlers" value={totals.ai_crawler} accent="purple" subtitle="ChatGPT, Claude, etc." />
              <SummaryCard label="Search Bots" value={totals.search_bot} accent="amber" subtitle="Google, Bing, etc." />
              <SummaryCard label="API Consumers" value={totals.api_consumer} accent="emerald" subtitle="/api/agents hits" />
            </div>

            {/* Daily chart */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Daily Breakdown</h2>
              <div className="space-y-2">
                {dailyStats.map((day) => {
                  const dayTotal = day.human + day.ai_crawler + day.search_bot + day.api_consumer;
                  return (
                    <div key={day.date} className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-20 shrink-0 font-mono">
                        {new Date(day.date + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <div className="flex-1 flex h-6 rounded overflow-hidden bg-gray-100">
                        {day.human > 0 && (
                          <div
                            className="bg-blue-500 transition-all"
                            style={{ width: `${(day.human / maxDailyTotal) * 100}%` }}
                            title={`${day.human} human`}
                          />
                        )}
                        {day.ai_crawler > 0 && (
                          <div
                            className="bg-purple-400 transition-all"
                            style={{ width: `${(day.ai_crawler / maxDailyTotal) * 100}%` }}
                            title={`${day.ai_crawler} AI crawlers`}
                          />
                        )}
                        {day.search_bot > 0 && (
                          <div
                            className="bg-amber-400 transition-all"
                            style={{ width: `${(day.search_bot / maxDailyTotal) * 100}%` }}
                            title={`${day.search_bot} search bots`}
                          />
                        )}
                        {day.api_consumer > 0 && (
                          <div
                            className="bg-emerald-400 transition-all"
                            style={{ width: `${(day.api_consumer / maxDailyTotal) * 100}%` }}
                            title={`${day.api_consumer} API`}
                          />
                        )}
                      </div>
                      <span className="text-xs text-gray-500 w-16 text-right shrink-0">
                        <span className="font-medium text-gray-900">{day.human}</span>
                        <span className="text-gray-400"> / {dayTotal}</span>
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
                <Legend color="bg-blue-500" label="Human" />
                <Legend color="bg-purple-400" label="AI Crawlers" />
                <Legend color="bg-amber-400" label="Search Bots" />
                <Legend color="bg-emerald-400" label="API" />
              </div>
            </div>

            {/* Two-column layout */}
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* Top pages */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">Top Pages (by human traffic)</h2>
                <div className="space-y-1">
                  {topPages.slice(0, 15).map((page, i) => (
                    <div key={page.path} className="flex items-center gap-2 py-1.5">
                      <span className="text-xs text-gray-400 w-5 text-right shrink-0">{i + 1}</span>
                      <span className="text-sm text-gray-800 truncate flex-1 font-mono" title={page.path}>
                        {page.path === '/' ? '/' : page.path}
                      </span>
                      <span className="text-xs font-medium text-blue-600 shrink-0">{page.human_hits}</span>
                      <span className="text-xs text-gray-400 shrink-0">/ {page.total_hits}</span>
                    </div>
                  ))}
                  {topPages.length === 0 && (
                    <p className="text-sm text-gray-400">No page data yet</p>
                  )}
                </div>
              </div>

              {/* Crawler activity */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">Crawler Activity</h2>
                <div className="space-y-1">
                  {crawlerStats.map((crawler) => (
                    <div key={crawler.bot_name} className="flex items-center gap-2 py-1.5">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          crawler.visitor_type === 'ai_crawler' ? 'bg-purple-400' : 'bg-amber-400'
                        }`}
                      />
                      <span className="text-sm text-gray-800 flex-1">{crawler.bot_name}</span>
                      <span className="text-xs text-gray-500 shrink-0">{crawler.pages_hit} pages</span>
                      <span className="text-xs font-medium text-gray-900 shrink-0 w-12 text-right">
                        {crawler.hit_count}
                      </span>
                    </div>
                  ))}
                  {crawlerStats.length === 0 && (
                    <p className="text-sm text-gray-400">No crawler data yet</p>
                  )}
                </div>
              </div>
            </div>

            {/* API consumers */}
            {apiStats.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">API Consumers (/api/agents)</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {apiStats.map((api) => (
                    <div key={api.bot_name} className="flex items-center justify-between py-1.5 px-3 bg-gray-50 rounded-md">
                      <span className="text-sm text-gray-700">{api.bot_name}</span>
                      <span className="text-sm font-medium text-emerald-600">{api.hit_count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// --- Helper components ---

function SummaryCard({
  label,
  value,
  accent,
  subtitle,
}: {
  label: string;
  value: number;
  accent: 'blue' | 'purple' | 'amber' | 'emerald';
  subtitle: string;
}) {
  const accentClasses = {
    blue: 'border-blue-200 bg-blue-50',
    purple: 'border-purple-200 bg-purple-50',
    amber: 'border-amber-200 bg-amber-50',
    emerald: 'border-emerald-200 bg-emerald-50',
  };
  const valueClasses = {
    blue: 'text-blue-700',
    purple: 'text-purple-700',
    amber: 'text-amber-700',
    emerald: 'text-emerald-700',
  };

  return (
    <div className={`rounded-lg border p-4 ${accentClasses[accent]}`}>
      <p className="text-xs font-medium text-gray-600 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${valueClasses[accent]}`}>{value.toLocaleString()}</p>
      <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-2.5 h-2.5 rounded-sm ${color}`} />
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}