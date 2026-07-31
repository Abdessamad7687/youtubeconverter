"use client";

import {
  ArrowDown,
  ArrowRight,
  Check,
  ChevronDown,
  Clock3,
  Download,
  FileAudio,
  FileVideo,
  Gauge,
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
import { FormEvent, useEffect, useRef, useState } from "react";

type Format = "mp3" | "mp4" | "m4a";
type Phase = "idle" | "inspecting" | "ready" | "converting" | "done" | "error";

type MediaPreview = {
  title: string;
  author?: string;
  thumbnail?: string;
  source: "YouTube" | "Direct media";
};

type DownloadResult = {
  url: string;
  filename: string;
  note?: string;
};

const SAMPLE_URL =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

const formats: { id: Format; label: string; note: string; icon: typeof FileAudio }[] = [
  { id: "mp3", label: "MP3", note: "Audio", icon: FileAudio },
  { id: "mp4", label: "MP4", note: "Video", icon: FileVideo },
  { id: "m4a", label: "M4A", note: "HQ audio", icon: FileAudio },
];

const faqs = [
  {
    q: "What links can I use?",
    a: "ClipMint accepts YouTube links and direct links to media files. Only process media you created, own, or have explicit permission to download.",
  },
  {
    q: "Does ClipMint store my files?",
    a: "No. Links are processed only to prepare your requested export, and this interface does not build a personal media library or sell your activity.",
  },
  {
    q: "Which format should I choose?",
    a: "Choose MP3 for broadly compatible audio, M4A for efficient high-quality audio, or MP4 when you want to keep the video.",
  },
  {
    q: "Why might a conversion fail?",
    a: "Private, age-restricted, region-locked, live, or rights-managed media may be unavailable. Platforms also change their delivery systems from time to time.",
  },
];

export default function Home() {
  const [url, setUrl] = useState("");
  const [format, setFormat] = useState<Format>("mp3");
  const [phase, setPhase] = useState<Phase>("idle");
  const [preview, setPreview] = useState<MediaPreview | null>(null);
  const [result, setResult] = useState<DownloadResult | null>(null);
  const [error, setError] = useState("");
  const [rightsConfirmed, setRightsConfirmed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (phase !== "converting") return;
    const timer = window.setInterval(() => {
      setProgress((current) => Math.min(current + (current < 58 ? 7 : 2), 88));
    }, 250);
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
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "We couldn’t read that link.");
      setPreview(data.media);
      setPhase("ready");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "We couldn’t read that link.");
      setPhase("error");
    }
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const candidate = url.trim();
    if (!candidate) {
      setError("Paste a media link to get started.");
      setPhase("error");
      inputRef.current?.focus();
      return;
    }

    if (!preview || phase === "error") {
      await inspectMedia(candidate);
      return;
    }

    if (!rightsConfirmed) {
      setError("Confirm you have permission to process this media.");
      return;
    }

    setPhase("converting");
    setError("");
    setProgress(12);
    try {
      const response = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "convert", url: candidate, format }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "This export isn’t available right now.");
      setProgress(100);
      setResult(data.download);
      window.setTimeout(() => setPhase("done"), 300);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "This export isn’t available right now.");
      setPhase("error");
    }
  }

  function reset() {
    setUrl("");
    setPreview(null);
    setResult(null);
    setError("");
    setRightsConfirmed(false);
    setProgress(0);
    setPhase("idle");
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }

  function loadSample() {
    setUrl(SAMPLE_URL);
    setFormat("mp4");
    setPreview(null);
    setResult(null);
    setRightsConfirmed(true);
    setError("");
    setPhase("idle");
    window.setTimeout(() => inspectMedia(SAMPLE_URL), 0);
  }

  const buttonLabel =
    phase === "inspecting"
      ? "Reading link…"
      : phase === "converting"
        ? "Converting…"
        : preview
          ? "Convert now"
          : "Find media";

  return (
    <main>
      <header className="site-header">
        <a href="#top" className="brand" aria-label="ClipMint home">
          <span className="brand-mark"><Play size={15} fill="currentColor" /></span>
          <span>clipmint</span>
        </a>
        <nav className={menuOpen ? "nav-links open" : "nav-links"} aria-label="Main navigation">
          <a href="#how" onClick={() => setMenuOpen(false)}>How it works</a>
          <a href="#formats" onClick={() => setMenuOpen(false)}>Formats</a>
          <a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
          <a href="#converter" className="nav-cta" onClick={() => setMenuOpen(false)}>
            Start converting <ArrowRight size={15} />
          </a>
        </nav>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" aria-expanded={menuOpen}>
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <section className="hero" id="top">
        <div className="hero-orbit orbit-one" aria-hidden="true" />
        <div className="hero-orbit orbit-two" aria-hidden="true" />
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={14} /> Clean files, zero fuss</div>
          <h1>Turn a link into<br /><span>something useful.</span></h1>
          <p className="hero-subtitle">
            Export media you have permission to use as crisp audio or video. No account, no clutter, just a clean download.
          </p>
        </div>

        <div className="converter-shell" id="converter">
          <div className="converter-topline">
            <span><span className="status-dot" /> Converter ready</span>
            <span>Private by design <LockKeyhole size={13} /></span>
          </div>

          <form onSubmit={onSubmit} className="converter-form">
            <label htmlFor="media-url">Paste your media link</label>
            <div className="url-row">
              <div className="url-field">
                <Link2 size={20} />
                <input
                  ref={inputRef}
                  id="media-url"
                  type="url"
                  value={url}
                  onChange={(event) => {
                    setUrl(event.target.value);
                    if (preview) {
                      setPreview(null);
                      setResult(null);
                      setPhase("idle");
                    }
                    setError("");
                  }}
                  placeholder="https://youtube.com/watch?v=…"
                  autoComplete="url"
                />
                {url && <button type="button" className="clear-button" onClick={reset} aria-label="Clear link"><X size={16} /></button>}
              </div>
              <button className="primary-button" disabled={phase === "inspecting" || phase === "converting"}>
                {buttonLabel} {phase === "inspecting" || phase === "converting" ? <span className="spinner" /> : <ArrowRight size={18} />}
              </button>
            </div>
            <button className="sample-link" type="button" onClick={loadSample}>
              No link handy? Try our Creative Commons sample <ArrowRight size={13} />
            </button>

            {preview && phase !== "done" && (
              <div className="media-preview">
                <div className="thumb">
                  {preview.thumbnail ? <img src={preview.thumbnail} alt="" /> : <FileVideo size={26} />}
                  <span><Play size={11} fill="currentColor" /></span>
                </div>
                <div className="media-meta">
                  <small>{preview.source}</small>
                  <strong>{preview.title}</strong>
                  {preview.author && <span>{preview.author}</span>}
                </div>
                <div className="media-check"><Check size={16} /></div>
              </div>
            )}

            {preview && phase !== "done" && (
              <fieldset className="format-picker" id="formats">
                <legend>Choose a format</legend>
                <div className="format-options">
                  {formats.map((item) => {
                    const Icon = item.icon;
                    return (
                      <label key={item.id} className={format === item.id ? "format-card selected" : "format-card"}>
                        <input type="radio" name="format" value={item.id} checked={format === item.id} onChange={() => setFormat(item.id)} />
                        <span className="format-icon"><Icon size={19} /></span>
                        <span><strong>{item.label}</strong><small>{item.note}</small></span>
                        <span className="radio-dot"><span /></span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            )}

            {preview && phase !== "done" && (
              <label className="rights-check">
                <input type="checkbox" checked={rightsConfirmed} onChange={(event) => { setRightsConfirmed(event.target.checked); setError(""); }} />
                <span className="checkbox-ui"><Check size={13} /></span>
                <span>I created this media or have permission to download and convert it.</span>
              </label>
            )}

            {phase === "converting" && (
              <div className="progress-wrap" aria-live="polite">
                <div><span>Preparing your {format.toUpperCase()}</span><strong>{progress}%</strong></div>
                <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
              </div>
            )}

            {phase === "done" && result && (
              <div className="download-card" aria-live="polite">
                <div className="success-icon"><Check size={22} /></div>
                <div><small>Your file is ready</small><strong>{result.filename}</strong><span>{result.note || "Ready to save to your device"}</span></div>
                <a className="download-button" href={result.url} download={result.filename} target="_blank" rel="noreferrer">
                  <Download size={18} /> Download
                </a>
                <button type="button" onClick={reset}>Convert another link</button>
              </div>
            )}

            {error && <div className="error-message" role="alert"><span>!</span>{error}</div>}
          </form>
        </div>

        <div className="trust-row">
          <span><ShieldCheck size={17} /> Permission-first</span>
          <span><Zap size={17} /> Fast exports</span>
          <span><LockKeyhole size={17} /> No account needed</span>
        </div>
      </section>

      <section className="marquee" aria-label="Supported media types">
        <div>YOUTUBE <span>✦</span> DIRECT VIDEO <span>✦</span> MP3 <span>✦</span> MP4 <span>✦</span> M4A <span>✦</span> CREATOR-FRIENDLY <span>✦</span></div>
      </section>

      <section className="how-section" id="how">
        <div className="section-heading">
          <div><span className="section-kicker">How it works</span><h2>Three steps.<br />That’s the whole thing.</h2></div>
          <p>We stripped away the noise so you can get from link to file without an instruction manual.</p>
        </div>
        <div className="steps-grid">
          <article className="step-card mint">
            <span className="step-number">01</span>
            <div className="step-icon"><Link2 /></div>
            <h3>Paste a link</h3>
            <p>Drop in a supported YouTube or direct media URL.</p>
            <div className="mini-input"><Link2 size={14} /><span>youtube.com/watch?v=…</span><Check size={14} /></div>
          </article>
          <article className="step-card cream">
            <span className="step-number">02</span>
            <div className="step-icon"><WandSparkles /></div>
            <h3>Pick your format</h3>
            <p>Choose audio for listening or video to keep the picture.</p>
            <div className="mini-formats"><span className="active">MP3</span><span>MP4</span><span>M4A</span></div>
          </article>
          <article className="step-card violet">
            <span className="step-number">03</span>
            <div className="step-icon"><Download /></div>
            <h3>Save your file</h3>
            <p>When the export is ready, download it directly to your device.</p>
            <div className="mini-download"><span><FileAudio size={17} /> your-audio.mp3</span><ArrowDown size={16} /></div>
          </article>
        </div>
      </section>

      <section className="why-section">
        <div className="why-copy">
          <span className="section-kicker">Why ClipMint</span>
          <h2>A converter that<br /><em>respects your time.</em></h2>
          <p>Simple on the surface, thoughtfully engineered underneath. ClipMint keeps the important bits and leaves out the rest.</p>
          <a href="#converter">Try it now <ArrowRight size={17} /></a>
        </div>
        <div className="benefit-grid">
          <article><span><Gauge /></span><h3>Quick by default</h3><p>A direct flow with clear progress and no unnecessary sign-up wall.</p></article>
          <article><span><ShieldCheck /></span><h3>Rights-aware</h3><p>A simple permission check keeps responsible media use front and center.</p></article>
          <article><span><Clock3 /></span><h3>Works everywhere</h3><p>A responsive experience designed for phones, tablets, and desktops.</p></article>
          <article><span><LockKeyhole /></span><h3>Less data</h3><p>No personal library, no social profile, and no account needed for an export.</p></article>
        </div>
      </section>

      <section className="faq-section" id="faq">
        <div className="faq-title"><span className="section-kicker">Good to know</span><h2>Questions,<br />answered.</h2><p>Still stuck? Make sure the link is public and points to media you’re allowed to process.</p></div>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <article key={faq.q} className={openFaq === index ? "open" : ""}>
              <button onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index}>
                <span>{String(index + 1).padStart(2, "0")}</span><strong>{faq.q}</strong><ChevronDown size={20} />
              </button>
              <div><p>{faq.a}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="final-cta">
        <span className="cta-spark cta-one">✦</span><span className="cta-spark cta-two">✦</span>
        <p>YOUR NEXT EXPORT IS ONE LINK AWAY</p>
        <h2>Got a link?<br /><span>Let’s mint it.</span></h2>
        <a href="#converter">Start converting <ArrowRight size={18} /></a>
      </section>

      <footer>
        <div className="footer-main">
          <div><a href="#top" className="brand"><span className="brand-mark"><Play size={15} fill="currentColor" /></span><span>clipmint</span></a><p>Clean media exports for content you own or have permission to use.</p></div>
          <div><strong>Explore</strong><a href="#how">How it works</a><a href="#formats">Formats</a><a href="#faq">FAQ</a></div>
          <div><strong>Principles</strong><span>Permission-first</span><span>Private by design</span><span>No media library</span></div>
        </div>
        <div className="footer-bottom"><span>© 2026 ClipMint</span><span>Made for responsible creators.</span></div>
      </footer>
    </main>
  );
}
