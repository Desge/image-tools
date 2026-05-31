import type { MetadataRoute } from 'next';
import { TOOLS } from '@/lib/tools';
import { CONVERSION_PAIRS } from '@/data/formats';
import { localeCodes } from '@/i18n';

export const dynamic = 'force-static';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://image.toolconv.com';

// ═══════════════════════════════════════════
// 多语言 Sitemap — 所有 locale × 工具页 × 转换页
// ═══════════════════════════════════════════

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of localeCodes()) {
    // 首页
    entries.push({
      url: `${BASE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
      alternates: {
        languages: {
          'x-default': `${BASE_URL}/en`,
          ...Object.fromEntries(localeCodes().map((l) => [l, `${BASE_URL}/${l}`])),
        },
      },
    });

    // 工具页面
    for (const tool of TOOLS) {
      entries.push({
        url: `${BASE_URL}/${locale}/tools/${tool.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.9,
      });
    }

    // 格式转换页面
    for (const pair of CONVERSION_PAIRS) {
      entries.push({
        url: `${BASE_URL}/${locale}/convert/${pair.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    }
  }

  return entries;
}
