'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TOOLS } from '@/lib/tools';

// ─────────────────────────────────────────────────────
//  多语言 404 文案 — 完全自包含，不依赖服务端翻译系统
// ─────────────────────────────────────────────────────
interface NotFoundText {
  title: string;
  subtitle: string;
  description: string;
  goHome: string;
  recommended: string;
}

const T: Record<string, NotFoundText> = {
  en: {
    title: '404',
    subtitle: 'Page Not Found',
    description: "Oops! The page you're looking for doesn't exist or has been moved.",
    goHome: '← Back to Home',
    recommended: 'Try these popular tools:',
  },
  zh: {
    title: '404',
    subtitle: '页面未找到',
    description: '哎呀！您要找的页面不存在或已被移动。',
    goHome: '← 返回首页',
    recommended: '试试这些热门工具：',
  },
  es: {
    title: '404',
    subtitle: 'Página no encontrada',
    description: '¡Vaya! La página que buscas no existe o ha sido movida.',
    goHome: '← Volver al inicio',
    recommended: 'Prueba estas herramientas populares:',
  },
  ja: {
    title: '404',
    subtitle: 'ページが見つかりません',
    description: 'おっと！お探しのページは存在しないか、移動されました。',
    goHome: '← ホームに戻る',
    recommended: '人気のツールをお試しください：',
  },
  fr: {
    title: '404',
    subtitle: 'Page non trouvée',
    description: 'Oups ! La page que vous recherchez n\'existe pas ou a été déplacée.',
    goHome: '← Retour à l\'accueil',
    recommended: 'Essayez ces outils populaires :',
  },
  de: {
    title: '404',
    subtitle: 'Seite nicht gefunden',
    description: 'Hoppla! Die gesuchte Seite existiert nicht oder wurde verschoben.',
    goHome: '← Zurück zur Startseite',
    recommended: 'Probieren Sie diese beliebten Tools:',
  },
  pt: {
    title: '404',
    subtitle: 'Página não encontrada',
    description: 'Ops! A página que você procura não existe ou foi movida.',
    goHome: '← Voltar ao início',
    recommended: 'Experimente estas ferramentas populares:',
  },
  ko: {
    title: '404',
    subtitle: '페이지를 찾을 수 없습니다',
    description: '이런! 찾으시는 페이지가 존재하지 않거나 이동되었습니다.',
    goHome: '← 홈으로 돌아가기',
    recommended: '인기 도구를 사용해보세요:',
  },
  ru: {
    title: '404',
    subtitle: 'Страница не найдена',
    description: 'Упс! Страница, которую вы ищете, не существует или была перемещена.',
    goHome: '← На главную',
    recommended: 'Попробуйте эти популярные инструменты:',
  },
  ar: {
    title: '404',
    subtitle: 'الصفحة غير موجودة',
    description: 'عذراً! الصفحة التي تبحث عنها غير موجودة أو تم نقلها.',
    goHome: '← العودة إلى الصفحة الرئيسية',
    recommended: 'جرب هذه الأدوات الشائعة:',
  },
  hi: {
    title: '404',
    subtitle: 'पृष्ठ नहीं मिला',
    description: 'ओह! आप जिस पृष्ठ की तलाश कर रहे हैं वह मौजूद नहीं है या स्थानांतरित हो गया है।',
    goHome: '← होम पेज पर वापस जाएँ',
    recommended: 'इन लोकप्रिय टूल्स को आज़माएँ:',
  },
  it: {
    title: '404',
    subtitle: 'Pagina non trovata',
    description: 'Ops! La pagina che stai cercando non esiste o è stata spostata.',
    goHome: '← Torna alla home',
    recommended: 'Prova questi strumenti popolari:',
  },
};

// ─────────────────────────────────────────────────────
// 支持的语言代码列表
// ─────────────────────────────────────────────────────
const SUPPORTED_LOCALES = [
  'en', 'zh', 'es', 'ja', 'fr', 'de',
  'pt', 'ko', 'ru', 'ar', 'hi', 'it',
];

// ─────────────────────────────────────────────────────
// 精选推荐工具（slug → title，用于 404 页面展示）
// ─────────────────────────────────────────────────────
const RECOMMENDED_SLUGS = [
  'compress',
  'resize',
  'crop',
  'watermark',
  'color-palette',
  'remove-exif',
];

export default function LocaleNotFound() {
  // ----- 在客户端确定当前 locale -----
  const [locale, setLocale] = useState('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const pathLocale = window.location.pathname.split('/')[1];
    setLocale(SUPPORTED_LOCALES.includes(pathLocale) ? pathLocale : 'en');
    setMounted(true);
  }, []);

  const t = T[locale] ?? T.en;

  // 从 TOOLS 注册表中选出推荐工具
  const recommended = RECOMMENDED_SLUGS
    .map((slug) => TOOLS.find((tool) => tool.slug === slug))
    .filter(Boolean);

  return (
    <div
      className="flex flex-col items-center justify-center text-center px-4 py-16"
      style={{ color: 'var(--text-primary)' }}
    >
      {/* ---------- 大号 404 图标 ---------- */}
      <div className="text-7xl sm:text-8xl mb-2 select-none" aria-hidden="true">
        🔍
      </div>

      {/* ---------- 404 标题 ---------- */}
      <h1 className="text-6xl sm:text-7xl font-extrabold tracking-tight leading-none mb-2"
        style={{ color: 'var(--accent)' }}>
        {t.title}
      </h1>
      <h2 className="text-2xl sm:text-3xl font-bold mb-4">
        {t.subtitle}
      </h2>

      {/* ---------- 描述文字 ---------- */}
      <p
        className="text-base sm:text-lg max-w-md mb-10"
        style={{ color: 'var(--text-secondary)' }}
      >
        {t.description}
      </p>

      {/* ---------- 返回首页按钮 ---------- */}
      <Link
        href={`/${locale}`}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-base transition-all duration-200 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        style={{
          backgroundColor: 'var(--accent)',
          color: '#ffffff',
        }}
      >
        {t.goHome}
      </Link>

      {/* ---------- 推荐工具 ---------- */}
      {mounted && recommended.length > 0 && (
        <div className="mt-16 w-full max-w-2xl">
          <h3
            className="text-sm font-semibold uppercase tracking-wider mb-5"
            style={{ color: 'var(--text-tertiary)' }}
          >
            {t.recommended}
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {recommended.map((tool) =>
              tool ? (
                <Link
                  key={tool.slug}
                  href={`/${locale}/tools/${tool.slug}`}
                  className="flex items-center justify-center p-3.5 rounded-xl border text-sm font-medium transition-all duration-150 hover:scale-[1.03]"
                  style={{
                    borderColor: 'var(--border-primary)',
                    color: 'var(--text-secondary)',
                    backgroundColor: 'var(--bg-secondary)',
                  }}
                >
                  {tool.title}
                </Link>
              ) : null,
            )}
          </div>
        </div>
      )}

      {/* ---------- 未挂载前占位，避免布局偏移 ---------- */}
      {!mounted && <div className="mt-16 h-32" />}
    </div>
  );
}
