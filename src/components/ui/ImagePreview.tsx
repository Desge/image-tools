'use client';

import { useState } from 'react';

interface ImagePreviewProps {
  originalFile: File | null;
  resultCanvas: HTMLCanvasElement | null;
  resultBlob: Blob | null;
}

export function ImagePreview({ originalFile, resultCanvas, resultBlob }: ImagePreviewProps) {
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);

  // 加载原图预览
  if (originalFile && !originalUrl) {
    const url = URL.createObjectURL(originalFile);
    setOriginalUrl(url);
  }

  if (!originalFile) return null;

  const resultUrl = resultCanvas?.toDataURL();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {/* 原图 */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-100 dark:bg-gray-800">
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Original</span>
          <span className="text-xs text-gray-500">{formatSize(originalFile.size)}</span>
        </div>
        <div className="p-4 flex items-center justify-center min-h-[200px]">
          {originalUrl && (
            <img
              src={originalUrl}
              alt="Original"
              className="max-h-[400px] max-w-full object-contain rounded"
            />
          )}
        </div>
      </div>

      {/* 结果 */}
      <div className="rounded-xl border border-blue-200 dark:border-blue-800 overflow-hidden bg-blue-50/50 dark:bg-blue-950/20">
        <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 border-b border-blue-200 dark:border-blue-800 flex justify-between items-center">
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Result</span>
          <span className="text-xs text-blue-600 dark:text-blue-400">
            {resultBlob ? formatSize(resultBlob.size) : 'Processing...'}
          </span>
        </div>
        <div className="p-4 flex items-center justify-center min-h-[200px]">
          {resultUrl && (
            <img
              src={resultUrl}
              alt="Result"
              className="max-h-[400px] max-w-full object-contain rounded"
            />
          )}
        </div>
      </div>
    </div>
  );
}

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}
