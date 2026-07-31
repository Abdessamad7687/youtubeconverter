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
const SMARTLINK_URL =
  "https://www.effectivecpmnetwork.com/ajqxrtk2?key=e88c6ebfc5c63d06d4e955cce6e4d950";

type AdBannerProps = {
  adKey: string;
  width: number;
  height: number;
};

function AdBanner({ adKey, width, height }: AdBannerProps) {
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
    <aside className="ad-unit" style={{ maxWidth: width }} aria-label="Publicité">
      <span>Publicité</span>
      <div ref={viewportRef} className="ad-viewport" style={{ height: height * scale }}>
        <iframe
          title={`Publicité ${width} × ${height}`}
          srcDoc={source}
          width={width}
          height={height}
          loading="lazy"
          referrerPolicy="origin"
          sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
          style={{ transform: `scale(${scale})` }}
        />
      </div>
    </aside>
  );
}

const formats: { id: Format; label: string; note: string; icon: typeof FileAudio }[] = [
  { id: "mp3", label: "MP3", note: "Audio", icon: FileAudio },
  { id: "mp4", label: "MP4", note: "Vidéo", icon: FileVideo },
  { id: "m4a", label: "M4A", note: "Audio HQ", icon: FileAudio },
];

const faqs = [
  {
    q: "Quels liens puis-je utiliser ?",
    a: "toTube accepte les liens YouTube publics et les liens directs vers des médias. Téléchargez uniquement les contenus que vous avez créés ou que vous êtes autorisé à utiliser.",
  },
  {
    q: "toTube conserve-t-il mes fichiers ?",
    a: "Non. Les liens sont traités uniquement pour préparer votre conversion. Nous ne créons pas de bibliothèque personnelle et ne revendons pas votre activité.",
  },
  {
    q: "Quel format choisir ?",
    a: "Choisissez MP3 pour un fichier audio universel, M4A pour un son de qualité ou MP4 pour conserver la vidéo. Le MP4 YouTube fonctionne directement ; MP3 et M4A nécessitent le service audio.",
  },
  {
    q: "Pourquoi une conversion peut-elle échouer ?",
    a: "Les vidéos privées, limitées par âge, bloquées dans votre région, en direct ou protégées peuvent être indisponibles. Les plateformes modifient aussi régulièrement leur diffusion.",
  },
];

export default function Home() {
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
      const data = (await response.json()) as { media?: MediaPreview; error?: string };
      if (!response.ok || !data.media) throw new Error(data.error || "We couldn’t read that link.");
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
      setError("Collez un lien vidéo pour commencer.");
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
      if (!response.ok || !data.download) throw new Error(data.error || "This export isn’t available right now.");
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
    setProgress(0);
    setPhase("idle");
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }

  function loadSample() {
    setUrl(SAMPLE_URL);
    setFormat("mp4");
    setPreview(null);
    setResult(null);
    setError("");
    setPhase("idle");
    window.setTimeout(() => inspectMedia(SAMPLE_URL), 0);
  }

  const buttonLabel =
    phase === "inspecting"
      ? "Analyse du lien…"
      : phase === "converting"
        ? "Conversion…"
        : preview
          ? "Convertir maintenant"
          : "Rechercher";

  return (
    <main>
      <header className="site-header">
        <a href="#top" className="brand" aria-label="Accueil toTube">
          <span className="brand-mark"><Play size={15} fill="currentColor" /></span>
          <span>totube</span>
        </a>
        <nav className={menuOpen ? "nav-links open" : "nav-links"} aria-label="Main navigation">
          <a href="#how" onClick={() => setMenuOpen(false)}>Comment ça marche</a>
          <a href="#formats" onClick={() => setMenuOpen(false)}>Formats</a>
          <a href="#faq" onClick={() => setMenuOpen(false)}>Questions</a>
          <a href="#converter" className="nav-cta" onClick={() => setMenuOpen(false)}>
            Convertir une vidéo <ArrowRight size={15} />
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
          <div className="eyebrow"><Sparkles size={14} /> YouTube MP3 &amp; MP4 en 2 clics</div>
          <h1>Convertisseur YouTube<br /><span>MP3 &amp; MP4.</span></h1>
          <p className="hero-subtitle">
            Le meilleur convertisseur gratuit et rapide dans les formats mp3, mp4, compatible X, YouTube, Twitter...
          </p>
        </div>

        <AdBanner adKey="5321f0adf5a727cf9500e1e0bce95ca9" width={728} height={90} />

        <div className="converter-shell" id="converter">
          <div className="converter-topline">
            <span><span className="status-dot" /> Convertisseur prêt</span>
            <span>Confidentiel par défaut <LockKeyhole size={13} /></span>
          </div>

          <form onSubmit={onSubmit} className="converter-form">
            <label htmlFor="media-url">Collez l’URL de votre vidéo</label>
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
              Pas de lien ? Essayez notre vidéo Creative Commons <ArrowRight size={13} />
            </button>

            {preview && phase !== "done" && (
              <div className="media-preview">
                <div className="thumb">
                  {preview.thumbnail ? (
                    // Remote media thumbnails are dynamic and intentionally bypass image optimization.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={preview.thumbnail} alt="" />
                  ) : <FileVideo size={26} />}
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
                <legend>Choisissez un format</legend>
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

            {phase === "converting" && (
              <div className="progress-wrap" aria-live="polite">
                <div><span>Préparation du fichier {format.toUpperCase()}</span><strong>{progress}%</strong></div>
                <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
              </div>
            )}

            {phase === "done" && result && (
              <div className="download-card" aria-live="polite">
                <div className="success-icon"><Check size={22} /></div>
                <div><small>Votre fichier est prêt</small><strong>{result.filename}</strong><span>{result.note || "Prêt à être enregistré"}</span></div>
                <a className="download-button" href={result.url} download={result.filename} target="_blank" rel="noreferrer">
                  <Download size={18} /> Télécharger
                </a>
                <button type="button" onClick={reset}>Convertir un autre lien</button>
              </div>
            )}

            {error && <div className="error-message" role="alert"><span>!</span>{error}</div>}
          </form>
        </div>

        <AdBanner adKey="4ed5c4bd0900ef9380332764b589781a" width={468} height={60} />

        <div className="trust-row">
          <span><ShieldCheck size={17} /> Utilisation autorisée</span>
          <span><Zap size={17} /> Conversion rapide</span>
          <span><LockKeyhole size={17} /> Sans inscription</span>
        </div>
      </section>

      <section className="marquee" aria-label="Supported media types">
        <div>YOUTUBE MP3 <span>✦</span> YOUTUBE MP4 <span>✦</span> TÉLÉCHARGER VIDÉO <span>✦</span> CONVERTISSEUR GRATUIT <span>✦</span> SANS INSCRIPTION <span>✦</span></div>
      </section>

      <section className="how-section" id="how">
        <div className="section-heading">
          <div><span className="section-kicker">Comment ça marche</span><h2>Trois étapes.<br />Et c’est tout.</h2></div>
          <p>Saisissez l’URL d’une vidéo, choisissez MP3, MP4 ou M4A, puis téléchargez votre fichier sans inscription.</p>
        </div>
        <div className="steps-grid">
          <article className="step-card mint">
            <span className="step-number">01</span>
            <div className="step-icon"><Link2 /></div>
            <h3>Collez le lien</h3>
            <p>Ajoutez l’URL YouTube publique ou le lien direct de votre média.</p>
            <div className="mini-input"><Link2 size={14} /><span>youtube.com/watch?v=…</span><Check size={14} /></div>
          </article>
          <article className="step-card cream">
            <span className="step-number">02</span>
            <div className="step-icon"><WandSparkles /></div>
            <h3>Choisissez le format</h3>
            <p>MP3 ou M4A pour l’audio, MP4 pour conserver la vidéo.</p>
            <div className="mini-formats"><span className="active">MP3</span><span>MP4</span><span>M4A</span></div>
          </article>
          <article className="step-card violet">
            <span className="step-number">03</span>
            <div className="step-icon"><Download /></div>
            <h3>Téléchargez</h3>
            <p>Une fois la conversion terminée, enregistrez le fichier sur votre appareil.</p>
            <div className="mini-download"><span><FileAudio size={17} /> your-audio.mp3</span><ArrowDown size={16} /></div>
          </article>
        </div>
      </section>

      <section className="why-section">
        <div className="why-copy">
          <span className="section-kicker">Pourquoi toTube</span>
          <h2>Un convertisseur<br /><em>simple et rapide.</em></h2>
          <p>toTube est un convertisseur YouTube MP3 et YouTube MP4 conçu pour fonctionner sur mobile, tablette et ordinateur, sans compte ni interface compliquée.</p>
          <a href="#converter">Essayer maintenant <ArrowRight size={17} /></a>
        </div>
        <div className="benefit-grid">
          <article><span><Gauge /></span><h3>Rapide</h3><p>Convertissez une vidéo YouTube en quelques clics avec une progression claire.</p></article>
          <article><span><ShieldCheck /></span><h3>Sécurisé</h3><p>Les liens sont validés avant traitement et les fichiers temporaires expirent automatiquement.</p></article>
          <article><span><Clock3 /></span><h3>Multi-appareils</h3><p>Une expérience responsive sur smartphone, tablette, Windows et Mac.</p></article>
          <article><span><LockKeyhole /></span><h3>Sans inscription</h3><p>Pas de profil obligatoire ni de bibliothèque personnelle pour convertir.</p></article>
        </div>
      </section>

      <section className="faq-section" id="faq">
        <div className="faq-title"><span className="section-kicker">Bon à savoir</span><h2>Questions,<br />réponses.</h2><p>Vérifiez que la vidéo est publique et que vous êtes autorisé à la télécharger.</p></div>
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
        <p>VOTRE PROCHAINE CONVERSION EST À UN LIEN</p>
        <h2>Une vidéo ?<br /><span>toTube-la.</span></h2>
        <a href="#converter">Convertir maintenant <ArrowRight size={18} /></a>
      </section>

      <footer>
        <div className="footer-main">
          <div><a href="#top" className="brand"><span className="brand-mark"><Play size={15} fill="currentColor" /></span><span>totube</span></a><p>Convertisseur vidéo rapide pour les contenus que vous êtes autorisé à télécharger.</p></div>
          <div><strong>Convertisseurs</strong><a href="/youtube-mp3">YouTube MP3</a><a href="/youtube-mp4">YouTube MP4</a><a href="/convertisseur-mp3">Convertisseur MP3</a><a href="/alternative-notube">Alternative à noTube</a></div>
          <div><strong>Principes</strong><span>Utilisation autorisée</span><span>Confidentiel par défaut</span><span>Sans inscription</span></div>
        </div>
        <div className="footer-bottom"><span>© 2026 toTube</span><span>Conçu pour les créateurs responsables.</span></div>
      </footer>
    </main>
  );
}
