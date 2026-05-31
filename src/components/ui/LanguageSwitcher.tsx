'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { LOCALES, DEFAULT_LOCALE } from '@/i18n';

export function LanguageSwitcher() {
  const params = useParams<{ locale: string }>();
  const router = useRouter();
  const currentLocale = params?.locale || DEFAULT_LOCALE;
  const currentInfo = LOCALES.find((l) => l.code === currentLocale) || LOCALES[0];
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const switchTo = (code: string) => {
    const path = window.location.pathname.replace(`/${currentLocale}`, `/${code}`);
    router.push(path);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm border transition-colors"
        style={{ borderColor: 'var(--border-primary)', color: 'var(--text-secondary)' }}
        aria-label="Switch language"
      >
        <span>{currentInfo.flag}</span>
        <span className="hidden sm:inline">{currentInfo.code.toUpperCase()}</span>
        <svg className="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1 w-44 max-h-72 overflow-y-auto rounded-xl shadow-lg border py-1 z-50"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}
        >
          {LOCALES.map((loc) => (
            <button
              key={loc.code}
              onClick={() => switchTo(loc.code)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${loc.code === currentLocale ? 'font-semibold' : ''}`}
              style={{
                backgroundColor: loc.code === currentLocale ? 'var(--accent-light)' : 'transparent',
                color: 'var(--text-primary)',
              }}
            >
              <span>{loc.flag}</span>
              <span>{loc.name}</span>
              {loc.dir === 'rtl' && <span className="text-xs opacity-50 ml-auto">RTL</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
