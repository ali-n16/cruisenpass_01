#!/usr/bin/env node
import { readFileSync, readdirSync } from 'node:fs';

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
    /"@type"\s*:\s*"VideoObject"/,
  ],
  'join-cruisenpass.html': [
    /<title>.*<\/title>/,
    /<meta\s+name="description"/,
    /<link\s+rel="canonical"/,
    /"@type"\s*:\s*"JobPosting"/,
  ],
  'privacy.html': [
    /<title>.*<\/title>/,
    /<meta\s+name="description"/,
    /<link\s+rel="canonical"/,
  ],
  'driving-lesson-prices.html': [
    /<title>.*<\/title>/,
    /<meta\s+name="description"/,
    /<link\s+rel="canonical"/,
  ],
  'driving-faq.html': [
    /<title>.*<\/title>/,
    /<meta\s+name="description"/,
    /<link\s+rel="canonical"/,
  ],
  'reviews.html': [
    /<title>.*<\/title>/,
    /<meta\s+name="description"/,
    /<link\s+rel="canonical"/,
  ],
  'intensive-driving-course.html': [
    /<title>.*<\/title>/,
    /<meta\s+name="description"/,
    /<link\s+rel="canonical"/,
  ],
  'blog.html': [
    /<title>.*<\/title>/,
    /<meta\s+name="description"/,
    /<link\s+rel="canonical"/,
  ],
  'how-many-driving-lessons.html': [
    /<title>.*<\/title>/,
    /<meta\s+name="description"/,
    /<link\s+rel="canonical"/,
  ],
  'driving-test-centres-manchester.html': [
    /<title>.*<\/title>/,
    /<meta\s+name="description"/,
    /<link\s+rel="canonical"/,
  ],
  'manual-vs-automatic.html': [
    /<title>.*<\/title>/,
    /<meta\s+name="description"/,
    /<link\s+rel="canonical"/,
  ],
};

// Generated area landing pages: lighter required set.
const areaRequired = [
  /<title>.*<\/title>/,
  /<meta\s+name="description"/,
  /<link\s+rel="canonical"/,
  /"@type"\s*:\s*"Service"/,
  /"@type"\s*:\s*"BreadcrumbList"/,
];
for (const file of readdirSync('.').filter((f) => /^driving-lessons-.+\.html$/.test(f))) {
  required[file] = areaRequired;
}

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
for (const url of ['https://cruisenpass.com/', 'https://cruisenpass.com/learn-now', 'https://cruisenpass.com/join-cruisenpass', 'https://cruisenpass.com/privacy']) {
  if (!sitemap.includes(url)) {
    issues.push(`sitemap.xml: missing ${url}`);
  }
}

// lastmod dates must not be in the future — Google ignores/distrusts them.
for (const match of sitemap.matchAll(/<lastmod>(\d{4}-\d{2}-\d{2})<\/lastmod>/g)) {
  if (new Date(match[1]) > new Date()) {
    issues.push(`sitemap.xml: lastmod ${match[1]} is in the future`);
  }
}

// Every area page must be listed in the sitemap.
for (const file of readdirSync('.').filter((f) => /^driving-lessons-.+\.html$/.test(f))) {
  const canonical = readFileSync(file, 'utf8').match(/<link\s+rel="canonical" href="([^"]+)"/);
  if (!canonical) {
    issues.push(`${file}: missing canonical link`);
  } else if (!sitemap.includes(canonical[1])) {
    issues.push(`sitemap.xml: missing ${canonical[1]} (from ${file})`);
  }
}

if (issues.length) {
  console.error('SEO check FAILED:');
  for (const issue of issues) console.error(' - ' + issue);
  process.exit(1);
}
console.log('SEO check passed.');
