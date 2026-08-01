import type { MetadataRoute } from "next";
import { languageAlternates, locales, platformIds, platformPath } from "./i18n";

const siteUrl = "https://totube.online";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const localizedHomes: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: `${siteUrl}/${locale}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: locale === "fr" || locale === "en" ? 1 : 0.9,
    alternates: { languages: languageAlternates() },
  }));
  const localizedPlatforms: MetadataRoute.Sitemap = locales.flatMap((locale) => platformIds.map((platform) => ({
    url: `${siteUrl}${platformPath(locale, platform)}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: platform === "youtube" ? 0.9 : 0.8,
    alternates: { languages: languageAlternates(platform) },
  })));

  return [
    ...localizedHomes,
    ...localizedPlatforms,
    { url: `${siteUrl}/youtube-mp3`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/youtube-mp4`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/convertisseur-mp3`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/alternative-notube`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/telecharger-video-autres-plateformes`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/meilleur-telechargeur-video`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
  ];
}
