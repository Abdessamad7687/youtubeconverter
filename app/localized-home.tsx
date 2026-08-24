"use client";

import {
  ArrowDown,
  ArrowRight,
  Check,
  ChevronDown,
  Download,
  FileAudio,
  FileVideo,
  Languages,
  Link2,
  LockKeyhole,
  Menu,
  Play,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  WandSparkles,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import AdBanner from "./ad-banner";
import { AD_KEYS } from "./ad-config";
import { homeCopy, Locale, locales, localizedSlugs, platformIds, platformNames, platformPath, qualityPagePath } from "./i18n";
import { openSmartLink } from "./smartlink";
import { FormatMenu, PlatformMenu } from "./tool-navigation";

export type Format = "mp3" | "mp4" | "m4a" | "wav" | "aac" | "flac" | "opus";
type Phase = "idle" | "inspecting" | "ready" | "converting" | "done" | "error";
type MediaPreview = { title: string; author?: string; thumbnail?: string; source: string };
type DownloadResult = { url: string; filename: string; note?: string };

const SAMPLE_URL = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";
const platformPlaceholders = [
  "https://tiktok.com/@creator/video/…",
  "https://instagram.com/reel/…",
  "https://facebook.com/watch/?v=…",
  "https://x.com/creator/status/…",
  "https://youtube.com/watch?v=…",
  "https://rumble.com/v…",
  "https://threads.com/@creator/post/…",
];

const formatDefinitions: { id: Format; label: string; note: string; icon: typeof FileAudio }[] = [
  { id: "mp3", label: "MP3", note: "Universal audio", icon: FileAudio },
  { id: "mp4", label: "MP4", note: "H.264 video", icon: FileVideo },
  { id: "m4a", label: "M4A", note: "Efficient audio", icon: FileAudio },
  { id: "wav", label: "WAV", note: "Uncompressed", icon: FileAudio },
  { id: "aac", label: "AAC", note: "Compact audio", icon: FileAudio },
  { id: "flac", label: "FLAC", note: "Lossless audio", icon: FileAudio },
  { id: "opus", label: "OPUS", note: "Modern audio", icon: FileAudio },
];

const qualityCopy: Record<Locale, { title: string; video: string; audio: string; upTo: string; lossless: string }> = {
  fr: { title: "Choisissez la qualité", video: "Résolution vidéo", audio: "Débit audio", upTo: "Jusqu’à", lossless: "Qualité sans perte automatique" },
  en: { title: "Choose quality", video: "Video resolution", audio: "Audio bitrate", upTo: "Up to", lossless: "Automatic lossless quality" },
  ar: { title: "اختر الجودة", video: "دقة الفيديو", audio: "معدل الصوت", upTo: "حتى", lossless: "جودة بدون فقدان تلقائياً" },
  es: { title: "Elige la calidad", video: "Resolución de vídeo", audio: "Bitrate de audio", upTo: "Hasta", lossless: "Calidad sin pérdida automática" },
  pt: { title: "Escolha a qualidade", video: "Resolução do vídeo", audio: "Taxa de áudio", upTo: "Até", lossless: "Qualidade sem perdas automática" },
  de: { title: "Qualität auswählen", video: "Videoauflösung", audio: "Audio-Bitrate", upTo: "Bis zu", lossless: "Automatische verlustfreie Qualität" },
};

const platformHint: Record<Locale, string> = {
  fr: "Liens acceptés : YouTube, TikTok, Instagram, Facebook, X, Rumble et Threads",
  en: "Accepted links: YouTube, TikTok, Instagram, Facebook, X, Rumble and Threads",
  ar: "الروابط المدعومة: YouTube وTikTok وInstagram وFacebook وX وRumble وThreads",
  es: "Enlaces admitidos: YouTube, TikTok, Instagram, Facebook, X, Rumble y Threads",
  pt: "Links aceitos: YouTube, TikTok, Instagram, Facebook, X, Rumble e Threads",
  de: "Unterstützte Links: YouTube, TikTok, Instagram, Facebook, X, Rumble und Threads",
};

const uploadCopy: Record<Locale, { title: string; text: string; button: string; limit: string }> = {
  fr: { title: "YouTube demande une authentification", text: "Téléversez un fichier que vous êtes autorisé à utiliser : toTube le convertira et vérifiera le résultat.", button: "Choisir un fichier", limit: "MP4, MOV, WEBM, MKV ou audio — 250 Mo maximum" },
  en: { title: "YouTube requires authentication", text: "Upload a file you are authorized to use. toTube will convert it and verify the result.", button: "Choose a file", limit: "MP4, MOV, WEBM, MKV or audio — 250 MB maximum" },
  ar: { title: "يتطلب YouTube تسجيل الدخول", text: "ارفع ملفاً مصرحاً لك باستخدامه وسيقوم toTube بتحويله والتحقق منه.", button: "اختر ملفاً", limit: "MP4 أو MOV أو WEBM أو MKV أو صوت — بحد أقصى 250 ميغابايت" },
  es: { title: "YouTube requiere autenticación", text: "Sube un archivo que tengas autorización para usar. toTube lo convertirá y verificará.", button: "Elegir un archivo", limit: "MP4, MOV, WEBM, MKV o audio — máximo 250 MB" },
  pt: { title: "O YouTube exige autenticação", text: "Envie um arquivo que você tenha autorização para usar. O toTube irá convertê-lo e verificá-lo.", button: "Escolher arquivo", limit: "MP4, MOV, WEBM, MKV ou áudio — máximo de 250 MB" },
  de: { title: "YouTube verlangt eine Anmeldung", text: "Lade eine Datei hoch, die du verwenden darfst. toTube konvertiert und überprüft sie.", button: "Datei auswählen", limit: "MP4, MOV, WEBM, MKV oder Audio — maximal 250 MB" },
};

const angleCopy: Record<Locale, { kicker: string; title: string; accent: string; intro: string; cta: string; cards: { title: string; text: string }[] }> = {
  fr: { kicker: "La différence toTube", title: "Choisissez la qualité.", accent: "Nous vérifions le fichier.", intro: "Pas de promesse 4K fictive ni d’extension simplement renommée : toTube annonce ses limites et contrôle le média généré avant de proposer le téléchargement.", cta: "Tester le convertisseur", cards: [{ title: "MP4 compatible", text: "Contrôle H.264, AAC et yuv420p pour une lecture fiable sur téléphone, TV et ordinateur." }, { title: "Audio vérifié", text: "FFprobe confirme la présence du codec attendu dans chaque MP3, M4A, WAV, AAC, FLAC ou OPUS." }, { title: "Qualité choisie", text: "Sélectionnez jusqu’à 1080p en vidéo ou 128 à 320 kbps pour les formats audio compressés." }, { title: "Limites transparentes", text: "Liens publics, durée et qualité maximale sont annoncés clairement, sans prétendre accéder aux médias privés." }] },
  en: { kicker: "The toTube difference", title: "You choose the quality.", accent: "We verify the file.", intro: "No fictional 4K promise and no renamed extensions: toTube states its limits and checks the generated media before offering the download.", cta: "Try the converter", cards: [{ title: "Compatible MP4", text: "H.264, AAC and yuv420p checks for reliable playback on phones, TVs and computers." }, { title: "Verified audio", text: "FFprobe confirms the expected codec in every MP3, M4A, WAV, AAC, FLAC or OPUS file." }, { title: "Selected quality", text: "Choose video up to 1080p or 128 to 320 kbps for compressed audio formats." }, { title: "Clear limits", text: "Public links, duration and maximum quality are stated plainly, with no claim to access private media." }] },
  ar: { kicker: "ميزة toTube", title: "أنت تختار الجودة.", accent: "ونحن نتحقق من الملف.", intro: "لا وعود 4K وهمية ولا تغيير لامتداد الملف فقط: يوضح toTube حدوده ويفحص الوسائط قبل إتاحة التنزيل.", cta: "جرّب المحول", cards: [{ title: "MP4 متوافق", text: "فحص H.264 وAAC وyuv420p لتشغيل موثوق على الهاتف والتلفاز والكمبيوتر." }, { title: "صوت مُتحقق منه", text: "يتأكد FFprobe من وجود الترميز الصحيح في ملفات MP3 وM4A وWAV وAAC وFLAC وOPUS." }, { title: "جودة قابلة للاختيار", text: "اختر فيديو حتى 1080p أو صوتاً مضغوطاً من 128 إلى 320 kbps." }, { title: "حدود واضحة", text: "نوضح الروابط العامة والمدة والجودة القصوى ولا ندعي الوصول إلى محتوى خاص." }] },
  es: { kicker: "La diferencia toTube", title: "Tú eliges la calidad.", accent: "Nosotros verificamos el archivo.", intro: "Sin falsas promesas de 4K ni extensiones renombradas: toTube explica sus límites y comprueba el archivo antes de ofrecer la descarga.", cta: "Probar el convertidor", cards: [{ title: "MP4 compatible", text: "Verificación H.264, AAC y yuv420p para reproducir en móvil, TV y ordenador." }, { title: "Audio verificado", text: "FFprobe confirma el códec esperado en MP3, M4A, WAV, AAC, FLAC y OPUS." }, { title: "Calidad elegida", text: "Vídeo hasta 1080p o audio comprimido de 128 a 320 kbps." }, { title: "Límites claros", text: "Enlaces públicos, duración y calidad máxima explicados sin prometer acceso privado." }] },
  pt: { kicker: "A diferença toTube", title: "Você escolhe a qualidade.", accent: "Nós verificamos o arquivo.", intro: "Sem falsas promessas de 4K ou extensões apenas renomeadas: o toTube informa os limites e verifica o arquivo antes do download.", cta: "Testar o conversor", cards: [{ title: "MP4 compatível", text: "Verificação de H.264, AAC e yuv420p para reprodução no celular, TV e computador." }, { title: "Áudio verificado", text: "O FFprobe confirma o codec esperado em MP3, M4A, WAV, AAC, FLAC e OPUS." }, { title: "Qualidade escolhida", text: "Vídeo até 1080p ou áudio comprimido de 128 a 320 kbps." }, { title: "Limites claros", text: "Links públicos, duração e qualidade máxima explicados sem prometer acesso privado." }] },
  de: { kicker: "Der toTube-Unterschied", title: "Du wählst die Qualität.", accent: "Wir prüfen die Datei.", intro: "Keine erfundenen 4K-Versprechen und keine umbenannten Endungen: toTube nennt Grenzen und prüft das Medium vor dem Download.", cta: "Konverter testen", cards: [{ title: "Kompatibles MP4", text: "Prüfung von H.264, AAC und yuv420p für zuverlässige Wiedergabe auf Handy, TV und Computer." }, { title: "Geprüftes Audio", text: "FFprobe bestätigt den erwarteten Codec in MP3, M4A, WAV, AAC, FLAC und OPUS." }, { title: "Wählbare Qualität", text: "Video bis 1080p oder komprimiertes Audio mit 128 bis 320 kbps." }, { title: "Klare Grenzen", text: "Öffentliche Links, Dauer und maximale Qualität werden ohne Versprechen zu privaten Medien erklärt." }] },
};

function LanguageSwitcher({ locale }: { locale: Locale }) {
  return (
    <label className="language-switcher">
      <Languages size={15} />
      <span className="sr-only">Language</span>
      <select value={locale} onChange={(event) => { window.location.href = `/${event.target.value}`; }} aria-label="Language">
        {locales.map((code) => <option value={code} key={code}>{homeCopy[code].nativeName}</option>)}
      </select>
    </label>
  );
}

export default function LocalizedHome({ locale }: { locale: Locale }) {
  const copy = homeCopy[locale];
  const [url, setUrl] = useState("");
  const [format, setFormat] = useState<Format>("mp4");
  const [videoQuality, setVideoQuality] = useState(1080);
  const [audioQuality, setAudioQuality] = useState(320);
  const [phase, setPhase] = useState<Phase>("idle");
  const [preview, setPreview] = useState<MediaPreview | null>(null);
  const [result, setResult] = useState<DownloadResult | null>(null);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [youtubeBlocked, setYoutubeBlocked] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (phase !== "converting") return;
    const timer = window.setInterval(() => setProgress((current) => Math.min(current + (current < 58 ? 7 : 2), 88)), 250);
    return () => window.clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (url || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setPlaceholderIndex((current) => (current + 1) % platformPlaceholders.length), 2800);
    return () => window.clearInterval(timer);
  }, [url]);

  async function inspectMedia(candidate: string) {
    setPhase("inspecting");
    setError("");
    setYoutubeBlocked(false);
    setPreview(null);
    setResult(null);
    try {
      const response = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "inspect", url: candidate }),
      });
      const data = (await response.json()) as { media?: MediaPreview; error?: string };
      if (!response.ok || !data.media) throw new Error(data.error || copy.errors.inspect);
      setPreview(data.media);
      setPhase("ready");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : copy.errors.inspect);
      setPhase("error");
    }
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const candidate = url.trim();
    if (!candidate) {
      setError(copy.errors.empty);
      setPhase("error");
      inputRef.current?.focus();
      return;
    }
    if (!preview || phase === "error") {
      await inspectMedia(candidate);
      return;
    }

    openSmartLink();
    setPhase("converting");
    setError("");
    setProgress(12);
    try {
      const response = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "convert", url: candidate, format, videoQuality, audioQuality }),
      });
      const data = (await response.json()) as { download?: DownloadResult; error?: string; code?: string };
      if (!response.ok || !data.download) {
        if (data.code === "youtube.authentication_required") setYoutubeBlocked(true);
        throw new Error(data.error || copy.errors.convert);
      }
      setProgress(100);
      setResult(data.download);
      window.setTimeout(() => setPhase("done"), 300);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : copy.errors.convert);
      setPhase("error");
    }
  }

  async function uploadFile(file: File) {
    setPhase("converting");
    setError("");
    setResult(null);
    setProgress(12);
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": file.type || "application/octet-stream",
          "X-File-Name": encodeURIComponent(file.name),
          "X-Output-Format": format,
          "X-Video-Quality": String(videoQuality),
          "X-Audio-Quality": String(audioQuality),
        },
        body: file,
      });
      const data = (await response.json()) as { download?: DownloadResult; error?: string };
      if (!response.ok || !data.download) throw new Error(data.error || copy.errors.convert);
      setProgress(100);
      setResult(data.download);
      window.setTimeout(() => setPhase("done"), 300);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : copy.errors.convert);
      setPhase("error");
    }
  }

  function reset() {
    setUrl(""); setPreview(null); setResult(null); setError(""); setProgress(0); setPhase("idle"); setYoutubeBlocked(false);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }

  function loadSample() {
    setUrl(SAMPLE_URL); setFormat("mp4"); setPreview(null); setResult(null); setError(""); setPhase("idle"); setYoutubeBlocked(false);
    window.setTimeout(() => inspectMedia(SAMPLE_URL), 0);
  }

  const buttonLabel = phase === "inspecting" ? copy.inspecting : phase === "converting" ? copy.converting : preview ? copy.convert : copy.inspect;
  const homeHref = `/${locale}`;

  return (
    <main className="localized-home" dir={copy.dir}>
      <header className="site-header">
        <Link href={homeHref} className="brand" aria-label="toTube">
          <span className="brand-mark"><Play size={15} fill="currentColor" /></span><span>totube</span>
        </Link>
        <nav className={menuOpen ? "nav-links open" : "nav-links"} aria-label="Main navigation">
          <a href="#how" onClick={() => setMenuOpen(false)}>{copy.nav[0]}</a>
          <a href="#platforms" onClick={() => setMenuOpen(false)}>{copy.nav[1]}</a>
          <a href="#faq" onClick={() => setMenuOpen(false)}>{copy.nav[2]}</a>
          <PlatformMenu locale={locale} />
          <FormatMenu locale={locale} />
          <LanguageSwitcher locale={locale} />
          <a href="#converter" className="nav-cta" onClick={() => setMenuOpen(false)}>{copy.navCta} <ArrowRight size={15} /></a>
        </nav>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" aria-expanded={menuOpen}>{menuOpen ? <X /> : <Menu />}</button>
      </header>

      <section className="hero" id="top">
        <div className="hero-orbit orbit-one" aria-hidden="true" /><div className="hero-orbit orbit-two" aria-hidden="true" />
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={14} /> {copy.eyebrow}</div>
          <h1>{copy.title}<br /><span>{copy.accent}</span></h1>
          <p className="hero-subtitle">{copy.subtitle}</p>
        </div>

        <AdBanner adKey={AD_KEYS.leaderboard} width={728} height={90} label={copy.ad} />

        <div className="converter-shell" id="converter">
          <div className="converter-topline"><span><span className="status-dot" /> {copy.ready}</span><span>{copy.private} <LockKeyhole size={13} /></span></div>
          <form onSubmit={onSubmit} className="converter-form">
            <label htmlFor="media-url">{copy.paste}</label>
            <div className="url-row">
              <div className="url-field">
                <Link2 size={20} />
                <input ref={inputRef} id="media-url" type="url" value={url} onChange={(event) => {
                  setUrl(event.target.value);
                  if (preview) { setPreview(null); setResult(null); setPhase("idle"); }
                  setError("");
                  setYoutubeBlocked(false);
                }} placeholder={platformPlaceholders[placeholderIndex]} autoComplete="url" aria-describedby="media-platform-hint" />
                {url && <button type="button" className="clear-button" onClick={reset} aria-label="Clear link"><X size={16} /></button>}
              </div>
              <button className="primary-button" disabled={phase === "inspecting" || phase === "converting"}>{buttonLabel} {phase === "inspecting" || phase === "converting" ? <span className="spinner" /> : <ArrowRight size={18} />}</button>
            </div>
            <p className="platform-hint" id="media-platform-hint">{platformHint[locale]}</p>
            <button className="sample-link" type="button" onClick={loadSample}>{copy.sample} <ArrowRight size={13} /></button>

            {preview && phase !== "done" && (
              <div className="media-preview">
                <div className="thumb">{preview.thumbnail ? (
                  // Thumbnails are dynamic third-party media and intentionally bypass image optimization.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={preview.thumbnail} alt="" />
                ) : <FileVideo size={26} />}<span><Play size={11} fill="currentColor" /></span></div>
                <div className="media-meta"><small>{preview.source}</small><strong>{preview.title}</strong>{preview.author && <span>{preview.author}</span>}</div>
                <div className="media-check"><Check size={16} /></div>
              </div>
            )}

            {preview && phase !== "done" && (
              <fieldset className="format-picker" id="formats">
                <legend>{copy.chooseFormat}</legend>
                <div className="format-options">
                  {formatDefinitions.map((item) => {
                    const Icon = item.icon;
                    return <label key={item.id} className={format === item.id ? "format-card selected" : "format-card"}>
                      <input type="radio" name="format" value={item.id} checked={format === item.id} onChange={() => setFormat(item.id)} />
                      <span className="format-icon"><Icon size={19} /></span><span><strong>{item.label}</strong><small>{item.note}</small></span><span className="radio-dot"><span /></span>
                    </label>;
                  })}
                </div>
              </fieldset>
            )}

            {preview && phase !== "done" && (
              <fieldset className="quality-picker">
                <legend>{qualityCopy[locale].title}</legend>
                {format === "mp4" ? (
                  <div className="quality-control">
                    <span>{qualityCopy[locale].video}</span>
                    <div>{[360, 480, 720, 1080].map((quality) => <label key={quality} className={videoQuality === quality ? "selected" : ""}><input type="radio" name="video-quality" value={quality} checked={videoQuality === quality} onChange={() => setVideoQuality(quality)} />{qualityCopy[locale].upTo} {quality}p</label>)}</div>
                  </div>
                ) : ["wav", "flac"].includes(format) ? (
                  <p className="lossless-quality"><Check size={15} /> {qualityCopy[locale].lossless}</p>
                ) : (
                  <div className="quality-control">
                    <span>{qualityCopy[locale].audio}</span>
                    <div>{[128, 192, 256, 320].map((quality) => <label key={quality} className={audioQuality === quality ? "selected" : ""}><input type="radio" name="audio-quality" value={quality} checked={audioQuality === quality} onChange={() => setAudioQuality(quality)} />{quality} kbps</label>)}</div>
                  </div>
                )}
              </fieldset>
            )}

            {phase === "converting" && <div className="progress-wrap" aria-live="polite"><div><span>{copy.preparing} {format.toUpperCase()}</span><strong>{progress}%</strong></div><div className="progress-track"><span style={{ width: `${progress}%` }} /></div></div>}
            {phase === "done" && result && <div className="download-card" aria-live="polite">
              <div className="success-icon"><Check size={22} /></div><div><small>{copy.fileReady}</small><strong>{result.filename}</strong><span>{result.note || copy.readyToSave}</span></div>
              <a className="download-button" href={result.url} download={result.filename} target="_blank" rel="noreferrer"><Download size={18} /> {copy.download}</a>
              <button type="button" onClick={reset}>{copy.another}</button>
            </div>}
            {error && <div className="error-message" role="alert"><span>!</span>{error}</div>}
            {youtubeBlocked && phase !== "done" && <div className="upload-fallback">
              <span className="upload-fallback-icon"><UploadCloud size={22} /></span>
              <div><strong>{uploadCopy[locale].title}</strong><p>{uploadCopy[locale].text}</p><small>{uploadCopy[locale].limit}</small></div>
              <input
                ref={fileInputRef}
                type="file"
                hidden
                accept="video/mp4,video/quicktime,video/webm,video/x-matroska,audio/mpeg,audio/mp4,audio/wav,audio/aac,audio/flac,audio/ogg,.mkv,.opus"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void uploadFile(file);
                  event.target.value = "";
                }}
              />
              <button type="button" onClick={() => fileInputRef.current?.click()} disabled={phase === "converting"}><UploadCloud size={16} /> {uploadCopy[locale].button}</button>
            </div>}
          </form>
        </div>

        <AdBanner adKey={AD_KEYS.compact} width={468} height={60} label={copy.ad} />
        <div className="trust-row"><span><ShieldCheck size={17} /> {copy.trust[0]}</span><span><Zap size={17} /> {copy.trust[1]}</span><span><LockKeyhole size={17} /> {copy.trust[2]}</span></div>
      </section>

      <section className="marquee" aria-label="Formats"><div>MP3 <span>✦</span> MP4 <span>✦</span> M4A <span>✦</span> WAV <span>✦</span> AAC <span>✦</span> FLAC <span>✦</span> OPUS <span>✦</span></div></section>

      <section className="platform-section" id="platforms">
        <div className="section-heading"><div><span className="section-kicker">{copy.platformsKicker}</span><h2>{copy.platformsTitle}</h2></div><p>{copy.platformsIntro}</p></div>
        <div className="platform-grid">
          {platformIds.map((platform) => <Link href={platformPath(locale, platform)} key={platform} className={`platform-card platform-${platform}`}>
            <small>{platformNames[platform]}</small><strong>{localizedSlugs[locale][platform].replaceAll("-", " ")}</strong><span>{copy.openTool} <ArrowRight size={15} /></span>
          </Link>)}
        </div>
      </section>

      <section className="how-section" id="how">
        <div className="section-heading"><div><span className="section-kicker">{copy.howKicker}</span><h2>{copy.howTitle}</h2></div><p>{copy.howIntro}</p></div>
        <div className="steps-grid">
          {copy.steps.map((step, index) => {
            const Icon = index === 0 ? Link2 : index === 1 ? WandSparkles : Download;
            return <article className={`step-card ${index === 0 ? "mint" : index === 1 ? "cream" : "violet"}`} key={step.title}>
              <span className="step-number">0{index + 1}</span><div className="step-icon"><Icon /></div><h3>{step.title}</h3><p>{step.text}</p>
              {index === 0 && <div className="mini-input"><Link2 size={14} /><span>youtube.com/watch?v=…</span><Check size={14} /></div>}
              {index === 1 && <div className="mini-formats"><span className="active">MP3</span><span>MP4</span><span>WAV</span></div>}
              {index === 2 && <div className="mini-download"><span><FileAudio size={17} /> media.mp3</span><ArrowDown size={16} /></div>}
            </article>;
          })}
        </div>
      </section>

      <section className="why-section quality-angle">
        <div className="why-copy"><span className="section-kicker">{angleCopy[locale].kicker}</span><h2>{angleCopy[locale].title}<br /><em>{angleCopy[locale].accent}</em></h2><p>{angleCopy[locale].intro}</p><a href="#converter">{angleCopy[locale].cta} <ArrowRight size={17} /></a></div>
        <div className="benefit-grid">
          {angleCopy[locale].cards.map((card, index) => {
            const Icon = index === 0 ? FileVideo : index === 1 ? Check : index === 2 ? Zap : ShieldCheck;
            return <article key={card.title}><span><Icon /></span><h3>{card.title}</h3><p>{card.text}</p></article>;
          })}
        </div>
      </section>

      <section className="faq-section" id="faq">
        <div className="faq-title"><span className="section-kicker">{copy.faqKicker}</span><h2>{copy.faqTitle}</h2><p>{copy.faqIntro}</p></div>
        <div className="faq-list">{copy.faqs.map((faq, index) => <article key={faq.q} className={openFaq === index ? "open" : ""}>
          <button onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index}><span>{String(index + 1).padStart(2, "0")}</span><strong>{faq.q}</strong><ChevronDown size={20} /></button><div><p>{faq.a}</p></div>
        </article>)}</div>
      </section>

      <footer>
        <div className="footer-main">
          <div><Link href={homeHref} className="brand"><span className="brand-mark"><Play size={15} fill="currentColor" /></span><span>totube</span></Link><p>{copy.footerText}</p></div>
          <div><strong>{copy.footerPlatforms}</strong>{platformIds.map((platform) => <Link href={platformPath(locale, platform)} key={platform}>{platformNames[platform]}</Link>)}</div>
          <div><strong>{copy.footerFormats}</strong><Link href={qualityPagePath(locale, "youtube-mp3-320")}>MP3 320 kbps</Link><Link href={qualityPagePath(locale, "youtube-mp4-1080")}>MP4 1080p</Link>{formatDefinitions.filter((item) => !["mp3", "mp4"].includes(item.id)).map((item) => <span key={item.id}>{item.label}</span>)}</div>
          <div><strong>{copy.footerLanguages}</strong>{locales.map((code) => <Link href={`/${code}`} hrefLang={code} key={code}>{homeCopy[code].nativeName}</Link>)}</div>
        </div>
        <div className="footer-bottom"><span>© 2026 toTube</span><span>{copy.responsible}</span></div>
      </footer>
    </main>
  );
}
