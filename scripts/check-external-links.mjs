#!/usr/bin/env node
// Best-effort external link checker.
//   npm run check:links
// 401/403 responses (bot-blocked hosts) are reported but do not fail the check;
// other HTTP errors and network failures do. Run in CI with
// `continue-on-error: true` so flaky hosts never block deploys.
import { readFileSync } from 'node:fs';

const files = ['index.html', 'learn-now.html', 'join-cruisenpass.html', 'privacy.html', '404.html'];

// CDN/analytics/embed hosts can be flaky or block HEAD requests entirely.
const SKIP_HOSTS = /^https:\/\/(?:fonts\.googleapis\.com|fonts\.gstatic\.com|cdnjs\.cloudflare\.com|i\.ytimg\.com|plausible\.io|www\.tiktok\.com\/embed\.js)/i;

// Formspree form endpoints are POST-only and cannot be verified over GET.
const SKIP_POST_ONLY = /^https:\/\/formspree\.io\/f\//i;

const hrefRe = /\b(?:href|src|action)\s*=\s*"([^"]+)"/g;
const urls = new Set();

for (const file of files) {
  let html;
  try {
    html = readFileSync(file, 'utf8');
  } catch {
    continue;
  }
  for (const match of html.matchAll(hrefRe)) {
    const raw = match[1];
    if (!raw || !/^https:\/\//i.test(raw)) continue;
    if (SKIP_HOSTS.test(raw) || SKIP_POST_ONLY.test(raw)) continue;
    // Bare-origin URLs (e.g. rel=preconnect hints) are not navigable pages.
    let parsed;
    try {
      parsed = new URL(raw);
    } catch {
      continue;
    }
    if (parsed.pathname === '/' && !parsed.search && !parsed.hash) continue;
    urls.add(raw);
  }
}

const UA = 'Mozilla/5.0 (compatible; CruiseNPassLinkChecker/1.0; +https://cruisenpass.com)';
const TIMEOUT_MS = 10000;

function check(url) {
  return new Promise((resolve) => {
    const headers = { 'user-agent': UA };

    const finish = (status, resolveOnce) => {
      if (status >= 200 && status < 400) resolveOnce({ url, ok: true, note: '' });
      else if (status === 401 || status === 403) resolveOnce({ url, ok: true, note: 'bot-blocked (HTTP ' + status + ')' });
      else resolveOnce({ url, ok: false, note: 'HTTP ' + status });
    };

    // Fresh AbortController per attempt so a timed-out attempt does not poison its retry.
    const runAttempt = (resolveOnce) => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
      fetch(url, { method: 'HEAD', redirect: 'follow', signal: controller.signal, headers })
        .then((res) => {
          if (res.status >= 200 && res.status < 400) return res.status;
          if (res.status === 401 || res.status === 403) return res.status;
          // Some servers reject or mishandle HEAD; verify with a ranged GET.
          return fetch(url, { method: 'GET', redirect: 'follow', signal: controller.signal, headers: { ...headers, range: 'bytes=0-0' } })
            .then((res2) => res2.status);
        })
        .then((status) => { clearTimeout(timer); finish(status, resolveOnce); })
        .catch((err) => {
          clearTimeout(timer);
          resolveOnce({ url, ok: false, note: err.name === 'AbortError' ? 'timeout' : 'network error' });
        });
    };

    // One retry on any failure — hosts like Instagram throttle bots.
    runAttempt((first) => {
      if (first.ok) return resolve(first);
      runAttempt((second) => resolve(second));
    });
  });
}

const results = await Promise.all([...urls].map(check));
const broken = results.filter((r) => !r.ok);

for (const r of results) {
  console.log((r.ok ? '  ok  ' : 'BROKEN') + ' ' + r.url + (r.note ? ' — ' + r.note : ''));
}

if (broken.length) {
  console.error('\nExternal link check FAILED: ' + broken.length + ' broken link(s).');
  process.exit(1);
}
console.log('\nExternal link check passed (' + results.length + ' unique external links checked).');
