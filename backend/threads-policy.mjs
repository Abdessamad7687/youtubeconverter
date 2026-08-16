function threadsShortcode(input) {
  const url = input instanceof URL ? input : new URL(input);
  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  if (host !== "threads.com" && host !== "threads.net") return null;
  const match = url.pathname.match(/\/(?:@[^/]+\/)post\/([A-Za-z0-9_-]+)/);
  return match?.[1] || null;
}

function isVideoMediaUrl(value) {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    const trustedCdn = host === "fbcdn.net" || host.endsWith(".fbcdn.net") || host === "cdninstagram.com" || host.endsWith(".cdninstagram.com");
    return url.protocol === "https:" && trustedCdn && /\.mp4$/i.test(url.pathname);
  } catch {
    return false;
  }
}

export function resolveThreadsVideo(posts, originalUrl) {
  const expectedShortcode = threadsShortcode(originalUrl);
  if (!expectedShortcode) throw new Error("Lien Threads invalide.");
  const post = Array.isArray(posts)
    ? posts.find((item) => item && item.shortcode === expectedShortcode)
    : null;
  if (!post) throw new Error("La publication Threads retournée ne correspond pas au lien demandé.");
  const mediaUrl = Array.isArray(post.media_urls) ? post.media_urls.find(isVideoMediaUrl) : null;
  if (!mediaUrl) throw new Error("Cette publication Threads publique ne contient pas de vidéo téléchargeable.");
  return { mediaUrl, shortcode: expectedShortcode };
}

export function isThreadsUrl(input) {
  try {
    return Boolean(threadsShortcode(input));
  } catch {
    return false;
  }
}
