import type { Metadata } from 'next';
import Link from 'next/link';
import { localeCodes, loadTranslations } from '@/i18n';
import { TOOLS, CATEGORIES } from '@/lib/tools';
import { generateOrganizationSchema, generateWebSiteSchema, generateBreadcrumbSchema } from '@/lib/jsonld';
import { HomePageClient } from './HomePageClient';

export function generateStaticParams() {
  return localeCodes().map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await loadTranslations(locale);
  return {
    title: `${t.common.siteName} — ${t.home.subtitle.replace(/\n/g, ' ')}`,
    description: t.common.tagline,
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(localeCodes().map((l) => [l, `/${l}`])),
    },
  };
}

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await loadTranslations(locale);
  const grouped = CATEGORIES.map((cat) => ({
    ...cat,
    tools: TOOLS.filter((t2) => t2.category === cat.key),
  })).filter((g) => g.tools.length > 0);

  const popularConversions = [
    { slug: 'png-to-jpg', label: 'PNG → JPG' },
    { slug: 'jpg-to-png', label: 'JPG → PNG' },
    { slug: 'webp-to-png', label: 'WebP → PNG' },
    { slug: 'png-to-webp', label: 'PNG → WebP' },
    { slug: 'jpg-to-webp', label: 'JPG → WebP' },
    { slug: 'webp-to-jpg', label: 'WebP → JPG' },
    { slug: 'avif-to-png', label: 'AVIF → PNG' },
    { slug: 'bmp-to-jpg', label: 'BMP → JPG' },
    { slug: 'png-to-ico', label: 'PNG → ICO' },
    { slug: 'svg-to-png', label: 'SVG → PNG' },
  ];

  const orgSchema = generateOrganizationSchema();
  const webSiteSchema = generateWebSiteSchema(locale);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: t.common.siteName, url: `/${locale}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <HomePageClient t={t} locale={locale} grouped={grouped} popularConversions={popularConversions} />
    </>
  );
}
