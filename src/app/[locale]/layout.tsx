import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LOCALES, getLocaleInfo, localeCodes, loadTranslations } from '@/i18n';
import { ThemeProvider } from '@/context/ThemeContext';
import { LocaleHeader } from '@/components/ui/LocaleHeader';
import { LocaleInit } from '@/components/ui/LocaleInit';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await loadTranslations(locale);
  return {
    title: t.common.seoTitleSuffix,
    description: t.common.seoDescription,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://image.toolconv.com'}/${locale}`,
      languages: {
        'x-default': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://image.toolconv.com'}/en/`,
        ...Object.fromEntries(LOCALES.map((l) => [l.code, `${process.env.NEXT_PUBLIC_SITE_URL || 'https://image.toolconv.com'}/${l.code}/`])),
      },
    },
    openGraph: { locale, siteName: t.common.siteName },
    twitter: { card: 'summary_large_image' },
  };
}

export function generateStaticParams() {
  return localeCodes().map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!localeCodes().includes(locale)) notFound();

  const info = getLocaleInfo(locale);
  const t = await loadTranslations(locale);

  return (
    <html lang={locale} className="scroll-smooth">
      <body className="font-sans antialiased">
        <LocaleInit locale={locale} dir={info.dir} />
        <ThemeProvider>
          <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
            <LocaleHeader locale={locale} t={t} />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">{children}</main>
            <footer className="mt-16 pt-8 pb-8 border-t"
              style={{ borderColor: 'var(--border-primary)', color: 'var(--text-tertiary)' }}>
              {/* Cross-site links */}
              <div className="mb-4 flex flex-wrap items-center justify-center gap-3 text-sm">
                <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>Also try:</span>
                <a href="https://pdf.toolconv.com" style={{ color: 'var(--text-link)' }} className="font-medium hover:underline">📄 PDF Tools</a>
                <a href="https://unit.toolconv.com" style={{ color: 'var(--text-link)' }} className="font-medium hover:underline">🔄 Unit Converter</a>
              </div>
              <p>{t.home.footerText}</p>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
