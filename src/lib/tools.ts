// ═══════════════════════════════════════════
// 工具注册表 — 项目的唯一配置中心
// 添加新工具：在此文件 TOOLS 数组中新增一个对象
// 然后在 src/components/tools/ 下创建对应组件
// ═══════════════════════════════════════════

import type { ToolMeta } from './types';

export const TOOLS: ToolMeta[] = [
  {
    slug: 'compress',
    title: 'Image Compressor',
    description: 'Compress JPG, PNG, WebP images online. Reduce file size while keeping quality. 100% browser-side, zero upload.',
    longDescription:
      'Compress your images without losing quality. Adjust the compression level in real-time and see the result before downloading. All processing happens in your browser — your images never leave your device.',
    keywords: ['compress image online', 'image compressor', 'compress jpg', 'compress png', 'reduce image size', 'optimize images for web'],
    category: 'compress',
    inputFormats: ['JPG', 'PNG', 'WebP', 'AVIF', 'BMP'],
    outputFormats: ['JPG', 'PNG', 'WebP'],
    batchSupport: true,
  },
  {
    slug: 'resize',
    title: 'Image Resizer',
    description: 'Resize images online to exact dimensions. Social media presets for Instagram, YouTube, Twitter. No upload needed.',
    longDescription:
      'Resize your images to exact pixel dimensions. Choose from social media presets or enter custom width and height. Lock aspect ratio to prevent distortion.',
    keywords: ['resize image online', 'image resizer', 'resize photo', 'instagram image size', 'youtube thumbnail size'],
    category: 'edit',
    inputFormats: ['JPG', 'PNG', 'WebP', 'AVIF', 'BMP'],
    outputFormats: ['JPG', 'PNG', 'WebP'],
    batchSupport: true,
  },
  {
    slug: 'crop',
    title: 'Image Cropper',
    description: 'Crop images online with aspect ratio presets. Circle crop, square crop, 16:9, 4:3 and more. Free & private.',
    longDescription:
      'Crop your images with precision. Drag the selection handles or choose from preset aspect ratios. Preview in real-time before downloading.',
    keywords: ['crop image online', 'image cropper', 'crop photo', 'circle crop', 'square crop', 'image crop tool'],
    category: 'edit',
    inputFormats: ['JPG', 'PNG', 'WebP', 'AVIF', 'BMP'],
    outputFormats: ['JPG', 'PNG', 'WebP'],
    batchSupport: false,
  },
  {
    slug: 'rotate',
    title: 'Rotate & Flip Image',
    description: 'Rotate images 90°, 180°, 270° or flip horizontally/vertically. Free online tool, no upload required.',
    longDescription:
      'Rotate your images by any angle or flip them horizontally/vertically. All processing is lossless where possible — your image quality stays intact.',
    keywords: ['rotate image online', 'flip image', 'rotate photo', 'mirror image', 'image rotation tool'],
    category: 'edit',
    inputFormats: ['JPG', 'PNG', 'WebP', 'AVIF', 'BMP'],
    outputFormats: ['JPG', 'PNG', 'WebP'],
    batchSupport: false,
  },
  {
    slug: 'watermark',
    title: 'Add Watermark to Image',
    description: 'Add text or logo watermark to images online. Adjustable opacity, position, and tiling. Batch support. 100% private.',
    longDescription:
      'Protect your images with custom watermarks. Add text or upload a logo. Control opacity, position, rotation, and tiling. Process multiple images at once.',
    keywords: ['add watermark to image', 'watermark image online', 'copyright watermark', 'batch watermark', 'photo watermark'],
    category: 'edit',
    inputFormats: ['JPG', 'PNG', 'WebP', 'AVIF', 'BMP'],
    outputFormats: ['JPG', 'PNG', 'WebP'],
    batchSupport: true,
  },
  {
    slug: 'color-palette',
    title: 'Color Palette Extractor',
    description: 'Extract dominant colors from any image. Get HEX, RGB codes. Download palette as PNG or JSON. Free online tool.',
    longDescription:
      'Upload an image and instantly extract its dominant color palette. Get exact HEX and RGB values. Perfect for designers and developers who need color inspiration.',
    keywords: ['color palette from image', 'extract colors from image', 'image color picker', 'color palette generator', 'dominant colors'],
    category: 'generate',
    inputFormats: ['JPG', 'PNG', 'WebP', 'AVIF', 'BMP'],
    outputFormats: ['PNG', 'JSON'],
    batchSupport: false,
  },
  {
    slug: 'favicon-generator',
    title: 'Favicon Generator',
    description: 'Generate favicons from any image. Get all sizes (16x16 to 512x512), ICO file, and HTML code. Free & browser-side.',
    longDescription:
      'Convert any image into a complete favicon package. Generates all standard sizes, a multi-resolution ICO file, and ready-to-use HTML link tags. Perfect for web developers.',
    keywords: ['favicon generator', 'favicon maker', 'ico converter', 'website icon generator', 'png to ico'],
    category: 'generate',
    inputFormats: ['JPG', 'PNG', 'WebP', 'SVG'],
    outputFormats: ['ICO', 'PNG', 'ZIP'],
    batchSupport: false,
  },
  {
    slug: 'screenshot-beautify',
    title: 'Screenshot Beautifier',
    description: 'Make screenshots look professional. Add background gradients, shadows, rounded corners, and device frames. Free online.',
    longDescription:
      'Transform plain screenshots into polished marketing images. Add gradient backgrounds, subtle shadows, rounded corners, and padding. Perfect for SaaS landing pages, app store screenshots, and social media posts.',
    keywords: ['screenshot beautifier', 'screenshot mockup', 'beautify screenshot', 'screenshot editor', 'app screenshot design'],
    category: 'edit',
    inputFormats: ['JPG', 'PNG', 'WebP'],
    outputFormats: ['PNG', 'JPG', 'WebP'],
    batchSupport: false,
  },
  {
    slug: 'base64',
    title: 'Image to Base64',
    description: 'Convert images to Base64 data URIs for embedding in HTML/CSS. See size overhead. Free online, no upload.',
    longDescription:
      'Convert any image to a Base64 data URI for inline embedding in HTML, CSS, or JavaScript. Get the data URI, file size comparison, and ready-to-use code snippets.',
    keywords: ['image to base64', 'base64 encoder', 'data uri generator', 'encode image to base64', 'base64 image converter'],
    category: 'convert',
    inputFormats: ['JPG', 'PNG', 'WebP', 'AVIF', 'GIF', 'SVG', 'BMP'],
    outputFormats: ['TEXT'],
    batchSupport: true,
  },
  {
    slug: 'instagram-grid',
    title: 'Instagram Grid Maker',
    description: 'Split photos into Instagram puzzle grids. 3×3, 3×2, 3×1 layouts. Create stunning Instagram feeds. Free & private.',
    longDescription:
      'Split a single image into an Instagram puzzle grid. Choose 3×3 (9 posts), 3×2 (6 posts), or 3×1 (3 posts) layouts. Each tile downloads individually, ready to post in sequence for a seamless profile feed.',
    keywords: ['instagram grid maker', 'instagram puzzle', 'split image for instagram', 'instagram grid splitter', 'instagram carousel maker'],
    category: 'edit',
    inputFormats: ['JPG', 'PNG', 'WebP'],
    outputFormats: ['JPG', 'PNG'],
    batchSupport: false,
  },
  {
    slug: 'remove-exif',
    title: 'Remove EXIF Data',
    description: 'Strip location, camera, and timestamp metadata from images. Protect your privacy. Free online, no upload.',
    longDescription:
      'Remove all EXIF metadata from your images — GPS location, camera model, timestamp, and more. Protect your privacy before sharing photos online. One click, instant results.',
    keywords: ['remove exif data', 'remove metadata from image', 'strip exif', 'photo privacy', 'remove location from photo'],
    category: 'utility',
    inputFormats: ['JPG', 'PNG', 'WebP', 'HEIC'],
    outputFormats: ['JPG', 'PNG', 'WebP'],
    batchSupport: true,
  },
];

// 按分类获取工具
export function getToolsByCategory(category: ToolMeta['category']): ToolMeta[] {
  return TOOLS.filter((t) => t.category === category);
}

// 所有分类
export const CATEGORIES = [
  { key: 'edit' as const, label: 'Edit', emoji: '✂️' },
  { key: 'convert' as const, label: 'Convert', emoji: '🔄' },
  { key: 'compress' as const, label: 'Compress', emoji: '📦' },
  { key: 'generate' as const, label: 'Generate', emoji: '✨' },
  { key: 'utility' as const, label: 'Utility', emoji: '🔧' },
];
