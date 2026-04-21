/**
 * 404 Checker for The AI Agent Index
 * 
 * Run from project root in Cursor terminal:
 *   node check-404s.js
 * 
 * Checks:
 * 1. Guides — DB slugs vs page.tsx files in app/resources/guides/
 * 2. Comparisons — DB slugs vs dynamic route existence
 * 3. Alternatives — DB slugs vs dynamic route existence
 * 4. Definitions — DB slugs vs dynamic route existence
 * 5. Integrations — DB slugs vs page files (these need individual page.tsx)
 * 6. Agents — DB slugs vs dynamic route existence
 * 7. Stacks — DB slugs vs dynamic route existence
 * 
 * Requires: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ─── Helpers ───────────────────────────────────────────────

function dirExists(dirPath) {
  try {
    return fs.statSync(dirPath).isDirectory();
  } catch { return false; }
}

function fileExists(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch { return false; }
}

function findPageFiles(dir) {
  // Recursively find all page.tsx files
  const results = [];
  if (!dirExists(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findPageFiles(full));
    } else if (entry.name === 'page.tsx' || entry.name === 'page.ts') {
      results.push(full);
    }
  }
  return results;
}

// ─── Route structure checks ───────────────────────────────

const ROUTE_CONFIGS = [
  {
    name: 'Guides',
    table: 'guides',
    slugColumn: 'slug',
    // Dynamic route: app/resources/guides/[slug]/page.tsx
    dynamicRoute: 'app/resources/guides/[slug]/page.tsx',
    // Some guides might have individual page files instead
    individualDir: 'app/resources/guides',
    urlPrefix: '/resources/guides/',
    filter: null,
  },
  {
    name: 'Comparisons',
    table: 'comparisons',
    slugColumn: 'slug',
    dynamicRoute: 'app/compare/[slug]/page.tsx',
    individualDir: 'app/compare',
    urlPrefix: '/compare/',
    filter: null,
  },
  {
    name: 'Alternatives',
    table: 'alternatives',
    slugColumn: 'slug',
    dynamicRoute: 'app/alternatives/[slug]/page.tsx',
    individualDir: 'app/alternatives',
    urlPrefix: '/alternatives/',
    filter: null,
  },
  {
    name: 'Definitions',
    table: 'definitions',
    slugColumn: 'slug',
    dynamicRoute: 'app/definitions/[slug]/page.tsx',
    individualDir: 'app/definitions',
    urlPrefix: '/definitions/',
    filter: null,
  },
  {
    name: 'Integrations',
    table: 'integrations',
    slugColumn: 'slug',
    dynamicRoute: 'app/integrations/[slug]/page.tsx',
    individualDir: 'app/integrations',
    urlPrefix: '/integrations/',
    filter: null,
  },
  {
    name: 'Agents',
    table: 'agents',
    slugColumn: 'slug',
    dynamicRoute: 'app/agents/[slug]/page.tsx',
    individualDir: 'app/agents',
    urlPrefix: '/agents/',
    filter: { column: 'is_active', value: true },
  },
  {
    name: 'Stacks',
    table: 'stacks',
    slugColumn: 'share_slug',
    dynamicRoute: 'app/stack/[share_slug]/page.tsx',
    individualDir: 'app/stack',
    urlPrefix: '/stack/',
    filter: null,
  },
];

// ─── Main ─────────────────────────────────────────────────

async function main() {
  console.log('\n🔍 AI Agent Index — 404 Checker\n');
  console.log('='.repeat(60));

  let totalIssues = 0;

  for (const config of ROUTE_CONFIGS) {
    console.log(`\n📄 ${config.name}`);
    console.log('-'.repeat(40));

    // 1. Fetch all slugs from DB
    let query = supabase
      .from(config.table)
      .select(config.slugColumn);

    if (config.filter) {
      query = query.eq(config.filter.column, config.filter.value);
    }

    const { data, error } = await query;

    if (error) {
      console.log(`  ❌ DB error: ${error.message}`);
      continue;
    }

    if (!data || data.length === 0) {
      console.log(`  ⚠️  No rows found in ${config.table}`);
      continue;
    }

    const slugs = data.map(row => row[config.slugColumn]).filter(Boolean);
    console.log(`  📊 ${slugs.length} slugs in DB`);

    // 2. Check if dynamic route exists
    const hasDynamicRoute = fileExists(config.dynamicRoute);
    console.log(`  🛤️  Dynamic route: ${hasDynamicRoute ? '✅ exists' : '❌ MISSING'} (${config.dynamicRoute})`);

    if (hasDynamicRoute) {
      // Dynamic route handles all slugs — check if any individual override files exist
      // that might shadow or conflict
      const individualPages = findPageFiles(config.individualDir)
        .filter(f => !f.includes('['));  // exclude the dynamic route itself

      if (individualPages.length > 0) {
        // Individual pages exist alongside dynamic route — this is fine (Next.js static > dynamic)
        // But let's check if ALL slugs have individual pages, or just some
        const individualSlugs = individualPages.map(f => {
          const parts = f.split(path.sep);
          const slugIdx = parts.indexOf(path.basename(config.individualDir)) + 1;
          return parts[slugIdx];
        }).filter(s => s && s !== '[slug]' && s !== `[${config.slugColumn}]`);

        if (individualSlugs.length > 0 && individualSlugs.length < slugs.length) {
          // Mixed mode — some have individual pages, some rely on dynamic route
          // This is the risky pattern (like guides)
          const missingSlugs = slugs.filter(s => !individualSlugs.includes(s));
          
          console.log(`  ⚠️  MIXED MODE: ${individualSlugs.length} individual pages + dynamic route`);
          console.log(`     ${missingSlugs.length} slugs rely on dynamic route only`);
          
          // List the ones with individual pages
          if (individualSlugs.length <= 30) {
            console.log(`     Individual pages: ${individualSlugs.join(', ')}`);
          }
        }
      }
      
      console.log(`  ✅ All ${slugs.length} slugs should resolve via dynamic route`);

    } else {
      // No dynamic route — every slug needs its own page.tsx
      const missingPages = [];
      
      for (const slug of slugs) {
        const pagePath = path.join(config.individualDir, slug, 'page.tsx');
        const pagePathTs = path.join(config.individualDir, slug, 'page.ts');
        if (!fileExists(pagePath) && !fileExists(pagePathTs)) {
          missingPages.push(slug);
        }
      }

      if (missingPages.length > 0) {
        console.log(`  🚨 ${missingPages.length} MISSING page files (will 404):`);
        missingPages.forEach(slug => {
          console.log(`     ❌ ${config.urlPrefix}${slug}`);
        });
        totalIssues += missingPages.length;
      } else {
        console.log(`  ✅ All ${slugs.length} slugs have page files`);
      }
    }
  }

  // ─── Check for orphaned page files (pages with no DB row) ───

  console.log('\n\n📁 Orphaned Page Files (page exists but no DB row)');
  console.log('='.repeat(60));

  for (const config of ROUTE_CONFIGS) {
    if (config.name === 'Agents') continue; // too many to list, skip

    const pages = findPageFiles(config.individualDir)
      .filter(f => !f.includes('['));

    if (pages.length === 0) continue;

    let query = supabase
      .from(config.table)
      .select(config.slugColumn);

    const { data } = await query;
    const dbSlugs = new Set((data || []).map(r => r[config.slugColumn]).filter(Boolean));

    const orphans = pages
      .map(f => {
        const parts = f.split(path.sep);
        const slugIdx = parts.indexOf(path.basename(config.individualDir)) + 1;
        return parts[slugIdx];
      })
      .filter(s => s && s !== '[slug]' && s !== `[${config.slugColumn}]` && !dbSlugs.has(s));

    if (orphans.length > 0) {
      console.log(`\n  📄 ${config.name}: ${orphans.length} orphaned pages (no DB row):`);
      orphans.forEach(slug => {
        console.log(`     ⚠️  ${config.urlPrefix}${slug} — page exists, no DB row`);
      });
      totalIssues += orphans.length;
    }
  }

  // ─── Summary ────────────────────────────────────────────

  console.log('\n\n' + '='.repeat(60));
  if (totalIssues === 0) {
    console.log('✅ No 404 issues found!');
  } else {
    console.log(`🚨 ${totalIssues} potential 404 issues found — review above`);
  }
  console.log('='.repeat(60) + '\n');
}

main().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
