// SEO 工具函数 — 为每个工具页面生成一致的 metadata 和结构化数据

import type { ToolMeta } from './types';
import type { Metadata } from 'next';

const SITE_NAME = 'ImageTools';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://image.toolconv.com';
const TAGLINE = 'Free online image tools — 100% browser-side, zero upload, no signup.';

/** 为工具页面生成 Metadata */
export function generateToolMeta(tool: ToolMeta): Metadata {
  const title = `${tool.title} — Free Online, No Upload | ${SITE_NAME}`;
  const description = tool.description;
  const ogImage = `${SITE_URL}/og/${tool.slug}.png`;

  return {
    title,
    description,
    keywords: tool.keywords,
    alternates: { canonical: `${SITE_URL}/tools/${tool.slug}` },
    openGraph: {
      title,
      description,
      siteName: SITE_NAME,
      url: `${SITE_URL}/tools/${tool.slug}`,
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

/** 为首页生成 Metadata */
export function generateHomeMeta(): Metadata {
  return {
    title: `${SITE_NAME} — Free Online Image Tools, No Upload Required`,
    description: TAGLINE,
    keywords: ['image tools', 'compress image', 'convert image', 'resize image', 'crop image', 'free online image editor'],
    alternates: { canonical: SITE_URL },
    openGraph: {
      title: `${SITE_NAME} — Free Online Image Tools`,
      description: TAGLINE,
      siteName: SITE_NAME,
      url: SITE_URL,
      type: 'website',
      images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${SITE_NAME} — Free Online Image Tools`,
      description: TAGLINE,
      images: [`${SITE_URL}/og-image.png`],
    },
  };
}

/** 为格式转换页面生成 Metadata */
export function generateConvertMeta(fromLabel: string, toLabel: string): Metadata {
  const title = `${fromLabel} to ${toLabel} Converter — Free Online, No Upload | ${SITE_NAME}`;
  const description = `Convert ${fromLabel} to ${toLabel} online for free. 100% browser-based — your files never leave your device. No signup, no upload, instant download.`;

  return {
    title,
    description,
    keywords: [`${fromLabel.toLowerCase()} to ${toLabel.toLowerCase()}`, `convert ${fromLabel.toLowerCase()} to ${toLabel.toLowerCase()}`, `${fromLabel.toLowerCase()} to ${toLabel.toLowerCase()} converter`, `${fromLabel.toLowerCase()} to ${toLabel.toLowerCase()} online`],
    alternates: { canonical: `${SITE_URL}/convert/${fromLabel.toLowerCase()}-to-${toLabel.toLowerCase()}` },
    openGraph: {
      title,
      description,
      siteName: SITE_NAME,
      url: `${SITE_URL}/convert/${fromLabel.toLowerCase()}-to-${toLabel.toLowerCase()}`,
      type: 'website',
      images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/og-image.png`],
    },
  };
}

/** 生成 WebApplication Schema JSON-LD */
export function generateWebAppSchema(tool: ToolMeta): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.title,
    url: `${SITE_URL}/tools/${tool.slug}`,
    description: tool.description,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    browserRequirements: 'Requires JavaScript. Works in all modern browsers.',
  };
}

/** 生成 FAQ Schema */
export function generateFAQSchema(questions: { q: string; a: string }[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };
}

/** 生成 BreadcrumbList Schema */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** 生成 Organization Schema（全站公用） */
export const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  description: TAGLINE,
};
