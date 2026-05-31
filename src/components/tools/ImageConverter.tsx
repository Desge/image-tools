'use client';

import { useState, useCallback } from 'react';
import { FileDropzone } from '@/components/ui/FileDropzone';
import { ImagePreview } from '@/components/ui/ImagePreview';
import { DownloadButton } from '@/components/ui/DownloadButton';
import { formatFileSize, type ImageFormat } from '@/lib/canvas-utils';
import type { Translations } from '@/i18n';

interface ImageConverterProps {
  fromFormat: string; // 'png', 'jpg', etc
  toFormat: string;
  t?: Translations | null;
}

const MIME_MAP: Record<string, ImageFormat> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  avif: 'image/avif',
  bmp: 'image/bmp',
};

export function ImageConverter({ fromFormat, toFormat, t }: ImageConverterProps) {
  const [file, setFile] = useState<File | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultCanvas, setResultCanvas] = useState<HTMLCanvasElement | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [quality, setQuality] = useState(92);

  const toMime = MIME_MAP[toFormat.toLowerCase()] || 'image/png';
  const toExt = `.${toFormat.toLowerCase()}`;

  const handleFiles = useCallback((files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setResultBlob(null);
      setResultCanvas(null);
    }
  }, []);

  const handleConvert = useCallback(async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
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

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error('Export failed'))),
          toMime,
          quality / 100
        );
      });

      setResultBlob(blob);
      setResultCanvas(canvas);
    } catch (err) {
      console.error('Conversion failed:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [file, toMime, quality]);

  return (
    <div className="space-y-6">
      {!file && (
        <FileDropzone
          onFilesSelected={handleFiles}
          multiple={false}
          t={t ?? undefined}
          label={t?.toolPage?.dropHere || `Drop a ${fromFormat.toUpperCase()} image here or click to browse`}
          hint={t?.toolPage?.dropHint || `Convert ${fromFormat.toUpperCase()} to ${toFormat.toUpperCase()} — 100% browser-side`}
        />
      )}

      {file && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">{file.name}</span>
              <span className="mx-2">·</span>
              <span>{formatFileSize(file.size)}</span>
            </div>
            <button
              onClick={() => { setFile(null); setResultBlob(null); setResultCanvas(null); }}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              {t?.toolPage?.uploadDifferent || '← Upload different image'}
            </button>
          </div>

          <div className="flex flex-wrap items-end gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            {toFormat === 'jpg' || toFormat === 'webp' || toFormat === 'avif' ? (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t?.toolPage?.quality || 'Quality'}</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={10}
                    max={100}
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="flex-1 accent-blue-600"
                  />
                  <span className="text-sm font-mono w-10 text-right">{quality}%</span>
                </div>
              </div>
            ) : null}

            <button
              onClick={handleConvert}
              disabled={isProcessing}
              className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-all"
            >
              {isProcessing ? (t?.toolPage?.compressBtn ? `${t.toolPage.compressBtn}...` : 'Converting...') : (t?.converter?.convertBtn ? `${t.converter.convertBtn} ${toFormat.toUpperCase()}` : `Convert to ${toFormat.toUpperCase()}`)}
            </button>
          </div>

          {resultBlob && (
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-medium">
                {toFormat.toUpperCase()}
              </span>
              <span className="text-gray-500">
                {formatFileSize(resultBlob.size)}
              </span>
              <DownloadButton
                blob={resultBlob}
                filename={`converted${toExt}`}
                t={t ?? undefined}
                label={t?.common?.downloadBtn ? `${t.common.downloadBtn} ${toFormat.toUpperCase()}` : `Download ${toFormat.toUpperCase()}`}
              />
            </div>
          )}
        </div>
      )}

      <ImagePreview
        originalFile={file}
        resultCanvas={resultCanvas}
        resultBlob={resultBlob}
      />
    </div>
  );
}
