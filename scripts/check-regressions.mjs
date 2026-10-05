import assert from 'node:assert';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';

async function check() {
  const generatorPath = path.resolve('scripts/generate-areas.mjs');
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'cruisenpass-regression-'));

  try {
    // Write minimal index.html with AREAS markers
    const indexHtml = '<!DOCTYPE html><html><head><title>Test Index</title></head><body><!-- AREAS:START --><!-- AREAS:END --></body></html>';
    await fs.writeFile(path.join(tempDir, 'index.html'), indexHtml, 'utf8');

    // Write minimal sitemap.xml with 4 core URLs
    const coreUrls = [
      'https://cruisenpass.com/',
      'https://cruisenpass.com/learn-now',
      'https://cruisenpass.com/join-cruisenpass',
      'https://cruisenpass.com/privacy',
    ];
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      coreUrls.map(u => `  <url><loc>${u}</loc></url>`).join('\n') +
      '\n</urlset>';
    await fs.writeFile(path.join(tempDir, 'sitemap.xml'), sitemapXml, 'utf8');

    // Copy generator script
    await fs.copyFile(generatorPath, path.join(tempDir, 'generate-areas.mjs'));

    // Run generator twice with Node execFileSync
    for (let i = 0; i < 2; i++) {
      execFileSync(process.execPath, ['generate-areas.mjs'], { cwd: tempDir });
    }

    // Assert 34 area HTML files with .html extension exist
    const files = await fs.readdir(tempDir);
    const areaFiles = files.filter(f => f.startsWith('driving-lessons-') && f.endsWith('.html'));
    assert.strictEqual(areaFiles.length, 34, 'Expected 34 area .html files');

    // Assert no extensionless files
    const extlessFiles = files.filter(f => !path.extname(f));
    assert.strictEqual(extlessFiles.length, 0, 'No extensionless output files expected');

    // Assert canonical links in generated files
    for (const file of areaFiles) {
      const content = await fs.readFile(path.join(tempDir, file), 'utf8');
      const match = content.match(/<link rel="canonical" href="([^"]+)"/);
      assert.ok(match, `Canonical link missing in ${file}`);
      const url = match[1];
      // Should end with file name without .html
      const expectedEnd = file.replace(/\.html$/, '');
      assert(url.endsWith(expectedEnd), `Canonical mismatch in ${file}: ${url} vs ${expectedEnd}`);
    }

    // Validate sitemap.xml content
    const sitemapPath = path.join(tempDir, 'sitemap.xml');
    const sitemapContent = (await fs.readFile(sitemapPath, 'utf8')).trim();
    const urlsetOpen = sitemapContent.indexOf('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    const urlsetClose = sitemapContent.lastIndexOf('</urlset>');
    assert.ok(urlsetOpen !== -1, 'Sitemap missing opening <urlset>');
    assert.ok(urlsetClose !== -1, 'Sitemap missing closing </urlset>');
    // Exactly one opening
    assert.strictEqual(sitemapContent.indexOf('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', urlsetOpen + 1), -1, 'Multiple <urlset> tags found');
    // Exactly one closing
    assert.strictEqual(sitemapContent.indexOf('</urlset>', urlsetClose + 1), -1, 'Multiple </urlset> tags found');
    // Ends with closing tag
    assert(sitemapContent.endsWith('</urlset>'), 'Sitemap must end with </urlset>');

    // Extract locs inside urlset
    const locs = Array.from(sitemapContent.matchAll(/<loc>([^<]+)<\/loc>/g), m => m[1]);

    // All 38 locs check
    assert.strictEqual(locs.length, 38, 'Expected 38 <loc> URLs in sitemap');

    // All locs unique
    assert.strictEqual(new Set(locs).size, 38, 'Duplicate <loc> URLs in sitemap');

    // No lastmod tags anywhere
    assert(!sitemapContent.includes('<lastmod>'), '<lastmod> tags found in sitemap');

    // Locs set equals 4 core + 34 generated canonicals
    const expectedLocs = new Set(coreUrls);
    for (const file of areaFiles) {
      const canonical = `https://cruisenpass.com/${file.replace(/\.html$/, '')}`;
      expectedLocs.add(canonical);
    }
    const locsSet = new Set(locs);
    assert.deepStrictEqual(locsSet, expectedLocs, 'Sitemap locs mismatch');

    console.log('Regression checks passed');
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}

check().catch(err => {
  console.error(err);
  process.exit(1);
});
