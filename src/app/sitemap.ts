import type { MetadataRoute } from 'next';
import { TOOLS } from '@/lib/tools';
import { CONVERSION_PAIRS } from '@/data/formats';
import { localeCodes } from '@/i18n';

export const dynamic = 'force-static';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://image.toolconv.com';

// ═══════════════════════════════════════════
// 多语言 Sitemap — 所有 locale × 工具页 × 转换页
// 所有 URL 使用尾部斜杠（与 trailingSlash: true 配置一致）
// 所有页面均添加 hreflang 交叉引用
// ═══════════════════════════════════════════

function buildLanguages(path: string): Record<string, string> {
  return {
    'x-default': `${BASE_URL}/en${path}`,
    ...Object.fromEntries(localeCodes().map((l) => [l, `${BASE_URL}/${l}${path}`])),
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of localeCodes()) {
    // 首页 — 尾部斜杠
    entries.push({
      url: `${BASE_URL}/${locale}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
      alternates: {
        languages: buildLanguages('/'),
      },
    });

    // 工具页面 — 尾部斜杠 + hreflang
    for (const tool of TOOLS) {
      const toolPath = `/tools/${tool.slug}/`;
      entries.push({
        url: `${BASE_URL}/${locale}${toolPath}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.9,
        alternates: {
          languages: buildLanguages(toolPath),
        },
      });
    }

    // 格式转换页面 — 尾部斜杠 + hreflang
    for (const pair of CONVERSION_PAIRS) {
      const convertPath = `/convert/${pair.slug}/`;
      entries.push({
        url: `${BASE_URL}/${locale}${convertPath}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: {
          languages: buildLanguages(convertPath),
        },
      });
    }
  }

  return entries;
}
