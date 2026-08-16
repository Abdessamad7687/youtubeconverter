"use client";

import { ArrowRight, Check, Download, Link2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { Locale, PlatformId, platformNames } from "./i18n";

type Format = "mp3" | "mp4" | "m4a" | "wav" | "aac" | "flac" | "opus";
type Result = { url: string; filename: string; note?: string };

const SMARTLINK_URL = "https://www.effectivecpmnetwork.com/ajqxrtk2?key=e88c6ebfc5c63d06d4e955cce6e4d950";
const formats: Format[] = ["mp4", "mp3", "m4a", "wav", "aac", "flac", "opus"];
const placeholders: Record<PlatformId, string> = {
  youtube: "https://youtube.com/watch?v=…",
  tiktok: "https://tiktok.com/@creator/video/…",
  instagram: "https://instagram.com/reel/…",
  facebook: "https://facebook.com/watch/?v=…",
  twitter: "https://x.com/creator/status/…",
  rumble: "https://rumble.com/v…-video.html",
  threads: "https://threads.com/@creator/post/…",
};
const labels: Record<Locale, { label: string; button: string; working: string; download: string; success: string; error: string }> = {
  fr: { label: "Collez le lien public", button: "Télécharger", working: "Préparation…", download: "Télécharger le fichier", success: "Fichier vérifié et prêt", error: "Impossible de préparer ce lien." },
  en: { label: "Paste the public link", button: "Download", working: "Preparing…", download: "Download file", success: "Verified file ready", error: "We could not prepare this link." },
  ar: { label: "ألصق الرابط العام", button: "تنزيل", working: "جارٍ التحضير…", download: "تنزيل الملف", success: "الملف جاهز وتم التحقق منه", error: "تعذر إعداد هذا الرابط." },
  es: { label: "Pega el enlace público", button: "Descargar", working: "Preparando…", download: "Descargar archivo", success: "Archivo verificado y listo", error: "No se pudo preparar este enlace." },
  pt: { label: "Cole o link público", button: "Baixar", working: "Preparando…", download: "Baixar arquivo", success: "Arquivo verificado e pronto", error: "Não foi possível preparar este link." },
  de: { label: "Öffentlichen Link einfügen", button: "Herunterladen", working: "Wird vorbereitet…", download: "Datei herunterladen", success: "Geprüfte Datei ist bereit", error: "Dieser Link konnte nicht vorbereitet werden." },
};

export default function InlinePlatformConverter({ locale, platform }: { locale: Locale; platform: PlatformId }) {
  const copy = labels[locale];
  const [url, setUrl] = useState("");
  const [format, setFormat] = useState<Format>("mp4");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!url.trim() || busy) return;
    window.open(SMARTLINK_URL, "_blank", "noopener");
    setBusy(true); setError(""); setResult(null);
    try {
      const response = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "convert", url: url.trim(), format, videoQuality: 1080, audioQuality: 320 }),
      });
      const data = await response.json() as { download?: Result; error?: string };
      if (!response.ok || !data.download) throw new Error(data.error || copy.error);
      setResult(data.download);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : copy.error);
    } finally {
      setBusy(false);
    }
  }

  return <div className="seo-inline-converter" id="converter">
    <form onSubmit={submit}>
      <label htmlFor={`tool-url-${platform}`}>{copy.label} {platformNames[platform]}</label>
      <div className="seo-converter-row">
        <div className="seo-converter-input"><Link2 size={18} /><input id={`tool-url-${platform}`} type="url" required value={url} onChange={(event) => setUrl(event.target.value)} placeholder={placeholders[platform]} autoComplete="url" /></div>
        <select value={format} onChange={(event) => setFormat(event.target.value as Format)} aria-label="Output format">{formats.map((item) => <option value={item} key={item}>{item.toUpperCase()}</option>)}</select>
        <button disabled={busy}>{busy ? copy.working : copy.button} <ArrowRight size={16} /></button>
      </div>
    </form>
    {error && <p className="seo-converter-error" role="alert">{error}</p>}
    {result && <div className="seo-converter-result"><span><Check size={17} /><span><strong>{copy.success}</strong><small>{result.filename}</small></span></span><a href={result.url} download={result.filename}><Download size={16} /> {copy.download}</a></div>}
  </div>;
}
