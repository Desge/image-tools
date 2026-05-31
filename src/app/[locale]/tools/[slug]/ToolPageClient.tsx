'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import type { ToolMeta } from '@/lib/types';
import type { Translations } from '@/i18n';
import { CATEGORIES, TOOLS } from '@/lib/tools';

// 工具组件懒加载映射
const ToolComponents: Record<string, React.ComponentType<{ t?: Translations }>> = {
  compress:          dynamic(() => import('@/components/tools/ImageCompressor').then((m) => ({ default: m.ImageCompressor })), { ssr: false }),
  resize:            dynamic(() => import('@/components/tools/ImageResizer').then((m) => ({ default: m.ImageResizer })), { ssr: false }),
  crop:              dynamic(() => import('@/components/tools/ImageCropper').then((m) => ({ default: m.ImageCropper })), { ssr: false }),
  rotate:            dynamic(() => import('@/components/tools/ImageRotator').then((m) => ({ default: m.ImageRotator })), { ssr: false }),
  watermark:         dynamic(() => import('@/components/tools/WatermarkTool').then((m) => ({ default: m.WatermarkTool })), { ssr: false }),
  'color-palette':   dynamic(() => import('@/components/tools/ColorPaletteExtractor').then((m) => ({ default: m.ColorPaletteExtractor })), { ssr: false }),
  'favicon-generator':dynamic(() => import('@/components/tools/FaviconGenerator').then((m) => ({ default: m.FaviconGenerator })), { ssr: false }),
  'screenshot-beautify':dynamic(() => import('@/components/tools/ScreenshotBeautifier').then((m) => ({ default: m.ScreenshotBeautifier })), { ssr: false }),
  base64:            dynamic(() => import('@/components/tools/Base64Encoder').then((m) => ({ default: m.Base64Encoder })), { ssr: false }),
  'instagram-grid':  dynamic(() => import('@/components/tools/InstagramGridMaker').then((m) => ({ default: m.InstagramGridMaker })), { ssr: false }),
  'remove-exif':     dynamic(() => import('@/components/tools/ExifRemover').then((m) => ({ default: m.ExifRemover })), { ssr: false }),
};

function getToolComponent(slug: string): React.ComponentType<{ t?: Translations }> | null {
  return ToolComponents[slug] || null;
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

export function ToolPageClient({ locale, t, tool, relatedTools }: { locale: string; t: Translations; tool: ToolMeta; relatedTools: ToolMeta[] }) {
  const ToolComponent = getToolComponent(tool.slug);
  const category = CATEGORIES.find((c) => c.key === tool.category);
  const tt = useMemo(() => getToolTranslations(t, tool.slug), [t, tool.slug]);

  return (
    <div className="min-h-screen">
      {/* 面包屑 */}
      <nav className="mb-6 text-sm" style={{ color: 'var(--text-tertiary)' }}>
        <Link href={`/${locale}`} className="hover:underline" style={{ color: 'var(--text-link)' }}>{t.nav.home}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}`} className="hover:underline" style={{ color: 'var(--text-link)' }}>
          {category?.emoji} {category?.label} Tools
        </Link>
        <span className="mx-2">/</span>
        <span style={{ color: 'var(--text-primary)' }}>{tt.title || tool.title}</span>
      </nav>

      {/* 标题区 */}
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          {tt.title || tool.title}
        </h1>
        <p className="mt-3 text-lg max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
          {tt.longDescription || tool.longDescription}
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
            style={{ backgroundColor: 'var(--bg-badge-green)', color: 'var(--text-badge-green)' }}>{t.common.privacyBadge}</span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
            style={{ backgroundColor: 'var(--bg-badge-blue)', color: 'var(--text-badge-blue)' }}>{t.common.noUploadBadge}</span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
            style={{ backgroundColor: 'var(--bg-badge-purple)', color: 'var(--text-badge-purple)' }}>{t.common.freeBadge}</span>
          {tool.batchSupport && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
              style={{ backgroundColor: 'var(--bg-badge-orange)', color: 'var(--text-badge-orange)' }}>{t.common.batchBadge}</span>
          )}
        </div>
      </header>

      {/* 工具组件 */}
      <div className="mb-12">
        {ToolComponent ? <ToolComponent t={t} /> : (
          <div className="p-12 text-center rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-tertiary)' }}>
            <p className="text-lg font-medium">{t.toolPage.comingSoon}</p>
          </div>
        )}
      </div>

      {/* FAQ */}
      <section className="mb-12 max-w-2xl">
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>{t.toolPage.faqTitle}</h2>
        <dl className="space-y-4">
          {[t.faq.free, t.faq.upload, t.faq.formats, t.faq.batch].map((faq, i) => (
            <div key={i} className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <dt className="font-medium" style={{ color: 'var(--text-primary)' }}>{faq.q}</dt>
              <dd className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>{faq.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* 相关工具 */}
      {relatedTools.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>{t.toolPage.relatedTools}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {relatedTools.map((rt) => {
              const rtt = getToolTranslations(t, rt.slug);
              return (
              <Link key={rt.slug} href={`/${locale}/tools/${rt.slug}`}
                className="p-4 rounded-xl border transition-all hover:shadow-sm"
                style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-card)' }}>
                <p className="text-sm font-medium hover:underline" style={{ color: 'var(--text-primary)' }}>{rtt.title || rt.title}</p>
                <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{rtt.description || rt.description}</p>
              </Link>
            )})}
          </div>
        </section>
      )}

      {/* 全站工具导航 */}
      <section>
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>{t.toolPage.allImageTools}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {TOOLS.map((t2) => {
            const t2t = getToolTranslations(t, t2.slug);
            return (
            <Link key={t2.slug} href={`/${locale}/tools/${t2.slug}`}
              className="px-3 py-2 rounded-lg text-sm transition-colors"
              style={{
                backgroundColor: t2.slug === tool.slug ? 'var(--accent-light)' : 'transparent',
                color: t2.slug === tool.slug ? 'var(--text-link)' : 'var(--text-secondary)',
              }}>
              {t2t.title || t2.title}
            </Link>
          )})}
        </div>
      </section>
    </div>
  );
}
