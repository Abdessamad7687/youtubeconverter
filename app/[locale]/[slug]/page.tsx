import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, languageAlternates, locales, localizedSlugs, platformForSlug, platformIds, platformPath } from "../../i18n";
import { LocalizedPlatformPage, platformMetadataText } from "../../localized-platform";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => platformIds.map((platform) => ({ locale, slug: localizedSlugs[locale][platform] })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const platform = platformForSlug(locale, slug);
  if (!platform) return {};
  const text = platformMetadataText(locale, platform);
  const canonical = `https://totube.online${platformPath(locale, platform)}`;
  return {
    title: text.title,
    description: text.description,
    keywords: [`${platform} downloader`, `${platform} video downloader`, `${platform} to mp3`, `${platform} mp4`, "free video downloader", "online video converter"],
    alternates: { canonical, languages: languageAlternates(platform) },
    openGraph: { title: text.title, description: text.description, url: canonical, type: "website" },
  };
}

export default async function PlatformPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const platform = platformForSlug(locale, slug);
  if (!platform) notFound();
  return <LocalizedPlatformPage locale={locale} platform={platform} />;
}
