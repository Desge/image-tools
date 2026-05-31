'use client';

import type { Translations } from '@/i18n';

interface DownloadButtonProps {
  blob: Blob | null;
  filename: string;
  label?: string;
  disabled?: boolean;
  t?: Translations;
}

export function DownloadButton({ blob, filename, label, disabled = false, t }: DownloadButtonProps) {
  const resolvedLabel = label ?? t?.common.download ?? 'Download';
  const handleDownload = () => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleDownload}
      disabled={disabled || !blob}
      className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all
        ${blob && !disabled
          ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 dark:shadow-blue-900/40'
          : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
        }`}
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      {resolvedLabel}
    </button>
  );
}
