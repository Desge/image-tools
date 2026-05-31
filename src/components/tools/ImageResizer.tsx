'use client';

import { useState, useCallback, useMemo } from 'react';
import { FileDropzone } from '@/components/ui/FileDropzone';
import { DownloadButton } from '@/components/ui/DownloadButton';
import { SIZE_PRESETS } from '@/data/formats';
import { resizeImage, formatFileSize, getExtension, type ImageFormat } from '@/lib/canvas-utils';
import type { Translations } from '@/i18n';

export function ImageResizer({ t }: { t?: Translations } = {}) {
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [lockAspect, setLockAspect] = useState(true);
  const [format, setFormat] = useState<ImageFormat>('image/png');
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultCanvas, setResultCanvas] = useState<HTMLCanvasElement | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);

  const formatOptions = useMemo<{ value: ImageFormat; label: string }[]>(() => [
    { value: 'image/png', label: 'PNG' },
    { value: 'image/jpeg', label: 'JPG' },
    { value: 'image/webp', label: 'WebP' },
  ], []);

  const handleResize = useCallback(async () => {
    if (!file) return;
    const { blob, canvas } = await resizeImage(file, width, height, lockAspect, format);
    setResultBlob(blob);
    setResultCanvas(canvas);
  }, [file, width, height, lockAspect, format]);

  const applyPreset = (w: number, h: number) => { setWidth(w); setHeight(h); };

  return (
    <div className="space-y-6">
      {!file && <FileDropzone onFilesSelected={(fs) => { setFile(fs[0]); if (fs[0]) setOriginalUrl(URL.createObjectURL(fs[0])); }} multiple={false} />}
      {file && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">{file.name} · {formatFileSize(file.size)}</span>
            <button onClick={() => { setFile(null); setResultBlob(null); }} className="text-sm text-blue-600 hover:underline">{t?.tools.resize.changeImage ?? '← Change'}</button>
          </div>

          {/* Preset size buttons */}
          <div className="flex flex-wrap gap-1.5">
            {SIZE_PRESETS.slice(0, 8).map((p) => (
              <button key={p.slug} onClick={() => applyPreset(p.width, p.height)}
                className="px-2.5 py-1 text-xs rounded-full border border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:text-blue-600 transition-colors">
                {p.label.split('(')[0].trim()}
              </button>
            ))}
          </div>

          {/* Dimension inputs */}
          <div className="flex items-center gap-3">
            <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))}
              className="w-28 rounded-lg border px-3 py-2 text-sm" placeholder={t?.tools.resize.widthLabel ?? 'Width'} />
            <button onClick={() => setLockAspect(!lockAspect)}
              className={`p-2 rounded-lg border transition-colors ${lockAspect ? 'bg-blue-50 border-blue-200 text-blue-600' : 'border-gray-200 text-gray-400'}`}
              title={lockAspect ? (t?.tools.resize.lockAspect ?? 'Aspect ratio locked') : (t?.tools.resize.lockAspectTitle ?? 'Aspect ratio unlocked')}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
            </button>
            <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))}
              className="w-28 rounded-lg border px-3 py-2 text-sm" placeholder={t?.tools.resize.heightLabel ?? 'Height'} />
            <span className="text-xs text-gray-400">px</span>
          </div>

          <div className="flex items-center gap-3">
            <select value={format} onChange={(e) => setFormat(e.target.value as ImageFormat)}
              className="rounded-lg border px-3 py-2 text-sm">
              {formatOptions.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            <button onClick={handleResize}
              className="px-6 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-all">{t?.tools.resize.resizeBtn ?? 'Resize'}</button>
            {resultBlob && <DownloadButton blob={resultBlob} filename={`resized-${file.name.replace(/\.[^.]+$/, '')}${getExtension(format)}`} />}
          </div>

          {resultBlob && (
            <p className="text-sm text-green-600 dark:text-green-400">
              {t?.tools.resize.resizedLabel ?? 'Resized'}: {formatFileSize(resultBlob.size)} ({width}×{height}px)
            </p>
          )}
        </div>
      )}
    </div>
  );
}
