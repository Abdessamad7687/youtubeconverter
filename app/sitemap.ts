import type { MetadataRoute } from "next";
import { blogIndexLanguageAlternates, blogIndexPath, blogPostIds, blogPostLanguageAlternates, blogPostPath, blogPosts } from "./blog-content";
import { languageAlternates, locales, platformIds, platformPath, qualityLanguageAlternates, qualityPageIds, qualityPagePath } from "./i18n";

const siteUrl = "https://totube.online";

export default function sitemap(): MetadataRoute.Sitemap {
  const localizedHomes: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: `${siteUrl}/${locale}`,
    changeFrequency: "weekly",
    priority: locale === "fr" || locale === "en" ? 1 : 0.9,
    alternates: { languages: languageAlternates() },
  }));
  const localizedPlatforms: MetadataRoute.Sitemap = locales.flatMap((locale) => platformIds.map((platform) => ({
    url: `${siteUrl}${platformPath(locale, platform)}`,
    changeFrequency: "weekly" as const,
    priority: platform === "youtube" ? 0.9 : 0.8,
    alternates: { languages: languageAlternates(platform) },
  })));
  const localizedQualityPages: MetadataRoute.Sitemap = locales.flatMap((locale) => qualityPageIds.map((page) => ({
    url: `${siteUrl}${qualityPagePath(locale, page)}`,
    changeFrequency: "weekly" as const,
    priority: 0.9,
    alternates: { languages: qualityLanguageAlternates(page) },
  })));
  const localizedBlogIndexes: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: `${siteUrl}${blogIndexPath(locale)}`,
    changeFrequency: "weekly" as const,
    priority: 0.75,
    alternates: { languages: blogIndexLanguageAlternates() },
  }));
  const localizedBlogPosts: MetadataRoute.Sitemap = locales.flatMap((locale) => blogPostIds.map((id) => ({
    url: `${siteUrl}${blogPostPath(locale, id)}`,
    lastModified: new Date(`${blogPosts[locale][id].updated}T00:00:00Z`),
    changeFrequency: "monthly" as const,
    priority: 0.8,
    alternates: { languages: blogPostLanguageAlternates(id) },
  })));

  return [
    ...localizedHomes,
    ...localizedPlatforms,
    ...localizedQualityPages,
    ...localizedBlogIndexes,
    ...localizedBlogPosts,
    { url: `${siteUrl}/youtube-mp3`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/youtube-mp4`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/convertisseur-mp3`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/alternative-notube`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/telecharger-video-autres-plateformes`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/meilleur-telechargeur-video`, changeFrequency: "monthly", priority: 0.65 },
  ];
}
