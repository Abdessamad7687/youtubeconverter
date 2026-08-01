import { NextRequest, NextResponse } from "next/server";

type Format = "mp3" | "mp4" | "m4a" | "wav" | "aac" | "flac" | "opus";

const SUPPORTED_FORMATS: Format[] = ["mp3", "mp4", "m4a", "wav", "aac", "flac", "opus"];
const VIDEO_QUALITIES = [360, 480, 720, 1080] as const;
const AUDIO_QUALITIES = [128, 192, 256, 320] as const;

const YOUTUBE_HOSTS = new Set(["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be", "music.youtube.com"]);
const DIRECT_EXTENSIONS = new Set(["mp3", "mp4", "m4a", "webm", "mov", "wav", "ogg", "aac", "flac", "opus"]);
const PLATFORM_HOSTS = [
  { label: "TikTok", hosts: ["tiktok.com"] },
  { label: "Instagram", hosts: ["instagram.com", "instagr.am"] },
  { label: "Facebook", hosts: ["facebook.com", "fb.watch"] },
  { label: "X / Twitter", hosts: ["x.com", "twitter.com"] },
  { label: "Vimeo", hosts: ["vimeo.com"] },
  { label: "Dailymotion", hosts: ["dailymotion.com", "dai.ly"] },
  { label: "Reddit", hosts: ["reddit.com", "redd.it"] },
  { label: "Pinterest", hosts: ["pinterest.com", "pin.it"] },
  { label: "Snapchat", hosts: ["snapchat.com"] },
  { label: "LinkedIn", hosts: ["linkedin.com"] },
];

function parseMediaUrl(input: unknown) {
  if (typeof input !== "string" || input.length > 2048) throw new Error("Collez un lien vidéo valide.");
  let parsed: URL;
  try {
    parsed = new URL(input);
  } catch {
    throw new Error("Cette adresse ne ressemble pas à une URL complète.");
  }
  if (parsed.protocol !== "https:") throw new Error("Pour votre sécurité, seuls les liens HTTPS sont acceptés.");
  return parsed;
}

function isYouTube(url: URL) {
  return YOUTUBE_HOSTS.has(url.hostname.toLowerCase());
}

function platformFor(url: URL) {
  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  return PLATFORM_HOSTS.find((platform) => platform.hosts.some((allowed) => host === allowed || host.endsWith(`.${allowed}`)));
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
    .slice(0, 80) || "totube-video";
  return `${base}.${format}`;
}

async function inspect(url: URL) {
  if (isYouTube(url)) {
    const endpoint = new URL("https://www.youtube.com/oembed");
    endpoint.searchParams.set("url", url.toString());
    endpoint.searchParams.set("format", "json");
    const response = await fetch(endpoint, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("Impossible d’accéder à cette vidéo YouTube. Vérifiez qu’elle est publique.");
    const data = (await response.json()) as { title?: string; author_name?: string; thumbnail_url?: string };
    return {
      title: data.title || "YouTube video",
      author: data.author_name,
      thumbnail: data.thumbnail_url,
      source: "YouTube" as const,
    };
  }

  const platform = platformFor(url);
  if (platform) {
    return {
      title: `Média ${platform.label}`,
      source: platform.label,
    };
  }

  const extension = directExtension(url);
  if (!extension) throw new Error("Cette plateforme ou ce type de lien n’est pas encore pris en charge.");
  const rawName = decodeURIComponent(url.pathname.split("/").pop() || "Media file").replace(/\.[^.]+$/, "");
  const title = rawName.replace(/[-_]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  return { title, source: "Direct media" as const };
}

async function requestConverter(url: URL, format: Format, videoQuality: number, audioQuality: number) {
  const converterUrl = process.env.CONVERTER_API_URL?.trim();
  if (!converterUrl) {
    throw new Error("La conversion audio nécessite le service FFmpeg privé. Choisissez MP4 ou connectez le service de conversion.");
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
      videoQuality: String(videoQuality),
      audioQuality: String(audioQuality),
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
    throw new Error(data.text || data.error?.code || "Le serveur de conversion n’a pas pu préparer ce lien.");
  }
  const downloadUrl = data.url || data.picker?.[0]?.url;
  if (!downloadUrl) throw new Error("La conversion s’est terminée sans fichier téléchargeable.");
  return { url: downloadUrl, filename: data.filename };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { action?: string; url?: unknown; format?: Format; videoQuality?: number; audioQuality?: number };
    const url = parseMediaUrl(body.url);
    if (body.action === "inspect") {
      return NextResponse.json({ media: await inspect(url) });
    }
    if (body.action !== "convert") return NextResponse.json({ error: "Action inconnue." }, { status: 400 });
    if (!body.format || !SUPPORTED_FORMATS.includes(body.format)) {
      return NextResponse.json({ error: "Choisissez un format pris en charge." }, { status: 400 });
    }
    const videoQuality = VIDEO_QUALITIES.includes(body.videoQuality as (typeof VIDEO_QUALITIES)[number]) ? Number(body.videoQuality) : 1080;
    const audioQuality = AUDIO_QUALITIES.includes(body.audioQuality as (typeof AUDIO_QUALITIES)[number]) ? Number(body.audioQuality) : 320;

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

    if (isYouTube(url) && body.format === "mp4" && !process.env.CONVERTER_API_URL) {
      const params = new URLSearchParams({ url: url.toString() });
      return NextResponse.json({
        download: {
          url: `/api/download?${params.toString()}`,
          filename: safeFilename(media.title, "mp4"),
          note: "MP4 360p — vidéo et audio",
        },
      });
    }

    const converted = await requestConverter(url, body.format, videoQuality, audioQuality);
    return NextResponse.json({
      download: {
        url: converted.url,
        filename: converted.filename || safeFilename(media.title, body.format),
        note: body.format === "mp4"
          ? `MP4 compatible jusqu’à ${videoQuality}p, fichier vérifié`
          : `${body.format.toUpperCase()} ${["wav", "flac"].includes(body.format) ? "sans perte" : `${audioQuality} kbps`}, fichier vérifié`,
      },
    });
  } catch (caught) {
    const message = caught instanceof Error ? caught.message : "Une erreur est survenue pendant le traitement du lien.";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
