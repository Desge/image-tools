// 格式转换矩阵 — 程序化生成 convert 页面用

export interface FormatInfo {
  id: string;
  name: string;
  extension: string;
  mimeType: string;
  description: string;
  category: 'raster' | 'vector' | 'modern' | 'legacy' | 'icon';
}

export const FORMATS: FormatInfo[] = [
  { id: 'png', name: 'PNG', extension: '.png', mimeType: 'image/png', description: 'Portable Network Graphics — lossless compression, supports transparency', category: 'raster' },
  { id: 'jpg', name: 'JPG', extension: '.jpg', mimeType: 'image/jpeg', description: 'JPEG — lossy compression, best for photos', category: 'raster' },
  { id: 'webp', name: 'WebP', extension: '.webp', mimeType: 'image/webp', description: 'Google WebP — modern format, lossy + lossless, 30% smaller than JPEG', category: 'modern' },
  { id: 'avif', name: 'AVIF', extension: '.avif', mimeType: 'image/avif', description: 'AV1 Image Format — next-gen, 50% smaller than JPEG at same quality', category: 'modern' },
  { id: 'bmp', name: 'BMP', extension: '.bmp', mimeType: 'image/bmp', description: 'Bitmap — uncompressed raster format', category: 'legacy' },
  { id: 'gif', name: 'GIF', extension: '.gif', mimeType: 'image/gif', description: 'Graphics Interchange Format — supports animation', category: 'legacy' },
  { id: 'svg', name: 'SVG', extension: '.svg', mimeType: 'image/svg+xml', description: 'Scalable Vector Graphics — XML-based, infinitely scalable', category: 'vector' },
  { id: 'ico', name: 'ICO', extension: '.ico', mimeType: 'image/x-icon', description: 'Icon format — used for favicons, supports multiple sizes', category: 'icon' },
];

// 有效的转换对（排除相同格式、排除无意义的转换）
function generateConversionPairs(): { from: FormatInfo; to: FormatInfo; slug: string }[] {
  const pairs: { from: FormatInfo; to: FormatInfo; slug: string }[] = [];

  for (const from of FORMATS) {
    for (const to of FORMATS) {
      if (from.id === to.id) continue;
      // 跳过矢量→矢量和图标→图标（通常不太被搜索）
      if (from.category === 'vector' && to.category === 'vector') continue;
      if (from.category === 'icon' && to.category === 'icon') continue;

      pairs.push({ from, to, slug: `${from.id}-to-${to.id}` });
    }
  }

  return pairs;
}

export const CONVERSION_PAIRS = generateConversionPairs();

// 社交媒体尺寸预设
export const SIZE_PRESETS = [
  { label: 'Instagram Post (Square)', width: 1080, height: 1080, slug: 'instagram-post' },
  { label: 'Instagram Portrait', width: 1080, height: 1350, slug: 'instagram-portrait' },
  { label: 'Instagram Story', width: 1080, height: 1920, slug: 'instagram-story' },
  { label: 'Facebook Post', width: 1200, height: 630, slug: 'facebook-post' },
  { label: 'Facebook Cover', width: 851, height: 315, slug: 'facebook-cover' },
  { label: 'Twitter/X Post', width: 1200, height: 675, slug: 'twitter-post' },
  { label: 'Twitter/X Header', width: 1500, height: 500, slug: 'twitter-header' },
  { label: 'LinkedIn Post', width: 1200, height: 627, slug: 'linkedin-post' },
  { label: 'LinkedIn Banner', width: 1584, height: 396, slug: 'linkedin-banner' },
  { label: 'YouTube Thumbnail', width: 1280, height: 720, slug: 'youtube-thumbnail' },
  { label: 'YouTube Banner', width: 2560, height: 1440, slug: 'youtube-banner' },
  { label: 'Pinterest Pin', width: 1000, height: 1500, slug: 'pinterest-pin' },
  { label: 'TikTok Video', width: 1080, height: 1920, slug: 'tiktok-video' },
  { label: 'Etsy Listing', width: 2000, height: 2000, slug: 'etsy-listing' },
  { label: 'Etsy Banner', width: 3360, height: 840, slug: 'etsy-banner' },
  { label: 'Snapchat', width: 1080, height: 1920, slug: 'snapchat' },
  { label: 'WhatsApp Status', width: 1080, height: 1920, slug: 'whatsapp-status' },
  { label: 'Discord Emoji', width: 128, height: 128, slug: 'discord-emoji' },
  { label: 'Twitch Banner', width: 1200, height: 480, slug: 'twitch-banner' },
  { label: 'Email Header', width: 600, height: 200, slug: 'email-header' },
];

// 压缩到指定大小的预设
export const COMPRESS_TARGETS = [
  { label: 'Compress to 10KB', sizeKB: 10, slug: 'compress-to-10kb', description: 'For extreme size limits like email signatures' },
  { label: 'Compress to 20KB', sizeKB: 20, slug: 'compress-to-20kb', description: 'For passport photos and KYC documents' },
  { label: 'Compress to 50KB', sizeKB: 50, slug: 'compress-to-50kb', description: 'For profile pictures and avatars' },
  { label: 'Compress to 100KB', sizeKB: 100, slug: 'compress-to-100kb', description: 'For web forms and applications' },
  { label: 'Compress to 200KB', sizeKB: 200, slug: 'compress-to-200kb', description: 'For resume and document uploads' },
  { label: 'Compress to 500KB', sizeKB: 500, slug: 'compress-to-500kb', description: 'For email attachments' },
  { label: 'Compress to 1MB', sizeKB: 1000, slug: 'compress-to-1mb', description: 'For web uploads with size caps' },
];
