'use client';

import { useCallback, useState, type DragEvent } from 'react';
import type { Translations } from '@/i18n';

interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  label?: string;
  hint?: string;
  t?: Translations;
}

export function FileDropzone({
  onFilesSelected,
  accept = 'image/*',
  multiple = true,
  label,
  hint,
  t,
}: FileDropzoneProps) {
  const resolvedLabel = label ?? t?.toolPage.dropHere ?? 'Drop images here or click to browse';
  const resolvedHint = hint ?? t?.toolPage.dropHint ?? 'JPG, PNG, WebP, AVIF, HEIC — up to 50MB each';
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
      if (files.length) onFilesSelected(files);
    },
    [onFilesSelected]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length) onFilesSelected(files);
    },
    [onFilesSelected]
  );

  return (
    <div
      className={`relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200
        ${isDragging
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 scale-[1.01]'
          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-gray-50 dark:bg-gray-800/50'
        }`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => document.getElementById('file-input')?.click()}
    >
      <input
        id="file-input"
        type="file"
        className="hidden"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
      />
      <div className="flex flex-col items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
          <svg className="w-7 h-7 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-base font-medium text-gray-700 dark:text-gray-200">{resolvedLabel}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{resolvedHint}</p>
      </div>
    </div>
  );
}
