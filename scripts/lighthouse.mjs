// Runs Lighthouse (mobile + desktop) against a served production build and prints a summary.
// Usage: node scripts/lighthouse.mjs [baseUrl] [--only=/,/shop] [--runs=1]
import fs from 'node:fs/promises';
import path from 'node:path';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

const args = process.argv.slice(2);
const base = (args.find((a) => !a.startsWith('--')) ?? 'http://localhost:4377').replace(/\/$/, '');
const only = args.find((a) => a.startsWith('--only='))?.slice(7).split(',');
const runs = Number(args.find((a) => a.startsWith('--runs='))?.slice(7) ?? 1);
const pages = only ?? ['/', '/shop', '/products/beauty-of-joseon-relief-sun-spf50', '/quiz', '/checkout'];
const outDir = path.resolve(import.meta.dirname, '../.lighthouse');
await fs.mkdir(outDir, { recursive: true });

const chromePath = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const chrome = await chromeLauncher.launch({ chromePath, chromeFlags: ['--headless=new', '--no-first-run', '--disable-extensions'] });

const desktopConfig = (await import('lighthouse/core/config/desktop-config.js')).default;
const results = [];
for (const p of pages) {
  for (const form of ['mobile', 'desktop']) {
    const scores = [];
    for (let r = 0; r < runs; r++) {
      const runner = await lighthouse(
        base + p,
        { port: chrome.port, output: 'json', logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'] },
        form === 'desktop' ? desktopConfig : undefined,
      );
      const lhr = runner.lhr;
      const s = {
        perf: Math.round(lhr.categories.performance.score * 100),
        a11y: Math.round(lhr.categories.accessibility.score * 100),
        bp: Math.round(lhr.categories['best-practices'].score * 100),
        seo: Math.round(lhr.categories.seo.score * 100),
        lcp: lhr.audits['largest-contentful-paint'].numericValue,
        cls: lhr.audits['cumulative-layout-shift'].numericValue,
        tbt: lhr.audits['total-blocking-time'].numericValue,
        fcp: lhr.audits['first-contentful-paint'].numericValue,
      };
      scores.push(s);
      const failing = Object.values(lhr.audits)
        .filter((a) => a.score !== null && a.score < 0.9 && a.scoreDisplayMode !== 'informative' && a.scoreDisplayMode !== 'notApplicable' && a.scoreDisplayMode !== 'manual')
        .map((a) => `${a.id} (${a.displayValue ?? a.score})`);
      const slug = (p === '/' ? 'home' : p.replace(/\//g, '_').replace(/^_/, '')) + `-${form}-${r}`;
      await fs.writeFile(path.join(outDir, `${slug}.json`), JSON.stringify(lhr));
      s.failing = failing;
    }
    const best = scores.sort((a, b) => b.perf - a.perf)[0];
    results.push({ page: p, form, ...best });
    console.log(
      `${form.padEnd(7)} ${p.padEnd(48)} perf ${best.perf} a11y ${best.a11y} bp ${best.bp} seo ${best.seo} | LCP ${(best.lcp / 1000).toFixed(2)}s CLS ${best.cls.toFixed(3)} TBT ${Math.round(best.tbt)}ms`,
    );
    if (best.failing.length) console.log('        failing:', best.failing.join(', '));
  }
}
await chrome.kill();
await fs.writeFile(path.join(outDir, 'summary.json'), JSON.stringify(results, null, 2));
