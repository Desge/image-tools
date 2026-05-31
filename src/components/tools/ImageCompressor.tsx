'use client';

import { useState, useCallback } from 'react';
import { FileDropzone } from '@/components/ui/FileDropzone';
import { ImagePreview } from '@/components/ui/ImagePreview';
import { DownloadButton } from '@/components/ui/DownloadButton';
import { compressImage, formatFileSize, type ImageFormat } from '@/lib/canvas-utils';
import type { Translations } from '@/i18n';

const FORMAT_OPTIONS: { value: ImageFormat; label: string; ext: string }[] = [
  { value: 'image/jpeg', label: 'JPG', ext: '.jpg' },
  { value: 'image/png', label: 'PNG', ext: '.png' },
  { value: 'image/webp', label: 'WebP', ext: '.webp' },
];

export function ImageCompressor({ t }: { t?: Translations } = {}) {
  const [files, setFiles] = useState<File[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [quality, setQuality] = useState(80);
  const [outputFormat, setOutputFormat] = useState<ImageFormat>('image/jpeg');
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultCanvas, setResultCanvas] = useState<HTMLCanvasElement | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [maxWidth, setMaxWidth] = useState(0);

  const currentFile = files[currentIdx] ?? null;

  const handleFiles = useCallback((newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
    setCurrentIdx(0);
    setResultBlob(null);
    setResultCanvas(null);
  }, []);

  const handleCompress = useCallback(async () => {
    if (!currentFile) return;
    setIsProcessing(true);
    try {
      const { blob, canvas } = await compressImage(
        currentFile,
        quality / 100,
        outputFormat,
        maxWidth || undefined
      );
      setResultBlob(blob);
      setResultCanvas(canvas);
    } catch (err) {
      console.error('Compression failed:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [currentFile, quality, outputFormat, maxWidth]);

  const savings = resultBlob && currentFile
    ? Math.round((1 - resultBlob.size / currentFile.size) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Upload zone */}
      {files.length === 0 && <FileDropzone onFilesSelected={handleFiles} />}

      {/* File list + control panel */}
      {files.length > 0 && (
        <div className="space-y-4">
          {/* File thumbnail navigation */}
          {files.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {files.map((f, i) => (
                <button
                  key={i}
                  onClick={() => { setCurrentIdx(i); setResultBlob(null); setResultCanvas(null); }}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden transition-all
                    ${i === currentIdx ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 dark:border-gray-700 opacity-60 hover:opacity-100'}`}
                >
                  <img
                    src={URL.createObjectURL(f)}
                    alt={f.name}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
              <label className="flex-shrink-0 w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors">
                <span className="text-2xl text-gray-400">+</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => {
                  const fs = Array.from(e.target.files || []).filter((f) => f.type.startsWith('image/'));
                  if (fs.length) handleFiles(fs);
                }} />
              </label>
            </div>
          )}

          {/* Current file info */}
          {currentFile && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">{currentFile.name}</span>
              <span className="mx-2">·</span>
              <span>{formatFileSize(currentFile.size)}</span>
            </div>
          )}

          {/* Upload different (single file mode) */}
          {files.length === 1 && (
            <button
              onClick={() => { setFiles([]); setResultBlob(null); setResultCanvas(null); }}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              {t?.tools.compress.uploadDifferent ?? '← Upload a different image'}
            </button>
          )}

          {/* Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            {/* Quality slider */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t?.tools.compress.qualityLabel ?? 'Quality'}</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="flex-1 accent-blue-600"
                />
                <span className="text-sm font-mono font-medium w-10 text-right">{quality}%</span>
              </div>
            </div>

            {/* Output format */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t?.tools.compress.formatLabel ?? 'Format'}</label>
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value as ImageFormat)}
                className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
              >
                {FORMAT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Max width */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t?.tools.compress.maxWidthLabel ?? 'Max Width (px)'}</label>
              <input
                type="number"
                placeholder={t?.tools.compress.maxWidthPlaceholder ?? 'Original'}
                value={maxWidth || ''}
                onChange={(e) => setMaxWidth(Number(e.target.value) || 0)}
                className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
              />
            </div>

            {/* Compress button */}
            <div className="flex items-end">
              <button
                onClick={handleCompress}
                disabled={isProcessing}
                className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-all"
              >
                {isProcessing ? (t?.tools.compress.compressing ?? 'Compressing...') : (t?.tools.compress.compressBtn ?? 'Compress')}
              </button>
            </div>
          </div>

          {/* Compression result stats */}
          {resultBlob && currentFile && (
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-medium">
                {savings}% {t?.tools.compress.smallerLabel ?? 'smaller'}
              </span>
              <span className="text-gray-500">
                {formatFileSize(currentFile.size)} → {formatFileSize(resultBlob.size)}
              </span>
              <DownloadButton blob={resultBlob} filename={`compressed-${currentFile.name.replace(/\\.[^.]+$/, '')}${FORMAT_OPTIONS.find((o) => o.value === outputFormat)?.ext ?? '.jpg'}`} />
            </div>
          )}
        </div>
      )}

      {/* Before/after comparison */}
      {currentFile && (
        <ImagePreview
          originalFile={currentFile}
          resultCanvas={resultCanvas}
          resultBlob={resultBlob}
        />
      )}
    </div>
  );
}
