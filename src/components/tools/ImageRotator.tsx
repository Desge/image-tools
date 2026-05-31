'use client';

import { useState, useCallback, useMemo } from 'react';
import { FileDropzone } from '@/components/ui/FileDropzone';
import { DownloadButton } from '@/components/ui/DownloadButton';
import { rotateImage, flipImage, formatFileSize, getExtension, type ImageFormat } from '@/lib/canvas-utils';
import type { Translations } from '@/i18n';

export function ImageRotator({ t }: { t?: Translations } = {}) {
  const [file, setFile] = useState<File | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultCanvas, setResultCanvas] = useState<HTMLCanvasElement | null>(null);
  const [format, setFormat] = useState<ImageFormat>('image/png');

  const formatOptions = useMemo<{ value: ImageFormat; label: string }[]>(() => [
    { value: 'image/png', label: 'PNG' },
    { value: 'image/jpeg', label: 'JPG' },
    { value: 'image/webp', label: 'WebP' },
  ], []);

  const handleRotate = useCallback(async (angle: 90 | 180 | 270) => {
    if (!file) return;
    const { blob, canvas } = await rotateImage(file, angle, format);
    setResultBlob(blob);
    setResultCanvas(canvas);
  }, [file, format]);

  const handleFlip = useCallback(async (dir: 'horizontal' | 'vertical') => {
    if (!file) return;
    const { blob, canvas } = await flipImage(file, dir, format);
    setResultBlob(blob);
    setResultCanvas(canvas);
  }, [file, format]);

  return (
    <div className="space-y-6">
      {!file && <FileDropzone onFilesSelected={(fs) => { setFile(fs[0]); setResultBlob(null); }} multiple={false} />}
      {file && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">{file.name} · {formatFileSize(file.size)}</span>
            <button onClick={() => { setFile(null); setResultBlob(null); }} className="text-sm text-blue-600 hover:underline">{t?.tools.rotate.changeImage ?? '← Change'}</button>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => handleRotate(90)} className="px-4 py-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 text-sm" title={t?.tools.rotate.rotate90 ?? '↻ 90°'}>{t?.tools.rotate.rotate90 ?? '↻ 90°'}</button>
            <button onClick={() => handleRotate(180)} className="px-4 py-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 text-sm">{t?.tools.rotate.rotate180 ?? '↻ 180°'}</button>
            <button onClick={() => handleRotate(270)} className="px-4 py-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 text-sm">{t?.tools.rotate.rotate270 ?? '↻ 270°'}</button>
            <span className="mx-2 border-l border-gray-200 dark:border-gray-700" />
            <button onClick={() => handleFlip('horizontal')} className="px-4 py-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 text-sm">{t?.tools.rotate.flipH ?? '↔ Flip H'}</button>
            <button onClick={() => handleFlip('vertical')} className="px-4 py-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 text-sm">{t?.tools.rotate.flipV ?? '↕ Flip V'}</button>
          </div>
          <div className="flex items-center gap-3">
            <select value={format} onChange={(e) => setFormat(e.target.value as ImageFormat)}
              className="rounded-lg border px-3 py-2 text-sm">{formatOptions.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}</select>
            {resultBlob && <DownloadButton blob={resultBlob} filename={`rotated-${file.name.replace(/\.[^.]+$/, '')}${getExtension(format)}`} />}
          </div>
          {resultCanvas && (
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 p-4 flex justify-center">
              <img src={resultCanvas.toDataURL()} alt="Result" className="max-h-96 max-w-full rounded" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
