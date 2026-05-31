'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import type { Translations } from '@/i18n';

const LanguageSwitcher = dynamic(() => import('@/components/ui/LanguageSwitcher').then((m) => ({ default: m.LanguageSwitcher })), { ssr: false });
const ThemeToggle = dynamic(() => import('@/components/ui/ThemeToggle').then((m) => ({ default: m.ThemeToggle })), { ssr: false });

interface LocaleHeaderProps {
  locale: string;
  t: Translations;
}

export function LocaleHeader({ locale, t }: LocaleHeaderProps) {
  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur-md"
      style={{ borderColor: 'var(--border-primary)', backgroundColor: 'color-mix(in srgb, var(--bg-primary) 80%, transparent)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 font-bold text-lg no-underline"
          style={{ color: 'var(--text-primary)' }}
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t.common.siteName}
        </Link>
        <nav className="flex items-center gap-3">
          <Link href={`/${locale}/tools/compress`} className="text-sm hidden sm:inline hover:underline"
            style={{ color: 'var(--text-secondary)' }}>{t.nav.compress}</Link>
          <Link href={`/${locale}/tools/resize`} className="text-sm hidden sm:inline hover:underline"
            style={{ color: 'var(--text-secondary)' }}>{t.nav.resize}</Link>
          <Link href={`/${locale}/convert/png-to-jpg`} className="text-sm hidden sm:inline hover:underline"
            style={{ color: 'var(--text-secondary)' }}>{t.nav.convert}</Link>
          <div className="flex items-center gap-1.5">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
