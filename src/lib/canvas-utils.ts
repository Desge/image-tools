// Canvas API 工具封装 — 所有图片处理的基础库

export type ImageFormat = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/avif' | 'image/bmp';

/** 文件转 Image 对象 */
export function fileToImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/** 文件转 Data URL */
export function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/** 将 Canvas 导出为 Blob */
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: ImageFormat = 'image/png',
  quality = 0.92
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas export failed'));
      },
      format,
      quality
    );
  });
}

/** 绘制图片到 Canvas（自动适配尺寸） */
export function drawImageToCanvas(
  img: HTMLImageElement,
  width?: number,
  height?: number
): HTMLCanvasElement {
  const w = width ?? img.naturalWidth;
  const h = height ?? img.naturalHeight;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0, w, h);
  return canvas;
}

/** 压缩图片 */
export async function compressImage(
  file: File,
  quality: number,
  outputFormat: ImageFormat = 'image/jpeg',
  maxWidth?: number
): Promise<{ blob: Blob; canvas: HTMLCanvasElement }> {
  const img = await fileToImage(file);
  let w = img.naturalWidth;
  let h = img.naturalHeight;

  if (maxWidth && w > maxWidth) {
    const ratio = maxWidth / w;
    w = maxWidth;
    h = Math.round(h * ratio);
  }

  const canvas = drawImageToCanvas(img, w, h);
  const blob = await canvasToBlob(canvas, outputFormat, quality);
  return { blob, canvas };
}

/** 缩放图片 */
export async function resizeImage(
  file: File,
  targetWidth: number,
  targetHeight: number,
  maintainAspect = true,
  outputFormat: ImageFormat = 'image/png'
): Promise<{ blob: Blob; canvas: HTMLCanvasElement }> {
  const img = await fileToImage(file);
  let w = targetWidth;
  let h = targetHeight;

  if (maintainAspect) {
    const ratio = Math.min(targetWidth / img.naturalWidth, targetHeight / img.naturalHeight);
    w = Math.round(img.naturalWidth * ratio);
    h = Math.round(img.naturalHeight * ratio);
  }

  const canvas = drawImageToCanvas(img, w, h);
  const blob = await canvasToBlob(canvas, outputFormat);
  return { blob, canvas };
}

/** 裁剪图片 */
export async function cropImage(
  file: File,
  sx: number,
  sy: number,
  sw: number,
  sh: number,
  outputFormat: ImageFormat = 'image/png'
): Promise<{ blob: Blob; canvas: HTMLCanvasElement }> {
  const img = await fileToImage(file);
  const canvas = document.createElement('canvas');
  canvas.width = sw;
  canvas.height = sh;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
  const blob = await canvasToBlob(canvas, outputFormat);
  return { blob, canvas };
}

/** 旋转图片（90度倍数，无损） */
export async function rotateImage(
  file: File,
  angle: 90 | 180 | 270,
  outputFormat: ImageFormat = 'image/png'
): Promise<{ blob: Blob; canvas: HTMLCanvasElement }> {
  const img = await fileToImage(file);
  const swap = angle === 90 || angle === 270;
  const canvas = document.createElement('canvas');
  canvas.width = swap ? img.naturalHeight : img.naturalWidth;
  canvas.height = swap ? img.naturalWidth : img.naturalHeight;
  const ctx = canvas.getContext('2d')!;

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((angle * Math.PI) / 180);
  ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);

  const blob = await canvasToBlob(canvas, outputFormat);
  return { blob, canvas };
}

/** 翻转图片 */
export async function flipImage(
  file: File,
  direction: 'horizontal' | 'vertical',
  outputFormat: ImageFormat = 'image/png'
): Promise<{ blob: Blob; canvas: HTMLCanvasElement }> {
  const img = await fileToImage(file);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d')!;

  if (direction === 'horizontal') {
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
  } else {
    ctx.translate(0, canvas.height);
    ctx.scale(1, -1);
  }
  ctx.drawImage(img, 0, 0);

  const blob = await canvasToBlob(canvas, outputFormat);
  return { blob, canvas };
}

/** 提取颜色调色板（中位切分法） */
export function extractPalette(
  img: HTMLImageElement,
  colors = 6
): { hex: string; rgb: [number, number, number] }[] {
  const canvas = drawImageToCanvas(img, 100, 100); // 缩小以加速
  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  // 简化版：采样像素的 R、G、B 各维度做聚类
  const pixels: [number, number, number][] = [];
  for (let i = 0; i < imageData.length; i += 16) {
    pixels.push([imageData[i], imageData[i + 1], imageData[i + 2]]);
  }

  // 中位切分简化实现
  const buckets = medianCut(pixels, colors);
  return buckets.map((bucket) => {
    const avg = averageColor(bucket);
    return {
      hex: rgbToHex(avg),
      rgb: avg,
    };
  });
}

function medianCut(pixels: [number, number, number][], depth: number): [number, number, number][][] {
  if (depth === 0 || pixels.length === 0) return [pixels];

  // 找到范围最大的通道
  let rMin = 255, rMax = 0, gMin = 255, gMax = 0, bMin = 255, bMax = 0;
  for (const [r, g, b] of pixels) {
    if (r < rMin) rMin = r; if (r > rMax) rMax = r;
    if (g < gMin) gMin = g; if (g > gMax) gMax = g;
    if (b < bMin) bMin = b; if (b > bMax) bMax = b;
  }
  const rRange = rMax - rMin;
  const gRange = gMax - gMin;
  const bRange = bMax - bMin;

  let sortKey: 0 | 1 | 2 = 0;
  if (gRange >= rRange && gRange >= bRange) sortKey = 1;
  else if (bRange >= rRange && bRange >= gRange) sortKey = 2;

  pixels.sort((a, b) => a[sortKey] - b[sortKey]);
  const mid = Math.floor(pixels.length / 2);

  return [
    ...medianCut(pixels.slice(0, mid), depth - 1),
    ...medianCut(pixels.slice(mid), depth - 1),
  ];
}

function averageColor(pixels: [number, number, number][]): [number, number, number] {
  if (pixels.length === 0) return [0, 0, 0];
  let r = 0, g = 0, b = 0;
  for (const [pr, pg, pb] of pixels) {
    r += pr; g += pg; b += pb;
  }
  return [Math.round(r / pixels.length), Math.round(g / pixels.length), Math.round(b / pixels.length)];
}

function rgbToHex([r, g, b]: [number, number, number]): string {
  return '#' + [r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('');
}

/** 格式化文件大小 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

/** 根据 MIME type 获取文件扩展名 */
export function getExtension(format: ImageFormat): string {
  switch (format) {
    case 'image/jpeg': return '.jpg';
    case 'image/png': return '.png';
    case 'image/webp': return '.webp';
    case 'image/avif': return '.avif';
    case 'image/bmp': return '.bmp';
  }
}

/** 下载 Blob 到本地 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
