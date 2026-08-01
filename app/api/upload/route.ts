import { NextRequest, NextResponse } from "next/server";

const SUPPORTED_FORMATS = new Set(["mp3", "mp4", "m4a", "wav", "aac", "flac", "opus"]);
const MAX_UPLOAD_BYTES = 262_144_000;

export async function POST(request: NextRequest) {
  try {
    const converterUrl = process.env.CONVERTER_API_URL?.trim();
    if (!converterUrl) throw new Error("Le service de conversion de fichiers n’est pas connecté.");

    const filename = request.headers.get("x-file-name") || "totube-upload";
    const format = (request.headers.get("x-output-format") || "mp4").toLowerCase();
    const contentLength = Number(request.headers.get("content-length") || 0);
    if (!SUPPORTED_FORMATS.has(format)) throw new Error("Format de sortie non pris en charge.");
    if (contentLength > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: "Le fichier dépasse la limite de 250 Mo.", code: "upload.too_large" }, { status: 413 });
    }
    if (!request.body) throw new Error("Aucun fichier reçu.");

    const headers: Record<string, string> = {
      "Content-Type": request.headers.get("content-type") || "application/octet-stream",
      "X-File-Name": filename,
      "X-Output-Format": format,
      "X-Video-Quality": request.headers.get("x-video-quality") || "1080",
      "X-Audio-Quality": request.headers.get("x-audio-quality") || "320",
    };
    const clientIp = (request.headers.get("cf-connecting-ip") || request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for") || "").split(",")[0].trim();
    if (clientIp) headers["X-Forwarded-For"] = clientIp;
    if (process.env.CONVERTER_API_KEY) headers.Authorization = `Api-Key ${process.env.CONVERTER_API_KEY}`;

    const converterRequest: RequestInit & { duplex: "half" } = {
      method: "POST",
      headers,
      body: request.body,
      duplex: "half",
    };
    const response = await fetch(new URL("upload", converterUrl), converterRequest);
    const data = (await response.json().catch(() => ({}))) as {
      status?: string;
      url?: string;
      filename?: string;
      text?: string;
      error?: { code?: string };
    };
    if (!response.ok || !data.url) {
      return NextResponse.json({ error: data.text || "Impossible de convertir ce fichier.", code: data.error?.code || "upload.failed" }, { status: response.status || 422 });
    }
    return NextResponse.json({
      download: {
        url: data.url,
        filename: data.filename || `totube-upload.${format}`,
        note: `${format.toUpperCase()} — fichier téléversé et vérifié`,
      },
    });
  } catch (caught) {
    const message = caught instanceof Error ? caught.message : "Impossible de convertir ce fichier.";
    return NextResponse.json({ error: message, code: "upload.failed" }, { status: 422 });
  }
}
