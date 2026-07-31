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
    title: "toTube — Convertisseur YouTube MP3 & MP4 gratuit et rapide",
    description: "Le meilleur convertisseur gratuit et rapide dans les formats MP3, MP4. Convertissez et téléchargez vos vidéos YouTube sans inscription.",
    keywords: [
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
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
