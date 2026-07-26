#!/usr/bin/env node
import { readFileSync } from 'node:fs';

const required = {
  'index.html': [
    /<title>.*<\/title>/,
    /<meta\s+name="description"/,
    /<meta\s+property="og:title"/,
    /<meta\s+property="og:description"/,
    /<meta\s+property="og:image"/,
    /<meta\s+name="twitter:card"/,
    /<link\s+rel="canonical"/,
    /"@type"\s*:\s*"DrivingSchool"/,
    /"@type"\s*:\s*"FAQPage"/,
  ],
  'learn-now.html': [
    /<title>.*<\/title>/,
    /<meta\s+name="description"/,
    /<link\s+rel="canonical"/,
    /"@type"\s*:\s*"WebSite"/,
    /"@type"\s*:\s*"BreadcrumbList"/,
  ],
  'join-cruisenpass.html': [
    /<title>.*<\/title>/,
    /<meta\s+name="description"/,
    /<link\s+rel="canonical"/,
    /"@type"\s*:\s*"JobPosting"/,
  ],
};

const issues = [];

for (const [file, patterns] of Object.entries(required)) {
  const html = readFileSync(file, 'utf8');
  for (const re of patterns) {
    if (!re.test(html)) {
      issues.push(`${file}: missing pattern ${re}`);
    }
  }
  if (!/lang="en(-GB)?"/.test(html)) {
    issues.push(`${file}: <html> missing lang attribute`);
  }
  if (!/charset="UTF-8"/i.test(html) && !/charset='UTF-8'/i.test(html)) {
    issues.push(`${file}: missing charset meta`);
  }
  if (!/name="viewport"/.test(html)) {
    issues.push(`${file}: missing viewport meta`);
  }
}

const sitemap = readFileSync('sitemap.xml', 'utf8');
for (const url of ['https://cruisenpass.com/', 'https://cruisenpass.com/learn-now.html', 'https://cruisenpass.com/join-cruisenpass.html']) {
  if (!sitemap.includes(url)) {
    issues.push(`sitemap.xml: missing ${url}`);
  }
}

if (issues.length) {
  console.error('SEO check FAILED:');
  for (const issue of issues) console.error(' - ' + issue);
  process.exit(1);
}
console.log('SEO check passed.');
