import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CONVERSION_PAIRS } from '@/data/formats';
import { localeCodes, loadTranslations } from '@/i18n';
import { generateSoftwareApplicationSchema, generateFAQSchema, generateBreadcrumbSchema } from '@/lib/jsonld';
import { ConverterPageClient } from './ConverterPageClient';

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
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://image.toolconv.com'}/${locale}/convert/${slug}`,
      languages: {
        'x-default': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://image.toolconv.com'}/en/convert/${slug}`,
        ...Object.fromEntries(localeCodes().map((l) => [l, `${process.env.NEXT_PUBLIC_SITE_URL || 'https://image.toolconv.com'}/${l}/convert/${slug}`])),
      },
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
    `${pair.from.name} to ${pair.to.name} Converter`,
    `Convert ${pair.from.name} images to ${pair.to.name} format online for free. 100% browser-based.`,
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
    { name: 'Format Converter', url: `/${locale}/convert` },
    { name: `${pair.from.name} to ${pair.to.name}`, url: `/${locale}/convert/${slug}` },
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
