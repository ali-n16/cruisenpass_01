#!/usr/bin/env node
// Assembles the static deployable files into ./public for hosting platforms
// (e.g. Vercel) that serve from an output directory. Root files are kept in
// place so local preview and the root-level CI checks keep working unchanged.
import {
  rmSync, mkdirSync, copyFileSync, existsSync, readdirSync, statSync,
} from "node:fs";
import { join } from "node:path";

const OUT = "public";

const rootFiles = [
  "index.html",
  "learn-now.html",
  "join-cruisenpass.html",
  "privacy.html",
  "styles.css",
  "robots.txt",
  "sitemap.xml",
];

const dirs = ["assets"];

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

function copyDir(src, dest) {
  mkdirSync(dest, { recursive: true });
  for (const entry of readdirSync(src)) {
    const s = join(src, entry);
    const d = join(dest, entry);
    if (statSync(s).isDirectory()) copyDir(s, d);
    else copyFileSync(s, d);
  }
}

let copied = 0;
for (const f of rootFiles) {
  if (existsSync(f)) {
    copyFileSync(f, join(OUT, f));
    copied++;
  } else {
    console.warn(`assemble: skipped missing file "${f}"`);
  }
}
for (const d of dirs) {
  if (existsSync(d)) {
    copyDir(d, join(OUT, d));
    copied++;
  } else {
    console.warn(`assemble: skipped missing dir "${d}"`);
  }
}

console.log(`assemble: copied ${copied} item(s) into ${OUT}/`);
