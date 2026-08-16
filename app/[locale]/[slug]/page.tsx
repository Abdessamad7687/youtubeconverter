import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, languageAlternates, locales, localizedQualitySlugs, localizedSlugs, platformForSlug, platformIds, platformPath, qualityLanguageAlternates, qualityPageForSlug, qualityPageIds, qualityPagePath } from "../../i18n";
import { LocalizedPlatformPage, platformMetadataText } from "../../localized-platform";
import { LocalizedQualityPage, localizedQualityMetadata } from "../../localized-quality";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => [
    ...platformIds.map((platform) => ({ locale, slug: localizedSlugs[locale][platform] })),
    ...qualityPageIds.map((page) => ({ locale, slug: localizedQualitySlugs[locale][page] })),
  ]);
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const platform = platformForSlug(locale, slug);
  if (platform) {
    const text = platformMetadataText(locale, platform);
    const canonical = `https://totube.online${platformPath(locale, platform)}`;
    const keywords = platform === "rumble" ? ["download rumble video", "rumble downloader", "rumble video download", "rumble video downloader", "download rumble", "rumble to mp3", "rumble mp4"] : [`${platform} downloader`, `${platform} video downloader`, `${platform} to mp3`, `${platform} mp4`, "free video downloader", "online video converter"];
    return { title: text.title, description: text.description, keywords, alternates: { canonical, languages: languageAlternates(platform) }, openGraph: { title: text.title, description: text.description, url: canonical, type: "website" } };
  }
  const qualityPage = qualityPageForSlug(locale, slug);
  if (!qualityPage) return {};
  const text = localizedQualityMetadata(locale, qualityPage);
  const canonical = `https://totube.online${qualityPagePath(locale, qualityPage)}`;
  return { title: text.title, description: text.description, keywords: qualityPage === "youtube-mp3-320" ? ["youtube to mp3 320kbps", "youtube mp3 320 kbps", "high quality mp3 converter", "youtube audio downloader"] : ["youtube to mp4 1080p", "youtube mp4 full hd", "youtube video downloader 1080p", "compatible mp4 converter"], alternates: { canonical, languages: qualityLanguageAlternates(qualityPage) }, openGraph: { title: text.title, description: text.description, url: canonical, type: "website" } };
}

export default async function PlatformPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const platform = platformForSlug(locale, slug);
  if (platform) return <LocalizedPlatformPage locale={locale} platform={platform} />;
  const qualityPage = qualityPageForSlug(locale, slug);
  if (qualityPage) return <LocalizedQualityPage locale={locale} page={qualityPage} />;
  notFound();
}
