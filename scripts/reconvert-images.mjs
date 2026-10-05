import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
// use global fetch (Node 18+). If not available, fall back to node-fetch dynamic import
let fetch = globalThis.fetch;
if (!fetch) {
  try { fetch = (await import('node-fetch')).default; } catch (e) { throw new Error('fetch is not available'); }
}

const root = process.cwd();
const igDir = path.join(root, 'assets', 'ig');
const imgDir = path.join(root, 'assets', 'img');

const igFiles = (await fs.readdir(igDir)).filter(f => f.endsWith('.webp'));
const results = [];

async function fetchJpgBuffer(relPath) {
  const url = 'https://cruisenpass.com/' + relPath.replace(/^[\\/]+/, '');
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const buf = await res.arrayBuffer();
    return Buffer.from(buf);
  } catch (err) {
    return null;
  }
}

for (const file of igFiles) {
  const p = path.join(igDir, file);
  const rel = path.posix.join('assets/ig', file);
  const base = path.basename(file, '.webp');
  const jpgRel = `assets/ig/${base}.jpg`;

  const inBuf = await fs.readFile(p);
  const inMeta = await sharp(inBuf).metadata();

  // convert with iterative quality reduction if needed to meet 25% smaller requirement vs jpg
  let quality = 75;
  let outBuf = await sharp(inBuf).resize({ width: 640, withoutEnlargement: true }).webp({ quality }).toBuffer();
  let outMeta = await sharp(outBuf).metadata();
  let outBytes = outBuf.length;

  // fetch original jpg for comparison
  const jpgBuf = await fetchJpgBuffer(jpgRel);
  let jpgBytes = null;
  let jpgMeta = null;
  if (jpgBuf) {
    jpgBytes = jpgBuf.length;
    try { jpgMeta = await sharp(jpgBuf).metadata(); } catch(e) { jpgMeta = null; }
  }

  // If jpg exists, ensure webp is at least 25% smaller; if not, reduce quality and retry
  if (jpgBytes) {
    while (outBytes > Math.floor(jpgBytes * 0.75) && quality >= 40) {
      quality -= 5;
      outBuf = await sharp(inBuf).resize({ width: 640, withoutEnlargement: true }).webp({ quality }).toBuffer();
      outMeta = await sharp(outBuf).metadata();
      outBytes = outBuf.length;
    }
  }

  await fs.writeFile(p, outBuf);

  // special rule for DTYdYqEjFDy
  let keptJpg = false;
  if (base === 'DTYdYqEjFDy' && jpgBuf) {
    // already 640 wide per instruction; compare sizes
    if (outBytes >= jpgBytes) {
      // restore jpg: write jpg file and remove webp
      await fs.writeFile(path.join(igDir, base + '.jpg'), jpgBuf);
      await fs.unlink(p);
      keptJpg = true;
    }
  }

  results.push({ file: rel, base, inMeta, outMeta, outBytes, jpgBytes, jpgMeta, keptJpg, quality });
}

// process hero images
const heroes = ['hero-index.webp', 'hero-join.webp'];
const heroResults = [];
for (const h of heroes) {
  const p = path.join(imgDir, h);
  const rel = path.posix.join('assets/img', h);
  const inBuf = await fs.readFile(p);
  const inMeta = await sharp(inBuf).metadata();
  const outBuf = await sharp(inBuf).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();
  await fs.writeFile(p, outBuf);
  const outMeta = await sharp(outBuf).metadata();
  const outBytes = outBuf.length;

  // fetch original jpg
  const base = path.basename(h, '.webp');
  const jpgRel = `assets/img/${base}.jpg`;
  const jpgBuf = await fetchJpgBuffer(jpgRel);
  let jpgBytes = null, jpgMeta = null;
  if (jpgBuf) {
    jpgBytes = jpgBuf.length;
    try { jpgMeta = await sharp(jpgBuf).metadata(); } catch(e) { jpgMeta = null; }
  }

  heroResults.push({ file: rel, inMeta, outMeta, outBytes, jpgBytes, jpgMeta });
}

// write a JSON report to stdout
const report = { ig: results, heroes: heroResults };
console.log(JSON.stringify(report, null, 2));

// Basic assertions
for (const r of results) {
  if (!r.keptJpg) {
    if (!r.outMeta || r.outMeta.width > 640) throw new Error(`${r.file} width ${r.outMeta?.width} > 640`);
    if (r.jpgBytes && r.outBytes > Math.floor(r.jpgBytes * 0.75)) {
      throw new Error(`${r.file} webp not at least 25% smaller than jpg (${r.outBytes} vs ${r.jpgBytes})`);
    }
  }
}
for (const h of heroResults) {
  if (h.outMeta.width > 1200) throw new Error(`${h.file} width ${h.outMeta.width} > 1200`);
  if (h.jpgBytes && h.outBytes > Math.floor(h.jpgBytes * 0.75)) {
    throw new Error(`${h.file} webp not at least 25% smaller than jpg (${h.outBytes} vs ${h.jpgBytes})`);
  }
}

console.log('OK');
