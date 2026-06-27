import { NextRequest, NextResponse } from 'next/server';

// ============================================
// MIDDLEWARE — MERGED
// 1. Rate limiting (new)
// 2. Markdown content negotiation (existing)
// 3. Traffic classification + logging (existing)
// ============================================

// --- Rate limiter ---

const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 60;  // per IP per window
const RATE_LIMIT_CLEANUP_INTERVAL_MS = 120_000; // purge stale entries every 2 min

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();
let lastRateLimitCleanup = Date.now();

// IPs to block permanently (known malicious scrapers)
const BLOCKED_IPS = new Set([
  '36.133.36.179', // China Mobile scraper, June 2026
]);

function cleanupRateLimitMap() {
  const now = Date.now();
  if (now - lastRateLimitCleanup < RATE_LIMIT_CLEANUP_INTERVAL_MS) return;

  const cutoff = now - RATE_LIMIT_WINDOW_MS;
  for (const [ip, entry] of rateLimitMap) {
    if (entry.windowStart < cutoff) {
      rateLimitMap.delete(ip);
    }
  }
  lastRateLimitCleanup = now;
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    // New window
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX_REQUESTS;
}

function isExemptFromRateLimit(userAgent: string): boolean {
  // Exempt known good bots: search engines and AI crawlers we want indexing us
  for (const pattern of Object.keys(AI_CRAWLERS)) {
    if (userAgent.includes(pattern)) return true;
  }
  for (const pattern of Object.keys(SEARCH_BOTS)) {
    if (userAgent.includes(pattern)) return true;
  }
  return false;
}

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

  // --- Rate limiting (runs first, before traffic logging) ---
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown';

  // Block permanently banned IPs immediately
  if (BLOCKED_IPS.has(ip)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // Rate limit unknown/human traffic only (exempt known good bots)
  if (!isExemptFromRateLimit(userAgent) && ip !== 'unknown') {
    cleanupRateLimitMap();

    if (isRateLimited(ip)) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'Retry-After': '60',
          'Content-Type': 'text/plain',
        },
      });
    }
  }

  // --- Traffic logging (runs on all requests that pass rate limiting) ---
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