import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") || headerStore.get("host") || "localhost:3000";
  const protocol = headerStore.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  const base = new URL(`${protocol}://${host}`);

  return {
    metadataBase: base,
    title: "YouTube MP3 & MP4 — Convertisseur gratuit | toTube",
    description: "Convertisseur YouTube MP3 et MP4 gratuit, rapide et sans inscription. Collez un lien, choisissez votre format et téléchargez votre fichier avec toTube.",
    keywords: [
      "youtube mp3",
      "notube",
      "youtube to mp3",
      "youtube mp4",
      "convertisseur mp3",
      "convertisseur YouTube MP3",
      "YouTube MP4",
      "télécharger vidéo YouTube",
      "video converter",
      "convertisseur MP3 gratuit",
      "YouTube downloader",
      "convertisseur vidéo rapide",
      "sans inscription",
      "X Twitter vidéo",
    ],
    alternates: { canonical: "https://clipmint-media.abdessamadahmali.chatgpt.site/" },
    robots: { index: true, follow: true },
    openGraph: {
      title: "toTube — Convertisseur YouTube MP3 & MP4",
      description: "Convertissez vos vidéos rapidement, gratuitement et sans inscription.",
      type: "website",
      locale: "fr_FR",
      images: [{ url: "/og.png", width: 1731, height: 909, alt: "toTube, convertisseur YouTube MP3 et MP4" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "toTube — Convertisseur YouTube MP3 & MP4",
      description: "Convertissez vos vidéos rapidement, gratuitement et sans inscription.",
      images: ["/og.png"],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "toTube",
    alternateName: ["toTube Converter", "toTube MP3"],
    url: "https://clipmint-media.abdessamadahmali.chatgpt.site/",
    inLanguage: "fr-FR",
  };
  const applicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "toTube",
    url: "https://clipmint-media.abdessamadahmali.chatgpt.site/",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web",
    description: "Convertisseur YouTube MP3 et MP4 gratuit et rapide.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  };
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(applicationSchema) }} />
        {children}
      </body>
    </html>
  );
}
