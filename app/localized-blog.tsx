import { ArrowRight, CalendarDays, Check, Clock3, Play } from "lucide-react";
import Link from "next/link";
import AdBanner from "./ad-banner";
import { AD_KEYS } from "./ad-config";
import { BlogPost, BlogPostId, blogIndexGuides, blogIndexPath, blogPostIds, blogPostPath, blogPosts, blogUi } from "./blog-content";
import { homeCopy, Locale, platformPath, qualityPagePath } from "./i18n";
import { ToolFooter, ToolNavigation } from "./tool-navigation";

const dateLocales: Record<Locale, string> = { fr: "fr-FR", en: "en-US", ar: "ar", es: "es-ES", pt: "pt-BR", de: "de-DE" };

function formatDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(dateLocales[locale], { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}

function Brand({ locale }: { locale: Locale }) {
  return <Link href={`/${locale}`} className="brand" aria-label="toTube"><span className="brand-mark"><Play size={15} fill="currentColor" /></span><span>totube</span></Link>;
}

function ArticleCard({ locale, post, featured = false }: { locale: Locale; post: BlogPost; featured?: boolean }) {
  const ui = blogUi[locale];
  return <article className={featured ? "blog-card featured" : "blog-card"}>
    <div className="blog-card-meta"><span>{post.eyebrow}</span><span><Clock3 size={13} /> {post.readTime} {ui.minRead}</span></div>
    <h2><Link href={blogPostPath(locale, post.id)}>{post.title}</Link></h2>
    <p>{post.description}</p>
    <div className="blog-card-footer"><time dateTime={post.updated}>{formatDate(post.updated, locale)}</time><Link href={blogPostPath(locale, post.id)}>{ui.read} <ArrowRight size={16} /></Link></div>
  </article>;
}

export function LocalizedBlogIndex({ locale }: { locale: Locale }) {
  const ui = blogUi[locale];
  const guide = blogIndexGuides[locale];
  const copy = homeCopy[locale];
  const posts = blogPostIds.map((id) => blogPosts[locale][id]);
  const breadcrumbSchema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: ui.home, item: `https://totube.online/${locale}` }, { "@type": "ListItem", position: 2, name: ui.nav, item: `https://totube.online${blogIndexPath(locale)}` }] };
  const collectionSchema = { "@context": "https://schema.org", "@type": "CollectionPage", name: ui.title, description: ui.subtitle, url: `https://totube.online${blogIndexPath(locale)}`, inLanguage: locale, hasPart: posts.map((post) => ({ "@type": "Article", headline: post.title, url: `https://totube.online${blogPostPath(locale, post.id)}`, datePublished: post.published, dateModified: post.updated })) };

  return <main className="blog-page" dir={copy.dir}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
    <header className="site-header seo-header"><Brand locale={locale} /><ToolNavigation locale={locale} blogIndex /><Link className="nav-cta" href={`/${locale}#converter`}>{ui.converter} <ArrowRight size={15} /></Link></header>
    <section className="blog-index-hero">
      <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href={`/${locale}`}>{ui.home}</Link><span>/</span><span>{ui.nav}</span></nav>
      <span className="section-kicker">{ui.kicker}</span><h1>{ui.title}</h1><p>{ui.subtitle}</p>
    </section>
    <div className="seo-ad-band"><AdBanner adKey={AD_KEYS.leaderboard} width={728} height={90} label={copy.ad} /></div>
    <section className="blog-index-content"><div className="blog-index-heading"><span className="section-kicker">{ui.latest}</span><p>{posts.length} {ui.nav.toLocaleLowerCase(dateLocales[locale])}</p></div><div className="blog-card-grid">{posts.map((post, index) => <ArticleCard key={post.id} locale={locale} post={post} featured={index === 0} />)}</div></section>
    <article className="blog-index-guide">
      <header><span className="section-kicker">toTube Editorial</span><h2>{guide.title}</h2><p>{guide.intro}</p></header>
      <div>{guide.sections.map((section, index) => <section key={section.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{section.title}</h3>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}</div>
    </article>
    <section className="blog-topic-links"><div><span className="section-kicker">toTube</span><h2>{ui.converter}</h2><p>{copy.metaDescription}</p></div><div><Link href={platformPath(locale, "youtube")}>YouTube <ArrowRight size={15} /></Link><Link href={qualityPagePath(locale, "youtube-mp3-320")}>MP3 320 kbps <ArrowRight size={15} /></Link><Link href={qualityPagePath(locale, "youtube-mp4-1080")}>MP4 1080p <ArrowRight size={15} /></Link></div></section>
    <ToolFooter locale={locale} text={ui.footer} />
  </main>;
}

export function LocalizedBlogArticle({ locale, post }: { locale: Locale; post: BlogPost }) {
  const ui = blogUi[locale];
  const copy = homeCopy[locale];
  const canonical = `https://totube.online${blogPostPath(locale, post.id)}`;
  const otherId: BlogPostId = post.id === "formats-guide" ? "safe-download-guide" : "formats-guide";
  const other = blogPosts[locale][otherId];
  const breadcrumbSchema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: ui.home, item: `https://totube.online/${locale}` }, { "@type": "ListItem", position: 2, name: ui.nav, item: `https://totube.online${blogIndexPath(locale)}` }, { "@type": "ListItem", position: 3, name: post.title, item: canonical }] };
  const articleSchema = { "@context": "https://schema.org", "@type": "Article", headline: post.title, description: post.description, datePublished: post.published, dateModified: post.updated, inLanguage: locale, mainEntityOfPage: { "@type": "WebPage", "@id": canonical }, author: { "@type": "Organization", name: "toTube Editorial", url: "https://totube.online/" }, publisher: { "@type": "Organization", name: "toTube", url: "https://totube.online/", logo: { "@type": "ImageObject", url: "https://totube.online/totube-icon-512.png", width: 512, height: 512 } }, keywords: post.keywords.join(", ") };
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: post.faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) };

  return <main className="blog-page blog-detail-page" dir={copy.dir}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    <header className="site-header seo-header"><Brand locale={locale} /><ToolNavigation locale={locale} currentBlogPost={post.id} /><Link className="nav-cta" href={`/${locale}#converter`}>{ui.converter} <ArrowRight size={15} /></Link></header>
    <article>
      <header className="blog-article-hero">
        <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href={`/${locale}`}>{ui.home}</Link><span>/</span><Link href={blogIndexPath(locale)}>{ui.nav}</Link><span>/</span><span aria-current="page">{post.eyebrow}</span></nav>
        <span className="section-kicker">{post.eyebrow}</span><h1>{post.title}</h1><p>{post.description}</p>
        <div className="blog-byline"><span><CalendarDays size={15} /> {ui.updated} <time dateTime={post.updated}>{formatDate(post.updated, locale)}</time></span><span><Clock3 size={15} /> {post.readTime} {ui.minRead}</span><span><Check size={15} /> toTube Editorial</span></div>
      </header>
      <div className="seo-ad-band"><AdBanner adKey={AD_KEYS.leaderboard} width={728} height={90} label={copy.ad} /></div>
      <div className="blog-article-layout">
        <aside className="blog-toc"><strong>{ui.contents}</strong><nav>{post.sections.map((section, index) => <a key={section.id} href={`#${section.id}`}><span>{String(index + 1).padStart(2, "0")}</span>{section.title}</a>)}</nav></aside>
        <div className="blog-prose">
          <div className="blog-lead">{post.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
          {post.sections.map((section, index) => <section id={section.id} key={section.id}><span className="blog-section-number">{String(index + 1).padStart(2, "0")}</span><h2>{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}{index === 2 && <AdBanner adKey={AD_KEYS.compact} width={468} height={60} label={copy.ad} />}</section>)}
          <aside className="blog-cta"><div><span className="section-kicker">toTube</span><h2>{post.ctaTitle}</h2><p>{post.ctaText}</p></div><Link href={`/${locale}#converter`}>{post.ctaLabel} <ArrowRight size={17} /></Link></aside>
        </div>
      </div>
      <section className="blog-faq"><div><span className="section-kicker">FAQ</span><h2>{ui.questions}</h2></div><div className="seo-faq-list">{post.faqs.map((faq, index) => <details key={faq.question} open={index === 0}><summary><span>{String(index + 1).padStart(2, "0")}</span>{faq.question}</summary><p>{faq.answer}</p></details>)}</div></section>
      <section className="blog-related"><span className="section-kicker">{ui.related}</span><ArticleCard locale={locale} post={other} featured /><Link className="blog-all-link" href={blogIndexPath(locale)}>{ui.latest} <ArrowRight size={16} /></Link></section>
    </article>
    <ToolFooter locale={locale} text={ui.footer} />
  </main>;
}
