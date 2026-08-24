import Link from "next/link";
import { BlogPostId, blogIndexPath, blogPostPath, blogUi } from "./blog-content";
import { homeCopy, Locale, locales, PlatformId, platformIds, platformNames, platformPath, QualityPageId, qualityPagePath } from "./i18n";

const labels: Record<Locale, { tools: string; formats: string; languages: string; home: string; blog: string }> = {
  fr: { tools: "Téléchargeurs", formats: "Formats", languages: "Langues", home: "Accueil", blog: "Blog" },
  en: { tools: "Downloaders", formats: "Formats", languages: "Languages", home: "Home", blog: "Blog" },
  ar: { tools: "أدوات التنزيل", formats: "الصيغ", languages: "اللغات", home: "الرئيسية", blog: "المدونة" },
  es: { tools: "Descargadores", formats: "Formatos", languages: "Idiomas", home: "Inicio", blog: "Blog" },
  pt: { tools: "Downloaders", formats: "Formatos", languages: "Idiomas", home: "Início", blog: "Blog" },
  de: { tools: "Downloader", formats: "Formate", languages: "Sprachen", home: "Startseite", blog: "Blog" },
};

function languageHref(locale: Locale, currentPlatform?: PlatformId, currentQuality?: QualityPageId, currentBlogPost?: BlogPostId, blogIndex?: boolean) {
  if (currentPlatform) return platformPath(locale, currentPlatform);
  if (currentQuality) return qualityPagePath(locale, currentQuality);
  if (currentBlogPost) return blogPostPath(locale, currentBlogPost);
  if (blogIndex) return blogIndexPath(locale);
  return `/${locale}`;
}

export function PlatformMenu({ locale }: { locale: Locale }) {
  return <details className="nav-dropdown"><summary>{labels[locale].tools}</summary><div>{platformIds.map((platform) => <Link href={platformPath(locale, platform)} key={platform}>{platformNames[platform]}</Link>)}</div></details>;
}

export function FormatMenu({ locale }: { locale: Locale }) {
  return <details className="nav-dropdown"><summary>{labels[locale].formats}</summary><div><Link href={qualityPagePath(locale, "youtube-mp3-320")}>YouTube MP3 320 kbps</Link><Link href={qualityPagePath(locale, "youtube-mp4-1080")}>YouTube MP4 1080p</Link></div></details>;
}

export function ToolNavigation({ locale, currentPlatform, currentQuality, currentBlogPost, blogIndex }: { locale: Locale; currentPlatform?: PlatformId; currentQuality?: QualityPageId; currentBlogPost?: BlogPostId; blogIndex?: boolean }) {
  return <nav className="tool-navigation" aria-label="Main navigation">
    <Link href={`/${locale}`}>{labels[locale].home}</Link><PlatformMenu locale={locale} /><FormatMenu locale={locale} /><Link href={blogIndexPath(locale)} aria-current={blogIndex ? "page" : undefined}>{labels[locale].blog}</Link>
    <details className="nav-dropdown"><summary>{labels[locale].languages}</summary><div>{locales.map((code) => <Link key={code} href={languageHref(code, currentPlatform, currentQuality, currentBlogPost, blogIndex)} hrefLang={code} aria-current={code === locale ? "page" : undefined}>{homeCopy[code].nativeName}</Link>)}</div></details>
  </nav>;
}

export function ToolFooter({ locale, text }: { locale: Locale; text: string }) {
  return <footer className="tool-footer">
    <div><Link href={`/${locale}`} className="brand"><span className="brand-mark">▶</span><span>totube</span></Link><p>{text}</p></div>
    <div><strong>{labels[locale].tools}</strong>{platformIds.map((platform) => <Link href={platformPath(locale, platform)} key={platform}>{platformNames[platform]}</Link>)}</div>
    <div><strong>{labels[locale].formats}</strong><Link href={qualityPagePath(locale, "youtube-mp3-320")}>MP3 320 kbps</Link><Link href={qualityPagePath(locale, "youtube-mp4-1080")}>MP4 1080p</Link><Link href={blogIndexPath(locale)}>{blogUi[locale].nav}</Link></div>
    <div><strong>{labels[locale].languages}</strong>{locales.map((code) => <Link href={languageHref(code)} hrefLang={code} key={code}>{homeCopy[code].nativeName}</Link>)}</div>
  </footer>;
}
