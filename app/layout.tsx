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
    title: "ClipMint — Clean media exports",
    description: "Turn media links you have permission to use into clean audio or video exports.",
    openGraph: {
      title: "ClipMint — Turn a link into something useful",
      description: "Clean media exports. Zero fuss.",
      type: "website",
      images: [{ url: "/og.png", width: 1731, height: 909, alt: "ClipMint media converter" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "ClipMint — Turn a link into something useful",
      description: "Clean media exports. Zero fuss.",
      images: ["/og.png"],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
