import assert from "node:assert/strict";
import test from "node:test";

const workerUrl = new URL("../dist/server/index.js", import.meta.url);

async function request(pathname = "/", init = {}) {
  const moduleUrl = new URL(workerUrl);
  moduleUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(moduleUrl.href);
  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html", ...init.headers }, ...init }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

async function render(pathname = "/") {
  return request(pathname);
}

test("server-renders an indexable, keyword-focused homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();

  assert.match(html, /<html lang="fr">/i);
  assert.match(html, /<title>YouTube MP3 &amp; MP4 — Convertisseur gratuit \| toTube<\/title>/i);
  assert.match(html, /<meta name="description" content="[^"]*Convertisseur YouTube MP3/i);
  assert.match(html, /<meta name="robots" content="index, follow"/i);
  assert.match(html, /rel="canonical" href="https:\/\/totube\.online\/"/i);
  assert.match(html, /<h1>Convertisseur YouTube/i);
  assert.match(html, /"@type":"WebSite","name":"toTube"/i);
  assert.match(html, /href="\/youtube-mp3"/i);
  assert.match(html, /href="\/youtube-mp4"/i);
  assert.match(html, /5321f0adf5a727cf9500e1e0bce95ca9/i);
  assert.match(html, /4ed5c4bd0900ef9380332764b589781a/i);
  assert.match(html, /sandbox="allow-same-origin allow-scripts/i);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/i);
});

const landingPages = [
  ["/youtube-mp3", "YouTube MP3 gratuit", "<h1>YouTube MP3"],
  ["/youtube-mp4", "YouTube MP4 —", "<h1>YouTube MP4"],
  ["/convertisseur-mp3", "Convertisseur MP3 gratuit", "<h1>Convertisseur MP3"],
  ["/alternative-notube", "Alternative à noTube", "<h1>Une alternative à noTube"],
  ["/telecharger-video-youtube", "Télécharger une vidéo YouTube", "<h1>Télécharger une vidéo YouTube"],
  ["/telecharger-video-tiktok", "Télécharger une vidéo TikTok", "<h1>Télécharger une vidéo TikTok"],
  ["/telecharger-video-instagram", "Télécharger une vidéo ou un Reel Instagram", "<h1>Télécharger une vidéo Instagram"],
  ["/telecharger-video-facebook", "Télécharger une vidéo Facebook", "<h1>Télécharger une vidéo Facebook"],
  ["/telecharger-video-twitter", "Télécharger une vidéo Twitter / X", "<h1>Télécharger une vidéo Twitter / X"],
  ["/telecharger-video-autres-plateformes", "Télécharger une vidéo Vimeo", "<h1>Télécharger une vidéo en ligne"],
  ["/meilleur-telechargeur-video", "Meilleur téléchargeur vidéo", "<h1>Choisir le meilleur téléchargeur vidéo"],
];

for (const [pathname, title, heading] of landingPages) {
  test(`server-renders unique SEO content for ${pathname}`, async () => {
    const response = await render(pathname);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, new RegExp(`<title>${title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i"));
    assert.ok(html.includes(heading));
    assert.match(html, new RegExp(`rel="canonical" href="https://totube\\.online${pathname}`));
    assert.match(html, /"@type":"FAQPage"/i);
    assert.match(html, /"@type":"BreadcrumbList"/i);
  });
}

test("recognizes supported public social-media links before conversion", async () => {
  const response = await request("/api/convert", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ action: "inspect", url: "https://www.tiktok.com/@creator/video/123456789" }),
  });
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.media.source, "TikTok");
  assert.equal(data.media.title, "Média TikTok");
});
