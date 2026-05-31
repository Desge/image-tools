'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import type { FormatInfo } from '@/data/formats';
import { FORMATS } from '@/data/formats';
import type { Translations } from '@/i18n';

const ImageConverter = dynamic(() => import('@/components/tools/ImageConverter').then((m) => ({ default: m.ImageConverter })), { ssr: false });

interface Props {
  t: Translations;
  locale: string;
  from: FormatInfo;
  to: FormatInfo;
  allPairs: { from: FormatInfo; to: FormatInfo; slug: string }[];
}

export function ConverterPageClient({ t, locale, from, to, allPairs }: Props) {
  const relatedPairs = allPairs.filter((p) => (p.from.id === from.id || p.to.id === to.id) && p.slug !== `${from.id}-to-${to.id}`).slice(0, 8);

  return (
    <div className="min-h-screen">
      <nav className="mb-6 text-sm" style={{ color: 'var(--text-tertiary)' }}>
        <Link href={`/${locale}`} className="hover:underline" style={{ color: 'var(--text-link)' }}>{t.nav.home}</Link>
        <span className="mx-2">/</span>
        <span style={{ color: 'var(--text-primary)' }}>{from.name} → {to.name}</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          {from.name} {t.converter.title} {to.name} Converter
        </h1>
        <p className="mt-3 text-lg max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
          {t.converter.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="px-2.5 py-1 rounded-full text-xs font-medium"
            style={{ backgroundColor: 'var(--bg-badge-green)', color: 'var(--text-badge-green)' }}>🔒 100% Private</span>
          <span className="px-2.5 py-1 rounded-full text-xs font-medium"
            style={{ backgroundColor: 'var(--bg-badge-blue)', color: 'var(--text-badge-blue)' }}>⚡ No Upload</span>
        </div>
      </header>

      <div className="mb-12"><ImageConverter fromFormat={from.id} toFormat={to.id} t={t} /></div>

      <section className="mb-12 max-w-2xl">
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          {t.converter.aboutTitle} {from.name} and {to.name}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>{from.name}</h3>
            <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>{from.description}</p>
          </div>
          <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>{to.name}</h3>
            <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>{to.description}</p>
          </div>
        </div>
      </section>

      {relatedPairs.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>{t.converter.relatedConversions}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {relatedPairs.map((p) => (
              <Link key={p.slug} href={`/${locale}/convert/${p.slug}`}
                className="px-3 py-2 rounded-lg text-sm border transition-colors hover:underline"
                style={{ borderColor: 'var(--border-primary)', color: 'var(--text-secondary)' }}>
                {p.from.name} → {p.to.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>{t.converter.allFormats}</h2>
        <div className="flex flex-wrap gap-2">
          {FORMATS.map((f) => (
            <Link
              key={f.id}
              href={f.id === from.id ? '#' : `/${locale}/convert/${from.id}-to-${f.id}`}
              className="px-3 py-1.5 rounded-full text-sm border transition-colors"
              style={{
                borderColor: f.id === from.id ? 'var(--accent)' : 'var(--border-primary)',
                backgroundColor: f.id === from.id ? 'var(--accent-light)' : 'transparent',
                color: f.id === from.id ? 'var(--text-link)' : 'var(--text-secondary)',
              }}>
              {f.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
