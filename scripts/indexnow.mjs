#!/usr/bin/env node
// Submits every URL in sitemap.xml to IndexNow (Bing, Yandex, Seznam, Naver),
// so new and updated pages get crawled within hours instead of weeks.
// Run after a deploy: the key file must already be live at
// https://cruisenpass.com/<KEY>.txt or the submission is rejected.
// Google does not use IndexNow — use Search Console for Google.
import { readFileSync } from "node:fs";

const HOST = "cruisenpass.com";
const KEY = "78c5830c683a82c2bf2c5626fedb9c1e";

const urls = [...readFileSync("sitemap.xml", "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => m[1]);
if (urls.length === 0) throw new Error("indexnow: no <loc> entries in sitemap.xml");

const keyUrl = `https://${HOST}/${KEY}.txt`;
const live = await fetch(keyUrl);
if (!live.ok || (await live.text()).trim() !== KEY) {
  throw new Error(`indexnow: key file not live at ${keyUrl} — deploy first`);
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: keyUrl, urlList: urls }),
});
// 200 = accepted, 202 = accepted, key validation pending
console.log(`indexnow: submitted ${urls.length} URL(s) -> HTTP ${res.status}`);
if (res.status >= 300) {
  console.error(await res.text());
  process.exit(1);
}
