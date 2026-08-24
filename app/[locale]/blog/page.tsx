import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogIndexLanguageAlternates, blogIndexPath, blogUi } from "../../blog-content";
import { homeCopy, isLocale, locales } from "../../i18n";
import { LocalizedBlogIndex } from "../../localized-blog";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const ui = blogUi[locale];
  const canonical = `https://totube.online${blogIndexPath(locale)}`;
  const title = `${ui.title} | toTube`;
  return {
    title,
    description: ui.subtitle,
    keywords: ["video guides", "audio format guide", "MP4", "MP3", "video quality", "safe video download"],
    alternates: { canonical, languages: blogIndexLanguageAlternates() },
    robots: { index: true, follow: true },
    openGraph: { title, description: ui.subtitle, url: canonical, locale: homeCopy[locale].ogLocale, type: "website" },
    twitter: { card: "summary", title, description: ui.subtitle, images: [] },
  };
}

export default async function BlogIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <LocalizedBlogIndex locale={locale} />;
}
