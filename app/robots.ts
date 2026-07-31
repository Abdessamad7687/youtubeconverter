import type { MetadataRoute } from "next";

const siteUrl = "https://clipmint-media.abdessamadahmali.chatgpt.site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/__debug"] }],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
