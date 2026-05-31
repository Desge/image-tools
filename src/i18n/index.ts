// ═══════════════════════════════════════════
// i18n — 对外统一导出
// ═══════════════════════════════════════════
export type { Translations } from './types';
export { LOCALES, DEFAULT_LOCALE, getLocaleInfo, localeCodes } from './locales';
export type { LocaleInfo } from './locales';
export { loadTranslations, getCachedTranslations } from './loader';
