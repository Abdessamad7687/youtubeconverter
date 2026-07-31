import { ArrowRight, Check, Download, FileAudio, FileVideo, Link2, Play, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

export type SeoPageContent = {
  slug: string;
  kicker: string;
  title: string;
  accent: string;
  intro: string;
  description: string;
  sections: { title: string; paragraphs: string[] }[];
  benefits: { title: string; text: string; kind: "audio" | "video" | "speed" | "safe" }[];
  faqs: { question: string; answer: string }[];
};

const siteUrl = "https://clipmint-media.abdessamadahmali.chatgpt.site";

const relatedPages = [
  { href: "/youtube-mp3", label: "YouTube MP3", text: "Extraire un fichier audio MP3 depuis une vidéo autorisée." },
  { href: "/youtube-mp4", label: "YouTube MP4", text: "Télécharger une vidéo MP4 compatible H.264 et AAC." },
  { href: "/convertisseur-mp3", label: "Convertisseur MP3", text: "Comprendre et choisir le meilleur format audio." },
  { href: "/alternative-notube", label: "Alternative à noTube", text: "Découvrir une expérience de conversion simple et responsable." },
];

function BenefitIcon({ kind }: { kind: SeoPageContent["benefits"][number]["kind"] }) {
  if (kind === "audio") return <FileAudio />;
  if (kind === "video") return <FileVideo />;
  if (kind === "safe") return <ShieldCheck />;
  return <Zap />;
}

export function SeoLandingPage({ content }: { content: SeoPageContent }) {
  const canonical = `${siteUrl}/${content.slug}`;
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: content.title, item: canonical },
    ],
  };

  return (
    <main className="seo-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <header className="site-header seo-header">
        <Link href="/" className="brand" aria-label="Accueil toTube">
          <span className="brand-mark"><Play size={15} fill="currentColor" /></span>
          <span>totube</span>
        </Link>
        <Link className="nav-cta" href="/#converter">Convertir maintenant <ArrowRight size={15} /></Link>
      </header>

      <section className="seo-hero">
        <nav className="breadcrumbs" aria-label="Fil d’Ariane"><Link href="/">Accueil</Link><span>/</span><span>{content.title}</span></nav>
        <span className="section-kicker">{content.kicker}</span>
        <h1>{content.title}<br /><em>{content.accent}</em></h1>
        <p>{content.intro}</p>
        <Link href="/#converter" className="seo-primary-cta">Convertir une vidéo <ArrowRight size={18} /></Link>
        <div className="seo-trust"><span><Check size={15} /> Gratuit</span><span><Check size={15} /> Sans inscription</span><span><Check size={15} /> MP3, M4A et MP4</span></div>
      </section>

      <section className="seo-benefits" aria-label="Avantages">
        {content.benefits.map((benefit) => (
          <article key={benefit.title}><span><BenefitIcon kind={benefit.kind} /></span><h2>{benefit.title}</h2><p>{benefit.text}</p></article>
        ))}
      </section>

      <article className="seo-article">
        <div className="seo-article-intro"><span className="section-kicker">Guide toTube</span><p>{content.description}</p></div>
        <div className="seo-copy">
          {content.sections.map((section) => (
            <section key={section.title}>
              <h2>{section.title}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </section>
          ))}
          <aside className="seo-callout"><span><Link2 /></span><div><strong>Prêt à convertir votre lien ?</strong><p>Collez l’URL, choisissez le format et récupérez votre fichier.</p></div><Link href="/#converter">Ouvrir le convertisseur <ArrowRight size={15} /></Link></aside>
        </div>
      </article>

      <section className="seo-faq">
        <div><span className="section-kicker">Questions fréquentes</span><h2>Tout savoir<br />avant de convertir.</h2></div>
        <div className="seo-faq-list">
          {content.faqs.map((faq, index) => (
            <details key={faq.question} open={index === 0}><summary><span>{String(index + 1).padStart(2, "0")}</span>{faq.question}</summary><p>{faq.answer}</p></details>
          ))}
        </div>
      </section>

      <section className="related-section">
        <span className="section-kicker">Continuer</span><h2>Choisissez votre convertisseur</h2>
        <div>
          {relatedPages.filter((page) => page.href !== `/${content.slug}`).map((page) => (
            <Link href={page.href} key={page.href}><strong>{page.label}</strong><p>{page.text}</p><ArrowRight size={17} /></Link>
          ))}
        </div>
      </section>

      <footer className="seo-footer"><Link href="/" className="brand"><span className="brand-mark"><Play size={15} fill="currentColor" /></span><span>totube</span></Link><p>Convertisseur rapide pour les contenus que vous êtes autorisé à télécharger.</p><Link href="/#converter"><Download size={15} /> Convertir</Link></footer>
    </main>
  );
}
