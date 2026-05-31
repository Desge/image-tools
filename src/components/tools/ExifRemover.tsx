'use client';

import { useState, useCallback } from 'react';
import { FileDropzone } from '@/components/ui/FileDropzone';
import { DownloadButton } from '@/components/ui/DownloadButton';
import { formatFileSize } from '@/lib/canvas-utils';
import type { Translations } from '@/i18n';

export function ExifRemover({ t }: { t?: Translations } = {}) {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<{ blob: Blob; name: string; originalSize: number; newSize: number }[]>([]);
  const [exifInfo, setExifInfo] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);

  const handleFiles = useCallback((newFiles: File[]) => {
    setFiles(newFiles);
    setResults([]);
    // Read EXIF info (display only, no detailed parsing)
    const info = newFiles.map((f) => `${f.name}: ${formatFileSize(f.size)}`);
    setExifInfo(info);
  }, []);

  const stripExif = useCallback(async () => {
    if (files.length === 0) return;
    setProcessing(true);
    const res: typeof results = [];

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
      // Canvas export automatically strips EXIF (toBlob carries no metadata)
      const ext = file.name.split('.').pop()?.toLowerCase();
      const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
      const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), mime, 0.92));
      res.push({ blob, name: `clean-${file.name}`, originalSize: file.size, newSize: blob.size });
    }
    setResults(res);
    setProcessing(false);
  }, [files]);

  return (
    <div className="space-y-6">
      {files.length === 0 && <FileDropzone onFilesSelected={handleFiles} />}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">{files.length} image(s)</span>
            <button onClick={() => { setFiles([]); setResults([]); }} className="text-sm text-blue-600 hover:underline">{t?.tools.removeExif.clearAll ?? '← Clear'}</button>
          </div>
          <div className="space-y-2">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-3 text-sm p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <span className="w-6 h-6 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs">🖼</span>
                <span className="flex-1 truncate">{f.name}</span>
                <span className="text-gray-500">{formatFileSize(f.size)}</span>
              </div>
            ))}
          </div>
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-sm text-blue-700 dark:text-blue-300">
            <p className="font-medium">{t?.tools.removeExif.howItWorks ?? '🔒 How it works'}</p>
            <p className="mt-1">{t?.tools.removeExif.howItWorksDesc ?? 'When you click "Remove EXIF", each image is redrawn on a Canvas. The browser\'s Canvas export (toBlob) automatically strips all metadata — GPS location, camera model, timestamp, and more. The pixel data stays identical.'}</p>
          </div>
          <button onClick={stripExif} disabled={processing}
            className="px-6 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
            {processing
              ? (t?.tools.removeExif.processing ?? 'Processing...')
              : (files.length === 1
                ? (t?.tools.removeExif.removeBtn ?? 'Remove EXIF')
                : (t?.tools.removeExif.removeBtnMultiple ?? 'Remove EXIF from All'))
            }
          </button>
          {results.length > 0 && (
            <div className="space-y-2">
              {results.map((r, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <span className="text-green-600">✅</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-700 dark:text-green-300">{r.name}</p>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      {formatFileSize(r.originalSize)} → {formatFileSize(r.newSize)}
                      {r.originalSize > r.newSize && (
                        <span className="ml-2">(-{Math.round((1 - r.newSize / r.originalSize) * 100)}%)</span>
                      )}
                    </p>
                  </div>
                  <DownloadButton blob={r.blob} filename={r.name} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
