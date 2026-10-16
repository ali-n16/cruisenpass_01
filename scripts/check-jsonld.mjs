#!/usr/bin/env node
import { readFileSync, readdirSync } from 'node:fs';

// Every page: any hand-edited JSON-LD on any page must parse.
const files = readdirSync('.').filter((f) => f.endsWith('.html'));
const issues = [];

for (const file of files) {
  const html = readFileSync(file, 'utf8');
  const blocks = [...html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
  for (let i = 0; i < blocks.length; i++) {
    try {
      JSON.parse(blocks[i][1]);
    } catch (error) {
      issues.push(`${file}: invalid JSON-LD block ${i + 1}: ${error.message}`);
    }
  }
}

if (issues.length) {
  console.error('JSON-LD check FAILED:');
  for (const issue of issues) console.error(' - ' + issue);
  process.exit(1);
}
console.log('JSON-LD check passed.');
