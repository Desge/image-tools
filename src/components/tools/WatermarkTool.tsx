'use client';

import { useState, useCallback } from 'react';
import { FileDropzone } from '@/components/ui/FileDropzone';
import { DownloadButton } from '@/components/ui/DownloadButton';
import { formatFileSize, type ImageFormat } from '@/lib/canvas-utils';
import JSZip from 'jszip';
import type { Translations } from '@/i18n';

const POSITIONS = [
  { label: 'Top Left', x: 0, y: 0 },
  { label: 'Top Center', x: 0.5, y: 0 },
  { label: 'Top Right', x: 1, y: 0 },
  { label: 'Center Left', x: 0, y: 0.5 },
  { label: 'Center', x: 0.5, y: 0.5 },
  { label: 'Center Right', x: 1, y: 0.5 },
  { label: 'Bottom Left', x: 0, y: 1 },
  { label: 'Bottom Center', x: 0.5, y: 1 },
  { label: 'Bottom Right', x: 1, y: 1 },
];

export function WatermarkTool({ t }: { t?: Translations } = {}) {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<{ blob: Blob; name: string }[]>([]);
  const [text, setText] = useState('© Watermark');
  const [opacity, setOpacity] = useState(40);
  const [fontSize, setFontSize] = useState(24);
  const [posIdx, setPosIdx] = useState(8);
  const [format, setFormat] = useState<ImageFormat>('image/png');
  const [tile, setTile] = useState(false);
  const [processing, setProcessing] = useState(false);

  const applyWatermark = useCallback(async () => {
    if (files.length === 0) return;
    setProcessing(true);
    const res: { blob: Blob; name: string }[] = [];

    for (const file of files) {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const i = new Image();
        i.onload = () => resolve(i);
        i.onerror = reject;
        i.src = URL.createObjectURL(file);
      });
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      ctx.globalAlpha = opacity / 100;

      const pos = POSITIONS[posIdx];
      const px = pos.x * canvas.width;
      const py = pos.y * canvas.height;

      if (tile) {
        const spacing = fontSize * 8;
        ctx.font = `${fontSize}px sans-serif`;
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = 'rgba(0,0,0,0.5)';
        ctx.lineWidth = 2;
        for (let y = -canvas.height; y < canvas.height * 2; y += spacing) {
          for (let x = -canvas.width; x < canvas.width * 2; x += spacing) {
            ctx.strokeText(text, x, y);
            ctx.fillText(text, x, y);
          }
        }
      } else {
        ctx.font = `${fontSize}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = 'rgba(0,0,0,0.5)';
        ctx.lineWidth = 2;
        ctx.strokeText(text, px, py);
        ctx.fillText(text, px, py);
      }

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), format, 0.92);
      });
      res.push({ blob, name: `wm-${file.name}` });
    }
    setResults(res);
    setProcessing(false);
  }, [files, text, opacity, fontSize, posIdx, tile, format]);

  const downloadAll = useCallback(async () => {
    const zip = new JSZip();
    results.forEach((r) => zip.file(r.name, r.blob));
    const z = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(z);
    const a = document.createElement('a');
    a.href = url; a.download = 'watermarked-images.zip';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [results]);

  return (
    <div className="space-y-6">
      {files.length === 0 && <FileDropzone onFilesSelected={setFiles} />}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{files.length} {t?.tools.watermark.imagesLoaded ?? 'image(s) loaded'}</span>
            <button onClick={() => { setFiles([]); setResults([]); }} className="text-sm text-blue-600 hover:underline">{t?.tools.watermark.clearAll ?? '← Clear'}</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase">{t?.tools.watermark.watermarkText ?? 'Watermark Text'}</label>
              <input value={text} onChange={(e) => setText(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase">{t?.tools.watermark.fontSizeLabel ?? 'Font Size'}</label>
              <input type="number" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full rounded-lg border px-3 py-2 text-sm" min={8} max={200} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase">{t?.tools.watermark.opacityLabel ?? 'Opacity'}</label>
              <div className="flex items-center gap-2">
                <input type="range" min={5} max={100} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="flex-1 accent-blue-600" />
                <span className="text-xs w-8">{opacity}%</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase">{t?.tools.watermark.positionLabel ?? 'Position'}</label>
              <select value={posIdx} onChange={(e) => setPosIdx(Number(e.target.value))} className="w-full rounded-lg border px-3 py-2 text-sm">
                {POSITIONS.map((p, i) => (<option key={i} value={i}>{p.label}</option>))}
              </select>
            </div>
            <div className="flex items-end gap-3">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={tile} onChange={(e) => setTile(e.target.checked)} className="accent-blue-600" />
                <span className="text-gray-700 dark:text-gray-300">{t?.tools.watermark.tileLabel ?? 'Tile'}</span>
              </label>
              <button onClick={applyWatermark} disabled={processing}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
                {processing ? (t?.tools.watermark.processing ?? 'Processing...') : (t?.tools.watermark.applyBtn ?? 'Apply')}
              </button>
            </div>
          </div>
          {results.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {results.map((r, i) => (
                <DownloadButton key={i} blob={r.blob} filename={r.name} label={`${t?.tools.watermark.downloadBtn ?? 'Download'} #${i + 1}`} />
              ))}
              {results.length > 1 && (
                <button onClick={downloadAll} className="px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700">{t?.tools.watermark.downloadAll ?? 'Download All (ZIP)'}</button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
