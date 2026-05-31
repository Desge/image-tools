'use client';

import { useState, useCallback } from 'react';
import { FileDropzone } from '@/components/ui/FileDropzone';
import { formatFileSize } from '@/lib/canvas-utils';
import JSZip from 'jszip';
import type { Translations } from '@/i18n';

const SIZES = [16, 24, 32, 48, 64, 128, 180, 192, 256, 512];

export function FaviconGenerator({ t }: { t?: Translations } = {}) {
  const [file, setFile] = useState<File | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [results, setResults] = useState<{ size: number; dataUrl: string; blob: Blob }[]>([]);

  const handleFile = useCallback((files: File[]) => {
    if (!files[0]) return;
    setFile(files[0]);
    setResults([]);
    const i = new Image();
    i.onload = () => setImg(i);
    i.src = URL.createObjectURL(files[0]);
  }, []);

  const generateAll = useCallback(async () => {
    if (!img) return;
    const res: { size: number; dataUrl: string; blob: Blob }[] = [];
    // ICO: 16+32
    const icoCanvas = document.createElement('canvas');
    icoCanvas.width = 32; icoCanvas.height = 32;
    const icoCtx = icoCanvas.getContext('2d')!;
    icoCtx.drawImage(img, 0, 0, 32, 32);
    const icoBlob = await new Promise<Blob>((resolve) => icoCanvas.toBlob((b) => resolve(b!), 'image/png'));
    res.push({ size: 0, dataUrl: icoCanvas.toDataURL(), blob: icoBlob });

    for (const size of SIZES) {
      const canvas = document.createElement('canvas');
      canvas.width = size; canvas.height = size;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, size, size);
      const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), 'image/png'));
      res.push({ size, dataUrl: canvas.toDataURL(), blob });
    }
    setResults(res);
  }, [img]);

  const downloadAll = useCallback(async () => {
    const zip = new JSZip();
    results.forEach((r) => {
      const name = r.size === 0 ? 'favicon.ico' : `favicon-${r.size}x${r.size}.png`;
      zip.file(name, r.blob);
    });
    const z = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(z);
    const a = document.createElement('a'); a.href = url; a.download = 'favicon-pack.zip';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [results]);

  const htmlSnippet = results.length > 0
    ? `<link rel="icon" type="image/x-icon" href="/favicon.ico">\n<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">\n<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">\n<link rel="apple-touch-icon" sizes="180x180" href="/favicon-180x180.png">\n<link rel="manifest" href="/site.webmanifest">`
    : '';

  return (
    <div className="space-y-6">
      {!file && <FileDropzone onFilesSelected={handleFile} multiple={false} hint={t?.tools.faviconGenerator.dropHint ?? 'JPG, PNG, SVG — will be resized to square icons'} />}
      {file && img && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{file.name} · {formatFileSize(file.size)}</span>
            <button onClick={() => { setFile(null); setImg(null); setResults([]); }} className="text-sm text-blue-600 hover:underline">{t?.tools.faviconGenerator.changeImage ?? '← Change'}</button>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-lg overflow-hidden border">
              <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
            </div>
            <button onClick={generateAll} className="px-6 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">{t?.tools.faviconGenerator.generateAll ?? 'Generate All Sizes'}</button>
          </div>
          {results.length > 0 && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {results.filter((r) => r.size > 0).map((r) => (
                  <div key={r.size} className="flex flex-col items-center gap-1">
                    <img src={r.dataUrl} alt={`${r.size}x${r.size}`} className="border border-gray-200 dark:border-gray-700 rounded" style={{ width: 40, height: 40 }} />
                    <span className="text-[10px] text-gray-500">{r.size}px</span>
                  </div>
                ))}
              </div>
              {htmlSnippet && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t?.tools.faviconGenerator.htmlCode ?? 'HTML Code (copy-paste into <head>)'}</p>
                  <pre className="p-3 rounded-lg bg-gray-900 text-green-400 text-xs overflow-x-auto"><code>{htmlSnippet}</code></pre>
                </div>
              )}
              <button onClick={downloadAll} className="px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700">{t?.tools.faviconGenerator.downloadAll ?? 'Download All (ZIP)'}</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
