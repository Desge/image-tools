// ═══════════════════════════════════════════
// i18n — 翻译加载工具
// ═══════════════════════════════════════════
import type { Translations } from './types';

// 翻译缓存
const cache: Record<string, Translations> = {};

export async function loadTranslations(locale: string): Promise<Translations> {
  if (cache[locale]) return cache[locale];

  try {
    const mod = await import(`./translations/${locale}`);
    cache[locale] = mod.default;
    return cache[locale];
  } catch {
    const en = await import('./translations/en');
    cache[locale] = en.default;
    return en.default;
  }
}

export function getCachedTranslations(locale: string): Translations | null {
  return cache[locale] || null;
}
