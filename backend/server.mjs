import { createServer } from "node:http";
import { createReadStream, existsSync } from "node:fs";
import { mkdir, readdir, rename, rm, stat } from "node:fs/promises";
import { spawn } from "node:child_process";
import { randomBytes, timingSafeEqual } from "node:crypto";
import { basename, extname, join, resolve } from "node:path";
import { tmpdir } from "node:os";

const PORT = Number(process.env.PORT || 8788);
const API_KEY = process.env.CONVERTER_API_KEY || "";
const PUBLIC_BASE_URL = (process.env.PUBLIC_BASE_URL || "").replace(/\/$/, "");
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "*";
const WORK_ROOT = resolve(process.env.WORK_DIR || join(tmpdir(), "totube-converter"));
const YTDLP_BIN = process.env.YTDLP_BIN || "yt-dlp";
const YTDLP_PROXY = process.env.YTDLP_PROXY?.trim();
const YTDLP_COOKIES_FILE = process.env.YTDLP_COOKIES_FILE?.trim();
const YTDLP_JS_RUNTIME = process.env.YTDLP_JS_RUNTIME?.trim() || "node";
const YTDLP_EXTRACTOR_ARGS = process.env.YTDLP_EXTRACTOR_ARGS?.trim();
const FFMPEG_BIN = process.env.FFMPEG_BIN || "ffmpeg";
const FFPROBE_BIN = process.env.FFPROBE_BIN || "ffprobe";
const MAX_DURATION = Number(process.env.MAX_DURATION_SECONDS || 1200);
const MAX_FILESIZE = process.env.MAX_FILESIZE || "500M";
const FILE_TTL_MS = Number(process.env.FILE_TTL_MINUTES || 30) * 60_000;
const MAX_CONCURRENT = Number(process.env.MAX_CONCURRENT_JOBS || 2);
const RATE_LIMIT = Number(process.env.RATE_LIMIT_PER_HOUR || 12);
const AUDIO_FORMATS = new Set(["mp3", "m4a", "wav", "aac", "flac", "opus"]);

const allowedHosts = [
  "youtube.com", "youtu.be", "tiktok.com", "x.com", "twitter.com",
  "instagram.com", "facebook.com", "twitch.tv", "soundcloud.com",
  "dailymotion.com", "vimeo.com", "pinterest.com", "pin.it",
  "snapchat.com", "linkedin.com", "reddit.com", "redd.it", "fb.watch",
  "dai.ly", "instagr.am",
];
const jobs = new Map();
const rateBuckets = new Map();
let activeJobs = 0;

await mkdir(WORK_ROOT, { recursive: true });

function setCors(response) {
  response.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  response.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.setHeader("X-Content-Type-Options", "nosniff");
}

function json(response, status, body) {
  setCors(response);
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  response.end(JSON.stringify(body));
}

function safeEqual(left, right) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

function authorized(request) {
  if (!API_KEY) return true;
  const header = request.headers.authorization || "";
  return safeEqual(header, `Api-Key ${API_KEY}`) || safeEqual(header, `Bearer ${API_KEY}`);
}

function validMediaUrl(input) {
  if (typeof input !== "string" || input.length > 2048) throw new Error("Lien média invalide.");
  const url = new URL(input);
  if (url.protocol !== "https:") throw new Error("Seuls les liens HTTPS sont acceptés.");
  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  if (!allowedHosts.some((allowed) => host === allowed || host.endsWith(`.${allowed}`))) {
    throw new Error("Cette plateforme n’est pas encore prise en charge.");
  }
  return url.toString();
}

function clientIp(request) {
  return String(request.headers["x-forwarded-for"] || request.socket.remoteAddress || "unknown").split(",")[0].trim();
}

function consumeRateLimit(request) {
  const key = clientIp(request);
  const now = Date.now();
  const bucket = (rateBuckets.get(key) || []).filter((time) => now - time < 3_600_000);
  if (bucket.length >= RATE_LIMIT) return false;
  bucket.push(now);
  rateBuckets.set(key, bucket);
  return true;
}

async function readJson(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 16_384) throw new Error("Requête trop volumineuse.");
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new Error("Corps JSON invalide.");
  }
}

function outputFormat(body) {
  if (body.downloadMode === "audio") {
    const requested = String(body.audioFormat || "mp3").toLowerCase();
    return AUDIO_FORMATS.has(requested) ? requested : "mp3";
  }
  return "mp4";
}

function publicBase(request) {
  if (PUBLIC_BASE_URL) return PUBLIC_BASE_URL;
  const protocol = String(request.headers["x-forwarded-proto"] || "http").split(",")[0];
  const host = request.headers["x-forwarded-host"] || request.headers.host || `localhost:${PORT}`;
  return `${protocol}://${host}`;
}

function run(command, args, timeoutMs = 600_000) {
  return new Promise((resolveRun, rejectRun) => {
    const child = spawn(command, args, { env: process.env, stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      rejectRun(new Error("La conversion a dépassé le délai autorisé."));
    }, timeoutMs);
    child.stdout.on("data", (chunk) => { if (stdout.length < 128_000) stdout += chunk; });
    child.stderr.on("data", (chunk) => { if (stderr.length < 128_000) stderr += chunk; });
    child.once("error", (error) => { clearTimeout(timer); rejectRun(error); });
    child.once("close", (code) => {
      clearTimeout(timer);
      if (code === 0) resolveRun({ stdout, stderr });
      else rejectRun(new Error(stderr.trim().split("\n").pop() || `yt-dlp a quitté avec le code ${code}.`));
    });
  });
}

async function probeMedia(filePath) {
  const result = await run(FFPROBE_BIN, [
    "-v", "error",
    "-show_entries", "stream=codec_name,codec_type,width,height,pix_fmt:format=duration,size",
    "-of", "json",
    filePath,
  ], 60_000);
  return JSON.parse(result.stdout);
}

async function ensureCompatibleMp4(filePath) {
  const initial = await probeMedia(filePath);
  const video = initial.streams?.find((stream) => stream.codec_type === "video");
  const audio = initial.streams?.find((stream) => stream.codec_type === "audio");
  if (video?.codec_name === "h264" && (!audio || audio.codec_name === "aac") && video.pix_fmt === "yuv420p") {
    return filePath;
  }

  const compatiblePath = join(resolve(filePath, ".."), ".totube-compatible.mp4");
  await run(FFMPEG_BIN, [
    "-hide_banner", "-loglevel", "error", "-y",
    "-i", filePath,
    "-map", "0:v:0",
    "-map", "0:a:0?",
    "-map_metadata", "0",
    "-c:v", "libx264",
    "-preset", "medium",
    "-crf", "20",
    "-pix_fmt", "yuv420p",
    "-c:a", "aac",
    "-b:a", "192k",
    "-ac", "2",
    "-movflags", "+faststart",
    "-max_muxing_queue_size", "4096",
    compatiblePath,
  ], 1_800_000);

  const verified = await probeMedia(compatiblePath);
  const verifiedVideo = verified.streams?.find((stream) => stream.codec_type === "video");
  const verifiedAudio = verified.streams?.find((stream) => stream.codec_type === "audio");
  if (verifiedVideo?.codec_name !== "h264" || (verifiedAudio && verifiedAudio.codec_name !== "aac")) {
    await rm(compatiblePath, { force: true });
    throw new Error("Impossible de créer un MP4 H.264/AAC compatible.");
  }

  await rm(filePath, { force: true });
  await rename(compatiblePath, filePath);
  return filePath;
}

async function verifyAudioFile(filePath, format) {
  const media = await probeMedia(filePath);
  const audio = media.streams?.find((stream) => stream.codec_type === "audio");
  const video = media.streams?.find((stream) => stream.codec_type === "video");
  const expectedCodecs = {
    mp3: ["mp3"],
    m4a: ["aac", "alac"],
    wav: ["pcm_"],
    aac: ["aac"],
    flac: ["flac"],
    opus: ["opus"],
  };
  const expected = expectedCodecs[format] || [];
  const codecMatches = expected.some((codec) => codec.endsWith("_") ? audio?.codec_name?.startsWith(codec) : audio?.codec_name === codec);
  if (!audio || video || !codecMatches) {
    throw new Error(`Le fichier ${format.toUpperCase()} généré n’a pas passé la vérification de compatibilité.`);
  }
  return filePath;
}

async function convert(request, body) {
  if (activeJobs >= MAX_CONCURRENT) throw new Error("Le serveur traite déjà plusieurs conversions. Réessayez dans un instant.");
  if (!consumeRateLimit(request)) throw new Error("Limite horaire atteinte. Réessayez plus tard.");

  const url = validMediaUrl(body.url);
  const format = outputFormat(body);
  const requestedHeight = Number(body.videoQuality || 1080);
  const videoHeight = [144, 240, 360, 480, 720, 1080].includes(requestedHeight) ? requestedHeight : 1080;
  const requestedBitrate = Number(body.audioQuality || 320);
  const audioBitrate = [128, 192, 256, 320].includes(requestedBitrate) ? requestedBitrate : 320;
  const jobId = randomBytes(12).toString("hex");
  const jobDir = join(WORK_ROOT, jobId);
  await mkdir(jobDir, { recursive: true });

  const args = [
    "--no-playlist",
    "--no-warnings",
    "--no-progress",
    "--newline",
    "--restrict-filenames",
    "--concurrent-fragments", "4",
    "--js-runtimes", YTDLP_JS_RUNTIME,
    "--max-filesize", MAX_FILESIZE,
    "--match-filter", `duration <= ${MAX_DURATION} & !is_live`,
    "--paths", `home:${jobDir}`,
    "--output", "%(title).120B-%(id)s.%(ext)s",
    "--print", "after_move:filepath",
  ];

  if (YTDLP_PROXY) args.push("--proxy", YTDLP_PROXY);
  if (YTDLP_COOKIES_FILE) args.push("--cookies", YTDLP_COOKIES_FILE);
  if (YTDLP_EXTRACTOR_ARGS) args.push("--extractor-args", YTDLP_EXTRACTOR_ARGS);

  if (format === "mp4") {
    args.push(
      "--format",
      `bv*[vcodec^=avc1][height<=${videoHeight}][ext=mp4]+ba[acodec^=mp4a][ext=m4a]/b[vcodec^=avc1][height<=${videoHeight}][ext=mp4]/bv*[height<=${videoHeight}]+ba/b[height<=${videoHeight}]/b`,
      "--merge-output-format", "mp4",
      "--remux-video", "mp4",
    );
  } else {
    const quality = ["wav", "flac"].includes(format) ? "0" : `${audioBitrate}K`;
    args.push("--extract-audio", "--audio-format", format, "--audio-quality", quality, "--embed-metadata");
  }
  args.push(url);

  activeJobs += 1;
  try {
    const result = await run(YTDLP_BIN, args);
    const printedPaths = result.stdout.split("\n").map((line) => line.trim()).filter(Boolean);
    let filePath = printedPaths.reverse().find((line) => existsSync(line) && resolve(line).startsWith(`${jobDir}/`));
    if (!filePath) {
      const files = await readdir(jobDir);
      const candidate = files.find((file) => [".mp3", ".m4a", ".mp4", ".wav", ".aac", ".flac", ".opus"].includes(extname(file).toLowerCase()));
      if (candidate) filePath = join(jobDir, candidate);
    }
    if (!filePath) throw new Error("La conversion n’a produit aucun fichier.");

    if (format === "mp4") filePath = await ensureCompatibleMp4(filePath);
    else filePath = await verifyAudioFile(filePath, format);

    const fileInfo = await stat(filePath);
    const token = randomBytes(24).toString("hex");
    const filename = basename(filePath);
    jobs.set(token, { filePath, filename, size: fileInfo.size, expiresAt: Date.now() + FILE_TTL_MS, jobDir });
    return {
      status: "redirect",
      url: `${publicBase(request)}/files/${token}`,
      filename,
    };
  } catch (error) {
    await rm(jobDir, { recursive: true, force: true });
    throw error;
  } finally {
    activeJobs -= 1;
  }
}

async function serveFile(request, response, token) {
  const job = jobs.get(token);
  if (!job || job.expiresAt < Date.now() || !existsSync(job.filePath)) {
    jobs.delete(token);
    return json(response, 404, { status: "error", error: { code: "file.expired" }, text: "Ce fichier a expiré." });
  }
  const ext = extname(job.filename).toLowerCase();
  const types = {
    ".mp3": "audio/mpeg",
    ".m4a": "audio/mp4",
    ".mp4": "video/mp4",
    ".wav": "audio/wav",
    ".aac": "audio/aac",
    ".flac": "audio/flac",
    ".opus": "audio/ogg",
  };
  setCors(response);
  response.writeHead(200, {
    "Content-Type": types[ext] || "application/octet-stream",
    "Content-Length": job.size,
    "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(job.filename)}`,
    "Cache-Control": "private, no-store",
  });
  createReadStream(job.filePath).pipe(response);
}

async function cleanup() {
  const now = Date.now();
  for (const [token, job] of jobs) {
    if (job.expiresAt < now) {
      jobs.delete(token);
      await rm(job.jobDir, { recursive: true, force: true });
    }
  }
}
setInterval(cleanup, 300_000).unref();

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url || "/", `http://${request.headers.host || `localhost:${PORT}`}`);
    if (request.method === "OPTIONS") {
      setCors(response);
      response.writeHead(204);
      return response.end();
    }
    if (request.method === "GET" && url.pathname === "/") {
      return json(response, 200, {
        cobalt: { version: "totube-1.0", url: publicBase(request), services: allowedHosts },
        status: "ready",
        formats: ["mp3", "m4a", "mp4", "wav", "aac", "flac", "opus"],
        activeJobs,
      });
    }
    if (request.method === "GET" && url.pathname === "/health") return json(response, 200, { ok: true });
    if (request.method === "GET" && url.pathname.startsWith("/files/")) {
      return serveFile(request, response, url.pathname.slice("/files/".length));
    }
    if (request.method === "POST" && url.pathname === "/") {
      if (!authorized(request)) return json(response, 401, { status: "error", error: { code: "api.auth.missing" }, text: "Clé API invalide." });
      const body = await readJson(request);
      const result = await convert(request, body);
      return json(response, 200, result);
    }
    return json(response, 404, { status: "error", error: { code: "route.not_found" }, text: "Route introuvable." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur de conversion inattendue.";
    return json(response, 422, { status: "error", error: { code: "conversion.failed" }, text: message });
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`toTube converter listening on http://localhost:${PORT}`);
});

async function shutdown() {
  server.close();
  await Promise.all([...jobs.values()].map((job) => rm(job.jobDir, { recursive: true, force: true })));
  process.exit(0);
}
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
