import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TOOLS } from '@/lib/tools';
import { localeCodes, loadTranslations } from '@/i18n';
import type { Translations } from '@/i18n';
import { generateWebApplicationSchema, generateFAQSchema, generateBreadcrumbSchema, generateHowToSchema } from '@/lib/jsonld';
import { ToolPageClient } from './ToolPageClient';

// ═══════════════════════════════════════════
// 为每种语言 × 每个工具生成独立页面
// ═══════════════════════════════════════════

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of localeCodes()) {
    for (const tool of TOOLS) {
      params.push({ locale, slug: tool.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const tool = TOOLS.find((t) => t.slug === slug);
  if (!tool) return {};

  const t = await loadTranslations(locale);
  const tt = getToolT(t, slug);
  const title = tt?.title || tool.title;
  const desc = tt?.description || tool.description;

  return {
    title: `${title} — ${t.common.seoTitleSuffix}`,
    description: t.common.seoDescription,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://image.toolconv.com'}/${locale}/tools/${tool.slug}`,
      languages: {
        'x-default': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://image.toolconv.com'}/en/tools/${tool.slug}`,
        ...Object.fromEntries(localeCodes().map((l) => [l, `${process.env.NEXT_PUBLIC_SITE_URL || 'https://image.toolconv.com'}/${l}/tools/${tool.slug}`])),
      },
    },
    openGraph: {
      title: `${title} — ${t.common.seoTitleSuffix}`,
      description: desc,
      siteName: 'ImageTools',
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://image.toolconv.com'}/${locale}/tools/${tool.slug}`,
      type: 'website',
      images: [{ url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://image.toolconv.com'}/og-image.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} — ${t.common.seoTitleSuffix}`,
      description: desc,
      images: [`${process.env.NEXT_PUBLIC_SITE_URL || 'https://image.toolconv.com'}/og-image.png`],
    },
  };
}

function getToolT(t: Translations, slug: string) {
  const map: Record<string, { title?: string; description?: string; longDescription?: string }> = {
    compress:              t.tools.compress,
    resize:                t.tools.resize,
    crop:                  t.tools.crop,
    rotate:                t.tools.rotate,
    watermark:             t.tools.watermark,
    'color-palette':       t.tools.colorPalette,
    'favicon-generator':   t.tools.faviconGenerator,
    'screenshot-beautify': t.tools.screenshotBeautify,
    base64:                t.tools.base64,
    'instagram-grid':      t.tools.instagramGrid,
    'remove-exif':         t.tools.removeExif,
  };
  return map[slug] || null;
}

export default async function LocaleToolPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const tool = TOOLS.find((t) => t.slug === slug);
  if (!tool) notFound();

  // 服务端预加载翻译
  const t = await loadTranslations(locale);
  const tt = getToolT(t, slug);
  const relatedTools = TOOLS.filter((rt) => rt.category === tool.category && rt.slug !== tool.slug).slice(0, 4);

  // JSON-LD schemas
  const webAppSchema = generateWebApplicationSchema(
    tt?.title || tool.title,
    tt?.description || tool.description,
    `/${locale}/tools/${tool.slug}`,
    'MultimediaApplication'
  );
  const faqSchema = generateFAQSchema([
    { question: t.faq.free.q, answer: t.faq.free.a },
    { question: t.faq.upload.q, answer: t.faq.upload.a },
    { question: t.faq.formats.q, answer: t.faq.formats.a },
    { question: t.faq.batch.q, answer: t.faq.batch.a },
  ]);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'ImageTools', url: `/${locale}` },
    { name: tt?.title || tool.title, url: `/${locale}/tools/${tool.slug}` },
  ]);
  const howToSchema = generateHowToSchema(
    `How to ${(tt?.title || tool.title).toLowerCase()}`,
    ['Upload Image', 'Adjust Settings', 'Download Result'],
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <ToolPageClient t={t} locale={locale} tool={tool} relatedTools={relatedTools} />
    </>
  );
}
