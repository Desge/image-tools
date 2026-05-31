import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CONVERSION_PAIRS } from '@/data/formats';
import { localeCodes, loadTranslations } from '@/i18n';
import { generateSoftwareApplicationSchema, generateFAQSchema, generateBreadcrumbSchema } from '@/lib/jsonld';
import { ConverterPageClient } from './ConverterPageClient';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://image.toolconv.com';
const OG_IMAGE = `${SITE_URL}/og-image.png`;

export function generateStaticParams() {
  const params: { locale: string; formats: string[] }[] = [];
  for (const locale of localeCodes()) {
    for (const pair of CONVERSION_PAIRS) {
      params.push({ locale, formats: [pair.slug] });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; formats: string[] }>;
}): Promise<Metadata> {
  const { locale, formats } = await params;
  const slug = formats[0];
  const pair = CONVERSION_PAIRS.find((p) => p.slug === slug);
  if (!pair) return {};

  const t = await loadTranslations(locale);

  return {
    title: `${pair.from.name} ${t.converter.title} ${pair.to.name} — ${t.common.seoTitleSuffix}`,
    description: t.common.seoDescription,
    alternates: {
      canonical: `${SITE_URL}/${locale}/convert/${slug}/`,
      languages: {
        'x-default': `${SITE_URL}/en/convert/${slug}/`,
        ...Object.fromEntries(localeCodes().map((l) => [l, `${SITE_URL}/${l}/convert/${slug}/`])),
      },
    },
    openGraph: {
      title: `${pair.from.name} ${t.converter.title} ${pair.to.name} — ${t.common.seoTitleSuffix}`,
      description: t.common.seoDescription,
      siteName: 'ImageTools',
      url: `${SITE_URL}/${locale}/convert/${slug}/`,
      type: 'website',
      images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${pair.from.name} ${t.converter.title} ${pair.to.name} — ${t.common.seoTitleSuffix}`,
      description: t.common.seoDescription,
      images: [OG_IMAGE],
    },
  };
}

export default async function LocaleConverterPage({
  params,
}: {
  params: Promise<{ locale: string; formats: string[] }>;
}) {
  const { locale, formats } = await params;
  const slug = formats[0];
  const pair = CONVERSION_PAIRS.find((p) => p.slug === slug);
  if (!pair) notFound();

  const t = await loadTranslations(locale);

  // JSON-LD schemas
  const softwareSchema = generateSoftwareApplicationSchema(
    `${pair.from.name} ${t.converter.title} ${pair.to.name} ${t.converter.convertBtn.replace(t.converter.title, '').trim()}`,
    `${t.converter.description}`,
    `/${locale}/convert/${slug}`,
    locale
  );
  const faqSchema = generateFAQSchema([
    { question: t.faq.free.q, answer: t.faq.free.a },
    { question: t.faq.upload.q, answer: t.faq.upload.a },
    { question: t.faq.formats.q, answer: t.faq.formats.a },
  ]);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'ImageTools', url: `/${locale}` },
    { name: `${pair.from.name} ${t.converter.title} ${pair.to.name}`, url: `/${locale}/convert` },
    { name: `${pair.from.name} ${t.converter.title} ${pair.to.name}`, url: `/${locale}/convert/${slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <ConverterPageClient t={t} locale={locale} from={pair.from} to={pair.to} allPairs={CONVERSION_PAIRS} />
    </>
  );
}
