import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogPostForSlug, blogPostIds, blogPostLanguageAlternates, blogPostPath, blogPosts, blogSeoTitles } from "../../../blog-content";
import { homeCopy, isLocale, locales } from "../../../i18n";
import { LocalizedBlogArticle } from "../../../localized-blog";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => blogPostIds.map((id) => ({ locale, slug: blogPosts[locale][id].slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const post = blogPostForSlug(locale, slug);
  if (!post) return {};
  const canonical = `https://totube.online${blogPostPath(locale, post.id)}`;
  const metaTitle = `${blogSeoTitles[locale][post.id]} | toTube`;
  return {
    title: metaTitle,
    description: post.description,
    keywords: post.keywords,
    authors: [{ name: "toTube Editorial", url: "https://totube.online/" }],
    category: "Technology",
    alternates: { canonical, languages: blogPostLanguageAlternates(post.id) },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 } },
    openGraph: { title: metaTitle, description: post.description, url: canonical, locale: homeCopy[locale].ogLocale, type: "article", publishedTime: post.published, modifiedTime: post.updated, authors: ["toTube Editorial"], images: [] },
    twitter: { card: "summary", title: metaTitle, description: post.description, images: [] },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const post = blogPostForSlug(locale, slug);
  if (!post) notFound();
  return <LocalizedBlogArticle locale={locale} post={post} />;
}
