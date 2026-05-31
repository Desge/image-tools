'use client';

import { useState, useCallback } from 'react';
import { FileDropzone } from '@/components/ui/FileDropzone';
import { formatFileSize } from '@/lib/canvas-utils';
import type { Translations } from '@/i18n';

export function Base64Encoder({ t }: { t?: Translations } = {}) {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<{ name: string; original: number; base64: string; overhead: number; mime: string }[]>([]);

  const handleFiles = useCallback((newFiles: File[]) => {
    const res = newFiles.map((f) => {
      return new Promise<{ name: string; original: number; base64: string; overhead: number; mime: string }>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const b64 = reader.result as string;
          resolve({ name: f.name, original: f.size, base64: b64, overhead: Math.round((b64.length / f.size - 1) * 100), mime: f.type });
        };
        reader.readAsDataURL(f);
      });
    });
    Promise.all(res).then(setResults);
    setFiles(newFiles);
  }, []);

  const copyToClipboard = (text: string) => navigator.clipboard?.writeText(text);

  const cssSnippet = (r: typeof results[0]) => `background-image: url("${r.base64}");`;
  const htmlSnippet = (r: typeof results[0]) => `<img src="${r.base64}" alt="${r.name}" />`;

  return (
    <div className="space-y-6">
      <FileDropzone onFilesSelected={handleFiles} />
      {results.length > 0 && (
        <div className="space-y-4">
          {results.map((r, i) => (
            <div key={i} className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-sm">{r.name}</span>
                  <span className="mx-2 text-gray-400">·</span>
                  <span className="text-sm text-gray-500">{formatFileSize(r.original)}</span>
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300">
                    +{r.overhead}% {t?.tools.base64.overhead ?? 'overhead'}
                  </span>
                </div>
                <button onClick={() => copyToClipboard(r.base64)}
                  className="px-3 py-1 text-xs rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  {t?.tools.base64.copyDataUri ?? '📋 Copy Data URI'}
                </button>
              </div>
              <details className="text-xs">
                <summary className="cursor-pointer text-gray-500 hover:text-gray-700">{t?.tools.base64.viewSnippets ?? 'View code snippets'}</summary>
                <div className="mt-2 space-y-2">
                  <div>
                    <p className="text-gray-500 mb-1">{t?.tools.base64.htmlLabel ?? 'HTML:'}</p>
                    <pre className="p-2 rounded bg-gray-900 text-green-400 overflow-x-auto"><code>{htmlSnippet(r)}</code></pre>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">{t?.tools.base64.cssLabel ?? 'CSS:'}</p>
                    <pre className="p-2 rounded bg-gray-900 text-green-400 overflow-x-auto"><code>{cssSnippet(r)}</code></pre>
                  </div>
                </div>
              </details>
              <textarea value={r.base64.substring(0, 150) + '...'} readOnly
                className="w-full p-2 rounded bg-gray-50 dark:bg-gray-800 text-xs font-mono text-gray-400 resize-none border-0" rows={1} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
