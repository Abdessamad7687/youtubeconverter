import { pathToFileURL } from "node:url";

export const DEFAULT_SITE_URL = "https://totube.online";
export const DEFAULT_INDEXNOW_KEY = "68bc8084a7f655c97a867dfc77b8450e";
export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

function decodeXml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'");
}

export function extractSitemapUrls(xml, siteUrl = DEFAULT_SITE_URL) {
  const origin = new URL(siteUrl).origin;
  const urls = [...xml.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)]
    .map((match) => decodeXml(match[1].trim()))
    .filter((value) => {
      try {
        const url = new URL(value);
        return url.origin === origin && ["http:", "https:"].includes(url.protocol);
      } catch {
        return false;
      }
    });
  return [...new Set(urls)];
}

export function buildIndexNowPayload(urlList, siteUrl = DEFAULT_SITE_URL, key = DEFAULT_INDEXNOW_KEY) {
  const site = new URL(siteUrl);
  return {
    host: site.host,
    key,
    keyLocation: `${site.origin}/${key}.txt`,
    urlList,
  };
}

export async function submitIndexNow({ siteUrl = process.env.INDEXNOW_SITE_URL || DEFAULT_SITE_URL, key = process.env.INDEXNOW_KEY || DEFAULT_INDEXNOW_KEY, dryRun = false } = {}) {
  const site = new URL(siteUrl);
  const sitemapUrl = `${site.origin}/sitemap.xml`;
  const sitemapResponse = await fetch(sitemapUrl, { headers: { "user-agent": "toTube-IndexNow/1.0" } });
  if (!sitemapResponse.ok) throw new Error(`Could not load sitemap: HTTP ${sitemapResponse.status}`);

  const urlList = extractSitemapUrls(await sitemapResponse.text(), site.origin);
  if (!urlList.length) throw new Error("The sitemap contains no same-origin URLs to submit.");
  if (urlList.length > 10_000) throw new Error("IndexNow accepts at most 10,000 URLs in one request.");

  const payload = buildIndexNowPayload(urlList, site.origin, key);
  if (dryRun) return { status: "dry-run", count: urlList.length, payload };

  const response = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8", "user-agent": "toTube-IndexNow/1.0" },
    body: JSON.stringify(payload),
  });
  if (![200, 202].includes(response.status)) {
    const details = (await response.text()).trim();
    throw new Error(`IndexNow rejected the submission: HTTP ${response.status}${details ? ` — ${details.slice(0, 300)}` : ""}`);
  }
  return { status: response.status, count: urlList.length, keyLocation: payload.keyLocation };
}

async function main() {
  const result = await submitIndexNow({ dryRun: process.argv.includes("--dry-run") });
  console.log(JSON.stringify(result, null, 2));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
