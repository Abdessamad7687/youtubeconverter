import type { MetadataRoute } from "next";

const siteUrl = "https://totube.online";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/youtube-mp3`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/youtube-mp4`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/telecharger-video-youtube`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/telecharger-video-tiktok`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${siteUrl}/telecharger-video-instagram`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${siteUrl}/telecharger-video-facebook`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/telecharger-video-twitter`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/telecharger-video-autres-plateformes`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/meilleur-telechargeur-video`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${siteUrl}/convertisseur-mp3`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/alternative-notube`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];
}
