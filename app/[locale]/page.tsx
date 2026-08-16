import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { homeCopy, isLocale, languageAlternates, locales } from "../i18n";
import LocalizedHome from "../localized-home";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = homeCopy[locale];
  const canonical = `https://totube.online/${locale}`;
  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    keywords: ["video downloader", "video converter", "YouTube MP3", "YouTube MP4", "TikTok downloader", "Instagram downloader", "Facebook video downloader", "Twitter video downloader", "Rumble downloader", "Threads video downloader", "MP3", "MP4", "WAV", "FLAC", "OPUS"],
    alternates: { canonical, languages: languageAlternates() },
    openGraph: { title: copy.metaTitle, description: copy.metaDescription, url: canonical, locale: copy.ogLocale, type: "website" },
    twitter: { card: "summary_large_image", title: copy.metaTitle, description: copy.metaDescription },
  };
}

export default async function LocalePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = homeCopy[locale];
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: copy.faqs.map((faq) => ({ "@type": "Question", name: faq.q, acceptedAnswer: { "@type": "Answer", text: faq.a } })) };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} /><LocalizedHome locale={locale} /></>;
}
