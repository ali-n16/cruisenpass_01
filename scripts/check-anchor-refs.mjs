#!/usr/bin/env node
import { readFileSync } from 'node:fs';

const files = ['index.html', 'learn-now.html', 'join-cruisenpass.html'];
const issues = [];

const idSet = new Map();
for (const file of files) {
  const html = readFileSync(file, 'utf8');
  idSet.set(file, new Set([...html.matchAll(/\bid\s*=\s*"([^"]+)"/g)].map(m => m[1])));
}

const hrefRe = /\bhref\s*=\s*"([^"]+)"/g;

for (const file of files) {
  const html = readFileSync(file, 'utf8');
  const ids = idSet.get(file);

  for (const match of html.matchAll(hrefRe)) {
    const raw = match[1];
    if (!raw) continue;
    if (!raw.startsWith('#')) continue;
    const id = raw.slice(1);
    if (!id) continue;
    if (!ids.has(id)) {
      issues.push(`${file}: in-page anchor "#${id}" does not exist on this page`);
    }
  }
}

if (issues.length) {
  console.error('In-page anchor check FAILED:');
  for (const issue of issues) console.error(' - ' + issue);
  process.exit(1);
}
console.log('In-page anchor check passed.');
