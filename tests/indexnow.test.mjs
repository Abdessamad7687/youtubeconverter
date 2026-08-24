import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { buildIndexNowPayload, DEFAULT_INDEXNOW_KEY, extractSitemapUrls } from "../scripts/submit-indexnow.mjs";

test("publishes an IndexNow ownership file that exactly matches the configured key", async () => {
  const keyFile = await readFile(new URL(`../public/${DEFAULT_INDEXNOW_KEY}.txt`, import.meta.url), "utf8");
  assert.equal(keyFile.trim(), DEFAULT_INDEXNOW_KEY);
  assert.match(DEFAULT_INDEXNOW_KEY, /^[A-Za-z0-9-]{8,128}$/);
});

test("extracts unique same-origin sitemap URLs for IndexNow", () => {
  const urls = extractSitemapUrls(`<?xml version="1.0"?><urlset>
    <url><loc>https://totube.online/fr</loc></url>
    <url><loc>https://totube.online/fr/blog?a=1&amp;b=2</loc></url>
    <url><loc>https://totube.online/fr</loc></url>
    <url><loc>https://example.com/not-ours</loc></url>
  </urlset>`);
  assert.deepEqual(urls, ["https://totube.online/fr", "https://totube.online/fr/blog?a=1&b=2"]);
});

test("builds a valid bulk IndexNow payload", () => {
  const payload = buildIndexNowPayload(["https://totube.online/fr"]);
  assert.equal(payload.host, "totube.online");
  assert.equal(payload.key, DEFAULT_INDEXNOW_KEY);
  assert.equal(payload.keyLocation, `https://totube.online/${DEFAULT_INDEXNOW_KEY}.txt`);
  assert.deepEqual(payload.urlList, ["https://totube.online/fr"]);
});
