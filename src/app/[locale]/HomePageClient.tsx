'use client';

import Link from 'next/link';
import type { ToolMeta } from '@/lib/types';
import type { Translations } from '@/i18n';

interface HomePageClientProps {
  t: Translations;
  locale: string;
  grouped: { key: string; label: string; emoji: string; tools: ToolMeta[] }[];
  popularConversions: { slug: string; label: string }[];
}

function getToolTranslations(t: Translations, slug: string) {
  const map: Record<string, { title: string; description: string; longDescription: string }> = {
    compress: t.tools.compress,
    resize: t.tools.resize,
    crop: t.tools.crop,
    rotate: t.tools.rotate,
    watermark: t.tools.watermark,
    'color-palette': t.tools.colorPalette,
    'favicon-generator': t.tools.faviconGenerator,
    'screenshot-beautify': t.tools.screenshotBeautify,
    base64: t.tools.base64,
    'instagram-grid': t.tools.instagramGrid,
    'remove-exif': t.tools.removeExif,
  };
  return map[slug] || { title: '', description: '', longDescription: '' };
}

function getCategoryLabel(t: Translations, key: string): string {
  const map: Record<string, string> = {
    edit: t.home.categoryEdit,
    convert: t.home.categoryConvert,
    compress: t.home.categoryCompress,
    generate: t.home.categoryGenerate,
    utility: t.home.categoryUtility,
  };
  return map[key] || key;
}

export function HomePageClient({ t, locale, grouped, popularConversions }: HomePageClientProps) {
  return (
    <>
      {/* Hero */}
      <section className="text-center py-16 sm:py-20">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          {t.home.title}
        </h1>
        <p className="mt-4 text-lg sm:text-xl max-w-2xl mx-auto whitespace-pre-line" style={{ color: 'var(--text-secondary)' }}>
          {t.home.subtitle}
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          <span className="px-3 py-1.5 rounded-full text-sm font-medium"
            style={{ backgroundColor: 'var(--bg-badge-green)', color: 'var(--text-badge-green)' }}>
            {t.home.privacyLine1}
          </span>
          <span className="px-3 py-1.5 rounded-full text-sm font-medium"
            style={{ backgroundColor: 'var(--bg-badge-blue)', color: 'var(--text-badge-blue)' }}>
            {t.home.privacyLine2}
          </span>
          <span className="px-3 py-1.5 rounded-full text-sm font-medium"
            style={{ backgroundColor: 'var(--bg-badge-purple)', color: 'var(--text-badge-purple)' }}>
            {t.home.privacyLine3}
          </span>
        </div>
      </section>

      {/* 工具分类 */}
      <div className="space-y-12">
        {grouped.map((group) => (
          <section key={group.key}>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <span>{getCategoryLabel(t, group.key)}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {group.tools.map((tool) => {
                const tt = getToolTranslations(t, tool.slug);
                return (
                  <Link
                    key={tool.slug}
                    href={`/${locale}/tools/${tool.slug}`}
                    className="group p-5 rounded-xl border transition-all"
                    style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-card)' }}
                  >
                    <h3 className="text-base font-semibold group-hover:underline" style={{ color: 'var(--text-primary)' }}>
                      {tt.title || tool.title}
                    </h3>
                    <p className="mt-1.5 text-sm line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                      {tt.description || tool.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {tool.inputFormats.slice(0, 3).map((f) => (
                        <span key={f} className="px-2 py-0.5 text-xs rounded-md"
                          style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>{f}</span>
                      ))}
                      {tool.batchSupport && (
                        <span className="px-2 py-0.5 text-xs rounded-md"
                          style={{ backgroundColor: 'var(--bg-badge-orange)', color: 'var(--text-badge-orange)' }}>{t.common.batchBadge}</span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* 格式转换快捷入口 */}
      <section className="mt-16 mb-8">
        <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>{t.home.popularConversions}</h2>
        <div className="flex flex-wrap gap-2">
          {popularConversions.map((item) => (
            <Link key={item.slug} href={`/${locale}/convert/${item.slug}`}
              className="px-4 py-2 rounded-full text-sm border transition-all hover:underline"
              style={{ borderColor: 'var(--border-primary)', color: 'var(--text-secondary)' }}>
              {item.label}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
