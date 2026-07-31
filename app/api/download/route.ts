import { NextRequest, NextResponse } from "next/server";
import { Innertube } from "youtubei.js";

const YOUTUBE_HOSTS = new Set(["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be", "music.youtube.com"]);

function extractVideoId(input: string) {
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    throw new Error("Lien YouTube invalide.");
  }
  if (!YOUTUBE_HOSTS.has(url.hostname.toLowerCase())) throw new Error("Seuls les liens YouTube sont acceptés.");
  const id = url.hostname === "youtu.be" ? url.pathname.slice(1).split("/")[0] : url.searchParams.get("v");
  if (!id || !/^[a-zA-Z0-9_-]{11}$/.test(id)) throw new Error("Identifiant de vidéo YouTube invalide.");
  return id;
}

function safeFilename(title: string) {
  const name = title
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9\s-_]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80) || "totube-video";
  return `${name}.mp4`;
}

export async function GET(request: NextRequest) {
  try {
    const input = request.nextUrl.searchParams.get("url");
    if (!input || input.length > 2048) throw new Error("Lien YouTube manquant.");
    const videoId = extractVideoId(input);

    const youtube = await Innertube.create({
      enable_session_cache: false,
      generate_session_locally: true,
      retrieve_player: false,
      lang: "fr",
      fetch: (input, init) => fetch(input, init),
    });
    const info = await youtube.getBasicInfo(videoId, { client: "ANDROID" });
    const stream = await info.download({ type: "video+audio", quality: "360p", format: "mp4" });
    const filename = safeFilename(info.basic_info.title || "totube-video");

    return new NextResponse(stream as BodyInit, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (caught) {
    const message = caught instanceof Error ? caught.message : "Impossible de télécharger cette vidéo.";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
