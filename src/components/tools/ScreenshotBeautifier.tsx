'use client';

import { useState, useCallback, useRef } from 'react';
import { FileDropzone } from '@/components/ui/FileDropzone';
import { DownloadButton } from '@/components/ui/DownloadButton';
import { formatFileSize } from '@/lib/canvas-utils';
import type { Translations } from '@/i18n';

const BG_COLORS = [
  '#f8fafc', '#e2e8f0', '#dbeafe', '#d1fae5', '#fef3c7', '#fce7f3',
  '#1e293b', '#0f172a', '#1e3a5f', '#14532d', '#451a03', '#4c1d95',
];

const GRADIENTS = [
  ['#667eea', '#764ba2'], ['#f093fb', '#f5576c'], ['#4facfe', '#00f2fe'],
  ['#43e97b', '#38f9d7'], ['#fa709a', '#fee140'], ['#a18cd1', '#fbc2eb'],
  ['#fccb90', '#d57eeb'], ['#e0c3fc', '#8ec5fc'], ['#f5576c', '#ffb199'],
];

export function ScreenshotBeautifier({ t }: { t?: Translations } = {}) {
  const [file, setFile] = useState<File | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [padding, setPadding] = useState(60);
  const [radius, setRadius] = useState(16);
  const [shadow, setShadow] = useState(20);
  const [bgIdx, setBgIdx] = useState(0);
  const [gradIdx, setGradIdx] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = useCallback((files: File[]) => {
    if (!files[0]) return;
    setFile(files[0]);
    setResultBlob(null);
  }, []);

  const apply = useCallback(async () => {
    if (!file || !canvasRef.current) return;
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = URL.createObjectURL(file);
    });
    const p = padding * 2;
    const canvas = canvasRef.current;
    canvas.width = img.naturalWidth + p;
    canvas.height = img.naturalHeight + p;
    const ctx = canvas.getContext('2d')!;
    const grad = GRADIENTS[gradIdx];

    // Background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, grad[0]);
    gradient.addColorStop(1, grad[1]);
    ctx.fillStyle = gradient;
    roundRect(ctx, 0, 0, canvas.width, canvas.height, radius);
    ctx.fill();

    // Shadow
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = shadow;
    ctx.shadowOffsetY = shadow / 4;

    // Screenshot with rounded corners
    roundRect(ctx, padding, padding, img.naturalWidth, img.naturalHeight, 8);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.clip();
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    ctx.drawImage(img, padding, padding);

    canvas.toBlob((b) => b && setResultBlob(b), 'image/png');
  }, [file, padding, radius, shadow, gradIdx]);

  return (
    <div className="space-y-6">
      {!file && <FileDropzone onFilesSelected={handleFile} multiple={false} />}
      {file && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">{file.name} · {formatFileSize(file.size)}</span>
            <button onClick={() => { setFile(null); setResultBlob(null); }} className="text-sm text-blue-600 hover:underline">{t?.tools.screenshotBeautify.changeImage ?? '← Change'}</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase">{t?.tools.screenshotBeautify.padding ?? 'Padding'}</label>
              <div className="flex items-center gap-2">
                <input type="range" min={10} max={150} value={padding} onChange={(e) => setPadding(Number(e.target.value))} className="flex-1 accent-blue-600" />
                <span className="text-xs font-mono w-10">{padding}px</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase">{t?.tools.screenshotBeautify.cornerRadius ?? 'Corner Radius'}</label>
              <div className="flex items-center gap-2">
                <input type="range" min={0} max={60} value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="flex-1 accent-blue-600" />
                <span className="text-xs font-mono w-10">{radius}px</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase">{t?.tools.screenshotBeautify.shadow ?? 'Shadow'}</label>
              <div className="flex items-center gap-2">
                <input type="range" min={0} max={60} value={shadow} onChange={(e) => setShadow(Number(e.target.value))} className="flex-1 accent-blue-600" />
                <span className="text-xs font-mono w-10">{shadow}px</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase">{t?.tools.screenshotBeautify.background ?? 'Background'}</label>
              <div className="flex flex-wrap gap-1">
                {GRADIENTS.map((g, i) => (
                  <button key={i} onClick={() => setGradIdx(i)}
                    className={`w-6 h-6 rounded-full border-2 transition-all ${i === gradIdx ? 'border-blue-500 scale-110' : 'border-transparent'}`}
                    style={{ background: `linear-gradient(135deg, ${g[0]}, ${g[1]})` }} />
                ))}
              </div>
            </div>
          </div>
          <button onClick={apply} className="px-6 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">{t?.tools.screenshotBeautify.beautifyBtn ?? 'Beautify'}</button>
          {resultBlob && <DownloadButton blob={resultBlob} filename={`beautified-${file.name.replace(/\\.[^.]+$/, '')}.png`} />}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </div>
  );
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x - r + w, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
