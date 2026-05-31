// 工具注册类型 — 添加新工具只需在此注册一个对象

export interface ToolMeta {
  /** 工具标识符，决定 URL 路径（/tools/xxx） */
  slug: string;
  /** 工具标题，同时作为页面 H1 和 title tag */
  title: string;
  /** 简短描述，用于工具卡片和 meta description */
  description: string;
  /** 长描述，用于工具页面上方的说明文字 */
  longDescription: string;
  /** 核心关键词（英文），用于 meta keywords 和索引 */
  keywords: string[];
  /** 工具类别 */
  category: 'compress' | 'convert' | 'edit' | 'generate' | 'utility';
  /** 支持的输入格式 */
  inputFormats: string[];
  /** 支持的输出格式 */
  outputFormats: string[];
  /** 是否支持批量处理 */
  batchSupport: boolean;
}

// 格式转换对 — 用于程序化生成 convert 页面
export interface ConversionPair {
  from: string;
  to: string;
  slug: string; // "png-to-jpg"
  title: string; // "PNG to JPG Converter"
  description: string;
}

// 社交媒体尺寸预设
export interface SizePreset {
  label: string;
  width: number;
  height: number;
  slug: string;
  description: string;
}
