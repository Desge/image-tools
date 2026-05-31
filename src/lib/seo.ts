// SEO 工具函数 — 为每个工具页面生成一致的 metadata 和结构化数据

import type { ToolMeta } from './types';
import type { Metadata } from 'next';
import { localeCodes } from '@/i18n';

const SITE_NAME = 'ImageTools';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://image.toolconv.com';
const TAGLINE = 'Free online image tools — 100% browser-side, zero upload, no signup.';
const OG_IMAGE = `${SITE_URL}/og-image.png`;

/** 为工具页面生成 Metadata */
export function generateToolMeta(tool: ToolMeta, locale: string = 'en'): Metadata {
  const title = `${tool.title} — Free Online, No Upload | ${SITE_NAME}`;
  const description = tool.description;
  const url = `${SITE_URL}/${locale}/tools/${tool.slug}/`;

  return {
    title,
    description,
    keywords: tool.keywords,
    alternates: {
      canonical: url,
      languages: {
        'x-default': `${SITE_URL}/en/tools/${tool.slug}/`,
        ...Object.fromEntries(localeCodes().map((l) => [l, `${SITE_URL}/${l}/tools/${tool.slug}/`])),
      },
    },
    openGraph: {
      title,
      description,
      siteName: SITE_NAME,
      url,
      type: 'website',
      images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [OG_IMAGE],
    },
  };
}

/** 为首页生成 Metadata */
export function generateHomeMeta(locale: string = 'en'): Metadata {
  return {
    title: `${SITE_NAME} — Free Online Image Tools, No Upload Required`,
    description: TAGLINE,
    keywords: ['image tools', 'compress image', 'convert image', 'resize image', 'crop image', 'free online image editor'],
    alternates: {
      canonical: `${SITE_URL}/${locale}/`,
      languages: {
        'x-default': `${SITE_URL}/en/`,
        ...Object.fromEntries(localeCodes().map((l) => [l, `${SITE_URL}/${l}/`])),
      },
    },
    openGraph: {
      title: `${SITE_NAME} — Free Online Image Tools`,
      description: TAGLINE,
      siteName: SITE_NAME,
      url: `${SITE_URL}/${locale}/`,
      type: 'website',
      images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${SITE_NAME} — Free Online Image Tools`,
      description: TAGLINE,
      images: [OG_IMAGE],
    },
  };
}

/** 为格式转换页面生成 Metadata */
export function generateConvertMeta(fromLabel: string, toLabel: string, locale: string = 'en'): Metadata {
  const title = `${fromLabel} to ${toLabel} Converter — Free Online, No Upload | ${SITE_NAME}`;
  const description = `Convert ${fromLabel} to ${toLabel} online for free. 100% browser-based — your files never leave your device. No signup, no upload, instant download.`;
  const slug = `${fromLabel.toLowerCase()}-to-${toLabel.toLowerCase()}`;
  const url = `${SITE_URL}/${locale}/convert/${slug}/`;

  return {
    title,
    description,
    keywords: [`${fromLabel.toLowerCase()} to ${toLabel.toLowerCase()}`, `convert ${fromLabel.toLowerCase()} to ${toLabel.toLowerCase()}`, `${fromLabel.toLowerCase()} to ${toLabel.toLowerCase()} converter`, `${fromLabel.toLowerCase()} to ${toLabel.toLowerCase()} online`],
    alternates: {
      canonical: url,
      languages: {
        'x-default': `${SITE_URL}/en/convert/${slug}/`,
        ...Object.fromEntries(localeCodes().map((l) => [l, `${SITE_URL}/${l}/convert/${slug}/`])),
      },
    },
    openGraph: {
      title,
      description,
      siteName: SITE_NAME,
      url,
      type: 'website',
      images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [OG_IMAGE],
    },
  };
}

/** 生成 WebApplication Schema JSON-LD */
export function generateWebAppSchema(tool: ToolMeta, locale: string = 'en'): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.title,
    url: `${SITE_URL}/${locale}/tools/${tool.slug}`,
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
