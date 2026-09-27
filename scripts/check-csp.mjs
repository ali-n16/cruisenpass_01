#!/usr/bin/env node
import { readFileSync, readdirSync } from 'node:fs';

const vercel = JSON.parse(readFileSync('vercel.json', 'utf8'));
const header = vercel.headers
  .flatMap((rule) => rule.headers)
  .find((h) => h.key === 'Content-Security-Policy');
const issues = [];

if (!header) {
  console.error('CSP check FAILED: no Content-Security-Policy header in vercel.json');
  process.exit(1);
}

const directives = {};
for (const part of header.value.split(';')) {
  const tokens = part.trim().split(/\s+/).filter(Boolean);
  if (tokens.length) directives[tokens[0]] = tokens.slice(1);
}

function matches(origin, source) {
  if (source === "'self'") return origin.startsWith('http://localhost') || origin.startsWith('https://cruisenpass.com');
  const wildcard = source.match(/^(https?):\*\.(\S+)$/);
  if (wildcard) {
    try {
      const host = new URL(origin).hostname;
      return host.endsWith('.' + wildcard[2]) && host !== wildcard[2];
    } catch {
      return false;
    }
  }
  if (source.startsWith('http')) {
    try {
      return new URL(origin).origin === new URL(source).origin;
    } catch {
      return false;
    }
  }
  return false;
}

function allowed(origin, directive) {
  return (directives[directive] || []).some((src) => matches(origin, src));
}

function requireSource(directive, source, why) {
  if (!(directives[directive] || []).includes(source)) {
    issues.push(`${directive} must include ${source} — ${why}`);
  }
}

// External resources referenced by the site's own pages.
const pages = ['index.html', 'learn-now.html', 'join-cruisenpass.html', 'privacy.html', '404.html',
  ...readdirSync('.').filter((f) => /^driving-lessons-\w[\w-]*\.html$/.test(f))];

const refs = new Map();
for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  for (const m of html.matchAll(/<(script|iframe|link)\b[^>]*>/gi)) {
    const tag = m[1].toLowerCase();
    const attrs = m[0];
    const url = attrs.match(/\b(?:src|href)="(https?:\/\/[^"]+)"/i)?.[1];
    if (!url) continue;
    if (tag === 'link' && !/\brel="stylesheet"/i.test(attrs)) continue;
    const directive = tag === 'iframe' ? 'frame-src' : tag === 'link' ? 'style-src' : 'script-src';
    const origin = new URL(url).origin;
    if (!refs.has(directive)) refs.set(directive, new Map());
    refs.get(directive).set(origin, page);
  }
}

for (const [directive, origins] of refs) {
  for (const [origin, page] of origins) {
    if (!allowed(origin, directive)) issues.push(`${directive} blocks ${origin} (referenced by ${page})`);
  }
}

// TikTok's embed.js is served from www.tiktok.com but 302-redirects to its
// static CDN; CSP checks the redirect target too, so the reel silently renders
// as empty blockquotes if these hosts are dropped from script-src/style-src.
for (const directive of ['script-src', 'style-src']) {
  requireSource(directive, 'https://*.ttwstatic.com', 'TikTok embed assets (embed.js redirects here)');
}
requireSource('frame-src', 'https://www.tiktok.com', 'TikTok embed iframes');
requireSource('connect-src', 'https://www.tiktok.com', 'TikTok embed API calls');
requireSource('frame-src', 'https://www.youtube-nocookie.com', 'YouTube playlist embed');

if (issues.length) {
  console.error('CSP check FAILED:');
  for (const issue of issues) console.error(' - ' + issue);
  process.exit(1);
}
console.log('CSP check passed.');
