import type { MetadataRoute } from "next";

const siteUrl = "https://clipmint-media.abdessamadahmali.chatgpt.site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/youtube-mp3`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/youtube-mp4`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/convertisseur-mp3`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/alternative-notube`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];
}
