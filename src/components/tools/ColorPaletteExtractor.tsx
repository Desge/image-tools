'use client';

import { useState, useCallback } from 'react';
import { FileDropzone } from '@/components/ui/FileDropzone';
import { extractPalette, formatFileSize } from '@/lib/canvas-utils';
import type { Translations } from '@/i18n';

export function ColorPaletteExtractor({ t }: { t?: Translations } = {}) {
  const [file, setFile] = useState<File | null>(null);
  const [colors, setColors] = useState<{ hex: string; rgb: [number, number, number] }[]>([]);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);

  const handleFile = useCallback((files: File[]) => {
    if (!files[0]) return;
    setFile(files[0]);
    setColors([]);
    const url = URL.createObjectURL(files[0]);
    setImgUrl(url);
    const i = new Image();
    i.onload = () => {
      setImgEl(i);
      const palette = extractPalette(i, 8);
      setColors(palette);
    };
    i.src = url;
  }, []);

  const copyHex = (hex: string) => navigator.clipboard?.writeText(hex);
  const downloadPNG = useCallback(() => {
    if (colors.length === 0) return;
    const w = colors.length * 80;
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = 80;
    const ctx = canvas.getContext('2d')!;
    colors.forEach((c, i) => { ctx.fillStyle = c.hex; ctx.fillRect(i * 80, 0, 80, 80); });
    canvas.toBlob((b) => {
      if (!b) return;
      const url = URL.createObjectURL(b);
      const a = document.createElement('a'); a.href = url; a.download = 'palette.png';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }, [colors]);

  return (
    <div className="space-y-6">
      {!file && <FileDropzone onFilesSelected={handleFile} multiple={false} />}
      {file && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">{file.name} · {formatFileSize(file.size)}</span>
            <button onClick={() => { setFile(null); setColors([]); }} className="text-sm text-blue-600 hover:underline">{t?.tools.colorPalette.changeImage ?? '← Change'}</button>
          </div>
          {imgUrl && (
            <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 max-w-sm">
              <img src={imgUrl} alt="Source" className="w-full" />
            </div>
          )}
          {colors.length > 0 && (
            <div className="space-y-3">
              <div className="flex gap-1 rounded-xl overflow-hidden">
                {colors.map((c) => (
                  <div key={c.hex} className="flex-1 h-20" style={{ backgroundColor: c.hex }} title={c.hex} />
                ))}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {colors.map((c) => (
                  <button key={c.hex} onClick={() => copyHex(c.hex)}
                    className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm transition-colors">
                    <div className="w-5 h-5 rounded shadow-sm flex-shrink-0" style={{ backgroundColor: c.hex }} />
                    <span className="font-mono text-xs">{c.hex}</span>
                    <span className="text-xs text-gray-400 ml-auto">📋</span>
                  </button>
                ))}
              </div>
              <button onClick={downloadPNG} className="px-4 py-2 rounded-xl border text-sm hover:bg-gray-50 dark:hover:bg-gray-800">{t?.tools.colorPalette.downloadPalette ?? 'Download Palette (PNG)'}</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
