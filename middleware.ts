import { NextRequest, NextResponse } from 'next/server';

// ============================================
// MIDDLEWARE — MERGED
// 1. Markdown content negotiation (existing)
// 2. Traffic classification + logging (new)
// ============================================

// --- Bot detection maps ---

const AI_CRAWLERS: Record<string, string> = {
  'GPTBot':          'GPTBot',
  'ChatGPT-User':   'ChatGPT-User',
  'ClaudeBot':       'ClaudeBot',
  'Claude-Web':      'Claude-Web',
  'PerplexityBot':   'PerplexityBot',
  'Bytespider':      'Bytespider',
  'CCBot':           'CCBot',
  'Google-Extended': 'Google-Extended',
  'FacebookBot':     'FacebookBot',
  'anthropic-ai':    'anthropic-ai',
  'cohere-ai':       'cohere-ai',
  'Diffbot':         'Diffbot',
  'YouBot':          'YouBot',
  'Applebot':        'Applebot',
  'PetalBot':        'PetalBot',
  'NotebookLM':      'NotebookLM',
};

const SEARCH_BOTS: Record<string, string> = {
  'Googlebot':            'Googlebot',
  'Googlebot-Image':      'Googlebot-Image',
  'Googlebot-Video':      'Googlebot-Video',
  'Google-InspectionTool': 'Google-InspectionTool',
  'Storebot-Google':      'Storebot-Google',
  'AdsBot-Google':        'AdsBot-Google',
  'Mediapartners-Google': 'Mediapartners-Google',
  'bingbot':              'bingbot',
  'Bingbot':              'bingbot',
  'msnbot':               'msnbot',
  'Slurp':                'Yahoo-Slurp',
  'DuckDuckBot':          'DuckDuckBot',
  'Baiduspider':          'Baiduspider',
  'YandexBot':            'YandexBot',
  'Sogou':                'Sogou',
  'SemrushBot':           'SemrushBot',
  'AhrefsBot':            'AhrefsBot',
  'MJ12bot':              'MJ12bot',
  'DotBot':               'DotBot',
  'Rogerbot':             'Rogerbot',
  'DataForSeoBot':        'DataForSeoBot',
};

// --- In-memory aggregation buffer ---

interface BufferKey {
  windowStart: string;
  path: string;
  visitorType: 'human' | 'ai_crawler' | 'search_bot' | 'api_consumer';
  botName: string | null;
}

const buffer = new Map<string, { key: BufferKey; count: number }>();
let lastFlush = Date.now();
const FLUSH_INTERVAL_MS = 60_000; // 60 seconds

function makeBufferKeyString(key: BufferKey): string {
  return `${key.windowStart}|${key.path}|${key.visitorType}|${key.botName ?? ''}`;
}

function getMinuteWindow(): string {
  const now = new Date();
  now.setSeconds(0, 0);
  return now.toISOString();
}

function classifyVisitor(userAgent: string): { type: BufferKey['visitorType']; botName: string | null } {
  for (const [pattern, name] of Object.entries(AI_CRAWLERS)) {
    if (userAgent.includes(pattern)) {
      return { type: 'ai_crawler', botName: name };
    }
  }

  for (const [pattern, name] of Object.entries(SEARCH_BOTS)) {
    if (userAgent.includes(pattern)) {
      return { type: 'search_bot', botName: name };
    }
  }

  const genericBotPatterns = /bot|crawler|spider|scraper|fetcher|curl|wget|python-requests|axios|node-fetch|Go-http-client|Java\/|HeadlessChrome/i;
  if (genericBotPatterns.test(userAgent)) {
    return { type: 'search_bot', botName: 'unknown-bot' };
  }

  return { type: 'human', botName: null };
}

async function flushBuffer() {
  if (buffer.size === 0) return;

  const rows = Array.from(buffer.values()).map(({ key, count }) => ({
    window_start: key.windowStart,
    path: key.path,
    visitor_type: key.visitorType,
    bot_name: key.botName,
    hit_count: count,
  }));

  buffer.clear();
  lastFlush = Date.now();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) return;

  try {
    await fetch(`${supabaseUrl}/rest/v1/traffic_logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify(rows),
    });
  } catch {
    // Silent fail: don't break the site if Supabase is unreachable
  }
}

// --- Traffic logging helper ---

function logTraffic(pathname: string, userAgent: string) {
  const windowStart = getMinuteWindow();
  const { type, botName } = classifyVisitor(userAgent);

  const isApiAgents = pathname.startsWith('/api/agents');

  let normalizedPath = pathname;
  if (pathname.startsWith('/api/agents')) {
    normalizedPath = '/api/agents';
  }

  const key: BufferKey = {
    windowStart,
    path: normalizedPath,
    visitorType: isApiAgents ? 'api_consumer' : type,
    botName: isApiAgents ? (type !== 'human' ? botName : 'direct-api') : botName,
  };

  const keyString = makeBufferKeyString(key);
  const existing = buffer.get(keyString);
  if (existing) {
    existing.count++;
  } else {
    buffer.set(keyString, { key, count: 1 });
  }

  if (Date.now() - lastFlush >= FLUSH_INTERVAL_MS) {
    flushBuffer();
  }
}

// --- Middleware ---

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get('user-agent') ?? '';

  // --- Traffic logging (runs on all matched routes) ---
  logTraffic(pathname, userAgent);

  // --- Markdown content negotiation (existing behavior) ---
  const accept = request.headers.get('accept') || '';

  if (accept.includes('text/markdown')) {
    const url = request.nextUrl.clone();
    url.pathname = '/api/markdown';
    url.searchParams.set('path', pathname);
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

// --- Route matcher ---
// Covers: all page routes, API/agents, admin
// Skips: static assets, images, fonts, _next internals

export const config = {
  matcher: [
    '/',
    '/agents/:path*',
    '/compare/:path*',
    '/alternatives/:path*',
    '/resources/guides/:path*',
    '/definitions/:path*',
    '/stacks/:path*',
    '/integrations/:path*',
    '/ai-automation-agencies/:path*',
    '/agencies/:path*',
    '/ai-sales-agents/:path*',
    '/ai-customer-support-agents/:path*',
    '/ai-research-agents/:path*',
    '/ai-marketing-agents/:path*',
    '/ai-coding-agents/:path*',
    '/ai-hr-agents/:path*',
    '/ai-workflow-agents/:path*',
    '/ai-customer-success-agents/:path*',
    '/api/agents/:path*',
    '/admin/:path*',
  ],
};