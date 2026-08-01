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
  WandSparkles,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { homeCopy, Locale, locales, localizedSlugs, platformIds, platformNames, platformPath } from "./i18n";

export type Format = "mp3" | "mp4" | "m4a" | "wav" | "aac" | "flac" | "opus";
type Phase = "idle" | "inspecting" | "ready" | "converting" | "done" | "error";
type MediaPreview = { title: string; author?: string; thumbnail?: string; source: string };
type DownloadResult = { url: string; filename: string; note?: string };

const SAMPLE_URL = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";
const SMARTLINK_URL = "https://www.effectivecpmnetwork.com/ajqxrtk2?key=e88c6ebfc5c63d06d4e955cce6e4d950";

const formatDefinitions: { id: Format; label: string; note: string; icon: typeof FileAudio }[] = [
  { id: "mp3", label: "MP3", note: "Universal audio", icon: FileAudio },
  { id: "mp4", label: "MP4", note: "H.264 video", icon: FileVideo },
  { id: "m4a", label: "M4A", note: "Efficient audio", icon: FileAudio },
  { id: "wav", label: "WAV", note: "Uncompressed", icon: FileAudio },
  { id: "aac", label: "AAC", note: "Compact audio", icon: FileAudio },
  { id: "flac", label: "FLAC", note: "Lossless audio", icon: FileAudio },
  { id: "opus", label: "OPUS", note: "Modern audio", icon: FileAudio },
];

function AdBanner({ adKey, width, height, label }: { adKey: string; width: number; height: number; label: string }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const resize = () => setScale(Math.min(1, viewport.clientWidth / width));
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [width]);

  const source = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=${width},initial-scale=1"><style>html,body{margin:0;padding:0;width:${width}px;height:${height}px;overflow:hidden;background:transparent}</style></head><body><script>atOptions=${JSON.stringify({ key: adKey, format: "iframe", height, width, params: {} })};</script><script src="https://www.highperformanceformat.com/${adKey}/invoke.js"></script></body></html>`;

  return (
    <aside className="ad-unit" style={{ maxWidth: width }} aria-label={label}>
      <span>{label}</span>
      <div ref={viewportRef} className="ad-viewport" style={{ height: height * scale }}>
        <iframe
          title={`${label} ${width} × ${height}`}
          srcDoc={source}
          width={width}
          height={height}
          loading="lazy"
          referrerPolicy="origin"
          sandbox="allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
          style={{ transform: `scale(${scale})` }}
        />
      </div>
    </aside>
  );
}

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
  const [phase, setPhase] = useState<Phase>("idle");
  const [preview, setPreview] = useState<MediaPreview | null>(null);
  const [result, setResult] = useState<DownloadResult | null>(null);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (phase !== "converting") return;
    const timer = window.setInterval(() => setProgress((current) => Math.min(current + (current < 58 ? 7 : 2), 88)), 250);
    return () => window.clearInterval(timer);
  }, [phase]);

  async function inspectMedia(candidate: string) {
    setPhase("inspecting");
    setError("");
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

    window.open(SMARTLINK_URL, "_blank", "noopener");
    setPhase("converting");
    setError("");
    setProgress(12);
    try {
      const response = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "convert", url: candidate, format }),
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
    setUrl(""); setPreview(null); setResult(null); setError(""); setProgress(0); setPhase("idle");
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }

  function loadSample() {
    setUrl(SAMPLE_URL); setFormat("mp4"); setPreview(null); setResult(null); setError(""); setPhase("idle");
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

        <AdBanner adKey="5321f0adf5a727cf9500e1e0bce95ca9" width={728} height={90} label={copy.ad} />

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
                }} placeholder="https://youtube.com/watch?v=…" autoComplete="url" />
                {url && <button type="button" className="clear-button" onClick={reset} aria-label="Clear link"><X size={16} /></button>}
              </div>
              <button className="primary-button" disabled={phase === "inspecting" || phase === "converting"}>{buttonLabel} {phase === "inspecting" || phase === "converting" ? <span className="spinner" /> : <ArrowRight size={18} />}</button>
            </div>
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

            {phase === "converting" && <div className="progress-wrap" aria-live="polite"><div><span>{copy.preparing} {format.toUpperCase()}</span><strong>{progress}%</strong></div><div className="progress-track"><span style={{ width: `${progress}%` }} /></div></div>}
            {phase === "done" && result && <div className="download-card" aria-live="polite">
              <div className="success-icon"><Check size={22} /></div><div><small>{copy.fileReady}</small><strong>{result.filename}</strong><span>{result.note || copy.readyToSave}</span></div>
              <a className="download-button" href={result.url} download={result.filename} target="_blank" rel="noreferrer"><Download size={18} /> {copy.download}</a>
              <button type="button" onClick={reset}>{copy.another}</button>
            </div>}
            {error && <div className="error-message" role="alert"><span>!</span>{error}</div>}
          </form>
        </div>

        <AdBanner adKey="4ed5c4bd0900ef9380332764b589781a" width={468} height={60} label={copy.ad} />
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
          <div><strong>{copy.footerFormats}</strong>{formatDefinitions.map((item) => <span key={item.id}>{item.label}</span>)}</div>
          <div><strong>{copy.footerLanguages}</strong>{locales.map((code) => <Link href={`/${code}`} hrefLang={code} key={code}>{homeCopy[code].nativeName}</Link>)}</div>
        </div>
        <div className="footer-bottom"><span>© 2026 toTube</span><span>{copy.responsible}</span></div>
      </footer>
    </main>
  );
}
