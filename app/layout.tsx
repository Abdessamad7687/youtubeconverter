import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import { homeCopy, isLocale, Locale, locales } from "./i18n";
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
      "télécharger vidéo TikTok",
      "télécharger vidéo Instagram",
      "télécharger vidéo Facebook",
      "télécharger vidéo Twitter",
      "télécharger vidéo Rumble",
      "télécharger vidéo Threads",
      "téléchargeur vidéo en ligne",
    ],
    manifest: "/manifest.webmanifest",
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      ],
      apple: [{ url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
    },
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

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const headerStore = await headers();
  const requestedLocale = headerStore.get("x-totube-locale") || "fr";
  const locale: Locale = isLocale(requestedLocale) ? requestedLocale : "fr";
  const copy = homeCopy[locale];
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "toTube",
    alternateName: ["toTube Converter", "toTube MP3"],
    url: "https://totube.online/",
    inLanguage: locales,
  };
  const applicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "toTube",
    url: "https://totube.online/",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web",
    description: copy.metaDescription,
    browserRequirements: "Requires JavaScript and a modern web browser",
    featureList: [
      "YouTube, TikTok, Instagram, Facebook, X, Rumble and Threads public-link conversion",
      "MP4 resolution selection from 360p to 1080p",
      "Audio bitrate selection from 128 to 320 kbps",
      "MP3, MP4, M4A, WAV, AAC, FLAC and OPUS output",
      "FFprobe output validation",
    ],
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  };
  return (
    <html lang={locale} dir={copy.dir}>
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-GDL0WSR1P6" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-GDL0WSR1P6');`,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(applicationSchema) }} />
        {children}
      </body>
    </html>
  );
}
