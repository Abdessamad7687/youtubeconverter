import { NextRequest, NextResponse } from "next/server";

type Format = "mp3" | "mp4" | "m4a";

const YOUTUBE_HOSTS = new Set(["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be", "music.youtube.com"]);
const DIRECT_EXTENSIONS = new Set(["mp3", "mp4", "m4a", "webm", "mov", "wav", "ogg"]);

function parseMediaUrl(input: unknown) {
  if (typeof input !== "string" || input.length > 2048) throw new Error("Paste a valid media link.");
  let parsed: URL;
  try {
    parsed = new URL(input);
  } catch {
    throw new Error("That doesn’t look like a complete URL.");
  }
  if (parsed.protocol !== "https:") throw new Error("For your safety, only HTTPS links are accepted.");
  return parsed;
}

function isYouTube(url: URL) {
  return YOUTUBE_HOSTS.has(url.hostname.toLowerCase());
}

function directExtension(url: URL) {
  const extension = url.pathname.split(".").pop()?.toLowerCase() || "";
  return DIRECT_EXTENSIONS.has(extension) ? extension : null;
}

function safeFilename(title: string, format: Format) {
  const base = title
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9\s-_]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80) || "clipmint-export";
  return `${base}.${format}`;
}

async function inspect(url: URL) {
  if (isYouTube(url)) {
    const endpoint = new URL("https://www.youtube.com/oembed");
    endpoint.searchParams.set("url", url.toString());
    endpoint.searchParams.set("format", "json");
    const response = await fetch(endpoint, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("We couldn’t access that YouTube video. Make sure it is public.");
    const data = (await response.json()) as { title?: string; author_name?: string; thumbnail_url?: string };
    return {
      title: data.title || "YouTube video",
      author: data.author_name,
      thumbnail: data.thumbnail_url,
      source: "YouTube" as const,
    };
  }

  const extension = directExtension(url);
  if (!extension) throw new Error("Use a public YouTube link or a direct link ending in MP3, MP4, M4A, WEBM, MOV, WAV, or OGG.");
  const rawName = decodeURIComponent(url.pathname.split("/").pop() || "Media file").replace(/\.[^.]+$/, "");
  const title = rawName.replace(/[-_]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  return { title, source: "Direct media" as const };
}

async function requestConverter(url: URL, format: Format) {
  const converterUrl = process.env.CONVERTER_API_URL?.trim();
  if (!converterUrl) {
    throw new Error("YouTube exporting needs the private conversion service to be connected. The built-in Creative Commons sample is ready to try now.");
  }

  const headers: Record<string, string> = { "Content-Type": "application/json", Accept: "application/json" };
  if (process.env.CONVERTER_API_KEY) headers.Authorization = `Api-Key ${process.env.CONVERTER_API_KEY}`;

  const response = await fetch(converterUrl, {
    method: "POST",
    headers,
    body: JSON.stringify({
      url: url.toString(),
      downloadMode: format === "mp4" ? "auto" : "audio",
      audioFormat: format === "mp4" ? "best" : format,
      videoQuality: "1080",
      filenameStyle: "pretty",
    }),
  });
  const data = (await response.json().catch(() => ({}))) as {
    status?: string;
    url?: string;
    filename?: string;
    picker?: { url: string }[];
    error?: { code?: string };
    text?: string;
  };
  if (!response.ok || data.status === "error") {
    throw new Error(data.text || data.error?.code || "The conversion service couldn’t prepare this link.");
  }
  const downloadUrl = data.url || data.picker?.[0]?.url;
  if (!downloadUrl) throw new Error("The conversion completed without a downloadable file.");
  return { url: downloadUrl, filename: data.filename };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { action?: string; url?: unknown; format?: Format };
    const url = parseMediaUrl(body.url);
    if (body.action === "inspect") {
      return NextResponse.json({ media: await inspect(url) });
    }
    if (body.action !== "convert") return NextResponse.json({ error: "Unknown action." }, { status: 400 });
    if (!body.format || !["mp3", "mp4", "m4a"].includes(body.format)) {
      return NextResponse.json({ error: "Choose a supported format." }, { status: 400 });
    }

    const media = await inspect(url);
    const extension = directExtension(url);
    if (extension === body.format) {
      return NextResponse.json({
        download: {
          url: url.toString(),
          filename: safeFilename(media.title, body.format),
          note: "Original file — no quality loss",
        },
      });
    }

    const converted = await requestConverter(url, body.format);
    return NextResponse.json({
      download: {
        url: converted.url,
        filename: converted.filename || safeFilename(media.title, body.format),
        note: `${body.format.toUpperCase()} export`,
      },
    });
  } catch (caught) {
    const message = caught instanceof Error ? caught.message : "Something went wrong while processing this link.";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
