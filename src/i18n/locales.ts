// ═══════════════════════════════════════════
// 支持的语言列表
// ═══════════════════════════════════════════

export interface LocaleInfo {
  code: string;       // ISO 639-1
  name: string;       // 本地名称
  nameEn: string;     // 英文名称
  dir: 'ltr' | 'rtl'; // 文本方向
  flag: string;       // emoji 旗帜
}

export const LOCALES: LocaleInfo[] = [
  { code: 'en', name: 'English',    nameEn: 'English',    dir: 'ltr', flag: '🇺🇸' },
  { code: 'zh', name: '中文',        nameEn: 'Chinese',    dir: 'ltr', flag: '🇨🇳' },
  { code: 'es', name: 'Español',    nameEn: 'Spanish',    dir: 'ltr', flag: '🇪🇸' },
  { code: 'ja', name: '日本語',      nameEn: 'Japanese',   dir: 'ltr', flag: '🇯🇵' },
  { code: 'fr', name: 'Français',   nameEn: 'French',     dir: 'ltr', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch',    nameEn: 'German',     dir: 'ltr', flag: '🇩🇪' },
  { code: 'pt', name: 'Português',  nameEn: 'Portuguese', dir: 'ltr', flag: '🇧🇷' },
  { code: 'ko', name: '한국어',      nameEn: 'Korean',     dir: 'ltr', flag: '🇰🇷' },
  { code: 'ru', name: 'Русский',    nameEn: 'Russian',    dir: 'ltr', flag: '🇷🇺' },
  { code: 'ar', name: 'العربية',     nameEn: 'Arabic',     dir: 'rtl', flag: '🇸🇦' },
  { code: 'hi', name: 'हिन्दी',       nameEn: 'Hindi',      dir: 'ltr', flag: '🇮🇳' },
  { code: 'it', name: 'Italiano',   nameEn: 'Italian',    dir: 'ltr', flag: '🇮🇹' },
];

export const DEFAULT_LOCALE = 'en';

export function getLocaleInfo(code: string): LocaleInfo {
  return LOCALES.find((l) => l.code === code) || LOCALES[0];
}

export function localeCodes(): string[] {
  return LOCALES.map((l) => l.code);
}
