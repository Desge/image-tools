'use client';

import dynamic from 'next/dynamic';

const LanguageSwitcher = dynamic(() => import('@/components/ui/LanguageSwitcher').then((m) => ({ default: m.LanguageSwitcher })), { ssr: false });
const ThemeToggle = dynamic(() => import('@/components/ui/ThemeToggle').then((m) => ({ default: m.ThemeToggle })), { ssr: false });

// 将客户端组件（LanguageSwitcher + ThemeToggle）与 Server Component 布局解耦
export function LocaleLayoutClient({ locale }: { locale: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <LanguageSwitcher />
      <ThemeToggle />
    </div>
  );
}
