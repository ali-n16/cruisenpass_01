#!/usr/bin/env node
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

const files = ['index.html', 'learn-now.html', 'join-cruisenpass.html'];
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
    const pathPart = hashIndex === -1 ? raw : raw.slice(0, hashIndex);
    if (!pathPart) continue;
    const resolved = join(baseDir, pathPart);
    if (!existsSync(resolved)) {
      issues.push(`${file}: missing local asset "${raw}" (resolved to ${resolved})`);
    }
  }
}

if (issues.length) {
  console.error('Local asset check FAILED:');
  for (const issue of issues) console.error(' - ' + issue);
  process.exit(1);
}
console.log('Local asset check passed.');
