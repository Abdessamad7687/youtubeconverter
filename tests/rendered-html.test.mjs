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

test("redirects the legacy root to the French locale", async () => {
  const response = await render();
  assert.equal(response.status, 308);
  assert.equal(new URL(response.headers.get("location")).pathname, "/fr");
});

test("server-renders an indexable, multilingual French homepage", async () => {
  const response = await render("/fr");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();

  assert.match(html, /<html lang="fr" dir="ltr">/i);
  assert.match(html, /<title>Convertisseur vidéo MP3, MP4, WAV et plus \| toTube<\/title>/i);
  assert.match(html, /<meta name="description" content="[^"]*TikTok/i);
  assert.match(html, /<meta name="robots" content="index, follow"/i);
  assert.match(html, /rel="canonical" href="https:\/\/totube\.online\/fr"/i);
  assert.match(html, /hreflang="en" href="https:\/\/totube\.online\/en"/i);
  assert.match(html, /<h1>Convertisseur vidéo/i);
  assert.match(html, /"@type":"WebSite","name":"toTube"/i);
  assert.match(html, /href="\/fr\/telecharger-video-tiktok"/i);
  assert.match(html, /placeholder="https:\/\/tiktok\.com\/@creator\/video\/…"/i);
  assert.match(html, /Liens acceptés : YouTube, TikTok, Instagram, Facebook, X, Rumble et Threads/i);
  assert.match(html, /aria-describedby="media-platform-hint"/i);
  assert.match(html, /href="\/fr\/youtube-mp3-320-kbps"/i);
  assert.match(html, /Choisissez la qualité/i);
  assert.match(html, /Nous vérifions le fichier/i);
  assert.match(html, /"@type":"FAQPage"/i);
  assert.match(html, /FFprobe output validation/i);
  assert.match(html, /FLAC/);
  assert.match(html, /OPUS/);
  assert.match(html, /5321f0adf5a727cf9500e1e0bce95ca9/i);
  assert.match(html, /4ed5c4bd0900ef9380332764b589781a/i);
  assert.match(html, /sandbox="allow-same-origin allow-scripts/i);
  assert.match(html, /googletagmanager\.com\/gtag\/js\?id=G-GDL0WSR1P6/i);
  assert.match(html, /gtag\('config', 'G-GDL0WSR1P6'\)/i);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/i);
});

const localizedHomes = [
  ["/en", "en", "Universal video"],
  ["/ar", "ar", "محول فيديو"],
  ["/es", "es", "Convertidor de vídeo"],
  ["/pt", "pt", "Conversor de vídeo"],
  ["/de", "de", "Universeller"],
];

for (const [pathname, lang, heading] of localizedHomes) {
  test(`renders localized homepage ${pathname}`, async () => {
    const response = await render(pathname);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, new RegExp(`<html lang="${lang}"`));
    assert.ok(html.includes(`<h1>${heading}`));
    assert.match(html, new RegExp(`rel="canonical" href="https://totube\\.online${pathname}`));
  });
}

const localizedQualityPages = [
  ["/fr/youtube-mp3-320-kbps", "fr", "YouTube MP3 320 kbps"],
  ["/en/youtube-to-mp4-1080p", "en", "YouTube to MP4 1080p"],
  ["/ar/youtube-mp3-320kbps", "ar", "YouTube إلى MP3 320 kbps"],
  ["/es/youtube-mp4-1080p", "es", "YouTube a MP4 1080p"],
  ["/pt/youtube-mp3-320-kbps", "pt", "YouTube para MP3 320 kbps"],
  ["/de/youtube-mp4-1080p", "de", "YouTube zu MP4 1080p"],
];

for (const [pathname, lang, heading] of localizedQualityPages) {
  test(`renders quality-intent SEO page ${pathname}`, async () => {
    const response = await render(pathname);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, new RegExp(`<html lang="${lang}"`));
    assert.ok(html.includes(`<h1>${heading}`));
    assert.match(html, new RegExp(`rel="canonical" href="https://totube\\.online${pathname}`));
    assert.match(html, /hreflang="x-default"/i);
    assert.match(html, /"@type":"FAQPage"/i);
    assert.match(html, /"@type":"WebApplication"/i);
    assert.match(html, /class="tool-navigation"/i);
    assert.match(html, /class="tool-footer"/i);
    assert.match(html, /"@type":"BreadcrumbList"/i);
    assert.match(html, /ad-banner-[^"']+\.js/i);
    assert.match(html, /5321f0adf5a727cf9500e1e0bce95ca9/i);
    assert.match(html, /4ed5c4bd0900ef9380332764b589781a/i);
    assert.doesNotMatch(html, /highperformanceformat\.com\/undefined/i);
  });
}

test("publishes all localized topic pages in the sitemap", async () => {
  const response = await request("/sitemap.xml");
  assert.equal(response.status, 200);
  const xml = await response.text();
  assert.equal((xml.match(/<url>/g) || []).length, 66);
  assert.match(xml, /https:\/\/totube\.online\/en\/youtube-to-mp3-320kbps/);
  assert.match(xml, /https:\/\/totube\.online\/fr\/youtube-mp4-1080p/);
  assert.match(xml, /https:\/\/totube\.online\/fr\/telecharger-video-rumble/);
  assert.match(xml, /https:\/\/totube\.online\/en\/download-threads-video/);
  assert.doesNotMatch(xml, /<lastmod>/, "lastmod must be omitted unless it reflects a real content update");
});

const landingPages = [
  ["/youtube-mp3", "YouTube MP3 gratuit", "<h1>YouTube MP3"],
  ["/youtube-mp4", "YouTube MP4 —", "<h1>YouTube MP4"],
  ["/convertisseur-mp3", "Convertisseur MP3 gratuit", "<h1>Convertisseur MP3"],
  ["/alternative-notube", "Alternative à noTube", "<h1>Une alternative à noTube"],
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
    assert.match(html, /ad-banner-[^"']+\.js/i);
    assert.match(html, /5321f0adf5a727cf9500e1e0bce95ca9/i);
    assert.match(html, /4ed5c4bd0900ef9380332764b589781a/i);
    assert.doesNotMatch(html, /highperformanceformat\.com\/undefined/i);
  });
}

const localizedPlatformPages = [
  ["/fr/telecharger-video-youtube", "fr", "Télécharger une vidéo YouTube"],
  ["/en/download-tiktok-video", "en", "Download TikTok videos"],
  ["/ar/instagram-downloader", "ar", "تنزيل فيديو Instagram"],
  ["/es/descargar-video-facebook", "es", "Descargar vídeos de Facebook"],
  ["/pt/baixar-video-twitter", "pt", "Baixar vídeos do Twitter / X"],
  ["/de/youtube-video-herunterladen", "de", "YouTube-Videos herunterladen"],
  ["/fr/telecharger-video-rumble", "fr", "Télécharger une vidéo Rumble"],
  ["/en/download-threads-video", "en", "Download Threads videos"],
  ["/en/download-rumble-video", "en", "Rumble video downloader"],
];

for (const [pathname, lang, heading] of localizedPlatformPages) {
  test(`renders multilingual platform SEO page ${pathname}`, async () => {
    const response = await render(pathname);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, new RegExp(`<html lang="${lang}"`));
    assert.ok(html.includes(`<h1>${heading}`));
    assert.match(html, new RegExp(`rel="canonical" href="https://totube\\.online${pathname}`));
    assert.match(html, /hreflang="x-default"/i);
    assert.match(html, /"@type":"FAQPage"/i);
    assert.match(html, /"@type":"WebApplication"/i);
    assert.match(html, /class="tool-navigation"/i);
    assert.match(html, /class="tool-footer"/i);
    assert.match(html, /class="seo-inline-converter"/i);
    assert.match(html, /ad-banner-[^"']+\.js/i);
    assert.match(html, /5321f0adf5a727cf9500e1e0bce95ca9/i);
    assert.match(html, /4ed5c4bd0900ef9380332764b589781a/i);
    assert.doesNotMatch(html, /highperformanceformat\.com\/undefined/i);
  });
}

test("targets the supplied Rumble keyword cluster with useful page content", async () => {
  const response = await render("/en/download-rumble-video");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<title>Rumble Video Downloader — Download Rumble Videos \| toTube<\/title>/i);
  assert.match(html, /name="keywords" content="[^"]*download rumble video[^"]*rumble downloader[^"]*rumble video download/i);
  assert.match(html, /How do I download a Rumble video\?/i);
  assert.match(html, /Rumble video downloader for MP4 and MP3/i);
  assert.match(html, /placeholder="https:\/\/rumble\.com\/v…-video\.html"/i);
});

test("legacy French platform URL redirects to its localized replacement", async () => {
  const response = await render("/telecharger-video-tiktok");
  assert.equal(response.status, 308);
  assert.equal(new URL(response.headers.get("location")).pathname, "/fr/telecharger-video-tiktok");
});

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

test("recognizes Rumble and Threads public links before conversion", async () => {
  for (const [url, source] of [
    ["https://rumble.com/v123abc-example.html", "Rumble"],
    ["https://www.threads.com/@creator/post/ABC123", "Threads"],
  ]) {
    const response = await request("/api/convert", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "inspect", url }),
    });
    assert.equal(response.status, 200);
    const data = await response.json();
    assert.equal(data.media.source, source);
  }
});

test("accepts a new lossless audio format", async () => {
  const response = await request("/api/convert", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ action: "convert", url: "https://cdn.example.com/sample.flac", format: "flac" }),
  });
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.download.url, "https://cdn.example.com/sample.flac");
  assert.match(data.download.filename, /\.flac$/);
});
