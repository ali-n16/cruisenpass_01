#!/usr/bin/env node
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

const files = ['index.html', 'learn-now.html', 'join-cruisenpass.html', 'privacy.html',
  ...readdirSync('.').filter((f) => /^driving-lessons-.+\.html$/.test(f))];
const issues = [];

const skipProtocol = /^(https?:)?\/\//;
const skipScheme = /^(?:mailto:|tel:|data:|javascript:|#|javascript:)/i;

const attrRe = /(href|src)\s*=\s*"([^"]+)"/g;

for (const file of files) {
  const html = readFileSync(file, 'utf8');
  const baseDir = dirname(file);

  for (const match of html.matchAll(attrRe)) {
    const raw = match[2];
    if (!raw) continue;
    if (raw.startsWith("' +") || raw.includes("'+")) continue;
    if (skipProtocol.test(raw)) continue;
    if (skipScheme.test(raw)) continue;
    const hashIndex = raw.indexOf('#');
    let pathPart = (hashIndex === -1 ? raw : raw.slice(0, hashIndex)).split('?')[0];
    if (!pathPart) continue;
    // Clean URLs (Vercel cleanUrls): "/learn-now" is served from learn-now.html
    const resolved = join(baseDir, pathPart.replace(/^\//, ''));
    const candidates = /\.[a-z0-9]+$/i.test(resolved) ? [resolved] : [resolved + '.html', resolved];
    if (!candidates.some((c) => existsSync(c))) {
      issues.push(`${file}: missing local asset "${raw}"`);
    }
  }
}

if (issues.length) {
  console.error('Local asset check FAILED:');
  for (const issue of issues) console.error(' - ' + issue);
  process.exit(1);
}
console.log('Local asset check passed.');
